<template>
    <div id="home">
      <h3>Deliverbag</h3>
      <v-btn v-on:click="webviewConnexion">Connexion</v-btn>
    </div>
</template>


<script>

export default {

    data(){
        return {
            message : 'TODO : My messageuh'
        };
    },
    methods:{
      webviewConnexion(){
        window.open('https://dev-deliverbag.supconception.fr/connexion', '_self', 'location=no,zoom=no');
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
