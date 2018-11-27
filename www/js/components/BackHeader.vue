<template>
  <v-layout row>
    <v-flex xs12>
      <v-toolbar>
        <v-btn @click="back" icon flat>
          <v-icon>arrow_back</v-icon>
        </v-btn>
        <v-toolbar-title> {{message}} </v-toolbar-title>
      </v-toolbar>
    </v-flex>
  </v-layout>
</template>

<script>

export default{

props:['message'],

  data(){
    return {
    }
  },

  methods: {
    back(){
      this.$router.go(-1)
    }
  }
}
</script>


<style>
</style>