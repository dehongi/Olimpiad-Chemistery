<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vitepress'

const route = useRoute()
const router = useRouter()

const filename = ref('')
const title = ref('')
const year = ref('')
const problem = ref('')
const solution = ref('')
const status = ref('')
const loading = ref(true)

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search)
  filename.value = urlParams.get('file') || ''
  console.log('Filename from URL:', filename.value)
  
  if (filename.value) {
    await loadProblem()
  } else {
    status.value = '❌ فایل مشخص نشده است'
    loading.value = false
  }
})

async function loadProblem() {
  try {
    const res = await fetch(`/api/get-problem?filename=${encodeURIComponent(filename.value)}`)
    if (res.ok) {
      const data = await res.json()
      console.log('Loaded problem data:', data)
      title.value = data.title
      year.value = data.year
      problem.value = data.problem
      solution.value = data.solution
      loading.value = false
    } else {
      const errorData = await res.json().catch(() => ({}))
      console.error('Failed to load problem:', res.status, errorData)
      status.value = `❌ خطا در بارگذاری سوال (${res.status})`
      loading.value = false
    }
  } catch (e) {
    console.error('Error loading problem:', e)
    status.value = '❌ خطا در برقراری ارتباط: ' + e.message
    loading.value = false
  }
}

async function updateProblem() {
  status.value = 'در حال ذخیره...'
  try {
    const res = await fetch('/api/edit-problem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: filename.value,
        title: title.value,
        year: year.value,
        problem: problem.value,
        solution: solution.value
      })
    })
    
    if (res.ok) {
      status.value = '✅ سوال با موفقیت به‌روزرسانی شد!'
      setTimeout(() => {
        // Redirect to the problem detail page
        const problemSlug = filename.value.replace(/\.md$/, '')
        window.location.href = `/problems/${problemSlug}`
      }, 1500)
    } else {
      status.value = '❌ خطا: ذخیره نشد.'
    }
  } catch (e) {
    status.value = '❌ خطا در برقراری ارتباط.'
  }
}

function cancel() {
  window.location.href = '/problems/'
}
</script>

<template>
  <div class="problem-editor">
    <div v-if="loading" class="loading">در حال بارگذاری...</div>
    <div v-else-if="!filename" class="error">{{ status }}</div>
    <div v-else>
      <h2>ویرایش سوال</h2>
      
      <div class="form-group">
        <label>عنوان سوال:</label>
        <input v-model="title" placeholder="مثال: محاسبه pH بافر" />
      </div>
      
      <div class="form-group">
        <label>سال (مثال: ۱۴۰۲):</label>
        <input v-model="year" type="number" />
      </div>

      <div class="form-group">
        <label>صورت سوال (مارک‌داون + لاتک):</label>
        <textarea v-model="problem" rows="8" placeholder="صورت سوال را اینجا بنویسید..."></textarea>
      </div>

      <div class="form-group">
        <label>پاسخ تشریحی:</label>
        <textarea v-model="solution" rows="8" placeholder="پاسخ را اینجا بنویسید..."></textarea>
      </div>

      <div class="button-group">
        <button class="btn-primary" @click="updateProblem">ذخیره تغییرات</button>
        <button class="btn-secondary" @click="cancel">انصراف</button>
      </div>
      
      <p class="status">{{ status }}</p>
    </div>
  </div>
</template>

<style scoped>
.problem-editor {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.error {
  color: var(--vp-c-danger-1);
}

h2 {
  margin-bottom: 1.5rem;
  color: var(--vp-c-brand-1);
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: var(--vp-c-text-1);
}

input, textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-family: inherit;
  font-size: 1rem;
}

textarea {
  resize: vertical;
  min-height: 150px;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--vp-c-brand-1);
  color: white;
}

.btn-primary:hover {
  background: var(--vp-c-brand-2);
}

.btn-secondary {
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
}

.btn-secondary:hover {
  background: var(--vp-c-bg-soft);
}

.status {
  margin-top: 1rem;
  font-weight: bold;
  text-align: center;
}
</style>
