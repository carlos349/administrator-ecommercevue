const serverL = 'localhost:2200'
const server = 'backecommerce.syswa.net'
const endpointTarget = `https://${server}`
const imgEndpoint = `${endpointTarget}/static/users/`
const dataBase = 'ecommerce-aleo'
const endPoint =  { 
    imgEndpoint: imgEndpoint, 
    endpointTarget:endpointTarget, 
    server:server,
    dataBase:dataBase 
}

module.exports = endPoint