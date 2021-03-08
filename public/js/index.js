var db = firebase.firestore();
var ui = new firebaseui.auth.AuthUI(firebase.auth());
let uid;
let uidPhoto;

//Login
function Login(){
    var userEmail = document.getElementById("txtEmail").value;
    var userPass = document.getElementById("txtPassword").value;
  
    console.log('login entered');
    firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        errorMessage(errorCode);
    }).then(()=>{
        window.location = "./direction.html";
    })

}

function SignUp(){
    var userEmail = document.getElementById("txtEmail").value;
    var userPass = document.getElementById("txtPassword").value;
    let phone = $('#phone').val();
    let name = $('#name').val()

    firebase.auth().createUserWithEmailAndPassword(userEmail, userPass).then(cred => {
      firebase.firestore().collection('users').doc(cred.user.uid).set({
        email:userEmail,
        phone : phone,
        name : name,
        id : cred.user.uid,
      }).then(()=>
      {
        //
        var elems = document.querySelectorAll('.modal');
      });


      console.log('Registro exitoso!!!!');
      // sendVerificationEmail();

    }).then(()=>{
      setTimeout(function(){ 
      alert('Usuario registrado correctamente');
      window.location = "./direction.html";
       }, 1000);
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        errorMessage(errorCode);
        console.log('Registro fallido');

      });
}


// VERIFICATION email

var actionCodeSettings = {
// URL you want to redirect back to. The domain (www.example.com) for this
// URL must be whitelisted in the Firebase Console.
url: 'http://localhost:5501/public/index.html',
// This must be true.
handleCodeInApp: true
};

//show verification message
function showMessage(message)
{
  window.alert(message);
}

function updateEmail()
{
  var user = firebase.auth().currentUser;
  var email = document.getElementById("txtEmail").value;

  user.updateEmail(email).then(function() {
    // Update successful.
    showMessage("Update successful.");
    
  }).catch(function(error) {
    // An error happened.
  });

}

function errorMessage(errorCode){

  switch(errorCode){
    case "auth/invalid-email":
      window.alert("La dirección de correo electrónico no es válida");
      break
  
    case "auth/wrong-password":
      window.alert("La contraseña es incorrecta");
      break
  
    case "auth/user-not-found":
      window.alert("No existe ningun usuario que corresponda al correo electrónico ingresado");
      break
  
      case "auth/too-many-requests":
        window.alert("Demasiados intentos fallidos de inicio de sesión, intente de nuevo mas tarde");
        break
  
  //message for signin
    case "auth/weak-password":
      window.alert("La contraseña debe contar con un mínimo de 6 caracteres");
      break
  
      case "auth/email-already-in-use":
        window.alert("La dirección de correo electrónico ya se encuentra en uso");
        break
  
    }

}

//password reset
function sendEmail()
{
  var auth = firebase.auth();
  var emailAddress = document.getElementById("txtRecoveryEmail").value;
  
  auth.sendPasswordResetEmail(emailAddress).then(function() {
    showMessage("Te hemos enviado un correo electrónico, por favor revísalo.");

  }).catch(function(error) {
    // An error happened.
    console.log(error);
  });

}

function switchView(){
  
  let actual = $( "#btnSubmit" ).text(); 
  console.log('BOTON => ' + actual)

  if(actual=='Registrarse'){
    $( "#btnSubmit" ).text('Iniciar Sesión'); 
    $( "#switcher" ).text('Registrate'); 
    //$( "h4" ).text('Inicio de sesión');
    $("#personalData").hide()
    $("#firebaseui-auth-container").show()
    $("#forgotPassword").show()
    console.log('switched');
    
  }else{
    $( "#btnSubmit" ).text('Registrarse'); 
    $( "#switcher" ).text('Inicia Sesión'); 
    //$( "h4" ).text('Registro');
    $("#firebaseui-auth-container").hide()
    $("#forgotPassword").hide()
    $("#personalData").show()
  }

}

function submit(){

  let actual = $( "#btnSubmit" ).text(); 
  let phone = $('#phone').val();
  let email = $('#txtEmail').val();
  let password = $('#txtPassword').val();
  let name = $('#name').val();

  if(actual=='Registrarse'){
    if(phone === ""){
      alert('Escriba su número de teléfono')
    } 
    else if(email === ""){
      alert('Escriba su direción de correo')
    } 
    else if(password === ""){
      alert('Escriba su contraseña')
    } 
    else if(name === ""){
      alert('Escriba su nombre completo')
    } 
    else{
    SignUp();
    }
  }else{
    Login();
  }

  
}


document.addEventListener('DOMContentLoaded', function() {

    var FBelems = document.querySelectorAll('.fixed-action-btn');
    var FBinstances = M.FloatingActionButton.init(FBelems, {
        hoverEnabled: false,
    });

    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
  
    var items = document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);

    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems, {
        edge: 'left', // Choose the horizontal origin
        closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
        draggable: true
    });

});



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



//auth modal, auth methods
document.addEventListener('DOMContentLoaded', function() {
var modals = document.querySelectorAll('#authModal');
M.Modal.init(modals);
});



//firebase ui config
let firebaseUiConfig =  {
    signInFlow: 'popup',
    signInOptions: [
      // List of OAuth providers supported.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    ],
    
    
    // Other config options...
    callbacks: {
      signInSuccessWithAuthResult: (authResult) =>{
        // Process result. This will not trigger on merge conflicts.
        let user = authResult.user;
        uid = user.uid;
        let email = user.email;
        let profileImage = user.photoURL;
        let userName = user.displayName;

        if(uid){
            db.collection('users').doc(uid).get().then(
                (userDoc)=>{
                    //create if doc  
                    if(!userDoc.exists){
                        
                        db.collection('users').doc(uid).set({
                            id : uid,
                            email:email,
                            photoUrl: profileImage,
                            name: userName
                          }).then(
                            ()=>{
                              ui.reset();
                              ui.start('#firebaseui-auth-container',firebaseUiConfig);
                             }
                          ).then(()=>{
                            window.location = "./direction.html";
                          })
                    }
                    else{
                        
                        ui.reset();
                        ui.start('#firebaseui-auth-container',firebaseUiConfig);
                        window.location = "./direction.html";
                             
                    }
                }
            );

                  
        }else{
          showMessage('no uid provided');
        }
        
        return false;
      }
      ,}
}
   
function loadFirebaseUi(){
// Initialize the FirebaseUI Widget using Firebase.
ui.start('#firebaseui-auth-container',firebaseUiConfig);
}
loadFirebaseUi();

function genInfoRegister() {
    let form;    
    form = ` 
    <div class="col s12 z-depth-6 card-panel">
    <br>
    <h3 style="color:#007985">Registra tus datos</h3>
    <div class="row">   
            <br>

            <div class="row">
                <div class="input-field col s12">
                  <i style="color:#007985" class="material-icons prefix">&nbsp person</i>
                  <input class="validate" id="clientName" type="text">
                  <label for="clientName" data-error="wrong" data-success="right">Nombres y apellidos</label>
                </div>
            </div>

            <div class="row">
                <div class="input-field col s12">
                  <i style="color:#007985" class="material-icons prefix"> &nbsp local_phone</i>
                  <input class="validate" id="phoneUser" type="text">
                  <label for="phoneUser" data-error="wrong" data-success="right">Teléfono</label>
                </div>
            </div>

            <div class="row">
                <div class="input-field col s12">
                    <label style="margin-left: 20px; ">
                        <input type="checkbox" id="termsFb" class="filled-in" style="color:#007985"/>
                        <span><u><a href="pages/pedidos/terms.html" target="_blank">Aceptar términos y condiciones</a></u></span>
                    </label>
                </div>
            </div>
    </div>
    </div>
    `
    return form;  
}


function deleteConfirmation(){
   
    uid = localStorage.getItem("userID");
    db.collection('users').doc(uid).get().then(
        (doc)=>{
            var elem = document.querySelector('#confirmation');
            $(document).ready(function() {
                $('.modal').modal();
                var instance = M.Modal.getInstance(elem);
                instance.open();
                $( "#btnCancelDelete" ).click(function() {
                    instance.close();
                });
                $( "#btnConfirmDelete" ).click(function() {
                    deleteUser();
                });
            });
        }
    );
    
}

function deleteUser(){
    
    uid = localStorage.getItem("userID");
    db.collection("users").doc(uid).delete().then(function() {
        alert("Cuenta eliminada con éxito !");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    }).then(()=>{
        firebase.auth().currentUser.delete().catch(function(error) { 
            if (error.code === 'auth/requires-recent-login') { 
                window.alert('Please sign-in and try again.'); 
                firebase.auth().signOut(); 
            } 
        }).then(()=>{
            Logout()
        }).then(()=>{
            location.reload();
    
        })
    })
}


