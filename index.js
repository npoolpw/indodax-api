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
	
	self._post = function (method, data, options, callback) {
		data = data || {};
		
		data['nonce'] = new Date().getTime();
		data['method'] = method;
		
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
	this._post('getInfo', {}, {}, callback);
}

Indodax.prototype.trade = function (pair, type, price, idr, btc, callback) {
	/**
	 * @param pair
	 * @param type
	 * @param price
	 * @param idr : amount of rupiah to buy btc
	 * @param btc : amount of btc to sell
	 */
	
	
	this._post('trade', {pair: pair, type: type, price: price, idr: idr, btc: btc}, {}, callback)
}

Indodax.prototype.getOrders = function (pair, callback) {
	/**
	 * @param pair
	 */
	this._post('openOrders', {pair: pair}, {}, callback)
}

Indodax.prototype.cancelOrder = function (pair, order_id, type, callback) {
	/**
	 * @param pair
	 * @param order_id
	 * @param type
	 */
	this._post('cancelOrder', {pair: pair, order_id: order_id, type: type}, {}, callback)
}

module.exports = Indodax;
