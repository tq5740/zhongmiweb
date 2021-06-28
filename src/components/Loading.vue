<template>
  <div v-loading="loading" element-loading-background="rgba(13, 39, 45, 0.8)">
    <slot />
  </div>
</template>
<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>