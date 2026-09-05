<template>
  <div class="page scroll-area">
    <section class="hero">
      <h1>早上好，HR 👋</h1>
      <p>你的 10 位数字员工已就绪。选择一位同事，或从常用技能开始今天的工作。</p>
    </section>

    <section class="quick-grid">
      <RouterLink to="/employees" class="quick-card">
        <div class="quick-icon" style="background: #ecfdf5; color: #059669">
          <AppIcon name="users" :size="22" />
        </div>
        <div class="quick-text">
          <h3>我的员工</h3>
          <p>与 10 位数字员工对话</p>
        </div>
        <AppIcon name="arrowRight" :size="18" class="quick-arrow" />
      </RouterLink>

      <RouterLink to="/skills" class="quick-card">
        <div class="quick-icon" style="background: #f5f3ff; color: #7c3aed">
          <AppIcon name="spark" :size="22" />
        </div>
        <div class="quick-text">
          <h3>我的技能</h3>
          <p>{{ skills.length }} 个 HR 效率工具</p>
        </div>
        <AppIcon name="arrowRight" :size="18" class="quick-arrow" />
      </RouterLink>

      <RouterLink to="/settings" class="quick-card">
        <div class="quick-icon" style="background: #fffbeb; color: #b45309">
          <AppIcon name="key" :size="22" />
        </div>
        <div class="quick-text">
          <h3>{{ settingsStore.configured ? 'API 已连接' : '配置 API Key' }}</h3>
          <p>{{ settingsStore.configured ? 'DeepSeek 对话可用' : '填入 DeepSeek Key 开始对话' }}</p>
        </div>
        <AppIcon name="arrowRight" :size="18" class="quick-arrow" />
      </RouterLink>
    </section>

    <section class="section">
      <div class="section-head">
        <h2>最近对话</h2>
        <RouterLink to="/history" class="section-link">查看全部</RouterLink>
      </div>
      <div v-if="recent.length" class="recent-list">
        <RouterLink v-for="item in recent" :key="item.employeeId" :to="`/chat/${item.employeeId}`" class="recent-item">
          <img :src="getEmployee(item.employeeId)?.avatar" :alt="item.employeeId" class="recent-avatar" />
          <div class="recent-meta">
            <div class="recent-name">{{ getEmployee(item.employeeId)?.name }}</div>
            <div class="recent-preview">{{ item.preview.slice(0, 30) }}</div>
          </div>
          <AppIcon name="chevronLeft" :size="16" class="recent-arrow" />
        </RouterLink>
      </div>
      <div v-else class="empty-hint">
        <AppIcon name="message" :size="22" />
        <span>还没有对话，去「我的员工」找一位同事聊聊吧</span>
      </div>
    </section>

    <section class="section">
      <div class="section-head">
        <h2>推荐员工</h2>
        <RouterLink to="/employees" class="section-link">全部员工</RouterLink>
      </div>
      <div class="recommend-grid">
        <div
          v-for="emp in recommend"
          :key="emp.id"
          class="recommend-card"
          @click="router.push(`/chat/${emp.id}`)"
        >
          <img :src="emp.avatar" :alt="emp.name" />
          <div>
            <h4>{{ emp.name }}</h4>
            <p>{{ emp.desc }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'
import { employees, getEmployee } from '@/data/employees'
import { skills } from '@/data/skills'
import { useChatStore } from '@/stores/chat'
import { useSettingsStore } from '@/stores/settings'

const router = useRouter()
const chatStore = useChatStore()
const settingsStore = useSettingsStore()

const recent = computed(() => chatStore.historyList.slice(0, 4))
const recommend = computed(() => employees.filter((e) => ['recruiter', 'compensation', 'talent', 'strategy'].includes(e.id)))
</script>

<style scoped>
.page {
  height: 100vh;
  padding: 36px 40px 48px;
}

.hero {
  margin-bottom: 28px;
}
.hero h1 {
  font-size: 30px;
  font-weight: 700;
  letter-spacing: -0.01em;
}
.hero p {
  margin-top: 8px;
  font-size: 14.5px;
  color: var(--text-sub);
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 34px;
}
.quick-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: var(--shadow-card);
  transition: transform 0.16s var(--ease), box-shadow 0.16s var(--ease);
}
.quick-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}
.quick-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.quick-text {
  flex: 1;
  min-width: 0;
}
.quick-text h3 {
  font-size: 15.5px;
  font-weight: 700;
}
.quick-text p {
  font-size: 12.5px;
  color: var(--text-sub);
  margin-top: 2px;
}
.quick-arrow {
  color: var(--text-weak);
  flex-shrink: 0;
}

.section {
  margin-bottom: 32px;
}
.section-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 14px;
}
.section-head h2 {
  font-size: 17px;
  font-weight: 700;
}
.section-link {
  font-size: 13px;
  color: var(--text-sub);
}
.section-link:hover {
  color: var(--text);
}

.recent-list {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow-card);
}
.recent-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 18px;
  border-bottom: 1px solid var(--border);
  transition: background 0.15s var(--ease);
}
.recent-item:last-child {
  border-bottom: none;
}
.recent-item:hover {
  background: #f8f9fb;
}
.recent-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
}
.recent-meta {
  flex: 1;
  min-width: 0;
}
.recent-name {
  font-size: 14px;
  font-weight: 600;
}
.recent-preview {
  font-size: 12.5px;
  color: var(--text-weak);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.recent-arrow {
  color: var(--text-weak);
  transform: rotate(180deg);
}

.empty-hint {
  background: var(--surface);
  border: 1px dashed var(--border-strong);
  border-radius: 16px;
  padding: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: var(--text-weak);
  font-size: 13.5px;
}

.recommend-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}
.recommend-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  box-shadow: var(--shadow-card);
  transition: transform 0.16s var(--ease), box-shadow 0.16s var(--ease);
}
.recommend-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}
.recommend-card img {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}
.recommend-card h4 {
  font-size: 14.5px;
  font-weight: 700;
}
.recommend-card p {
  font-size: 12.5px;
  color: var(--text-sub);
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 1100px) {
  .quick-grid {
    grid-template-columns: 1fr;
  }
  .recommend-grid {
    grid-template-columns: 1fr;
  }
}
</style>
