const serverL = 'localhost:3200'
const server = 'kkprettynailsback.syswa.net'
const serverQa = '18.231.122.2:3200'
const portClient = '3389'
const endpointTarget = `http://${serverL}`
const imgEndpoint = `${endpointTarget}/static/users/`
const dataBase = 'local_ecommerce'
const endPoint =  { 
    imgEndpoint: imgEndpoint, 
    portClient:portClient, 
    endpointTarget:endpointTarget, 
    server:server,
    dataBase:dataBase 
}

module.exports = endPoint