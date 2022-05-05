/*
 * Copyright (c) 2020, J2 Innovations. All Rights Reserved
 */

import { HDict } from "./HDict";
import { HGrid } from "./HGrid";
import { HList } from "./HList";
import { HNamespace } from "./HNamespace";
import { HStr } from "./HStr";
import { HSymbol } from "./HSymbol";
import { HUri } from "./HUri";
import { HVal, OptionalHVal, valueIsKind } from "./HVal";
import { Kind } from "./Kind";
import {
    NormalizationLogger,
    DefaultNormalizationLogger,
    formatNormalizationMessage,
} from "./NormalizationLogger";

/**
 * A dict for a def.
 *
 * https://project-haystack.dev/doc/lib-ph/def
 */
export interface HDefDict extends HDict {
    def: HSymbol;
}

/**
 * A type guard that returns true if the value is a def dict.
 *
 * @param value The value to test.
 * @returns True if the value matches.
 */
export function isDefDict(value: unknown): value is HDefDict {
    return (
        valueIsKind<HDict>(value, Kind.Dict) &&
        !!value.get("def")?.isKind(Kind.Symbol)
    );
}

/**
 * A dict for a defx.
 *
 * A `defx` is an extension to an existing def.
 *
 * https://project-haystack.dev/doc/lib-ph/def
 */
export interface HDefxDict extends HDict {
    defx: HSymbol;
}

/**
 * A type guard that returns true if the value is a defx dict.
 *
 * @param value The value to test.
 * @returns True if the value matches.
 */
export function isDefxDict(value: unknown): value is HDefxDict {
    return (
        valueIsKind<HDict>(value, Kind.Dict) &&
        !!value.get("defx")?.isKind(Kind.Symbol)
    );
}

/**
 * A dict for a lib.
 *
 * https://project-haystack.dev/doc/lib-ph/lib
 */
export interface HLibDict extends HDefDict {
    doc: HStr;
    version: HStr;
    baseUri: HUri;
    depends?: HList<HSymbol>;
}

/**
 * A type guard that returns true if the value is a lib dict.
 *
 * @param value The value to test.
 * @returns True if the value matches.
 */
export function isLibDict(value: unknown): value is HLibDict {
    if (!isDefDict(value)) {
        return false;
    }

    const dict = value as HDict;

    const def = dict.get<HSymbol>("def");

    return !!(
        def?.value?.startsWith("lib:") &&
        dict.get("doc")?.isKind(Kind.Str) &&
        dict.get("version")?.isKind(Kind.Str) &&
        dict.get("baseUri")?.isKind(Kind.Uri)
    );
}

/**
 * A Haystack Lib.
 *
 * https://project-haystack.dev/doc/docHaystack/Namespaces#libs
 */
export interface HLib {
    /**
     * The unique name of the lib.
     *
     * This should map to the lib's unique def symbol name (i.e. `lib:ph`).
     */
    name: string;

    /**
     * The lib dict.
     */
    lib: HLibDict;

    /**
     * All the library's dicts. This should also include the lib dict.
     */
    dicts: (HDefDict | HDefxDict)[];
}

/**
 * An asynchronous scanner for libs.
 */
export interface LibScanner {
    (): Iterable<Promise<HLib>>;
}

/**
 * The parsed effective defs result.
 */
interface EffectiveDefs {
    /**
     * All the defs detected.
     */
    defs: HDefDict[];

    /**
     * All the defx extensions detected.
     */
    defxs: HDefxDict[];

    /**
     * All the defs detected.
     */
    defNameToDef: Map<string, HDefDict>;

    /**
     * Maps a def name to a lib.
     */
    defNameToLib: Map<string, HLib>;

    /**
     * Maps a def/defx dict to a lib.
     */
    defDefxToLib: Map<HDefDict | HDefxDict, HLib>;
}

/**
 * A def node in the def tree.
 */
class DefTreeNode {
    readonly def: HDefDict;
    readonly parents: DefTreeNode[] = [];
    readonly children: DefTreeNode[] = [];

    constructor(def: HDefDict) {
        this.def = def;
    }

    /**
     * Return true if the def extends the given sub type.
     *
     * Please note, false will be returned if the type matches
     * this def exactly (i.e. the types are the same).
     *
     * @param type The type to check.
     * @returns True if the def extends the given type.
     */
    extends(type: string): boolean {
        for (const parent of this.parents) {
            if (parent.def.defName === type || parent.extends(type)) {
                return true;
            }
        }

        return false;
    }
}

/**
 * A def tree with a hierarchy of super and sub types.
 */
class DefTree {
    /**
     * The child roots.
     */
    public readonly rootChildren: DefTreeNode[];

    /**
     * A map of all the def names to defs.
     */
    readonly #nodes: Map<string, DefTreeNode>;

    /**
     * Construct a new def tree.
     *
     * @param nodes The node map for the tree.
     */
    constructor(nodes: Map<string, DefTreeNode>) {
        this.#nodes = nodes;

        // Pull the root children.
        this.rootChildren = [
            nodes.get(Kind.Marker) as DefTreeNode,
            nodes.get("val") as DefTreeNode,
            nodes.get("feature") as DefTreeNode,
        ];
    }

    /**
     * Find the def tree node with the specified name and return it.
     * Return undefined if it can't be found.
     *
     * @param name The def name.
     * @return The def tree node or undefined.
     */
    public find(name: string): DefTreeNode | undefined {
        return this.#nodes.get(name);
    }
}

/**
 * Compiles a number of def libs into a namespace.
 *
 * Typically this is used server side to build a defs namespace from a number
 * of POD files.
 *
 * https://project-haystack.dev/doc/docHaystack/Normalization
 */
export class HNormalizer {
    /**
     * The scanner for asynchronously finding libs.
     */
    readonly #scanner: LibScanner;

    /**
     * A logger used to capture any messages/errors.
     */
    readonly #logger: NormalizationLogger;

    /**
     * Construct a new normalizer.
     *
     * @param scanner A scanner for finding libs.
     * @param logger A logger used to handle any errors encountered during normalization.
     */
    public constructor(scanner: LibScanner, logger?: NormalizationLogger) {
        this.#scanner = scanner;
        this.#logger = logger ?? new DefaultNormalizationLogger();
    }

    /**
     * Normalize the libraries into a namespace and return it.
     *
     * https://project-haystack.dev/doc/docHaystack/Normalization#pipeline
     *
     * @returns The normalized defs namespace.
     */
    public async normalize(): Promise<HNamespace> {
        // 1. Traverse input libs to find trio files.
        const libs = await this.scan();

        // 2. Parse each trio file to discover the effective def and defx dicts.
        const effectiveDefs = this.parse(libs);

        // 3. Ensure every symbol tag maps to a def.
        this.resolve(effectiveDefs);

        // 4. Compute taxonomy tree of supertype/subtypes.
        const defTree = this.taxonify(effectiveDefs);

        // 5. Add defx tags to each declared def.
        this.defx(effectiveDefs);

        // 6. Normalize Tags: normalize def tags.
        this.normalizeTags(defTree, effectiveDefs);

        // 7. Recursively apply supertype tags into subtypes.
        this.inherit(defTree.rootChildren, effectiveDefs);

        // 8. Perform additional sanity checks.
        this.validate(defTree, effectiveDefs);

        // 9. Generate the namespace from the normalized defs.
        return this.generate(effectiveDefs.defs);
    }

    /**
     * Returns true if the verification of the tag should be skipped.
     *
     * @param name The name of the tag.
     * @returns True if the tag should be skipped for verification during normalization.
     */
    private skipTag(name: string): boolean {
        // Skip any checks for `includes`. The `includes` tag is not supported
        // but this will prevent errors being thrown.
        return name === "includes";
    }

    /**
     * Handle a warning message.
     *
     * A warning always reports a problem. The problem won't effect the
     * integrity of the normalized namespace.
     *
     * @param message The message.
     * @param lex The lexicon id the warning relates to.
     * @param args Any arguments used in the warning.
     */
    private warning(lex: string, args?: Record<string, string>): void {
        this.#logger.warning(formatNormalizationMessage(lex, args), lex, args);
    }

    /**
     * Handle an error message.
     *
     * An error always reports a problem that will cause a problem
     * with the normalized namespace. The normalized database should
     * be considered partially corrupt if this method is called.
     *
     * @param message The message.
     * @param lex The lexicon id the warning relates to.
     * @param args Any arguments used in the warning.
     */
    private error(lex: string, args?: Record<string, string>): void {
        this.#logger.error(formatNormalizationMessage(lex, args), lex, args);
    }

    /**
     * Handle a fatal error message.
     *
     * Normalization cannot continue if this is reached. This error
     * must be fixed before normalization can continue.
     *
     * @param message The message.
     * @param lex The lexicon id the warning relates to.
     * @param args Any arguments used in the warning.
     * @returns An error for the caller to throw immediately.
     */
    private fatal(lex: string, args?: Record<string, string>): Error {
        const message = formatNormalizationMessage(lex, args);

        this.#logger.fatal(message, lex, args);

        return new Error(message);
    }

    //////////////////////////////////////////////////////////////////////////
    // 1. Scan
    //////////////////////////////////////////////////////////////////////////

    /**
     * Scan asynchronously for the input libs.
     *
     * https://project-haystack.dev/doc/docHaystack/Normalization#scan
     *
     * @returns An array of libs.
     * @throws An error if a lib is found to be invalid.
     */
    private async scan(): Promise<HLib[]> {
        const libs: HLib[] = [];

        for await (const lib of this.#scanner()) {
            if (isLibDict(lib.lib)) {
                libs.push(lib);
            } else {
                this.warning("invalidLib", { libName: lib.name });
            }
        }

        return libs;
    }

    //////////////////////////////////////////////////////////////////////////
    // 2. Parse
    //////////////////////////////////////////////////////////////////////////

    /**
     * Parse the libs to discover def and defx dicts.
     *
     * https://project-haystack.dev/doc/docHaystack/Normalization#parse
     *
     * @param libs The libs to parse.
     * @returns The resultant effective defs and defx.
     */
    private parse(libs: HLib[]): EffectiveDefs {
        const effectiveDefs: EffectiveDefs = {
            defs: [],
            defxs: [],
            defNameToDef: new Map(),
            defNameToLib: new Map(),
            defDefxToLib: new Map(),
        };

        for (const lib of libs) {
            for (const dict of lib.dicts) {
                if (isDefDict(dict)) {
                    if (effectiveDefs.defNameToDef.has(dict.defName)) {
                        this.error("defAlreadyExists", {
                            defName: dict.defName,
                            libName: lib.name,
                            originalLibName:
                                effectiveDefs.defNameToLib.get(dict.defName)
                                    ?.name ?? "",
                        });
                    }

                    effectiveDefs.defNameToDef.set(dict.defName, dict);
                    effectiveDefs.defs.push(dict);

                    // Map the def name (used as a tag) to the lib.
                    effectiveDefs.defNameToLib.set(dict.defName, lib);

                    // Map the dict instance to the lib.
                    effectiveDefs.defDefxToLib.set(dict, lib);
                } else if (isDefxDict(dict)) {
                    effectiveDefs.defxs.push(dict);

                    // Map the defx instance to a lib.
                    effectiveDefs.defDefxToLib.set(dict, lib);
                } else {
                    this.warning("dictIsNotDefOrDefx", { libName: lib.name });
                }
            }
        }

        return effectiveDefs;
    }

    //////////////////////////////////////////////////////////////////////////
    // 3. Resolve
    //////////////////////////////////////////////////////////////////////////

    /**
     * Ensure every symbol maps to a def.
     *
     * https://project-haystack.dev/doc/docHaystack/Normalization#resolve
     *
     * @param effectiveDefs The parsed defs.
     * @throws An error if a symbol does not map.
     */
    private resolve(effectiveDefs: EffectiveDefs): void {
        this.resolveDefsTagsInLibNamespace(effectiveDefs.defs, effectiveDefs);
        this.resolveDefsTagsInLibNamespace(effectiveDefs.defxs, effectiveDefs);
    }

    /**
     * Resolve all the tags in a def to ensure they belong to
     * the dependent lib namespaces.
     *
     * @param defs The defs to extact the tags from.
     * @param effectiveDefs The parsed defs.
     * @throws An error if the tags don't map to a lib namespace.
     */
    private resolveDefsTagsInLibNamespace(
        defs: HDefDict[] | HDefxDict[],
        effectiveDefs: EffectiveDefs
    ): void {
        for (const def of defs) {
            const defLib = effectiveDefs.defDefxToLib.get(def);

            if (!defLib) {
                throw this.fatal("couldNotFindLibForDef", {
                    defName: isDefDict(def) ? def.defName : def.defx.value,
                });
            }

            for (const tag of def.keys) {
                // 1. Every tag name must resolve to a tag def in its lib namespace.
                this.resolveTagInLibNamespace(tag, effectiveDefs, defLib);

                const value = def.get(tag);
                if (value) {
                    // 2. Every symbol used as a tag value must resolve.
                    if (valueIsKind<HSymbol>(value, Kind.Symbol)) {
                        this.resolveTagInLibNamespace(
                            value.value,
                            effectiveDefs,
                            defLib
                        );
                    }

                    // 3. Every list of symbols in a tag value must individually resolve.
                    if (valueIsKind<HList<HSymbol>>(value, Kind.List)) {
                        for (const listVal of value) {
                            if (valueIsKind<HSymbol>(listVal, Kind.Symbol)) {
                                this.resolveTagInLibNamespace(
                                    listVal.value,
                                    effectiveDefs,
                                    defLib
                                );
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * Resolve the tag name in the lib namespace.
     *
     * @param tag The tag to resolve.
     * @param effectiveDefs The parsed defs.
     * @param defLib The originating def's lib.
     * @throws An error if the tag name can't be resolved in the lib namespace.
     */
    private resolveTagInLibNamespace(
        tag: string,
        effectiveDefs: EffectiveDefs,
        defLib: HLib
    ): void {
        if (this.skipTag(tag)) {
            return;
        }

        const tagLib = effectiveDefs.defNameToLib.get(tag);

        if (!tagLib) {
            throw this.fatal("couldNotFindLibForDef", {
                defName: tag,
            });
        }

        let found = false;

        if (defLib !== tagLib) {
            if (defLib.lib.depends) {
                for (const dependLibSymbol of defLib.lib.depends) {
                    if (dependLibSymbol) {
                        const dependLib = effectiveDefs.defNameToLib.get(
                            dependLibSymbol.value
                        );

                        if (!dependLib) {
                            this.error("libNotFound", {
                                libName: dependLibSymbol.value,
                                originalLibName: defLib.name,
                            });
                        }

                        if (dependLib === tagLib) {
                            found = true;
                            break;
                        }
                    }
                }
            }
        } else {
            found = true;
        }

        if (!found) {
            this.error("tagNotFoundInAnyLib", { defName: tag });
        }
    }

    //////////////////////////////////////////////////////////////////////////
    // 4. Taxonify
    //////////////////////////////////////////////////////////////////////////

    /**
     * Compute the super/sub type tree.
     *
     * https://project-haystack.dev/doc/docHaystack/Normalization#taxonify
     *
     * @param effectiveDefs The effective defs.
     * @returns A hierarchy of nodes.
     */
    private taxonify(effectiveDefs: EffectiveDefs): DefTree {
        // A cache of the nodes added to the tree.
        const nodes = new Map<string, DefTreeNode>();

        // 1. compute the supertype/subtype tree based on the is tag.
        for (const defName of effectiveDefs.defNameToDef.keys()) {
            this.addDefTreeNode(defName, effectiveDefs, nodes);
        }

        return new DefTree(nodes);
    }

    /**
     * Add the def as a tree node.
     *
     * @param defName The name of the def to add.
     * @param effectiveDefs A cache of effective defs.
     * @param nodes The node cache.
     */
    private addDefTreeNode(
        defName: string,
        effectiveDefs: EffectiveDefs,
        nodes: Map<string, DefTreeNode>
    ): DefTreeNode {
        let node = nodes.get(defName);

        // Short circuit if the node has already been added.
        if (node) {
            return node;
        }

        const def = effectiveDefs.defNameToDef.get(defName);

        if (!def) {
            throw this.fatal("defNotFound", { defName });
        }

        let is = def.get("is") as undefined | HSymbol | HList<HSymbol>;

        // 2. infer the is on feature key defs.
        if (!is) {
            // 3. verify every non-feature key has is tag with exception of
            // following root tags: marker, val, and feature.

            if (HNamespace.isFeature(defName)) {
                const feature = defName.substring(0, defName.indexOf(":"));

                if (!feature) {
                    throw this.fatal("invalidFeature", { defName });
                }

                // Infer the `is` assocation from the feature key name. Update
                // the def with this assocation.
                is = HList.make<HSymbol>(HSymbol.make(feature));
                def.set("is", is);
            } else if (
                defName !== Kind.Marker &&
                defName !== "val" &&
                defName !== "feature"
            ) {
                this.error("defDoesNotDeclareIs", { defName });

                // Default a marker without an 'is' to a marker.
                is = HList.make<HSymbol>(HSymbol.make(Kind.Marker));
                def.set("is", is);
            }
        } else if (HNamespace.isFeature(defName)) {
            // Ensure a feature hasn't got an `is` tag already defined.
            this.error("featureShouldNotDeclareIs", { defName });
        }

        node = new DefTreeNode(def);

        nodes.set(defName, node);

        if (is) {
            const isList = is.isKind(Kind.List)
                ? (is as HList<HSymbol>)
                : [is as HSymbol];

            for (const parent of isList) {
                if (parent) {
                    const parentNode = this.addDefTreeNode(
                        parent.value,
                        effectiveDefs,
                        nodes
                    );

                    parentNode.children.push(node);
                    node.parents.push(parentNode);
                }
            }
        }

        return node;
    }

    //////////////////////////////////////////////////////////////////////////
    // 5. Defx
    //////////////////////////////////////////////////////////////////////////

    /**
     * Add defx tags to each declared def.
     *
     * https://project-haystack.dev/doc/docHaystack/Normalization#defx
     *
     * @param effectiveDefs The effective defs.
     */
    private defx(effectiveDefs: EffectiveDefs): void {
        for (const defx of effectiveDefs.defxs) {
            const defxName = defx.defx.value;
            const def = effectiveDefs.defNameToDef.get(defxName);

            if (!def) {
                this.error("cannotFindDefForDefx", {
                    defName: defxName,
                    libName:
                        effectiveDefs.defNameToLib.get("defxName")?.name ??
                        "Unknown",
                });
                continue;
            }

            for (const tag of defx.keys) {
                if (tag === "defx") {
                    continue;
                }

                const tagDef = effectiveDefs.defNameToDef.get(tag);

                if (!tagDef) {
                    throw this.fatal("defNotFound", { defName: tag });
                }

                let defxValue = defx.get(tag);

                // Every defx must reference a def within its scope and must only add new tags.
                // It is illegal for a defx to specify a tag declared by the def itself or by another defx.
                // The exception to this rule is tags annotated as accumulate which should be aggregated
                // into a list.

                if (tagDef.has("accumulate") && defxValue) {
                    defxValue = this.accumulateToList(def.get(tag), defxValue);
                } else if (def.has(tag)) {
                    this.error("cannotOverwriteDefTagFromDefx", {
                        defName: defxName,
                        tag,
                        libName:
                            effectiveDefs.defDefxToLib.get(defx)?.name ??
                            "Unknown",
                    });

                    // We cannot overwrite so make this undefined.
                    defxValue = undefined;
                }

                if (defxValue) {
                    def.set(tag, defxValue);
                }
            }
        }
    }

    /**
     * Accumulate the new value with the current value and return it.
     *
     * @param currentVal The current value.
     * @param newVal The new value.
     * @returns The new accumulated value with a list.
     */
    private accumulateToList(
        currentVal: HVal | undefined | null,
        newVal: HVal
    ): HList {
        const newList = newVal.isKind(Kind.List)
            ? (newVal as HList)
            : HList.make(newVal);

        let currentList: HList;
        if (currentVal) {
            currentList = currentVal.isKind(Kind.List)
                ? (currentVal as HList)
                : HList.make(currentVal);
        } else {
            currentList = HList.make([]);
        }

        const list = HList.make<OptionalHVal>([]);

        for (const val of currentList) {
            list.push(val);
        }

        for (const val of newList) {
            if (!list.includes(val)) {
                list.push(val);
            }
        }

        return list;
    }

    //////////////////////////////////////////////////////////////////////////
    // 6. Normalize tags
    //////////////////////////////////////////////////////////////////////////

    /**
     * Normalize def tags.
     *
     * https://project-haystack.dev/doc/docHaystack/Normalization#normalizeTags
     *
     * @param defTree The super/sub def hierarchy.
     * @param effectiveDefs The effective defs.
     */
    private normalizeTags(
        defTree: DefTree,
        effectiveDefs: EffectiveDefs
    ): void {
        for (const def of effectiveDefs.defs) {
            const lib = effectiveDefs.defDefxToLib.get(def);

            if (!lib) {
                throw this.fatal("couldNotFindLibForDef", {
                    defName: def.defName,
                });
            }

            // 1. Add the inferrred lib tag to each def.
            def.set("lib", lib.lib.def);

            // 2. Normalize def tags which subtype from list.
            for (const tag of def.keys) {
                if (this.skipTag(tag)) {
                    continue;
                }

                const node = defTree.find(tag);

                if (!node) {
                    throw this.fatal("cannotFindDefNode", { defName: tag });
                }

                // Anything that extends list should normalize to a list.
                if (node.extends(Kind.List)) {
                    const tagVal = def.get(tag);

                    if (tagVal && !valueIsKind<HList>(tagVal, Kind.List)) {
                        def.set(tag, HList.make(tagVal));
                    }
                }
            }
        }
    }

    //////////////////////////////////////////////////////////////////////////
    // 7. Inherit
    //////////////////////////////////////////////////////////////////////////

    /**
     * Apply supertype tags into subtypes.
     *
     * https://project-haystack.dev/doc/docHaystack/Normalization#inherit
     *
     * @param effectiveDefs The effective defs.
     * @param defTree The super/sub def hierarchy.
     */
    private inherit(nodes: DefTreeNode[], effectiveDefs: EffectiveDefs): void {
        this.doInherit(nodes, effectiveDefs);
    }

    /**
     * Recursively apply supertype tags into subtypes.
     *
     * https://project-haystack.dev/doc/docHaystack/Normalization#inherit
     *
     * @param effectiveDefs The effective defs.
     * @param defTree The super/sub def hierarchy.
     */
    private doInherit(
        nodes: DefTreeNode[],
        effectiveDefs: EffectiveDefs
    ): void {
        // 1. Start with the def tags from previous steps.
        // 2. Each supertype is processed in order of declaration in the is tag.
        for (const node of nodes) {
            // 3. The supertype must recursively have its own inheritance normalized.
            this.normalizeInheritance(node, effectiveDefs);
            // Repeat the inheritance for all subtypes.
            this.doInherit(node.children, effectiveDefs);
        }
    }

    /**
     * Normalize the inheritance for a def.
     *
     * @param node The def node.
     * @param effectiveDefs The effective defs.
     */
    private normalizeInheritance(
        node: DefTreeNode,
        effectiveDefs: EffectiveDefs
    ): void {
        const tagsToAdd: Map<string, HVal> = new Map();

        this.findTagsToInheritFromSuperTypes(node, effectiveDefs, tagsToAdd);

        for (const tag of tagsToAdd.keys()) {
            const tagDef = effectiveDefs.defNameToDef.get(tag);

            if (!node.def.has(tag) || tagDef?.has("accumulate")) {
                node.def.set(tag, tagsToAdd.get(tag) as HVal);
            }
        }
    }

    /**
     * Recursively find all the super types for the node and record their inherited values.
     *
     * @param node The def node.
     * @param effectiveDefs The effective defs.
     * @param tagsToAdd The record tags to add.
     */
    private findTagsToInheritFromSuperTypes(
        node: DefTreeNode,
        effectiveDefs: EffectiveDefs,
        tagsToAdd: Map<string, HVal>
    ): void {
        for (const tag of node.def.keys) {
            if (this.skipTag(tag)) {
                continue;
            }

            const tagDef = effectiveDefs.defNameToDef.get(tag);

            if (!tagDef) {
                throw this.fatal("defNotFound", { defName: tag });
            }

            // 4. Filter out any tags from the supertype marked as notInherited
            if (!tagDef.has("notInherited")) {
                let value = node.def.get(tag);

                if (value) {
                    // 5. Inherit all tags from previous step which are not yet declared nor inherited
                    // from other supertypes.
                    // 6. If the tag is marked as accumulate then inheritance is aggregated.
                    if (tagDef.has("accumulate")) {
                        value = this.accumulateToList(
                            tagsToAdd.get(tag),
                            value
                        );
                        tagsToAdd.set(tag, value);
                    } else {
                        if (!tagsToAdd.has(tag)) {
                            tagsToAdd.set(tag, value);
                        }
                    }
                }
            }
        }

        for (const parent of node.parents) {
            this.findTagsToInheritFromSuperTypes(
                parent,
                effectiveDefs,
                tagsToAdd
            );
        }
    }

    //////////////////////////////////////////////////////////////////////////
    // 8. Validation
    //////////////////////////////////////////////////////////////////////////

    /**
     * Perform additional sanity checks.
     *
     * https://project-haystack.dev/doc/docHaystack/Normalization#validate
     *
     * @param defTree The def tree.
     * @param effectiveDefs The effective defs.
     * @throws An error if one of the validation steps fail.
     */
    private validate(defTree: DefTree, effectiveDefs: EffectiveDefs): void {
        // 1. Verify every lib meta def has required tags - already checked in scan so not required here.

        for (const def of effectiveDefs.defs) {
            const defName = def.defName;

            const node = defTree.find(defName);

            if (!node) {
                throw this.fatal("cannotFindDefNode", { defName });
            }

            const isDefRef = node.extends(Kind.Ref);

            for (const tag of def.keys) {
                if (this.skipTag(tag)) {
                    continue;
                }

                const tagValue = def.get(tag);

                if (!tagValue) {
                    continue;
                }

                const tagNode = defTree.find(tag);

                if (!tagNode) {
                    throw this.fatal("cannotFindDefNode", { defName: tag });
                }

                // 2. Verify tag values match their def's declared types.
                this.verifyValuesMatchDefTypes(tag, tagNode, tagValue, defName);

                // 5. Verify no defs declare a computed tag.
                this.verifyComputedIsNotDeclared(tag, tagNode, defName);

                // 8. Verify relationship tags are only used on defs which subtype from ref.
                if (!isDefRef && tagNode.extends("relationship")) {
                    this.error("relationshipCannotBeUsedOnNonRef", {
                        defName,
                        tag,
                    });
                }
            }

            // 3. Verify no def named index which is reserved for documentation purposes.
            if (defName === "index") {
                this.error("noDefIndex");
            }

            // 4. Verify every term in a conjunct is a marker.
            this.verifyEveryTermInAConjuctIsMarker(defName, defTree);

            // 6. Verify choice `of` is subtype of marker.
            this.verifyChoiceOfIsMarker(node, defTree);

            // 7. Verify tagOn only used on a tag defs (not conjuncts or feature keys).
            this.verifyTagOnOnlyUsedForTagDefs(def);
        }
    }

    /**
     * Verify the values match their declared def types.
     *
     * For example, ensure a declared marker tag has a value type that is a marker.
     *
     * @param defName The tag's def name.
     * @param tagName The tag name.
     * @param tagDefNode The tag def tree node.
     * @param tagValue The tag value.
     * @throws An error if the type doesn't match.
     */
    private verifyValuesMatchDefTypes(
        tagName: string,
        tagDefNode: DefTreeNode,
        tagValue: HVal,
        defName: string
    ): void {
        for (const kind of Object.values(Kind)) {
            if (tagDefNode.extends(kind) && !valueIsKind(tagValue, kind)) {
                // If the value does not match then test to see if this
                // is an accumulated value (i.e. a list of the values).
                const accumuatedOk =
                    tagDefNode.def.has("accumulate") &&
                    valueIsKind<HList>(tagValue, Kind.List) &&
                    (tagValue as HList)
                        .toArray()
                        .every((val) => val?.isKind(kind));

                if (!accumuatedOk) {
                    this.error("tagIsNotKind", {
                        defName: defName,
                        tag: tagName,
                        kind,
                    });
                }
            }
        }
    }

    /**
     * Verify a tag that is marked with the `computed` tag is not declared.
     *
     * Defs with the `computed` tag can never be declared in a def.
     *
     * @param tag The tag name.
     * @param tagNode The tag def's tree node.
     * @param defName The name of def the tag is declared on.
     * @throws An error if the tag def has a computed tag.
     */
    private verifyComputedIsNotDeclared(
        tag: string,
        tagNode: DefTreeNode,
        defName: string
    ): void {
        if (tagNode.def.has("computed")) {
            this.error("noComputed", { defName, tag });
        }
    }

    /**
     * Verify each term in a conjuct contains a def that is a marker.
     *
     * @param name The conjunct name.
     * @param defTree The def node tree.
     * @throws An error if a conjunct contains a name that is not a marker.
     */
    private verifyEveryTermInAConjuctIsMarker(
        name: string,
        defTree: DefTree
    ): void {
        if (HNamespace.isConjunct(name)) {
            for (const tag of HNamespace.splitConjunct(name)) {
                if (!defTree.find(tag)?.extends(Kind.Marker)) {
                    this.error("tagInConjunctNotMarker", {
                        defName: name,
                        tag,
                    });
                }
            }
        }
    }

    /**
     * Verify a def that extends choice has an `of` tag that references a def symbol that is a marker.
     *
     * @param node The def tree node.
     * @param defTree The def tree.
     * @throws An error if a marker super type is not found for the def of `of`.
     */
    private verifyChoiceOfIsMarker(node: DefTreeNode, defTree: DefTree): void {
        if (node.extends("choice")) {
            const ofValue = node.def.get<HSymbol>("of");

            if (ofValue && !defTree.find(ofValue.value)?.extends(Kind.Marker)) {
                this.error("ofChoiceNotMarker", { defName: node.def.defName });
            }
        }
    }

    /**
     * Verify `tagOn` is not used on conjunct or feature defs.
     *
     * @param def The def to check.
     * @throws An error if the `tagOn` is illegally declared.
     */
    private verifyTagOnOnlyUsedForTagDefs(def: HDefDict): void {
        const defName = def.defName;

        if (
            def.has("tagOn") &&
            (HNamespace.isConjunct(defName) || HNamespace.isFeature(defName))
        ) {
            this.error("cannotUseTagOnInConjunctOrFeature", { defName });
        }
    }

    //////////////////////////////////////////////////////////////////////////
    // 9. Generation
    //////////////////////////////////////////////////////////////////////////

    /**
     * Generate the namespace from the normalized defs.
     *
     * @param defs The defs to generate the namespace from.
     * @returns The generated namespace.
     */
    private generate(defs: HDefDict[]): HNamespace {
        return new HNamespace(HGrid.make({ rows: defs }));
    }
}
