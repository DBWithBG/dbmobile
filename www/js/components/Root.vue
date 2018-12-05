<template>


  <div id="root"></div>
</template>


<script>
export default {
    mounted() {
        console.log('User type is : ' + window.localStorage.getItem('type'));
        console.log('JWT is : ' + window.localStorage.getItem('jwt'));
        this.$router.push({path: '/login'})
    }
};
</script>


<style>
</style>
