<template>
  <div v-html="renderMarkdown" class="max-w-screen-md text-left"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css';
import markdownIt from 'markdown-it'

const mdInstance = new markdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (code, lang) {
    // 为代码块添加高亮样式和背景色
    const hljsLang = hljs.getLanguage(lang) ? lang : 'plaintext'
    return `<pre><div class="code-container"><code class="language-${hljsLang}">${hljs.highlight(code, { language: hljsLang }).value}</code></div></pre>`
  }
})

const markdown = ref('');
const renderMarkdown = ref('')

onMounted(async () => {
  await fetchEventSource('http://localhost:3000/stream', {
    onmessage(ev) {
      const data = JSON.parse(ev.data);
      if (data.event === 'all_done') {
        // 发送完毕
      } else {
        markdown.value += data.text
      }
      // 使用 markdown-it 渲染 markdown
      // 自定义 fence 规则以为代码块添加底色
      // mdInstance.renderer.rules.fence = function (tokens, idx, options, env, slf) {
      //   const token = tokens[idx]
      //   const langName = token.info ? mdInstance.utils.unescapeAll(token.info).trim() : ''
      //   const langClass = langName ? ` class="language-${langName}"` : ''
      //   const code = token.content.trim();
      //   return `<pre${langClass}><code${langClass}>${code}</code></pre>`
      // }
      renderMarkdown.value = mdInstance.render(markdown.value)
    },
    onclose() {
      console.log('closed')
    },
  });
});


</script>
<style>
.code-container {
  background: rgb(40, 44, 52);
  color: rgb(171, 178, 191);
  text-shadow: rgba(0, 0, 0, 0.3) 0px 1px;
  font-family: "Fira Code", "Fira Mono", Menlo, Consolas, "DejaVu Sans Mono", monospace;
  direction: ltr;
  text-align: left;
  white-space: pre;
  word-spacing: normal;
  word-break: normal;
  line-height: 1.5;
  tab-size: 2;
  hyphens: none;
  padding: 1em;
  margin: 0.5em 0px;
  overflow: auto;
  border-radius: 0.3em;
}

pre code {
  background: rgb(40, 44, 52);
  color: rgb(171, 178, 191);
  text-shadow: rgba(0, 0, 0, 0.3) 0px 1px;
  font-family: "Fira Code", "Fira Mono", Menlo, Consolas, "DejaVu Sans Mono", monospace;
  direction: ltr;
  text-align: left;
  white-space: pre;
  word-spacing: normal;
  word-break: normal;
  line-height: 1.5;
  tab-size: 2;
  hyphens: none;
}
</style>