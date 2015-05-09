var request = require('request');

var resHandler = function(callback) {
  return function(err, res, body) {
    callback(err, body);
  };
};

var Db = function(name, url) {
  this.name = name;
  this.url = url + name;
};

Db.prototype.create = function(callback) {
  request.post(this.url, resHandler(callback));
};

Db.prototype.del = function(callback) {
  request.del(this.url, resHandler(callback));
};

Db.prototype.collection = function(name) {
  this[name] = new Collection(name, this.url);
};

var Collection = function(name, dbUrl) {
  this.name = name;
  this.url = dbUrl + '/' + name;
};

Collection.prototype.findById = function(id, callback) {
  request.get(this.url + '/' + id, resHandler(callback));
};

Collection.prototype.find = function(q, callback) {
  if (!callback) {
    callback = q;
    q = {};
  }
  request.get({url: this.url, body: q, json: true}, resHandler(callback));
};

Collection.prototype.insert = function(doc, callback) {
  request.post({url: this.url, body: doc, json: true}, resHandler(callback));
};

Collection.prototype.del = function(id, callback) {
  request.del(this.url + "/" + id, resHandler(callback));
};

module.exports = Db;
