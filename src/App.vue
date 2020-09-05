<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {};
  },
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
.box-card {
  height: 100%;
}
.pagination {
  display: flex;
  justify-content: center;
  margin: 20px 0 0;
}
</style>
