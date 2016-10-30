/* jshint browser: true, jquery: true, camelcase: true, indent: 2, undef: true, quotmark: single, maxlen: 80, trailing: true, curly: true, eqeqeq: true, forin: true, immed: true, latedef: true, newcap: true, nonew: true, unused: true, strict: true */

var express = require('express'),
    http = require('http'),
    mongoose = require('mongoose'),
    redis = require('redis'),
    app = express();

// set up a static file directory to use for default routing
app.use(express.static(__dirname + '/public'));

//
var redisClient = redis.createClient();

//connect to the trivia data store in mongo
mongoose.connect('mongodb://localhost/trivia');

//schema for question
var questionSchema = mongoose.Schema({    
    "question"  : String,
    "answerId"  : Number,
    "answer"    : String
});

//question data model
var Question = mongoose.model("Question", questionSchema);

//function to get the number of question
var getQuestionCount = function () {
    var questionNum;

    Question.count({}, function(err, count) {
        questionNum = count;
    });

    return questionNum;
}

//get question
app.get('/question', function(req, res) {
    var randomID,
        jsonQuestion;

    //search to see if any question from DB
    Question.find({}, function(err, result) {
        //error of getting question
        if (err !== null) {
            console.log("ERROR: " + err);
        } 
        //DB contain questions
        else if (result.length) {
            //get random question
            randomID = Math.floor(Math.random() * result.length + 1);
            jsonQuestion = {
                'question'  : result[randomID].question,
                'answerId'  : result[randomID].answerID
            }
        }        
    });

    res.json(jsonQuestion);
});

// post request for create question
app.post('/question', function(req, res) {
    var jsonObj;

    var newQuestion;

    req.on('data', function (data) {
        jsonObj = JSON.parse(data);

        //create new question
        newQuestion = new Question({
            'question'  : jsonObj.question,
            'answerId'  : getQuestionCount() + 1,
            'answer'    : jsonObj.answer
        });

        //save new question
        newQuestion.save(function (err) {
            if (err !== null) {
                console.log('ERROR: ' + err);
            } else {
                console.log('the object was saved!');
            }
        });
    });
});

// post request for send answer
app.post('/answer', function(req, res) {
    var jsonObj,
        answerId,
        answer,
        correct;

    req.on('data', function (data) {
        jsonObj = JSON.parse(data);
        answerId = convertStrToInt(jsonObj.answerId);
        answer = jsonObj.answer;

        Question.find({'answerId': answerId}, function(err, result) {
            //error of getting question
            if (err !== null) {
                console.log("ERROR: " + err);
            } 
            //find matching answerId
            else {
                if (answer == result.answer) {
                    correct = true;
                } else {
                    correct = false;
                }
            }
        });

        return res.json({correct: correct});
    });
});

// get request for score numbers
app.post('/arrayContainAString', function(req, res) {
    res.json({right: 2, wrong: 1});
});

//listen on port 3000
http.createServer(app).listen(3000);

console.log('Server listening on port 3000');

/*
'use strict'
    var jsonObj,
        array,
        element,
        result;

    req.on('data', function (data) {
        jsonObj = JSON.parse(data);
        array = jsonObj.array;
        element = jsonObj.element;
        result = functions.arrayContainOneElement(array,element);
        return res.json({result: result});
    });
    */