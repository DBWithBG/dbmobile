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
            <v-card-text>
              <span class="icon-number primary-color">{{nb_deliveries}}</span>
              <span class="icon-number-side-text">{{$t('deliveries')}}</span>
            </v-card-text>
          </v-card>
        </v-flex>

        <v-flex xs12 mt-2 v-for="recap_month in recaps_months" :key="recap_month.id">
          <v-card>
            <v-card-title primary-title>
              <h3 class="headline">
                <span>{{recap_month.month}} {{recap_month.year}}</span>
              </h3>
            </v-card-title>
            <v-card-text>
              <span class="icon-number primary-color">{{recap_month.nb_deliveries}}</span>
              <span class="icon-number-side-text">{{$t('deliveries')}}</span>
              <br>
              <span class="icon-number primary-color">{{recap_month.total_luggages}}</span>
              <span class="icon-number-side-text">{{$t('luggages_taken')}}</span>
              <br>
              <span class="icon-number primary-color">></span>
              <span class="price">
                {{$t('you_earn')}}
                <span class="primary-color">{{recap_month.total_remuneration}} €</span>
              </span>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" flat>Ma facture</v-btn>
            </v-card-actions>
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
      nb_deliveries: 0,
      deliveries: [],
      recaps_months: [],
      first_name: "",
      last_name: ""
    };
  },

  computed: {
    loading() {
      this.loading_driver_data || this.loading_driver_deliveries;
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
        console.log("Error : " + error);
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
        this.nb_deliveries = this.deliveries.length;
        this.sortDeliveries();
      } catch (error) {
        console.log("Error : " + error);
        this.loading_driver_deliveries = false;
        this.$swal({
          type: "error",
          title: self.$i18n.t("oups"),
          text: self.$i18n.t("unable_to_retrieve_data_from_server")
        });
      }
    },

    sortDeliveries() {
      const NB_YEAR = 2;
      let sorted_deliveries = [];
      for (var delivery of this.deliveries) {
        // delivery.delivery.end_date format : 2018-12-14 22:53:00
        // We just want 2018-12
        let end_year_month = delivery.delivery.end_date
          .split(" ")[0]
          .substr(0, 7);
        let end_year = parseInt(end_year_month.split("-")[0]);
        let end_month = parseInt(end_year_month.split("-")[1]);
        if (!sorted_deliveries[end_year]) sorted_deliveries[end_year] = [];
        if (!sorted_deliveries[end_year][end_month])
          sorted_deliveries[end_year][end_month] = [];
        sorted_deliveries[end_year][end_month].push(delivery);
        // [2018 => [11 => [deliveries], 12 => [deliveries]], 2017 => etc]
      }

      let current_year = parseInt(new Date().getFullYear());
      let counter = 0;

      // On veut les récaps de chaque mois des 2 dernière année
      for (let year = current_year; year >= current_year - 2; year--) {
        // Pour chaque mois, du plus récent au plus ancient
        for (let month = 12; month >= 1; month--) {
          // On construit le récap du mois year-month
          // On utilise sorted_deliveries[year][month]

          if (!sorted_deliveries[year] || !sorted_deliveries[year][month])
            continue;

          let recap_current_month = {
            id: counter,
            year,
            month: this.$i18n.t("month_" + month),
            nb_deliveries: sorted_deliveries[year][month].length,
            total_remuneration: 0,
            total_luggages: 0
          };
          for (let delivery of sorted_deliveries[year][month]) {
            recap_current_month.total_remuneration +=
              delivery.delivery.remuneration_driver;
            recap_current_month.total_luggages += delivery.delivery.bags.length;
          }
          this.recaps_months.push(recap_current_month);
          counter++;
        }
      }

      console.log(this.recaps_months);
    }
  }
};
</script>

<style scoped>
.icon-number {
  font-size: 24px;
  font-weight: bold;
  margin-right: 5px;
}

.icon-number-side-text {
  line-height: 24px;
}

.price {
  line-height: 24px;
}
</style>


