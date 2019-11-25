/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const { Parser } = require("acorn");
const { SyncBailHook, HookMap } = require("tapable");
const vm = require("vm");
const StackedMap = require("../util/StackedMap");
const BasicEvaluatedExpression = require("./BasicEvaluatedExpression");

/** @typedef {import("estree").ArrayExpression} ArrayExpressionNode */
/** @typedef {import("estree").BinaryExpression} BinaryExpressionNode */
/** @typedef {import("estree").BlockStatement} BlockStatementNode */
/** @typedef {import("estree").CallExpression} CallExpressionNode */
/** @typedef {import("estree").Comment} CommentNode */
/** @typedef {import("estree").ConditionalExpression} ConditionalExpressionNode */
/** @typedef {import("estree").Declaration} DeclarationNode */
/** @typedef {import("estree").Expression} ExpressionNode */
/** @typedef {import("estree").Identifier} IdentifierNode */
/** @typedef {import("estree").IfStatement} IfStatementNode */
/** @typedef {import("estree").LabeledStatement} LabeledStatementNode */
/** @typedef {import("estree").Literal} LiteralNode */
/** @typedef {import("estree").LogicalExpression} LogicalExpressionNode */
/** @typedef {import("estree").MemberExpression} MemberExpressionNode */
/** @typedef {import("estree").ModuleDeclaration} ModuleDeclarationNode */
/** @typedef {import("estree").Program} ProgramNode */
/** @typedef {import("estree").Statement} StatementNode */
/** @typedef {import("estree").Super} SuperNode */
/** @typedef {import("estree").TaggedTemplateExpression} TaggedTemplateExpressionNode */
/** @typedef {import("estree").TemplateLiteral} TemplateLiteralNode */
/** @typedef {import("estree").ThisExpression} ThisExpressionNode */
/** @typedef {import("estree").UnaryExpression} UnaryExpressionNode */
/** @typedef {import("estree").VariableDeclarator} VariableDeclaratorNode */
/** @template T @typedef {import("tapable").AsArray<T>} AsArray<T> */

// Syntax: https://developer.mozilla.org/en/SpiderMonkey/Parser_API

const parser = Parser.extend(require("../parsing/importAwaitAcornPlugin"));

class VariableInfo {
	/**
	 * @param {ScopeInfo} declaredScope scope in which the variable is declared
	 * @param {string | true} freeName which free name the variable aliases, or true when none
	 * @param {TagInfo | undefined} tagInfo info about tags
	 */
	constructor(declaredScope, freeName, tagInfo) {
		this.declaredScope = declaredScope;
		this.freeName = freeName;
		this.tagInfo = tagInfo;
	}
}

/** @typedef {string | ScopeInfo | VariableInfo} ExportedVariableInfo */
/** @typedef {LiteralNode | string | null | undefined} ImportSource */

/**
 * @typedef {Object} TagInfo
 * @property {any} tag
 * @property {any} data
 * @property {TagInfo | undefined} next
 */

/**
 * @typedef {Object} ScopeInfo
 * @property {StackedMap<string, VariableInfo | ScopeInfo>} definitions
 * @property {boolean | "arrow"} topLevelScope
 * @property {boolean} inShorthand
 * @property {boolean} isStrict
 * @property {boolean} inTry
 */

const joinRanges = (startRange, endRange) => {
	if (!endRange) return startRange;
	if (!startRange) return endRange;
	return [startRange[0], endRange[1]];
};

const defaultParserOptions = {
	ranges: true,
	locations: true,
	ecmaVersion: 11,
	sourceType: "module",
	allowAwaitOutsideFunction: true,
	onComment: null
};

// regexp to match at least one "magic comment"
const webpackCommentRegExp = new RegExp(/(^|\W)webpack[A-Z]{1,}[A-Za-z]{1,}:/);

const EMPTY_COMMENT_OPTIONS = {
	options: null,
	errors: null
};

class JavascriptParser {
	constructor(options, sourceType = "auto") {
		this.hooks = Object.freeze({
			/** @type {HookMap<SyncBailHook<[UnaryExpressionNode], BasicEvaluatedExpression | undefined | null>>} */
			evaluateTypeof: new HookMap(() => new SyncBailHook(["expression"])),
			/** @type {HookMap<SyncBailHook<[ExpressionNode], BasicEvaluatedExpression | undefined | null>>} */
			evaluate: new HookMap(() => new SyncBailHook(["expression"])),
			/** @type {HookMap<SyncBailHook<[IdentifierNode | ThisExpressionNode | MemberExpressionNode], BasicEvaluatedExpression | undefined | null>>} */
			evaluateIdentifier: new HookMap(() => new SyncBailHook(["expression"])),
			/** @type {HookMap<SyncBailHook<[IdentifierNode | ThisExpressionNode | MemberExpressionNode], BasicEvaluatedExpression | undefined | null>>} */
			evaluateDefinedIdentifier: new HookMap(
				() => new SyncBailHook(["expression"])
			),
			/** @type {HookMap<SyncBailHook<[CallExpressionNode, BasicEvaluatedExpression | undefined], BasicEvaluatedExpression | undefined | null>>} */
			evaluateCallExpressionMember: new HookMap(
				() => new SyncBailHook(["expression", "param"])
			),
			/** @type {SyncBailHook<[StatementNode | ModuleDeclarationNode], boolean | void>} */
			preStatement: new SyncBailHook(["statement"]),

			/** @type {SyncBailHook<[StatementNode | ModuleDeclarationNode], boolean | void>} */
			blockPreStatement: new SyncBailHook(["declaration"]),
			/** @type {SyncBailHook<[StatementNode | ModuleDeclarationNode], boolean | void>} */
			statement: new SyncBailHook(["statement"]),
			/** @type {SyncBailHook<[IfStatementNode], boolean | void>} */
			statementIf: new SyncBailHook(["statement"]),
			/** @type {HookMap<SyncBailHook<[LabeledStatementNode], boolean | void>>} */
			label: new HookMap(() => new SyncBailHook(["statement"])),
			/** @type {SyncBailHook<[StatementNode, ImportSource], boolean | void>} */
			import: new SyncBailHook(["statement", "source"]),
			/** @type {SyncBailHook<[StatementNode, ImportSource, string, string], boolean | void>} */
			importSpecifier: new SyncBailHook([
				"statement",
				"source",
				"exportName",
				"identifierName"
			]),
			/** @type {SyncBailHook<[StatementNode], boolean | void>} */
			export: new SyncBailHook(["statement"]),
			/** @type {SyncBailHook<[StatementNode, ImportSource], boolean | void>} */
			exportImport: new SyncBailHook(["statement", "source"]),
			/** @type {SyncBailHook<[StatementNode, DeclarationNode], boolean | void>} */
			exportDeclaration: new SyncBailHook(["statement", "declaration"]),
			/** @type {SyncBailHook<[StatementNode, DeclarationNode], boolean | void>} */
			exportExpression: new SyncBailHook(["statement", "declaration"]),
			/** @type {SyncBailHook<[StatementNode, string, string, number | undefined], boolean | void>} */
			exportSpecifier: new SyncBailHook([
				"statement",
				"identifierName",
				"exportName",
				"index"
			]),
			/** @type {SyncBailHook<[StatementNode, ImportSource, string, string, number | undefined], boolean | void>} */
			exportImportSpecifier: new SyncBailHook([
				"statement",
				"source",
				"identifierName",
				"exportName",
				"index"
			]),
			/** @type {SyncBailHook<[VariableDeclaratorNode, StatementNode], boolean | void>} */
			preDeclarator: new SyncBailHook(["declarator", "statement"]),
			/** @type {SyncBailHook<[VariableDeclaratorNode, StatementNode], boolean | void>} */
			declarator: new SyncBailHook(["declarator", "statement"]),
			/** @type {HookMap<SyncBailHook<[DeclarationNode], boolean | void>>} */
			varDeclaration: new HookMap(() => new SyncBailHook(["declaration"])),
			/** @type {HookMap<SyncBailHook<[DeclarationNode], boolean | void>>} */
			varDeclarationLet: new HookMap(() => new SyncBailHook(["declaration"])),
			/** @type {HookMap<SyncBailHook<[DeclarationNode], boolean | void>>} */
			varDeclarationConst: new HookMap(() => new SyncBailHook(["declaration"])),
			/** @type {HookMap<SyncBailHook<[DeclarationNode], boolean | void>>} */
			varDeclarationVar: new HookMap(() => new SyncBailHook(["declaration"])),
			pattern: new HookMap(() => new SyncBailHook(["pattern"])),
			/** @type {HookMap<SyncBailHook<[ExpressionNode], boolean | void>>} */
			canRename: new HookMap(() => new SyncBailHook(["initExpression"])),
			/** @type {HookMap<SyncBailHook<[ExpressionNode], boolean | void>>} */
			rename: new HookMap(() => new SyncBailHook(["initExpression"])),
			/** @type {HookMap<SyncBailHook<[import("estree").AssignmentExpression], boolean | void>>} */
			assign: new HookMap(() => new SyncBailHook(["expression"])),
			/** @type {HookMap<SyncBailHook<[ExpressionNode], boolean | void>>} */
			typeof: new HookMap(() => new SyncBailHook(["expression"])),
			/** @type {SyncBailHook<[ExpressionNode], boolean | void>} */
			importCall: new SyncBailHook(["expression"]),
			/** @type {SyncBailHook<[ExpressionNode], boolean | void>} */
			topLevelAwait: new SyncBailHook(["expression"]),
			/** @type {HookMap<SyncBailHook<[ExpressionNode], boolean | void>>} */
			call: new HookMap(() => new SyncBailHook(["expression"])),
			/** @type {HookMap<SyncBailHook<[ExpressionNode, any[]], boolean | void>>} */
			callMemberChain: new HookMap(
				() => new SyncBailHook(["expression", "members"])
			),
			/** @type {HookMap<SyncBailHook<[ExpressionNode], boolean | void>>} */
			new: new HookMap(() => new SyncBailHook(["expression"])),
			/** @type {HookMap<SyncBailHook<[ExpressionNode], boolean | void>>} */
			expression: new HookMap(() => new SyncBailHook(["expression"])),
			/** @type {HookMap<SyncBailHook<[ExpressionNode, any[]], boolean | void>>} */
			expressionMemberChain: new HookMap(
				() => new SyncBailHook(["expression", "members"])
			),
			/** @type {SyncBailHook<[ExpressionNode], boolean | void>} */
			expressionConditionalOperator: new SyncBailHook(["expression"]),
			/** @type {SyncBailHook<[ExpressionNode], boolean | void>} */
			expressionLogicalOperator: new SyncBailHook(["expression"]),
			/** @type {SyncBailHook<[ProgramNode, CommentNode[]], boolean | void>} */
			program: new SyncBailHook(["ast", "comments"]),
			/** @type {SyncBailHook<[ProgramNode, CommentNode[]], boolean | void>} */
			finish: new SyncBailHook(["ast", "comments"])
		});
		this.options = options;
		this.sourceType = sourceType;
		/** @type {ScopeInfo} */
		this.scope = undefined;
		this.state = undefined;
		this.comments = undefined;
		this.semicolons = undefined;
		this.statementEndPos = undefined;
		this.lastStatementEndPos = undefined;
		this.statementStartPos = undefined;
		this.currentTagData = undefined;
		this.initializeEvaluating();
	}

	initializeEvaluating() {
		this.hooks.evaluate.for("Literal").tap("JavascriptParser", _expr => {
			const expr = /** @type {LiteralNode} */ (_expr);

			switch (typeof expr.value) {
				case "number":
					return new BasicEvaluatedExpression()
						.setNumber(expr.value)
						.setRange(expr.range);
				case "string":
					return new BasicEvaluatedExpression()
						.setString(expr.value)
						.setRange(expr.range);
				case "boolean":
					return new BasicEvaluatedExpression()
						.setBoolean(expr.value)
						.setRange(expr.range);
			}
			if (expr.value === null) {
				return new BasicEvaluatedExpression().setNull().setRange(expr.range);
			}
			if (expr.value instanceof RegExp) {
				return new BasicEvaluatedExpression()
					.setRegExp(expr.value)
					.setRange(expr.range);
			}
		});
		this.hooks.evaluate
			.for("LogicalExpression")
			.tap("JavascriptParser", _expr => {
				const expr = /** @type {LogicalExpressionNode} */ (_expr);

				let left;
				let leftAsBool;
				let right;
				if (expr.operator === "&&") {
					left = this.evaluateExpression(expr.left);
					leftAsBool = left && left.asBool();
					if (leftAsBool === false) return left.setRange(expr.range);
					if (leftAsBool !== true) return;
					right = this.evaluateExpression(expr.right);
					return right.setRange(expr.range);
				} else if (expr.operator === "||") {
					left = this.evaluateExpression(expr.left);
					leftAsBool = left && left.asBool();
					if (leftAsBool === true) return left.setRange(expr.range);
					if (leftAsBool !== false) return;
					right = this.evaluateExpression(expr.right);
					return right.setRange(expr.range);
				}
			});
		this.hooks.evaluate
			.for("BinaryExpression")
			.tap("JavascriptParser", _expr => {
				const expr = /** @type {BinaryExpressionNode} */ (_expr);

				let left;
				let right;
				let res;
				if (expr.operator === "+") {
					left = this.evaluateExpression(expr.left);
					right = this.evaluateExpression(expr.right);
					if (!left || !right) return;
					res = new BasicEvaluatedExpression();
					if (left.isString()) {
						if (right.isString()) {
							res.setString(left.string + right.string);
						} else if (right.isNumber()) {
							res.setString(left.string + right.number);
						} else if (
							right.isWrapped() &&
							right.prefix &&
							right.prefix.isString()
						) {
							// "left" + ("prefix" + inner + "postfix")
							// => ("leftprefix" + inner + "postfix")
							res.setWrapped(
								new BasicEvaluatedExpression()
									.setString(left.string + right.prefix.string)
									.setRange(joinRanges(left.range, right.prefix.range)),
								right.postfix,
								right.wrappedInnerExpressions
							);
						} else if (right.isWrapped()) {
							// "left" + ([null] + inner + "postfix")
							// => ("left" + inner + "postfix")
							res.setWrapped(
								left,
								right.postfix,
								right.wrappedInnerExpressions
							);
						} else {
							// "left" + expr
							// => ("left" + expr + "")
							res.setWrapped(left, null, [right]);
						}
					} else if (left.isNumber()) {
						if (right.isString()) {
							res.setString(left.number + right.string);
						} else if (right.isNumber()) {
							res.setNumber(left.number + right.number);
						} else {
							return;
						}
					} else if (left.isWrapped()) {
						if (left.postfix && left.postfix.isString() && right.isString()) {
							// ("prefix" + inner + "postfix") + "right"
							// => ("prefix" + inner + "postfixright")
							res.setWrapped(
								left.prefix,
								new BasicEvaluatedExpression()
									.setString(left.postfix.string + right.string)
									.setRange(joinRanges(left.postfix.range, right.range)),
								left.wrappedInnerExpressions
							);
						} else if (
							left.postfix &&
							left.postfix.isString() &&
							right.isNumber()
						) {
							// ("prefix" + inner + "postfix") + 123
							// => ("prefix" + inner + "postfix123")
							res.setWrapped(
								left.prefix,
								new BasicEvaluatedExpression()
									.setString(left.postfix.string + right.number)
									.setRange(joinRanges(left.postfix.range, right.range)),
								left.wrappedInnerExpressions
							);
						} else if (right.isString()) {
							// ("prefix" + inner + [null]) + "right"
							// => ("prefix" + inner + "right")
							res.setWrapped(left.prefix, right, left.wrappedInnerExpressions);
						} else if (right.isNumber()) {
							// ("prefix" + inner + [null]) + 123
							// => ("prefix" + inner + "123")
							res.setWrapped(
								left.prefix,
								new BasicEvaluatedExpression()
									.setString(right.number + "")
									.setRange(right.range),
								left.wrappedInnerExpressions
							);
						} else if (right.isWrapped()) {
							// ("prefix1" + inner1 + "postfix1") + ("prefix2" + inner2 + "postfix2")
							// ("prefix1" + inner1 + "postfix1" + "prefix2" + inner2 + "postfix2")
							res.setWrapped(
								left.prefix,
								right.postfix,
								left.wrappedInnerExpressions &&
									right.wrappedInnerExpressions &&
									left.wrappedInnerExpressions
										.concat(left.postfix ? [left.postfix] : [])
										.concat(right.prefix ? [right.prefix] : [])
										.concat(right.wrappedInnerExpressions)
							);
						} else {
							// ("prefix" + inner + postfix) + expr
							// => ("prefix" + inner + postfix + expr + [null])
							res.setWrapped(
								left.prefix,
								null,
								left.wrappedInnerExpressions &&
									left.wrappedInnerExpressions.concat(
										left.postfix ? [left.postfix, right] : [right]
									)
							);
						}
					} else {
						if (right.isString()) {
							// left + "right"
							// => ([null] + left + "right")
							res.setWrapped(null, right, [left]);
						} else if (right.isWrapped()) {
							// left + (prefix + inner + "postfix")
							// => ([null] + left + prefix + inner + "postfix")
							res.setWrapped(
								null,
								right.postfix,
								right.wrappedInnerExpressions &&
									(right.prefix ? [left, right.prefix] : [left]).concat(
										right.wrappedInnerExpressions
									)
							);
						} else {
							return;
						}
					}
					res.setRange(expr.range);
					return res;
				} else if (expr.operator === "-") {
					left = this.evaluateExpression(expr.left);
					right = this.evaluateExpression(expr.right);
					if (!left || !right) return;
					if (!left.isNumber() || !right.isNumber()) return;
					res = new BasicEvaluatedExpression();
					res.setNumber(left.number - right.number);
					res.setRange(expr.range);
					return res;
				} else if (expr.operator === "*") {
					left = this.evaluateExpression(expr.left);
					right = this.evaluateExpression(expr.right);
					if (!left || !right) return;
					if (!left.isNumber() || !right.isNumber()) return;
					res = new BasicEvaluatedExpression();
					res.setNumber(left.number * right.number);
					res.setRange(expr.range);
					return res;
				} else if (expr.operator === "/") {
					left = this.evaluateExpression(expr.left);
					right = this.evaluateExpression(expr.right);
					if (!left || !right) return;
					if (!left.isNumber() || !right.isNumber()) return;
					res = new BasicEvaluatedExpression();
					res.setNumber(left.number / right.number);
					res.setRange(expr.range);
					return res;
				} else if (expr.operator === "**") {
					left = this.evaluateExpression(expr.left);
					right = this.evaluateExpression(expr.right);
					if (!left || !right) return;
					if (!left.isNumber() || !right.isNumber()) return;
					res = new BasicEvaluatedExpression();
					res.setNumber(Math.pow(left.number, right.number));
					res.setRange(expr.range);
					return res;
				} else if (expr.operator === "==" || expr.operator === "===") {
					left = this.evaluateExpression(expr.left);
					right = this.evaluateExpression(expr.right);
					if (!left || !right) return;
					res = new BasicEvaluatedExpression();
					res.setRange(expr.range);
					if (left.isString() && right.isString()) {
						return res.setBoolean(left.string === right.string);
					} else if (left.isNumber() && right.isNumber()) {
						return res.setBoolean(left.number === right.number);
					} else if (left.isBoolean() && right.isBoolean()) {
						return res.setBoolean(left.bool === right.bool);
					}
				} else if (expr.operator === "!=" || expr.operator === "!==") {
					left = this.evaluateExpression(expr.left);
					right = this.evaluateExpression(expr.right);
					if (!left || !right) return;
					res = new BasicEvaluatedExpression();
					res.setRange(expr.range);
					if (left.isString() && right.isString()) {
						return res.setBoolean(left.string !== right.string);
					} else if (left.isNumber() && right.isNumber()) {
						return res.setBoolean(left.number !== right.number);
					} else if (left.isBoolean() && right.isBoolean()) {
						return res.setBoolean(left.bool !== right.bool);
					}
				} else if (expr.operator === "&") {
					left = this.evaluateExpression(expr.left);
					right = this.evaluateExpression(expr.right);
					if (!left || !right) return;
					if (!left.isNumber() || !right.isNumber()) return;
					res = new BasicEvaluatedExpression();
					res.setNumber(left.number & right.number);
					res.setRange(expr.range);
					return res;
				} else if (expr.operator === "|") {
					left = this.evaluateExpression(expr.left);
					right = this.evaluateExpression(expr.right);
					if (!left || !right) return;
					if (!left.isNumber() || !right.isNumber()) return;
					res = new BasicEvaluatedExpression();
					res.setNumber(left.number | right.number);
					res.setRange(expr.range);
					return res;
				} else if (expr.operator === "^") {
					left = this.evaluateExpression(expr.left);
					right = this.evaluateExpression(expr.right);
					if (!left || !right) return;
					if (!left.isNumber() || !right.isNumber()) return;
					res = new BasicEvaluatedExpression();
					res.setNumber(left.number ^ right.number);
					res.setRange(expr.range);
					return res;
				} else if (expr.operator === ">>>") {
					left = this.evaluateExpression(expr.left);
					right = this.evaluateExpression(expr.right);
					if (!left || !right) return;
					if (!left.isNumber() || !right.isNumber()) return;
					res = new BasicEvaluatedExpression();
					res.setNumber(left.number >>> right.number);
					res.setRange(expr.range);
					return res;
				} else if (expr.operator === ">>") {
					left = this.evaluateExpression(expr.left);
					right = this.evaluateExpression(expr.right);
					if (!left || !right) return;
					if (!left.isNumber() || !right.isNumber()) return;
					res = new BasicEvaluatedExpression();
					res.setNumber(left.number >> right.number);
					res.setRange(expr.range);
					return res;
				} else if (expr.operator === "<<") {
					left = this.evaluateExpression(expr.left);
					right = this.evaluateExpression(expr.right);
					if (!left || !right) return;
					if (!left.isNumber() || !right.isNumber()) return;
					res = new BasicEvaluatedExpression();
					res.setNumber(left.number << right.number);
					res.setRange(expr.range);
					return res;
				}
			});
		this.hooks.evaluate
			.for("UnaryExpression")
			.tap("JavascriptParser", _expr => {
				const expr = /** @type {UnaryExpressionNode} */ (_expr);

				if (expr.operator === "typeof") {
					if (expr.argument.type === "Identifier") {
						const res = this.callHooksForName(
							this.hooks.evaluateTypeof,
							expr.argument.name,
							expr
						);
						if (res !== undefined) return res;
					}
					if (expr.argument.type === "MemberExpression") {
						const res = this.callHooksForExpression(
							this.hooks.evaluateTypeof,
							expr.argument,
							expr
						);
						if (res !== undefined) return res;
					}
					if (expr.argument.type === "FunctionExpression") {
						return new BasicEvaluatedExpression()
							.setString("function")
							.setRange(expr.range);
					}
					const arg = this.evaluateExpression(expr.argument);
					if (arg.isString() || arg.isWrapped()) {
						return new BasicEvaluatedExpression()
							.setString("string")
							.setRange(expr.range);
					}
					if (arg.isNumber()) {
						return new BasicEvaluatedExpression()
							.setString("number")
							.setRange(expr.range);
					}
					if (arg.isBoolean()) {
						return new BasicEvaluatedExpression()
							.setString("boolean")
							.setRange(expr.range);
					}
					if (arg.isArray() || arg.isConstArray() || arg.isRegExp()) {
						return new BasicEvaluatedExpression()
							.setString("object")
							.setRange(expr.range);
					}
				} else if (expr.operator === "!") {
					const argument = this.evaluateExpression(expr.argument);
					if (!argument) return;
					if (argument.isBoolean()) {
						return new BasicEvaluatedExpression()
							.setBoolean(!argument.bool)
							.setRange(expr.range);
					}
					if (argument.isTruthy()) {
						return new BasicEvaluatedExpression()
							.setBoolean(false)
							.setRange(expr.range);
					}
					if (argument.isFalsy()) {
						return new BasicEvaluatedExpression()
							.setBoolean(true)
							.setRange(expr.range);
					}
					if (argument.isString()) {
						return new BasicEvaluatedExpression()
							.setBoolean(!argument.string)
							.setRange(expr.range);
					}
					if (argument.isNumber()) {
						return new BasicEvaluatedExpression()
							.setBoolean(!argument.number)
							.setRange(expr.range);
					}
				} else if (expr.operator === "~") {
					const argument = this.evaluateExpression(expr.argument);
					if (!argument) return;
					if (!argument.isNumber()) return;
					const res = new BasicEvaluatedExpression();
					res.setNumber(~argument.number);
					res.setRange(expr.range);
					return res;
				} else if (expr.operator === "+") {
					const argument = this.evaluateExpression(expr.argument);
					if (!argument) return;
					if (argument.isNumber()) {
						const res = new BasicEvaluatedExpression();
						res.setNumber(+argument.number);
						res.setRange(expr.range);
						return res;
					} else if (argument.isString()) {
						const res = new BasicEvaluatedExpression();
						res.setNumber(+argument.string);
						res.setRange(expr.range);
						return res;
					}
				}
			});
		this.hooks.evaluateTypeof.for("undefined").tap("JavascriptParser", expr => {
			return new BasicEvaluatedExpression()
				.setString("undefined")
				.setRange(expr.range);
		});
		this.hooks.evaluate.for("Identifier").tap("JavascriptParser", _expr => {
			const expr = /** @type {IdentifierNode} */ (_expr);

			return this.callHooksForNameWithFallback(
				this.hooks.evaluateIdentifier,
				expr.name,
				name =>
					new BasicEvaluatedExpression()
						.setIdentifier(name, this.getVariableInfo(expr.name), () => [])
						.setRange(expr.range),
				() => {
					const hook = this.hooks.evaluateDefinedIdentifier.get(expr.name);
					if (hook !== undefined) {
						return hook.call(expr);
					}
				},
				expr
			);
		});
		this.hooks.evaluate.for("ThisExpression").tap("JavascriptParser", _expr => {
			const expr = /** @type {ThisExpressionNode} */ (_expr);

			return this.callHooksForNameWithFallback(
				this.hooks.evaluateIdentifier,
				"this",
				name =>
					new BasicEvaluatedExpression()
						.setIdentifier(name, this.getVariableInfo("this"), () => [])
						.setRange(expr.range),
				() => {
					const hook = this.hooks.evaluateDefinedIdentifier.get("this");
					if (hook !== undefined) {
						return hook.call(expr);
					}
				},
				expr
			);
		});
		this.hooks.evaluate
			.for("MemberExpression")
			.tap("JavascriptParser", expr => {
				const expression = /** @type {MemberExpressionNode} */ (expr);

				return this.callHooksForExpressionWithFallback(
					this.hooks.evaluateIdentifier,
					expression,
					(name, rootInfo, getMembers) =>
						new BasicEvaluatedExpression()
							.setIdentifier(name, rootInfo, getMembers)
							.setRange(expression.range),
					name => {
						const hook = this.hooks.evaluateDefinedIdentifier.get(name);
						if (hook !== undefined) {
							return hook.call(expression);
						}
					},
					expression
				);
			});
		this.hooks.evaluate.for("CallExpression").tap("JavascriptParser", _expr => {
			const expr = /** @type {CallExpressionNode} */ (_expr);
			if (
				expr.callee.type !== "MemberExpression" ||
				expr.callee.property.type !==
					(expr.callee.computed ? "Literal" : "Identifier")
			) {
				return;
			}

			// type Super also possible here
			const param = this.evaluateExpression(
				/** @type {ExpressionNode} */ (expr.callee.object)
			);
			if (!param) return;
			const property =
				expr.callee.property.type === "Literal"
					? `${expr.callee.property.value}`
					: expr.callee.property.name;
			const hook = this.hooks.evaluateCallExpressionMember.get(property);
			if (hook !== undefined) {
				return hook.call(expr, param);
			}
		});
		this.hooks.evaluateCallExpressionMember
			.for("replace")
			.tap("JavascriptParser", (expr, param) => {
				if (!param.isString()) return;
				if (expr.arguments.length !== 2) return;
				if (expr.arguments[0].type === "SpreadElement") return;
				if (expr.arguments[1].type === "SpreadElement") return;
				let arg1 = this.evaluateExpression(expr.arguments[0]);
				let arg2 = this.evaluateExpression(expr.arguments[1]);
				if (!arg1.isString() && !arg1.isRegExp()) return;
				arg1 = arg1.regExp || arg1.string;
				if (!arg2.isString()) return;
				arg2 = arg2.string;
				return new BasicEvaluatedExpression()
					.setString(param.string.replace(arg1, arg2))
					.setRange(expr.range);
			});
		["substr", "substring"].forEach(fn => {
			this.hooks.evaluateCallExpressionMember
				.for(fn)
				.tap("JavascriptParser", (expr, param) => {
					if (!param.isString()) return;
					let arg1;
					let result,
						str = param.string;
					switch (expr.arguments.length) {
						case 1:
							if (expr.arguments[0].type === "SpreadElement") return;
							arg1 = this.evaluateExpression(expr.arguments[0]);
							if (!arg1.isNumber()) return;
							result = str[fn](arg1.number);
							break;
						case 2: {
							if (expr.arguments[0].type === "SpreadElement") return;
							if (expr.arguments[1].type === "SpreadElement") return;
							arg1 = this.evaluateExpression(expr.arguments[0]);
							const arg2 = this.evaluateExpression(expr.arguments[1]);
							if (!arg1.isNumber()) return;
							if (!arg2.isNumber()) return;
							result = str[fn](arg1.number, arg2.number);
							break;
						}
						default:
							return;
					}
					return new BasicEvaluatedExpression()
						.setString(result)
						.setRange(expr.range);
				});
		});

		/**
		 * @param {"cooked" | "raw"} kind kind of values to get
		 * @param {TemplateLiteralNode} templateLiteralExpr TemplateLiteral expr
		 * @returns {{quasis: BasicEvaluatedExpression[], parts: BasicEvaluatedExpression[]}} Simplified template
		 */
		const getSimplifiedTemplateResult = (kind, templateLiteralExpr) => {
			/** @type {BasicEvaluatedExpression[]} */
			const quasis = [];
			/** @type {BasicEvaluatedExpression[]} */
			const parts = [];

			for (let i = 0; i < templateLiteralExpr.quasis.length; i++) {
				const quasiExpr = templateLiteralExpr.quasis[i];
				const quasi = quasiExpr.value[kind];

				if (i > 0) {
					const prevExpr = parts[parts.length - 1];
					const expr = this.evaluateExpression(
						templateLiteralExpr.expressions[i - 1]
					);
					const exprAsString = expr.asString();
					if (typeof exprAsString === "string") {
						// We can merge quasi + expr + quasi when expr
						// is a const string

						prevExpr.setString(prevExpr.string + exprAsString + quasi);
						prevExpr.setRange([prevExpr.range[0], quasiExpr.range[1]]);
						// We unset the expression as it doesn't match to a single expression
						prevExpr.setExpression(undefined);
						continue;
					}
					parts.push(expr);
				}

				const part = new BasicEvaluatedExpression()
					.setString(quasi)
					.setRange(quasiExpr.range)
					.setExpression(quasiExpr);
				quasis.push(part);
				parts.push(part);
			}
			return {
				quasis,
				parts
			};
		};

		this.hooks.evaluate
			.for("TemplateLiteral")
			.tap("JavascriptParser", _node => {
				const node = /** @type {TemplateLiteralNode} */ (_node);

				const { quasis, parts } = getSimplifiedTemplateResult("cooked", node);
				if (parts.length === 1) {
					return parts[0].setRange(node.range);
				}
				return new BasicEvaluatedExpression()
					.setTemplateString(quasis, parts, "cooked")
					.setRange(node.range);
			});
		this.hooks.evaluate
			.for("TaggedTemplateExpression")
			.tap("JavascriptParser", _node => {
				const node = /** @type {TaggedTemplateExpressionNode} */ (_node);

				if (this.evaluateExpression(node.tag).identifier !== "String.raw")
					return;
				const { quasis, parts } = getSimplifiedTemplateResult(
					"raw",
					node.quasi
				);
				if (parts.length === 1) {
					return parts[0].setRange(node.range);
				}
				return new BasicEvaluatedExpression()
					.setTemplateString(quasis, parts, "raw")
					.setRange(node.range);
			});

		this.hooks.evaluateCallExpressionMember
			.for("concat")
			.tap("JavascriptParser", (expr, param) => {
				if (!param.isString() && !param.isWrapped()) return;

				let stringSuffix = null;
				let hasUnknownParams = false;
				const innerExpressions = [];
				for (let i = expr.arguments.length - 1; i >= 0; i--) {
					const arg = expr.arguments[i];
					if (arg.type === "SpreadElement") return;
					const argExpr = this.evaluateExpression(arg);
					if (
						hasUnknownParams ||
						(!argExpr.isString() && !argExpr.isNumber())
					) {
						hasUnknownParams = true;
						innerExpressions.push(argExpr);
						continue;
					}

					const value = argExpr.isString()
						? argExpr.string
						: "" + argExpr.number;

					const newString = value + (stringSuffix ? stringSuffix.string : "");
					const newRange = [
						argExpr.range[0],
						(stringSuffix || argExpr).range[1]
					];
					stringSuffix = new BasicEvaluatedExpression()
						.setString(newString)
						.setRange(newRange);
				}

				if (hasUnknownParams) {
					const prefix = param.isString() ? param : param.prefix;
					const inner =
						param.isWrapped() && param.wrappedInnerExpressions
							? param.wrappedInnerExpressions.concat(innerExpressions.reverse())
							: innerExpressions.reverse();
					return new BasicEvaluatedExpression()
						.setWrapped(prefix, stringSuffix, inner)
						.setRange(expr.range);
				} else if (param.isWrapped()) {
					const postfix = stringSuffix || param.postfix;
					const inner = param.wrappedInnerExpressions
						? param.wrappedInnerExpressions.concat(innerExpressions.reverse())
						: innerExpressions.reverse();
					return new BasicEvaluatedExpression()
						.setWrapped(param.prefix, postfix, inner)
						.setRange(expr.range);
				} else {
					const newString =
						param.string + (stringSuffix ? stringSuffix.string : "");
					return new BasicEvaluatedExpression()
						.setString(newString)
						.setRange(expr.range);
				}
			});
		this.hooks.evaluateCallExpressionMember
			.for("split")
			.tap("JavascriptParser", (expr, param) => {
				if (!param.isString()) return;
				if (expr.arguments.length !== 1) return;
				if (expr.arguments[0].type === "SpreadElement") return;
				let result;
				const arg = this.evaluateExpression(expr.arguments[0]);
				if (arg.isString()) {
					result = param.string.split(arg.string);
				} else if (arg.isRegExp()) {
					result = param.string.split(arg.regExp);
				} else {
					return;
				}
				return new BasicEvaluatedExpression()
					.setArray(result)
					.setRange(expr.range);
			});
		this.hooks.evaluate
			.for("ConditionalExpression")
			.tap("JavascriptParser", _expr => {
				const expr = /** @type {ConditionalExpressionNode} */ (_expr);

				const condition = this.evaluateExpression(expr.test);
				const conditionValue = condition.asBool();
				let res;
				if (conditionValue === undefined) {
					const consequent = this.evaluateExpression(expr.consequent);
					const alternate = this.evaluateExpression(expr.alternate);
					if (!consequent || !alternate) return;
					res = new BasicEvaluatedExpression();
					if (consequent.isConditional()) {
						res.setOptions(consequent.options);
					} else {
						res.setOptions([consequent]);
					}
					if (alternate.isConditional()) {
						res.addOptions(alternate.options);
					} else {
						res.addOptions([alternate]);
					}
				} else {
					res = this.evaluateExpression(
						conditionValue ? expr.consequent : expr.alternate
					);
				}
				res.setRange(expr.range);
				return res;
			});
		this.hooks.evaluate
			.for("ArrayExpression")
			.tap("JavascriptParser", _expr => {
				const expr = /** @type {ArrayExpressionNode} */ (_expr);

				const items = expr.elements.map(element => {
					return (
						element !== null &&
						element.type !== "SpreadElement" &&
						this.evaluateExpression(element)
					);
				});
				if (!items.every(Boolean)) return;
				return new BasicEvaluatedExpression()
					.setItems(items)
					.setRange(expr.range);
			});
	}

	getRenameIdentifier(expr) {
		const result = this.evaluateExpression(expr);
		if (result && result.isIdentifier()) {
			return result.identifier;
		}
	}

	walkClass(classy) {
		if (classy.superClass) this.walkExpression(classy.superClass);
		if (classy.body && classy.body.type === "ClassBody") {
			const wasTopLevel = this.scope.topLevelScope;
			this.scope.topLevelScope = false;
			for (const methodDefinition of classy.body.body) {
				if (methodDefinition.type === "MethodDefinition") {
					this.walkMethodDefinition(methodDefinition);
				}
			}
			this.scope.topLevelScope = wasTopLevel;
		}
	}

	walkMethodDefinition(methodDefinition) {
		if (methodDefinition.computed && methodDefinition.key) {
			this.walkExpression(methodDefinition.key);
		}
		if (methodDefinition.value) {
			this.walkExpression(methodDefinition.value);
		}
	}

	// Prewalking iterates the scope for variable declarations
	prewalkStatements(statements) {
		for (let index = 0, len = statements.length; index < len; index++) {
			const statement = statements[index];
			this.prewalkStatement(statement);
		}
	}

	// Block-Prewalking iterates the scope for block variable declarations
	blockPrewalkStatements(statements) {
		for (let index = 0, len = statements.length; index < len; index++) {
			const statement = statements[index];
			this.blockPrewalkStatement(statement);
		}
	}

	// Walking iterates the statements and expressions and processes them
	walkStatements(statements) {
		for (let index = 0, len = statements.length; index < len; index++) {
			const statement = statements[index];
			this.walkStatement(statement);
		}
	}

	prewalkStatement(statement) {
		if (this.hooks.preStatement.call(statement)) return;
		switch (statement.type) {
			case "BlockStatement":
				this.prewalkBlockStatement(statement);
				break;
			case "DoWhileStatement":
				this.prewalkDoWhileStatement(statement);
				break;
			case "ForInStatement":
				this.prewalkForInStatement(statement);
				break;
			case "ForOfStatement":
				this.prewalkForOfStatement(statement);
				break;
			case "ForStatement":
				this.prewalkForStatement(statement);
				break;
			case "FunctionDeclaration":
				this.prewalkFunctionDeclaration(statement);
				break;
			case "IfStatement":
				this.prewalkIfStatement(statement);
				break;
			case "LabeledStatement":
				this.prewalkLabeledStatement(statement);
				break;
			case "SwitchStatement":
				this.prewalkSwitchStatement(statement);
				break;
			case "TryStatement":
				this.prewalkTryStatement(statement);
				break;
			case "VariableDeclaration":
				this.prewalkVariableDeclaration(statement);
				break;
			case "WhileStatement":
				this.prewalkWhileStatement(statement);
				break;
			case "WithStatement":
				this.prewalkWithStatement(statement);
				break;
		}
	}

	blockPrewalkStatement(statement) {
		if (this.hooks.blockPreStatement.call(statement)) return;
		switch (statement.type) {
			case "ImportDeclaration":
				this.blockPrewalkImportDeclaration(statement);
				break;
			case "ExportAllDeclaration":
				this.blockPrewalkExportAllDeclaration(statement);
				break;
			case "ExportDefaultDeclaration":
				this.blockPrewalkExportDefaultDeclaration(statement);
				break;
			case "ExportNamedDeclaration":
				this.blockPrewalkExportNamedDeclaration(statement);
				break;
			case "VariableDeclaration":
				this.blockPrewalkVariableDeclaration(statement);
				break;
			case "ClassDeclaration":
				this.blockPrewalkClassDeclaration(statement);
				break;
		}
	}

	walkStatement(statement) {
		this.lastStatementEndPos = this.statementEndPos;
		this.statementEndPos = NaN;
		this.statementStartPos = statement.range[0];
		if (this.hooks.statement.call(statement) !== undefined) {
			this.statementEndPos = statement.range[1];
			return;
		}
		switch (statement.type) {
			case "BlockStatement":
				this.walkBlockStatement(statement);
				break;
			case "ClassDeclaration":
				this.walkClassDeclaration(statement);
				break;
			case "DoWhileStatement":
				this.walkDoWhileStatement(statement);
				break;
			case "ExportDefaultDeclaration":
				this.walkExportDefaultDeclaration(statement);
				break;
			case "ExportNamedDeclaration":
				this.walkExportNamedDeclaration(statement);
				break;
			case "ExpressionStatement":
				this.walkExpressionStatement(statement);
				break;
			case "ForInStatement":
				this.walkForInStatement(statement);
				break;
			case "ForOfStatement":
				this.walkForOfStatement(statement);
				break;
			case "ForStatement":
				this.walkForStatement(statement);
				break;
			case "FunctionDeclaration":
				this.walkFunctionDeclaration(statement);
				break;
			case "IfStatement":
				this.walkIfStatement(statement);
				break;
			case "LabeledStatement":
				this.walkLabeledStatement(statement);
				break;
			case "ReturnStatement":
				this.walkReturnStatement(statement);
				break;
			case "SwitchStatement":
				this.walkSwitchStatement(statement);
				break;
			case "ThrowStatement":
				this.walkThrowStatement(statement);
				break;
			case "TryStatement":
				this.walkTryStatement(statement);
				break;
			case "VariableDeclaration":
				this.walkVariableDeclaration(statement);
				break;
			case "WhileStatement":
				this.walkWhileStatement(statement);
				break;
			case "WithStatement":
				this.walkWithStatement(statement);
				break;
		}
		this.statementEndPos = statement.range[1];
	}

	// Real Statements
	prewalkBlockStatement(statement) {
		this.prewalkStatements(statement.body);
	}

	walkBlockStatement(statement) {
		this.inBlockScope(() => {
			const body = statement.body;
			this.blockPrewalkStatements(body);
			this.walkStatements(body);
		});
	}

	walkExpressionStatement(statement) {
		this.walkExpression(statement.expression);
	}

	prewalkIfStatement(statement) {
		this.prewalkStatement(statement.consequent);
		if (statement.alternate) {
			this.prewalkStatement(statement.alternate);
		}
	}

	walkIfStatement(statement) {
		const result = this.hooks.statementIf.call(statement);
		if (result === undefined) {
			this.walkExpression(statement.test);
			this.walkStatement(statement.consequent);
			if (statement.alternate) {
				this.walkStatement(statement.alternate);
			}
		} else {
			if (result) {
				this.walkStatement(statement.consequent);
			} else if (statement.alternate) {
				this.walkStatement(statement.alternate);
			}
		}
	}

	prewalkLabeledStatement(statement) {
		this.prewalkStatement(statement.body);
	}

	walkLabeledStatement(statement) {
		const hook = this.hooks.label.get(statement.label.name);
		if (hook !== undefined) {
			const result = hook.call(statement);
			if (result === true) return;
		}
		this.walkStatement(statement.body);
	}

	prewalkWithStatement(statement) {
		this.prewalkStatement(statement.body);
	}

	walkWithStatement(statement) {
		this.walkExpression(statement.object);
		this.walkStatement(statement.body);
	}

	prewalkSwitchStatement(statement) {
		this.prewalkSwitchCases(statement.cases);
	}

	walkSwitchStatement(statement) {
		this.walkExpression(statement.discriminant);
		this.walkSwitchCases(statement.cases);
	}

	walkTerminatingStatement(statement) {
		if (statement.argument) this.walkExpression(statement.argument);
	}

	walkReturnStatement(statement) {
		this.walkTerminatingStatement(statement);
	}

	walkThrowStatement(statement) {
		this.walkTerminatingStatement(statement);
	}

	prewalkTryStatement(statement) {
		this.prewalkStatement(statement.block);
		if (statement.handler) this.prewalkCatchClause(statement.handler);
		if (statement.finializer) this.prewalkStatement(statement.finializer);
	}

	walkTryStatement(statement) {
		if (this.scope.inTry) {
			this.walkStatement(statement.block);
		} else {
			this.scope.inTry = true;
			this.walkStatement(statement.block);
			this.scope.inTry = false;
		}
		if (statement.handler) this.walkCatchClause(statement.handler);
		if (statement.finalizer) this.walkStatement(statement.finalizer);
	}

	prewalkWhileStatement(statement) {
		this.prewalkStatement(statement.body);
	}

	walkWhileStatement(statement) {
		this.walkExpression(statement.test);
		this.walkStatement(statement.body);
	}

	prewalkDoWhileStatement(statement) {
		this.prewalkStatement(statement.body);
	}

	walkDoWhileStatement(statement) {
		this.walkStatement(statement.body);
		this.walkExpression(statement.test);
	}

	prewalkForStatement(statement) {
		if (statement.init) {
			if (statement.init.type === "VariableDeclaration") {
				this.prewalkStatement(statement.init);
			}
		}
		this.prewalkStatement(statement.body);
	}

	walkForStatement(statement) {
		this.inBlockScope(() => {
			if (statement.init) {
				if (statement.init.type === "VariableDeclaration") {
					this.blockPrewalkVariableDeclaration(statement.init);
					this.walkStatement(statement.init);
				} else {
					this.walkExpression(statement.init);
				}
			}
			if (statement.test) {
				this.walkExpression(statement.test);
			}
			if (statement.update) {
				this.walkExpression(statement.update);
			}
			const body = statement.body;
			if (body.type === "BlockStatement") {
				// no need to add additional scope
				this.blockPrewalkStatements(body.body);
				this.walkStatements(body.body);
			} else {
				this.walkStatement(body);
			}
		});
	}

	prewalkForInStatement(statement) {
		if (statement.left.type === "VariableDeclaration") {
			this.prewalkVariableDeclaration(statement.left);
		}
		this.prewalkStatement(statement.body);
	}

	walkForInStatement(statement) {
		this.inBlockScope(() => {
			if (statement.left.type === "VariableDeclaration") {
				this.blockPrewalkVariableDeclaration(statement.left);
				this.walkVariableDeclaration(statement.left);
			} else {
				this.walkPattern(statement.left);
			}
			this.walkExpression(statement.right);
			const body = statement.body;
			if (body.type === "BlockStatement") {
				// no need to add additional scope
				this.blockPrewalkStatements(body.body);
				this.walkStatements(body.body);
			} else {
				this.walkStatement(body);
			}
		});
	}

	prewalkForOfStatement(statement) {
		if (statement.await && this.scope.topLevelScope === true) {
			this.hooks.topLevelAwait.call(statement);
		}
		if (statement.left.type === "VariableDeclaration") {
			this.prewalkVariableDeclaration(statement.left);
		}
		this.prewalkStatement(statement.body);
	}

	walkForOfStatement(statement) {
		this.inBlockScope(() => {
			if (statement.left.type === "VariableDeclaration") {
				this.blockPrewalkVariableDeclaration(statement.left);
				this.walkVariableDeclaration(statement.left);
			} else {
				this.walkPattern(statement.left);
			}
			this.walkExpression(statement.right);
			const body = statement.body;
			if (body.type === "BlockStatement") {
				// no need to add additional scope
				this.blockPrewalkStatements(body.body);
				this.walkStatements(body.body);
			} else {
				this.walkStatement(body);
			}
		});
	}

	// Declarations
	prewalkFunctionDeclaration(statement) {
		if (statement.id) {
			this.defineVariable(statement.id.name);
		}
	}

	walkFunctionDeclaration(statement) {
		const wasTopLevel = this.scope.topLevelScope;
		this.scope.topLevelScope = false;
		this.inFunctionScope(true, statement.params, () => {
			for (const param of statement.params) {
				this.walkPattern(param);
			}
			if (statement.body.type === "BlockStatement") {
				this.detectStrictMode(statement.body.body);
				this.prewalkStatement(statement.body);
				this.walkStatement(statement.body);
			} else {
				this.walkExpression(statement.body);
			}
		});
		this.scope.topLevelScope = wasTopLevel;
	}

	blockPrewalkImportDeclaration(statement) {
		const source = statement.source.value;
		this.hooks.import.call(statement, source);
		for (const specifier of statement.specifiers) {
			const name = specifier.local.name;
			switch (specifier.type) {
				case "ImportDefaultSpecifier":
					if (
						!this.hooks.importSpecifier.call(statement, source, "default", name)
					) {
						this.defineVariable(name);
					}
					break;
				case "ImportSpecifier":
					if (
						!this.hooks.importSpecifier.call(
							statement,
							source,
							specifier.imported.name,
							name
						)
					) {
						this.defineVariable(name);
					}
					break;
				case "ImportNamespaceSpecifier":
					if (!this.hooks.importSpecifier.call(statement, source, null, name)) {
						this.defineVariable(name);
					}
					break;
				default:
					this.defineVariable(name);
			}
		}
	}

	enterDeclaration(declaration, onIdent) {
		switch (declaration.type) {
			case "VariableDeclaration":
				for (const declarator of declaration.declarations) {
					switch (declarator.type) {
						case "VariableDeclarator": {
							this.enterPattern(declarator.id, onIdent);
							break;
						}
					}
				}
				break;
			case "FunctionDeclaration":
				this.enterPattern(declaration.id, onIdent);
				break;
			case "ClassDeclaration":
				this.enterPattern(declaration.id, onIdent);
				break;
		}
	}

	blockPrewalkExportNamedDeclaration(statement) {
		let source;
		if (statement.source) {
			source = statement.source.value;
			this.hooks.exportImport.call(statement, source);
		} else {
			this.hooks.export.call(statement);
		}
		if (statement.declaration) {
			if (
				!this.hooks.exportDeclaration.call(statement, statement.declaration)
			) {
				this.prewalkStatement(statement.declaration);
				this.blockPrewalkStatement(statement.declaration);
				let index = 0;
				this.enterDeclaration(statement.declaration, def => {
					this.hooks.exportSpecifier.call(statement, def, def, index++);
				});
			}
		}
		if (statement.specifiers) {
			for (
				let specifierIndex = 0;
				specifierIndex < statement.specifiers.length;
				specifierIndex++
			) {
				const specifier = statement.specifiers[specifierIndex];
				switch (specifier.type) {
					case "ExportSpecifier": {
						const name = specifier.exported.name;
						if (source) {
							this.hooks.exportImportSpecifier.call(
								statement,
								source,
								specifier.local.name,
								name,
								specifierIndex
							);
						} else {
							this.hooks.exportSpecifier.call(
								statement,
								specifier.local.name,
								name,
								specifierIndex
							);
						}
						break;
					}
				}
			}
		}
	}

	walkExportNamedDeclaration(statement) {
		if (statement.declaration) {
			this.walkStatement(statement.declaration);
		}
	}

	blockPrewalkExportDefaultDeclaration(statement) {
		this.prewalkStatement(statement.declaration);
		this.blockPrewalkStatement(statement.declaration);
		if (
			statement.declaration.id &&
			statement.declaration.type !== "FunctionExpression" &&
			statement.declaration.type !== "ClassExpression"
		) {
			this.hooks.exportSpecifier.call(
				statement,
				statement.declaration.id.name,
				"default",
				undefined
			);
		}
	}

	walkExportDefaultDeclaration(statement) {
		this.hooks.export.call(statement);
		if (
			statement.declaration.id &&
			statement.declaration.type !== "FunctionExpression" &&
			statement.declaration.type !== "ClassExpression"
		) {
			if (
				!this.hooks.exportDeclaration.call(statement, statement.declaration)
			) {
				this.walkStatement(statement.declaration);
			}
		} else {
			// Acorn parses `export default function() {}` as `FunctionDeclaration` and
			// `export default class {}` as `ClassDeclaration`, both with `id = null`.
			// These nodes must be treated as expressions.
			if (
				statement.declaration.type === "FunctionDeclaration" ||
				statement.declaration.type === "ClassDeclaration"
			) {
				this.walkStatement(statement.declaration);
			} else {
				this.walkExpression(statement.declaration);
			}
			if (!this.hooks.exportExpression.call(statement, statement.declaration)) {
				this.hooks.exportSpecifier.call(
					statement,
					statement.declaration,
					"default",
					undefined
				);
			}
		}
	}

	blockPrewalkExportAllDeclaration(statement) {
		const source = statement.source.value;
		this.hooks.exportImport.call(statement, source);
		this.hooks.exportImportSpecifier.call(statement, source, null, null, 0);
	}

	prewalkVariableDeclaration(statement) {
		if (statement.kind !== "var") return;
		this._prewalkVariableDeclaration(statement, this.hooks.varDeclarationVar);
	}

	blockPrewalkVariableDeclaration(statement) {
		if (statement.kind === "var") return;
		const hookMap =
			statement.kind === "const"
				? this.hooks.varDeclarationConst
				: this.hooks.varDeclarationLet;
		this._prewalkVariableDeclaration(statement, hookMap);
	}

	_prewalkVariableDeclaration(statement, hookMap) {
		for (const declarator of statement.declarations) {
			switch (declarator.type) {
				case "VariableDeclarator": {
					if (!this.hooks.preDeclarator.call(declarator, statement)) {
						this.enterPattern(declarator.id, (name, decl) => {
							let hook = hookMap.get(name);
							if (hook === undefined || !hook.call(decl)) {
								hook = this.hooks.varDeclaration.get(name);
								if (hook === undefined || !hook.call(decl)) {
									this.defineVariable(name);
								}
							}
						});
					}
					break;
				}
			}
		}
	}

	walkVariableDeclaration(statement) {
		for (const declarator of statement.declarations) {
			switch (declarator.type) {
				case "VariableDeclarator": {
					const renameIdentifier =
						declarator.init && this.getRenameIdentifier(declarator.init);
					if (renameIdentifier && declarator.id.type === "Identifier") {
						const hook = this.hooks.canRename.get(renameIdentifier);
						if (hook !== undefined && hook.call(declarator.init)) {
							// renaming with "var a = b;"
							const hook = this.hooks.rename.get(renameIdentifier);
							if (hook === undefined || !hook.call(declarator.init)) {
								this.setVariable(
									declarator.id.name,
									this.getVariableInfo(renameIdentifier)
								);
							}
							break;
						}
					}
					if (!this.hooks.declarator.call(declarator, statement)) {
						this.walkPattern(declarator.id);
						if (declarator.init) this.walkExpression(declarator.init);
					}
					break;
				}
			}
		}
	}

	blockPrewalkClassDeclaration(statement) {
		if (statement.id) {
			this.defineVariable(statement.id.name);
		}
	}

	walkClassDeclaration(statement) {
		this.walkClass(statement);
	}

	prewalkSwitchCases(switchCases) {
		for (let index = 0, len = switchCases.length; index < len; index++) {
			const switchCase = switchCases[index];
			this.prewalkStatements(switchCase.consequent);
		}
	}

	walkSwitchCases(switchCases) {
		for (let index = 0, len = switchCases.length; index < len; index++) {
			const switchCase = switchCases[index];

			if (switchCase.test) {
				this.walkExpression(switchCase.test);
			}
			this.walkStatements(switchCase.consequent);
		}
	}

	prewalkCatchClause(catchClause) {
		this.prewalkStatement(catchClause.body);
	}

	walkCatchClause(catchClause) {
		this.inBlockScope(() => {
			// Error binding is optional in catch clause since ECMAScript 2019
			if (catchClause.param !== null) {
				this.enterPattern(catchClause.param, ident => {
					this.defineVariable(ident);
				});
				this.walkPattern(catchClause.param);
			}
			this.blockPrewalkStatement(catchClause.body);
			this.walkStatement(catchClause.body);
		});
	}

	walkPattern(pattern) {
		switch (pattern.type) {
			case "ArrayPattern":
				this.walkArrayPattern(pattern);
				break;
			case "AssignmentPattern":
				this.walkAssignmentPattern(pattern);
				break;
			case "MemberExpression":
				this.walkMemberExpression(pattern);
				break;
			case "ObjectPattern":
				this.walkObjectPattern(pattern);
				break;
			case "RestElement":
				this.walkRestElement(pattern);
				break;
		}
	}

	walkAssignmentPattern(pattern) {
		this.walkExpression(pattern.right);
		this.walkPattern(pattern.left);
	}

	walkObjectPattern(pattern) {
		for (let i = 0, len = pattern.properties.length; i < len; i++) {
			const prop = pattern.properties[i];
			if (prop) {
				if (prop.computed) this.walkExpression(prop.key);
				if (prop.value) this.walkPattern(prop.value);
			}
		}
	}

	walkArrayPattern(pattern) {
		for (let i = 0, len = pattern.elements.length; i < len; i++) {
			const element = pattern.elements[i];
			if (element) this.walkPattern(element);
		}
	}

	walkRestElement(pattern) {
		this.walkPattern(pattern.argument);
	}

	walkExpressions(expressions) {
		for (const expression of expressions) {
			if (expression) {
				this.walkExpression(expression);
			}
		}
	}

	walkExpression(expression) {
		switch (expression.type) {
			case "ArrayExpression":
				this.walkArrayExpression(expression);
				break;
			case "ArrowFunctionExpression":
				this.walkArrowFunctionExpression(expression);
				break;
			case "AssignmentExpression":
				this.walkAssignmentExpression(expression);
				break;
			case "AwaitExpression":
				this.walkAwaitExpression(expression);
				break;
			case "BinaryExpression":
				this.walkBinaryExpression(expression);
				break;
			case "CallExpression":
				this.walkCallExpression(expression);
				break;
			case "ClassExpression":
				this.walkClassExpression(expression);
				break;
			case "ConditionalExpression":
				this.walkConditionalExpression(expression);
				break;
			case "FunctionExpression":
				this.walkFunctionExpression(expression);
				break;
			case "Identifier":
				this.walkIdentifier(expression);
				break;
			case "ImportExpression":
				this.walkImportExpression(expression);
				break;
			case "LogicalExpression":
				this.walkLogicalExpression(expression);
				break;
			case "MemberExpression":
				this.walkMemberExpression(expression);
				break;
			case "NewExpression":
				this.walkNewExpression(expression);
				break;
			case "ObjectExpression":
				this.walkObjectExpression(expression);
				break;
			case "SequenceExpression":
				this.walkSequenceExpression(expression);
				break;
			case "SpreadElement":
				this.walkSpreadElement(expression);
				break;
			case "TaggedTemplateExpression":
				this.walkTaggedTemplateExpression(expression);
				break;
			case "TemplateLiteral":
				this.walkTemplateLiteral(expression);
				break;
			case "ThisExpression":
				this.walkThisExpression(expression);
				break;
			case "UnaryExpression":
				this.walkUnaryExpression(expression);
				break;
			case "UpdateExpression":
				this.walkUpdateExpression(expression);
				break;
			case "YieldExpression":
				this.walkYieldExpression(expression);
				break;
		}
	}

	walkAwaitExpression(expression) {
		if (this.scope.topLevelScope === true)
			this.hooks.topLevelAwait.call(expression);
		this.walkExpression(expression.argument);
	}

	walkArrayExpression(expression) {
		if (expression.elements) {
			this.walkExpressions(expression.elements);
		}
	}

	walkSpreadElement(expression) {
		if (expression.argument) {
			this.walkExpression(expression.argument);
		}
	}

	walkObjectExpression(expression) {
		for (
			let propIndex = 0, len = expression.properties.length;
			propIndex < len;
			propIndex++
		) {
			const prop = expression.properties[propIndex];
			if (prop.type === "SpreadElement") {
				this.walkExpression(prop.argument);
				continue;
			}
			if (prop.computed) {
				this.walkExpression(prop.key);
			}
			if (prop.shorthand && prop.value && prop.value.type === "Identifier") {
				this.scope.inShorthand = prop.value.name;
				this.walkIdentifier(prop.value);
				this.scope.inShorthand = false;
			} else {
				this.walkExpression(prop.value);
			}
		}
	}

	walkFunctionExpression(expression) {
		const wasTopLevel = this.scope.topLevelScope;
		this.scope.topLevelScope = false;
		const scopeParams = expression.params;

		// Add function name in scope for recursive calls
		if (expression.id) {
			scopeParams.push(expression.id.name);
		}

		this.inFunctionScope(true, scopeParams, () => {
			for (const param of expression.params) {
				this.walkPattern(param);
			}
			if (expression.body.type === "BlockStatement") {
				this.detectStrictMode(expression.body.body);
				this.prewalkStatement(expression.body);
				this.walkStatement(expression.body);
			} else {
				this.walkExpression(expression.body);
			}
		});
		this.scope.topLevelScope = wasTopLevel;
	}

	walkArrowFunctionExpression(expression) {
		const wasTopLevel = this.scope.topLevelScope;
		this.scope.topLevelScope = wasTopLevel ? "arrow" : false;
		this.inFunctionScope(false, expression.params, () => {
			for (const param of expression.params) {
				this.walkPattern(param);
			}
			if (expression.body.type === "BlockStatement") {
				this.detectStrictMode(expression.body.body);
				this.prewalkStatement(expression.body);
				this.walkStatement(expression.body);
			} else {
				this.walkExpression(expression.body);
			}
		});
		this.scope.topLevelScope = wasTopLevel;
	}

	walkSequenceExpression(expression) {
		if (expression.expressions) this.walkExpressions(expression.expressions);
	}

	walkUpdateExpression(expression) {
		this.walkExpression(expression.argument);
	}

	walkUnaryExpression(expression) {
		if (expression.operator === "typeof") {
			const result = this.callHooksForExpression(
				this.hooks.typeof,
				expression.argument,
				expression
			);
			if (result === true) return;
		}
		this.walkExpression(expression.argument);
	}

	walkLeftRightExpression(expression) {
		this.walkExpression(expression.left);
		this.walkExpression(expression.right);
	}

	walkBinaryExpression(expression) {
		this.walkLeftRightExpression(expression);
	}

	walkLogicalExpression(expression) {
		const result = this.hooks.expressionLogicalOperator.call(expression);
		if (result === undefined) {
			this.walkLeftRightExpression(expression);
		} else {
			if (result) {
				this.walkExpression(expression.right);
			}
		}
	}

	walkAssignmentExpression(expression) {
		if (expression.left.type === "Identifier") {
			const renameIdentifier = this.getRenameIdentifier(expression.right);
			if (renameIdentifier) {
				if (
					this.callHooksForInfo(
						this.hooks.canRename,
						renameIdentifier,
						expression.right
					)
				) {
					// renaming "a = b;"
					if (
						!this.callHooksForInfo(
							this.hooks.rename,
							renameIdentifier,
							expression.right
						)
					) {
						this.setVariable(
							expression.left.name,
							this.getVariableInfo(renameIdentifier)
						);
					}
					return;
				}
			}
			this.walkExpression(expression.right);
			this.enterPattern(expression.left, (name, decl) => {
				if (!this.callHooksForName(this.hooks.assign, name, expression)) {
					this.walkExpression(expression.left);
				}
			});
			return;
		}
		this.walkExpression(expression.right);
		if (expression.left.type.endsWith("Pattern")) {
			this.enterPattern(expression.left, (name, decl) => {
				if (!this.callHooksForName(this.hooks.assign, name, expression)) {
					this.defineVariable(name);
				}
			});
			this.walkPattern(expression.left);
		} else {
			this.walkExpression(expression.left);
		}
	}

	walkConditionalExpression(expression) {
		const result = this.hooks.expressionConditionalOperator.call(expression);
		if (result === undefined) {
			this.walkExpression(expression.test);
			this.walkExpression(expression.consequent);
			if (expression.alternate) {
				this.walkExpression(expression.alternate);
			}
		} else {
			if (result) {
				this.walkExpression(expression.consequent);
			} else if (expression.alternate) {
				this.walkExpression(expression.alternate);
			}
		}
	}

	walkNewExpression(expression) {
		const result = this.callHooksForExpression(
			this.hooks.new,
			expression.callee,
			expression
		);
		if (result === true) return;
		this.walkExpression(expression.callee);
		if (expression.arguments) {
			this.walkExpressions(expression.arguments);
		}
	}

	walkYieldExpression(expression) {
		if (expression.argument) {
			this.walkExpression(expression.argument);
		}
	}

	walkTemplateLiteral(expression) {
		if (expression.expressions) {
			this.walkExpressions(expression.expressions);
		}
	}

	walkTaggedTemplateExpression(expression) {
		if (expression.tag) {
			this.walkExpression(expression.tag);
		}
		if (expression.quasi && expression.quasi.expressions) {
			this.walkExpressions(expression.quasi.expressions);
		}
	}

	walkClassExpression(expression) {
		this.walkClass(expression);
	}

	_walkIIFE(functionExpression, options, currentThis) {
		const getVarInfo = argOrThis => {
			const renameIdentifier = this.getRenameIdentifier(argOrThis);
			if (renameIdentifier) {
				if (
					this.callHooksForInfo(
						this.hooks.canRename,
						renameIdentifier,
						argOrThis
					)
				) {
					if (
						!this.callHooksForInfo(
							this.hooks.rename,
							renameIdentifier,
							argOrThis
						)
					) {
						return this.getVariableInfo(renameIdentifier);
					}
				}
			}
			this.walkExpression(argOrThis);
		};
		const params = functionExpression.params;
		const renameThis = currentThis ? getVarInfo(currentThis) : null;
		const varInfoForArgs = options.map(getVarInfo);
		const wasTopLevel = this.scope.topLevelScope;
		this.scope.topLevelScope = false;
		const scopeParams = params.filter(
			(identifier, idx) => !varInfoForArgs[idx]
		);

		// Add function name in scope for recursive calls
		if (functionExpression.id) {
			scopeParams.push(functionExpression.id.name);
		}

		this.inFunctionScope(true, scopeParams, () => {
			if (renameThis) {
				this.setVariable("this", renameThis);
			}
			for (let i = 0; i < varInfoForArgs.length; i++) {
				const varInfo = varInfoForArgs[i];
				if (!varInfo) continue;
				if (!params[i] || params[i].type !== "Identifier") continue;
				this.setVariable(params[i].name, varInfo);
			}
			if (functionExpression.body.type === "BlockStatement") {
				this.prewalkStatement(functionExpression.body);
				this.walkStatement(functionExpression.body);
			} else {
				this.walkExpression(functionExpression.body);
			}
		});
		this.scope.topLevelScope = wasTopLevel;
	}

	walkImportExpression(expression) {
		let result = this.hooks.importCall.call(expression);
		if (result === true) return;

		this.walkExpression(expression.source);
	}

	walkCallExpression(expression) {
		if (
			expression.callee.type === "MemberExpression" &&
			expression.callee.object.type === "FunctionExpression" &&
			!expression.callee.computed &&
			(expression.callee.property.name === "call" ||
				expression.callee.property.name === "bind") &&
			expression.arguments.length > 0
		) {
			// (function(…) { }.call/bind(?, …))
			this._walkIIFE(
				expression.callee.object,
				expression.arguments.slice(1),
				expression.arguments[0]
			);
		} else if (expression.callee.type === "FunctionExpression") {
			// (function(…) { }(…))
			this._walkIIFE(expression.callee, expression.arguments, null);
		} else {
			const callee = this.evaluateExpression(expression.callee);
			if (callee.isIdentifier()) {
				const result1 = this.callHooksForInfo(
					this.hooks.callMemberChain,
					callee.rootInfo,
					expression,
					callee.getMembers()
				);
				if (result1 === true) return;
				const result2 = this.callHooksForInfo(
					this.hooks.call,
					callee.identifier,
					expression
				);
				if (result2 === true) return;
			}

			if (expression.callee) this.walkExpression(expression.callee);
			if (expression.arguments) this.walkExpressions(expression.arguments);
		}
	}

	walkMemberExpression(expression) {
		const exprName = this.getNameForExpression(expression);
		if (exprName) {
			this.walkMemberExpressionWithExpressionName(
				expression,
				exprName.name,
				exprName.rootInfo,
				exprName.getMembers()
			);
			return;
		}
		this.walkExpression(expression.object);
		if (expression.computed === true) this.walkExpression(expression.property);
	}

	walkMemberExpressionWithExpressionName(expression, name, rootInfo, members) {
		const result1 = this.callHooksForInfo(
			this.hooks.expressionMemberChain,
			rootInfo,
			expression,
			members
		);
		if (result1 === true) return;
		const result2 = this.callHooksForInfo(
			this.hooks.expression,
			name,
			expression
		);
		if (result2 === true) return;
		if (expression.object.type === "MemberExpression") {
			// optimize case where expression.object is a MemberExpression too.
			// we can keep info here when calling walkMemberExpression directly
			const property =
				expression.property.name || `${expression.property.value}`;
			name = name.slice(0, -property.length - 1);
			members.pop();
			this.walkMemberExpressionWithExpressionName(
				expression.object,
				name,
				rootInfo,
				members
			);
		} else {
			this.walkExpression(expression.object);
		}
		if (expression.computed === true) this.walkExpression(expression.property);
	}

	walkThisExpression(expression) {
		this.callHooksForName(this.hooks.expression, "this", expression);
	}

	walkIdentifier(expression) {
		this.callHooksForName(this.hooks.expression, expression.name, expression);
	}

	callHooksForExpression(hookMap, expr, ...args) {
		const exprName = this.getNameForExpression(expr);
		if (exprName !== undefined) {
			return this.callHooksForInfoWithFallback(
				hookMap,
				exprName.name,
				undefined,
				undefined,
				...args
			);
		}
	}

	/**
	 * @template T
	 * @template R
	 * @param {HookMap<SyncBailHook<T, R>>} hookMap hooks the should be called
	 * @param {ExpressionNode} expr expression info
	 * @param {function(string, string | ScopeInfo | VariableInfo, function(): string[]): any} fallback callback when variable in not handled by hooks
	 * @param {function(string): any} defined callback when variable is defined
	 * @param {AsArray<T>} args args for the hook
	 * @returns {R} result of hook
	 */
	callHooksForExpressionWithFallback(
		hookMap,
		expr,
		fallback,
		defined,
		...args
	) {
		const exprName = this.getNameForExpression(expr);
		if (exprName !== undefined) {
			return this.callHooksForInfoWithFallback(
				hookMap,
				exprName.name,
				fallback &&
					(name => fallback(name, exprName.rootInfo, exprName.getMembers)),
				defined && (() => defined(exprName.name)),
				...args
			);
		}
	}

	/**
	 * @template T
	 * @template R
	 * @param {HookMap<SyncBailHook<T, R>>} hookMap hooks the should be called
	 * @param {string} name key in map
	 * @param {AsArray<T>} args args for the hook
	 * @returns {R} result of hook
	 */
	callHooksForName(hookMap, name, ...args) {
		return this.callHooksForNameWithFallback(
			hookMap,
			name,
			undefined,
			undefined,
			...args
		);
	}

	/**
	 * @template T
	 * @template R
	 * @param {HookMap<SyncBailHook<T, R>>} hookMap hooks that should be called
	 * @param {ExportedVariableInfo} info variable info
	 * @param  {AsArray<T>} args args for the hook
	 * @returns {R} result of hook
	 */
	callHooksForInfo(hookMap, info, ...args) {
		return this.callHooksForInfoWithFallback(
			hookMap,
			info,
			undefined,
			undefined,
			...args
		);
	}

	/**
	 * @template T
	 * @template R
	 * @param {HookMap<SyncBailHook<T, R>>} hookMap hooks the should be called
	 * @param {ExportedVariableInfo} info variable info
	 * @param {function(string): any} fallback callback when variable in not handled by hooks
	 * @param {function(): any} defined callback when variable is defined
	 * @param {AsArray<T>} args args for the hook
	 * @returns {R} result of hook
	 */
	callHooksForInfoWithFallback(hookMap, info, fallback, defined, ...args) {
		let name;
		if (typeof info === "string") {
			name = info;
		} else {
			if (!(info instanceof VariableInfo)) {
				if (defined !== undefined) {
					return defined();
				}
				return;
			}
			let tagInfo = info.tagInfo;
			while (tagInfo !== undefined) {
				const hook = hookMap.get(tagInfo.tag);
				if (hook !== undefined) {
					this.currentTagData = tagInfo.data;
					const result = hook.call(...args);
					this.currentTagData = undefined;
					if (result !== undefined) return result;
				}
				tagInfo = tagInfo.next;
			}
			if (info.freeName === true) {
				if (defined !== undefined) {
					return defined();
				}
				return;
			}
			name = info.freeName;
		}
		const hook = hookMap.get(name);
		if (hook !== undefined) {
			const result = hook.call(...args);
			if (result !== undefined) return result;
		}
		if (fallback !== undefined) {
			return fallback(name);
		}
	}

	/**
	 * @template T
	 * @template R
	 * @param {HookMap<SyncBailHook<T, R>>} hookMap hooks the should be called
	 * @param {string} name key in map
	 * @param {function(string): any} fallback callback when variable in not handled by hooks
	 * @param {function(): any} defined callback when variable is defined
	 * @param {AsArray<T>} args args for the hook
	 * @returns {R} result of hook
	 */
	callHooksForNameWithFallback(hookMap, name, fallback, defined, ...args) {
		return this.callHooksForInfoWithFallback(
			hookMap,
			this.getVariableInfo(name),
			fallback,
			defined,
			...args
		);
	}

	/**
	 * @deprecated
	 * @param {any} params scope params
	 * @param {function(): void} fn inner function
	 * @returns {void}
	 */
	inScope(params, fn) {
		const oldScope = this.scope;
		this.scope = {
			topLevelScope: oldScope.topLevelScope,
			inTry: false,
			inShorthand: false,
			isStrict: oldScope.isStrict,
			definitions: oldScope.definitions.createChild()
		};

		this.undefineVariable("this");

		this.enterPatterns(params, (ident, pattern) => {
			this.defineVariable(ident);
		});

		fn();

		this.scope = oldScope;
	}

	inFunctionScope(hasThis, params, fn) {
		const oldScope = this.scope;
		this.scope = {
			topLevelScope: oldScope.topLevelScope,
			inTry: false,
			inShorthand: false,
			isStrict: oldScope.isStrict,
			definitions: oldScope.definitions.createChild()
		};

		if (hasThis) {
			this.undefineVariable("this");
		}

		this.enterPatterns(params, (ident, pattern) => {
			this.defineVariable(ident);
		});

		fn();

		this.scope = oldScope;
	}

	inBlockScope(fn) {
		const oldScope = this.scope;
		this.scope = {
			topLevelScope: oldScope.topLevelScope,
			inTry: oldScope.inTry,
			inShorthand: false,
			isStrict: oldScope.isStrict,
			definitions: oldScope.definitions.createChild()
		};

		fn();

		this.scope = oldScope;
	}

	detectStrictMode(statements) {
		const isStrict =
			statements.length >= 1 &&
			statements[0].type === "ExpressionStatement" &&
			statements[0].expression.type === "Literal" &&
			statements[0].expression.value === "use strict";
		if (isStrict) {
			this.scope.isStrict = true;
		}
	}

	enterPatterns(patterns, onIdent) {
		for (const pattern of patterns) {
			if (typeof pattern !== "string") {
				this.enterPattern(pattern, onIdent);
			} else if (pattern) {
				onIdent(pattern);
			}
		}
	}

	enterPattern(pattern, onIdent) {
		if (!pattern) return;
		switch (pattern.type) {
			case "ArrayPattern":
				this.enterArrayPattern(pattern, onIdent);
				break;
			case "AssignmentPattern":
				this.enterAssignmentPattern(pattern, onIdent);
				break;
			case "Identifier":
				this.enterIdentifier(pattern, onIdent);
				break;
			case "ObjectPattern":
				this.enterObjectPattern(pattern, onIdent);
				break;
			case "RestElement":
				this.enterRestElement(pattern, onIdent);
				break;
			case "Property":
				if (pattern.shorthand && pattern.value.type === "Identifier") {
					this.scope.inShorthand = pattern.value.name;
					this.enterIdentifier(pattern.value, onIdent);
					this.scope.inShorthand = false;
				} else {
					this.enterPattern(pattern.value, onIdent);
				}
				break;
		}
	}

	enterIdentifier(pattern, onIdent) {
		if (!this.callHooksForName(this.hooks.pattern, pattern.name, pattern)) {
			onIdent(pattern.name, pattern);
		}
	}

	enterObjectPattern(pattern, onIdent) {
		for (
			let propIndex = 0, len = pattern.properties.length;
			propIndex < len;
			propIndex++
		) {
			const prop = pattern.properties[propIndex];
			this.enterPattern(prop, onIdent);
		}
	}

	enterArrayPattern(pattern, onIdent) {
		for (
			let elementIndex = 0, len = pattern.elements.length;
			elementIndex < len;
			elementIndex++
		) {
			const element = pattern.elements[elementIndex];
			this.enterPattern(element, onIdent);
		}
	}

	enterRestElement(pattern, onIdent) {
		this.enterPattern(pattern.argument, onIdent);
	}

	enterAssignmentPattern(pattern, onIdent) {
		this.enterPattern(pattern.left, onIdent);
	}

	/**
	 * @param {ExpressionNode} expression expression node
	 * @returns {BasicEvaluatedExpression | undefined} evaluation result
	 */
	evaluateExpression(expression) {
		try {
			const hook = this.hooks.evaluate.get(expression.type);
			if (hook !== undefined) {
				const result = hook.call(expression);
				if (result !== undefined) {
					if (result) {
						result.setExpression(expression);
					}
					return result;
				}
			}
		} catch (e) {
			console.warn(e);
			// ignore error
		}
		return new BasicEvaluatedExpression()
			.setRange(expression.range)
			.setExpression(expression);
	}

	parseString(expression) {
		switch (expression.type) {
			case "BinaryExpression":
				if (expression.operator === "+") {
					return (
						this.parseString(expression.left) +
						this.parseString(expression.right)
					);
				}
				break;
			case "Literal":
				return expression.value + "";
		}
		throw new Error(
			expression.type + " is not supported as parameter for require"
		);
	}

	parseCalculatedString(expression) {
		switch (expression.type) {
			case "BinaryExpression":
				if (expression.operator === "+") {
					const left = this.parseCalculatedString(expression.left);
					const right = this.parseCalculatedString(expression.right);
					if (left.code) {
						return {
							range: left.range,
							value: left.value,
							code: true,
							conditional: false
						};
					} else if (right.code) {
						return {
							range: [
								left.range[0],
								right.range ? right.range[1] : left.range[1]
							],
							value: left.value + right.value,
							code: true,
							conditional: false
						};
					} else {
						return {
							range: [left.range[0], right.range[1]],
							value: left.value + right.value,
							code: false,
							conditional: false
						};
					}
				}
				break;
			case "ConditionalExpression": {
				const consequent = this.parseCalculatedString(expression.consequent);
				const alternate = this.parseCalculatedString(expression.alternate);
				const items = [];
				if (consequent.conditional) {
					items.push(...consequent.conditional);
				} else if (!consequent.code) {
					items.push(consequent);
				} else {
					break;
				}
				if (alternate.conditional) {
					items.push(...alternate.conditional);
				} else if (!alternate.code) {
					items.push(alternate);
				} else {
					break;
				}
				return {
					range: undefined,
					value: "",
					code: true,
					conditional: items
				};
			}
			case "Literal":
				return {
					range: expression.range,
					value: expression.value + "",
					code: false,
					conditional: false
				};
		}
		return {
			range: undefined,
			value: "",
			code: true,
			conditional: false
		};
	}

	parse(source, initialState) {
		let ast;
		let comments;
		const semicolons = new Set();
		if (typeof source === "object" && source !== null) {
			ast = source;
			comments = source.comments;
		} else {
			comments = [];
			ast = JavascriptParser.parse(source, {
				sourceType: this.sourceType,
				onComment: comments,
				onInsertedSemicolon: pos => semicolons.add(pos)
			});
		}

		const oldScope = this.scope;
		const oldState = this.state;
		const oldComments = this.comments;
		const oldSemicolons = this.semicolons;
		const oldStatementEndPos = this.statementEndPos;
		const oldLastStatementEndPos = this.lastStatementEndPos;
		const oldStatementStartPos = this.statementStartPos;
		this.scope = {
			topLevelScope: true,
			inTry: false,
			inShorthand: false,
			isStrict: false,
			definitions: new StackedMap()
		};
		const state = (this.state = initialState || {});
		this.comments = comments;
		this.semicolons = semicolons;
		this.statementEndPos = NaN;
		this.lastStatementEndPos = NaN;
		this.statementStartPos = NaN;
		if (this.hooks.program.call(ast, comments) === undefined) {
			this.detectStrictMode(ast.body);
			this.prewalkStatements(ast.body);
			this.blockPrewalkStatements(ast.body);
			this.walkStatements(ast.body);
		}
		this.hooks.finish.call(ast, comments);
		this.scope = oldScope;
		this.state = oldState;
		this.comments = oldComments;
		this.semicolons = oldSemicolons;
		this.statementEndPos = oldStatementEndPos;
		this.lastStatementEndPos = oldLastStatementEndPos;
		this.statementStartPos = oldStatementStartPos;
		return state;
	}

	evaluate(source) {
		const ast = JavascriptParser.parse("(" + source + ")", {
			sourceType: this.sourceType,
			locations: false
		});
		// TODO(https://github.com/acornjs/acorn/issues/741)
		// @ts-ignore
		if (ast.body.length !== 1 || ast.body[0].type !== "ExpressionStatement") {
			throw new Error("evaluate: Source is not a expression");
		}
		// TODO(https://github.com/acornjs/acorn/issues/741)
		// @ts-ignore
		return this.evaluateExpression(ast.body[0].expression);
	}

	getComments(range) {
		return this.comments.filter(
			comment => comment.range[0] >= range[0] && comment.range[1] <= range[1]
		);
	}

	isAsiPosition(pos) {
		return (
			this.statementStartPos === pos &&
			this.semicolons.has(this.lastStatementEndPos)
		);
	}

	getTagData(name, tag) {
		const info = this.scope.definitions.get(name);
		if (info instanceof VariableInfo) {
			let tagInfo = info.tagInfo;
			while (tagInfo !== undefined) {
				if (tagInfo.tag === tag) return tagInfo.data;
				tagInfo = tagInfo.next;
			}
		}
	}

	tagVariable(name, tag, data) {
		const oldInfo = this.scope.definitions.get(name);
		/** @type {VariableInfo} */
		let newInfo;
		if (oldInfo === undefined) {
			newInfo = new VariableInfo(this.scope, name, {
				tag,
				data,
				next: undefined
			});
		} else if (oldInfo instanceof VariableInfo) {
			newInfo = new VariableInfo(oldInfo.declaredScope, oldInfo.freeName, {
				tag,
				data,
				next: oldInfo.tagInfo
			});
		} else {
			newInfo = new VariableInfo(oldInfo, true, {
				tag,
				data,
				next: undefined
			});
		}
		this.scope.definitions.set(name, newInfo);
	}

	defineVariable(name) {
		const oldInfo = this.scope.definitions.get(name);
		// Don't redefine variable in same scope to keep existing tags
		if (oldInfo instanceof VariableInfo && oldInfo.declaredScope === this.scope)
			return;
		this.scope.definitions.set(name, this.scope);
	}

	undefineVariable(name) {
		this.scope.definitions.delete(name);
	}

	isVariableDefined(name) {
		const info = this.scope.definitions.get(name);
		if (info === undefined) return false;
		if (info instanceof VariableInfo) {
			return info.freeName === true;
		}
		return true;
	}

	/**
	 * @param {string} name variable name
	 * @returns {ExportedVariableInfo} info for this variable
	 */
	getVariableInfo(name) {
		const value = this.scope.definitions.get(name);
		if (value === undefined) {
			return name;
		} else {
			return value;
		}
	}

	/**
	 * @param {string} name variable name
	 * @param {ExportedVariableInfo} variableInfo new info for this variable
	 * @returns {void}
	 */
	setVariable(name, variableInfo) {
		if (typeof variableInfo === "string") {
			if (variableInfo === name) {
				this.scope.definitions.delete(name);
			} else {
				this.scope.definitions.set(
					name,
					new VariableInfo(this.scope, variableInfo, undefined)
				);
			}
		} else {
			this.scope.definitions.set(name, variableInfo);
		}
	}

	parseCommentOptions(range) {
		const comments = this.getComments(range);
		if (comments.length === 0) {
			return EMPTY_COMMENT_OPTIONS;
		}
		let options = {};
		let errors = [];
		for (const comment of comments) {
			const { value } = comment;
			if (value && webpackCommentRegExp.test(value)) {
				// try compile only if webpack options comment is present
				try {
					const val = vm.runInNewContext(`(function(){return {${value}};})()`);
					Object.assign(options, val);
				} catch (e) {
					e.comment = comment;
					errors.push(e);
				}
			}
		}
		return { options, errors };
	}

	/**
	 * @param {ExpressionNode} expression an expression
	 * @returns {{ name: string, rootInfo: ExportedVariableInfo, getMembers: () => string[]}} name info
	 */
	getNameForExpression(expression) {
		let expr = expression;
		const exprName = [];
		while (expr.type === "MemberExpression") {
			if (expr.object.type === "Super") return undefined;
			if (expr.computed) {
				if (expr.property.type !== "Literal") break;
				exprName.push(`${expr.property.value}`);
			} else {
				if (expr.property.type !== "Identifier") break;
				exprName.push(expr.property.name);
			}
			expr = expr.object;
		}
		let rootName;
		if (expr.type === "Identifier") {
			rootName = expr.name;
		} else if (expr.type === "ThisExpression") {
			rootName = "this";
		} else {
			return undefined;
		}
		const rootInfo = this.getVariableInfo(rootName);
		/** @type {string | ScopeInfo | true} */
		let resolvedRoot;
		if (rootInfo instanceof VariableInfo) {
			resolvedRoot = rootInfo.freeName;
		} else {
			resolvedRoot = rootInfo;
		}
		if (typeof resolvedRoot !== "string") {
			return undefined;
		}
		let name = resolvedRoot;
		for (let i = exprName.length - 1; i >= 0; i--) {
			name = name + "." + exprName[i];
		}
		let reversed = false;
		return {
			name,
			rootInfo,
			getMembers: () => {
				if (!reversed) {
					exprName.reverse();
					reversed = true;
				}
				return exprName;
			}
		};
	}

	static parse(code, options) {
		const type = options ? options.sourceType : "module";
		const parserOptions = {
			...defaultParserOptions,
			...options
		};

		if (type === "auto") {
			parserOptions.sourceType = "module";
		} else if (parserOptions.sourceType === "script") {
			parserOptions.allowReturnOutsideFunction = true;
		}

		let ast;
		let error;
		let threw = false;
		try {
			ast = parser.parse(code, parserOptions);
		} catch (e) {
			error = e;
			threw = true;
		}

		if (threw && type === "auto") {
			parserOptions.sourceType = "script";
			parserOptions.allowReturnOutsideFunction = true;
			if (Array.isArray(parserOptions.onComment)) {
				parserOptions.onComment.length = 0;
			}
			try {
				ast = parser.parse(code, parserOptions);
				threw = false;
			} catch (e) {
				threw = true;
			}
		}

		if (threw) {
			throw error;
		}

		return ast;
	}
}

module.exports = JavascriptParser;
