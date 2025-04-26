<script setup lang="ts">
const emit = defineEmits(['close', 'submit'])
const bearerCode = ref('')

const handleSubmit = () => {
  emit('submit', bearerCode.value)
  bearerCode.value = ''
}
</script>

<template>
  <div class="fixed inset-0 bg-black/70 flex items-center justify-center">
    <div class="bg-[#000100] border border-[#00b400] p-6 rounded-lg w-96">
      <h2 class="text-[#00b400] text-xl mb-4">Enter Your Bearer Code</h2>
      <input 
        v-model="bearerCode"
        type="text"
        placeholder="Paste your bearer code here..."
        class="w-full bg-black border border-[#00b400] text-[#00b400] p-2 mb-4 focus:outline-none focus:ring-1 focus:ring-[#00b400]"
      />
      <div class="flex justify-end gap-2">
        <button 
          @click="emit('close')"
          class="btn-green"
        >
          Cancel
        </button>
        <button 
          @click="handleSubmit"
          class="btn-green"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
</template>