//// [npm-install.js]
function Installer() {
    this.args = 0;
}
Installer.prototype.loadArgMetadata = function(next) {
    var _this = this;
    // ArrowFunction isn't treated as a this-container
    (function(args) {
        _this.args = 'hi';
        _this.newProperty = 1;
    });
};
var i = new Installer();
i.newProperty = i.args // ok, number ==> number | undefined
;
