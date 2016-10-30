var main = function() {
    'use strict';

    var answerId = 1;

    //enable tab selection
    $('.tabular.menu .item').tab();

    //get random question
    var getQuestion = function() {
        var jsonObj;
        $.get('/question', function(data) {
            jsonObj = JSON.parse(data);
            $('#question').val(jsonObj.question);
            answerId = jsonObj.answerId;
        });
    };

    getQuestion();

    //get next question
    $('#nextQuestionButton').on('click', function() {
        getQuestion();
    });

    //answer question form valication
    $('.ui.form.answer').form({
        fields: {
            answer: {
                identifier  : 'answer',
                rules: [
                    {
                        type   : 'empty',
                        prompt : 'Please enter your question answer'
                    }
                ]
            }
        }, 
        onSuccess: function(event){
            var answer = $('#answer').val();

            var jsonData = JSON.stringify({answer: answer, answerId: answerId});

            $.ajax({
                url     : '/answer',
                method  : 'POST',
                dataType: 'json',
                data    : jsonData,
                success : function(jsonResult) {
                    $('.ui.segment.answer h3 span').val(jsonResult.correct);
                },
                error   : function() {
                    console.log('Error post answer');
                }
            });            

            //remove question and answer
            $('#answer').val('');
            return false;
        }

    });

    //create question validation
    $('.ui.form.question').form({
        fields: {
            question: {
                identifier  : 'question',
                rules: [
                    {
                        type   : 'empty',
                        prompt : 'Please enter your question'
                    }
                ]
            },
            answer: {
                identifier  : 'answer',
                rules: [
                    {
                        type   : 'empty',
                        prompt : 'Please enter your question answer'
                    }
                ]
            }
        }, 
        onSuccess: function(event){
            var question = $('#createQuestion').val(),
                answer = $('#createAnswer').val();

            var jsonData = JSON.stringify({question: question, answer: answer});
            
            $.ajax({
                url     : '/question',
                method  : 'POST',
                dataType: 'json',
                data    : jsonData,
                success : function(jsonResult) {
                    console.log(jsonResult);
                },
                error   : function() {
                    console.log('Error post answer');
                }
            });
            
            //remove question and answer
            $('#createQuestion').val('');
            $('#createAnswer').val('');
            return false;
        }
    });

    //score tab pressed
    $('.ui.top.tabular.menu a:nth-child(3)').on('click',function() {
        var jsonObj;
        $.get('/score', function(data) {
            if (data) {
                jsonObj = JSON.parse(data);
                $('#right span').val(jsonObj.right);
                $('#wrong span').val(jsonObj.wrong);
            } else {
                console.log('Error: no data');
            }
        });
    });
};


$(document).ready(main);