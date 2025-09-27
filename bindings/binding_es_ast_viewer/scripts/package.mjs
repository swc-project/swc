import fs from "node:fs/promises";

const pkgJsonFile = await fs.readFile("pkg/package.json", "utf8");
const pkgJson = JSON.parse(pkgJsonFile);
pkgJson.name = "@swc/es-ast-viewer";
pkgJson.type = "module";
pkgJson.files.push("es_ast_viewer_node.js");
pkgJson.exports = {
    types: "./es_ast_viewer.d.ts",
    node: "./es_ast_viewer_node.js",
    default: "./es_ast_viewer.js",
};

await Promise.all([
    fs.cp("src/es_ast_viewer_node.js", "pkg/es_ast_viewer_node.js"),
    fs.writeFile("pkg/package.json", JSON.stringify(pkgJson, null, 2)),
]);
