var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://root:pointageRoot31@ds251332.mlab.com:51332/pointage";
var table = "pointage";

createSchema = function createSchema(collection) {
    MongoClient.connect(
        url,
        function (err, db) {
            if (err) throw err;
            var dbo = db.db(table);
            dbo.createCollection(collection, function (err, res) {
                if (err) throw err;
                console.log("Collection " + collection + " created!");
                db.close();
            });
        }
    );
};

insertInto = function insertInto(callback, collection, data) {
    MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db(table);
            dbo.collection(collection)
                .insertOne(data, function (err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                console.log(res.ops[0].semaine);
                callback(Object.assign({}, res.ops[0].semaine));
                db.close();
            });
        }
    );
};

findInto = function findInto(callback, collection, query) {
    MongoClient.connect(url,function (err, db) {
            if (err) throw err;
            var dbo = db.db(table);
            dbo.collection(collection)
                .findOne(query, function (err, res) {
                    if (err) throw err;
                    console.log(res);
                    if (res) { 
                        callback(Object.assign({}, res.semaine));
                    }
                    else {
                        callback(undefined);
                    }
                    db.close();
                });
        }
    );
};

findAllInto = function findAllInto(collection, query) {
    MongoClient.connect(url,function (err, db) {
            if (err) throw err;
            var dbo = db.db(table);
            dbo.collection(collection)
                .find(query)
                .toArray(function (err, result) {
                    if (err) throw err;
                    console.log(result);
                    db.close();
                });
        }
    );
};


findAllSemaineNameInto = function findAllSemaineNameInto(callback, collection) {
    MongoClient.connect(url,function (err, db) {
            if (err) throw err;
            var dbo = db.db(table);
            cursor = dbo.collection(collection)
                .find({});
            cursor.project({"semaine.semaineId": 1, "_id": 0});
            cursor .toArray(function (err, result) {
                    if (err) throw err;
                    callback(Object.assign({}, result));
                    db.close();
                });
        }
    );
};

updateInto = function updateInto(callback, collection, query, data) {
    MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db(table);
            dbo.collection(collection)
                .updateOne(query, data, function (err, res) {
                if (err) throw err;
                console.log("1 document updated");
                callback(Object.assign({}, res.semaine));
                db.close();
            });
        }
    );
};

updateManyInto = function updateManyInto(callback, collection, query, data) {
    MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db(table);
            dbo.collection(collection)
                .updateMany(query, data, function (err, res) {
                if (err) throw err;
                console.log("1 document updated");
                callback(Object.assign({}, result));
                db.close();
            });
        }
    );
};

deleteInto = function deleteInto(collection, query) {
    MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db(table);
            dbo.collection(collection).deleteOne(query, function (err, obj) {
                if (err) throw err;
                console.log("document deleted");
                db.close();
            });
        }
    );
};

deleteManyInto = function deleteManyInto(collection, query) {
    MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db(table);
            dbo.collection(collection).deleteMany(query, function (err, obj) {
                if (err) throw err;
                console.log("document deleted");
                db.close();
            });
        }
    );
};
