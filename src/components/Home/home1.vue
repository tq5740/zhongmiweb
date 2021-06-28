<template>
  <div class="home1 home-box">
    <img :src="orgImgSrc" alt="">
  </div>
</template>
<script>
export default {
  data() {
    return {
      orgImgSrc: "",
    };
  },
  computed: {
    currentOrgId() {
      return this.$store.state.currentOrgId;
    },
  },
  watch: {
    currentOrgId: {
      handler: 'getOrgImgSrc',
      immediate: true,
    },
  },
  methods: {
    getOrgImgSrc() {
      const id = this.currentOrgId || this.$GetStorage('currentOrgId'),
        arr = this.$store.state.orgAllArr.length ? this.$store.state.orgAllArr : this.$GetStorage('orgAllArr');
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id == id) {
          this.orgImgSrc = arr[i].url;
          break;
        }
      }
    }
  },
};
</script>
<style lang="scss" scoped>
.home1 {
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 100%;
  }
}
</style>
