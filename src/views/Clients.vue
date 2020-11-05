<template>
    <div>
        <base-header class="header pb-4 pt-3 pt-lg-5 d-flex align-items-center"
                     style="min-height: 50px;">
            <!-- Mask -->
            <span style="background-color:#172b4d !important" class="mask  opacity-7"></span>
            <!-- Header container -->
            
        </base-header>

        <div class="container-fluid mt-5">
            <h1>Registro de clientes</h1>
            <a-table :columns="columns" :data-source="clients" :scroll="getScreen">
                <span slot="client" slot-scope="text, record"> {{record.name}} {{record.lastname}}</span>
                <span slot="date" slot-scope="text, record">{{formatDate(record.createdAt)}}</span>+
                <p slot="expandedRowRender" slot-scope="record" style="margin: 0">
                    <span v-if="record.address[0].length > 0">{{record.address[0]}}</span>
                    <span v-else>Sin dirección registrada</span>
                </p>
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
            dateView: '',
            clients: [],
            configHeader: {headers:{"x-database-connect":endPoint.dataBase,"x-access-token":localStorage.userToken}},
            columns: [
                {
                    title: 'Fecha',
                    dataIndex: 'createdAt',
                    sorter: true,
                    key: 'date',
                    slots: { title: 'customTitle' },
                    scopedSlots: { customRender: 'date' },
                },
                {
                    title: 'Nombre',
                    dataIndex: 'name',
                    sorter: true,
                    key: 'client',
                    scopedSlots: { customRender: 'client' },
                },
                {
                    title: 'Teléfono',
                    dataIndex: 'phone',
                    key: 'phone'
                },
                {
                    title: 'Correo',
                    dataIndex: 'mail',
                    key: 'mail'
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
        this.getClients()
    },
    methods: {
        getClients(){
            axios.get(endPoint.endpointTarget+'/clients', this.configHeader)
            .then(res => {
                this.clients = res.data.clients
                console.log(this.clients)
            })
        },
        formatDate(date) {
            let dateFormat = new Date(date)
            return moment(dateFormat).format('DD-MM-YYYY, h:mm:ss a')
        },
    },
    computed: {
        getScreen: () => {
            return screen.width < 780 ? { x: 'calc(700px + 50%)', y: 240 } : { y: 240 }
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