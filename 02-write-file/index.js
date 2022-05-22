const { stdout, exit } = process;
const path = require('path');
const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const pathToTxt = path.join(__dirname, 'textfile.txt');

fs.createWriteStream(pathToTxt, 'utf-8');

let count = 0;
let userGreeting = '';
const getData = function () {
  if (count === 0) {userGreeting = 'Введите текст:\n';}
  else { userGreeting = '';}
  rl.question(userGreeting, function(data) {
    count++;
    if (data === 'exit') {
      stdout.write('До свидания!');
      count = 0;
      exit();
    } else { 
      fs.appendFile(pathToTxt, data+'\n', (err) => {
        if (err) {
          throw err;
        }
      }); 
      getData();
    }
  });
};
getData();

rl.on('close', function() {
  console.log('До свидания!');
  exit();
});
