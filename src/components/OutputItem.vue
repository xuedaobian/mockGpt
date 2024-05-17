<template>
  <div v-html="renderedMarkdown" class="max-w-screen-md text-left"></div>
</template>

<script setup>
import { ref, onMounted, render } from 'vue';
import MarkdownIt from 'markdown-it';
import { fetchEventSource } from '@microsoft/fetch-event-source';


const markdown = ref('');
const renderedMarkdown = ref('');
const marked = new MarkdownIt();

onMounted(async () => {
  await fetchEventSource('http://localhost:3000/stream', {
    onmessage(ev) {
      if(ev.data === '<br>') {
        markdown.value += '\n ';
      } else {
        markdown.value += ev.data;
      }
      const markOptions = {
        breaks: true,
      };
      renderedMarkdown.value = marked.render(markdown.value, markOptions);
    },
    onclose() {
      console.log('Connection closed');
    },
  });
  // renderedMarkdown.value = marked.render('这通常是由于以下几个原因造成的：\n \n 1. **包未安装**：你可能没有安装 ');
});


</script>