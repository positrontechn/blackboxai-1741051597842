import React, { useState, useRef } from 'react';
import { 
  Camera,
  RotateCw,
  X,
  ZoomIn,
  ZoomOut,
  Sun,
  Zap,
  Image as ImageIcon
} from 'lucide-react';
import useMedia from '../../hooks/useMedia';
import { MEDIA_CONFIG } from '../../constants';

const PhotoCapture = ({
  onCapture,
  onClose,
  maxPhotos = MEDIA_CONFIG.image.maxCount,
  className = ''
}) => {
  // Media hook
  const {
    devices,
    capabilities,
    error,
    processing,
    videoRef,
    settings,
    switchCamera,
    takePhoto,
    handleFileSelect,
    updateSettings,
    canCapture
  } = useMedia({ autoStart: true });

  // UI State
  const [showControls, setShowControls] = useState(true);
  const fileInputRef = useRef(null);

  // Handle camera switch
  const handleCameraSwitch = async () => {
    const nextDevice = devices.find(d => 
      d.deviceId !== videoRef.current?.srcObject?.getVideoTracks()[0]?.getSettings()?.deviceId
    );
    if (nextDevice) {
      await switchCamera(nextDevice.deviceId);
    }
  };

  // Handle photo capture
  const handleCapture = async () => {
    try {
      const photo = await takePhoto();
      onCapture?.(photo);
    } catch (error) {
      console.error('Error capturing photo:', error);
    }
  };

  // Handle file input
  const handleFileInput = async (event) => {
    try {
      const photo = await handleFileSelect(event);
      onCapture?.(photo);
    } catch (error) {
      console.error('Error selecting file:', error);
    }
  };

  // Handle zoom change
  const handleZoomChange = (delta) => {
    if (!capabilities?.zoom) return;
    const { min = 1, max = 10 } = capabilities.zoom;
    const newZoom = Math.min(max, Math.max(min, settings.zoom + delta));
    updateSettings({ zoom: newZoom });
  };

  // Handle torch toggle
  const handleTorchToggle = () => {
    if (!capabilities?.torch) return;
    updateSettings({ torch: !settings.torch });
  };

  // Handle brightness change
  const handleBrightnessChange = (delta) => {
    if (!capabilities?.brightness) return;
    const { min = -1, max = 1 } = capabilities.brightness;
    const newBrightness = Math.min(max, Math.max(min, settings.brightness + delta));
    updateSettings({ brightness: newBrightness });
  };

  return (
    <div className={"fixed inset-0 bg-black z-50 " + className}>
      {/* Camera View */}
      <div className="relative h-full">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
          onClick={() => setShowControls(!showControls)}
        />

        {/* Loading State */}
        {processing && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent" />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="absolute inset-x-0 top-16 mx-4">
            <div className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          </div>
        )}

        {/* Controls */}
        {showControls && (
          <>
            {/* Top Controls */}
            <div className="absolute inset-x-0 top-0 p-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={onClose}
                  className="p-2 text-white hover:bg-white/10 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="flex items-center gap-4">
                  {capabilities?.torch && (
                    <button
                      onClick={handleTorchToggle}
                      className={"p-2 rounded-full " + 
                        (settings.torch ? "bg-yellow-500" : "text-white hover:bg-white/10")}
                    >
                      <Zap className="w-6 h-6" />
                    </button>
                  )}

                  {devices.length > 1 && (
                    <button
                      onClick={handleCameraSwitch}
                      className="p-2 text-white hover:bg-white/10 rounded-full"
                    >
                      <RotateCw className="w-6 h-6" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Side Controls */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 space-y-4">
              {capabilities?.zoom && (
                <>
                  <button
                    onClick={() => handleZoomChange(0.5)}
                    className="p-2 text-white hover:bg-white/10 rounded-full"
                  >
                    <ZoomIn className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => handleZoomChange(-0.5)}
                    className="p-2 text-white hover:bg-white/10 rounded-full"
                  >
                    <ZoomOut className="w-6 h-6" />
                  </button>
                </>
              )}

              {capabilities?.brightness && (
                <>
                  <button
                    onClick={() => handleBrightnessChange(0.1)}
                    className="p-2 text-white hover:bg-white/10 rounded-full"
                  >
                    <Sun className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => handleBrightnessChange(-0.1)}
                    className="p-2 text-white/50 hover:bg-white/10 rounded-full"
                  >
                    <Sun className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom Controls */}
            <div className="absolute inset-x-0 bottom-0 p-8">
              <div className="flex items-center justify-between">
                {/* File Input */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-4 text-white hover:bg-white/10 rounded-full"
                >
                  <ImageIcon className="w-6 h-6" />
                </button>

                {/* Capture Button */}
                <button
                  onClick={handleCapture}
                  disabled={!canCapture}
                  className="w-16 h-16 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 disabled:opacity-50"
                >
                  <Camera className="w-8 h-8 text-black" />
                </button>

                {/* Spacer */}
                <div className="w-14" />
              </div>
            </div>
          </>
        )}

        {/* File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default PhotoCapture;
