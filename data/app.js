var express = require("express");
var bdd = require("./connectionBdd");
var bodyParser = require('body-parser');
var app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// var collectionTest = "test";
// createSchema(collectionTest);
// insertInto(collectionTest, {test: "test"});
// findInto(collectionTest,  {test: "test"});
// var newvalues = { $set: {test: "test2"} };
// updateInto(collectionTest,  {test: "test"}, newvalues);
// deleteInto(collectionTest,  {test: "test2"});

var collectionSemainePointage = "semaine-pointage";
createSchema(collectionSemainePointage);


var apiPrivate = "/api/private";
var apiSemaine = "/semaine";



app.get(apiPrivate + apiSemaine + "/:id" , (req, res, next) => {
    console.log("GET : " + apiPrivate + apiSemaine + "/:id ="+ req.params.id);
    var callback = function (data) {
        res.json(data);
    }
    findInto(callback, collectionSemainePointage,  {"semaine.semaineId" : req.params.id});
    
});

app.get(apiPrivate + apiSemaine + "all" , (req, res, next) => {
    console.log("GET : " + apiPrivate + apiSemaine + "all");
    var callback = function (data) {
        var listeSemaine = new Array();
        console.log(data);
        for (var semaine in data) {
            listeSemaine.push(data[semaine].semaine.semaineId);
        }
        res.json(listeSemaine);
    }
    findAllSemaineNameInto(callback, collectionSemainePointage);
    
});


app.post(apiPrivate + apiSemaine , (req, res, next) => {
    console.log("POST : " + apiPrivate + apiSemaine );

    var callbackExist = function (data) {
        console.log("callback exist");
        console.log(data);
        if (!data) {
            console.log("insert ");
            var callback = function (data) {
                res.json(data);
            }
            insertInto(callback, collectionSemainePointage,  req.body);
        } else {
            console.log("update ");
            var callback = function (data) {
                res.json(data);
            }
            updateInto(callback, collectionSemainePointage, {"semaine.semaineId" : req.body.semaine.semaineId},  {$set: req.body});
        }
    }
    console.log("req.body.semaine.semaineId : " +  req.body.semaine.semaineId)
    findInto(callbackExist, collectionSemainePointage,  {"semaine.semaineId" : req.body.semaine.semaineId});

    
});

app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable !');
});

app.listen(4000, () => {
    console.log("Server running on port 4000");
   });
   