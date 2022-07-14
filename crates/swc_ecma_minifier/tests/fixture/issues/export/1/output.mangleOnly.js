function a(a, b, c) {
    return b in a ? Object.defineProperty(a, b, {
        value: c,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : a[b] = c, a;
}
var b;
export var DML_Statements = (a(b = {}, PrivilegeType.DML_SELECT, "Select"), a(b, PrivilegeType.DML_SELECT_SEQUENCE, "Select Sequence"), a(b, PrivilegeType.DML_DELETE, "Delete"), a(b, PrivilegeType.DML_INSERT, "Insert"), a(b, PrivilegeType.DML_UPDATE, "Update"), a(b, PrivilegeType.DML_MERGE_INTO, "Merge into"), b);
var c;
export var DCL_Statements = (a(c = {}, PrivilegeType.DCL_GRANT, "Grant"), a(c, PrivilegeType.DCL_REVOKE, "Revoke"), a(c, PrivilegeType.DCL_COMMIT, "Commit"), a(c, PrivilegeType.DCL_ROLLBACK, "Rollback"), c);
var d;
export var DDL_Statements = (a(d = {}, PrivilegeType.DDL_DROP, "Drop"), a(d, PrivilegeType.DDL_ALTER, "Alter"), a(d, PrivilegeType.DDL_CREATE, "Create"), a(d, PrivilegeType.DDL_RENAME, "Rename"), a(d, PrivilegeType.DDL_TRUNCATE, "Truncate"), d);
var e;
export var ETC_Statements = (a(e = {}, PrivilegeType.ETC_BEGIN, "Begin"), a(e, PrivilegeType.ETC_EXECUTE, "Execute"), a(e, PrivilegeType.ETC_EXPLAIN, "Explain"), a(e, PrivilegeType.ETC_OTHERS, "Etc."), e);
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
var f;
export var NotificationChannelTypes = (a(f = {}, NotificationServiceType.HTTP, "HTTP"), a(f, NotificationServiceType.AGIT, "Agit"), a(f, NotificationServiceType.SLACK, "Slack"), a(f, NotificationServiceType.KAKAOWORK, "Kakaowork"), f);
var g;
export var AlertActionGroup = (a(g = {}, ActionTypeGroup.APPROVAL, "New Request"), a(g, ActionTypeGroup.DATABASE_AUTHENTICATION, "DB Connection Attempt"), a(g, ActionTypeGroup.EXCEL_EXPORT, "Data Export"), a(g, ActionTypeGroup.SQL_EXECUTION_PREVENTED, "Prevented SQL Execution"), a(g, ActionTypeGroup.SENSITIVE_DATA, "Sensitive Data Access"), a(g, ActionTypeGroup.SQL_EXECUTION, "SQL Execution"), g);
var h;
export var AUDIT_ACTION_TYPE = (a(h = {}, AuditActionType.CONNECTION, "Connection"), a(h, AuditActionType.SQL_EXECUTION, "SQL Execution"), a(h, AuditActionType.EXPORT_DATA, "Export Data"), a(h, AuditActionType.IMPORT_DATA, "Import Data"), a(h, AuditActionType.EXPORT_SCHEMA, "Export Schema"), a(h, AuditActionType.IMPORT_SCHEMA, "Import Schema"), a(h, AuditActionType.COPY_CLIPBOARD, "Copy Clipboard"), h);
var i;
export var ROLE_HISTORY_MODE_TYPE = (a(i = {}, RoleHistoryModeType.USER_ADD, "User Added"), a(i, RoleHistoryModeType.USER_MOD, "User Modified"), a(i, RoleHistoryModeType.USER_REMOVE, "User Removed"), a(i, RoleHistoryModeType.GROUP_ADD, "Group Added"), a(i, RoleHistoryModeType.GROUP_MOD, "Group Modified"), a(i, RoleHistoryModeType.GROUP_REMOVE, "Group Removed"), a(i, RoleHistoryModeType.ROLE_GRANTED, "Role Granted"), a(i, RoleHistoryModeType.ROLE_REVOKED, "Role Revoked"), a(i, RoleHistoryModeType.ACL_ADD, "Access Control Granted"), a(i, RoleHistoryModeType.ACL_MOD, "Access Control Updated"), a(i, RoleHistoryModeType.ACL_REMOVE, "Access Control Revoked"), a(i, RoleHistoryModeType.ACL_EXPIRED, "Access Control Expired"), i);
var j;
export var HISTORY_ACTION_TYPE = (a(j = {}, HistoryActionType.CONNECT, "Connect"), a(j, HistoryActionType.DISCONNECT, "Disconnect"), a(j, HistoryActionType.LOGIN, "User Login"), a(j, HistoryActionType.LOGOUT, "User Logout"), a(j, HistoryActionType.LOCKED, "Account Locked"), a(j, HistoryActionType.EXPIRED, "Account Expired"), a(j, HistoryActionType.LOCKED_MANUALLY, "Account Locked Manually"), a(j, HistoryActionType.UNLOCK, "Account Unlocked"), j);
