import { fetchAttendance, fetchMeetingDetails } from './api'
import { attendanceData, bearerToken, error, loading, loadingMeeting, meetingData, tokenExpiredMessage, tokenExpiryTime } from './state'
import { loadTokenFromStorage, saveTokenToStorage, clearSession } from './storage'
import { closeModalOnOutsideClick, formatDate, getStatusClass } from './ui'

export * from './state'

export * from './api'
export * from './utils'
export * from './storage'
export * from './ui'

export function useAttendance() {
    return {
        // State
        bearerToken,
        attendanceData,
        loading,
        error,
        meetingData,
        loadingMeeting,
        tokenExpiredMessage,
        tokenExpiryTime,

        // Storage functions
        saveTokenToStorage,
        loadTokenFromStorage,
        clearSession,

        // UI functions
        closeModalOnOutsideClick,
        getStatusClass,
        formatDate,

        // API functions
        fetchAttendance,
        fetchMeetingDetails

    }
}