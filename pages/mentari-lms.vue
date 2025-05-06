<script setup lang="ts">
import { NuxtLayout } from '#components';
import { watch, onMounted } from 'vue';
import { useMentariLms } from '~/composables/useMentariLms';

const {
    bearerToken,
    courseData,
    loading,
    error,
    courseDetails,
    loadingDetails,
    tokenExpiredMessage,
    tokenExpiryTime,
    loadTokenFromStorage,
    clearSession,
    closeModalOnOutsideClick,
    fetchCourses,
    fetchCourseDetails,
    scrollToSection,
    scrollToTop,
    setupScrollButton,
    fetchPretest,
    pretestData,
    loadingPretest,
    closePretest,
    showPretestModal
} = useMentariLms();

const closePretestOnOutsideClick = (event: MouseEvent) => {
    const modal = document.querySelector('.pretest-modal-content');
    if (modal && !modal.contains(event.target as Node)) {
        closePretest();
    }
};

onMounted(() => {
    loadTokenFromStorage();
});

watch(courseDetails, (newVal) => {
    if (newVal) {
        setupScrollButton();
    }
});

const isPretestCompleted = computed(() => {
    if (!pretestData.value || !pretestData.value.data) return false;
    
    // Check if all questions have a non-null answer id.
    return pretestData.value.data.every((soal: { id_jawaban: string | null }) => soal.id_jawaban !== null && soal.id_jawaban !== '');
});
</script>

<template>
    <NuxtLayout>
        <div class="space-y-4">
            <div>
                <pre class="text-white">
+-----------------------------------------------------------+
|              MENTARI-SPIDER: AUTONOMOUS MODE              |
|-----------------------------------------------------------|
|  The system now runs without human interaction.           |
|  No clicks. No questions. Only execution.                 |
|                                                           |
|  Tasks are being handled silently in the background.      |
|  Bot engaged. Eyes open.                                  |
|                                                           |
|  You're no longer the user. You're the orchestrator.      |
+-----------------------------------------------------------+
                </pre>
                <div class="mb-4">
                    <h2 class="text-[#00b400] mb-2 text-xl">Enter Your Bearer Token</h2>
                    <p class="italic">If you don't know how to get bearer tokens</p>
                    <span class="italic">Checkout the tutorial on the <NuxtLink to="/dashboard"
                            class="underline text-yellow-500">>> Dashboard</NuxtLink></span>
                </div>
                <div class="space-x-4">
                    <input v-model="bearerToken" @keyup.enter="fetchCourses" type="password"
                        placeholder="Paste your bearer token here..."
                        class="w-2xl bg-black border border-[#00b400] text-[#00b400] p-[10px] mb-4 focus:outline-none focus:shadow-[#00b400] focus:shadow-md focus:ring-[#00b400]" />
                    <button @click="fetchCourses"
                        class="border px-2 py-2 text-lg cursor-pointer hover:shadow-[#00b400] hover:shadow-md border-[#00b400]">
                        Fetch Data
                    </button>
                    <button v-if="bearerToken" @click="clearSession"
                        class="border cursor-pointer px-2 py-2 text-lg hover:shadow-red-500 hover:shadow-md border-red-500 text-red-500">
                        Logout
                    </button>
                </div>
                <div v-if="tokenExpiredMessage" class="mt-2 text-red-500">
                    {{ tokenExpiredMessage }}
                </div>
                <div v-if="tokenExpiryTime" class="mt-2 text-[#00b400]">
                    Tokens will expire on: {{ new Date(tokenExpiryTime).toLocaleString() }}
                </div>
            </div>
            <div>
                <p class="text-[#00b400] mb-2">Output:</p>

                <div v-if="loading" class="text-[#00b400] animate-pulse">Taking data...</div>

                <div v-if="error" class="text-red-500">{{ error }}</div>

                <div v-if="courseData.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div v-for="course in courseData" :key="course.id" @click="fetchCourseDetails(course)"
                        class="bg-black p-4 border border-[#00b400] text-[#00b400] cursor-pointer hover:bg-[#001400] transition-colors">
                        <h3 class="text-lg font-bold mb-2">{{ course.nama_mata_kuliah || course.coursename }}</h3>
                        <div class="text-sm">
                            <p>Code: {{ course.kode_course }}</p>
                            <p>Class: {{ course.id_kelas }}</p>
                            <p>Credits: {{ course.sks }}</p>
                            <p>Lecturer: {{ course.nama_dosen }}</p>
                        </div>
                    </div>
                </div>

                <div v-if="courseDetails" @click="closeModalOnOutsideClick"
                    class="fixed inset-0 bg-black/80 flex items-center justify-center">
                    <div class="bg-black modal-content p-6 border border-[#00b400] max-w-6xl w-full mx-4">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-xl font-bold text-[#00b400]">Course Details: {{ courseDetails.coursename }}
                            </h3>
                            <button @click="courseDetails = null"
                                class="text-[#00b400] hover:text-white">&times;</button>
                        </div>
                        <div class="overflow-auto max-h-[70vh] relative" id="courseDetailsContainer">
                            <div v-if="courseDetails.data" class="text-white">
                                <div class="mb-4 p-2 bg-[#001400] rounded-md">
                                    <h4 class="text-[#00b400] mb-2">Quick Navigation:</h4>
                                    <div class="flex flex-wrap gap-2">
                                        <button v-for="(section, idx) in courseDetails.data" :key="idx"
                                            @click="scrollToSection(section.kode_section)"
                                            class="px-2 py-1 text-xs border border-[#00b400] cursor-pointer hover:bg-[#00b400] hover:text-black transition-colors rounded">
                                            {{ section.nama_section }}
                                        </button>
                                    </div>
                                </div>

                                <button id="backToTopBtn" @click="scrollToTop"
                                    class="fixed bottom-[160px] right-[450px] cursor-pointer border border-[#00b400] hover:text-black text-white px-3 py-3 shadow-lg bg-[#001400] hover:bg-[#00d400] transition-colors z-50 hidden">
                                    <span><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24">
                                            <path fill="currentColor"
                                                d="M13 19V7.83l4.88 4.88c.39.39 1.03.39 1.42 0a.996.996 0 0 0 0-1.41l-6.59-6.59a.996.996 0 0 0-1.41 0l-6.6 6.58a.996.996 0 1 0 1.41 1.41L11 7.83V19c0 .55.45 1 1 1s1-.45 1-1" />
                                        </svg></span>
                                </button>

                                <div v-for="(section, sectionIndex) in courseDetails.data" :key="sectionIndex"
                                    class="mb-6" :id="section.kode_section">
                                    <h4 class="text-lg font-semibold text-[#00b400] mb-2">{{ section.nama_section }}
                                    </h4>
                                    <div v-for="(subSection, subIndex) in section.sub_section" :key="subIndex"
                                        class="ml-4 mb-2 p-2 hover:bg-[#001400] transition-colors border-l-2 border-[#00b400]"
                                        :class="{
                                            'hidden': !section.nama_section.includes('UTS') &&
                                                !section.nama_section.includes('UAS') &&
                                                subSection.kode_template !== 'RPS' &&
                                                subSection.kode_template !== 'PRE_TEST' &&
                                                subSection.kode_template !== 'POST_TEST' &&
                                                subSection.kode_template !== 'BUKU_ISBN' &&
                                                subSection.kode_template !== 'FORUM_DISKUSI' &&
                                                subSection.kode_template !== 'KUESIONER'
                                        }">
                                        <div class="flex items-center">
                                            <span class="font-medium">{{ subSection.judul }}</span>
                                            <span v-if="subSection.completion"
                                                class="ml-2 text-green-500">(Completed)</span>
                                        </div>
                                        <div v-if="subSection.konten" class="mt-1 text-sm text-gray-400"
                                            v-html="subSection.konten"></div>
                                        <div v-if="subSection.link" class="mt-1">
                                            <a :href="subSection.link" target="_blank"
                                                class="text-blue-400 hover:underline text-sm">Open Resource</a>
                                        </div>
                                        <div v-if="subSection.warningAlert" class="mt-1 text-yellow-500 text-sm">
                                            {{ subSection.warningAlert }}
                                        </div>

                                        <!-- Pretest Button -->
                                        <div v-if="subSection.kode_template === 'PRE_TEST'" class="mt-2">
                                            <button @click="fetchPretest(subSection.id)"
                                                class="px-3 py-1 bg-[#001400] text-[#00b400] border border-[#00b400] hover:bg-[#00b400] hover:text-black transition-colors rounded text-sm">
                                                Buka Pretest
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div v-if="showPretestModal"
                                class="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                                @click="(event) => { closePretestOnOutsideClick(event); event.stopPropagation(); }">
                                <div
                                    class="bg-black p-6 border border-[#00b400] max-w-4xl w-full mx-4 overflow-auto max-h-[90vh] pretest-modal-content">
                                    <div class="flex justify-between items-center mb-4">
                                        <h3 class="text-xl font-bold text-[#00b400]">Pretest</h3>
                                        <button @click="closePretest"
                                            class="text-[#00b400] hover:text-white">&times;</button>
                                    </div>
                                    <div v-if="loadingPretest" class="text-[#00b400] animate-pulse">Loading pretest...
                                    </div>
                                    <div v-if="pretestData" class="text-white">
                                        <div v-if="pretestData.data && pretestData.data.length > 0" class="space-y-6">
                                            <div v-if="isPretestCompleted" class="bg-green-900/20 border border-green-500 p-4 rounded mb-4">
                                                <p class="text-green-500 font-bold">You have done this pretest before.</p>
                                            </div>
                                            
                                            <div v-for="(soal, index) in pretestData.data" :key="index"
                                                class="border border-gray-800 p-4 rounded">
                                                <div class="mb-2 font-medium">{{ index + 1 }}. <span
                                                        v-html="soal.deskripsi"></span></div>
                                                <div class="space-y-2 ml-6">
                                                    <div v-for="(jawaban, jIndex) in soal.list_jawaban" :key="jIndex"
                                                        class="flex items-start">
                                                        <input :id="`jawaban-${index}-${jIndex}`" type="radio"
                                                            :name="`soal-${index}`" :value="jawaban.id"
                                                            :checked="soal.id_jawaban === jawaban.id"
                                                            :disabled="isPretestCompleted"
                                                            class="mt-1 mr-2" />
                                                        <label :for="`jawaban-${index}-${jIndex}`" 
                                                            :class="{'text-gray-300': !isPretestCompleted, 'text-green-400': isPretestCompleted && soal.id_jawaban === jawaban.id, 'text-gray-500': isPretestCompleted && soal.id_jawaban !== jawaban.id}"
                                                            v-html="jawaban.jawaban"></label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="flex justify-end">
                                                <button
                                                    :disabled="isPretestCompleted"
                                                    :class="{'opacity-50 cursor-not-allowed': isPretestCompleted}"
                                                    class="px-4 py-2 bg-[#001400] text-[#00b400] border border-[#00b400] hover:bg-[#00b400] hover:text-black transition-colors rounded">
                                                    Submit Answer
                                                </button>
                                            </div>
                                        </div>
                                        <div v-else class="text-yellow-500">There were no pretest questions available.</div>
                                    </div>
                                    <div v-else class="text-red-500">{{ error || 'Failed to load pretest data' }}</div>
                                </div>
                            </div>

                            <div v-if="courseDetails.peserta && courseDetails.peserta.length > 0" class="mt-6">
                                <h4 class="text-lg font-semibold text-[#00b400] mb-2">Participants ({{
                                    courseDetails.peserta.length }})</h4>
                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                    <div v-for="(student, index) in courseDetails.peserta" :key="index"
                                        class="text-sm p-2 border border-gray-800">
                                        <p><span class="text-gray-400">NIM:</span> {{ student.nim }}</p>
                                        <p><span class="text-gray-400">Name:</span> {{ student.nama_mahasiswa }}</p>
                                        <p><span class="text-gray-400">Email:</span> {{ student.alamat_email }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="loadingDetails" class="fixed inset-0 bg-black/80 flex items-center justify-center">
                    <div class="text-[#00b400] animate-pulse text-xl">
                        Taking course details...
                    </div>
                </div>
            </div>
        </div>
    </NuxtLayout>
</template>