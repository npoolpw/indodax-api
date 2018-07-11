var cloudscraper = require('cloudscraper');
var Indodax = function (key, secret, family){
  family = family || 4;
	var self = this;

	self.VERSION = '1.0.0';

	self._key = key;
	self._secret = secret;

	self._endpoint = 'tradeogre.com/api/v1';
	self._publicUrl = 'https://' + self._endpoint;
	self._privateUrl = 'https://' + self._key + ":" + self._secret + "@" + self._endpoint;
  self._userAgent = 'Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:60.0) Gecko/20100101 Firefox/60.0';
  
  return self;
}
