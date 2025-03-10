"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLongestCommonSubsequenceLength = exports.removeReferencePrefix = exports.formatLabelsToCompletionItems = void 0;
const vscode_languageserver_1 = require("vscode-languageserver");
/** Create a completion item from label strings. */
function formatLabelsToCompletionItems(labels, startOffset, length, document) {
    return labels.map(label => {
        let item = vscode_languageserver_1.CompletionItem.create(label);
        item.kind = vscode_languageserver_1.CompletionItemKind.Class;
        let range = vscode_languageserver_1.Range.create(document.positionAt(startOffset), document.positionAt(startOffset + length));
        item.textEdit = vscode_languageserver_1.TextEdit.replace(range, label);
        return item;
    });
}
exports.formatLabelsToCompletionItems = formatLabelsToCompletionItems;
/** From `.a-b` and parent `.a`, get `&-b`. */
function removeReferencePrefix(label, parentMainNames) {
    let unPrefixedLabels = [];
    for (let parentMainName of parentMainNames) {
        if (label.startsWith(parentMainName)) {
            let unPrefixedLabel = label.slice(parentMainName.length);
            if (unPrefixedLabel.length > 0) {
                unPrefixedLabels.push('&' + unPrefixedLabel);
            }
        }
    }
    return unPrefixedLabels;
}
exports.removeReferencePrefix = removeReferencePrefix;
/** Get longest common subsequence length of two paths. */
function getLongestCommonSubsequenceLength(a, b) {
    let m = a.length;
    let n = b.length;
    let len = Math.min(m, n);
    for (let i = 0; i < len; i++) {
        if (a[i] !== b[i]) {
            return i;
        }
    }
    return len;
}
exports.getLongestCommonSubsequenceLength = getLongestCommonSubsequenceLength;
//# sourceMappingURL=utils.js.map