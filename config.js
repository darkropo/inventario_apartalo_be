const { config } = require("dotenv");
config();

module.exports = {
    PORT: process.env.PORT,
    BASE_URL_API: process.env.BASE_URL_API,
    MONGO_URI: process.env.MONGO_URI,
    MONGO_DB_NAME: process.env.MONGO_DB_NAME,
    MONGO_DB_PRODUCTS_COLL: process.env.MONGO_DB_PRODUCTS_COLL,
    MONGO_DB_PRODUCTS_IMAGES_COLL: process.env.MONGO_DB_PRODUCTS_IMAGES_COLL,
    MONGO_DB_USERS_COLL: process.env.MONGO_DB_USERS_COLL,
    MONGO_DB_ROLES_COLL: process.env.MONGO_DB_ROLES_COLL,
    ROUTE_PRODUCT_IMAGES: process.env.ROUTE_PRODUCT_IMAGES,
    SESSION_SECRET_KEY: process.env.SESSION_SECRET_KEY
}