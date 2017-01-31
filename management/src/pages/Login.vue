<template lang="html">
  <div class="login-page">
    <!-- Error handler -->
    <md-snackbar ref="loginSnackbar" md-position="top center">
      {{ error }}
    </md-snackbar>

    <div class="login-card">
      <loader :loading="loading"></loader>
      <form novalidate @submit.prevent="login">
        <md-card>
          <md-card-header>
            <div class="md-title">{{ $t('siteName') }}</div>
            <div class="md-subhead">{{ $t('auth.subtitle') }}</div>
          </md-card-header>

          <md-card-content>
            <md-input-container>
              <label>{{ $t('auth.email') }}</label>
              <md-input v-model="email"></md-input>
            </md-input-container>
            <md-input-container md-has-password>
              <label>{{ $t('auth.password') }}</label>
              <md-input v-model="password" type="password"></md-input>
            </md-input-container>
          </md-card-content>

          <md-card-actions>
            <md-button type="submit" class="md-raised md-primary">{{ $t('auth.login') }}</md-button>
          </md-card-actions>
        </md-card>
      </form>
    </div>
  </div>
</template>

<script>
import auth from '../services/auth';

export default {
  data() {
    return {
      email: '',
      password: '',
      loading: false,
      error: null,
    };
  },
  methods: {
    login() {
      this.loading = true;
      auth.login(this, this.email, this.password, (err) => {
        if (err) {
          this.error = this.$t('errors.' + err);
          this.$refs.loginSnackbar.open();
          this.loading = false;
        }
      });
    },
  },
};
</script>

<style scoped>
.login-page {
  height: 100vh;
  width: 100%;
}
.login-page .login-card {
  max-width: 400px;
  width: 90%;
  margin: auto;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}
.login-page .logo-container {
  text-align: center;
}
.login-page .logo {
  width: 200px;
  height: 200px;
  margin: 20px;
}
.login-page .loading {
  text-align: center
}
</style>
