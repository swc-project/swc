/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

/** @typedef {import("./RuleSetCompiler")} RuleSetCompiler */
/** @typedef {import("./RuleSetCompiler").Effect} Effect */

class UseEffectRulePlugin {
	/**
	 * @param {RuleSetCompiler} ruleSetCompiler the rule set compiler
	 * @returns {void}
	 */
	apply(ruleSetCompiler) {
		ruleSetCompiler.hooks.rule.tap(
			"UseEffectRulePlugin",
			(path, rule, unhandledProperties, result, references) => {
				const conflictWith = (property, correctProperty) => {
					if (unhandledProperties.has(property)) {
						throw ruleSetCompiler.error(
							`${path}.${property}`,
							rule[property],
							`A Rule must not have a '${property}' property when it has a '${correctProperty}' property`
						);
					}
				};

				if (unhandledProperties.has("use")) {
					unhandledProperties.delete("use");
					unhandledProperties.delete("enforce");

					conflictWith("loader", "use");
					conflictWith("options", "use");

					const use = rule.use;
					const enforce = rule.enforce;

					const type = enforce ? `use-${enforce}` : "use";

					/**
					 *
					 * @param {string} defaultIdent default ident when none is provided
					 * @param {object} item user provided use value
					 * @returns {Effect|function(any): Effect[]} effect
					 */
					const useToEffect = (defaultIdent, item) => {
						if (typeof item === "function") {
							return data => useToEffectsWithoutIdent(item(data));
						} else {
							return useToEffectRaw(defaultIdent, item);
						}
					};

					/**
					 *
					 * @param {string} defaultIdent default ident when none is provided
					 * @param {object} item user provided use value
					 * @returns {Effect} effect
					 */
					const useToEffectRaw = (defaultIdent, item) => {
						if (typeof item === "string") {
							return {
								type,
								value: {
									loader: item,
									options: undefined,
									ident: undefined
								}
							};
						} else {
							const loader = item.loader;
							const options = item.options;
							let ident = item.ident;
							if (options && typeof options === "object") {
								if (!ident) ident = defaultIdent;
								references.set(ident, options);
							}
							return {
								type: enforce ? `use-${enforce}` : "use",
								value: {
									loader,
									options,
									ident
								}
							};
						}
					};

					/**
					 * @param {any} items user provided use value
					 * @returns {Effect[]} effects
					 */
					const useToEffectsWithoutIdent = items => {
						if (Array.isArray(items)) {
							return items.map(item =>
								useToEffectRaw("[[missing ident]]", item)
							);
						}
						return [useToEffectRaw("[[missing ident]]", items)];
					};

					/**
					 * @param {string} path current path
					 * @param {any} items user provided use value
					 * @returns {(Effect|function(any): Effect[])[]} effects
					 */
					const useToEffects = (path, items) => {
						if (Array.isArray(items)) {
							return items.map((item, idx) =>
								useToEffect(`${path}[${idx}]`, item)
							);
						}
						return [useToEffect(path, items)];
					};

					if (typeof use === "function") {
						result.effects.push(data => useToEffectsWithoutIdent(use(data)));
					} else {
						for (const effect of useToEffects(`${path}.use`, use)) {
							result.effects.push(effect);
						}
					}
				}

				if (unhandledProperties.has("loader")) {
					unhandledProperties.delete("loader");
					unhandledProperties.delete("options");
					unhandledProperties.delete("enforce");

					const loader = rule.loader;
					const options = rule.options;
					const enforce = rule.enforce;

					if (loader.includes("!")) {
						throw ruleSetCompiler.error(
							`${path}.loader`,
							loader,
							"Exclamation mark separated loader lists has been removed in favor of the 'use' property with arrays"
						);
					}

					if (loader.includes("?")) {
						throw ruleSetCompiler.error(
							`${path}.loader`,
							loader,
							"Query arguments on 'loader' has been removed in favor of the 'options' property"
						);
					}

					result.effects.push({
						type: enforce ? `use-${enforce}` : "use",
						value: {
							loader,
							options,
							ident: options && typeof options === "object" ? path : undefined
						}
					});
				}
			}
		);
	}

	useItemToEffects(path, item) {}
}

module.exports = UseEffectRulePlugin;
