#!/usr/bin/env node

var repl = require('repl');

var Db = require('../');

var db;
var url = "http://localhost:8888/";

var use = function(name, callback) {
  db = new Db(name, url);
  callback(null, "Use " + name);
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
});
