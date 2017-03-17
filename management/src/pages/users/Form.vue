<template>
  <page-content :page-title="$t('menu.users')">
    <loader :loading="loading"></loader>

    <form novalidate v-on:submit.prevent="saveUser()">
      <md-card>

        <md-card-header>
          <md-toolbar class="md-transparent">
            <md-button v-on:click="$router.back()" class="md-icon-button md-primary">
              <md-icon>arrow_back</md-icon>
            </md-button>
            <h2 class="md-title">{{$t(`users.${action}`)}}</h2>
          </md-toolbar>
        </md-card-header>

        <md-card-content>

          <md-input-container :class="{'md-input-invalid': errors.has('name')}">
            <label>{{$t('users.email')}}:</label>
            <md-input v-model="user.email" data-vv-name="email" v-validate data-vv-rules="required" required></md-input>
            <span class="md-error" v-if="errors.has('email')">{{errors.first('name')}}</span>
          </md-input-container>

          <md-input-container :class="{'md-input-invalid': errors.has('role')}">
            <label>{{$t('users.role')}}:</label>
            <md-select v-model="user.role" required>
              <md-option value="USER">{{$t('users.roles.USER')}}</md-option>
              <md-option value="ADMIN">{{$t('users.roles.ADMIN')}}</md-option>
              <md-option value="OWNER">{{$t('users.roles.OWNER')}}</md-option>
            </md-select>
          </md-input-container>

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
      action: this.$route.name === 'create-user' ? 'create' : 'edit',
      user: {
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
      users: [],
      loading: false,
    };
  },
  methods: {
    saveUser() {
      this.$validator.validateAll().then(() => {
        this.loading = true;

        let promise = null;
        if (this.user._id) {
          promise = this.$http.put(`users/${this.user._id}`, this.user, this.$root.httpOptions());
        } else {
          promise = this.$http.post(`users`, this.user, this.$root.httpOptions());
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
    if (this.$route.name === 'edit-user') {
      this.loading = true;
      this.$http.get(`users/${this.$route.params.id}`, this.$root.httpOptions()).then((data) => {
        this.loading = false;
        this.user = data.body;
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
