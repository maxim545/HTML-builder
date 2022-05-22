const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;

const pathToFolder = path.join(__dirname, 'styles');
const pathToFile = path.join(__dirname, 'project-dist', 'bundle.css');

async function copyStyles() {
  try {
    fs.createWriteStream(pathToFile, 'utf-8');
    const files = await fsPromises.readdir(pathToFolder, { withFileTypes: true });
    for await (const file of files) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        let pathToCurStyle = path.join(__dirname, 'styles', file.name);
        fs.readFile(pathToCurStyle, (err, data) => {
          if (err) throw err;
          fs.appendFile(pathToFile, data+'\n', (err) => {
            if (err) {console.log(err);}
          }); 
        });
      }
    }
    
  } catch (error) {
    console.log(error);
  }
}

copyStyles();