const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;

const pathToFolder = path.join(__dirname, 'secret-folder');

async function readFolder() {
  const files = await fsPromises.readdir(pathToFolder, { withFileTypes: true });
  for (const file of files) {
    if (file.isFile()) {
      let pathToFile = path.join(__dirname, 'secret-folder', file.name);
      fs.stat(pathToFile, (err, stats) => {
        if (err) throw err;
        let fileInfo = `${file.name.slice(0, file.name.lastIndexOf('.'))} - ${file.name.slice(file.name.lastIndexOf('.')+1)} - ${(stats.size / 1024).toFixed(1)}Kb`;
        console.log(fileInfo);
      });
    }
  }
}
readFolder();
