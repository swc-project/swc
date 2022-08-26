function e(e, t, a) {
    return t in e ? Object.defineProperty(e, t, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = a, e;
}
var t;
export var DML_Statements = (e(t = {}, PrivilegeType.DML_SELECT, "Select"), e(t, PrivilegeType.DML_SELECT_SEQUENCE, "Select Sequence"), e(t, PrivilegeType.DML_DELETE, "Delete"), e(t, PrivilegeType.DML_INSERT, "Insert"), e(t, PrivilegeType.DML_UPDATE, "Update"), e(t, PrivilegeType.DML_MERGE_INTO, "Merge into"), t);
var a;
export var DCL_Statements = (e(a = {}, PrivilegeType.DCL_GRANT, "Grant"), e(a, PrivilegeType.DCL_REVOKE, "Revoke"), e(a, PrivilegeType.DCL_COMMIT, "Commit"), e(a, PrivilegeType.DCL_ROLLBACK, "Rollback"), a);
var o;
export var DDL_Statements = (e(o = {}, PrivilegeType.DDL_DROP, "Drop"), e(o, PrivilegeType.DDL_ALTER, "Alter"), e(o, PrivilegeType.DDL_CREATE, "Create"), e(o, PrivilegeType.DDL_RENAME, "Rename"), e(o, PrivilegeType.DDL_TRUNCATE, "Truncate"), o);
var E;
export var ETC_Statements = (e(E = {}, PrivilegeType.ETC_BEGIN, "Begin"), e(E, PrivilegeType.ETC_EXECUTE, "Execute"), e(E, PrivilegeType.ETC_EXPLAIN, "Explain"), e(E, PrivilegeType.ETC_OTHERS, "Etc."), E);
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
var n;
export var AlertActionGroup = (e(n = {}, ActionTypeGroup.APPROVAL, "New Request"), e(n, ActionTypeGroup.DATABASE_AUTHENTICATION, "DB Connection Attempt"), e(n, ActionTypeGroup.EXCEL_EXPORT, "Data Export"), e(n, ActionTypeGroup.SQL_EXECUTION_PREVENTED, "Prevented SQL Execution"), e(n, ActionTypeGroup.SENSITIVE_DATA, "Sensitive Data Access"), e(n, ActionTypeGroup.SQL_EXECUTION, "SQL Execution"), n);
var u;
export var AUDIT_ACTION_TYPE = (e(u = {}, AuditActionType.CONNECTION, "Connection"), e(u, AuditActionType.SQL_EXECUTION, "SQL Execution"), e(u, AuditActionType.EXPORT_DATA, "Export Data"), e(u, AuditActionType.IMPORT_DATA, "Import Data"), e(u, AuditActionType.EXPORT_SCHEMA, "Export Schema"), e(u, AuditActionType.IMPORT_SCHEMA, "Import Schema"), e(u, AuditActionType.COPY_CLIPBOARD, "Copy Clipboard"), u);
var i;
export var ROLE_HISTORY_MODE_TYPE = (e(i = {}, RoleHistoryModeType.USER_ADD, "User Added"), e(i, RoleHistoryModeType.USER_MOD, "User Modified"), e(i, RoleHistoryModeType.USER_REMOVE, "User Removed"), e(i, RoleHistoryModeType.GROUP_ADD, "Group Added"), e(i, RoleHistoryModeType.GROUP_MOD, "Group Modified"), e(i, RoleHistoryModeType.GROUP_REMOVE, "Group Removed"), e(i, RoleHistoryModeType.ROLE_GRANTED, "Role Granted"), e(i, RoleHistoryModeType.ROLE_REVOKED, "Role Revoked"), e(i, RoleHistoryModeType.ACL_ADD, "Access Control Granted"), e(i, RoleHistoryModeType.ACL_MOD, "Access Control Updated"), e(i, RoleHistoryModeType.ACL_REMOVE, "Access Control Revoked"), e(i, RoleHistoryModeType.ACL_EXPIRED, "Access Control Expired"), i);
var A;
export var HISTORY_ACTION_TYPE = (e(A = {}, HistoryActionType.CONNECT, "Connect"), e(A, HistoryActionType.DISCONNECT, "Disconnect"), e(A, HistoryActionType.LOGIN, "User Login"), e(A, HistoryActionType.LOGOUT, "User Logout"), e(A, HistoryActionType.LOCKED, "Account Locked"), e(A, HistoryActionType.EXPIRED, "Account Expired"), e(A, HistoryActionType.LOCKED_MANUALLY, "Account Locked Manually"), e(A, HistoryActionType.UNLOCK, "Account Unlocked"), A);
