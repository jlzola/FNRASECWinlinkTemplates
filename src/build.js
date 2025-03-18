import { execSync } from 'child_process';
import { readdirSync, copyFileSync, mkdirSync, existsSync } from 'fs';
import { extname, join } from 'path';


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
