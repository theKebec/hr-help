<template>
  <div class="page scroll-area">
    <header class="page-header">
      <div>
        <h1 class="page-title">员工办公室（{{ employees.length }}人）</h1>
        <p class="page-subtitle">点击任意员工卡片，即可与对应岗位的 AI 同事对话协作</p>
      </div>
      <button class="btn-primary" @click="goSettings">
        <AppIcon name="plus" :size="16" />
        新建
      </button>
    </header>

    <div class="card-grid">
      <EmployeeCard
        v-for="emp in employees"
        :key="emp.id"
        :employee="emp"
        :completed="chatStore.completedCount(emp.id)"
        @open="openChat"
      />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'
import EmployeeCard from '@/components/EmployeeCard.vue'
import { employees } from '@/data/employees'
import { useChatStore } from '@/stores/chat'

const router = useRouter()
const chatStore = useChatStore()

const openChat = (id) => router.push(`/chat/${id}`)
const goSettings = () => router.push('/settings')
</script>

<style scoped>
.page {
  height: 100vh;
  padding: 32px 40px 40px;
}
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 26px;
  gap: 16px;
}
.page-title {
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.01em;
}
.page-subtitle {
  font-size: 13.5px;
  color: var(--text-sub);
  margin-top: 6px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
}

@media (max-width: 1280px) {
  .card-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
@media (max-width: 960px) {
  .card-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .page {
    padding: 24px 24px 32px;
  }
}
@media (max-width: 600px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
}
</style>
