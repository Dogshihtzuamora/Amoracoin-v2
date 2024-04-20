 const amoracoin = {
    iniciar: function(amoracoinCof) {
        firebase.initializeApp(amoracoinCof);
    },
    auth: {
        onAuthStateChanged: function(callback) {
            return firebase.auth().onAuthStateChanged(callback);
        }
    },
    nuvem: function() {
        return firebase.firestore();
    }
};
