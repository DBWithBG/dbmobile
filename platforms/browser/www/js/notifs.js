function dialog_annuler(button){
// 2 correspond à OK
// 1 correspond à ANNULER
  switch(button){
    case 1 :
      alert("Demande de prise en charge annulée.");
    break;
    case 2 :
    break;
  }
}

function annulerPriseEnCharge(){
  navigator.notification.confirm("Souhaitez-vous supprimer votre demande prise en charge?" , dialog_annuler ,'Demande prise en charge', ['Supprimer ma demande','Conserver ma demande'] );
}

function vibrate(){
  navigator.notification.vibrate(2000);
}

function push_notif(){
  
}
