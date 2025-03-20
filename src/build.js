import { execSync } from 'child_process';
import { readdirSync, copyFileSync, mkdirSync, existsSync } from 'fs';
import { extname, join } from 'path';
import fs from 'fs';



const sourceDir = '.';
const distDir = './dist';


try {

  console.log(`Building...`);

  // Lire les fichiers dans le répertoire source
  const files = readdirSync(sourceDir, { withFileTypes: true });
  //console.log(files);

  files.forEach(file => {

    const sourcePath = join(sourceDir, file.name);
    const distPath = join(distDir, file.name);

    if (file.isFile() && extname(file.name) === '.html') {

      console.log(`Processing ${sourcePath} > ${distPath}`);

      console.log(sourcePath);


      // incrément buildVersion  
      incrementVersion(sourcePath)

      // Exécuter la commande inliner
      execSync(`inliner ${sourcePath} > ${distPath}`, { stdio: 'inherit' });

      console.log(`Processed ${file.name}`);

    } else if (extname(file.name) === '.txt') {
      // Copier les fichiers .txt
      copyFileSync(sourcePath, distPath);
      console.log(`Copied ${file.name} to ${distDir}`);
    }
  });

  console.log(`Builded.`);

} catch (error) {
  console.error(`Error processing files: ${error.message}`);
}


function incrementVersion(filePath) {
  // Lire le contenu du fichier HTML
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  // Extraire la version actuelle
  const versionRegex = /<meta name="version" content="(\d+\.\d+\.\d+)">/;
  const match = fileContent.match(versionRegex);

  if (match) {
    const currentVersion = match[1];
    const [major, minor, patch] = currentVersion.split('.').map(Number);

    // Incrémenter le troisième chiffre (patch)
    const newVersion = `${major}.${minor}.${patch + 1}`;

    // Mettre à jour le contenu du fichier avec la nouvelle version
    const newFileContent = fileContent.replace(versionRegex, `<meta name="version" content="${newVersion}">`);

    // Écrire les modifications dans le fichier
    fs.writeFileSync(filePath, newFileContent, 'utf-8');

    console.log(`Version mise à jour : ${newVersion}`);
  } else {
    console.error('Version non trouvée dans le fichier HTML.');
  }
}
