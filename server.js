let express = require('express');
let cors = require('cors');
let bodyParser = require('body-parser');
const {PORT} = require('./config');

// Express Route
const routes = require('./network/routes')

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
extended: true
}));
app.use(cors());
routes(app);


// PORT
app.listen(PORT, () => {
console.log('Connected to port ' + PORT)
})

// 404 Error
app.use((req, res, next) => {
res.status(404).send('Error 404!')
});

app.use(function (err, req, res, next) {
console.error(err.message);
if (!err.statusCode) err.statusCode = 500;
res.status(err.statusCode).send(err.message);
});
