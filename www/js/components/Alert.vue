<template>
  <div class="col-md-12 nopadding">
    <div class="alert-box warning">
        <strong><i class="fa fa-exclamation" aria-hidden="true"></i> &nbsp;  Oups! </strong> &nbsp; {{message}}
    </div>
  </div>
</template>

<script>

export default {

    props: ["message"]

    }

</script>

<style>
</style>
