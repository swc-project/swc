//// [parserRealSource14.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var TypeScript, GetAstPathOptions, TypeScript1 = TypeScript || (TypeScript = {});
function lastOf(items) {
    return null === items || 0 === items.length ? null : items[items.length - 1];
}
function max(a, b) {
    return a >= b ? a : b;
}
TypeScript1.lastOf = lastOf, TypeScript1.max = max, TypeScript1.min = function(a, b) {
    return a <= b ? a : b;
};
var AstPath = /*#__PURE__*/ function() {
    function AstPath() {
        _class_call_check(this, AstPath), this.asts = [], this.top = -1;
    }
    var _proto = AstPath.prototype;
    return _proto.clone = function() {
        var clone = new AstPath();
        return clone.asts = this.asts.map(function(value) {
            return value;
        }), clone.top = this.top, clone;
    }, _proto.pop = function() {
        var head = this.ast();
        for(this.up(); this.asts.length > this.count();)this.asts.pop();
        return head;
    }, _proto.push = function(ast) {
        for(; this.asts.length > this.count();)this.asts.pop();
        this.top = this.asts.length, this.asts.push(ast);
    }, _proto.up = function() {
        if (this.top <= -1) throw Error("Invalid call to 'up'");
        this.top--;
    }, _proto.down = function() {
        if (this.top == this.ast.length - 1) throw Error("Invalid call to 'down'");
        this.top++;
    }, _proto.nodeType = function() {
        return null == this.ast() ? TypeScript1.NodeType.None : this.ast().nodeType;
    }, _proto.ast = function() {
        return AstPath.reverseIndexOf(this.asts, this.asts.length - (this.top + 1));
    }, _proto.parent = function() {
        return AstPath.reverseIndexOf(this.asts, this.asts.length - this.top);
    }, _proto.count = function() {
        return this.top + 1;
    }, _proto.get = function(index) {
        return this.asts[index];
    }, _proto.isNameOfClass = function() {
        return null !== this.ast() && null !== this.parent() && this.ast().nodeType === TypeScript1.NodeType.Name && this.parent().nodeType === TypeScript1.NodeType.ClassDeclaration && this.parent().name === this.ast();
    }, _proto.isNameOfInterface = function() {
        return null !== this.ast() && null !== this.parent() && this.ast().nodeType === TypeScript1.NodeType.Name && this.parent().nodeType === TypeScript1.NodeType.InterfaceDeclaration && this.parent().name === this.ast();
    }, _proto.isNameOfArgument = function() {
        return null !== this.ast() && null !== this.parent() && this.ast().nodeType === TypeScript1.NodeType.Name && this.parent().nodeType === TypeScript1.NodeType.ArgDecl && this.parent().id === this.ast();
    }, _proto.isNameOfVariable = function() {
        return null !== this.ast() && null !== this.parent() && this.ast().nodeType === TypeScript1.NodeType.Name && this.parent().nodeType === TypeScript1.NodeType.VarDecl && this.parent().id === this.ast();
    }, _proto.isNameOfModule = function() {
        return null !== this.ast() && null !== this.parent() && this.ast().nodeType === TypeScript1.NodeType.Name && this.parent().nodeType === TypeScript1.NodeType.ModuleDeclaration && this.parent().name === this.ast();
    }, _proto.isNameOfFunction = function() {
        return null !== this.ast() && null !== this.parent() && this.ast().nodeType === TypeScript1.NodeType.Name && this.parent().nodeType === TypeScript1.NodeType.FuncDecl && this.parent().name === this.ast();
    }, _proto.isChildOfScript = function() {
        var ast = lastOf(this.asts);
        return this.count() >= 3 && this.asts[this.top] === ast && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.List && this.asts[this.top - 2].nodeType === TypeScript1.NodeType.Script;
    }, _proto.isChildOfModule = function() {
        var ast = lastOf(this.asts);
        return this.count() >= 3 && this.asts[this.top] === ast && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.List && this.asts[this.top - 2].nodeType === TypeScript1.NodeType.ModuleDeclaration;
    }, _proto.isChildOfClass = function() {
        var ast = lastOf(this.asts);
        return this.count() >= 3 && this.asts[this.top] === ast && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.List && this.asts[this.top - 2].nodeType === TypeScript1.NodeType.ClassDeclaration;
    }, _proto.isArgumentOfClassConstructor = function() {
        var ast = lastOf(this.asts);
        return this.count() >= 5 && this.asts[this.top] === ast && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.List && this.asts[this.top - 2].nodeType === TypeScript1.NodeType.FuncDecl && this.asts[this.top - 3].nodeType === TypeScript1.NodeType.List && this.asts[this.top - 4].nodeType === TypeScript1.NodeType.ClassDeclaration && this.asts[this.top - 2].isConstructor && this.asts[this.top - 2].arguments === this.asts[this.top - 1] && this.asts[this.top - 4].constructorDecl === this.asts[this.top - 2];
    }, _proto.isChildOfInterface = function() {
        var ast = lastOf(this.asts);
        return this.count() >= 3 && this.asts[this.top] === ast && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.List && this.asts[this.top - 2].nodeType === TypeScript1.NodeType.InterfaceDeclaration;
    }, _proto.isTopLevelImplicitModule = function() {
        return this.count() >= 1 && this.asts[this.top].nodeType === TypeScript1.NodeType.ModuleDeclaration && TypeScript1.hasFlag(this.asts[this.top].modFlags, TypeScript1.ModuleFlags.IsWholeFile);
    }, _proto.isBodyOfTopLevelImplicitModule = function() {
        return this.count() >= 2 && this.asts[this.top - 0].nodeType === TypeScript1.NodeType.List && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.ModuleDeclaration && this.asts[this.top - 1].members == this.asts[this.top - 0] && TypeScript1.hasFlag(this.asts[this.top - 1].modFlags, TypeScript1.ModuleFlags.IsWholeFile);
    }, _proto.isBodyOfScript = function() {
        return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.Script && this.asts[this.top - 1].bod == this.asts[this.top - 0];
    }, _proto.isBodyOfSwitch = function() {
        return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.Switch && this.asts[this.top - 1].caseList == this.asts[this.top - 0];
    }, _proto.isBodyOfModule = function() {
        return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.ModuleDeclaration && this.asts[this.top - 1].members == this.asts[this.top - 0];
    }, _proto.isBodyOfClass = function() {
        return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.ClassDeclaration && this.asts[this.top - 1].members == this.asts[this.top - 0];
    }, _proto.isBodyOfFunction = function() {
        return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.FuncDecl && this.asts[this.top - 1].bod == this.asts[this.top - 0];
    }, _proto.isBodyOfInterface = function() {
        return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.InterfaceDeclaration && this.asts[this.top - 1].members == this.asts[this.top - 0];
    }, _proto.isBodyOfBlock = function() {
        return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.Block && this.asts[this.top - 1].statements == this.asts[this.top - 0];
    }, _proto.isBodyOfFor = function() {
        return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.For && this.asts[this.top - 1].body == this.asts[this.top - 0];
    }, _proto.isBodyOfCase = function() {
        return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.Case && this.asts[this.top - 1].body == this.asts[this.top - 0];
    }, _proto.isBodyOfTry = function() {
        return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.Try && this.asts[this.top - 1].body == this.asts[this.top - 0];
    }, _proto.isBodyOfCatch = function() {
        return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.Catch && this.asts[this.top - 1].body == this.asts[this.top - 0];
    }, _proto.isBodyOfDoWhile = function() {
        return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.DoWhile && this.asts[this.top - 1].body == this.asts[this.top - 0];
    }, _proto.isBodyOfWhile = function() {
        return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.While && this.asts[this.top - 1].body == this.asts[this.top - 0];
    }, _proto.isBodyOfForIn = function() {
        return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.ForIn && this.asts[this.top - 1].body == this.asts[this.top - 0];
    }, _proto.isBodyOfWith = function() {
        return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.With && this.asts[this.top - 1].body == this.asts[this.top - 0];
    }, _proto.isBodyOfFinally = function() {
        return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.Finally && this.asts[this.top - 1].body == this.asts[this.top - 0];
    }, _proto.isCaseOfSwitch = function() {
        return this.count() >= 3 && this.asts[this.top - 2].nodeType === TypeScript1.NodeType.Switch && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.List && this.asts[this.top - 2].caseList == this.asts[this.top - 1];
    }, _proto.isDefaultCaseOfSwitch = function() {
        return this.count() >= 3 && this.asts[this.top - 2].nodeType === TypeScript1.NodeType.Switch && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.List && this.asts[this.top - 2].caseList == this.asts[this.top - 1] && this.asts[this.top - 2].defaultCase == this.asts[this.top - 0];
    }, _proto.isListOfObjectLit = function() {
        return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.ObjectLit && this.asts[this.top - 0].nodeType === TypeScript1.NodeType.List && this.asts[this.top - 1].operand == this.asts[this.top - 0];
    }, _proto.isBodyOfObjectLit = function() {
        return this.isListOfObjectLit();
    }, _proto.isEmptyListOfObjectLit = function() {
        return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.ObjectLit && this.asts[this.top - 0].nodeType === TypeScript1.NodeType.List && this.asts[this.top - 1].operand == this.asts[this.top - 0] && 0 == this.asts[this.top - 0].members.length;
    }, _proto.isMemberOfObjectLit = function() {
        return this.count() >= 3 && this.asts[this.top - 2].nodeType === TypeScript1.NodeType.ObjectLit && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.List && this.asts[this.top - 0].nodeType === TypeScript1.NodeType.Member && this.asts[this.top - 2].operand == this.asts[this.top - 1];
    }, _proto.isNameOfMemberOfObjectLit = function() {
        return this.count() >= 4 && this.asts[this.top - 3].nodeType === TypeScript1.NodeType.ObjectLit && this.asts[this.top - 2].nodeType === TypeScript1.NodeType.List && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.Member && this.asts[this.top - 0].nodeType === TypeScript1.NodeType.Name && this.asts[this.top - 3].operand == this.asts[this.top - 2];
    }, _proto.isListOfArrayLit = function() {
        return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.ArrayLit && this.asts[this.top - 0].nodeType === TypeScript1.NodeType.List && this.asts[this.top - 1].operand == this.asts[this.top - 0];
    }, _proto.isTargetOfMember = function() {
        return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.Member && this.asts[this.top - 1].operand1 === this.asts[this.top - 0];
    }, _proto.isMemberOfMember = function() {
        return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.Member && this.asts[this.top - 1].operand2 === this.asts[this.top - 0];
    }, _proto.isItemOfList = function() {
        return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.List;
    }, _proto.isThenOfIf = function() {
        return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.If && this.asts[this.top - 1].thenBod == this.asts[this.top - 0];
    }, _proto.isElseOfIf = function() {
        return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.If && this.asts[this.top - 1].elseBod == this.asts[this.top - 0];
    }, _proto.isBodyOfDefaultCase = function() {
        return this.isBodyOfCase();
    }, _proto.isSingleStatementList = function() {
        return this.count() >= 1 && this.asts[this.top].nodeType === TypeScript1.NodeType.List && 1 === this.asts[this.top].members.length;
    }, _proto.isArgumentListOfFunction = function() {
        return this.count() >= 2 && this.asts[this.top - 0].nodeType === TypeScript1.NodeType.List && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.FuncDecl && this.asts[this.top - 1].arguments === this.asts[this.top - 0];
    }, _proto.isArgumentOfFunction = function() {
        return this.count() >= 3 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.List && this.asts[this.top - 2].nodeType === TypeScript1.NodeType.FuncDecl && this.asts[this.top - 2].arguments === this.asts[this.top - 1];
    }, _proto.isArgumentListOfCall = function() {
        return this.count() >= 2 && this.asts[this.top - 0].nodeType === TypeScript1.NodeType.List && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.Call && this.asts[this.top - 1].arguments === this.asts[this.top - 0];
    }, _proto.isArgumentListOfNew = function() {
        return this.count() >= 2 && this.asts[this.top - 0].nodeType === TypeScript1.NodeType.List && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.New && this.asts[this.top - 1].arguments === this.asts[this.top - 0];
    }, _proto.isSynthesizedBlock = function() {
        return this.count() >= 1 && this.asts[this.top - 0].nodeType === TypeScript1.NodeType.Block && !1 === this.asts[this.top - 0].isStatementBlock;
    }, AstPath.reverseIndexOf = function(items, index) {
        return null === items || items.length <= index ? null : items[items.length - index - 1];
    }, AstPath;
}();
function isValidAstNode(ast) {
    return null !== ast && -1 !== ast.minChar && -1 !== ast.limChar;
}
TypeScript1.AstPath = AstPath, TypeScript1.isValidAstNode = isValidAstNode;
var AstPathContext = function AstPathContext() {
    _class_call_check(this, AstPathContext), this.path = new TypeScript1.AstPath();
};
TypeScript1.AstPathContext = AstPathContext, (GetAstPathOptions = TypeScript1.GetAstPathOptions || (TypeScript1.GetAstPathOptions = {}))[GetAstPathOptions.Default = 0] = "Default", GetAstPathOptions[GetAstPathOptions.EdgeInclusive = 1] = "EdgeInclusive", GetAstPathOptions[GetAstPathOptions.DontPruneSearchBasedOnPosition = 2] = "DontPruneSearchBasedOnPosition", TypeScript1.getAstPathToPosition = function(script, pos) {
    var options = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0, lookInComments = function(comments) {
        if (comments && comments.length > 0) for(var i = 0; i < comments.length; i++){
            var minChar = comments[i].minChar, limChar = comments[i].limChar;
            !comments[i].isBlockComment && limChar++, pos >= minChar && pos < limChar && ctx.path.push(comments[i]);
        }
    }, ctx = new AstPathContext();
    return TypeScript1.getAstWalkerFactory().walk(script, function(cur, parent, walker) {
        if (isValidAstNode(cur)) {
            var inclusive = hasFlag(options, 1) || cur.nodeType === TypeScript1.NodeType.Name || pos === script.limChar, minChar = cur.minChar, limChar = cur.limChar + +!!inclusive;
            if (pos >= minChar && pos < limChar) {
                var previous = ctx.path.ast();
                (null == previous || cur.minChar >= previous.minChar && cur.limChar <= previous.limChar) && ctx.path.push(cur);
            }
            pos < limChar && lookInComments(cur.preComments), pos >= minChar && lookInComments(cur.postComments), hasFlag(options, 2) || (walker.options.goChildren = minChar <= pos && pos <= limChar);
        }
        return cur;
    }, null, null, ctx), ctx.path;
}, TypeScript1.getTokenizationOffset = function(script, position) {
    var bestOffset = 0;
    return TypeScript1.getAstWalkerFactory().walk(script, function(cur, parent, walker) {
        return TypeScript1.isValidAstNode(cur) && (cur.minChar <= position && (bestOffset = max(bestOffset, cur.minChar)), (cur.minChar > position || cur.limChar < bestOffset) && (walker.options.goChildren = !1)), cur;
    }), bestOffset;
}, TypeScript1.walkAST = function(ast, callback) {
    var path = new AstPath();
    TypeScript1.getAstWalkerFactory().walk(ast, function(cur, parent, walker) {
        var path = walker.state;
        return path.push(cur), callback(path, walker), cur;
    }, function(cur, parent, walker) {
        return walker.state.pop(), cur;
    }, null, path);
};
