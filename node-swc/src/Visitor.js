"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Visitor = /** @class */ (function () {
    function Visitor() {
    }
    Visitor.prototype.visitProgram = function (n) {
        switch (n.type) {
            case "Module":
                return this.visitModule(n);
            case "Script":
                return this.visitScript(n);
        }
    };
    Visitor.prototype.visitModule = function (m) {
        m.body = this.visitModuleItems(m.body);
        return m;
    };
    Visitor.prototype.visitScript = function (m) {
        m.body = this.visitStatements(m.body);
        return m;
    };
    Visitor.prototype.visitModuleItems = function (items) {
        return items.map(this.visitModuleItem.bind(this));
    };
    Visitor.prototype.visitModuleItem = function (n) {
        switch (n.type) {
            case "ExportDeclaration":
            case "ExportDefaultDeclaration":
            case "ExportNamedDeclaration":
            case "ExportDefaultExpression":
            case "ImportDeclaration":
            case "ExportAllDeclaration":
            case "TsImportEqualsDeclaration":
            case "TsExportAssignment":
            case "TsNamespaceExportDeclaration":
                return this.visitModuleDeclaration(n);
            default:
                return this.visitStatement(n);
        }
    };
    Visitor.prototype.visitModuleDeclaration = function (n) {
        switch (n.type) {
            case "ExportDeclaration":
                return this.visitExportDeclaration(n);
            case "ExportDefaultDeclaration":
                return this.visitExportDefaultDeclaration(n);
            case "ExportNamedDeclaration":
                return this.visitExportNamedDeclration(n);
            case "ExportDefaultExpression":
                return this.visitExportDefaultExpression(n);
            case "ImportDeclaration":
                return this.visitImportDeclaration(n);
            case "ExportAllDeclaration":
                return this.visitExportAllDeclration(n);
            case "TsImportEqualsDeclaration":
                return this.visitTsImportEqualsDeclaration(n);
            case "TsExportAssignment":
                return this.visitTsExportAssignment(n);
            case "TsNamespaceExportDeclaration":
                return this.visitTsNamespaceExportDeclaration(n);
        }
    };
    Visitor.prototype.visitTsNamespaceExportDeclaration = function (n) {
        n.id = this.visitBindingIdentifier(n.id);
        return n;
    };
    Visitor.prototype.visitTsExportAssignment = function (n) {
        n.expression = this.visitExpression(n.expression);
        return n;
    };
    Visitor.prototype.visitTsImportEqualsDeclaration = function (n) {
        n.id = this.visitBindingIdentifier(n.id);
        n.moduleRef = this.visitTsModuleReference(n.moduleRef);
        return n;
    };
    Visitor.prototype.visitTsModuleReference = function (n) {
        switch (n.type) {
            case "Identifier":
                return this.visitIdentifierReference(n);
            case "TsExternalModuleReference":
                return this.visitTsExternalModuleReference(n);
            case "TsQualifiedName":
                return this.visitTsQualifiedName(n);
        }
    };
    Visitor.prototype.visitTsExternalModuleReference = function (n) {
        n.expression = this.visitExpression(n.expression);
        return n;
    };
    Visitor.prototype.visitExportAllDeclration = function (n) {
        n.source = this.visitStringLiteral(n.source);
        return n;
    };
    Visitor.prototype.visitExportDefaultExpression = function (n) {
        n.expression = this.visitExpression(n.expression);
        return n;
    };
    Visitor.prototype.visitExportNamedDeclration = function (n) {
        n.specifiers = this.visitExportSpecifiers(n.specifiers);
        n.source = this.visitOptionalStringLiteral(n.source);
        return n;
    };
    Visitor.prototype.visitExportSpecifiers = function (nodes) {
        return nodes.map(this.visitExportSpecifier.bind(this));
    };
    Visitor.prototype.visitExportSpecifier = function (n) {
        switch (n.type) {
            case "ExportDefaultSpecifier":
                return this.visitExportDefaultSpecifier(n);
            case "ExportNamespaceSpecifer":
                return this.visitExportNamespaceSpecifier(n);
            case "ExportSpecifier":
                return this.visitNamedExportSpecifier(n);
        }
    };
    Visitor.prototype.visitNamedExportSpecifier = function (n) {
        if (n.exported) {
            n.exported = this.visitBindingIdentifier(n.exported);
        }
        n.orig = this.visitIdentifierReference(n.orig);
        return n;
    };
    Visitor.prototype.visitExportNamespaceSpecifier = function (n) {
        n.name = this.visitBindingIdentifier(n.name);
        return n;
    };
    Visitor.prototype.visitExportDefaultSpecifier = function (n) {
        n.exported = this.visitBindingIdentifier(n.exported);
        return n;
    };
    Visitor.prototype.visitOptionalStringLiteral = function (n) {
        if (n) {
            return this.visitStringLiteral(n);
        }
    };
    Visitor.prototype.visitExportDefaultDeclaration = function (n) {
        n.decl = this.visitDefaultDeclaration(n.decl);
        return n;
    };
    Visitor.prototype.visitDefaultDeclaration = function (n) {
        switch (n.type) {
            case "ClassExpression":
                return this.visitClassExpression(n);
            case "FunctionExpression":
                return this.visitFunctionExpression(n);
            case "TsInterfaceDeclaration":
                return this.visitTsInterfaceDeclaration(n);
        }
    };
    Visitor.prototype.visitFunctionExpression = function (n) {
        n = this.visitFunction(n);
        if (n.identifier) {
            n.identifier = this.visitBindingIdentifier(n.identifier);
        }
        return n;
    };
    Visitor.prototype.visitClassExpression = function (n) {
        n = this.visitClass(n);
        if (n.identifier) {
            n.identifier = this.visitBindingIdentifier(n.identifier);
        }
        return n;
    };
    Visitor.prototype.visitExportDeclaration = function (n) {
        n.declaration = this.visitDeclaration(n.declaration);
        return n;
    };
    Visitor.prototype.visitArrayExpression = function (e) {
        if (e.elements) {
            e.elements = e.elements.map(this.visitArrayElement.bind(this));
        }
        return e;
    };
    Visitor.prototype.visitArrayElement = function (e) {
        if (e && e.type === "SpreadElement") {
            return this.visitSpreadElement(e);
        }
        return this.visitOptionalExpression(e);
    };
    Visitor.prototype.visitSpreadElement = function (e) {
        e.arguments = this.visitExpression(e.arguments);
        return e;
    };
    Visitor.prototype.visitOptionalExpression = function (e) {
        if (e) {
            return this.visitExpression(e);
        }
    };
    Visitor.prototype.visitArrowFunctionExpression = function (e) {
        e.body = this.visitArrowBody(e.body);
        e.params = this.visitPatterns(e.params);
        e.returnType = this.visitTsTypeAnnotation(e.returnType);
        e.typeParameters = this.visitTsTypeParameterDeclaration(e.typeParameters);
        return e;
    };
    Visitor.prototype.visitArrowBody = function (body) {
        switch (body.type) {
            case "BlockStatement":
                return this.visitBlockStatement(body);
            default:
                return this.visitExpression(body);
        }
    };
    Visitor.prototype.visitBlockStatement = function (block) {
        block.stmts = this.visitStatements(block.stmts);
        return block;
    };
    Visitor.prototype.visitStatements = function (stmts) {
        return stmts.map(this.visitStatement.bind(this));
    };
    Visitor.prototype.visitStatement = function (stmt) {
        switch (stmt.type) {
            case "ClassDeclaration":
            case "FunctionDeclaration":
            case "TsEnumDeclaration":
            case "TsInterfaceDeclaration":
            case "TsModuleDeclaration":
            case "TsTypeAliasDeclaration":
            case "VariableDeclaration":
                return this.visitDeclaration(stmt);
            case "BreakStatement":
                return this.visitBreakStatement(stmt);
            case "BlockStatement":
                return this.visitBlockStatement(stmt);
            case "ContinueStatement":
                return this.visitContinueStatement(stmt);
            case "DebuggerStatement":
                return this.visitDebuggerStatement(stmt);
            case "DoWhileStatement":
                return this.visitDoWhileStatement(stmt);
            case "EmptyStatement":
                return this.visitEmptyStatement(stmt);
            case "ForInStatement":
                return this.visitForInStatement(stmt);
            case "ForOfStatement":
                return this.visitForOfStatement(stmt);
            case "ForStatement":
                return this.visitForStatement(stmt);
            case "IfStatement":
                return this.visitIfStatement(stmt);
            case "LabeledStatement":
                return this.visitLabeledStatement(stmt);
            case "ReturnStatement":
                return this.visitReturnStatement(stmt);
            case "SwitchStatement":
                return this.visitSwitchStatement(stmt);
            case "ThrowStatement":
                return this.visitThrowStatement(stmt);
            case "TryStatement":
                return this.visitTryStatement(stmt);
            case "WhileStatement":
                return this.visitWhileStatement(stmt);
            case "WithStatement":
                return this.visitWithStatement(stmt);
            case "ExpressionStatement":
                return this.visitExpressionStatement(stmt);
            default:
                throw new Error("Unknown statement type: " + stmt.type);
        }
    };
    Visitor.prototype.visitSwitchStatement = function (stmt) {
        stmt.discriminant = this.visitExpression(stmt.discriminant);
        stmt.cases = this.visitSwitchCases(stmt.cases);
        return stmt;
    };
    Visitor.prototype.visitSwitchCases = function (cases) {
        return cases.map(this.visitSwitchCase.bind(this));
    };
    Visitor.prototype.visitSwitchCase = function (c) {
        c.test = this.visitOptionalExpression(c.test);
        c.consequent = this.visitStatements(c.consequent);
        return c;
    };
    Visitor.prototype.visitIfStatement = function (stmt) {
        stmt.test = this.visitExpression(stmt.test);
        stmt.consequent = this.visitStatement(stmt.consequent);
        stmt.alternate = this.visitOptionalStatement(stmt.alternate);
        return stmt;
    };
    Visitor.prototype.visitOptionalStatement = function (stmt) {
        if (stmt) {
            return this.visitStatement(stmt);
        }
    };
    Visitor.prototype.visitBreakStatement = function (stmt) {
        if (stmt.label) {
            stmt.label = this.visitLabelIdentifier(stmt.label);
        }
        return stmt;
    };
    Visitor.prototype.visitWhileStatement = function (stmt) {
        stmt.test = this.visitExpression(stmt.test);
        stmt.body = this.visitStatement(stmt.body);
        return stmt;
    };
    Visitor.prototype.visitTryStatement = function (stmt) {
        stmt.block = this.visitBlockStatement(stmt.block);
        stmt.handler = this.visitCatchClause(stmt.handler);
        if (stmt.finalizer) {
            stmt.finalizer = this.visitBlockStatement(stmt.finalizer);
        }
        return stmt;
    };
    Visitor.prototype.visitCatchClause = function (handler) {
        if (handler) {
            if (handler.param) {
                handler.param = this.visitPattern(handler.param);
            }
            handler.body = this.visitBlockStatement(handler.body);
        }
        return handler;
    };
    Visitor.prototype.visitThrowStatement = function (stmt) {
        stmt.argument = this.visitExpression(stmt.argument);
        return stmt;
    };
    Visitor.prototype.visitReturnStatement = function (stmt) {
        if (stmt.argument) {
            stmt.argument = this.visitExpression(stmt.argument);
        }
        return stmt;
    };
    Visitor.prototype.visitLabeledStatement = function (stmt) {
        stmt.label = this.visitLabelIdentifier(stmt.label);
        stmt.body = this.visitStatement(stmt.body);
        return stmt;
    };
    Visitor.prototype.visitForStatement = function (stmt) {
        if (stmt.init) {
            if (stmt.init.type === "VariableDeclaration") {
                stmt.init = this.visitVariableDeclaration(stmt.init);
            }
            else {
                stmt.init = this.visitOptionalExpression(stmt.init);
            }
        }
        stmt.test = this.visitOptionalExpression(stmt.test);
        stmt.update = this.visitOptionalExpression(stmt.update);
        stmt.body = this.visitStatement(stmt.body);
        return stmt;
    };
    Visitor.prototype.visitForOfStatement = function (stmt) {
        if (stmt.left.type === "VariableDeclaration") {
            stmt.left = this.visitVariableDeclaration(stmt.left);
        }
        else {
            stmt.left = this.visitPattern(stmt.left);
        }
        stmt.right = this.visitExpression(stmt.right);
        stmt.body = this.visitStatement(stmt.body);
        return stmt;
    };
    Visitor.prototype.visitForInStatement = function (stmt) {
        if (stmt.left.type === "VariableDeclaration") {
            stmt.left = this.visitVariableDeclaration(stmt.left);
        }
        else {
            stmt.left = this.visitPattern(stmt.left);
        }
        stmt.right = this.visitExpression(stmt.right);
        stmt.body = this.visitStatement(stmt.body);
        return stmt;
    };
    Visitor.prototype.visitEmptyStatement = function (stmt) {
        return stmt;
    };
    Visitor.prototype.visitDoWhileStatement = function (stmt) {
        stmt.body = this.visitStatement(stmt.body);
        stmt.test = this.visitExpression(stmt.test);
        return stmt;
    };
    Visitor.prototype.visitDebuggerStatement = function (stmt) {
        return stmt;
    };
    Visitor.prototype.visitWithStatement = function (stmt) {
        stmt.object = this.visitExpression(stmt.object);
        stmt.body = this.visitStatement(stmt.body);
        return stmt;
    };
    Visitor.prototype.visitDeclaration = function (decl) {
        switch (decl.type) {
            case "ClassDeclaration":
                return this.visitClassDeclartion(decl);
            case "FunctionDeclaration":
                return this.visitFunctionDeclaration(decl);
            case "TsEnumDeclaration":
                return this.visitTsEnumDeclaration(decl);
            case "TsInterfaceDeclaration":
                return this.visitTsInterfaceDeclaration(decl);
            case "TsModuleDeclaration":
                return this.visitTsModuleDeclaration(decl);
            case "TsTypeAliasDeclaration":
                return this.visitTsTypeAliasDeclaration(decl);
            case "VariableDeclaration":
                return this.visitVariableDeclaration(decl);
        }
    };
    Visitor.prototype.visitVariableDeclaration = function (n) {
        n.declarations = this.visitVariableDeclarators(n.declarations);
        return n;
    };
    Visitor.prototype.visitVariableDeclarators = function (nodes) {
        return nodes.map(this.visitVariableDeclarator.bind(this));
    };
    Visitor.prototype.visitVariableDeclarator = function (n) {
        n.id = this.visitPattern(n.id);
        n.init = this.visitOptionalExpression(n.init);
        return n;
    };
    Visitor.prototype.visitTsTypeAliasDeclaration = function (n) {
        n.id = this.visitBindingIdentifier(n.id);
        n.typeAnnotation = this.visitTsType(n.typeAnnotation);
        n.typeParams = this.visitTsTypeParameterDeclaration(n.typeParams);
        return n;
    };
    Visitor.prototype.visitTsModuleDeclaration = function (n) {
        n.id = this.visitTsModuleName(n.id);
        if (n.body) {
            n.body = this.visitTsNamespaceBody(n.body);
        }
        return n;
    };
    Visitor.prototype.visitTsModuleName = function (n) {
        switch (n.type) {
            case "Identifier":
                return this.visitBindingIdentifier(n);
            case "StringLiteral":
                return this.visitStringLiteral(n);
        }
    };
    Visitor.prototype.visitTsNamespaceBody = function (n) {
        if (n) {
            switch (n.type) {
                case "TsModuleBlock":
                    return this.visitTsModuleBlock(n);
                case "TsNamespaceDeclaration":
                    return this.visitTsNamespaceDeclaration(n);
            }
        }
    };
    Visitor.prototype.visitTsNamespaceDeclaration = function (n) {
        var body = this.visitTsNamespaceBody(n.body);
        if (body) {
            n.body = body;
        }
        n.id = this.visitBindingIdentifier(n.id);
        return n;
    };
    Visitor.prototype.visitTsModuleBlock = function (n) {
        n.body = this.visitModuleItems(n.body);
        return n;
    };
    Visitor.prototype.visitTsInterfaceDeclaration = function (n) {
        n.id = this.visitBindingIdentifier(n.id);
        n.typeParams = this.visitTsTypeParameterDeclaration(n.typeParams);
        n.extends = this.visitTsExpressionsWithTypeArguments(n.extends);
        n.body = this.visitTsInterfaceBody(n.body);
        return n;
    };
    Visitor.prototype.visitTsInterfaceBody = function (n) {
        n.body = this.visitTsTypeElements(n.body);
        return n;
    };
    Visitor.prototype.visitTsTypeElements = function (nodes) {
        return nodes.map(this.visitTsTypeElement.bind(this));
    };
    Visitor.prototype.visitTsTypeElement = function (n) {
        n.params = this.visitTsFnParameters(n.params);
        n.typeAnnotation = this.visitTsTypeAnnotation(n.typeAnnotation);
        return n;
    };
    Visitor.prototype.visitTsEnumDeclaration = function (n) {
        n.id = this.visitIdentifier(n.id);
        n.member = this.visitTsEnumMembers(n.member);
        return n;
    };
    Visitor.prototype.visitTsEnumMembers = function (nodes) {
        return nodes.map(this.visitTsEnumMember.bind(this));
    };
    Visitor.prototype.visitTsEnumMember = function (n) {
        n.id = this.visitTsEnumMemberId(n.id);
        n.init = this.visitOptionalExpression(n.init);
        return n;
    };
    Visitor.prototype.visitTsEnumMemberId = function (n) {
        switch (n.type) {
            case "Identifier":
                return this.visitBindingIdentifier(n);
            case "StringLiteral":
                return this.visitStringLiteral(n);
        }
    };
    Visitor.prototype.visitFunctionDeclaration = function (decl) {
        decl.ident = this.visitIdentifier(decl.ident);
        decl = this.visitFunction(decl);
        return decl;
    };
    Visitor.prototype.visitClassDeclartion = function (decl) {
        decl = this.visitClass(decl);
        decl.identifier = this.visitIdentifier(decl.identifier);
        return decl;
    };
    Visitor.prototype.visitClassBody = function (members) {
        return members.map(this.visitClassMember.bind(this));
    };
    Visitor.prototype.visitClassMember = function (member) {
        switch (member.type) {
            case "ClassMethod":
                return this.visitClassMethod(member);
            case "ClassProperty":
                return this.visitClassProperty(member);
            case "Constructor":
                return this.visitConstructor(member);
            case "PrivateMethod":
                return this.visitPrivateMethod(member);
            case "PrivateProperty":
                return this.visitPrivateProperty(member);
            case "TsIndexSignature":
                return this.visitTsIndexSignature(member);
        }
    };
    Visitor.prototype.visitTsIndexSignature = function (n) {
        n.params = this.visitTsFnParameters(n.params);
        n.typeAnnotation = this.visitTsTypeAnnotation(n.typeAnnotation);
        return n;
    };
    Visitor.prototype.visitTsFnParameters = function (params) {
        return params.map(this.visitTsFnParameter.bind(this));
    };
    Visitor.prototype.visitTsFnParameter = function (n) {
        n.typeAnnotation = this.visitTsTypeAnnotation(n.typeAnnotation);
        return n;
    };
    Visitor.prototype.visitPrivateProperty = function (n) {
        n.decorators = this.visitDecorators(n.decorators);
        n.key = this.visitPrivateName(n.key);
        n.typeAnnotation = this.visitTsTypeAnnotation(n.typeAnnotation);
        n.value = this.visitOptionalExpression(n.value);
        return n;
    };
    Visitor.prototype.visitPrivateMethod = function (n) {
        n.accessibility = this.visitAccessibility(n.accessibility);
        n.function = this.visitFunction(n.function);
        n.key = this.visitPrivateName(n.key);
        return n;
    };
    Visitor.prototype.visitPrivateName = function (n) {
        return n;
    };
    Visitor.prototype.visitConstructor = function (n) {
        n.accessibility = this.visitAccessibility(n.accessibility);
        n.key = this.visitPropertyName(n.key);
        n.params = this.visitConstructorParameters(n.params);
        if (n.body) {
            n.body = this.visitBlockStatement(n.body);
        }
        return n;
    };
    Visitor.prototype.visitConstructorParameters = function (nodes) {
        return nodes.map(this.visitConstructorParameter.bind(this));
    };
    Visitor.prototype.visitConstructorParameter = function (n) {
        switch (n.type) {
            case "TsParameterProperty":
                return this.visitTsParameterProperty(n);
            default:
                return this.visitParameter(n);
        }
    };
    Visitor.prototype.visitTsParameterProperty = function (n) {
        n.accessibility = this.visitAccessibility(n.accessibility);
        n.decorators = this.visitDecorators(n.decorators);
        n.param = this.visitTsParameterPropertyParameter(n.param);
        return n;
    };
    Visitor.prototype.visitTsParameterPropertyParameter = function (n) {
        n.typeAnnotation = this.visitTsTypeAnnotation(n.typeAnnotation);
        return n;
    };
    Visitor.prototype.visitPropertyName = function (key) {
        switch (key.type) {
            case "Identifier":
                return this.visitBindingIdentifier(key);
            case "StringLiteral":
                return this.visitStringLiteral(key);
            case "NumericLiteral":
                return this.visitNumericLiteral(key);
            default:
                return this.visitComputedPropertyKey(key);
        }
    };
    Visitor.prototype.visitAccessibility = function (n) {
        return n;
    };
    Visitor.prototype.visitClassProperty = function (n) {
        n.accessibility = this.visitAccessibility(n.accessibility);
        n.decorators = this.visitDecorators(n.decorators);
        n.key = this.visitExpression(n.key);
        n.typeAnnotation = this.visitTsTypeAnnotation(n.typeAnnotation);
        n.value = this.visitOptionalExpression(n.value);
        return n;
    };
    Visitor.prototype.visitClassMethod = function (n) {
        n.accessibility = this.visitAccessibility(n.accessibility);
        n.function = this.visitFunction(n.function);
        n.key = this.visitPropertyName(n.key);
        return n;
    };
    Visitor.prototype.visitPropertName = function (n) {
        switch (n.type) {
            case "Identifier":
                return this.visitIdentifier(n);
            case "NumericLiteral":
                return this.visitNumericLiteral(n);
            case "StringLiteral":
                return this.visitStringLiteral(n);
            case "Computed":
                return this.visitComputedPropertyKey(n);
        }
    };
    Visitor.prototype.visitComputedPropertyKey = function (n) {
        n.expression = this.visitExpression(n.expression);
        return n;
    };
    Visitor.prototype.visitClass = function (n) {
        n.decorators = this.visitDecorators(n.decorators);
        n.superClass = this.visitOptionalExpression(n.superClass);
        n.superTypeParams = this.visitTsTypeParameterInstantiation(n.superTypeParams);
        if (n.implements) {
            n.implements = this.visitTsExpressionsWithTypeArguments(n.implements);
        }
        n.body = this.visitClassBody(n.body);
        return n;
    };
    Visitor.prototype.visitFunction = function (n) {
        n.decorators = this.visitDecorators(n.decorators);
        n.params = this.visitParameters(n.params);
        if (n.body) {
            n.body = this.visitBlockStatement(n.body);
        }
        n.returnType = this.visitTsTypeAnnotation(n.returnType);
        n.typeParameters = this.visitTsTypeParameterDeclaration(n.typeParameters);
        return n;
    };
    Visitor.prototype.visitTsExpressionsWithTypeArguments = function (nodes) {
        return nodes.map(this.visitTsExpressionWithTypeArguments.bind(this));
    };
    Visitor.prototype.visitTsExpressionWithTypeArguments = function (n) {
        n.expression = this.visitTsEntityName(n.expression);
        n.typeArguments = this.visitTsTypeParameterInstantiation(n.typeArguments);
        return n;
    };
    Visitor.prototype.visitTsTypeParameterInstantiation = function (n) {
        if (n) {
            n.params = this.visitTsTypes(n.params);
        }
        return n;
    };
    Visitor.prototype.visitTsTypes = function (nodes) {
        return nodes.map(this.visitTsType.bind(this));
    };
    Visitor.prototype.visitTsEntityName = function (n) {
        switch (n.type) {
            case "Identifier":
                return this.visitBindingIdentifier(n);
            case "TsQualifiedName":
                return this.visitTsQualifiedName(n);
        }
    };
    Visitor.prototype.visitTsQualifiedName = function (n) {
        n.left = this.visitTsEntityName(n.left);
        n.right = this.visitIdentifier(n.right);
        return n;
    };
    Visitor.prototype.visitDecorators = function (nodes) {
        if (nodes) {
            return nodes.map(this.visitDecorator.bind(this));
        }
    };
    Visitor.prototype.visitDecorator = function (n) {
        n.expression = this.visitExpression(n.expression);
        return n;
    };
    Visitor.prototype.visitExpressionStatement = function (stmt) {
        stmt.expression = this.visitExpression(stmt.expression);
        return stmt;
    };
    Visitor.prototype.visitContinueStatement = function (stmt) {
        if (stmt.label) {
            stmt.label = this.visitLabelIdentifier(stmt.label);
        }
        return stmt;
    };
    Visitor.prototype.visitExpression = function (n) {
        switch (n.type) {
            case "ArrayExpression":
                return this.visitArrayExpression(n);
            case "ArrowFunctionExpression":
                return this.visitArrowFunctionExpression(n);
            case "AssignmentExpression":
                return this.visitAssignmentExpression(n);
            case "AwaitExpression":
                return this.visitAwaitExpression(n);
            case "BinaryExpression":
                return this.visitBinaryExpression(n);
            case "BooleanLiteral":
                return this.visitBooleanLiteral(n);
            case "CallExpression":
                return this.visitCallExpression(n);
            case "ClassExpression":
                return this.visitClassExpression(n);
            case "ConditionalExpression":
                return this.visitConditionalExpression(n);
            case "FunctionExpression":
                return this.visitFunctionExpression(n);
            case "Identifier":
                return this.visitIdentifierReference(n);
            case "JSXElement":
                return this.visitJSXElement(n);
            case "JSXEmptyExpression":
                return this.visitJSXEmptyExpression(n);
            case "JSXFragment":
                return this.visitJSXFragment(n);
            case "JSXMemberExpression":
                return this.visitJSXMemberExpression(n);
            case "JSXNamespacedName":
                return this.visitJSXNamespacedName(n);
            case "JSXText":
                return this.visitJSXText(n);
            case "MemberExpression":
                return this.visitMemberExpression(n);
            case "MetaProperty":
                return this.visitMetaProperty(n);
            case "NewExpression":
                return this.visitNewExpression(n);
            case "NullLiteral":
                return this.visitNullLiteral(n);
            case "NumericLiteral":
                return this.visitNumericLiteral(n);
            case "ObjectExpression":
                return this.visitObjectExpression(n);
            case "ParenthesisExpression":
                return this.visitParenthesisExpression(n);
            case "PrivateName":
                return this.visitPrivateName(n);
            case "RegExpLiteral":
                return this.visitRegExpLiteral(n);
            case "SequenceExpression":
                return this.visitSequenceExpression(n);
            case "StringLiteral":
                return this.visitStringLiteral(n);
            case "TaggedTemplateExpression":
                return this.visitTaggedTemplateExpression(n);
            case "TemplateLiteral":
                return this.visitTemplateLiteral(n);
            case "ThisExpression":
                return this.visitThisExpression(n);
            case "TsAsExpression":
                return this.visitTsAsExpression(n);
            case "TsNonNullExpression":
                return this.visitTsNonNullExpression(n);
            case "TsTypeAssertion":
                return this.visitTsTypeAssertion(n);
            case "TsTypeCastExpression":
                return this.visitTsTypeCastExpression(n);
            case "UnaryExpression":
                return this.visitUnaryExpression(n);
            case "UpdateExpression":
                return this.visitUpdateExpression(n);
            case "YieldExpression":
                return this.visitYieldExpression(n);
            case "OptionalChainingExpression":
                return this.visitOptionalChainingExpression(n);
            case "Invalid":
                return n;
        }
    };
    Visitor.prototype.visitOptionalChainingExpression = function (n) {
        n.expr = this.visitExpression(n.expr);
        return n;
    };
    Visitor.prototype.visitAssignmentExpression = function (n) {
        n.left = this.visitPatternOrExpressison(n.left);
        n.right = this.visitExpression(n.right);
        return n;
    };
    Visitor.prototype.visitPatternOrExpressison = function (n) {
        switch (n.type) {
            case "ObjectPattern":
            case "ArrayPattern":
            case "Identifier":
            case "AssignmentPattern":
            case "RestElement":
                return this.visitPattern(n);
            default:
                return this.visitExpression(n);
        }
    };
    Visitor.prototype.visitYieldExpression = function (n) {
        n.argument = this.visitOptionalExpression(n.argument);
        return n;
    };
    Visitor.prototype.visitUpdateExpression = function (n) {
        n.argument = this.visitExpression(n.argument);
        return n;
    };
    Visitor.prototype.visitUnaryExpression = function (n) {
        n.argument = this.visitExpression(n.argument);
        return n;
    };
    Visitor.prototype.visitTsTypeCastExpression = function (n) {
        n.expression = this.visitExpression(n.expression);
        n.typeAnnotation = this.visitTsTypeAnnotation(n.typeAnnotation);
        return n;
    };
    Visitor.prototype.visitTsTypeAssertion = function (n) {
        n.expression = this.visitExpression(n.expression);
        n.typeAnnotation = this.visitTsType(n.typeAnnotation);
        return n;
    };
    Visitor.prototype.visitTsNonNullExpression = function (n) {
        n.expression = this.visitExpression(n.expression);
        return n;
    };
    Visitor.prototype.visitTsAsExpression = function (n) {
        n.expression = this.visitExpression(n.expression);
        n.typeAnnotation = this.visitTsType(n.typeAnnotation);
        return n;
    };
    Visitor.prototype.visitThisExpression = function (n) {
        return n;
    };
    Visitor.prototype.visitTemplateLiteral = function (n) {
        n.expressions = n.expressions.map(this.visitExpression.bind(this));
        return n;
    };
    Visitor.prototype.visitParameters = function (n) {
        return n.map(this.visitParameter.bind(this));
    };
    Visitor.prototype.visitParameter = function (n) {
        n.pat = this.visitPattern(n.pat);
        return n;
    };
    Visitor.prototype.visitTaggedTemplateExpression = function (n) {
        n.tag = this.visitExpression(n.tag);
        n.expressions = n.expressions.map(this.visitExpression.bind(this));
        return n;
    };
    Visitor.prototype.visitSequenceExpression = function (n) {
        n.expressions = n.expressions.map(this.visitExpression.bind(this));
        return n;
    };
    Visitor.prototype.visitRegExpLiteral = function (n) {
        return n;
    };
    Visitor.prototype.visitParenthesisExpression = function (n) {
        n.expression = this.visitExpression(n.expression);
        return n;
    };
    Visitor.prototype.visitObjectExpression = function (n) {
        if (n.properties) {
            n.properties = this.visitObjectProperties(n.properties);
        }
        return n;
    };
    Visitor.prototype.visitObjectProperties = function (nodes) {
        return nodes.map(this.visitObjectProperty.bind(this));
    };
    Visitor.prototype.visitObjectProperty = function (n) {
        switch (n.type) {
            case "SpreadElement":
                return this.visitSpreadElement(n);
            default:
                return this.visitProperty(n);
        }
    };
    Visitor.prototype.visitProperty = function (n) {
        switch (n.type) {
            case "Identifier":
                return this.visitIdentifier(n);
            case "AssignmentProperty":
                return this.visitAssignmentProperty(n);
            case "GetterProperty":
                return this.visitGetterProperty(n);
            case "KeyValueProperty":
                return this.visitKeyValueProperty(n);
            case "MethodProperty":
                return this.visitMethodProperty(n);
            case "SetterProperty":
                return this.visitSetterProperty(n);
        }
    };
    Visitor.prototype.visitSetterProperty = function (n) {
        n.key = this.visitPropertyName(n.key);
        n.param = this.visitPattern(n.param);
        if (n.body) {
            n.body = this.visitBlockStatement(n.body);
        }
        return n;
    };
    Visitor.prototype.visitMethodProperty = function (n) {
        n.key = this.visitPropertyName(n.key);
        if (n.body) {
            n.body = this.visitBlockStatement(n.body);
        }
        n.decorators = this.visitDecorators(n.decorators);
        n.params = this.visitParameters(n.params);
        n.returnType = this.visitTsTypeAnnotation(n.returnType);
        n.typeParameters = this.visitTsTypeParameterDeclaration(n.typeParameters);
        return n;
    };
    Visitor.prototype.visitKeyValueProperty = function (n) {
        n.key = this.visitPropertyName(n.key);
        n.value = this.visitExpression(n.value);
        return n;
    };
    Visitor.prototype.visitGetterProperty = function (n) {
        n.key = this.visitPropertyName(n.key);
        if (n.body) {
            n.body = this.visitBlockStatement(n.body);
        }
        n.typeAnnotation = this.visitTsTypeAnnotation(n.typeAnnotation);
        return n;
    };
    Visitor.prototype.visitAssignmentProperty = function (n) {
        n.key = this.visitIdentifier(n.key);
        n.value = this.visitExpression(n.value);
        return n;
    };
    Visitor.prototype.visitNullLiteral = function (n) {
        return n;
    };
    Visitor.prototype.visitNewExpression = function (n) {
        n.callee = this.visitExpression(n.callee);
        if (n.arguments) {
            n.arguments = this.visitArguments(n.arguments);
        }
        n.typeArguments = this.visitTsTypeArguments(n.typeArguments);
        return n;
    };
    Visitor.prototype.visitTsTypeArguments = function (n) {
        if (n) {
            n.params = this.visitTsTypes(n.params);
        }
        return n;
    };
    Visitor.prototype.visitArguments = function (nodes) {
        return nodes.map(this.visitArgument.bind(this));
    };
    Visitor.prototype.visitArgument = function (n) {
        n.expression = this.visitExpression(n.expression);
        return n;
    };
    Visitor.prototype.visitMetaProperty = function (n) {
        n.meta = this.visitIdentifierReference(n.meta);
        n.property = this.visitIdentifier(n.property);
        return n;
    };
    Visitor.prototype.visitMemberExpression = function (n) {
        n.object = this.visitExpressionOrSuper(n.object);
        n.property = this.visitExpression(n.property);
        return n;
    };
    Visitor.prototype.visitExpressionOrSuper = function (n) {
        if (n.type === "Super") {
            return n;
        }
        return this.visitExpression(n);
    };
    Visitor.prototype.visitJSXText = function (n) {
        return n;
    };
    Visitor.prototype.visitJSXNamespacedName = function (n) {
        n.namespace = this.visitIdentifierReference(n.namespace);
        n.name = this.visitIdentifierReference(n.name);
        return n;
    };
    Visitor.prototype.visitJSXMemberExpression = function (n) {
        n.object = this.visitJSXObject(n.object);
        n.property = this.visitIdentifierReference(n.property);
        return n;
    };
    Visitor.prototype.visitJSXObject = function (n) {
        switch (n.type) {
            case "Identifier":
                return this.visitIdentifierReference(n);
            case "JSXMemberExpression":
                return this.visitJSXMemberExpression(n);
        }
    };
    Visitor.prototype.visitJSXFragment = function (n) {
        n.opening = this.visitJSXOpeningFragment(n.opening);
        if (n.children) {
            n.children = this.visitJSXElementChildren(n.children);
        }
        n.closing = this.visitJSXClosingFragment(n.closing);
        return n;
    };
    Visitor.prototype.visitJSXClosingFragment = function (n) {
        return n;
    };
    Visitor.prototype.visitJSXElementChildren = function (nodes) {
        return nodes.map(this.visitJSXElementChild.bind(this));
    };
    Visitor.prototype.visitJSXElementChild = function (n) {
        switch (n.type) {
            case "JSXElement":
                return this.visitJSXElement(n);
            case "JSXExpressionContainer":
                return this.visitJSXExpressionContainer(n);
            case "JSXFragment":
                return this.visitJSXFragment(n);
            case "JSXSpreadChild":
                return this.visitJSXSpreadChild(n);
            case "JSXText":
                return this.visitJSXText(n);
        }
    };
    Visitor.prototype.visitJSXExpressionContainer = function (n) {
        n.expression = this.visitExpression(n.expression);
        return n;
    };
    Visitor.prototype.visitJSXSpreadChild = function (n) {
        n.expression = this.visitExpression(n.expression);
        return n;
    };
    Visitor.prototype.visitJSXOpeningFragment = function (n) {
        return n;
    };
    Visitor.prototype.visitJSXEmptyExpression = function (n) {
        return n;
    };
    Visitor.prototype.visitJSXElement = function (n) {
        n.opening = this.visitJSXOpeningElement(n.opening);
        n.children = this.visitJSXElementChildren(n.children);
        n.closing = this.visitJSXClosingElement(n.closing);
        return n;
    };
    Visitor.prototype.visitJSXClosingElement = function (n) {
        if (n) {
            n.name = this.visitJSXElementName(n.name);
        }
        return n;
    };
    Visitor.prototype.visitJSXElementName = function (n) {
        switch (n.type) {
            case "Identifier":
                return this.visitIdentifierReference(n);
            case "JSXMemberExpression":
                return this.visitJSXMemberExpression(n);
            case "JSXNamespacedName":
                return this.visitJSXNamespacedName(n);
        }
    };
    Visitor.prototype.visitJSXOpeningElement = function (n) {
        n.name = this.visitJSXElementName(n.name);
        n.typeArguments = this.visitTsTypeParameterInstantiation(n.typeArguments);
        n.attrs = this.visitJSXAttributes(n.attrs);
        return n;
    };
    Visitor.prototype.visitJSXAttributes = function (attrs) {
        if (attrs)
            return attrs.map(this.visitJSXAttributeOrSpread.bind(this));
    };
    Visitor.prototype.visitJSXAttributeOrSpread = function (n) {
        switch (n.type) {
            case "JSXAttribute":
                return this.visitJSXAttribute(n);
            case "SpreadElement":
                return this.visitSpreadElement(n);
        }
    };
    Visitor.prototype.visitJSXAttribute = function (n) {
        n.name = this.visitJSXAttributeName(n.name);
        n.value = this.visitJSXAttributeValue(n.value);
        return n;
    };
    Visitor.prototype.visitJSXAttributeValue = function (n) {
        if (!n)
            return n;
        switch (n.type) {
            case "BooleanLiteral":
                return this.visitBooleanLiteral(n);
            case "NullLiteral":
                return this.visitNullLiteral(n);
            case "NumericLiteral":
                return this.visitNumericLiteral(n);
            case "JSXText":
                return this.visitJSXText(n);
            case "StringLiteral":
                return this.visitStringLiteral(n);
            case "JSXElement":
                return this.visitJSXElement(n);
            case "JSXExpressionContainer":
                return this.visitJSXExpressionContainer(n);
            case "JSXFragment":
                return this.visitJSXFragment(n);
        }
        return n;
    };
    Visitor.prototype.visitJSXAttributeName = function (n) {
        switch (n.type) {
            case "Identifier":
                return this.visitIdentifierReference(n);
            case "JSXNamespacedName":
                return this.visitJSXNamespacedName(n);
        }
    };
    Visitor.prototype.visitConditionalExpression = function (n) {
        n.test = this.visitExpression(n.test);
        n.consequent = this.visitExpression(n.consequent);
        n.alternate = this.visitExpression(n.alternate);
        return n;
    };
    Visitor.prototype.visitCallExpression = function (n) {
        n.callee = this.visitExpressionOrSuper(n.callee);
        n.typeArguments = this.visitTsTypeParameterInstantiation(n.typeArguments);
        if (n.arguments) {
            n.arguments = this.visitArguments(n.arguments);
        }
        return n;
    };
    Visitor.prototype.visitBooleanLiteral = function (n) {
        return n;
    };
    Visitor.prototype.visitBinaryExpression = function (n) {
        n.left = this.visitExpression(n.left);
        n.right = this.visitExpression(n.right);
        return n;
    };
    Visitor.prototype.visitAwaitExpression = function (n) {
        n.argument = this.visitExpression(n.argument);
        return n;
    };
    Visitor.prototype.visitTsTypeParameterDeclaration = function (n) {
        if (n) {
            n.parameters = this.visitTsTypeParameters(n.parameters);
        }
        return n;
    };
    Visitor.prototype.visitTsTypeParameters = function (nodes) {
        return nodes.map(this.visitTsTypeParameter.bind(this));
    };
    Visitor.prototype.visitTsTypeParameter = function (n) {
        if (n.constraint) {
            n.constraint = this.visitTsType(n.constraint);
        }
        if (n.default) {
            n.default = this.visitTsType(n.default);
        }
        n.name = this.visitIdentifierReference(n.name);
        return n;
    };
    Visitor.prototype.visitTsTypeAnnotation = function (a) {
        if (a) {
            a.typeAnnotation = this.visitTsType(a.typeAnnotation);
        }
        return a;
    };
    Visitor.prototype.visitTsType = function (n) {
        throw new Error("Method visitTsType not implemented.");
    };
    Visitor.prototype.visitPatterns = function (nodes) {
        return nodes.map(this.visitPattern.bind(this));
    };
    Visitor.prototype.visitImportDeclaration = function (n) {
        n.source = this.visitStringLiteral(n.source);
        n.specifiers = this.visitImportSpecifiers(n.specifiers || []);
        return n;
    };
    Visitor.prototype.visitImportSpecifiers = function (nodes) {
        return nodes.map(this.visitImportSpecifier.bind(this));
    };
    Visitor.prototype.visitImportSpecifier = function (node) {
        switch (node.type) {
            case "ImportDefaultSpecifier":
                return this.visitImportDefaultSpecifier(node);
            case "ImportNamespaceSpecifier":
                return this.visitImportNamespaceSpecifier(node);
            case "ImportSpecifier":
                return this.visitNamedImportSpecifier(node);
        }
    };
    Visitor.prototype.visitNamedImportSpecifier = function (node) {
        node.local = this.visitBindingIdentifier(node.local);
        if (node.imported) {
            node.imported = this.visitIdentifierReference(node.imported);
        }
        return node;
    };
    Visitor.prototype.visitImportNamespaceSpecifier = function (node) {
        node.local = this.visitBindingIdentifier(node.local);
        return node;
    };
    Visitor.prototype.visitImportDefaultSpecifier = function (node) {
        node.local = this.visitBindingIdentifier(node.local);
        return node;
    };
    Visitor.prototype.visitBindingIdentifier = function (i) {
        return this.visitIdentifier(i);
    };
    Visitor.prototype.visitIdentifierReference = function (i) {
        return this.visitIdentifier(i);
    };
    Visitor.prototype.visitLabelIdentifier = function (label) {
        return this.visitIdentifier(label);
    };
    Visitor.prototype.visitIdentifier = function (n) {
        return n;
    };
    Visitor.prototype.visitStringLiteral = function (n) {
        return n;
    };
    Visitor.prototype.visitNumericLiteral = function (n) {
        return n;
    };
    Visitor.prototype.visitPattern = function (n) {
        switch (n.type) {
            case "Identifier":
                return this.visitBindingIdentifier(n);
            case "ArrayPattern":
                return this.visitArrayPattern(n);
            case "ObjectPattern":
                return this.visitObjectPattern(n);
            case "AssignmentPattern":
                return this.visitAssignmentPattern(n);
            case "RestElement":
                return this.visitRestElement(n);
            default:
                return this.visitExpression(n);
        }
    };
    Visitor.prototype.visitRestElement = function (n) {
        n.argument = this.visitPattern(n.argument);
        n.typeAnnotation = this.visitTsTypeAnnotation(n.typeAnnotation);
        return n;
    };
    Visitor.prototype.visitAssignmentPattern = function (n) {
        n.left = this.visitPattern(n.left);
        n.right = this.visitExpression(n.right);
        n.typeAnnotation = this.visitTsTypeAnnotation(n.typeAnnotation);
        return n;
    };
    Visitor.prototype.visitObjectPattern = function (n) {
        n.props = this.visitObjectPatternProperties(n.props);
        n.typeAnnotation = this.visitTsTypeAnnotation(n.typeAnnotation);
        return n;
    };
    Visitor.prototype.visitObjectPatternProperties = function (nodes) {
        return nodes.map(this.visitObjectPatternProperty.bind(this));
    };
    Visitor.prototype.visitObjectPatternProperty = function (n) {
        switch (n.type) {
            case "AssignmentPatternProperty":
                return this.visitAssignmentPatternProperty(n);
            case "KeyValuePatternProperty":
                return this.visitKeyValuePatternProperty(n);
            case "RestElement":
                return this.visitRestElement(n);
        }
    };
    Visitor.prototype.visitKeyValuePatternProperty = function (n) {
        n.key = this.visitPropertyName(n.key);
        n.value = this.visitPattern(n.value);
        return n;
    };
    Visitor.prototype.visitAssignmentPatternProperty = function (n) {
        n.key = this.visitBindingIdentifier(n.key);
        n.value = this.visitOptionalExpression(n.value);
        return n;
    };
    Visitor.prototype.visitArrayPattern = function (n) {
        n.typeAnnotation = this.visitTsTypeAnnotation(n.typeAnnotation);
        n.elements = this.visitArrayPatternElements(n.elements);
        return n;
    };
    Visitor.prototype.visitArrayPatternElements = function (nodes) {
        return nodes.map(this.visitArrayPatternElement.bind(this));
    };
    Visitor.prototype.visitArrayPatternElement = function (n) {
        if (n) {
            n = this.visitPattern(n);
        }
        return n;
    };
    return Visitor;
}());
exports.default = Visitor;
