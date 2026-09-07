<template>
  <div class="layout">
    <Sidebar />
    <main class="main">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<script setup>
import Sidebar from '@/components/Sidebar.vue'
</script>

<style scoped>
.layout {
  display: flex;
  width: 100%;
  height: 100vh;
}
.main {
  flex: 1;
  min-width: 0;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
