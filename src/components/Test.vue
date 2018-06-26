<template>
    <div>
      <p>{{message}} </p>
      <v-text-field v-model="message" type="text" v-on:input="miseajour"/>
        <router-view> </router-view>
    </div>
</template>

<script>
export default {
    data(){
        return {
            message : ''
        }
    },
    methods:{
      miseajour(){
        console.log('update');
        this.$emit('update', this.message);
        }
      }
}
</script>

<style scoped>
p{
  font-size:2em;
  text-align:center;
}
</style>
