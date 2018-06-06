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
var playerOneUserID = "";
var playerTwoUserID = "";
var playerOneUserName = "";
var playerTwoUserName = "";

// Monitor connections, log UserID of new connection, remove from users connections on disconnect
connectedRef.on('value', function(snap) {
    if (snap.val()) {
        var con = connectionsRef.push(true);
        thisUserID = con.path.pieces_[1];
        console.log("ThisUserID: " + thisUserID);
        con.onDisconnect().remove();
        // Clear appropriate player info when a user disconnects
        database.ref('players').on('value', function(childSnapshot) {
            if (childSnapshot.hasChild('one')) {
                console.log(childSnapshot.val().one.UserID);
                console.log(thisUserID);
                    if (thisUserID === childSnapshot.val().one.UserID) {
                        var ref1 = database.ref('players/one');
                        ref1.onDisconnect().remove();
                    } else {}
            } if (childSnapshot.hasChild('two')) {
                console.log(childSnapshot.val().two.UserID);
                console.log(thisUserID);
                    if (thisUserID === childSnapshot.val().two.UserID) {
                        var ref2 = database.ref('players/two');
                        ref2.onDisconnect().remove();
                    } else {}
            } else {};
        });
    }
});

// Log number of users connected 
connectionsRef.on('value', function(snap) {
    usersConnected = snap.numChildren();
    console.log("Users connected: " + usersConnected);
    // console.log(snap.node_.children_.root_.key);
})

// On value change, store player info in object
database.ref('players').on('value', function(childSnapshot) {
    if (childSnapshot.hasChild('one')) {
        playerOneUserName = childSnapshot.val().one.Username;
        console.log("playerOneUserName: " + playerOneUserName);
        playerOneUserID = childSnapshot.val().one.UserID;
        console.log("PlayerOneUserID: " + playerOneUserID);
        playerOne = {
            userName: playerOneUserName,
            userID: playerOneUserID,
        }
        console.log(playerOne);
        $('#player-one-div').html("<h2> Player 1 <br> Username: " + playerOneUserName + "</h2>");
    } if (childSnapshot.hasChild('two')) {
        playerTwoUserName = childSnapshot.val().two.Username;
        console.log("playerTwoUserName: " + playerTwoUserName);
        playerTwoUserID = childSnapshot.val().two.UserID;
        console.log("playerTwoUserID: " + playerTwoUserID);
        playerTwo = {
            userName: playerTwoUserName,
            userID: playerTwoUserID,
        }
        console.log(playerTwo);
        $('#player-two-div').html("<h2> Player 2 <br> Username: " + playerTwoUserName + "</h2>");
    } if (!childSnapshot.hasChild('one')) {
        $('#player-one-div').empty();
        console.log('empty1');
    } if (!childSnapshot.hasChild('two')) {
        $('#player-two-div').empty();
        console.log('empty2');
    } else {}
});

$('body').on('click', '#submit-button', function(event) {
    event.preventDefault();
    var userNameInput = $('#name-input').val().trim();  
    var playerInput = {
        Username: userNameInput,
        UserID: thisUserID
    };
    console.log(playerInput);
    console.log(playerOne);
    console.log(playerTwo);
    if (playerOne === "" && playerTwo !== "") {
        database.ref('players/one').set(playerInput);
    } else if (playerOne !== "" && playerTwo === "") {
        database.ref('players/two').set(playerInput);
    } else if (playerOne === "" && playerTwo === "") {
        database.ref('players/one').set(playerInput);
    } else if (playerOne !== "" && playerTwo !== "") {
        alert('Sorry, two users are playing right now! Try again later.');
        location.reload();
    } else {};
});