<template>
  <div class="container" v-if="loggedIn">
    <loader :loading="loading"></loader>

    <md-snackbar ref="errorSnackbar" md-position="top center">
      {{ error }}
    </md-snackbar>

    <md-sidenav class="main-sidebar md-left md-fixed" ref="main-sidebar">
      <md-toolbar class="brand-logo" md-theme="white">
        <router-link exact to="/">
          <img src="./assets/logo.png" alt="Cromoly">
        </router-link>
      </md-toolbar>

      <div class="main-sidebar-links">
        <md-list class="md-dense">
          <md-list-item>
            <router-link to="/dashboard">{{ $t('menu.dashboard') }}</router-link>
          </md-list-item>
          <md-list-item>
            <router-link to="/tpv">{{ $t('menu.tpv') }}</router-link>
          </md-list-item>
          <md-list-item>
            <router-link to="/orders">{{ $t('menu.orders') }}</router-link>
          </md-list-item>
          <md-list-item>
            <router-link to="/entries">{{ $t('menu.entries') }}</router-link>
          </md-list-item>
          <md-list-item>
            <router-link to="/products">{{ $t('menu.products') }}</router-link>
          </md-list-item>
          <md-list-item>
            <router-link to="/categories">{{ $t('menu.categories') }}</router-link>
          </md-list-item>
          <md-list-item>
            <router-link to="/brands">{{ $t('menu.brands') }}</router-link>
          </md-list-item>
          <md-list-item>
            <router-link to="/users">{{ $t('menu.users') }}</router-link>
          </md-list-item>
          <md-list-item>
            <router-link to="/storages">{{ $t('menu.storages') }}</router-link>
          </md-list-item>
          <md-list-item>
            <router-link to="/taxes">{{ $t('menu.taxes') }}</router-link>
          </md-list-item>
        </md-list>
      </div>
    </md-sidenav>
    <transition name="md-router" appear>
      <router-view></router-view>
    </transition>
  </div>
  <div class="container login" v-else>
    <loader :loading="loading"></loader>

    <transition name="md-router" appear>
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import auth from './services/auth';
import config from './config';

export default {
  name: 'app',
  data() {
    return {
      loading: true,
      loggedIn: auth.loggedIn(),
      user: auth.getUser(),
      section: null,
      error: null,
      config,
    };
  },
  created() {
    auth.init(this, () => {
      this.loading = false;
    });
    auth.onChange = (user) => {
      this.loggedIn = Boolean(user);
      this.user = user;
    };
  },
  methods: {
    toggleSidenav() {
      if (this.$refs['main-sidebar']) {
        this.$refs['main-sidebar'].toggle();
      }
    },
    closeSidenav() {
      if (this.$refs['main-sidebar']) {
        this.$refs['main-sidebar'].close();
      }
    },
    showSnackbar(msg) {
      this.error = msg;
      this.$refs.errorSnackbar.open();
    },
    httpOptions() {
      return {
        headers: {'X-Access-Token': auth.getToken()},
      };
    },
  },
};
</script>

<style lang="scss">
  @import 'assets/stylesheets/variables.scss';

  [v-cloak] {
    display: none;
  }

  html,
  body {
    height: 100%;
    overflow: hidden;
  }

  body {
    display: flex;
  }

  .hidden {
    visibility: hidden;
  }

  .container {
    min-height: 100%;
    display: flex;
    flex-flow: column nowrap;
    flex: 1;
    transition: $swift-ease-out;

    @media (min-width: 1281px) {
      padding-left: $sidebar-size;
    }

    &.login {
      padding-left: 0 !important;
    }
  }

  .big-loader {
    text-align: center;
    z-index: 100;
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(255, 255, 255, .6);

    .loader {
      height: 100px;
      position: relative;
      top: 50%;
      margin-top: -50px;
    }
  }

  .main-sidebar.md-sidenav {
    .md-sidenav-content {
      width: $sidebar-size;
      display: flex;
      flex-flow: column;
      overflow: hidden;

      @media (min-width: 1281px) {
        top: 0;
        pointer-events: auto;
        transform: translate3d(0, 0, 0);
        box-shadow: $material-shadow-2dp;
      }
    }

    .md-backdrop {
      @media (min-width: 1281px) {
        opacity: 0;
        pointer-events: none;
      }
    }

    .md-toolbar {
      min-height: 172px;
      border-bottom: 1px solid rgba(#000, .12);
    }

    .brand-logo {
      font-size: 24px;
      padding: 20px 0;

      a {
        width: 100%;
        display: flex;
        flex-flow: column;
        justify-content: center;
        align-items: center;
        color: inherit;
        text-decoration: none;

        &:hover {
          color: inherit;
          text-decoration: none;
        }
      }

      img {
        width: 160px;
        margin-bottom: 16px;
      }
    }

    .main-sidebar-links {
      overflow: auto;
      flex: 1;

      .md-inset .md-list-item-container {
        padding-left: 36px;
      }

      .md-list-item-container {
        font-size: 14px;
        font-weight: 500;
      }
    }
  }

  .main-content {
    padding: 16px;
    flex: 1;
    overflow: auto;
    background-color: #fff;
    transform: translate3D(0, 0, 0);
    transition: $swift-ease-out;
    transition-delay: .2s;
  }

  .md-router-enter,
  .md-router-leave {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;

    @media (min-width: 1281px) {
      left: $sidebar-size;
    }

    .main-content {
      opacity: 0;
      overflow: hidden;
    }
  }

  .md-router-leave {
    z-index: 1;
    transition: $swift-ease-in;
    transition-duration: .25s;
  }

  .md-router-enter {
    z-index: 2;
    transition: $swift-ease-out;

    .main-content {
      transform: translate3D(0, 10%, 0);
    }
  }

  .text-center {
    text-align: center;
  }
</style>
