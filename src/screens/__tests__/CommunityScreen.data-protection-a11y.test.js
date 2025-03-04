import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CommunityScreen from '../CommunityScreen';
import useCommunity from '../../hooks/useCommunity';
import { privacyUtils, privacyCheckers } from '../../test-utils/privacy-a11y-setup';

// Mock the custom hooks
jest.mock('../../hooks/useCommunity');

const mockData = {
  dataProtection: {
    gdprCompliance: true,
    dataSubjectRights: ['access', 'rectification', 'erasure', 'portability'],
    processingPurposes: ['service', 'analytics', 'marketing'],
    legalBasis: 'consent'
  },
  userRequests: {
    pending: [],
    completed: [],
    processing: []
  }
};

describe('CommunityScreen Data Protection Accessibility', () => {
  beforeEach(() => {
    useCommunity.mockImplementation(() => ({
      ...mockData,
      loading: false,
      error: null
    }));
  });

  describe('Data Subject Rights', () => {
    it('should handle data rights controls accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showDataRights={true} />
        </BrowserRouter>
      );

      // Check rights container
      const rightsContainer = container.querySelector('[data-rights-controls]');
      expect(rightsContainer).toHaveAttribute('role', 'region');
      expect(rightsContainer).toHaveAttribute('aria-label', 'Data subject rights');

      // Check individual rights
      const rights = rightsContainer.querySelectorAll('[role="button"]');
      rights.forEach(right => {
        expect(right).toHaveAttribute('aria-label');
        expect(right).toHaveAttribute('aria-describedby');
        const description = document.getElementById(right.getAttribute('aria-describedby'));
        expect(description).toHaveTextContent(/right to/i);
      });
    });

    it('should announce rights request submissions', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showDataRights={true} />
        </BrowserRouter>
      );

      // Submit rights request
      const accessButton = screen.getByRole('button', { name: /access.*data/i });
      fireEvent.click(accessButton);

      // Check announcement
      const announcement = screen.getByRole('status');
      expect(announcement).toHaveAttribute('aria-live', 'polite');
      expect(announcement).toHaveTextContent(/request submitted/i);
    });
  });

  describe('Processing Purposes', () => {
    it('should handle processing purpose controls accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showProcessingPurposes={true} />
        </BrowserRouter>
      );

      // Check purposes container
      const purposesContainer = container.querySelector('[data-processing-purposes]');
      expect(purposesContainer).toHaveAttribute('role', 'region');
      expect(purposesContainer).toHaveAttribute('aria-label', 'Data processing purposes');

      // Check purpose groups
      const groups = purposesContainer.querySelectorAll('[role="group"]');
      groups.forEach(group => {
        expect(group).toHaveAttribute('aria-labelledby');
        const label = document.getElementById(group.getAttribute('aria-labelledby'));
        expect(label).toHaveTextContent(/purpose/i);
      });
    });

    it('should provide accessible purpose explanations', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showProcessingPurposes={true} />
        </BrowserRouter>
      );

      // Check explanations
      const explanations = screen.getAllByRole('region', { name: /purpose explanation/i });
      explanations.forEach(explanation => {
        expect(explanation).toHaveAttribute('aria-describedby');
        const description = document.getElementById(explanation.getAttribute('aria-describedby'));
        expect(description).toHaveTextContent(/how.*data.*used/i);
      });
    });
  });

  describe('Legal Basis Selection', () => {
    it('should handle legal basis controls accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showLegalBasis={true} />
        </BrowserRouter>
      );

      // Check legal basis container
      const legalContainer = container.querySelector('[data-legal-basis]');
      expect(legalContainer).toHaveAttribute('role', 'radiogroup');
      expect(legalContainer).toHaveAttribute('aria-label', 'Legal basis for processing');

      // Check basis options
      const options = legalContainer.querySelectorAll('[role="radio"]');
      options.forEach(option => {
        expect(option).toHaveAttribute('aria-checked');
        expect(option).toHaveAttribute('aria-describedby');
      });
    });

    it('should announce legal basis changes', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showLegalBasis={true} />
        </BrowserRouter>
      );

      // Change legal basis
      const contractOption = screen.getByRole('radio', { name: /contract/i });
      fireEvent.click(contractOption);

      // Check announcement
      const announcement = screen.getByRole('status');
      expect(announcement).toHaveAttribute('aria-live', 'polite');
      expect(announcement).toHaveTextContent(/legal basis changed/i);
    });
  });

  describe('Request Management', () => {
    it('should handle request management controls accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showRequestManagement={true} />
        </BrowserRouter>
      );

      // Check request container
      const requestContainer = container.querySelector('[data-request-management]');
      expect(requestContainer).toHaveAttribute('role', 'region');
      expect(requestContainer).toHaveAttribute('aria-label', 'Data request management');

      // Check request list
      const requestList = requestContainer.querySelector('[role="list"]');
      expect(requestList).toHaveAttribute('aria-label', 'Data requests');
      
      // Check request items
      const requests = requestList.querySelectorAll('[role="listitem"]');
      requests.forEach(request => {
        expect(request).toHaveAttribute('aria-labelledby');
        expect(request).toHaveAttribute('aria-describedby');
      });
    });

    it('should announce request status updates', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showRequestManagement={true} />
        </BrowserRouter>
      );

      // Update request status
      const request = screen.getByRole('listitem', { name: /access request/i });
      fireEvent.click(request);

      // Check announcement
      const announcement = screen.getByRole('status');
      expect(announcement).toHaveAttribute('aria-live', 'polite');
      expect(announcement).toHaveTextContent(/request status/i);
    });
  });

  describe('Data Processing Records', () => {
    it('should handle processing records accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showProcessingRecords={true} />
        </BrowserRouter>
      );

      // Check records container
      const recordsContainer = container.querySelector('[data-processing-records]');
      expect(recordsContainer).toHaveAttribute('role', 'region');
      expect(recordsContainer).toHaveAttribute('aria-label', 'Data processing records');

      // Check record entries
      const records = recordsContainer.querySelectorAll('[role="article"]');
      records.forEach(record => {
        expect(record).toHaveAttribute('aria-labelledby');
        expect(record).toHaveAttribute('aria-describedby');
      });
    });

    it('should provide accessible record details', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showProcessingRecords={true} />
        </BrowserRouter>
      );

      // Check record details
      const details = screen.getAllByRole('button', { name: /view details/i });
      details.forEach(detail => {
        expect(detail).toHaveAttribute('aria-expanded');
        expect(detail).toHaveAttribute('aria-controls');
      });
    });
  });

  describe('Data Protection Officer Contact', () => {
    it('should handle DPO contact controls accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showDPOContact={true} />
        </BrowserRouter>
      );

      // Check contact container
      const contactContainer = container.querySelector('[data-dpo-contact]');
      expect(contactContainer).toHaveAttribute('role', 'region');
      expect(contactContainer).toHaveAttribute('aria-label', 'Contact Data Protection Officer');

      // Check contact form
      const form = contactContainer.querySelector('form');
      expect(form).toHaveAttribute('aria-label', 'DPO contact form');
      
      // Check form fields
      const fields = form.querySelectorAll('input, textarea');
      fields.forEach(field => {
        expect(field).toHaveAttribute('aria-label');
        expect(field).toHaveAttribute('aria-describedby');
      });
    });

    it('should announce message submission status', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showDPOContact={true} />
        </BrowserRouter>
      );

      // Submit message
      const submitButton = screen.getByRole('button', { name: /send message/i });
      fireEvent.click(submitButton);

      // Check announcement
      const announcement = screen.getByRole('status');
      expect(announcement).toHaveAttribute('aria-live', 'polite');
      expect(announcement).toHaveTextContent(/message sent/i);
    });
  });
});
