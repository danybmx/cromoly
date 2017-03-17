<template>
  <page-content :page-title="$t('menu.users')">
    <md-card>
      <md-card-header>
        <md-toolbar class="md-transparent">
          <h2 class="md-title" style="flex: 1">{{$t('users.list')}}</h2>

          <md-button v-on:click="createUser()" class="md-icon-button md-raised md-primary">
            <md-icon>add</md-icon>
          </md-button>
        </md-toolbar>
      </md-card-header>

      <md-card-content>
        <md-table>
          <md-table-header>
            <md-table-row>
              <md-table-head>{{$t('users.email')}}</md-table-head>
              <md-table-head>{{$t('users.role')}}</md-table-head>
              <md-table-head style="width: 40px"></md-table-head>
            </md-table-row>
          </md-table-header>

          <md-table-body>
            <md-table-row v-for="user in users">
              <md-table-cell>{{user.email}}</md-table-cell>
              <md-table-cell>{{$t('users.roles.' + user.role)}}</md-table-cell>
              <md-table-cell md-numeric>
                <md-menu md-direction="bottom left">
                  <md-button md-menu-trigger class="md-icon-button">
                    <md-icon>more_vert</md-icon>
                  </md-button>
                  <md-menu-content>
                    <md-menu-item v-on:click="editUser(user._id)">
                      <span>{{$t('buttons.edit')}}</span>
                      <md-icon>edit</md-icon>
                    </md-menu-item>
                    <md-menu-item v-on:click="deleteUser('confirm', user)">
                      <span>{{$t('buttons.delete')}}</span>
                      <md-icon>delete</md-icon>
                    </md-menu-item>
                  </md-menu-content>
                </md-menu>
              </md-table-cell>
            </md-table-row>
          </md-table-body>
        </md-table>
      </md-card-content>
    </md-card>
    <md-dialog-confirm
    :md-title="$t('users.delete', { name: currentUser.name })"
    :md-content-html="$t('common.deleteConfirm')"
    :md-ok-text="$t('buttons.ok')"
    :md-cancel-text="$t('buttons.cancel')"
    @close="deleteUser"
    ref="confirm-delete-user">
  </md-dialog-confirm>
</page-content>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      users: [],
      currentUser: {},
    };
  },
  methods: {
    loadData() {
      this.loading = true;
      this.$http.get(`users`, this.$root.httpOptions()).then((res) => {
        this.users = res.body;
        this.loading = false;
      }, (err) => {
        this.$root.showSnackbar(err.body);
        this.loading = false;
      });
    },
    createUser() {
      this.$router.push({name: 'create-user'});
    },
    editUser(id) {
      this.$router.push({name: 'edit-user', params: {id}});
    },
    deleteUser(type, user) {
      if (type === 'confirm') {
        this.currentUser = user;
        this.$refs['confirm-delete-user'].open();
      } else if (type === 'ok') {
        this.$http.delete(
          `users/${this.currentUser._id}`, this.$root.httpOptions()
        ).then(() => {
          this.loadData();
        }).catch((err) => {
          this.$root.showSnackbar(err.body);
        });
      } else {
        this.currentUser = {};
      }
    },
  },
  created() {
    this.loadData();
  },
};
</script>

<style lang="css">
</style>
