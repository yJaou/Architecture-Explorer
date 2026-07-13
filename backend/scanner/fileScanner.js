const fs = require("fs");
const path = require("path");

function scanDirectory(dir, files = []) {
    const entries = fs.readdirSync(dir);

    for (const entry of entries) {

        const fullPath = path.join(dir, entry);

        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            scanDirectory(fullPath, files);
        } else {
            files.push({
                path: fullPath,
                size: stat.size
            });
        }
    }

    return files;
}

module.exports = {
    scanDirectory
};