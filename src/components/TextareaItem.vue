<script setup>
import { ref, computed, watch } from 'vue'
import { useFileUpload } from '@/hooks/useFileUpload'
const { fileList, addFile, removeFile } = useFileUpload()


const emit = defineEmits(['output'])

const disabledSend = ref(true)
const extra = ref('')
const defaultHeight = 52
const textStyle = ref({
  height: `${defaultHeight}px`
})
const handleInput = (e) => {
  const height = e.target.scrollHeight
  if (height > defaultHeight && height <= 200) {
    textStyle.value = {
      height: `${height}px`
    }
  } else if (height > 200) {
    textStyle.value = {
      height: '200px'
    }
  } else {
    textStyle.value = {
      height: `${defaultHeight}px`
    }
  }
}
const sendMessage = () => {
  const message = extra.value
  const imgList = [...pictureList.value]
  const otherFileList = [...fileList.value]
  // 清理恢复
  backDefault()
  emit('output', { message, imgList, otherFileList })
}
function backDefault() {
  extra.value = ''
  pictureList.value = []
  fileList.value = []
  textStyle.value = {
    height: `${defaultHeight}px`
  }
}
// 图片上传
const pictureList = ref([])
const addPicture = () => {
  if (fileList.value.length > 0) return
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.multiple = true
  input.onchange = (e) => {
    Array.from(e.target.files).forEach((file, i) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        pictureList.value.push({
          src: e.target.result,
          uploading: true
        })
        uploadImg(file, e.target.result, i)
      }
      reader.readAsDataURL(file)
    })
  }
  input.click()
}
function removeImg(i) {
  pictureList.value = pictureList.value.filter((item, index) => index !== i)
}
const uploadImg = (file, content, i) => {
  // 模拟上传
  setTimeout(() => {
    // 上传成功后，将图片的 url 存储到 pictureList 中
    pictureList.value[i].uploading = false
  }, 2000)
}

// 其他文件上传
const addOtherFile = () => {
  if (pictureList.value.length > 0) return
  const acceptList = ['application/pdf', 'text/plain', 'application/json', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  addFile(acceptList, true)

}

watch([extra, pictureList, fileList], () => {
  const noInput = extra.value.length === 0;
  let isUploading = false;
  let haveUpload = false;
  // 判断是否有上传任务
  if (pictureList.value.length > 0 || fileList.value.length > 0) {
    haveUpload = true
    if (pictureList.value.length > 0) {
      isUploading = pictureList.value.some(item => item.uploading)
    }
    if (fileList.value.length > 0) {
      isUploading = fileList.value.some(item => item.uploading)
    }
  }
  if (haveUpload) {
    disabledSend.value = isUploading
  } else {
    disabledSend.value = noInput
  }
}, { deep: true });
</script>

<template>
  <div class="flex textarea-container items-center">
    <!-- 增加一个文件上传的按钮 -->
    <div class="plugins">
      <i class="iconfont mr-2 icon-ios-image cursor-pointer" :class="{ 'disabled-i': fileList.length > 0 }"
        @click="addPicture"></i>
      <i class="iconfont mr-2 icon-ios-attach cursor-pointer" :class="{ 'disabled-i': pictureList.length > 0 }"
        @click="addOtherFile"></i>
    </div>
    <div class="input-warper flex flex-wrap flex-col">
      <div class="upload-img-warper" v-if="pictureList.length > 0">
        <div class="img-warper relative" v-for="(img, index) in pictureList" :key="index">
          <img :src="img.src" />
          <i class="iconfont icon-ios-close-circle absolute top-0 right-0 cursor-pointer z-10"
            @click="removeImg(index)" />
          <div class="upload-mask" v-if="img.uploading">
          </div>
        </div>
      </div>
      <div class="upload-file-warper" v-if="fileList.length > 0">
        <div class="upload-file flex items-center relative" v-for="(file, index) in fileList" :key="index">
          <!-- 文件展示限制最大宽度，超出省略号，hover显示全部 -->
          <div class="overflow-hidden overflow-ellipsis whitespace-nowrap w-32"
            :title="file.name.length > 8 ? file.name : ''">{{ file.name }}</div>
          <i class="iconfont icon-ios-close-circle absolute top-0 right-0 cursor-pointer z-10"
            @click="removeFile(index)" />
          <div class="upload-mask" v-if="file.uploading">
          </div>
        </div>
      </div>
      <textarea :style="textStyle" v-model="extra" @input="handleInput" placeholder="给ChatGpt发消息" />
      <button class="send-arrow" :disabled="disabledSend" @click="sendMessage"></button>
    </div>
  </div>

</template>

<style scoped>
.textarea-container {
  --border: 1px solid rgba(0, 0, 0, .15);

  .plugins {
    /* 保持在底部相同的位置 */
    align-self: flex-end;
    margin-bottom: 14px;
    height: 32px;

    i {
      width: 28px;
      height: 28px;
      font-size: 28px;
      /* border: var(--border); */
    }

    .disabled-i {
      opacity: 0.1;
      cursor: default;
    }
  }
}

.input-warper {
  position: relative;
  width: 766px;
  height: auto;
  border: var(--border);
  border-radius: 1rem;
  overflow: hidden;

  .upload-img-warper,
  .upload-file-warper {
    display: flex;
    flex-wrap: wrap;
    margin: 10px;
  }

  .upload-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
  }

  /* 创建一个圆环做上传进度 */
  .upload-mask::after {
    content: '';
    width: 50%;
    height: 50%;
    border: 2px solid #fff;
    border-radius: 50%;
    position: absolute;
    top: 25%;
    left: 25%;
    border-top: 2px solid #fc0;
    border-right: 2px solid #fc0;
    border-bottom: 2px solid #fc0;
    animation: spin 1s linear infinite;
  }

  .upload-img-warper {
    .img-warper {
      width: 100px;
      height: 100px;
      margin: 10px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      i {
        color: invert(1);
        font-size: 24px;
      }
    }
  }

  .upload-file-warper {
    .upload-file {
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      margin: 10px;
    }

    .upload-mask::after {
      left: 45%;
      top: 25%;
      width: 23px;
      height: 23px;
    }
  }

  textarea {
    padding: 0.875rem 3rem 0.875rem 1.5rem;
    outline: none;
    background-color: #fff;
    resize: none;
    word-break: keep-all;
  }

  textarea:focus {
    outline: none;
    /* 给边框加阴影 */
    /* box-shadow: 0 0 10px #ccc; */
  }

  .send-arrow {
    position: absolute;
    right: 10px;
    bottom: 10px;
    width: 30px;
    height: 30px;
    background-color: #000;
    /* 去掉 hover 样式 */
    outline: none;
  }

  .send-arrow:disabled {
    opacity: 0.1;
  }

  .send-arrow::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid #fc0;
    transform: translate(-50%, -50%);
  }
}

/* 修改 textarea 元素滚动条样式 */
textarea::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

textarea::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 5px;
}

textarea::-webkit-scrollbar-track {
  background-color: #f5f5f5;
}

textarea::-webkit-resizer {
  display: none;
}
</style>
<style>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>