function E(E, e, t) {
    return e in E ? Object.defineProperty(E, e, {
        value: t,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : E[e] = t, E;
}
var e;
export var DML_Statements = (E(e = {}, PrivilegeType.DML_SELECT, "Select"), E(e, PrivilegeType.DML_SELECT_SEQUENCE, "Select Sequence"), E(e, PrivilegeType.DML_DELETE, "Delete"), E(e, PrivilegeType.DML_INSERT, "Insert"), E(e, PrivilegeType.DML_UPDATE, "Update"), E(e, PrivilegeType.DML_MERGE_INTO, "Merge into"), e);
var t;
export var DCL_Statements = (E(t = {}, PrivilegeType.DCL_GRANT, "Grant"), E(t, PrivilegeType.DCL_REVOKE, "Revoke"), E(t, PrivilegeType.DCL_COMMIT, "Commit"), E(t, PrivilegeType.DCL_ROLLBACK, "Rollback"), t);
var T;
export var DDL_Statements = (E(T = {}, PrivilegeType.DDL_DROP, "Drop"), E(T, PrivilegeType.DDL_ALTER, "Alter"), E(T, PrivilegeType.DDL_CREATE, "Create"), E(T, PrivilegeType.DDL_RENAME, "Rename"), E(T, PrivilegeType.DDL_TRUNCATE, "Truncate"), T);
var a;
export var ETC_Statements = (E(a = {}, PrivilegeType.ETC_BEGIN, "Begin"), E(a, PrivilegeType.ETC_EXECUTE, "Execute"), E(a, PrivilegeType.ETC_EXPLAIN, "Explain"), E(a, PrivilegeType.ETC_OTHERS, "Etc."), a);
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
var D;
export var NotificationChannelTypes = (E(D = {}, NotificationServiceType.HTTP, "HTTP"), E(D, NotificationServiceType.AGIT, "Agit"), E(D, NotificationServiceType.SLACK, "Slack"), E(D, NotificationServiceType.KAKAOWORK, "Kakaowork"), D);
var O;
export var AlertActionGroup = (E(O = {}, ActionTypeGroup.APPROVAL, "New Request"), E(O, ActionTypeGroup.DATABASE_AUTHENTICATION, "DB Connection Attempt"), E(O, ActionTypeGroup.EXCEL_EXPORT, "Data Export"), E(O, ActionTypeGroup.SQL_EXECUTION_PREVENTED, "Prevented SQL Execution"), E(O, ActionTypeGroup.SENSITIVE_DATA, "Sensitive Data Access"), E(O, ActionTypeGroup.SQL_EXECUTION, "SQL Execution"), O);
var L;
export var AUDIT_ACTION_TYPE = (E(L = {}, AuditActionType.CONNECTION, "Connection"), E(L, AuditActionType.SQL_EXECUTION, "SQL Execution"), E(L, AuditActionType.EXPORT_DATA, "Export Data"), E(L, AuditActionType.IMPORT_DATA, "Import Data"), E(L, AuditActionType.EXPORT_SCHEMA, "Export Schema"), E(L, AuditActionType.IMPORT_SCHEMA, "Import Schema"), E(L, AuditActionType.COPY_CLIPBOARD, "Copy Clipboard"), L);
var A;
export var ROLE_HISTORY_MODE_TYPE = (E(A = {}, RoleHistoryModeType.USER_ADD, "User Added"), E(A, RoleHistoryModeType.USER_MOD, "User Modified"), E(A, RoleHistoryModeType.USER_REMOVE, "User Removed"), E(A, RoleHistoryModeType.GROUP_ADD, "Group Added"), E(A, RoleHistoryModeType.GROUP_MOD, "Group Modified"), E(A, RoleHistoryModeType.GROUP_REMOVE, "Group Removed"), E(A, RoleHistoryModeType.ROLE_GRANTED, "Role Granted"), E(A, RoleHistoryModeType.ROLE_REVOKED, "Role Revoked"), E(A, RoleHistoryModeType.ACL_ADD, "Access Control Granted"), E(A, RoleHistoryModeType.ACL_MOD, "Access Control Updated"), E(A, RoleHistoryModeType.ACL_REMOVE, "Access Control Revoked"), E(A, RoleHistoryModeType.ACL_EXPIRED, "Access Control Expired"), A);
var C;
export var HISTORY_ACTION_TYPE = (E(C = {}, HistoryActionType.CONNECT, "Connect"), E(C, HistoryActionType.DISCONNECT, "Disconnect"), E(C, HistoryActionType.LOGIN, "User Login"), E(C, HistoryActionType.LOGOUT, "User Logout"), E(C, HistoryActionType.LOCKED, "Account Locked"), E(C, HistoryActionType.EXPIRED, "Account Expired"), E(C, HistoryActionType.LOCKED_MANUALLY, "Account Locked Manually"), E(C, HistoryActionType.UNLOCK, "Account Unlocked"), C);
