//// [parserEnum2.ts]
export var SignatureFlags;
(function(SignatureFlags) {
    SignatureFlags[SignatureFlags["None"] = 0] = "None";
    SignatureFlags[SignatureFlags["IsIndexer"] = 1] = "IsIndexer";
    SignatureFlags[SignatureFlags["IsStringIndexer"] = 2] = "IsStringIndexer";
    SignatureFlags[SignatureFlags["IsNumberIndexer"] = 4] = "IsNumberIndexer";
})(SignatureFlags || (SignatureFlags = {}));
