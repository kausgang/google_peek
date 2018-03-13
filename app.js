var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//added this for watson
var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');


var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




app.use('/', index);
app.use('/users', users);







app.get('/watson',function (req,res) {

      var url = req.query.url;


      var WATSON_USERNAME = req.query.WATSON_USERNAME;
      var WATSON_PASSWORD= req.query.WATSON_PASSWORD;
      var WATSON_VERSION_DATE = req.query.WATSON_VERSION_DATE;

// console.log(WATSON_USERNAME+'\n'+WATSON_PASSWORD);

// res.send(url+'<br>'+WATSON_USERNAME+'<br>'+WATSON_PASSWORD+'<br>'+WATSON_VERSION_DATE);



        var natural_language_understanding = new NaturalLanguageUnderstandingV1({
            'username': WATSON_USERNAME,
            'password': WATSON_PASSWORD,
            'version_date': WATSON_VERSION_DATE
        });


        var parameters = {
            // 'text': 'IBM is an American multinational technology company headquartered in Armonk, New York, United States, with operations in over 170 countries.',
            'url': url,
            'features': {
                //   'entities': {
                //     'emotion': true,
                //     'sentiment': true,
                //     'limit': 2
                //   },
                'keywords': {
                    // 'emotion': true,
                    // 'sentiment': true,
                    'limit': 200
                }
            }
        }

        natural_language_understanding.analyze(parameters, function(err, response) {
            if (err)
                console.log('error:', err);
            else{

                // console.log(JSON.stringify(response, null, 2));

                res.send(

                    //JSON.stringify(response, null, 2)
                    response
                );
            }

        });






});















// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});















module.exports = app;


