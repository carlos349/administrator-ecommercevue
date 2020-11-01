<template>
    <div>
        <base-header class="header pb-4 pt-3 pt-lg-5 d-flex align-items-center"
                     style="min-height: 50px;">
            <!-- Mask -->
            <span style="background-color:#172b4d !important" class="mask  opacity-7"></span>
            <!-- Header container -->
            
        </base-header>

        <div class="container-fluid mt-5">
            <base-button type="default" @click="modals.modal2 = true">Categorias</base-button>
            <base-button type="default" @click="modals.modal4 = true">Filtros</base-button>
            <base-button type="success" @click="modals.modal3 = true">Agregar producto</base-button>
            <modal :show.sync="modals.modal1" v-if="products.length > 0" modal-classes="modal-lg">
                <h6 slot="header" class="modal-title" id="modal-title-default">Edita tu producto</h6>
                <div style="height: 110px;" class="ml-5"> 
                    <a-upload
                    class="mx-auto uploaderProduct"
                    action="http://localhost:3200/products/uploadImage"
                    list-type="picture-card"
                    :file-list="products[actualProduct].images"
                    @preview="handlePreview"
                    @change="editImage">
                        <div v-if="products[actualProduct].images.length < 6" >
                            <a-icon type="plus" />
                            <div class="ant-upload-text">
                            Agregar imagen
                            </div>
                        </div>
                    </a-upload>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <base-input 
                            placeholder="Nombre del producto" 
                            v-model="products[actualProduct].name"
                            addon-left-icon="fas fa-edit">
                        </base-input>
                    </div>
                    <div class="col-md-6">
                        <a-select v-model="products[actualProduct].category" class="w-100 mt-1" >
                            <a-select-option v-for="category in categories" :key="category._id" :value="category.name">
                                {{category.name}}
                            </a-select-option>
                        </a-select>                        
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col-md-3">
                        <base-input 
                            placeholder="Precio" 
                            v-model="products[actualProduct].price"
                            addon-left-icon="fas fa-dollar-sign">
                        </base-input>
                    </div>
                    <div class="col-md-3">
                        <base-input 
                            placeholder="Cantidad" 
                            v-model="products[actualProduct].quantity"
                            addon-right-icon="fas fa-boxes">
                        </base-input>
                    </div>
                    <div class="col-md-3">
                        <base-input 
                            placeholder="Descuento" 
                            v-model="products[actualProduct].discount"
                            addon-right-icon="fas fa-percentage">
                        </base-input>
                    </div>
                    <div class="col-md-3 mt-1">
                        <base-button v-on:click="products[actualProduct].freeShipping = false" v-if="products[actualProduct].freeShipping" size="sm" type="success">Envio gratis activado</base-button>
                        <base-button v-on:click="products[actualProduct].freeShipping = true" v-else size="sm" type="danger">Envio gratis desactivado</base-button>
                    </div>
                </div>
                <textarea class="form-control" rows="3" v-model="products[actualProduct].description" placeholder="Descripción del producto"></textarea>
                <a-table class="mt-2" v-if="products.length > 0" bordered :data-source="products[actualProduct].data" :pagination="{ pageSize: 20 }"
                    :scroll="{ y: 160 }" :columns="columns">
                    <template slot="dato" slot-scope="text, record">
                        <a-input v-model="record.data" placeholder="Dato del producto" />
                    </template>
                    <template slot="operation" slot-scope="text, record">
                        <base-button v-on:click="editProductDataDelete(record.id)" size="sm" type="danger">Eliminar</base-button>
                    </template>
                </a-table>
                <template slot="footer">
                    <base-button type="success" v-on:click="productDataEdit">Agregar</base-button>
                    <base-input class="w-100 mt-4" style="margin-right:10em;" v-model="descripcionProductoEdit" placeholder="Agregar dato descriptivo"></base-input>
                    <base-button v-on:click="editProduct(actualProduct)" type="primary">Editar</base-button>
                </template>
            </modal>
            <modal :show.sync="modals.modal2" modal-classes="modal-md">
                <h6 slot="header" class="modal-title" id="modal-title-default">Categorias</h6>
                <div class="row">
                    <a-input class="w-75 mx-auto mb-2" v-model="categoryAddInput" placeholder="Nombre de la categoria" size="large"/>
                    <base-button size="sm" class="mb-2" type="success" v-on:click="addCategory">Agregar</base-button> 
                </div> 
                <a-table bordered :data-source="categories" :columns="columnsCategory">
                    <template slot="operation" slot-scope="text, record">
                        <base-button v-on:click="categoryDelete(record._id)" class="mx-auto" type="danger">Eliminar</base-button>
                    </template>
                </a-table>
            </modal>
            <modal :show.sync="modals.modal4" modal-classes="modal-md">
                <h4 slot="header" class="modal-title" id="modal-title-default">Filtros</h4>
                <div class="row mx-auto">
                    <a-input class="w-75 mr-3 mb-2" v-model="filterAddInput" placeholder="Nombre del filtro" size="large"/>
                    <base-button size="sm" class="mb-2" type="success" v-on:click="addFilter">Agregar</base-button> 
                </div>   
                <a-table bordered :data-source="filters" :columns="columnsCategory">
                    <template slot="operation" slot-scope="text, record">
                        <a-tooltip placement="left">
                            <template slot="title">
                                <span>Eliminar</span>
                            </template>
                            <base-button size="sm" v-on:click="filterDelete(record._id)" class="mr-2" type="danger"><i class="ni ni-fat-remove"></i></base-button>
                        </a-tooltip>
                        <a-tooltip placement="right">
                            <template slot="title">
                                <span>Editar</span>
                            </template>
                            <base-button size="sm" v-on:click="modals.modal5 = true, dataOptions = record" class="mx-auto" type="success"><i class="ni ni-ruler-pencil"></i></base-button>
                        </a-tooltip>
                    </template>
                </a-table>
            </modal>
            <modal :show.sync="modals.modal3" modal-classes="modal-lg">
                <h6 slot="header" class="modal-title" id="modal-title-default">Crear nuevo producto</h6>
                <div style="height: 110px;" class="ml-5">
                    <a-upload
                    class="mx-auto uploaderProduct"
                    action="http://localhost:3200/products/uploadImage"
                    list-type="picture-card"
                    :file-list="dataProduct.imagesArray"
                    @preview="handlePreview"
                    @change="addNewImage"
                    >
                        <div v-if="dataProduct.imagesArray.length < 6">
                            <a-icon type="plus" />
                            <div class="ant-upload-text">
                            Agregar imagen
                            </div>
                        </div>
                    </a-upload>
                </div>
                <div class="row">
                    <div class="col-md-4">
                        <base-input 
                            placeholder="Nombre del producto" 
                            v-model="dataProduct.name"
                            addon-left-icon="fas fa-edit">
                        </base-input>
                    </div>
                    <div class="col-md-4">
                        <a-select v-model="dataProduct.category" class="w-100 mt-1" style="height:40px;">
                            <a-select-option v-for="category in categories" :key="category._id" :value="category.name">
                                {{category.name}}
                            </a-select-option>
                        </a-select>
                    </div>
                    <div class="col-md-2">
                        <base-button class="w-100" v-on:click="modals.modal6 = true" type="success">
                            Filtros
                        </base-button>
                    </div>
                    <div class="col-md-2">
                        <base-button class="ml-2 w-100" v-on:click="modals.modal7 = true" type="success">
                            Colores
                        </base-button>
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col-md-3">
                        <base-input 
                            placeholder="Precio" 
                            v-model="dataProduct.price"
                            addon-left-icon="fas fa-dollar-sign">
                        </base-input>
                    </div>
                    <div class="col-md-3">
                        <base-input 
                            placeholder="Cantidad" 
                            v-model="dataProduct.quantify"
                            addon-right-icon="fas fa-boxes">
                        </base-input> 
                    </div>
                    <div class="col-md-3">
                        <base-input 
                            placeholder="Descuento"
                            v-model="dataProduct.discount"
                            addon-right-icon="fas fa-percentage">
                        </base-input>
                    </div>
                    <div class="col-md-3 mt-1">
                        <base-button v-on:click="dataProduct.freeShiping = false" v-if="dataProduct.freeShiping" size="sm" type="success">Envio gratis activado</base-button>
                        <base-button v-on:click="dataProduct.freeShiping = true" v-else size="sm" type="danger">Envio gratis desactivado</base-button>
                    </div>
                </div>
                <textarea class="form-control" rows="3" v-model="dataProduct.description" placeholder="Descripción del producto"></textarea>
                <template slot="footer">
                    <base-button type="success" v-on:click="newProductData">Agregar</base-button>
                    <base-input class="w-75 mt-4" style="margin-right:10em;" v-model="dataProduct.dataAdd" placeholder="Agregar dato descriptivo"></base-input>
                    <base-button v-on:click="addProduct()" type="primary">Crear</base-button>
                </template>
                <a-table class="mt-1" bordered :data-source="dataProduct.data" :columns="columns">
                    <template slot="dato" slot-scope="text, record">
                        <a-input v-model="record.data" placeholder="Dato del producto" />
                    </template>
                    <template slot="operation" slot-scope="text, record">
                        <base-button v-on:click="newProductDataDelete(record.id)" type="danger">Eliminar</base-button>
                    </template>
                </a-table>
            </modal>
            <modal :show.sync="modals.modal6" modal-classes="modal-md">
                <h4 slot="header" class="modal-title" id="modal-title-default">Filtros</h4>
                <div class="w-100">
                    <a-table ref="tableFilters" bordered :data-source="filtersProduct" :columns="columnsFilters">
                        <template slot="operation" slot-scope="text, record, index">
                            <a-tooltip placement="left">
                                <template slot="title">
                                    <span>Activar</span>
                                </template>
                                <base-button size="sm" v-if="record.valid" v-on:click="removeFilterProduct(index)" type="success"><i class="ni ni-check-bold"></i></base-button>
                                <base-button size="sm" v-else v-on:click="addFilterProduct(index)" type="danger"><i class="ni ni-fat-remove"></i></base-button>
                            </a-tooltip>
                        </template>
                        <template slot="selectOptions" slot-scope="text, record, index">
                            <template v-for="(options, indexOpt) of record.options">
                                <a-tooltip v-if="record.valid" :key="options.name" placement="top">
                                    <template slot="title">
                                        <span v-if="options.active">Quitar opción</span>
                                        <span v-else>Agregar opción</span>
                                    </template>
                                    <badge v-if="options.active" style="font-size:1em !important;cursor:pointer;" class="text-default mt-1 mr-2 mb-2" type="success">
                                        <span v-on:click="removeOptionProduct(record.name, options.name, indexOpt, index)">{{options.name}}</span>
                                    </badge>
                                    <badge v-else style="font-size:1em !important;cursor:pointer;" class="text-default mt-1 mr-2 mb-2" type="danger">
                                        <span v-on:click="addOptionProduct(record.name, options.name, indexOpt, index)">{{options.name}}</span>
                                    </badge>
                                </a-tooltip>
                            </template>
                        </template>
                    </a-table>
                </div>
            </modal>
            <modal :show.sync="modals.modal7" modal-classes="modal-md">
                <h4 slot="header" class="modal-title" id="modal-title-default">Colores</h4>
                <div class="row mb-2 mt-2">
                    <div class="col-md-6">
                        <color-picker
                            :color="color"
                            :sucker-hide="false"
                            :sucker-canvas="suckerCanvas"
                            :sucker-area="suckerArea"
                            @changeColor="changeColor"
                            @openSucker="openSucker"
                        />
                        <base-button class="ml-2" type="success" v-on:click="onColorSelect()">
                        Seleccionar color</base-button>
                    </div>
                    <div class="col-md-6 row">
                        <h3 class="ml-2">Colores selecionados</h3>
                        <span v-for="(color, index) of dataProduct.colors" :key="color" class="colorsSelectds col-md-2 mb-0" :style="'background-color:'+color" v-on:click="removeColor(index)">coll</span>
                    </div>
                </div>
            </modal>
            <modal :show.sync="modals.modal5" modal-classes="modal-md" :showClose="false">
                <h4 slot="header" class="modal-title" id="modal-title-default">Filtros</h4>
                <div class="row mx-auto">
                    <a-input class="w-75 mr-3 mb-2" v-model="filterAddOption" placeholder="Agregar opción al filtro" size="large"/>
                    <base-button size="sm" class="mb-2" type="success" v-on:click="addOption">Agregar</base-button> 
                </div>
                <a-tooltip v-for="(options, index) of dataOptions.options" :key="options" placement="top">
                    <template slot="title">
                        <span>Eliminar</span>
                    </template>
                    <badge style="font-size:1em !important;cursor:pointer;" class="text-default mr-2 mb-2" type="success">
                        <span v-on:click="removeOption(index)">{{options.name}}</span>
                    </badge>
                </a-tooltip>
                <br>
                <base-button class="mb-2 mt-2 float-right" type="success" v-on:click="setOptions">Finalizar</base-button> 
            </modal>
            <div class="row">
                <a-table
                class="mt-4"
                :columns="columnsProducts"
                :data-source="products"
                :pagination="{ pageSize: 20 }"
                :scroll="{ y: 400 }">
                    <template slot="accion" slot-scope="text, record, index">
                        <div class="row">
                           <a-tooltip placement="bottom">
                                <template slot="title">
                                <span>Editar producto</span>
                                </template>
                                <base-button size="sm" @click="modals.modal1 = true, actualProduct = index" type="default"><i class="ni ni-ruler-pencil"></i></base-button>
                            </a-tooltip>
                            <a-tooltip placement="left">
                                <template slot="title">
                                <span>Activar / Desactivar producto</span>
                                </template>
                                <base-button size="sm" v-if="record.active" @click="changeActive(index)" type="success"><i class="ni ni-check-bold"></i></base-button>
                                <base-button size="sm" v-else @click="changeActive(index)" type="danger"><i class="ni ni-fat-remove"></i></base-button>
                            </a-tooltip> 
                        </div>
                        
                    </template>
                    <template slot="price" slot-scope="text">
                        $ {{formatPrice(text)}}
                    </template>
                </a-table>
            </div>
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
import colorPicker from '@caohenghu/vue-colorpicker'

//Back - End 
import axios from 'axios'
import router from '../router'
import endPoint from '../../config-endpoint/endpoint.js'
import jwtDecode from 'jwt-decode' 
var convert = require('color-convert');
export default {
    components: {
        colorPicker
    },
    data(){
        return {
            color: '#59c7f9',
            suckerCanvas: null,
            suckerArea: [],
            isSucking: false,
            actualProduct:0,
            activeDisabled:false,
            activeText:'Activar / Desactivar producto',
            statusEdit:[],
            activeCreation: false,
            modals:{
                modal1:false,
                modal2:false,
                modal3:false,
                modal4: false,
                modal5: false,
                modal6: false,
                modal7: false
            },
            descripcionProductoEdit:'',
            categories:[],
            filters: [],
            dataOptions: [],
            categoryAddInput:'',
            filterAddInput: '',
            filterAddOption: '',
            namepaprova:'',
            dataProduct:{
                name:'',
                description:'',
                imagesArray:[],
                data:[],
                category:'Categoria',
                freeShiping:false,
                quantify:'',
                price:'',
                active:true,
                discount:'',
                colors: [],
                filters: [],
                sales:'',
                dataAdd:'',
                valid:true
            },
            configHeader: {headers:{"x-database-connect":endPoint.dataBase,"x-access-token":localStorage.userToken}},
            products:[],
            descripcionProducto:'',
            dataSource: [
                {
                    key: '0',
                    name: 'Talla',
                    address: 'S',
                },
                {
                    key: '1',
                    name: 'Peso',
                    age: '32',
                    address: '1 kg',
                },
            ],
            count: 2,
            columns: [
                
                {
                title: 'Descripción',
                dataIndex: 'name',
                },
                {
                title: 'Dato',
                dataIndex: 'data',
                scopedSlots: { customRender: 'dato' },
                },
                {
                title: 'Operación',
                dataIndex: 'operation',
                scopedSlots: { customRender: 'operation' },
                width: 130
                },
                
            ],
            columnsCategory : [
                {
                    title: 'Nombre',
                    dataIndex: 'name',
                },
                {
                    title: 'Operación',
                    dataIndex: 'operation',
                    scopedSlots: { customRender: 'operation' },
                    width: 130
                },
            ],
            columnsFilters: [
                {
                    title: 'Nombre',
                    dataIndex: 'name',
                    width: 100
                },
                {
                    title: 'Activación',
                    dataIndex: 'operation',
                    scopedSlots: { customRender: 'operation' },
                    width: 100
                },
                {
                    title: 'Opciones +',
                    dataIndex: 'options',
                    scopedSlots: { customRender: 'selectOptions' },
                }
            ],
            columnsProducts: [
                {
                    title: 'Nombre del producto',
                    dataIndex: 'name',
                    width: 350,
                },
                {
                    title: 'Categoria',
                    dataIndex: 'category',
                    width: 220,
                },
                {
                    title: 'Precio',
                    dataIndex: 'price',
                    scopedSlots: { customRender: 'price' },
                },
                {
                    title: 'Cantidad',
                    dataIndex: 'quantity',
                },
                {
                    title: 'Acciones',
                    scopedSlots: { customRender: 'accion' },
                    width: 130
                },
            ],
            previewVisible: false,
            previewImage: '',
            filtersProduct: []
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
        this.getProduct()
        this.getCategories()
        this.getFilters()
    },
    methods: {
        getFilters(){
            axios.get(endPoint.endpointTarget+'/filters', this.configHeader)
            .then(res => {
                this.filters = res.data
                this.filtersProduct = res.data
                for (let index = 0; index < this.filtersProduct.length; index++) {
                    this.filtersProduct[index].valid = false     
                }
                console.log(this.filtersProduct)
            })
        },
        getCategories(){
            axios.get(endPoint.endpointTarget+'/categories', this.configHeader)
            .then(res => {
                this.categories = res.data
            })
        },
        getProduct(){
            axios.get(endPoint.endpointTarget+'/products', this.configHeader)
            .then(res => {
                if (res.data.length != 0) {
                   this.products = res.data 
                   this.activeText = 'Activar / Desactivar producto'
                }
            })
        },
        handleCancel() {
            this.previewVisible = false;
        },
        changeColor(color) {
            this.color = color
            console.log(this.color)
        },
        onColorSelect(){
            this.dataProduct.colors.push(this.color.hex)
        },
        openSucker(isOpen) {
            if (isOpen) {
                // ... canvas be created
                // this.suckerCanvas = canvas
                // this.suckerArea = [x1, y1, x2, y2]
            } else {
                // this.suckerCanvas && this.suckerCanvas.remove
            }
        },
        removeColor(index){
            this.dataProduct.colors.splice(index, 1)
        },
        addOptionProduct(name, optName, indexOpt, index){
            this.filtersProduct[index].options[indexOpt].active = true
            for (let i = 0; i < this.dataProduct.filters.length; i++) {
                const element = this.dataProduct.filters[i];
                if (element.name == name) {
                    element.options.push(optName)
                }
            }
            this.filtersProduct.push({})
            this.filtersProduct.splice(this.filtersProduct.length - 1, 1)
            console.log(this.dataProduct)
        },
        removeOptionProduct(name, optName, indexOpt, index){
            this.filtersProduct[index].options[indexOpt].active = false
            for (let i = 0; i < this.dataProduct.filters.length; i++) {
                const element = this.dataProduct.filters[i];
                if (element.name == name) {
                    for (let r = 0; r < element.options.length; r++) {
                        const elementTwo = element.options[r];
                        if (elementTwo == optName) {
                            element.options.splice(r, 1)
                        }
                    }
                }
            }
            this.filtersProduct.push({})
            this.filtersProduct.splice(this.filtersProduct.length - 1, 1)
            console.log(this.dataProduct)
        },
        addFilterProduct(index){
            console.log(index)
            this.filtersProduct[index].valid = true
            this.filtersProduct.push({})
            this.filtersProduct.splice(this.filtersProduct.length - 1, 1)
            this.dataProduct.filters.push({name: this.filtersProduct[index].name, options: []})
            console.log(this.$refs.tableFilters)
        },
        removeFilterProduct(index){
            this.filtersProduct[index].valid = false
            for (let i = 0; i < this.dataProduct.filters.length; i++) {
                const element = this.dataProduct.filters[i];
                if (element.name == this.filtersProduct[index].name) {
                    this.dataProduct.filters.splice(i, 1)
                }
            }
            this.filtersProduct.push({})
            this.filtersProduct.splice(this.filtersProduct.length - 1, 1)
            console.log(this.$refs.tableFilters)
        },
        async handlePreview(file) {
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj);
            }
            this.previewImage = file.url || file.preview;
            this.previewVisible = true;
        },
        addNewImage({ fileList }) {
            this.dataProduct.imagesArray = fileList;
            this.validFormAdd()
            
        },
        editImage({fileList}){
            var file = fileList
            this.products[this.actualProduct].images = file
            this.products[this.actualProduct].images[this.products[this.actualProduct].images.length - 1] = {uid:file[file.length -1].uid,name:file[file.length -1].response.name,status:file[file.length -1].response.status,url:file[file.length -1].response.url}
        },
        newProductData() {
            this.dataProduct.data.push({id:this.dataProduct.data.length, name:this.dataProduct.dataAdd, data:''})
            this.dataProduct.dataAdd = ''
            
        },
        newProductDataDelete(id){
            this.dataProduct.data.splice(id, 1)
        },
        editProductDataDelete(id){
            this.products[this.actualProduct].data.splice(id, 1)
        },
        productDataEdit() {
            this.products[this.actualProduct].data.push({id:this.products[this.actualProduct].data.length, name:this.descripcionProductoEdit, data:''})
        },
        filterDelete(id){
            axios.delete(endPoint.endpointTarget+'/filters/'+id, this.configHeader)
            .then(res => {
                if (res.data.status == 'filter remove') {
                    this.$swal({
                        type: 'success',
                        icon: 'success',
                        toast: true,
                        position: 'top-end',
                        timer: 3000,
                        timerProgressBar: true,
                        title: 'Filtro eliminado con exito',
                        showConfirmButton: false,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    })
                    localStorage.setItem('userToken', res.data.token)
                    this.getFilters()
                }
            })
        },
        addOption(){
            this.dataOptions.options.push({name: this.filterAddOption, active: false})
            this.filterAddOption = ''
            console.log(this.dataOptions)
        },
        removeOption(index){
            this.dataOptions.options.splice(index, 1)
        },
        setOptions(){
            axios.put(endPoint.endpointTarget+'/filters/'+this.dataOptions._id,{
                options: this.dataOptions.options
            }, this.configHeader)
            .then(res => {
                if (res.data.status == 'filter update') {
                    this.$swal({
                        type: 'success',
                        icon: 'success',
                        toast: true,
                        position: 'top-end',
                        timer: 3000,
                        timerProgressBar: true,
                        title: 'Filtro editado con exito',
                        showConfirmButton: false,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    })
                    localStorage.setItem('userToken', res.data.token)
                    this.modals.modal5 = false
                    this.getFilters()
                    this.dataOptions = []
                }else{
                    this.$swal({
                        type: 'error',
                        icon: 'error',
                        title: 'Error técnico',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    this.filterAddInput = ''
                }
            })
        },
        addFilter(){
            axios.post(endPoint.endpointTarget+'/filters',{
                name:this.filterAddInput,
                options: []
            }, this.configHeader)
            .then(res => {
                if (res.data.status == "filter create") {
                    this.$swal({
                        type: 'success',
                        icon: 'success',
                        toast: true,
                        position: 'top-end',
                        timer: 3000,
                        timerProgressBar: true,
                        title: 'Filtro creado con exito',
                        showConfirmButton: false,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    })
                    localStorage.setItem('userToken', res.data.token)
                    this.getFilters()
                    this.filterAddInput = ''
                }
                else if (res.data.status == "filter exist") {
                    this.$swal({
                        type: 'error',
                        icon: 'error',
                        title: 'El filtro ya existe',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    this.filterAddInput = ''
                }
                else{
                    this.$swal({
                        type: 'error',
                        icon: 'error',
                        title: 'Problemas de conexión',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            })
        },
        addCategory(){
            axios.post(endPoint.endpointTarget+'/categories',{
                name:this.categoryAddInput
            },this.configHeader)
            .then(res => {
                console.log(res)
                if (res.data.status == "category create") {
                    localStorage.setItem('userToken', res.data.token)
                    this.getCategories()
                    this.categoryAddInput = ''
                }
                else if (res.data.status == "category exist") {
                    this.$swal({
                        type: 'error',
                        icon: 'error',
                        title: 'La categoria ya existe',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    this.categoryAddInput = ''
                }
                else{
                    this.$swal({
                        type: 'error',
                        icon: 'error',
                        title: 'Problemas de conexión',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
                
            })
        },
        categoryDelete(id){
            axios.delete(endPoint.endpointTarget+'/categories/'+id,this.configHeader)
            .then(res => {
                if (res.status = 'category delete') {
                  localStorage.setItem('userToken', res.data.token)
                    this.getCategories()
                }
                else{
                    this.$swal({
                        type: 'error',
                        icon: 'error',
                        title: 'Problemas de conexión',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
                console.log(res)
            })
        },
        addProduct(){
            let images = []
            let validation = true
            for (let i = 0; i < this.dataProduct.imagesArray.length; i++) {
                const element = this.dataProduct.imagesArray[i];
                if (element.status == "error") {
                    validation = false
                    this.$swal({
                        type: 'error',
                        icon: 'error',
                        title: 'Una de las imágenes no se subio correctamente por favor verifique la imagen resaltada en rojo elimínela y agrégela de nuevo',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    break
                }
                images.push({uid:element.uid,name:element.response.name,status:element.response.status,url:element.response.url})
            }
            if (validation) {
                axios.post(endPoint.endpointTarget+'/products',{
                    name:this.dataProduct.name,
                    data:this.dataProduct.data,
                    description:this.dataProduct.description,
                    category:this.dataProduct.category,
                    freeShipping:this.dataProduct.freeShiping,
                    quantify:this.dataProduct.quantify,
                    price:this.dataProduct.price,
                    active:this.dataProduct.active,
                    filters: this.dataProduct.filters, 
                    colors: this.dataProduct.colors,
                    discount:this.dataProduct.discount,
                    images:images
                },this.configHeader)
                .then(res => {
                    if (res.data.status == 'product create') {
                        this.$swal({
                            type: 'success',
                            icon: 'success',
                            toast: true,
                            position: 'top-end',
                            timer: 3000,
                            timerProgressBar: true,
                            title: 'Producto creado con exito',
                            showConfirmButton: false,
                            didOpen: (toast) => {
                                toast.addEventListener('mouseenter', Swal.stopTimer)
                                toast.addEventListener('mouseleave', Swal.resumeTimer)
                            }
                        })
                        this.dataProduct={
                            name:'',
                            description:'',
                            imagesArray:[],
                            data:[],
                            category:'Categoria',
                            freeShiping:false,
                            quantify:'',
                            price:'',
                            active:true,
                            discount:0,
                            sales:0,
                            dataAdd:[],
                            valid:true
                        }
                        localStorage.setItem('userToken', res.data.token)
                        this.getProduct()
                        this.activeCreation = false
                    }
                    else if (res.data.status == 'product exist') {
                        this.$swal({
                            type: 'error',
                            icon: 'error',
                            timer: 3000,
                            timerProgressBar: true,
                            title: 'Ya existe un producto con este nombre',
                            showConfirmButton: false,
                            
                        })
                    }
                    
                })
            }
            
        },
        pushData(i){
            
            
            
        },
        editProduct(e){
            let validation = true
            for (let i = 0; i < this.products[e].images.length; i++) {
                const element = this.products[e].images[i];
                if (element.status == "error") {
                    validation = false
                    this.$swal({
                        type: 'error',
                        icon: 'error',
                        title: 'Una de las imágenes no se subio correctamente por favor verifique la imagen resaltada en rojo elimínela y agrégela de nuevo',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    break
                }
                
            }
            if (validation) {
               axios.put(endPoint.endpointTarget+'/products/'+this.products[e]._id,{
                    name:this.products[e].name,
                    data:this.products[e].data,
                    description:this.products[e].description,
                    category:this.products[e].category,
                    freeShipping:this.products[e].freeShipping,
                    quantity:this.products[e].quantity,
                    price:this.products[e].price,
                    active:this.products[e].active,
                    discount:this.products[e].discount,
                    images:this.products[e].images
                },this.configHeader)
                .then(res => {
                    this.$swal({
                        type: 'success',
                        icon: 'success',
                        toast: true,
                        position: 'top-end',
                        timer: 3000,
                        timerProgressBar: true,
                        title: 'El producto fue editado con exito',
                        showConfirmButton: false,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    })
                    localStorage.setItem('userToken', res.data.token)
                    this.statusEdit[e].status = true
                    this.getProduct()
                    this.modals.modal1 = false
                }) 
            }
            
        },
        changeActive(i){
            console.log("aja?")
            axios.get(endPoint.endpointTarget+'/products/changeActive/'+this.products[i]._id, this.configHeader)
            .then(res => {
                this.statusEdit[i].status = true
                this.activeDisabled = false
                localStorage.setItem('userToken', res.data.token)
                this.getProduct()
            })
        },
        validFormAdd(){
            console.log("aqui"+this.dataProduct.imagesArray)
            if (this.dataProduct.name != '' && this.dataProduct.description != '' && this.dataProduct.imagesArray != '' && this.dataProduct.category != 'Categoria' && this.dataProduct.quantify != '' && this.dataProduct.price != '' ) {
                this.dataProduct.valid = false
            }
            else{
                this.dataProduct.valid = true
            }
        },
        deleteProduct(i){
            axios.delete(endPoint.endpointTarget+'/products/'+this.products[i]._id,this.configHeader)
            .then(res => {
                localStorage.setItem('userToken', res.data.token)
                this.getProduct()
            })
        },
        formatPrice(value) {
            let val = (value/1).toFixed(2).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
        
    }
}
</script>
<style src="vue-color-gradient-picker/dist/index.css" lang="css" />
<style>

.form-control-alternative input{
    border: none;
}
button:focus{
    outline: none;
}
.detect{
    position: absolute;
    background-color: rgba(202, 199, 199, 0.356);
    width: 100%;
    height: 100%;
    z-index: 2;
}
.ant-table-thead > tr > th, .ant-table-tbody > tr > td {
    padding: 4px 16px;
    overflow-wrap: break-word;
}
.modal-body {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
}
.modal-footer {
    padding-top: 0 !important;
    padding-bottom: 15px !important;
}
.rcp{
    width: 180px !important;
    height: 180px !important;
}
.colorsSelectds{
    width: 80px;
    height: 30px !important;
    border-radius: 50%;
    margin-left: 10px;
    color: transparent;
    cursor: pointer;
    box-shadow: 0 0 2rem 0 rgba(136, 152, 170, 0.15) !important;
}
.colorsSelectds:hover{
    opacity: .6;
}
div .colors{
    display: none;
}
</style>