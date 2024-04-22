//// [chrome-devtools-DOMExtension.js]
Event.prototype.removeChildren = function() {
    this.textContent = 'nope, not going to happen';
};
