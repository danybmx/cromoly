<template>
  <page-content :page-title="$t('menu.categories')">
    <md-card>
      <md-card-header>
        <md-toolbar class="md-transparent">
          <h2 class="md-title" style="flex: 1">{{$t('categories.list')}}</h2>

          <md-button v-on:click="createCategory()" class="md-icon-button md-raised md-primary">
            <md-icon>add</md-icon>
          </md-button>
        </md-toolbar>
      </md-card-header>

      <md-card-content>
        <md-table md-sort="calories">
          <md-table-header>
            <md-table-row>
              <md-table-head>{{$t('categories.name')}}</md-table-head>
              <md-table-head style="width: 100px">{{$t('categories.visible')}}</md-table-head>
              <md-table-head style="width: 40px"></md-table-head>
            </md-table-row>
          </md-table-header>

          <md-table-body>
            <md-table-row v-for="category in categories">
              <md-table-cell>{{category.name}}</md-table-cell>
              <md-table-cell>
                <md-icon>{{category.visible ? 'check' : 'close'}}</md-icon>
              </md-table-cell>
              <md-table-cell md-numeric>
                <md-menu md-direction="bottom left">
                  <md-button md-menu-trigger class="md-icon-button">
                    <md-icon>more_vert</md-icon>
                  </md-button>
                  <md-menu-content>
                    <md-menu-item v-on:click="editCategory(category._id)">
                      <span>{{$t('buttons.edit')}}</span>
                      <md-icon>edit</md-icon>
                    </md-menu-item>
                    <md-menu-item v-on:click="deleteCategory('confirm', category)">
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
      :md-title="$t('categories.delete', { name: currentCategory.name })"
      :md-content-html="$t('common.deleteConfirm')"
      :md-ok-text="$t('buttons.ok')"
      :md-cancel-text="$t('buttons.cancel')"
      @close="deleteCategory"
      ref="confirm-delete-category">
    </md-dialog-confirm>
  </page-content>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      categories: [],
      currentCategory: {},
    };
  },
  methods: {
    loadData() {
      this.loading = true;
      this.$http.get(`categories`).then((res) => {
        this.categories = res.body;
        this.loading = false;
      }, (err) => {
        this.$root.showSnackbar(err.body);
        this.loading = false;
      });
    },
    createCategory() {
      this.$router.push({name: 'create-category'});
    },
    editCategory(id) {
      this.$router.push({name: 'edit-category', params: {id}});
    },
    deleteCategory(type, category) {
      if (type === 'confirm') {
        this.currentCategory = category;
        this.$refs['confirm-delete-category'].open();
      } else if (type === 'ok') {
        this.$http.delete(
          `categories/${this.currentCategory._id}`, this.$root.httpOptions()
        ).then(() => {
          this.loadData();
        }).catch((err) => {
          this.$root.showSnackbar(err.body);
        });
      } else {
        this.currentCategory = {};
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
