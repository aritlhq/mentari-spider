<script lang="ts">
import AppNavbar from '../components/AppNavbar.vue';
</script>

<template>
    <div class="min-h-screen px-10 py-8 flex-col">
        <AppNavbar/>
        <slot/>
    </div>
</template>