var main = function() {
    'use strict';

    var answerId = 1;

    //enable tab selection
    $('.tabular.menu .item').tab();

    //get random question
    var getQuestion = function() {
        $.get('/question', function(data) {
            if (data) {
                $('#question').html(data.question);
                answerId = data.answerId;
            } else {
                console.log('No question');
            }            
        });
    };

    //get next question
    $('#getQuestionButton').on('click', function() {
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
        onSuccess: function(){
            var answer = $('#answer').val();
            var result;

            var jsonData = JSON.stringify({answer: answer, answerId: answerId});

            $.ajax({
                url     : '/answer',
                method  : 'POST',
                dataType: 'json',
                data    : jsonData,
                success : function(data) {
                    result = data.correct ? 'True':'False';
                    $('.ui.segment.answer h3 span').html(result);
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
        onSuccess: function(){
            var question = $('#createQuestion').val(),
                answer = $('#createAnswer').val();

            var jsonData = JSON.stringify({question: question, answer: answer});
            
            $.ajax({
                url     : '/question',
                method  : 'POST',
                dataType: 'json',
                data    : jsonData,
                success : function(data) {
                    $('.ui.segment.answer h3 span').html(data.result);
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
        $.get('/score', function(data) {
            if (data) {
                $('#right span').html(data.right);
                $('#wrong span').html(data.wrong);
            } else {
                console.log('Error: no data');
            }
        });
    });
};


$(document).ready(main);