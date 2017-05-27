
// 1. Initialize Firebase
var config = {
  apiKey: "AIzaSyD4g4hnl8Bv73kQDl7xv8UfQ-ZrSzssMi4",
    authDomain: "train-scheduler-c9543.firebaseapp.com",
    databaseURL: "https://train-scheduler-c9543.firebaseio.com",
    projectId: "train-scheduler-c9543",
    storageBucket: "train-scheduler-c9543.appspot.com",
    messagingSenderId: "984882504071"
};

firebase.initializeApp(config);

var database = firebase.database();

// var count = 0;

// 2. Button for adding Trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var firstTrain = $("#first-train-input").val().trim();
  var tFrequency = $("#freq-input").val().trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    destination: destination,
    firstTrain: firstTrain,
    tFrequency: tFrequency
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log("New Train Name: " + newTrain.name);
  console.log("New Destination: " + newTrain.destination);
  console.log("New First Train: " + newTrain.firstTrain);
  console.log("New Frequency: " + newTrain.tFrequency);

  // Alert
  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-input").val("");
  $("#freq-input").val("");
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  updateTable(childSnapshot);

});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
// database.ref().on("child_changed", function(childSnapshot, prevChildKey) {

//   console.log(childSnapshot.val());

//   updateTable(childSnapshot);

// });

function updateTable (childSnapshot) {

  console.log(childSnapshot);

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var destination = childSnapshot.val().destination;
  var firstTrain = childSnapshot.val().firstTrain;
  var tFrequency = childSnapshot.val().tFrequency;

  // Train Info
  console.log("Train Name: " + trainName);
  console.log("Destination: " + destination);
  console.log("First Train: " + firstTrain);
  console.log("Frequency: " + tFrequency);

  var firstTrainConverted = moment(firstTrain, "HH:mm").subtract(1, "days");
  console.log("First Train Converted: " + firstTrainConverted);

  var currentTime = moment();
  console.log("currentTime: " + currentTime);
  console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

  var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  var tRemainder = diffTime % tFrequency;
  console.log("Remainder: " + tRemainder);

  var minAway = tFrequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + minAway);

  var nextArrival = moment().add(minAway, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextArrival).format("hh:mm a"));

  // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +
  tFrequency + "</td><td>" + moment(nextArrival).format("hh:mm a") + "</td><td>" + minAway + "</td></tr>");
}

// update clock
var datetime, date;

function updateTime () {
  date = moment(new Date())
  $('#datetime').html(date.format('dddd, MMMM Do YYYY, hh:mm:ss a'));
};

// var updateCount = function() {

// }

$(document).ready(function(){
    updateTime();
    setInterval(updateTime, 1000);
    // setInterval(updateCount, 60000);
});
