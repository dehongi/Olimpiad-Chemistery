---
title: آرشیو سوالات
---

<script setup>
import { data as problems } from './problems.data.mts'
</script>

# آرشیو سوالات المپیاد

در این بخش سوالاتی که توسط شما ثبت شده‌اند نمایش داده می‌شوند.

<div v-for="problem in problems" :key="problem.url" class="problem-card">
  <a :href="problem.url" class="problem-link">
    <h3>{{ problem.frontmatter.title }}</h3>
    <span class="badg">{{ problem.frontmatter.year }}</span>
  </a>
  <a :href="`/edit-problem?file=${problem.url.split('/').pop().replace('.html', '') + '.md'}`" class="edit-btn" title="ویرایش سوال">
    ✏️
  </a>
</div>

<style scoped>
.problem-card {
  border: 1px solid var(--vp-c-divider);
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  transition: transform 0.2s;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.problem-card:hover {
  transform: translateY(-2px);
  border-color: var(--vp-c-brand-1);
}
.problem-link {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
}
.problem-card h3 {
  margin: 0;
  display: inline-block;
}
.badg {
  background: var(--vp-c-brand-1);
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-left: 1rem;
}
.edit-btn {
  padding: 0.5rem;
  margin-right: 0.5rem;
  font-size: 1.2rem;
  text-decoration: none;
  opacity: 0.6;
  transition: opacity 0.2s;
  cursor: pointer;
}
.edit-btn:hover {
  opacity: 1;
}
</style>
