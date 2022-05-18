const path = require('path');
const fs = require('fs');
const pathToFolder = path.join(__dirname, 'secret-folder');
fs.readdir(pathToFolder, {withFileTypes: true}, (err, files) => {
  let fileName;
  let fileSize;
  let pathToFile;
  if (err) throw err;
  else {
    files.forEach(a => {
      if (a.isFile()) {
        pathToFile = path.join(__dirname, `secret-folder/${a.name}`);
        fs.stat(pathToFile, function (err, stats) {
          fileName = a.name.slice(0, a.name.lastIndexOf('.'));
          if (err) throw err;
          fileSize = `${stats.size / 1000}Kb`;
          console.log(`${fileName} - ${path.extname(a.name).replace(/\./g, '')} - ${fileSize}`);
        });
      }
    }
    );
  }
});



