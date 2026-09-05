<template>
  <div class="employee-card" @click="$emit('open', employee.id)">
    <span class="badge" :class="employee.type === 'BOSS' ? 'boss' : 'work'">{{ employee.type }}</span>

    <div class="card-body">
      <img :src="employee.avatar" :alt="employee.name" class="avatar" loading="lazy" />
      <h3 class="name">{{ employee.name }}</h3>
      <p class="desc">{{ employee.desc }}</p>
    </div>

    <div class="card-foot">
      <AppIcon name="check" :size="14" class="check" />
      <span>已完成{{ completed }}任务</span>
    </div>
  </div>
</template>

<script setup>
import AppIcon from './AppIcon.vue'

defineProps({
  employee: { type: Object, required: true },
  completed: { type: Number, default: 0 }
})
defineEmits(['open'])
</script>

<style scoped>
.employee-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 18px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-card);
  transition: transform 0.16s var(--ease), box-shadow 0.16s var(--ease), border-color 0.16s var(--ease);
}
.employee-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
  border-color: var(--border-strong);
}

.badge {
  align-self: flex-start;
}

.card-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 14px 4px 12px;
}
.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 12px;
  background: #f1f3f6;
}
.name {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 6px;
}
.desc {
  font-size: 13px;
  color: var(--text-sub);
  line-height: 1.65;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 42px;
}

.card-foot {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 12.5px;
  color: var(--green-text);
  font-weight: 500;
  padding-top: 12px;
  border-top: 1px dashed var(--border);
}
.check {
  flex-shrink: 0;
}
</style>
