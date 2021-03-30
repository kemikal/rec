var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const MongoClient = require('mongodb').MongoClient;



var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'), {index:false}));

app.get('/', function(req, res){
    res.send("<h1>Vad ska du äta idag info!</h1>");
});

app.get("/recept", function(req,res){

    let printReceptList = "<h2>Alla recept: </h2>";

    MongoClient.connect('mongodb+srv://recept:j4g4rR3c3pt@cluster0.e5qls.mongodb.net/recept?retryWrites=true&w=majority', {
        useUnifiedTopology: true })
        .then(client => {
          console.log('Connected to Database')
          const db = client.db('mat')
          //const quotesCollection = db.collection('quotes')
    
            db.collection('recept').find().toArray()
            .then(results => {
                console.log(results)
                for (recept in results) {
                    printReceptList += "<br>" + results[recept].name;
                }

                console.log(printReceptList);

                res.send(printReceptList)

            })
            .catch(error => console.error(error));

    })
  });

app.get('/recept/:name', function(req, res){
    let receptName = req.params.name;
    let printRecept = "";
    
    

    MongoClient.connect('mongodb+srv://recept:j4g4rR3c3pt@cluster0.e5qls.mongodb.net/recept?retryWrites=true&w=majority', {
        useUnifiedTopology: true })
        .then(client => {
          console.log('Connected to Database')
          const db = client.db('mat')
          //const quotesCollection = db.collection('quotes')
    
            db.collection('recept').findOne({name: "Muggkaka"})
            .then(result => {
                console.log(result)
                
                

                //res.send(printRecept)

                res.send(`<h1>Visa recept på ${result.name}</h1>
                        <div><strong>${result.category}</strong></div>
                        <div>${result.instructions}</div>
                        <div><ul>
                        ${result.ingredients.map(a => `<li>${a}</li>`).join("")}
                        <ul></div>
                        `);
            })
            .catch(error => console.error(error));

    })
});

app.post('/recept', function(req, res){

    let recept = req.body;

    console.log("Lägger till", recept);

    const uri = "mongodb+srv://recept:j4g4rR3c3pt@cluster0.e5qls.mongodb.net/recept?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    
    client.connect(err => {
        const collection = client.db("mat").collection("recept");

        collection.insertOne(req.body)
        .then(result => {
        console.log(result)
        })
        .catch(error => console.error(error));

      //  client.close();
    });

    res.send("<h1>Recept tillagt</h1>");
});

app.get('/*', function(req, res){
    res.send("<h1>404</h1>");
});

module.exports = app;
