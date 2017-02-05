<template>
  <page-content :page-title="$t('menu.warehouses')">
    <loader :loading="loading"></loader>

    <form novalidate v-on:submit.prevent="saveWarehouse()">
      <md-card>

        <md-card-header>
          <md-toolbar class="md-transparent">
            <md-button v-on:click="$router.back()" class="md-icon-button md-primary">
              <md-icon>arrow_back</md-icon>
            </md-button>
            <h2 class="md-title">{{$t(`warehouses.${action}`)}}</h2>
          </md-toolbar>
        </md-card-header>

        <md-card-content>

          <md-input-container :class="{'md-input-invalid': errors.has('name')}">
            <label>{{$t('warehouses.name')}}:</label>
            <md-input v-model="warehouse.name" data-vv-name="name" v-validate data-vv-rules="required" required></md-input>
            <span class="md-error" v-if="errors.has('name')">{{errors.first('name')}}</span>
          </md-input-container>

          <md-input-container :class="{'md-input-invalid': errors.has('phone')}">
            <label>{{$t('warehouses.phone')}}:</label>
            <md-input v-model="warehouse.phone" data-vv-name="phone" v-validate data-vv-rules="required|alpha_dash" required></md-input>
            <span class="md-error" v-if="errors.has('phone')">{{errors.first('phone')}}</span>
          </md-input-container>

          <md-switch v-model="warehouse.useForWeb">{{$t('warehouses.useForWeb')}}</md-switch>

          <md-card style="margin-top: 10px;">
            <md-card-header>
              <h2 class="md-title">{{$t('warehouses.address')}}</h2>
            </md-card-header>
            <md-card-content>
              <md-input-container :class="{'md-input-invalid': errors.has('addressAddress')}">
                <label>{{$t('address.address')}}:</label>
                <md-input v-model="warehouse.address.address" data-vv-name="addressAddress" v-validate data-vv-rules="required" required></md-input>
                <span class="md-error" v-if="errors.has('addressAddress')">{{errors.first('addressAddress')}}</span>
              </md-input-container>
              <md-layout row md-gutter="16">
                <md-layout column>
                  <md-input-container :class="{'md-input-invalid': errors.has('addressCity')}">
                    <label>{{$t('address.city')}}:</label>
                    <md-input v-model="warehouse.address.city" data-vv-name="addressCity" v-validate data-vv-rules="required" required></md-input>
                    <span class="md-error" v-if="errors.has('addressCity')">{{errors.first('addressCity')}}</span>
                  </md-input-container>
                </md-layout>
                <md-layout column flex="1">
                  <md-input-container>
                    <label>{{$t('address.zip')}}:</label>
                    <md-input v-model="warehouse.address.zip"></md-input>
                  </md-input-container>
                </md-layout>
              </md-layout>
              <md-layout row md-gutter="16">
                <md-layout column>
                  <md-input-container>
                    <label>{{$t('address.state')}}:</label>
                    <md-input v-model="warehouse.address.state"></md-input>
                  </md-input-container>
                </md-layout>
                <md-layout column flex="3">
                  <md-input-container :class="{'md-input-invalid': errors.has('addressCountry')}">
                    <label>{{$t('address.country')}}:</label>
                    <md-input v-model="warehouse.address.country" data-vv-name="addressCountry" v-validate data-vv-rules="required" required></md-input>
                    <span class="md-error" v-if="errors.has('addressCountry')">{{errors.first('addressCountry')}}</span>
                  </md-input-container>
                </md-layout>
              </md-layout>
            </md-card-content>
          </md-card>

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
      action: this.$route.name === 'create-warehouse' ? 'create' : 'edit',
      warehouse: {
        _id: null,
        name: null,
        description: null,
        useForWeb: true,
        address: {
          address: null,
          city: null,
          state: null,
          country: null,
          zip: null,
        },
      },
      formErrors: {},
      warehouses: [],
      loading: false,
    };
  },
  methods: {
    saveWarehouse() {
      this.$validator.validateAll().then(() => {
        this.loading = true;

        let promise = null;
        if (this.warehouse._id) {
          promise = this.$http.put(`warehouses/${this.warehouse._id}`, this.warehouse, this.$root.httpOptions());
        } else {
          promise = this.$http.post(`warehouses`, this.warehouse, this.$root.httpOptions());
        }

        promise.then(() => {
          this.loading = false;
          this.$router.back();
        }).catch(() => {
          this.loading = false;
          this.$root.showSnackbar(this.$t('errors.errorSaving'));
        });
      }).catch(() => {
        return this.$root.showSnackbar(this.$t('errors.checkTheForm'));
      });
    },
  },
  mounted() {
    if (this.$route.name === 'edit-warehouse') {
      this.loading = true;
      this.$http.get(`warehouses/${this.$route.params.id}`).then((data) => {
        this.loading = false;
        this.warehouse = data.body;
      }).catch(() => {
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
