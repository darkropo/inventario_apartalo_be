
const products = require('../components/products.js');
const route = "/apartalo/inventario"

const routes = function(server){
    console.log("routes");
    server.use(`${route}/products`,products);   
}

module.exports = routes;
