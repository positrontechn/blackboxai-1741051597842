// Media handling utilities for accessibility testing
const mediaUtils = {
  // Image gallery utilities
  gallery: {
    // Create image gallery container
    createImageGallery() {
      const container = document.createElement('div');
      container.setAttribute('data-image-gallery', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Image gallery');
      
      const grid = document.createElement('div');
      grid.setAttribute('role', 'grid');
      grid.setAttribute('aria-rowcount', '2');
      grid.setAttribute('aria-colcount', '3');
      
      ['tree-planting.jpg', 'community-event.jpg'].forEach(image => {
        const cell = document.createElement('div');
        cell.setAttribute('role', 'gridcell');
        
        const img = document.createElement('img');
        img.setAttribute('alt', image.replace('.jpg', ''));
        
        const description = document.createElement('div');
        description.id = `img-desc-${Date.now()}`;
        description.textContent = `Description of ${image}`;
        img.setAttribute('aria-describedby', description.id);
        
        cell.appendChild(img);
        cell.appendChild(description);
        grid.appendChild(cell);
      });
      
      container.appendChild(grid);
      return container;
    },

    // Create image selection announcement
    createImageAnnouncement(image) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Selected ${image} image`;
      return announcement;
    }
  },

  // Video player utilities
  video: {
    // Create video player container
    createVideoPlayer() {
      const container = document.createElement('div');
      container.setAttribute('data-video-player', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Video player');
      
      const video = document.createElement('video');
      video.setAttribute('aria-label', 'Current video');
      
      const description = document.createElement('div');
      description.id = `video-desc-${Date.now()}`;
      description.textContent = 'Video description';
      video.setAttribute('aria-describedby', description.id);
      
      const controls = document.createElement('div');
      controls.setAttribute('role', 'group');
      controls.setAttribute('aria-label', 'Video controls');
      
      ['play', 'pause', 'mute'].forEach(action => {
        const button = document.createElement('button');
        button.setAttribute('aria-label', action);
        button.setAttribute('aria-pressed', 'false');
        controls.appendChild(button);
      });
      
      container.appendChild(video);
      container.appendChild(description);
      container.appendChild(controls);
      return container;
    },

    // Create video state announcement
    createVideoAnnouncement(state) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Video ${state}`;
      return announcement;
    }
  },

  // Audio player utilities
  audio: {
    // Create audio player container
    createAudioPlayer() {
      const container = document.createElement('div');
      container.setAttribute('data-audio-player', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Audio player');
      
      const audio = document.createElement('audio');
      audio.setAttribute('aria-label', 'Current audio');
      
      const controls = document.createElement('div');
      controls.setAttribute('role', 'group');
      controls.setAttribute('aria-label', 'Audio controls');
      
      const progress = document.createElement('div');
      progress.setAttribute('role', 'progressbar');
      progress.setAttribute('aria-valuemin', '0');
      progress.setAttribute('aria-valuemax', '100');
      progress.setAttribute('aria-valuenow', '0');
      progress.setAttribute('aria-valuetext', '0% played');
      
      controls.appendChild(progress);
      container.appendChild(audio);
      container.appendChild(controls);
      return container;
    },

    // Create audio state announcement
    createAudioAnnouncement(state) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Audio ${state}`;
      return announcement;
    }
  },

  // Media upload utilities
  upload: {
    // Create media upload container
    createMediaUpload() {
      const container = document.createElement('div');
      container.setAttribute('data-media-upload', 'true');
      container.setAttribute('role', 'form');
      container.setAttribute('aria-label', 'Media upload');
      
      const input = document.createElement('input');
      input.type = 'file';
      input.setAttribute('aria-label', 'Choose files to upload');
      
      const description = document.createElement('div');
      description.id = `upload-desc-${Date.now()}`;
      description.textContent = 'Select media files to upload';
      input.setAttribute('aria-describedby', description.id);
      
      const button = document.createElement('button');
      button.setAttribute('aria-label', 'Upload selected files');
      button.setAttribute('aria-disabled', 'true');
      
      container.appendChild(input);
      container.appendChild(description);
      container.appendChild(button);
      return container;
    },

    // Create upload progress announcement
    createUploadAnnouncement(progress) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'progressbar');
      announcement.setAttribute('aria-valuetext', `Uploading: ${progress}% complete`);
      return announcement;
    }
  },

  // Caption utilities
  captions: {
    // Create captions container
    createCaptionsContainer() {
      const container = document.createElement('div');
      container.setAttribute('data-captions', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Captions');
      
      const text = document.createElement('div');
      text.setAttribute('aria-live', 'polite');
      text.setAttribute('aria-atomic', 'true');
      
      const button = document.createElement('button');
      button.setAttribute('aria-label', 'Toggle captions');
      button.setAttribute('aria-pressed', 'false');
      
      container.appendChild(text);
      container.appendChild(button);
      return container;
    },

    // Create caption state announcement
    createCaptionAnnouncement(enabled) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Captions ${enabled ? 'enabled' : 'disabled'}`;
      return announcement;
    }
  },

  // Media controls utilities
  controls: {
    // Create media controls container
    createMediaControls() {
      const container = document.createElement('div');
      container.setAttribute('data-media-controls', 'true');
      container.setAttribute('role', 'toolbar');
      container.setAttribute('aria-label', 'Media controls');
      
      ['play', 'pause', 'stop'].forEach(action => {
        const button = document.createElement('button');
        button.setAttribute('aria-label', action);
        button.setAttribute('aria-pressed', 'false');
        
        const description = document.createElement('div');
        description.id = `control-desc-${Date.now()}`;
        description.textContent = `${action} media`;
        button.setAttribute('aria-describedby', description.id);
        
        container.appendChild(button);
        container.appendChild(description);
      });
      
      const volumeSlider = document.createElement('input');
      volumeSlider.type = 'range';
      volumeSlider.setAttribute('role', 'slider');
      volumeSlider.setAttribute('aria-label', 'Volume');
      volumeSlider.setAttribute('aria-valuemin', '0');
      volumeSlider.setAttribute('aria-valuemax', '100');
      volumeSlider.setAttribute('aria-valuenow', '100');
      
      container.appendChild(volumeSlider);
      return container;
    },

    // Create control change announcement
    createControlAnnouncement(action, value) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = value ? `Volume ${value}%` : `Media ${action}`;
      return announcement;
    }
  }
};

// Media checkers
const mediaCheckers = {
  // Check image gallery accessibility
  checkImageGallery(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleGrid: this.checkImageGrid(element.querySelector('[role="grid"]')),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check image grid accessibility
  checkImageGrid(grid) {
    return grid ? {
      hasGridRole: grid.getAttribute('role') === 'grid',
      hasDimensions: grid.hasAttribute('aria-rowcount') && grid.hasAttribute('aria-colcount'),
      hasAccessibleCells: Array.from(grid.querySelectorAll('[role="gridcell"]')).every(cell => {
        const img = cell.querySelector('img');
        return img && !!img.getAttribute('alt') && !!img.getAttribute('aria-describedby');
      })
    } : false;
  },

  // Check video player accessibility
  checkVideoPlayer(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleVideo: this.checkVideo(element.querySelector('video')),
      hasAccessibleControls: this.checkMediaControls(element.querySelector('[role="group"]')),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check video accessibility
  checkVideo(video) {
    return video ? {
      hasLabel: !!video.getAttribute('aria-label'),
      hasDescription: !!video.getAttribute('aria-describedby')
    } : false;
  },

  // Check audio player accessibility
  checkAudioPlayer(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleAudio: !!element.querySelector('audio')?.getAttribute('aria-label'),
      hasAccessibleProgress: this.checkProgress(element.querySelector('[role="progressbar"]')),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check progress accessibility
  checkProgress(progress) {
    return progress ? {
      hasProgressRole: progress.getAttribute('role') === 'progressbar',
      hasRange: progress.hasAttribute('aria-valuemin') && 
                progress.hasAttribute('aria-valuemax') &&
                progress.hasAttribute('aria-valuenow'),
      hasValueText: !!progress.getAttribute('aria-valuetext')
    } : false;
  },

  // Check media upload accessibility
  checkMediaUpload(element) {
    return {
      hasFormRole: element.getAttribute('role') === 'form',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleInput: this.checkFileInput(element.querySelector('input[type="file"]')),
      hasAccessibleButton: this.checkUploadButton(element.querySelector('button')),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check file input accessibility
  checkFileInput(input) {
    return input ? {
      hasLabel: !!input.getAttribute('aria-label'),
      hasDescription: !!input.getAttribute('aria-describedby')
    } : false;
  },

  // Check upload button accessibility
  checkUploadButton(button) {
    return button ? {
      hasLabel: !!button.getAttribute('aria-label'),
      hasDisabledState: button.hasAttribute('aria-disabled')
    } : false;
  },

  // Check captions accessibility
  checkCaptions(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasLiveText: !!element.querySelector('[aria-live="polite"]')?.getAttribute('aria-atomic'),
      hasAccessibleToggle: this.checkCaptionToggle(element.querySelector('button')),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check caption toggle accessibility
  checkCaptionToggle(button) {
    return button ? {
      hasLabel: !!button.getAttribute('aria-label'),
      hasPressedState: button.hasAttribute('aria-pressed')
    } : false;
  },

  // Check media controls accessibility
  checkMediaControls(element) {
    return {
      hasToolbarRole: element.getAttribute('role') === 'toolbar',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleButtons: Array.from(element.querySelectorAll('button')).every(button => 
        !!button.getAttribute('aria-label') &&
        button.hasAttribute('aria-pressed') &&
        !!button.getAttribute('aria-describedby')
      ),
      hasAccessibleVolume: this.checkVolumeSlider(element.querySelector('[role="slider"]')),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check volume slider accessibility
  checkVolumeSlider(slider) {
    return slider ? {
      hasSliderRole: slider.getAttribute('role') === 'slider',
      hasLabel: !!slider.getAttribute('aria-label'),
      hasRange: slider.hasAttribute('aria-valuemin') &&
                slider.hasAttribute('aria-valuemax') &&
                slider.hasAttribute('aria-valuenow')
    } : false;
  },

  // Check general accessibility
  checkAccessibility(element) {
    return {
      hasAriaLabel: !!element.getAttribute('aria-label') || !!element.getAttribute('aria-labelledby'),
      hasAriaDescription: !!element.getAttribute('aria-describedby'),
      maintainsFocus: document.activeElement !== document.body
    };
  }
};

export {
  mediaUtils,
  mediaCheckers
};
