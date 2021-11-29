// DT162G moment 2 del 2, av Alice Fagerberg

"use strict";

let courseIdInput = document.getElementById("courseid");
let nameInput = document.getElementById("cname");
let progressionInput = document.getElementById("progression");
let termInput = document.getElementById("term");
let courseplanInput = document.getElementById("courseplan");

let addButtonEl = document.getElementById("add");
let tableEl = document.getElementById("coursetable");
let message = document.getElementById("message");

window.addEventListener("load", getAllCourses);
addButtonEl.addEventListener("click", function(e){
    e.preventDefault();
    addCourse();
});

//Läs in alla kurser
function getAllCourses(){
    tableEl.innerHTML = "";

    fetch("http://localhost:3000/courses")
    .then(response => response.json())
    .then(data =>{
       data.forEach(course =>{
        tableEl.innerHTML +=
        `<tr>
            <td id="tableId">${course._id}</td>
            <td><a href="${course.courseplan}" target = "_blank">${course.courseId}</a></td>
            <td>${course.courseName}</td>
            <td>${course.progression}</td>
            <td>${course.term}</td>
        </tr>
        <tr class="tablebtns">
        <td colspan="5"><button id="${course._id}" onclick="deleteCourse('${course._id}')">Radera</button>
        </tr>`; 

       }) 
    })
}

function addCourse() {
    let courseId = courseIdInput.value;
    let cName = nameInput.value;
    let progression = progressionInput.value;
    let term = termInput.value;
    let courseplan = courseplanInput.value;
    
    let courseObj = {'courseId': courseId, 'courseName': cName, 'progression': progression, 'term': term, 'courseplan': courseplan};
        
    if(courseId == "" || cName == "" || progression == "" || term == "" || courseplan == ""){
        message.style.color = "rgb(212, 25, 0)";
        message.style.marginTop = "10px";
        message.style.height = "auto";
        message.innerHTML = "Du måste fylla i alla fält korrekt!";
    }else{
        fetch("http://localhost:3000/courses/", {
            method: 'POST',
            body: JSON.stringify(courseObj),
            headers: {"Content-type": "application/json; charset=UTF-8"}

        })
        .then(response => {
           
            response.json()
            //kontrollerar response
                        
                    message.style.color = "green";
                    message.style.marginTop = "10px";
                    message.style.height = "auto";
                    message.innerHTML = "En kurs lades till!";
            
            
        })
        .then(data =>{
            getAllCourses();

            courseIdInput.value = "";
            nameInput.value = "";
            progressionInput.value = "";
            termInput.value = "";
            courseplanInput.value = "";

        })

        .catch(error => {
            console.log('Error', error);
        })
        
    }    
}

//radera en kurs
function deleteCourse(id) {
    fetch("http://localhost:3000/courses/" + id, {
        method: 'DELETE',

    })
    .then(response =>{ 

        response.json()

        window.scrollTo({ top: 0, behavior: 'smooth' });
        message.style.color = "rgb(212, 25, 0)";
        message.style.marginTop = "10px";
        message.style.height = "auto";
        message.innerHTML = "Kursen raderas!";
        window.setTimeout(function(){location.reload()},2000);
    })
    .then(data =>{
        getAllEducations();
    })
    .catch(error => {
        console.log('Error', error);
    })
}
