<template>
  <div>
    <back-header :message="$t('documents')"></back-header>
    <v-container>
      <v-layout column>
        <v-flex xs12 mt-2 mb-2>
          <v-icon class="chevron-right">chevron_right</v-icon>
          <span class="subheading">{{$t('siret_number')}}</span>
        </v-flex>

        <v-form v-model="siret_valid">
          <v-text-field
            prepend-icon="domain"
            v-model="siret"
            label="SIRET"
            :rules="[otherRules.required]"
            mask="### ### ### #####"
          ></v-text-field>

          <v-btn
            @click="updateSiret"
            :disabled="!siret_valid"
            outline
            block
            color="primary"
          >{{$t('save')}}</v-btn>
        </v-form>

        <v-flex xs12 class="mt-7" mb-2>
          <v-icon class="chevron-right">chevron_right</v-icon>
          <span class="subheading">{{$t('add_document')}}</span>
        </v-flex>

        <v-form v-model="document_valid">
          <v-text-field
            prepend-icon="attachment"
            v-model="documentName"
            :label="$t('documents_name')"
            :rules="[otherRules.required]"
          ></v-text-field>

          <upload-btn
            :fileChangedCallback="fileChanged"
            outline
            title="Choisir un fichier"
            accept="image/x-png, image/gif, image/jpeg"
          ></upload-btn>

          <span class="file-name">{{file != null ? file.name: ''}}</span>

          <v-flex xs12 class="text-xs-center">
            <v-btn
              @click="addDocument"
              :disabled="!document_valid"
              :loading="add_loading"
              outline
              block
              color="primary"
            >{{$t('add')}}</v-btn>
          </v-flex>
        </v-form>

        <v-flex xs12 class="mt-7" mb-2>
          <v-icon class="chevron-right">chevron_right</v-icon>
          <span class="subheading">{{$t('your_documents')}}</span>
        </v-flex>

        <v-flex mt-1 xs12 v-for="document in documents" :key="document.id">
          <v-card>
            <v-card-title>
              <div>
                <div class="subheading documents-name">
                  <span :class="document.is_valide === 1 ? 'green-dot' : 'red-dot'"></span>
                  <span>{{textFromStatus(document.is_valide)}}</span>
                  &emsp;
                  <b>{{document.name}}</b>
                </div>
              </div>
            </v-card-title>
            <v-card-actions>
              <v-btn flat @click="viewDocument(document.id)" color="primary">{{$t('see')}}</v-btn>
              <v-btn flat @click="deleteDocument(document.id)" color="error">{{$t('delete')}}</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>

        <v-flex xs12 v-if="documents.length == 0">
          <span>{{$t('no_document')}}</span>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import BackHeader from "../BackHeader.vue";
import UploadButton from "vuetify-upload-button";
import Api from "../../api.js";

export default {
  components: {
    "back-header": BackHeader,
    "upload-btn": UploadButton
  },

  data() {
    let self = this;
    return {
      siret: "",
      documentName: "",
      file: null,
      add_loading: false,
      siret_valid: false,
      document_valid: true,
      documents: [],
      otherRules: {
        required: value => !!value || self.$i18n.t("required")
      }
    };
  },

  async mounted() {
    try {
      await this.fetchDriverInfos();
      await this.fetchDocument();
    } catch (error) {
      this.$swal({
          type: "error",
          title: "Oups",
          text: error
        });
    }
  },

  methods: {
    async updateSiret() {
      let self = this;
      let api = new Api();

      try {
        await api.updateSiretDriver(this.siret);
        this.$swal({
          type: "success",
          text: this.$i18n.t('siret_updated')
        });
      } catch (error) {
        this.$swal({
          type: "error",
          title: "oups",
          text: error
        });
      }
    },

    async addDocument() {
      let self = this;
      let api = new Api();

      if (this.file == null) {
        this.$swal({
          type: "error",
          title: "Oups",
          text: this.$i18n.t('no_document_choosen')
        });
        return;
      }

      try {
        this.add_loading = true;
        let response = await api.addDocument(this.documentName, this.file);
        console.log(JSON.stringify(response));
        this.add_loading = false;
        this.$swal({
          type: "success",
          text: self.$i18n.t('document_added')
        });
        await this.fetchDocument();
      } catch (error) {
        this.$swal({
          type: "error",
          title: "oups",
          text: error
        });
      }
    },

    async deleteDocument(id) {
      let self = this;
      let api = new Api();

      console.log("Deleting doc " + id);

      try {
        await api.deleteDocument(id);
        this.$swal({
          type: "info",
          text: self.$i18n.t('document_deleted')
        });
        await this.fetchDocument();
      } catch (error) {
        this.$swal({
          type: "error",
          title: "oups",
          text: error
        });
      }
    },

    viewDocument(id) {

    },

    async fetchDocument() {
      let self = this;
      let api = new Api();

      try {
        let response = await api.getDocuments();
        this.documents = response.data.justificatifs;
        console.log(this.documents);
      } catch (error) {
        this.$swal({
          type: "error",
          title: "Oups",
          text: error
        });
      }
    },

    async fetchDriverInfos() {
      let self = this;
      let api = new Api();

      try {
        let response = await api.readDriver();
        this.siret = JSON.parse(response.data)[0].siret;
      } catch (error) {
        this.$swal({
          type: "error",
          title: "Oups",
          text: error
        });
      }
    },

    fileChanged(file) {
      this.file = file;
    },

    textFromStatus(status_id) {
      if (status_id === null) return this.$i18n.t('waiting_for_validation');
      else if (status_id === 1) return this.$i18n.t('validated');
      else return this.$i18n.t('not_valid');
      
    }
  }
};
</script>
<style scoped>
.red-dot {
  height: 0.8em;
  width: 0.8em;
  background-color: #e53935;
  border-radius: 50%;
  display: inline-block;
  margin-left: 0.4em;
  margin-right: 0.6em;
}

.green-dot {
  height: 0.8em;
  width: 0.8em;
  background-color: #3eb93a;
  border-radius: 50%;
  display: inline-block;
  margin-left: 0.4em;
  margin-right: 0.6em;
}

.mt-7 {
  margin-top: 42px;
}

.subheading.documents-name {
  text-transform: none !important;
}

.upload-btn {
  padding-left: 0px !important;
  margin-top: 5px;
  display: inline-block;
}

.file-name {
  display: inline-block;
  line-height: 34px;
  padding-left: 10px;
}
</style>


