"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLScanner = void 0;
const file_1 = require("../../helpers/file");
const import_path_1 = require("../common/import-path");
const simple_selector_1 = require("../common/simple-selector");
const text_scanner_1 = require("../common/text-scanner");
const path = require("path");
const vscode_uri_1 = require("vscode-uri");
/*
in fact there is an easier way to do so, only about 20 lines of codes, but should be a little slower:
    1. get 1024 bytes in left.
    2. match /.*(?:(?:class\s*=\s*")(?<class>[\s\w-]*)|(?:id\s*=\s*")(?<id>[\w-]*)|<(?<tag>[\w-]+))$/s.
        .* - match any character in s flag, greedy mode, eat up all characters
        (?:
            (?:class\s*=\s*") - match class
            (?
                <class>
                [\s\w-]* - match multiple class name, can't use [\s\w-]*?[\w-]* to match, its already in greedy mode since above, another greedy expression will not work, here [\w-]* will match nothing
            )
            |
            (?:id\s*=\s*")(?<id>[\w-]*) - match id
            |
            <(?<tag>[\w-]+) - match tag
        )
        $
    3. for class, select /([\w-]+)$/.
    4. read word in right, or slice 128 bytes in right, and match /^([\w-]+)/.
    5. join left and right part.
*/
class HTMLScanner extends text_scanner_1.TextScanner {
    /** Scan a HTML document from a specified offset to find a CSS selector. */
    scanForSelector() {
        // <tag...>
        let match = this.match(/<([\w-]+)/g);
        if (match) {
            let selector = simple_selector_1.SimpleSelector.create(match.text, match.index, this.document);
            return selector;
        }
        // <tag
        // 	 id="a'
        // 	 class="a"
        // 	 class="a b"
        // >
        match = this.match(/<[\w-]+\s*([\s\S]*?)>/g, /(?<type>id|class)\s*=\s*['"](.*?)['"]/g, /([\w-]+)/g);
        if (match) {
            if (match.groups.type === 'id') {
                return simple_selector_1.SimpleSelector.create('#' + match.text, match.index, this.document);
            }
            else if (match.groups.type === 'class') {
                return simple_selector_1.SimpleSelector.create('.' + match.text, match.index, this.document);
            }
        }
        return null;
    }
    /** Scan for relative import path. */
    async scanForImportPath() {
        let match = this.match(/<(?<tag>[\w-]+)(\s*[\s\S]*?)>/g);
        if (match) {
            let tag = match.groups.tag;
            let linkStyleRE = /\brel\s*=\s*['"]stylesheet['"]/;
            let srcRE = /\bsrc\s*=['"](.*?)['"]/;
            let hrefRE = /\bhref\s*=['"](.*?)['"]/;
            let subMatch = null;
            let importPath = null;
            if (tag === 'link' && linkStyleRE.test(match.text)) {
                subMatch = match.text.match(hrefRE);
            }
            if (tag === 'style') {
                subMatch = match.text.match(srcRE);
            }
            if (subMatch) {
                let currentPath = path.dirname(vscode_uri_1.URI.parse(this.document.uri).fsPath);
                importPath = await (0, file_1.resolveImportPath)(currentPath, subMatch[1]);
            }
            if (importPath) {
                let startIndex = match.index + subMatch.index;
                let endIndex = startIndex + subMatch[1].length;
                return new import_path_1.ImportPath(importPath, startIndex, endIndex, this.document);
            }
        }
        return null;
    }
}
exports.HTMLScanner = HTMLScanner;
//# sourceMappingURL=html-scanner.js.map