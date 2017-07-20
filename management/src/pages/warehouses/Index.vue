<template>
    <page-content :page-title="$t('menu.warehouses')">
        <md-card>
            <md-card-header>
                <md-toolbar class="md-transparent">
                    <h2 class="md-title" style="flex: 1">{{$t('warehouses.list')}}</h2>

                    <md-button v-on:click="createWarehouse()" class="md-icon-button md-raised md-primary">
                        <md-icon>add</md-icon>
                    </md-button>
                </md-toolbar>
            </md-card-header>

            <md-card-content>
                <md-table>
                    <md-table-header>
                        <md-table-row>
                            <md-table-head>{{$t('warehouses.name')}}</md-table-head>
                            <md-table-head>{{$t('warehouses.address')}}</md-table-head>
                            <md-table-head style="width: 100px">{{$t('warehouses.phone')}}</md-table-head>
                            <md-table-head style="width: 100px">{{$t('warehouses.useForWeb')}}</md-table-head>
                            <md-table-head style="width: 40px"></md-table-head>
                        </md-table-row>
                    </md-table-header>

                    <md-table-body>
                        <md-table-row :key="warehouse._id" v-for="warehouse in warehouses">
                            <md-table-cell>{{warehouse.name}}</md-table-cell>
                            <md-table-cell>{{warehouse.address.fullAddress | nl2comma}}</md-table-cell>
                            <md-table-cell>{{warehouse.phone}}</md-table-cell>
                            <md-table-cell>
                                <md-icon>{{warehouse.useForWeb ? 'check' : 'close'}}</md-icon>
                            </md-table-cell>
                            <md-table-cell md-numeric>
                                <md-menu md-direction="bottom left">
                                    <md-button md-menu-trigger class="md-icon-button">
                                        <md-icon>more_vert</md-icon>
                                    </md-button>
                                    <md-menu-content>
                                        <md-menu-item v-on:click="editWarehouse(warehouse._id)">
                                            <span>{{$t('buttons.edit')}}</span>
                                            <md-icon>edit</md-icon>
                                        </md-menu-item>
                                        <md-menu-item v-on:click="deleteWarehouse('confirm', warehouse)">
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
        :md-title="$t('warehouses.delete', { name: currentWarehouse.name })"
        :md-content-html="$t('common.deleteConfirm')"
        :md-ok-text="$t('buttons.ok')"
        :md-cancel-text="$t('buttons.cancel')"
        @close="deleteWarehouse"
        ref="confirm-delete-warehouse">
    </md-dialog-confirm>
</page-content>
</template>

<script>
export default {
    data() {
        return {
            loading: false,
            warehouses: [],
            currentWarehouse: {},
        };
    },
    methods: {
        loadData() {
            this.loading = true;
            this.$http.get(`warehouses`).then((res) => {
                this.warehouses = res.body;
                this.loading = false;
            }, (err) => {
                this.$root.showSnackbar(err.body);
                this.loading = false;
            });
        },
        createWarehouse() {
            this.$router.push({name: 'create-warehouse'});
        },
        editWarehouse(id) {
            this.$router.push({name: 'edit-warehouse', params: {id}});
        },
        deleteWarehouse(type, warehouse) {
            if (type === 'confirm') {
                this.currentWarehouse = warehouse;
                this.$refs['confirm-delete-warehouse'].open();
            } else if (type === 'ok') {
                this.$http.delete(
                    `warehouses/${this.currentWarehouse._id}`, this.$root.httpOptions()
                ).then(() => {
                    this.loadData();
                }).catch((err) => {
                    this.$root.showSnackbar(err.body);
                });
            } else {
                this.currentWarehouse = {};
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
