"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportPath = void 0;
const vscode_languageserver_1 = require("vscode-languageserver");
const vscode_uri_1 = require("vscode-uri");
class ImportPath {
    document;
    path;
    startIndex;
    endIndex;
    constructor(path, startIndex, endIndex, document) {
        this.document = document;
        this.path = path;
        this.startIndex = startIndex;
        this.endIndex = endIndex;
    }
    toRange() {
        return vscode_languageserver_1.Range.create(this.document.positionAt(this.startIndex), this.document.positionAt(this.endIndex));
    }
    toLocationLink() {
        let uri = vscode_uri_1.URI.file(this.path).toString();
        let targetRange = vscode_languageserver_1.Range.create(0, 0, 0, 0);
        let selectionRange = targetRange;
        let fromRange = this.toRange();
        return vscode_languageserver_1.LocationLink.create(uri, targetRange, selectionRange, fromRange);
    }
}
exports.ImportPath = ImportPath;
//# sourceMappingURL=import-path.js.map