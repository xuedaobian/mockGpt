<script setup>
import TextareaItem from './TextareaItem.vue';
import RichTextList from './RichTextList.vue';
import { ref } from 'vue';

const input = ref({});

const getInput = (value) => {
  input.value = {
    message: value,
    type: 'user'
  }
  // add a message to model
}
</script>

<template>
  <div>
    <RichTextList :newMessage="input" />
    <TextareaItem @output="getInput" />
  </div>
</template>