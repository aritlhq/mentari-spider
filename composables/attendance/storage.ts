import { tokenExpiredMessage } from "../mentari-lms"
import { fetchAttendance } from "./api"
import { attendanceData, bearerToken, meetingData, tokenExpiryTime } from "./state"

export const saveTokenToStorage = (token: string) => {
    localStorage.setItem('bearerToken', token)
    sessionStorage.setItem('bearerToken', token)
    bearerToken.value = token

    const expiryTime = new Date();
    expiryTime.setHours(expiryTime.getHours() + 24);
    localStorage.setItem('tokenExpiryTime', expiryTime.toISOString());
    sessionStorage.setItem('tokenExpiryTime', expiryTime.toISOString());
    tokenExpiryTime.value = expiryTime.toISOString();
}

export const loadTokenFromStorage = () => {
    const storedToken = localStorage.getItem('bearerToken')
    const storedExpiryTime = localStorage.getItem('tokenExpiryTime')

    if(storedToken && storedExpiryTime){
        const expiryTime = new Date(storedExpiryTime)
        const now = new Date()

        if(now < expiryTime){
            bearerToken.value = storedToken
            tokenExpiryTime.value = storedExpiryTime

            // Automatically fetch data if token is available
            fetchAttendance()
        } else {
            // Token has expored
            clearSession()
            tokenExpiredMessage.value = 'Your tokens have expired. Please get new tokens.'
        }
    }
}

export const clearSession = () => {
    localStorage.removeItem('bearerToken')
    localStorage.removeItem('tokenExpiryTime')
    bearerToken.value = ''
    tokenExpiryTime.value = null
    attendanceData.value = []
    meetingData.value = null
}