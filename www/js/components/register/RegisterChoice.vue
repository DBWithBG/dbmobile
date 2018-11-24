<template>


  <div id="register">
    
    <v-layout row>
    <v-flex xs12>
      <v-toolbar>
        <v-btn to="/login" icon flat>
          <v-icon >arrow_back </v-icon>
        </v-btn>
        <v-toolbar-title>S'inscrire</v-toolbar-title>
      </v-toolbar>
    </v-flex>
  </v-layout>
    
    <v-container grid-list-lg>
      <v-layout row wrap>
          <v-flex md12>
          <v-card to="/register-customer" color="blue-grey darken-2" class="white--text" >
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">Client</h3>
                <div>Vous êtes client et vous voulez que vos bagages soient pris en charge</div>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
      

      
        <v-flex md12>
          <v-card to="/register-driver" color="cyan darken-2" class="white--text">
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">Chauffeur</h3>
                <div>Vous voulez devenir chauffeur et transporter les bagages de nos clients</div>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>  
      </v-layout>
    </v-container>

  </div>
</template>


<script>
export default {};
</script>


<style>
</style>
