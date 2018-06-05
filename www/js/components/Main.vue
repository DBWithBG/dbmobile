<template>
    <div id="home">
      <p>  {{ message }} </p>
      <v-btn v-on:click="webviewConnexion"> Connexion
    </v-btn>
    </br>
        <router-view>
      </router-view>
    </div>
</template>


<script>

export default {

    data(){
        return {
            message : 'TODO : Insérer un super titre'
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
