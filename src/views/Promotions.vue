<template>
    <div>
        <base-header class="header pb-4 pt-3 pt-lg-5 d-flex align-items-center" style="min-height: 50px;">
            <!-- Mask -->
            <span style="background-color:#172b4d !important" class="mask  opacity-7"></span>
            <!-- Header container -->
        </base-header>
        <div class="container-fluid mt-5">
            <base-button type="success" v-if="promotions.length < 10" class="mb-3" @click="modals.modal2 = true">Añadir promocion</base-button>
            <a-tooltip v-else placement="right">
                <template slot="title">
                <span>No puedes crear mas de 10 promociones.</span>
                </template>
               <base-button type="danger" style="cursor: not-allowed;" class="mb-3">Añadir promocion</base-button> 
            </a-tooltip>
            <base-button type="success" class="mb-3" @click="modals.modal3 = true">Configurar correo</base-button>
            <modal :show.sync="modals.modal1" modal-classes="modal-lg">
                <h6 slot="header" class="modal-title" id="modal-title-default">Datos descriptivos de tu producto</h6>
                <div class="row">
                    <div class="col-md-5"></div>
                    <div class="col-md-2 mx-auto">
                        <a-upload
                        :action="uploadTarget+'/promotions/uploadImage'"
                        list-type="picture-card"
                        :file-list="promotionDataEdit.img"
                        @preview="handlePreviewEdit"
                        @change="handleChangeEdit"
                        >
                        <div v-if="promotionDataEdit.img.length < 1">
                            <a-icon type="plus" />
                            <div class="ant-upload-text">
                            Upload
                            </div>
                        </div>
                        </a-upload>
                        <a-modal :visible="previewVisibleEdit" :footer="null" @cancel="handleCancelEdit">
                        <img alt="example" style="width: 100%" :src="previewImageEdit" />
                        </a-modal>
                    </div>
                    <div class="col-md-5"></div>
                </div>
                <div class="row">
                    <div class="col-md-4"><base-input v-model="promotionDataEdit.name" placeholder="Nombre de la promoción"></base-input></div>
                    <div class="col-md-4"><base-input v-model="promotionDataEdit.bName"  placeholder="Texto del botón"></base-input></div>
                    <div class="col-md-4"><base-input v-model="promotionDataEdit.url" placeholder="Url del botón"></base-input></div>
                </div>
                <textarea class="form-control" rows="3" v-model="promotionDataEdit.description" placeholder="Descripción de la promoción"></textarea>
                <base-button class="mt-3 mx-auto mb-2" v-on:click="editPromotion()" type="default">Editar promoción</base-button>
            </modal>
            <modal :show.sync="modals.modal2" modal-classes="modal-lg">
                <h6 slot="header" class="modal-title" id="modal-title-default">Promoción</h6>
                <div class="row">
                    <div class="col-md-5"></div>
                    <div class="col-md-2 mx-auto">
                        <a-upload
                        :action="uploadTarget+'/promotions/uploadImage'"
                        list-type="picture-card"
                        :file-list="promotionData.img"
                        @preview="handlePreview"
                        @change="handleChange"
                        >
                        <div v-if="promotionData.img.length < 1">
                            <a-icon type="plus" />
                            <div class="ant-upload-text">
                            Imagen de promoción
                            </div>
                        </div>
                        </a-upload>
                        <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                        <img alt="example" style="width: 100%" :src="previewImage" />
                        </a-modal>
                    </div>
                    <div class="col-md-5"></div>
                </div>
                <div class="row">
                    <div class="col-md-4"><base-input v-model="promotionData.name" placeholder="Nombre de la promoción"></base-input></div>
                    <div class="col-md-4"><base-input v-model="promotionData.bName"  placeholder="Texto del botón"></base-input></div>
                    <div class="col-md-4"><base-input v-model="promotionData.url" placeholder="Url del botón"></base-input></div>
                </div>
                <textarea class="form-control" rows="3" v-model="promotionData.description" placeholder="Descripción de la promoción"></textarea>
                <base-button class="mt-3 mx-auto mb-2" v-on:click="createPromotion()" type="default">Crear promoción</base-button>
            </modal>
            <modal :show.sync="modals.modal3" modal-classes="modal-lg">
                <h6 slot="header" class="modal-title" id="modal-title-default">Configuración de correo</h6>
                <card type="secondary" shadow
                  header-classes="bg-white"
                  body-classes=""
                  class="border-0 pt-0">
                    <div class="row">
                        <div class="col-md-5"></div>
                        <div class="col-md-2 mx-auto">
                            <a-upload
                                :action="uploadTarget+'/mails/uploadImage'"
                                list-type="picture-card"
                                :file-list="mailData.img"
                                @preview="handlePreviewMail"
                                @change="handleChangeMail">
                                <div v-if="mailData.img.length < 1">
                                    <a-icon type="plus" />
                                    <div class="ant-upload-text">
                                        Cargue su logo
                                    </div>
                                </div>
                            </a-upload>
                        </div>
                        <div class="col-md-5"></div>
                    </div>
                    <div class="row">
                        <div class="col-md-4"><base-input v-model="mailData.mail" placeholder="Correo de la marca"></base-input></div>
                        <div class="col-md-4"><base-input v-model="mailData.website" placeholder="Sitio web de la marca"></base-input></div>
                        <div class="col-md-4"><base-input v-model="mailData.facebook"  placeholder="Dirección de facebook"></base-input></div>
                        <div class="col-md-4"><base-input v-model="mailData.instagram" placeholder="Dirección de instagram"></base-input></div>
                        <div class="col-md-4"><base-input v-model="mailData.twitter" placeholder="Dirección de twitter"></base-input></div>
                        <div class="col-md-4"><base-input v-model="mailData.whatsapp" placeholder="Dirección de whatsapp"></base-input></div>
                        <div class="col-md-6"><base-input v-model="mailData.companyname" placeholder="Nombre de la compañía"></base-input></div>
                        <div class="col-md-6"><base-input v-model="mailData.location" placeholder="Link de google maps"></base-input></div>
                    </div>
                </card>
                <base-button v-if="ifMailCreate" class="mt-2 mb-2" v-on:click="editMail()" type="success">Editar datos</base-button>
                <base-button v-else class="mt-2 mb-2" v-on:click="registerMail()" type="default">Crear datos de correo</base-button>
            </modal>
            <a-modal :visible="previewVisibleMail" :footer="null" @cancel="handleCancelMail">
                <img alt="example" style="width: 100%" :src="previewImageMail" />
            </a-modal>
            <a-table :columns="columns" :data-source="promotions" :scroll="getScreen">
                <a slot="name" slot-scope="text">{{ text }}</a>
                <span slot="url" slot-scope="text"> <a :href="text" target="_blank" rel="">{{text}}</a></span>
                
                <span slot="action" slot-scope="text, record">
                    <a-tooltip placement="left">
                        <template slot="title">
                            <span>Editar</span>
                        </template>
                        <base-button size="sm" @click="modals.modal1 = true,promotionDataEdit.name=record.name,promotionDataEdit.description=record.description,promotionDataEdit.bName = record.nameButton,promotionDataEdit.img=record.image,promotionDataEdit.url=record.url,promotionDataEdit.id=record._id" type="success"><i class="ni ni-ruler-pencil"></i></base-button>
                    </a-tooltip>
                    <a-tooltip placement="right">
                        <template slot="title">
                            <span>Eliminar</span>
                        </template>
                        <base-button size="sm" type="danger"><i class="ni ni-fat-remove" v-on:click="deletePromotion(record._id)"></i></base-button>
                    </a-tooltip>
                </span>
            </a-table>
        </div>
    </div>
</template>
<script>
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
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
                modal2:false,
                modal3: false
            },
            promotions:[],
            configHeader: {headers:{"x-database-connect":endPoint.dataBase,"x-access-token":localStorage.userToken}},
            promotionData: {
                name:'',
                description:'',
                img:[],
                bName:'',
                url:''
            },
            ifMailCreate: false,
            mailData: {
                img: [],
                mail: '',
                website: '',
                facebook: '',
                instagram: '',
                twitter: '',
                whatsapp: '',
                companyname: '',
                location: ''
            },
            promotionDataEdit: {
                name:'',
                description:'',
                img:[],
                bName:'',
                url:'',
                id:''
            },
            hasImage: false,
            image: null,
            uploadTarget: endPoint.endpointTarget,
            columns: [
                {
                    title: 'Nombre',
                    dataIndex: 'name',
                    key: 'name',
                    slots: { title: 'customTitle' },
                    scopedSlots: { customRender: 'name' },
                },
                {
                    title: 'Descripción',
                    dataIndex: 'description',
                    key: 'age',
                },
                {
                    title: 'Url',
                    dataIndex: 'url',
                    key: 'address',
                    scopedSlots: { customRender: 'url' },
                },
                {
                    title: 'Texto del boton',
                    key: 'tags',
                    dataIndex: 'nameButton',
                    scopedSlots: { customRender: 'tags' },
                },
                {
                    title: 'Acciones',
                    key: 'action',
                    scopedSlots: { customRender: 'action' },
                },
            ],
            previewImageMail: '',
            previewVisibleMail: false,
            previewVisible: false,
            previewImage: '',
            previewVisibleEdit: false,
            previewImageEdit: '',
            imagesEdits:[]
            
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
        this.getPromotions()
        this.getMail()
    },
    methods: {
        getPromotions(){
            axios.get(endPoint.endpointTarget+'/promotions',this.configHeader)
            .then(res => {
                if (res.data.status != 'promotions does exist') {
                    this.promotions = res.data.promotions
                    console.log(this.promotions) 
                }
            })
        },
        getMail(){
            axios.get(endPoint.endpointTarget+'/mails/ifMail', this.configHeader)
            .then(res => {
                if (res.data.status == 'mail exist') {
                    this.ifMailCreate = true
                    this.mailData = res.data.mailData
                }else{
                    this.ifMailCreate = false
                }
                console.log(this.mailData)
                console.log(this.ifMailCreate)
            })
            .catch(err => {
                console.log(err)
            })
        },
        registerMail(){
            let images = []
            let validation = true
            if (this.mailData.img[0].status == "error") {
                validation = false
                this.$swal({
                    type: 'error',
                    icon: 'error',
                    title: 'La imágen no se subio correctamente por favor verifique la imagen resaltada en rojo elimínela y agrégela de nuevo',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
            if (validation) {
                images.push({uid:this.mailData.img[0].uid, name:this.mailData.img[0].response.name, status:this.mailData.img[0].response.status, url:this.mailData.img[0].response.url})
                axios.post(endPoint.endpointTarget+'/mails',{
                    mail: this.mailData.mail,
                    website: this.mailData.website,
                    facebook: this.mailData.facebook,
                    instagram: this.mailData.instagram,
                    twitter: this.mailData.twitter,
                    whatsapp: this.mailData.whatsapp,
                    companyname: this.mailData.companyname,
                    location: this.mailData.location,
                    img: images
                },this.configHeader)
                .then(res => {
                    if (res.data.status == 'mail register') {
                        this.$swal({
                            type: 'success',
                            icon: 'success',
                            toast: true,
                            position: 'top-end',
                            timer: 3000,
                            timerProgressBar: true,
                            title: 'Datos de correo creado',
                            showConfirmButton: false,
                            didOpen: (toast) => {
                                toast.addEventListener('mouseenter', Swal.stopTimer)
                                toast.addEventListener('mouseleave', Swal.resumeTimer)
                            }
                        })
                        localStorage.setItem('userToken', res.data.token)
                        this.getMail()
                    }
                })
            }
        },
        editMail(){
            console.log(this.mailData)
            let images = []
            let validation = true
            if (this.mailData.img[0].status == "error") {
                validation = false
                this.$swal({
                    type: 'error',
                    icon: 'error',
                    title: 'La imágen no se subio correctamente por favor verifique la imagen resaltada en rojo elimínela y agrégela de nuevo',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
            if (validation) {
                if (this.mailData.img[0].response) {
                    images.push({uid:this.mailData.img[0].uid, name:this.mailData.img[0].response.name, status:this.mailData.img[0].response.status, url:this.mailData.img[0].response.url})
                }else{
                    images = this.mailData.img
                }
                console.log(images)
                axios.put(endPoint.endpointTarget+'/mails/'+this.mailData._id,{
                    mail: this.mailData.mail,
                    website: this.mailData.website,
                    facebook: this.mailData.facebook,
                    instagram: this.mailData.instagram,
                    twitter: this.mailData.twitter,
                    whatsapp: this.mailData.whatsapp,
                    companyname: this.mailData.companyname,
                    location: this.mailData.location,
                    img: images
                }, this.configHeader)
                .then(res => {
                    if (res.data.status == 'mail edit') {
                        this.$swal({
                            type: 'success',
                            icon: 'success',
                            toast: true,
                            position: 'top-end',
                            timer: 3000,
                            timerProgressBar: true,
                            title: 'Datos de correo editados',
                            showConfirmButton: false,
                            didOpen: (toast) => {
                                toast.addEventListener('mouseenter', Swal.stopTimer)
                                toast.addEventListener('mouseleave', Swal.resumeTimer)
                            }
                        })
                        localStorage.setItem('userToken', res.data.token)
                        this.getMail()
                    }
                })
            }
        },
        handleCancel() {
            this.previewVisible = false;
            this.modals.modal2 = true
        },
        handleCancelMail() {
            this.previewVisibleMail = false;
            console.log('modal 3')
            this.modals.modal3 = true 
        },
        handleCancelEdit() {
            this.previewVisibleEdit = false;
            this.modals.modal1 = true
        },
        async handlePreview(file) {
            
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj);
            }
            this.previewImage = file.url || file.preview;
            this.previewVisible = true;
            this.modals.modal2 = false
        },
        async handlePreviewMail(file) {
            
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj);
            }
            this.previewImageMail = file.url || file.preview;
            this.previewVisibleMail = true;
            this.modals.modal3 = false
        },
        async handlePreviewEdit(file) {
            
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj);
            }
            this.previewImageEdit = file.url || file.preview;
            this.previewVisibleEdit = true;
            this.modals.modal1 = false
        },
        handleChange({ fileList }) {
            this.promotionData.img = fileList;
            
        },
        handleChangeMail({ fileList }) {
            this.mailData.img = fileList;
            
        },
        handleChangeEdit({ fileList }) {
            this.promotionDataEdit.img = fileList;
            
            var file = fileList
            
            this.imagesEdits = {uid:file[0].uid,name:file[0].response.name,status:file[0].response.status,url:file[0].response.url}
            console.log(this.imagesEdits)
        },
        createPromotion(){
            let images = []
            let validation = true
            if (this.promotionData.img[0].status == "error") {
                validation = false
                this.$swal({
                    type: 'error',
                    icon: 'error',
                    title: 'La imágen no se subio correctamente por favor verifique la imagen resaltada en rojo elimínela y agrégela de nuevo',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
            if (validation) {
                images.push({uid:this.promotionData.img[0].uid,name:this.promotionData.img[0].response.name,status:this.promotionData.img[0].response.status,url:this.promotionData.img[0].response.url})
                axios.post(endPoint.endpointTarget+'/promotions',{
                    name:this.promotionData.name,
                    image:images,
                    description:this.promotionData.description,
                    url:this.promotionData.url,
                    nameButton:this.promotionData.bName,
                },this.configHeader)
                .then(res => {
                    if (res.data.status == 'promotion create') {
                        this.$swal({
                            type: 'success',
                            icon: 'success',
                            toast: true,
                            position: 'top-end',
                            timer: 3000,
                            timerProgressBar: true,
                            title: 'Promoción creada con éxito',
                            showConfirmButton: false,
                            didOpen: (toast) => {
                                toast.addEventListener('mouseenter', Swal.stopTimer)
                                toast.addEventListener('mouseleave', Swal.resumeTimer)
                            }
                        })
                        this.modals.modal2 = false
                        this.promotionData.name = ''
                        this.promotionData.description = ''
                        this.promotionData.url = ''
                        this.promotionData.bName = ''
                        this.promotionData.img = []
                        localStorage.setItem('userToken', res.data.token)
                        this.getPromotions() 
                        axios.get(endPoint.endpointTarget+'/mails/mailPromotions/'+res.data.id, this.configHeader)
                        .then(res => {
                            console.log(res)
                        })
                    }
                    if (res.data.status == 'promotion exist') {
                        this.$swal({
                            type: 'error',
                            icon: 'error',
                            timer: 3000,
                            timerProgressBar: true,
                            title: 'Esta promocion ya existe',
                            showConfirmButton: false,
                            didOpen: (toast) => {
                                toast.addEventListener('mouseenter', Swal.stopTimer)
                                toast.addEventListener('mouseleave', Swal.resumeTimer)
                            }
                        })
                    }
                    
                    
                })
            }
        },
        editPromotion(){
            let images = ''
            let validation = true
            if (this.promotionDataEdit.img[0].status == "error") {
                validation = false
                this.$swal({
                    type: 'error',
                    icon: 'error',
                    title: 'La imágen no se subio correctamente por favor verifique la imagen resaltada en rojo elimínela y agrégela de nuevo',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
            if (validation) {
                if (this.imagesEdits.uid) {
                    images = this.imagesEdits
                }
                else{
                    images = this.promotionDataEdit.img
                }
                axios.put(endPoint.endpointTarget+'/promotions/'+this.promotionDataEdit.id,{
                    name:this.promotionDataEdit.name,
                    image:images,
                    description:this.promotionDataEdit.description,
                    url:this.promotionDataEdit.url,
                    nameButton:this.promotionDataEdit.bName,
                    
                },this.configHeader)
                .then(res => {
                    if (res.data.status == 'promotion edit') {
                        this.modals.modal1 = false
                        this.$swal({
                            type: 'success',
                            icon: 'success',
                            toast: true,
                            position: 'top-end',
                            timer: 3000,
                            timerProgressBar: true,
                            title: 'Promoción editada con éxito',
                            showConfirmButton: false,
                            didOpen: (toast) => {
                                toast.addEventListener('mouseenter', Swal.stopTimer)
                                toast.addEventListener('mouseleave', Swal.resumeTimer)
                            }
                        })
                        localStorage.setItem('userToken', res.data.token)
                        this.getPromotions() 
                    }
                    if (res.data.status == 'promotion exist') {
                        this.$swal({
                            type: 'error',
                            icon: 'error',
                            timer: 3000,
                            timerProgressBar: true,
                            title: 'Esta promocion ya existe',
                            showConfirmButton: false,
                            didOpen: (toast) => {
                                toast.addEventListener('mouseenter', Swal.stopTimer)
                                toast.addEventListener('mouseleave', Swal.resumeTimer)
                            }
                        })
                    }
                    
                    
                })
            }
        },
        deletePromotion(id){
            this.$swal({
                icon: 'info',
                title: '¿Seguro que quieres eliminar esta promoción?',
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                showConfirmButton: true,
                confirmButtonText: 'Seguro'
            }).then(result => {
                if (result.isConfirmed == true) {
                    axios.delete(endPoint.endpointTarget+'/promotions/'+id, this.configHeader)
                    .then(res => {
                        if (res.data.status == 'promotion delete') {
                            this.$swal({
                                type: 'success',
                                icon: 'success',
                                toast: true,
                                position: 'top-end',
                                timer: 3000,
                                timerProgressBar: true,
                                title: 'Promoción eliminada con exito',
                                showConfirmButton: false,
                                didOpen: (toast) => {
                                    toast.addEventListener('mouseenter', Swal.stopTimer)
                                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                                }
                            })
                            localStorage.setItem('userToken', res.data.token)
                            this.getPromotions()
                        }else{
                            this.$swal({
                                type: 'error',
                                icon: 'error',
                                timer: 3000,
                                timerProgressBar: true,
                                title: 'Tenemos problemas al eliminar la promoción.',
                                showConfirmButton: false,
                                didOpen: (toast) => {
                                    toast.addEventListener('mouseenter', Swal.stopTimer)
                                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                                }
                            })
                        }
                    })
                }
            })
        }
    },
    computed: {
        getScreen: () => {
            return screen.width < 780 ? { x: 'calc(700px + 50%)', y: 240 } : { y: 240 }
        }
    }
}
</script>
<style>
     
    
</style>