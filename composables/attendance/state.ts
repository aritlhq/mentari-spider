import { ref } from 'vue'

// State variables
export const bearerToken = ref('');
export const attendanceData = ref([]);
export const loading = ref(false);
export const error = ref('');
export const meetingData = ref(null);
export const loadingMeeting = ref(false);
export const tokenExpiredMessage = ref('');
export const tokenExpiryTime = ref<string | null>(null);