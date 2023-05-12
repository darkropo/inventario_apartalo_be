const express = require('express');
const session = require('express-session');
const router = express.Router();
const { passport, authenticateMiddleware, addUserWithRole, hasRole } = require('../controllers/auth');
const mongoDbClient = require('../controllers/db-controller');
const { MONGO_DB_USERS_COLL, MONGO_DB_ROLES_COLL, SESSION_SECRET_KEY } = require('../config');
const jwt = require('jsonwebtoken');

// Session middleware
router.use(session({
  secret: SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: false
}));

// Passport middleware
router.use(passport.initialize());
router.use(passport.session());


// Login route
router.post('/login', async (req, res, next) => {
  passport.authenticate('local', async (err, user, info) => {
    try {

      if (err || !user) {
        const message = err ? err.message : 'Invalid username or password';
        return res.status(401).send({ message });
      }

      req.logIn(user, async (error) => {
        if (error) {
          return next(error);
        }

        const token = jwt.sign(
          {
            role: user.role,
            email: user.username,
          },
          SESSION_SECRET_KEY,
          { expiresIn: '1h' },
        );

        return res.status(200).send({ token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

// Logout route
router.get('/logout', authenticateMiddleware, async (req, res) => {
  req.logout();
  res.status(200).json({ success: true, message: 'Logged out successfully!' });
});

// Create user route
router.post('/create', async (req, res) => {
  try {
    const insertUser = await addUserWithRole(req.body.username, req.body.password, req.body.role);
    res.json(insertUser);
    //res.status(201).json({ message: 'User created successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Create role route
router.post('/role', authenticateMiddleware, hasRole("admin"), async (req, res) => {
  try {
    const isExistingRole = await mongoDbClient.GetAll(MONGO_DB_ROLES_COLL, { name: req.body.role }, { _id: 0 });
    if (Array.isArray(isExistingRole) && isExistingRole.length > 0) {
      console.log(`Role ${req.body.role} already exists in the database`);
      return res.status(409).json({ message: `Role ${req.body.role} already exists in the database` });
    }

    const insertedRole = await mongoDbClient.Create(MONGO_DB_ROLES_COLL, {
      name: req.body.role,
      description: req.body.description
    });
    console.log(`Role ${insertedRole.insertedId} created successfully`);
    res.status(201).json({ message: 'Role created successfully!', createdRole: insertedRole });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Get all roles route
router.get('/role', authenticateMiddleware,hasRole("admin"), async (req, res) => {
  try {
    const roles = await mongoDbClient.GetAll(MONGO_DB_ROLES_COLL, {});
    res.json(roles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});
//edit role
router.put("/role/:id", authenticateMiddleware, hasRole("admin"), async function(req, res) {
  const query = {
    name: req.body.role,
    description: req.body.description
  };
  console.log("query::::::::::::::::::::::::::::::::::::::::", query);
	mongoDbClient.Update(MONGO_DB_ROLES_COLL, req.params.id, query).then((resp)=>{
		res.json(resp);
	}).catch((err=>{
		res.json(req,res,err.message,500,err.stack);
	}));

});
//Delete role
router.delete("/role/:id", authenticateMiddleware, hasRole("admin"), async function(req, res) {
  mongoDbClient.Delete(MONGO_DB_ROLES_COLL, req.params.id).then((resp)=>{
  res.json(resp);
}).catch((err=>{
  res.json(req,res,err.message,500,err.stack);
}));

});

module.exports = router;
