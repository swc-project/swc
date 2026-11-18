/** 등록된 계좌+회원의 정보  */ import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
import { _ as _ts_metadata } from "@swc/helpers/_/_ts_metadata";
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
