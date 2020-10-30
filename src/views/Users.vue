<template>
    <div>
        <base-header class="header pb-4 pt-3 pt-lg-5 d-flex align-items-center" style="min-height: 50px;">
            <!-- Mask -->
            <span style="background-color:#172b4d !important" class="mask  opacity-7"></span>
            <!-- Header container -->
        </base-header>
        <div class="container-fluid mt-5">
            <base-button class="mb-4" type="success" @click="modals.modal1 = true">Nuevo usuario</base-button>
            <a-table :columns="columns" :data-source="users">
                <span slot="date" slot-scope="text, record">{{formatDate(record.createdAt)}}</span>
                <span slot="action" slot-scope="text, record">
                    <base-button type="danger" @click="deleteUser(record._id)">Eliminar</base-button>
                </span>
            </a-table>
            <modal :show.sync="modals.modal1" modal-classes="modal-md">
                <h4 slot="header" class="modal-title" id="modal-title-default">Registrar usuario</h4>
                <card type="secondary" shadow
                  header-classes="bg-white"
                  body-classes=""
                  class="border-0 pt-0">
                    <card shadow>
                        <div class="form-group">
                            <base-input v-model="userRegister.name.data" v-on:keyup="verifyRegister" addon-left-icon="ni ni-circle-08" placeholder="Nombre y Apellido" ></base-input>
                            <base-input v-model="userRegister.user.data" v-on:keyup="verifyRegister" addon-left-icon="ni ni-email-83" placeholder="Correo" ></base-input>
                            <base-input v-model="repiteMail" v-on:keyup="verifyRegister" placeholder="Repita su correo" :valid="userRegister.user.verify"></base-input>
                            <base-input v-model="userRegister.pass.data" v-on:keyup="verifyRegister" type="password" addon-left-icon="ni ni-key-25" placeholder="Contraseña" ></base-input>
                            <base-input v-model="repitePass" v-on:keyup="verifyRegister" type="password" placeholder="Repita su contraseña" :valid="userRegister.pass.verify"></base-input>
                        </div>
                    </card>
                </card>
                <base-button class="mt-1 mx-auto mb-3" type="default" v-on:click="registerClient">Registrar</base-button>
            </modal>
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
            users: [],
            userRegister: {
                name: {
                    data: '',
                    verify: false
                },
                user: {
                    data: '',
                    verify: false
                },
                pass: {
                    data: '',
                    verify: false
                }
            },
            repiteMail: '',
            repitePass: '',
            modals: {
                modal1: false
            },
            configHeader: {headers:{"x-database-connect":endPoint.dataBase, "x-access-token":localStorage.userToken}},
            columns: [
                {
                    title: 'Nombre',
                    dataIndex: 'name',
                    key: 'name'
                },
                {
                    title: 'Usuario',
                    dataIndex: 'user',
                    key: 'user'
                },
                {
                    title: 'Último ingreso',
                    dataIndex: 'lastEntry',
                    key: 'date',
                    slots: { title: 'customTitle' },
                    scopedSlots: { customRender: 'date' },
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
        this.getUsers()
    },
    methods: {
        getUsers(){
            axios.get(endPoint.endpointTarget+'/users', this.configHeader)
            .then(res => {
                console.log(res)
                this.users = res.data.users
            })
        },
        formatDate(date) {
            let dateFormat = new Date(date)
            return moment(dateFormat).format('DD-MM-YYYY, h:mm:ss a')
        },
        verifyRegister(){
            this.userRegister.name.verify = this.userRegister.name.data.length > 4 ? true : false
            if (this.userRegister.pass.data.length > 8) {
                if (this.userRegister.pass.data == this.repitePass) {
                    this.userRegister.pass.verify = true
                }else{
                    this.userRegister.pass.verify = false
                }
            }else{
                this.userRegister.pass.verify = false
            }

            if (this.userRegister.user.data.split('@')[1]) {
                var split = this.userRegister.user.data.split('@')[1]
                if (split.split('.')[1]) {
                    if (this.userRegister.user.data == this.repiteMail) {
                        this.userRegister.user.verify = true
                    }else{
                        this.userRegister.user.verify = false
                    }
                }else{
                    this.userRegister.user.verify = false
                }
            }else{
                this.userRegister.user.verify = false
            }
        },
        registerClient(){
            if (this.userRegister.user.verify == false) {
                this.$swal({
                    type: 'error',
                    icon: 'error',
                    timer: 2000,
                    timerProgressBar: true,
                    title: 'Debe colocar un correo valido.',
                    showConfirmButton: false,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                })
            }else if(this.userRegister.pass.verify == false) {
                this.$swal({
                    type: 'error',
                    icon: 'error',
                    timer: 2000,
                    timerProgressBar: true,
                    title: 'La contraseña debe contener más de 8 digitos.',
                    showConfirmButton: false,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                })
            }else if(this.userRegister.name.verify == false){
                this.$swal({
                    type: 'error',
                    icon: 'error',
                    timer: 2000,
                    timerProgressBar: true,
                    title: 'Los nombres deben contener más de 4 digitos.',
                    showConfirmButton: false,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                })
            }else{
                axios.post(endPoint.endpointTarget+'/users', {
                    name: this.userRegister.name.data,
                    user: this.userRegister.user.data,
                    pass: this.userRegister.pass.data
                }, this.configHeader)
                .then(res => {
                    if (res.data.status == "User already exist") {
                        this.$swal({
                            type: 'error',
                            icon: 'error',
                            timer: 2000,
                            timerProgressBar: true,
                            title: 'El usuario ya existe.',
                            showConfirmButton: false,
                            didOpen: (toast) => {
                                toast.addEventListener('mouseenter', Swal.stopTimer)
                                toast.addEventListener('mouseleave', Swal.resumeTimer)
                            }
                        })
                    }else{
                        this.$swal({
                            type: 'success',
                            icon: 'success',
                            toast: true,
                            position: 'top-end',
                            timer: 3000,
                            timerProgressBar: true,
                            title: 'Usuario registrado con exito',
                            showConfirmButton: false,
                            didOpen: (toast) => {
                                toast.addEventListener('mouseenter', Swal.stopTimer)
                                toast.addEventListener('mouseleave', Swal.resumeTimer)
                            }
                        })
                        localStorage.setItem('userToken', res.data.token)
                        this.modals.modal1 = false
                        this.userRegister.name.data = ''
                        this.userRegister.user.data = ''
                        this.userRegister.pass.data = ''
                        this.userRegister.name.verify = false
                        this.userRegister.user.verify = false
                        this.userRegister.pass.verify = false
                        this.getUsers()
                    }
                })
            }
        },
        deleteUser(id){
            this.$swal({
                icon: 'info',
                title: '¿Seguro que quieres eliminar este usuario?',
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                showConfirmButton: true,
                confirmButtonText: 'Seguro'
            }).then(result => {
                if (result.isConfirmed == true) {
                    axios.delete(endPoint.endpointTarget+'/users/'+id, this.configHeader)
                    .then(res => {
                        if (res.data.status == 'user delete') {
                            this.$swal({
                                type: 'success',
                                icon: 'success',
                                toast: true,
                                position: 'top-end',
                                timer: 3000,
                                timerProgressBar: true,
                                title: 'Usuario eliminado con éxito',
                                showConfirmButton: false,
                                didOpen: (toast) => {
                                    toast.addEventListener('mouseenter', Swal.stopTimer)
                                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                                }
                            })
                            localStorage.setItem('userToken', res.data.token)
                            this.getUsers()
                        }else{
                            this.$swal({
                                type: 'error',
                                icon: 'error',
                                timer: 3000,
                                timerProgressBar: true,
                                title: 'Tenemos problemas al eliminar el usuario.',
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
    }
}
</script>