const { scanDirectory } = require("./fileScanner");
const { analyzePHP } = require("./phpAnalyzer");
const { buildGraph } = require("./generateGraph");
const { detectFeature } = require("./featureAnalyzer");
const path = require("path");
const fs = require("fs");

const repoPath =
"/Users/yasmine/Downloads/PBLCare-Admin-ART_Code-Updates 3";

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


fs.writeFileSync(
    "../../data/graph.json",
    JSON.stringify(graph, null, 2)
);


console.log("✅ graph.json généré");