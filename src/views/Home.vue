<template>
  <div class="home">
    <div class="home-all">
      <div class="box">
        <Home1 class="home1" />
        <Home2 class="home2" />
        <Home3 class="home3" />
      </div>
      <div class="box">
        <Home4 class="home4" />
        <Home5 class="home5" />
        <Home6 class="home6" />
      </div>
      <div class="box">
        <Home7 class="home7" />
      </div>
    </div>
  </div>
</template>

<script>
import Home1 from '@c/Home/home1';
import Home2 from '@c/Home/home2';
import Home3 from '@c/Home/home3';
import Home4 from '@c/Home/home4';
import Home5 from '@c/Home/home5';
import Home6 from '@c/Home/home6';
import Home7 from '@c/Home/home7';
export default {
  name: "home",
  components: {
    Home1,
    Home2,
    Home3,
    Home4,
    Home5,
    Home6,
    Home7,
  },
};
</script>
<style lang="scss" scoped>
.home {
  color: #fff;
  .home-all {
    background-color: rgba(8, 31, 37, 1);
    min-width: 1796px;
    padding: 10px;
  }
  .box {
    display: flex;
  }
  .home1 {
    width: 335px;
    height: 335px;
    flex: 0.2;
  }
  .home2 {
    height: 335px;
    flex: 0.4;
    min-width: 700px;
  }
  .home3 {
    height: 335px;
    flex: 0.4;
  }
  .home4 {
    width: 100%;
    min-width: 380px;
    flex: 1.3;
  }
  .home5 {
    width: 100%;
    min-width: 380px;
    flex: 1;
  }
  .home6 {
    min-width: 380px;
    flex: 2;
  }
}
</style>
