"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startValidatationOnSaveHandler = exports.startValidation = void 0;
const vscode = require("vscode");
const utils_1 = require("./utils");
const ValidationFile_1 = require("./ValidationFile");
/**
 * This is the main method of the extension, it make a request to the W3C API and
 * analyse the response.
 */
const startValidation = (activeFileNotValidWarning = true) => {
    var _a;
    const document = (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document;
    //Check if file is valid
    //Only suport HTML and CSS files for the moment
    if (!utils_1.activeFileIsValid(document, activeFileNotValidWarning))
        return;
    if (!document)
        return;
    new ValidationFile_1.ValidationFile(document).startValidation();
};
exports.startValidation = startValidation;
/**
 * Called everytime a file is saved in vscode
 * @param context extension context
 */
const startValidatationOnSaveHandler = () => {
    var _a;
    if (!utils_1.activeFileIsValid((_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document, false))
        return;
    if (vscode.workspace.getConfiguration('webvalidator').validateOnSave == false)
        return;
    exports.startValidation(false);
};
exports.startValidatationOnSaveHandler = startValidatationOnSaveHandler;
//# sourceMappingURL=validation.js.map