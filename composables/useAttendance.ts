import { ref } from 'vue';
import axios from 'axios';

export function useAttendance() {
    const bearerToken = ref('');
    const attendanceData = ref([]);
    const loading = ref(false);
    const error = ref('');
    const meetingData = ref(null);
    const loadingMeeting = ref(false);
    const tokenExpiredMessage = ref('');
    const tokenExpiryTime = ref<string | null>(null);

    // Format date function
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Token management functions
    const saveTokenToStorage = (token: string) => {
        localStorage.setItem('bearerToken', token);
        sessionStorage.setItem('bearerToken', token);
        bearerToken.value = token;
        
        const expiryTime = new Date();
        expiryTime.setHours(expiryTime.getHours() + 24);
        localStorage.setItem('tokenExpiryTime', expiryTime.toISOString());
        sessionStorage.setItem('tokenExpiryTime', expiryTime.toISOString());
        tokenExpiryTime.value = expiryTime.toISOString();
    }

    const loadTokenFromStorage = () => {
        const storedToken = localStorage.getItem('bearerToken');
        const storedExpiryTime = localStorage.getItem('tokenExpiryTime');
        
        if (storedToken && storedExpiryTime) {
            const expiryTime = new Date(storedExpiryTime);
            const now = new Date();
            
            if (now < expiryTime) {
                bearerToken.value = storedToken;
                tokenExpiryTime.value = storedExpiryTime;
                // Automatically fetch data if token is available
                fetchAttendance();
            } else {
                // Token has expired
                clearSession();
                tokenExpiredMessage.value = 'Your tokens have expired. Please get new tokens.';
            }
        }
    }

    const clearSession = () => {
        localStorage.removeItem('bearerToken');
        localStorage.removeItem('tokenExpiryTime');
        bearerToken.value = '';
        tokenExpiryTime.value = null;
        attendanceData.value = [];
        meetingData.value = null;
    }

    const getStatusClass = (status: string) => {
        return {
            'hadir': 'text-yellow-500',
            'null': 'text-red-500'
        }[status] || 'text-red-500';
    }

    // Function to delay
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // Function to retry
    const retryRequest = async (fn: Function, retries = 3, delayMs = 1000) => {
        for (let i = 0; i < retries; i++) {
            try {
                return await fn();
            } catch (e) {
                if (i === retries - 1) throw e;
                await delay(delayMs * (i + 1)); // Exponential backoff
            }
        }
    };

    const fetchAttendance = async () => {
        if (!bearerToken.value) {
            error.value = 'Bearer token required';
            return;
        }

        // Save token to storage when fetching
        saveTokenToStorage(bearerToken.value);
        
        loading.value = true;
        error.value = '';
        tokenExpiredMessage.value = '';

        try {
            const makeRequest = async () => {
                const response = await axios.get('https://my.unpam.ac.id/api/presensi/mahasiswa/jadwal-kuliah', {
                    headers: {
                        'Authorization': `Bearer ${bearerToken.value}`,
                        'Content-Type': 'application/json',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        'Accept': 'application/json, text/plain, */*',
                        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                        'Origin': 'https://my.unpam.ac.id',
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache',
                        'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
                        'Sec-Ch-Ua-Mobile': '?0',
                        'Sec-Ch-Ua-Platform': '"Windows"'
                    },
                    timeout: 10000 // 10 seconds timeout
                });
                return response;
            };

            const response = await retryRequest(makeRequest);
            attendanceData.value = response.data;
        } catch (e) {
            if (axios.isAxiosError(e)) {
                if (e.response?.status === 401) {
                    tokenExpiredMessage.value = 'Your tokens have expired. Please get new tokens.';
                    clearSession(); // Clear session when token expires
                }
                error.value = e.response?.data?.message || 'Failed to retrieve data. Try again in a few moments.';
            } else {
                error.value = 'An unknown error occurred';
            }
        } finally {
            loading.value = false;
        }
    }

    const fetchMeetingDetails = async (idKelas: string, idMataKuliah: string) => {
        loadingMeeting.value = true;
        try {
            const makeRequest = async () => {
                const response = await axios.get(`https://my.unpam.ac.id/api/presensi/mahasiswa/jadwal-pertemuan/${idKelas}/${idMataKuliah}`, {
                    headers: {
                        'Authorization': `Bearer ${bearerToken.value}`,
                        'Content-Type': 'application/json',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        'Accept': 'application/json, text/plain, */*',
                        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                        'Origin': 'https://my.unpam.ac.id',
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache',
                        'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
                        'Sec-Ch-Ua-Mobile': '?0',
                        'Sec-Ch-Ua-Platform': '"Windows"'
                    },
                    timeout: 10000
                });
                return response;
            };

            const response = await retryRequest(makeRequest);
            meetingData.value = response.data;
        } catch (e) {
            if (axios.isAxiosError(e)) {
                error.value = e.response?.data?.message || 'Failed to retrieve encounter data. Try again in a while.';
            } else {
                error.value = 'An error occurred while retrieving meeting data';
            }
        } finally {
            loadingMeeting.value = false;
        }
    }

    const closeModalOnOutsideClick = (event: MouseEvent) => {
        const modal = document.querySelector('.modal-content');
        if (modal && !modal.contains(event.target as Node)) {
            meetingData.value = null;
        }
    }

    return {
        bearerToken,
        attendanceData,
        loading,
        error,
        meetingData,
        loadingMeeting,
        tokenExpiredMessage,
        tokenExpiryTime,
        formatDate,
        saveTokenToStorage,
        loadTokenFromStorage,
        clearSession,
        getStatusClass,
        fetchAttendance,
        fetchMeetingDetails,
        closeModalOnOutsideClick
    }
}