const fs = require('fs').promises;
const path = require('path');

// Создание папки project-dist
const distDir = path.join(__dirname, 'project-dist');
fs.mkdir(distDir, { recursive: true })
  .then(() => {
    // Чтение файла-шаблона
    const templateFile = path.join(__dirname, 'template.html');
    return fs.readFile(templateFile, 'utf8');
  })
  .then((templateContent) => {
    // Нахождение всех имён тегов в файле шаблона
    const tagRegex = /{{([^}]+)}}/g;
    const componentTags = [];
    let match;
    while ((match = tagRegex.exec(templateContent))) {
      componentTags.push(match[1]);
    }

    // Замена шаблонных тегов содержимым файлов-компонентов
    const componentsDir = path.join(__dirname, 'components');
    const componentPromises = componentTags.map((componentTag) => {
      const componentFile = `${componentTag}.html`;
      const componentPath = path.join(componentsDir, componentFile);

      return fs.readFile(componentPath, 'utf8')
        .then((componentContent) => {
          templateContent = templateContent.replace(new RegExp(`{{${componentTag}}}`, 'g'), componentContent);
        });
    });

    return Promise.all(componentPromises)
      .then(() => templateContent);
  })
  .then((templateContent) => {
    // Запись изменённого шаблона в файл index.html
    const indexPath = path.join(distDir, 'index.html');
    return fs.writeFile(indexPath, templateContent)
      .then(() => templateContent);
  })
  .then((templateContent) => {
    console.log('index.html created successfully');

    // Создание файла style.css
    const stylesDir = path.join(__dirname, 'styles');
    const stylePath = path.join(distDir, 'style.css');
    return mergeStyles(stylesDir, stylePath)
      .then(() => templateContent);
  })
  .then((templateContent) => {
    console.log('style.css created successfully');

    // Копирование папки assets
    const assetsDir = path.join(__dirname, 'assets');
    const distAssetsDir = path.join(distDir, 'assets');
    return copyDirectory(assetsDir, distAssetsDir)
      .then(() => templateContent);
  })
  .then(() => {
    console.log('assets copied successfully');
  })
  .catch((err) => {
    console.error(err);
  });

// Функция для создания файла style.css
function mergeStyles(stylesDir, stylePath) {
  return fs.readdir(stylesDir)
    .then((files) => {
      const filePromises = files.map((file) => {
        const filePath = path.join(stylesDir, file);

        return fs.readFile(filePath, 'utf8');
      });

      return Promise.all(filePromises);
    })
    .then((styles) => {
      const mergedStyles = styles.join('\n');
      return fs.writeFile(stylePath, mergedStyles);
    });
}

function copyDirectory(sourceDir, destDir) {
  return fs.mkdir(destDir, { recursive: true })
    .then(() => {
      return fs.readdir(sourceDir);
    })
    .then((files) => {
      const filePromises = files.map((file) => {
        const sourcePath = path.join(sourceDir, file);
        const destPath = path.join(destDir, file);

        return fs.stat(sourcePath)
          .then((stats) => {
            if (stats.isDirectory()) {
              return copyDirectory(sourcePath, destPath);
            } else if (stats.isFile()) {
              return fs.copyFile(sourcePath, destPath);
            }
          });
      });

      return Promise.all(filePromises);
    });
}


