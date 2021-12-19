// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.
///<reference path='typescript.ts' />
var TypeScript;
(function(TypeScript1) {
    function hasFlag(val, flag) {
        return (val & flag) != 0;
    }
    TypeScript1.hasFlag = hasFlag;
    let ErrorRecoverySet;
    (function(ErrorRecoverySet) {
        ErrorRecoverySet[ErrorRecoverySet["None"] = 0] = "None";
        ErrorRecoverySet[ErrorRecoverySet["Comma"] = 1] = "Comma";
        ErrorRecoverySet[ErrorRecoverySet["SColon"] = 2] = "SColon";
        ErrorRecoverySet[ErrorRecoverySet["Asg"] = 4] = "Asg";
        ErrorRecoverySet[ErrorRecoverySet["BinOp"] = 8] = "BinOp";
        ErrorRecoverySet[ErrorRecoverySet[// AsgMod, AsgAdd, AsgSub, AsgLsh, AsgRsh, AsgRs2, AsgAnd, AsgXor, AsgOr, QMark, Mult, Div, 
        // Pct, GT, LT, And, Xor, Or
        "RBrack"] = 16] = "RBrack";
        ErrorRecoverySet[ErrorRecoverySet["RCurly"] = 32] = "RCurly";
        ErrorRecoverySet[ErrorRecoverySet["RParen"] = 64] = "RParen";
        ErrorRecoverySet[ErrorRecoverySet["Dot"] = 128] = "Dot";
        ErrorRecoverySet[ErrorRecoverySet["Colon"] = 256] = "Colon";
        ErrorRecoverySet[ErrorRecoverySet["PrimType"] = 512] = "PrimType";
        ErrorRecoverySet[ErrorRecoverySet["AddOp"] = 1024] = "AddOp";
        ErrorRecoverySet[ErrorRecoverySet["LCurly"] = 2048] = "LCurly";
        ErrorRecoverySet[ErrorRecoverySet["PreOp"] = 4096] = "PreOp";
        ErrorRecoverySet[ErrorRecoverySet["RegExp"] = 8192] = "RegExp";
        ErrorRecoverySet[ErrorRecoverySet["LParen"] = 16384] = "LParen";
        ErrorRecoverySet[ErrorRecoverySet["LBrack"] = 32768] = "LBrack";
        ErrorRecoverySet[ErrorRecoverySet["Scope"] = 65536] = "Scope";
        ErrorRecoverySet[ErrorRecoverySet["In"] = 131072] = "In";
        ErrorRecoverySet[ErrorRecoverySet["SCase"] = 262144] = "SCase";
        ErrorRecoverySet[ErrorRecoverySet["Else"] = 524288] = "Else";
        ErrorRecoverySet[ErrorRecoverySet["Catch"] = 1048576] = "Catch";
        ErrorRecoverySet[ErrorRecoverySet["Var"] = 2097152] = "Var";
        ErrorRecoverySet[ErrorRecoverySet["Stmt"] = 4194304] = "Stmt";
        ErrorRecoverySet[ErrorRecoverySet["While"] = 8388608] = "While";
        ErrorRecoverySet[ErrorRecoverySet["ID"] = 16777216] = "ID";
        ErrorRecoverySet[ErrorRecoverySet["Prefix"] = 33554432] = "Prefix";
        ErrorRecoverySet[ErrorRecoverySet["Literal"] = 67108864] = "Literal";
        ErrorRecoverySet[ErrorRecoverySet["RLit"] = 134217728] = "RLit";
        ErrorRecoverySet[ErrorRecoverySet["Func"] = 268435456] = "Func";
        ErrorRecoverySet[ErrorRecoverySet["EOF"] = 536870912] = "EOF";
        ErrorRecoverySet[ErrorRecoverySet[// REVIEW: Name this something clearer.
        "TypeScriptS"] = 1073741824] = "TypeScriptS";
        ErrorRecoverySet[ErrorRecoverySet["ExprStart"] = 520158210] = "ExprStart";
        ErrorRecoverySet[ErrorRecoverySet["StmtStart"] = 1608580098] = "StmtStart";
        ErrorRecoverySet[ErrorRecoverySet["Postfix"] = 49280] = "Postfix";
    })(ErrorRecoverySet = TypeScript1.ErrorRecoverySet || (TypeScript1.ErrorRecoverySet = {
    }));
    let AllowedElements;
    (function(AllowedElements) {
        AllowedElements[AllowedElements["None"] = 0] = "None";
        AllowedElements[AllowedElements["ModuleDeclarations"] = 4] = "ModuleDeclarations";
        AllowedElements[AllowedElements["ClassDeclarations"] = 8] = "ClassDeclarations";
        AllowedElements[AllowedElements["InterfaceDeclarations"] = 16] = "InterfaceDeclarations";
        AllowedElements[AllowedElements["AmbientDeclarations"] = 1024] = "AmbientDeclarations";
        AllowedElements[AllowedElements["Properties"] = 2048] = "Properties";
        AllowedElements[AllowedElements["Global"] = 1052] = "Global";
        AllowedElements[AllowedElements["QuickParse"] = 3100] = "QuickParse";
    })(AllowedElements = TypeScript1.AllowedElements || (TypeScript1.AllowedElements = {
    }));
    let Modifiers;
    (function(Modifiers) {
        Modifiers[Modifiers["None"] = 0] = "None";
        Modifiers[Modifiers["Private"] = 1] = "Private";
        Modifiers[Modifiers["Public"] = 2] = "Public";
        Modifiers[Modifiers["Readonly"] = 4] = "Readonly";
        Modifiers[Modifiers["Ambient"] = 8] = "Ambient";
        Modifiers[Modifiers["Exported"] = 16] = "Exported";
        Modifiers[Modifiers["Getter"] = 32] = "Getter";
        Modifiers[Modifiers["Setter"] = 64] = "Setter";
        Modifiers[Modifiers["Static"] = 128] = "Static";
    })(Modifiers = TypeScript1.Modifiers || (TypeScript1.Modifiers = {
    }));
    let ASTFlags;
    (function(ASTFlags) {
        ASTFlags[ASTFlags["None"] = 0] = "None";
        ASTFlags[ASTFlags["ExplicitSemicolon"] = 1] = "ExplicitSemicolon";
        ASTFlags[ASTFlags["AutomaticSemicolon"] = 2] = "AutomaticSemicolon";
        ASTFlags[ASTFlags["Writeable"] = 4] = "Writeable";
        ASTFlags[ASTFlags["Error"] = 8] = "Error";
        ASTFlags[ASTFlags["DotLHSPartial"] = 16] = "DotLHSPartial";
        ASTFlags[ASTFlags["DotLHS"] = 32] = "DotLHS";
        ASTFlags[ASTFlags["IsStatement"] = 64] = "IsStatement";
        ASTFlags[ASTFlags["StrictMode"] = 128] = "StrictMode";
        ASTFlags[ASTFlags["PossibleOptionalParameter"] = 256] = "PossibleOptionalParameter";
        ASTFlags[ASTFlags["ClassBaseConstructorCall"] = 512] = "ClassBaseConstructorCall";
        ASTFlags[ASTFlags["OptionalName"] = 1024] = "OptionalName";
        ASTFlags[ASTFlags[// REVIEW: This flag is to mark lambda nodes to note that the LParen of an expression has already been matched in the lambda header.
        //         The flag is used to communicate this piece of information to the calling parseTerm, which intern will remove it.
        //         Once we have a better way to associate information with nodes, this flag should not be used.
        "SkipNextRParen"] = 2048] = "SkipNextRParen";
    })(ASTFlags = TypeScript1.ASTFlags || (TypeScript1.ASTFlags = {
    }));
    let DeclFlags;
    (function(DeclFlags) {
        DeclFlags[DeclFlags["None"] = 0] = "None";
        DeclFlags[DeclFlags["Exported"] = 1] = "Exported";
        DeclFlags[DeclFlags["Private"] = 2] = "Private";
        DeclFlags[DeclFlags["Public"] = 4] = "Public";
        DeclFlags[DeclFlags["Ambient"] = 8] = "Ambient";
        DeclFlags[DeclFlags["Static"] = 16] = "Static";
        DeclFlags[DeclFlags["LocalStatic"] = 32] = "LocalStatic";
        DeclFlags[DeclFlags["GetAccessor"] = 64] = "GetAccessor";
        DeclFlags[DeclFlags["SetAccessor"] = 128] = "SetAccessor";
    })(DeclFlags = TypeScript1.DeclFlags || (TypeScript1.DeclFlags = {
    }));
    let ModuleFlags;
    (function(ModuleFlags) {
        ModuleFlags[ModuleFlags["None"] = 0] = "None";
        ModuleFlags[ModuleFlags["Exported"] = 1] = "Exported";
        ModuleFlags[ModuleFlags["Private"] = 2] = "Private";
        ModuleFlags[ModuleFlags["Public"] = 4] = "Public";
        ModuleFlags[ModuleFlags["Ambient"] = 8] = "Ambient";
        ModuleFlags[ModuleFlags["Static"] = 16] = "Static";
        ModuleFlags[ModuleFlags["LocalStatic"] = 32] = "LocalStatic";
        ModuleFlags[ModuleFlags["GetAccessor"] = 64] = "GetAccessor";
        ModuleFlags[ModuleFlags["SetAccessor"] = 128] = "SetAccessor";
        ModuleFlags[ModuleFlags["IsEnum"] = 256] = "IsEnum";
        ModuleFlags[ModuleFlags["ShouldEmitModuleDecl"] = 512] = "ShouldEmitModuleDecl";
        ModuleFlags[ModuleFlags["IsWholeFile"] = 1024] = "IsWholeFile";
        ModuleFlags[ModuleFlags["IsDynamic"] = 2048] = "IsDynamic";
        ModuleFlags[ModuleFlags["MustCaptureThis"] = 4096] = "MustCaptureThis";
    })(ModuleFlags = TypeScript1.ModuleFlags || (TypeScript1.ModuleFlags = {
    }));
    let SymbolFlags;
    (function(SymbolFlags) {
        SymbolFlags[SymbolFlags["None"] = 0] = "None";
        SymbolFlags[SymbolFlags["Exported"] = 1] = "Exported";
        SymbolFlags[SymbolFlags["Private"] = 2] = "Private";
        SymbolFlags[SymbolFlags["Public"] = 4] = "Public";
        SymbolFlags[SymbolFlags["Ambient"] = 8] = "Ambient";
        SymbolFlags[SymbolFlags["Static"] = 16] = "Static";
        SymbolFlags[SymbolFlags["LocalStatic"] = 32] = "LocalStatic";
        SymbolFlags[SymbolFlags["GetAccessor"] = 64] = "GetAccessor";
        SymbolFlags[SymbolFlags["SetAccessor"] = 128] = "SetAccessor";
        SymbolFlags[SymbolFlags["Property"] = 256] = "Property";
        SymbolFlags[SymbolFlags["Readonly"] = 512] = "Readonly";
        SymbolFlags[SymbolFlags["ModuleMember"] = 1024] = "ModuleMember";
        SymbolFlags[SymbolFlags["InterfaceMember"] = 2048] = "InterfaceMember";
        SymbolFlags[SymbolFlags["ClassMember"] = 4096] = "ClassMember";
        SymbolFlags[SymbolFlags["BuiltIn"] = 8192] = "BuiltIn";
        SymbolFlags[SymbolFlags["TypeSetDuringScopeAssignment"] = 16384] = "TypeSetDuringScopeAssignment";
        SymbolFlags[SymbolFlags["Constant"] = 32768] = "Constant";
        SymbolFlags[SymbolFlags["Optional"] = 65536] = "Optional";
        SymbolFlags[SymbolFlags["RecursivelyReferenced"] = 131072] = "RecursivelyReferenced";
        SymbolFlags[SymbolFlags["Bound"] = 262144] = "Bound";
        SymbolFlags[SymbolFlags["CompilerGenerated"] = 524288] = "CompilerGenerated";
    })(SymbolFlags = TypeScript1.SymbolFlags || (TypeScript1.SymbolFlags = {
    }));
    let VarFlags;
    (function(VarFlags) {
        VarFlags[VarFlags["None"] = 0] = "None";
        VarFlags[VarFlags["Exported"] = 1] = "Exported";
        VarFlags[VarFlags["Private"] = 2] = "Private";
        VarFlags[VarFlags["Public"] = 4] = "Public";
        VarFlags[VarFlags["Ambient"] = 8] = "Ambient";
        VarFlags[VarFlags["Static"] = 16] = "Static";
        VarFlags[VarFlags["LocalStatic"] = 32] = "LocalStatic";
        VarFlags[VarFlags["GetAccessor"] = 64] = "GetAccessor";
        VarFlags[VarFlags["SetAccessor"] = 128] = "SetAccessor";
        VarFlags[VarFlags["AutoInit"] = 256] = "AutoInit";
        VarFlags[VarFlags["Property"] = 512] = "Property";
        VarFlags[VarFlags["Readonly"] = 1024] = "Readonly";
        VarFlags[VarFlags["Class"] = 2048] = "Class";
        VarFlags[VarFlags["ClassProperty"] = 4096] = "ClassProperty";
        VarFlags[VarFlags["ClassBodyProperty"] = 8192] = "ClassBodyProperty";
        VarFlags[VarFlags["ClassConstructorProperty"] = 16384] = "ClassConstructorProperty";
        VarFlags[VarFlags["ClassSuperMustBeFirstCallInConstructor"] = 32768] = "ClassSuperMustBeFirstCallInConstructor";
        VarFlags[VarFlags["Constant"] = 65536] = "Constant";
        VarFlags[VarFlags["MustCaptureThis"] = 131072] = "MustCaptureThis";
    })(VarFlags = TypeScript1.VarFlags || (TypeScript1.VarFlags = {
    }));
    let FncFlags;
    (function(FncFlags) {
        FncFlags[FncFlags["None"] = 0] = "None";
        FncFlags[FncFlags["Exported"] = 1] = "Exported";
        FncFlags[FncFlags["Private"] = 2] = "Private";
        FncFlags[FncFlags["Public"] = 4] = "Public";
        FncFlags[FncFlags["Ambient"] = 8] = "Ambient";
        FncFlags[FncFlags["Static"] = 16] = "Static";
        FncFlags[FncFlags["LocalStatic"] = 32] = "LocalStatic";
        FncFlags[FncFlags["GetAccessor"] = 64] = "GetAccessor";
        FncFlags[FncFlags["SetAccessor"] = 128] = "SetAccessor";
        FncFlags[FncFlags["Definition"] = 256] = "Definition";
        FncFlags[FncFlags["Signature"] = 512] = "Signature";
        FncFlags[FncFlags["Method"] = 1024] = "Method";
        FncFlags[FncFlags["HasReturnExpression"] = 2048] = "HasReturnExpression";
        FncFlags[FncFlags["CallMember"] = 4096] = "CallMember";
        FncFlags[FncFlags["ConstructMember"] = 8192] = "ConstructMember";
        FncFlags[FncFlags["HasSelfReference"] = 16384] = "HasSelfReference";
        FncFlags[FncFlags["IsFatArrowFunction"] = 32768] = "IsFatArrowFunction";
        FncFlags[FncFlags["IndexerMember"] = 65536] = "IndexerMember";
        FncFlags[FncFlags["IsFunctionExpression"] = 131072] = "IsFunctionExpression";
        FncFlags[FncFlags["ClassMethod"] = 262144] = "ClassMethod";
        FncFlags[FncFlags["ClassPropertyMethodExported"] = 524288] = "ClassPropertyMethodExported";
    })(FncFlags = TypeScript1.FncFlags || (TypeScript1.FncFlags = {
    }));
    let SignatureFlags;
    (function(SignatureFlags) {
        SignatureFlags[SignatureFlags["None"] = 0] = "None";
        SignatureFlags[SignatureFlags["IsIndexer"] = 1] = "IsIndexer";
        SignatureFlags[SignatureFlags["IsStringIndexer"] = 2] = "IsStringIndexer";
        SignatureFlags[SignatureFlags["IsNumberIndexer"] = 4] = "IsNumberIndexer";
    })(SignatureFlags = TypeScript1.SignatureFlags || (TypeScript1.SignatureFlags = {
    }));
    function ToDeclFlags(fncOrVarOrSymbolOrModuleFlags) {
        return fncOrVarOrSymbolOrModuleFlags;
    }
    TypeScript1.ToDeclFlags = ToDeclFlags;
    let TypeFlags;
    (function(TypeFlags) {
        TypeFlags[TypeFlags["None"] = 0] = "None";
        TypeFlags[TypeFlags["HasImplementation"] = 1] = "HasImplementation";
        TypeFlags[TypeFlags["HasSelfReference"] = 2] = "HasSelfReference";
        TypeFlags[TypeFlags["MergeResult"] = 4] = "MergeResult";
        TypeFlags[TypeFlags["IsEnum"] = 8] = "IsEnum";
        TypeFlags[TypeFlags["BuildingName"] = 16] = "BuildingName";
        TypeFlags[TypeFlags["HasBaseType"] = 32] = "HasBaseType";
        TypeFlags[TypeFlags["HasBaseTypeOfObject"] = 64] = "HasBaseTypeOfObject";
        TypeFlags[TypeFlags["IsClass"] = 128] = "IsClass";
    })(TypeFlags = TypeScript1.TypeFlags || (TypeScript1.TypeFlags = {
    }));
    let TypeRelationshipFlags;
    (function(TypeRelationshipFlags) {
        TypeRelationshipFlags[TypeRelationshipFlags["SuccessfulComparison"] = 0] = "SuccessfulComparison";
        TypeRelationshipFlags[TypeRelationshipFlags["SourceIsNullTargetIsVoidOrUndefined"] = 1] = "SourceIsNullTargetIsVoidOrUndefined";
        TypeRelationshipFlags[TypeRelationshipFlags["RequiredPropertyIsMissing"] = 2] = "RequiredPropertyIsMissing";
        TypeRelationshipFlags[TypeRelationshipFlags["IncompatibleSignatures"] = 4] = "IncompatibleSignatures";
        TypeRelationshipFlags[TypeRelationshipFlags["SourceSignatureHasTooManyParameters"] = 3] = "SourceSignatureHasTooManyParameters";
        TypeRelationshipFlags[TypeRelationshipFlags["IncompatibleReturnTypes"] = 16] = "IncompatibleReturnTypes";
        TypeRelationshipFlags[TypeRelationshipFlags["IncompatiblePropertyTypes"] = 32] = "IncompatiblePropertyTypes";
        TypeRelationshipFlags[TypeRelationshipFlags["IncompatibleParameterTypes"] = 64] = "IncompatibleParameterTypes";
    })(TypeRelationshipFlags = TypeScript1.TypeRelationshipFlags || (TypeScript1.TypeRelationshipFlags = {
    }));
    let CodeGenTarget;
    (function(CodeGenTarget) {
        CodeGenTarget[CodeGenTarget["ES3"] = 0] = "ES3";
        CodeGenTarget[CodeGenTarget["ES5"] = 1] = "ES5";
    })(CodeGenTarget = TypeScript1.CodeGenTarget || (TypeScript1.CodeGenTarget = {
    }));
    let ModuleGenTarget;
    (function(ModuleGenTarget) {
        ModuleGenTarget[ModuleGenTarget["Synchronous"] = 0] = "Synchronous";
        ModuleGenTarget[ModuleGenTarget["Asynchronous"] = 1] = "Asynchronous";
        ModuleGenTarget[ModuleGenTarget["Local"] = 2] = "Local";
    })(ModuleGenTarget = TypeScript1.ModuleGenTarget || (TypeScript1.ModuleGenTarget = {
    }));
    TypeScript1.codeGenTarget = CodeGenTarget.ES3;
    TypeScript1.moduleGenTarget = ModuleGenTarget.Synchronous;
    TypeScript1.optimizeModuleCodeGen = true;
    function flagsToString(e, flags) {
        var builder = "";
        for(var i = 1; i < 1 << 31; i = i << 1){
            if ((flags & i) != 0) {
                for(var k in e){
                    if (e[k] == i) {
                        if (builder.length > 0) {
                            builder += "|";
                        }
                        builder += k;
                        break;
                    }
                }
            }
        }
        return builder;
    }
    TypeScript1.flagsToString = flagsToString;
})(TypeScript || (TypeScript = {
}));
