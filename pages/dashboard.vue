<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { NuxtLayout } from '#components';
import { codeToHtml } from 'shiki';

const tokenCode1 = ref('');
const tokenCode2 = ref('');
const rawCode1 = `console.log((localStorage.getItem('access_token')?.split('|')[1]) || 'Token Not Found!');`;
const rawCode2 = `try {
  console.log(JSON.parse(localStorage.getItem('access'))?.[0]?.token || 'Token not found.');
} catch {
  console.error('Invalid access data.');
}`;

// Copy states
const copied1 = ref(false);
const copied2 = ref(false);

// Copy to clipboard function
const copyToClipboard = (text: string, buttonNum: number) => {
  navigator.clipboard.writeText(text)
    .then(() => {
      if (buttonNum === 1) {
        copied1.value = true;
        setTimeout(() => { copied1.value = false; }, 2000);
      } else {
        copied2.value = true;
        setTimeout(() => { copied2.value = false; }, 2000);
      }
    })
    .catch(err => {
      console.error('Failed to copy:', err);
    });
};

onMounted(async () => {
  tokenCode1.value = await codeToHtml(
    rawCode1, 
    {
      lang: 'typescript',
      theme: 'vitesse-dark'
    }
  );
  
  tokenCode2.value = await codeToHtml(
    rawCode2, 
    {
      lang: 'typescript',
      theme: 'vitesse-dark'
    }
  );
});
</script>

<template>
  <NuxtLayout>
    <div class="p-4">
      <h1 class="text-2xl font-bold text-[#00b400] mb-4">How to Get Bearer Token</h1>
      
      <div class="mb-6">
        <h2 class="text-xl mb-2">My Unpam: Using access_token</h2>
        <p class="mb-2">Open browser console <span class="bg-[#818181] text-black px-2 py-[2px] rounded text-sm font-semibold">ctrl</span>+<span class="bg-[#818181] text-black px-2 py-[2px] rounded text-sm font-semibold">shift</span>+<span class="bg-[#818181] text-black px-2 py-[2px] rounded text-sm font-semibold">c</span> and run this code:</p>
        <div class="bg-[#121212] p-4 rounded-md mb-2 relative">
          <div v-html="tokenCode1"></div>
          <button 
            @click="copyToClipboard(rawCode1, 1)" 
            class="absolute cursor-pointer top-2 right-2 bg-[#818181] text-black px-2 py-1 rounded text-xs hover:bg-[#616161] transition-colors font-semibold"
          >
            {{ copied1 ? 'Copied' : 'Copy' }}
          </button>
        </div>
        <p class="text-sm text-gray-400">This code retrieves the token from localStorage and displays it in the console.</p>
      </div>
      
      <div class="mb-6">
        <h2 class="text-xl mb-2">Mentari LMS: Using access object</h2>
        <p class="mb-2">Alternatively, run this code in the browser console:</p>
        <div class="bg-[#121212] p-4 rounded-md mb-2 relative">
          <div v-html="tokenCode2"></div>
          <button 
            @click="copyToClipboard(rawCode2, 2)" 
            class="absolute cursor-pointer top-2 right-2 bg-[#818181] text-black px-2 py-1 rounded text-xs hover:bg-[#616161] transition-colors font-semibold"
          >
            {{ copied2 ? 'Copied' : 'Copy' }}
          </button>
        </div>
        <p class="text-sm text-gray-400">This code attempts to retrieve the token from the access object in localStorage.</p>
      </div>
      
      <div class="mt-4 p-4 border border-yellow-500 rounded-md bg-yellow-900/20">
        <h3 class="text-yellow-500 font-bold">Important Notes:</h3>
        <ul class="list-disc pl-5 text-yellow-400">
          <li>Copy the token that appears in the console</li>
          <li>Paste the token in the Mentari-LMS page</li>
          <li>Tokens typically expire after 24 hours</li>
          <li>Do not share your token with others</li>
        </ul>
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped>
:deep(pre) {
  margin: 0;
  padding: 0;
}

:deep(code) {
  font-family: 'Fira Code', monospace;
  font-size: 14px;
  line-height: 1.5;
}
</style>