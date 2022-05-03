import * as swcHelpers from "@swc/helpers";
export var AccountMemberView = function AccountMemberView() {
    "use strict";
    swcHelpers.classCallCheck(this, AccountMemberView);
};
swcHelpers.__decorate([
    ViewColumn({
        name: "tmcode"
    }),
    typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Number)
], AccountMemberView.prototype, "memberId", void 0);
swcHelpers.__decorate([
    ViewColumn({
        name: "mid"
    }),
    typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", String)
], AccountMemberView.prototype, "mallId", void 0);
swcHelpers.__decorate([
    ViewColumn({
        name: "accea"
    }),
    typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Number)
], AccountMemberView.prototype, "allowAccountCnt", void 0);
swcHelpers.__decorate([
    ViewColumn({
        name: "qaccea"
    }),
    typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Number)
], AccountMemberView.prototype, "allowQuickAccountCnt", void 0);
swcHelpers.__decorate([
    ViewColumn({
        name: "endday"
    }),
    typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", typeof Date === "undefined" ? Object : Date)
], AccountMemberView.prototype, "accountEnddedAt", void 0);
swcHelpers.__decorate([
    ViewColumn({
        name: "quick_endday"
    }),
    typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", typeof Date === "undefined" ? Object : Date)
], AccountMemberView.prototype, "accountQuickEnddedAt", void 0);
swcHelpers.__decorate([
    ViewColumn(),
    typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Number)
], AccountMemberView.prototype, "accountCnt", void 0);
swcHelpers.__decorate([
    ViewColumn(),
    typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Number)
], AccountMemberView.prototype, "accountQuickCnt", void 0);
