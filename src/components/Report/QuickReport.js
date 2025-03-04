import React, { useState, useCallback } from 'react';
import { 
  AlertTriangle,
  Camera,
  MapPin,
  Send,
  X,
  Loader
} from 'lucide-react';
import useReport from '../../hooks/useReport';
import useLocation from '../../hooks/useLocation';
import PhotoCapture from '../alert/PhotoCapture';
import LocationPicker from '../alert/LocationPicker';
import SuccessAnimation from '../alert/SuccessAnimation';
import { REPORT_TYPES } from '../../constants';

const QuickReport = ({ onClose }) => {
  const { submitReport } = useReport();
  const { currentLocation } = useLocation();

  // Report state
  const [step, setStep] = useState('type');
  const [report, setReport] = useState({
    type: null,
    photos: [],
    location: currentLocation,
    description: '',
    severity: 'medium',
    anonymous: false
  });

  // UI state
  const [showCamera, setShowCamera] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Handle report submission
  const handleSubmit = useCallback(async () => {
    try {
      setSubmitting(true);
      setError(null);

      // Validate report
      if (!report.type) {
        throw new Error('Please select an incident type');
      }
      if (!report.location) {
        throw new Error('Location is required');
      }

      // Submit report
      await submitReport(report);
      setSuccess(true);

      // Close after delay
      setTimeout(() => {
        onClose?.();
      }, 2000);
    } catch (err) {
      setError(err.message);
      console.error('Error submitting report:', err);
    } finally {
      setSubmitting(false);
    }
  }, [report, submitReport, onClose]);

  // Handle photo capture
  const handlePhotoCapture = useCallback((photo) => {
    setReport(prev => ({
      ...prev,
      photos: [...prev.photos, photo]
    }));
    setShowCamera(false);
    setStep('location');
  }, []);

  // Handle location selection
  const handleLocationSelect = useCallback((location) => {
    setReport(prev => ({
      ...prev,
      location
    }));
    setShowLocationPicker(false);
    setStep('confirm');
  }, []);

  // Render success state
  if (success) {
    return (
      <SuccessAnimation
        message="Report Submitted"
        subMessage="Thank you for helping protect our environment"
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50">
      {/* Header */}
      <div className="fixed top-0 inset-x-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-10">
        <div className="h-16 flex items-center justify-between px-4">
          <button
            onClick={onClose}
            className="p-2 -ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            Quick Report
          </h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16 pb-20">
        {step === 'type' && (
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              What would you like to report?
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {REPORT_TYPES.map(type => (
                <button
                  key={type.id}
                  onClick={() => {
                    setReport(prev => ({ ...prev, type: type.id }));
                    setStep('photo');
                  }}
                  className={"flex flex-col items-center p-6 rounded-xl border transition-colors " + 
                    (report.type === type.id
                      ? type.color + " text-white border-transparent"
                      : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700"
                    )}
                >
                  <type.icon className="w-8 h-8 mb-3" />
                  <span className="font-medium">{type.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'photo' && (
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Add a photo
            </h2>
            <button
              onClick={() => setShowCamera(true)}
              className="w-full aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center gap-2 text-gray-500 dark:text-gray-400"
            >
              <Camera className="w-8 h-8" />
              <span>Take a photo</span>
            </button>
          </div>
        )}

        {step === 'location' && (
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Confirm location
            </h2>
            <button
              onClick={() => setShowLocationPicker(true)}
              className="w-full p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center gap-3"
            >
              <MapPin className="w-6 h-6 text-gray-400" />
              <div className="flex-1 text-left">
                <p className="text-gray-900 dark:text-white">
                  {report.location?.address || 'Select location'}
                </p>
                {report.location && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {report.location.lat.toFixed(6)}, 
                    {report.location.lng.toFixed(6)}
                  </p>
                )}
              </div>
            </button>
          </div>
        )}

        {step === 'confirm' && (
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Confirm report
            </h2>
            <div className="space-y-4">
              {/* Preview content */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-start gap-3">
                  {report.type && (
                    <div className={"p-2 rounded-lg " + REPORT_TYPES.find(t => t.id === report.type)?.color}>
                      <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {REPORT_TYPES.find(t => t.id === report.type)?.label}
                    </p>
                    {report.location?.address && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {report.location.address}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 inset-x-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}
        <button
          onClick={step === 'confirm' ? handleSubmit : null}
          disabled={submitting}
          className="w-full h-12 bg-emerald-500 text-white rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {submitting ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Submit Report</span>
            </>
          )}
        </button>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <PhotoCapture
          onCapture={handlePhotoCapture}
          onClose={() => setShowCamera(false)}
        />
      )}

      {/* Location Picker Modal */}
      {showLocationPicker && (
        <LocationPicker
          onSelect={handleLocationSelect}
          onClose={() => setShowLocationPicker(false)}
          initialLocation={report.location}
        />
      )}
    </div>
  );
};

export default QuickReport;
