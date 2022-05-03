"use strict";
var swcHelpers = require("@swc/helpers");
var joiful = swcHelpers.interopRequireWildcard(require("joiful"));
var Schema = function Schema() {
    "use strict";
    swcHelpers.classCallCheck(this, Schema);
};
swcHelpers.__decorate([
    joiful.string().guid().required(),
    swcHelpers.__metadata("design:type", String)
], Schema.prototype, "id", void 0);
