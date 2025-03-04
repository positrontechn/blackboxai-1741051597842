import { renderHook, act } from '@testing-library/react-hooks';
import { fireEvent } from '@testing-library/react';
import useCommunityKeyboard from '../useCommunityKeyboard';

describe('useCommunityKeyboard', () => {
  const mockSetActiveTab = jest.fn();
  const tabs = ['events', 'volunteer', 'achievements'];

  beforeEach(() => {
    // Create a mock DOM structure
    document.body.innerHTML = `
      <div class="community-navigation">
        <button id="events-tab">Events</button>
        <button id="volunteer-tab">Volunteer</button>
        <button id="achievements-tab">Achievements</button>
      </div>
      <div class="tab-content">
        <div id="events-panel">Events Content</div>
        <div id="volunteer-panel">Volunteer Content</div>
        <div id="achievements-panel">Achievements Content</div>
      </div>
    `;
    mockSetActiveTab.mockClear();
  });

  it('should handle right arrow key navigation', () => {
    renderHook(() => useCommunityKeyboard('events', mockSetActiveTab, tabs));
    
    const tabList = document.querySelector('.community-navigation');
    act(() => {
      fireEvent.keyDown(tabList, { key: 'ArrowRight' });
    });

    expect(mockSetActiveTab).toHaveBeenCalledWith('volunteer');
  });

  it('should handle left arrow key navigation', () => {
    renderHook(() => useCommunityKeyboard('volunteer', mockSetActiveTab, tabs));
    
    const tabList = document.querySelector('.community-navigation');
    act(() => {
      fireEvent.keyDown(tabList, { key: 'ArrowLeft' });
    });

    expect(mockSetActiveTab).toHaveBeenCalledWith('events');
  });

  it('should cycle to first tab when pressing right arrow on last tab', () => {
    renderHook(() => useCommunityKeyboard('achievements', mockSetActiveTab, tabs));
    
    const tabList = document.querySelector('.community-navigation');
    act(() => {
      fireEvent.keyDown(tabList, { key: 'ArrowRight' });
    });

    expect(mockSetActiveTab).toHaveBeenCalledWith('events');
  });

  it('should cycle to last tab when pressing left arrow on first tab', () => {
    renderHook(() => useCommunityKeyboard('events', mockSetActiveTab, tabs));
    
    const tabList = document.querySelector('.community-navigation');
    act(() => {
      fireEvent.keyDown(tabList, { key: 'ArrowLeft' });
    });

    expect(mockSetActiveTab).toHaveBeenCalledWith('achievements');
  });

  it('should handle Home key navigation', () => {
    renderHook(() => useCommunityKeyboard('achievements', mockSetActiveTab, tabs));
    
    const tabList = document.querySelector('.community-navigation');
    act(() => {
      fireEvent.keyDown(tabList, { key: 'Home' });
    });

    expect(mockSetActiveTab).toHaveBeenCalledWith('events');
  });

  it('should handle End key navigation', () => {
    renderHook(() => useCommunityKeyboard('events', mockSetActiveTab, tabs));
    
    const tabList = document.querySelector('.community-navigation');
    act(() => {
      fireEvent.keyDown(tabList, { key: 'End' });
    });

    expect(mockSetActiveTab).toHaveBeenCalledWith('achievements');
  });

  it('should set correct ARIA attributes', () => {
    renderHook(() => useCommunityKeyboard('volunteer', mockSetActiveTab, tabs));

    const tabList = document.querySelector('.community-navigation');
    const buttons = tabList.querySelectorAll('button');
    const panels = document.querySelectorAll('.tab-content > div');

    // Check tablist role
    expect(tabList).toHaveAttribute('role', 'tablist');

    // Check button attributes
    buttons.forEach((button, index) => {
      expect(button).toHaveAttribute('role', 'tab');
      expect(button).toHaveAttribute('aria-selected', tabs[index] === 'volunteer' ? 'true' : 'false');
      expect(button).toHaveAttribute('aria-controls', `${tabs[index]}-panel`);
      expect(button).toHaveAttribute('id', `${tabs[index]}-tab`);
      expect(button).toHaveAttribute('tabindex', tabs[index] === 'volunteer' ? '0' : '-1');
    });

    // Check panel attributes
    panels.forEach((panel, index) => {
      expect(panel).toHaveAttribute('role', 'tabpanel');
      expect(panel).toHaveAttribute('aria-labelledby', `${tabs[index]}-tab`);
      expect(panel).toHaveAttribute('id', `${tabs[index]}-panel`);
      expect(panel).toHaveAttribute('tabindex', '0');
    });
  });

  it('should return correct tab props', () => {
    const { result } = renderHook(() => 
      useCommunityKeyboard('volunteer', mockSetActiveTab, tabs)
    );

    const tabProps = result.current.getTabProps('volunteer');
    
    expect(tabProps).toEqual({
      role: 'tab',
      'aria-selected': true,
      'aria-controls': 'volunteer-panel',
      id: 'volunteer-tab',
      tabIndex: 0
    });
  });

  it('should return correct panel props', () => {
    const { result } = renderHook(() => 
      useCommunityKeyboard('volunteer', mockSetActiveTab, tabs)
    );

    const panelProps = result.current.getPanelProps('volunteer');
    
    expect(panelProps).toEqual({
      role: 'tabpanel',
      'aria-labelledby': 'volunteer-tab',
      id: 'volunteer-panel',
      tabIndex: 0
    });
  });

  it('should clean up event listeners on unmount', () => {
    const { unmount } = renderHook(() => 
      useCommunityKeyboard('events', mockSetActiveTab, tabs)
    );

    const tabList = document.querySelector('.community-navigation');
    const removeEventListenerSpy = jest.spyOn(tabList, 'removeEventListener');

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalled();
  });
});
