function _defineProperty(obj, key, value) {
    return key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value, obj;
}
var _obj;
export var DML_Statements = (_defineProperty(_obj = {}, PrivilegeType.DML_SELECT, "Select"), _defineProperty(_obj, PrivilegeType.DML_SELECT_SEQUENCE, "Select Sequence"), _defineProperty(_obj, PrivilegeType.DML_DELETE, "Delete"), _defineProperty(_obj, PrivilegeType.DML_INSERT, "Insert"), _defineProperty(_obj, PrivilegeType.DML_UPDATE, "Update"), _defineProperty(_obj, PrivilegeType.DML_MERGE_INTO, "Merge into"), _obj);
var _obj1;
export var DCL_Statements = (_defineProperty(_obj1 = {}, PrivilegeType.DCL_GRANT, "Grant"), _defineProperty(_obj1, PrivilegeType.DCL_REVOKE, "Revoke"), _defineProperty(_obj1, PrivilegeType.DCL_COMMIT, "Commit"), _defineProperty(_obj1, PrivilegeType.DCL_ROLLBACK, "Rollback"), _obj1);
var _obj2;
export var DDL_Statements = (_defineProperty(_obj2 = {}, PrivilegeType.DDL_DROP, "Drop"), _defineProperty(_obj2, PrivilegeType.DDL_ALTER, "Alter"), _defineProperty(_obj2, PrivilegeType.DDL_CREATE, "Create"), _defineProperty(_obj2, PrivilegeType.DDL_RENAME, "Rename"), _defineProperty(_obj2, PrivilegeType.DDL_TRUNCATE, "Truncate"), _obj2);
var _obj3;
export var ETC_Statements = (_defineProperty(_obj3 = {}, PrivilegeType.ETC_BEGIN, "Begin"), _defineProperty(_obj3, PrivilegeType.ETC_EXECUTE, "Execute"), _defineProperty(_obj3, PrivilegeType.ETC_EXPLAIN, "Explain"), _defineProperty(_obj3, PrivilegeType.ETC_OTHERS, "Etc."), _obj3);
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
var _obj4;
export var NotificationChannelTypes = (_defineProperty(_obj4 = {}, NotificationServiceType.HTTP, "HTTP"), _defineProperty(_obj4, NotificationServiceType.AGIT, "Agit"), _defineProperty(_obj4, NotificationServiceType.SLACK, "Slack"), _defineProperty(_obj4, NotificationServiceType.KAKAOWORK, "Kakaowork"), _obj4);
var _obj5;
export var AlertActionGroup = (_defineProperty(_obj5 = {}, ActionTypeGroup.APPROVAL, "New Request"), _defineProperty(_obj5, ActionTypeGroup.DATABASE_AUTHENTICATION, "DB Connection Attempt"), _defineProperty(_obj5, ActionTypeGroup.EXCEL_EXPORT, "Data Export"), _defineProperty(_obj5, ActionTypeGroup.SQL_EXECUTION_PREVENTED, "Prevented SQL Execution"), _defineProperty(_obj5, ActionTypeGroup.SENSITIVE_DATA, "Sensitive Data Access"), _defineProperty(_obj5, ActionTypeGroup.SQL_EXECUTION, "SQL Execution"), _obj5);
var _obj6;
export var AUDIT_ACTION_TYPE = (_defineProperty(_obj6 = {}, AuditActionType.CONNECTION, "Connection"), _defineProperty(_obj6, AuditActionType.SQL_EXECUTION, "SQL Execution"), _defineProperty(_obj6, AuditActionType.EXPORT_DATA, "Export Data"), _defineProperty(_obj6, AuditActionType.IMPORT_DATA, "Import Data"), _defineProperty(_obj6, AuditActionType.EXPORT_SCHEMA, "Export Schema"), _defineProperty(_obj6, AuditActionType.IMPORT_SCHEMA, "Import Schema"), _defineProperty(_obj6, AuditActionType.COPY_CLIPBOARD, "Copy Clipboard"), _obj6);
var _obj7;
export var ROLE_HISTORY_MODE_TYPE = (_defineProperty(_obj7 = {}, RoleHistoryModeType.USER_ADD, "User Added"), _defineProperty(_obj7, RoleHistoryModeType.USER_MOD, "User Modified"), _defineProperty(_obj7, RoleHistoryModeType.USER_REMOVE, "User Removed"), _defineProperty(_obj7, RoleHistoryModeType.GROUP_ADD, "Group Added"), _defineProperty(_obj7, RoleHistoryModeType.GROUP_MOD, "Group Modified"), _defineProperty(_obj7, RoleHistoryModeType.GROUP_REMOVE, "Group Removed"), _defineProperty(_obj7, RoleHistoryModeType.ROLE_GRANTED, "Role Granted"), _defineProperty(_obj7, RoleHistoryModeType.ROLE_REVOKED, "Role Revoked"), _defineProperty(_obj7, RoleHistoryModeType.ACL_ADD, "Access Control Granted"), _defineProperty(_obj7, RoleHistoryModeType.ACL_MOD, "Access Control Updated"), _defineProperty(_obj7, RoleHistoryModeType.ACL_REMOVE, "Access Control Revoked"), _defineProperty(_obj7, RoleHistoryModeType.ACL_EXPIRED, "Access Control Expired"), _obj7);
var _obj8;
export var HISTORY_ACTION_TYPE = (_defineProperty(_obj8 = {}, HistoryActionType.CONNECT, "Connect"), _defineProperty(_obj8, HistoryActionType.DISCONNECT, "Disconnect"), _defineProperty(_obj8, HistoryActionType.LOGIN, "User Login"), _defineProperty(_obj8, HistoryActionType.LOGOUT, "User Logout"), _defineProperty(_obj8, HistoryActionType.LOCKED, "Account Locked"), _defineProperty(_obj8, HistoryActionType.EXPIRED, "Account Expired"), _defineProperty(_obj8, HistoryActionType.LOCKED_MANUALLY, "Account Locked Manually"), _defineProperty(_obj8, HistoryActionType.UNLOCK, "Account Unlocked"), _obj8);
