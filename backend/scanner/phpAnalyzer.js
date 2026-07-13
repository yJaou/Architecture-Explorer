const fs = require("fs");
const path = require("path");


function removeComments(content) {

    return content
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\/\/.*$/gm, "")
        .replace(/#.*$/gm, "");

}



function extractClasses(content) {

    const regex = /\bclass\s+([a-zA-Z0-9_]+)/g;

    const classes = [];

    let match;

    while ((match = regex.exec(content)) !== null) {
        classes.push(match[1]);
    }

    return [...new Set(classes)];
}



function extractFunctions(content) {

    const regex = /function\s+([a-zA-Z0-9_]+)/g;

    const functions = [];

    let match;

    while ((match = regex.exec(content)) !== null) {
        functions.push(match[1]);
    }

    return [...new Set(functions)];
}




function extractImports(content, filePath) {

    const regex = /(require_once|require|include_once|include)\s*\(?\s*["'](.+?)["']\s*\)?;/g;

    const imports = [];

    let match;


    while ((match = regex.exec(content)) !== null) {


        const importPath = match[2];


        let resolvedPath = importPath;


        // Si le chemin est relatif, on le résout
        if (
            importPath.startsWith(".") ||
            importPath.includes("/")
        ) {

            resolvedPath = path.resolve(
                path.dirname(filePath),
                importPath
            );

        }


        imports.push({

            type: match[1],

            path: resolvedPath

        });


    }


    return imports;

}





function analyzePHP(filePath) {

    const rawContent = fs.readFileSync(filePath, "utf8");

    const content = removeComments(rawContent);


    return {

        name: path.basename(filePath),

        path: filePath,

        language: "PHP",

        extension: ".php",

        size: Buffer.byteLength(content),

        lines: content.split("\n").length,

        classes: extractClasses(content),

        functions: extractFunctions(content),

        imports: extractImports(content, filePath)

    };

}



module.exports = {
    analyzePHP
};