function e(e, t, o) {
    return t in e ? Object.defineProperty(e, t, {
        value: o,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = o, e;
}
var t;
export var DML_Statements = (e(t = {}, PrivilegeType.DML_SELECT, "Select"), e(t, PrivilegeType.DML_SELECT_SEQUENCE, "Select Sequence"), e(t, PrivilegeType.DML_DELETE, "Delete"), e(t, PrivilegeType.DML_INSERT, "Insert"), e(t, PrivilegeType.DML_UPDATE, "Update"), e(t, PrivilegeType.DML_MERGE_INTO, "Merge into"), t);
var o;
export var DCL_Statements = (e(o = {}, PrivilegeType.DCL_GRANT, "Grant"), e(o, PrivilegeType.DCL_REVOKE, "Revoke"), e(o, PrivilegeType.DCL_COMMIT, "Commit"), e(o, PrivilegeType.DCL_ROLLBACK, "Rollback"), o);
var i;
export var DDL_Statements = (e(i = {}, PrivilegeType.DDL_DROP, "Drop"), e(i, PrivilegeType.DDL_ALTER, "Alter"), e(i, PrivilegeType.DDL_CREATE, "Create"), e(i, PrivilegeType.DDL_RENAME, "Rename"), e(i, PrivilegeType.DDL_TRUNCATE, "Truncate"), i);
var a;
export var ETC_Statements = (e(a = {}, PrivilegeType.ETC_BEGIN, "Begin"), e(a, PrivilegeType.ETC_EXECUTE, "Execute"), e(a, PrivilegeType.ETC_EXPLAIN, "Explain"), e(a, PrivilegeType.ETC_OTHERS, "Etc."), a);
export var AWS_REGION = [
    {
        value: "ap-northeast-2",
        text: "Asia Pacific (Seoul)"
    },
    {
        value: "ap-northeast-3",
        text: "Asia Pacific (Osaka-Local)"
    },
    {
        value: "ap-southeast-1",
        text: "Asia Pacific (Singapore)"
    },
    {
        value: "ap-southeast-2",
        text: "Asia Pacific (Sydney)"
    },
    {
        value: "ap-northeast-1",
        text: "Asia Pacific (Tokyo)"
    },
    {
        value: "ap-east-1",
        text: "Asia Pacific (Hong Kong)"
    },
    {
        value: "ap-south-1",
        text: "Asia Pacific (Mumbai)"
    },
    {
        value: "us-east-2",
        text: "US East (Ohio)"
    },
    {
        value: "us-east-1",
        text: "US East (N. Virginia)"
    },
    {
        value: "us-west-1",
        text: "US West (N. California)"
    },
    {
        value: "us-west-2",
        text: "US West (Oregon)"
    },
    {
        value: "af-south-1",
        text: "Africa (Cape Town)"
    },
    {
        value: "ca-central-1",
        text: "Canada (Central)"
    },
    {
        value: "cn-north-1",
        text: "China (Beijing)"
    },
    {
        value: "cn-northwest-1",
        text: "China (Ningxia)"
    },
    {
        value: "eu-central-1",
        text: "Europe (Frankfurt)"
    },
    {
        value: "eu-west-1",
        text: "Europe (Ireland)"
    },
    {
        value: "eu-west-2",
        text: "Europe (London)"
    },
    {
        value: "eu-south-1",
        text: "Europe (Milan)"
    },
    {
        value: "eu-west-3",
        text: "Europe (Paris)"
    },
    {
        value: "eu-north-1",
        text: "Europe (Stockholm)"
    },
    {
        value: "me-south-1",
        text: "Middle East (Bahrain)"
    },
    {
        value: "sa-east-1",
        text: "South America (S\xe3o Paulo)"
    }, 
];
var r;
export var NotificationChannelTypes = (e(r = {}, NotificationServiceType.HTTP, "HTTP"), e(r, NotificationServiceType.AGIT, "Agit"), e(r, NotificationServiceType.SLACK, "Slack"), e(r, NotificationServiceType.KAKAOWORK, "Kakaowork"), r);
var T;
export var AlertActionGroup = (e(T = {}, ActionTypeGroup.APPROVAL, "New Request"), e(T, ActionTypeGroup.DATABASE_AUTHENTICATION, "DB Connection Attempt"), e(T, ActionTypeGroup.EXCEL_EXPORT, "Data Export"), e(T, ActionTypeGroup.SQL_EXECUTION_PREVENTED, "Prevented SQL Execution"), e(T, ActionTypeGroup.SENSITIVE_DATA, "Sensitive Data Access"), e(T, ActionTypeGroup.SQL_EXECUTION, "SQL Execution"), T);
var p;
export var AUDIT_ACTION_TYPE = (e(p = {}, AuditActionType.CONNECTION, "Connection"), e(p, AuditActionType.SQL_EXECUTION, "SQL Execution"), e(p, AuditActionType.EXPORT_DATA, "Export Data"), e(p, AuditActionType.IMPORT_DATA, "Import Data"), e(p, AuditActionType.EXPORT_SCHEMA, "Export Schema"), e(p, AuditActionType.IMPORT_SCHEMA, "Import Schema"), e(p, AuditActionType.COPY_CLIPBOARD, "Copy Clipboard"), p);
var n;
export var ROLE_HISTORY_MODE_TYPE = (e(n = {}, RoleHistoryModeType.USER_ADD, "User Added"), e(n, RoleHistoryModeType.USER_MOD, "User Modified"), e(n, RoleHistoryModeType.USER_REMOVE, "User Removed"), e(n, RoleHistoryModeType.GROUP_ADD, "Group Added"), e(n, RoleHistoryModeType.GROUP_MOD, "Group Modified"), e(n, RoleHistoryModeType.GROUP_REMOVE, "Group Removed"), e(n, RoleHistoryModeType.ROLE_GRANTED, "Role Granted"), e(n, RoleHistoryModeType.ROLE_REVOKED, "Role Revoked"), e(n, RoleHistoryModeType.ACL_ADD, "Access Control Granted"), e(n, RoleHistoryModeType.ACL_MOD, "Access Control Updated"), e(n, RoleHistoryModeType.ACL_REMOVE, "Access Control Revoked"), e(n, RoleHistoryModeType.ACL_EXPIRED, "Access Control Expired"), n);
var E;
export var HISTORY_ACTION_TYPE = (e(E = {}, HistoryActionType.CONNECT, "Connect"), e(E, HistoryActionType.DISCONNECT, "Disconnect"), e(E, HistoryActionType.LOGIN, "User Login"), e(E, HistoryActionType.LOGOUT, "User Logout"), e(E, HistoryActionType.LOCKED, "Account Locked"), e(E, HistoryActionType.EXPIRED, "Account Expired"), e(E, HistoryActionType.LOCKED_MANUALLY, "Account Locked Manually"), e(E, HistoryActionType.UNLOCK, "Account Unlocked"), E);
