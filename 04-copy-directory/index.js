const fs = require('fs');
const path = require('path');

function copyDir(sourceDir, targetDir) {
  // Создаем папку files-copy, если она не существует
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir);
  }

  // Читаем содержимое папки files
  const files = fs.readdirSync(sourceDir);

  // Копируем файлы из папки files в папку files-copy
  files.forEach((file) => {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);

    if (fs.statSync(sourcePath).isFile()) {
      fs.copyFileSync(sourcePath, targetPath);
    }
  });

  console.log('Папка успешно скопирована.');
}

const sourceDir = path.join(__dirname, 'files');
const targetDir = path.join(__dirname, 'files-copy');

copyDir(sourceDir, targetDir);

