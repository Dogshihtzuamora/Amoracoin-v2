var Amoracoin = Amoracoin || {};

Amoracoin.CreateWallet = function() {
   
    var savedPrivateKey = localStorage.getItem('amoracoin_private_key');
    if (savedPrivateKey) {       
        return {
            privateKey: savedPrivateKey
        };
    }

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://amoracoin-serve.vercel.app/Wallet?create', false); 

    try {
        xhr.send(); 

        if (xhr.status === 200) {               
            var responseData = JSON.parse(xhr.responseText);
                      localStorage.setItem('amoracoin_private_key', responseData.key_private);
            
            return {
                address: responseData.address,
                balance: responseData.balance,
                privateKey: responseData.key_private,
                created_at: responseData.created_at
            };
        } else {                
            console.error('Request error:', xhr.status, xhr.statusText);
            return null;
        }
    } catch (error) {           
        console.error('Error:', error);
        return null;
    }
};

Amoracoin.DeleteWallet = function(privateKey) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `https://amoracoin-serve.vercel.app/Wallet?delete_wallet=${privateKey}`, false); 

    try {
        xhr.send(); 

        if (xhr.status === 200) {           
            localStorage.removeItem('amoracoin_private_key');
            return true;
        } else {           
            return `Error: ${xhr.status} ${xhr.statusText}`;
        }
    } catch (error) {        
        return `Error: ${error.message}`;
    }
};


Amoracoin.Wallet = function() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://amoracoin-serve.vercel.app/Wallet', false);

    try {
        xhr.send(); 

        if (xhr.status === 200) {           
            return JSON.parse(xhr.responseText); 
        } else {           
            return `Error: ${xhr.status} ${xhr.statusText}`;
        }
    } catch (error) {       
        return `Error: ${error.message}`;
    }
};

Amoracoin.Transfer = function(privateKey, destinationAddress, amount) {
    var xhr = new XMLHttpRequest();
    var apiUrl = `https://amoracoin-serve.vercel.app/transfer?private_key=${privateKey}&destination_address=${destinationAddress}&amount=${amount}`;
    
    xhr.open('GET', apiUrl, false); 
    
    try {
        xhr.send(); 
       
        var responseData = JSON.parse(xhr.responseText);
        return responseData; 
    } catch (error) {
       
        return JSON.parse(xhr.responseText); 
    }
};

Amoracoin.Transactions = function() {
    var xhr = new XMLHttpRequest();
    var apiUrl = 'https://amoracoin-serve.vercel.app/transfer';
    
    xhr.open('GET', apiUrl, false); 
    
    try {
        xhr.send(); 
       
        var responseData = JSON.parse(xhr.responseText);
        return responseData;
    } catch (error) {
       
        return JSON.parse(xhr.responseText); 
    }
};

Amoracoin.TotalAmoracoins = function() {
    var xhr = new XMLHttpRequest();
    var apiUrl = 'https://amoracoin-serve.vercel.app/mine';
    
    xhr.open('GET', apiUrl, false); 
    try {
        xhr.send(); 
        var responseData = JSON.parse(xhr.responseText);
        return responseData.amoracoins; 
    } catch (error) {
       
        console.error('Error:', error);
        return null; 
    }
};


Amoracoin.fee = function() {
    var xhr = new XMLHttpRequest();
    var apiUrl = 'https://amoracoin-serve.vercel.app/transfer?fee';
    
    xhr.open('GET', apiUrl, false);
    
    try {
        xhr.send();
        var responseData = JSON.parse(xhr.responseText);
        return responseData.fee;
    } catch (error) {
        return null;
    }
};

Amoracoin.Mine = function(privateKey) {
    function gerarSeed() {
        const timestamp = Date.now();
        const aleatorio = Math.random();
        const baseSeed = Math.floor((timestamp * aleatorio * 1000) % 10000);
        return baseSeed;
    }

    const seed = gerarSeed();
    const url = `https://amoracoin-serve.vercel.app/mine.js?private_key=${privateKey}&seed=${seed}`;
    
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false); 
    try {
        xhr.send();
        
        var responseData = JSON.parse(xhr.responseText);
        
        if (responseData.success) {
            return {
                success: true,
                newBalance: responseData.newBalance
            };
        } else if (responseData.message === "Account not found") {
            return {
                success: false,
                message: "Account not found"
            };
        } else {
            return {
                success: false,
                message: "Mining failed"
            };
        }
    } catch (error) {
        return {
            success: false,
            message: "Error connecting to the server"
        };
    }
};


Amoracoin.FindWallet = function() {
    var savedPrivateKey = localStorage.getItem('amoracoin_private_key');
    
    if (savedPrivateKey) {   
        var xhr = new XMLHttpRequest();
        xhr.open('GET', `https://amoracoin-serve.vercel.app/Wallet?key_private=${savedPrivateKey}`, false);

        try {
            xhr.send(); 

            if (xhr.status === 200) {               
                var responseData = JSON.parse(xhr.responseText);                
                return {
                    privateKey: savedPrivateKey,
                    address: responseData.address,
                    balance: responseData.balance,
                    created_at: responseData.created_at
                };
            } else {                
                return `Error: ${xhr.status} ${xhr.statusText}`;
            }
        } catch (error) {           
            return `Error: ${error.message}`;
        }
    } else {
        return null; 
    }
};
