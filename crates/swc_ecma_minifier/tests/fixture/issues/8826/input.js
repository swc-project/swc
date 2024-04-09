
export function createTypeChecker(host) {

    return {
        getFlowTypeOfReference
    }

    function getFlowTypeOfReference(reference, declaredType, initialType = declaredType, flowContainer, flowNode = (_a2 => (_a2 = tryCast(reference, canHaveFlowNode)) == null ? void 0 : _a2.flowNode)()) {
        let key;
        let isKeySet = false;
        let flowDepth = 0;
        if (flowAnalysisDisabled) {
            return errorType;
        }
        if (!flowNode) {
            return declaredType;
        }
        flowInvocationCount++;
        const sharedFlowStart = sharedFlowCount;
        const evolvedType = getTypeFromFlowType(getTypeAtFlowNode(flowNode));
        sharedFlowCount = sharedFlowStart;
        const resultType = getObjectFlags(evolvedType) & 256 && isEvolvingArrayOperationTarget(reference) ? autoArrayType : finalizeEvolvingArrayType(evolvedType);
        if (resultType === unreachableNeverType || reference.parent && reference.parent.kind === 232 && !(resultType.flags & 131072) && getTypeWithFacts(resultType, 2097152).flags & 131072) {
            return declaredType;
        }
        return resultType === nonNullUnknownType ? unknownType : resultType;
        function getOrSetCacheKey() {
            if (isKeySet) {
                return key;
            }
            isKeySet = true;
            return key = getFlowCacheKey(reference, declaredType, initialType, flowContainer);
        }
        function getTypeAtFlowNode(flow) {
            var _a3;
            if (flowDepth === 2e3) {
                (_a3 = tracing) == null ? void 0 : _a3.instant(tracing.Phase.CheckTypes, "getTypeAtFlowNode_DepthLimit", {
                    flowId: flow.id
                });
                flowAnalysisDisabled = true;
                reportFlowControlError(reference);
                return errorType;
            }
            flowDepth++;
            let sharedFlow;
            while (true) {
                const flags = flow.flags;
                if (flags & 4096) {
                    for (let i = sharedFlowStart; i < sharedFlowCount; i++) {
                        if (sharedFlowNodes[i] === flow) {
                            flowDepth--;
                            return sharedFlowTypes[i];
                        }
                    }
                    sharedFlow = flow;
                }
                let type;
                if (flags & 16) {
                    type = getTypeAtFlowAssignment(flow);
                    if (!type) {
                        flow = flow.antecedent;
                        continue;
                    }
                } else if (flags & 512) {
                    type = getTypeAtFlowCall(flow);
                    if (!type) {
                        flow = flow.antecedent;
                        continue;
                    }
                } else if (flags & 96) {
                    type = getTypeAtFlowCondition(flow);
                } else if (flags & 128) {
                    type = getTypeAtSwitchClause(flow);
                } else if (flags & 12) {
                    if (flow.antecedents.length === 1) {
                        flow = flow.antecedents[0];
                        continue;
                    }
                    type = flags & 4 ? getTypeAtFlowBranchLabel(flow) : getTypeAtFlowLoopLabel(flow);
                } else if (flags & 256) {
                    type = getTypeAtFlowArrayMutation(flow);
                    if (!type) {
                        flow = flow.antecedent;
                        continue;
                    }
                } else if (flags & 1024) {
                    const target = flow.target;
                    const saveAntecedents = target.antecedents;
                    target.antecedents = flow.antecedents;
                    type = getTypeAtFlowNode(flow.antecedent);
                    target.antecedents = saveAntecedents;
                } else if (flags & 2) {
                    const container = flow.node;
                    if (container && container !== flowContainer && reference.kind !== 208 && reference.kind !== 209 && reference.kind !== 108) {
                        flow = container.flowNode;
                        continue;
                    }
                    type = initialType;
                } else {
                    type = convertAutoToAny(declaredType);
                }
                if (sharedFlow) {
                    sharedFlowNodes[sharedFlowCount] = sharedFlow;
                    sharedFlowTypes[sharedFlowCount] = type;
                    sharedFlowCount++;
                }
                flowDepth--;
                return type;
            }
        }
        function getInitialOrAssignedType(flow) {
            const node = flow.node;
            return getNarrowableTypeForReference(node.kind === 257 || node.kind === 205 ? getInitialType(node) : getAssignedType(node), reference);
        }
        function getTypeAtFlowAssignment(flow) {
            const node = flow.node;
            if (isMatchingReference(reference, node)) {
                if (!isReachableFlowNode(flow)) {
                    return unreachableNeverType;
                }
                if (getAssignmentTargetKind(node) === 2) {
                    const flowType = getTypeAtFlowNode(flow.antecedent);
                    return createFlowType(getBaseTypeOfLiteralType(getTypeFromFlowType(flowType)), isIncomplete(flowType));
                }
                if (declaredType === autoType || declaredType === autoArrayType) {
                    if (isEmptyArrayAssignment(node)) {
                        return getEvolvingArrayType(neverType);
                    }
                    const assignedType = getWidenedLiteralType(getInitialOrAssignedType(flow));
                    return isTypeAssignableTo(assignedType, declaredType) ? assignedType : anyArrayType;
                }
                if (declaredType.flags & 1048576) {
                    return getAssignmentReducedType(declaredType, getInitialOrAssignedType(flow));
                }
                return declaredType;
            }
            if (containsMatchingReference(reference, node)) {
                if (!isReachableFlowNode(flow)) {
                    return unreachableNeverType;
                }
                if (isVariableDeclaration(node) && (isInJSFile(node) || isVarConst(node))) {
                    const init = getDeclaredExpandoInitializer(node);
                    if (init && (init.kind === 215 || init.kind === 216)) {
                        return getTypeAtFlowNode(flow.antecedent);
                    }
                }
                return declaredType;
            }
            if (isVariableDeclaration(node) && node.parent.parent.kind === 246 && (isMatchingReference(reference, node.parent.parent.expression) || optionalChainContainsReference(node.parent.parent.expression, reference))) {
                return getNonNullableTypeIfNeeded(finalizeEvolvingArrayType(getTypeFromFlowType(getTypeAtFlowNode(flow.antecedent))));
            }
            return void 0;
        }
        function narrowTypeByAssertion(type, expr) {
            const node = skipParentheses(expr, true);
            if (node.kind === 95) {
                return unreachableNeverType;
            }
            if (node.kind === 223) {
                if (node.operatorToken.kind === 55) {
                    return narrowTypeByAssertion(narrowTypeByAssertion(type, node.left), node.right);
                }
                if (node.operatorToken.kind === 56) {
                    return getUnionType([narrowTypeByAssertion(type, node.left), narrowTypeByAssertion(type, node.right)]);
                }
            }
            return narrowType(type, node, true);
        }
        function getTypeAtFlowCall(flow) {
            const signature = getEffectsSignature(flow.node);
            if (signature) {
                const predicate = getTypePredicateOfSignature(signature);
                if (predicate && (predicate.kind === 2 || predicate.kind === 3)) {
                    const flowType = getTypeAtFlowNode(flow.antecedent);
                    const type = finalizeEvolvingArrayType(getTypeFromFlowType(flowType));
                    const narrowedType = predicate.type ? narrowTypeByTypePredicate(type, predicate, flow.node, true) : predicate.kind === 3 && predicate.parameterIndex >= 0 && predicate.parameterIndex < flow.node.arguments.length ? narrowTypeByAssertion(type, flow.node.arguments[predicate.parameterIndex]) : type;
                    return narrowedType === type ? flowType : createFlowType(narrowedType, isIncomplete(flowType));
                }
                if (getReturnTypeOfSignature(signature).flags & 131072) {
                    return unreachableNeverType;
                }
            }
            return void 0;
        }
        function getTypeAtFlowArrayMutation(flow) {
            if (declaredType === autoType || declaredType === autoArrayType) {
                const node = flow.node;
                const expr = node.kind === 210 ? node.expression.expression : node.left.expression;
                if (isMatchingReference(reference, getReferenceCandidate(expr))) {
                    const flowType = getTypeAtFlowNode(flow.antecedent);
                    const type = getTypeFromFlowType(flowType);
                    if (getObjectFlags(type) & 256) {
                        let evolvedType2 = type;
                        if (node.kind === 210) {
                            for (const arg of node.arguments) {
                                evolvedType2 = addEvolvingArrayElementType(evolvedType2, arg);
                            }
                        } else {
                            const indexType = getContextFreeTypeOfExpression(node.left.argumentExpression);
                            if (isTypeAssignableToKind(indexType, 296)) {
                                evolvedType2 = addEvolvingArrayElementType(evolvedType2, node.right);
                            }
                        }
                        return evolvedType2 === type ? flowType : createFlowType(evolvedType2, isIncomplete(flowType));
                    }
                    return flowType;
                }
            }
            return void 0;
        }
        function getTypeAtFlowCondition(flow) {
            const flowType = getTypeAtFlowNode(flow.antecedent);
            const type = getTypeFromFlowType(flowType);
            if (type.flags & 131072) {
                return flowType;
            }
            const assumeTrue = (flow.flags & 32) !== 0;
            const nonEvolvingType = finalizeEvolvingArrayType(type);
            const narrowedType = narrowType(nonEvolvingType, flow.node, assumeTrue);
            if (narrowedType === nonEvolvingType) {
                return flowType;
            }
            return createFlowType(narrowedType, isIncomplete(flowType));
        }
        function getTypeAtSwitchClause(flow) {
            const expr = flow.switchStatement.expression;
            const flowType = getTypeAtFlowNode(flow.antecedent);
            let type = getTypeFromFlowType(flowType);
            if (isMatchingReference(reference, expr)) {
                type = narrowTypeBySwitchOnDiscriminant(type, flow.switchStatement, flow.clauseStart, flow.clauseEnd);
            } else if (expr.kind === 218 && isMatchingReference(reference, expr.expression)) {
                type = narrowTypeBySwitchOnTypeOf(type, flow.switchStatement, flow.clauseStart, flow.clauseEnd);
            } else {
                if (strictNullChecks) {
                    if (optionalChainContainsReference(expr, reference)) {
                        type = narrowTypeBySwitchOptionalChainContainment(type, flow.switchStatement, flow.clauseStart, flow.clauseEnd, t => !(t.flags & (32768 | 131072)));
                    } else if (expr.kind === 218 && optionalChainContainsReference(expr.expression, reference)) {
                        type = narrowTypeBySwitchOptionalChainContainment(type, flow.switchStatement, flow.clauseStart, flow.clauseEnd, t => !(t.flags & 131072 || t.flags & 128 && t.value === "undefined"));
                    }
                }
                const access = getDiscriminantPropertyAccess(expr, type);
                if (access) {
                    type = narrowTypeBySwitchOnDiscriminantProperty(type, access, flow.switchStatement, flow.clauseStart, flow.clauseEnd);
                }
            }
            return createFlowType(type, isIncomplete(flowType));
        }
        function getTypeAtFlowBranchLabel(flow) {
            const antecedentTypes = [];
            let subtypeReduction = false;
            let seenIncomplete = false;
            let bypassFlow;
            for (const antecedent of flow.antecedents) {
                if (!bypassFlow && antecedent.flags & 128 && antecedent.clauseStart === antecedent.clauseEnd) {
                    bypassFlow = antecedent;
                    continue;
                }
                const flowType = getTypeAtFlowNode(antecedent);
                const type = getTypeFromFlowType(flowType);
                if (type === declaredType && declaredType === initialType) {
                    return type;
                }
                pushIfUnique(antecedentTypes, type);
                if (!isTypeSubsetOf(type, declaredType)) {
                    subtypeReduction = true;
                }
                if (isIncomplete(flowType)) {
                    seenIncomplete = true;
                }
            }
            if (bypassFlow) {
                const flowType = getTypeAtFlowNode(bypassFlow);
                const type = getTypeFromFlowType(flowType);
                if (!(type.flags & 131072) && !contains(antecedentTypes, type) && !isExhaustiveSwitchStatement(bypassFlow.switchStatement)) {
                    if (type === declaredType && declaredType === initialType) {
                        return type;
                    }
                    antecedentTypes.push(type);
                    if (!isTypeSubsetOf(type, declaredType)) {
                        subtypeReduction = true;
                    }
                    if (isIncomplete(flowType)) {
                        seenIncomplete = true;
                    }
                }
            }
            return createFlowType(getUnionOrEvolvingArrayType(antecedentTypes, subtypeReduction ? 2 : 1), seenIncomplete);
        }
        function getTypeAtFlowLoopLabel(flow) {
            const id = getFlowNodeId(flow);
            const cache = flowLoopCaches[id] || (flowLoopCaches[id] = /* @__PURE__ */new Map());
            const key2 = getOrSetCacheKey();
            if (!key2) {
                return declaredType;
            }
            const cached = cache.get(key2);
            if (cached) {
                return cached;
            }
            for (let i = flowLoopStart; i < flowLoopCount; i++) {
                if (flowLoopNodes[i] === flow && flowLoopKeys[i] === key2 && flowLoopTypes[i].length) {
                    return createFlowType(getUnionOrEvolvingArrayType(flowLoopTypes[i], 1), true);
                }
            }
            const antecedentTypes = [];
            let subtypeReduction = false;
            let firstAntecedentType;
            for (const antecedent of flow.antecedents) {
                let flowType;
                if (!firstAntecedentType) {
                    flowType = firstAntecedentType = getTypeAtFlowNode(antecedent);
                } else {
                    flowLoopNodes[flowLoopCount] = flow;
                    flowLoopKeys[flowLoopCount] = key2;
                    flowLoopTypes[flowLoopCount] = antecedentTypes;
                    flowLoopCount++;
                    const saveFlowTypeCache = flowTypeCache;
                    flowTypeCache = void 0;
                    flowType = getTypeAtFlowNode(antecedent);
                    flowTypeCache = saveFlowTypeCache;
                    flowLoopCount--;
                    const cached2 = cache.get(key2);
                    if (cached2) {
                        return cached2;
                    }
                }
                const type = getTypeFromFlowType(flowType);
                pushIfUnique(antecedentTypes, type);
                if (!isTypeSubsetOf(type, declaredType)) {
                    subtypeReduction = true;
                }
                if (type === declaredType) {
                    break;
                }
            }
            const result = getUnionOrEvolvingArrayType(antecedentTypes, subtypeReduction ? 2 : 1);
            if (isIncomplete(firstAntecedentType)) {
                return createFlowType(result, true);
            }
            cache.set(key2, result);
            return result;
        }
        function getUnionOrEvolvingArrayType(types, subtypeReduction) {
            if (isEvolvingArrayTypeList(types)) {
                return getEvolvingArrayType(getUnionType(map(types, getElementTypeOfEvolvingArrayType)));
            }
            const result = recombineUnknownType(getUnionType(sameMap(types, finalizeEvolvingArrayType), subtypeReduction));
            if (result !== declaredType && result.flags & declaredType.flags & 1048576 && arraysEqual(result.types, declaredType.types)) {
                return declaredType;
            }
            return result;
        }
        function getCandidateDiscriminantPropertyAccess(expr) {
            if (isBindingPattern(reference) || isFunctionExpressionOrArrowFunction(reference) || isObjectLiteralMethod(reference)) {
                if (isIdentifier(expr)) {
                    const symbol = getResolvedSymbol(expr);
                    const declaration = symbol.valueDeclaration;
                    if (declaration && (isBindingElement(declaration) || isParameter(declaration)) && reference === declaration.parent && !declaration.initializer && !declaration.dotDotDotToken) {
                        return declaration;
                    }
                }
            } else if (isAccessExpression(expr)) {
                if (isMatchingReference(reference, expr.expression)) {
                    return expr;
                }
            } else if (isIdentifier(expr)) {
                const symbol = getResolvedSymbol(expr);
                if (isConstVariable(symbol)) {
                    const declaration = symbol.valueDeclaration;
                    if (isVariableDeclaration(declaration) && !declaration.type && declaration.initializer && isAccessExpression(declaration.initializer) && isMatchingReference(reference, declaration.initializer.expression)) {
                        return declaration.initializer;
                    }
                    if (isBindingElement(declaration) && !declaration.initializer) {
                        const parent2 = declaration.parent.parent;
                        if (isVariableDeclaration(parent2) && !parent2.type && parent2.initializer && (isIdentifier(parent2.initializer) || isAccessExpression(parent2.initializer)) && isMatchingReference(reference, parent2.initializer)) {
                            return declaration;
                        }
                    }
                }
            }
            return void 0;
        }
        function getDiscriminantPropertyAccess(expr, computedType) {
            const type = declaredType.flags & 1048576 ? declaredType : computedType;
            if (type.flags & 1048576) {
                const access = getCandidateDiscriminantPropertyAccess(expr);
                if (access) {
                    const name = getAccessedPropertyName(access);
                    if (name && isDiscriminantProperty(type, name)) {
                        return access;
                    }
                }
            }
            return void 0;
        }
        function narrowTypeByDiscriminant(type, access, narrowType2) {
            const propName = getAccessedPropertyName(access);
            if (propName === void 0) {
                return type;
            }
            const optionalChain = isOptionalChain(access);
            const removeNullable = strictNullChecks && (optionalChain || isNonNullAccess(access)) && maybeTypeOfKind(type, 98304);
            let propType = getTypeOfPropertyOfType(removeNullable ? getTypeWithFacts(type, 2097152) : type, propName);
            if (!propType) {
                return type;
            }
            propType = removeNullable && optionalChain ? getOptionalType(propType) : propType;
            const narrowedPropType = narrowType2(propType);
            return filterType(type, t => {
                const discriminantType = getTypeOfPropertyOrIndexSignature(t, propName);
                return !(discriminantType.flags & 131072) && !(narrowedPropType.flags & 131072) && areTypesComparable(narrowedPropType, discriminantType);
            });
        }
        function narrowTypeByDiscriminantProperty(type, access, operator, value, assumeTrue) {
            if ((operator === 36 || operator === 37) && type.flags & 1048576) {
                const keyPropertyName = getKeyPropertyName(type);
                if (keyPropertyName && keyPropertyName === getAccessedPropertyName(access)) {
                    const candidate = getConstituentTypeForKeyType(type, getTypeOfExpression(value));
                    if (candidate) {
                        return operator === (assumeTrue ? 36 : 37) ? candidate : isUnitType(getTypeOfPropertyOfType(candidate, keyPropertyName) || unknownType) ? removeType(type, candidate) : type;
                    }
                }
            }
            return narrowTypeByDiscriminant(type, access, t => narrowTypeByEquality(t, operator, value, assumeTrue));
        }
        function narrowTypeBySwitchOnDiscriminantProperty(type, access, switchStatement, clauseStart, clauseEnd) {
            if (clauseStart < clauseEnd && type.flags & 1048576 && getKeyPropertyName(type) === getAccessedPropertyName(access)) {
                const clauseTypes = getSwitchClauseTypes(switchStatement).slice(clauseStart, clauseEnd);
                const candidate = getUnionType(map(clauseTypes, t => getConstituentTypeForKeyType(type, t) || unknownType));
                if (candidate !== unknownType) {
                    return candidate;
                }
            }
            return narrowTypeByDiscriminant(type, access, t => narrowTypeBySwitchOnDiscriminant(t, switchStatement, clauseStart, clauseEnd));
        }
        function narrowTypeByTruthiness(type, expr, assumeTrue) {
            if (isMatchingReference(reference, expr)) {
                return getAdjustedTypeWithFacts(type, assumeTrue ? 4194304 : 8388608);
            }
            if (strictNullChecks && assumeTrue && optionalChainContainsReference(expr, reference)) {
                type = getAdjustedTypeWithFacts(type, 2097152);
            }
            const access = getDiscriminantPropertyAccess(expr, type);
            if (access) {
                return narrowTypeByDiscriminant(type, access, t => getTypeWithFacts(t, assumeTrue ? 4194304 : 8388608));
            }
            return type;
        }
        function isTypePresencePossible(type, propName, assumeTrue) {
            const prop = getPropertyOfType(type, propName);
            return prop ? !!(prop.flags & 16777216) || assumeTrue : !!getApplicableIndexInfoForName(type, propName) || !assumeTrue;
        }
        function narrowTypeByInKeyword(type, nameType, assumeTrue) {
            const name = getPropertyNameFromType(nameType);
            const isKnownProperty2 = someType(type, t => isTypePresencePossible(t, name, true));
            if (isKnownProperty2) {
                return filterType(type, t => isTypePresencePossible(t, name, assumeTrue));
            }
            if (assumeTrue) {
                const recordSymbol = getGlobalRecordSymbol();
                if (recordSymbol) {
                    return getIntersectionType([type, getTypeAliasInstantiation(recordSymbol, [nameType, unknownType])]);
                }
            }
            return type;
        }
        function narrowTypeByBinaryExpression(type, expr, assumeTrue) {
            switch (expr.operatorToken.kind) {
                case 63:
                case 75:
                case 76:
                case 77:
                    return narrowTypeByTruthiness(narrowType(type, expr.right, assumeTrue), expr.left, assumeTrue);
                case 34:
                case 35:
                case 36:
                case 37:
                    const operator = expr.operatorToken.kind;
                    const left = getReferenceCandidate(expr.left);
                    const right = getReferenceCandidate(expr.right);
                    if (left.kind === 218 && isStringLiteralLike(right)) {
                        return narrowTypeByTypeof(type, left, operator, right, assumeTrue);
                    }
                    if (right.kind === 218 && isStringLiteralLike(left)) {
                        return narrowTypeByTypeof(type, right, operator, left, assumeTrue);
                    }
                    if (isMatchingReference(reference, left)) {
                        return narrowTypeByEquality(type, operator, right, assumeTrue);
                    }
                    if (isMatchingReference(reference, right)) {
                        return narrowTypeByEquality(type, operator, left, assumeTrue);
                    }
                    if (strictNullChecks) {
                        if (optionalChainContainsReference(left, reference)) {
                            type = narrowTypeByOptionalChainContainment(type, operator, right, assumeTrue);
                        } else if (optionalChainContainsReference(right, reference)) {
                            type = narrowTypeByOptionalChainContainment(type, operator, left, assumeTrue);
                        }
                    }
                    const leftAccess = getDiscriminantPropertyAccess(left, type);
                    if (leftAccess) {
                        return narrowTypeByDiscriminantProperty(type, leftAccess, operator, right, assumeTrue);
                    }
                    const rightAccess = getDiscriminantPropertyAccess(right, type);
                    if (rightAccess) {
                        return narrowTypeByDiscriminantProperty(type, rightAccess, operator, left, assumeTrue);
                    }
                    if (isMatchingConstructorReference(left)) {
                        return narrowTypeByConstructor(type, operator, right, assumeTrue);
                    }
                    if (isMatchingConstructorReference(right)) {
                        return narrowTypeByConstructor(type, operator, left, assumeTrue);
                    }
                    break;
                case 102:
                    return narrowTypeByInstanceof(type, expr, assumeTrue);
                case 101:
                    if (isPrivateIdentifier(expr.left)) {
                        return narrowTypeByPrivateIdentifierInInExpression(type, expr, assumeTrue);
                    }
                    const target = getReferenceCandidate(expr.right);
                    const leftType = getTypeOfExpression(expr.left);
                    if (leftType.flags & 8576) {
                        if (containsMissingType(type) && isAccessExpression(reference) && isMatchingReference(reference.expression, target) && getAccessedPropertyName(reference) === getPropertyNameFromType(leftType)) {
                            return getTypeWithFacts(type, assumeTrue ? 524288 : 65536);
                        }
                        if (isMatchingReference(reference, target)) {
                            return narrowTypeByInKeyword(type, leftType, assumeTrue);
                        }
                    }
                    break;
                case 27:
                    return narrowType(type, expr.right, assumeTrue);
                case 55:
                    return assumeTrue ? narrowType(narrowType(type, expr.left, true), expr.right, true) : getUnionType([narrowType(type, expr.left, false), narrowType(type, expr.right, false)]);
                case 56:
                    return assumeTrue ? getUnionType([narrowType(type, expr.left, true), narrowType(type, expr.right, true)]) : narrowType(narrowType(type, expr.left, false), expr.right, false);
            }
            return type;
        }
        function narrowTypeByPrivateIdentifierInInExpression(type, expr, assumeTrue) {
            const target = getReferenceCandidate(expr.right);
            if (!isMatchingReference(reference, target)) {
                return type;
            }
            Debug.assertNode(expr.left, isPrivateIdentifier);
            const symbol = getSymbolForPrivateIdentifierExpression(expr.left);
            if (symbol === void 0) {
                return type;
            }
            const classSymbol = symbol.parent;
            const targetType = hasStaticModifier(Debug.checkDefined(symbol.valueDeclaration, "should always have a declaration")) ? getTypeOfSymbol(classSymbol) : getDeclaredTypeOfSymbol(classSymbol);
            return getNarrowedType(type, targetType, assumeTrue, true);
        }
        function narrowTypeByOptionalChainContainment(type, operator, value, assumeTrue) {
            const equalsOperator = operator === 34 || operator === 36;
            const nullableFlags = operator === 34 || operator === 35 ? 98304 : 32768;
            const valueType = getTypeOfExpression(value);
            const removeNullable = equalsOperator !== assumeTrue && everyType(valueType, t => !!(t.flags & nullableFlags)) || equalsOperator === assumeTrue && everyType(valueType, t => !(t.flags & (3 | nullableFlags)));
            return removeNullable ? getAdjustedTypeWithFacts(type, 2097152) : type;
        }
        function narrowTypeByEquality(type, operator, value, assumeTrue) {
            if (type.flags & 1) {
                return type;
            }
            if (operator === 35 || operator === 37) {
                assumeTrue = !assumeTrue;
            }
            const valueType = getTypeOfExpression(value);
            const doubleEquals = operator === 34 || operator === 35;
            if (valueType.flags & 98304) {
                if (!strictNullChecks) {
                    return type;
                }
                const facts = doubleEquals ? assumeTrue ? 262144 : 2097152 : valueType.flags & 65536 ? assumeTrue ? 131072 : 1048576 : assumeTrue ? 65536 : 524288;
                return getAdjustedTypeWithFacts(type, facts);
            }
            if (assumeTrue) {
                if (!doubleEquals && (type.flags & 2 || someType(type, isEmptyAnonymousObjectType))) {
                    if (valueType.flags & (134348796 | 67108864) || isEmptyAnonymousObjectType(valueType)) {
                        return valueType;
                    }
                    if (valueType.flags & 524288) {
                        return nonPrimitiveType;
                    }
                }
                const filteredType = filterType(type, t => areTypesComparable(t, valueType) || doubleEquals && isCoercibleUnderDoubleEquals(t, valueType));
                return replacePrimitivesWithLiterals(filteredType, valueType);
            }
            if (isUnitType(valueType)) {
                return filterType(type, t => !(isUnitLikeType(t) && areTypesComparable(t, valueType)));
            }
            return type;
        }
        function narrowTypeByTypeof(type, typeOfExpr, operator, literal, assumeTrue) {
            if (operator === 35 || operator === 37) {
                assumeTrue = !assumeTrue;
            }
            const target = getReferenceCandidate(typeOfExpr.expression);
            if (!isMatchingReference(reference, target)) {
                if (strictNullChecks && optionalChainContainsReference(target, reference) && assumeTrue === (literal.text !== "undefined")) {
                    type = getAdjustedTypeWithFacts(type, 2097152);
                }
                const propertyAccess = getDiscriminantPropertyAccess(target, type);
                if (propertyAccess) {
                    return narrowTypeByDiscriminant(type, propertyAccess, t => narrowTypeByLiteralExpression(t, literal, assumeTrue));
                }
                return type;
            }
            return narrowTypeByLiteralExpression(type, literal, assumeTrue);
        }
        function narrowTypeByLiteralExpression(type, literal, assumeTrue) {
            return assumeTrue ? narrowTypeByTypeName(type, literal.text) : getAdjustedTypeWithFacts(type, typeofNEFacts.get(literal.text) || 32768);
        }
        function narrowTypeBySwitchOptionalChainContainment(type, switchStatement, clauseStart, clauseEnd, clauseCheck) {
            const everyClauseChecks = clauseStart !== clauseEnd && every(getSwitchClauseTypes(switchStatement).slice(clauseStart, clauseEnd), clauseCheck);
            return everyClauseChecks ? getTypeWithFacts(type, 2097152) : type;
        }
        function narrowTypeBySwitchOnDiscriminant(type, switchStatement, clauseStart, clauseEnd) {
            const switchTypes = getSwitchClauseTypes(switchStatement);
            if (!switchTypes.length) {
                return type;
            }
            const clauseTypes = switchTypes.slice(clauseStart, clauseEnd);
            const hasDefaultClause = clauseStart === clauseEnd || contains(clauseTypes, neverType);
            if (type.flags & 2 && !hasDefaultClause) {
                let groundClauseTypes;
                for (let i = 0; i < clauseTypes.length; i += 1) {
                    const t = clauseTypes[i];
                    if (t.flags & (134348796 | 67108864)) {
                        if (groundClauseTypes !== void 0) {
                            groundClauseTypes.push(t);
                        }
                    } else if (t.flags & 524288) {
                        if (groundClauseTypes === void 0) {
                            groundClauseTypes = clauseTypes.slice(0, i);
                        }
                        groundClauseTypes.push(nonPrimitiveType);
                    } else {
                        return type;
                    }
                }
                return getUnionType(groundClauseTypes === void 0 ? clauseTypes : groundClauseTypes);
            }
            const discriminantType = getUnionType(clauseTypes);
            const caseType = discriminantType.flags & 131072 ? neverType : replacePrimitivesWithLiterals(filterType(type, t => areTypesComparable(discriminantType, t)), discriminantType);
            if (!hasDefaultClause) {
                return caseType;
            }
            const defaultType = filterType(type, t => !(isUnitLikeType(t) && contains(switchTypes, getRegularTypeOfLiteralType(extractUnitType(t)))));
            return caseType.flags & 131072 ? defaultType : getUnionType([caseType, defaultType]);
        }
        function narrowTypeByTypeName(type, typeName) {
            switch (typeName) {
                case "string":
                    return narrowTypeByTypeFacts(type, stringType, 1);
                case "number":
                    return narrowTypeByTypeFacts(type, numberType, 2);
                case "bigint":
                    return narrowTypeByTypeFacts(type, bigintType, 4);
                case "boolean":
                    return narrowTypeByTypeFacts(type, booleanType, 8);
                case "symbol":
                    return narrowTypeByTypeFacts(type, esSymbolType, 16);
                case "object":
                    return type.flags & 1 ? type : getUnionType([narrowTypeByTypeFacts(type, nonPrimitiveType, 32), narrowTypeByTypeFacts(type, nullType, 131072)]);
                case "function":
                    return type.flags & 1 ? type : narrowTypeByTypeFacts(type, globalFunctionType, 64);
                case "undefined":
                    return narrowTypeByTypeFacts(type, undefinedType, 65536);
            }
            return narrowTypeByTypeFacts(type, nonPrimitiveType, 128);
        }
        function narrowTypeByTypeFacts(type, impliedType, facts) {
            return mapType(type, t => isTypeRelatedTo(t, impliedType, strictSubtypeRelation) ? getTypeFacts(t) & facts ? t : neverType : isTypeSubtypeOf(impliedType, t) ? impliedType : getTypeFacts(t) & facts ? getIntersectionType([t, impliedType]) : neverType);
        }
        function narrowTypeBySwitchOnTypeOf(type, switchStatement, clauseStart, clauseEnd) {
            const witnesses = getSwitchClauseTypeOfWitnesses(switchStatement);
            if (!witnesses) {
                return type;
            }
            const defaultIndex = findIndex(switchStatement.caseBlock.clauses, clause => clause.kind === 293);
            const hasDefaultClause = clauseStart === clauseEnd || defaultIndex >= clauseStart && defaultIndex < clauseEnd;
            if (hasDefaultClause) {
                const notEqualFacts = getNotEqualFactsFromTypeofSwitch(clauseStart, clauseEnd, witnesses);
                return filterType(type, t => (getTypeFacts(t) & notEqualFacts) === notEqualFacts);
            }
            const clauseWitnesses = witnesses.slice(clauseStart, clauseEnd);
            return getUnionType(map(clauseWitnesses, text => text ? narrowTypeByTypeName(type, text) : neverType));
        }
        function isMatchingConstructorReference(expr) {
            return (isPropertyAccessExpression(expr) && idText(expr.name) === "constructor" || isElementAccessExpression(expr) && isStringLiteralLike(expr.argumentExpression) && expr.argumentExpression.text === "constructor") && isMatchingReference(reference, expr.expression);
        }
        function narrowTypeByConstructor(type, operator, identifier, assumeTrue) {
            if (assumeTrue ? operator !== 34 && operator !== 36 : operator !== 35 && operator !== 37) {
                return type;
            }
            const identifierType = getTypeOfExpression(identifier);
            if (!isFunctionType(identifierType) && !isConstructorType(identifierType)) {
                return type;
            }
            const prototypeProperty = getPropertyOfType(identifierType, "prototype");
            if (!prototypeProperty) {
                return type;
            }
            const prototypeType = getTypeOfSymbol(prototypeProperty);
            const candidate = !isTypeAny(prototypeType) ? prototypeType : void 0;
            if (!candidate || candidate === globalObjectType || candidate === globalFunctionType) {
                return type;
            }
            if (isTypeAny(type)) {
                return candidate;
            }
            return filterType(type, t => isConstructedBy(t, candidate));
            function isConstructedBy(source, target) {
                if (source.flags & 524288 && getObjectFlags(source) & 1 || target.flags & 524288 && getObjectFlags(target) & 1) {
                    return source.symbol === target.symbol;
                }
                return isTypeSubtypeOf(source, target);
            }
        }
        function narrowTypeByInstanceof(type, expr, assumeTrue) {
            const left = getReferenceCandidate(expr.left);
            if (!isMatchingReference(reference, left)) {
                if (assumeTrue && strictNullChecks && optionalChainContainsReference(left, reference)) {
                    return getAdjustedTypeWithFacts(type, 2097152);
                }
                return type;
            }
            const rightType = getTypeOfExpression(expr.right);
            if (!isTypeDerivedFrom(rightType, globalFunctionType)) {
                return type;
            }
            const instanceType = mapType(rightType, getInstanceType);
            if (isTypeAny(type) && (instanceType === globalObjectType || instanceType === globalFunctionType) || !assumeTrue && !(instanceType.flags & 524288 && !isEmptyAnonymousObjectType(instanceType))) {
                return type;
            }
            return getNarrowedType(type, instanceType, assumeTrue, true);
        }
        function getInstanceType(constructorType) {
            const prototypePropertyType = getTypeOfPropertyOfType(constructorType, "prototype");
            if (prototypePropertyType && !isTypeAny(prototypePropertyType)) {
                return prototypePropertyType;
            }
            const constructSignatures = getSignaturesOfType(constructorType, 1);
            if (constructSignatures.length) {
                return getUnionType(map(constructSignatures, signature => getReturnTypeOfSignature(getErasedSignature(signature))));
            }
            return emptyObjectType;
        }
        function getNarrowedType(type, candidate, assumeTrue, checkDerived) {
            var _a3;
            const key2 = type.flags & 1048576 ? `N${getTypeId(type)},${getTypeId(candidate)},${(assumeTrue ? 1 : 0) | (checkDerived ? 2 : 0)}` : void 0;
            return (_a3 = getCachedType(key2)) != null ? _a3 : setCachedType(key2, getNarrowedTypeWorker(type, candidate, assumeTrue, checkDerived));
        }
        function getNarrowedTypeWorker(type, candidate, assumeTrue, checkDerived) {
            if (!assumeTrue) {
                if (checkDerived) {
                    return filterType(type, t => !isTypeDerivedFrom(t, candidate));
                }
                const trueType2 = getNarrowedType(type, candidate, true, false);
                return filterType(type, t => !isTypeSubsetOf(t, trueType2));
            }
            if (type.flags & 3) {
                return candidate;
            }
            const isRelated = checkDerived ? isTypeDerivedFrom : isTypeSubtypeOf;
            const keyPropertyName = type.flags & 1048576 ? getKeyPropertyName(type) : void 0;
            const narrowedType = mapType(candidate, c => {
                const discriminant = keyPropertyName && getTypeOfPropertyOfType(c, keyPropertyName);
                const matching = discriminant && getConstituentTypeForKeyType(type, discriminant);
                const directlyRelated = mapType(matching || type, checkDerived ? t => isTypeDerivedFrom(t, c) ? t : isTypeDerivedFrom(c, t) ? c : neverType : t => isTypeStrictSubtypeOf(t, c) ? t : isTypeStrictSubtypeOf(c, t) ? c : isTypeSubtypeOf(t, c) ? t : isTypeSubtypeOf(c, t) ? c : neverType);
                return directlyRelated.flags & 131072 ? mapType(type, t => maybeTypeOfKind(t, 465829888) && isRelated(c, getBaseConstraintOfType(t) || unknownType) ? getIntersectionType([t, c]) : neverType) : directlyRelated;
            });
            return !(narrowedType.flags & 131072) ? narrowedType : isTypeSubtypeOf(candidate, type) ? candidate : isTypeAssignableTo(type, candidate) ? type : isTypeAssignableTo(candidate, type) ? candidate : getIntersectionType([type, candidate]);
        }
        function narrowTypeByCallExpression(type, callExpression, assumeTrue) {
            if (hasMatchingArgument(callExpression, reference)) {
                const signature = assumeTrue || !isCallChain(callExpression) ? getEffectsSignature(callExpression) : void 0;
                const predicate = signature && getTypePredicateOfSignature(signature);
                if (predicate && (predicate.kind === 0 || predicate.kind === 1)) {
                    return narrowTypeByTypePredicate(type, predicate, callExpression, assumeTrue);
                }
            }
            if (containsMissingType(type) && isAccessExpression(reference) && isPropertyAccessExpression(callExpression.expression)) {
                const callAccess = callExpression.expression;
                if (isMatchingReference(reference.expression, getReferenceCandidate(callAccess.expression)) && isIdentifier(callAccess.name) && callAccess.name.escapedText === "hasOwnProperty" && callExpression.arguments.length === 1) {
                    const argument = callExpression.arguments[0];
                    if (isStringLiteralLike(argument) && getAccessedPropertyName(reference) === escapeLeadingUnderscores(argument.text)) {
                        return getTypeWithFacts(type, assumeTrue ? 524288 : 65536);
                    }
                }
            }
            return type;
        }
        function narrowTypeByTypePredicate(type, predicate, callExpression, assumeTrue) {
            if (predicate.type && !(isTypeAny(type) && (predicate.type === globalObjectType || predicate.type === globalFunctionType))) {
                const predicateArgument = getTypePredicateArgument(predicate, callExpression);
                if (predicateArgument) {
                    if (isMatchingReference(reference, predicateArgument)) {
                        return getNarrowedType(type, predicate.type, assumeTrue, false);
                    }
                    if (strictNullChecks && assumeTrue && optionalChainContainsReference(predicateArgument, reference) && !(getTypeFacts(predicate.type) & 65536)) {
                        type = getAdjustedTypeWithFacts(type, 2097152);
                    }
                    const access = getDiscriminantPropertyAccess(predicateArgument, type);
                    if (access) {
                        return narrowTypeByDiscriminant(type, access, t => getNarrowedType(t, predicate.type, assumeTrue, false));
                    }
                }
            }
            return type;
        }
        function narrowType(type, expr, assumeTrue) {
            if (isExpressionOfOptionalChainRoot(expr) || isBinaryExpression(expr.parent) && (expr.parent.operatorToken.kind === 60 || expr.parent.operatorToken.kind === 77) && expr.parent.left === expr) {
                return narrowTypeByOptionality(type, expr, assumeTrue);
            }
            switch (expr.kind) {
                case 79:
                    if (!isMatchingReference(reference, expr) && inlineLevel < 5) {
                        const symbol = getResolvedSymbol(expr);
                        if (isConstVariable(symbol)) {
                            const declaration = symbol.valueDeclaration;
                            if (declaration && isVariableDeclaration(declaration) && !declaration.type && declaration.initializer && isConstantReference(reference)) {
                                inlineLevel++;
                                const result = narrowType(type, declaration.initializer, assumeTrue);
                                inlineLevel--;
                                return result;
                            }
                        }
                    }
                case 108:
                case 106:
                case 208:
                case 209:
                    return narrowTypeByTruthiness(type, expr, assumeTrue);
                case 210:
                    return narrowTypeByCallExpression(type, expr, assumeTrue);
                case 214:
                case 232:
                    return narrowType(type, expr.expression, assumeTrue);
                case 223:
                    return narrowTypeByBinaryExpression(type, expr, assumeTrue);
                case 221:
                    if (expr.operator === 53) {
                        return narrowType(type, expr.operand, !assumeTrue);
                    }
                    break;
            }
            return type;
        }
        function narrowTypeByOptionality(type, expr, assumePresent) {
            if (isMatchingReference(reference, expr)) {
                return getAdjustedTypeWithFacts(type, assumePresent ? 2097152 : 262144);
            }
            const access = getDiscriminantPropertyAccess(expr, type);
            if (access) {
                return narrowTypeByDiscriminant(type, access, t => getTypeWithFacts(t, assumePresent ? 2097152 : 262144));
            }
            return type;
        }
    }
}