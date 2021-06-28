<template>
  <div class="equipment">
    <Box1 />
    <ChartBox />
    <TableBox />
  </div>
</template>
<script>
import Box1 from '@c/Equipment/box1';
import TableBox from '@c/Equipment/table-box';
import ChartBox from '@c/Equipment/chart-box';
export default {
  components: {
    Box1,
    TableBox,
    ChartBox,
  },
};
</script>
<style lang="scss" scoped>
.equipment {
  overflow: hidden;
  background-color: #081f25;
  .btn-box {
    margin: 10px;
    .btn {
      border-radius: 0;
      margin: 0;
    }
  }
  .box2 {
    margin: 10px;
    position: relative;
  }
}
</style>
