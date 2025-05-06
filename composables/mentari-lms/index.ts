// Export all state variables
export * from './state';

// Export all functions
export * from './api';
export * from './utils';
export * from './storage';
export * from './ui';

// Main composable function
import { bearerToken, courseData, loading, error, courseDetails, loadingDetails, 
         tokenExpiredMessage, tokenExpiryTime, pretestData, showPretestModal, loadingPretest } from './state';
import { saveTokenToStorage, loadTokenFromStorage, clearSession } from './storage';
import { closeModalOnOutsideClick, scrollToSection, scrollToTop, setupScrollButton, 
         closePretestOnOutsideClick, closePretest } from './ui';
import { fetchCourses, fetchCourseDetails, fetchPretest } from './api';

export function useMentariLms() {
    return {
        // State
        bearerToken,
        courseData,
        loading,
        error,
        courseDetails,
        loadingDetails,
        tokenExpiredMessage,
        tokenExpiryTime,
        pretestData,
        showPretestModal,
        loadingPretest,
        
        // Storage functions
        saveTokenToStorage,
        loadTokenFromStorage,
        clearSession,
        
        // UI functions
        closeModalOnOutsideClick,
        scrollToSection,
        scrollToTop,
        setupScrollButton,
        closePretestOnOutsideClick,
        closePretest,
        
        // API functions
        fetchCourses,
        fetchCourseDetails,
        fetchPretest,
    };
}