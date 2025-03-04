import { useCallback, useEffect } from 'react';

const useCommunityKeyboard = (activeTab, setActiveTab, tabs) => {
  const handleKeyNavigation = useCallback((e) => {
    const currentIndex = tabs.indexOf(activeTab);

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        if (currentIndex < tabs.length - 1) {
          setActiveTab(tabs[currentIndex + 1]);
        } else {
          setActiveTab(tabs[0]); // Cycle to first tab
        }
        break;

      case 'ArrowLeft':
        e.preventDefault();
        if (currentIndex > 0) {
          setActiveTab(tabs[currentIndex - 1]);
        } else {
          setActiveTab(tabs[tabs.length - 1]); // Cycle to last tab
        }
        break;

      case 'Home':
        e.preventDefault();
        setActiveTab(tabs[0]); // Go to first tab
        break;

      case 'End':
        e.preventDefault();
        setActiveTab(tabs[tabs.length - 1]); // Go to last tab
        break;

      default:
        break;
    }
  }, [activeTab, setActiveTab, tabs]);

  useEffect(() => {
    // Only add keyboard listeners when the component is mounted
    const tabList = document.querySelector('.community-navigation');
    if (tabList) {
      tabList.addEventListener('keydown', handleKeyNavigation);
      
      // Add proper ARIA attributes
      tabList.setAttribute('role', 'tablist');
      
      // Set up tab buttons with correct ARIA attributes
      const tabButtons = tabList.querySelectorAll('button');
      tabButtons.forEach((button, index) => {
        button.setAttribute('role', 'tab');
        button.setAttribute('aria-selected', tabs[index] === activeTab);
        button.setAttribute('aria-controls', `${tabs[index]}-panel`);
        button.setAttribute('id', `${tabs[index]}-tab`);
        button.setAttribute('tabindex', tabs[index] === activeTab ? '0' : '-1');
      });

      // Set up tab panels with correct ARIA attributes
      const tabPanels = document.querySelectorAll('.tab-content > div');
      tabPanels.forEach((panel, index) => {
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', `${tabs[index]}-tab`);
        panel.setAttribute('id', `${tabs[index]}-panel`);
        panel.setAttribute('tabindex', '0');
      });
    }

    return () => {
      if (tabList) {
        tabList.removeEventListener('keydown', handleKeyNavigation);
      }
    };
  }, [handleKeyNavigation, activeTab, tabs]);

  // Return focus management helpers
  return {
    getTabProps: (tabName) => ({
      role: 'tab',
      'aria-selected': activeTab === tabName,
      'aria-controls': `${tabName}-panel`,
      id: `${tabName}-tab`,
      tabIndex: activeTab === tabName ? 0 : -1
    }),
    getPanelProps: (tabName) => ({
      role: 'tabpanel',
      'aria-labelledby': `${tabName}-tab`,
      id: `${tabName}-panel`,
      tabIndex: 0
    })
  };
};

export default useCommunityKeyboard;
