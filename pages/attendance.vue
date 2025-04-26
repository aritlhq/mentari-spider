<script setup lang="ts">
import type { MeetingDetails } from '~/types/attendace';
import { NuxtLayout } from '#components';
import { onMounted } from 'vue';

// Menggunakan composable attendance
const {
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
} = useAttendance();

// Call loadTokenFromStorage when the component is mounted
onMounted(() => {
    loadTokenFromStorage();
});
</script>

<template>
    <NuxtLayout>
        <div class="space-y-4">
            <div>
                <pre class="text-white">
+-----------------------------------------------------------+
|              MENTARI-SPIDER: ATTENDANCE RECON             |
|-----------------------------------------------------------|
|  Scanning presence logs from the LMS system.              |
|  Extracting attendance records with precision.            |
|                                                           |
|  This is digital reconnaissance.                          |
|  You don't ask the system. You take from it.              |
+-----------------------------------------------------------+
                </pre>
                <div class="mb-4">
                    <h2 class="text-[#00b400] mb-2 text-xl">Enter Your Bearer Token</h2>
                    <p class="italic">If you don't know how to get bearer tokens</p>
                    <span class="italic">Checkout the tutorial on the <NuxtLink to="/dashboard"
                            class="underline text-yellow-500">>> Dashboard</NuxtLink></span>
                </div>
                <div class="space-x-4">
                    <input v-model="bearerToken" @keyup.enter="fetchAttendance" type="password"
                        placeholder="Paste your bearer token here..."
                        class="w-2xl bg-black border border-[#00b400] text-[#00b400] p-[10px] mb-4 focus:outline-none focus:shadow-[#00b400] focus:shadow-md focus:ring-[#00b400]" />
                    <button @click="fetchAttendance"
                        class="border px-2 py-2 text-lg cursor-pointer hover:shadow-[#00b400] hover:shadow-md border-[#00b400]">
                        Fetch Data
                    </button>
                    <button v-if="bearerToken" @click="clearSession"
                        class="border px-2 py-2 cursor-pointer text-lg hover:shadow-red-500 hover:shadow-md border-red-500 text-red-500">
                        Logout
                    </button>
                </div>
                <!-- Add expired token message and expiration time info -->
                <div v-if="tokenExpiredMessage" class="mt-2 text-red-500">
                    {{ tokenExpiredMessage }}
                </div>
                <div v-if="tokenExpiryTime" class="mt-2 text-[#00b400]">
                    Tokens will expire on: {{ new Date(tokenExpiryTime).toLocaleString() }}
                </div>
            </div>
            <div>
                <p class="text-[#00b400] mb-2">Output:</p>

                <!-- Loading State -->
                <div v-if="loading" class="text-[#00b400] animate-pulse">Taking data...</div>

                <!-- Error State -->
                <div v-if="error" class="text-red-500">{{ error }}</div>

                <!-- Card Grid -->
                <div v-if="attendanceData.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div v-for="subject in attendanceData as any[]" :key="subject.id_mata_kuliah"
                        @click="fetchMeetingDetails(subject.id_kelas, subject.id_mata_kuliah)"
                        class="bg-black p-4 border border-[#00b400] text-[#00b400] cursor-pointer hover:bg-[#001400] transition-colors">
                        <h3 class="text-lg font-bold mb-2">{{ subject.nama_mata_kuliah }}</h3>
                        <div class="text-sm">
                            <p>Code: {{ subject.id_mata_kuliah }}</p>
                            <p>Class: {{ subject.id_kelas }}</p>
                            <p>Credits: {{ subject.sks }}</p>
                            <!-- <p class="mt-2 text-yellow-500">Meeting {{ subject.pertemuan_ke || 'N/A' }}</p> -->
                        </div>
                    </div>
                </div>

                <!-- Meeting Details Modal -->
                <div v-if="meetingData" @click="closeModalOnOutsideClick"
                    class="fixed inset-0 bg-black/80 flex items-center justify-center">
                    <div class="bg-black modal-content p-6 border border-[#00b400] max-w-6xl w-full mx-4">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-xl font-bold text-[#00b400]">Meeting Details</h3>
                            <button @click="meetingData = null" class="text-[#00b400] hover:text-white">&times;</button>
                        </div>
                        <div class="overflow-auto max-h-[70vh] grid-cols-1 md:grid-cols-2 gap-x-4 grid">
                            <div v-for="(meeting, index) in meetingData as MeetingDetails[]" :key="index"
                                class="mb-4 p-4 border border-[#00b400] rounded">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 class="text-[#00b400] font-bold mb-2">Meeting {{ index + 1 }}</h4>
                                        <p class="text-white">
                                            <span class="text-[#00b400]">Status: </span>
                                            <span :class="getStatusClass(meeting.presensi_status)">
                                                {{ meeting.presensi_status === "hadir" ? "Present" : "Absent" }}
                                            </span>
                                        </p>
                                        <p class="text-white"><span class="text-[#00b400]">Type:</span> {{
                                            meeting.jenis_perkuliahan }}</p>
                                        <p class="text-white"><span class="text-[#00b400]">Time:</span> {{
                                            meeting.ket_jam }}</p>
                                        <p class="text-white"><span class="text-[#00b400]">Start Date:</span> {{
                                            formatDate(meeting.tanggal_mulai) }}</p>
                                        <p class="text-white"><span class="text-[#00b400]">End Date:</span> {{
                                            formatDate(meeting.tanggal_akhir) }}</p>
                                    </div>
                                    <div>
                                        <p class="text-white"><span class="text-[#00b400]">Marked By:</span> {{
                                            meeting.presensi_by }}</p>
                                        <p class="text-white"><span class="text-[#00b400]">Marked On:</span> {{ new
                                            Date(meeting.presensi_date).toLocaleString() }}</p>
                                    </div>
                                </div>
                                <div class="mt-4">
                                    <p class="text-white"><span class="text-[#00b400]">Class:</span> {{ meeting.id_kelas
                                    }}</p>
                                    <p class="text-white"><span class="text-[#00b400]">Course ID:</span> {{
                                        meeting.id_mata_kuliah }}</p>
                                    <p class="text-white"><span class="text-[#00b400]">Semester:</span> {{
                                        meeting.id_semester_registrasi }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Meeting Loading State -->
                <div v-if="loadingMeeting" class="fixed inset-0 bg-black/80 flex items-center justify-center">
                    <div class="text-[#00b400] animate-pulse text-xl">
                        Taking meeting data...
                    </div>
                </div>
            </div>
        </div>
    </NuxtLayout>
</template>