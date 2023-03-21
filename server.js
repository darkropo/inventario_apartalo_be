let express = require('express');
let cors = require('cors');
const path = require('path')
let bodyParser = require('body-parser');
const {PORT} = require('./config');
let multer  = require('multer');

// Express Route
const routes = require('./network/routes.js')

const app = express();
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({
extended: true
}));

//images upload
app.use(multer({ dest: './uploads/images',
rename: function (fieldname, filename, originalname) {
    return Date.now()+"-"+originalname;
},
onFileUploadStart: function (file) {
    console.log(file.originalname + ' is starting ...');
},
onFileUploadComplete: function (file) {
    console.log(file.fieldname + ' uploaded to  ' + file.path)
 }
}).any());
app.use(express.static('./uploads'));
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




