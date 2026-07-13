/**
 * Point d'entrée principal du scanner
 * Utilise le CodeScanner modulaire pour analyser un répertoire
 */

const { CodeScanner } = require("./scanner/scanner");
const path = require("path");

// Chemins
const repoPath = "/Users/yasmine/Downloads/PBLCare-Admin-ART_Code-Updates 3";
const outputPath = path.join(__dirname, "./data/tree.json");

// Lancement du scanner
(async () => {
    const scanner = new CodeScanner(repoPath);
    const result = await scanner.scan();

    if (result.success) {
        scanner.saveResults(outputPath);
        console.log("\n📊 Résumé:");
        console.log(`   - Fichiers analysés: ${result.filesCount}`);
        console.log(`   - Sortie: ${outputPath}`);
    } else {
        console.error("\n❌ Erreur:", result.error);
        process.exit(1);
    }
})();