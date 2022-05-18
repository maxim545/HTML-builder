const path = require('path');
const fs = require('fs');

const pathToFolder = path.join(__dirname, 'files');
const copiedFolder = path.join(__dirname, 'files-copy');

function makeCopy(from, to) {
  fs.mkdir(to, { recursive: true}, (err) => {
    if (err) throw err;
    else {
      fs.readdir(from, {withFileTypes: true}, (err, files) => {
        if (err) throw err;
        else {
          files.forEach(el => {
            if (el.isFile()) {
              fs.copyFile(path.join(from, el.name), path.join(to, el.name), (err) => {
                if (err) throw err;
              });
            } else {
              makeCopy(path.join(from, el.name), path.join(to, el.name));
            }
          });
        }
      });
    }
  });
}

function removeFolder () {
  fs.access(copiedFolder, error => {
    if (!error) {
      fs.rm(copiedFolder, { recursive: true}, (err) => {
        if (err) throw err;
        else {
          makeCopy(pathToFolder, copiedFolder);
        }
      });
    } else {
      makeCopy(pathToFolder, copiedFolder);
    }
  });
}
removeFolder();


