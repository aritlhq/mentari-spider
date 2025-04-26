<script setup lang="ts">
import AppAuthModal from './AppAuthModal.vue'

import { ref } from 'vue'

const showModal = ref(false)

const handleBearerSubmit = () => {
    showModal.value = false
}
</script>

<template>
    <div class="flex gap-20 mb-20">
        <NuxtLink to="/" class="btn-green"><< Back to Home</NuxtLink>
        <div class="flex gap-4">
            <NuxtLink to="/dashboard" class="btn-green">Dashboard</NuxtLink>
            <NuxtLink to="/attendance" class="btn-green">Attendance</NuxtLink>
            <NuxtLink to="/mentari-lms" class="btn-green">Mentari LMS</NuxtLink>
            <!-- <button @click="showModal = true" class="btn-green">Fetch your Data</button> -->
        </div>

        <!-- <AuthModal v-if="showModal" @close="showModal = false" @submit="handleBearerSubmit"/> -->
    </div>
</template>