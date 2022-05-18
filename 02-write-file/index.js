const { stdout, exit } = process;
const path = require('path');
const fs = require('fs');
const readline = require('readline');

const pathToTxt = path.join(__dirname, 'textfile.txt');
fs.createWriteStream(pathToTxt, 'utf-8');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let count = 0;
let userGreeting = '';
const getData = function () {
  if (count === 0) {userGreeting = 'Введите текст\n';}
  else { userGreeting = 'Прошлый текст был записан, введите новый текст\n';}
  rl.question(userGreeting, function(data) {
    count++;
    if (data === 'exit') {
      stdout.write('До свидания!');
      count = 0;
      exit();
    } else { 
      fs.appendFile(pathToTxt, data+'\n', function () {}); 
      getData();
    }
  });
};
getData();

rl.on('close', function() {
  console.log('До свидания!');
  exit();
});
