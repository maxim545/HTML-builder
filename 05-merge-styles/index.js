const path = require('path');
const fs = require('fs');
const pathToFolder = path.join(__dirname, 'styles');

const pathToFile = path.join(__dirname, 'project-dist/bundle.css');
fs.createWriteStream(pathToFile, 'utf-8');

fs.readdir(pathToFolder, {withFileTypes: true}, (err, files) => {
  let pathToCurStyle;
  if (err) throw err;
  else {
    files.forEach(a => {
      if (a.isFile() && path.extname(a.name) === '.css') {
        pathToCurStyle = path.join(__dirname, `styles/${a.name}`);
        fs.readFile(pathToCurStyle, (err, data) => {
          if (err) throw err;
          fs.appendFile(pathToFile, data+'\n', function () {}); 
        });
      }
    });
  }
});