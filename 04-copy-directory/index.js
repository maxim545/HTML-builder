const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;

const pathFrom = path.join(__dirname, 'files');
const pathTo = path.join(__dirname, 'files-copy');

async function copyFolder(src, dest) {
  try {
    await fsPromises.mkdir(dest, { recursive: true });
    let files = await fsPromises.readdir(src, { withFileTypes: true });
  
    for (let file of files) {
      let srcPath = path.join(src, file.name);
      let destPath = path.join(dest, file.name);
  
      if (file.isDirectory()) {
        await copyFolder(srcPath, destPath);
      }
      else {
        await fsPromises.copyFile(srcPath, destPath);
      }
    }
  }
  catch (err) {
    console.log(err);
  }
}

async function startCopying () {
  try {
    await fsPromises.rm(pathTo, { recursive: true, force: true }, );
    await copyFolder(pathFrom, pathTo);
  }
  catch (err) {
    console.log(err);
  }
  
}
startCopying();