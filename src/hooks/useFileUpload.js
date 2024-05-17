import { ref } from 'vue'

export function useFileUpload() {
  const fileList = ref([])

  const addFile = (acceptList, multiple=false) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = acceptList.join(',')
    input.multiple = multiple

    input.onchange = (e) => {
      const files = e.target.files
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (!acceptList.includes(file.type)) {
          continue
        }
        const reader = new FileReader()
        reader.onload = (e) => {
          fileList.value.push({
            name: file.name,
            content: e.target.result,
            uploading: true
          })
          uploadFile(file, i)
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const removeFile = (i) => {
    fileList.value = fileList.value.filter((item, index) => index !== i)
  }

  const uploadFile = (file, idx) => {
    setTimeout(() => {
      fileList.value[idx].uploading = false
    }, 2000)
  }

  return {
    fileList,
    addFile,
    removeFile,
    uploadFile
  }
}