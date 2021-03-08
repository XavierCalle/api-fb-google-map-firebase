var db = firebase.firestore();
var ui = new firebaseui.auth.AuthUI(firebase.auth());
let userId;
async function Logout(){
    //
    firebase.auth().signInAnonymously().catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;     
      anonymusUser = firebase.auth().currentUser;
      // ...
    }).then(()=>{
        window.location = "./index.html";
       
    }).then(async ()=>{
        setTimeout(function(){ 
            location.reload();
         }, 1000);
        
    })   
}

// Initialize LocationPicker plugin
var lp = new locationPicker(map, {
    setCurrentPosition: true, // You can omit this, defaults to true
}, {
    zoom: 15, // You can set any google map options here, zoom defaults to 15
    center: {
        lat: -0.176973,
        lng: -78.478029
    }
});

// Listen to map idle event, listening to idle event more accurate than listening to ondrag event
google.maps.event.addListener(lp.map, 'idle', function (event) {
    // Get current location
    var location = lp.getMarkerPosition();
    console.log(location);
})

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        userId= user.uid;
    } else {
        console.log("usuario nullo");
    }
  
})

function newEntry(){
    $( "#myEntriesButton" ).prop( "disabled", false );
    $( "#newEntryButton" ).prop( "disabled", true );
    $(".bloque_1").hide();
    $(".bloque_2").show();
}

function myEntries(){

    document.getElementById('placesList').innerHTML=``;
    $( "#myEntriesButton" ).prop( "disabled", true );
    $( "#newEntryButton" ).prop( "disabled", false );
    $(".bloque_1").show();
    $(".bloque_2").hide();

     db.collection('users').doc(userId).collection('places').get()
        .then( (snapshot)=>{
            
            snapshot.forEach((doc)=>{
                
                
                document.getElementById('placesList').innerHTML+= `
    
                    <li class="collection-item"><div>${doc.data().placeName}<a href="https://www.google.es/maps?q=${doc.data().address.latitude},${doc.data().address.longitude}"  target="_blank" class="secondary-content">Ver Dirección</a></div></li>
    
                `
            })

        })

}
setTimeout(function(){ myEntries(); }, 3000);



async function newEntrySubmit(){
    var location1 = lp.getMarkerPosition();
    var placeName = $("#place").val();
    await db.collection('users').doc(userId).collection('places').add({
        address: new firebase.firestore.GeoPoint(location1.lat, location1.lng),
        placeName: placeName
    }).then(()=>{
        alert('Lugar registrado correctamente');
        location.reload();
    })
}

