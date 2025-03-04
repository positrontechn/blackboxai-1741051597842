import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Header from '../components/Navigation/Header';
import QuickReport from '../components/Report/QuickReport';
import ReportForm from '../components/Report/ReportForm';
import LoadingScreen from '../components/common/LoadingScreen';
import ErrorScreen from '../components/common/ErrorScreen';
import useReport from '../hooks/useReport';
import useOffline from '../hooks/useOffline';

const ReportScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');

  // Hooks
  const { getReport, submitReport, updateReport, loading, error } = useReport();
  const { isOnline } = useOffline();

  // State
  const [report, setReport] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Load existing report if editing
  useEffect(() => {
    const loadReport = async () => {
      if (!id) return;

      try {
        const data = await getReport(id);
        setReport(data);
      } catch (err) {
        console.error('Error loading report:', err);
      }
    };

    loadReport();
  }, [id, getReport]);

  // Handle report submission
  const handleSubmit = async (data) => {
    try {
      setSubmitting(true);
      setSubmitError(null);

      // Submit or update report
      const result = id ? 
        await updateReport(id, data) :
        await submitReport(data);

      // Show success screen
      navigate('/map', { 
        state: { 
          success: true,
          message: id ? 'Report updated successfully' : 'Report submitted successfully',
          reportId: result.id
        }
      });
    } catch (err) {
      setSubmitError(err.message);
      console.error('Error submitting report:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle close
  const handleClose = () => {
    navigate(-1);
  };

  // Show loading screen
  if (loading) {
    return <LoadingScreen />;
  }

  // Show error screen
  if (error) {
    return (
      <ErrorScreen
        error={error}
        action={{
          label: 'Try Again',
          onClick: () => window.location.reload()
        }}
      />
    );
  }

  // Show quick report mode
  if (mode === 'quick') {
    return (
      <QuickReport
        onSubmit={handleSubmit}
        onClose={handleClose}
        submitting={submitting}
        error={submitError}
      />
    );
  }

  // Show full report form
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header
        title={id ? 'Edit Report' : 'New Report'}
        showBack
        onBack={handleClose}
      />

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <ReportForm
          initialData={report}
          onSubmit={handleSubmit}
          submitting={submitting}
          error={submitError}
          isOffline={!isOnline}
        />
      </div>

      {/* Offline Warning */}
      {!isOnline && (
        <div className="fixed bottom-0 inset-x-0 p-4">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 
            dark:text-yellow-200 px-4 py-3 rounded-lg text-sm text-center">
            You are currently offline. Your report will be saved and uploaded when 
            you're back online.
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportScreen;
