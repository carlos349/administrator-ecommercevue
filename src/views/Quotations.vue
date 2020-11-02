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
                    <tabs fill class="flex-column flex-md-row">
                        <tab-pane>
                            <span slot="title">
                                <i class="ni ni-circle-08"></i>
                                Datos del cliente
                            </span>
                                <card type="secondary" shadow
                                    header-classes="bg-white"
                                    body-classes=""
                                    class="border-0 pt-0">
                                    <dt class="text-center mb-1">Datos del cliente</dt>
                                    <div class="row">
                                        <div class="col-md-6 mt-1" v-for="data in quotations[actualQuotation].dataClient" :key="data.id">
                                            <textarea v-if="data.name == 'description'" v-model="data.data" readonly class="form-control form-control-alternative mt-1" rows="3" placeholder="Write a large text here ..."></textarea>
                                            <div v-else class="mb-2 w-100">
                                                <label for="">{{data.name}}</label><br>
                                                <badge style="font-size:1em !important" class="text-default" type="success">{{data.data}}</badge>
                                            </div>
                                        </div> 
                                    </div>
                                </card>
                        </tab-pane>
                        <tab-pane title="Profile">
                            <span slot="title">
                                <i class="ni ni-bag-17 mr-2"></i>
                                Productos
                            </span>
                            <div class="row">
                                <div class="col-md-6 mt-1" v-for="data of quotations[actualQuotation].products" :key="data.id">
                                    <card type="secondary" shadow
                                        header-classes="bg-white"
                                        body-classes=""
                                        class="border-0 pt-0">
                                        <img class="w-100" :src="data.image" alt="">
                                        <h2>{{data.name}}</h2>  
                                        <p>Cantidad: {{data.qty}}</p>
                                        <p>Color: <span class="colorProduct">col</span></p>
                                    </card>
                                </div> 
                            </div>
                        </tab-pane>
                    </tabs>
                </card>
                <base-button class="mt-3 mx-auto mb-3 float-right" v-if="quotations[actualQuotation].status == 'pending'" type="success" v-on:click="verifyQuotation(quotations[actualQuotation]._id, 'notify')">Notificar vista</base-button>
                <base-button v-else-if="quotations[actualQuotation].status == 'viewed'" class="mt-3 mx-auto mb-3 float-right" type="default" v-on:click="verifyQuotation(quotations[actualQuotation]._id, 'finally')">Finalizar</base-button>
                <base-button v-else class="mt-3 mx-auto mb-3 float-right" disabled type="warning">Finalizada</base-button>
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
        verifyQuotation(id, status){
            if (status == 'notify') {
                axios.put(endPoint.endpointTarget+'/quotations/'+id, {
                    status: 'viewed'
                }, this.configHeader)
                .then(res => {
                    this.getQuotations()
                    this.$swal({
                        type: 'success',
                        icon: 'success',
                        toast: true,
                        position: 'top-end',
                        timer: 3000,
                        timerProgressBar: true,
                        title: 'Cliente notificado con éxito',
                        showConfirmButton: false,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    })
                    console.log(this.quotations)
                })  
            }else{
                axios.put(endPoint.endpointTarget+'/quotations/'+id, {
                    status: 'finished'
                }, this.configHeader)
                .then(res => {
                    this.getQuotations()
                    this.$swal({
                        type: 'success',
                        icon: 'success',
                        toast: true,
                        position: 'top-end',
                        timer: 3000,
                        timerProgressBar: true,
                        title: 'Cotización finalizada con éxito',
                        showConfirmButton: false,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    })
                    console.log(this.quotations)
                })
            }
        }
    }
}
</script>
<style>
    .colorProduct{
        width: 20px;
        height: 20px;
        background-color: teal;
        color: transparent;
        border-radius: 50%;
        box-shadow: 0 0 2rem 0 rgba(136, 152, 170, 0.15) !important;
    }
</style>