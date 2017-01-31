<template>
  <div class="page-loader" v-if="loading">
    <div class="loader">
      <md-spinner :md-indeterminate="true" :md-size="100"></md-spinner>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .page-loader {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(255,255,255,.8);
    z-index: 10;

    .loader {
      position: absolute;
      height: 100px;
      width: 100px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
</style>

<script>
export default {
  props: {
    loading: Boolean,
  },
};
</script>
