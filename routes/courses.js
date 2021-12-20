//DT162G moment 3 del 3, av Alice Fagerberg
const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
router.use(
    bodyParser.urlencoded({
      extended: true
    })
)
router.use(bodyParser.json());

//initiera databasanslutning
 const mongoose = require('mongoose');
 mongoose.connect('mongodb://localhost/myCV', { useNewUrlParser: true, useUnifiedTopology: true });
 mongoose.Promise = global.Promise; // Global use of mongoose
 
 const db = mongoose.connection;
 db.on('error', console.error.bind(console, 'connection error:'));
 db.once('open', function (callback) { // Lägger till lyssnare för db event 
	 console.log("Connected to db");

	 // Skapa DB schema 
	 const courseSchema = mongoose.Schema({
        courseId: String,
        courseName: String,
		progression: String,
		term: String,
		courseplan: String

    });

    // Skapa schema model
    const Course = mongoose.model('Course', courseSchema )


//get-Hämta alla kurser
router.get('/', function(req, res, next) {

	// Läs ut från databasen
	Course.find(function(err, courses) {
	  if(err) return console.error(err);  
	  const jsonObj = JSON.stringify(courses);
	  res.contentType('application/json');
	  res.send(jsonObj);
	});
  });


  //get - hämtar kurs utifrån id
  router.get('/:id', function(req, res, next) {

	const id = req.params.id;


	// Läs ut från databasen
	Course.find({"_id": id}, function(err, courses) {
	  if(err) return console.error(err);  
	  const jsonObj = JSON.stringify(courses);
	  res.contentType('application/json');
	  res.send(jsonObj);
	});
  });
  
  //delete-Radera kurs utifrån id
  router.delete('/:id', function(req, res, next) {
	  const id = req.params.id;
	  
	  // Radera course _id från db
	  Course.deleteOne({ "_id": id }, function (err) {
		  if (err) return handleError(err);
	  });
	  
	  // Läs ut ny kurslist från db som response data
	  Course.find(function(err, courses) {
		  if(err) return console.error(err);
	  
		  const jsonObj = JSON.stringify(courses);
		  res.contentType('application/json');
		  res.send(jsonObj);
	  });
  });
  
  //Lägg till ny kurs
  router.post('/', function(req, res, next) {

	  // Skapa ny kurs
	  const course = new Course({ 
		courseId: req.body.courseId, 
		courseName: req.body.courseName,
		progression: req.body.progression,
		term: req.body.term,
		courseplan: req.body.courseplan
	  });	
  
	  // Spara ny kurs till db
	  course.save(function(err) {
		  if(err) return console.error(err);
	  });
  
	  const jsonObj = JSON.stringify(course);
	  res.contentType('application/json');
	  res.send(jsonObj);
  
  });
  
  }); 
//Uppdatera
  router.put('/:id', function(req, res, next) {
	Course.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
	  if (err) {return next(err);}
	  else
	  res.json(post);
	});
   });

module.exports = router;
