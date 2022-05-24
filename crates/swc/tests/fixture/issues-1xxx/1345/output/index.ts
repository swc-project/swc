import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _ts_decorate from "@swc/helpers/lib/_ts_decorate.js";
import _ts_metadata from "@swc/helpers/lib/_ts_metadata.js";
export var AccountMemberView = function AccountMemberView() {
    "use strict";
    _class_call_check(this, AccountMemberView);
};
_ts_decorate([
    ViewColumn({
        name: "tmcode"
    }),
    _ts_metadata("design:type", Number)
], AccountMemberView.prototype, "memberId", void 0);
_ts_decorate([
    ViewColumn({
        name: "mid"
    }),
    _ts_metadata("design:type", String)
], AccountMemberView.prototype, "mallId", void 0);
_ts_decorate([
    ViewColumn({
        name: "accea"
    }),
    _ts_metadata("design:type", Number)
], AccountMemberView.prototype, "allowAccountCnt", void 0);
_ts_decorate([
    ViewColumn({
        name: "qaccea"
    }),
    _ts_metadata("design:type", Number)
], AccountMemberView.prototype, "allowQuickAccountCnt", void 0);
_ts_decorate([
    ViewColumn({
        name: "endday"
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], AccountMemberView.prototype, "accountEnddedAt", void 0);
_ts_decorate([
    ViewColumn({
        name: "quick_endday"
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], AccountMemberView.prototype, "accountQuickEnddedAt", void 0);
_ts_decorate([
    ViewColumn(),
    _ts_metadata("design:type", Number)
], AccountMemberView.prototype, "accountCnt", void 0);
_ts_decorate([
    ViewColumn(),
    _ts_metadata("design:type", Number)
], AccountMemberView.prototype, "accountQuickCnt", void 0);
AccountMemberView = _ts_decorate([
    ViewEntity({
        name: "AccountMemberView",
        expression: '\n    SELECT\n        m.tmcode, m.mid, m.accea, m.qaccea, m.endday, m.quick_endday,\n        (SELECT COUNT(*) FROM TBLACCOUNT a WHERE m.mid = a.mid AND a.use_quick="F") as accountCnt,\n        (SELECT COUNT(*) FROM TBLACCOUNT a WHERE m.mid = a.mid AND a.use_quick="T") as accountQuickCnt\n    FROM TBLMEMBER m\n    '
    })
], AccountMemberView);
