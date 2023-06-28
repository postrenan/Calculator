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
  background: rgb(131,58,180);
  background: linear-gradient(343deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 50%, rgba(252,176,69,1) 100%);
  height: auto;
  min-height: 100vh;
}
</style>