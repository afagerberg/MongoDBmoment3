const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
router.use(
    bodyParser.urlencoded({
      extended: true
    })
)
router.use(bodyParser.json());


/********************************************* 
 * Initialize database and connection
 *********************************************/
 const mongoose = require('mongoose');
 mongoose.connect('mongodb://localhost/myCV', { useNewUrlParser: true, useUnifiedTopology: true });
 mongoose.Promise = global.Promise; // Global use of mongoose
 
 const db = mongoose.connection;
 db.on('error', console.error.bind(console, 'connection error:'));
 db.once('open', function (callback) { // Add the listener for db events 
	 console.log("Connected to db");

	 // Create DB scheme 
	 const courseSchema = mongoose.Schema({
        courseId: String,
        courseName: String,
		progression: String,
		term: String,
		courseplan: String

    });

    // Create scheme model
    const Course = mongoose.model('Course', courseSchema )


	/********************************************* 
 * Get complete user listing
 *********************************************/
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
  
  /********************************************* 
   * Delete unique user id
   *********************************************/
  router.delete('/:id', function(req, res, next) {
	const id = req.params.id;
	  
	  // Delete user _id from db
	  Course.deleteOne({ "_id": id }, function (err) {
		  if (err) return handleError(err);
	  });
	  
	  // Get the new user list from db as response data
	  Course.find(function(err, courses) {
		  if(err) return console.error(err);
	  
		  const jsonObj = JSON.stringify(courses);
		  res.contentType('application/json');
		  res.send(jsonObj);
	  });
  });
  
  /********************************************* 
   * Add new course
   *********************************************/
  router.post('/', function(req, res, next) {

	  // Create a new user
	  const course = new Course({ 
		courseId: req.body.courseId, 
		courseName: req.body.courseName,
		progression: req.body.progression,
		term: req.body.term,
		courseplan: req.body.courseplan
	  });	
  
	  // Save new user to db
	  course.save(function(err) {
		  if(err) return console.error(err);
	  });
  
	  const jsonObj = JSON.stringify(course);
	  res.contentType('application/json');
	  res.send(jsonObj);
  
  });
  
  }); // DB connection



/*get - hämtar kurs utifrån id
router.get('/:id', function(req, res, next) {

	let id = req.params.id;
	let ind = -1;

	for(let i=0; i < courses.length; i++){
		if(courses[i]._id == id) ind = i; // hitta array index med _id = id   
	} 
	console.log(courses[ind]);
	res.contentType('application/json');
	res.send(ind>=0?courses[ind]:'{}'); // returnera kurs med id, om inte finns returnera {}
});*/




module.exports = router;
