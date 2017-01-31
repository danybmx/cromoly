<template>
  <page-content :page-title="$t('menu.categories')">
    <loader :loading="loading"></loader>

    <form novalidate v-on:submit.prevent="saveCategory()">
      <md-card>

        <md-card-header>
          <md-toolbar class="md-transparent">
            <md-button v-on:click="$router.back()" class="md-icon-button md-primary">
              <md-icon>arrow_back</md-icon>
            </md-button>
            <h2 class="md-title">{{$t(`categories.${action}`)}}</h2>
          </md-toolbar>
        </md-card-header>

        <md-card-content>

          <md-input-container :class="{'md-input-invalid': errors.has('name')}">
            <label>{{$t('categories.name')}}:</label>
            <md-input v-model="category.name" data-vv-name="name" v-validate data-vv-rules="required" required></md-input>
            <span class="md-error" v-if="errors.has('name')">{{errors.first('name')}}</span>
          </md-input-container>

          <md-input-container :class="{'md-input-invalid': errors.has('slug')}">
            <label>{{$t('categories.slug')}}:</label>
            <md-input v-model="category.slug" data-vv-name="slug" v-validate data-vv-rules="required|alpha_dash" required></md-input>
            <span class="md-error" v-if="errors.has('slug')">{{errors.first('slug')}}</span>
          </md-input-container>

          <md-switch v-model="category.visible">{{$t('categories.visible')}}</md-switch>

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
      action: this.$route.name === 'create-category' ? 'create' : 'edit',
      category: {
        _id: null,
        name: null,
        description: null,
        visible: true,
      },
      formErrors: {},
      categories: [],
      loading: false,
    };
  },
  methods: {
    saveCategory() {
      this.$validator.validateAll().then((success) => {
        if (!success) {
          return this.$root.showSnackbar(this.$t('errors.checkTheForm'));
        }

        this.loading = true;

        let promise = null;
        if (this.category._id) {
          promise = this.$http.put(`categories/${this.category._id}`, this.category, this.$root.httpOptions());
        } else {
          promise = this.$http.post(`categories`, this.category, this.$root.httpOptions());
        }

        promise.then(() => {
          this.loading = false;
          this.$router.back();
        }).catch((err) => {
          this.loading = false;
          this.$root.showSnackbar(this.$t('errors.errorSaving'));
          console.error(err);
        });
      });
    },
  },
  mounted() {
    if (this.$route.name === 'edit-category') {
      this.loading = true;
      this.$http.get(`categories/${this.$route.params.id}`).then((data) => {
        this.loading = false;
        this.category = data.body;
      }).catch((err) => {
        console.error(err);
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
