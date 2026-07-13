const { getFileType } = require("./fileScanner");

/**
 * Construit un arbre hiérarchique des fichiers
 * @param {Array} files - Liste des fichiers
 * @param {string} basePath - Chemin de base pour les chemins relatifs
 * @returns {Object} Arbre hiérarchique
 */
function buildTree(files, basePath) {
    const tree = {};

    files.forEach(file => {
        const relative = file.replace(basePath + "/", "").replace(basePath, "");
        const parts = relative.split("/");

        let current = tree;

        parts.forEach((part, index) => {
            const isFile = index === parts.length - 1;

            if (!current[part]) {
                current[part] = isFile ? {
                    type: getFileType(part),
                    path: file
                } : {};
            }

            current = current[part];
        });
    });

    return tree;
}

/**
 * Construit un arbre avec métadonnées enrichies
 * @param {Array} files - Liste des fichiers
 * @param {string} basePath - Chemin de base
 * @param {Object} metadata - Métadonnées par fichier
 * @returns {Object} Arbre enrichi
 */
function buildEnrichedTree(files, basePath, metadata = {}) {
    const tree = buildTree(files, basePath);
    
    // Enrichissement des nœuds fichiers avec métadonnées
    Object.keys(metadata).forEach(filePath => {
        const relative = filePath.replace(basePath + "/", "").replace(basePath, "");
        const parts = relative.split("/");
        
        let current = tree;
        for (let i = 0; i < parts.length - 1; i++) {
            current = current[parts[i]];
        }
        
        if (current) {
            const lastPart = parts[parts.length - 1];
            current[lastPart] = {
                ...current[lastPart],
                ...metadata[filePath]
            };
        }
    });
    
    return tree;
}

module.exports = {
    buildTree,
    buildEnrichedTree
};
