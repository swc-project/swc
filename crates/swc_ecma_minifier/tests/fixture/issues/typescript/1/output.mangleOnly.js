var e;
(function(e) {
    function r(r) {
        function n(r) {
            switch(r){
                case e.ModuleKind.AMD:
                    return M;
                case e.ModuleKind.UMD:
                    return D;
                default:
                    return h;
            }
        }
        var i = r.factory, a = r.getEmitHelperFactory, s = r.startLexicalEnvironment, d = r.endLexicalEnvironment, o = r.hoistVariableDeclaration;
        var u = r.getCompilerOptions();
        var c = r.getEmitResolver();
        var l = r.getEmitHost();
        var f = e.getEmitScriptTarget(u);
        var p = e.getEmitModuleKind(u);
        var m = r.onSubstituteNode;
        var g = r.onEmitNode;
        r.onSubstituteNode = eN;
        r.onEmitNode = eE;
        r.enableSubstitution(207);
        r.enableSubstitution(209);
        r.enableSubstitution(79);
        r.enableSubstitution(220);
        r.enableSubstitution(295);
        r.enableEmitNotification(303);
        var x = [];
        var v = [];
        var E;
        var N;
        var I = [];
        var S;
        return e.chainBundle(r, y);
        function y(t) {
            if (t.isDeclarationFile || !(e.isEffectiveExternalModule(t, u) || t.transformFlags & 4194304 || (e.isJsonSourceFile(t) && e.hasJsonModuleEmitEnabled(u) && e.outFile(u)))) {
                return t;
            }
            E = t;
            N = e.collectExternalModuleInfo(r, t, c, u);
            x[e.getOriginalNodeId(t)] = N;
            var i = n(p);
            var a = i(t);
            E = undefined;
            N = undefined;
            S = false;
            return a;
        }
        function A() {
            if (!N.exportEquals && e.isExternalModule(E)) {
                return true;
            }
            return false;
        }
        function h(t) {
            s();
            var n = [];
            var a = e.getStrictOptionValue(u, "alwaysStrict") || (!u.noImplicitUseStrict && e.isExternalModule(E));
            var o = i.copyPrologue(t.statements, n, a && !e.isJsonSourceFile(t), P);
            if (A()) {
                e.append(n, em());
            }
            if (e.length(N.exportedNames)) {
                var c = 50;
                for(var l = 0; l < N.exportedNames.length; l += c){
                    e.append(n, i.createExpressionStatement(e.reduceLeft(N.exportedNames.slice(l, l + c), function(r, t) {
                        return i.createAssignment(i.createPropertyAccessExpression(i.createIdentifier("exports"), i.createIdentifier(e.idText(t))), r);
                    }, i.createVoidZero())));
                }
            }
            e.append(n, e.visitNode(N.externalHelpersImportDeclaration, P, e.isStatement));
            e.addRange(n, e.visitNodes(t.statements, P, e.isStatement, o));
            O(n, false);
            e.insertStatementsAfterStandardPrologue(n, d());
            var f = i.updateSourceFile(t, e.setTextRange(i.createNodeArray(n), t.statements));
            e.addEmitHelpers(f, r.readEmitHelpers());
            return f;
        }
        function M(t) {
            var n = i.createIdentifier("define");
            var a = e.tryGetModuleNameFromFile(i, t, l, u);
            var s = e.isJsonSourceFile(t) && t;
            var d = b(t, true), o = d.aliasedModuleNames, c = d.unaliasedModuleNames, f = d.importAliasNames;
            var p = i.updateSourceFile(t, e.setTextRange(i.createNodeArray([
                i.createExpressionStatement(i.createCallExpression(n, undefined, __spreadArray(__spreadArray([], (a ? [
                    a
                ] : []), true), [
                    i.createArrayLiteralExpression(s ? e.emptyArray : __spreadArray(__spreadArray([
                        i.createStringLiteral("require"),
                        i.createStringLiteral("exports")
                    ], o, true), c, true)),
                    s ? s.statements.length ? s.statements[0].expression : i.createObjectLiteralExpression() : i.createFunctionExpression(undefined, undefined, undefined, undefined, __spreadArray([
                        i.createParameterDeclaration(undefined, undefined, undefined, "require"),
                        i.createParameterDeclaration(undefined, undefined, undefined, "exports")
                    ], f, true), undefined, T(t))
                ], false)))
            ]), t.statements));
            e.addEmitHelpers(p, r.readEmitHelpers());
            return p;
        }
        function D(t) {
            var n = b(t, false), a = n.aliasedModuleNames, s = n.unaliasedModuleNames, d = n.importAliasNames;
            var o = e.tryGetModuleNameFromFile(i, t, l, u);
            var c = i.createFunctionExpression(undefined, undefined, undefined, undefined, [
                i.createParameterDeclaration(undefined, undefined, undefined, "factory")
            ], undefined, e.setTextRange(i.createBlock([
                i.createIfStatement(i.createLogicalAnd(i.createTypeCheck(i.createIdentifier("module"), "object"), i.createTypeCheck(i.createPropertyAccessExpression(i.createIdentifier("module"), "exports"), "object")), i.createBlock([
                    i.createVariableStatement(undefined, [
                        i.createVariableDeclaration("v", undefined, undefined, i.createCallExpression(i.createIdentifier("factory"), undefined, [
                            i.createIdentifier("require"),
                            i.createIdentifier("exports")
                        ]))
                    ]),
                    e.setEmitFlags(i.createIfStatement(i.createStrictInequality(i.createIdentifier("v"), i.createIdentifier("undefined")), i.createExpressionStatement(i.createAssignment(i.createPropertyAccessExpression(i.createIdentifier("module"), "exports"), i.createIdentifier("v")))), 1)
                ]), i.createIfStatement(i.createLogicalAnd(i.createTypeCheck(i.createIdentifier("define"), "function"), i.createPropertyAccessExpression(i.createIdentifier("define"), "amd")), i.createBlock([
                    i.createExpressionStatement(i.createCallExpression(i.createIdentifier("define"), undefined, __spreadArray(__spreadArray([], (o ? [
                        o
                    ] : []), true), [
                        i.createArrayLiteralExpression(__spreadArray(__spreadArray([
                            i.createStringLiteral("require"),
                            i.createStringLiteral("exports")
                        ], a, true), s, true)),
                        i.createIdentifier("factory")
                    ], false)))
                ])))
            ], true), undefined));
            var f = i.updateSourceFile(t, e.setTextRange(i.createNodeArray([
                i.createExpressionStatement(i.createCallExpression(c, undefined, [
                    i.createFunctionExpression(undefined, undefined, undefined, undefined, __spreadArray([
                        i.createParameterDeclaration(undefined, undefined, undefined, "require"),
                        i.createParameterDeclaration(undefined, undefined, undefined, "exports")
                    ], d, true), undefined, T(t))
                ]))
            ]), t.statements));
            e.addEmitHelpers(f, r.readEmitHelpers());
            return f;
        }
        function b(r, t) {
            var n = [];
            var a = [];
            var s = [];
            for(var d = 0, o = r.amdDependencies; d < o.length; d++){
                var f = o[d];
                if (f.name) {
                    n.push(i.createStringLiteral(f.path));
                    s.push(i.createParameterDeclaration(undefined, undefined, undefined, f.name));
                } else {
                    a.push(i.createStringLiteral(f.path));
                }
            }
            for(var p = 0, m = N.externalImports; p < m.length; p++){
                var g = m[p];
                var x = e.getExternalModuleNameLiteral(i, g, E, l, c, u);
                var v = e.getLocalNameForExternalImport(i, g, E);
                if (x) {
                    if (t && v) {
                        e.setEmitFlags(v, 4);
                        n.push(x);
                        s.push(i.createParameterDeclaration(undefined, undefined, undefined, v));
                    } else {
                        a.push(x);
                    }
                }
            }
            return {
                aliasedModuleNames: n,
                unaliasedModuleNames: a,
                importAliasNames: s
            };
        }
        function F(r) {
            if (e.isImportEqualsDeclaration(r) || e.isExportDeclaration(r) || !e.getExternalModuleNameLiteral(i, r, E, l, c, u)) {
                return undefined;
            }
            var t = e.getLocalNameForExternalImport(i, r, E);
            var n = J(r, t);
            if (n === t) {
                return undefined;
            }
            return i.createExpressionStatement(i.createAssignment(t, n));
        }
        function T(r) {
            s();
            var n = [];
            var a = i.copyPrologue(r.statements, n, !u.noImplicitUseStrict, P);
            if (A()) {
                e.append(n, em());
            }
            if (e.length(N.exportedNames)) {
                e.append(n, i.createExpressionStatement(e.reduceLeft(N.exportedNames, function(r, t) {
                    return i.createAssignment(i.createPropertyAccessExpression(i.createIdentifier("exports"), i.createIdentifier(e.idText(t))), r);
                }, i.createVoidZero())));
            }
            e.append(n, e.visitNode(N.externalHelpersImportDeclaration, P, e.isStatement));
            if (p === e.ModuleKind.AMD) {
                e.addRange(n, e.mapDefined(N.externalImports, F));
            }
            e.addRange(n, e.visitNodes(r.statements, P, e.isStatement, a));
            O(n, true);
            e.insertStatementsAfterStandardPrologue(n, d());
            var o = i.createBlock(n, true);
            if (S) {
                e.addEmitHelper(o, t);
            }
            return o;
        }
        function O(r, t) {
            if (N.exportEquals) {
                var n = e.visitNode(N.exportEquals.expression, C);
                if (n) {
                    if (t) {
                        var a = i.createReturnStatement(n);
                        e.setTextRange(a, N.exportEquals);
                        e.setEmitFlags(a, 384 | 1536);
                        r.push(a);
                    } else {
                        var a = i.createExpressionStatement(i.createAssignment(i.createPropertyAccessExpression(i.createIdentifier("module"), "exports"), n));
                        e.setTextRange(a, N.exportEquals);
                        e.setEmitFlags(a, 1536);
                        r.push(a);
                    }
                }
            }
        }
        function P(e) {
            switch(e.kind){
                case 265:
                    return Z(e);
                case 264:
                    return W(e);
                case 271:
                    return X(e);
                case 270:
                    return Y(e);
                case 236:
                    return er(e);
                case 255:
                    return $(e);
                case 256:
                    return ee(e);
                case 350:
                    return ei(e);
                case 351:
                    return es(e);
                default:
                    return C(e);
            }
        }
        function L(t, n) {
            if (!(t.transformFlags & (4194304 | 4096 | 67108864))) {
                return t;
            }
            switch(t.kind){
                case 241:
                    return q(t);
                case 237:
                    return V(t);
                case 211:
                    return H(t, n);
                case 348:
                    return B(t, n);
                case 207:
                    if (e.isImportCall(t) && E.impliedNodeFormat === undefined) {
                        return j(t);
                    }
                    break;
                case 220:
                    if (e.isDestructuringAssignment(t)) {
                        return _(t, n);
                    }
                    break;
                case 218:
                case 219:
                    return G(t, n);
            }
            return e.visitEachChild(t, C, r);
        }
        function C(e) {
            return L(e, false);
        }
        function R(e) {
            return L(e, true);
        }
        function k(r) {
            if (e.isObjectLiteralExpression(r)) {
                for(var t = 0, n = r.properties; t < n.length; t++){
                    var i = n[t];
                    switch(i.kind){
                        case 294:
                            if (k(i.initializer)) {
                                return true;
                            }
                            break;
                        case 295:
                            if (k(i.name)) {
                                return true;
                            }
                            break;
                        case 296:
                            if (k(i.expression)) {
                                return true;
                            }
                            break;
                        case 168:
                        case 171:
                        case 172:
                            return false;
                        default:
                            e.Debug.assertNever(i, "Unhandled object member kind");
                    }
                }
            } else if (e.isArrayLiteralExpression(r)) {
                for(var a = 0, s = r.elements; a < s.length; a++){
                    var i = s[a];
                    if (e.isSpreadElement(i)) {
                        if (k(i.expression)) {
                            return true;
                        }
                    } else if (k(i)) {
                        return true;
                    }
                }
            } else if (e.isIdentifier(r)) {
                return e.length(eD(r)) > (e.isExportName(r) ? 1 : 0);
            }
            return false;
        }
        function _(t, n) {
            if (k(t.left)) {
                return e.flattenDestructuringAssignment(t, C, r, 0, !n, et);
            }
            return e.visitEachChild(t, C, r);
        }
        function q(t) {
            return i.updateForStatement(t, e.visitNode(t.initializer, R, e.isForInitializer), e.visitNode(t.condition, C, e.isExpression), e.visitNode(t.incrementor, R, e.isExpression), e.visitIterationBody(t.statement, C, r));
        }
        function V(r) {
            return i.updateExpressionStatement(r, e.visitNode(r.expression, R, e.isExpression));
        }
        function H(r, t) {
            return i.updateParenthesizedExpression(r, e.visitNode(r.expression, t ? R : C, e.isExpression));
        }
        function B(r, t) {
            return i.updatePartiallyEmittedExpression(r, e.visitNode(r.expression, t ? R : C, e.isExpression));
        }
        function G(t, n) {
            if ((t.operator === 45 || t.operator === 46) && e.isIdentifier(t.operand) && !e.isGeneratedIdentifier(t.operand) && !e.isLocalName(t.operand) && !e.isDeclarationNameOfEnumOrNamespace(t.operand)) {
                var a = eD(t.operand);
                if (a) {
                    var s = void 0;
                    var d = e.visitNode(t.operand, C, e.isExpression);
                    if (e.isPrefixUnaryExpression(t)) {
                        d = i.updatePrefixUnaryExpression(t, d);
                    } else {
                        d = i.updatePostfixUnaryExpression(t, d);
                        if (!n) {
                            s = i.createTempVariable(o);
                            d = i.createAssignment(s, d);
                            e.setTextRange(d, t);
                        }
                        d = i.createComma(d, i.cloneNode(t.operand));
                        e.setTextRange(d, t);
                    }
                    for(var u = 0, c = a; u < c.length; u++){
                        var l = c[u];
                        I[e.getNodeId(d)] = true;
                        d = ex(l, d);
                        e.setTextRange(d, t);
                    }
                    if (s) {
                        I[e.getNodeId(d)] = true;
                        d = i.createComma(d, s);
                        e.setTextRange(d, t);
                    }
                    return d;
                }
            }
            return e.visitEachChild(t, C, r);
        }
        function j(r) {
            var t = e.getExternalModuleNameLiteral(i, r, E, l, c, u);
            var n = e.visitNode(e.firstOrUndefined(r.arguments), C);
            var a = t && (!n || !e.isStringLiteral(n) || n.text !== t.text) ? t : n;
            var s = !!(r.transformFlags & 8192);
            switch(u.module){
                case e.ModuleKind.AMD:
                    return z(a, s);
                case e.ModuleKind.UMD:
                    return w(a !== null && a !== void 0 ? a : i.createVoidZero(), s);
                case e.ModuleKind.CommonJS:
                default:
                    return K(a, s);
            }
        }
        function w(r, t) {
            S = true;
            if (e.isSimpleCopiableExpression(r)) {
                var n = e.isGeneratedIdentifier(r) ? r : e.isStringLiteral(r) ? i.createStringLiteralFromNode(r) : e.setEmitFlags(e.setTextRange(i.cloneNode(r), r), 1536);
                return i.createConditionalExpression(i.createIdentifier("__syncRequire"), undefined, K(r, t), undefined, z(n, t));
            } else {
                var a = i.createTempVariable(o);
                return i.createComma(i.createAssignment(a, r), i.createConditionalExpression(i.createIdentifier("__syncRequire"), undefined, K(a, t), undefined, z(a, t)));
            }
        }
        function z(r, t) {
            var n = i.createUniqueName("resolve");
            var s = i.createUniqueName("reject");
            var d = [
                i.createParameterDeclaration(undefined, undefined, undefined, n),
                i.createParameterDeclaration(undefined, undefined, undefined, s)
            ];
            var o = i.createBlock([
                i.createExpressionStatement(i.createCallExpression(i.createIdentifier("require"), undefined, [
                    i.createArrayLiteralExpression([
                        r || i.createOmittedExpression()
                    ]),
                    n,
                    s
                ]))
            ]);
            var c;
            if (f >= 2) {
                c = i.createArrowFunction(undefined, undefined, d, undefined, undefined, o);
            } else {
                c = i.createFunctionExpression(undefined, undefined, undefined, undefined, d, undefined, o);
                if (t) {
                    e.setEmitFlags(c, 8);
                }
            }
            var l = i.createNewExpression(i.createIdentifier("Promise"), undefined, [
                c
            ]);
            if (e.getESModuleInterop(u)) {
                return i.createCallExpression(i.createPropertyAccessExpression(l, i.createIdentifier("then")), undefined, [
                    a().createImportStarCallbackHelper()
                ]);
            }
            return l;
        }
        function K(r, t) {
            var n = i.createCallExpression(i.createPropertyAccessExpression(i.createIdentifier("Promise"), "resolve"), undefined, []);
            var s = i.createCallExpression(i.createIdentifier("require"), undefined, r ? [
                r
            ] : []);
            if (e.getESModuleInterop(u)) {
                s = a().createImportStarHelper(s);
            }
            var d;
            if (f >= 2) {
                d = i.createArrowFunction(undefined, undefined, [], undefined, undefined, s);
            } else {
                d = i.createFunctionExpression(undefined, undefined, undefined, undefined, [], undefined, i.createBlock([
                    i.createReturnStatement(s)
                ]));
                if (t) {
                    e.setEmitFlags(d, 8);
                }
            }
            return i.createCallExpression(i.createPropertyAccessExpression(n, "then"), undefined, [
                d
            ]);
        }
        function U(r, t) {
            if (!e.getESModuleInterop(u) || e.getEmitFlags(r) & 67108864) {
                return t;
            }
            if (e.getExportNeedsImportStarHelper(r)) {
                return a().createImportStarHelper(t);
            }
            return t;
        }
        function J(r, t) {
            if (!e.getESModuleInterop(u) || e.getEmitFlags(r) & 67108864) {
                return t;
            }
            if (e.getImportNeedsImportStarHelper(r)) {
                return a().createImportStarHelper(t);
            }
            if (e.getImportNeedsImportDefaultHelper(r)) {
                return a().createImportDefaultHelper(t);
            }
            return t;
        }
        function Z(r) {
            var t;
            var n = e.getNamespaceDeclarationNode(r);
            if (p !== e.ModuleKind.AMD) {
                if (!r.importClause) {
                    return e.setOriginalNode(e.setTextRange(i.createExpressionStatement(Q(r)), r), r);
                } else {
                    var a = [];
                    if (n && !e.isDefaultImport(r)) {
                        a.push(i.createVariableDeclaration(i.cloneNode(n.name), undefined, undefined, J(r, Q(r))));
                    } else {
                        a.push(i.createVariableDeclaration(i.getGeneratedNameForNode(r), undefined, undefined, J(r, Q(r))));
                        if (n && e.isDefaultImport(r)) {
                            a.push(i.createVariableDeclaration(i.cloneNode(n.name), undefined, undefined, i.getGeneratedNameForNode(r)));
                        }
                    }
                    t = e.append(t, e.setOriginalNode(e.setTextRange(i.createVariableStatement(undefined, i.createVariableDeclarationList(a, f >= 2 ? 2 : 0)), r), r));
                }
            } else if (n && e.isDefaultImport(r)) {
                t = e.append(t, i.createVariableStatement(undefined, i.createVariableDeclarationList([
                    e.setOriginalNode(e.setTextRange(i.createVariableDeclaration(i.cloneNode(n.name), undefined, undefined, i.getGeneratedNameForNode(r)), r), r)
                ], f >= 2 ? 2 : 0)));
            }
            if (ea(r)) {
                var s = e.getOriginalNodeId(r);
                v[s] = ed(v[s], r);
            } else {
                t = ed(t, r);
            }
            return e.singleOrMany(t);
        }
        function Q(r) {
            var t = e.getExternalModuleNameLiteral(i, r, E, l, c, u);
            var n = [];
            if (t) {
                n.push(t);
            }
            return i.createCallExpression(i.createIdentifier("require"), undefined, n);
        }
        function W(r) {
            e.Debug.assert(e.isExternalModuleImportEqualsDeclaration(r), "import= for internal module references should be handled in an earlier transformer.");
            var t;
            if (p !== e.ModuleKind.AMD) {
                if (e.hasSyntacticModifier(r, 1)) {
                    t = e.append(t, e.setOriginalNode(e.setTextRange(i.createExpressionStatement(ex(r.name, Q(r))), r), r));
                } else {
                    t = e.append(t, e.setOriginalNode(e.setTextRange(i.createVariableStatement(undefined, i.createVariableDeclarationList([
                        i.createVariableDeclaration(i.cloneNode(r.name), undefined, undefined, Q(r))
                    ], f >= 2 ? 2 : 0)), r), r));
                }
            } else {
                if (e.hasSyntacticModifier(r, 1)) {
                    t = e.append(t, e.setOriginalNode(e.setTextRange(i.createExpressionStatement(ex(i.getExportName(r), i.getLocalName(r))), r), r));
                }
            }
            if (ea(r)) {
                var n = e.getOriginalNodeId(r);
                v[n] = eo(v[n], r);
            } else {
                t = eo(t, r);
            }
            return e.singleOrMany(t);
        }
        function X(r) {
            if (!r.moduleSpecifier) {
                return undefined;
            }
            var t = i.getGeneratedNameForNode(r);
            if (r.exportClause && e.isNamedExports(r.exportClause)) {
                var n = [];
                if (p !== e.ModuleKind.AMD) {
                    n.push(e.setOriginalNode(e.setTextRange(i.createVariableStatement(undefined, i.createVariableDeclarationList([
                        i.createVariableDeclaration(t, undefined, undefined, Q(r))
                    ])), r), r));
                }
                for(var s = 0, d = r.exportClause.elements; s < d.length; s++){
                    var o = d[s];
                    if (f === 0) {
                        n.push(e.setOriginalNode(e.setTextRange(i.createExpressionStatement(a().createCreateBindingHelper(t, i.createStringLiteralFromNode(o.propertyName || o.name), o.propertyName ? i.createStringLiteralFromNode(o.name) : undefined)), o), o));
                    } else {
                        var c = !!e.getESModuleInterop(u) && !(e.getEmitFlags(r) & 67108864) && e.idText(o.propertyName || o.name) === "default";
                        var l = i.createPropertyAccessExpression(c ? a().createImportDefaultHelper(t) : t, o.propertyName || o.name);
                        n.push(e.setOriginalNode(e.setTextRange(i.createExpressionStatement(ex(i.getExportName(o), l, undefined, true)), o), o));
                    }
                }
                return e.singleOrMany(n);
            } else if (r.exportClause) {
                var n = [];
                n.push(e.setOriginalNode(e.setTextRange(i.createExpressionStatement(ex(i.cloneNode(r.exportClause.name), U(r, p !== e.ModuleKind.AMD ? Q(r) : e.isExportNamespaceAsDefaultDeclaration(r) ? t : i.createIdentifier(e.idText(r.exportClause.name))))), r), r));
                return e.singleOrMany(n);
            } else {
                return e.setOriginalNode(e.setTextRange(i.createExpressionStatement(a().createExportStarHelper(p !== e.ModuleKind.AMD ? Q(r) : t)), r), r);
            }
        }
        function Y(r) {
            if (r.isExportEquals) {
                return undefined;
            }
            var t;
            var n = r.original;
            if (n && ea(n)) {
                var a = e.getOriginalNodeId(r);
                v[a] = ep(v[a], i.createIdentifier("default"), e.visitNode(r.expression, C), r, true);
            } else {
                t = ep(t, i.createIdentifier("default"), e.visitNode(r.expression, C), r, true);
            }
            return e.singleOrMany(t);
        }
        function $(t) {
            var n;
            if (e.hasSyntacticModifier(t, 1)) {
                n = e.append(n, e.setOriginalNode(e.setTextRange(i.createFunctionDeclaration(undefined, e.visitNodes(t.modifiers, ev, e.isModifier), t.asteriskToken, i.getDeclarationName(t, true, true), undefined, e.visitNodes(t.parameters, C), undefined, e.visitEachChild(t.body, C, r)), t), t));
            } else {
                n = e.append(n, e.visitEachChild(t, C, r));
            }
            if (ea(t)) {
                var a = e.getOriginalNodeId(t);
                v[a] = el(v[a], t);
            } else {
                n = el(n, t);
            }
            return e.singleOrMany(n);
        }
        function ee(t) {
            var n;
            if (e.hasSyntacticModifier(t, 1)) {
                n = e.append(n, e.setOriginalNode(e.setTextRange(i.createClassDeclaration(undefined, e.visitNodes(t.modifiers, ev, e.isModifier), i.getDeclarationName(t, true, true), undefined, e.visitNodes(t.heritageClauses, C), e.visitNodes(t.members, C)), t), t));
            } else {
                n = e.append(n, e.visitEachChild(t, C, r));
            }
            if (ea(t)) {
                var a = e.getOriginalNodeId(t);
                v[a] = el(v[a], t);
            } else {
                n = el(n, t);
            }
            return e.singleOrMany(n);
        }
        function er(t) {
            var n;
            var a;
            var s;
            if (e.hasSyntacticModifier(t, 1)) {
                var d = void 0;
                var o = false;
                for(var u = 0, c = t.declarationList.declarations; u < c.length; u++){
                    var l = c[u];
                    if (e.isIdentifier(l.name) && e.isLocalName(l.name)) {
                        if (!d) {
                            d = e.visitNodes(t.modifiers, ev, e.isModifier);
                        }
                        a = e.append(a, l);
                    } else if (l.initializer) {
                        if (!e.isBindingPattern(l.name) && (e.isArrowFunction(l.initializer) || e.isFunctionExpression(l.initializer) || e.isClassExpression(l.initializer))) {
                            var f = i.createAssignment(e.setTextRange(i.createPropertyAccessExpression(i.createIdentifier("exports"), l.name), l.name), i.createIdentifier(e.getTextOfIdentifierOrLiteral(l.name)));
                            var p = i.createVariableDeclaration(l.name, l.exclamationToken, l.type, e.visitNode(l.initializer, C));
                            a = e.append(a, p);
                            s = e.append(s, f);
                            o = true;
                        } else {
                            s = e.append(s, en(l));
                        }
                    }
                }
                if (a) {
                    n = e.append(n, i.updateVariableStatement(t, d, i.updateVariableDeclarationList(t.declarationList, a)));
                }
                if (s) {
                    var m = e.setOriginalNode(e.setTextRange(i.createExpressionStatement(i.inlineExpressions(s)), t), t);
                    if (o) {
                        e.removeAllComments(m);
                    }
                    n = e.append(n, m);
                }
            } else {
                n = e.append(n, e.visitEachChild(t, C, r));
            }
            if (ea(t)) {
                var g = e.getOriginalNodeId(t);
                v[g] = eu(v[g], t);
            } else {
                n = eu(n, t);
            }
            return e.singleOrMany(n);
        }
        function et(r, t, n) {
            var a = eD(r);
            if (a) {
                var s = e.isExportName(r) ? t : i.createAssignment(r, t);
                for(var d = 0, o = a; d < o.length; d++){
                    var u = o[d];
                    e.setEmitFlags(s, 4);
                    s = ex(u, s, n);
                }
                return s;
            }
            return i.createAssignment(r, t);
        }
        function en(t) {
            if (e.isBindingPattern(t.name)) {
                return e.flattenDestructuringAssignment(e.visitNode(t, C), undefined, r, 0, false, et);
            } else {
                return i.createAssignment(e.setTextRange(i.createPropertyAccessExpression(i.createIdentifier("exports"), t.name), t.name), t.initializer ? e.visitNode(t.initializer, C) : i.createVoidZero());
            }
        }
        function ei(r) {
            if (ea(r) && r.original.kind === 236) {
                var t = e.getOriginalNodeId(r);
                v[t] = eu(v[t], r.original);
            }
            return r;
        }
        function ea(r) {
            return (e.getEmitFlags(r) & 4194304) !== 0;
        }
        function es(r) {
            var t = e.getOriginalNodeId(r);
            var n = v[t];
            if (n) {
                delete v[t];
                return e.append(n, r);
            }
            return r;
        }
        function ed(e, r) {
            if (N.exportEquals) {
                return e;
            }
            var t = r.importClause;
            if (!t) {
                return e;
            }
            if (t.name) {
                e = ef(e, t);
            }
            var n = t.namedBindings;
            if (n) {
                switch(n.kind){
                    case 267:
                        e = ef(e, n);
                        break;
                    case 268:
                        for(var i = 0, a = n.elements; i < a.length; i++){
                            var s = a[i];
                            e = ef(e, s, true);
                        }
                        break;
                }
            }
            return e;
        }
        function eo(e, r) {
            if (N.exportEquals) {
                return e;
            }
            return ef(e, r);
        }
        function eu(e, r) {
            if (N.exportEquals) {
                return e;
            }
            for(var t = 0, n = r.declarationList.declarations; t < n.length; t++){
                var i = n[t];
                e = ec(e, i);
            }
            return e;
        }
        function ec(r, t) {
            if (N.exportEquals) {
                return r;
            }
            if (e.isBindingPattern(t.name)) {
                for(var n = 0, i = t.name.elements; n < i.length; n++){
                    var a = i[n];
                    if (!e.isOmittedExpression(a)) {
                        r = ec(r, a);
                    }
                }
            } else if (!e.isGeneratedIdentifier(t.name)) {
                r = ef(r, t);
            }
            return r;
        }
        function el(r, t) {
            if (N.exportEquals) {
                return r;
            }
            if (e.hasSyntacticModifier(t, 1)) {
                var n = e.hasSyntacticModifier(t, 512) ? i.createIdentifier("default") : i.getDeclarationName(t);
                r = ep(r, n, i.getLocalName(t), t);
            }
            if (t.name) {
                r = ef(r, t);
            }
            return r;
        }
        function ef(r, t, n) {
            var a = i.getDeclarationName(t);
            var s = N.exportSpecifiers.get(e.idText(a));
            if (s) {
                for(var d = 0, o = s; d < o.length; d++){
                    var u = o[d];
                    r = ep(r, u.name, a, u.name, undefined, n);
                }
            }
            return r;
        }
        function ep(r, t, n, i, a, s) {
            r = e.append(r, eg(t, n, i, a, s));
            return r;
        }
        function em() {
            var r;
            if (f === 0) {
                r = i.createExpressionStatement(ex(i.createIdentifier("__esModule"), i.createTrue()));
            } else {
                r = i.createExpressionStatement(i.createCallExpression(i.createPropertyAccessExpression(i.createIdentifier("Object"), "defineProperty"), undefined, [
                    i.createIdentifier("exports"),
                    i.createStringLiteral("__esModule"),
                    i.createObjectLiteralExpression([
                        i.createPropertyAssignment("value", i.createTrue())
                    ])
                ]));
            }
            e.setEmitFlags(r, 1048576);
            return r;
        }
        function eg(r, t, n, a, s) {
            var d = e.setTextRange(i.createExpressionStatement(ex(r, t, undefined, s)), n);
            e.startOnNewLine(d);
            if (!a) {
                e.setEmitFlags(d, 1536);
            }
            return d;
        }
        function ex(r, t, n, a) {
            return e.setTextRange(a && f !== 0 ? i.createCallExpression(i.createPropertyAccessExpression(i.createIdentifier("Object"), "defineProperty"), undefined, [
                i.createIdentifier("exports"),
                i.createStringLiteralFromNode(r),
                i.createObjectLiteralExpression([
                    i.createPropertyAssignment("enumerable", i.createTrue()),
                    i.createPropertyAssignment("get", i.createFunctionExpression(undefined, undefined, undefined, undefined, [], undefined, i.createBlock([
                        i.createReturnStatement(t)
                    ])))
                ])
            ]) : i.createAssignment(i.createPropertyAccessExpression(i.createIdentifier("exports"), i.cloneNode(r)), t), n);
        }
        function ev(e) {
            switch(e.kind){
                case 93:
                case 88:
                    return undefined;
            }
            return e;
        }
        function eE(r, t, n) {
            if (t.kind === 303) {
                E = t;
                N = x[e.getOriginalNodeId(E)];
                g(r, t, n);
                E = undefined;
                N = undefined;
            } else {
                g(r, t, n);
            }
        }
        function eN(r, t) {
            t = m(r, t);
            if (t.id && I[t.id]) {
                return t;
            }
            if (r === 1) {
                return eS(t);
            } else if (e.isShorthandPropertyAssignment(t)) {
                return eI(t);
            }
            return t;
        }
        function eI(r) {
            var t = r.name;
            var n = eh(t);
            if (n !== t) {
                if (r.objectAssignmentInitializer) {
                    var a = i.createAssignment(n, r.objectAssignmentInitializer);
                    return e.setTextRange(i.createPropertyAssignment(t, a), r);
                }
                return e.setTextRange(i.createPropertyAssignment(t, n), r);
            }
            return r;
        }
        function eS(e) {
            switch(e.kind){
                case 79:
                    return eh(e);
                case 207:
                    return ey(e);
                case 209:
                    return eA(e);
                case 220:
                    return eM(e);
            }
            return e;
        }
        function ey(r) {
            if (e.isIdentifier(r.expression)) {
                var t = eh(r.expression);
                I[e.getNodeId(t)] = true;
                if (!e.isIdentifier(t) && !(e.getEmitFlags(r.expression) & 4096)) {
                    return e.addEmitFlags(i.updateCallExpression(r, t, undefined, r.arguments), 536870912);
                }
            }
            return r;
        }
        function eA(r) {
            if (e.isIdentifier(r.tag)) {
                var t = eh(r.tag);
                I[e.getNodeId(t)] = true;
                if (!e.isIdentifier(t) && !(e.getEmitFlags(r.tag) & 4096)) {
                    return e.addEmitFlags(i.updateTaggedTemplateExpression(r, t, undefined, r.template), 536870912);
                }
            }
            return r;
        }
        function eh(r) {
            var t, n;
            if (e.getEmitFlags(r) & 4096) {
                var a = e.getExternalHelpersModuleName(E);
                if (a) {
                    return i.createPropertyAccessExpression(a, r);
                }
                return r;
            } else if (!(e.isGeneratedIdentifier(r) && !(r.autoGenerateFlags & 64)) && !e.isLocalName(r)) {
                var s = c.getReferencedExportContainer(r, e.isExportName(r));
                if (s && s.kind === 303) {
                    return e.setTextRange(i.createPropertyAccessExpression(i.createIdentifier("exports"), i.cloneNode(r)), r);
                }
                var d = c.getReferencedImportDeclaration(r);
                if (d) {
                    if (e.isImportClause(d)) {
                        return e.setTextRange(i.createPropertyAccessExpression(i.getGeneratedNameForNode(d.parent), i.createIdentifier("default")), r);
                    } else if (e.isImportSpecifier(d)) {
                        var o = d.propertyName || d.name;
                        return e.setTextRange(i.createPropertyAccessExpression(i.getGeneratedNameForNode(((n = (t = d.parent) === null || t === void 0 ? void 0 : t.parent) === null || n === void 0 ? void 0 : n.parent) || d), i.cloneNode(o)), r);
                    }
                }
            }
            return r;
        }
        function eM(r) {
            if (e.isAssignmentOperator(r.operatorToken.kind) && e.isIdentifier(r.left) && !e.isGeneratedIdentifier(r.left) && !e.isLocalName(r.left) && !e.isDeclarationNameOfEnumOrNamespace(r.left)) {
                var t = eD(r.left);
                if (t) {
                    var n = r;
                    for(var i = 0, a = t; i < a.length; i++){
                        var s = a[i];
                        I[e.getNodeId(n)] = true;
                        n = ex(s, n, r);
                    }
                    return n;
                }
            }
            return r;
        }
        function eD(r) {
            if (!e.isGeneratedIdentifier(r)) {
                var t = c.getReferencedImportDeclaration(r) || c.getReferencedValueDeclaration(r);
                if (t) {
                    return N && N.exportedBindings[e.getOriginalNodeId(t)];
                }
            }
        }
    }
    e.transformModule = r;
    var t = {
        name: "typescript:dynamicimport-sync-require",
        scoped: true,
        text: "\n            var __syncRequire = typeof module === \"object\" && typeof module.exports === \"object\";"
    };
})(e || (e = {}));
