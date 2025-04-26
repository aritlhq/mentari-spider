import { ref, nextTick } from 'vue';
import axios from 'axios';
import type { Course, CourseDetails } from '~/types/mentari-lms';

export function useMentariLms() {
    const bearerToken = ref('');
    const courseData = ref<Course[]>([]);
    const loading = ref(false);
    const error = ref('');
    const courseDetails = ref<CourseDetails | null>(null);
    const loadingDetails = ref(false);
    const tokenExpiredMessage = ref('');
    const tokenExpiryTime = ref<string | null>(null);

    const saveTokenToStorage = (token: string) => {
        localStorage.setItem('mentariLmsToken', token);
        sessionStorage.setItem('mentariLmsToken', token);
        bearerToken.value = token;
        
        const expiryTime = new Date();
        expiryTime.setHours(expiryTime.getHours() + 24);
        localStorage.setItem('mentariLmsTokenExpiry', expiryTime.toISOString());
        sessionStorage.setItem('mentariLmsTokenExpiry', expiryTime.toISOString());
        tokenExpiryTime.value = expiryTime.toISOString();
    }

    const loadTokenFromStorage = () => {
        const storedToken = localStorage.getItem('mentariLmsToken');
        const storedExpiryTime = localStorage.getItem('mentariLmsTokenExpiry');
        
        if (storedToken && storedExpiryTime) {
            const expiryTime = new Date(storedExpiryTime);
            const now = new Date();
            
            if (now < expiryTime) {
                bearerToken.value = storedToken;
                tokenExpiryTime.value = storedExpiryTime;
                fetchCourses();
            } else {
                clearSession();
                tokenExpiredMessage.value = 'Your tokens have expired. Please get new tokens.';
            }
        }
    }

    const clearSession = () => {
        localStorage.removeItem('mentariLmsToken');
        localStorage.removeItem('mentariLmsTokenExpiry');
        bearerToken.value = '';
        tokenExpiryTime.value = null;
        courseData.value = [];
        courseDetails.value = null;
    }

    const closeModalOnOutsideClick = (event: MouseEvent) => {
        const modal = document.querySelector('.modal-content');
        if (modal && !modal.contains(event.target as Node)) {
            courseDetails.value = null;
        }
    }

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const retryRequest = async (fn: Function, retries = 3, delayMs = 1000) => {
        for (let i = 0; i < retries; i++) {
            try {
                return await fn();
            } catch (e) {
                if (i === retries - 1) throw e;
                await delay(delayMs * (i + 1));
            }
        }
    };

    const fetchCourses = async () => {
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
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        'Accept': 'application/json, text/plain, */*',
                        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                        'Origin': 'https://mentari.unpam.ac.id',
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

    const fetchCourseDetails = async (course: Course) => {
        loadingDetails.value = true;
        try {
            const makeRequest = async () => {
                const response = await axios.request({
                    method: 'GET',
                    url: `/api/mentari/user-course/${course.kode_course}`,
                    headers: {
                        'Authorization': `Bearer ${bearerToken.value}`,
                        'Content-Type': 'application/json',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        'Accept': 'application/json, text/plain, */*',
                        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                        'Origin': 'https://mentari.unpam.ac.id',
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

    const scrollToSection = (sectionId: string) => {
        nextTick(() => {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    const scrollToTop = () => {
        const container = document.getElementById('courseDetailsContainer');
        if (container) {
            container.scrollTop = 0;
        }
    }

    const setupScrollButton = () => {
        nextTick(() => {
            const container = document.getElementById('courseDetailsContainer');
            const backToTopBtn = document.getElementById('backToTopBtn');
            
            if (container && backToTopBtn) {
                container.addEventListener('scroll', () => {
                    if (container.scrollTop > 300) {
                        backToTopBtn.classList.remove('hidden');
                    } else {
                        backToTopBtn.classList.add('hidden');
                    }
                });
            }
        });
    }

    return {
        bearerToken,
        courseData,
        loading,
        error,
        courseDetails,
        loadingDetails,
        tokenExpiredMessage,
        tokenExpiryTime,
        saveTokenToStorage,
        loadTokenFromStorage,
        clearSession,
        closeModalOnOutsideClick,
        fetchCourses,
        fetchCourseDetails,
        scrollToSection,
        scrollToTop,
        setupScrollButton
    };
}