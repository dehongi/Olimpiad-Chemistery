<script setup>
import {ref} from 'vue'

const title = ref('')
const year = ref('')
const problem = ref('')
const solution = ref('')
const status = ref('')

async function submitProblem() {
  status.value = 'در حال ذخیره...'
  try {
    const res = await fetch('/api/save-problem', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        title: title.value,
        year: year.value,
        problem: problem.value,
        solution: solution.value
      })
    })
    
    if (res.ok) {
        status.value = '✅ سوال با موفقیت ذخیره شد!'
        title.value = ''
        problem.value = ''
        solution.value = ''
    } else {
        status.value = '❌ خطا: ذخیره نشد.'
    }
  } catch(e) {
      status.value = '❌ خطا در برقراری ارتباط.'
  }
}
</script>

<template>
  <div class="problem-form">
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
      <textarea v-model="problem" rows="6" placeholder="صورت سوال را اینجا بنویسید..."></textarea>
    </div>

    <div class="form-group">
      <label>پاسخ تشریحی:</label>
      <textarea v-model="solution" rows="6" placeholder="پاسخ را اینجا بنویسید..."></textarea>
    </div>

    <button @click="submitProblem">ذخیره سوال</button>
    <p class="status">{{ status }}</p>
  </div>
</template>

<style scoped>
.problem-form {
    max-width: 600px;
    margin: 2rem auto;
    padding: 2rem;
    background: var(--vp-c-bg-soft);
    border-radius: 8px;
}
.form-group {
    margin-bottom: 1rem;
}
label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
}
input, textarea {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid var(--vp-c-divider);
    border-radius: 4px;
    background: var(--vp-c-bg);
}
button {
    background: var(--vp-c-brand-1);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
}
button:hover {
    background: var(--vp-c-brand-2);
}
.status {
    margin-top: 1rem;
    font-weight: bold;
}
</style>
