const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
var readDirAsync = Promise.promisify(fs.readDir);

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    var filePath = path.join(exports.dataDir, '/', id + '.txt');
    fs.writeFile(filePath, text, (err) => {
      if (err) {
        throw ('error creating file');
      } else {
        items[id] = text;
        callback(null, { id, text});
      }
    });
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('Error reading files');
    } else {
      //var data = _.map(files, (text, id) => {
      var data = _.map(files, (file) => {
        var id = file.slice(0, file.indexOf('.'));
        return { id: id, text: id};
      });
      callback(null, data);
    }
  });
};

exports.readAll = (callback) => {
  return new Promise((resolve, reject) => {
    fs.readdir(exports.dataDir, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('Error reading files');
    } else {
      //var data = _.map(files, (text, id) => {
      var data = _.map(files, (file) => {
        var id = file.slice(0, file.indexOf('.'));
        return { id: id, text: id};
      });
      callback(null, data);
    }
  });
};

exports.readOne = (id, callback) => {
  var directoryPath = path.join(exports.dataDir, `${id}.txt`);

  fs.readFile(directoryPath, 'utf-8', (err, file) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text: file });
    }
  });
};

exports.update = (id, text, callback) => {
  var directoryPath = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(directoryPath, 'utf-8', (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(directoryPath, text, (err) => {
        if (err) {
          throw ('Error writing file');
        } else {
          callback(null, {id, text: text});
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  var directoryPath = path.join(exports.dataDir, `${id}.txt`);

  fs.unlink(directoryPath, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};