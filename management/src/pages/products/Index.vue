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
              <md-table-head style="width: 100px">{{$t('products.featured')}}</md-table-head>
              <md-table-head style="width: 140px" md-numeric>{{$t('products.price')}}</md-table-head>
              <md-table-head style="width: 40px"></md-table-head>
            </md-table-row>
          </md-table-header>

          <md-table-body :key="product._id" v-for="product in products">
            <md-table-row>
              <md-table-cell>
                {{product.name}}
              </md-table-cell>
              <md-table-cell>
                <md-icon>{{product.onDemand ? 'check' : 'close'}}</md-icon>
              </md-table-cell>
              <md-table-cell>
                <md-icon>{{product.featured ? 'check' : 'close'}}</md-icon>
              </md-table-cell>
              <md-table-cell md-numeric>
                {{product.lowestPrice | currency}} {{$root.config.currency}}
              </md-table-cell>
              <md-table-cell md-numeric>
                <md-menu md-direction="bottom left">
                  <md-button md-menu-trigger class="md-icon-button">
                    <md-icon>more_vert</md-icon>
                  </md-button>
                  <md-menu-content>
                    <md-menu-item v-on:click="editProduct(product._id)">
                      <span>Edit</span>
                      <md-icon>edit</md-icon>
                    </md-menu-item>
                    <md-menu-item v-on:click="deleteProduct('confirm', product)">
                      <span>Delete</span>
                      <md-icon>delete</md-icon>
                    </md-menu-item>
                  </md-menu-content>
                </md-menu>
                <md-button class="md-icon-button" v-on:click="showProduct(product)">
                  <md-icon>visibility</md-icon>
                </md-button>
              </md-table-cell>
            </md-table-row>
          </md-table-body>
        </md-table>
      </md-card-content>
    </md-card>
    <md-dialog @close="onClose" ref="product-dialog">
      <md-dialog-title v-if="product != null">
        {{product.name}}
      </md-dialog-title>
      <md-dialog-content v-if="product != null">
        <md-table>
          <md-table-header>
            <md-table-row>
              <md-table-head>{{$t('products.options.name')}}</md-table-head>
              <md-table-head md-numeric>{{$t('products.options.price')}}</md-table-head>
              <md-table-head md-numeric>{{$t('products.options.buyPrice')}}</md-table-head>
              <md-table-head md-numeric :key="warehouse._id" v-for="warehouse in warehouses">{{warehouse.name}}</md-table-head>
            </md-table-row>
          </md-table-header>
          <md-table-body :key="option._id" v-for="option in product.options">
            <md-table-row>
              <md-table-cell>{{option.name}}</md-table-cell>
              <md-table-cell md-numeric :title="option.price | currency">{{option.priceWithTaxes | currency}} {{$root.config.currency}}</md-table-cell>
              <md-table-cell md-numeric :title="option.buyPrice | currency">{{option.buyPriceWithTaxes | currency}} {{$root.config.currency}}</md-table-cell>
              <md-table-cell md-numeric :key="warehouse._id" v-for="warehouse in warehouses">{{getStockForWarehouse(warehouse._id, option.stock)}}</md-table-cell>
            </md-table-row>
          </md-table-body>
        </md-table>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button v-on:click="closeProduct()" class="md-primary md-raised">
          {{$t('buttons.close')}}
          <md-icon>close</md-icon>
        </md-button>
      </md-dialog-actions>
    </md-dialog>
    <md-dialog-confirm
      :md-title="$t('products.delete', { name: currentProduct.name })"
      :md-content-html="$t('common.deleteConfirm')"
      :md-ok-text="$t('buttons.ok')"
      :md-cancel-text="$t('buttons.cancel')"
      @close="deleteProduct"
      ref="confirm-delete-product">
    </md-dialog-confirm>
  </page-content>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      currentProduct: {},
      product: null,
      products: [],
      warehouses: [],
    };
  },
  methods: {
    loadData() {
      this.loading = true;
      this.$http.get(`products`).then((res) => {
        this.products = res.body;
        this.loading = false;
      }, (err) => {
        this.$root.showSnackbar(err.body);
        this.loading = false;
      });
      const productsPromise = this.$http.get('products');
      const warehousesPromise = this.$http.get('warehouses', this.$root.httpOptions());

      Promise.all([warehousesPromise, productsPromise]).then((data) => {
        this.warehouses = data[0].body;
        this.products = data[1].body;
        this.loading = false;
      }).catch((err) => {
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
    showProduct(product) {
      this.product = product;
      this.$refs['product-dialog'].open();
    },
    getStockForWarehouse(warehouseId, stockArray) {
      let units = 0;
      stockArray.map((s) => {
        if (s.warehouse === warehouseId.toString()) {
          units = s.units;
        }
      });
      return units;
    },
    closeProduct() {
      this.$refs['product-dialog'].close();
    },
    deleteProduct(type, product) {
      if (type === 'confirm') {
        this.currentProduct = product;
        this.$refs['confirm-delete-product'].open();
      } else if (type === 'ok') {
        this.$http.delete(
          `products/${this.currentProduct._id}`, this.$root.httpOptions()
        ).then(() => {
          this.loadData();
        }).catch((err) => {
          this.$root.showSnackbar(err.body);
        });
      } else {
        this.currentTax = {};
      }
    },
    onClose() {
      setTimeout(() => {
        this.product = null;
      }, 300);
    },
  },
  created() {
    this.loadData();
  },
};
</script>

<style lang="css">
</style>
