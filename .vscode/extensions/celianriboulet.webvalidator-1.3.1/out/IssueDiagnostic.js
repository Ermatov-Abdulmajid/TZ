"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const utils = require("./utils");
const ValidationStatusBarItem_1 = require("./ValidationStatusBarItem");
/**
 * Class that contain a vscode.diagnostic and its correponding line's range with the
 * original content of this same line
 * - The line content is used for the auto clear feature, as it is compared with the actual content of this same line
 * @constructor Create an instance with one issue that come from the request of the API
 */
class IssueDiagnostic {
    /**
     * Create a new issue diagnostic from a issue message
     * @param message the message containing all the related data of the issue
     * @param document the document on which the diagnostic is created
     */
    constructor(message, document) {
        const lineRange = utils.getLineRange(message.lastLine, document);
        this.diagnostic = IssueDiagnostic.getVSCodeDiagnosticFromMessage(message);
        this.lineRange = lineRange;
        this.lineIntialContent = document.getText(lineRange);
        if (!IssueDiagnostic.isHiddenMessage(this.diagnostic)) {
            IssueDiagnostic.issueDiagnostics.push(this);
        }
    }
    /**
     * Decide if a message should be hidden from the user
     */
    static isHiddenMessage(diagnostic) {
        const hideInformationMessage = !vscode.workspace.getConfiguration('webvalidator').showInfo && diagnostic.severity == vscode.DiagnosticSeverity.Information;
        const hideWarningMessage = !vscode.workspace.getConfiguration('webvalidator').showWarning && diagnostic.severity == vscode.DiagnosticSeverity.Warning;
        return hideInformationMessage || hideWarningMessage;
    }
    /**
     * Clear all the diagnostics on the workspace that are related to the validation
     */
    static clearAllVSCodeDiagnostics() {
        IssueDiagnostic.issueDiagnostics = [];
        IssueDiagnostic.vscodeDiagnostics.clear();
    }
    /**
     * Clear all the error diagnostics on the worspace that are related to the validation
     */
    static clearVSCodeErrorsDiagnostics() {
        IssueDiagnostic.issueDiagnostics = IssueDiagnostic.issueDiagnostics
            .filter(d => d.diagnostic.severity === vscode.DiagnosticSeverity.Error);
    }
}
exports.default = IssueDiagnostic;
/**
 * All registed IssueDiagnostic (This class)
 */
IssueDiagnostic.issueDiagnostics = [];
/**
 * All registered vscode diagnostics
 */
IssueDiagnostic.vscodeDiagnostics = vscode.languages.createDiagnosticCollection('w3c_validation_collection');
/**
 * Create a vscode diagnostic from a message
 * @param  message the message from which the diagnostic will be created
 * @return diagnostic object
 */
IssueDiagnostic.getVSCodeDiagnosticFromMessage = (message) => {
    let severity = vscode.DiagnosticSeverity.Information;
    switch (message.type) {
        case 'error':
            severity = vscode.DiagnosticSeverity.Error;
            break;
        case 'info':
            severity = vscode.DiagnosticSeverity.Information;
            break;
        case 'warning':
            severity = vscode.DiagnosticSeverity.Warning;
            break;
    }
    const diagnostic = new vscode.Diagnostic(utils.getMessageRange(message), message.message, severity);
    diagnostic.code = 'W3C_validation';
    diagnostic.source = message.type;
    return diagnostic;
};
/**
 * Refresh the diagnostics on the active text editor by reading the content of
 * the issueDiagnosticList array.
 * This is called on every changes in the active text editor.
 * @returns true if there si no diagnostics left on the document
 */
IssueDiagnostic.refreshWindowDiagnostics = () => {
    return new Promise((resolve, reject) => {
        if (!vscode.window.activeTextEditor) {
            reject();
            return; // return for ts type check
        }
        //Clearing window's diagnostic
        IssueDiagnostic.vscodeDiagnostics.clear();
        const diagnostics = [];
        //Auto clear diagnostic on page :
        //For each registered diagnostic in the issueDiagnostic list
        IssueDiagnostic.issueDiagnostics.forEach(element => {
            var _a;
            //We first check if the line of this diagnostic has changed
            //So we compare the initial content of the diagnostic's line with the actual content.
            const currentLineContent = (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document.getText(element.lineRange);
            if (element.lineIntialContent !== currentLineContent) {
                IssueDiagnostic.issueDiagnostics.splice(IssueDiagnostic.issueDiagnostics.indexOf(element), 1);
            }
            else {
                //In case the line has no changes, that means we should keep this diagnostic on page.
                diagnostics.push(element.diagnostic);
            }
        });
        //Adding all remaining diagnostics to page.
        IssueDiagnostic.vscodeDiagnostics.set(vscode.window.activeTextEditor.document.uri, diagnostics);
        resolve(diagnostics.length === 0);
    });
};
/**
 * This method clear all diagnostic on window and in the issueDiagnosticList array
 * @param onlyWarning set to true if only warnings should be cleared
 * @param editorMessages set to false if no message should be displayed in the editor
 */
IssueDiagnostic.clearDiagnostics = (onlyWarning = false) => {
    if (onlyWarning) {
        IssueDiagnostic.clearVSCodeErrorsDiagnostics();
        IssueDiagnostic.refreshWindowDiagnostics().then(allCleared => {
            ValidationStatusBarItem_1.default.clearValidationItem.updateVisibility(!allCleared);
        });
    }
    else {
        IssueDiagnostic.clearAllVSCodeDiagnostics();
        ValidationStatusBarItem_1.default.clearValidationItem.updateVisibility(false);
    }
};
/**
 * This method create a new list referenced with the global array issueDiagnosticList from
 * the response of the post request to the W3C API
 * @param requestMessages the response from the W3C API
 * @param document the actual document
 * @param showNotif show the popup in lower right corner
 */
IssueDiagnostic.createDiagnostics = (requestMessages, document, showNotif = true) => __awaiter(void 0, void 0, void 0, function* () {
    //The list (global variable issueDiagnosticList) is cleared before all.
    //The goal here is to create or recreate the content of the list.
    IssueDiagnostic.clearDiagnostics(false);
    let errorCount = 0;
    let warningCount = 0;
    let infoCount = 0;
    //For each request response, we create a new instance of the IssueDiagnostic class
    //We also count the warning and error count, ot will then be displayed.
    requestMessages.forEach(element => {
        if (element.type === 'error')
            errorCount++;
        else if (element.type === 'info')
            infoCount++;
        else
            warningCount++;
        new IssueDiagnostic(element, document);
    });
    //We now refresh the diagnostics on the current text editor with
    //the list that is now refilled correctly with the informations of the request
    IssueDiagnostic.refreshWindowDiagnostics().then(allCleared => {
        ValidationStatusBarItem_1.default.clearValidationItem.updateVisibility(!allCleared);
    });
    if (showNotif) {
        const infoMessage = vscode.workspace.getConfiguration('webvalidator').showInfo ? `, ${infoCount} infos)` : '';
        const warningMessage = vscode.workspace.getConfiguration('webvalidator').showWarning ? `, ${warningCount} warnings` : '';
        const selection = yield vscode.window.showErrorMessage(`This ${document.languageId.toUpperCase()} document is not valid. (${errorCount} errors${warningMessage}${infoMessage}`, ...(warningCount > 0 ? ['Clear all', 'Clear warnings'] : ['Clear all']));
        if (selection === 'Clear all')
            IssueDiagnostic.clearDiagnostics();
        else if (selection === 'Clear warnings')
            IssueDiagnostic.clearDiagnostics(true);
    }
});
//# sourceMappingURL=IssueDiagnostic.js.map