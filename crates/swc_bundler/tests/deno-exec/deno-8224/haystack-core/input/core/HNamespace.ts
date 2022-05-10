/*
 * Copyright (c) 2020, J2 Innovations. All Rights Reserved
 */

import { HGrid } from "./HGrid";
import { HDict } from "./HDict";
import { HStr } from "./HStr";
import { HList } from "./HList";
import { HSymbol } from "./HSymbol";
import { Kind } from "./Kind";
import { memoize } from "../util/memoize";
import { ZincReader } from "./ZincReader";
import { valueIsKind, OptionalHVal } from "./HVal";
import { HMarker } from "./HMarker";
import { HRef } from "./HRef";

export interface Defs {
    [prop: string]: HDict;
}

export interface NameToDefs {
    [prop: string]: HDict[];
}

/**
 * A unit dict.
 */
export interface Unit extends HDict {
    quantity: HStr;
    name: HStr;
    symbol: HStr;
}

/**
 * The result of a reflection operation.
 */
export class Reflection {
    /**
     * The resultant defs.
     */
    public readonly defs: readonly HDict[];

    /**
     * The source dict analysed.
     */
    public readonly subject: HDict;

    /**
     * The associated namespace.
     */
    public readonly namespace: HNamespace;

    public constructor(defs: HDict[], subject: HDict, namespace: HNamespace) {
        this.defs = defs;
        this.subject = subject;
        this.namespace = namespace;
    }

    /**
     * Return true if any of the subject's tags fit the given base def.
     *
     * @param base The base def.
     * @returns True if the subject's tags fit the base.
     */
    public fits(base: string | HSymbol): boolean {
        for (const def of this.defs) {
            if (this.namespace.fits(def.defName, base)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Return the reflection result as a grid.
     */
    public toGrid(): HGrid {
        return HGrid.make({ rows: this.defs as HDict[] });
    }

    /**
     * Return the primary entity type of `dict` if no entity markers
     * are implemented.
     */
    @memoize()
    public get type(): HDict {
        const entity = this.namespace.byName("entity");

        let type: HDict | undefined;

        if (entity) {
            for (const def of this.defs) {
                if (this.namespace.inheritance(def.defName).includes(entity)) {
                    type = def;
                    break;
                }
            }
        }

        return type ?? (this.namespace.byName("dict") as HDict);
    }
}

/**
 * The default namespace for the environment.
 */
let defaultNamespace: HNamespace;

/**
 * Haystack namespace.
 *
 * A namespace holds a collection of normalized defs.
 */
export class HNamespace {
    /**
     * The underlying grid containing the defs.
     */
    private readonly $grid: HGrid;

    /**
     * Constructs a new namespace.
     *
     * @param defs A grid of normalized defined defs.
     */
    public constructor(grid: HGrid) {
        this.$grid = grid;
    }

    /**
     * @returns The default namespace for the environment.
     */
    public static get defaultNamespace(): HNamespace {
        return (
            defaultNamespace ??
            (defaultNamespace = new HNamespace(HGrid.make({})))
        );
    }

    /**
     * Set the default namespace for the environment.
     *
     * @param namespace The new default namespace.
     */
    public static set defaultNamespace(namespace: HNamespace) {
        defaultNamespace = namespace;
    }

    /**
     * Returns a defs lookup map.
     *
     * Since defs are keyed by a symbol this map provides fast look up.
     *
     * @returns A object with key to value defs.
     */
    @memoize()
    public get defs(): Defs {
        const defs: Defs = {};

        // Create a cache of symbol to defs so we can
        // quickly look up information.
        for (const dict of this.$grid) {
            const name = dict.defName;

            if (name) {
                defs[String(name)] = dict;
            }
        }

        return defs;
    }

    /**
     * Return a def via its name or undefined if it can't be found.
     *
     * @param name The name of the def to look up.
     * @returns The def or undefined if it can't be found.
     */
    public byName(name: string | HSymbol): HDict | undefined {
        return this.defs[String(name)];
    }

    /**
     * Return a def via its name or undefined if it can't be found.
     *
     * This method is a duplicate of `byName`.
     *
     * @param name The name of the def to look up.
     * @returns The def or undefined if it can't be found.
     */
    public get(name: string | HSymbol): HDict | undefined {
        return this.byName(name);
    }

    /**
     * Return true if the def exists in the namespace.
     *
     * @param name The name of the def to look up.
     * @returns True if the def exists.
     */
    public hasName(name: string | HSymbol): boolean {
        return !!this.defs[String(name)];
    }

    /**
     * Return true if the def exists in the namespace.
     *
     * This method is a duplicate of `hasName`.
     *
     * @param name The name of the def to look up.
     * @returns True if the def exists.
     */
    public has(name: string | HSymbol): boolean {
        return this.hasName(name);
    }

    /**
     * Return an array of dicts via their names. If a name can't
     * be found then throw an error.
     *
     * @param names The names of the defs to look up.
     * @returns A array of defs.
     * @throws An error if the def can't be found.
     */
    public byAllNames(
        ...names: (string | string[] | HSymbol | HSymbol[])[]
    ): HDict[] {
        const nameList = names.reduce(
            (
                ns: string[],
                name: string | string[] | HSymbol | HSymbol[]
            ): string[] =>
                // Flatten the name list.
                ns.concat(
                    Array.isArray(name)
                        ? (name as (string | HSymbol)[]).map(
                              (nm: string | HSymbol): string => String(nm)
                          )
                        : [String(name)]
                ),
            []
        );

        const dicts: HDict[] = [];
        for (const name of nameList) {
            const dict = this.byName(name);

            if (dict) {
                dicts.push(dict);
            } else {
                throw new Error(`Could not find ${name}`);
            }
        }

        return dicts;
    }

    /**
     * @returns A list of all available conjunct defs.
     */
    @memoize()
    public get conjuncts(): readonly HDict[] {
        const defs = this.defs;
        return Object.keys(defs)
            .filter(HNamespace.isConjunct)
            .map((name): HDict => defs[name]);
    }

    /**
     * Return true if the name is for a conjunct.
     *
     * @param name The name to test.
     * @returns True if the name is for a conjunct.
     */
    public static isConjunct(name: string | HSymbol): boolean {
        return String(name).includes("-");
    }

    /**
     * Split the conjunct name into its component parts.
     *
     * @param name The name to split.
     * @returns The split marker tag names for the conjunct.
     */
    public static splitConjunct(name: string | HSymbol): string[] {
        return String(name).split("-");
    }

    /**
     * Decomposes a conjunct into its respective defs and returns them.
     *
     * If the def is not a conjunct then it will just return itself.
     *
     * @param name The conjunct def to breakdown.
     * @returns The defs the conjunct references.
     * @throws An error if any of the defs are invalid.
     */
    public conjunctDefs(name: string | HSymbol): HDict[] {
        return this.byAllNames(HNamespace.splitConjunct(name));
    }

    /**
     * Cache built to speed calculation of conjuncts.
     *
     * Example:
     * ```
     * {
     *   "ac": [
     *   	["elec"],
     *   	["elec", "meter"],
     *   	["freq"]
     *   ],
     *   "active": [
     *   	["power"]
     *   ],
     *   "air": [
     *   	["temp"]
     *   ],
     *   ...
     * }
     * ```
     */
    @memoize()
    private get $conjunctsKeyMap(): Record<string, string[][]> {
        return this.conjuncts
            .map((d) => HNamespace.splitConjunct(d.defName))
            .reduce((a, c) => {
                const key = c[0];
                if (!a[key]) {
                    a[key] = [];
                }
                a[key].push(c.slice(1));
                return a;
            }, {} as Record<string, string[][]>);
    }

    /**
     * Find all the conjuncts for the markers.
     *
     * @param markers The markers
     * @param conjuncts The found conjuncts.
     */
    private findConjuncts(markers: string[], conjuncts: HDict[]): void {
        const map = this.$conjunctsKeyMap;
        for (const marker of markers) {
            const match = map[marker];
            if (match) {
                match.forEach((m) => {
                    if (m.every((t) => markers.includes(t))) {
                        const def = this.byName([marker, ...m].join("-"));
                        if (def) {
                            conjuncts.push(def);
                        }
                    }
                });
            }
        }
    }

    /**
     * @returns A list of feature defs.
     */
    @memoize()
    public get features(): readonly HDict[] {
        const defs = this.defs;
        return Object.keys(defs)
            .filter(HNamespace.isFeature)
            .map((name): HDict => defs[name]);
    }

    /**
     * Return true if the name is for a feature.
     *
     * @param name The name to test.
     * @returns True if the name is for a feature.
     */
    public static isFeature(name: string | HSymbol): boolean {
        return String(name).includes(":");
    }

    /**
     * @returns A list of all the libs implemented by this namespace.
     */
    @memoize()
    public get libs(): HDict[] {
        return this.subTypesOf("lib");
    }

    /**
     * Returns the subtypes of the type.
     *
     * @param name The def name.
     * @returns The subtypes.
     */
    public subTypesOf(name: string | HSymbol): HDict[] {
        return this.subTypes[String(name)] ?? [];
    }

    /**
     * Returns true if the def has subtypes.
     *
     * @param name The def name.
     * @returns True if the def has subtypes.
     */
    public hasSubTypes(name: string | HSymbol): boolean {
        return !!this.subTypes[String(name)];
    }

    /**
     * Returns a flattened list of all the subtypes.
     *
     * @param name The def name.
     * @returns A list of subtypes.
     */
    public allSubTypesOf(name: string | HSymbol): HDict[] {
        const subTypes = new Set<HDict>();
        this.findSubTypes(name, subTypes);
        return [...subTypes];
    }

    /**
     * Find all the specified subtypes.
     *
     * @param name The def name.
     * @param subTypes The subtypes Set.
     */
    private findSubTypes(name: string | HSymbol, subTypes: Set<HDict>): void {
        const defs = this.subTypesOf(name);

        for (const dict of defs) {
            subTypes.add(dict);
            this.findSubTypes(dict.defName, subTypes);
        }
    }

    /**
     * Returns an object with name to subtype defs.
     *
     * This enables quick look up of a type's subtypes.
     *
     * @returns A name to subtype def object.
     */
    @memoize()
    private get subTypes(): NameToDefs {
        const subTypes: NameToDefs = {};
        const defs = this.defs;

        for (const name in defs) {
            const def = this.byName(name);
            if (def) {
                // Find the supertypes of the type.
                const is = def.get<HList<HSymbol | null>>("is");
                if (is) {
                    // Create an entry in the cache of type to subtypes.
                    for (const superName of is) {
                        if (superName) {
                            const subs =
                                subTypes[superName.value] ??
                                (subTypes[superName.value] = []);

                            subs.push(def);
                        }
                    }
                }
            }
        }

        return subTypes;
    }

    /**
     * Returns the supertypes of a def or an empty array if it can't be found.
     *
     * @param name The def name.
     * @returns The supertype defs.
     */
    public superTypesOf(name: string | HSymbol): HDict[] {
        return this.has(name) ? this.doSuperTypesOf(name) : [];
    }

    @memoize()
    private doSuperTypesOf(name: string | HSymbol): HDict[] {
        return (
            this.byName(name)
                ?.get<HList<HSymbol | null>>("is")
                ?.reduce(this.reduceNameToDef, []) ?? []
        );
    }

    /**
     * Returns a flattened list of all the supertypes in the whole supertype chain.
     *
     * @param name The def name.
     * @returns A list of supertypes.
     */
    public allSuperTypesOf(name: string | HSymbol): HDict[] {
        const superTypes = new Set<HDict>();
        this.findSuperTypes(name, superTypes);
        return [...superTypes];
    }

    /**
     * Find all the specified supertypes.
     *
     * @param name The def name.
     * @param superTypes The supertypes Set.
     */
    private findSuperTypes(
        name: string | HSymbol,
        superTypes: Set<HDict>
    ): void {
        const defs = this.superTypesOf(name);

        for (const dict of defs) {
            superTypes.add(dict);
            this.findSuperTypes(dict.defName, superTypes);
        }
    }

    /**
     * Returns the choices for def.
     *
     * @param name The def name.
     * @returns The choices for a def.
     */
    public choicesFor(name: string | HSymbol): HDict[] {
        let choices: HDict[] | undefined;

        const ofVal = this.byName(name)?.get("of");
        if (ofVal) {
            choices = this.subTypesOf(String(ofVal));
        }

        return choices ?? [];
    }

    /**
     * @returns An object containing names to subtypes for
     * all defs that are choices.
     */
    @memoize()
    public get choices(): NameToDefs {
        const choices: NameToDefs = {};
        const defs = this.defs;

        for (const name in defs) {
            if (this.byName(name)?.has("of")) {
                choices[name] = this.choicesFor(name);
            }
        }

        return choices;
    }

    /**
     * @returns The name of the available features.
     */
    @memoize()
    public get featureNames(): string[] {
        const names = new Set<string>();
        const defs = this.defs;

        for (const name in defs) {
            if (HNamespace.isFeature(name)) {
                const colon = name.indexOf(":");
                if (colon > -1) {
                    const featureName = name.substring(0, colon);

                    if (featureName) {
                        names.add(featureName);
                    }
                }
            }
        }

        return [...names];
    }

    /**
     * @returns A list of all the tagOn names.
     */
    @memoize()
    public get tagOnNames(): string[] {
        const names = new Set<string>();
        const defs = this.defs;

        for (const name in defs) {
            const tagOn =
                this.byName(name)?.get<HList<HSymbol | null>>("tagOn");
            if (tagOn) {
                for (const tagName of tagOn) {
                    if (tagName) {
                        names.add(tagName.value);
                    }
                }
            }
        }

        return [...names];
    }

    /**
     * @returns A object that maps def names to their respective tagOn defs.
     */
    @memoize()
    public get tagOnIndices(): NameToDefs {
        return Object.keys(this.defs).reduce(
            (obj: NameToDefs, name: string): NameToDefs => {
                const defs = this.byName(name)
                    ?.get<HList<HSymbol | null>>("tagOn")
                    ?.reduce(this.reduceNameToDef, []);

                if (defs && defs.length) {
                    obj[name] = defs;
                }

                return obj;
            },
            {}
        );
    }

    /**
     * Return the defs inheritance as a flattened array of defs.
     *
     * @param name The def name.
     * @returns The def's inheritance.
     */
    public inheritance(name: string | HSymbol): HDict[] {
        return this.has(name) ? this.doInheritance(name) : [];
    }

    @memoize()
    private doInheritance(name: string | HSymbol): HDict[] {
        const defs = new Set<HDict>();
        const def = this.byName(name);

        if (def) {
            defs.add(def);
            this.findSuperTypes(name, defs);
        }

        return [...defs];
    }

    /**
     * Return an array of defs for the given association on the parent.
     *
     * @param parent The parent def.
     * @param association The association.
     * @returns An array of associated defs.
     */
    public associations(
        parent: string | HSymbol,
        association: string | HSymbol
    ): HDict[] {
        const assocDef = this.byName(association);

        // Make sure the association exists and is an association.
        if (
            !assocDef
                ?.get<HList<HSymbol | null>>("is")
                ?.includes(HSymbol.make("association"))
        ) {
            return [];
        }
        // If the assocation isn't computed then just get the associated defs.
        // For instance, this will return here if the association is 'tagOn'.
        if (!assocDef.has("computed")) {
            return (
                this.byName(parent)
                    ?.get<HList<HSymbol | null>>(String(association))
                    ?.reduce(this.reduceNameToDef, []) ?? []
            );
        }

        // Find the reciprocal def.
        const reciprocalOf = assocDef.get<HSymbol>("reciprocalOf");
        if (!reciprocalOf) {
            return [];
        }

        const recipDef = this.byName(reciprocalOf);
        if (!recipDef) {
            return [];
        }

        // If searching for a computed assocation (i.e. tags) then more work is required.
        // Search for all tagOns and match against the parent's inheritance.
        return this.findReciprocalAssociations(parent, reciprocalOf);
    }

    /**
     * Return the assocations for the parent for the reciprocal assocation.
     *
     * @param parent The parent def.
     * @param reciprocalOf The reciprocal association.
     * @returns An array of associated defs.
     */
    @memoize()
    private findReciprocalAssociations(
        parent: string | HSymbol,
        reciprocalOf: HSymbol
    ): HDict[] {
        const inheritance = this.inheritance(parent);
        const matches = new Set<HDict>();

        const recipStr = String(reciprocalOf);
        for (const name in this.defs) {
            const def = this.byName(name);
            const list = def?.get<HList<HSymbol | null>>(recipStr);
            if (def && list) {
                for (const symbol of list) {
                    if (symbol) {
                        const target = this.byName(symbol);

                        if (target && inheritance.includes(target)) {
                            matches.add(def);
                        }
                    }
                }
            }
        }

        return [...matches];
    }

    /**
     * Return an array of defs for the `is` association on the parent.
     *
     * @param parent The parent def.
     * @returns An array of associated defs.
     */
    public is(parent: string | HSymbol): HDict[] {
        return this.associations(parent, "is");
    }

    /**
     * Return an array of defs for the `tagOn` association on the parent.
     *
     * @param parent The parent def.
     * @returns An array of associated defs.
     */
    public tagOn(parent: string | HSymbol): HDict[] {
        return this.associations(parent, "tagOn");
    }

    /**
     * Return an array of defs for the `tags` association on the parent.
     *
     * @param parent The parent def.
     * @returns An array of associated defs.
     */
    public tags(parent: string | HSymbol): HDict[] {
        return this.associations(parent, "tags");
    }

    /**
     * Analyze the subject dict and return its implemented defs.
     *
     * @param subject The subject dict.
     * @returns The reflected defs.
     */
    public reflect(subject: HDict): Reflection {
        const foundDefs: HDict[] = [];
        const markers: string[] = [];

        // 1. Check if the tag name maps to a tag def.
        this.findDefs(subject, foundDefs, markers);

        // 2. If the tag maps to a possible conjunct, then check if the dict
        // has all the conjunct's tags.
        this.findConjuncts(markers, foundDefs);

        // 3. Infer the inheritance from all defs reflected from the previous steps.
        const reflected = this.findSuperTypesFromDefs(foundDefs);

        return new Reflection([...reflected], subject, this);
    }

    /**
     * Match the most specific marker entity type for the specified dict.
     *
     * @param subject The subject dict.
     * @returns The entity def or `dict` if one cannot be found.
     */
    public defOfDict(subject: HDict): HDict {
        return this.reflect(subject).type;
    }

    /**
     * Find the defs on the subject.
     *
     * @param subject The subject to search for defs.
     * @param foundDefs The found defs.
     * @param markers Any marker tags found.
     */
    private findDefs(
        subject: HDict,
        foundDefs: HDict[],
        markers: string[]
    ): void {
        for (const name of subject.keys) {
            const def = this.byName(name);

            if (def) {
                foundDefs.push(def);

                // Note all marker tags so we can test for possible conjuncts.
                if (subject.get(name)?.isKind(Kind.Marker)) {
                    markers.push(name);
                }
            }
        }
    }

    /**
     * Return all the super types from the specified defs.
     *
     * @param defs The defs to search.
     * @returns The supertype defs.
     */
    private findSuperTypesFromDefs(defs: HDict[]): HDict[] {
        const reflected = new Set<HDict>();

        for (const dict of defs) {
            reflected.add(dict);
            this.findSuperTypes(dict.defName, reflected);
        }

        return [...reflected];
    }

    /**
     * Return true if the specified def `fits` the base def.
     *
     * If true this means that `def` is assignable to types of `base`.
     * This is effectively the same as checking if `inheritance(def)` contains
     * base.
     *
     * @param name The def name.
     * @param base The name of the base def.
     * @returns True if the def fits.
     */
    public fits(name: string | HSymbol, base: string | HSymbol): boolean {
        const baseDef = this.byName(base);
        return !!(baseDef && this.inheritance(name).includes(baseDef));
    }

    /**
     * Return true if the specified def is a marker.
     *
     * @param name The def name.
     * @returns True if the def is a marker.
     */
    public fitsMarker(name: string | HSymbol): boolean {
        return this.fits(name, "marker");
    }

    /**
     * Return true if the specified def is a val.
     *
     * @param name The def name.
     * @returns True if the def is a val.
     */
    public fitsVal(name: string | HSymbol): boolean {
        return this.fits(name, "val");
    }

    /**
     * Return true if the specified def is a choice.
     *
     * @param name The def name.
     * @returns True if the def is a choice.
     */
    public fitsChoice(name: string | HSymbol): boolean {
        return this.fits(name, "choice");
    }

    /**
     * Return true if the specified def is a entity.
     *
     * @param name The def name.
     * @returns True if the def is a entity.
     */
    public fitsEntity(name: string | HSymbol): boolean {
        return this.fits(name, "entity");
    }

    /**
     * Return the tags that should be added for implementation.
     *
     * @param name The def name.
     * @returns An array of defs to be added.
     */
    public implementation(name: string | HSymbol): HDict[] {
        // 1.a Based on the tag name get the single def tag name.
        // 1.b If this is a conjunct get each tag from it.
        let dicts = this.conjunctDefs(name);

        // 1.c Feature keys are never implemented.
        dicts = dicts.filter(
            (def: HDict): boolean => !HNamespace.isFeature(def.defName)
        );

        // 2. We walk the supertype tree of the def and apply any tag which is marked as mandatory.
        const superTypes = new Set<HDict>();
        for (const dict of dicts) {
            this.findSuperTypes(dict.defName, superTypes);
        }

        for (const superType of superTypes) {
            if (superType.get("mandatory")?.equals(HMarker.make())) {
                dicts.push(superType);
            }
        }

        return dicts;
    }

    /**
     * Return the Haystack kind value from the def. If the def is invalid or a kind
     * cannot be ascertained then return undefined.
     *
     * Please note, `curVal` and `writeVal` are scalars but don't extend
     * a def that could relate to a concrete type (i.e. number or bool). This implies
     * these values can be any scalar and hence match multiple kinds. In this case undefined
     * will be returned for the kind.
     *
     * @param name The name of the def to get the kind for.
     * @returns The kind or undefined it one cannot be found.
     */
    public defToKind(name: string | HSymbol): Kind | undefined {
        const def = this.byName(name);

        if (!def) {
            return undefined;
        }

        const hsTypeDefs = this.hsTypeDefs;

        const types = new Set<HDict>();
        types.add(def);
        this.allSuperTypesOf(def.defName).forEach(types.add, types);

        let kind: Kind | undefined;

        if (types.has(hsTypeDefs.marker)) {
            kind = Kind.Marker;
        } else if (types.has(hsTypeDefs.bool)) {
            kind = Kind.Bool;
        } else if (types.has(hsTypeDefs.number)) {
            kind = Kind.Number;
        } else if (types.has(hsTypeDefs.str)) {
            kind = Kind.Str;
        } else if (types.has(hsTypeDefs.coord)) {
            kind = Kind.Coord;
        } else if (types.has(hsTypeDefs.date)) {
            kind = Kind.Date;
        } else if (types.has(hsTypeDefs.dateTime)) {
            kind = Kind.DateTime;
        } else if (types.has(hsTypeDefs.dict)) {
            kind = Kind.Dict;
        } else if (types.has(hsTypeDefs.grid)) {
            kind = Kind.Grid;
        } else if (types.has(hsTypeDefs.list)) {
            kind = Kind.List;
        } else if (types.has(hsTypeDefs.na)) {
            kind = Kind.NA;
        } else if (types.has(hsTypeDefs.ref)) {
            kind = Kind.Ref;
        } else if (types.has(hsTypeDefs.symbol)) {
            kind = Kind.Symbol;
        } else if (types.has(hsTypeDefs.time)) {
            kind = Kind.Time;
        } else if (types.has(hsTypeDefs.uri)) {
            kind = Kind.Uri;
        } else if (types.has(hsTypeDefs.xstr)) {
            kind = Kind.XStr;
        }

        return kind;
    }

    /**
     * @returns The defs for all of the core haystack value types.
     */
    @memoize()
    public get hsTypeDefs(): {
        bool: HDict;
        coord: HDict;
        date: HDict;
        dateTime: HDict;
        dict: HDict;
        grid: HDict;
        list: HDict;
        marker: HDict;
        na: HDict;
        number: HDict;
        ref: HDict;
        str: HDict;
        symbol: HDict;
        time: HDict;
        uri: HDict;
        xstr: HDict;
    } {
        return {
            bool: this.byName("bool") as HDict,
            coord: this.byName("coord") as HDict,
            date: this.byName("date") as HDict,
            dateTime: this.byName("dateTime") as HDict,
            dict: this.byName("dict") as HDict,
            grid: this.byName("grid") as HDict,
            list: this.byName("list") as HDict,
            marker: this.byName("marker") as HDict,
            na: this.byName("na") as HDict,
            number: this.byName("number") as HDict,
            ref: this.byName("ref") as HDict,
            str: this.byName("str") as HDict,
            symbol: this.byName("symbol") as HDict,
            time: this.byName("time") as HDict,
            uri: this.byName("uri") as HDict,
            xstr: this.byName("xstr") as HDict,
        };
    }

    /**
     * Return a reflected array of children prototypes for the parent dict.
     *
     * @param name The parent dict.
     * @returns An array of children.
     */
    public protos(parent: HDict): HDict[] {
        return parent.keys
            .map((name: string): HDict[] => this.protosForDef(parent, name))
            .reduce((dicts: HDict[], children: HDict[]): HDict[] => {
                return dicts.concat(children);
            }, []);
    }

    /**
     * Return a reflected array of children prototypes for the def.
     *
     * @param parent The parent dict.
     * @param name The def name.
     * @returns An array of children.
     */
    private protosForDef(parent: HDict, name: string): HDict[] {
        let protos: HDict[] | undefined;

        const def = this.byName(name);
        const children = def?.get<HStr | HList<HDict>>("children");

        if (def && children) {
            // Parse the children into a list of dicts.
            protos = valueIsKind<HStr>(children, Kind.Str)
                ? HNamespace.parseMultiLineStringToDicts(children)
                : ((children as HList<HDict>)
                      .toArray()
                      .filter((dict) => !!dict) as HDict[]);

            // Find any flattened values.
            const flattened = this.findFlattenedChildren(def, parent);

            // Merge the flattened children.
            protos = protos.map(
                (dict: HDict): HDict => HDict.merge(flattened, dict)
            );
        }

        return protos ?? [];
    }

    /**
     * Parse the multi-line values into a list of dict.
     *
     * @param val The value string to parse.
     * @returns A list of dicts.
     */
    private static parseMultiLineStringToDicts(val: HStr): HDict[] {
        return val.value
            .split("\n")
            .map((line: string): string => line.trim())
            .filter(
                (line: string): boolean =>
                    line.length > 0 && !line.startsWith("//")
            )
            .map(
                (line: string): HDict =>
                    ZincReader.readValue(`{${line}}`) as HDict
            );
    }

    /**
     * Find the flattened children on the parent dict.
     *
     * @param def The def that may have the `childrenFlatten` tag.
     * @param parent The parent to search for values.
     * @returns A dict with the flattened children information.
     */
    private findFlattenedChildren(def: HDict, parent: HDict): HDict {
        return (
            def
                ?.get<HList<HSymbol | null>>("childrenFlatten")
                ?.reduce((dict: HDict, name: HSymbol | null): HDict => {
                    for (const key of parent.keys) {
                        if (name && this.fits(key, name)) {
                            dict.set(key, parent.get(key) as OptionalHVal);
                        }
                    }
                    return dict;
                }, HDict.make({})) ?? HDict.make({})
        );
    }

    /**
     * Maps a name to a def as a reducer function.
     *
     * This method has been designed to be used in an Array's reducer function
     * to convert names to defs.
     */
    private reduceNameToDef = (
        dicts: HDict[],
        name: HStr | HSymbol | string | null
    ): HDict[] => {
        if (name) {
            const def = this.byName(String(name));
            if (def) {
                dicts.push(def);
            }
        }
        return dicts;
    };

    /**
     * @returns The underlying grid for the namespace.
     */
    public get grid(): HGrid {
        return this.$grid;
    }

    /**
     * Return a grid for the namespace.
     *
     * @returns A grid with all the definitions.
     */
    public toGrid(): HGrid {
        return this.grid;
    }

    /**
     * @returns A list of available timezones.
     */
    @memoize()
    public get timezones(): HList<HStr> {
        return (
            this.byName("tz")
                ?.get<HStr>("enum")
                ?.value?.split("\n")
                .reduce((cur, prev) => cur.push(prev), HList.make([])) ??
            HList.make([])
        );
    }

    /**
     * Query a subject's relationship.
     *
     * Relationships model how entities are related to one another via instance to instance
     * relationships versus def to def associations.
     *
     * https://project-haystack.dev/doc/docHaystack/Relationships#querying
     *
     * @param options.subject The subject dict being queried.
     * @param options.relName The name of the relationship to query.
     * @param options.relTerm An optional relationship term to query against.
     * @param options.ref An optional reference target.
     * @param options.resolve An optional function that can resolve dicts (records) from a ref.
     * @param options.queried An internally passed collection used for stopping infinite loops.
     * @returns True if a match is made.
     */
    public hasRelationship({
        subject,
        relName,
        relTerm,
        ref,
        resolve,
        queried,
    }: {
        subject: HDict;
        relName: string | HSymbol;
        relTerm?: string | HSymbol;
        ref?: HRef;
        resolve?: (ref: HRef) => HDict | undefined;
        queried?: Set<string>;
    }): boolean {
        const relationship = this.byName(relName);

        if (!relationship) {
            return false;
        }

        const relNameStr = HSymbol.make(relName).value;

        if (
            !this.inheritance(relName).some(
                (def) => def.defName === "relationship"
            )
        ) {
            return false;
        }

        const transitive = relationship.has("transitive");

        // https://project-haystack.dev/doc/docHaystack/Relationships#reciprocalOf
        const reciprocalOf = relationship.get<HSymbol>("reciprocalOf");

        const id = subject.get("id");

        for (const subjectKey of subject.keys) {
            const subjectVal = subject.get(subjectKey) as OptionalHVal;
            const subjectDef = this.byName(subjectKey);
            let relVal = subjectDef?.get(relNameStr);

            // Handle a reciprocal relationship. A reciprocal relationship can only
            // be inverted when a ref is specified.
            if (
                !relVal &&
                reciprocalOf &&
                ref &&
                valueIsKind<HRef>(id, Kind.Ref) &&
                ref.equals(id) &&
                valueIsKind<HRef>(subjectVal, Kind.Ref)
            ) {
                relVal = subjectDef?.get(reciprocalOf.value);

                if (relVal) {
                    ref = subjectVal;
                }
            }

            // Test to see if the relationship exists on any of the
            // reflected defs for an entry in subject.
            if (relVal) {
                let match = false;

                // If we're testing against a relationship value then
                // ensure the target is also a symbol so we can see if it fits.
                if (relTerm) {
                    if (valueIsKind<HSymbol>(relVal, Kind.Symbol)) {
                        match = this.fits(relVal, relTerm);
                    }
                } else {
                    match = true;
                }

                // Test to see if the value matches.
                if (match && ref) {
                    match = false;

                    if (ref.equals(subjectVal)) {
                        match = true;
                    } else if (
                        transitive &&
                        resolve &&
                        valueIsKind<HRef>(subjectVal, Kind.Ref)
                    ) {
                        // Since transitive relationships are recursive, keep
                        // track of references have been resolved so we don't end up
                        // with an infinite loop.
                        if (!queried) {
                            queried = new Set();
                        }

                        if (!queried.has(subjectVal.value)) {
                            queried.add(subjectVal.value);

                            // If the value doesn't match but the relationship is transitive
                            // then follow the refs until we find a match or not.
                            // https://project-haystack.dev/doc/docHaystack/Relationships#transitive
                            const newSubject = resolve(subjectVal);

                            if (newSubject) {
                                match = this.hasRelationship({
                                    subject: newSubject,
                                    relName: relName,
                                    relTerm,
                                    ref,
                                    resolve,
                                    queried,
                                });
                            }
                        }
                    }
                }

                if (match) {
                    return true;
                }
            }
        }

        return false;
    }
}
