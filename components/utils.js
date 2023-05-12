const mongoDbClient = require('../controllers/db-controller');
const express = require("express");
const router = express.Router();
const {MONGO_DB_PRODUCTS_IMAGES_COLL,ROUTE_PRODUCT_IMAGES,BASE_URL_API} = require('../config');


router.post('/images/upload/:productid', (req, res) => {

  query = {};
  items = [];

  req.files.map(image => {
    items.push({
      "productId": req.params.productid,
      "imageUrl": ROUTE_PRODUCT_IMAGES+image.filename
    });    
    
  });
  console.log("imageroute: ", items );
  mongoDbClient.CreateMany(MONGO_DB_PRODUCTS_IMAGES_COLL, items).then((resp)=>{
		res.json(resp);
	}).catch((err=>{
		res.json(req,res,err.message,500,err.stack);
	}));
    
  });

  router.get("/images/upload/:productid", async function(req, res) {
    query = {
      "productId": req.params.productid
    };
    mongoDbClient.GetAll(MONGO_DB_PRODUCTS_IMAGES_COLL, query).then((resp)=>{
      console.log("iamges:::::::::::::::::::::::::::::::::::::::::::::::::::", resp)
      resp.map((image, key) =>{{
        resp[key].imageUrl =  BASE_URL_API+'/'+image.imageUrl; 
      }});
		res.json(resp);
	}).catch((err=>{
    console.log("errooorrr::::::::::::", err);
		res.json(req,res,err.message,500,err.stack);
	}));

});

  module.exports = router;