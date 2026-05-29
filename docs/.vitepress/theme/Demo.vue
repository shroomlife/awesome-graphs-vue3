<script setup lang="ts">
defineProps<{ title?: string }>()
</script>

<template>
  <figure class="ag-demo">
    <figcaption v-if="title" class="ag-demo__title">{{ title }}</figcaption>
    <div class="ag-demo__body">
      <ClientOnly>
        <slot />
      </ClientOnly>
    </div>
  </figure>
</template>
