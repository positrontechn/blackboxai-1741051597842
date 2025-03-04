import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CommunityScreen from '../CommunityScreen';
import useCommunity from '../../hooks/useCommunity';
import { engagementUtils, engagementCheckers } from '../../test-utils/engagement-a11y-setup';

// Mock the custom hooks
jest.mock('../../hooks/useCommunity');

const mockData = {
  gamification: {
    points: 1250,
    level: 3,
    badges: ['eco-warrior', 'community-builder', 'tree-planter'],
    achievements: ['first-report', '10-trees-planted', 'community-event']
  },
  rewards: {
    available: ['special-badge', 'community-feature'],
    claimed: ['profile-theme'],
    progress: {
      nextLevel: 75,
      monthlyGoal: 60
    }
  }
};

describe('CommunityScreen Gamification Accessibility', () => {
  beforeEach(() => {
    useCommunity.mockImplementation(() => ({
      ...mockData,
      loading: false,
      error: null
    }));
  });

  describe('Points and Level Display', () => {
    it('should handle points display accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showPointsDisplay={true} />
        </BrowserRouter>
      );

      // Check points container
      const pointsContainer = container.querySelector('[data-points-display]');
      expect(pointsContainer).toHaveAttribute('role', 'status');
      expect(pointsContainer).toHaveAttribute('aria-label', 'Points and level status');
      expect(pointsContainer).toHaveAttribute('aria-live', 'polite');

      // Check level indicator
      const levelIndicator = pointsContainer.querySelector('[data-level-indicator]');
      expect(levelIndicator).toHaveAttribute('aria-label');
      expect(levelIndicator).toHaveAttribute('aria-atomic', 'true');
    });

    it('should announce points updates', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showPointsDisplay={true} />
        </BrowserRouter>
      );

      // Simulate points update
      fireEvent(window, new CustomEvent('pointsUpdate', { detail: { points: 50 } }));

      // Check announcement
      const announcement = screen.getByRole('alert');
      expect(announcement).toHaveAttribute('aria-live', 'assertive');
      expect(announcement).toHaveTextContent(/earned 50 points/i);
    });
  });

  describe('Badge Collection', () => {
    it('should handle badge display accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showBadgeCollection={true} />
        </BrowserRouter>
      );

      // Check badges container
      const badgesContainer = container.querySelector('[data-badge-collection]');
      expect(badgesContainer).toHaveAttribute('role', 'region');
      expect(badgesContainer).toHaveAttribute('aria-label', 'Badge collection');

      // Check individual badges
      const badges = badgesContainer.querySelectorAll('[role="listitem"]');
      badges.forEach(badge => {
        expect(badge).toHaveAttribute('aria-labelledby');
        expect(badge).toHaveAttribute('aria-describedby');
      });
    });

    it('should announce badge unlocks', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showBadgeCollection={true} />
        </BrowserRouter>
      );

      // Simulate badge unlock
      fireEvent(window, new CustomEvent('badgeUnlock', { detail: { badge: 'eco-warrior' } }));

      // Check announcement
      const announcement = screen.getByRole('alert');
      expect(announcement).toHaveAttribute('aria-live', 'assertive');
      expect(announcement).toHaveTextContent(/unlocked eco-warrior badge/i);
    });
  });

  describe('Achievement Progress', () => {
    it('should handle achievement tracking accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showAchievements={true} />
        </BrowserRouter>
      );

      // Check achievements container
      const achievementsContainer = container.querySelector('[data-achievements]');
      expect(achievementsContainer).toHaveAttribute('role', 'region');
      expect(achievementsContainer).toHaveAttribute('aria-label', 'Achievement progress');

      // Check progress indicators
      const progressBars = achievementsContainer.querySelectorAll('[role="progressbar"]');
      progressBars.forEach(bar => {
        expect(bar).toHaveAttribute('aria-valuemin');
        expect(bar).toHaveAttribute('aria-valuemax');
        expect(bar).toHaveAttribute('aria-valuenow');
        expect(bar).toHaveAttribute('aria-valuetext');
      });
    });

    it('should announce achievement completion', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showAchievements={true} />
        </BrowserRouter>
      );

      // Simulate achievement completion
      fireEvent(window, new CustomEvent('achievementComplete', {
        detail: { achievement: 'tree-planter' }
      }));

      // Check announcement
      const announcement = screen.getByRole('alert');
      expect(announcement).toHaveAttribute('aria-live', 'assertive');
      expect(announcement).toHaveTextContent(/achievement unlocked/i);
    });
  });

  describe('Reward System', () => {
    it('should handle reward selection accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showRewards={true} />
        </BrowserRouter>
      );

      // Check rewards container
      const rewardsContainer = container.querySelector('[data-rewards]');
      expect(rewardsContainer).toHaveAttribute('role', 'region');
      expect(rewardsContainer).toHaveAttribute('aria-label', 'Available rewards');

      // Check reward options
      const options = rewardsContainer.querySelectorAll('[role="button"]');
      options.forEach(option => {
        expect(option).toHaveAttribute('aria-label');
        expect(option).toHaveAttribute('aria-describedby');
        expect(option).toHaveAttribute('aria-disabled');
      });
    });

    it('should announce reward claims', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showRewards={true} />
        </BrowserRouter>
      );

      // Claim reward
      const claimButton = screen.getByRole('button', { name: /claim reward/i });
      fireEvent.click(claimButton);

      // Check announcement
      const announcement = screen.getByRole('alert');
      expect(announcement).toHaveAttribute('aria-live', 'assertive');
      expect(announcement).toHaveTextContent(/reward claimed/i);
    });
  });

  describe('Progress Tracking', () => {
    it('should handle progress tracking accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showProgressTracking={true} />
        </BrowserRouter>
      );

      // Check progress container
      const progressContainer = container.querySelector('[data-progress-tracking]');
      expect(progressContainer).toHaveAttribute('role', 'region');
      expect(progressContainer).toHaveAttribute('aria-label', 'Progress tracking');

      // Check goal progress
      const goals = progressContainer.querySelectorAll('[role="progressbar"]');
      goals.forEach(goal => {
        expect(goal).toHaveAttribute('aria-valuemin');
        expect(goal).toHaveAttribute('aria-valuemax');
        expect(goal).toHaveAttribute('aria-valuenow');
        expect(goal).toHaveAttribute('aria-valuetext');
      });
    });

    it('should announce progress milestones', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showProgressTracking={true} />
        </BrowserRouter>
      );

      // Simulate milestone reached
      fireEvent(window, new CustomEvent('milestoneReached', {
        detail: { milestone: 'halfway-to-next-level' }
      }));

      // Check announcement
      const announcement = screen.getByRole('alert');
      expect(announcement).toHaveAttribute('aria-live', 'assertive');
      expect(announcement).toHaveTextContent(/milestone reached/i);
    });
  });

  describe('Leaderboard', () => {
    it('should handle leaderboard display accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showLeaderboard={true} />
        </BrowserRouter>
      );

      // Check leaderboard container
      const leaderboardContainer = container.querySelector('[data-leaderboard]');
      expect(leaderboardContainer).toHaveAttribute('role', 'region');
      expect(leaderboardContainer).toHaveAttribute('aria-label', 'Community leaderboard');

      // Check leaderboard entries
      const entries = leaderboardContainer.querySelectorAll('[role="row"]');
      entries.forEach(entry => {
        expect(entry).toHaveAttribute('aria-label');
        const cells = entry.querySelectorAll('[role="cell"]');
        cells.forEach(cell => expect(cell).toHaveAttribute('aria-label'));
      });
    });

    it('should announce ranking changes', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showLeaderboard={true} />
        </BrowserRouter>
      );

      // Simulate ranking update
      fireEvent(window, new CustomEvent('rankingUpdate', {
        detail: { newRank: 5, oldRank: 7 }
      }));

      // Check announcement
      const announcement = screen.getByRole('alert');
      expect(announcement).toHaveAttribute('aria-live', 'assertive');
      expect(announcement).toHaveTextContent(/moved up to rank 5/i);
    });
  });
});
