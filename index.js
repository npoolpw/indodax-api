var cloudscraper = require('cloudscraper');
var hmac_sha512 = require('./hmac-sha512.js');
var querystring = require("querystring");
var Indodax = function (key, secret, family){
	family = family || 4;
	var self = this;

	self.VERSION = '1.0.0';

	self._key = key;
	self._secret = secret;

	self._userAgent = 'Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:60.0) Gecko/20100101 Firefox/60.0';

	self._get = function (data, options, callback){
		var qs = ''
		options = options || {};
		for (var d in data) {
			qs += '/' + data[d]
		}
		
		options['method'] = 'GET';
		options['url'] = 'https://indodax.com/api' + qs;
		options['timeout'] = 2000;
		options['headers'] = {'User-Agent': self._userAgent};
		options['family'] = family;
		options['json'] = true;
		
		return cloudscraper.request(options,callback);
	};
	
	self._post = function (data, options, callback) {
		data = data | {};
		data['nonce'] = new Date().getTime();
		
		var sign = hmac_sha512.HmacSHA512(querystring.stringify(data), self._secret);
		
		options['method'] = 'POST';
		options['url'] = 'https://indodax.com/tapi';
		options['form'] = data;
		options['json'] = true;
		options['timeout'] = 2000;
		options['headers'] = {'User-Agent': self._userAgent, 'Sign': sign, 'Key': self._key};
		options['family'] = family;
		
		return cloudscraper.request(options, callback);
	};
	
	return self;
};

// Public methods
Indodax.prototype.getOrderBook = function (pair, callback) {
	/**
	 * @param market
	 */
	this._get({pair: pair, target: 'depth'}, {}, callback);
}

//Private methods
Indodax.prototype.getInfo = function (callback) {
	/**
	 * @param none
	 */
	this._post({method:'getInfo'}, {}, callback);
}

Indodax.prototype.getOrders = function (pair, callback) {
	/**
	 * @param pair
	 */
	this._post({method:'openOrders', pair: pair}, {}, callback)
}

module.exports = Indodax;
