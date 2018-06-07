$(function(){

})

var config = {
    apiKey: "AIzaSyAKK7UT7TabnP64EeSR5VJmo-dWVdn1r0I",
    authDomain: "rockpaperscissors-2ba5a.firebaseapp.com",
    databaseURL: "https://rockpaperscissors-2ba5a.firebaseio.com",
    projectId: "rockpaperscissors-2ba5a",
    storageBucket: "rockpaperscissors-2ba5a.appspot.com",
    messagingSenderId: "527058628030"
  };
firebase.initializeApp(config);

var database = firebase.database();
var connectionsRef = database.ref('/connections');
var connectedRef = database.ref('.info/connected');
var usersConnected = "";
var thisUserID = "";
var playerOne = "";
var playerTwo = "";

// Monitor connections, get UserID of newest connection, remove from users connected on disconnect
connectedRef.on('value', function(snap) {
    if (snap.val()) {
        var con = connectionsRef.push(true);
        thisUserID = con.path.pieces_[1];
        con.onDisconnect().remove();
        // Clear appropriate player info when a user disconnects
        database.ref('players').on('value', function(childSnapshot) {
            if (childSnapshot.hasChild('one')) {
                    if (thisUserID === childSnapshot.val().one.UserID) {
                        var ref1 = database.ref('players/one');
                        ref1.onDisconnect().remove();
                    } else {};
            } if (childSnapshot.hasChild('two')) {
                    if (thisUserID === childSnapshot.val().two.UserID) {
                        var ref2 = database.ref('players/two');
                        ref2.onDisconnect().remove();
                    } else {};
            } else {};
        });
    };
});

// Log number of users connected 
// connectionsRef.on('value', function(snap) {
//     usersConnected = snap.numChildren();
//     console.log("Users connected: " + usersConnected);
// });

// When player joins or quits game, store player info in object, update html
database.ref('players').on('value', function(childSnapshot) {
    if (childSnapshot.hasChild('one')) {
        playerOneUserName = childSnapshot.val().one.Username;
        playerOneUserID = childSnapshot.val().one.UserID;
        playerOne = {
            userName: playerOneUserName,
            userID: playerOneUserID,
        };
        console.log('Player one is connected:');
        console.log(playerOne);
        $('#player-one-div').html("<h2> Player 1 <br> Username: " + playerOneUserName + "</h2>");
    } if (childSnapshot.hasChild('two')) {
        playerTwoUserName = childSnapshot.val().two.Username;
        playerTwoUserID = childSnapshot.val().two.UserID;
        playerTwo = {
            userName: playerTwoUserName,
            userID: playerTwoUserID,
        };
        console.log('Player two is connected:');
        console.log(playerTwo);
        $('#player-two-div').html("<h2> Player 2 <br> Username: " + playerTwoUserName + "</h2>");
    } if (!childSnapshot.hasChild('one')) {
        playerOne = "";
        console.log('Player one is not connected')
        $('#player-one-div').empty();
    } if (!childSnapshot.hasChild('two')) {
        playerTwo = "";
        console.log('Player two is not connected')
        $('#player-two-div').empty();
    } else {};
});

// When user clicks submit, add them as player one, then player two, then whichever available; notify if full
$('body').on('click', '#submit-button', function(event) {
    event.preventDefault();
    var userNameInput = $('#name-input').val().trim();  
    var playerInput = {
        Username: userNameInput,
        UserID: thisUserID
    };
    if (playerOne === "" && playerTwo !== "") {
        database.ref('players/one').set(playerInput);
    } else if (playerOne !== "" && playerTwo === "") {
        database.ref('players/two').set(playerInput);
    } else if (playerOne === "" && playerTwo === "") {
        database.ref('players/one').set(playerInput);
    } else if (playerOne !== "" && playerTwo !== "") {
        alert('Sorry, two users are playing right now! Please wait until someone quits.');
    } else {};
});