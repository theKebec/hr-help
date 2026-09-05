<template>
  <div class="page scroll-area">
    <header class="page-header">
      <div>
        <h1 class="page-title">我的技能</h1>
        <p class="page-subtitle">高频 HR 场景工具，点击即可带着预设指令找到对应数字员工</p>
      </div>
    </header>

    <div class="skill-grid">
      <div v-for="skill in skills" :key="skill.id" class="skill-card" @click="useSkill(skill)">
        <div class="skill-icon" :style="{ background: skill.bg, color: skill.color }">
          <AppIcon :name="skill.icon" :size="22" />
        </div>
        <h3>{{ skill.name }}</h3>
        <p>{{ skill.desc }}</p>
        <div class="skill-foot">
          <img :src="getEmployee(skill.employeeId)?.avatar" :alt="skill.employeeId" />
          <span>{{ getEmployee(skill.employeeId)?.name }}</span>
          <AppIcon name="arrowRight" :size="15" class="skill-arrow" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'
import { skills } from '@/data/skills'
import { getEmployee } from '@/data/employees'
import { useChatStore } from '@/stores/chat'

const router = useRouter()
const chatStore = useChatStore()

const useSkill = (skill) => {
  const employee = getEmployee(skill.employeeId)
  if (!employee) return
  // 确保会话已初始化（含欢迎语）
  chatStore.ensureConversation(employee.id, employee.greetings)
  // 预设指令暂存到 sessionStorage，进入对话页后自动填入输入框
  sessionStorage.setItem(`hr-helper-skill-prompt:${employee.id}`, skill.prompt)
  router.push(`/chat/${employee.id}`)
}
</script>

<style scoped>
.page {
  height: 100vh;
  padding: 32px 40px 40px;
}
.page-header {
  margin-bottom: 26px;
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

.skill-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}
.skill-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-card);
  transition: transform 0.16s var(--ease), box-shadow 0.16s var(--ease), border-color 0.16s var(--ease);
}
.skill-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
  border-color: var(--border-strong);
}
.skill-icon {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  margin-bottom: 14px;
}
.skill-card h3 {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 6px;
}
.skill-card > p {
  font-size: 13px;
  color: var(--text-sub);
  line-height: 1.6;
  flex: 1;
}
.skill-foot {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px dashed var(--border);
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  color: var(--text-sub);
}
.skill-foot img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}
.skill-arrow {
  margin-left: auto;
  color: var(--text-weak);
}

@media (max-width: 1280px) {
  .skill-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
@media (max-width: 960px) {
  .skill-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .page {
    padding: 24px;
  }
}
@media (max-width: 600px) {
  .skill-grid {
    grid-template-columns: 1fr;
  }
}
</style>
