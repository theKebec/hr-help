<template>
  <aside class="sidebar">
    <div class="brand">
      <span class="brand-mark">H</span>
      <span class="brand-name">HR Helper</span>
    </div>

    <nav class="nav">
      <RouterLink v-for="item in navItems" :key="item.to" :to="item.to" class="nav-item" :class="{ active: isActive(item.to) }">
        <AppIcon :name="item.icon" :size="20" />
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>

    <div class="sidebar-bottom">
      <button class="nav-item history-toggle" @click="historyOpen = !historyOpen">
        <AppIcon name="clock" :size="20" />
        <span>历史记录</span>
        <AppIcon name="chevronDown" :size="16" class="chevron" :class="{ open: historyOpen }" />
      </button>

      <transition name="expand">
        <div v-if="historyOpen" class="history-panel scroll-area">
          <div v-if="!chatStore.historyList.length" class="history-empty">暂无对话记录</div>
          <RouterLink
            v-for="item in chatStore.historyList"
            :key="item.employeeId"
            :to="`/chat/${item.employeeId}`"
            class="history-item"
            @click="historyOpen = false"
          >
            <img :src="getEmployee(item.employeeId)?.avatar" :alt="item.employeeId" class="history-avatar" />
            <div class="history-meta">
              <div class="history-name">{{ getEmployee(item.employeeId)?.name }}</div>
              <div class="history-preview">{{ item.preview.slice(0, 18) || '开始对话' }}</div>
            </div>
          </RouterLink>
        </div>
      </transition>

      <RouterLink to="/settings" class="user-row">
        <span class="user-avatar">N</span>
        <div class="user-meta">
          <div class="user-status">
            <span class="status-dot" :class="{ ok: settingsStore.configured }" />
            {{ settingsStore.configured ? '已连接 DeepSeek' : '未配置 API' }}
          </div>
          <div class="user-ver">v0.8.3</div>
        </div>
      </RouterLink>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import AppIcon from './AppIcon.vue'
import { useChatStore } from '@/stores/chat'
import { useSettingsStore } from '@/stores/settings'
import { getEmployee } from '@/data/employees'

const route = useRoute()
const chatStore = useChatStore()
const settingsStore = useSettingsStore()
const historyOpen = ref(false)

const navItems = [
  { to: '/', label: '首页', icon: 'home' },
  { to: '/employees', label: '我的员工', icon: 'users' },
  { to: '/skills', label: '我的技能', icon: 'spark' },
  { to: '/help', label: '帮助', icon: 'help' }
]

const isActive = (to) => (to === '/' ? route.path === '/' : route.path.startsWith(to))
</script>

<style scoped>
.sidebar {
  width: var(--sidebar-w);
  flex-shrink: 0;
  height: 100vh;
  background: var(--surface);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  padding: 28px 16px 20px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 12px 28px;
}
.brand-mark {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: var(--dark);
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 17px;
}
.brand-name {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  color: var(--text);
  transition: background 0.15s var(--ease), color 0.15s var(--ease);
  width: 100%;
  text-align: left;
}
.nav-item:hover {
  background: #f1f3f6;
}
.nav-item.active {
  background: var(--dark);
  color: #fff;
}
.nav-item .chevron {
  margin-left: auto;
  transition: transform 0.2s var(--ease);
}
.nav-item .chevron.open {
  transform: rotate(180deg);
}

.sidebar-bottom {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.history-panel {
  max-height: 220px;
  margin: 0 4px;
  background: #f8f9fb;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.history-empty {
  padding: 14px 10px;
  font-size: 12.5px;
  color: var(--text-weak);
  text-align: center;
}
.history-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 9px;
  transition: background 0.15s var(--ease);
}
.history-item:hover {
  background: #fff;
}
.history-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}
.history-meta {
  min-width: 0;
}
.history-name {
  font-size: 13px;
  font-weight: 600;
}
.history-preview {
  font-size: 11.5px;
  color: var(--text-weak);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.expand-enter-active,
.expand-leave-active {
  transition: opacity 0.18s var(--ease), transform 0.18s var(--ease);
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.user-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  margin-top: 6px;
  transition: background 0.15s var(--ease);
}
.user-row:hover {
  background: #f1f3f6;
}
.user-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--dark);
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 600;
  font-size: 16px;
  flex-shrink: 0;
}
.user-meta {
  min-width: 0;
}
.user-status {
  font-size: 12.5px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}
.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #f59e0b;
}
.status-dot.ok {
  background: #10b981;
}
.user-ver {
  font-size: 11.5px;
  color: var(--text-weak);
}
</style>
