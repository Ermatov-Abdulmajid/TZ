"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextScanner = void 0;
class TextScanner {
    document;
    text;
    index;
    startIndex;
    endIndex;
    startText;
    constructor(document, cursorOffset, readLeft = 1024, readRight = 1024) {
        this.document = document;
        this.text = document.getText();
        // Assume `ABC|`, cursor in offset 3, it's related character should be `C`, which in index 2.
        this.index = Math.max(cursorOffset - 1, 0);
        this.startIndex = Math.max(this.index - readLeft, 0);
        this.endIndex = Math.min(this.index + readRight, this.text.length);
        this.startText = this.text.slice(this.startIndex, this.endIndex);
    }
    /**
     * Match a regexp sequence, each one should include some sub matches,
     * and cursor must between one of the sub matches.
     * Note that at most time each regexp should be in global mode.
     */
    match(...reSequence) {
        let subText = this.startText;
        let startIndex = this.startIndex;
        let m;
        let groups = {};
        for (let re of reSequence) {
            let nextSubText = null;
            while (m = re.exec(subText)) {
                let matchStartIndex = m.index + startIndex;
                let matchEndIndex = matchStartIndex + m[0].length;
                // Cursor in the match range.
                // |A, if cursor is here, match A (in this.index + 1 ~ this.index + 2) will also can match.
                if (matchStartIndex <= this.index + 1 && matchEndIndex > this.index) {
                    if (m.groups) {
                        Object.assign(groups, m.groups);
                    }
                    let result = this.guessSubMatch(m, matchStartIndex);
                    if (result) {
                        nextSubText = result.text;
                        startIndex = result.index;
                    }
                    break;
                }
                else if (matchStartIndex > this.index + 1) {
                    break;
                }
                if (!re.global) {
                    break;
                }
            }
            subText = nextSubText;
            if (!subText) {
                break;
            }
        }
        if (!subText) {
            return null;
        }
        return { text: subText, index: startIndex, groups };
    }
    /**
     * Guess the global index of the sub match which include current cursor index.
     * Should note this is not 100% correct, it can only ensure to get a not bad result.
     * JS doesn't support capturing indices for sub matches, must implement one if truly needed.
     *
     * An issue:
     * <tag id|="id">, `|` is where cursor at.
     * Press F12, it cause goto css definition `#id`.
     */
    guessSubMatch(m, matchStartIndex) {
        let fullMatch = m[0];
        let groupValues = m.groups ? Object.values(m.groups) : [];
        // Exclude all group matches.
        for (let i = 1; i < m.length; i++) {
            let subMatch = m[i];
            if (!subMatch) {
                continue;
            }
            if (groupValues.includes(subMatch)) {
                continue;
            }
            let subMatchStartIndex = this.searchEachSubMatch(fullMatch, subMatch, matchStartIndex);
            if (subMatchStartIndex !== null) {
                return {
                    text: subMatch,
                    index: subMatchStartIndex,
                };
            }
        }
        // If doesn't find one, not exclude group matches.
        for (let i = 1; i < m.length; i++) {
            let subMatch = m[i];
            if (!subMatch) {
                continue;
            }
            let subMatchStartIndex = this.searchEachSubMatch(fullMatch, subMatch, matchStartIndex);
            if (subMatchStartIndex !== null) {
                return {
                    text: subMatch,
                    index: subMatchStartIndex,
                };
            }
        }
        return null;
    }
    searchEachSubMatch(fullMatch, subMatch, matchStartIndex) {
        for (let index of this.searchSubString(fullMatch, subMatch)) {
            let subMatchStartIndex = index + matchStartIndex;
            let subMatchEndIndex = subMatchStartIndex + subMatch.length;
            if (subMatchStartIndex <= this.index + 1 && subMatchEndIndex > this.index) {
                return subMatchStartIndex;
            }
            else if (subMatchStartIndex > this.index + 1) {
                break;
            }
        }
        return null;
    }
    *searchSubString(s, sub) {
        let lastIndex = 0;
        let nextIndex;
        while ((nextIndex = s.indexOf(sub, lastIndex)) > -1) {
            yield nextIndex;
            lastIndex = nextIndex + sub.length;
        }
    }
}
exports.TextScanner = TextScanner;
//# sourceMappingURL=text-scanner.js.map