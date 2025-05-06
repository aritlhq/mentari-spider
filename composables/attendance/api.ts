import axios from "axios";
import { attendanceData, bearerToken, error, loading, loadingMeeting, meetingData, tokenExpiredMessage } from "./state";
import { saveTokenToStorage, clearSession } from "./storage";
import { retryRequest } from "./utils";


export const fetchAttendance = async () => {
    if (!bearerToken.value) {
        error.value = "Bearer token required";
        return;
    }

    // Save token to storage when fetching
    saveTokenToStorage(bearerToken.value);

    loading.value = true
    error.value = "";
    tokenExpiredMessage.value = "";

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
            })
            return response;
        }
        const response = await retryRequest(makeRequest);
        attendanceData.value = response.data
    } catch (e) {
        if (axios.isAxiosError(e)) {
            if (e.response?.status === 401) {
                tokenExpiredMessage.value = "Your tokens have expired. Please get new tokens."
                clearSession() // Clear session when token expired
            }
            error.value = e.response?.data?.message || 'Failed to retrieve data. Try again in a few moments.'
        } else {
            error.value = 'An unknown error occurred'
        }
    } finally {
        loading.value = false
    }
}

export const fetchMeetingDetails = async (idKelas: string, idMataKuliah: string) => {
    loadingMeeting.value = true
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
                timeout: 10000 // 10 seconds timeout
            })
            return response;
        }

        const response = await retryRequest(makeRequest);
        meetingData.value = response.data
    } catch (e) {
        if(axios.isAxiosError(e)) {
            error.value = e.response?.data?.message || 'Failed to retrieve encounter data. Try again in a while.'
        } else {
            error.value = "An error occured while retrieving meeting data."
        }
    } finally {
        loadingMeeting.value = false
    }
}