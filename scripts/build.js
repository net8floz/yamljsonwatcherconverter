const fs = require('fs-extra');
const src = '../src/index.js';
const bin = '../bin/index.js';

fs.copySync(src, bin);

var data = fs.readFileSync(bin); //read existing contents into data
var fd = fs.openSync(bin, 'w+');
var buffer = new Buffer('#!/usr/bin/env node\n');

fs.writeSync(fd, buffer, 0, buffer.length, 0); //write new data
fs.writeSync(fd, data, 0, data.length, buffer.length); //append old data
// or fs.appendFile(fd, data);
fs.close(fd);