var TypeScript1;
!function(TypeScript) {
    var GetAstPathOptions, GetAstPathOptions1;
    function lastOf(items) {
        return null === items || 0 === items.length ? null : items[items.length - 1];
    }
    function max(a, b) {
        return a >= b ? a : b;
    }
    TypeScript.lastOf = lastOf, TypeScript.max = max, TypeScript.min = function(a, b) {
        return a <= b ? a : b;
    };
    class AstPath {
        static reverseIndexOf(items, index) {
            return null === items || items.length <= index ? null : items[items.length - index - 1];
        }
        clone() {
            var clone = new AstPath();
            return clone.asts = this.asts.map((value)=>value
            ), clone.top = this.top, clone;
        }
        pop() {
            var head = this.ast();
            for(this.up(); this.asts.length > this.count();)this.asts.pop();
            return head;
        }
        push(ast1) {
            for(; this.asts.length > this.count();)this.asts.pop();
            this.top = this.asts.length, this.asts.push(ast1);
        }
        up() {
            if (this.top <= -1) throw new Error("Invalid call to 'up'");
            this.top--;
        }
        down() {
            if (this.top == this.ast.length - 1) throw new Error("Invalid call to 'down'");
            this.top++;
        }
        nodeType() {
            return null == this.ast() ? TypeScript1.NodeType.None : this.ast().nodeType;
        }
        ast() {
            return AstPath.reverseIndexOf(this.asts, this.asts.length - (this.top + 1));
        }
        parent() {
            return AstPath.reverseIndexOf(this.asts, this.asts.length - this.top);
        }
        count() {
            return this.top + 1;
        }
        get(index1) {
            return this.asts[index1];
        }
        isNameOfClass() {
            return null !== this.ast() && null !== this.parent() && this.ast().nodeType === TypeScript1.NodeType.Name && this.parent().nodeType === TypeScript1.NodeType.ClassDeclaration && this.parent().name === this.ast();
        }
        isNameOfInterface() {
            return null !== this.ast() && null !== this.parent() && this.ast().nodeType === TypeScript1.NodeType.Name && this.parent().nodeType === TypeScript1.NodeType.InterfaceDeclaration && this.parent().name === this.ast();
        }
        isNameOfArgument() {
            return null !== this.ast() && null !== this.parent() && this.ast().nodeType === TypeScript1.NodeType.Name && this.parent().nodeType === TypeScript1.NodeType.ArgDecl && this.parent().id === this.ast();
        }
        isNameOfVariable() {
            return null !== this.ast() && null !== this.parent() && this.ast().nodeType === TypeScript1.NodeType.Name && this.parent().nodeType === TypeScript1.NodeType.VarDecl && this.parent().id === this.ast();
        }
        isNameOfModule() {
            return null !== this.ast() && null !== this.parent() && this.ast().nodeType === TypeScript1.NodeType.Name && this.parent().nodeType === TypeScript1.NodeType.ModuleDeclaration && this.parent().name === this.ast();
        }
        isNameOfFunction() {
            return null !== this.ast() && null !== this.parent() && this.ast().nodeType === TypeScript1.NodeType.Name && this.parent().nodeType === TypeScript1.NodeType.FuncDecl && this.parent().name === this.ast();
        }
        isChildOfScript() {
            var ast = lastOf(this.asts);
            return this.count() >= 3 && this.asts[this.top] === ast && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.List && this.asts[this.top - 2].nodeType === TypeScript1.NodeType.Script;
        }
        isChildOfModule() {
            var ast = lastOf(this.asts);
            return this.count() >= 3 && this.asts[this.top] === ast && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.List && this.asts[this.top - 2].nodeType === TypeScript1.NodeType.ModuleDeclaration;
        }
        isChildOfClass() {
            var ast = lastOf(this.asts);
            return this.count() >= 3 && this.asts[this.top] === ast && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.List && this.asts[this.top - 2].nodeType === TypeScript1.NodeType.ClassDeclaration;
        }
        isArgumentOfClassConstructor() {
            var ast = lastOf(this.asts);
            return this.count() >= 5 && this.asts[this.top] === ast && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.List && this.asts[this.top - 2].nodeType === TypeScript1.NodeType.FuncDecl && this.asts[this.top - 3].nodeType === TypeScript1.NodeType.List && this.asts[this.top - 4].nodeType === TypeScript1.NodeType.ClassDeclaration && this.asts[this.top - 2].isConstructor && this.asts[this.top - 2].arguments === this.asts[this.top - 1] && this.asts[this.top - 4].constructorDecl === this.asts[this.top - 2];
        }
        isChildOfInterface() {
            var ast = lastOf(this.asts);
            return this.count() >= 3 && this.asts[this.top] === ast && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.List && this.asts[this.top - 2].nodeType === TypeScript1.NodeType.InterfaceDeclaration;
        }
        isTopLevelImplicitModule() {
            return this.count() >= 1 && this.asts[this.top].nodeType === TypeScript1.NodeType.ModuleDeclaration && TypeScript1.hasFlag(this.asts[this.top].modFlags, TypeScript1.ModuleFlags.IsWholeFile);
        }
        isBodyOfTopLevelImplicitModule() {
            return this.count() >= 2 && this.asts[this.top - 0].nodeType === TypeScript1.NodeType.List && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.ModuleDeclaration && this.asts[this.top - 1].members == this.asts[this.top - 0] && TypeScript1.hasFlag(this.asts[this.top - 1].modFlags, TypeScript1.ModuleFlags.IsWholeFile);
        }
        isBodyOfScript() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.Script && this.asts[this.top - 1].bod == this.asts[this.top - 0];
        }
        isBodyOfSwitch() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.Switch && this.asts[this.top - 1].caseList == this.asts[this.top - 0];
        }
        isBodyOfModule() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.ModuleDeclaration && this.asts[this.top - 1].members == this.asts[this.top - 0];
        }
        isBodyOfClass() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.ClassDeclaration && this.asts[this.top - 1].members == this.asts[this.top - 0];
        }
        isBodyOfFunction() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.FuncDecl && this.asts[this.top - 1].bod == this.asts[this.top - 0];
        }
        isBodyOfInterface() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.InterfaceDeclaration && this.asts[this.top - 1].members == this.asts[this.top - 0];
        }
        isBodyOfBlock() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.Block && this.asts[this.top - 1].statements == this.asts[this.top - 0];
        }
        isBodyOfFor() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.For && this.asts[this.top - 1].body == this.asts[this.top - 0];
        }
        isBodyOfCase() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.Case && this.asts[this.top - 1].body == this.asts[this.top - 0];
        }
        isBodyOfTry() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.Try && this.asts[this.top - 1].body == this.asts[this.top - 0];
        }
        isBodyOfCatch() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.Catch && this.asts[this.top - 1].body == this.asts[this.top - 0];
        }
        isBodyOfDoWhile() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.DoWhile && this.asts[this.top - 1].body == this.asts[this.top - 0];
        }
        isBodyOfWhile() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.While && this.asts[this.top - 1].body == this.asts[this.top - 0];
        }
        isBodyOfForIn() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.ForIn && this.asts[this.top - 1].body == this.asts[this.top - 0];
        }
        isBodyOfWith() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.With && this.asts[this.top - 1].body == this.asts[this.top - 0];
        }
        isBodyOfFinally() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.Finally && this.asts[this.top - 1].body == this.asts[this.top - 0];
        }
        isCaseOfSwitch() {
            return this.count() >= 3 && this.asts[this.top - 2].nodeType === TypeScript1.NodeType.Switch && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.List && this.asts[this.top - 2].caseList == this.asts[this.top - 1];
        }
        isDefaultCaseOfSwitch() {
            return this.count() >= 3 && this.asts[this.top - 2].nodeType === TypeScript1.NodeType.Switch && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.List && this.asts[this.top - 2].caseList == this.asts[this.top - 1] && this.asts[this.top - 2].defaultCase == this.asts[this.top - 0];
        }
        isListOfObjectLit() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.ObjectLit && this.asts[this.top - 0].nodeType === TypeScript1.NodeType.List && this.asts[this.top - 1].operand == this.asts[this.top - 0];
        }
        isBodyOfObjectLit() {
            return this.isListOfObjectLit();
        }
        isEmptyListOfObjectLit() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.ObjectLit && this.asts[this.top - 0].nodeType === TypeScript1.NodeType.List && this.asts[this.top - 1].operand == this.asts[this.top - 0] && 0 == this.asts[this.top - 0].members.length;
        }
        isMemberOfObjectLit() {
            return this.count() >= 3 && this.asts[this.top - 2].nodeType === TypeScript1.NodeType.ObjectLit && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.List && this.asts[this.top - 0].nodeType === TypeScript1.NodeType.Member && this.asts[this.top - 2].operand == this.asts[this.top - 1];
        }
        isNameOfMemberOfObjectLit() {
            return this.count() >= 4 && this.asts[this.top - 3].nodeType === TypeScript1.NodeType.ObjectLit && this.asts[this.top - 2].nodeType === TypeScript1.NodeType.List && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.Member && this.asts[this.top - 0].nodeType === TypeScript1.NodeType.Name && this.asts[this.top - 3].operand == this.asts[this.top - 2];
        }
        isListOfArrayLit() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.ArrayLit && this.asts[this.top - 0].nodeType === TypeScript1.NodeType.List && this.asts[this.top - 1].operand == this.asts[this.top - 0];
        }
        isTargetOfMember() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.Member && this.asts[this.top - 1].operand1 === this.asts[this.top - 0];
        }
        isMemberOfMember() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.Member && this.asts[this.top - 1].operand2 === this.asts[this.top - 0];
        }
        isItemOfList() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.List;
        }
        isThenOfIf() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.If && this.asts[this.top - 1].thenBod == this.asts[this.top - 0];
        }
        isElseOfIf() {
            return this.count() >= 2 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.If && this.asts[this.top - 1].elseBod == this.asts[this.top - 0];
        }
        isBodyOfDefaultCase() {
            return this.isBodyOfCase();
        }
        isSingleStatementList() {
            return this.count() >= 1 && this.asts[this.top].nodeType === TypeScript1.NodeType.List && 1 === this.asts[this.top].members.length;
        }
        isArgumentListOfFunction() {
            return this.count() >= 2 && this.asts[this.top - 0].nodeType === TypeScript1.NodeType.List && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.FuncDecl && this.asts[this.top - 1].arguments === this.asts[this.top - 0];
        }
        isArgumentOfFunction() {
            return this.count() >= 3 && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.List && this.asts[this.top - 2].nodeType === TypeScript1.NodeType.FuncDecl && this.asts[this.top - 2].arguments === this.asts[this.top - 1];
        }
        isArgumentListOfCall() {
            return this.count() >= 2 && this.asts[this.top - 0].nodeType === TypeScript1.NodeType.List && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.Call && this.asts[this.top - 1].arguments === this.asts[this.top - 0];
        }
        isArgumentListOfNew() {
            return this.count() >= 2 && this.asts[this.top - 0].nodeType === TypeScript1.NodeType.List && this.asts[this.top - 1].nodeType === TypeScript1.NodeType.New && this.asts[this.top - 1].arguments === this.asts[this.top - 0];
        }
        isSynthesizedBlock() {
            return this.count() >= 1 && this.asts[this.top - 0].nodeType === TypeScript1.NodeType.Block && !1 === this.asts[this.top - 0].isStatementBlock;
        }
        constructor(){
            this.asts = [], this.top = -1;
        }
    }
    function isValidAstNode(ast) {
        return null !== ast && -1 !== ast.minChar && -1 !== ast.limChar;
    }
    TypeScript.AstPath = AstPath, TypeScript.isValidAstNode = isValidAstNode;
    class AstPathContext {
        constructor(){
            this.path = new TypeScript1.AstPath();
        }
    }
    TypeScript.AstPathContext = AstPathContext, (GetAstPathOptions1 = GetAstPathOptions || (GetAstPathOptions = {
    }))[GetAstPathOptions1.Default = 0] = "Default", GetAstPathOptions1[GetAstPathOptions1.EdgeInclusive = 1] = "EdgeInclusive", GetAstPathOptions1[GetAstPathOptions1.DontPruneSearchBasedOnPosition = 2] = "DontPruneSearchBasedOnPosition", TypeScript.getAstPathToPosition = function(script, pos, options = GetAstPathOptions.Default) {
        var lookInComments = (comments)=>{
            if (comments && comments.length > 0) for(var i = 0; i < comments.length; i++){
                var minChar = comments[i].minChar, limChar = comments[i].limChar;
                !comments[i].isBlockComment && limChar++, pos >= minChar && pos < limChar && ctx.path.push(comments[i]);
            }
        }, pre = function(cur, parent, walker) {
            if (isValidAstNode(cur)) {
                var inclusive = hasFlag(options, GetAstPathOptions.EdgeInclusive) || cur.nodeType === TypeScript1.NodeType.Name || pos === script.limChar, minChar = cur.minChar, limChar = cur.limChar + (inclusive ? 1 : 0);
                if (pos >= minChar && pos < limChar) {
                    var previous = ctx.path.ast();
                    (null == previous || cur.minChar >= previous.minChar && cur.limChar <= previous.limChar) && ctx.path.push(cur);
                }
                pos < limChar && lookInComments(cur.preComments), pos >= minChar && lookInComments(cur.postComments), hasFlag(options, GetAstPathOptions.DontPruneSearchBasedOnPosition) || (walker.options.goChildren = minChar <= pos && pos <= limChar);
            }
            return cur;
        }, ctx = new AstPathContext();
        return TypeScript1.getAstWalkerFactory().walk(script, pre, null, null, ctx), ctx.path;
    }, TypeScript.getTokenizationOffset = function(script, position) {
        var bestOffset = 0, pre = (cur, parent, walker)=>(TypeScript1.isValidAstNode(cur) && (cur.minChar <= position && (bestOffset = max(bestOffset, cur.minChar)), (cur.minChar > position || cur.limChar < bestOffset) && (walker.options.goChildren = !1)), cur)
        ;
        return TypeScript1.getAstWalkerFactory().walk(script, pre), bestOffset;
    }, TypeScript.walkAST = function(ast, callback) {
        var path1 = new AstPath();
        TypeScript1.getAstWalkerFactory().walk(ast, function(cur, parent, walker) {
            var path = walker.state;
            return path.push(cur), callback(path, walker), cur;
        }, function(cur, parent, walker) {
            return walker.state.pop(), cur;
        }, null, path1);
    }, TypeScript.GetAstPathOptions = GetAstPathOptions;
}(TypeScript1 || (TypeScript1 = {
}));
