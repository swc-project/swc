/* @internal */
namespace ts {
    export namespace Debug {

        export function failBadSyntaxKind(node: Node, message?: string): never {
            return fail(
                `${message || "Unexpected node."}\r\nNode ${formatSyntaxKind(node.kind)} was unexpected.`,
                failBadSyntaxKind);
        }

        export const assertEachNode = shouldAssert(AssertionLevel.Normal)
            ? (nodes: Node[], test: (node: Node) => boolean, message?: string): void => assert(
                test === undefined || every(nodes, test),
                message || "Unexpected node.",
                () => `Node array did not pass test '${getFunctionName(test)}'.`,
                assertEachNode)
            : noop;

        export const assertNode = shouldAssert(AssertionLevel.Normal)
            ? (node: Node | undefined, test: ((node: Node | undefined) => boolean) | undefined, message?: string): void => assert(
                test === undefined || test(node),
                message || "Unexpected node.",
                () => `Node ${formatSyntaxKind(node!.kind)} did not pass test '${getFunctionName(test!)}'.`,
                assertNode)
            : noop;

        export const assertNotNode = shouldAssert(AssertionLevel.Normal)
            ? (node: Node | undefined, test: ((node: Node | undefined) => boolean) | undefined, message?: string): void => assert(
                test === undefined || !test(node),
                message || "Unexpected node.",
                () => `Node ${formatSyntaxKind(node!.kind)} should not have passed test '${getFunctionName(test!)}'.`,
                assertNode)
            : noop;

        export const assertOptionalNode = shouldAssert(AssertionLevel.Normal)
            ? (node: Node, test: (node: Node) => boolean, message?: string): void => assert(
                test === undefined || node === undefined || test(node),
                message || "Unexpected node.",
                () => `Node ${formatSyntaxKind(node.kind)} did not pass test '${getFunctionName(test)}'.`,
                assertOptionalNode)
            : noop;

        export const assertOptionalToken = shouldAssert(AssertionLevel.Normal)
            ? (node: Node, kind: SyntaxKind, message?: string): void => assert(
                kind === undefined || node === undefined || node.kind === kind,
                message || "Unexpected node.",
                () => `Node ${formatSyntaxKind(node.kind)} was not a '${formatSyntaxKind(kind)}' token.`,
                assertOptionalToken)
            : noop;

        export const assertMissingNode = shouldAssert(AssertionLevel.Normal)
            ? (node: Node, message?: string): void => assert(
                node === undefined,
                message || "Unexpected node.",
                () => `Node ${formatSyntaxKind(node.kind)} was unexpected'.`,
                assertMissingNode)
            : noop;

        let isDebugInfoEnabled = false;

        interface ExtendedDebugModule {
            init(_ts: typeof ts): void;
            formatControlFlowGraph(flowNode: FlowNode): string;
        }

        let extendedDebugModule: ExtendedDebugModule | undefined;

        function extendedDebug() {
            enableDebugInfo();
            if (!extendedDebugModule) {
                throw new Error("Debugging helpers could not be loaded.");
            }
            return extendedDebugModule;
        }

        export function printControlFlowGraph(flowNode: FlowNode) {
            return console.log(formatControlFlowGraph(flowNode));
        }

        export function formatControlFlowGraph(flowNode: FlowNode) {
            return extendedDebug().formatControlFlowGraph(flowNode);
        }

        export function attachFlowNodeDebugInfo(flowNode: FlowNode) {
            if (isDebugInfoEnabled) {
                if (!("__debugFlowFlags" in flowNode)) { // eslint-disable-line no-in-operator
                    Object.defineProperties(flowNode, {
                        __debugFlowFlags: { get(this: FlowNode) { return formatEnum(this.flags, (ts as any).FlowFlags, /*isFlags*/ true); } },
                        __debugToString: { value(this: FlowNode) { return formatControlFlowGraph(this); } }
                    });
                }
            }
        }

        /**
         * Injects debug information into frequently used types.
         */
        export function enableDebugInfo() {
            if (isDebugInfoEnabled) return;

            // Add additional properties in debug mode to assist with debugging.
            Object.defineProperties(objectAllocator.getSymbolConstructor().prototype, {
                __debugFlags: { get(this: Symbol) { return formatSymbolFlags(this.flags); } }
            });

            Object.defineProperties(objectAllocator.getTypeConstructor().prototype, {
                __debugFlags: { get(this: Type) { return formatTypeFlags(this.flags); } },
                __debugObjectFlags: { get(this: Type) { return this.flags & TypeFlags.Object ? formatObjectFlags((<ObjectType>this).objectFlags) : ""; } },
                __debugTypeToString: { value(this: Type) { return this.checker.typeToString(this); } },
            });

            const nodeConstructors = [
                objectAllocator.getNodeConstructor(),
                objectAllocator.getIdentifierConstructor(),
                objectAllocator.getTokenConstructor(),
                objectAllocator.getSourceFileConstructor()
            ];

            for (const ctor of nodeConstructors) {
                if (!ctor.prototype.hasOwnProperty("__debugKind")) {
                    Object.defineProperties(ctor.prototype, {
                        __debugKind: { get(this: Node) { return formatSyntaxKind(this.kind); } },
                        __debugNodeFlags: { get(this: Node) { return formatNodeFlags(this.flags); } },
                        __debugModifierFlags: { get(this: Node) { return formatModifierFlags(getModifierFlagsNoCache(this)); } },
                        __debugTransformFlags: { get(this: Node) { return formatTransformFlags(this.transformFlags); } },
                        __debugIsParseTreeNode: { get(this: Node) { return isParseTreeNode(this); } },
                        __debugEmitFlags: { get(this: Node) { return formatEmitFlags(getEmitFlags(this)); } },
                        __debugGetText: {
                            value(this: Node, includeTrivia?: boolean) {
                                if (nodeIsSynthesized(this)) return "";
                                const parseNode = getParseTreeNode(this);
                                const sourceFile = parseNode && getSourceFileOfNode(parseNode);
                                return sourceFile ? getSourceTextOfNodeFromSourceFile(sourceFile, parseNode, includeTrivia) : "";
                            }
                        }
                    });
                }
            }

            // attempt to load extended debugging information
            try {
                if (sys && sys.require) {
                    const basePath = getDirectoryPath(resolvePath(sys.getExecutingFilePath()));
                    const result = sys.require(basePath, "./compiler-debug") as RequireResult<ExtendedDebugModule>;
                    if (!result.error) {
                        result.module.init(ts);
                        extendedDebugModule = result.module;
                    }
                }
            }
            catch {
                // do nothing
            }

            isDebugInfoEnabled = true;
        }

    }
}
