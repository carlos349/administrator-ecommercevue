const serverL = 'localhost:2200'
const server = 'backecommerce.syswa.net'
const endpointTarget = `http://${serverL}`
const imgEndpoint = `${endpointTarget}/static/users/`
const dataBase = 'local_ecommerce'
const endPoint =  { 
    imgEndpoint: imgEndpoint, 
    endpointTarget:endpointTarget, 
    server:server,
    dataBase:dataBase 
}

module.exports = endPoint