
const str = '[{"username":"Rafael Reynoso", "password":"123"},' +
            '{"username": "Carlos Lopez", "password": "123"}]';


const obj = JSON.parse(str)

const express = require('express');
const jwt = require("jsonwebtoken");

const bodyParser = require('body-parser');
const app = express();

const config = require('./public/scripts/config');

app.all('/user',(req, res, next) => {
    console.log('Por aqui pasamos');
    next();
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//********User*********//
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

app.post('/', (req, res) => {

    console.log(`Post pagina de login ${req.body.username} `);
    console.log(`Post pagina de login ${req.body.password} `);
    
    for(var i=0; i<obj.length; i++){
        if(`${req.body.username}` === obj[i].username && `${req.body.password}` == obj[i].password){
            console.log('Nombre: ' + obj[i].username + ', Password: ' + obj[i].password);
            const user = {
                nombre : obj[i].username,
                password: obj[i].password
            }
            jwt.sign({user: user}, 'secretkey', (err, token) => {
                res.sendFile(__dirname + '/public/index.html');
            });
        }
    }
});

app.post('/sinin', verifyToken, (req, res) => {
     jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err){
            //res.sendStatus(403);
            res.sendFile(__dirname + '/public/error.html');
        }else{
            res.json({
                mensaje: "Usuario Logeado",
                authData: authData
            });
            
        }
    });

});

// Authorization: Bearer <token>
function verifyToken(req, res, next){
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        bearerToken = bearerHeader.split(" ")[1];
        req.token = bearerToken;
        next();
    }
    else{
        //res.status(401);
        res.sendFile(__dirname + '/public/error.html');
    }
}

app.use(express.static('public'));

app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000,  http://localhost:3000/')
})