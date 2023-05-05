const fs = require('fs');
const readline = require('readline');
const path = require('path')
const filename = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(filename, { flags: 'a' });

console.log('Добро пожаловать! Введите текст (для выхода введите "exit")');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', (input) => {
  if (input === 'exit') {
    console.log('До свидания!');
    rl.close();
  } else {
    writeStream.write(input + '\n');
  }
});

process.on('SIGINT', () => {
  console.log('Процесс завершен. До свидания!');
  writeStream.end();
  process.exit();
});
