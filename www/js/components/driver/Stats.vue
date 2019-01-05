<template>
  <div class="stats">
    <!-- Loading spinner -->
    <div v-if="loading">
      <back-header :message="$t('stats')"></back-header>
      <v-layout row justify-center>
        <v-container fill-height>
          <v-layout row justify-center align-center>
            <v-progress-circular indeterminate :size="70" :width="5" color="primary"></v-progress-circular>
          </v-layout>
        </v-container>
      </v-layout>
    </div>

    <!-- Layout quand on a fetch les infos -->
    <div v-if="!loading">
      <back-header :message="$t('stats')"></back-header>

      <v-layout column>
        <!-- Top card -->
        <v-flex xs12 mt-2>
          <v-card>
            <v-card-title primary-title>
              <h3 class="headline">
                <v-icon left>drive_eta</v-icon>
                <span>{{first_name}} {{last_name}}</span>
              </h3>
            </v-card-title>
            <v-card-text></v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>

<script>
import Api from "../../api.js";
import BackHeader from "../BackHeader.vue";

export default {
  components: {
    "back-header": BackHeader
  },

  data() {
    return {
      loading_driver_data: true,
      loading_driver_deliveries: true,
      deliveries: [],
      sorted_deliveries: [],
      first_name: '',
      last_name: ''
    };
  },

  computed: {
    loading() {
      this.loading_driver_data || this.loading_driver_deliveries
    }
  },

  mounted() {
    this.fetchDriverData();
    this.fetchDriverDeliveries();
  },

  methods: {
    async fetchDriverData() {
      let self = this;
      let api = new Api();

      try {
        let response = await api.readDriver();
        this.loading_driver_data = false;
        let driver = JSON.parse(response.data)[0];
        this.first_name = driver.surname;
        this.last_name = driver.name;
      } catch (error) {
        console.log('Error : ' + error);
        this.loading_driver_data = false;
        this.$swal({
          type: "error",
          title: self.$i18n.t("oups"),
          text: self.$i18n.t("unable_to_retrieve_data_from_server")
        });
      }
    },

    async fetchDriverDeliveries() {
      let self = this;
      let api = new Api();

      try {
        let response = await api.getDriverDeliveries();
        this.loading_driver_deliveries = false;
        this.deliveries = response.data;
        this.sortDeliveries();
      } catch (error) {
        console.log('Error : ' + error);
        this.loading_driver_deliveries = false;
        this.$swal({
          type: "error",
          title: self.$i18n.t("oups"),
          text: self.$i18n.t("unable_to_retrieve_data_from_server")
        });
      }
    },

    sortDeliveries() {
      for (var delivery of this.deliveries) {
        // delivery.delivery.end_date format : 2018-12-14 22:53:00
        // We just want 2018-12
        let end_year_month = delivery.delivery.end_date.split(' ')[0].substr(0, 7);
        let end_year = parseInt(end_year_month.split('-')[0]);
        let end_month = parseInt(end_year_month.split('-')[1]);
        if (!this.sorted_deliveries[end_year]) this.sorted_deliveries[end_year] = [];
        if (!this.sorted_deliveries[end_year][end_month]) this.sorted_deliveries[end_year][end_month] = [];
        this.sorted_deliveries[end_year][end_month].push(delivery);
        // [2018 => [11 => [deliveries], 12 => [deliveries]], 2017 => etc]
      }
      console.log(this.sorted_deliveries);
    }
  }
};
</script>

<style scoped>
</style>


