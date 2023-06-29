<template>
  <div id="=app">
    <RouterView/>
  </div>
</template>

<script>
import Simple from "@/views/Calculator.vue";
import {defineComponent} from "vue";

export default defineComponent({
  components: {Simple}
})

</script>

<style>

body{
  background: #BFBFBF;
  height: auto;
  min-height: 100vh;
}
</style>