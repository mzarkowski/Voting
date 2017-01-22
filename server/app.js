var express = require('express');
var app = express();
app.use(express.static('public'))
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('mongo', 27017, {
    auto_reconnect: true
});

var db = new Db('voting', server, {
    safe: true
});

db.open(function(err, db) {
    if (!err) {
        console.log("Connected to database");
        db.collection('polls', function(err, collection) {
            collection.find().toArray(function(err, items) {
                if (items.length == 0) {
                    insertDB();
                }
            });
        });
    }
});

var insertDB = function() {
    var polls = [{
        "option1": 0,
        "option2": 0
    }];

    db.collection('polls', function(err, collection) {
        collection.insert(polls, {
            safe: true
        }, function(err, result) {});
    });
}

io.on('connection', function(socket) {

    function updatePoll() {
        db.collection('polls', function(err, collection) {
            collection.find().toArray(function(err, items) {
                io.emit('poll update', items[0]);
            });
        });
    }

    function vote1() {
        db.collection('polls', function(err, collection) {
            collection.update({}, {
                $inc: {
                    option1: 1
                }
            }, {
                safe: true
            }, function(err, result) {
                updatePoll();
            });
        });
    }

    function vote2() {
        db.collection('polls', function(err, collection) {
            collection.update({}, {
                $inc: {
                    option2: 1
                }
            }, {
                safe: true
            }, function(err, result) {
                updatePoll();
            });
        });
    }

    socket.on('vote', function(choice) {
        if (choice == 1) {
            vote1();
        }
        if (choice == 2) {
            vote2();
        }
    });
	
    updatePoll();

});

http.listen(3000, function() {
    console.log('listening on *:3000');
});