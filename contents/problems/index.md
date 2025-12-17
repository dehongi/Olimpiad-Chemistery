---
title: آرشیو سوالات
---

<script setup>
import { data as problems } from './problems.data.mts'
</script>

# آرشیو سوالات المپیاد

در این بخش سوالاتی که توسط شما ثبت شده‌اند نمایش داده می‌شوند.

<div v-for="problem in problems" :key="problem.url" class="problem-card">
  <a :href="problem.url">
    <h3>{{ problem.frontmatter.title }}</h3>
    <span class="badg">{{ problem.frontmatter.year }}</span>
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
}
.problem-card:hover {
  transform: translateY(-2px);
  border-color: var(--vp-c-brand-1);
}
.problem-card h3 {
  margin: 0;
  display: inline-block;
}
.badg {
  float: left;
  background: var(--vp-c-brand-1);
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}
</style>
