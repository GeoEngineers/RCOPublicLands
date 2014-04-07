global.UnitTestMode = true;

var should = require('should');

//import node-cryptojs-aes modules to encrypt or decrypt data
var node_cryptojs = require('node-cryptojs-aes');

// //import crypto module to generate random binary data
var crypto = require('crypto');

// // generate random passphrase binary data
// var r_pass = crypto.randomBytes(128);

// // convert passphrase to base64 format
// var r_pass_base64 = r_pass.toString("base64");

// console.log(r_pass_base64);

//"OjcsJFer/L9zWNSDsUqQDw==.rLgNMRtIkQH6kGfxWzMCPQ==.qxoDaEa7j/xr4ShtbzVMkw=="
// var pwd = 'pwd';
// var iv = 'OjcsJFer/L9zWNSDsUqQDw==';
// var key = 'rLgNMRtIkQH6kGfxWzMCPQ==';
// var encryptedPassword = 'qxoDaEa7j/xr4ShtbzVMkw=='

// //node-cryptojs-aes main object;
// var CryptoJS = node_cryptojs.CryptoJS;

// // custom json serialization format
// var JsonFormatter = node_cryptojs.JsonFormatter;

// // encrypt plain text with passphrase and custom json serialization format, return CipherParams object
// var encrypted = CryptoJS.AES.encrypt("pwd", r_pass_base64, { format: JsonFormatter });

// // convert CipherParams object to json string for transmission
// var encrypted_json_str = encrypted.toString();

// console.log(encrypted_json_str);

describe('aes encryption', function(){
	it.skip('should properly encrypt the password', function(done){
		var pwd = 'pwd';
		var iv = node_cryptojs.CryptoJS.enc.Base64.parse('OjcsJFer/L9zWNSDsUqQDw==');
		var key = node_cryptojs.CryptoJS.enc.Base64.parse('rLgNMRtIkQH6kGfxWzMCPQ==');

		console.log('iv:  ' + iv);
		console.log('key:  ' + key);

		var expected = 'qxoDaEa7j/xr4ShtbzVMkw=='

		var encrypted = node_cryptojs.CryptoJS.AES.encrypt("pwd", key, {iv: iv});

		var decrypted = node_cryptojs.CryptoJS.AES.decrypt(encrypted, "Secret Passphrase");

		console.log ('encrypted:  ' + encrypted);
		console.log ('expected :  ' + expected);
		encrypted.toString().should.equal(expected);
		done();
	});

	
	it.skip('should properly encrypt the password', function(done){
		var hashPassword = function(password, key, iv){
			iv = iv !== undefined ? iv : crypto.randomBytes(128).toString('base64');
			key = key !== undefined ? key : crypto.randomBytes(128).toString('base64');
			var encrypted = node_cryptojs.CryptoJS.AES.encrypt(password, key, {iv: iv});
			var decrypted = node_cryptojs.CryptoJS.AES.decrypt(encrypted, key, {iv: iv});
			// var encrypted2 = node_cryptojs.CryptoJS.AES.encrypt(password, key, {iv: iv});
			// var encrypted3 = node_cryptojs.CryptoJS.AES.encrypt(password, key, {iv: iv});

			// var encrypted = node_cryptojs.CryptoJS.DES.encrypt(password, key, {iv: iv});
			// var encrypted2 = node_cryptojs.CryptoJS.DES.encrypt(password, key, {iv: iv});
			// var encrypted3 = node_cryptojs.CryptoJS.DES.encrypt(password, key, {iv: iv});

			console.log('iv: ' + iv);
			console.log('key: ' + key);

			console.log('iv: ' + iv);
			console.log('key: ' + key);
			
			console.log('password: ' + password);
			console.log('encrypted:');
			console.log(encrypted.toString());
			console.log('decrypted:');
			console.log(decrypted.toString());
			// console.log('encrypted2:');
			// console.log(encrypted2.toString());
			// console.log('encrypted3:');
			// console.log(encrypted3.toString());
			
			return iv + '.' + key + '.' + encrypted.toString();
		};
		
		var verifyPassword = function(password, hashedPasswordPackage){
			var ivKeyPassword = hashedPasswordPackage.split('.');
			var iv = ivKeyPassword[0]; //node_cryptojs.CryptoJS.enc.Base64.parse(ivKeyPassword[0]);
			var key = ivKeyPassword[1]; //node_cryptojs.CryptoJS.enc.Base64.parse(ivKeyPassword[1]);
			var validHashedPassword = ivKeyPassword[2];
			
			var hashedPassword = node_cryptojs.CryptoJS.AES.encrypt(password, key, {iv: iv});// hashPassword(password, key, iv);
			
			console.log('===================');
			console.log('iv: ' + iv);
			console.log('key: ' + key);
			console.log('===================');
			console.log('validHashedPassword: ' + validHashedPassword);
			console.log('hashedPassword: ' + hashedPassword);
			
			return hashedPassword.toString() === validHashedPassword.toString();
		};
		
		var pwd = "pwd";
		var hashedPasswordPackage = hashPassword(pwd);
		//console.log(verifyPassword(pwd, hashedPasswordPackage));
	
		done();
	});
	
	var aesUtil = require('../aesUtil.js');
	
	it.only('should encrypt and decrypt', function(done){
		
		
		console.log();
		
		done();
	});
});

