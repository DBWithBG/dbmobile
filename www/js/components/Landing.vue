<template>
<div id="landing">
    <v-layout column>
        <v-flex text-xs-left xs12 class="landing-logo-container">
            <img class="landing-logo" src="img/logo.png">
        </v-flex>
        <v-flex text-xs-center xs12 class="landing-text-container">
            <span class="landing-head">Votre bagages</span>
            <br/>    
            <span class="landing-subhead">Notre mission</span>
        </v-flex>
        <v-flex text-xs-center xs12 class="landing-letsgo-button">
            <v-btn @click="debug" large color="primary">Commencer</v-btn>
        </v-flex>
    </v-layout>
    
    
</div>    
</template>

<script>
export default {
    mounted() {
        if (localStorage.getItem('jwt')) {
            this.$router.push('/login');
        }
    },

    methods: {
        debug() {
            this.$router.push('/login');
        }
    }
}
</script>
<style scoped>

/* Logo */
.landing-logo-container {
    margin-top: 2vh;
    margin-left: 10px;
}

.landing-logo {
    height: 55px;
}

/* Text */
.landing-text-container {
    margin-top: 22vh;
}

.landing-head {
    text-transform: uppercase;
    font-size: 32px;
    font-family: "Raleway", sans-serif;
    letter-spacing: 0.08em;
    font-weight: 700;
    color: #FFF;
}

.landing-subhead {
    text-transform: uppercase;
    font-size: 22px;
    font-family: "Raleway", sans-serif;
    color: #FFF;
    letter-spacing: 0.04em;
}


/* buttons */
.landing-letsgo-button {
    margin-top: 18vh;
    font-size: 20px !important;
}

</style>
