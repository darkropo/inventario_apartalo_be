const { config } = require("dotenv");
config();

module.exports = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    MONGO_DB_NAME: process.env.MONGO_DB_NAME,
    MONGO_DB_PRODUCTS_COLL: process.env.MONGO_DB_PRODUCTS_COLL,
}