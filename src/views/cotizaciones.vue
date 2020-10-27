<template>
    <div>
        <base-header class="header pb-4 pt-3 pt-lg-5 d-flex align-items-center"
                     style="min-height: 50px;">
            <!-- Mask -->
            <span style="background-color:#172b4d !important" class="mask  opacity-7"></span>
            <!-- Header container -->
            
        </base-header>

        <div class="container-fluid mt-5">
            <base-button type="success" class="mb-3" @click="modals.modal2 = true">Añadir promocion</base-button>
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
                                <textarea v-if="data.name == 'description'" v-model="data.data" onlyread class="form-control form-control-alternative mt-1" rows="3" placeholder="Write a large text here ..."></textarea>
                                <base-button v-else class="mt-2 col-12" size="sm" type="secondary">
                                        <span >{{data.name}}</span>
                                        <badge style="font-size:0.8em !important" class="text-default" type="success">{{data.data}}</badge>
                                    </base-button> 
                                </div> 
                            </div>
                            
                            
                            <dt class="mt-3 text-center">Productos</dt>  
                            <badge v-for="data of quotations[actualQuotation].products" :key="data._id" class="mt-1 ml-1 text-default" type="primary">{{data.name}}</badge>
                        </card>
                </card>
                <base-button class="mt-3 mx-auto" type="default">Responder cotización</base-button>
            </modal>
            <a-table :columns="columns" :data-source="quotations">
                <span slot="quantity" slot-scope="text, record"> {{record.products.length}}</span>
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



export default {
    components: {
        
    },
    
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
                    dataIndex: 'description',
                    key: 'age',
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
            return dateFormat.getDate()+"-"+(dateFormat.getMonth() + 1)+"-"+dateFormat.getFullYear()+" "+" ("+ dateFormat.getHours()+":"+ dateFormat.getMinutes()+")"
        },
        
        // createPromotion(){
        //     let images = []
        //     let validation = true
        //         if (this.promotionData.img[0].status == "error") {
        //             validation = false
        //             this.$swal({
        //                 type: 'error',
        //                 icon: 'error',
        //                 title: 'La imágen no se subio correctamente por favor verifique la imagen resaltada en rojo elimínela y agrégela de nuevo',
        //                 showConfirmButton: false,
        //                 timer: 1500
        //             })
        //         }
        //         if (validation) {
        //             images.push({uid:this.promotionData.img[0].uid,name:this.promotionData.img[0].response.name,status:this.promotionData.img[0].response.status,url:this.promotionData.img[0].response.url})
        //             axios.post(endPoint.endpointTarget+'/promotions',{
        //                 name:this.promotionData.name,
        //                 image:images,
        //                 description:this.promotionData.description,
        //                 url:this.promotionData.url,
        //                 nameButton:this.promotionData.bName,
                        
        //             },this.configHeader)
        //             .then(res => {

        //                 if (res.data.status == 'promotion create') {
        //                    this.$swal({
        //                         type: 'success',
        //                         icon: 'success',
        //                         toast: true,
        //                         position: 'top-end',
        //                         timer: 3000,
        //                         timerProgressBar: true,
        //                         title: 'Promoción creada con exito',
        //                         showConfirmButton: false,
        //                         didOpen: (toast) => {
        //                             toast.addEventListener('mouseenter', Swal.stopTimer)
        //                             toast.addEventListener('mouseleave', Swal.resumeTimer)
        //                         }
        //                     })
        //                     localStorage.setItem('userToken', res.data.token)
        //                     this.getPromotions() 
        //                 }
        //                 if (res.data.status == 'promotion exist') {
        //                     this.$swal({
        //                         type: 'error',
        //                         icon: 'error',
        //                         timer: 3000,
        //                         timerProgressBar: true,
        //                         title: 'Esta promocion ya existe',
        //                         showConfirmButton: false,
        //                         didOpen: (toast) => {
        //                             toast.addEventListener('mouseenter', Swal.stopTimer)
        //                             toast.addEventListener('mouseleave', Swal.resumeTimer)
        //                         }
        //                     })
        //                 }
                        
                        
        //             })
        //         }
        // },
        // editPromotion(){
        //     let images = ''
        //     let validation = true
        //         if (this.promotionDataEdit.img[0].status == "error") {
        //             validation = false
        //             this.$swal({
        //                 type: 'error',
        //                 icon: 'error',
        //                 title: 'La imágen no se subio correctamente por favor verifique la imagen resaltada en rojo elimínela y agrégela de nuevo',
        //                 showConfirmButton: false,
        //                 timer: 1500
        //             })
        //         }
        //         if (validation) {
        //             if (this.imagesEdits != []) {
        //                 images = this.imagesEdits
        //                 console.log(this.imagesEdits)
        //             }
        //             else{
        //                 images = this.promotionDataEdit.img
        //                 console.log("no editada")
        //             }
        //             axios.put(endPoint.endpointTarget+'/promotions/'+this.promotionDataEdit.id,{
        //                 name:this.promotionDataEdit.name,
        //                 image:images,
        //                 description:this.promotionDataEdit.description,
        //                 url:this.promotionDataEdit.url,
        //                 nameButton:this.promotionDataEdit.bName,
                        
        //             },this.configHeader)
        //             .then(res => {

        //                 if (res.data.status == 'promotion edit') {
        //                     this.modals.modal1 = false
        //                    this.$swal({
        //                         type: 'success',
        //                         icon: 'success',
        //                         toast: true,
        //                         position: 'top-end',
        //                         timer: 3000,
        //                         timerProgressBar: true,
        //                         title: 'Promoción editada con exito',
        //                         showConfirmButton: false,
        //                         didOpen: (toast) => {
        //                             toast.addEventListener('mouseenter', Swal.stopTimer)
        //                             toast.addEventListener('mouseleave', Swal.resumeTimer)
        //                         }
        //                     })
        //                     localStorage.setItem('userToken', res.data.token)
        //                     this.getPromotions() 
        //                 }
        //                 if (res.data.status == 'promotion exist') {
        //                     this.$swal({
        //                         type: 'error',
        //                         icon: 'error',
        //                         timer: 3000,
        //                         timerProgressBar: true,
        //                         title: 'Esta promocion ya existe',
        //                         showConfirmButton: false,
        //                         didOpen: (toast) => {
        //                             toast.addEventListener('mouseenter', Swal.stopTimer)
        //                             toast.addEventListener('mouseleave', Swal.resumeTimer)
        //                         }
        //                     })
        //                 }
                        
                        
        //             })
        //         }
                
            


        // }
    }
}
</script>
<style>
     
    
</style>