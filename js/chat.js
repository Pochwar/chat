// Ce code est une adaptation d'un tutoriel de création de TODO list en JavaScript qui utilise la fonction localStorage pour enregistrer les conversations du chat
// Source : https://code-maven.com/todo-in-html-and-javascript


//Fonction pour recupèrer la conversation (chat) depuis le localStorage
function get_chat() {
    var chat = new Array;
    var chat_str = localStorage.getItem('chat');
    if (chat_str !== null) {
        chat = JSON.parse(chat_str);
    }
    return chat;
}

//Fonction pour envoyer les messages dans le chat
//L'argument i determine quelle fenetre de chat (user) apelle la fonction
function speak(i) {
    if (i === 1) {
        var user = 'user1';
    } else if (i === 2) {
        var user = 'user2';
    }
    //On récupère la valeur du champ de l'user
    var speech = document.getElementById(user).value;
    //On prévient d'éventuelles injections de code grace a la fonction htmlEntities
    speech = htmlEntities(speech);
    //Si la valeur n'est pas nulle on l'ajoute au chat
    if (speech !== '') {
        //on récupère la date d'envoi du message
        var speechDate = new Date()
        //On créé un objet speechItem contenant la date, l'utilisateur et le message
        var speechItem = {"date" : speechDate, "user" : user, "speech" : speech};
        var chat = get_chat();
        chat.push(speechItem);
        localStorage.setItem('chat', JSON.stringify(chat));
        document.getElementById(user).value = '';
    }
    show();
    return false;
}

//Fonction pour afficher la conversation
function show() {
    var chat = get_chat();
    var html = '';
    for (var i = 0; i < chat.length; i++) {
        //On récupère le message et on applique la fonction nl2br pour afficher les sauts de ligne
        var speech = nl2br(chat[i]["speech"]);
        //On récupère la date du message
        var speechDate = new Date(chat[i]["date"]);
        var annee   = speechDate.getFullYear();
        // var mois    = ('0'+speechDate.getMonth()+1).slice(-2);
        var mois    = ("0"+(speechDate.getMonth()+1)).slice(-2);
        var jour    = ('0'+speechDate.getDate()   ).slice(-2);
        var heure   = ('0'+speechDate.getHours()  ).slice(-2);
        var minute  = ('0'+speechDate.getMinutes()).slice(-2);
        //On formatte chaque message du chat
        html += "<p class="+chat[i]["user"]+">"+speech+'<span class="date">'+annee+'/'+mois+'/'+jour+' '+heure+':'+minute+'</span></p>';
    };

    //On affiche la conversation dans les fenetres chat1 et chat2
    document.getElementById('chat1').innerHTML = html;
    document.getElementById('chat2').innerHTML = html;

    //On force le scroll des fenetres de chat en bas
    var window1 = document.getElementById("chat1");
    window1.scrollTop = window1.scrollHeight;
    var window2 = document.getElementById("chat2");
    window2.scrollTop = window2.scrollHeight;
}

//Fonction pour supprimer les messages de la conversation
function clean() {
    localStorage.removeItem('chat');
    show();
}

//Fonction pour remplacer les sauts de ligne /n en <br/>
function nl2br (str, is_xhtml) {
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
}

//Fonction pour remplacer certains caracteres spéciaux dans leur équivalent HTML pour éviter les injjections de code
function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

//Fonction pour valider le formulaire avec la touche Enter et pour faire un saut de ligne avec Shift + Enter
function validForm(e,user) {
    if (e.keyCode == 13 && !e.shiftKey) {
        speak(user)
        return false;
    } else {
        return true;
    }
}

//Triggers pour lancer les fonctions
document.getElementById('speak1').addEventListener('click', function () { speak(1); }, true);
document.getElementById('speak2').addEventListener('click', function () { speak(2); }, true);
document.getElementById('clean').addEventListener('click', clean);
show();
