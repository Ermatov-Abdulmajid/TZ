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
exports.ValidationFile = void 0;
const https = require("https");
const vscode = require("vscode");
const axios_1 = require("axios");
const IssueDiagnostic_1 = require("./IssueDiagnostic");
const ValidationStatusBarItem_1 = require("./ValidationStatusBarItem");
const W3C_API_URL = 'https://validator.w3.org/nu/?out=json';
class ValidationFile {
    constructor(document) {
        this.handleW3CMessages = (messages) => {
            const showNotif = vscode.workspace.getConfiguration('webvalidator').validationNotification;
            if (messages.length == 0) {
                showNotif && vscode.window.showInformationMessage(`This ${this.document.languageId.toUpperCase()} file is valid !`);
                ValidationStatusBarItem_1.default.validationItem.updateContent('File is valid');
                setTimeout(() => ValidationStatusBarItem_1.default.validationItem.updateContent(), 2000);
                return;
            }
            if (this.isPartialHTML)
                this.removePartialHTMLHeader(messages);
            IssueDiagnostic_1.default.createDiagnostics(messages, this.document, showNotif);
            ValidationStatusBarItem_1.default.clearValidationItem.updateVisibility(true);
            ValidationStatusBarItem_1.default.validationItem.updateContent();
        };
        this.fetchW3CValidation = () => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            let content = this.content;
            if (this.isPartialHTML)
                content = yield this.addPartialHTMLStructure();
            try {
                return yield axios_1.default.post(W3C_API_URL, content, {
                    headers: { 'Content-type': `text/${this.document.languageId.toLowerCase()}; charset=utf-8` },
                    httpsAgent: new https.Agent({ rejectUnauthorized: false })
                });
            }
            catch (error) {
                if (((_a = error) === null || _a === void 0 ? void 0 : _a.code) == 'ENOTFOUND') {
                    vscode.window.showErrorMessage('W3C service not reachable, please check your internet connection.');
                    return null;
                }
                if (((_c = (_b = error) === null || _b === void 0 ? void 0 : _b.response) === null || _c === void 0 ? void 0 : _c.status) === 503) { // W3C down (probably)
                    vscode.window.showErrorMessage('W3C service currently unavailable. Please retry later...');
                    return null;
                }
                vscode.window.showErrorMessage('W3C Validation : an error occured.');
                return null;
            }
        });
        this.document = document;
        this.partialHeaderAddedLines = 0;
        this.isPartialHTML = false;
        this.checkForPartialHTML();
    }
    get content() {
        return this.document.getText();
    }
    startValidation() {
        return __awaiter(this, void 0, void 0, function* () {
            ValidationStatusBarItem_1.default.validationItem.updateContent('Loading', '$(sync~spin)');
            IssueDiagnostic_1.default.clearDiagnostics(false);
            const w3cResponse = yield vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'W3C validation ...',
                cancellable: false,
            }, this.fetchW3CValidation);
            if (w3cResponse == null) {
                ValidationStatusBarItem_1.default.validationItem.updateContent();
                return;
            }
            console.log(w3cResponse.data);
            const messages = w3cResponse.data.messages;
            if (messages == null) {
                vscode.window.showErrorMessage('Error : incorrect response from W3C...');
                return;
            }
            this.handleW3CMessages(messages);
        });
    }
    checkForPartialHTML() {
        if (this.document.languageId.toUpperCase() !== 'HTML')
            return;
        this.isPartialHTML = !this.content.startsWith('<!DOCTYPE html');
    }
    addPartialHTMLStructure() {
        return __awaiter(this, void 0, void 0, function* () {
            const completeHeader = `
		<!DOCTYPE html>
		<html lang="en">
		<head>
		<title>Partial HTML Document</title>
		</head>
		<body>`;
            const completeFooter = '</body>\n</html>';
            this.partialHeaderAddedLines = completeHeader.split('\n').length;
            let processedContent = this.content.trim();
            if (this.content.startsWith('<body>') && this.content.endsWith('</body>')) {
                this.partialHeaderAddedLines -= 1; // Removed body tag
                processedContent = this.content.substring(6, this.content.length - 7).trim();
            }
            return `${completeHeader}
				${processedContent}
				${completeFooter}`;
        });
    }
    removePartialHTMLHeader(messages) {
        const maxLines = this.document.lineCount;
        messages.forEach((message) => {
            message.lastLine -= this.partialHeaderAddedLines;
            if (message.firstLine < 0)
                message.firstLine = 0;
            if (message.firstLine > maxLines)
                message.firstLine = maxLines;
            if (message.lastLine < 0)
                message.lastLine = 0;
            if (message.lastLine > maxLines)
                message.lastLine = maxLines;
        });
    }
}
exports.ValidationFile = ValidationFile;
//# sourceMappingURL=ValidationFile.js.map