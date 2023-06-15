//AUTH MIDDLEWARE
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const mongoDbClient = require('../controllers/db-controller');
const {MONGO_DB_USERS_COLL, MONGO_DB_ROLES_COLL,SESSION_SECRET_KEY} = require('../config');
const jwt = require('jsonwebtoken');

// Configure passport.js to use the local strategy
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await mongoDbClient.GetOne(MONGO_DB_USERS_COLL, { username }, { });
      
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      
      if (!isPasswordMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      
      const roleId = user.role; // assuming role is stored as an id
      const role = await mongoDbClient.GetOne(MONGO_DB_ROLES_COLL, { _id: roleId }, { _id: 0, name: 1 });
      if (!role) {
        return done(null, false, { message: 'Role not found.' });
      }
     
      user.role = role.name; // replace role id with role name
      return done(null, user);
    } catch (error) {
      console.error(error);
      return done(error);
    }
  }
));

// Serialize and deserialize the user to allow sessions
passport.serializeUser((user, done) => done(null, user.username));

passport.deserializeUser(async (username, done) => {
  try {
    const users = await mongoDbClient.GetAll(MONGO_DB_USERS_COLL, {});
    const user = users.find(user => user.username === username);
    return done(null, user);
  } catch (error) {
    console.error(error);
    return done(error);
  }
});

// Function to add user with role to users array
const addUserWithRole = async (username, password, role) => {
  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds); 
    const queryName = { username };
    const existingUser = await mongoDbClient.GetAll(MONGO_DB_USERS_COLL, queryName, { _id: 0 });
    if (Array.isArray(existingUser) && existingUser.length > 0) {
      return { error: `User ${username} already exists in the database` }; 
    }

    const queryRole = { _id: role };
    const existingRole = await mongoDbClient.GetOne(MONGO_DB_ROLES_COLL, queryRole, { _id: 1 });
    if (!existingRole) {
      console.log(`Role ${role} does not exist`); 
      return { error: `Role ${role} does not exist` }; 
    }

    const query = { username, password: hash, role: existingRole._id };
    const resp = await mongoDbClient.Create(MONGO_DB_USERS_COLL, query); 
    return resp;
  } catch (err) { 
    console.log(err);
    return { error: err.message };
  }
};

// Function to check if user has the specified role
const hasRole = (roles) => (req, res, next) => {
  if (!req.isAuthenticated() || !roles.includes(req.user.role)) {
    return res.status(401).send({ message: 'Unauthorized' });
  }
  return next();
};

// Apply the Passport middleware to your routes
function authenticateMiddleware(req, res, next) {
  const token = req.headers.authorization.split(" ")[1]; // extract token from header
  try {
    const decodedToken = jwt.verify(token, SESSION_SECRET_KEY); // decode token
    req.user = decodedToken; // store user object in request
    next(); // call next middleware
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Authentication failed" });
  }
}

module.exports = { passport, authenticateMiddleware, addUserWithRole, hasRole };