<template>
    <v-alert value="true" outline color="warning" type="warning">
      {{message}}
  </v-alert>
</template>

<script>

export default {

    props: ["message"]

    }

</script>

<style>
</style>
