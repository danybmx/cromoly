<template>
  <page-content :page-title="$t('menu.products')">

    <loader :loading="loading"></loader>

    <form data-vv-scope="product-form" novalidate v-on:submit.prevent="saveProduct()">
      <md-card>

        <md-card-header>
          <md-toolbar class="md-transparent">
            <md-button v-on:click="$router.back()" class="md-icon-button md-primary">
              <md-icon>arrow_back</md-icon>
            </md-button>
            <h2 class="md-title">{{$t(`products.${action}`)}}</h2>
          </md-toolbar>
        </md-card-header>

        <md-card-content>

          <md-input-container :class="{'md-input-invalid': errors.has('product-form.name')}">
            <label>{{$t('products.name')}}</label>
            <md-input v-model="product.name" data-vv-name="name" v-validate data-vv-rules="required" required></md-input>
            <span class="md-error" v-if="errors.has('product-form.name')">{{errors.first('product-form.name')}}</span>
          </md-input-container>

          <md-input-container :class="{'md-input-invalid': errors.has('product-form.description')}">
            <label>{{$t('products.description')}}</label>
            <md-textarea v-model="product.description" data-vv-name="description" v-validate data-vv-rules="required" required></md-textarea>
            <span class="md-error" v-if="errors.has('product-form.description')">{{errors.first('product-form.description')}}</span>
          </md-input-container>

          <md-layout md-row :md-gutter="16">
            <md-layout md-column>
              <md-input-container :class="{'md-input-invalid': errors.has('product-form.category')}">
                <label>{{$t('products.category')}}</label>
                <input type="hidden" v-model="product.category" data-vv-name="category" v-validate data-vv-rules="required">
                <md-select v-model="product.category" required>
                  <md-option v-for="category in categories" :value="category._id" :key="category._id">
                    {{category.name}}
                  </md-option>
                </md-select>
                <span class="md-error" v-if="errors.has('product-form.category')">{{errors.first('product-form.category')}}</span>
              </md-input-container>
            </md-layout>
            <md-layout md-column>
              <md-input-container :class="{'md-input-invalid': errors.has('product-form.brand')}">
                <label>{{$t('products.brand')}}</label>
                <input type="hidden" v-model="product.brand" data-vv-name="brand" v-validate data-vv-rules="required">
                <md-select v-model="product.brand" data-vv-name="brand" v-validate data-vv-rules="required" required>
                  <md-option :key="brand._id" v-for="brand in brands" :value="brand._id">
                    {{brand.name}}
                  </md-option>
                </md-select>
                <span class="md-error" v-if="errors.has('product-form.brand')">{{errors.first('product-form.brand')}}</span>
              </md-input-container>
            </md-layout>
          </md-layout>

          <md-layout md-row>
            <md-layout md-column>
              <md-switch v-model="product.visible" class="md-primary">{{$t('products.visible')}}</md-switch>
            </md-layout>
            <md-layout md-column>
              <md-switch v-model="product.featured" class="md-primary">{{$t('products.featured')}}</md-switch>
            </md-layout>
            <md-layout md-column>
              <md-switch v-model="product.onDemand" class="md-primary">{{$t('products.onDemand')}}</md-switch>
            </md-layout>
          </md-layout>

          <md-card style="margin-top: 20px">
            <md-card-header>
              <md-toolbar class="md-transparent">
                <h2 class="md-title" style="flex: 1">{{$t('products.options.title')}}</h2>

                <md-button v-on:click="addOption()" class="md-icon-button md-raised md-primary">
                  <md-icon>add</md-icon>
                </md-button>
              </md-toolbar>
            </md-card-header>

            <md-card-content>
              <md-table>
                <md-table-header>
                  <md-table-row>
                    <md-table-head>{{$t('products.name')}}</md-table-head>
                    <md-table-head style="width: 300px" md-numeric>{{$t('products.stock')}}</md-table-head>
                    <md-table-head style="width: 140px" md-numeric>{{$t('products.price')}}</md-table-head>
                    <md-table-head style="width: 40px"></md-table-head>
                  </md-table-row>
                </md-table-header>

                <md-table-body>
                  <md-table-row v-for="(option, index) in product.options" :key="index">
                    <md-table-cell>{{option.name}}</md-table-cell>
                    <md-table-cell md-numeric>{{getFormattedStock(option.stock)}}</md-table-cell>
                    <md-table-cell md-numeric>{{option.priceWithTaxes | currency}} {{$root.config.currency}}</md-table-cell>
                    <md-table-cell md-numeric>
                      <md-menu md-direction="bottom left">
                        <md-button md-menu-trigger class="md-icon-button">
                          <md-icon>more_vert</md-icon>
                        </md-button>
                        <md-menu-content>
                          <md-menu-item v-on:click="editOption(index)">
                            <span>{{$t('buttons.edit')}}</span>
                            <md-icon>edit</md-icon>
                          </md-menu-item>
                          <md-menu-item v-on:click="editStock(index)">
                            <span>{{$t('products.stock')}}</span>
                            <md-icon>view_comfy</md-icon>
                          </md-menu-item>
                          <md-menu-item v-on:click="deleteOption(index)">
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

        </md-card-content>

        <md-card-actions>
          <md-button type="submit" class="md-primary md-raised">
            {{$t('buttons.save')}}
            <md-icon>check</md-icon>
          </md-button>
        </md-card-actions>

      </md-card>
    </form>

    <md-dialog @close="onClose" ref="product-option-dialog">
      <form novalidate v-if="currentOption !== null" style="width: 900px" v-on:submit.prevent="saveProductOption()">
        <md-dialog-title>
          {{$t('products.options.singularTitle')}}{{currentOption.name ? ': ' + currentOption.name : '' }}
        </md-dialog-title>
        <md-dialog-content>
          <md-layout md-gutter="16">
            <md-layout md-column>
              <md-input-container>
                <label>{{$t('products.options.ean')}}</label>
                <md-input data-vv-scope="product-option-form" v-model="currentOption.ean"></md-input>
              </md-input-container>
            </md-layout>
            <md-layout md-column>
              <md-input-container>
                <label>{{$t('products.options.reference')}}</label>
                <md-input data-vv-scope="product-option-form" v-model="currentOption.reference"></md-input>
              </md-input-container>
            </md-layout>
          </md-layout>

          <md-input-container :class="{'md-input-invalid': errors.has('product-option-form.name')}">
            <label>{{$t('products.options.name')}}</label>
            <md-input data-vv-scope="product-option-form" v-model="currentOption.name" data-vv-name="name" v-validate data-vv-rules="required" required></md-input>
            <span class="md-error" v-if="errors.has('product-option-form.name')">{{errors.first('product-option-form.name')}}</span>
          </md-input-container>

          <md-layout md-gutter="16">
            <md-layout md-column>
              <md-input-container :class="{'md-input-invalid': errors.has('product-option-form.taxes')}">
                <label>{{$t('products.options.taxes')}}</label>
                <input data-vv-scope="product-option-form" v-model="currentOption.taxes" data-vv-name="taxes" v-validate data-vv-rules="required|min:16">
                <md-select multiple v-model="currentOption.taxes" required>
                  <md-option :key="tax._id" v-for="tax in taxes" :value="tax._id">{{tax.name}}</md-option>
                </md-select>
                <span class="md-error" v-if="errors.has('product-option-form.taxes')">{{errors.first('product-option-form.taxes')}}</span>
              </md-input-container>
            </md-layout>
            <md-layout md-column>
              <md-input-container>
                <label>{{$t('products.options.priceWithTaxes')}}</label>
                <md-input data-vv-scope="product-option-form" @input="updatePriceWithoutTaxes()" v-model="currentOption.priceWithTaxes"></md-input>
              </md-input-container>
            </md-layout>
            <md-layout md-column>
              <md-input-container>
                <label>{{$t('products.options.price')}}</label>
                <md-input data-vv-scope="product-option-form" v-model="currentOption.price"></md-input>
              </md-input-container>
            </md-layout>
            <md-layout md-column>
              <md-input-container>
                <label>{{$t('products.options.discount')}}</label>
                <md-input data-vv-scope="product-option-form" v-model="currentOption.discount"></md-input>
              </md-input-container>
            </md-layout>
          </md-layout>

          <md-layout md-gutter="16">
            <md-layout md-column>
              <md-input-container :class="{'md-input-invalid': errors.has('product-option-form.taxes')}">
                <label>{{$t('products.options.buyTaxes')}}</label>
                <input data-vv-scope="product-option-form" v-model="currentOption.buyTaxes" data-vv-name="buyTaxes" v-validate data-vv-rules="required|min:16">
                <md-select multiple v-model="currentOption.buyTaxes" required>
                  <md-option :key="tax._id" v-for="tax in taxes" :value="tax._id">{{tax.name}}</md-option>
                </md-select>
                <span class="md-error" v-if="errors.has('product-option-form.buyTaxes')">{{errors.first('product-option-form.buyTaxes')}}</span>
              </md-input-container>
            </md-layout>
            <md-layout md-column>
              <md-input-container>
                <label>{{$t('products.options.buyPriceWithTaxes')}}</label>
                <md-input data-vv-scope="product-option-form" @input="updateBuyPriceWithoutTaxes()" v-model="currentOption.buyPriceWithTaxes"></md-input>
              </md-input-container>
            </md-layout>
            <md-layout md-column>
              <md-input-container>
                <label>{{$t('products.options.buyPrice')}}</label>
                <md-input data-vv-scope="product-option-form" v-model="currentOption.buyPrice"></md-input>
              </md-input-container>
            </md-layout>
            <md-layout md-column>
              <md-input-container>
                <label>{{$t('products.options.buyDiscount')}}</label>
                <md-input data-vv-scope="product-option-form" v-model="currentOption.buyDiscount"></md-input>
              </md-input-container>
            </md-layout>
          </md-layout>
        </md-dialog-content>

        <md-dialog-actions>
          <md-button v-on:click="closeProductOptionForm()" class="md-primary md-raised">
            {{$t('buttons.cancel')}}
            <md-icon>close</md-icon>
          </md-button>
          <md-button type="submit" class="md-primary md-raised">
            {{$t('buttons.save')}}
            <md-icon>check</md-icon>
          </md-button>
        </md-dialog-actions>
      </form>
    </md-dialog>

    <md-dialog @close="onClose" ref="product-option-stock-dialog">
      <form novalidate v-if="currentOption !== null" style="width: 900px" v-on:submit.prevent="saveProductStock()">
        <md-dialog-title>
          Stock
        </md-dialog-title>
        <md-dialog-content>
          <md-layout md-gutter="16">
            <md-layout md-column>
              <md-input-container :key="warehouse._id" v-for="warehouse in warehouses">
                <label>{{warehouse.name}}</label>
                <md-input data-vv-scope="product-option-stock-form" v-validate data-vv-rules="required" v-model="currentStock[warehouse._id]"></md-input>
              </md-input-container>
            </md-layout>
          </md-layout>
        </md-dialog-content>
        <md-dialog-actions>
          <md-button v-on:click="closeProductOptionStockForm()" class="md-primary md-raised">
            {{$t('buttons.cancel')}}
            <md-icon>close</md-icon>
          </md-button>
          <md-button type="submit" class="md-primary md-raised">
            {{$t('buttons.save')}}
            <md-icon>check</md-icon>
          </md-button>
        </md-dialog-actions>
      </form>
    </md-dialog>
  </page-content>
</template>

<script>
export default {
  data() {
    return {
      action: this.$route.name === 'create-product' ? 'create' : 'edit',
      product: {
        name: null,
        description: null,
        category: null,
        brand: null,
        visible: true,
        featured: false,
        onDemand: false,
        options: [],
      },
      currentOption: null,
      currentOptionIndex: null,
      currentStock: {},
      brands: [],
      images: [],
      categories: [],
      warehouses: [],
      loading: false,
    };
  },
  methods: {
    saveProduct() {
      this.$validator.validateAll('product-form').then((success) => {
        this.loading = true;
        let promise = null;

        if (this.category._id) {
          promise = this.$http.put(`products/${this.product._id}`, this.product, this.$root.httpOptions());
        } else {
          promise = this.$http.post(`products`, this.product, this.$root.httpOptions());
        }

        promise.then(() => {
          this.loading = false;
          this.$router.back();
        }).catch((err) => {
          this.loading = false;
          this.$root.showSnackbar(this.$t('errors.errorSaving'));
          console.error(err);
        });
      }).catch(() => {
        return this.$root.showSnackbar(this.$t('errors.checkTheForm'));
      });
    },

    saveProductOption() {
      this.$validator.validateAll('product-option-form').then((success) => {
        if (this.currentOptionIndex !== null) {
          this.product.options[this.currentOptionIndex] = this.currentOption;
        } else {
          this.product.options.push(this.currentOption);
        }
        this.closeProductOptionForm();
      }).catch(() => {
        return this.$root.showSnackbar(this.$t('errors.checkTheForm'));
      });
    },

    closeProductOptionForm() {
      this.$refs['product-option-dialog'].close();
    },

    saveProductStock() {
      this.$validator.validateAll('product-option-stock-form').then((success) => {
        let stock = [];

        for (let key in this.currentStock) {
          if (this.currentStock.hasOwnProperty(key)) {
            const s = this.currentStock[key];
            stock.push({
              warehouse: key,
              units: s,
            });
          }
        }

        this.product.options[this.currentOptionIndex].stock = stock;
        this.currentOptionIndex = null;
        this.currentStock = {};
        this.closeProductOptionStockForm();
      }).catch((err) => {
        console.error(err);
        return this.$root.showSnackbar(this.$t('errors.checkTheForm'));
      });
    },

    closeProductOptionStockForm() {
      this.$refs['product-option-stock-dialog'].close();
    },

    getDefaultTaxes() {
      return this.taxes.map((t) => t.default ? t._id : null);
    },

    createEmptyStockObject() {
      let stock = [];
      this.warehouses.map((warehouse) => {
        stock.push({
          warehouse: warehouse._id,
          units: 0,
        });
      });
      return stock;
    },

    getFormattedStock(stockArray) {
      let stockStringBuilder = [];
      this.warehouses.map((warehouse) => {
        let units = 0;
        stockArray.map((s) => {
          if (s.warehouse === warehouse._id.toString()) {
            units = s.units;
          }
        });
        stockStringBuilder.push(`${warehouse.name}: ${units}`);
      });
      return stockStringBuilder.join(', ');
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

    onClose() {
      setTimeout(() => {
        this.currentOptionIndex = null;
        this.currentOption = null;
      }, 300);
    },

    addOption() {
      this.currentOption = {
        ean: '',
        reference: '',
        name: '',
        taxes: this.getDefaultTaxes(),
        buyTaxes: this.getDefaultTaxes(),
        stock: this.createEmptyStockObject(),
        images: [],
        discount: null,
        buyDiscount: null,
        price: null,
        buyPrice: null,
        priceWithTaxes: null,
        buyPriceWithTaxes: null,
      };
      this.currentOptionIndex = null;
      this.$refs['product-option-dialog'].open();
    },

    editStock(index) {
      this.currentOptionIndex = index;
      this.currentOption = Object.assign({}, this.product.options[index]);
      this.currentStock = {};

      this.warehouses.map((w) => {
        this.currentStock[w._id] = this.getStockForWarehouse(w._id, this.currentOption.stock);
      });

      this.$refs['product-option-stock-dialog'].open();
    },

    editOption(index) {
      this.currentOptionIndex = index;
      this.currentOption = Object.assign({}, this.product.options[index]);
      this.$refs['product-option-dialog'].open();
    },

    deleteOption(index) {
      if (this.currentOption === index) {
        this.currentOptionIndex = null;
        this.currentOption = null;
      }
      if (this.currentOption > index) this.currentOptionIndex -= 1;
      this.product.options.splice(index, 1);
    },

    updatePriceWithoutTaxes() {
      let taxes = 1;
      this.taxes.map((tax) => {
        if (this.currentOption.taxes.indexOf(tax._id) > -1) {
          taxes += tax.value / 100;
        }
      });
      this.currentOption.price = Math.round(this.currentOption.priceWithTaxes / taxes * 100) / 100;
    },

    updateBuyPriceWithoutTaxes() {
      let taxes = 1;
      this.taxes.map((tax) => {
        if (this.currentOption.buyTaxes.indexOf(tax._id) > -1) {
          taxes += tax.value / 100;
        }
      });
      this.currentOption.buyPrice = Math.round(this.currentOption.buyPriceWithTaxes / taxes * 100) / 100;
    },

    saveProduct() {
      this.$validator.validateAll().then((success) => {
        this.loading = true;

        let promise = null;
        if (this.product._id) {
          promise = this.$http.put(`products/${this.product._id}`, this.product, this.$root.httpOptions());
        } else {
          promise = this.$http.post(`products`, this.product, this.$root.httpOptions());
        }

        promise.then(() => {
          this.loading = false;
          this.$router.back();
        }).catch((err) => {
          this.loading = false;
          this.$root.showSnackbar(this.$t('errors.errorSaving'));
          console.error(err);
        });
      }).catch((err) => {
        console.error(err);
        return this.$root.showSnackbar(this.$t('errors.checkTheForm'));
      });
    },
  },

  mounted() {
    this.loading = true;
    const categoriesPromise = this.$http.get('categories');
    const brandsPromise = this.$http.get('brands');
    const taxesPromise = this.$http.get('taxes', this.$root.httpOptions());
    const warehousesPromise = this.$http.get('warehouses', this.$root.httpOptions());
    let productPromise;

    if (this.action === 'edit') {
      productPromise = this.$http.get('products/' + this.$route.params.id);
    } else {
      productPromise = Promise.resolve({body: this.product});
    }

    Promise.all([categoriesPromise, brandsPromise, taxesPromise, warehousesPromise, productPromise]).then((data) => {
      this.loading = false;
      this.categories = data[0].body;
      this.brands = data[1].body;
      this.taxes = data[2].body;
      this.warehouses = data[3].body;
      this.product = data[4].body;
    }).catch((err) => {
      console.error(err);
      this.loading = false;
      this.$root.showSnackbar('errors.cantLoadResources');
      this.$router.back();
    });
  },
};
</script>

<style lang="css">
</style>
