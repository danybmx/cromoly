<template>
  <page-content :page-title="$t('menu.taxes')">
    <loader :loading="loading"></loader>

    <form novalidate v-on:submit.prevent="saveTax()">
      <md-card>

        <md-card-header>
          <md-toolbar class="md-transparent">
            <md-button v-on:click="$router.back()" class="md-icon-button md-primary">
              <md-icon>arrow_back</md-icon>
            </md-button>
            <h2 class="md-title">{{$t(`taxes.${action}`)}}</h2>
          </md-toolbar>
        </md-card-header>

        <md-card-content>

          <md-input-container :class="{'md-input-invalid': errors.has('name')}">
            <label>{{$t('taxes.name')}}:</label>
            <md-input v-model="tax.name" data-vv-name="name" v-validate data-vv-rules="required" required></md-input>
            <span class="md-error" v-if="errors.has('name')">{{errors.first('name')}}</span>
          </md-input-container>

          <md-input-container :class="{'md-input-invalid': errors.has('value')}">
            <label>{{$t('taxes.value')}}:</label>
            <md-input v-model="tax.value" data-vv-name="value" v-validate data-vv-rules="required|alpha_dash" required></md-input>
            <span class="md-error" v-if="errors.has('value')">{{errors.first('value')}}</span>
          </md-input-container>

          <md-switch v-model="tax.default">{{$t('taxes.default')}}</md-switch>

        </md-card-content>

        <md-card-actions>
          <md-button type="submit" class="md-accent md-raised">
            {{$t('buttons.save')}}
            <md-icon>check</md-icon>
          </md-button>
        </md-card-actions>

      </md-card>
    </form>

  </page-content>
</template>

<script>
  export default {
    data() {
      return {
        action: this.$route.name === 'create-tax' ? 'create' : 'edit',
        tax: {
          _id: null,
          name: null,
          description: null,
          visible: true,
        },
        formErrors: {},
        categories: [],
        loading: false,
      };
    },
    methods: {
      saveTax() {
        this.$validator.validateAll().then((success) => {
          if (!success) {
            return this.$root.showSnackbar(this.$t('errors.checkTheForm'));
          }

          this.loading = true;

          let promise = null;
          if (this.tax._id) {
            promise = this.$http.put(`taxes/${this.tax._id}`, this.tax, this.$root.httpOptions());
          } else {
            promise = this.$http.post(`taxes`, this.tax, this.$root.httpOptions());
          }

          promise.then(() => {
            this.loading = false;
            this.$router.back();
          }).catch((err) => {
            this.loading = false;
            this.$root.showSnackbar(this.$t('errors.errorSaving'));
            console.error(err);
          });
        });
      },
    },
    mounted() {
      if (this.$route.name === 'edit-tax') {
        this.loading = true;
        this.$http.get(`taxes/${this.$route.params.id}`, this.$root.httpOptions()).then((data) => {
          this.loading = false;
          this.tax = data.body;
        }).catch((err) => {
          console.error(err);
          this.loading = false;
          this.$root.showSnackbar('errors.cantLoadResources');
          this.$router.back();
        });
      }
    },
  };
</script>

<style lang="css">
</style>
