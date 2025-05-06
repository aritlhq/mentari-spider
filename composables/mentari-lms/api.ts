import axios from 'axios';
import { bearerToken, courseData, loading, error, courseDetails, loadingDetails, 
         tokenExpiredMessage, pretestData, showPretestModal, loadingPretest } from './state';
import { retryRequest } from './utils';
import { saveTokenToStorage, clearSession } from './storage';
import type { Course } from '~/types/mentari-lms';

export const fetchCourses = async () => {
    if (!bearerToken.value) {
        error.value = 'Bearer token required';
        return;
    }

    saveTokenToStorage(bearerToken.value);

    loading.value = true;
    error.value = '';
    tokenExpiredMessage.value = '';

    try {
        const makeRequest = async () => {
            const response = await axios.request({
                method: 'GET',
                url: '/api/mentari/user-course',
                params: { page: '1', limit: '12' },
                headers: {
                    'Authorization': `Bearer ${bearerToken.value}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json, text/plain, */*',
                    'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                },
                timeout: 10000
            });
            return response;
        };

        const response = await retryRequest(makeRequest);
        courseData.value = response.data.data || [];
    } catch (e) {
        if (axios.isAxiosError(e)) {
            if (e.response?.status === 401) {
                tokenExpiredMessage.value = 'Your tokens have expired. Please get new tokens.';
                clearSession();
            }
            error.value = e.response?.data?.message || 'Failed to retrieve data. Try again in a few moments.';
        } else {
            error.value = 'An unknown error occurred';
        }
    } finally {
        loading.value = false;
    }
}

export const fetchCourseDetails = async (course: Course) => {
    loadingDetails.value = true;
    try {
        const makeRequest = async () => {
            const response = await axios.request({
                method: 'GET',
                url: `/api/mentari/user-course/${course.kode_course}`,
                headers: {
                    'Authorization': `Bearer ${bearerToken.value}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json, text/plain, */*',
                    'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                },
                timeout: 10000
            });
            return response;
        };

        const response = await retryRequest(makeRequest);
        courseDetails.value = response.data;
    } catch (e) {
        if (axios.isAxiosError(e)) {
            error.value = e.response?.data?.message || 'Failed to retrieve course details. Try again in a while.';
        } else {
            error.value = 'An error occurred while retrieving course details';
        }
    } finally {
        loadingDetails.value = false;
    }
}

export const fetchPretest = async (pretestId: string) => {
    loadingPretest.value = true;
    showPretestModal.value = true;
    pretestData.value = null;

    try {
        const makeRequest = async () => {
            const response = await axios.request({
                method: 'GET',
                url: `/api/quiz/soal/${pretestId}`,
                headers: {
                    'Authorization': `Bearer ${bearerToken.value}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json, text/plain, */*',
                    'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                },
                timeout: 10000
            })
            return response;
        }

        const response = await retryRequest(makeRequest);
        pretestData.value = response.data;
    } catch (e) {
        if(axios.isAxiosError(e)) {
            if(e.response?.status === 401) {
                tokenExpiredMessage.value = 'Your tokens have expired. Please get new tokens.';
                clearSession();
            }
            error.value = e.response?.data?.message || 'Failed to retrieve pretest. Try again in a few moments.';
        } else {
            error.value = "An error occured while retrieving pretest data"
        }
    } finally {
        loadingPretest.value = false;
    }
}