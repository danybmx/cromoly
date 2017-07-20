<template>
  <page-content :page-title="$t('menu.brands')">
    <md-card>
      <md-card-header>
        <md-toolbar class="md-transparent">
          <h2 class="md-title" style="flex: 1">{{$t('brands.list')}}</h2>

          <md-button v-on:click="createBrand()" class="md-icon-button md-raised md-primary">
            <md-icon>add</md-icon>
          </md-button>
        </md-toolbar>
      </md-card-header>

      <md-card-content>
        <md-table md-sort="calories">
          <md-table-header>
            <md-table-row>
              <md-table-head>{{$t('brands.name')}}</md-table-head>
              <md-table-head style="width: 100px">{{$t('brands.visible')}}</md-table-head>
              <md-table-head style="width: 40px"></md-table-head>
            </md-table-row>
          </md-table-header>

          <md-table-body>
            <md-table-row v-for="brand in brands" :key="brand._id">
              <md-table-cell>{{brand.name}}</md-table-cell>
              <md-table-cell>
                <md-icon>{{brand.visible ? 'check' : 'close'}}</md-icon>
              </md-table-cell>
              <md-table-cell md-numeric>
                <md-menu md-direction="bottom left">
                  <md-button md-menu-trigger class="md-icon-button">
                    <md-icon>more_vert</md-icon>
                  </md-button>
                  <md-menu-content>
                    <md-menu-item v-on:click="editBrand(brand._id)">
                      <span>{{$t('buttons.edit')}}</span>
                      <md-icon>edit</md-icon>
                    </md-menu-item>
                    <md-menu-item v-on:click="deleteBrand('confirm', brand)">
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
      :md-title="$t('brands.delete', { name: currentBrand.name })"
      :md-content-html="$t('common.deleteConfirm')"
      :md-ok-text="$t('buttons.ok')"
      :md-cancel-text="$t('buttons.cancel')"
      @close="deleteBrand"
      ref="confirm-delete-brand">
    </md-dialog-confirm>
  </page-content>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      brands: [],
      currentBrand: {},
    };
  },
  methods: {
    loadData() {
      this.loading = true;
      this.$http.get(`brands`).then((res) => {
        this.brands = res.body;
        this.loading = false;
      }, (err) => {
        this.$root.showSnackbar(err.body);
        this.loading = false;
      });
    },
    createBrand() {
      this.$router.push({name: 'create-brand'});
    },
    editBrand(id) {
      this.$router.push({name: 'edit-brand', params: {id}});
    },
    deleteBrand(type, brand) {
      if (type === 'confirm') {
        this.currentBrand = brand;
        this.$refs['confirm-delete-brand'].open();
      } else if (type === 'ok') {
        this.$http.delete(
          `brands/${this.currentBrand._id}`, this.$root.httpOptions()
        ).then(() => {
          this.loadData();
        }).catch((err) => {
          this.$root.showSnackbar(err.body);
        });
      } else {
        this.currentBrand = {};
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
