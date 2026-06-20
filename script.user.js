// ==UserScript==
// @name         YouTube Live Chat - Ultra Fast Reply
// @namespace    http://tampermonkey.net
// @version      2.0
// @description  Instantly inserts a username into the YouTube live chat input field when clicking on their name.
// @author       Darkness-83 (with AI)
// @match        https://*.youtube.com/*
// @run-at       document-end
// @grant        none
// @license      GPL-3.0
// ==/UserScript==

(function() {
    'use strict';

    function insertUserTag(authorName) {
        const inputContainer = document.querySelector('#input.yt-live-chat-text-input-field-renderer, #textarea, [contenteditable="true"]');
        if (!inputContainer) return;

        const tag = authorName.startsWith('@') ? authorName + '\u00A0' : '@' + authorName + '\u00A0';
        inputContainer.focus();

        if (inputContainer.firstChild) {
            inputContainer.firstChild.textContent = tag + inputContainer.firstChild.textContent;
        } else {
            inputContainer.textContent = tag;
        }

        try {
            const range = document.createRange();
            const sel = window.getSelection();
            const textNode = inputContainer.firstChild || inputContainer;
            range.setStart(textNode, tag.length);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        } catch (err) {
            console.error("Cursor error:", err);
        }

        inputContainer.dispatchEvent(new InputEvent('input', { bubbles: true, cancelable: true, inputType: 'insertText', data: tag }));
        inputContainer.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
    }

    document.addEventListener('click', function(e) {
        const authorElement = e.target.closest('#author-name, .yt-live-chat-author-chip');
        if (authorElement) {
            const authorName = authorElement.textContent.trim();
            if (authorName) {
                e.preventDefault();
                e.stopPropagation();
                insertUserTag(authorName);
            }
        }
    }, true);
})();
