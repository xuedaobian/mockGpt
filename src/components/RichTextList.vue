<script setup>
import { ref, watch } from 'vue'

const props = defineProps(['newMessage'])

const msgList = ref([
  {
    message: 'Hello, how can I help you?',
    type: 'bot'
  }
])

// 监听 newMessage 的变化
watch(() => props.newMessage, (newVal) => {
  console.log("🚀 ~ watch ~ newVal:", newVal.message)
  
  if (newVal.message) {
    msgList.value.push(newVal)
  }
})
</script>

<template>
  <div class="flex flex-col">
    <div class="rich-text" v-for="msg of msgList" :key="msg.message"
      :class="msg.type == 'bot' ? 'bot-message' : 'user-message'">
      <div class="flex">
        <div class="type-icon"></div>
        <div class="">
          <div class="send-user"></div>
          <div class="message">{{ msg.message }}</div>
        </div>
      </div>
    </div>
  </div>
</template>