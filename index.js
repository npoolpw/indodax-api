var cloudscraper = require('cloudscraper');
var hmac_sha512 = require('./hmac-sha512.js');
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
		
		return cloudscraper.request(options,callback);
	};
	return self;
};

// Public methods
Indodax.prototype.getOrderBook = function (market, callback) {
	/**
	 * @param market
	 */
	this._get({market: market, target: 'depth'}, {}, callback);
}
