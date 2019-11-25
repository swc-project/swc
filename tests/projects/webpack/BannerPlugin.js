/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const validateOptions = require("schema-utils");
const { ConcatSource } = require("webpack-sources");
const ModuleFilenameHelpers = require("./ModuleFilenameHelpers");
const Template = require("./Template");

const schema = require("../schemas/plugins/BannerPlugin.json");

/** @typedef {import("../declarations/plugins/BannerPlugin").BannerPluginArgument} BannerPluginArgument */
/** @typedef {import("../declarations/plugins/BannerPlugin").BannerPluginOptions} BannerPluginOptions */
/** @typedef {import("./Compiler")} Compiler */

const wrapComment = str => {
	if (!str.includes("\n")) {
		return Template.toComment(str);
	}
	return `/*!\n * ${str
		.replace(/\*\//g, "* /")
		.split("\n")
		.join("\n * ")
		.replace(/\s+\n/g, "\n")
		.trimRight()}\n */`;
};

class BannerPlugin {
	/**
	 * @param {BannerPluginArgument} options options object
	 */
	constructor(options) {
		if (typeof options === "string" || typeof options === "function") {
			options = {
				banner: options
			};
		}

		validateOptions(schema, options, {
			name: "Banner Plugin",
			baseDataPath: "options"
		});

		this.options = options;

		const bannerOption = options.banner;
		if (typeof bannerOption === "function") {
			const getBanner = bannerOption;
			this.banner = this.options.raw
				? getBanner
				: data => wrapComment(getBanner(data));
		} else {
			const banner = this.options.raw
				? bannerOption
				: wrapComment(bannerOption);
			this.banner = () => banner;
		}
	}

	/**
	 * @param {Compiler} compiler webpack compiler
	 * @returns {void}
	 */
	apply(compiler) {
		const options = this.options;
		const banner = this.banner;
		const matchObject = ModuleFilenameHelpers.matchObject.bind(
			undefined,
			options
		);

		compiler.hooks.compilation.tap("BannerPlugin", compilation => {
			compilation.hooks.optimizeChunkAssets.tap("BannerPlugin", chunks => {
				for (const chunk of chunks) {
					if (options.entryOnly && !chunk.canBeInitial()) {
						continue;
					}

					for (const file of chunk.files) {
						if (!matchObject(file)) {
							continue;
						}

						let filename = file;

						const data = {
							chunk,
							filename
						};

						const comment = compilation.getPath(banner, data);

						compilation.updateAsset(
							file,
							old => new ConcatSource(comment, "\n", old)
						);
					}
				}
			});
		});
	}
}

module.exports = BannerPlugin;
