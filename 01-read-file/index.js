const { stdout } = process;
const path = require('path');
const fs = require('fs');
const pathToTxt = path.join(__dirname, 'text.txt');
const readStream  = fs.createReadStream(pathToTxt, 'utf-8');
let str = '';
readStream.on('data', chunk => str += chunk);
readStream.on('end', () => stdout.write(str));