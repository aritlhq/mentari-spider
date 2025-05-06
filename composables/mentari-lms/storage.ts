import { bearerToken, tokenExpiryTime, courseData, courseDetails } from './state';

export const saveTokenToStorage = (token: string) => {
    localStorage.setItem('mentariLmsToken', token);
    sessionStorage.setItem('mentariLmsToken', token);
    bearerToken.value = token;

    const expiryTime = new Date();
    expiryTime.setHours(expiryTime.getHours() + 24);
    localStorage.setItem('mentariLmsTokenExpiry', expiryTime.toISOString());
    sessionStorage.setItem('mentariLmsTokenExpiry', expiryTime.toISOString());
    tokenExpiryTime.value = expiryTime.toISOString();
}

export const loadTokenFromStorage = () => {
    const storedToken = localStorage.getItem('mentariLmsToken');
    const storedExpiryTime = localStorage.getItem('mentariLmsTokenExpiry');

    if (storedToken && storedExpiryTime) {
        const expiryTime = new Date(storedExpiryTime);
        const now = new Date();

        if (now < expiryTime) {
            bearerToken.value = storedToken;
            tokenExpiryTime.value = storedExpiryTime;
            return true; // Token valid
        } else {
            clearSession();
            return false; // Token expired
        }
    }
    return false; // No token
}

export const clearSession = () => {
    localStorage.removeItem('mentariLmsToken');
    localStorage.removeItem('mentariLmsTokenExpiry');
    bearerToken.value = '';
    tokenExpiryTime.value = null;
    courseData.value = [];
    courseDetails.value = null;
}