<template>
        <div class="row justify-content-center">
            <div class="col-lg-5 col-md-7">
                <div class="card bg-secondary shadow border-0">
                    
                    <div class="card-body px-lg-5 py-lg-5">
                       <div class="btn-wrapper text-center mb-4">
                            <span class="mb-5"><img style="width:30%" src="img/brand/logo.png"></span> <br><br>
                        </div>
                        <form role="form">
                            <base-input class="input-group-alternative mb-3"
                                        placeholder="Email"
                                        addon-left-icon="ni ni-email-83"
                                        v-model="model.email">
                            </base-input>

                            <base-input class="input-group-alternative"
                                        placeholder="Password"
                                        type="password"
                                        addon-left-icon="ni ni-lock-circle-open"
                                        v-model="model.password">
                            </base-input>

                            
                            <div class="text-center">
                                <base-button type="primary" v-on:click="login()" class="my-4">Ingresar</base-button>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-6">
                        <a href="#" class="text-light"><small>¿Olvidaste la contraseña?</small></a>
                    </div>
                    
                </div>
            </div>
        </div>
</template>
<script>
import axios from 'axios'
import router from '../router'
import endPoint from '../../config-endpoint/endpoint.js'
import jwtDecode from 'jwt-decode' 
  export default {
    name: 'login',
    data() {
      return {
        model: {
          email: '',
          password: ''
        },
        configHeader: {headers:{"x-database-connect":endPoint.dataBase}}

      }
    },
    created(){

    },
    methods: {
        login(){
            axios.post(endPoint.endpointTarget+"/users/login", {
                user: this.model.email,
                pass: this.model.password
            }, this.configHeader)
            .then(res => {
                if(res.data.status == 'pass incorrect'){
                    this.$swal({
                        type: 'error',
                        title: 'Contraseña incorrecta',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    this.loading = false
                }else if(res.data.status == 'user incorrect'){
                    this.$swal({
                        type: 'error',
                        title: 'Usuario no registrado',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    this.loading = false
                }else if(res.data.status == 'user blocked'){
                    this.$swal({
                        type: 'error',
                        title: 'Su usuario se ha bloqueado',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    this.loading = false
                }
                else if(res.data.status == 'user login'){
                    localStorage.setItem('userToken', res.data.token)
                    this.model.email = ''
                    this.model.password = ''
                    const token = localStorage.userToken
                    const decoded = jwtDecode(token)
                    localStorage.setItem('name', decoded.name)
                    localStorage.setItem('user', decoded.user)
                    localStorage.setItem('lastAccess', decoded.lastAccess)
                    localStorage.setItem('_id', decoded._id)
                    router.push({path: '/Dashboard'})
                }
            })
            .catch(err =>{
                this.$swal({
                    type: 'error',
                    title: 'Problemas de conexión',
                    showConfirmButton: false,
                    timer: 1500
                })
                this.loading = false
            })
        }
    }
  }
</script>
<style>
</style>
