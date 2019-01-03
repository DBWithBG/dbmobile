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

          <span class="file-name">{{file.name}}</span>

          <v-flex xs12 class="text-xs-center">
            <v-btn @click="addDocument" :disabled="!document_valid" outline block color="primary">{{$t('add')}}</v-btn>
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
                  <span class="green-dot"></span>
                  <span>{{document.status}}</span>
                  &emsp;
                  <span>{{document.name}}</span>
                </div>
              </div>
            </v-card-title>
            <v-card-actions>
              <v-btn flat color="primary">{{$t('see')}}</v-btn>
              <v-btn flat color="error">{{$t('delete')}}</v-btn>
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
      file: {
        name: ""
      },
      siret_valid: false,
      document_valid: true,
      documents: [
        {
          id: 1,
          name: "Carte identité recto",
          status: "Validée"
        },
        {
          id: 2,
          name: "Carte identité verso",
          status: "Validée"
        }
      ],
      otherRules: {
        required: value => !!value || self.$i18n.t("required")
      }
    };
  },

  methods: {
    async updateSiret() {
      let self = this;
      let api = new Api();

      try {
        await api.updateSiret(this.siret);
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

      console.log("Adding " + this.file.name);
      console.log("File : ");
      console.log(this.file);

      try {
        await api.addDocument(this.documentName, this.file);
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
      } catch (error) {
        this.$swal({
          type: "error",
          title: "oups",
          text: error
        });
      }
    },

    fetchDocument() {
      let self = this;
      let api = new Api();

      try {
        api.getDocuments();
      } catch (error) {
        this.$swal({
          type: "error",
          title: "oups",
          text: error
        });
      }
    },

    fileChanged(file) {
      this.file = file;
      console.log(file);
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


