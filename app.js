//DT162G moment 2 del 1, av Alice Fagerberg

const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

const courses = require('./routes/courses');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// use och joina public-katalog
app.use(express.static(path.join(__dirname, 'public')));

// use courses
app.use('/courses', courses);

app.get('/', (req, res) => {
	res.render('index');
});

//skriv ut till konsoll när ansluten till port
app.listen(port, () => {
	console.log(`Server started at port ${port}`);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;