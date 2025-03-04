import { useState, useEffect, useCallback } from 'react';
import mediaService from '../services/media/mediaService';
import { MEDIA_CONFIG, ERROR_MESSAGES } from '../constants';
import { validateFile } from '../utils/helpers';

const useMedia = (options = {}) => {
  // State
  const [devices, setDevices] = useState([]);
  const [activeDevice, setActiveDevice] = useState(null);
  const [capabilities, setCapabilities] = useState(null);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [stream, setStream] = useState(null);
  const [settings, setSettings] = useState({
    zoom: 1,
    torch: false,
    brightness: 0
  });

  // Initialize media service
  useEffect(() => {
    const init = async () => {
      try {
        await mediaService.initialize();
        
        // Start camera if autoStart is enabled
        if (options.autoStart) {
          await startCamera();
        }
      } catch (err) {
        setError(err.message);
        console.error('Error initializing media:', err);
      }
    };

    init();

    // Subscribe to media updates
    mediaService.addListener(handleMediaUpdate);
    return () => {
      mediaService.removeListener(handleMediaUpdate);
      stopCamera();
    };
  }, [options.autoStart]);

  // Handle media updates
  const handleMediaUpdate = useCallback((state) => {
    setDevices(state.devices);
    setActiveDevice(state.activeDevice);
    setCapabilities(state.capabilities);
    setProcessing(state.processing);
  }, []);

  // Start camera
  const startCamera = useCallback(async (constraints = {}) => {
    try {
      setError(null);
      const newStream = await mediaService.initializeCamera(constraints);
      setStream(newStream);
      return newStream;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (stream) {
      mediaService.stopCamera(stream);
      setStream(null);
    }
  }, [stream]);

  // Switch camera
  const switchCamera = useCallback(async (deviceId) => {
    try {
      setError(null);
      await startCamera({ deviceId });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [startCamera]);

  // Take photo
  const takePhoto = useCallback(async (videoElement) => {
    try {
      setError(null);
      if (!videoElement) {
        throw new Error('Video element not provided');
      }
      return await mediaService.takePhoto(videoElement);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Handle file selection
  const handleFileSelect = useCallback(async (fileOrEvent) => {
    try {
      setError(null);
      const file = fileOrEvent instanceof File ? 
        fileOrEvent : 
        fileOrEvent.target.files?.[0];

      if (!file) {
        throw new Error('No file selected');
      }

      // Validate file
      if (!validateFile(file, MEDIA_CONFIG.image)) {
        throw new Error(ERROR_MESSAGES.media.type);
      }

      return await mediaService.processPhoto(file);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Update camera settings
  const updateSettings = useCallback(async (newSettings) => {
    try {
      if (!stream) return;

      const track = stream.getVideoTracks()[0];
      if (!track) return;

      // Apply constraints
      const constraints = {};

      if ('zoom' in newSettings && capabilities?.zoom) {
        constraints.zoom = newSettings.zoom;
      }
      if ('torch' in newSettings && capabilities?.torch) {
        constraints.torch = newSettings.torch;
      }
      if ('brightness' in newSettings && capabilities?.brightness) {
        constraints.brightness = newSettings.brightness;
      }

      await track.applyConstraints({ advanced: [constraints] });
      setSettings(prev => ({ ...prev, ...newSettings }));
    } catch (err) {
      setError(err.message);
      console.error('Error updating camera settings:', err);
    }
  }, [stream, capabilities]);

  // Get preferred device
  const getPreferredDevice = useCallback(() => {
    // Try to get saved preference
    const savedId = localStorage.getItem('preferredCamera');
    if (savedId) {
      const device = devices.find(d => d.deviceId === savedId);
      if (device) return device;
    }

    // Try to get back camera
    const backCamera = devices.find(
      d => d.label.toLowerCase().includes('back') || 
           d.facing === 'environment'
    );
    if (backCamera) return backCamera;

    // Fallback to first available device
    return devices[0];
  }, [devices]);

  // Set preferred device
  const setPreferredDevice = useCallback((deviceId) => {
    localStorage.setItem('preferredCamera', deviceId);
  }, []);

  return {
    // State
    devices,
    activeDevice,
    capabilities,
    error,
    processing,
    stream,
    settings,

    // Actions
    startCamera,
    stopCamera,
    switchCamera,
    takePhoto,
    handleFileSelect,
    updateSettings,
    setPreferredDevice,

    // Helpers
    getPreferredDevice,
    hasDevices: devices.length > 0,
    hasMultipleDevices: devices.length > 1,
    hasPermission: !!stream,
    isActive: !!stream,
    canSwitch: devices.length > 1 && !processing,
    canCapture: !processing && stream?.active
  };
};

export default useMedia;
