<template>


  <div id="root"></div>
</template>


<script>
export default {
    mounted() {
        // On vérifie si l'utilisateur est loggé
        if (!this.checkIfUserIsLogged()) {
            this.$router.push({path: '/login'})
        }

        // On récupère le user

        // On redirige au bon endroit
    },

    methods: {
        checkIfUserIsLogged() {
            return false
        }
    }
};
</script>


<style>
</style>
