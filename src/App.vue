<template>
  <div id="app">
    <div class="container" :style="$route.fullPath === '/home' ? 'min-width: 1816px' : ''">
      <Header />
      <main>
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script>
import Header from '@views/Header';
export default {
  name: 'App',
  components: {
    Header,
  },
};
</script>
<style>
body .el-table th.gutter {
  display: table-cell !important;
}
</style>
