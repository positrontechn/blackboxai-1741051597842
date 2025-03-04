import React from 'react';
import { 
  MapPin,
  Calendar,
  User,
  Shield,
  Share2,
  Flag,
  Download,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { REPORT_TYPES } from '../../constants';
import { formatDate, formatDistance } from '../../utils/helpers';
import useLocation from '../../hooks/useLocation';

const IncidentDetails = ({
  incident,
  onNavigate,
  onShare,
  onReport,
  className = ''
}) => {
  const { currentLocation } = useLocation();
  const [currentPhotoIndex, setCurrentPhotoIndex] = React.useState(0);

  // Get incident type
  const type = REPORT_TYPES.find(t => t.id === incident.type);
  if (!type) return null;

  // Handle photo navigation
  const handlePrevPhoto = () => {
    setCurrentPhotoIndex(prev => 
      prev === 0 ? incident.photos.length - 1 : prev - 1
    );
  };

  const handleNextPhoto = () => {
    setCurrentPhotoIndex(prev => 
      prev === incident.photos.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className={"bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden " + className}>
      {/* Photos */}
      {incident.photos?.length > 0 && (
        <div className="relative aspect-video bg-gray-100 dark:bg-gray-900">
          <img
            src={incident.photos[currentPhotoIndex].url}
            alt={`Photo ${currentPhotoIndex + 1}`}
            className="w-full h-full object-cover"
          />

          {/* Photo Navigation */}
          {incident.photos.length > 1 && (
            <>
              <button
                onClick={handlePrevPhoto}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1 bg-black/50 hover:bg-black/75 rounded-full text-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextPhoto}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-black/50 hover:bg-black/75 rounded-full text-white"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1">
                {incident.photos.map((_, index) => (
                  <div
                    key={index}
                    className={"w-1.5 h-1.5 rounded-full " + 
                      (index === currentPhotoIndex
                        ? "bg-white"
                        : "bg-white/50"
                      )}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className={"p-2 rounded-lg " + type.color}>
            <type.icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {type.label}
              </h2>
              {incident.verified && (
                <Shield className="w-4 h-4 text-emerald-500" />
              )}
            </div>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              {incident.description}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3">
          {/* Location */}
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <p className="text-sm text-gray-900 dark:text-white">
                {incident.location.address}
              </p>
              {currentLocation && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDistance(currentLocation, incident.location)} away
                </p>
              )}
            </div>
            <button
              onClick={() => onNavigate?.(incident.location)}
              className="p-2 text-emerald-600 dark:text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          {/* Date */}
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <p className="text-sm text-gray-900 dark:text-white">
              {formatDate(incident.timestamp)}
            </p>
          </div>

          {/* Reporter */}
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-gray-400" />
            <p className="text-sm text-gray-900 dark:text-white">
              {incident.anonymous ? 'Anonymous' : incident.reporter?.name}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-2 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onShare}
            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
          <button
            onClick={onReport}
            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <Flag className="w-4 h-4" />
            <span>Report Issue</span>
          </button>
          {incident.photos?.length > 0 && (
            <button
              onClick={() => {/* Handle download */}}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <Download className="w-4 h-4" />
              <span>Download Photos</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncidentDetails;
