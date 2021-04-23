

"use strict";

let firstname= document.getElementById("firstname");
let lastname = document.getElementById("lastname");
let email =  document.getElementById("email");
let pw = document.getElementById("pw");
let img =  document.getElementById("img");
let bio = document.getElementById('bio');


const emailRegEx = /\w+@\w+\.\w{2,10}/;
const passwordRegEx = new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
const textRegEx = new RegExp("[a-zA-Z]{2,}");


//  Envoyer les valeurs du formulaire a l'api

let signupUrl = `http://127.0.0.1:3000/api/auth/signup`;

function sendToServer(){
let formData = new FormData();
formData.append("image", img.files[0]);
formData.append( "firstname", firstname.value);
formData.append( "lastname", lastname.value);
formData.append( "email", email.value);
formData.append( "pw", pw.value);
formData.append( "bio", bio.value);


  fetch(signupUrl,{
    method : 'post',
    body : formData
  })
  .then(response => {
      if (response.ok == true) {
        return response;
      }

      else {
        console.log(response);
        throw new Error("la reponse du serveur n'est pas 200");
      }
    })
  .then(() => {
       //aller vers la page confirmation.fr
      window.location.href = 'connexion.html'
    })
    .catch(error => {
        console.log(error);
    });
};

// appeller la fonction sendToServer quand on clique sur le boutton send à condition que les champs des formulaires sont tous bien remplis
let form = document.getElementById('formulaire');
let btnSend = document.getElementById('btnSend');

function checkIsValid(item, regEx) {
  if (!regEx.test(item.value)) {
    item.classList.add('is-invalid');
    return false;
  } else {
    item.classList.remove('is-invalid');
    item.classList.add('is-valid');
    return true;
  }
}

btnSend.addEventListener('click', ()=> {
  let mailValid = checkIsValid(email, emailRegEx);
  let nomValid = checkIsValid(lastname, textRegEx) ;
  let prenomValid = checkIsValid(firstname, textRegEx);
  let pwValid = checkIsValid(pw, passwordRegEx);


  if (mailValid && nomValid && prenomValid && pwValid ) {
    sendToServer();
  }
});

