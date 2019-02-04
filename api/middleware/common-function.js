
var crypto = require("crypto");
module.exports = {
   
    passwordEncrypted : function (password){
        var key = "The@K%&Key!";
        var  cipher=crypto.createCipher('aes192',key);
        var encrypted=cipher.update(password,'utf8','hex');
        encrypted+=cipher.final('hex');
        return encrypted;
    },
    passwordDecrypted : function (password){
        var key = "The@K%&Key!";
        const decipher=crypto.createDecipher('aes192',key);
        var decrypted=decipher.update(password,'hex','utf8');
        decrypted+=decipher.final('utf8');
        return decrypted
    }

}