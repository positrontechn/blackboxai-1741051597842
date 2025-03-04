import React, { useState, useCallback } from 'react';
import { 
  Camera,
  MapPin,
  AlertTriangle,
  Send,
  X,
  Plus,
  Trash2,
  Loader,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react';
import useReport from '../../hooks/useReport';
import useLocation from '../../hooks/useLocation';
import { REPORT_TYPES, VALIDATION_RULES } from '../../constants';
import PhotoCapture from '../alert/PhotoCapture';
import LocationPicker from '../alert/LocationPicker';
import SuccessAnimation from '../alert/SuccessAnimation';

const ReportForm = ({ 
  initialData = null,
  onSubmit,
  onClose,
  className = ''
}) => {
  const { submitReport, updateReport } = useReport();
  const { currentLocation } = useLocation();

  // Form state
  const [formData, setFormData] = useState({
    type: initialData?.type || REPORT_TYPES[0].id,
    description: initialData?.description || '',
    location: initialData?.location || currentLocation,
    photos: initialData?.photos || [],
    severity: initialData?.severity || 'medium',
    anonymous: initialData?.anonymous || false
  });

  // UI state
  const [showCamera, setShowCamera] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Validate form
  const validateForm = useCallback(() => {
    const newErrors = {};

    // Type validation
    if (!formData.type) {
      newErrors.type = 'Please select an incident type';
    }

    // Description validation
    if (!formData.description) {
      newErrors.description = 'Please provide a description';
    } else if (formData.description.length < VALIDATION_RULES.report.description.minLength) {
      newErrors.description = `Description must be at least ${VALIDATION_RULES.report.description.minLength} characters`;
    }

    // Location validation
    if (!formData.location) {
      newErrors.location = 'Please select a location';
    }

    // Photo validation
    const type = REPORT_TYPES.find(t => t.id === formData.type);
    if (type?.requiresPhoto && formData.photos.length === 0) {
      newErrors.photos = 'Please add at least one photo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    e?.preventDefault();

    if (!validateForm()) {
      setTouched(Object.keys(formData).reduce((acc, key) => ({
        ...acc,
        [key]: true
      }), {}));
      return;
    }

    try {
      setSubmitting(true);
      setErrors({});

      if (initialData) {
        await updateReport(initialData.id, formData);
      } else {
        await submitReport(formData);
      }

      setSuccess(true);
      onSubmit?.(formData);

      // Close after delay
      setTimeout(() => {
        onClose?.();
      }, 2000);
    } catch (err) {
      setErrors({ submit: err.message });
      console.error('Error submitting report:', err);
    } finally {
      setSubmitting(false);
    }
  }, [formData, initialData, validateForm, submitReport, updateReport, onSubmit, onClose]);

  // Handle photo capture
  const handlePhotoCapture = useCallback((photo) => {
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, photo]
    }));
    setShowCamera(false);
  }, []);

  // Handle photo removal
  const handlePhotoRemove = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  }, []);

  // Handle location selection
  const handleLocationSelect = useCallback((location) => {
    setFormData(prev => ({
      ...prev,
      location
    }));
    setShowLocationPicker(false);
  }, []);

  // Render success state
  if (success) {
    return (
      <SuccessAnimation
        message={initialData ? 'Report Updated' : 'Report Submitted'}
        subMessage="Thank you for helping protect our environment"
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className={"min-h-screen bg-gray-50 dark:bg-gray-900 " + className}>
      {/* Header */}
      <div className="fixed top-0 inset-x-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-10">
        <div className="h-16 flex items-center justify-between px-4">
          <button
            type="button"
            onClick={onClose}
            className="p-2 -ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            {initialData ? 'Edit Report' : 'New Report'}
          </h1>
          <button
            type="submit"
            disabled={submitting}
            className="p-2 text-emerald-600 dark:text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 disabled:opacity-50"
          >
            {submitting ? (
              <Loader className="w-6 h-6 animate-spin" />
            ) : (
              <Send className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="pt-16 pb-4 p-4 space-y-6">
        {/* Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Incident Type
          </label>
          <div className="grid grid-cols-2 gap-4">
            {REPORT_TYPES.map(type => (
              <button
                key={type.id}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: type.id }))}
                className={"flex flex-col items-center p-4 rounded-xl border transition-colors " + 
                  (formData.type === type.id
                    ? type.color + " text-white border-transparent"
                    : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700"
                  )}
              >
                <type.icon className="w-6 h-6 mb-2" />
                <span className="font-medium">{type.label}</span>
              </button>
            ))}
          </div>
          {touched.type && errors.type && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-500">
              {errors.type}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <div className="relative">
            <textarea
              value={formData.description}
              onChange={e => setFormData(prev => ({
                ...prev,
                description: e.target.value
              }))}
              onBlur={() => setTouched(prev => ({ ...prev, description: true }))}
              placeholder="Describe what you observed..."
              rows={showFullDescription ? 8 : 4}
              className={"w-full px-4 py-3 bg-white dark:bg-gray-800 rounded-xl border transition-colors " + 
                (touched.description && errors.description
                  ? "border-red-500"
                  : "border-gray-200 dark:border-gray-700"
                )}
            />
            <button
              type="button"
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="absolute right-2 bottom-2 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              {showFullDescription ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {touched.description && errors.description && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-500">
              {errors.description}
            </p>
          )}
        </div>

        {/* Photos */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Photos
            </label>
            <button
              type="button"
              onClick={() => setShowCamera(true)}
              disabled={formData.photos.length >= VALIDATION_RULES.report.photos.maxCount}
              className="text-sm text-emerald-600 dark:text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 disabled:opacity-50"
            >
              Add Photo
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {formData.photos.map((photo, index) => (
              <div key={index} className="relative aspect-square">
                <img
                  src={photo.url}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handlePhotoRemove(index)}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {formData.photos.length < VALIDATION_RULES.report.photos.maxCount && (
              <button
                type="button"
                onClick={() => setShowCamera(true)}
                className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center gap-1 text-gray-500 dark:text-gray-400"
              >
                <Plus className="w-6 h-6" />
                <span className="text-xs">Add Photo</span>
              </button>
            )}
          </div>
          {touched.photos && errors.photos && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-500">
              {errors.photos}
            </p>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Location
          </label>
          <button
            type="button"
            onClick={() => setShowLocationPicker(true)}
            className={"w-full p-4 rounded-xl border transition-colors " + 
              (touched.location && errors.location
                ? "border-red-500"
                : "border-gray-200 dark:border-gray-700"
              ) + " bg-white dark:bg-gray-800 flex items-center gap-3"}
          >
            <MapPin className="w-6 h-6 text-gray-400" />
            <div className="flex-1 text-left">
              <p className="text-gray-900 dark:text-white">
                {formData.location?.address || 'Select location'}
              </p>
              {formData.location && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formData.location.lat.toFixed(6)}, 
                  {formData.location.lng.toFixed(6)}
                </p>
              )}
            </div>
          </button>
          {touched.location && errors.location && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-500">
              {errors.location}
            </p>
          )}
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.submit}
            </p>
          </div>
        )}
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <PhotoCapture
          onCapture={handlePhotoCapture}
          onClose={() => setShowCamera(false)}
          maxPhotos={VALIDATION_RULES.report.photos.maxCount - formData.photos.length}
        />
      )}

      {/* Location Picker Modal */}
      {showLocationPicker && (
        <LocationPicker
          onSelect={handleLocationSelect}
          onClose={() => setShowLocationPicker(false)}
          initialLocation={formData.location}
        />
      )}
    </form>
  );
};

export default ReportForm;
