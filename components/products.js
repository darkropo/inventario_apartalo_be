const mongoDbClient = require('../controllers/db-controller');
const express = require("express");
const router = express.Router();
const {MONGO_DB_PRODUCTS_COLL} = require('../config');

// CREATE product
router.post("/create", async function(req, res) {
    mongoDbClient.Create(MONGO_DB_PRODUCTS_COLL, req.body).then((resp)=>{
		res.json(resp);
	}).catch((err=>{
		res.json(req,res,err.message,500,err.stack);
	}));

});
router.get("/list", async function(req, res) {
    mongoDbClient.GetAll(MONGO_DB_PRODUCTS_COLL, req.body).then((resp)=>{
		res.json(resp);
	}).catch((err=>{
		res.json(req,res,err.message,500,err.stack);
	}));

});

router.delete("/delete/:id", async function(req, res) {
    mongoDbClient.Delete(MONGO_DB_PRODUCTS_COLL, req.params.id).then((resp)=>{
		res.json(resp);
	}).catch((err=>{
		res.json(req,res,err.message,500,err.stack);
	}));

});

router.get("/edit/:id", async function(req, res) {
    mongoDbClient.GetOne(MONGO_DB_PRODUCTS_COLL, req.params.id).then((resp)=>{
		res.json(resp);
	}).catch((err=>{
		res.json(req,res,err.message,500,err.stack);
	}));

});

module.exports = router;
