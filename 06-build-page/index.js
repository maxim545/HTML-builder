const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;

const pathFrom = path.join(__dirname, 'assets');
const pathTo = path.join(__dirname, 'project-dist', 'assets');

const pathToStylesFolder = path.join(__dirname, 'styles');
const pathToStyle = path.join(__dirname, 'project-dist', 'style.css');

const pathToIndex = path.join(__dirname, 'project-dist', 'index.html');
const pathToTemplate = path.join(__dirname, 'template.html');
const pathToComponents = path.join(__dirname, 'components');

async function copyFolder(src, dest) {
  await fsPromises.mkdir(dest, { recursive: true });
  let entries = await fsPromises.readdir(src, { withFileTypes: true });
  for (let entry of entries) {
    let srcPath = path.join(src, entry.name);
    let destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) { await copyFolder(srcPath, destPath); }
    else { await fsPromises.copyFile(srcPath, destPath); }
  }
}

async function copyStyles() {
  try {
    fs.createWriteStream(pathToStyle, 'utf-8');
    const files = await fsPromises.readdir(pathToStylesFolder, { withFileTypes: true });
    for await (const file of files) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        let pathToCurStyle = path.join(__dirname, 'styles', file.name);
        fs.readFile(pathToCurStyle, (err, data) => {
          if (err) throw err;
          fs.appendFile(pathToStyle, data+'\n', (err) => {
            if (err) {console.log(err);}
          }); 
        });
      }
    }
    
  } catch (error) {
    console.log(error);
  }
}

async function startBuild() {
  await fsPromises.rm(pathTo, { recursive: true, force: true }, );
  await copyFolder(pathFrom, pathTo);
  await htmlMaker();
  copyStyles();
}
startBuild();

async function htmlMaker() {
  const data = await getData();
  const [components, componentsData] = await findComponent();
  await replaceComponent(data, components, componentsData);
}

async function getData() {
  fs.createWriteStream(pathToIndex, 'utf-8');
  const data = await fsPromises.readFile(pathToTemplate, { withFileTypes: true });
  return data;
}

async function findComponent() {
  const components = await fsPromises.readdir(pathToComponents, { withFileTypes: true });
  let data;
  let pathToComponent;
  let componentsData = {};
  for await (const file of components) {
    if (file.isFile() && path.extname(file.name) === '.html') {
      pathToComponent = path.join(pathToComponents, file.name);
      data = await fsPromises.readFile(pathToComponent, { withFileTypes: true });
      componentsData[file.name] = data.toString();
    }
  }
  return [components, componentsData];
}

async function replaceComponent(data, components, componentsData) {
  let componentName;
  data = data.toString();
  for await (const file of components) {
    componentName = file.name.substr(0, file.name.lastIndexOf('.'));
    if (file.isFile() && path.extname(file.name) === '.html' && data.indexOf(`{{${componentName}}}`) !== -1) {
      data = data.split(`{{${componentName}}}`).join(componentsData[file.name]);
    }
  }
  fsPromises.writeFile(pathToIndex, data);
}