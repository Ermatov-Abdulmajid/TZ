"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleSelector = void 0;
const vscode_languageserver_1 = require("vscode-languageserver");
class SimpleSelector {
    /** Selector type. */
    type;
    /** Raw selector string, includes identifier like `.`, `#`. */
    raw;
    /** `.`, `#`, or empty string. */
    identifier;
    /** Selector string exclude identifier. */
    label;
    /** Position of left offset. */
    startIndex;
    /** Text document that current selector attach at. */
    document;
    /** Related imported file, only available for JSX files. */
    importURI;
    constructor(type, raw, identifier, label, startIndex, document, importURI) {
        this.type = type;
        this.raw = raw;
        this.identifier = identifier;
        this.label = label;
        this.startIndex = startIndex;
        this.document = document;
        this.importURI = importURI;
    }
    /** Whether a custom tag. */
    isCustomTag() {
        return this.type === SimpleSelector.Type.Tag && this.label.includes('-');
    }
    /** Get a range from its related document. */
    toRange() {
        return vscode_languageserver_1.Range.create(this.document.positionAt(this.startIndex), this.document.positionAt(this.startIndex + this.raw.length));
    }
}
exports.SimpleSelector = SimpleSelector;
(function (SimpleSelector) {
    /** Selector types. */
    let Type;
    (function (Type) {
        Type[Type["Tag"] = 0] = "Tag";
        Type[Type["Class"] = 1] = "Class";
        Type[Type["Id"] = 2] = "Id";
    })(Type = SimpleSelector.Type || (SimpleSelector.Type = {}));
    /** Create a selector from raw selector string. */
    function create(raw, startOffset = 0, document, importURI = null) {
        if (!validate(raw)) {
            return null;
        }
        let type = getType(raw);
        let label = type === Type.Tag ? raw : raw.slice(1);
        return new SimpleSelector(type, raw, type === Type.Tag ? '' : raw[0], label, startOffset, document, importURI);
    }
    SimpleSelector.create = create;
    /** Get type. */
    function getType(raw) {
        let type = raw[0] === '.' ? Type.Class
            : raw[0] === '#' ? Type.Id
                : Type.Tag;
        return type;
    }
    SimpleSelector.getType = getType;
    /** Whether a string is a valid selector. */
    function validate(raw) {
        return /^[#.]?\w[\w-]*$/i.test(raw);
    }
    SimpleSelector.validate = validate;
})(SimpleSelector || (exports.SimpleSelector = SimpleSelector = {}));
//# sourceMappingURL=simple-selector.js.map