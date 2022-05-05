/*
 * Copyright (c) 2019, J2 Innovations. All Rights Reserved
 */

import { HSymbol } from "../core/HSymbol";
import { HNamespace } from "../core/HNamespace";
import { GenerateHaystackFilterVisitor } from "./GenerateHaystackFilterVisitor";
import { IsANode, RelationshipNode, WildcardEqualsNode } from "./Node";
import { HDict } from "../core/HDict";

/**
 * The depth of the wildcard equality search.
 */
const DEFAULT_WILDCARD_EQUALITY_DEPTH = 10;

/**
 * Generates a Haystack version 3 filter string.
 *
 * This filter lowers from a Haystack version 4 filter to a
 * a Haystack version 3 filter. A Haystack version 3 filter is not def aware.
 */
export class GenerateHaystackFilterV3Visitor extends GenerateHaystackFilterVisitor {
    /**
     * The defs namespace.
     */
    readonly #namespace: HNamespace;

    /**
     * The wildcard equality depth.
     */
    readonly #wildcardEqDepth: number;

    /**
     * A query is marked as needing to be requeried if it can't be completely lowered
     * from V4 to V3. In this case, the resultant V3 query should first be run against
     * the V3 database. The resultant HGrid from the V3 database should then be filtered
     * down further using `HFilter#eval(...)` to derive the final result.
     */
    public requery = false;

    public constructor(
        namespace: HNamespace,
        options?: { wildcardEqDepth?: number }
    ) {
        super();
        this.#namespace = namespace;
        this.#wildcardEqDepth =
            options?.wildcardEqDepth ?? DEFAULT_WILDCARD_EQUALITY_DEPTH;
    }

    public visitIsA(node: IsANode): void {
        // Convert the `is a` query in a large joined `has` query for all subtypes.
        // For instance, if the query is `^mammal`, we have to convert the query into
        // `cat or dog or hamster` since Haystack v3 has no notion defs.
        // Split up any conjuncts from `hairy-cat` to `(hairy and cat)`.
        // Yes this query could be very large but this is the only way to do it.

        const name = node.val.value as HSymbol;
        const def = this.#namespace.byName(name);

        if (def) {
            const query = [def, ...this.#namespace.allSubTypesOf(name)]
                .map((def) => {
                    const defName = def.defName;
                    return HNamespace.isConjunct(defName)
                        ? `(${HNamespace.splitConjunct(defName).join(" and ")})`
                        : defName;
                })
                .join(" or ");

            this.appendQuery(query);
        }
    }

    public visitRelationship(node: RelationshipNode): void {
        const relationship = node.rel.relationship;
        const term = node.rel.term;
        const ref = node.ref;

        // If there's a reference this means transitive and reciprocal queries.
        // Therefore we need to signal we need to requery any result we get back using
        // HFilter.
        if (ref) {
            this.requery = true;
        }

        // To convert to V3, we need to find all the refs that have the relationship.
        // If there's a term then ensure the value fits.

        const targetRefDefs = new Set<HDict>();

        for (const refDef of this.#namespace.allSubTypesOf("ref")) {
            for (const key of refDef.keys) {
                if (key === relationship) {
                    if (term) {
                        const val = String(refDef.get(key));
                        if (this.#namespace.fits(val, term)) {
                            targetRefDefs.add(refDef);
                        }
                    } else {
                        targetRefDefs.add(refDef);
                    }
                }
            }
        }

        if (targetRefDefs.size > 0) {
            const query = [...targetRefDefs]
                .map((def) => def.defName)
                .join(" or ");

            this.appendQuery(query);
        }
    }

    public visitWildcardEquals(node: WildcardEqualsNode): void {
        // For haystack v3, we simply make an ever increasing dereferenced path.
        // For example, equipRef *== @ahu is converted to (equipRef == @ahu or equipRef->equipRef == @ahu ...)

        const refZinc = node.ref.value.toFilter();
        const id = node.id.toFilter();

        const paths: string[] = [];
        let query = "";

        for (let i = 0; i < this.#wildcardEqDepth; ++i) {
            paths.push(id);

            if (i) {
                query += " or ";
            }

            query += `${paths.join("->")} == ${refZinc}`;
        }

        this.appendQuery(query);
    }

    private appendQuery(query: string): void {
        if (query) {
            if (query.includes(" ")) {
                this.append(`(${query})`);
            } else {
                this.append(query);
            }
        }
    }
}
