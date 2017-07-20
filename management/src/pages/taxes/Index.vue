<template>
  <page-content :page-title="$t('menu.taxes')">
    <md-card>
      <md-card-header>
        <md-toolbar class="md-transparent">
          <h2 class="md-title" style="flex: 1">{{$t('taxes.list')}}</h2>

          <md-button v-on:click="createTax()" class="md-icon-button md-raised md-primary">
            <md-icon>add</md-icon>
          </md-button>
        </md-toolbar>
      </md-card-header>

      <md-card-content>
        <md-table md-sort="calories">
          <md-table-header>
            <md-table-row>
              <md-table-head>{{$t('taxes.name')}}</md-table-head>
              <md-table-head>{{$t('taxes.value')}}</md-table-head>
              <md-table-head style="width: 100px">{{$t('taxes.default')}}</md-table-head>
              <md-table-head style="width: 40px"></md-table-head>
            </md-table-row>
          </md-table-header>

          <md-table-body>
            <md-table-row :key="tax._id" v-for="tax in taxes">
              <md-table-cell>{{tax.name}}</md-table-cell>
              <md-table-cell>{{tax.value}} %</md-table-cell>
              <md-table-cell>
                <md-icon>{{tax.default ? 'check' : 'close'}}</md-icon>
              </md-table-cell>
              <md-table-cell md-numeric>
                <md-menu md-direction="bottom left">
                  <md-button md-menu-trigger class="md-icon-button">
                    <md-icon>more_vert</md-icon>
                  </md-button>
                  <md-menu-content>
                    <md-menu-item v-on:click="editTax(tax._id)">
                      <span>{{$t('buttons.edit')}}</span>
                      <md-icon>edit</md-icon>
                    </md-menu-item>
                    <md-menu-item v-on:click="deleteTax('confirm', tax)">
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
      :md-title="$t('taxes.delete', { name: currentTax.name })"
      :md-content-html="$t('common.deleteConfirm')"
      :md-ok-text="$t('buttons.ok')"
      :md-cancel-text="$t('buttons.cancel')"
      @close="deleteTax"
      ref="confirm-delete-tax">
    </md-dialog-confirm>
  </page-content>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      taxes: [],
      currentTax: {},
    };
  },
  methods: {
    loadData() {
      this.loading = true;
      this.$http.get(`taxes`, this.$root.httpOptions()).then((res) => {
        this.taxes = res.body;
        this.loading = false;
      }, (err) => {
        this.$root.showSnackbar(err.body);
        this.loading = false;
      });
    },
    createTax() {
      this.$router.push({name: 'create-tax'});
    },
    editTax(id) {
      this.$router.push({name: 'edit-tax', params: {id}});
    },
    deleteTax(type, tax) {
      if (type === 'confirm') {
        this.currentTax = tax;
        this.$refs['confirm-delete-tax'].open();
      } else if (type === 'ok') {
        this.$http.delete(
          `taxes/${this.currentTax._id}`, this.$root.httpOptions()
        ).then(() => {
          this.loadData();
        }).catch((err) => {
          this.$root.showSnackbar(err.body);
        });
      } else {
        this.currentTax = {};
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
