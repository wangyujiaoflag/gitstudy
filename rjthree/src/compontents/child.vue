<template>
  <div id="child">
    哈喽，我是子组件
    1、sync
    2、作用域插槽
    <!-- <button @click="tohidden">我是子组件，点我我就消失</button> -->
    <div>
      <ul>
        <slot :value="news" name="head">使用slot占位</slot>
      </ul>
    </div>
    <div>
      <slot name="content"></slot>
    </div>
    <div>
      <slot name="bottom"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "child",
  data() {
    return {
        list:[1,2,3,4],
        news:[
           {
          name:"张三",
          sex:"男"
      },{
          name:"wangwu",
          sex:"girl"
      }
        ]
    };
  },
  methods: {
    tohidden() {
      this.$emit("update:shows", false);
    }
  }
};
</script>
<style lang="less">
#child {
  margin-top: 20px;
}
</style>