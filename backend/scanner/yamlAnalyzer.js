const fs = require("fs");

/**
 * Analyse les fichiers YAML
 * @param {string} filePath - Chemin du fichier YAML
 * @returns {Object} Métadonnées du fichier
 */
function analyzeYAML(filePath) {
    try {
        const content = fs.readFileSync(filePath, "utf8");
        
        // Extraction des clés principales (simples regex, pas de parsing complet YAML)
        const keyMatches = content.match(/^\s*(\w+):\s*/gm) || [];
        const keys = keyMatches.map(m => m.trim().slice(0, -1));
        
        // Détection de la structure (liste ou dictionnaire)
        const isList = content.includes("- ");
        
        // Extraction des sections
        const sections = content.split(/^[\w]/m).filter(s => s.trim());
        
        return {
            type: "yaml",
            keys: keys,
            isList: isList,
            sections: sections.length,
            size: content.length,
            lines: content.split("\n").length,
            content: content
        };
    } catch (error) {
        console.error(`Erreur analyse YAML ${filePath}:`, error.message);
        return { type: "yaml", error: error.message };
    }
}

module.exports = {
    analyzeYAML
};
