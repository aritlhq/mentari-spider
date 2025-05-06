import { ref } from 'vue'
import type { Course, CourseDetails } from '~/types/mentari-lms'

// State variables
export const bearerToken = ref('');
export const courseData = ref<Course[]>([]);
export const loading = ref(false);
export const error = ref('');
export const courseDetails = ref<CourseDetails | null>(null);
export const loadingDetails = ref(false);
export const tokenExpiredMessage = ref('');
export const tokenExpiryTime = ref<string | null>(null);
export const pretestData = ref<any>(null);
export const showPretestModal = ref(false);
export const loadingPretest = ref(false);