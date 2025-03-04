import { MEDIA_CONFIG, ERROR_MESSAGES } from '../../constants';
import { validateFile } from '../../utils/helpers';

class MediaService {
  constructor() {
    this.listeners = new Set();
    this.devices = [];
    this.activeDevice = null;
    this.capabilities = null;
    this.processing = false;
  }

  /**
   * Initialize media service
   * @returns {Promise<void>}
   */
  async initialize() {
    try {
      // Check media devices support
      if (!navigator.mediaDevices?.enumerateDevices) {
        throw new Error(ERROR_MESSAGES.media.unavailable);
      }

      // Get device permissions
      await navigator.mediaDevices.getUserMedia({ video: true });

      // Get available devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      this.devices = devices.filter(device => device.kind === 'videoinput');

      // Set preferred device
      const preferredId = localStorage.getItem('preferredCamera');
      this.activeDevice = this.devices.find(d => d.deviceId === preferredId) || this.devices[0];

      this.notifyListeners();
    } catch (error) {
      console.error('Error initializing media service:', error);
      throw new Error(ERROR_MESSAGES.media.denied);
    }
  }

  /**
   * Initialize camera stream
   * @param {Object} constraints - Media constraints
   * @returns {Promise<MediaStream>} Camera stream
   */
  async initializeCamera(constraints = {}) {
    try {
      // Stop any existing stream
      this.stopCamera();

      // Get media stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: constraints.deviceId || this.activeDevice?.deviceId,
          facingMode: constraints.facingMode || 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          ...constraints
        }
      });

      // Get device capabilities
      const track = stream.getVideoTracks()[0];
      this.capabilities = track.getCapabilities();
      this.activeDevice = this.devices.find(d => d.deviceId === track.getSettings().deviceId);

      // Save preference
      if (this.activeDevice) {
        localStorage.setItem('preferredCamera', this.activeDevice.deviceId);
      }

      this.notifyListeners();
      return stream;
    } catch (error) {
      console.error('Error initializing camera:', error);
      throw new Error(ERROR_MESSAGES.media.denied);
    }
  }

  /**
   * Stop camera stream
   * @param {MediaStream} stream - Stream to stop
   */
  stopCamera(stream) {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  }

  /**
   * Take photo from video element
   * @param {HTMLVideoElement} video - Video element
   * @returns {Promise<Object>} Photo data
   */
  async takePhoto(video) {
    try {
      this.processing = true;
      this.notifyListeners();

      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw video frame
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0);

      // Convert to blob
      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', MEDIA_CONFIG.image.quality);
      });

      // Create object URL
      const url = URL.createObjectURL(blob);

      // Create photo object
      const photo = {
        url,
        blob,
        type: 'image/jpeg',
        width: canvas.width,
        height: canvas.height,
        timestamp: Date.now()
      };

      this.processing = false;
      this.notifyListeners();
      return photo;
    } catch (error) {
      this.processing = false;
      this.notifyListeners();
      console.error('Error taking photo:', error);
      throw error;
    }
  }

  /**
   * Process photo file
   * @param {File} file - Photo file
   * @returns {Promise<Object>} Photo data
   */
  async processPhoto(file) {
    try {
      this.processing = true;
      this.notifyListeners();

      // Validate file
      if (!validateFile(file, MEDIA_CONFIG.image)) {
        throw new Error(ERROR_MESSAGES.media.type);
      }

      // Create object URL
      const url = URL.createObjectURL(file);

      // Get dimensions
      const dimensions = await new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          resolve({
            width: img.width,
            height: img.height
          });
        };
        img.src = url;
      });

      // Create photo object
      const photo = {
        url,
        blob: file,
        type: file.type,
        width: dimensions.width,
        height: dimensions.height,
        timestamp: Date.now()
      };

      this.processing = false;
      this.notifyListeners();
      return photo;
    } catch (error) {
      this.processing = false;
      this.notifyListeners();
      console.error('Error processing photo:', error);
      throw error;
    }
  }

  /**
   * Add state change listener
   * @param {Function} listener - Listener function
   */
  addListener(listener) {
    this.listeners.add(listener);
  }

  /**
   * Remove state change listener
   * @param {Function} listener - Listener function
   */
  removeListener(listener) {
    this.listeners.delete(listener);
  }

  /**
   * Notify all listeners
   */
  notifyListeners() {
    const state = {
      devices: this.devices,
      activeDevice: this.activeDevice,
      capabilities: this.capabilities,
      processing: this.processing
    };

    this.listeners.forEach(listener => {
      try {
        listener(state);
      } catch (error) {
        console.error('Error in media service listener:', error);
      }
    });
  }

  /**
   * Clean up resources
   */
  cleanup() {
    this.listeners.clear();
    this.devices = [];
    this.activeDevice = null;
    this.capabilities = null;
  }
}

export default new MediaService();
