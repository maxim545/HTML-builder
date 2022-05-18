const fs = require('fs');
const path = require('path');
let count = 0;

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
  count++;
  if (count===2) {
    htmlMaker();
  }
}

function removeFolder () {
  fs.access(`${__dirname}/project-dist`, error => {
    if (!error) {
      fs.rm(`${__dirname}/project-dist`, { recursive: true}, (err) => {
        if (err) throw err;
        else {
          makeCopy(`${__dirname}/assets`, `${__dirname}/project-dist/assets`);
        }
      });
    } else {
      makeCopy(`${__dirname}/assets`, `${__dirname}/project-dist/assets`);
    }
  });
}
removeFolder();

function htmlMaker() {
  const pathToIndex = path.join(__dirname, 'project-dist/index.html');
  fs.createWriteStream(pathToIndex, 'utf-8');
  const pathToTemplate = path.join(__dirname, 'template.html');
  const pathToComponents = path.join(__dirname, 'components');
  const pathToStylesFolder = path.join(__dirname, 'styles');
  fs.readFile(pathToTemplate, 'utf8', function (err, data) {
    if (err) { throw err; }
    let tagsArr = findText(data);
    function findText (str) {
      let arr = [];
      let searchingIndex = 0;
      let newStr = '';
      let count = (str.match(/{{/g) || []).length;
      let count2 = (str.match(/}}/g) || []).length;
      if (count-count2 !== 0) {console.log('Файл index.html записан не был, т.к. вы указали некоректное название тега в исходном файле - template.html');}
      else {
        for (let i = 0; i < count; i++) { 
          newStr = str.substring(str.indexOf('{{', searchingIndex), str.indexOf('}}', searchingIndex)+2);
          searchingIndex = str.indexOf('}}', searchingIndex)+2;
          arr.push(newStr);
        }
      }
      return arr;
    }
  
    tagsArr.forEach((el) => {
      let replaceElement = new RegExp(el, 'g');
      let componentName = el.substring(2, el.length-2);
      let pathToComponent = path.join(__dirname, `components/${componentName}.html`);
      fs.readdir(pathToComponents, (err, files) => {
        if (err) { throw err; }
        if (files.includes(componentName+'.html')) {fs.readFile(pathToComponent, (err, component) => {
          if (err) { throw err; }
          data = data.replace(replaceElement, component.toString());
          fs.writeFile(pathToIndex, data, 'utf8', function (err) {
            if (err) { throw err; }
          });
        });}
        else {
          console.log(`Шаблонный тег '${el}' заменить невозможно, так как его исходника не сущетсвует в папке 'components'`);
        }
      });
    });
  });
  const pathToStyle = path.join(__dirname, 'project-dist/style.css');
  fs.createWriteStream(pathToStyle, 'utf-8');
  fs.readdir(pathToStylesFolder, {withFileTypes: true}, (err, files) => {
    let pathToCurStyle;
    if (err) throw err;
    else {
      files.forEach(a => {
        if (a.isFile() && path.extname(a.name) === '.css') {
          pathToCurStyle = path.join(__dirname, `styles/${a.name}`);
          fs.readFile(pathToCurStyle, (err, data) => {
            if (err) throw err;
            fs.appendFile(pathToStyle, data+'\n', function () {}); 
          });
        }
      });
    }
  });
}