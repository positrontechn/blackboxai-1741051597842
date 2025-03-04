import React, { Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useOffline from './hooks/useOffline';
import Header from './components/Navigation/Header';
import LoadingScreen from './components/common/LoadingScreen';
import OfflineIndicator from './components/common/OfflineIndicator';
import Navigation from './components/Navigation/Navigation';

// Lazy load screens
const HomeScreen = React.lazy(() => import('./screens/HomeScreen'));
const MapScreen = React.lazy(() => import('./screens/MapScreen'));
const ReportScreen = React.lazy(() => import('./screens/ReportScreen'));
const CommunityScreen = React.lazy(() => import('./screens/CommunityScreen'));
const InterventionScreen = React.lazy(() => import('./screens/InterventionScreen'));
const ProfileScreen = React.lazy(() => import('./screens/ProfileScreen'));
const SettingsScreen = React.lazy(() => import('./screens/SettingsScreen'));
const NotFoundScreen = React.lazy(() => import('./screens/NotFoundScreen'));

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
      ease: 'easeIn'
    }
  }
};

// Animated page wrapper
const AnimatedPage = ({ children }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
  >
    {children}
  </motion.div>
);

// Auth wrapper component
const RequireAuth = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('auth_token');

  if (!isAuthenticated) {
    // Redirect to login with return path
    window.location.href = `/login?return=${encodeURIComponent(location.pathname)}`;
    return null;
  }

  return children;
};

const App = () => {
  const location = useLocation();
  const { isOnline, syncData } = useOffline();

  // Handle online/offline status
  useEffect(() => {
    if (isOnline) {
      syncData().catch(console.error);
    }
  }, [isOnline, syncData]);

  // Handle page visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isOnline) {
        syncData().catch(console.error);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isOnline, syncData]);

  // Update theme based on system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      document.documentElement.classList.toggle('dark', e.matches);
    };

    handleChange(mediaQuery);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Update safe area insets
  useEffect(() => {
    const updateSafeArea = () => {
      document.documentElement.style.setProperty(
        '--safe-top',
        window.visualViewport?.offsetTop || '0px'
      );
      document.documentElement.style.setProperty(
        '--safe-bottom',
        window.visualViewport?.height || '0px'
      );
    };

    window.visualViewport?.addEventListener('resize', updateSafeArea);
    window.visualViewport?.addEventListener('scroll', updateSafeArea);
    updateSafeArea();

    return () => {
      window.visualViewport?.removeEventListener('resize', updateSafeArea);
      window.visualViewport?.removeEventListener('scroll', updateSafeArea);
    };
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Offline Indicator */}
      <OfflineIndicator />

      {/* Main Content */}
      <main className="flex-1 relative">
        <Suspense fallback={<LoadingScreen />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* Public Routes */}
              <Route 
                path="/" 
                element={
                  <AnimatedPage>
                    <HomeScreen />
                  </AnimatedPage>
                } 
              />
              <Route 
                path="/map" 
                element={
                  <AnimatedPage>
                    <MapScreen />
                  </AnimatedPage>
                } 
              />
              <Route 
                path="/report/*" 
                element={
                  <AnimatedPage>
                    <ReportScreen />
                  </AnimatedPage>
                } 
              />
              <Route 
                path="/community/*" 
                element={
                  <AnimatedPage>
                    <CommunityScreen />
                  </AnimatedPage>
                } 
              />

              {/* Protected Routes */}
              <Route
                path="/intervention"
                element={
                  <RequireAuth>
                    <AnimatedPage>
                      <InterventionScreen />
                    </AnimatedPage>
                  </RequireAuth>
                }
              />
              <Route
                path="/profile"
                element={
                  <RequireAuth>
                    <AnimatedPage>
                      <ProfileScreen />
                    </AnimatedPage>
                  </RequireAuth>
                }
              />
              <Route
                path="/settings"
                element={
                  <RequireAuth>
                    <AnimatedPage>
                      <SettingsScreen />
                    </AnimatedPage>
                  </RequireAuth>
                }
              />

              {/* 404 Route */}
              <Route 
                path="*" 
                element={
                  <AnimatedPage>
                    <NotFoundScreen />
                  </AnimatedPage>
                } 
              />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>

      {/* Navigation */}
      <Navigation />
    </div>
  );
};

export default App;
