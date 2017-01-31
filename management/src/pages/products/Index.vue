<template lang="html">
  <page-content :page-title="$t('menu.products')">
    <md-card>
      <md-card-header>
        <md-toolbar class="md-transparent">
          <h2 class="md-title" style="flex: 1">{{$t('products.list')}}</h2>

          <md-button class="md-icon-button">
            <md-icon>search</md-icon>
          </md-button>

          <md-button v-on:click="createProduct()" class="md-icon-button md-raised md-primary">
            <md-icon>add</md-icon>
          </md-button>
        </md-toolbar>
      </md-card-header>

      <md-card-content>
        <md-table>
          <md-table-header>
            <md-table-row>
              <md-table-head>{{$t('products.name')}}</md-table-head>
              <md-table-head style="width: 100px">{{$t('products.onDemand')}}</md-table-head>
              <md-table-head style="width: 100px" md-numeric>{{$t('products.stock')}}</md-table-head>
              <md-table-head style="width: 140px" md-numeric>{{$t('products.price')}}</md-table-head>
              <md-table-head style="width: 40px"></md-table-head>
            </md-table-row>
          </md-table-header>

          <md-table-body>
            <md-table-row v-for="product in products">
              <md-table-cell>{{product.name}}</md-table-cell>
              <md-table-cell>
                <md-icon>{{product.onDemand ? 'check' : 'close'}}</md-icon>
              </md-table-cell>
              <md-table-cell md-numeric>{{product.stock}}</md-table-cell>
              <md-table-cell md-numeric>{{product.price.toFixed(2)}} {{$root.config.currency}}</md-table-cell>
              <md-table-cell md-numeric>
                <md-menu md-direction="bottom left">
                  <md-button md-menu-trigger class="md-icon-button">
                    <md-icon>more_vert</md-icon>
                  </md-button>
                  <md-menu-content>
                    <md-menu-item>
                      <span>Edit</span>
                      <md-icon>edit</md-icon>
                    </md-menu-item>
                    <md-menu-item>
                      <span>Delete</span>
                      <md-icon>delete</md-icon>
                    </md-menu-item>
                    <md-menu-item>
                      <span>Print stickers</span>
                      <md-icon>local_offer</md-icon>
                    </md-menu-item>
                  </md-menu-content>
                </md-menu>
              </md-table-cell>
            </md-table-row>
          </md-table-body>
        </md-table>
      </md-card-content>
    </md-card>
  </page-content>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      currentProduct: {},
      products: [],
    };
  },
  methods: {
    loadProducts() {
      this.loading = true;
      this.$http.get(`products`).then((res) => {
        this.products = res.body;
        this.loading = false;
      }, (err) => {
        this.$root.showSnackbar(err.body);
        this.loading = false;
      });
    },
    createProduct() {
      this.$router.push({name: 'create-product'});
    },
    editProduct(id) {
      this.$router.push({name: 'edit-product', params: {id: id}});
    },
  },
  created() {
    this.loadProducts();
  },
};
</script>

<style lang="css">
</style>
