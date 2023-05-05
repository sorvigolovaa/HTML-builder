const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const distDir = path.join(__dirname, 'project-dist');
const bundlePath = path.join(distDir, 'bundle.css');

// Чтение содержимого папки styles
fs.readdir(stylesDir, (err, files) => {
  if (err) {
    console.error('Ошибка чтения папки styles:', err);
    return;
  }

  const cssFiles = files.filter((file) => path.extname(file) === '.css');

  // Чтение и объединение файлов стилей
  const cssContents = cssFiles.map((file) => {
    const filePath = path.join(stylesDir, file);
    return fs.promises.readFile(filePath, 'utf8');
  });

  // Запись объединенных стилей в файл bundle.css
  Promise.all(cssContents)
    .then((contents) => {
      const bundleContent = contents.join('\n');
      fs.writeFile(bundlePath, bundleContent, 'utf8', (err) => {
        if (err) {
          console.error('Ошибка записи файла bundle.css:', err);
        } else {
          console.log('Сборка CSS бандла завершена.');
        }
      });
    })
    .catch((err) => {
      console.error('Ошибка чтения файлов стилей:', err);
    });
});
