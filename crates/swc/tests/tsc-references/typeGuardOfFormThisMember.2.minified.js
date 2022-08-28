//// [typeGuardOfFormThisMember.ts]
var Test;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _instanceof from "@swc/helpers/src/_instanceof.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
!function(Test) {
    var guard, general, FileSystemObject = function() {
        "use strict";
        function FileSystemObject(path) {
            _class_call_check(this, FileSystemObject), this.path = path;
        }
        return _create_class(FileSystemObject, [
            {
                key: "isFile",
                get: function() {
                    return _instanceof(this, File);
                },
                set: function(param) {}
            },
            {
                key: "isDirectory",
                get: function() {
                    return _instanceof(this, Directory);
                }
            }
        ]), FileSystemObject;
    }();
    Test.FileSystemObject = FileSystemObject;
    var File = function(FileSystemObject) {
        "use strict";
        _inherits(File, FileSystemObject);
        var _super = _create_super(File);
        function File(path, content) {
            var _this;
            return _class_call_check(this, File), (_this = _super.call(this, path)).content = content, _this;
        }
        return File;
    }(FileSystemObject);
    Test.File = File;
    var Directory = function(FileSystemObject) {
        "use strict";
        _inherits(Directory, FileSystemObject);
        var _super = _create_super(Directory);
        function Directory() {
            return _class_call_check(this, Directory), _super.apply(this, arguments);
        }
        return Directory;
    }(FileSystemObject);
    Test.Directory = Directory;
    var file = new File("foo/bar.txt", "foo");
    file.isNetworked = !1, file.isFSO = file.isFile, file.isFile = !0, file.isFile, file.isFile ? (file.content, file.isNetworked && (file.host, file.content)) : file.isDirectory ? file.children : file.isNetworked && file.host, guard.isLeader ? guard.lead() : guard.isFollower && guard.follow(), general.isMoreSpecific && general.do();
}(Test || (Test = {}));
