const path = require("path");


function buildGraph(analysis, repoPath) {


    const nodes = analysis.map(file => ({

        id: path.relative(repoPath, file.path),

        name: file.name,

        type: file.language,

        feature: file.feature,

        classes: file.classes,

        functions: file.functions,

        imports: file.imports

    }));



    const links = [];



    analysis.forEach(file => {


        file.imports.forEach(importItem => {


            links.push({

                source: path.relative(repoPath, file.path),

                target: path.relative(repoPath, importItem.path),

                type: importItem.type

            });


        });


    });



    return {

        nodes,

        links

    };

}



module.exports = {
    buildGraph
};