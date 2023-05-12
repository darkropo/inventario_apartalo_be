
let express = require('express');

const products = require('../components/products.js');
const utils = require('../components/utils.js');
const auth = require('../components/user.js');
const route = "/apartalo/inventario";

const routes = function(server){
    console.log("routes");
    server.use(`${route}/products`,products);   
    server.use(`${route}/utils`,utils);
    server.use(`${route}/auth`, auth);
}
module.exports = routes;
