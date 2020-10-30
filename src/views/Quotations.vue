<template>
    <div>
        <base-header class="header pb-4 pt-3 pt-lg-5 d-flex align-items-center"
                     style="min-height: 50px;">
            <!-- Mask -->
            <span style="background-color:#172b4d !important" class="mask  opacity-7"></span>
            <!-- Header container -->
            
        </base-header>

        <div class="container-fluid mt-5">
            <h1>Registro de cotizaciones</h1>
            <modal :show.sync="modals.modal2" modal-classes="modal-lg">
                <h6 slot="header" class="modal-title" id="modal-title-default">Cotización - {{formatDate(dateView)}}</h6>
                <card type="secondary" shadow
                  header-classes="bg-white"
                  body-classes=""
                  class="border-0 pt-0">
                    <div class="text-center">
                        <base-button type="primary" style="margin-top:-10%;margin-bottom:5%">Detalle de cotización</base-button>
                    </div>
                        <card shadow>
                            <dt class="text-center">Datos del cliente</dt>
                            <div class="row">
                               <div class="col-md-6 mt-1" v-for="data in quotations[actualQuotation].dataClient" :key="data.id">
                                    <textarea v-if="data.name == 'description'" v-model="data.data" readonly class="form-control form-control-alternative mt-1" rows="3" placeholder="Write a large text here ..."></textarea>
                                    <div v-else class="mb-2 w-100">
                                        <label for="">{{data.name}}</label><br>
                                        <badge style="font-size:1em !important" class="text-default" type="success">{{data.data}}</badge>
                                    </div>
                                </div> 
                            </div>
                            <dt class="mt-3 text-center">Productos</dt>  
                            <badge v-for="data of quotations[actualQuotation].products" :key="data._id" class="mt-1 ml-1 text-default" type="success">{{data.name}}</badge>
                        </card>
                </card>
                <base-button class="mt-3 mx-auto mb-3 float-right" type="success" v-on:click="verifyQuotation(quotations[actualQuotation]._id)">Notificar vista</base-button>
            </modal>
            <a-table :columns="columns" :data-source="quotations">
                <span slot="quantity" slot-scope="text, record"> {{record.products.length}}</span>
                <span slot="client" slot-scope="text, record"> {{record.dataClient[0].data}} {{record.dataClient[1].data}}</span>
                <span slot="action" slot-scope="text, record, index">
                    <base-button @click="modals.modal2 = true , actualQuotation = index, dateView = record.createdAt">Revisar</base-button>
                </span>
                <span slot="date" slot-scope="text, record">{{formatDate(record.createdAt)}}</span>
            </a-table>
        </div>
    </div>
</template>
<script>
//Back - End 
import axios from 'axios'
import router from '../router'
import endPoint from '../../config-endpoint/endpoint.js'
import jwtDecode from 'jwt-decode'
import moment from 'moment';
export default {
    data(){
        return {
            modals: {
                modal1:false,
                modal2:false
            },
            dateView: '',
            quotations:'',
            configHeader: {headers:{"x-database-connect":endPoint.dataBase,"x-access-token":localStorage.userToken}},
            actualQuotation:0,
            columns: [
                {
                    title: 'Fecha',
                    dataIndex: 'createdAt',
                    key: 'date',
                    slots: { title: 'customTitle' },
                    scopedSlots: { customRender: 'date' },
                },
                {
                    title: 'Cliente',
                    dataIndex: 'dataClient',
                    key: 'client',
                    scopedSlots: { customRender: 'client' },
                },
                {
                    title: 'Cantidad de productos',
                    key: 'address',
                    scopedSlots: { customRender: 'quantity' },
                },
                {
                    title: 'Acciones',
                    key: 'action',
                    scopedSlots: { customRender: 'action' },
                },
            ],
            
        }
    },
    beforeCreate(){
        if (!localStorage.getItem('userToken')) {
            this.$swal({ 
                type: 'error',
                icon: 'error',
                title: 'URL restringida',
                showConfirmButton: false,
                timer: 2000
            })
            router.push({name: 'login'})
		}
    },
    created(){
        this.getQuotations()
    },
    methods: {
        getQuotations(){
            axios.get(endPoint.endpointTarget+'/quotations',this.configHeader)
            .then(res => {
                this.quotations = res.data.quotations
                console.log(this.quotations)
            })
        },
        formatDate(date) {
            let dateFormat = new Date(date)
            return moment(dateFormat).format('DD-MM-YYYY, h:mm:ss a')
        },
        verifyQuotation(id){
            console.log(id)
        }
    }
}
</script>
<style>
     
    
</style>