<template>
  <div id="root"></div>
</template>


<script>
export default {
    /**
     * Ce component correspond à la route /
     * Il redirige juste sur /landing
     */
    mounted() {
        this.$router.push({path: '/landing'})
    }
};
</script>


<style>
</style>
