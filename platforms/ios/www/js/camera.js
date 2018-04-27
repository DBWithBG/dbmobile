var pictureSource ;   // picture source
var destinationType ; // sets the format of returned values

function initPhoto(){
  pictureSource = navigator.camera.PictureSourceType;
  destinationType = navigator.camera.DestinationType;

}


function openCamera(){
  initPhoto();
     if(typeof navigator.camera !== 'undefined') {
          console.log('it works');
          navigator.camera.getPicture(succesCamera, onFail, {
            quality: 100,
            destinationType: destinationType.NATIVE_URI, // dataURL -> Return base64 encoded string.
            correctOrientation: true,
            encodingType : navigator.camera.EncodingType.JPEG,
            targetWidth : 400,
            targetHeight : 400
          });
     } else {
          console.log('navigator.camera is undefined');
          //console.log(navigator);
     }

}

function openGalery() {
  initPhoto();
      navigator.camera.getPicture(succesGalery, onFail, {
        quality: 100,
        destinationType: destinationType.NATIVE_URI,
        sourceType: pictureSource.PHOTOLIBRARY,
        correctOrientation: true,
        targetWidth : 400,
        targetHeight : 400 });
    }


function succesCamera(photo){
  // On récupère la photo : il est nécessaire d'ajouter " data:image/jpeg;base64 " pour la convertir correctement au format image
  $('#photo_container').append(`<div class="img-camera" > <img src=${photo}> </div>`);
}

function succesGalery(uri){
  $('#photo_container').append(`<div class="img-galery" > <img src=${uri}> </div>`);

}

function onFail(message) {

}


//var test = navigator.camera.getPicture(getPictureWin, onGetPictureError, options);


/*
function capturePhoto(){
  navigator.camera.getPicture(onSuccess, onFail, {
      quality: 50,
      destinationType: navigator.camera.DestinationType.FILE_URI });
}
function onSuccess(imageURI) {
    var map = new google.maps.Map(document.getElementById('map'));
    map.setMapTypeId('terrain');
    var image = document.getElementById('myImage');
    image.src = imageURI;
}

function onFail(message) {
    alert('Failed because: ' + message);
}
*/
