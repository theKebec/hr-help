<template>
  <div class="page scroll-area">
    <header class="page-header">
      <h1 class="page-title">历史记录</h1>
      <p class="page-subtitle">按最近对话时间排序，点击可继续与该员工的对话</p>
    </header>

    <div v-if="list.length" class="history-list">
      <div v-for="item in list" :key="item.employeeId" class="history-card" @click="router.push(`/chat/${item.employeeId}`)">
        <img :src="getEmployee(item.employeeId)?.avatar" :alt="item.employeeId" class="history-avatar" />
        <div class="history-body">
          <div class="history-top">
            <h3>{{ getEmployee(item.employeeId)?.name }}</h3>
            <span class="badge" :class="getEmployee(item.employeeId)?.type === 'BOSS' ? 'boss' : 'work'">
              {{ getEmployee(item.employeeId)?.type }}
            </span>
          </div>
          <p class="history-preview">{{ item.preview || '（暂无内容）' }}</p>
          <div class="history-meta">
            <span>{{ item.count }} 轮对话</span>
            <span>·</span>
            <span>{{ formatTime(item.updatedAt) }}</span>
          </div>
        </div>
        <AppIcon name="chevronLeft" :size="18" class="history-arrow" />
      </div>
    </div>

    <div v-else class="empty">
      <AppIcon name="clock" :size="28" />
      <p>暂无历史对话</p>
      <RouterLink to="/employees" class="btn-primary">去员工墙看看</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'
import { useChatStore } from '@/stores/chat'
import { getEmployee } from '@/data/employees'

const router = useRouter()
const chatStore = useChatStore()
const list = chatStore.historyList

const formatTime = (ts) => {
  const d = new Date(ts)
  const now = new Date()
  const sameDay = d.toDateString() === now.toDateString()
  const pad = (n) => String(n).padStart(2, '0')
  if (sameDay) return `今天 ${pad(d.getHours())}:${pad(d.getMinutes())}`
  return `${d.getMonth() + 1}月${d.getDate()}日 ${pad(d.getHours())}:${pad(d.getMinutes())}`
}
</script>

<style scoped>
.page {
  height: 100vh;
  padding: 32px 40px 48px;
  max-width: 860px;
}
.page-title {
  font-size: 26px;
  font-weight: 700;
}
.page-subtitle {
  font-size: 13.5px;
  color: var(--text-sub);
  margin-top: 6px;
}

.history-list {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.history-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  box-shadow: var(--shadow-card);
  transition: transform 0.16s var(--ease), box-shadow 0.16s var(--ease);
}
.history-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}
.history-avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}
.history-body {
  flex: 1;
  min-width: 0;
}
.history-top {
  display: flex;
  align-items: center;
  gap: 10px;
}
.history-top h3 {
  font-size: 15.5px;
  font-weight: 700;
}
.history-top .badge {
  font-size: 11px;
  padding: 2px 8px;
}
.history-preview {
  font-size: 13px;
  color: var(--text-sub);
  margin: 5px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.history-meta {
  font-size: 12px;
  color: var(--text-weak);
  display: flex;
  gap: 6px;
}
.history-arrow {
  color: var(--text-weak);
  transform: rotate(180deg);
  flex-shrink: 0;
}

.empty {
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: var(--text-weak);
}
.empty p {
  font-size: 14px;
}
.empty .btn-primary {
  margin-top: 8px;
}
</style>
