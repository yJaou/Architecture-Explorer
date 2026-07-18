const { scanDirectory } = require("./fileScanner");
const { analyzePHP } = require("./phpAnalyzer");
const { buildGraph } = require("./generateGraph");
const { detectFeature } = require("./featureAnalyzer");
const path = require("path");
const fs = require("fs");

// On utilise le dossier courant si on est sur GitHub, sinon ton chemin local
const repoPath = process.env.GITHUB_WORKSPACE 
    ? process.env.GITHUB_WORKSPACE 
    : "/Users/yasmine/Downloads/PBLCare-Admin-ART_Code-Updates 3";

console.log("🔍 Scan...");

const files = scanDirectory(repoPath);

const phpFiles = files.filter(file =>
    file.path.endsWith(".php")
);

console.log(`PHP trouvés : ${phpFiles.length}`);

const analysis = phpFiles.map(file => {
    const result = analyzePHP(file.path);
    result.feature = detectFeature(result);
    return result;
});

const graph = buildGraph(analysis, repoPath);

// --- NOUVEAUTÉ : GESTION DYNAMIQUE DU NOM DU FICHIER PAR BRANCHE ---
// On récupère la variable d'environnement ou on met "local" si tu le lances sur ton Mac
// Le .replace évite les caractères bizarres (comme /) dans les noms de fichiers
const branchName = process.env.GITHUB_BRANCH_NAME 
    ? process.env.GITHUB_BRANCH_NAME.replace(/[^a-zA-Z0-9-_]/g, '-') 
    : 'local';

const outputFileName = `graph-${branchName}.json`;
const outputPath = path.join(__dirname, "..", "..", "data", outputFileName);
const outputDir = path.dirname(outputPath);

if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(
    outputPath,
    JSON.stringify(graph, null, 2)
);

console.log(`✅ ${outputFileName} généré avec succès dans :`, outputPath);