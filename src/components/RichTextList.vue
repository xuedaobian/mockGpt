<script setup>
import { ref, watch, onMounted } from 'vue'
import OutputItem from './OutputItem.vue'

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

// onMounted(() => {
//   const eventSource = new EventSource('http://localhost:3000/stream');
//   eventSource.onmessage = function (event) {
//     console.log(event.data);
//   };
// })
</script>

<template>
  <div class="flex flex-col">
    <div class="rich-text" v-for="msg of msgList" :key="msg.message"
      :class="msg.type == 'bot' ? 'bot-message' : 'user-message'">
      <div class="flex">
        <div class="type-icon"></div>
        <div class="">
          <div class="send-user"></div>
          <!-- <div class="message">{{ msg.message }}</div> -->
          <OutputItem :message="msg.message" />
        </div>
      </div>
    </div>
  </div>
</template>