var e;
(function(e) {
    function t(t) {
        function a(t) {
            switch(t){
                case e.ModuleKind.AMD:
                    return M;
                case e.ModuleKind.UMD:
                    return D;
                default:
                    return A;
            }
        }
        var i = t.factory, n = t.getEmitHelperFactory, s = t.startLexicalEnvironment, o = t.endLexicalEnvironment, c = t.hoistVariableDeclaration;
        var l = t.getCompilerOptions();
        var u = t.getEmitResolver();
        var d = t.getEmitHost();
        var p = e.getEmitScriptTarget(l);
        var f = e.getEmitModuleKind(l);
        var m = t.onSubstituteNode;
        var g = t.onEmitNode;
        t.onSubstituteNode = eN;
        t.onEmitNode = eE;
        t.enableSubstitution(207);
        t.enableSubstitution(209);
        t.enableSubstitution(79);
        t.enableSubstitution(220);
        t.enableSubstitution(295);
        t.enableEmitNotification(303);
        var x = [];
        var v = [];
        var E;
        var N;
        var I = [];
        var S;
        return e.chainBundle(t, y);
        function y(r) {
            if (r.isDeclarationFile || !(e.isEffectiveExternalModule(r, l) || r.transformFlags & 4194304 || (e.isJsonSourceFile(r) && e.hasJsonModuleEmitEnabled(l) && e.outFile(l)))) {
                return r;
            }
            E = r;
            N = e.collectExternalModuleInfo(t, r, u, l);
            x[e.getOriginalNodeId(r)] = N;
            var i = a(f);
            var n = i(r);
            E = undefined;
            N = undefined;
            S = false;
            return n;
        }
        function h() {
            if (!N.exportEquals && e.isExternalModule(E)) {
                return true;
            }
            return false;
        }
        function A(r) {
            s();
            var a = [];
            var n = e.getStrictOptionValue(l, "alwaysStrict") || (!l.noImplicitUseStrict && e.isExternalModule(E));
            var c = i.copyPrologue(r.statements, a, n && !e.isJsonSourceFile(r), O);
            if (h()) {
                e.append(a, em());
            }
            if (e.length(N.exportedNames)) {
                var u = 50;
                for(var d = 0; d < N.exportedNames.length; d += u){
                    e.append(a, i.createExpressionStatement(e.reduceLeft(N.exportedNames.slice(d, d + u), function(t, r) {
                        return i.createAssignment(i.createPropertyAccessExpression(i.createIdentifier("exports"), i.createIdentifier(e.idText(r))), t);
                    }, i.createVoidZero())));
                }
            }
            e.append(a, e.visitNode(N.externalHelpersImportDeclaration, O, e.isStatement));
            e.addRange(a, e.visitNodes(r.statements, O, e.isStatement, c));
            T(a, false);
            e.insertStatementsAfterStandardPrologue(a, o());
            var p = i.updateSourceFile(r, e.setTextRange(i.createNodeArray(a), r.statements));
            e.addEmitHelpers(p, t.readEmitHelpers());
            return p;
        }
        function M(r) {
            var a = i.createIdentifier("define");
            var n = e.tryGetModuleNameFromFile(i, r, d, l);
            var s = e.isJsonSourceFile(r) && r;
            var o = b(r, true), c = o.aliasedModuleNames, u = o.unaliasedModuleNames, p = o.importAliasNames;
            var f = i.updateSourceFile(r, e.setTextRange(i.createNodeArray([
                i.createExpressionStatement(i.createCallExpression(a, undefined, __spreadArray(__spreadArray([], (n ? [
                    n
                ] : []), true), [
                    i.createArrayLiteralExpression(s ? e.emptyArray : __spreadArray(__spreadArray([
                        i.createStringLiteral("require"),
                        i.createStringLiteral("exports")
                    ], c, true), u, true)),
                    s ? s.statements.length ? s.statements[0].expression : i.createObjectLiteralExpression() : i.createFunctionExpression(undefined, undefined, undefined, undefined, __spreadArray([
                        i.createParameterDeclaration(undefined, undefined, undefined, "require"),
                        i.createParameterDeclaration(undefined, undefined, undefined, "exports")
                    ], p, true), undefined, $(r))
                ], false)))
            ]), r.statements));
            e.addEmitHelpers(f, t.readEmitHelpers());
            return f;
        }
        function D(r) {
            var a = b(r, false), n = a.aliasedModuleNames, s = a.unaliasedModuleNames, o = a.importAliasNames;
            var c = e.tryGetModuleNameFromFile(i, r, d, l);
            var u = i.createFunctionExpression(undefined, undefined, undefined, undefined, [
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
                    i.createExpressionStatement(i.createCallExpression(i.createIdentifier("define"), undefined, __spreadArray(__spreadArray([], (c ? [
                        c
                    ] : []), true), [
                        i.createArrayLiteralExpression(__spreadArray(__spreadArray([
                            i.createStringLiteral("require"),
                            i.createStringLiteral("exports")
                        ], n, true), s, true)),
                        i.createIdentifier("factory")
                    ], false)))
                ])))
            ], true), undefined));
            var p = i.updateSourceFile(r, e.setTextRange(i.createNodeArray([
                i.createExpressionStatement(i.createCallExpression(u, undefined, [
                    i.createFunctionExpression(undefined, undefined, undefined, undefined, __spreadArray([
                        i.createParameterDeclaration(undefined, undefined, undefined, "require"),
                        i.createParameterDeclaration(undefined, undefined, undefined, "exports")
                    ], o, true), undefined, $(r))
                ]))
            ]), r.statements));
            e.addEmitHelpers(p, t.readEmitHelpers());
            return p;
        }
        function b(t, r) {
            var a = [];
            var n = [];
            var s = [];
            for(var o = 0, c = t.amdDependencies; o < c.length; o++){
                var p = c[o];
                if (p.name) {
                    a.push(i.createStringLiteral(p.path));
                    s.push(i.createParameterDeclaration(undefined, undefined, undefined, p.name));
                } else {
                    n.push(i.createStringLiteral(p.path));
                }
            }
            for(var f = 0, m = N.externalImports; f < m.length; f++){
                var g = m[f];
                var x = e.getExternalModuleNameLiteral(i, g, E, d, u, l);
                var v = e.getLocalNameForExternalImport(i, g, E);
                if (x) {
                    if (r && v) {
                        e.setEmitFlags(v, 4);
                        a.push(x);
                        s.push(i.createParameterDeclaration(undefined, undefined, undefined, v));
                    } else {
                        n.push(x);
                    }
                }
            }
            return {
                aliasedModuleNames: a,
                unaliasedModuleNames: n,
                importAliasNames: s
            };
        }
        function F(t) {
            if (e.isImportEqualsDeclaration(t) || e.isExportDeclaration(t) || !e.getExternalModuleNameLiteral(i, t, E, d, u, l)) {
                return undefined;
            }
            var r = e.getLocalNameForExternalImport(i, t, E);
            var a = U(t, r);
            if (a === r) {
                return undefined;
            }
            return i.createExpressionStatement(i.createAssignment(r, a));
        }
        function $(t) {
            s();
            var a = [];
            var n = i.copyPrologue(t.statements, a, !l.noImplicitUseStrict, O);
            if (h()) {
                e.append(a, em());
            }
            if (e.length(N.exportedNames)) {
                e.append(a, i.createExpressionStatement(e.reduceLeft(N.exportedNames, function(t, r) {
                    return i.createAssignment(i.createPropertyAccessExpression(i.createIdentifier("exports"), i.createIdentifier(e.idText(r))), t);
                }, i.createVoidZero())));
            }
            e.append(a, e.visitNode(N.externalHelpersImportDeclaration, O, e.isStatement));
            if (f === e.ModuleKind.AMD) {
                e.addRange(a, e.mapDefined(N.externalImports, F));
            }
            e.addRange(a, e.visitNodes(t.statements, O, e.isStatement, n));
            T(a, true);
            e.insertStatementsAfterStandardPrologue(a, o());
            var c = i.createBlock(a, true);
            if (S) {
                e.addEmitHelper(c, r);
            }
            return c;
        }
        function T(t, r) {
            if (N.exportEquals) {
                var a = e.visitNode(N.exportEquals.expression, L);
                if (a) {
                    if (r) {
                        var n = i.createReturnStatement(a);
                        e.setTextRange(n, N.exportEquals);
                        e.setEmitFlags(n, 384 | 1536);
                        t.push(n);
                    } else {
                        var n = i.createExpressionStatement(i.createAssignment(i.createPropertyAccessExpression(i.createIdentifier("module"), "exports"), a));
                        e.setTextRange(n, N.exportEquals);
                        e.setEmitFlags(n, 1536);
                        t.push(n);
                    }
                }
            }
        }
        function O(e) {
            switch(e.kind){
                case 265:
                    return J(e);
                case 264:
                    return Q(e);
                case 271:
                    return W(e);
                case 270:
                    return X(e);
                case 236:
                    return et(e);
                case 255:
                    return Y(e);
                case 256:
                    return ee(e);
                case 350:
                    return ei(e);
                case 351:
                    return es(e);
                default:
                    return L(e);
            }
        }
        function P(r, a) {
            if (!(r.transformFlags & (4194304 | 4096 | 67108864))) {
                return r;
            }
            switch(r.kind){
                case 241:
                    return k(r);
                case 237:
                    return q(r);
                case 211:
                    return V(r, a);
                case 348:
                    return H(r, a);
                case 207:
                    if (e.isImportCall(r) && E.impliedNodeFormat === undefined) {
                        return G(r);
                    }
                    break;
                case 220:
                    if (e.isDestructuringAssignment(r)) {
                        return _(r, a);
                    }
                    break;
                case 218:
                case 219:
                    return B(r, a);
            }
            return e.visitEachChild(r, L, t);
        }
        function L(e) {
            return P(e, false);
        }
        function C(e) {
            return P(e, true);
        }
        function R(t) {
            if (e.isObjectLiteralExpression(t)) {
                for(var r = 0, a = t.properties; r < a.length; r++){
                    var i = a[r];
                    switch(i.kind){
                        case 294:
                            if (R(i.initializer)) {
                                return true;
                            }
                            break;
                        case 295:
                            if (R(i.name)) {
                                return true;
                            }
                            break;
                        case 296:
                            if (R(i.expression)) {
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
            } else if (e.isArrayLiteralExpression(t)) {
                for(var n = 0, s = t.elements; n < s.length; n++){
                    var i = s[n];
                    if (e.isSpreadElement(i)) {
                        if (R(i.expression)) {
                            return true;
                        }
                    } else if (R(i)) {
                        return true;
                    }
                }
            } else if (e.isIdentifier(t)) {
                return e.length(eD(t)) > (e.isExportName(t) ? 1 : 0);
            }
            return false;
        }
        function _(r, a) {
            if (R(r.left)) {
                return e.flattenDestructuringAssignment(r, L, t, 0, !a, er);
            }
            return e.visitEachChild(r, L, t);
        }
        function k(r) {
            return i.updateForStatement(r, e.visitNode(r.initializer, C, e.isForInitializer), e.visitNode(r.condition, L, e.isExpression), e.visitNode(r.incrementor, C, e.isExpression), e.visitIterationBody(r.statement, L, t));
        }
        function q(t) {
            return i.updateExpressionStatement(t, e.visitNode(t.expression, C, e.isExpression));
        }
        function V(t, r) {
            return i.updateParenthesizedExpression(t, e.visitNode(t.expression, r ? C : L, e.isExpression));
        }
        function H(t, r) {
            return i.updatePartiallyEmittedExpression(t, e.visitNode(t.expression, r ? C : L, e.isExpression));
        }
        function B(r, a) {
            if ((r.operator === 45 || r.operator === 46) && e.isIdentifier(r.operand) && !e.isGeneratedIdentifier(r.operand) && !e.isLocalName(r.operand) && !e.isDeclarationNameOfEnumOrNamespace(r.operand)) {
                var n = eD(r.operand);
                if (n) {
                    var s = void 0;
                    var o = e.visitNode(r.operand, L, e.isExpression);
                    if (e.isPrefixUnaryExpression(r)) {
                        o = i.updatePrefixUnaryExpression(r, o);
                    } else {
                        o = i.updatePostfixUnaryExpression(r, o);
                        if (!a) {
                            s = i.createTempVariable(c);
                            o = i.createAssignment(s, o);
                            e.setTextRange(o, r);
                        }
                        o = i.createComma(o, i.cloneNode(r.operand));
                        e.setTextRange(o, r);
                    }
                    for(var l = 0, u = n; l < u.length; l++){
                        var d = u[l];
                        I[e.getNodeId(o)] = true;
                        o = ex(d, o);
                        e.setTextRange(o, r);
                    }
                    if (s) {
                        I[e.getNodeId(o)] = true;
                        o = i.createComma(o, s);
                        e.setTextRange(o, r);
                    }
                    return o;
                }
            }
            return e.visitEachChild(r, L, t);
        }
        function G(t) {
            var r = e.getExternalModuleNameLiteral(i, t, E, d, u, l);
            var a = e.visitNode(e.firstOrUndefined(t.arguments), L);
            var n = r && (!a || !e.isStringLiteral(a) || a.text !== r.text) ? r : a;
            var s = !!(t.transformFlags & 8192);
            switch(l.module){
                case e.ModuleKind.AMD:
                    return w(n, s);
                case e.ModuleKind.UMD:
                    return j(n !== null && n !== void 0 ? n : i.createVoidZero(), s);
                case e.ModuleKind.CommonJS:
                default:
                    return z(n, s);
            }
        }
        function j(t, r) {
            S = true;
            if (e.isSimpleCopiableExpression(t)) {
                var a = e.isGeneratedIdentifier(t) ? t : e.isStringLiteral(t) ? i.createStringLiteralFromNode(t) : e.setEmitFlags(e.setTextRange(i.cloneNode(t), t), 1536);
                return i.createConditionalExpression(i.createIdentifier("__syncRequire"), undefined, z(t, r), undefined, w(a, r));
            } else {
                var n = i.createTempVariable(c);
                return i.createComma(i.createAssignment(n, t), i.createConditionalExpression(i.createIdentifier("__syncRequire"), undefined, z(n, r), undefined, w(n, r)));
            }
        }
        function w(t, r) {
            var a = i.createUniqueName("resolve");
            var s = i.createUniqueName("reject");
            var o = [
                i.createParameterDeclaration(undefined, undefined, undefined, a),
                i.createParameterDeclaration(undefined, undefined, undefined, s)
            ];
            var c = i.createBlock([
                i.createExpressionStatement(i.createCallExpression(i.createIdentifier("require"), undefined, [
                    i.createArrayLiteralExpression([
                        t || i.createOmittedExpression()
                    ]),
                    a,
                    s
                ]))
            ]);
            var u;
            if (p >= 2) {
                u = i.createArrowFunction(undefined, undefined, o, undefined, undefined, c);
            } else {
                u = i.createFunctionExpression(undefined, undefined, undefined, undefined, o, undefined, c);
                if (r) {
                    e.setEmitFlags(u, 8);
                }
            }
            var d = i.createNewExpression(i.createIdentifier("Promise"), undefined, [
                u
            ]);
            if (e.getESModuleInterop(l)) {
                return i.createCallExpression(i.createPropertyAccessExpression(d, i.createIdentifier("then")), undefined, [
                    n().createImportStarCallbackHelper()
                ]);
            }
            return d;
        }
        function z(t, r) {
            var a = i.createCallExpression(i.createPropertyAccessExpression(i.createIdentifier("Promise"), "resolve"), undefined, []);
            var s = i.createCallExpression(i.createIdentifier("require"), undefined, t ? [
                t
            ] : []);
            if (e.getESModuleInterop(l)) {
                s = n().createImportStarHelper(s);
            }
            var o;
            if (p >= 2) {
                o = i.createArrowFunction(undefined, undefined, [], undefined, undefined, s);
            } else {
                o = i.createFunctionExpression(undefined, undefined, undefined, undefined, [], undefined, i.createBlock([
                    i.createReturnStatement(s)
                ]));
                if (r) {
                    e.setEmitFlags(o, 8);
                }
            }
            return i.createCallExpression(i.createPropertyAccessExpression(a, "then"), undefined, [
                o
            ]);
        }
        function K(t, r) {
            if (!e.getESModuleInterop(l) || e.getEmitFlags(t) & 67108864) {
                return r;
            }
            if (e.getExportNeedsImportStarHelper(t)) {
                return n().createImportStarHelper(r);
            }
            return r;
        }
        function U(t, r) {
            if (!e.getESModuleInterop(l) || e.getEmitFlags(t) & 67108864) {
                return r;
            }
            if (e.getImportNeedsImportStarHelper(t)) {
                return n().createImportStarHelper(r);
            }
            if (e.getImportNeedsImportDefaultHelper(t)) {
                return n().createImportDefaultHelper(r);
            }
            return r;
        }
        function J(t) {
            var r;
            var a = e.getNamespaceDeclarationNode(t);
            if (f !== e.ModuleKind.AMD) {
                if (!t.importClause) {
                    return e.setOriginalNode(e.setTextRange(i.createExpressionStatement(Z(t)), t), t);
                } else {
                    var n = [];
                    if (a && !e.isDefaultImport(t)) {
                        n.push(i.createVariableDeclaration(i.cloneNode(a.name), undefined, undefined, U(t, Z(t))));
                    } else {
                        n.push(i.createVariableDeclaration(i.getGeneratedNameForNode(t), undefined, undefined, U(t, Z(t))));
                        if (a && e.isDefaultImport(t)) {
                            n.push(i.createVariableDeclaration(i.cloneNode(a.name), undefined, undefined, i.getGeneratedNameForNode(t)));
                        }
                    }
                    r = e.append(r, e.setOriginalNode(e.setTextRange(i.createVariableStatement(undefined, i.createVariableDeclarationList(n, p >= 2 ? 2 : 0)), t), t));
                }
            } else if (a && e.isDefaultImport(t)) {
                r = e.append(r, i.createVariableStatement(undefined, i.createVariableDeclarationList([
                    e.setOriginalNode(e.setTextRange(i.createVariableDeclaration(i.cloneNode(a.name), undefined, undefined, i.getGeneratedNameForNode(t)), t), t)
                ], p >= 2 ? 2 : 0)));
            }
            if (en(t)) {
                var s = e.getOriginalNodeId(t);
                v[s] = eo(v[s], t);
            } else {
                r = eo(r, t);
            }
            return e.singleOrMany(r);
        }
        function Z(t) {
            var r = e.getExternalModuleNameLiteral(i, t, E, d, u, l);
            var a = [];
            if (r) {
                a.push(r);
            }
            return i.createCallExpression(i.createIdentifier("require"), undefined, a);
        }
        function Q(t) {
            e.Debug.assert(e.isExternalModuleImportEqualsDeclaration(t), "import= for internal module references should be handled in an earlier transformer.");
            var r;
            if (f !== e.ModuleKind.AMD) {
                if (e.hasSyntacticModifier(t, 1)) {
                    r = e.append(r, e.setOriginalNode(e.setTextRange(i.createExpressionStatement(ex(t.name, Z(t))), t), t));
                } else {
                    r = e.append(r, e.setOriginalNode(e.setTextRange(i.createVariableStatement(undefined, i.createVariableDeclarationList([
                        i.createVariableDeclaration(i.cloneNode(t.name), undefined, undefined, Z(t))
                    ], p >= 2 ? 2 : 0)), t), t));
                }
            } else {
                if (e.hasSyntacticModifier(t, 1)) {
                    r = e.append(r, e.setOriginalNode(e.setTextRange(i.createExpressionStatement(ex(i.getExportName(t), i.getLocalName(t))), t), t));
                }
            }
            if (en(t)) {
                var a = e.getOriginalNodeId(t);
                v[a] = ec(v[a], t);
            } else {
                r = ec(r, t);
            }
            return e.singleOrMany(r);
        }
        function W(t) {
            if (!t.moduleSpecifier) {
                return undefined;
            }
            var r = i.getGeneratedNameForNode(t);
            if (t.exportClause && e.isNamedExports(t.exportClause)) {
                var a = [];
                if (f !== e.ModuleKind.AMD) {
                    a.push(e.setOriginalNode(e.setTextRange(i.createVariableStatement(undefined, i.createVariableDeclarationList([
                        i.createVariableDeclaration(r, undefined, undefined, Z(t))
                    ])), t), t));
                }
                for(var s = 0, o = t.exportClause.elements; s < o.length; s++){
                    var c = o[s];
                    if (p === 0) {
                        a.push(e.setOriginalNode(e.setTextRange(i.createExpressionStatement(n().createCreateBindingHelper(r, i.createStringLiteralFromNode(c.propertyName || c.name), c.propertyName ? i.createStringLiteralFromNode(c.name) : undefined)), c), c));
                    } else {
                        var u = !!e.getESModuleInterop(l) && !(e.getEmitFlags(t) & 67108864) && e.idText(c.propertyName || c.name) === "default";
                        var d = i.createPropertyAccessExpression(u ? n().createImportDefaultHelper(r) : r, c.propertyName || c.name);
                        a.push(e.setOriginalNode(e.setTextRange(i.createExpressionStatement(ex(i.getExportName(c), d, undefined, true)), c), c));
                    }
                }
                return e.singleOrMany(a);
            } else if (t.exportClause) {
                var a = [];
                a.push(e.setOriginalNode(e.setTextRange(i.createExpressionStatement(ex(i.cloneNode(t.exportClause.name), K(t, f !== e.ModuleKind.AMD ? Z(t) : e.isExportNamespaceAsDefaultDeclaration(t) ? r : i.createIdentifier(e.idText(t.exportClause.name))))), t), t));
                return e.singleOrMany(a);
            } else {
                return e.setOriginalNode(e.setTextRange(i.createExpressionStatement(n().createExportStarHelper(f !== e.ModuleKind.AMD ? Z(t) : r)), t), t);
            }
        }
        function X(t) {
            if (t.isExportEquals) {
                return undefined;
            }
            var r;
            var a = t.original;
            if (a && en(a)) {
                var n = e.getOriginalNodeId(t);
                v[n] = ef(v[n], i.createIdentifier("default"), e.visitNode(t.expression, L), t, true);
            } else {
                r = ef(r, i.createIdentifier("default"), e.visitNode(t.expression, L), t, true);
            }
            return e.singleOrMany(r);
        }
        function Y(r) {
            var a;
            if (e.hasSyntacticModifier(r, 1)) {
                a = e.append(a, e.setOriginalNode(e.setTextRange(i.createFunctionDeclaration(undefined, e.visitNodes(r.modifiers, ev, e.isModifier), r.asteriskToken, i.getDeclarationName(r, true, true), undefined, e.visitNodes(r.parameters, L), undefined, e.visitEachChild(r.body, L, t)), r), r));
            } else {
                a = e.append(a, e.visitEachChild(r, L, t));
            }
            if (en(r)) {
                var n = e.getOriginalNodeId(r);
                v[n] = ed(v[n], r);
            } else {
                a = ed(a, r);
            }
            return e.singleOrMany(a);
        }
        function ee(r) {
            var a;
            if (e.hasSyntacticModifier(r, 1)) {
                a = e.append(a, e.setOriginalNode(e.setTextRange(i.createClassDeclaration(undefined, e.visitNodes(r.modifiers, ev, e.isModifier), i.getDeclarationName(r, true, true), undefined, e.visitNodes(r.heritageClauses, L), e.visitNodes(r.members, L)), r), r));
            } else {
                a = e.append(a, e.visitEachChild(r, L, t));
            }
            if (en(r)) {
                var n = e.getOriginalNodeId(r);
                v[n] = ed(v[n], r);
            } else {
                a = ed(a, r);
            }
            return e.singleOrMany(a);
        }
        function et(r) {
            var a;
            var n;
            var s;
            if (e.hasSyntacticModifier(r, 1)) {
                var o = void 0;
                var c = false;
                for(var l = 0, u = r.declarationList.declarations; l < u.length; l++){
                    var d = u[l];
                    if (e.isIdentifier(d.name) && e.isLocalName(d.name)) {
                        if (!o) {
                            o = e.visitNodes(r.modifiers, ev, e.isModifier);
                        }
                        n = e.append(n, d);
                    } else if (d.initializer) {
                        if (!e.isBindingPattern(d.name) && (e.isArrowFunction(d.initializer) || e.isFunctionExpression(d.initializer) || e.isClassExpression(d.initializer))) {
                            var p = i.createAssignment(e.setTextRange(i.createPropertyAccessExpression(i.createIdentifier("exports"), d.name), d.name), i.createIdentifier(e.getTextOfIdentifierOrLiteral(d.name)));
                            var f = i.createVariableDeclaration(d.name, d.exclamationToken, d.type, e.visitNode(d.initializer, L));
                            n = e.append(n, f);
                            s = e.append(s, p);
                            c = true;
                        } else {
                            s = e.append(s, ea(d));
                        }
                    }
                }
                if (n) {
                    a = e.append(a, i.updateVariableStatement(r, o, i.updateVariableDeclarationList(r.declarationList, n)));
                }
                if (s) {
                    var m = e.setOriginalNode(e.setTextRange(i.createExpressionStatement(i.inlineExpressions(s)), r), r);
                    if (c) {
                        e.removeAllComments(m);
                    }
                    a = e.append(a, m);
                }
            } else {
                a = e.append(a, e.visitEachChild(r, L, t));
            }
            if (en(r)) {
                var g = e.getOriginalNodeId(r);
                v[g] = el(v[g], r);
            } else {
                a = el(a, r);
            }
            return e.singleOrMany(a);
        }
        function er(t, r, a) {
            var n = eD(t);
            if (n) {
                var s = e.isExportName(t) ? r : i.createAssignment(t, r);
                for(var o = 0, c = n; o < c.length; o++){
                    var l = c[o];
                    e.setEmitFlags(s, 4);
                    s = ex(l, s, a);
                }
                return s;
            }
            return i.createAssignment(t, r);
        }
        function ea(r) {
            if (e.isBindingPattern(r.name)) {
                return e.flattenDestructuringAssignment(e.visitNode(r, L), undefined, t, 0, false, er);
            } else {
                return i.createAssignment(e.setTextRange(i.createPropertyAccessExpression(i.createIdentifier("exports"), r.name), r.name), r.initializer ? e.visitNode(r.initializer, L) : i.createVoidZero());
            }
        }
        function ei(t) {
            if (en(t) && t.original.kind === 236) {
                var r = e.getOriginalNodeId(t);
                v[r] = el(v[r], t.original);
            }
            return t;
        }
        function en(t) {
            return (e.getEmitFlags(t) & 4194304) !== 0;
        }
        function es(t) {
            var r = e.getOriginalNodeId(t);
            var a = v[r];
            if (a) {
                delete v[r];
                return e.append(a, t);
            }
            return t;
        }
        function eo(e, t) {
            if (N.exportEquals) {
                return e;
            }
            var r = t.importClause;
            if (!r) {
                return e;
            }
            if (r.name) {
                e = ep(e, r);
            }
            var a = r.namedBindings;
            if (a) {
                switch(a.kind){
                    case 267:
                        e = ep(e, a);
                        break;
                    case 268:
                        for(var i = 0, n = a.elements; i < n.length; i++){
                            var s = n[i];
                            e = ep(e, s, true);
                        }
                        break;
                }
            }
            return e;
        }
        function ec(e, t) {
            if (N.exportEquals) {
                return e;
            }
            return ep(e, t);
        }
        function el(e, t) {
            if (N.exportEquals) {
                return e;
            }
            for(var r = 0, a = t.declarationList.declarations; r < a.length; r++){
                var i = a[r];
                e = eu(e, i);
            }
            return e;
        }
        function eu(t, r) {
            if (N.exportEquals) {
                return t;
            }
            if (e.isBindingPattern(r.name)) {
                for(var a = 0, i = r.name.elements; a < i.length; a++){
                    var n = i[a];
                    if (!e.isOmittedExpression(n)) {
                        t = eu(t, n);
                    }
                }
            } else if (!e.isGeneratedIdentifier(r.name)) {
                t = ep(t, r);
            }
            return t;
        }
        function ed(t, r) {
            if (N.exportEquals) {
                return t;
            }
            if (e.hasSyntacticModifier(r, 1)) {
                var a = e.hasSyntacticModifier(r, 512) ? i.createIdentifier("default") : i.getDeclarationName(r);
                t = ef(t, a, i.getLocalName(r), r);
            }
            if (r.name) {
                t = ep(t, r);
            }
            return t;
        }
        function ep(t, r, a) {
            var n = i.getDeclarationName(r);
            var s = N.exportSpecifiers.get(e.idText(n));
            if (s) {
                for(var o = 0, c = s; o < c.length; o++){
                    var l = c[o];
                    t = ef(t, l.name, n, l.name, undefined, a);
                }
            }
            return t;
        }
        function ef(t, r, a, i, n, s) {
            t = e.append(t, eg(r, a, i, n, s));
            return t;
        }
        function em() {
            var t;
            if (p === 0) {
                t = i.createExpressionStatement(ex(i.createIdentifier("__esModule"), i.createTrue()));
            } else {
                t = i.createExpressionStatement(i.createCallExpression(i.createPropertyAccessExpression(i.createIdentifier("Object"), "defineProperty"), undefined, [
                    i.createIdentifier("exports"),
                    i.createStringLiteral("__esModule"),
                    i.createObjectLiteralExpression([
                        i.createPropertyAssignment("value", i.createTrue())
                    ])
                ]));
            }
            e.setEmitFlags(t, 1048576);
            return t;
        }
        function eg(t, r, a, n, s) {
            var o = e.setTextRange(i.createExpressionStatement(ex(t, r, undefined, s)), a);
            e.startOnNewLine(o);
            if (!n) {
                e.setEmitFlags(o, 1536);
            }
            return o;
        }
        function ex(t, r, a, n) {
            return e.setTextRange(n && p !== 0 ? i.createCallExpression(i.createPropertyAccessExpression(i.createIdentifier("Object"), "defineProperty"), undefined, [
                i.createIdentifier("exports"),
                i.createStringLiteralFromNode(t),
                i.createObjectLiteralExpression([
                    i.createPropertyAssignment("enumerable", i.createTrue()),
                    i.createPropertyAssignment("get", i.createFunctionExpression(undefined, undefined, undefined, undefined, [], undefined, i.createBlock([
                        i.createReturnStatement(r)
                    ])))
                ])
            ]) : i.createAssignment(i.createPropertyAccessExpression(i.createIdentifier("exports"), i.cloneNode(t)), r), a);
        }
        function ev(e) {
            switch(e.kind){
                case 93:
                case 88:
                    return undefined;
            }
            return e;
        }
        function eE(t, r, a) {
            if (r.kind === 303) {
                E = r;
                N = x[e.getOriginalNodeId(E)];
                g(t, r, a);
                E = undefined;
                N = undefined;
            } else {
                g(t, r, a);
            }
        }
        function eN(t, r) {
            r = m(t, r);
            if (r.id && I[r.id]) {
                return r;
            }
            if (t === 1) {
                return eS(r);
            } else if (e.isShorthandPropertyAssignment(r)) {
                return eI(r);
            }
            return r;
        }
        function eI(t) {
            var r = t.name;
            var a = eA(r);
            if (a !== r) {
                if (t.objectAssignmentInitializer) {
                    var n = i.createAssignment(a, t.objectAssignmentInitializer);
                    return e.setTextRange(i.createPropertyAssignment(r, n), t);
                }
                return e.setTextRange(i.createPropertyAssignment(r, a), t);
            }
            return t;
        }
        function eS(e) {
            switch(e.kind){
                case 79:
                    return eA(e);
                case 207:
                    return ey(e);
                case 209:
                    return eh(e);
                case 220:
                    return eM(e);
            }
            return e;
        }
        function ey(t) {
            if (e.isIdentifier(t.expression)) {
                var r = eA(t.expression);
                I[e.getNodeId(r)] = true;
                if (!e.isIdentifier(r) && !(e.getEmitFlags(t.expression) & 4096)) {
                    return e.addEmitFlags(i.updateCallExpression(t, r, undefined, t.arguments), 536870912);
                }
            }
            return t;
        }
        function eh(t) {
            if (e.isIdentifier(t.tag)) {
                var r = eA(t.tag);
                I[e.getNodeId(r)] = true;
                if (!e.isIdentifier(r) && !(e.getEmitFlags(t.tag) & 4096)) {
                    return e.addEmitFlags(i.updateTaggedTemplateExpression(t, r, undefined, t.template), 536870912);
                }
            }
            return t;
        }
        function eA(t) {
            var r, a;
            if (e.getEmitFlags(t) & 4096) {
                var n = e.getExternalHelpersModuleName(E);
                if (n) {
                    return i.createPropertyAccessExpression(n, t);
                }
                return t;
            } else if (!(e.isGeneratedIdentifier(t) && !(t.autoGenerateFlags & 64)) && !e.isLocalName(t)) {
                var s = u.getReferencedExportContainer(t, e.isExportName(t));
                if (s && s.kind === 303) {
                    return e.setTextRange(i.createPropertyAccessExpression(i.createIdentifier("exports"), i.cloneNode(t)), t);
                }
                var o = u.getReferencedImportDeclaration(t);
                if (o) {
                    if (e.isImportClause(o)) {
                        return e.setTextRange(i.createPropertyAccessExpression(i.getGeneratedNameForNode(o.parent), i.createIdentifier("default")), t);
                    } else if (e.isImportSpecifier(o)) {
                        var c = o.propertyName || o.name;
                        return e.setTextRange(i.createPropertyAccessExpression(i.getGeneratedNameForNode(((a = (r = o.parent) === null || r === void 0 ? void 0 : r.parent) === null || a === void 0 ? void 0 : a.parent) || o), i.cloneNode(c)), t);
                    }
                }
            }
            return t;
        }
        function eM(t) {
            if (e.isAssignmentOperator(t.operatorToken.kind) && e.isIdentifier(t.left) && !e.isGeneratedIdentifier(t.left) && !e.isLocalName(t.left) && !e.isDeclarationNameOfEnumOrNamespace(t.left)) {
                var r = eD(t.left);
                if (r) {
                    var a = t;
                    for(var i = 0, n = r; i < n.length; i++){
                        var s = n[i];
                        I[e.getNodeId(a)] = true;
                        a = ex(s, a, t);
                    }
                    return a;
                }
            }
            return t;
        }
        function eD(t) {
            if (!e.isGeneratedIdentifier(t)) {
                var r = u.getReferencedImportDeclaration(t) || u.getReferencedValueDeclaration(t);
                if (r) {
                    return N && N.exportedBindings[e.getOriginalNodeId(r)];
                }
            }
        }
    }
    e.transformModule = t;
    var r = {
        name: "typescript:dynamicimport-sync-require",
        scoped: true,
        text: "\n            var __syncRequire = typeof module === \"object\" && typeof module.exports === \"object\";"
    };
})(e || (e = {}));
