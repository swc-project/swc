namespace ts {
    function createSynthesizedNode(kind: SyntaxKind): Node {
        const node = createNode(kind, -1, -1);
        node.flags |= NodeFlags.Synthesized;
        return node;
    }

    /* @internal */
    export function updateNode<T extends Node>(updated: T, original: T): T {
        if (updated !== original) {
            setOriginalNode(updated, original);
            setTextRange(updated, original);
            aggregateTransformFlags(updated);
        }
        return updated;
    }

    /* @internal */ export function createNodeArray<T extends Node>(elements?: T[], hasTrailingComma?: boolean): MutableNodeArray<T>;
    export function createNodeArray<T extends Node>(elements?: readonly T[], hasTrailingComma?: boolean): NodeArray<T>;
    /**
     * Make `elements` into a `NodeArray<T>`. If `elements` is `undefined`, returns an empty `NodeArray<T>`.
     */
    export function createNodeArray<T extends Node>(elements?: readonly T[], hasTrailingComma?: boolean): NodeArray<T> {
        if (!elements || elements === emptyArray) {
            elements = [];
        }
        else if (isNodeArray(elements)) {
            return elements;
        }

        const array = <NodeArray<T>>elements;
        array.pos = -1;
        array.end = -1;
        array.hasTrailingComma = hasTrailingComma;
        return array;
    }

    /**
     * Creates a shallow, memberwise clone of a node with no source map location.
     */
    /* @internal */
    export function getSynthesizedClone<T extends Node>(node: T): T {
        // We don't use "clone" from core.ts here, as we need to preserve the prototype chain of
        // the original node. We also need to exclude specific properties and only include own-
        // properties (to skip members already defined on the shared prototype).

        if (node === undefined) {
            return node;
        }

        const clone = <T>createSynthesizedNode(node.kind);
        clone.flags |= node.flags;
        setOriginalNode(clone, node);

        for (const key in node) {
            if (clone.hasOwnProperty(key) || !node.hasOwnProperty(key)) {
                continue;
            }

            (<any>clone)[key] = (<any>node)[key];
        }

        return clone;
    }

    // Literals

    /* @internal */ export function createLiteral(value: string | StringLiteral | NoSubstitutionTemplateLiteral | NumericLiteral | Identifier, isSingleQuote: boolean): StringLiteral; // eslint-disable-line @typescript-eslint/unified-signatures
    /* @internal */ export function createLiteral(value: string | number, isSingleQuote: boolean): StringLiteral | NumericLiteral;
    /** If a node is passed, creates a string literal whose source text is read from a source node during emit. */
    export function createLiteral(value: string | StringLiteral | NoSubstitutionTemplateLiteral | NumericLiteral | Identifier): StringLiteral;
    export function createLiteral(value: number | PseudoBigInt): NumericLiteral;
    export function createLiteral(value: boolean): BooleanLiteral;
    export function createLiteral(value: string | number | PseudoBigInt | boolean): PrimaryExpression;
    export function createLiteral(value: string | number | PseudoBigInt | boolean | StringLiteral | NoSubstitutionTemplateLiteral | NumericLiteral | Identifier, isSingleQuote?: boolean): PrimaryExpression {
        if (typeof value === "number") {
            return createNumericLiteral(value + "");
        }
        // eslint-disable-next-line no-in-operator
        if (typeof value === "object" && "base10Value" in value) { // PseudoBigInt
            return createBigIntLiteral(pseudoBigIntToString(value) + "n");
        }
        if (typeof value === "boolean") {
            return value ? createTrue() : createFalse();
        }
        if (isString(value)) {
            const res = createStringLiteral(value);
            if (isSingleQuote) res.singleQuote = true;
            return res;
        }
        return createLiteralFromNode(value);
    }

    export function createNumericLiteral(value: string, numericLiteralFlags: TokenFlags = TokenFlags.None): NumericLiteral {
        const node = <NumericLiteral>createSynthesizedNode(SyntaxKind.NumericLiteral);
        node.text = value;
        node.numericLiteralFlags = numericLiteralFlags;
        return node;
    }

    export function createBigIntLiteral(value: string): BigIntLiteral {
        const node = <BigIntLiteral>createSynthesizedNode(SyntaxKind.BigIntLiteral);
        node.text = value;
        return node;
    }

    export function createStringLiteral(text: string): StringLiteral {
        const node = <StringLiteral>createSynthesizedNode(SyntaxKind.StringLiteral);
        node.text = text;
        return node;
    }

    export function createRegularExpressionLiteral(text: string): RegularExpressionLiteral {
        const node = <RegularExpressionLiteral>createSynthesizedNode(SyntaxKind.RegularExpressionLiteral);
        node.text = text;
        return node;
    }

    function createLiteralFromNode(sourceNode: PropertyNameLiteral): StringLiteral {
        const node = createStringLiteral(getTextOfIdentifierOrLiteral(sourceNode));
        node.textSourceNode = sourceNode;
        return node;
    }


    // Identifiers

    export function createIdentifier(text: string): Identifier;
    /* @internal */
    export function createIdentifier(text: string, typeArguments: readonly (TypeNode | TypeParameterDeclaration)[] | undefined): Identifier; // eslint-disable-line @typescript-eslint/unified-signatures
    export function createIdentifier(text: string, typeArguments?: readonly (TypeNode | TypeParameterDeclaration)[]): Identifier {
        const node = <Identifier>createSynthesizedNode(SyntaxKind.Identifier);
        node.escapedText = escapeLeadingUnderscores(text);
        node.originalKeywordKind = text ? stringToToken(text) : SyntaxKind.Unknown;
        node.autoGenerateFlags = GeneratedIdentifierFlags.None;
        node.autoGenerateId = 0;
        if (typeArguments) {
            node.typeArguments = createNodeArray(typeArguments as readonly TypeNode[]);
        }
        return node;
    }

    export function updateIdentifier(node: Identifier): Identifier;
    /* @internal */
    export function updateIdentifier(node: Identifier, typeArguments: NodeArray<TypeNode | TypeParameterDeclaration> | undefined): Identifier; // eslint-disable-line @typescript-eslint/unified-signatures
    export function updateIdentifier(node: Identifier, typeArguments?: NodeArray<TypeNode | TypeParameterDeclaration> | undefined): Identifier {
        return node.typeArguments !== typeArguments
            ? updateNode(createIdentifier(idText(node), typeArguments), node)
            : node;
    }

    let nextAutoGenerateId = 0;

    /** Create a unique temporary variable. */
    export function createTempVariable(recordTempVariable: ((node: Identifier) => void) | undefined): Identifier;
    /* @internal */ export function createTempVariable(recordTempVariable: ((node: Identifier) => void) | undefined, reservedInNestedScopes: boolean): GeneratedIdentifier;
    export function createTempVariable(recordTempVariable: ((node: Identifier) => void) | undefined, reservedInNestedScopes?: boolean): GeneratedIdentifier {
        const name = createIdentifier("") as GeneratedIdentifier;
        name.autoGenerateFlags = GeneratedIdentifierFlags.Auto;
        name.autoGenerateId = nextAutoGenerateId;
        nextAutoGenerateId++;
        if (recordTempVariable) {
            recordTempVariable(name);
        }
        if (reservedInNestedScopes) {
            name.autoGenerateFlags |= GeneratedIdentifierFlags.ReservedInNestedScopes;
        }
        return name;
    }

    /** Create a unique temporary variable for use in a loop. */
    export function createLoopVariable(): Identifier {
        const name = createIdentifier("");
        name.autoGenerateFlags = GeneratedIdentifierFlags.Loop;
        name.autoGenerateId = nextAutoGenerateId;
        nextAutoGenerateId++;
        return name;
    }

    /** Create a unique name based on the supplied text. */
    export function createUniqueName(text: string): Identifier {
        const name = createIdentifier(text);
        name.autoGenerateFlags = GeneratedIdentifierFlags.Unique;
        name.autoGenerateId = nextAutoGenerateId;
        nextAutoGenerateId++;
        return name;
    }

    /* @internal */ export function createOptimisticUniqueName(text: string): GeneratedIdentifier;
    /** Create a unique name based on the supplied text. */
    export function createOptimisticUniqueName(text: string): Identifier;
    export function createOptimisticUniqueName(text: string): GeneratedIdentifier {
        const name = createIdentifier(text) as GeneratedIdentifier;
        name.autoGenerateFlags = GeneratedIdentifierFlags.Unique | GeneratedIdentifierFlags.Optimistic;
        name.autoGenerateId = nextAutoGenerateId;
        nextAutoGenerateId++;
        return name;
    }

    /** Create a unique name based on the supplied text. This does not consider names injected by the transformer. */
    export function createFileLevelUniqueName(text: string): Identifier {
        const name = createOptimisticUniqueName(text);
        name.autoGenerateFlags |= GeneratedIdentifierFlags.FileLevel;
        return name;
    }

    /** Create a unique name generated for a node. */
    export function getGeneratedNameForNode(node: Node | undefined): Identifier;
    /* @internal */ export function getGeneratedNameForNode(node: Node | undefined, flags: GeneratedIdentifierFlags): Identifier; // eslint-disable-line @typescript-eslint/unified-signatures
    export function getGeneratedNameForNode(node: Node | undefined, flags?: GeneratedIdentifierFlags): Identifier {
        const name = createIdentifier(node && isIdentifier(node) ? idText(node) : "");
        name.autoGenerateFlags = GeneratedIdentifierFlags.Node | flags!;
        name.autoGenerateId = nextAutoGenerateId;
        name.original = node;
        nextAutoGenerateId++;
        return name;
    }

    // Punctuation

    export function createToken<TKind extends SyntaxKind>(token: TKind) {
        return <Token<TKind>>createSynthesizedNode(token);
    }

    // Reserved words

    export function createSuper() {
        return <SuperExpression>createSynthesizedNode(SyntaxKind.SuperKeyword);
    }

    export function createThis() {
        return <ThisExpression & Token<SyntaxKind.ThisKeyword>>createSynthesizedNode(SyntaxKind.ThisKeyword);
    }

    export function createNull() {
        return <NullLiteral & Token<SyntaxKind.NullKeyword>>createSynthesizedNode(SyntaxKind.NullKeyword);
    }

    export function createTrue() {
        return <BooleanLiteral & Token<SyntaxKind.TrueKeyword>>createSynthesizedNode(SyntaxKind.TrueKeyword);
    }

    export function createFalse() {
        return <BooleanLiteral & Token<SyntaxKind.FalseKeyword>>createSynthesizedNode(SyntaxKind.FalseKeyword);
    }

    // Modifiers

    export function createModifier<T extends Modifier["kind"]>(kind: T): Token<T> {
        return createToken(kind);
    }

    export function createModifiersFromModifierFlags(flags: ModifierFlags) {
        const result: Modifier[] = [];
        if (flags & ModifierFlags.Export) { result.push(createModifier(SyntaxKind.ExportKeyword)); }
        if (flags & ModifierFlags.Ambient) { result.push(createModifier(SyntaxKind.DeclareKeyword)); }
        if (flags & ModifierFlags.Default) { result.push(createModifier(SyntaxKind.DefaultKeyword)); }
        if (flags & ModifierFlags.Const) { result.push(createModifier(SyntaxKind.ConstKeyword)); }
        if (flags & ModifierFlags.Public) { result.push(createModifier(SyntaxKind.PublicKeyword)); }
        if (flags & ModifierFlags.Private) { result.push(createModifier(SyntaxKind.PrivateKeyword)); }
        if (flags & ModifierFlags.Protected) { result.push(createModifier(SyntaxKind.ProtectedKeyword)); }
        if (flags & ModifierFlags.Abstract) { result.push(createModifier(SyntaxKind.AbstractKeyword)); }
        if (flags & ModifierFlags.Static) { result.push(createModifier(SyntaxKind.StaticKeyword)); }
        if (flags & ModifierFlags.Readonly) { result.push(createModifier(SyntaxKind.ReadonlyKeyword)); }
        if (flags & ModifierFlags.Async) { result.push(createModifier(SyntaxKind.AsyncKeyword)); }
        return result;
    }

    // Names

    export function createQualifiedName(left: EntityName, right: string | Identifier) {
        const node = <QualifiedName>createSynthesizedNode(SyntaxKind.QualifiedName);
        node.left = left;
        node.right = asName(right);
        return node;
    }

    export function updateQualifiedName(node: QualifiedName, left: EntityName, right: Identifier) {
        return node.left !== left
            || node.right !== right
            ? updateNode(createQualifiedName(left, right), node)
            : node;
    }

    function parenthesizeForComputedName(expression: Expression): Expression {
        return isCommaSequence(expression)
            ? createParen(expression)
            : expression;
    }

    export function createComputedPropertyName(expression: Expression) {
        const node = <ComputedPropertyName>createSynthesizedNode(SyntaxKind.ComputedPropertyName);
        node.expression = parenthesizeForComputedName(expression);
        return node;
    }

    export function updateComputedPropertyName(node: ComputedPropertyName, expression: Expression) {
        return node.expression !== expression
            ? updateNode(createComputedPropertyName(expression), node)
            : node;
    }

    // Signature elements

    export function createTypeParameterDeclaration(name: string | Identifier, constraint?: TypeNode, defaultType?: TypeNode) {
        const node = createSynthesizedNode(SyntaxKind.TypeParameter) as TypeParameterDeclaration;
        node.name = asName(name);
        node.constraint = constraint;
        node.default = defaultType;
        return node;
    }

    export function updateTypeParameterDeclaration(node: TypeParameterDeclaration, name: Identifier, constraint: TypeNode | undefined, defaultType: TypeNode | undefined) {
        return node.name !== name
            || node.constraint !== constraint
            || node.default !== defaultType
            ? updateNode(createTypeParameterDeclaration(name, constraint, defaultType), node)
            : node;
    }

    export function createParameter(
        decorators: readonly Decorator[] | undefined,
        modifiers: readonly Modifier[] | undefined,
        dotDotDotToken: DotDotDotToken | undefined,
        name: string | BindingName,
        questionToken?: QuestionToken,
        type?: TypeNode,
        initializer?: Expression) {
        const node = <ParameterDeclaration>createSynthesizedNode(SyntaxKind.Parameter);
        node.decorators = asNodeArray(decorators);
        node.modifiers = asNodeArray(modifiers);
        node.dotDotDotToken = dotDotDotToken;
        node.name = asName(name);
        node.questionToken = questionToken;
        node.type = type;
        node.initializer = initializer ? parenthesizeExpressionForList(initializer) : undefined;
        return node;
    }

    export function updateParameter(
        node: ParameterDeclaration,
        decorators: readonly Decorator[] | undefined,
        modifiers: readonly Modifier[] | undefined,
        dotDotDotToken: DotDotDotToken | undefined,
        name: string | BindingName,
        questionToken: QuestionToken | undefined,
        type: TypeNode | undefined,
        initializer: Expression | undefined) {
        return node.decorators !== decorators
            || node.modifiers !== modifiers
            || node.dotDotDotToken !== dotDotDotToken
            || node.name !== name
            || node.questionToken !== questionToken
            || node.type !== type
            || node.initializer !== initializer
            ? updateNode(createParameter(decorators, modifiers, dotDotDotToken, name, questionToken, type, initializer), node)
            : node;
    }

    export function createDecorator(expression: Expression) {
        const node = <Decorator>createSynthesizedNode(SyntaxKind.Decorator);
        node.expression = parenthesizeForAccess(expression);
        return node;
    }

    export function updateDecorator(node: Decorator, expression: Expression) {
        return node.expression !== expression
            ? updateNode(createDecorator(expression), node)
            : node;
    }


    // Type Elements

    export function createPropertySignature(
        modifiers: readonly Modifier[] | undefined,
        name: PropertyName | string,
        questionToken: QuestionToken | undefined,
        type: TypeNode | undefined,
        initializer: Expression | undefined): PropertySignature {
        const node = createSynthesizedNode(SyntaxKind.PropertySignature) as PropertySignature;
        node.modifiers = asNodeArray(modifiers);
        node.name = asName(name);
        node.questionToken = questionToken;
        node.type = type;
        node.initializer = initializer;
        return node;
    }

    export function updatePropertySignature(
        node: PropertySignature,
        modifiers: readonly Modifier[] | undefined,
        name: PropertyName,
        questionToken: QuestionToken | undefined,
        type: TypeNode | undefined,
        initializer: Expression | undefined) {
        return node.modifiers !== modifiers
            || node.name !== name
            || node.questionToken !== questionToken
            || node.type !== type
            || node.initializer !== initializer
            ? updateNode(createPropertySignature(modifiers, name, questionToken, type, initializer), node)
            : node;
    }

    export function createProperty(
        decorators: readonly Decorator[] | undefined,
        modifiers: readonly Modifier[] | undefined,
        name: string | PropertyName,
        questionOrExclamationToken: QuestionToken | ExclamationToken | undefined,
        type: TypeNode | undefined,
        initializer: Expression | undefined) {
        const node = <PropertyDeclaration>createSynthesizedNode(SyntaxKind.PropertyDeclaration);
        node.decorators = asNodeArray(decorators);
        node.modifiers = asNodeArray(modifiers);
        node.name = asName(name);
        node.questionToken = questionOrExclamationToken !== undefined && questionOrExclamationToken.kind === SyntaxKind.QuestionToken ? questionOrExclamationToken : undefined;
        node.exclamationToken = questionOrExclamationToken !== undefined && questionOrExclamationToken.kind === SyntaxKind.ExclamationToken ? questionOrExclamationToken : undefined;
        node.type = type;
        node.initializer = initializer;
        return node;
    }

    export function updateProperty(
        node: PropertyDeclaration,
        decorators: readonly Decorator[] | undefined,
        modifiers: readonly Modifier[] | undefined,
        name: string | PropertyName,
        questionOrExclamationToken: QuestionToken | ExclamationToken | undefined,
        type: TypeNode | undefined,
        initializer: Expression | undefined) {
        return node.decorators !== decorators
            || node.modifiers !== modifiers
            || node.name !== name
            || node.questionToken !== (questionOrExclamationToken !== undefined && questionOrExclamationToken.kind === SyntaxKind.QuestionToken ? questionOrExclamationToken : undefined)
            || node.exclamationToken !== (questionOrExclamationToken !== undefined && questionOrExclamationToken.kind === SyntaxKind.ExclamationToken ? questionOrExclamationToken : undefined)
            || node.type !== type
            || node.initializer !== initializer
            ? updateNode(createProperty(decorators, modifiers, name, questionOrExclamationToken, type, initializer), node)
            : node;
    }

    export function createMethodSignature(
        typeParameters: readonly TypeParameterDeclaration[] | undefined,
        parameters: readonly ParameterDeclaration[],
        type: TypeNode | undefined,
        name: string | PropertyName,
        questionToken: QuestionToken | undefined) {
        const node = createSignatureDeclaration(SyntaxKind.MethodSignature, typeParameters, parameters, type) as MethodSignature;
        node.name = asName(name);
        node.questionToken = questionToken;
        return node;
    }

    export function updateMethodSignature(node: MethodSignature, typeParameters: NodeArray<TypeParameterDeclaration> | undefined, parameters: NodeArray<ParameterDeclaration>, type: TypeNode | undefined, name: PropertyName, questionToken: QuestionToken | undefined) {
        return node.typeParameters !== typeParameters
            || node.parameters !== parameters
            || node.type !== type
            || node.name !== name
            || node.questionToken !== questionToken
            ? updateNode(createMethodSignature(typeParameters, parameters, type, name, questionToken), node)
            : node;
    }

    export function createMethod(
        decorators: readonly Decorator[] | undefined,
        modifiers: readonly Modifier[] | undefined,
        asteriskToken: AsteriskToken | undefined,
        name: string | PropertyName,
        questionToken: QuestionToken | undefined,
        typeParameters: readonly TypeParameterDeclaration[] | undefined,
        parameters: readonly ParameterDeclaration[],
        type: TypeNode | undefined,
        body: Block | undefined) {
        const node = <MethodDeclaration>createSynthesizedNode(SyntaxKind.MethodDeclaration);
        node.decorators = asNodeArray(decorators);
        node.modifiers = asNodeArray(modifiers);
        node.asteriskToken = asteriskToken;
        node.name = asName(name);
        node.questionToken = questionToken;
        node.typeParameters = asNodeArray(typeParameters);
        node.parameters = createNodeArray(parameters);
        node.type = type;
        node.body = body;
        return node;
    }

    function createMethodCall(object: Expression, methodName: string | Identifier, argumentsList: readonly Expression[]) {
        return createCall(
            createPropertyAccess(object, asName(methodName)),
            /*typeArguments*/ undefined,
            argumentsList
        );
    }

    function createGlobalMethodCall(globalObjectName: string, methodName: string, argumentsList: readonly Expression[]) {
        return createMethodCall(createIdentifier(globalObjectName), methodName, argumentsList);
    }

    /* @internal */
    export function createObjectDefinePropertyCall(target: Expression, propertyName: string | Expression, attributes: Expression) {
        return createGlobalMethodCall("Object", "defineProperty", [target, asExpression(propertyName), attributes]);
    }

    function tryAddPropertyAssignment(properties: Push<PropertyAssignment>, propertyName: string, expression: Expression | undefined) {
        if (expression) {
            properties.push(createPropertyAssignment(propertyName, expression));
            return true;
        }
        return false;
    }

    /* @internal */
    export function createPropertyDescriptor(attributes: PropertyDescriptorAttributes, singleLine?: boolean) {
        const properties: PropertyAssignment[] = [];
        tryAddPropertyAssignment(properties, "enumerable", asExpression(attributes.enumerable));
        tryAddPropertyAssignment(properties, "configurable", asExpression(attributes.configurable));

        let isData = tryAddPropertyAssignment(properties, "writable", asExpression(attributes.writable));
        isData = tryAddPropertyAssignment(properties, "value", attributes.value) || isData;

        let isAccessor = tryAddPropertyAssignment(properties, "get", attributes.get);
        isAccessor = tryAddPropertyAssignment(properties, "set", attributes.set) || isAccessor;

        Debug.assert(!(isData && isAccessor), "A PropertyDescriptor may not be both an accessor descriptor and a data descriptor.");
        return createObjectLiteral(properties, !singleLine);
    }

    export function updateMethod(
        node: MethodDeclaration,
        decorators: readonly Decorator[] | undefined,
        modifiers: readonly Modifier[] | undefined,
        asteriskToken: AsteriskToken | undefined,
        name: PropertyName,
        questionToken: QuestionToken | undefined,
        typeParameters: readonly TypeParameterDeclaration[] | undefined,
        parameters: readonly ParameterDeclaration[],
        type: TypeNode | undefined,
        body: Block | undefined) {
        return node.decorators !== decorators
            || node.modifiers !== modifiers
            || node.asteriskToken !== asteriskToken
            || node.name !== name
            || node.questionToken !== questionToken
            || node.typeParameters !== typeParameters
            || node.parameters !== parameters
            || node.type !== type
            || node.body !== body
            ? updateNode(createMethod(decorators, modifiers, asteriskToken, name, questionToken, typeParameters, parameters, type, body), node)
            : node;
    }

    export function createConstructor(decorators: readonly Decorator[] | undefined, modifiers: readonly Modifier[] | undefined, parameters: readonly ParameterDeclaration[], body: Block | undefined) {
        const node = <ConstructorDeclaration>createSynthesizedNode(SyntaxKind.Constructor);
        node.decorators = asNodeArray(decorators);
        node.modifiers = asNodeArray(modifiers);
        node.typeParameters = undefined;
        node.parameters = createNodeArray(parameters);
        node.type = undefined;
        node.body = body;
        return node;
    }

    export function updateConstructor(
        node: ConstructorDeclaration,
        decorators: readonly Decorator[] | undefined,
        modifiers: readonly Modifier[] | undefined,
        parameters: readonly ParameterDeclaration[],
        body: Block | undefined) {
        return node.decorators !== decorators
            || node.modifiers !== modifiers
            || node.parameters !== parameters
            || node.body !== body
            ? updateNode(createConstructor(decorators, modifiers, parameters, body), node)
            : node;
    }

    export function createGetAccessor(
        decorators: readonly Decorator[] | undefined,
        modifiers: readonly Modifier[] | undefined,
        name: string | PropertyName,
        parameters: readonly ParameterDeclaration[],
        type: TypeNode | undefined,
        body: Block | undefined) {
        const node = <GetAccessorDeclaration>createSynthesizedNode(SyntaxKind.GetAccessor);
        node.decorators = asNodeArray(decorators);
        node.modifiers = asNodeArray(modifiers);
        node.name = asName(name);
        node.typeParameters = undefined;
        node.parameters = createNodeArray(parameters);
        node.type = type;
        node.body = body;
        return node;
    }

    export function updateGetAccessor(
        node: GetAccessorDeclaration,
        decorators: readonly Decorator[] | undefined,
        modifiers: readonly Modifier[] | undefined,
        name: PropertyName,
        parameters: readonly ParameterDeclaration[],
        type: TypeNode | undefined,
        body: Block | undefined) {
        return node.decorators !== decorators
            || node.modifiers !== modifiers
            || node.name !== name
            || node.parameters !== parameters
            || node.type !== type
            || node.body !== body
            ? updateNode(createGetAccessor(decorators, modifiers, name, parameters, type, body), node)
            : node;
    }

    export function createSetAccessor(
        decorators: readonly Decorator[] | undefined,
        modifiers: readonly Modifier[] | undefined,
        name: string | PropertyName,
        parameters: readonly ParameterDeclaration[],
        body: Block | undefined) {
        const node = <SetAccessorDeclaration>createSynthesizedNode(SyntaxKind.SetAccessor);
        node.decorators = asNodeArray(decorators);
        node.modifiers = asNodeArray(modifiers);
        node.name = asName(name);
        node.typeParameters = undefined;
        node.parameters = createNodeArray(parameters);
        node.body = body;
        return node;
    }

    export function updateSetAccessor(
        node: SetAccessorDeclaration,
        decorators: readonly Decorator[] | undefined,
        modifiers: readonly Modifier[] | undefined,
        name: PropertyName,
        parameters: readonly ParameterDeclaration[],
        body: Block | undefined) {
        return node.decorators !== decorators
            || node.modifiers !== modifiers
            || node.name !== name
            || node.parameters !== parameters
            || node.body !== body
            ? updateNode(createSetAccessor(decorators, modifiers, name, parameters, body), node)
            : node;
    }

    export function createCallSignature(typeParameters: readonly TypeParameterDeclaration[] | undefined, parameters: readonly ParameterDeclaration[], type: TypeNode | undefined) {
        return createSignatureDeclaration(SyntaxKind.CallSignature, typeParameters, parameters, type) as CallSignatureDeclaration;
    }

    export function updateCallSignature(node: CallSignatureDeclaration, typeParameters: NodeArray<TypeParameterDeclaration> | undefined, parameters: NodeArray<ParameterDeclaration>, type: TypeNode | undefined) {
        return updateSignatureDeclaration(node, typeParameters, parameters, type);
    }

    export function createConstructSignature(typeParameters: readonly TypeParameterDeclaration[] | undefined, parameters: readonly ParameterDeclaration[], type: TypeNode | undefined) {
        return createSignatureDeclaration(SyntaxKind.ConstructSignature, typeParameters, parameters, type) as ConstructSignatureDeclaration;
    }

    export function updateConstructSignature(node: ConstructSignatureDeclaration, typeParameters: NodeArray<TypeParameterDeclaration> | undefined, parameters: NodeArray<ParameterDeclaration>, type: TypeNode | undefined) {
        return updateSignatureDeclaration(node, typeParameters, parameters, type);
    }

    export function createIndexSignature(
        decorators: readonly Decorator[] | undefined,
        modifiers: readonly Modifier[] | undefined,
        parameters: readonly ParameterDeclaration[],
        type: TypeNode): IndexSignatureDeclaration {
        const node = createSynthesizedNode(SyntaxKind.IndexSignature) as IndexSignatureDeclaration;
        node.decorators = asNodeArray(decorators);
        node.modifiers = asNodeArray(modifiers);
        node.parameters = createNodeArray(parameters);
        node.type = type;
        return node;
    }

    export function updateIndexSignature(
        node: IndexSignatureDeclaration,
        decorators: readonly Decorator[] | undefined,
        modifiers: readonly Modifier[] | undefined,
        parameters: readonly ParameterDeclaration[],
        type: TypeNode) {
        return node.parameters !== parameters
            || node.type !== type
            || node.decorators !== decorators
            || node.modifiers !== modifiers
            ? updateNode(createIndexSignature(decorators, modifiers, parameters, type), node)
            : node;
    }

    /* @internal */
    export function createSignatureDeclaration(kind: SyntaxKind, typeParameters: readonly TypeParameterDeclaration[] | undefined, parameters: readonly ParameterDeclaration[], type: TypeNode | undefined, typeArguments?: readonly TypeNode[] | undefined) {
        const node = createSynthesizedNode(kind) as SignatureDeclaration;
        node.typeParameters = asNodeArray(typeParameters);
        node.parameters = asNodeArray(parameters);
        node.type = type;
        node.typeArguments = asNodeArray(typeArguments);
        return node;
    }

    function updateSignatureDeclaration<T extends SignatureDeclaration>(node: T, typeParameters: NodeArray<TypeParameterDeclaration> | undefined, parameters: NodeArray<ParameterDeclaration>, type: TypeNode | undefined): T {
        return node.typeParameters !== typeParameters
            || node.parameters !== parameters
            || node.type !== type
            ? updateNode(<T>createSignatureDeclaration(node.kind, typeParameters, parameters, type), node)
            : node;
    }

    // Types

    export function createKeywordTypeNode(kind: KeywordTypeNode["kind"]) {
        return <KeywordTypeNode>createSynthesizedNode(kind);
    }

    export function createTypePredicateNode(parameterName: Identifier | ThisTypeNode | string, type: TypeNode) {
        return createTypePredicateNodeWithModifier(/*assertsModifier*/ undefined, parameterName, type);
    }

    export function createTypePredicateNodeWithModifier(assertsModifier: AssertsToken | undefined, parameterName: Identifier | ThisTypeNode | string, type: TypeNode | undefined) {
        const node = createSynthesizedNode(SyntaxKind.TypePredicate) as TypePredicateNode;
        node.assertsModifier = assertsModifier;
        node.parameterName = asName(parameterName);
        node.type = type;
        return node;
    }

    export function updateTypePredicateNode(node: TypePredicateNode, parameterName: Identifier | ThisTypeNode, type: TypeNode) {
        return updateTypePredicateNodeWithModifier(node, node.assertsModifier, parameterName, type);
    }

    export function updateTypePredicateNodeWithModifier(node: TypePredicateNode, assertsModifier: AssertsToken | undefined, parameterName: Identifier | ThisTypeNode, type: TypeNode | undefined) {
        return node.assertsModifier !== assertsModifier
            || node.parameterName !== parameterName
            || node.type !== type
            ? updateNode(createTypePredicateNodeWithModifier(assertsModifier, parameterName, type), node)
            : node;
    }

    export function createTypeReferenceNode(typeName: string | EntityName, typeArguments: readonly TypeNode[] | undefined) {
        const node = createSynthesizedNode(SyntaxKind.TypeReference) as TypeReferenceNode;
        node.typeName = asName(typeName);
        node.typeArguments = typeArguments && parenthesizeTypeParameters(typeArguments);
        return node;
    }

    export function updateTypeReferenceNode(node: TypeReferenceNode, typeName: EntityName, typeArguments: NodeArray<TypeNode> | undefined) {
        return node.typeName !== typeName
            || node.typeArguments !== typeArguments
            ? updateNode(createTypeReferenceNode(typeName, typeArguments), node)
            : node;
    }

    export function createFunctionTypeNode(typeParameters: readonly TypeParameterDeclaration[] | undefined, parameters: readonly ParameterDeclaration[], type: TypeNode | undefined) {
        return createSignatureDeclaration(SyntaxKind.FunctionType, typeParameters, parameters, type) as FunctionTypeNode;
    }

    export function updateFunctionTypeNode(node: FunctionTypeNode, typeParameters: NodeArray<TypeParameterDeclaration> | undefined, parameters: NodeArray<ParameterDeclaration>, type: TypeNode | undefined) {
        return updateSignatureDeclaration(node, typeParameters, parameters, type);
    }

    export function createConstructorTypeNode(typeParameters: readonly TypeParameterDeclaration[] | undefined, parameters: readonly ParameterDeclaration[], type: TypeNode | undefined) {
        return createSignatureDeclaration(SyntaxKind.ConstructorType, typeParameters, parameters, type) as ConstructorTypeNode;
    }

    export function updateConstructorTypeNode(node: ConstructorTypeNode, typeParameters: NodeArray<TypeParameterDeclaration> | undefined, parameters: NodeArray<ParameterDeclaration>, type: TypeNode | undefined) {
        return updateSignatureDeclaration(node, typeParameters, parameters, type);
    }

    export function createTypeQueryNode(exprName: EntityName) {
        const node = createSynthesizedNode(SyntaxKind.TypeQuery) as TypeQueryNode;
        node.exprName = exprName;
        return node;
    }

    export function updateTypeQueryNode(node: TypeQueryNode, exprName: EntityName) {
        return node.exprName !== exprName
            ? updateNode(createTypeQueryNode(exprName), node)
            : node;
    }

    export function createTypeLiteralNode(members: readonly TypeElement[] | undefined) {
        const node = createSynthesizedNode(SyntaxKind.TypeLiteral) as TypeLiteralNode;
        node.members = createNodeArray(members);
        return node;
    }

    export function updateTypeLiteralNode(node: TypeLiteralNode, members: NodeArray<TypeElement>) {
        return node.members !== members
            ? updateNode(createTypeLiteralNode(members), node)
            : node;
    }

    export function createArrayTypeNode(elementType: TypeNode) {
        const node = createSynthesizedNode(SyntaxKind.ArrayType) as ArrayTypeNode;
        node.elementType = parenthesizeArrayTypeMember(elementType);
        return node;
    }

    export function updateArrayTypeNode(node: ArrayTypeNode, elementType: TypeNode): ArrayTypeNode {
        return node.elementType !== elementType
            ? updateNode(createArrayTypeNode(elementType), node)
            : node;
    }

    export function createTupleTypeNode(elementTypes: readonly TypeNode[]) {
        const node = createSynthesizedNode(SyntaxKind.TupleType) as TupleTypeNode;
        node.elementTypes = createNodeArray(elementTypes);
        return node;
    }

    export function updateTupleTypeNode(node: TupleTypeNode, elementTypes: readonly TypeNode[]) {
        return node.elementTypes !== elementTypes
            ? updateNode(createTupleTypeNode(elementTypes), node)
            : node;
    }

    export function createOptionalTypeNode(type: TypeNode) {
        const node = createSynthesizedNode(SyntaxKind.OptionalType) as OptionalTypeNode;
        node.type = parenthesizeArrayTypeMember(type);
        return node;
    }

    export function updateOptionalTypeNode(node: OptionalTypeNode, type: TypeNode): OptionalTypeNode {
        return node.type !== type
            ? updateNode(createOptionalTypeNode(type), node)
            : node;
    }

    export function createRestTypeNode(type: TypeNode) {
        const node = createSynthesizedNode(SyntaxKind.RestType) as RestTypeNode;
        node.type = type;
        return node;
    }

    export function updateRestTypeNode(node: RestTypeNode, type: TypeNode): RestTypeNode {
        return node.type !== type
            ? updateNode(createRestTypeNode(type), node)
            : node;
    }

    export function createUnionTypeNode(types: readonly TypeNode[]): UnionTypeNode {
        return <UnionTypeNode>createUnionOrIntersectionTypeNode(SyntaxKind.UnionType, types);
    }

    export function updateUnionTypeNode(node: UnionTypeNode, types: NodeArray<TypeNode>) {
        return updateUnionOrIntersectionTypeNode(node, types);
    }

    export function createIntersectionTypeNode(types: readonly TypeNode[]): IntersectionTypeNode {
        return <IntersectionTypeNode>createUnionOrIntersectionTypeNode(SyntaxKind.IntersectionType, types);
    }

    export function updateIntersectionTypeNode(node: IntersectionTypeNode, types: NodeArray<TypeNode>) {
        return updateUnionOrIntersectionTypeNode(node, types);
    }

    export function createUnionOrIntersectionTypeNode(kind: SyntaxKind.UnionType | SyntaxKind.IntersectionType, types: readonly TypeNode[]) {
        const node = createSynthesizedNode(kind) as UnionTypeNode | IntersectionTypeNode;
        node.types = parenthesizeElementTypeMembers(types);
        return node;
    }

    function updateUnionOrIntersectionTypeNode<T extends UnionOrIntersectionTypeNode>(node: T, types: NodeArray<TypeNode>): T {
        return node.types !== types
            ? updateNode(<T>createUnionOrIntersectionTypeNode(node.kind, types), node)
            : node;
    }

    export function createConditionalTypeNode(checkType: TypeNode, extendsType: TypeNode, trueType: TypeNode, falseType: TypeNode) {
        const node = createSynthesizedNode(SyntaxKind.ConditionalType) as ConditionalTypeNode;
        node.checkType = parenthesizeConditionalTypeMember(checkType);
        node.extendsType = parenthesizeConditionalTypeMember(extendsType);
        node.trueType = trueType;
        node.falseType = falseType;
        return node;
    }

    export function updateConditionalTypeNode(node: ConditionalTypeNode, checkType: TypeNode, extendsType: TypeNode, trueType: TypeNode, falseType: TypeNode) {
        return node.checkType !== checkType
            || node.extendsType !== extendsType
            || node.trueType !== trueType
            || node.falseType !== falseType
            ? updateNode(createConditionalTypeNode(checkType, extendsType, trueType, falseType), node)
            : node;
    }

    export function createInferTypeNode(typeParameter: TypeParameterDeclaration) {
        const node = <InferTypeNode>createSynthesizedNode(SyntaxKind.InferType);
        node.typeParameter = typeParameter;
        return node;
    }

    export function updateInferTypeNode(node: InferTypeNode, typeParameter: TypeParameterDeclaration) {
        return node.typeParameter !== typeParameter
            ? updateNode(createInferTypeNode(typeParameter), node)
            : node;
    }

    export function createImportTypeNode(argument: TypeNode, qualifier?: EntityName, typeArguments?: readonly TypeNode[], isTypeOf?: boolean) {
        const node = <ImportTypeNode>createSynthesizedNode(SyntaxKind.ImportType);
        node.argument = argument;
        node.qualifier = qualifier;
        node.typeArguments = parenthesizeTypeParameters(typeArguments);
        node.isTypeOf = isTypeOf;
        return node;
    }

    export function updateImportTypeNode(node: ImportTypeNode, argument: TypeNode, qualifier?: EntityName, typeArguments?: readonly TypeNode[], isTypeOf?: boolean) {
        return node.argument !== argument
            || node.qualifier !== qualifier
            || node.typeArguments !== typeArguments
            || node.isTypeOf !== isTypeOf
            ? updateNode(createImportTypeNode(argument, qualifier, typeArguments, isTypeOf), node)
            : node;
    }

    export function createParenthesizedType(type: TypeNode) {
        const node = <ParenthesizedTypeNode>createSynthesizedNode(SyntaxKind.ParenthesizedType);
        node.type = type;
        return node;
    }

    export function updateParenthesizedType(node: ParenthesizedTypeNode, type: TypeNode) {
        return node.type !== type
            ? updateNode(createParenthesizedType(type), node)
            : node;
    }

    export function createThisTypeNode() {
        return <ThisTypeNode>createSynthesizedNode(SyntaxKind.ThisType);
    }

    export function createTypeOperatorNode(type: TypeNode): TypeOperatorNode;
    export function createTypeOperatorNode(operator: SyntaxKind.KeyOfKeyword | SyntaxKind.UniqueKeyword | SyntaxKind.ReadonlyKeyword, type: TypeNode): TypeOperatorNode;
    export function createTypeOperatorNode(operatorOrType: SyntaxKind.KeyOfKeyword | SyntaxKind.UniqueKeyword | SyntaxKind.ReadonlyKeyword | TypeNode, type?: TypeNode) {
        const node = createSynthesizedNode(SyntaxKind.TypeOperator) as TypeOperatorNode;
        node.operator = typeof operatorOrType === "number" ? operatorOrType : SyntaxKind.KeyOfKeyword;
        node.type = parenthesizeElementTypeMember(typeof operatorOrType === "number" ? type! : operatorOrType);
        return node;
    }

    export function updateTypeOperatorNode(node: TypeOperatorNode, type: TypeNode) {
        return node.type !== type ? updateNode(createTypeOperatorNode(node.operator, type), node) : node;
    }

    export function createIndexedAccessTypeNode(objectType: TypeNode, indexType: TypeNode) {
        const node = createSynthesizedNode(SyntaxKind.IndexedAccessType) as IndexedAccessTypeNode;
        node.objectType = parenthesizeElementTypeMember(objectType);
        node.indexType = indexType;
        return node;
    }

    export function updateIndexedAccessTypeNode(node: IndexedAccessTypeNode, objectType: TypeNode, indexType: TypeNode) {
        return node.objectType !== objectType
            || node.indexType !== indexType
            ? updateNode(createIndexedAccessTypeNode(objectType, indexType), node)
            : node;
    }

    export function createMappedTypeNode(readonlyToken: ReadonlyToken | PlusToken | MinusToken | undefined, typeParameter: TypeParameterDeclaration, questionToken: QuestionToken | PlusToken | MinusToken | undefined, type: TypeNode | undefined): MappedTypeNode {
        const node = createSynthesizedNode(SyntaxKind.MappedType) as MappedTypeNode;
        node.readonlyToken = readonlyToken;
        node.typeParameter = typeParameter;
        node.questionToken = questionToken;
        node.type = type;
        return node;
    }

    export function updateMappedTypeNode(node: MappedTypeNode, readonlyToken: ReadonlyToken | PlusToken | MinusToken | undefined, typeParameter: TypeParameterDeclaration, questionToken: QuestionToken | PlusToken | MinusToken | undefined, type: TypeNode | undefined): MappedTypeNode {
        return node.readonlyToken !== readonlyToken
            || node.typeParameter !== typeParameter
            || node.questionToken !== questionToken
            || node.type !== type
            ? updateNode(createMappedTypeNode(readonlyToken, typeParameter, questionToken, type), node)
            : node;
    }

    export function createLiteralTypeNode(literal: LiteralTypeNode["literal"]) {
        const node = createSynthesizedNode(SyntaxKind.LiteralType) as LiteralTypeNode;
        node.literal = literal;
        return node;
    }

    export function updateLiteralTypeNode(node: LiteralTypeNode, literal: LiteralTypeNode["literal"]) {
        return node.literal !== literal
            ? updateNode(createLiteralTypeNode(literal), node)
            : node;
    }

    // Binding Patterns

    export function createObjectBindingPattern(elements: readonly BindingElement[]) {
        const node = <ObjectBindingPattern>createSynthesizedNode(SyntaxKind.ObjectBindingPattern);
        node.elements = createNodeArray(elements);
        return node;
    }

    export function updateObjectBindingPattern(node: ObjectBindingPattern, elements: readonly BindingElement[]) {
        return node.elements !== elements
            ? updateNode(createObjectBindingPattern(elements), node)
            : node;
    }

    export function createArrayBindingPattern(elements: readonly ArrayBindingElement[]) {
        const node = <ArrayBindingPattern>createSynthesizedNode(SyntaxKind.ArrayBindingPattern);
        node.elements = createNodeArray(elements);
        return node;
    }

    export function updateArrayBindingPattern(node: ArrayBindingPattern, elements: readonly ArrayBindingElement[]) {
        return node.elements !== elements
            ? updateNode(createArrayBindingPattern(elements), node)
            : node;
    }

    export function createBindingElement(dotDotDotToken: DotDotDotToken | undefined, propertyName: string | PropertyName | undefined, name: string | BindingName, initializer?: Expression) {
        const node = <BindingElement>createSynthesizedNode(SyntaxKind.BindingElement);
        node.dotDotDotToken = dotDotDotToken;
        node.propertyName = asName(propertyName);
        node.name = asName(name);
        node.initializer = initializer;
        return node;
    }

    export function updateBindingElement(node: BindingElement, dotDotDotToken: DotDotDotToken | undefined, propertyName: PropertyName | undefined, name: BindingName, initializer: Expression | undefined) {
        return node.propertyName !== propertyName
            || node.dotDotDotToken !== dotDotDotToken
            || node.name !== name
            || node.initializer !== initializer
            ? updateNode(createBindingElement(dotDotDotToken, propertyName, name, initializer), node)
            : node;
    }

    // Expression

    export function createArrayLiteral(elements?: readonly Expression[], multiLine?: boolean) {
        const node = <ArrayLiteralExpression>createSynthesizedNode(SyntaxKind.ArrayLiteralExpression);
        node.elements = parenthesizeListElements(createNodeArray(elements));
        if (multiLine) node.multiLine = true;
        return node;
    }

    export function updateArrayLiteral(node: ArrayLiteralExpression, elements: readonly Expression[]) {
        return node.elements !== elements
            ? updateNode(createArrayLiteral(elements, node.multiLine), node)
            : node;
    }

    export function createObjectLiteral(properties?: readonly ObjectLiteralElementLike[], multiLine?: boolean) {
        const node = <ObjectLiteralExpression>createSynthesizedNode(SyntaxKind.ObjectLiteralExpression);
        node.properties = createNodeArray(properties);
        if (multiLine) node.multiLine = true;
        return node;
    }

    export function updateObjectLiteral(node: ObjectLiteralExpression, properties: readonly ObjectLiteralElementLike[]) {
        return node.properties !== properties
            ? updateNode(createObjectLiteral(properties, node.multiLine), node)
            : node;
    }

    export function createPropertyAccess(expression: Expression, name: string | Identifier) {
        const node = <PropertyAccessExpression>createSynthesizedNode(SyntaxKind.PropertyAccessExpression);
        node.expression = parenthesizeForAccess(expression);
        node.name = asName(name);
        setEmitFlags(node, EmitFlags.NoIndentation);
        return node;
    }

    export function updatePropertyAccess(node: PropertyAccessExpression, expression: Expression, name: Identifier) {
        if (isOptionalChain(node)) {
            return updatePropertyAccessChain(node, expression, node.questionDotToken, name);
        }
        // Because we are updating existed propertyAccess we want to inherit its emitFlags
        // instead of using the default from createPropertyAccess
        return node.expression !== expression
            || node.name !== name
            ? updateNode(setEmitFlags(createPropertyAccess(expression, name), getEmitFlags(node)), node)
            : node;
    }

    export function createPropertyAccessChain(expression: Expression, questionDotToken: QuestionDotToken | undefined, name: string | Identifier) {
        const node = <PropertyAccessChain>createSynthesizedNode(SyntaxKind.PropertyAccessExpression);
        node.flags |= NodeFlags.OptionalChain;
        node.expression = parenthesizeForAccess(expression);
        node.questionDotToken = questionDotToken;
        node.name = asName(name);
        setEmitFlags(node, EmitFlags.NoIndentation);
        return node;
    }

    export function updatePropertyAccessChain(node: PropertyAccessChain, expression: Expression, questionDotToken: QuestionDotToken | undefined, name: Identifier) {
        Debug.assert(!!(node.flags & NodeFlags.OptionalChain), "Cannot update a PropertyAccessExpression using updatePropertyAccessChain. Use updatePropertyAccess instead.");
        // Because we are updating an existing PropertyAccessChain we want to inherit its emitFlags
        // instead of using the default from createPropertyAccess
        return node.expression !== expression
            || node.questionDotToken !== questionDotToken
            || node.name !== name
            ? updateNode(setEmitFlags(createPropertyAccessChain(expression, questionDotToken, name), getEmitFlags(node)), node)
            : node;
    }

    export function createElementAccess(expression: Expression, index: number | Expression) {
        const node = <ElementAccessExpression>createSynthesizedNode(SyntaxKind.ElementAccessExpression);
        node.expression = parenthesizeForAccess(expression);
        node.argumentExpression = asExpression(index);
        return node;
    }

    export function updateElementAccess(node: ElementAccessExpression, expression: Expression, argumentExpression: Expression) {
        if (isOptionalChain(node)) {
            return updateElementAccessChain(node, expression, node.questionDotToken, argumentExpression);
        }
        return node.expression !== expression
            || node.argumentExpression !== argumentExpression
            ? updateNode(createElementAccess(expression, argumentExpression), node)
            : node;
    }

    export function createElementAccessChain(expression: Expression, questionDotToken: QuestionDotToken | undefined, index: number | Expression) {
        const node = <ElementAccessChain>createSynthesizedNode(SyntaxKind.ElementAccessExpression);
        node.flags |= NodeFlags.OptionalChain;
        node.expression = parenthesizeForAccess(expression);
        node.questionDotToken = questionDotToken;
        node.argumentExpression = asExpression(index);
        return node;
    }

    export function updateElementAccessChain(node: ElementAccessChain, expression: Expression, questionDotToken: QuestionDotToken | undefined, argumentExpression: Expression) {
        Debug.assert(!!(node.flags & NodeFlags.OptionalChain), "Cannot update an ElementAccessExpression using updateElementAccessChain. Use updateElementAccess instead.");
        return node.expression !== expression
            || node.questionDotToken !== questionDotToken
            || node.argumentExpression !== argumentExpression
            ? updateNode(createElementAccessChain(expression, questionDotToken, argumentExpression), node)
            : node;
    }

    export function createCall(expression: Expression, typeArguments: readonly TypeNode[] | undefined, argumentsArray: readonly Expression[] | undefined) {
        const node = <CallExpression>createSynthesizedNode(SyntaxKind.CallExpression);
        node.expression = parenthesizeForAccess(expression);
        node.typeArguments = asNodeArray(typeArguments);
        node.arguments = parenthesizeListElements(createNodeArray(argumentsArray));
        return node;
    }

    export function updateCall(node: CallExpression, expression: Expression, typeArguments: readonly TypeNode[] | undefined, argumentsArray: readonly Expression[]) {
        if (isOptionalChain(node)) {
            return updateCallChain(node, expression, node.questionDotToken, typeArguments, argumentsArray);
        }
        return node.expression !== expression
            || node.typeArguments !== typeArguments
            || node.arguments !== argumentsArray
            ? updateNode(createCall(expression, typeArguments, argumentsArray), node)
            : node;
    }

    export function createCallChain(expression: Expression, questionDotToken: QuestionDotToken | undefined, typeArguments: readonly TypeNode[] | undefined, argumentsArray: readonly Expression[] | undefined) {
        const node = <CallChain>createSynthesizedNode(SyntaxKind.CallExpression);
        node.flags |= NodeFlags.OptionalChain;
        node.expression = parenthesizeForAccess(expression);
        node.questionDotToken = questionDotToken;
        node.typeArguments = asNodeArray(typeArguments);
        node.arguments = parenthesizeListElements(createNodeArray(argumentsArray));
        return node;
    }

    export function updateCallChain(node: CallChain, expression: Expression, questionDotToken: QuestionDotToken | undefined, typeArguments: readonly TypeNode[] | undefined, argumentsArray: readonly Expression[]) {
        Debug.assert(!!(node.flags & NodeFlags.OptionalChain), "Cannot update a CallExpression using updateCallChain. Use updateCall instead.");
        return node.expression !== expression
            || node.questionDotToken !== questionDotToken
            || node.typeArguments !== typeArguments
            || node.arguments !== argumentsArray
            ? updateNode(createCallChain(expression, questionDotToken, typeArguments, argumentsArray), node)
            : node;
    }

    export function createNew(expression: Expression, typeArguments: readonly TypeNode[] | undefined, argumentsArray: readonly Expression[] | undefined) {
        const node = <NewExpression>createSynthesizedNode(SyntaxKind.NewExpression);
        node.expression = parenthesizeForNew(expression);
        node.typeArguments = asNodeArray(typeArguments);
        node.arguments = argumentsArray ? parenthesizeListElements(createNodeArray(argumentsArray)) : undefined;
        return node;
    }

    export function updateNew(node: NewExpression, expression: Expression, typeArguments: readonly TypeNode[] | undefined, argumentsArray: readonly Expression[] | undefined) {
        return node.expression !== expression
            || node.typeArguments !== typeArguments
            || node.arguments !== argumentsArray
            ? updateNode(createNew(expression, typeArguments, argumentsArray), node)
            : node;
    }

    /** @deprecated */ export function createTaggedTemplate(tag: Expression, template: TemplateLiteral): TaggedTemplateExpression;
    export function createTaggedTemplate(tag: Expression, typeArguments: readonly TypeNode[] | undefined, template: TemplateLiteral): TaggedTemplateExpression;
    /** @internal */
    export function createTaggedTemplate(tag: Expression, typeArgumentsOrTemplate: readonly TypeNode[] | TemplateLiteral | undefined, template?: TemplateLiteral): TaggedTemplateExpression;
    export function createTaggedTemplate(tag: Expression, typeArgumentsOrTemplate: readonly TypeNode[] | TemplateLiteral | undefined, template?: TemplateLiteral) {
        const node = <TaggedTemplateExpression>createSynthesizedNode(SyntaxKind.TaggedTemplateExpression);
        node.tag = parenthesizeForAccess(tag);
        if (template) {
            node.typeArguments = asNodeArray(typeArgumentsOrTemplate as readonly TypeNode[]);
            node.template = template;
        }
        else {
            node.typeArguments = undefined;
            node.template = typeArgumentsOrTemplate as TemplateLiteral;
        }
        return node;
    }

    /** @deprecated */ export function updateTaggedTemplate(node: TaggedTemplateExpression, tag: Expression, template: TemplateLiteral): TaggedTemplateExpression;
    export function updateTaggedTemplate(node: TaggedTemplateExpression, tag: Expression, typeArguments: readonly TypeNode[] | undefined, template: TemplateLiteral): TaggedTemplateExpression;
    export function updateTaggedTemplate(node: TaggedTemplateExpression, tag: Expression, typeArgumentsOrTemplate: readonly TypeNode[] | TemplateLiteral | undefined, template?: TemplateLiteral) {
        return node.tag !== tag
            || (template
                ? node.typeArguments !== typeArgumentsOrTemplate || node.template !== template
                : node.typeArguments !== undefined || node.template !== typeArgumentsOrTemplate)
            ? updateNode(createTaggedTemplate(tag, typeArgumentsOrTemplate, template), node)
            : node;
    }

    export function createTypeAssertion(type: TypeNode, expression: Expression) {
        const node = <TypeAssertion>createSynthesizedNode(SyntaxKind.TypeAssertionExpression);
        node.type = type;
        node.expression = parenthesizePrefixOperand(expression);
        return node;
    }

    export function updateTypeAssertion(node: TypeAssertion, type: TypeNode, expression: Expression) {
        return node.type !== type
            || node.expression !== expression
            ? updateNode(createTypeAssertion(type, expression), node)
            : node;
    }

    export function createParen(expression: Expression) {
        const node = <ParenthesizedExpression>createSynthesizedNode(SyntaxKind.ParenthesizedExpression);
        node.expression = expression;
        return node;
    }

    export function updateParen(node: ParenthesizedExpression, expression: Expression) {
        return node.expression !== expression
            ? updateNode(createParen(expression), node)
            : node;
    }

    export function createFunctionExpression(
        modifiers: readonly Modifier[] | undefined,
        asteriskToken: AsteriskToken | undefined,
        name: string | Identifier | undefined,
        typeParameters: readonly TypeParameterDeclaration[] | undefined,
        parameters: readonly ParameterDeclaration[] | undefined,
        type: TypeNode | undefined,
        body: Block) {
        const node = <FunctionExpression>createSynthesizedNode(SyntaxKind.FunctionExpression);
        node.modifiers = asNodeArray(modifiers);
        node.asteriskToken = asteriskToken;
        node.name = asName(name);
        node.typeParameters = asNodeArray(typeParameters);
        node.parameters = createNodeArray(parameters);
        node.type = type;
        node.body = body;
        return node;
    }

    export function updateFunctionExpression(
        node: FunctionExpression,
        modifiers: readonly Modifier[] | undefined,
        asteriskToken: AsteriskToken | undefined,
        name: Identifier | undefined,
        typeParameters: readonly TypeParameterDeclaration[] | undefined,
        parameters: readonly ParameterDeclaration[],
        type: TypeNode | undefined,
        body: Block) {
        return node.name !== name
            || node.modifiers !== modifiers
            || node.asteriskToken !== asteriskToken
            || node.typeParameters !== typeParameters
            || node.parameters !== parameters
            || node.type !== type
            || node.body !== body
            ? updateNode(createFunctionExpression(modifiers, asteriskToken, name, typeParameters, parameters, type, body), node)
            : node;
    }

    export function createArrowFunction(
        modifiers: readonly Modifier[] | undefined,
        typeParameters: readonly TypeParameterDeclaration[] | undefined,
        parameters: readonly ParameterDeclaration[],
        type: TypeNode | undefined,
        equalsGreaterThanToken: EqualsGreaterThanToken | undefined,
        body: ConciseBody) {
        const node = <ArrowFunction>createSynthesizedNode(SyntaxKind.ArrowFunction);
        node.modifiers = asNodeArray(modifiers);
        node.typeParameters = asNodeArray(typeParameters);
        node.parameters = createNodeArray(parameters);
        node.type = type;
        node.equalsGreaterThanToken = equalsGreaterThanToken || createToken(SyntaxKind.EqualsGreaterThanToken);
        node.body = parenthesizeConciseBody(body);
        return node;
    }
    export function updateArrowFunction(
        node: ArrowFunction,
        modifiers: readonly Modifier[] | undefined,
        typeParameters: readonly TypeParameterDeclaration[] | undefined,
        parameters: readonly ParameterDeclaration[],
        type: TypeNode | undefined,
        equalsGreaterThanToken: Token<SyntaxKind.EqualsGreaterThanToken>,
        body: ConciseBody
    ): ArrowFunction {
        return node.modifiers !== modifiers
            || node.typeParameters !== typeParameters
            || node.parameters !== parameters
            || node.type !== type
            || node.equalsGreaterThanToken !== equalsGreaterThanToken
            || node.body !== body
            ? updateNode(createArrowFunction(modifiers, typeParameters, parameters, type, equalsGreaterThanToken, body), node)
            : node;
    }

    export function createDelete(expression: Expression) {
        const node = <DeleteExpression>createSynthesizedNode(SyntaxKind.DeleteExpression);
        node.expression = parenthesizePrefixOperand(expression);
        return node;
    }

    export function updateDelete(node: DeleteExpression, expression: Expression) {
        return node.expression !== expression
            ? updateNode(createDelete(expression), node)
            : node;
    }

    export function createTypeOf(expression: Expression) {
        const node = <TypeOfExpression>createSynthesizedNode(SyntaxKind.TypeOfExpression);
        node.expression = parenthesizePrefixOperand(expression);
        return node;
    }

    export function updateTypeOf(node: TypeOfExpression, expression: Expression) {
        return node.expression !== expression
            ? updateNode(createTypeOf(expression), node)
            : node;
    }

    export function createVoid(expression: Expression) {
        const node = <VoidExpression>createSynthesizedNode(SyntaxKind.VoidExpression);
        node.expression = parenthesizePrefixOperand(expression);
        return node;
    }

    export function updateVoid(node: VoidExpression, expression: Expression) {
        return node.expression !== expression
            ? updateNode(createVoid(expression), node)
            : node;
    }

    export function createAwait(expression: Expression) {
        const node = <AwaitExpression>createSynthesizedNode(SyntaxKind.AwaitExpression);
        node.expression = parenthesizePrefixOperand(expression);
        return node;
    }

    export function updateAwait(node: AwaitExpression, expression: Expression) {
        return node.expression !== expression
            ? updateNode(createAwait(expression), node)
            : node;
    }

    export function createPrefix(operator: PrefixUnaryOperator, operand: Expression) {
        const node = <PrefixUnaryExpression>createSynthesizedNode(SyntaxKind.PrefixUnaryExpression);
        node.operator = operator;
        node.operand = parenthesizePrefixOperand(operand);
        return node;
    }

    export function updatePrefix(node: PrefixUnaryExpression, operand: Expression) {
        return node.operand !== operand
            ? updateNode(createPrefix(node.operator, operand), node)
            : node;
    }

    export function createPostfix(operand: Expression, operator: PostfixUnaryOperator) {
        const node = <PostfixUnaryExpression>createSynthesizedNode(SyntaxKind.PostfixUnaryExpression);
        node.operand = parenthesizePostfixOperand(operand);
        node.operator = operator;
        return node;
    }

    export function updatePostfix(node: PostfixUnaryExpression, operand: Expression) {
        return node.operand !== operand
            ? updateNode(createPostfix(operand, node.operator), node)
            : node;
    }

    export function createBinary(left: Expression, operator: BinaryOperator | BinaryOperatorToken, right: Expression) {
        const node = <BinaryExpression>createSynthesizedNode(SyntaxKind.BinaryExpression);
        const operatorToken = asToken(operator);
        const operatorKind = operatorToken.kind;
        node.left = parenthesizeBinaryOperand(operatorKind, left, /*isLeftSideOfBinary*/ true, /*leftOperand*/ undefined);
        node.operatorToken = operatorToken;
        node.right = parenthesizeBinaryOperand(operatorKind, right, /*isLeftSideOfBinary*/ false, node.left);
        return node;
    }

    export function updateBinary(node: BinaryExpression, left: Expression, right: Expression, operator?: BinaryOperator | BinaryOperatorToken) {
        return node.left !== left
            || node.right !== right
            ? updateNode(createBinary(left, operator || node.operatorToken, right), node)
            : node;
    }

    /** @deprecated */ export function createConditional(condition: Expression, whenTrue: Expression, whenFalse: Expression): ConditionalExpression;
    export function createConditional(condition: Expression, questionToken: QuestionToken, whenTrue: Expression, colonToken: ColonToken, whenFalse: Expression): ConditionalExpression;
    export function createConditional(condition: Expression, questionTokenOrWhenTrue: QuestionToken | Expression, whenTrueOrWhenFalse: Expression, colonToken?: ColonToken, whenFalse?: Expression) {
        const node = <ConditionalExpression>createSynthesizedNode(SyntaxKind.ConditionalExpression);
        node.condition = parenthesizeForConditionalHead(condition);
        node.questionToken = whenFalse ? <QuestionToken>questionTokenOrWhenTrue : createToken(SyntaxKind.QuestionToken);
        node.whenTrue = parenthesizeSubexpressionOfConditionalExpression(whenFalse ? whenTrueOrWhenFalse : <Expression>questionTokenOrWhenTrue);
        node.colonToken = whenFalse ? colonToken! : createToken(SyntaxKind.ColonToken);
        node.whenFalse = parenthesizeSubexpressionOfConditionalExpression(whenFalse ? whenFalse : whenTrueOrWhenFalse);
        return node;
    }
    export function updateConditional(
        node: ConditionalExpression,
        condition: Expression,
        questionToken: Token<SyntaxKind.QuestionToken>,
        whenTrue: Expression,
        colonToken: Token<SyntaxKind.ColonToken>,
        whenFalse: Expression
    ): ConditionalExpression {
        return node.condition !== condition
            || node.questionToken !== questionToken
            || node.whenTrue !== whenTrue
            || node.colonToken !== colonToken
            || node.whenFalse !== whenFalse
            ? updateNode(createConditional(condition, questionToken, whenTrue, colonToken, whenFalse), node)
            : node;
    }

    export function createTemplateExpression(head: TemplateHead, templateSpans: readonly TemplateSpan[]) {
        const node = <TemplateExpression>createSynthesizedNode(SyntaxKind.TemplateExpression);
        node.head = head;
        node.templateSpans = createNodeArray(templateSpans);
        return node;
    }

    export function updateTemplateExpression(node: TemplateExpression, head: TemplateHead, templateSpans: readonly TemplateSpan[]) {
        return node.head !== head
            || node.templateSpans !== templateSpans
            ? updateNode(createTemplateExpression(head, templateSpans), node)
            : node;
    }

    let rawTextScanner: Scanner | undefined;
    const invalidValueSentinel: object = {};

    function getCookedText(kind: TemplateLiteralToken["kind"], rawText: string) {
        if (!rawTextScanner) {
            rawTextScanner = createScanner(ScriptTarget.Latest, /*skipTrivia*/ false, LanguageVariant.Standard);
        }
        switch (kind) {
            case SyntaxKind.NoSubstitutionTemplateLiteral:
                rawTextScanner.setText("`" + rawText + "`");
                break;
            case SyntaxKind.TemplateHead:
                rawTextScanner.setText("`" + rawText + "${");
                break;
            case SyntaxKind.TemplateMiddle:
                rawTextScanner.setText("}" + rawText + "${");
                break;
            case SyntaxKind.TemplateTail:
                rawTextScanner.setText("}" + rawText + "`");
                break;
        }

        let token = rawTextScanner.scan();
        if (token === SyntaxKind.CloseBracketToken) {
            token = rawTextScanner.reScanTemplateToken();
        }

        if (rawTextScanner.isUnterminated()) {
            rawTextScanner.setText(undefined);
            return invalidValueSentinel;
        }

        let tokenValue: string | undefined;
        switch (token) {
            case SyntaxKind.NoSubstitutionTemplateLiteral:
            case SyntaxKind.TemplateHead:
            case SyntaxKind.TemplateMiddle:
            case SyntaxKind.TemplateTail:
                tokenValue = rawTextScanner.getTokenValue();
                break;
        }

        if (rawTextScanner.scan() !== SyntaxKind.EndOfFileToken) {
            rawTextScanner.setText(undefined);
            return invalidValueSentinel;
        }

        rawTextScanner.setText(undefined);
        return tokenValue;
    }

    function createTemplateLiteralLikeNode(kind: TemplateLiteralToken["kind"], text: string, rawText: string | undefined) {
        const node = <TemplateLiteralLikeNode>createSynthesizedNode(kind);
        node.text = text;
        if (rawText === undefined || text === rawText) {
            node.rawText = rawText;
        }
        else {
            const cooked = getCookedText(kind, rawText);
            if (typeof cooked === "object") {
                return Debug.fail("Invalid raw text");
            }

            Debug.assert(text === cooked, "Expected argument 'text' to be the normalized (i.e. 'cooked') version of argument 'rawText'.");
            node.rawText = rawText;
        }
        return node;
    }

    export function createTemplateHead(text: string, rawText?: string) {
        const node = <TemplateHead>createTemplateLiteralLikeNode(SyntaxKind.TemplateHead, text, rawText);
        node.text = text;
        return node;
    }

    export function createTemplateMiddle(text: string, rawText?: string) {
        const node = <TemplateMiddle>createTemplateLiteralLikeNode(SyntaxKind.TemplateMiddle, text, rawText);
        node.text = text;
        return node;
    }

    export function createTemplateTail(text: string, rawText?: string) {
        const node = <TemplateTail>createTemplateLiteralLikeNode(SyntaxKind.TemplateTail, text, rawText);
        node.text = text;
        return node;
    }

    export function createNoSubstitutionTemplateLiteral(text: string, rawText?: string) {
        const node = <NoSubstitutionTemplateLiteral>createTemplateLiteralLikeNode(SyntaxKind.NoSubstitutionTemplateLiteral, text, rawText);
        return node;
    }

    export function createYield(expression?: Expression): YieldExpression;
    export function createYield(asteriskToken: AsteriskToken | undefined, expression: Expression): YieldExpression;
    export function createYield(asteriskTokenOrExpression?: AsteriskToken | undefined | Expression, expression?: Expression) {
        const node = <YieldExpression>createSynthesizedNode(SyntaxKind.YieldExpression);
        node.asteriskToken = asteriskTokenOrExpression && asteriskTokenOrExpression.kind === SyntaxKind.AsteriskToken ? <AsteriskToken>asteriskTokenOrExpression : undefined;
        node.expression = asteriskTokenOrExpression && asteriskTokenOrExpression.kind !== SyntaxKind.AsteriskToken ? asteriskTokenOrExpression : expression;
        return node;
    }

    export function updateYield(node: YieldExpression, asteriskToken: AsteriskToken | undefined, expression: Expression) {
        return node.expression !== expression
            || node.asteriskToken !== asteriskToken
            ? updateNode(createYield(asteriskToken, expression), node)
            : node;
    }

    export function createSpread(expression: Expression) {
        const node = <SpreadElement>createSynthesizedNode(SyntaxKind.SpreadElement);
        node.expression = parenthesizeExpressionForList(expression);
        return node;
    }

    export function updateSpread(node: SpreadElement, expression: Expression) {
        return node.expression !== expression
            ? updateNode(createSpread(expression), node)
            : node;
    }

    export function createClassExpression(
        modifiers: readonly Modifier[] | undefined,
        name: string | Identifier | undefined,
        typeParameters: readonly TypeParameterDeclaration[] | undefined,
        heritageClauses: readonly HeritageClause[] | undefined,
        members: readonly ClassElement[]) {
        const node = <ClassExpression>createSynthesizedNode(SyntaxKind.ClassExpression);
        node.decorators = undefined;
        node.modifiers = asNodeArray(modifiers);
        node.name = asName(name);
        node.typeParameters = asNodeArray(typeParameters);
        node.heritageClauses = asNodeArray(heritageClauses);
        node.members = createNodeArray(members);
        return node;
    }

    export function updateClassExpression(
        node: ClassExpression,
        modifiers: readonly Modifier[] | undefined,
        name: Identifier | undefined,
        typeParameters: readonly TypeParameterDeclaration[] | undefined,
        heritageClauses: readonly HeritageClause[] | undefined,
        members: readonly ClassElement[]) {
        return node.modifiers !== modifiers
            || node.name !== name
            || node.typeParameters !== typeParameters
            || node.heritageClauses !== heritageClauses
            || node.members !== members
            ? updateNode(createClassExpression(modifiers, name, typeParameters, heritageClauses, members), node)
            : node;
    }

    export function createOmittedExpression() {
        return <OmittedExpression>createSynthesizedNode(SyntaxKind.OmittedExpression);
    }

    export function createExpressionWithTypeArguments(typeArguments: readonly TypeNode[] | undefined, expression: Expression) {
        const node = <ExpressionWithTypeArguments>createSynthesizedNode(SyntaxKind.ExpressionWithTypeArguments);
        node.expression = parenthesizeForAccess(expression);
        node.typeArguments = asNodeArray(typeArguments);
        return node;
    }

    export function updateExpressionWithTypeArguments(node: ExpressionWithTypeArguments, typeArguments: readonly TypeNode[] | undefined, expression: Expression) {
        return node.typeArguments !== typeArguments
            || node.expression !== expression
            ? updateNode(createExpressionWithTypeArguments(typeArguments, expression), node)
            : node;
    }

    export function createAsExpression(expression: Expression, type: TypeNode) {
        const node = <AsExpression>createSynthesizedNode(SyntaxKind.AsExpression);
        node.expression = expression;
        node.type = type;
        return node;
    }

    export function updateAsExpression(node: AsExpression, expression: Expression, type: TypeNode) {
        return node.expression !== expression
            || node.type !== type
            ? updateNode(createAsExpression(expression, type), node)
            : node;
    }

    export function createNonNullExpression(expression: Expression) {
        const node = <NonNullExpression>createSynthesizedNode(SyntaxKind.NonNullExpression);
        node.expression = parenthesizeForAccess(expression);
        return node;
    }

    export function updateNonNullExpression(node: NonNullExpression, expression: Expression) {
        return node.expression !== expression
            ? updateNode(createNonNullExpression(expression), node)
            : node;
    }

    export function createMetaProperty(keywordToken: MetaProperty["keywordToken"], name: Identifier) {
        const node = <MetaProperty>createSynthesizedNode(SyntaxKind.MetaProperty);
        node.keywordToken = keywordToken;
        node.name = name;
        return node;
    }

    export function updateMetaProperty(node: MetaProperty, name: Identifier) {
        return node.name !== name
            ? updateNode(createMetaProperty(node.keywordToken, name), node)
            : node;
    }

    // Misc

    export function createTemplateSpan(expression: Expression, literal: TemplateMiddle | TemplateTail) {
        const node = <TemplateSpan>createSynthesizedNode(SyntaxKind.TemplateSpan);
        node.expression = expression;
        node.literal = literal;
        return node;
    }

    export function updateTemplateSpan(node: TemplateSpan, expression: Expression, literal: TemplateMiddle | TemplateTail) {
        return node.expression !== expression
            || node.literal !== literal
            ? updateNode(createTemplateSpan(expression, literal), node)
            : node;
    }

    export function createSemicolonClassElement() {
        return <SemicolonClassElement>createSynthesizedNode(SyntaxKind.SemicolonClassElement);
    }

    // Element

    export function createBlock(statements: readonly Statement[], multiLine?: boolean): Block {
        const block = <Block>createSynthesizedNode(SyntaxKind.Block);
        block.statements = createNodeArray(statements);
        if (multiLine) block.multiLine = multiLine;
        return block;
    }

    export function updateBlock(node: Block, statements: readonly Statement[]) {
        return node.statements !== statements
            ? updateNode(createBlock(statements, node.multiLine), node)
            : node;
    }

    export function createVariableStatement(modifiers: readonly Modifier[] | undefined, declarationList: VariableDeclarationList | readonly VariableDeclaration[]) {
        const node = <VariableStatement>createSynthesizedNode(SyntaxKind.VariableStatement);
        node.decorators = undefined;
        node.modifiers = asNodeArray(modifiers);
        node.declarationList = isArray(declarationList) ? createVariableDeclarationList(declarationList) : declarationList;
        return node;
    }

    export function updateVariableStatement(node: VariableStatement, modifiers: readonly Modifier[] | undefined, declarationList: VariableDeclarationList) {
        return node.modifiers !== modifiers
            || node.declarationList !== declarationList
            ? updateNode(createVariableStatement(modifiers, declarationList), node)
            : node;
    }

    export function createEmptyStatement() {
        return <EmptyStatement>createSynthesizedNode(SyntaxKind.EmptyStatement);
    }

    export function createExpressionStatement(expression: Expression): ExpressionStatement {
        const node = <ExpressionStatement>createSynthesizedNode(SyntaxKind.ExpressionStatement);
        node.expression = parenthesizeExpressionForExpressionStatement(expression);
        return node;
    }

    export function updateExpressionStatement(node: ExpressionStatement, expression: Expression) {
        return node.expression !== expression
            ? updateNode(createExpressionStatement(expression), node)
            : node;
    }

    /** @deprecated Use `createExpressionStatement` instead.  */
    export const createStatement = createExpressionStatement;
    /** @deprecated Use `updateExpressionStatement` instead.  */
    export const updateStatement = updateExpressionStatement;

    export function createIf(expression: Expression, thenStatement: Statement, elseStatement?: Statement) {
        const node = <IfStatement>createSynthesizedNode(SyntaxKind.IfStatement);
        node.expression = expression;
        node.thenStatement = asEmbeddedStatement(thenStatement);
        node.elseStatement = asEmbeddedStatement(elseStatement);
        return node;
    }

    export function updateIf(node: IfStatement, expression: Expression, thenStatement: Statement, elseStatement: Statement | undefined) {
        return node.expression !== expression
            || node.thenStatement !== thenStatement
            || node.elseStatement !== elseStatement
            ? updateNode(createIf(expression, thenStatement, elseStatement), node)
            : node;
    }

    export function createDo(statement: Statement, expression: Expression) {
        const node = <DoStatement>createSynthesizedNode(SyntaxKind.DoStatement);
        node.statement = asEmbeddedStatement(statement);
        node.expression = expression;
        return node;
    }

    export function updateDo(node: DoStatement, statement: Statement, expression: Expression) {
        return node.statement !== statement
            || node.expression !== expression
            ? updateNode(createDo(statement, expression), node)
            : node;
    }

    export function createWhile(expression: Expression, statement: Statement) {
        const node = <WhileStatement>createSynthesizedNode(SyntaxKind.WhileStatement);
        node.expression = expression;
        node.statement = asEmbeddedStatement(statement);
        return node;
    }

    export function updateWhile(node: WhileStatement, expression: Expression, statement: Statement) {
        return node.expression !== expression
            || node.statement !== statement
            ? updateNode(createWhile(expression, statement), node)
            : node;
    }

    export function createFor(initializer: ForInitializer | undefined, condition: Expression | undefined, incrementor: Expression | undefined, statement: Statement) {
        const node = <ForStatement>createSynthesizedNode(SyntaxKind.ForStatement);
        node.initializer = initializer;
        node.condition = condition;
        node.incrementor = incrementor;
        node.statement = asEmbeddedStatement(statement);
        return node;
    }

    export function updateFor(node: ForStatement, initializer: ForInitializer | undefined, condition: Expression | undefined, incrementor: Expression | undefined, statement: Statement) {
        return node.initializer !== initializer
            || node.condition !== condition
            || node.incrementor !== incrementor
            || node.statement !== statement
            ? updateNode(createFor(initializer, condition, incrementor, statement), node)
            : node;
    }

    export function createForIn(initializer: ForInitializer, expression: Expression, statement: Statement) {
        const node = <ForInStatement>createSynthesizedNode(SyntaxKind.ForInStatement);
        node.initializer = initializer;
        node.expression = expression;
        node.statement = asEmbeddedStatement(statement);
        return node;
    }

    export function updateForIn(node: ForInStatement, initializer: ForInitializer, expression: Expression, statement: Statement) {
        return node.initializer !== initializer
            || node.expression !== expression
            || node.statement !== statement
            ? updateNode(createForIn(initializer, expression, statement), node)
            : node;
    }

    export function createForOf(awaitModifier: AwaitKeywordToken | undefined, initializer: ForInitializer, expression: Expression, statement: Statement) {
        const node = <ForOfStatement>createSynthesizedNode(SyntaxKind.ForOfStatement);
        node.awaitModifier = awaitModifier;
        node.initializer = initializer;
        node.expression = isCommaSequence(expression) ? createParen(expression) : expression;
        node.statement = asEmbeddedStatement(statement);
        return node;
    }

    export function updateForOf(node: ForOfStatement, awaitModifier: AwaitKeywordToken | undefined, initializer: ForInitializer, expression: Expression, statement: Statement) {
        return node.awaitModifier !== awaitModifier
            || node.initializer !== initializer
            || node.expression !== expression
            || node.statement !== statement
            ? updateNode(createForOf(awaitModifier, initializer, expression, statement), node)
            : node;
    }

    export function createContinue(label?: string | Identifier): ContinueStatement {
        const node = <ContinueStatement>createSynthesizedNode(SyntaxKind.ContinueStatement);
        node.label = asName(label);
        return node;
    }

    export function updateContinue(node: ContinueStatement, label: Identifier | undefined) {
        return node.label !== label
            ? updateNode(createContinue(label), node)
            : node;
    }

    export function createBreak(label?: string | Identifier): BreakStatement {
        const node = <BreakStatement>createSynthesizedNode(SyntaxKind.BreakStatement);
        node.label = asName(label);
        return node;
    }

    export function updateBreak(node: BreakStatement, label: Identifier | undefined) {
        return node.label !== label
            ? updateNode(createBreak(label), node)
            : node;
    }

    export function createReturn(expression?: Expression): ReturnStatement {
        const node = <ReturnStatement>createSynthesizedNode(SyntaxKind.ReturnStatement);
        node.expression = expression;
        return node;
    }

    export function updateReturn(node: ReturnStatement, expression: Expression | undefined) {
        return node.expression !== expression
            ? updateNode(createReturn(expression), node)
            : node;
    }

    export function createWith(expression: Expression, statement: Statement) {
        const node = <WithStatement>createSynthesizedNode(SyntaxKind.WithStatement);
        node.expression = expression;
        node.statement = asEmbeddedStatement(statement);
        return node;
    }

    export function updateWith(node: WithStatement, expression: Expression, statement: Statement) {
        return node.expression !== expression
            || node.statement !== statement
            ? updateNode(createWith(expression, statement), node)
            : node;
    }

    export function createSwitch(expression: Expression, caseBlock: CaseBlock): SwitchStatement {
        const node = <SwitchStatement>createSynthesizedNode(SyntaxKind.SwitchStatement);
        node.expression = parenthesizeExpressionForList(expression);
        node.caseBlock = caseBlock;
        return node;
    }

    export function updateSwitch(node: SwitchStatement, expression: Expression, caseBlock: CaseBlock) {
        return node.expression !== expression
            || node.caseBlock !== caseBlock
            ? updateNode(createSwitch(expression, caseBlock), node)
            : node;
    }

    export function createLabel(label: string | Identifier, statement: Statement) {
        const node = <LabeledStatement>createSynthesizedNode(SyntaxKind.LabeledStatement);
        node.label = asName(label);
        node.statement = asEmbeddedStatement(statement);
        return node;
    }

    export function updateLabel(node: LabeledStatement, label: Identifier, statement: Statement) {
        return node.label !== label
            || node.statement !== statement
            ? updateNode(createLabel(label, statement), node)
            : node;
    }

    export function createThrow(expression: Expression) {
        const node = <ThrowStatement>createSynthesizedNode(SyntaxKind.ThrowStatement);
        node.expression = expression;
        return node;
    }

    export function updateThrow(node: ThrowStatement, expression: Expression) {
        return node.expression !== expression
            ? updateNode(createThrow(expression), node)
            : node;
    }

    export function createTry(tryBlock: Block, catchClause: CatchClause | undefined, finallyBlock: Block | undefined) {
        const node = <TryStatement>createSynthesizedNode(SyntaxKind.TryStatement);
        node.tryBlock = tryBlock;
        node.catchClause = catchClause;
        node.finallyBlock = finallyBlock;
        return node;
    }

    export function updateTry(node: TryStatement, tryBlock: Block, catchClause: CatchClause | undefined, finallyBlock: Block | undefined) {
        return node.tryBlock !== tryBlock
            || node.catchClause !== catchClause
            || node.finallyBlock !== finallyBlock
            ? updateNode(createTry(tryBlock, catchClause, finallyBlock), node)
            : node;
    }

    export function createDebuggerStatement() {
        return <DebuggerStatement>createSynthesizedNode(SyntaxKind.DebuggerStatement);
    }

    export function createVariableDeclaration(name: string | BindingName, type?: TypeNode, initializer?: Expression) {
        const node = <VariableDeclaration>createSynthesizedNode(SyntaxKind.VariableDeclaration);
        node.name = asName(name);
        node.type = type;
        node.initializer = initializer !== undefined ? parenthesizeExpressionForList(initializer) : undefined;
        return node;
    }

    export function updateVariableDeclaration(node: VariableDeclaration, name: BindingName, type: TypeNode | undefined, initializer: Expression | undefined) {
        return node.name !== name
            || node.type !== type
            || node.initializer !== initializer
            ? updateNode(createVariableDeclaration(name, type, initializer), node)
            : node;
    }

    export function createVariableDeclarationList(declarations: readonly VariableDeclaration[], flags = NodeFlags.None) {
        const node = <VariableDeclarationList>createSynthesizedNode(SyntaxKind.VariableDeclarationList);
        node.flags |= flags & NodeFlags.BlockScoped;
        node.declarations = createNodeArray(declarations);
        return node;
    }

    export function updateVariableDeclarationList(node: VariableDeclarationList, declarations: readonly VariableDeclaration[]) {
        return node.declarations !== declarations
            ? updateNode(createVariableDeclarationList(declarations, node.flags), node)
            : node;
    }

    export function createFunctionDeclaration(
        decorators: readonly Decorator[] | undefined,
        modifiers: readonly Modifier[] | undefined,
        asteriskToken: AsteriskToken | undefined,
        name: string | Identifier | undefined,
        typeParameters: readonly TypeParameterDeclaration[] | undefined,
        parameters: readonly ParameterDeclaration[],
        type: TypeNode | undefined,
        body: Block | undefined) {
        const node = <FunctionDeclaration>createSynthesizedNode(SyntaxKind.FunctionDeclaration);
        node.decorators = asNodeArray(decorators);
        node.modifiers = asNodeArray(modifiers);
        node.asteriskToken = asteriskToken;
        node.name = asName(name);
        node.typeParameters = asNodeArray(typeParameters);
        node.parameters = createNodeArray(parameters);
        node.type = type;
        node.body = body;
        return node;
    }

    export function updateFunctionDeclaration(
        node: FunctionDeclaration,
        decorators: readonly Decorator[] | undefined,
        modifiers: readonly Modifier[] | undefined,
        asteriskToken: AsteriskToken | undefined,
        name: Identifier | undefined,
        typeParameters: readonly TypeParameterDeclaration[] | undefined,
        parameters: readonly ParameterDeclaration[],
        type: TypeNode | undefined,
        body: Block | undefined) {
        return node.decorators !== decorators
            || node.modifiers !== modifiers
            || node.asteriskToken !== asteriskToken
            || node.name !== name
            || node.typeParameters !== typeParameters
            || node.parameters !== parameters
            || node.type !== type
            || node.body !== body
            ? updateNode(createFunctionDeclaration(decorators, modifiers, asteriskToken, name, typeParameters, parameters, type, body), node)
            : node;
    }

    export function createClassDeclaration(
        decorators: readonly Decorator[] | undefined,
        modifiers: readonly Modifier[] | undefined,
        name: string | Identifier | undefined,
        typeParameters: readonly TypeParameterDeclaration[] | undefined,
        heritageClauses: readonly HeritageClause[] | undefined,
        members: readonly ClassElement[]) {
        const node = <ClassDeclaration>createSynthesizedNode(SyntaxKind.ClassDeclaration);
        node.decorators = asNodeArray(decorators);
        node.modifiers = asNodeArray(modifiers);
        node.name = asName(name);
        node.typeParameters = asNodeArray(typeParameters);
        node.heritageClauses = asNodeArray(heritageClauses);
        node.members = createNodeArray(members);
        return node;
    }

    export function updateClassDeclaration(
        node: ClassDeclaration,
        decorators: readonly Decorator[] | undefined,
        modifiers: readonly Modifier[] | undefined,
        name: Identifier | undefined,
        typeParameters: readonly TypeParameterDeclaration[] | undefined,
        heritageClauses: readonly HeritageClause[] | undefined,
        members: readonly ClassElement[]) {
        return node.decorators !== decorators
            || node.modifiers !== modifiers
            || node.name !== name
            || node.typeParameters !== typeParameters
            || node.heritageClauses !== heritageClauses
            || node.members !== members
            ? updateNode(createClassDeclaration(decorators, modifiers, name, typeParameters, heritageClauses, members), node)
            : node;
    }

    export function createInterfaceDeclaration(
        decorators: readonly Decorator[] | undefined,
        modifiers: readonly Modifier[] | undefined,
        name: string | Identifier,
        typeParameters: readonly TypeParameterDeclaration[] | undefined,
        heritageClauses: readonly HeritageClause[] | undefined,
        members: readonly TypeElement[]) {
        const node = <InterfaceDeclaration>createSynthesizedNode(SyntaxKind.InterfaceDeclaration);
        node.decorators = asNodeArray(decorators);
        node.modifiers = asNodeArray(modifiers);
        node.name = asName(name);
        node.typeParameters = asNodeArray(typeParameters);
        node.heritageClauses = asNodeArray(heritageClauses);
        node.members = createNodeArray(members);
        return node;
    }

    export function updateInterfaceDeclaration(
        node: InterfaceDeclaration,
        decorators: readonly Decorator[] | undefined,
        modifiers: readonly Modifier[] | undefined,
        name: Identifier,
        typeParameters: readonly TypeParameterDeclaration[] | undefined,
        heritageClauses: readonly HeritageClause[] | undefined,
        members: readonly TypeElement[]) {
        return node.decorators !== decorators
            || node.modifiers !== modifiers
            || node.name !== name
            || node.typeParameters !== typeParameters
            || node.heritageClauses !== heritageClauses
            || node.members !== members
            ? updateNode(createInterfaceDeclaration(decorators, modifiers, name, typeParameters, heritageClauses, members), node)
            : node;
    }

    export function createTypeAliasDeclaration(
        decorators: readonly Decorator[] | undefined,
        modifiers: readonly Modifier[] | undefined,
        name: string | Identifier,
        typeParameters: readonly TypeParameterDeclaration[] | undefined,
        type: TypeNode) {
        const node = <TypeAliasDeclaration>createSynthesizedNode(SyntaxKind.TypeAliasDeclaration);
        node.decorators = asNodeArray(decorators);
        node.modifiers = asNodeArray(modifiers);
        node.name = asName(name);
        node.typeParameters = asNodeArray(typeParameters);
        node.type = type;
        return node;
    }

    export function updateTypeAliasDeclaration(
        node: TypeAliasDeclaration,
        decorators: readonly Decorator[] | undefined,
        modifiers: readonly Modifier[] | undefined,
        name: Identifier,
        typeParameters: readonly TypeParameterDeclaration[] | undefined,
        type: TypeNode) {
        return node.decorators !== decorators
            || node.modifiers !== modifiers
            || node.name !== name
            || node.typeParameters !== typeParameters
            || node.type !== type
            ? updateNode(createTypeAliasDeclaration(decorators, modifiers, name, typeParameters, type), node)
            : node;
    }

    export function createEnumDeclaration(
        decorators: readonly Decorator[] | undefined,
        modifiers: readonly Modifier[] | undefined,
        name: string | Identifier,
        members: readonly EnumMember[]) {
        const node = <EnumDeclaration>createSynthesizedNode(SyntaxKind.EnumDeclaration);
        node.decorators = asNodeArray(decorators);
        node.modifiers = asNodeArray(modifiers);
        node.name = asName(name);
        node.members = createNodeArray(members);
        return node;
    }

    export function updateEnumDeclaration(
        node: EnumDeclaration,
        decorators: readonly Decorator[] | undefined,
        modifiers: readonly Modifier[] | undefined,
        name: Identifier,
        members: readonly EnumMember[]) {
        return node.decorators !== decorators
            || node.modifiers !== modifiers
            || node.name !== name
            || node.members !== members
            ? updateNode(createEnumDeclaration(decorators, modifiers, name, members), node)
            : node;
    }

    export function createModuleDeclaration(decorators: readonly Decorator[] | undefined, modifiers: readonly Modifier[] | undefined, name: ModuleName, body: ModuleBody | undefined, flags = NodeFlags.None) {
        const node = <ModuleDeclaration>createSynthesizedNode(SyntaxKind.ModuleDeclaration);
        node.flags |= flags & (NodeFlags.Namespace | NodeFlags.NestedNamespace | NodeFlags.GlobalAugmentation);
        node.decorators = asNodeArray(decorators);
        node.modifiers = asNodeArray(modifiers);
        node.name = name;
        node.body = body;
        return node;
    }

    export function updateModuleDeclaration(node: ModuleDeclaration, decorators: readonly Decorator[] | undefined, modifiers: readonly Modifier[] | undefined, name: ModuleName, body: ModuleBody | undefined) {
        return node.decorators !== decorators
            || node.modifiers !== modifiers
            || node.name !== name
            || node.body !== body
            ? updateNode(createModuleDeclaration(decorators, modifiers, name, body, node.flags), node)
            : node;
    }

    export function createModuleBlock(statements: readonly Statement[]) {
        const node = <ModuleBlock>createSynthesizedNode(SyntaxKind.ModuleBlock);
        node.statements = createNodeArray(statements);
        return node;
    }

    export function updateModuleBlock(node: ModuleBlock, statements: readonly Statement[]) {
        return node.statements !== statements
            ? updateNode(createModuleBlock(statements), node)
            : node;
    }

    export function createCaseBlock(clauses: readonly CaseOrDefaultClause[]): CaseBlock {
        const node = <CaseBlock>createSynthesizedNode(SyntaxKind.CaseBlock);
        node.clauses = createNodeArray(clauses);
        return node;
    }

    export function updateCaseBlock(node: CaseBlock, clauses: readonly CaseOrDefaultClause[]) {
        return node.clauses !== clauses
            ? updateNode(createCaseBlock(clauses), node)
            : node;
    }

    export function createNamespaceExportDeclaration(name: string | Identifier) {
        const node = <NamespaceExportDeclaration>createSynthesizedNode(SyntaxKind.NamespaceExportDeclaration);
        node.name = asName(name);
        return node;
    }

    export function updateNamespaceExportDeclaration(node: NamespaceExportDeclaration, name: Identifier) {
        return node.name !== name
            ? updateNode(createNamespaceExportDeclaration(name), node)
            : node;
    }

    export function createImportEqualsDeclaration(decorators: readonly Decorator[] | undefined, modifiers: readonly Modifier[] | undefined, name: string | Identifier, moduleReference: ModuleReference) {
        const node = <ImportEqualsDeclaration>createSynthesizedNode(SyntaxKind.ImportEqualsDeclaration);
        node.decorators = asNodeArray(decorators);
        node.modifiers = asNodeArray(modifiers);
        node.name = asName(name);
        node.moduleReference = moduleReference;
        return node;
    }

    export function updateImportEqualsDeclaration(node: ImportEqualsDeclaration, decorators: readonly Decorator[] | undefined, modifiers: readonly Modifier[] | undefined, name: Identifier, moduleReference: ModuleReference) {
        return node.decorators !== decorators
            || node.modifiers !== modifiers
            || node.name !== name
            || node.moduleReference !== moduleReference
            ? updateNode(createImportEqualsDeclaration(decorators, modifiers, name, moduleReference), node)
            : node;
    }

    export function createImportDeclaration(
        decorators: readonly Decorator[] | undefined,
        modifiers: readonly Modifier[] | undefined,
        importClause: ImportClause | undefined,
        moduleSpecifier: Expression): ImportDeclaration {
        const node = <ImportDeclaration>createSynthesizedNode(SyntaxKind.ImportDeclaration);
        node.decorators = asNodeArray(decorators);
        node.modifiers = asNodeArray(modifiers);
        node.importClause = importClause;
        node.moduleSpecifier = moduleSpecifier;
        return node;
    }

    export function updateImportDeclaration(
        node: ImportDeclaration,
        decorators: readonly Decorator[] | undefined,
        modifiers: readonly Modifier[] | undefined,
        importClause: ImportClause | undefined,
        moduleSpecifier: Expression) {
        return node.decorators !== decorators
            || node.modifiers !== modifiers
            || node.importClause !== importClause
            || node.moduleSpecifier !== moduleSpecifier
            ? updateNode(createImportDeclaration(decorators, modifiers, importClause, moduleSpecifier), node)
            : node;
    }

    export function createImportClause(name: Identifier | undefined, namedBindings: NamedImportBindings | undefined): ImportClause {
        const node = <ImportClause>createSynthesizedNode(SyntaxKind.ImportClause);
        node.name = name;
        node.namedBindings = namedBindings;
        return node;
    }

    export function updateImportClause(node: ImportClause, name: Identifier | undefined, namedBindings: NamedImportBindings | undefined) {
        return node.name !== name
            || node.namedBindings !== namedBindings
            ? updateNode(createImportClause(name, namedBindings), node)
            : node;
    }

    export function createNamespaceImport(name: Identifier): NamespaceImport {
        const node = <NamespaceImport>createSynthesizedNode(SyntaxKind.NamespaceImport);
        node.name = name;
        return node;
    }

    export function updateNamespaceImport(node: NamespaceImport, name: Identifier) {
        return node.name !== name
            ? updateNode(createNamespaceImport(name), node)
            : node;
    }

    export function createNamedImports(elements: readonly ImportSpecifier[]): NamedImports {
        const node = <NamedImports>createSynthesizedNode(SyntaxKind.NamedImports);
        node.elements = createNodeArray(elements);
        return node;
    }

    export function updateNamedImports(node: NamedImports, elements: readonly ImportSpecifier[]) {
        return node.elements !== elements
            ? updateNode(createNamedImports(elements), node)
            : node;
    }

    export function createImportSpecifier(propertyName: Identifier | undefined, name: Identifier) {
        const node = <ImportSpecifier>createSynthesizedNode(SyntaxKind.ImportSpecifier);
        node.propertyName = propertyName;
        node.name = name;
        return node;
    }

    export function updateImportSpecifier(node: ImportSpecifier, propertyName: Identifier | undefined, name: Identifier) {
        return node.propertyName !== propertyName
            || node.name !== name
            ? updateNode(createImportSpecifier(propertyName, name), node)
            : node;
    }

    export function createExportAssignment(decorators: readonly Decorator[] | undefined, modifiers: readonly Modifier[] | undefined, isExportEquals: boolean | undefined, expression: Expression) {
        const node = <ExportAssignment>createSynthesizedNode(SyntaxKind.ExportAssignment);
        node.decorators = asNodeArray(decorators);
        node.modifiers = asNodeArray(modifiers);
        node.isExportEquals = isExportEquals;
        node.expression = isExportEquals ? parenthesizeBinaryOperand(SyntaxKind.EqualsToken, expression, /*isLeftSideOfBinary*/ false, /*leftOperand*/ undefined) : parenthesizeDefaultExpression(expression);
        return node;
    }

    export function updateExportAssignment(node: ExportAssignment, decorators: readonly Decorator[] | undefined, modifiers: readonly Modifier[] | undefined, expression: Expression) {
        return node.decorators !== decorators
            || node.modifiers !== modifiers
            || node.expression !== expression
            ? updateNode(createExportAssignment(decorators, modifiers, node.isExportEquals, expression), node)
            : node;
    }

    export function createExportDeclaration(decorators: readonly Decorator[] | undefined, modifiers: readonly Modifier[] | undefined, exportClause: NamedExports | undefined, moduleSpecifier?: Expression) {
        const node = <ExportDeclaration>createSynthesizedNode(SyntaxKind.ExportDeclaration);
        node.decorators = asNodeArray(decorators);
        node.modifiers = asNodeArray(modifiers);
        node.exportClause = exportClause;
        node.moduleSpecifier = moduleSpecifier;
        return node;
    }

    export function updateExportDeclaration(
        node: ExportDeclaration,
        decorators: readonly Decorator[] | undefined,
        modifiers: readonly Modifier[] | undefined,
        exportClause: NamedExports | undefined,
        moduleSpecifier: Expression | undefined) {
        return node.decorators !== decorators
            || node.modifiers !== modifiers
            || node.exportClause !== exportClause
            || node.moduleSpecifier !== moduleSpecifier
            ? updateNode(createExportDeclaration(decorators, modifiers, exportClause, moduleSpecifier), node)
            : node;
    }

    /* @internal */
    export function createEmptyExports() {
        return createExportDeclaration(/*decorators*/ undefined, /*modifiers*/ undefined, createNamedExports([]), /*moduleSpecifier*/ undefined);
    }

    export function createNamedExports(elements: readonly ExportSpecifier[]) {
        const node = <NamedExports>createSynthesizedNode(SyntaxKind.NamedExports);
        node.elements = createNodeArray(elements);
        return node;
    }

    export function updateNamedExports(node: NamedExports, elements: readonly ExportSpecifier[]) {
        return node.elements !== elements
            ? updateNode(createNamedExports(elements), node)
            : node;
    }

    export function createExportSpecifier(propertyName: string | Identifier | undefined, name: string | Identifier) {
        const node = <ExportSpecifier>createSynthesizedNode(SyntaxKind.ExportSpecifier);
        node.propertyName = asName(propertyName);
        node.name = asName(name);
        return node;
    }

    export function updateExportSpecifier(node: ExportSpecifier, propertyName: Identifier | undefined, name: Identifier) {
        return node.propertyName !== propertyName
            || node.name !== name
            ? updateNode(createExportSpecifier(propertyName, name), node)
            : node;
    }

    // Module references

    export function createExternalModuleReference(expression: Expression) {
        const node = <ExternalModuleReference>createSynthesizedNode(SyntaxKind.ExternalModuleReference);
        node.expression = expression;
        return node;
    }

    export function updateExternalModuleReference(node: ExternalModuleReference, expression: Expression) {
        return node.expression !== expression
            ? updateNode(createExternalModuleReference(expression), node)
            : node;
    }

    // JSDoc

    /* @internal */
    export function createJSDocTypeExpression(type: TypeNode): JSDocTypeExpression {
        const node = createSynthesizedNode(SyntaxKind.JSDocTypeExpression) as JSDocTypeExpression;
        node.type = type;
        return node;
    }

    /* @internal */
    export function createJSDocTypeTag(typeExpression: JSDocTypeExpression, comment?: string): JSDocTypeTag {
        const tag = createJSDocTag<JSDocTypeTag>(SyntaxKind.JSDocTypeTag, "type");
        tag.typeExpression = typeExpression;
        tag.comment = comment;
        return tag;
    }

    /* @internal */
    export function createJSDocReturnTag(typeExpression?: JSDocTypeExpression, comment?: string): JSDocReturnTag {
        const tag = createJSDocTag<JSDocReturnTag>(SyntaxKind.JSDocReturnTag, "returns");
        tag.typeExpression = typeExpression;
        tag.comment = comment;
        return tag;
    }

    /** @internal */
    export function createJSDocThisTag(typeExpression?: JSDocTypeExpression): JSDocThisTag {
        const tag = createJSDocTag<JSDocThisTag>(SyntaxKind.JSDocThisTag, "this");
        tag.typeExpression = typeExpression;
        return tag;
    }

    /* @internal */
    export function createJSDocParamTag(name: EntityName, isBracketed: boolean, typeExpression?: JSDocTypeExpression, comment?: string): JSDocParameterTag {
        const tag = createJSDocTag<JSDocParameterTag>(SyntaxKind.JSDocParameterTag, "param");
        tag.typeExpression = typeExpression;
        tag.name = name;
        tag.isBracketed = isBracketed;
        tag.comment = comment;
        return tag;
    }

    /* @internal */
    export function createJSDocComment(comment?: string | undefined, tags?: NodeArray<JSDocTag> | undefined) {
        const node = createSynthesizedNode(SyntaxKind.JSDocComment) as JSDoc;
        node.comment = comment;
        node.tags = tags;
        return node;
    }

    /* @internal */
    function createJSDocTag<T extends JSDocTag>(kind: T["kind"], tagName: string): T {
        const node = createSynthesizedNode(kind) as T;
        node.tagName = createIdentifier(tagName);
        return node;
    }

    // JSX

    export function createJsxElement(openingElement: JsxOpeningElement, children: readonly JsxChild[], closingElement: JsxClosingElement) {
        const node = <JsxElement>createSynthesizedNode(SyntaxKind.JsxElement);
        node.openingElement = openingElement;
        node.children = createNodeArray(children);
        node.closingElement = closingElement;
        return node;
    }

    export function updateJsxElement(node: JsxElement, openingElement: JsxOpeningElement, children: readonly JsxChild[], closingElement: JsxClosingElement) {
        return node.openingElement !== openingElement
            || node.children !== children
            || node.closingElement !== closingElement
            ? updateNode(createJsxElement(openingElement, children, closingElement), node)
            : node;
    }

    export function createJsxSelfClosingElement(tagName: JsxTagNameExpression, typeArguments: readonly TypeNode[] | undefined, attributes: JsxAttributes) {
        const node = <JsxSelfClosingElement>createSynthesizedNode(SyntaxKind.JsxSelfClosingElement);
        node.tagName = tagName;
        node.typeArguments = asNodeArray(typeArguments);
        node.attributes = attributes;
        return node;
    }

    export function updateJsxSelfClosingElement(node: JsxSelfClosingElement, tagName: JsxTagNameExpression, typeArguments: readonly TypeNode[] | undefined, attributes: JsxAttributes) {
        return node.tagName !== tagName
            || node.typeArguments !== typeArguments
            || node.attributes !== attributes
            ? updateNode(createJsxSelfClosingElement(tagName, typeArguments, attributes), node)
            : node;
    }

    export function createJsxOpeningElement(tagName: JsxTagNameExpression, typeArguments: readonly TypeNode[] | undefined, attributes: JsxAttributes) {
        const node = <JsxOpeningElement>createSynthesizedNode(SyntaxKind.JsxOpeningElement);
        node.tagName = tagName;
        node.typeArguments = asNodeArray(typeArguments);
        node.attributes = attributes;
        return node;
    }

    export function updateJsxOpeningElement(node: JsxOpeningElement, tagName: JsxTagNameExpression, typeArguments: readonly TypeNode[] | undefined, attributes: JsxAttributes) {
        return node.tagName !== tagName
            || node.typeArguments !== typeArguments
            || node.attributes !== attributes
            ? updateNode(createJsxOpeningElement(tagName, typeArguments, attributes), node)
            : node;
    }

    export function createJsxClosingElement(tagName: JsxTagNameExpression) {
        const node = <JsxClosingElement>createSynthesizedNode(SyntaxKind.JsxClosingElement);
        node.tagName = tagName;
        return node;
    }

    export function updateJsxClosingElement(node: JsxClosingElement, tagName: JsxTagNameExpression) {
        return node.tagName !== tagName
            ? updateNode(createJsxClosingElement(tagName), node)
            : node;
    }

    export function createJsxFragment(openingFragment: JsxOpeningFragment, children: readonly JsxChild[], closingFragment: JsxClosingFragment) {
        const node = <JsxFragment>createSynthesizedNode(SyntaxKind.JsxFragment);
        node.openingFragment = openingFragment;
        node.children = createNodeArray(children);
        node.closingFragment = closingFragment;
        return node;
    }

    export function createJsxText(text: string, containsOnlyTriviaWhiteSpaces?: boolean) {
        const node = <JsxText>createSynthesizedNode(SyntaxKind.JsxText);
        node.text = text;
        node.containsOnlyTriviaWhiteSpaces = !!containsOnlyTriviaWhiteSpaces;
        return node;
    }

    export function updateJsxText(node: JsxText, text: string, containsOnlyTriviaWhiteSpaces?: boolean) {
        return node.text !== text
            || node.containsOnlyTriviaWhiteSpaces !== containsOnlyTriviaWhiteSpaces
            ? updateNode(createJsxText(text, containsOnlyTriviaWhiteSpaces), node)
            : node;
    }

    export function createJsxOpeningFragment() {
        return <JsxOpeningFragment>createSynthesizedNode(SyntaxKind.JsxOpeningFragment);
    }

    export function createJsxJsxClosingFragment() {
        return <JsxClosingFragment>createSynthesizedNode(SyntaxKind.JsxClosingFragment);
    }

    export function updateJsxFragment(node: JsxFragment, openingFragment: JsxOpeningFragment, children: readonly JsxChild[], closingFragment: JsxClosingFragment) {
        return node.openingFragment !== openingFragment
            || node.children !== children
            || node.closingFragment !== closingFragment
            ? updateNode(createJsxFragment(openingFragment, children, closingFragment), node)
            : node;
    }

    export function createJsxAttribute(name: Identifier, initializer: StringLiteral | JsxExpression) {
        const node = <JsxAttribute>createSynthesizedNode(SyntaxKind.JsxAttribute);
        node.name = name;
        node.initializer = initializer;
        return node;
    }

    export function updateJsxAttribute(node: JsxAttribute, name: Identifier, initializer: StringLiteral | JsxExpression) {
        return node.name !== name
            || node.initializer !== initializer
            ? updateNode(createJsxAttribute(name, initializer), node)
            : node;
    }

    export function createJsxAttributes(properties: readonly JsxAttributeLike[]) {
        const node = <JsxAttributes>createSynthesizedNode(SyntaxKind.JsxAttributes);
        node.properties = createNodeArray(properties);
        return node;
    }

    export function updateJsxAttributes(node: JsxAttributes, properties: readonly JsxAttributeLike[]) {
        return node.properties !== properties
            ? updateNode(createJsxAttributes(properties), node)
            : node;
    }

    export function createJsxSpreadAttribute(expression: Expression) {
        const node = <JsxSpreadAttribute>createSynthesizedNode(SyntaxKind.JsxSpreadAttribute);
        node.expression = expression;
        return node;
    }

    export function updateJsxSpreadAttribute(node: JsxSpreadAttribute, expression: Expression) {
        return node.expression !== expression
            ? updateNode(createJsxSpreadAttribute(expression), node)
            : node;
    }

    export function createJsxExpression(dotDotDotToken: DotDotDotToken | undefined, expression: Expression | undefined) {
        const node = <JsxExpression>createSynthesizedNode(SyntaxKind.JsxExpression);
        node.dotDotDotToken = dotDotDotToken;
        node.expression = expression;
        return node;
    }

    export function updateJsxExpression(node: JsxExpression, expression: Expression | undefined) {
        return node.expression !== expression
            ? updateNode(createJsxExpression(node.dotDotDotToken, expression), node)
            : node;
    }

    // Clauses

    export function createCaseClause(expression: Expression, statements: readonly Statement[]) {
        const node = <CaseClause>createSynthesizedNode(SyntaxKind.CaseClause);
        node.expression = parenthesizeExpressionForList(expression);
        node.statements = createNodeArray(statements);
        return node;
    }

    export function updateCaseClause(node: CaseClause, expression: Expression, statements: readonly Statement[]) {
        return node.expression !== expression
            || node.statements !== statements
            ? updateNode(createCaseClause(expression, statements), node)
            : node;
    }

    export function createDefaultClause(statements: readonly Statement[]) {
        const node = <DefaultClause>createSynthesizedNode(SyntaxKind.DefaultClause);
        node.statements = createNodeArray(statements);
        return node;
    }

    export function updateDefaultClause(node: DefaultClause, statements: readonly Statement[]) {
        return node.statements !== statements
            ? updateNode(createDefaultClause(statements), node)
            : node;
    }

    export function createHeritageClause(token: HeritageClause["token"], types: readonly ExpressionWithTypeArguments[]) {
        const node = <HeritageClause>createSynthesizedNode(SyntaxKind.HeritageClause);
        node.token = token;
        node.types = createNodeArray(types);
        return node;
    }

    export function updateHeritageClause(node: HeritageClause, types: readonly ExpressionWithTypeArguments[]) {
        return node.types !== types
            ? updateNode(createHeritageClause(node.token, types), node)
            : node;
    }

    export function createCatchClause(variableDeclaration: string | VariableDeclaration | undefined, block: Block) {
        const node = <CatchClause>createSynthesizedNode(SyntaxKind.CatchClause);
        node.variableDeclaration = isString(variableDeclaration) ? createVariableDeclaration(variableDeclaration) : variableDeclaration;
        node.block = block;
        return node;
    }

    export function updateCatchClause(node: CatchClause, variableDeclaration: VariableDeclaration | undefined, block: Block) {
        return node.variableDeclaration !== variableDeclaration
            || node.block !== block
            ? updateNode(createCatchClause(variableDeclaration, block), node)
            : node;
    }

    // Property assignments

    export function createPropertyAssignment(name: string | PropertyName, initializer: Expression) {
        const node = <PropertyAssignment>createSynthesizedNode(SyntaxKind.PropertyAssignment);
        node.name = asName(name);
        node.questionToken = undefined;
        node.initializer = parenthesizeExpressionForList(initializer);
        return node;
    }

    export function updatePropertyAssignment(node: PropertyAssignment, name: PropertyName, initializer: Expression) {
        return node.name !== name
            || node.initializer !== initializer
            ? updateNode(createPropertyAssignment(name, initializer), node)
            : node;
    }

    export function createShorthandPropertyAssignment(name: string | Identifier, objectAssignmentInitializer?: Expression) {
        const node = <ShorthandPropertyAssignment>createSynthesizedNode(SyntaxKind.ShorthandPropertyAssignment);
        node.name = asName(name);
        node.objectAssignmentInitializer = objectAssignmentInitializer !== undefined ? parenthesizeExpressionForList(objectAssignmentInitializer) : undefined;
        return node;
    }

    export function updateShorthandPropertyAssignment(node: ShorthandPropertyAssignment, name: Identifier, objectAssignmentInitializer: Expression | undefined) {
        return node.name !== name
            || node.objectAssignmentInitializer !== objectAssignmentInitializer
            ? updateNode(createShorthandPropertyAssignment(name, objectAssignmentInitializer), node)
            : node;
    }

    export function createSpreadAssignment(expression: Expression) {
        const node = <SpreadAssignment>createSynthesizedNode(SyntaxKind.SpreadAssignment);
        node.expression = parenthesizeExpressionForList(expression);
        return node;
    }

    export function updateSpreadAssignment(node: SpreadAssignment, expression: Expression) {
        return node.expression !== expression
            ? updateNode(createSpreadAssignment(expression), node)
            : node;
    }

    // Enum

    export function createEnumMember(name: string | PropertyName, initializer?: Expression) {
        const node = <EnumMember>createSynthesizedNode(SyntaxKind.EnumMember);
        node.name = asName(name);
        node.initializer = initializer && parenthesizeExpressionForList(initializer);
        return node;
    }

    export function updateEnumMember(node: EnumMember, name: PropertyName, initializer: Expression | undefined) {
        return node.name !== name
            || node.initializer !== initializer
            ? updateNode(createEnumMember(name, initializer), node)
            : node;
    }

    // Top-level nodes

    export function updateSourceFileNode(node: SourceFile, statements: readonly Statement[], isDeclarationFile?: boolean, referencedFiles?: SourceFile["referencedFiles"], typeReferences?: SourceFile["typeReferenceDirectives"], hasNoDefaultLib?: boolean, libReferences?: SourceFile["libReferenceDirectives"]) {
        if (
            node.statements !== statements ||
            (isDeclarationFile !== undefined && node.isDeclarationFile !== isDeclarationFile) ||
            (referencedFiles !== undefined && node.referencedFiles !== referencedFiles) ||
            (typeReferences !== undefined && node.typeReferenceDirectives !== typeReferences) ||
            (libReferences !== undefined && node.libReferenceDirectives !== libReferences) ||
            (hasNoDefaultLib !== undefined && node.hasNoDefaultLib !== hasNoDefaultLib)
        ) {
            const updated = <SourceFile>createSynthesizedNode(SyntaxKind.SourceFile);
            updated.flags |= node.flags;
            updated.statements = createNodeArray(statements);
            updated.endOfFileToken = node.endOfFileToken;
            updated.fileName = node.fileName;
            updated.path = node.path;
            updated.text = node.text;
            updated.isDeclarationFile = isDeclarationFile === undefined ? node.isDeclarationFile : isDeclarationFile;
            updated.referencedFiles = referencedFiles === undefined ? node.referencedFiles : referencedFiles;
            updated.typeReferenceDirectives = typeReferences === undefined ? node.typeReferenceDirectives : typeReferences;
            updated.hasNoDefaultLib = hasNoDefaultLib === undefined ? node.hasNoDefaultLib : hasNoDefaultLib;
            updated.libReferenceDirectives = libReferences === undefined ? node.libReferenceDirectives : libReferences;
            if (node.amdDependencies !== undefined) updated.amdDependencies = node.amdDependencies;
            if (node.moduleName !== undefined) updated.moduleName = node.moduleName;
            if (node.languageVariant !== undefined) updated.languageVariant = node.languageVariant;
            if (node.renamedDependencies !== undefined) updated.renamedDependencies = node.renamedDependencies;
            if (node.languageVersion !== undefined) updated.languageVersion = node.languageVersion;
            if (node.scriptKind !== undefined) updated.scriptKind = node.scriptKind;
            if (node.externalModuleIndicator !== undefined) updated.externalModuleIndicator = node.externalModuleIndicator;
            if (node.commonJsModuleIndicator !== undefined) updated.commonJsModuleIndicator = node.commonJsModuleIndicator;
            if (node.identifiers !== undefined) updated.identifiers = node.identifiers;
            if (node.nodeCount !== undefined) updated.nodeCount = node.nodeCount;
            if (node.identifierCount !== undefined) updated.identifierCount = node.identifierCount;
            if (node.symbolCount !== undefined) updated.symbolCount = node.symbolCount;
            if (node.parseDiagnostics !== undefined) updated.parseDiagnostics = node.parseDiagnostics;
            if (node.bindDiagnostics !== undefined) updated.bindDiagnostics = node.bindDiagnostics;
            if (node.bindSuggestionDiagnostics !== undefined) updated.bindSuggestionDiagnostics = node.bindSuggestionDiagnostics;
            if (node.lineMap !== undefined) updated.lineMap = node.lineMap;
            if (node.classifiableNames !== undefined) updated.classifiableNames = node.classifiableNames;
            if (node.resolvedModules !== undefined) updated.resolvedModules = node.resolvedModules;
            if (node.resolvedTypeReferenceDirectiveNames !== undefined) updated.resolvedTypeReferenceDirectiveNames = node.resolvedTypeReferenceDirectiveNames;
            if (node.imports !== undefined) updated.imports = node.imports;
            if (node.moduleAugmentations !== undefined) updated.moduleAugmentations = node.moduleAugmentations;
            if (node.pragmas !== undefined) updated.pragmas = node.pragmas;
            if (node.localJsxFactory !== undefined) updated.localJsxFactory = node.localJsxFactory;
            if (node.localJsxNamespace !== undefined) updated.localJsxNamespace = node.localJsxNamespace;
            return updateNode(updated, node);
        }

        return node;
    }

    /**
     * Creates a shallow, memberwise clone of a node for mutation.
     */
    export function getMutableClone<T extends Node>(node: T): T {
        const clone = getSynthesizedClone(node);
        clone.pos = node.pos;
        clone.end = node.end;
        clone.parent = node.parent;
        return clone;
    }

    // Transformation nodes

    /**
     * Creates a synthetic statement to act as a placeholder for a not-emitted statement in
     * order to preserve comments.
     *
     * @param original The original statement.
     */
    export function createNotEmittedStatement(original: Node) {
        const node = <NotEmittedStatement>createSynthesizedNode(SyntaxKind.NotEmittedStatement);
        node.original = original;
        setTextRange(node, original);
        return node;
    }

    /**
     * Creates a synthetic element to act as a placeholder for the end of an emitted declaration in
     * order to properly emit exports.
     */
    /* @internal */
    export function createEndOfDeclarationMarker(original: Node) {
        const node = <EndOfDeclarationMarker>createSynthesizedNode(SyntaxKind.EndOfDeclarationMarker);
        node.emitNode = {} as EmitNode;
        node.original = original;
        return node;
    }

    /**
     * Creates a synthetic element to act as a placeholder for the beginning of a merged declaration in
     * order to properly emit exports.
     */
    /* @internal */
    export function createMergeDeclarationMarker(original: Node) {
        const node = <MergeDeclarationMarker>createSynthesizedNode(SyntaxKind.MergeDeclarationMarker);
        node.emitNode = {} as EmitNode;
        node.original = original;
        return node;
    }

    /**
     * Creates a synthetic expression to act as a placeholder for a not-emitted expression in
     * order to preserve comments or sourcemap positions.
     *
     * @param expression The inner expression to emit.
     * @param original The original outer expression.
     * @param location The location for the expression. Defaults to the positions from "original" if provided.
     */
    export function createPartiallyEmittedExpression(expression: Expression, original?: Node) {
        const node = <PartiallyEmittedExpression>createSynthesizedNode(SyntaxKind.PartiallyEmittedExpression);
        node.expression = expression;
        node.original = original;
        setTextRange(node, original);
        return node;
    }

    export function updatePartiallyEmittedExpression(node: PartiallyEmittedExpression, expression: Expression) {
        if (node.expression !== expression) {
            return updateNode(createPartiallyEmittedExpression(expression, node.original), node);
        }
        return node;
    }

    function flattenCommaElements(node: Expression): Expression | readonly Expression[] {
        if (nodeIsSynthesized(node) && !isParseTreeNode(node) && !node.original && !node.emitNode && !node.id) {
            if (node.kind === SyntaxKind.CommaListExpression) {
                return (<CommaListExpression>node).elements;
            }
            if (isBinaryExpression(node) && node.operatorToken.kind === SyntaxKind.CommaToken) {
                return [node.left, node.right];
            }
        }
        return node;
    }

    export function createCommaList(elements: readonly Expression[]) {
        const node = <CommaListExpression>createSynthesizedNode(SyntaxKind.CommaListExpression);
        node.elements = createNodeArray(sameFlatMap(elements, flattenCommaElements));
        return node;
    }

    export function updateCommaList(node: CommaListExpression, elements: readonly Expression[]) {
        return node.elements !== elements
            ? updateNode(createCommaList(elements), node)
            : node;
    }

    /* @internal */
    export function createSyntheticReferenceExpression(expression: Expression, thisArg: Expression) {
        const node = <SyntheticReferenceExpression>createSynthesizedNode(SyntaxKind.SyntheticReferenceExpression);
        node.expression = expression;
        node.thisArg = thisArg;
        return node;
    }

    /* @internal */
    export function updateSyntheticReferenceExpression(node: SyntheticReferenceExpression, expression: Expression, thisArg: Expression) {
        return node.expression !== expression
            || node.thisArg !== thisArg
            ? updateNode(createSyntheticReferenceExpression(expression, thisArg), node)
            : node;
    }

    export function createBundle(sourceFiles: readonly SourceFile[], prepends: readonly (UnparsedSource | InputFiles)[] = emptyArray) {
        const node = <Bundle>createNode(SyntaxKind.Bundle);
        node.prepends = prepends;
        node.sourceFiles = sourceFiles;
        return node;
    }

    let allUnscopedEmitHelpers: ReadonlyMap<UnscopedEmitHelper> | undefined;
    function getAllUnscopedEmitHelpers() {
        return allUnscopedEmitHelpers || (allUnscopedEmitHelpers = arrayToMap([
            valuesHelper,
            readHelper,
            spreadHelper,
            spreadArraysHelper,
            restHelper,
            decorateHelper,
            metadataHelper,
            paramHelper,
            awaiterHelper,
            assignHelper,
            awaitHelper,
            asyncGeneratorHelper,
            asyncDelegator,
            asyncValues,
            extendsHelper,
            templateObjectHelper,
            generatorHelper,
            importStarHelper,
            importDefaultHelper
        ], helper => helper.name));
    }

    function createUnparsedSource() {
        const node = <UnparsedSource>createNode(SyntaxKind.UnparsedSource);
        node.prologues = emptyArray;
        node.referencedFiles = emptyArray;
        node.libReferenceDirectives = emptyArray;
        node.getLineAndCharacterOfPosition = pos => getLineAndCharacterOfPosition(node, pos);
        return node;
    }

    export function createUnparsedSourceFile(text: string): UnparsedSource;
    export function createUnparsedSourceFile(inputFile: InputFiles, type: "js" | "dts", stripInternal?: boolean): UnparsedSource;
    export function createUnparsedSourceFile(text: string, mapPath: string | undefined, map: string | undefined): UnparsedSource;
    export function createUnparsedSourceFile(textOrInputFiles: string | InputFiles, mapPathOrType?: string, mapTextOrStripInternal?: string | boolean): UnparsedSource {
        const node = createUnparsedSource();
        let stripInternal: boolean | undefined;
        let bundleFileInfo: BundleFileInfo | undefined;
        if (!isString(textOrInputFiles)) {
            Debug.assert(mapPathOrType === "js" || mapPathOrType === "dts");
            node.fileName = (mapPathOrType === "js" ? textOrInputFiles.javascriptPath : textOrInputFiles.declarationPath) || "";
            node.sourceMapPath = mapPathOrType === "js" ? textOrInputFiles.javascriptMapPath : textOrInputFiles.declarationMapPath;
            Object.defineProperties(node, {
                text: { get() { return mapPathOrType === "js" ? textOrInputFiles.javascriptText : textOrInputFiles.declarationText; } },
                sourceMapText: { get() { return mapPathOrType === "js" ? textOrInputFiles.javascriptMapText : textOrInputFiles.declarationMapText; } },
            });


            if (textOrInputFiles.buildInfo && textOrInputFiles.buildInfo.bundle) {
                node.oldFileOfCurrentEmit = textOrInputFiles.oldFileOfCurrentEmit;
                Debug.assert(mapTextOrStripInternal === undefined || typeof mapTextOrStripInternal === "boolean");
                stripInternal = mapTextOrStripInternal as boolean | undefined;
                bundleFileInfo = mapPathOrType === "js" ? textOrInputFiles.buildInfo.bundle.js : textOrInputFiles.buildInfo.bundle.dts;
                if (node.oldFileOfCurrentEmit) {
                    parseOldFileOfCurrentEmit(node, Debug.assertDefined(bundleFileInfo));
                    return node;
                }
            }
        }
        else {
            node.fileName = "";
            node.text = textOrInputFiles;
            node.sourceMapPath = mapPathOrType;
            node.sourceMapText = mapTextOrStripInternal as string;
        }
        Debug.assert(!node.oldFileOfCurrentEmit);
        parseUnparsedSourceFile(node, bundleFileInfo, stripInternal);
        return node;
    }

    function parseUnparsedSourceFile(node: UnparsedSource, bundleFileInfo: BundleFileInfo | undefined, stripInternal: boolean | undefined) {
        let prologues: UnparsedPrologue[] | undefined;
        let helpers: UnscopedEmitHelper[] | undefined;
        let referencedFiles: FileReference[] | undefined;
        let typeReferenceDirectives: string[] | undefined;
        let libReferenceDirectives: FileReference[] | undefined;
        let texts: UnparsedSourceText[] | undefined;

        for (const section of bundleFileInfo ? bundleFileInfo.sections : emptyArray) {
            switch (section.kind) {
                case BundleFileSectionKind.Prologue:
                    (prologues || (prologues = [])).push(createUnparsedNode(section, node) as UnparsedPrologue);
                    break;
                case BundleFileSectionKind.EmitHelpers:
                    (helpers || (helpers = [])).push(getAllUnscopedEmitHelpers().get(section.data)!);
                    break;
                case BundleFileSectionKind.NoDefaultLib:
                    node.hasNoDefaultLib = true;
                    break;
                case BundleFileSectionKind.Reference:
                    (referencedFiles || (referencedFiles = [])).push({ pos: -1, end: -1, fileName: section.data });
                    break;
                case BundleFileSectionKind.Type:
                    (typeReferenceDirectives || (typeReferenceDirectives = [])).push(section.data);
                    break;
                case BundleFileSectionKind.Lib:
                    (libReferenceDirectives || (libReferenceDirectives = [])).push({ pos: -1, end: -1, fileName: section.data });
                    break;
                case BundleFileSectionKind.Prepend:
                    const prependNode = createUnparsedNode(section, node) as UnparsedPrepend;
                    let prependTexts: UnparsedTextLike[] | undefined;
                    for (const text of section.texts) {
                        if (!stripInternal || text.kind !== BundleFileSectionKind.Internal) {
                            (prependTexts || (prependTexts = [])).push(createUnparsedNode(text, node) as UnparsedTextLike);
                        }
                    }
                    prependNode.texts = prependTexts || emptyArray;
                    (texts || (texts = [])).push(prependNode);
                    break;
                case BundleFileSectionKind.Internal:
                    if (stripInternal) {
                        if (!texts) texts = [];
                        break;
                    }
                    // falls through

                case BundleFileSectionKind.Text:
                    (texts || (texts = [])).push(createUnparsedNode(section, node) as UnparsedTextLike);
                    break;
                default:
                    Debug.assertNever(section);
            }
        }

        node.prologues = prologues || emptyArray;
        node.helpers = helpers;
        node.referencedFiles = referencedFiles || emptyArray;
        node.typeReferenceDirectives = typeReferenceDirectives;
        node.libReferenceDirectives = libReferenceDirectives || emptyArray;
        node.texts = texts || [<UnparsedTextLike>createUnparsedNode({ kind: BundleFileSectionKind.Text, pos: 0, end: node.text.length }, node)];
    }

    function parseOldFileOfCurrentEmit(node: UnparsedSource, bundleFileInfo: BundleFileInfo) {
        Debug.assert(!!node.oldFileOfCurrentEmit);
        let texts: UnparsedTextLike[] | undefined;
        let syntheticReferences: UnparsedSyntheticReference[] | undefined;
        for (const section of bundleFileInfo.sections) {
            switch (section.kind) {
                case BundleFileSectionKind.Internal:
                case BundleFileSectionKind.Text:
                    (texts || (texts = [])).push(createUnparsedNode(section, node) as UnparsedTextLike);
                    break;

                case BundleFileSectionKind.NoDefaultLib:
                case BundleFileSectionKind.Reference:
                case BundleFileSectionKind.Type:
                case BundleFileSectionKind.Lib:
                    (syntheticReferences || (syntheticReferences = [])).push(createUnparsedSyntheticReference(section, node));
                    break;

                // Ignore
                case BundleFileSectionKind.Prologue:
                case BundleFileSectionKind.EmitHelpers:
                case BundleFileSectionKind.Prepend:
                    break;

                default:
                    Debug.assertNever(section);
            }
        }
        node.texts = texts || emptyArray;
        node.helpers = map(bundleFileInfo.sources && bundleFileInfo.sources.helpers, name => getAllUnscopedEmitHelpers().get(name)!);
        node.syntheticReferences = syntheticReferences;
        return node;
    }

    function mapBundleFileSectionKindToSyntaxKind(kind: BundleFileSectionKind): SyntaxKind {
        switch (kind) {
            case BundleFileSectionKind.Prologue: return SyntaxKind.UnparsedPrologue;
            case BundleFileSectionKind.Prepend: return SyntaxKind.UnparsedPrepend;
            case BundleFileSectionKind.Internal: return SyntaxKind.UnparsedInternalText;
            case BundleFileSectionKind.Text: return SyntaxKind.UnparsedText;

            case BundleFileSectionKind.EmitHelpers:
            case BundleFileSectionKind.NoDefaultLib:
            case BundleFileSectionKind.Reference:
            case BundleFileSectionKind.Type:
            case BundleFileSectionKind.Lib:
                return Debug.fail(`BundleFileSectionKind: ${kind} not yet mapped to SyntaxKind`);

            default:
                return Debug.assertNever(kind);
        }
    }

    function createUnparsedNode(section: BundleFileSection, parent: UnparsedSource): UnparsedNode {
        const node = createNode(mapBundleFileSectionKindToSyntaxKind(section.kind), section.pos, section.end) as UnparsedNode;
        node.parent = parent;
        node.data = section.data;
        return node;
    }

    function createUnparsedSyntheticReference(section: BundleFileHasNoDefaultLib | BundleFileReference, parent: UnparsedSource) {
        const node = createNode(SyntaxKind.UnparsedSyntheticReference, section.pos, section.end) as UnparsedSyntheticReference;
        node.parent = parent;
        node.data = section.data;
        node.section = section;
        return node;
    }

    export function createInputFiles(
        javascriptText: string,
        declarationText: string
    ): InputFiles;
    export function createInputFiles(
        readFileText: (path: string) => string | undefined,
        javascriptPath: string,
        javascriptMapPath: string | undefined,
        declarationPath: string,
        declarationMapPath: string | undefined,
        buildInfoPath: string | undefined
    ): InputFiles;
    export function createInputFiles(
        javascriptText: string,
        declarationText: string,
        javascriptMapPath: string | undefined,
        javascriptMapText: string | undefined,
        declarationMapPath: string | undefined,
        declarationMapText: string | undefined
    ): InputFiles;
    /*@internal*/
    export function createInputFiles(
        javascriptText: string,
        declarationText: string,
        javascriptMapPath: string | undefined,
        javascriptMapText: string | undefined,
        declarationMapPath: string | undefined,
        declarationMapText: string | undefined,
        javascriptPath: string | undefined,
        declarationPath: string | undefined,
        buildInfoPath?: string | undefined,
        buildInfo?: BuildInfo,
        oldFileOfCurrentEmit?: boolean
    ): InputFiles;
    export function createInputFiles(
        javascriptTextOrReadFileText: string | ((path: string) => string | undefined),
        declarationTextOrJavascriptPath: string,
        javascriptMapPath?: string,
        javascriptMapTextOrDeclarationPath?: string,
        declarationMapPath?: string,
        declarationMapTextOrBuildInfoPath?: string,
        javascriptPath?: string | undefined,
        declarationPath?: string | undefined,
        buildInfoPath?: string | undefined,
        buildInfo?: BuildInfo,
        oldFileOfCurrentEmit?: boolean
    ): InputFiles {
        const node = <InputFiles>createNode(SyntaxKind.InputFiles);
        if (!isString(javascriptTextOrReadFileText)) {
            const cache = createMap<string | false>();
            const textGetter = (path: string | undefined) => {
                if (path === undefined) return undefined;
                let value = cache.get(path);
                if (value === undefined) {
                    value = javascriptTextOrReadFileText(path);
                    cache.set(path, value !== undefined ? value : false);
                }
                return value !== false ? value as string : undefined;
            };
            const definedTextGetter = (path: string) => {
                const result = textGetter(path);
                return result !== undefined ? result : `/* Input file ${path} was missing */\r\n`;
            };
            let buildInfo: BuildInfo | false;
            const getAndCacheBuildInfo = (getText: () => string | undefined) => {
                if (buildInfo === undefined) {
                    const result = getText();
                    buildInfo = result !== undefined ? getBuildInfo(result) : false;
                }
                return buildInfo || undefined;
            };
            node.javascriptPath = declarationTextOrJavascriptPath;
            node.javascriptMapPath = javascriptMapPath;
            node.declarationPath = Debug.assertDefined(javascriptMapTextOrDeclarationPath);
            node.declarationMapPath = declarationMapPath;
            node.buildInfoPath = declarationMapTextOrBuildInfoPath;
            Object.defineProperties(node, {
                javascriptText: { get() { return definedTextGetter(declarationTextOrJavascriptPath); } },
                javascriptMapText: { get() { return textGetter(javascriptMapPath); } }, // TODO:: if there is inline sourceMap in jsFile, use that
                declarationText: { get() { return definedTextGetter(Debug.assertDefined(javascriptMapTextOrDeclarationPath)); } },
                declarationMapText: { get() { return textGetter(declarationMapPath); } }, // TODO:: if there is inline sourceMap in dtsFile, use that
                buildInfo: { get() { return getAndCacheBuildInfo(() => textGetter(declarationMapTextOrBuildInfoPath)); } }
            });
        }
        else {
            node.javascriptText = javascriptTextOrReadFileText;
            node.javascriptMapPath = javascriptMapPath;
            node.javascriptMapText = javascriptMapTextOrDeclarationPath;
            node.declarationText = declarationTextOrJavascriptPath;
            node.declarationMapPath = declarationMapPath;
            node.declarationMapText = declarationMapTextOrBuildInfoPath;
            node.javascriptPath = javascriptPath;
            node.declarationPath = declarationPath;
            node.buildInfoPath = buildInfoPath;
            node.buildInfo = buildInfo;
            node.oldFileOfCurrentEmit = oldFileOfCurrentEmit;
        }
        return node;
    }

    export function updateBundle(node: Bundle, sourceFiles: readonly SourceFile[], prepends: readonly (UnparsedSource | InputFiles)[] = emptyArray) {
        if (node.sourceFiles !== sourceFiles || node.prepends !== prepends) {
            return createBundle(sourceFiles, prepends);
        }
        return node;
    }

    // Compound nodes

    export function createImmediatelyInvokedFunctionExpression(statements: readonly Statement[]): CallExpression;
    export function createImmediatelyInvokedFunctionExpression(statements: readonly Statement[], param: ParameterDeclaration, paramValue: Expression): CallExpression;
    export function createImmediatelyInvokedFunctionExpression(statements: readonly Statement[], param?: ParameterDeclaration, paramValue?: Expression) {
        return createCall(
            createFunctionExpression(
                /*modifiers*/ undefined,
                /*asteriskToken*/ undefined,
                /*name*/ undefined,
                /*typeParameters*/ undefined,
                /*parameters*/ param ? [param] : [],
                /*type*/ undefined,
                createBlock(statements, /*multiLine*/ true)
            ),
            /*typeArguments*/ undefined,
            /*argumentsArray*/ paramValue ? [paramValue] : []
        );
    }

    export function createImmediatelyInvokedArrowFunction(statements: readonly Statement[]): CallExpression;
    export function createImmediatelyInvokedArrowFunction(statements: readonly Statement[], param: ParameterDeclaration, paramValue: Expression): CallExpression;
    export function createImmediatelyInvokedArrowFunction(statements: readonly Statement[], param?: ParameterDeclaration, paramValue?: Expression) {
        return createCall(
            createArrowFunction(
                /*modifiers*/ undefined,
                /*typeParameters*/ undefined,
                /*parameters*/ param ? [param] : [],
                /*type*/ undefined,
                /*equalsGreaterThanToken*/ undefined,
                createBlock(statements, /*multiLine*/ true)
            ),
            /*typeArguments*/ undefined,
            /*argumentsArray*/ paramValue ? [paramValue] : []
        );
    }


    export function createComma(left: Expression, right: Expression) {
        return <Expression>createBinary(left, SyntaxKind.CommaToken, right);
    }

    export function createLessThan(left: Expression, right: Expression) {
        return <Expression>createBinary(left, SyntaxKind.LessThanToken, right);
    }

    export function createAssignment(left: ObjectLiteralExpression | ArrayLiteralExpression, right: Expression): DestructuringAssignment;
    export function createAssignment(left: Expression, right: Expression): BinaryExpression;
    export function createAssignment(left: Expression, right: Expression) {
        return createBinary(left, SyntaxKind.EqualsToken, right);
    }

    export function createStrictEquality(left: Expression, right: Expression) {
        return createBinary(left, SyntaxKind.EqualsEqualsEqualsToken, right);
    }

    export function createStrictInequality(left: Expression, right: Expression) {
        return createBinary(left, SyntaxKind.ExclamationEqualsEqualsToken, right);
    }

    export function createAdd(left: Expression, right: Expression) {
        return createBinary(left, SyntaxKind.PlusToken, right);
    }

    export function createSubtract(left: Expression, right: Expression) {
        return createBinary(left, SyntaxKind.MinusToken, right);
    }

    export function createPostfixIncrement(operand: Expression) {
        return createPostfix(operand, SyntaxKind.PlusPlusToken);
    }

    export function createLogicalAnd(left: Expression, right: Expression) {
        return createBinary(left, SyntaxKind.AmpersandAmpersandToken, right);
    }

    export function createLogicalOr(left: Expression, right: Expression) {
        return createBinary(left, SyntaxKind.BarBarToken, right);
    }

    export function createNullishCoalesce(left: Expression, right: Expression) {
        return createBinary(left, SyntaxKind.QuestionQuestionToken, right);
    }

    export function createLogicalNot(operand: Expression) {
        return createPrefix(SyntaxKind.ExclamationToken, operand);
    }

    export function createVoidZero() {
        return createVoid(createLiteral(0));
    }

    export function createExportDefault(expression: Expression) {
        return createExportAssignment(/*decorators*/ undefined, /*modifiers*/ undefined, /*isExportEquals*/ false, expression);
    }

    export function createExternalModuleExport(exportName: Identifier) {
        return createExportDeclaration(/*decorators*/ undefined, /*modifiers*/ undefined, createNamedExports([createExportSpecifier(/*propertyName*/ undefined, exportName)]));
    }

    // Utilities

    function asName<T extends Identifier | BindingName | PropertyName | EntityName | ThisTypeNode | undefined>(name: string | T): T | Identifier {
        return isString(name) ? createIdentifier(name) : name;
    }

    function asExpression<T extends Expression | undefined>(value: string | number | boolean | T): T | StringLiteral | NumericLiteral | BooleanLiteral {
        return typeof value === "string" ? createStringLiteral(value) :
            typeof value === "number" ? createNumericLiteral(""+value) :
            typeof value === "boolean" ? value ? createTrue() : createFalse() :
        value;
    }

    function asNodeArray<T extends Node>(array: readonly T[]): NodeArray<T>;
    function asNodeArray<T extends Node>(array: readonly T[] | undefined): NodeArray<T> | undefined;
    function asNodeArray<T extends Node>(array: readonly T[] | undefined): NodeArray<T> | undefined {
        return array ? createNodeArray(array) : undefined;
    }

    function asToken<TKind extends SyntaxKind>(value: TKind | Token<TKind>): Token<TKind> {
        return typeof value === "number" ? createToken(value) : value;
    }

    function asEmbeddedStatement<T extends Node>(statement: T): T | EmptyStatement;
    function asEmbeddedStatement<T extends Node>(statement: T | undefined): T | EmptyStatement | undefined;
    function asEmbeddedStatement<T extends Node>(statement: T | undefined): T | EmptyStatement | undefined {
        return statement && isNotEmittedStatement(statement) ? setTextRange(setOriginalNode(createEmptyStatement(), statement), statement) : statement;
    }

    /**
     * Clears any EmitNode entries from parse-tree nodes.
     * @param sourceFile A source file.
     */
    export function disposeEmitNodes(sourceFile: SourceFile) {
        // During transformation we may need to annotate a parse tree node with transient
        // transformation properties. As parse tree nodes live longer than transformation
        // nodes, we need to make sure we reclaim any memory allocated for custom ranges
        // from these nodes to ensure we do not hold onto entire subtrees just for position
        // information. We also need to reset these nodes to a pre-transformation state
        // for incremental parsing scenarios so that we do not impact later emit.
        sourceFile = getSourceFileOfNode(getParseTreeNode(sourceFile));
        const emitNode = sourceFile && sourceFile.emitNode;
        const annotatedNodes = emitNode && emitNode.annotatedNodes;
        if (annotatedNodes) {
            for (const node of annotatedNodes) {
                node.emitNode = undefined;
            }
        }
    }

    /**
     * Associates a node with the current transformation, initializing
     * various transient transformation properties.
     */
    /* @internal */
    export function getOrCreateEmitNode(node: Node): EmitNode {
        if (!node.emitNode) {
            if (isParseTreeNode(node)) {
                // To avoid holding onto transformation artifacts, we keep track of any
                // parse tree node we are annotating. This allows us to clean them up after
                // all transformations have completed.
                if (node.kind === SyntaxKind.SourceFile) {
                    return node.emitNode = { annotatedNodes: [node] } as EmitNode;
                }

                const sourceFile = getSourceFileOfNode(getParseTreeNode(getSourceFileOfNode(node)));
                getOrCreateEmitNode(sourceFile).annotatedNodes!.push(node);
            }

            node.emitNode = {} as EmitNode;
        }

        return node.emitNode;
    }

    /**
     * Sets `EmitFlags.NoComments` on a node and removes any leading and trailing synthetic comments.
     * @internal
     */
    export function removeAllComments<T extends Node>(node: T): T {
        const emitNode = getOrCreateEmitNode(node);
        emitNode.flags |= EmitFlags.NoComments;
        emitNode.leadingComments = undefined;
        emitNode.trailingComments = undefined;
        return node;
    }

    export function setTextRange<T extends TextRange>(range: T, location: TextRange | undefined): T {
        if (location) {
            range.pos = location.pos;
            range.end = location.end;
        }
        return range;
    }

    /**
     * Sets flags that control emit behavior of a node.
     */
    export function setEmitFlags<T extends Node>(node: T, emitFlags: EmitFlags) {
        getOrCreateEmitNode(node).flags = emitFlags;
        return node;
    }

    /**
     * Sets flags that control emit behavior of a node.
     */
    /* @internal */
    export function addEmitFlags<T extends Node>(node: T, emitFlags: EmitFlags) {
        const emitNode = getOrCreateEmitNode(node);
        emitNode.flags = emitNode.flags | emitFlags;
        return node;
    }

    /**
     * Gets a custom text range to use when emitting source maps.
     */
    export function getSourceMapRange(node: Node): SourceMapRange {
        const emitNode = node.emitNode;
        return (emitNode && emitNode.sourceMapRange) || node;
    }

    /**
     * Sets a custom text range to use when emitting source maps.
     */
    export function setSourceMapRange<T extends Node>(node: T, range: SourceMapRange | undefined) {
        getOrCreateEmitNode(node).sourceMapRange = range;
        return node;
    }

    let SourceMapSource: new (fileName: string, text: string, skipTrivia?: (pos: number) => number) => SourceMapSource;

    /**
     * Create an external source map source file reference
     */
    export function createSourceMapSource(fileName: string, text: string, skipTrivia?: (pos: number) => number): SourceMapSource {
        return new (SourceMapSource || (SourceMapSource = objectAllocator.getSourceMapSourceConstructor()))(fileName, text, skipTrivia);
    }

    /**
     * Gets the TextRange to use for source maps for a token of a node.
     */
    export function getTokenSourceMapRange(node: Node, token: SyntaxKind): SourceMapRange | undefined {
        const emitNode = node.emitNode;
        const tokenSourceMapRanges = emitNode && emitNode.tokenSourceMapRanges;
        return tokenSourceMapRanges && tokenSourceMapRanges[token];
    }

    /**
     * Sets the TextRange to use for source maps for a token of a node.
     */
    export function setTokenSourceMapRange<T extends Node>(node: T, token: SyntaxKind, range: SourceMapRange | undefined) {
        const emitNode = getOrCreateEmitNode(node);
        const tokenSourceMapRanges = emitNode.tokenSourceMapRanges || (emitNode.tokenSourceMapRanges = []);
        tokenSourceMapRanges[token] = range;
        return node;
    }

    /**
     * Gets a custom text range to use when emitting comments.
     */
    /*@internal*/
    export function getStartsOnNewLine(node: Node) {
        const emitNode = node.emitNode;
        return emitNode && emitNode.startsOnNewLine;
    }

    /**
     * Sets a custom text range to use when emitting comments.
     */
    /*@internal*/
    export function setStartsOnNewLine<T extends Node>(node: T, newLine: boolean) {
        getOrCreateEmitNode(node).startsOnNewLine = newLine;
        return node;
    }

    /**
     * Gets a custom text range to use when emitting comments.
     */
    export function getCommentRange(node: Node) {
        const emitNode = node.emitNode;
        return (emitNode && emitNode.commentRange) || node;
    }

    /**
     * Sets a custom text range to use when emitting comments.
     */
    export function setCommentRange<T extends Node>(node: T, range: TextRange) {
        getOrCreateEmitNode(node).commentRange = range;
        return node;
    }

    export function getSyntheticLeadingComments(node: Node): SynthesizedComment[] | undefined {
        const emitNode = node.emitNode;
        return emitNode && emitNode.leadingComments;
    }

    export function setSyntheticLeadingComments<T extends Node>(node: T, comments: SynthesizedComment[] | undefined) {
        getOrCreateEmitNode(node).leadingComments = comments;
        return node;
    }

    export function addSyntheticLeadingComment<T extends Node>(node: T, kind: SyntaxKind.SingleLineCommentTrivia | SyntaxKind.MultiLineCommentTrivia, text: string, hasTrailingNewLine?: boolean) {
        return setSyntheticLeadingComments(node, append<SynthesizedComment>(getSyntheticLeadingComments(node), { kind, pos: -1, end: -1, hasTrailingNewLine, text }));
    }

    export function getSyntheticTrailingComments(node: Node): SynthesizedComment[] | undefined {
        const emitNode = node.emitNode;
        return emitNode && emitNode.trailingComments;
    }

    export function setSyntheticTrailingComments<T extends Node>(node: T, comments: SynthesizedComment[] | undefined) {
        getOrCreateEmitNode(node).trailingComments = comments;
        return node;
    }

    export function addSyntheticTrailingComment<T extends Node>(node: T, kind: SyntaxKind.SingleLineCommentTrivia | SyntaxKind.MultiLineCommentTrivia, text: string, hasTrailingNewLine?: boolean) {
        return setSyntheticTrailingComments(node, append<SynthesizedComment>(getSyntheticTrailingComments(node), { kind, pos: -1, end: -1, hasTrailingNewLine, text }));
    }

    export function moveSyntheticComments<T extends Node>(node: T, original: Node): T {
        setSyntheticLeadingComments(node, getSyntheticLeadingComments(original));
        setSyntheticTrailingComments(node, getSyntheticTrailingComments(original));
        const emit = getOrCreateEmitNode(original);
        emit.leadingComments = undefined;
        emit.trailingComments = undefined;
        return node;
    }

    /**
     * Gets the constant value to emit for an expression.
     */
    export function getConstantValue(node: PropertyAccessExpression | ElementAccessExpression): string | number | undefined {
        const emitNode = node.emitNode;
        return emitNode && emitNode.constantValue;
    }

    /**
     * Sets the constant value to emit for an expression.
     */
    export function setConstantValue(node: PropertyAccessExpression | ElementAccessExpression, value: string | number) {
        const emitNode = getOrCreateEmitNode(node);
        emitNode.constantValue = value;
        return node;
    }

    /**
     * Adds an EmitHelper to a node.
     */
    export function addEmitHelper<T extends Node>(node: T, helper: EmitHelper): T {
        const emitNode = getOrCreateEmitNode(node);
        emitNode.helpers = append(emitNode.helpers, helper);
        return node;
    }

    /**
     * Add EmitHelpers to a node.
     */
    export function addEmitHelpers<T extends Node>(node: T, helpers: EmitHelper[] | undefined): T {
        if (some(helpers)) {
            const emitNode = getOrCreateEmitNode(node);
            for (const helper of helpers) {
                emitNode.helpers = appendIfUnique(emitNode.helpers, helper);
            }
        }
        return node;
    }

    /**
     * Removes an EmitHelper from a node.
     */
    export function removeEmitHelper(node: Node, helper: EmitHelper): boolean {
        const emitNode = node.emitNode;
        if (emitNode) {
            const helpers = emitNode.helpers;
            if (helpers) {
                return orderedRemoveItem(helpers, helper);
            }
        }
        return false;
    }

    /**
     * Gets the EmitHelpers of a node.
     */
    export function getEmitHelpers(node: Node): EmitHelper[] | undefined {
        const emitNode = node.emitNode;
        return emitNode && emitNode.helpers;
    }

    /**
     * Moves matching emit helpers from a source node to a target node.
     */
    export function moveEmitHelpers(source: Node, target: Node, predicate: (helper: EmitHelper) => boolean) {
        const sourceEmitNode = source.emitNode;
        const sourceEmitHelpers = sourceEmitNode && sourceEmitNode.helpers;
        if (!some(sourceEmitHelpers)) return;

        const targetEmitNode = getOrCreateEmitNode(target);
        let helpersRemoved = 0;
        for (let i = 0; i < sourceEmitHelpers.length; i++) {
            const helper = sourceEmitHelpers[i];
            if (predicate(helper)) {
                helpersRemoved++;
                targetEmitNode.helpers = appendIfUnique(targetEmitNode.helpers, helper);
            }
            else if (helpersRemoved > 0) {
                sourceEmitHelpers[i - helpersRemoved] = helper;
            }
        }

        if (helpersRemoved > 0) {
            sourceEmitHelpers.length -= helpersRemoved;
        }
    }

    /* @internal */
    export function compareEmitHelpers(x: EmitHelper, y: EmitHelper) {
        if (x === y) return Comparison.EqualTo;
        if (x.priority === y.priority) return Comparison.EqualTo;
        if (x.priority === undefined) return Comparison.GreaterThan;
        if (y.priority === undefined) return Comparison.LessThan;
        return compareValues(x.priority, y.priority);
    }

    export function setOriginalNode<T extends Node>(node: T, original: Node | undefined): T {
        node.original = original;
        if (original) {
            const emitNode = original.emitNode;
            if (emitNode) node.emitNode = mergeEmitNode(emitNode, node.emitNode);
        }
        return node;
    }

    function mergeEmitNode(sourceEmitNode: EmitNode, destEmitNode: EmitNode | undefined) {
        const {
            flags,
            leadingComments,
            trailingComments,
            commentRange,
            sourceMapRange,
            tokenSourceMapRanges,
            constantValue,
            helpers,
            startsOnNewLine,
        } = sourceEmitNode;
        if (!destEmitNode) destEmitNode = {} as EmitNode;
        // We are using `.slice()` here in case `destEmitNode.leadingComments` is pushed to later.
        if (leadingComments) destEmitNode.leadingComments = addRange(leadingComments.slice(), destEmitNode.leadingComments);
        if (trailingComments) destEmitNode.trailingComments = addRange(trailingComments.slice(), destEmitNode.trailingComments);
        if (flags) destEmitNode.flags = flags;
        if (commentRange) destEmitNode.commentRange = commentRange;
        if (sourceMapRange) destEmitNode.sourceMapRange = sourceMapRange;
        if (tokenSourceMapRanges) destEmitNode.tokenSourceMapRanges = mergeTokenSourceMapRanges(tokenSourceMapRanges, destEmitNode.tokenSourceMapRanges!);
        if (constantValue !== undefined) destEmitNode.constantValue = constantValue;
        if (helpers) destEmitNode.helpers = addRange(destEmitNode.helpers, helpers);
        if (startsOnNewLine !== undefined) destEmitNode.startsOnNewLine = startsOnNewLine;
        return destEmitNode;
    }

    function mergeTokenSourceMapRanges(sourceRanges: (TextRange | undefined)[], destRanges: (TextRange | undefined)[]) {
        if (!destRanges) destRanges = [];
        for (const key in sourceRanges) {
            destRanges[key] = sourceRanges[key];
        }
        return destRanges;
    }
}

/* @internal */
namespace ts {
    export const nullTransformationContext: TransformationContext = {
        enableEmitNotification: noop,
        enableSubstitution: noop,
        endLexicalEnvironment: returnUndefined,
        getCompilerOptions: notImplemented,
        getEmitHost: notImplemented,
        getEmitResolver: notImplemented,
        hoistFunctionDeclaration: noop,
        hoistVariableDeclaration: noop,
        isEmitNotificationEnabled: notImplemented,
        isSubstitutionEnabled: notImplemented,
        onEmitNode: noop,
        onSubstituteNode: notImplemented,
        readEmitHelpers: notImplemented,
        requestEmitHelper: noop,
        resumeLexicalEnvironment: noop,
        startLexicalEnvironment: noop,
        suspendLexicalEnvironment: noop,
        addDiagnostic: noop,
    };

    // Compound nodes

    export type TypeOfTag = "undefined" | "number" | "boolean" | "string" | "symbol" | "object" | "function";

    export function createTypeCheck(value: Expression, tag: TypeOfTag) {
        return tag === "undefined"
            ? createStrictEquality(value, createVoidZero())
            : createStrictEquality(createTypeOf(value), createLiteral(tag));
    }

    export function createMemberAccessForPropertyName(target: Expression, memberName: PropertyName, location?: TextRange): MemberExpression {
        if (isComputedPropertyName(memberName)) {
            return setTextRange(createElementAccess(target, memberName.expression), location);
        }
        else {
            const expression = setTextRange(
                isIdentifier(memberName)
                    ? createPropertyAccess(target, memberName)
                    : createElementAccess(target, memberName),
                memberName
            );
            getOrCreateEmitNode(expression).flags |= EmitFlags.NoNestedSourceMaps;
            return expression;
        }
    }

    export function createFunctionCall(func: Expression, thisArg: Expression, argumentsList: readonly Expression[], location?: TextRange) {
        return setTextRange(
            createCall(
                createPropertyAccess(func, "call"),
                /*typeArguments*/ undefined,
                [
                    thisArg,
                    ...argumentsList
                ]),
            location
        );
    }

    export function createFunctionApply(func: Expression, thisArg: Expression, argumentsExpression: Expression, location?: TextRange) {
        return setTextRange(
            createCall(
                createPropertyAccess(func, "apply"),
                /*typeArguments*/ undefined,
                [
                    thisArg,
                    argumentsExpression
                ]
            ),
            location
        );
    }

    export function createArraySlice(array: Expression, start?: number | Expression) {
        const argumentsList: Expression[] = [];
        if (start !== undefined) {
            argumentsList.push(typeof start === "number" ? createLiteral(start) : start);
        }

        return createCall(createPropertyAccess(array, "slice"), /*typeArguments*/ undefined, argumentsList);
    }

    export function createArrayConcat(array: Expression, values: readonly Expression[]) {
        return createCall(
            createPropertyAccess(array, "concat"),
            /*typeArguments*/ undefined,
            values
        );
    }

    export function createMathPow(left: Expression, right: Expression, location?: TextRange) {
        return setTextRange(
            createCall(
                createPropertyAccess(createIdentifier("Math"), "pow"),
                /*typeArguments*/ undefined,
                [left, right]
            ),
            location
        );
    }

    function createReactNamespace(reactNamespace: string, parent: JsxOpeningLikeElement | JsxOpeningFragment) {
        // To ensure the emit resolver can properly resolve the namespace, we need to
        // treat this identifier as if it were a source tree node by clearing the `Synthesized`
        // flag and setting a parent node.
        const react = createIdentifier(reactNamespace || "React");
        react.flags &= ~NodeFlags.Synthesized;
        // Set the parent that is in parse tree
        // this makes sure that parent chain is intact for checker to traverse complete scope tree
        react.parent = getParseTreeNode(parent);
        return react;
    }

    function createJsxFactoryExpressionFromEntityName(jsxFactory: EntityName, parent: JsxOpeningLikeElement | JsxOpeningFragment): Expression {
        if (isQualifiedName(jsxFactory)) {
            const left = createJsxFactoryExpressionFromEntityName(jsxFactory.left, parent);
            const right = createIdentifier(idText(jsxFactory.right));
            right.escapedText = jsxFactory.right.escapedText;
            return createPropertyAccess(left, right);
        }
        else {
            return createReactNamespace(idText(jsxFactory), parent);
        }
    }

    function createJsxFactoryExpression(jsxFactoryEntity: EntityName | undefined, reactNamespace: string, parent: JsxOpeningLikeElement | JsxOpeningFragment): Expression {
        return jsxFactoryEntity ?
            createJsxFactoryExpressionFromEntityName(jsxFactoryEntity, parent) :
            createPropertyAccess(
                createReactNamespace(reactNamespace, parent),
                "createElement"
            );
    }

    export function createExpressionForJsxElement(jsxFactoryEntity: EntityName | undefined, reactNamespace: string, tagName: Expression, props: Expression, children: readonly Expression[], parentElement: JsxOpeningLikeElement, location: TextRange): LeftHandSideExpression {
        const argumentsList = [tagName];
        if (props) {
            argumentsList.push(props);
        }

        if (children && children.length > 0) {
            if (!props) {
                argumentsList.push(createNull());
            }

            if (children.length > 1) {
                for (const child of children) {
                    startOnNewLine(child);
                    argumentsList.push(child);
                }
            }
            else {
                argumentsList.push(children[0]);
            }
        }

        return setTextRange(
            createCall(
                createJsxFactoryExpression(jsxFactoryEntity, reactNamespace, parentElement),
                /*typeArguments*/ undefined,
                argumentsList
            ),
            location
        );
    }

    export function createExpressionForJsxFragment(jsxFactoryEntity: EntityName | undefined, reactNamespace: string, children: readonly Expression[], parentElement: JsxOpeningFragment, location: TextRange): LeftHandSideExpression {
        const tagName = createPropertyAccess(
            createReactNamespace(reactNamespace, parentElement),
            "Fragment"
        );

        const argumentsList = [<Expression>tagName];
        argumentsList.push(createNull());

        if (children && children.length > 0) {
            if (children.length > 1) {
                for (const child of children) {
                    startOnNewLine(child);
                    argumentsList.push(child);
                }
            }
            else {
                argumentsList.push(children[0]);
            }
        }

        return setTextRange(
            createCall(
                createJsxFactoryExpression(jsxFactoryEntity, reactNamespace, parentElement),
                /*typeArguments*/ undefined,
                argumentsList
            ),
            location
        );
    }

    // Helpers

    /**
     * Gets an identifier for the name of an *unscoped* emit helper.
     */
    export function getUnscopedHelperName(name: string) {
        return setEmitFlags(createIdentifier(name), EmitFlags.HelperName | EmitFlags.AdviseOnEmitNode);
    }

    export const valuesHelper: UnscopedEmitHelper = {
        name: "typescript:values",
        importName: "__values",
        scoped: false,
        text: `
            var __values = (this && this.__values) || function(o) {
                var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
                if (m) return m.call(o);
                if (o && typeof o.length === "number") return {
                    next: function () {
                        if (o && i >= o.length) o = void 0;
                        return { value: o && o[i++], done: !o };
                    }
                };
                throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
            };`
    };

    export function createValuesHelper(context: TransformationContext, expression: Expression, location?: TextRange) {
        context.requestEmitHelper(valuesHelper);
        return setTextRange(
            createCall(
                getUnscopedHelperName("__values"),
                /*typeArguments*/ undefined,
                [expression]
            ),
            location
        );
    }

    export const readHelper: UnscopedEmitHelper = {
        name: "typescript:read",
        importName: "__read",
        scoped: false,
        text: `
            var __read = (this && this.__read) || function (o, n) {
                var m = typeof Symbol === "function" && o[Symbol.iterator];
                if (!m) return o;
                var i = m.call(o), r, ar = [], e;
                try {
                    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
                }
                catch (error) { e = { error: error }; }
                finally {
                    try {
                        if (r && !r.done && (m = i["return"])) m.call(i);
                    }
                    finally { if (e) throw e.error; }
                }
                return ar;
            };`
    };

    export function createReadHelper(context: TransformationContext, iteratorRecord: Expression, count: number | undefined, location?: TextRange) {
        context.requestEmitHelper(readHelper);
        return setTextRange(
            createCall(
                getUnscopedHelperName("__read"),
                /*typeArguments*/ undefined,
                count !== undefined
                    ? [iteratorRecord, createLiteral(count)]
                    : [iteratorRecord]
            ),
            location
        );
    }

    export const spreadHelper: UnscopedEmitHelper = {
        name: "typescript:spread",
        importName: "__spread",
        scoped: false,
        text: `
            var __spread = (this && this.__spread) || function () {
                for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
                return ar;
            };`
    };

    export function createSpreadHelper(context: TransformationContext, argumentList: readonly Expression[], location?: TextRange) {
        context.requestEmitHelper(readHelper);
        context.requestEmitHelper(spreadHelper);
        return setTextRange(
            createCall(
                getUnscopedHelperName("__spread"),
                /*typeArguments*/ undefined,
                argumentList
            ),
            location
        );
    }

    export const spreadArraysHelper: UnscopedEmitHelper = {
        name: "typescript:spreadArrays",
        importName: "__spreadArrays",
        scoped: false,
        text: `
            var __spreadArrays = (this && this.__spreadArrays) || function () {
                for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
                for (var r = Array(s), k = 0, i = 0; i < il; i++)
                    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                        r[k] = a[j];
                return r;
            };`
    };

    export function createSpreadArraysHelper(context: TransformationContext, argumentList: readonly Expression[], location?: TextRange) {
        context.requestEmitHelper(spreadArraysHelper);
        return setTextRange(
            createCall(
                getUnscopedHelperName("__spreadArrays"),
                /*typeArguments*/ undefined,
                argumentList
            ),
            location
        );
    }

    // Utilities

    export function createForOfBindingStatement(node: ForInitializer, boundValue: Expression): Statement {
        if (isVariableDeclarationList(node)) {
            const firstDeclaration = first(node.declarations);
            const updatedDeclaration = updateVariableDeclaration(
                firstDeclaration,
                firstDeclaration.name,
                /*typeNode*/ undefined,
                boundValue
            );
            return setTextRange(
                createVariableStatement(
                    /*modifiers*/ undefined,
                    updateVariableDeclarationList(node, [updatedDeclaration])
                ),
                /*location*/ node
            );
        }
        else {
            const updatedExpression = setTextRange(createAssignment(node, boundValue), /*location*/ node);
            return setTextRange(createStatement(updatedExpression), /*location*/ node);
        }
    }

    export function insertLeadingStatement(dest: Statement, source: Statement) {
        if (isBlock(dest)) {
            return updateBlock(dest, setTextRange(createNodeArray([source, ...dest.statements]), dest.statements));
        }
        else {
            return createBlock(createNodeArray([dest, source]), /*multiLine*/ true);
        }
    }

    export function restoreEnclosingLabel(node: Statement, outermostLabeledStatement: LabeledStatement | undefined, afterRestoreLabelCallback?: (node: LabeledStatement) => void): Statement {
        if (!outermostLabeledStatement) {
            return node;
        }
        const updated = updateLabel(
            outermostLabeledStatement,
            outermostLabeledStatement.label,
            outermostLabeledStatement.statement.kind === SyntaxKind.LabeledStatement
                ? restoreEnclosingLabel(node, <LabeledStatement>outermostLabeledStatement.statement)
                : node
        );
        if (afterRestoreLabelCallback) {
            afterRestoreLabelCallback(outermostLabeledStatement);
        }
        return updated;
    }

    export interface CallBinding {
        target: LeftHandSideExpression;
        thisArg: Expression;
    }

    function shouldBeCapturedInTempVariable(node: Expression, cacheIdentifiers: boolean): boolean {
        const target = skipParentheses(node);
        switch (target.kind) {
            case SyntaxKind.Identifier:
                return cacheIdentifiers;
            case SyntaxKind.ThisKeyword:
            case SyntaxKind.NumericLiteral:
            case SyntaxKind.BigIntLiteral:
            case SyntaxKind.StringLiteral:
                return false;
            case SyntaxKind.ArrayLiteralExpression:
                const elements = (<ArrayLiteralExpression>target).elements;
                if (elements.length === 0) {
                    return false;
                }
                return true;
            case SyntaxKind.ObjectLiteralExpression:
                return (<ObjectLiteralExpression>target).properties.length > 0;
            default:
                return true;
        }
    }

    export function createCallBinding(expression: Expression, recordTempVariable: (temp: Identifier) => void, languageVersion?: ScriptTarget, cacheIdentifiers = false): CallBinding {
        const callee = skipOuterExpressions(expression, OuterExpressionKinds.All);
        let thisArg: Expression;
        let target: LeftHandSideExpression;
        if (isSuperProperty(callee)) {
            thisArg = createThis();
            target = callee;
        }
        else if (callee.kind === SyntaxKind.SuperKeyword) {
            thisArg = createThis();
            target = languageVersion! < ScriptTarget.ES2015
                ? setTextRange(createIdentifier("_super"), callee)
                : <PrimaryExpression>callee;
        }
        else if (getEmitFlags(callee) & EmitFlags.HelperName) {
            thisArg = createVoidZero();
            target = parenthesizeForAccess(callee);
        }
        else {
            switch (callee.kind) {
                case SyntaxKind.PropertyAccessExpression: {
                    if (shouldBeCapturedInTempVariable((<PropertyAccessExpression>callee).expression, cacheIdentifiers)) {
                        // for `a.b()` target is `(_a = a).b` and thisArg is `_a`
                        thisArg = createTempVariable(recordTempVariable);
                        target = createPropertyAccess(
                            setTextRange(
                                createAssignment(
                                    thisArg,
                                    (<PropertyAccessExpression>callee).expression
                                ),
                                (<PropertyAccessExpression>callee).expression
                            ),
                            (<PropertyAccessExpression>callee).name
                        );
                        setTextRange(target, callee);
                    }
                    else {
                        thisArg = (<PropertyAccessExpression>callee).expression;
                        target = <PropertyAccessExpression>callee;
                    }
                    break;
                }

                case SyntaxKind.ElementAccessExpression: {
                    if (shouldBeCapturedInTempVariable((<ElementAccessExpression>callee).expression, cacheIdentifiers)) {
                        // for `a[b]()` target is `(_a = a)[b]` and thisArg is `_a`
                        thisArg = createTempVariable(recordTempVariable);
                        target = createElementAccess(
                            setTextRange(
                                createAssignment(
                                    thisArg,
                                    (<ElementAccessExpression>callee).expression
                                ),
                                (<ElementAccessExpression>callee).expression
                            ),
                            (<ElementAccessExpression>callee).argumentExpression
                        );
                        setTextRange(target, callee);
                    }
                    else {
                        thisArg = (<ElementAccessExpression>callee).expression;
                        target = <ElementAccessExpression>callee;
                    }

                    break;
                }

                default: {
                    // for `a()` target is `a` and thisArg is `void 0`
                    thisArg = createVoidZero();
                    target = parenthesizeForAccess(expression);
                    break;
                }
            }
        }

        return { target, thisArg };
    }

    export function inlineExpressions(expressions: readonly Expression[]) {
        // Avoid deeply nested comma expressions as traversing them during emit can result in "Maximum call
        // stack size exceeded" errors.
        return expressions.length > 10
            ? createCommaList(expressions)
            : reduceLeft(expressions, createComma)!;
    }

    export function createExpressionFromEntityName(node: EntityName | Expression): Expression {
        if (isQualifiedName(node)) {
            const left = createExpressionFromEntityName(node.left);
            const right = getMutableClone(node.right);
            return setTextRange(createPropertyAccess(left, right), node);
        }
        else {
            return getMutableClone(node);
        }
    }

    export function createExpressionForPropertyName(memberName: PropertyName): Expression {
        if (isIdentifier(memberName)) {
            return createLiteral(memberName);
        }
        else if (isComputedPropertyName(memberName)) {
            return getMutableClone(memberName.expression);
        }
        else {
            return getMutableClone(memberName);
        }
    }

    export function createExpressionForObjectLiteralElementLike(node: ObjectLiteralExpression, property: ObjectLiteralElementLike, receiver: Expression): Expression | undefined {
        switch (property.kind) {
            case SyntaxKind.GetAccessor:
            case SyntaxKind.SetAccessor:
                return createExpressionForAccessorDeclaration(node.properties, property, receiver, !!node.multiLine);
            case SyntaxKind.PropertyAssignment:
                return createExpressionForPropertyAssignment(property, receiver);
            case SyntaxKind.ShorthandPropertyAssignment:
                return createExpressionForShorthandPropertyAssignment(property, receiver);
            case SyntaxKind.MethodDeclaration:
                return createExpressionForMethodDeclaration(property, receiver);
        }
    }

    function createExpressionForAccessorDeclaration(properties: NodeArray<Declaration>, property: AccessorDeclaration, receiver: Expression, multiLine: boolean) {
        const { firstAccessor, getAccessor, setAccessor } = getAllAccessorDeclarations(properties, property);
        if (property === firstAccessor) {
            const properties: ObjectLiteralElementLike[] = [];
            if (getAccessor) {
                const getterFunction = createFunctionExpression(
                    getAccessor.modifiers,
                    /*asteriskToken*/ undefined,
                    /*name*/ undefined,
                    /*typeParameters*/ undefined,
                    getAccessor.parameters,
                    /*type*/ undefined,
                    getAccessor.body! // TODO: GH#18217
                );
                setTextRange(getterFunction, getAccessor);
                setOriginalNode(getterFunction, getAccessor);
                const getter = createPropertyAssignment("get", getterFunction);
                properties.push(getter);
            }

            if (setAccessor) {
                const setterFunction = createFunctionExpression(
                    setAccessor.modifiers,
                    /*asteriskToken*/ undefined,
                    /*name*/ undefined,
                    /*typeParameters*/ undefined,
                    setAccessor.parameters,
                    /*type*/ undefined,
                    setAccessor.body! // TODO: GH#18217
                );
                setTextRange(setterFunction, setAccessor);
                setOriginalNode(setterFunction, setAccessor);
                const setter = createPropertyAssignment("set", setterFunction);
                properties.push(setter);
            }

            properties.push(createPropertyAssignment("enumerable", createTrue()));
            properties.push(createPropertyAssignment("configurable", createTrue()));

            const expression = setTextRange(
                createCall(
                    createPropertyAccess(createIdentifier("Object"), "defineProperty"),
                    /*typeArguments*/ undefined,
                    [
                        receiver,
                        createExpressionForPropertyName(property.name),
                        createObjectLiteral(properties, multiLine)
                    ]
                ),
                /*location*/ firstAccessor
            );

            return aggregateTransformFlags(expression);
        }

        return undefined;
    }

    function createExpressionForPropertyAssignment(property: PropertyAssignment, receiver: Expression) {
        return aggregateTransformFlags(
            setOriginalNode(
                setTextRange(
                    createAssignment(
                        createMemberAccessForPropertyName(receiver, property.name, /*location*/ property.name),
                        property.initializer
                    ),
                    property
                ),
                property
            )
        );
    }

    function createExpressionForShorthandPropertyAssignment(property: ShorthandPropertyAssignment, receiver: Expression) {
        return aggregateTransformFlags(
            setOriginalNode(
                setTextRange(
                    createAssignment(
                        createMemberAccessForPropertyName(receiver, property.name, /*location*/ property.name),
                        getSynthesizedClone(property.name)
                    ),
                    /*location*/ property
                ),
                /*original*/ property
            )
        );
    }

    function createExpressionForMethodDeclaration(method: MethodDeclaration, receiver: Expression) {
        return aggregateTransformFlags(
            setOriginalNode(
                setTextRange(
                    createAssignment(
                        createMemberAccessForPropertyName(receiver, method.name, /*location*/ method.name),
                        setOriginalNode(
                            setTextRange(
                                createFunctionExpression(
                                    method.modifiers,
                                    method.asteriskToken,
                                    /*name*/ undefined,
                                    /*typeParameters*/ undefined,
                                    method.parameters,
                                    /*type*/ undefined,
                                    method.body! // TODO: GH#18217
                                ),
                                /*location*/ method
                            ),
                            /*original*/ method
                        )
                    ),
                    /*location*/ method
                ),
                /*original*/ method
            )
        );
    }

    /**
     * Gets the internal name of a declaration. This is primarily used for declarations that can be
     * referred to by name in the body of an ES5 class function body. An internal name will *never*
     * be prefixed with an module or namespace export modifier like "exports." when emitted as an
     * expression. An internal name will also *never* be renamed due to a collision with a block
     * scoped variable.
     *
     * @param node The declaration.
     * @param allowComments A value indicating whether comments may be emitted for the name.
     * @param allowSourceMaps A value indicating whether source maps may be emitted for the name.
     */
    export function getInternalName(node: Declaration, allowComments?: boolean, allowSourceMaps?: boolean) {
        return getName(node, allowComments, allowSourceMaps, EmitFlags.LocalName | EmitFlags.InternalName);
    }

    /**
     * Gets whether an identifier should only be referred to by its internal name.
     */
    export function isInternalName(node: Identifier) {
        return (getEmitFlags(node) & EmitFlags.InternalName) !== 0;
    }

    /**
     * Gets the local name of a declaration. This is primarily used for declarations that can be
     * referred to by name in the declaration's immediate scope (classes, enums, namespaces). A
     * local name will *never* be prefixed with an module or namespace export modifier like
     * "exports." when emitted as an expression.
     *
     * @param node The declaration.
     * @param allowComments A value indicating whether comments may be emitted for the name.
     * @param allowSourceMaps A value indicating whether source maps may be emitted for the name.
     */
    export function getLocalName(node: Declaration, allowComments?: boolean, allowSourceMaps?: boolean) {
        return getName(node, allowComments, allowSourceMaps, EmitFlags.LocalName);
    }

    /**
     * Gets whether an identifier should only be referred to by its local name.
     */
    export function isLocalName(node: Identifier) {
        return (getEmitFlags(node) & EmitFlags.LocalName) !== 0;
    }

    /**
     * Gets the export name of a declaration. This is primarily used for declarations that can be
     * referred to by name in the declaration's immediate scope (classes, enums, namespaces). An
     * export name will *always* be prefixed with an module or namespace export modifier like
     * `"exports."` when emitted as an expression if the name points to an exported symbol.
     *
     * @param node The declaration.
     * @param allowComments A value indicating whether comments may be emitted for the name.
     * @param allowSourceMaps A value indicating whether source maps may be emitted for the name.
     */
    export function getExportName(node: Declaration, allowComments?: boolean, allowSourceMaps?: boolean): Identifier {
        return getName(node, allowComments, allowSourceMaps, EmitFlags.ExportName);
    }

    /**
     * Gets whether an identifier should only be referred to by its export representation if the
     * name points to an exported symbol.
     */
    export function isExportName(node: Identifier) {
        return (getEmitFlags(node) & EmitFlags.ExportName) !== 0;
    }

    /**
     * Gets the name of a declaration for use in declarations.
     *
     * @param node The declaration.
     * @param allowComments A value indicating whether comments may be emitted for the name.
     * @param allowSourceMaps A value indicating whether source maps may be emitted for the name.
     */
    export function getDeclarationName(node: Declaration, allowComments?: boolean, allowSourceMaps?: boolean) {
        return getName(node, allowComments, allowSourceMaps);
    }

    function getName(node: Declaration, allowComments?: boolean, allowSourceMaps?: boolean, emitFlags: EmitFlags = 0) {
        const nodeName = getNameOfDeclaration(node);
        if (nodeName && isIdentifier(nodeName) && !isGeneratedIdentifier(nodeName)) {
            const name = getMutableClone(nodeName);
            emitFlags |= getEmitFlags(nodeName);
            if (!allowSourceMaps) emitFlags |= EmitFlags.NoSourceMap;
            if (!allowComments) emitFlags |= EmitFlags.NoComments;
            if (emitFlags) setEmitFlags(name, emitFlags);
            return name;
        }
        return getGeneratedNameForNode(node);
    }

    /**
     * Gets the exported name of a declaration for use in expressions.
     *
     * An exported name will *always* be prefixed with an module or namespace export modifier like
     * "exports." if the name points to an exported symbol.
     *
     * @param ns The namespace identifier.
     * @param node The declaration.
     * @param allowComments A value indicating whether comments may be emitted for the name.
     * @param allowSourceMaps A value indicating whether source maps may be emitted for the name.
     */
    export function getExternalModuleOrNamespaceExportName(ns: Identifier | undefined, node: Declaration, allowComments?: boolean, allowSourceMaps?: boolean): Identifier | PropertyAccessExpression {
        if (ns && hasModifier(node, ModifierFlags.Export)) {
            return getNamespaceMemberName(ns, getName(node), allowComments, allowSourceMaps);
        }
        return getExportName(node, allowComments, allowSourceMaps);
    }

    /**
     * Gets a namespace-qualified name for use in expressions.
     *
     * @param ns The namespace identifier.
     * @param name The name.
     * @param allowComments A value indicating whether comments may be emitted for the name.
     * @param allowSourceMaps A value indicating whether source maps may be emitted for the name.
     */
    export function getNamespaceMemberName(ns: Identifier, name: Identifier, allowComments?: boolean, allowSourceMaps?: boolean): PropertyAccessExpression {
        const qualifiedName = createPropertyAccess(ns, nodeIsSynthesized(name) ? name : getSynthesizedClone(name));
        setTextRange(qualifiedName, name);
        let emitFlags: EmitFlags = 0;
        if (!allowSourceMaps) emitFlags |= EmitFlags.NoSourceMap;
        if (!allowComments) emitFlags |= EmitFlags.NoComments;
        if (emitFlags) setEmitFlags(qualifiedName, emitFlags);
        return qualifiedName;
    }

    export function convertToFunctionBody(node: ConciseBody, multiLine?: boolean): Block {
        return isBlock(node) ? node : setTextRange(createBlock([setTextRange(createReturn(node), node)], multiLine), node);
    }

    export function convertFunctionDeclarationToExpression(node: FunctionDeclaration) {
        if (!node.body) return Debug.fail();
        const updated = createFunctionExpression(
            node.modifiers,
            node.asteriskToken,
            node.name,
            node.typeParameters,
            node.parameters,
            node.type,
            node.body
        );
        setOriginalNode(updated, node);
        setTextRange(updated, node);
        if (getStartsOnNewLine(node)) {
            setStartsOnNewLine(updated, /*newLine*/ true);
        }
        aggregateTransformFlags(updated);
        return updated;
    }

    function isUseStrictPrologue(node: ExpressionStatement): boolean {
        return isStringLiteral(node.expression) && node.expression.text === "use strict";
    }

    /**
     * Add any necessary prologue-directives into target statement-array.
     * The function needs to be called during each transformation step.
     * This function needs to be called whenever we transform the statement
     * list of a source file, namespace, or function-like body.
     *
     * @param target: result statements array
     * @param source: origin statements array
     * @param ensureUseStrict: boolean determining whether the function need to add prologue-directives
     * @param visitor: Optional callback used to visit any custom prologue directives.
     */
    export function addPrologue(target: Statement[], source: readonly Statement[], ensureUseStrict?: boolean, visitor?: (node: Node) => VisitResult<Node>): number {
        const offset = addStandardPrologue(target, source, ensureUseStrict);
        return addCustomPrologue(target, source, offset, visitor);
    }

    /**
     * Add just the standard (string-expression) prologue-directives into target statement-array.
     * The function needs to be called during each transformation step.
     * This function needs to be called whenever we transform the statement
     * list of a source file, namespace, or function-like body.
     */
    export function addStandardPrologue(target: Statement[], source: readonly Statement[], ensureUseStrict?: boolean): number {
        Debug.assert(target.length === 0, "Prologue directives should be at the first statement in the target statements array");
        let foundUseStrict = false;
        let statementOffset = 0;
        const numStatements = source.length;
        while (statementOffset < numStatements) {
            const statement = source[statementOffset];
            if (isPrologueDirective(statement)) {
                if (isUseStrictPrologue(statement)) {
                    foundUseStrict = true;
                }
                target.push(statement);
            }
            else {
                break;
            }
            statementOffset++;
        }
        if (ensureUseStrict && !foundUseStrict) {
            target.push(startOnNewLine(createStatement(createLiteral("use strict"))));
        }
        return statementOffset;
    }

    /**
     * Add just the custom prologue-directives into target statement-array.
     * The function needs to be called during each transformation step.
     * This function needs to be called whenever we transform the statement
     * list of a source file, namespace, or function-like body.
     */
    export function addCustomPrologue(target: Statement[], source: readonly Statement[], statementOffset: number, visitor?: (node: Node) => VisitResult<Node>): number;
    export function addCustomPrologue(target: Statement[], source: readonly Statement[], statementOffset: number | undefined, visitor?: (node: Node) => VisitResult<Node>): number | undefined;
    export function addCustomPrologue(target: Statement[], source: readonly Statement[], statementOffset: number | undefined, visitor?: (node: Node) => VisitResult<Node>): number | undefined {
        const numStatements = source.length;
        while (statementOffset !== undefined && statementOffset < numStatements) {
            const statement = source[statementOffset];
            if (getEmitFlags(statement) & EmitFlags.CustomPrologue) {
                append(target, visitor ? visitNode(statement, visitor, isStatement) : statement);
            }
            else {
                break;
            }
            statementOffset++;
        }
        return statementOffset;
    }

    export function findUseStrictPrologue(statements: readonly Statement[]): Statement | undefined {
        for (const statement of statements) {
            if (isPrologueDirective(statement)) {
                if (isUseStrictPrologue(statement)) {
                    return statement;
                }
            }
            else {
                break;
            }
        }
        return undefined;
    }

    export function startsWithUseStrict(statements: readonly Statement[]) {
        const firstStatement = firstOrUndefined(statements);
        return firstStatement !== undefined
            && isPrologueDirective(firstStatement)
            && isUseStrictPrologue(firstStatement);
    }

    /**
     * Ensures "use strict" directive is added
     *
     * @param statements An array of statements
     */
    export function ensureUseStrict(statements: NodeArray<Statement>): NodeArray<Statement> {
        const foundUseStrict = findUseStrictPrologue(statements);

        if (!foundUseStrict) {
            return setTextRange(
                createNodeArray<Statement>([
                    startOnNewLine(createStatement(createLiteral("use strict"))),
                    ...statements
                ]),
                statements
            );
        }

        return statements;
    }

    /**
     * Wraps the operand to a BinaryExpression in parentheses if they are needed to preserve the intended
     * order of operations.
     *
     * @param binaryOperator The operator for the BinaryExpression.
     * @param operand The operand for the BinaryExpression.
     * @param isLeftSideOfBinary A value indicating whether the operand is the left side of the
     *                           BinaryExpression.
     */
    export function parenthesizeBinaryOperand(binaryOperator: SyntaxKind, operand: Expression, isLeftSideOfBinary: boolean, leftOperand?: Expression) {
        const skipped = skipPartiallyEmittedExpressions(operand);

        // If the resulting expression is already parenthesized, we do not need to do any further processing.
        if (skipped.kind === SyntaxKind.ParenthesizedExpression) {
            return operand;
        }

        return binaryOperandNeedsParentheses(binaryOperator, operand, isLeftSideOfBinary, leftOperand)
            ? createParen(operand)
            : operand;
    }

    /**
     * Determines whether the operand to a BinaryExpression needs to be parenthesized.
     *
     * @param binaryOperator The operator for the BinaryExpression.
     * @param operand The operand for the BinaryExpression.
     * @param isLeftSideOfBinary A value indicating whether the operand is the left side of the
     *                           BinaryExpression.
     */
    function binaryOperandNeedsParentheses(binaryOperator: SyntaxKind, operand: Expression, isLeftSideOfBinary: boolean, leftOperand: Expression | undefined) {
        // If the operand has lower precedence, then it needs to be parenthesized to preserve the
        // intent of the expression. For example, if the operand is `a + b` and the operator is
        // `*`, then we need to parenthesize the operand to preserve the intended order of
        // operations: `(a + b) * x`.
        //
        // If the operand has higher precedence, then it does not need to be parenthesized. For
        // example, if the operand is `a * b` and the operator is `+`, then we do not need to
        // parenthesize to preserve the intended order of operations: `a * b + x`.
        //
        // If the operand has the same precedence, then we need to check the associativity of
        // the operator based on whether this is the left or right operand of the expression.
        //
        // For example, if `a / d` is on the right of operator `*`, we need to parenthesize
        // to preserve the intended order of operations: `x * (a / d)`
        //
        // If `a ** d` is on the left of operator `**`, we need to parenthesize to preserve
        // the intended order of operations: `(a ** b) ** c`
        const binaryOperatorPrecedence = getOperatorPrecedence(SyntaxKind.BinaryExpression, binaryOperator);
        const binaryOperatorAssociativity = getOperatorAssociativity(SyntaxKind.BinaryExpression, binaryOperator);
        const emittedOperand = skipPartiallyEmittedExpressions(operand);
        if (!isLeftSideOfBinary && operand.kind === SyntaxKind.ArrowFunction && binaryOperatorPrecedence > 3) {
            // We need to parenthesize arrow functions on the right side to avoid it being
            // parsed as parenthesized expression: `a && (() => {})`
            return true;
        }
        const operandPrecedence = getExpressionPrecedence(emittedOperand);
        switch (compareValues(operandPrecedence, binaryOperatorPrecedence)) {
            case Comparison.LessThan:
                // If the operand is the right side of a right-associative binary operation
                // and is a yield expression, then we do not need parentheses.
                if (!isLeftSideOfBinary
                    && binaryOperatorAssociativity === Associativity.Right
                    && operand.kind === SyntaxKind.YieldExpression) {
                    return false;
                }

                return true;

            case Comparison.GreaterThan:
                return false;

            case Comparison.EqualTo:
                if (isLeftSideOfBinary) {
                    // No need to parenthesize the left operand when the binary operator is
                    // left associative:
                    //  (a*b)/x    -> a*b/x
                    //  (a**b)/x   -> a**b/x
                    //
                    // Parentheses are needed for the left operand when the binary operator is
                    // right associative:
                    //  (a/b)**x   -> (a/b)**x
                    //  (a**b)**x  -> (a**b)**x
                    return binaryOperatorAssociativity === Associativity.Right;
                }
                else {
                    if (isBinaryExpression(emittedOperand)
                        && emittedOperand.operatorToken.kind === binaryOperator) {
                        // No need to parenthesize the right operand when the binary operator and
                        // operand are the same and one of the following:
                        //  x*(a*b)     => x*a*b
                        //  x|(a|b)     => x|a|b
                        //  x&(a&b)     => x&a&b
                        //  x^(a^b)     => x^a^b
                        if (operatorHasAssociativeProperty(binaryOperator)) {
                            return false;
                        }

                        // No need to parenthesize the right operand when the binary operator
                        // is plus (+) if both the left and right operands consist solely of either
                        // literals of the same kind or binary plus (+) expressions for literals of
                        // the same kind (recursively).
                        //  "a"+(1+2)       => "a"+(1+2)
                        //  "a"+("b"+"c")   => "a"+"b"+"c"
                        if (binaryOperator === SyntaxKind.PlusToken) {
                            const leftKind = leftOperand ? getLiteralKindOfBinaryPlusOperand(leftOperand) : SyntaxKind.Unknown;
                            if (isLiteralKind(leftKind) && leftKind === getLiteralKindOfBinaryPlusOperand(emittedOperand)) {
                                return false;
                            }
                        }
                    }

                    // No need to parenthesize the right operand when the operand is right
                    // associative:
                    //  x/(a**b)    -> x/a**b
                    //  x**(a**b)   -> x**a**b
                    //
                    // Parentheses are needed for the right operand when the operand is left
                    // associative:
                    //  x/(a*b)     -> x/(a*b)
                    //  x**(a/b)    -> x**(a/b)
                    const operandAssociativity = getExpressionAssociativity(emittedOperand);
                    return operandAssociativity === Associativity.Left;
                }
        }
    }

    /**
     * Determines whether a binary operator is mathematically associative.
     *
     * @param binaryOperator The binary operator.
     */
    function operatorHasAssociativeProperty(binaryOperator: SyntaxKind) {
        // The following operators are associative in JavaScript:
        //  (a*b)*c     -> a*(b*c)  -> a*b*c
        //  (a|b)|c     -> a|(b|c)  -> a|b|c
        //  (a&b)&c     -> a&(b&c)  -> a&b&c
        //  (a^b)^c     -> a^(b^c)  -> a^b^c
        //
        // While addition is associative in mathematics, JavaScript's `+` is not
        // guaranteed to be associative as it is overloaded with string concatenation.
        return binaryOperator === SyntaxKind.AsteriskToken
            || binaryOperator === SyntaxKind.BarToken
            || binaryOperator === SyntaxKind.AmpersandToken
            || binaryOperator === SyntaxKind.CaretToken;
    }

    interface BinaryPlusExpression extends BinaryExpression {
        cachedLiteralKind: SyntaxKind;
    }

    /**
     * This function determines whether an expression consists of a homogeneous set of
     * literal expressions or binary plus expressions that all share the same literal kind.
     * It is used to determine whether the right-hand operand of a binary plus expression can be
     * emitted without parentheses.
     */
    function getLiteralKindOfBinaryPlusOperand(node: Expression): SyntaxKind {
        node = skipPartiallyEmittedExpressions(node);

        if (isLiteralKind(node.kind)) {
            return node.kind;
        }

        if (node.kind === SyntaxKind.BinaryExpression && (<BinaryExpression>node).operatorToken.kind === SyntaxKind.PlusToken) {
            if ((<BinaryPlusExpression>node).cachedLiteralKind !== undefined) {
                return (<BinaryPlusExpression>node).cachedLiteralKind;
            }

            const leftKind = getLiteralKindOfBinaryPlusOperand((<BinaryExpression>node).left);
            const literalKind = isLiteralKind(leftKind) && leftKind === getLiteralKindOfBinaryPlusOperand((<BinaryExpression>node).right) ? leftKind :
                SyntaxKind.Unknown;

            (<BinaryPlusExpression>node).cachedLiteralKind = literalKind;
            return literalKind;
        }

        return SyntaxKind.Unknown;
    }

    export function parenthesizeForConditionalHead(condition: Expression) {
        const conditionalPrecedence = getOperatorPrecedence(SyntaxKind.ConditionalExpression, SyntaxKind.QuestionToken);
        const emittedCondition = skipPartiallyEmittedExpressions(condition);
        const conditionPrecedence = getExpressionPrecedence(emittedCondition);
        if (compareValues(conditionPrecedence, conditionalPrecedence) !== Comparison.GreaterThan) {
            return createParen(condition);
        }
        return condition;
    }

    export function parenthesizeSubexpressionOfConditionalExpression(e: Expression): Expression {
        // per ES grammar both 'whenTrue' and 'whenFalse' parts of conditional expression are assignment expressions
        // so in case when comma expression is introduced as a part of previous transformations
        // if should be wrapped in parens since comma operator has the lowest precedence
        const emittedExpression = skipPartiallyEmittedExpressions(e);
        return isCommaSequence(emittedExpression)
            ? createParen(e)
            : e;
    }

    /**
     *  [Per the spec](https://tc39.github.io/ecma262/#prod-ExportDeclaration), `export default` accepts _AssigmentExpression_ but
     *  has a lookahead restriction for `function`, `async function`, and `class`.
     *
     * Basically, that means we need to parenthesize in the following cases:
     *
     * - BinaryExpression of CommaToken
     * - CommaList (synthetic list of multiple comma expressions)
     * - FunctionExpression
     * - ClassExpression
     */
    export function parenthesizeDefaultExpression(e: Expression) {
        const check = skipPartiallyEmittedExpressions(e);
        let needsParens = isCommaSequence(check);
        if (!needsParens) {
            switch (getLeftmostExpression(check, /*stopAtCallExpression*/ false).kind) {
                case SyntaxKind.ClassExpression:
                case SyntaxKind.FunctionExpression:
                    needsParens = true;
            }
        }
        return needsParens ? createParen(e) : e;
    }

    /**
     * Wraps an expression in parentheses if it is needed in order to use the expression
     * as the expression of a NewExpression node.
     *
     * @param expression The Expression node.
     */
    export function parenthesizeForNew(expression: Expression): LeftHandSideExpression {
        const leftmostExpr = getLeftmostExpression(expression, /*stopAtCallExpressions*/ true);
        switch (leftmostExpr.kind) {
            case SyntaxKind.CallExpression:
                return createParen(expression);

            case SyntaxKind.NewExpression:
                return !(leftmostExpr as NewExpression).arguments
                    ? createParen(expression)
                    : <LeftHandSideExpression>expression;
        }

        return parenthesizeForAccess(expression);
    }

    /**
     * Wraps an expression in parentheses if it is needed in order to use the expression for
     * property or element access.
     *
     * @param expr The expression node.
     */
    export function parenthesizeForAccess(expression: Expression): LeftHandSideExpression {
        // isLeftHandSideExpression is almost the correct criterion for when it is not necessary
        // to parenthesize the expression before a dot. The known exception is:
        //
        //    NewExpression:
        //       new C.x        -> not the same as (new C).x
        //
        const emittedExpression = skipPartiallyEmittedExpressions(expression);
        if (isLeftHandSideExpression(emittedExpression)
            && (emittedExpression.kind !== SyntaxKind.NewExpression || (<NewExpression>emittedExpression).arguments)) {
            return <LeftHandSideExpression>expression;
        }

        return setTextRange(createParen(expression), expression);
    }

    export function parenthesizePostfixOperand(operand: Expression) {
        return isLeftHandSideExpression(operand)
            ? operand
            : setTextRange(createParen(operand), operand);
    }

    export function parenthesizePrefixOperand(operand: Expression) {
        return isUnaryExpression(operand)
            ? operand
            : setTextRange(createParen(operand), operand);
    }

    export function parenthesizeListElements(elements: NodeArray<Expression>) {
        let result: Expression[] | undefined;
        for (let i = 0; i < elements.length; i++) {
            const element = parenthesizeExpressionForList(elements[i]);
            if (result !== undefined || element !== elements[i]) {
                if (result === undefined) {
                    result = elements.slice(0, i);
                }

                result.push(element);
            }
        }

        if (result !== undefined) {
            return setTextRange(createNodeArray(result, elements.hasTrailingComma), elements);
        }

        return elements;
    }

    export function parenthesizeExpressionForList(expression: Expression) {
        const emittedExpression = skipPartiallyEmittedExpressions(expression);
        const expressionPrecedence = getExpressionPrecedence(emittedExpression);
        const commaPrecedence = getOperatorPrecedence(SyntaxKind.BinaryExpression, SyntaxKind.CommaToken);
        return expressionPrecedence > commaPrecedence
            ? expression
            : setTextRange(createParen(expression), expression);
    }

    export function parenthesizeExpressionForExpressionStatement(expression: Expression) {
        const emittedExpression = skipPartiallyEmittedExpressions(expression);
        if (isCallExpression(emittedExpression)) {
            const callee = emittedExpression.expression;
            const kind = skipPartiallyEmittedExpressions(callee).kind;
            if (kind === SyntaxKind.FunctionExpression || kind === SyntaxKind.ArrowFunction) {
                const mutableCall = getMutableClone(emittedExpression);
                mutableCall.expression = setTextRange(createParen(callee), callee);
                return recreateOuterExpressions(expression, mutableCall, OuterExpressionKinds.PartiallyEmittedExpressions);
            }
        }

        const leftmostExpressionKind = getLeftmostExpression(emittedExpression, /*stopAtCallExpressions*/ false).kind;
        if (leftmostExpressionKind === SyntaxKind.ObjectLiteralExpression || leftmostExpressionKind === SyntaxKind.FunctionExpression) {
            return setTextRange(createParen(expression), expression);
        }

        return expression;
    }

    export function parenthesizeConditionalTypeMember(member: TypeNode) {
        return member.kind === SyntaxKind.ConditionalType ? createParenthesizedType(member) : member;
    }

    export function parenthesizeElementTypeMember(member: TypeNode) {
        switch (member.kind) {
            case SyntaxKind.UnionType:
            case SyntaxKind.IntersectionType:
            case SyntaxKind.FunctionType:
            case SyntaxKind.ConstructorType:
                return createParenthesizedType(member);
        }
        return parenthesizeConditionalTypeMember(member);
    }

    export function parenthesizeArrayTypeMember(member: TypeNode) {
        switch (member.kind) {
            case SyntaxKind.TypeQuery:
            case SyntaxKind.TypeOperator:
            case SyntaxKind.InferType:
                return createParenthesizedType(member);
        }
        return parenthesizeElementTypeMember(member);
    }

    export function parenthesizeElementTypeMembers(members: readonly TypeNode[]) {
        return createNodeArray(sameMap(members, parenthesizeElementTypeMember));
    }

    export function parenthesizeTypeParameters(typeParameters: readonly TypeNode[] | undefined) {
        if (some(typeParameters)) {
            const params: TypeNode[] = [];
            for (let i = 0; i < typeParameters.length; ++i) {
                const entry = typeParameters[i];
                params.push(i === 0 && isFunctionOrConstructorTypeNode(entry) && entry.typeParameters ?
                    createParenthesizedType(entry) :
                    entry);
            }

            return createNodeArray(params);
        }
    }

    export function getLeftmostExpression(node: Expression, stopAtCallExpressions: boolean) {
        while (true) {
            switch (node.kind) {
                case SyntaxKind.PostfixUnaryExpression:
                    node = (<PostfixUnaryExpression>node).operand;
                    continue;

                case SyntaxKind.BinaryExpression:
                    node = (<BinaryExpression>node).left;
                    continue;

                case SyntaxKind.ConditionalExpression:
                    node = (<ConditionalExpression>node).condition;
                    continue;

                case SyntaxKind.TaggedTemplateExpression:
                    node = (<TaggedTemplateExpression>node).tag;
                    continue;

                case SyntaxKind.CallExpression:
                    if (stopAtCallExpressions) {
                        return node;
                    }
                    // falls through
                case SyntaxKind.AsExpression:
                case SyntaxKind.ElementAccessExpression:
                case SyntaxKind.PropertyAccessExpression:
                case SyntaxKind.NonNullExpression:
                case SyntaxKind.PartiallyEmittedExpression:
                    node = (<CallExpression | PropertyAccessExpression | ElementAccessExpression | AsExpression | NonNullExpression | PartiallyEmittedExpression>node).expression;
                    continue;
            }

            return node;
        }

    }

    export function parenthesizeConciseBody(body: ConciseBody): ConciseBody {
        if (!isBlock(body) && (isCommaSequence(body) || getLeftmostExpression(body, /*stopAtCallExpressions*/ false).kind === SyntaxKind.ObjectLiteralExpression)) {
            return setTextRange(createParen(body), body);
        }

        return body;
    }

    export function isCommaSequence(node: Expression): node is BinaryExpression & {operatorToken: Token<SyntaxKind.CommaToken>} | CommaListExpression {
        return node.kind === SyntaxKind.BinaryExpression && (<BinaryExpression>node).operatorToken.kind === SyntaxKind.CommaToken ||
            node.kind === SyntaxKind.CommaListExpression;
    }

    export const enum OuterExpressionKinds {
        Parentheses = 1 << 0,
        Assertions = 1 << 1,
        PartiallyEmittedExpressions = 1 << 2,

        All = Parentheses | Assertions | PartiallyEmittedExpressions
    }

    export type OuterExpression = ParenthesizedExpression | TypeAssertion | AsExpression | NonNullExpression | PartiallyEmittedExpression;

    export function isOuterExpression(node: Node, kinds = OuterExpressionKinds.All): node is OuterExpression {
        switch (node.kind) {
            case SyntaxKind.ParenthesizedExpression:
                return (kinds & OuterExpressionKinds.Parentheses) !== 0;
            case SyntaxKind.TypeAssertionExpression:
            case SyntaxKind.AsExpression:
            case SyntaxKind.NonNullExpression:
                return (kinds & OuterExpressionKinds.Assertions) !== 0;
            case SyntaxKind.PartiallyEmittedExpression:
                return (kinds & OuterExpressionKinds.PartiallyEmittedExpressions) !== 0;
        }
        return false;
    }

    export function skipOuterExpressions(node: Expression, kinds?: OuterExpressionKinds): Expression;
    export function skipOuterExpressions(node: Node, kinds?: OuterExpressionKinds): Node;
    export function skipOuterExpressions(node: Node, kinds = OuterExpressionKinds.All) {
        let previousNode: Node;
        do {
            previousNode = node;
            if (kinds & OuterExpressionKinds.Parentheses) {
                node = skipParentheses(node);
            }

            if (kinds & OuterExpressionKinds.Assertions) {
                node = skipAssertions(node);
            }

            if (kinds & OuterExpressionKinds.PartiallyEmittedExpressions) {
                node = skipPartiallyEmittedExpressions(node);
            }
        }
        while (previousNode !== node);

        return node;
    }

    export function skipAssertions(node: Expression): Expression;
    export function skipAssertions(node: Node): Node;
    export function skipAssertions(node: Node): Node {
        while (isAssertionExpression(node) || node.kind === SyntaxKind.NonNullExpression) {
            node = (<AssertionExpression | NonNullExpression>node).expression;
        }

        return node;
    }

    function updateOuterExpression(outerExpression: OuterExpression, expression: Expression) {
        switch (outerExpression.kind) {
            case SyntaxKind.ParenthesizedExpression: return updateParen(outerExpression, expression);
            case SyntaxKind.TypeAssertionExpression: return updateTypeAssertion(outerExpression, outerExpression.type, expression);
            case SyntaxKind.AsExpression: return updateAsExpression(outerExpression, expression, outerExpression.type);
            case SyntaxKind.NonNullExpression: return updateNonNullExpression(outerExpression, expression);
            case SyntaxKind.PartiallyEmittedExpression: return updatePartiallyEmittedExpression(outerExpression, expression);
        }
    }

    /**
     * Determines whether a node is a parenthesized expression that can be ignored when recreating outer expressions.
     *
     * A parenthesized expression can be ignored when all of the following are true:
     *
     * - It's `pos` and `end` are not -1
     * - It does not have a custom source map range
     * - It does not have a custom comment range
     * - It does not have synthetic leading or trailing comments
     *
     * If an outermost parenthesized expression is ignored, but the containing expression requires a parentheses around
     * the expression to maintain precedence, a new parenthesized expression should be created automatically when
     * the containing expression is created/updated.
     */
    function isIgnorableParen(node: Expression) {
        return node.kind === SyntaxKind.ParenthesizedExpression
            && nodeIsSynthesized(node)
            && nodeIsSynthesized(getSourceMapRange(node))
            && nodeIsSynthesized(getCommentRange(node))
            && !some(getSyntheticLeadingComments(node))
            && !some(getSyntheticTrailingComments(node));
    }

    export function recreateOuterExpressions(outerExpression: Expression | undefined, innerExpression: Expression, kinds = OuterExpressionKinds.All): Expression {
        if (outerExpression && isOuterExpression(outerExpression, kinds) && !isIgnorableParen(outerExpression)) {
            return updateOuterExpression(
                outerExpression,
                recreateOuterExpressions(outerExpression.expression, innerExpression)
            );
        }
        return innerExpression;
    }

    export function startOnNewLine<T extends Node>(node: T): T {
        return setStartsOnNewLine(node, /*newLine*/ true);
    }

    export function getExternalHelpersModuleName(node: SourceFile) {
        const parseNode = getOriginalNode(node, isSourceFile);
        const emitNode = parseNode && parseNode.emitNode;
        return emitNode && emitNode.externalHelpersModuleName;
    }

    export function hasRecordedExternalHelpers(sourceFile: SourceFile) {
        const parseNode = getOriginalNode(sourceFile, isSourceFile);
        const emitNode = parseNode && parseNode.emitNode;
        return !!emitNode && (!!emitNode.externalHelpersModuleName || !!emitNode.externalHelpers);
    }

    export function createExternalHelpersImportDeclarationIfNeeded(sourceFile: SourceFile, compilerOptions: CompilerOptions, hasExportStarsToExportValues?: boolean, hasImportStar?: boolean, hasImportDefault?: boolean) {
        if (compilerOptions.importHelpers && isEffectiveExternalModule(sourceFile, compilerOptions)) {
            let namedBindings: NamedImportBindings | undefined;
            const moduleKind = getEmitModuleKind(compilerOptions);
            if (moduleKind >= ModuleKind.ES2015 && moduleKind <= ModuleKind.ESNext) {
                // use named imports
                const helpers = getEmitHelpers(sourceFile);
                if (helpers) {
                    const helperNames: string[] = [];
                    for (const helper of helpers) {
                        if (!helper.scoped) {
                            const importName = (helper as UnscopedEmitHelper).importName;
                            if (importName) {
                                pushIfUnique(helperNames, importName);
                            }
                        }
                    }
                    if (some(helperNames)) {
                        helperNames.sort(compareStringsCaseSensitive);
                        // Alias the imports if the names are used somewhere in the file.
                        // NOTE: We don't need to care about global import collisions as this is a module.
                        namedBindings = createNamedImports(
                            map(helperNames, name => isFileLevelUniqueName(sourceFile, name)
                                ? createImportSpecifier(/*propertyName*/ undefined, createIdentifier(name))
                                : createImportSpecifier(createIdentifier(name), getUnscopedHelperName(name))
                            )
                        );
                        const parseNode = getOriginalNode(sourceFile, isSourceFile);
                        const emitNode = getOrCreateEmitNode(parseNode);
                        emitNode.externalHelpers = true;
                    }
                }
            }
            else {
                // use a namespace import
                const externalHelpersModuleName = getOrCreateExternalHelpersModuleNameIfNeeded(sourceFile, compilerOptions, hasExportStarsToExportValues, hasImportStar || hasImportDefault);
                if (externalHelpersModuleName) {
                    namedBindings = createNamespaceImport(externalHelpersModuleName);
                }
            }
            if (namedBindings) {
                const externalHelpersImportDeclaration = createImportDeclaration(
                    /*decorators*/ undefined,
                    /*modifiers*/ undefined,
                    createImportClause(/*name*/ undefined, namedBindings),
                    createLiteral(externalHelpersModuleNameText)
                );
                addEmitFlags(externalHelpersImportDeclaration, EmitFlags.NeverApplyImportHelper);
                return externalHelpersImportDeclaration;
            }
        }
    }

    export function getOrCreateExternalHelpersModuleNameIfNeeded(node: SourceFile, compilerOptions: CompilerOptions, hasExportStarsToExportValues?: boolean, hasImportStarOrImportDefault?: boolean) {
        if (compilerOptions.importHelpers && isEffectiveExternalModule(node, compilerOptions)) {
            const externalHelpersModuleName = getExternalHelpersModuleName(node);
            if (externalHelpersModuleName) {
                return externalHelpersModuleName;
            }

            const moduleKind = getEmitModuleKind(compilerOptions);
            let create = (hasExportStarsToExportValues || (compilerOptions.esModuleInterop && hasImportStarOrImportDefault))
                && moduleKind !== ModuleKind.System
                && moduleKind !== ModuleKind.ES2015
                && moduleKind !== ModuleKind.ESNext;
            if (!create) {
                const helpers = getEmitHelpers(node);
                if (helpers) {
                    for (const helper of helpers) {
                        if (!helper.scoped) {
                            create = true;
                            break;
                        }
                    }
                }
            }

            if (create) {
                const parseNode = getOriginalNode(node, isSourceFile);
                const emitNode = getOrCreateEmitNode(parseNode);
                return emitNode.externalHelpersModuleName || (emitNode.externalHelpersModuleName = createUniqueName(externalHelpersModuleNameText));
            }
        }
    }

    /**
     * Get the name of that target module from an import or export declaration
     */
    export function getLocalNameForExternalImport(node: ImportDeclaration | ExportDeclaration | ImportEqualsDeclaration, sourceFile: SourceFile): Identifier | undefined {
        const namespaceDeclaration = getNamespaceDeclarationNode(node);
        if (namespaceDeclaration && !isDefaultImport(node)) {
            const name = namespaceDeclaration.name;
            return isGeneratedIdentifier(name) ? name : createIdentifier(getSourceTextOfNodeFromSourceFile(sourceFile, name) || idText(name));
        }
        if (node.kind === SyntaxKind.ImportDeclaration && node.importClause) {
            return getGeneratedNameForNode(node);
        }
        if (node.kind === SyntaxKind.ExportDeclaration && node.moduleSpecifier) {
            return getGeneratedNameForNode(node);
        }
        return undefined;
    }

    /**
     * Get the name of a target module from an import/export declaration as should be written in the emitted output.
     * The emitted output name can be different from the input if:
     *  1. The module has a /// <amd-module name="<new name>" />
     *  2. --out or --outFile is used, making the name relative to the rootDir
     *  3- The containing SourceFile has an entry in renamedDependencies for the import as requested by some module loaders (e.g. System).
     * Otherwise, a new StringLiteral node representing the module name will be returned.
     */
    export function getExternalModuleNameLiteral(importNode: ImportDeclaration | ExportDeclaration | ImportEqualsDeclaration, sourceFile: SourceFile, host: EmitHost, resolver: EmitResolver, compilerOptions: CompilerOptions) {
        const moduleName = getExternalModuleName(importNode)!; // TODO: GH#18217
        if (moduleName.kind === SyntaxKind.StringLiteral) {
            return tryGetModuleNameFromDeclaration(importNode, host, resolver, compilerOptions)
                || tryRenameExternalModule(<StringLiteral>moduleName, sourceFile)
                || getSynthesizedClone(<StringLiteral>moduleName);
        }

        return undefined;
    }

    /**
     * Some bundlers (SystemJS builder) sometimes want to rename dependencies.
     * Here we check if alternative name was provided for a given moduleName and return it if possible.
     */
    function tryRenameExternalModule(moduleName: LiteralExpression, sourceFile: SourceFile) {
        const rename = sourceFile.renamedDependencies && sourceFile.renamedDependencies.get(moduleName.text);
        return rename && createLiteral(rename);
    }

    /**
     * Get the name of a module as should be written in the emitted output.
     * The emitted output name can be different from the input if:
     *  1. The module has a /// <amd-module name="<new name>" />
     *  2. --out or --outFile is used, making the name relative to the rootDir
     * Otherwise, a new StringLiteral node representing the module name will be returned.
     */
    export function tryGetModuleNameFromFile(file: SourceFile | undefined, host: EmitHost, options: CompilerOptions): StringLiteral | undefined {
        if (!file) {
            return undefined;
        }
        if (file.moduleName) {
            return createLiteral(file.moduleName);
        }
        if (!file.isDeclarationFile && (options.out || options.outFile)) {
            return createLiteral(getExternalModuleNameFromPath(host, file.fileName));
        }
        return undefined;
    }

    function tryGetModuleNameFromDeclaration(declaration: ImportEqualsDeclaration | ImportDeclaration | ExportDeclaration, host: EmitHost, resolver: EmitResolver, compilerOptions: CompilerOptions) {
        return tryGetModuleNameFromFile(resolver.getExternalModuleFileFromDeclaration(declaration), host, compilerOptions);
    }

    /**
     * Gets the initializer of an BindingOrAssignmentElement.
     */
    export function getInitializerOfBindingOrAssignmentElement(bindingElement: BindingOrAssignmentElement): Expression | undefined {
        if (isDeclarationBindingElement(bindingElement)) {
            // `1` in `let { a = 1 } = ...`
            // `1` in `let { a: b = 1 } = ...`
            // `1` in `let { a: {b} = 1 } = ...`
            // `1` in `let { a: [b] = 1 } = ...`
            // `1` in `let [a = 1] = ...`
            // `1` in `let [{a} = 1] = ...`
            // `1` in `let [[a] = 1] = ...`
            return bindingElement.initializer;
        }

        if (isPropertyAssignment(bindingElement)) {
            // `1` in `({ a: b = 1 } = ...)`
            // `1` in `({ a: {b} = 1 } = ...)`
            // `1` in `({ a: [b] = 1 } = ...)`
            const initializer = bindingElement.initializer;
            return isAssignmentExpression(initializer, /*excludeCompoundAssignment*/ true)
                ? initializer.right
                : undefined;
        }

        if (isShorthandPropertyAssignment(bindingElement)) {
            // `1` in `({ a = 1 } = ...)`
            return bindingElement.objectAssignmentInitializer;
        }

        if (isAssignmentExpression(bindingElement, /*excludeCompoundAssignment*/ true)) {
            // `1` in `[a = 1] = ...`
            // `1` in `[{a} = 1] = ...`
            // `1` in `[[a] = 1] = ...`
            return bindingElement.right;
        }

        if (isSpreadElement(bindingElement)) {
            // Recovery consistent with existing emit.
            return getInitializerOfBindingOrAssignmentElement(<BindingOrAssignmentElement>bindingElement.expression);
        }
    }

    /**
     * Gets the name of an BindingOrAssignmentElement.
     */
    export function getTargetOfBindingOrAssignmentElement(bindingElement: BindingOrAssignmentElement): BindingOrAssignmentElementTarget | undefined {
        if (isDeclarationBindingElement(bindingElement)) {
            // `a` in `let { a } = ...`
            // `a` in `let { a = 1 } = ...`
            // `b` in `let { a: b } = ...`
            // `b` in `let { a: b = 1 } = ...`
            // `a` in `let { ...a } = ...`
            // `{b}` in `let { a: {b} } = ...`
            // `{b}` in `let { a: {b} = 1 } = ...`
            // `[b]` in `let { a: [b] } = ...`
            // `[b]` in `let { a: [b] = 1 } = ...`
            // `a` in `let [a] = ...`
            // `a` in `let [a = 1] = ...`
            // `a` in `let [...a] = ...`
            // `{a}` in `let [{a}] = ...`
            // `{a}` in `let [{a} = 1] = ...`
            // `[a]` in `let [[a]] = ...`
            // `[a]` in `let [[a] = 1] = ...`
            return bindingElement.name;
        }

        if (isObjectLiteralElementLike(bindingElement)) {
            switch (bindingElement.kind) {
                case SyntaxKind.PropertyAssignment:
                    // `b` in `({ a: b } = ...)`
                    // `b` in `({ a: b = 1 } = ...)`
                    // `{b}` in `({ a: {b} } = ...)`
                    // `{b}` in `({ a: {b} = 1 } = ...)`
                    // `[b]` in `({ a: [b] } = ...)`
                    // `[b]` in `({ a: [b] = 1 } = ...)`
                    // `b.c` in `({ a: b.c } = ...)`
                    // `b.c` in `({ a: b.c = 1 } = ...)`
                    // `b[0]` in `({ a: b[0] } = ...)`
                    // `b[0]` in `({ a: b[0] = 1 } = ...)`
                    return getTargetOfBindingOrAssignmentElement(<BindingOrAssignmentElement>bindingElement.initializer);

                case SyntaxKind.ShorthandPropertyAssignment:
                    // `a` in `({ a } = ...)`
                    // `a` in `({ a = 1 } = ...)`
                    return bindingElement.name;

                case SyntaxKind.SpreadAssignment:
                    // `a` in `({ ...a } = ...)`
                    return getTargetOfBindingOrAssignmentElement(<BindingOrAssignmentElement>bindingElement.expression);
            }

            // no target
            return undefined;
        }

        if (isAssignmentExpression(bindingElement, /*excludeCompoundAssignment*/ true)) {
            // `a` in `[a = 1] = ...`
            // `{a}` in `[{a} = 1] = ...`
            // `[a]` in `[[a] = 1] = ...`
            // `a.b` in `[a.b = 1] = ...`
            // `a[0]` in `[a[0] = 1] = ...`
            return getTargetOfBindingOrAssignmentElement(<BindingOrAssignmentElement>bindingElement.left);
        }

        if (isSpreadElement(bindingElement)) {
            // `a` in `[...a] = ...`
            return getTargetOfBindingOrAssignmentElement(<BindingOrAssignmentElement>bindingElement.expression);
        }

        // `a` in `[a] = ...`
        // `{a}` in `[{a}] = ...`
        // `[a]` in `[[a]] = ...`
        // `a.b` in `[a.b] = ...`
        // `a[0]` in `[a[0]] = ...`
        return bindingElement;
    }

    /**
     * Determines whether an BindingOrAssignmentElement is a rest element.
     */
    export function getRestIndicatorOfBindingOrAssignmentElement(bindingElement: BindingOrAssignmentElement): BindingOrAssignmentElementRestIndicator | undefined {
        switch (bindingElement.kind) {
            case SyntaxKind.Parameter:
            case SyntaxKind.BindingElement:
                // `...` in `let [...a] = ...`
                return bindingElement.dotDotDotToken;

            case SyntaxKind.SpreadElement:
            case SyntaxKind.SpreadAssignment:
                // `...` in `[...a] = ...`
                return bindingElement;
        }

        return undefined;
    }

    /**
     * Gets the property name of a BindingOrAssignmentElement
     */
    export function getPropertyNameOfBindingOrAssignmentElement(bindingElement: BindingOrAssignmentElement): PropertyName | undefined {
        const propertyName = tryGetPropertyNameOfBindingOrAssignmentElement(bindingElement);
        Debug.assert(!!propertyName || isSpreadAssignment(bindingElement), "Invalid property name for binding element.");
        return propertyName;
    }

    export function tryGetPropertyNameOfBindingOrAssignmentElement(bindingElement: BindingOrAssignmentElement): PropertyName | undefined {
        switch (bindingElement.kind) {
            case SyntaxKind.BindingElement:
                // `a` in `let { a: b } = ...`
                // `[a]` in `let { [a]: b } = ...`
                // `"a"` in `let { "a": b } = ...`
                // `1` in `let { 1: b } = ...`
                if (bindingElement.propertyName) {
                    const propertyName = bindingElement.propertyName;
                    return isComputedPropertyName(propertyName) && isStringOrNumericLiteral(propertyName.expression)
                        ? propertyName.expression
                        : propertyName;
                }

                break;

            case SyntaxKind.PropertyAssignment:
                // `a` in `({ a: b } = ...)`
                // `[a]` in `({ [a]: b } = ...)`
                // `"a"` in `({ "a": b } = ...)`
                // `1` in `({ 1: b } = ...)`
                if (bindingElement.name) {
                    const propertyName = bindingElement.name;
                    return isComputedPropertyName(propertyName) && isStringOrNumericLiteral(propertyName.expression)
                        ? propertyName.expression
                        : propertyName;
                }

                break;

            case SyntaxKind.SpreadAssignment:
                // `a` in `({ ...a } = ...)`
                return bindingElement.name;
        }

        const target = getTargetOfBindingOrAssignmentElement(bindingElement);
        if (target && isPropertyName(target)) {
            return isComputedPropertyName(target) && isStringOrNumericLiteral(target.expression)
                ? target.expression
                : target;
        }
    }

    function isStringOrNumericLiteral(node: Node): node is StringLiteral | NumericLiteral {
        const kind = node.kind;
        return kind === SyntaxKind.StringLiteral
            || kind === SyntaxKind.NumericLiteral;
    }

    /**
     * Gets the elements of a BindingOrAssignmentPattern
     */
    export function getElementsOfBindingOrAssignmentPattern(name: BindingOrAssignmentPattern): readonly BindingOrAssignmentElement[] {
        switch (name.kind) {
            case SyntaxKind.ObjectBindingPattern:
            case SyntaxKind.ArrayBindingPattern:
            case SyntaxKind.ArrayLiteralExpression:
                // `a` in `{a}`
                // `a` in `[a]`
                return <readonly BindingOrAssignmentElement[]>name.elements;

            case SyntaxKind.ObjectLiteralExpression:
                // `a` in `{a}`
                return <readonly BindingOrAssignmentElement[]>name.properties;
        }
    }

    export function convertToArrayAssignmentElement(element: BindingOrAssignmentElement) {
        if (isBindingElement(element)) {
            if (element.dotDotDotToken) {
                Debug.assertNode(element.name, isIdentifier);
                return setOriginalNode(setTextRange(createSpread(<Identifier>element.name), element), element);
            }
            const expression = convertToAssignmentElementTarget(element.name);
            return element.initializer
                ? setOriginalNode(
                    setTextRange(
                        createAssignment(expression, element.initializer),
                        element
                    ),
                    element
                )
                : expression;
        }
        Debug.assertNode(element, isExpression);
        return <Expression>element;
    }

    export function convertToObjectAssignmentElement(element: BindingOrAssignmentElement) {
        if (isBindingElement(element)) {
            if (element.dotDotDotToken) {
                Debug.assertNode(element.name, isIdentifier);
                return setOriginalNode(setTextRange(createSpreadAssignment(<Identifier>element.name), element), element);
            }
            if (element.propertyName) {
                const expression = convertToAssignmentElementTarget(element.name);
                return setOriginalNode(setTextRange(createPropertyAssignment(element.propertyName, element.initializer ? createAssignment(expression, element.initializer) : expression), element), element);
            }
            Debug.assertNode(element.name, isIdentifier);
            return setOriginalNode(setTextRange(createShorthandPropertyAssignment(<Identifier>element.name, element.initializer), element), element);
        }
        Debug.assertNode(element, isObjectLiteralElementLike);
        return <ObjectLiteralElementLike>element;
    }

    export function convertToAssignmentPattern(node: BindingOrAssignmentPattern): AssignmentPattern {
        switch (node.kind) {
            case SyntaxKind.ArrayBindingPattern:
            case SyntaxKind.ArrayLiteralExpression:
                return convertToArrayAssignmentPattern(node);

            case SyntaxKind.ObjectBindingPattern:
            case SyntaxKind.ObjectLiteralExpression:
                return convertToObjectAssignmentPattern(node);
        }
    }

    export function convertToObjectAssignmentPattern(node: ObjectBindingOrAssignmentPattern) {
        if (isObjectBindingPattern(node)) {
            return setOriginalNode(
                setTextRange(
                    createObjectLiteral(map(node.elements, convertToObjectAssignmentElement)),
                    node
                ),
                node
            );
        }
        Debug.assertNode(node, isObjectLiteralExpression);
        return node;
    }

    export function convertToArrayAssignmentPattern(node: ArrayBindingOrAssignmentPattern) {
        if (isArrayBindingPattern(node)) {
            return setOriginalNode(
                setTextRange(
                    createArrayLiteral(map(node.elements, convertToArrayAssignmentElement)),
                    node
                ),
                node
            );
        }
        Debug.assertNode(node, isArrayLiteralExpression);
        return node;
    }

    export function convertToAssignmentElementTarget(node: BindingOrAssignmentElementTarget): Expression {
        if (isBindingPattern(node)) {
            return convertToAssignmentPattern(node);
        }

        Debug.assertNode(node, isExpression);
        return node;
    }
}
