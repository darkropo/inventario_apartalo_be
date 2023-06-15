const mongoDbClient = require('../controllers/db-controller');
const { ObjectId } = require('mongodb');
const express = require("express");
const session = require('express-session');
const router = express.Router();
const {MONGO_DB_PRODUCTS_COLL, SESSION_SECRET_KEY} = require('../config');
const { passport, authenticateMiddleware, hasRole } = require('../controllers/auth');

// Session middleware
router.use(session({
	secret: SESSION_SECRET_KEY,
	resave: false,
	saveUninitialized: false
  }));
  
  // Passport middleware
  router.use(passport.initialize());
  router.use(passport.session());

// CREATE product
router.post("/create", authenticateMiddleware, hasRole(["admin", "write"]),async function(req, res) {
    mongoDbClient.Create(MONGO_DB_PRODUCTS_COLL, req.body).then((resp)=>{
		res.json(resp);
	}).catch((err=>{
		res.json(req,res,err.message,500,err.stack);
	}));

});
router.get("/list", authenticateMiddleware, hasRole(["admin", "write"]),async function(req, res) {
    mongoDbClient.GetAll(MONGO_DB_PRODUCTS_COLL, req.body).then((resp)=>{
		res.json(resp);
	}).catch((err=>{
		res.json(req,res,err.message,500,err.stack);
	}));

});

router.delete("/delete/:id", authenticateMiddleware, hasRole(["admin", "write"]),async function(req, res) {
    mongoDbClient.Delete(MONGO_DB_PRODUCTS_COLL, ObjectId(req.params.id)).then((resp)=>{
		res.json(resp);
	}).catch((err=>{
		res.json(req,res,err.message,500,err.stack);
	}));

});

router.get("/edit/:id", authenticateMiddleware, hasRole(["admin", "write"]),async function(req, res) {
    mongoDbClient.GetOne(MONGO_DB_PRODUCTS_COLL, ObjectId(req.params.id)).then((resp)=>{
		res.json(resp);
	}).catch((err=>{
		res.json(req,res,err.message,500,err.stack);
	}));

router.put("/edit/:id", authenticateMiddleware, hasRole(["admin", "write"]),async function(req, res) {
	mongoDbClient.Update(MONGO_DB_PRODUCTS_COLL, ObjectId(req.params.id), req.body).then((resp)=>{
		res.json(resp);
	}).catch((err=>{
		res.json(req,res,err.message,500,err.stack);
	}));

});

});

module.exports = router;
