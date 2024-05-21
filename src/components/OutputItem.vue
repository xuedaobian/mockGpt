<template>
  <div class="full-out">
    <div v-html="renderMarkdown" class="max-w-screen-md text-left"> </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchEventSource } from '@microsoft/fetch-event-source';
// import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark-dimmed.css';
import markdownIt from 'markdown-it'

const mdInstance = new markdownIt({
  html: true,
  linkify: true,
  highlight: function (code, lang) {
    // 为代码块添加高亮样式和背景色
    const hljsLang = hljs.getLanguage(lang) ? lang : 'plaintext'
    return `<pre class="code-pre"><div class="relative py-2"><button class="copy-btn">复制</button><div class="code-content"><code class="language-${hljsLang}">${hljs.highlight(code, { language: hljsLang }).value}</code></div></div></pre>`
  }
});

const markdown = ref('');
const renderMarkdown = ref('')

onMounted(async () => {
  await fetchEventSource('http://localhost:3000/stream', {
    onmessage(ev) {
      const data = JSON.parse(ev.data);
      markdown.value += data.text
      renderMarkdown.value = mdInstance.render(markdown.value)
    },
    onclose() {
      setTimeout(() => {
        // 发送完毕，为 复制 按钮添加点击事件
        document.querySelectorAll('.code-pre').forEach((el) => {
          const copyBtn = el.querySelector('.copy-btn')
          const codeContent = el.querySelector('code')
          copyBtn?.addEventListener('click', () => {
            navigator.clipboard.writeText(codeContent.innerText).then(() => {
              copyBtn.innerText = '复制成功'
              setTimeout(() => {
                copyBtn.innerText = '复制'
              }, 1000)
            })
          })
        })
      }, 200);
    },
  });
});

</script>
<style>
.full-out {

  ul,
  ol,
  .menu {
    list-style: revert;
    padding: revert;
    margin: revert;
  }
}

.code-content {
  background: rgb(40, 44, 52);
  color: rgb(171, 178, 191);
  text-shadow: rgba(0, 0, 0, 0.3) 0px 1px;
  font-family: "Fira Code", "Fira Mono", Menlo, Consolas, "DejaVu Sans Mono", monospace;
  direction: ltr;
  text-align: left;
  white-space: pre-wrap;
  word-spacing: normal;
  word-break: normal;
  line-height: 1.5;
  tab-size: 2;
  hyphens: none;
  padding: 1em;
  margin: 0.5em 0px;
  border-radius: 0.3em;
  word-wrap: break-word;
  max-width: 100%;
}

pre code {
  background: rgb(40, 44, 52);
  color: rgb(171, 178, 191);
  text-shadow: rgba(0, 0, 0, 0.3) 0px 1px;
  font-family: "Fira Code", "Fira Mono", Menlo, Consolas, "DejaVu Sans Mono", monospace;
  direction: ltr;
  text-align: left;
  white-space: pre-wrap;
  word-spacing: normal;
  word-break: normal;
  line-height: 1.5;
  tab-size: 2;
  hyphens: none;
  max-width: 100%;
  word-wrap: break-word;
}

pre:hover .copy-btn {
  opacity: 1;
  visibility: visible;
}

.copy-btn {
  background-color: transparent;
  outline: 0px;
  border: 0px;
  margin: 0px;
  cursor: pointer;
  user-select: none;
  vertical-align: middle;
  appearance: none;
  text-decoration: none;
  font-family: "PingFang SC", "Microsoft YaHei", SimHei;
  font-weight: 500;
  font-size: 0.8125rem;
  line-height: 1.75;
  text-transform: uppercase;
  min-width: 64px;
  border-radius: 8px;
  color: rgb(38, 114, 237);
  padding: 4px 8px;
  transition: all 300ms ease 0s;
  visibility: hidden;
  opacity: 0;
  position: absolute;
  right: -6px;
  top: 16px;
}

/* 取消button点击后出现的大黑边框 */
button:focus {
  outline: none;
}

.hljs {
  position: relative;
}
</style>