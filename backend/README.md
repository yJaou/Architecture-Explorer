# Architecture du Backend

## Structure

```
backend/
├── scanner/              # Module de scanning et analyse
│   ├── scanner.js       # Classe principale CodeScanner
│   ├── fileScanner.js   # Scan récursif des répertoires
│   ├── phpAnalyzer.js   # Analyse des fichiers PHP
│   ├── pythonAnalyzer.js # Analyse des fichiers Python
│   ├── yamlAnalyzer.js  # Analyse des fichiers YAML
│   └── graphBuilder.js  # Construction de l'arborescence
├── api/                 # Routes et endpoints API
│   └── routes.js       # Définition des routes
├── data/               # Données générées
│   └── tree.json      # Résultat du scan
├── scanner.js         # Point d'entrée principal
└── package.json       # Dépendances
```

## Utilisation

### Scanner en ligne de commande
```bash
node scanner.js
```

Cela générera `data/tree.json` avec l'arborescence complète du répertoire scanné.

### Utiliser le CodeScanner dans votre code
```javascript
const { CodeScanner } = require("./scanner/scanner");

const scanner = new CodeScanner("/chemin/vers/repo");
const result = await scanner.scan();

// Sauvegarder les résultats
scanner.saveResults("./data/tree.json");
```

## Modules

### fileScanner.js
- `scanDir(dir)` - Scan récursif d'un répertoire
- `getFileType(file)` - Détecte le type de fichier

### phpAnalyzer.js
- `analyzePHP(filePath)` - Extrait classes, fonctions, namespaces

### pythonAnalyzer.js
- `analyzePython(filePath)` - Extrait classes, fonctions, imports, décorateurs

### yamlAnalyzer.js
- `analyzeYAML(filePath)` - Analyse la structure YAML

### graphBuilder.js
- `buildTree(files, basePath)` - Construit l'arborescence simple
- `buildEnrichedTree(files, basePath, metadata)` - Construit l'arborescence avec métadonnées

## API Routes

L'API expose les endpoints suivants (à implémenter):
- `GET /api/scan` - Lance un scan
- `GET /api/tree` - Retourne l'arborescence

## Prochaines étapes

- [ ] Implémenter les endpoints API
- [ ] Ajouter support pour d'autres langages (JavaScript, TypeScript, etc.)
- [ ] Implémenter la mise en cache
- [ ] Ajouter des statistiques détaillées
