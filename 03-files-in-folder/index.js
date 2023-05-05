const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error('Ошибка чтения папки:', err);
    return;
  }

  files.forEach((file) => {
    if (file.isFile()) {
      const filename = file.name;
      const extension = path.extname(filename).slice(1);
      
      fs.stat(path.join(folderPath, filename), (err, stats) => {
        if (err) {
          console.error('Ошибка получения информации о файле:', err);
          return;
        }
        
        const fileSize = Math.round(stats.size / 1024) + 'kb';

        console.log(`${filename}-${extension}-${fileSize}`);
      });
    }
  });
});
