//// [typeGuardOfFormThisMember.ts]
// There's a 'File' class in the stdlib, wrap with a namespace to avoid collision
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _instanceof from "@swc/helpers/src/_instanceof.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var Test;
(function(Test) {
    var FileSystemObject = /*#__PURE__*/ function() {
        "use strict";
        function FileSystemObject(path) {
            _class_call_check(this, FileSystemObject);
            this.path = path;
        }
        _create_class(FileSystemObject, [
            {
                key: "isFile",
                get: function get() {
                    return _instanceof(this, File);
                },
                set: function set(param) {
                // noop
                }
            },
            {
                key: "isDirectory",
                get: function get() {
                    return _instanceof(this, Directory);
                }
            }
        ]);
        return FileSystemObject;
    }();
    Test.FileSystemObject = FileSystemObject;
    var File = /*#__PURE__*/ function(FileSystemObject) {
        "use strict";
        _inherits(File, FileSystemObject);
        var _super = _create_super(File);
        function File(path, content) {
            _class_call_check(this, File);
            var _this;
            _this = _super.call(this, path);
            _this.content = content;
            return _this;
        }
        return File;
    }(FileSystemObject);
    Test.File = File;
    var Directory = /*#__PURE__*/ function(FileSystemObject) {
        "use strict";
        _inherits(Directory, FileSystemObject);
        var _super = _create_super(Directory);
        function Directory() {
            _class_call_check(this, Directory);
            return _super.apply(this, arguments);
        }
        return Directory;
    }(FileSystemObject);
    Test.Directory = Directory;
    var file = new File("foo/bar.txt", "foo");
    file.isNetworked = false;
    file.isFSO = file.isFile;
    file.isFile = true;
    var x = file.isFile;
    if (file.isFile) {
        file.content;
        if (file.isNetworked) {
            file.host;
            file.content;
        }
    } else if (file.isDirectory) {
        file.children;
    } else if (file.isNetworked) {
        file.host;
    }
    var guard;
    if (guard.isLeader) {
        guard.lead();
    } else if (guard.isFollower) {
        guard.follow();
    }
    var general;
    if (general.isMoreSpecific) {
        general.do();
    }
})(Test || (Test = {}));
