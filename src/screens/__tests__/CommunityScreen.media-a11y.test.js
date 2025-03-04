import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CommunityScreen from '../CommunityScreen';
import useCommunity from '../../hooks/useCommunity';
import { sortUtils, sortCheckers } from '../../test-utils/sort-a11y-setup';

// Mock the custom hooks
jest.mock('../../hooks/useCommunity');

const mockData = {
  media: {
    images: ['tree-planting.jpg', 'community-event.jpg'],
    videos: ['how-to-plant.mp4', 'event-highlights.mp4'],
    audio: ['nature-sounds.mp3', 'bird-calls.mp3']
  },
  gallery: {
    current: 0,
    total: 6,
    layout: 'grid'
  }
};

describe('CommunityScreen Media Accessibility', () => {
  beforeEach(() => {
    useCommunity.mockImplementation(() => ({
      ...mockData,
      loading: false,
      error: null
    }));
  });

  describe('Image Gallery', () => {
    it('should handle image gallery accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showImageGallery={true} />
        </BrowserRouter>
      );

      // Check gallery container
      const galleryContainer = container.querySelector('[data-image-gallery]');
      expect(galleryContainer).toHaveAttribute('role', 'region');
      expect(galleryContainer).toHaveAttribute('aria-label', 'Image gallery');

      // Check gallery grid
      const grid = galleryContainer.querySelector('[role="grid"]');
      expect(grid).toHaveAttribute('aria-rowcount');
      expect(grid).toHaveAttribute('aria-colcount');

      // Check image cells
      const cells = grid.querySelectorAll('[role="gridcell"]');
      cells.forEach(cell => {
        const img = cell.querySelector('img');
        expect(img).toHaveAttribute('alt');
        expect(img).toHaveAttribute('aria-describedby');
      });
    });

    it('should announce image selection', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showImageGallery={true} />
        </BrowserRouter>
      );

      // Select image
      const image = screen.getByRole('img', { name: /tree planting/i });
      fireEvent.click(image);

      // Check announcement
      const announcement = screen.getByRole('status');
      expect(announcement).toHaveAttribute('aria-live', 'polite');
      expect(announcement).toHaveTextContent(/selected tree planting image/i);
    });
  });

  describe('Video Player', () => {
    it('should handle video player accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showVideoPlayer={true} />
        </BrowserRouter>
      );

      // Check video container
      const videoContainer = container.querySelector('[data-video-player]');
      expect(videoContainer).toHaveAttribute('role', 'region');
      expect(videoContainer).toHaveAttribute('aria-label', 'Video player');

      // Check video element
      const video = videoContainer.querySelector('video');
      expect(video).toHaveAttribute('aria-label');
      expect(video).toHaveAttribute('aria-describedby');

      // Check video controls
      const controls = videoContainer.querySelector('[role="group"]');
      expect(controls).toHaveAttribute('aria-label', 'Video controls');
      
      const buttons = controls.querySelectorAll('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('aria-label');
        expect(button).toHaveAttribute('aria-pressed');
      });
    });

    it('should announce video state changes', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showVideoPlayer={true} />
        </BrowserRouter>
      );

      // Play video
      const playButton = screen.getByRole('button', { name: /play/i });
      fireEvent.click(playButton);

      // Check announcement
      const announcement = screen.getByRole('status');
      expect(announcement).toHaveAttribute('aria-live', 'polite');
      expect(announcement).toHaveTextContent(/video playing/i);
    });
  });

  describe('Audio Player', () => {
    it('should handle audio player accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showAudioPlayer={true} />
        </BrowserRouter>
      );

      // Check audio container
      const audioContainer = container.querySelector('[data-audio-player]');
      expect(audioContainer).toHaveAttribute('role', 'region');
      expect(audioContainer).toHaveAttribute('aria-label', 'Audio player');

      // Check audio element
      const audio = audioContainer.querySelector('audio');
      expect(audio).toHaveAttribute('aria-label');

      // Check audio controls
      const controls = audioContainer.querySelector('[role="group"]');
      expect(controls).toHaveAttribute('aria-label', 'Audio controls');
      
      // Check progress indicator
      const progress = controls.querySelector('[role="progressbar"]');
      expect(progress).toHaveAttribute('aria-valuemin');
      expect(progress).toHaveAttribute('aria-valuemax');
      expect(progress).toHaveAttribute('aria-valuenow');
      expect(progress).toHaveAttribute('aria-valuetext');
    });

    it('should announce audio state changes', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showAudioPlayer={true} />
        </BrowserRouter>
      );

      // Toggle mute
      const muteButton = screen.getByRole('button', { name: /mute/i });
      fireEvent.click(muteButton);

      // Check announcement
      const announcement = screen.getByRole('status');
      expect(announcement).toHaveAttribute('aria-live', 'polite');
      expect(announcement).toHaveTextContent(/audio muted/i);
    });
  });

  describe('Media Upload', () => {
    it('should handle media upload accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showMediaUpload={true} />
        </BrowserRouter>
      );

      // Check upload container
      const uploadContainer = container.querySelector('[data-media-upload]');
      expect(uploadContainer).toHaveAttribute('role', 'form');
      expect(uploadContainer).toHaveAttribute('aria-label', 'Media upload');

      // Check file input
      const fileInput = uploadContainer.querySelector('input[type="file"]');
      expect(fileInput).toHaveAttribute('aria-label', 'Choose files to upload');
      expect(fileInput).toHaveAttribute('aria-describedby');

      // Check upload button
      const uploadButton = uploadContainer.querySelector('button');
      expect(uploadButton).toHaveAttribute('aria-label', 'Upload selected files');
      expect(uploadButton).toHaveAttribute('aria-disabled', 'true');
    });

    it('should announce upload progress', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showMediaUpload={true} />
        </BrowserRouter>
      );

      // Simulate upload
      const uploadButton = screen.getByRole('button', { name: /upload/i });
      fireEvent.click(uploadButton);

      // Check announcement
      const announcement = screen.getByRole('progressbar');
      expect(announcement).toHaveAttribute('aria-valuetext');
      expect(announcement).toHaveTextContent(/uploading/i);
    });
  });

  describe('Media Captions', () => {
    it('should handle captions accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showMediaCaptions={true} />
        </BrowserRouter>
      );

      // Check captions container
      const captionsContainer = container.querySelector('[data-captions]');
      expect(captionsContainer).toHaveAttribute('role', 'region');
      expect(captionsContainer).toHaveAttribute('aria-label', 'Captions');

      // Check caption text
      const captionText = captionsContainer.querySelector('[aria-live="polite"]');
      expect(captionText).toBeTruthy();
      expect(captionText).toHaveAttribute('aria-atomic', 'true');
    });

    it('should announce caption changes', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showMediaCaptions={true} />
        </BrowserRouter>
      );

      // Toggle captions
      const captionsButton = screen.getByRole('button', { name: /toggle captions/i });
      fireEvent.click(captionsButton);

      // Check announcement
      const announcement = screen.getByRole('status');
      expect(announcement).toHaveAttribute('aria-live', 'polite');
      expect(announcement).toHaveTextContent(/captions (enabled|disabled)/i);
    });
  });

  describe('Media Controls', () => {
    it('should handle media controls accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showMediaControls={true} />
        </BrowserRouter>
      );

      // Check controls container
      const controlsContainer = container.querySelector('[data-media-controls]');
      expect(controlsContainer).toHaveAttribute('role', 'toolbar');
      expect(controlsContainer).toHaveAttribute('aria-label', 'Media controls');

      // Check control buttons
      const buttons = controlsContainer.querySelectorAll('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('aria-label');
        expect(button).toHaveAttribute('aria-pressed');
        expect(button).toHaveAttribute('aria-describedby');
      });

      // Check volume slider
      const volumeSlider = controlsContainer.querySelector('[role="slider"]');
      expect(volumeSlider).toHaveAttribute('aria-label', 'Volume');
      expect(volumeSlider).toHaveAttribute('aria-valuemin');
      expect(volumeSlider).toHaveAttribute('aria-valuemax');
      expect(volumeSlider).toHaveAttribute('aria-valuenow');
    });

    it('should announce control changes', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showMediaControls={true} />
        </BrowserRouter>
      );

      // Change volume
      const volumeSlider = screen.getByRole('slider');
      fireEvent.change(volumeSlider, { target: { value: '50' } });

      // Check announcement
      const announcement = screen.getByRole('status');
      expect(announcement).toHaveAttribute('aria-live', 'polite');
      expect(announcement).toHaveTextContent(/volume 50%/i);
    });
  });
});
