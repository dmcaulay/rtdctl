#!/usr/bin/env node

var repl = require('repl');
var request = require('request');

var url = "http://localhost:8888/";
var resHandler = function(callback) {
  return function(err, res, body) {
    callback(err, body);
  };
};

var db;
var use = function(name, callback) {
  db = new Db(name);
  callback(null, "Use " + name);
};

var Db = function(name) {
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
  request.get({url: this.url, body: q, json: true}, resHandler(callback));
};

Collection.prototype.insert = function(doc, callback) {
  request.post({url: this.url, body: doc, json: true}, resHandler(callback));
};

Collection.prototype.del = function(id, callback) {
  request.del(this.url + "/" + id, resHandler(callback));
};

var handler = function(cmd, context, filename, callback) {
  // check collection
  var match = cmd.match(/^db\.([A-Za-z]\w*)\./)
  if (match) {
    var collection = match[1];
    if (!db[collection]) db.collection(collection);
  }
  // run cmd
  var i = cmd.lastIndexOf(")");
  if (i == -1) return callback(new Error("invalid command:" + cmd));
  cmd = cmd.substring(0, i);
  if (cmd.slice(-1) != '(') cmd = cmd + ",";
  eval(cmd + "callback)");
};
 
repl.start({
  prompt: 'rtdctl> ',
  input: process.stdin,
  output: process.stdout,
  eval: handler
})
