

export async function postProcessHTML(
) {
    const postProcessors: Array<PostProcessorFunction> = [
        process.env.NEXT_RUNTIME !== 'edge' && inAmpMode
            ? async (html: string) => {
                const optimizeAmp = require('./optimize-amp')
                    .default as typeof import('./optimize-amp').default
                html = await optimizeAmp!(html, renderOpts.ampOptimizerConfig)
                if (!renderOpts.ampSkipValidation && renderOpts.ampValidator) {
                    await renderOpts.ampValidator(html, pathname)
                }
                return html
            }
            : null,
        process.env.NEXT_RUNTIME !== 'edge' && renderOpts.optimizeFonts
            ? async (html: string) => {
                const getFontDefinition = (url: string): string => {
                    if (renderOpts.fontManifest) {
                        const { getFontDefinitionFromManifest } =
                            require('./font-utils') as typeof import('./font-utils')
                        return getFontDefinitionFromManifest!(
                            url,
                            renderOpts.fontManifest
                        )
                    }
                    return ''
                }
                return await processHTML(
                    html,
                    { getFontDefinition },
                    {
                        optimizeFonts: renderOpts.optimizeFonts,
                    }
                )
            }
            : null,
        process.env.NEXT_RUNTIME !== 'edge' && renderOpts.optimizeCss
            ? async (html: string) => {
                // eslint-disable-next-line import/no-extraneous-dependencies
                const Critters = require('critters')
                const cssOptimizer = new Critters({
                    ssrMode: true,
                    reduceInlineStyles: false,
                    path: renderOpts.distDir,
                    publicPath: `${renderOpts.assetPrefix}/_next/`,
                    preload: 'media',
                    fonts: false,
                    ...renderOpts.optimizeCss,
                })
                return await cssOptimizer.process(html)
            }
            : null,
        inAmpMode || hybridAmp
            ? (html: string) => {
                return html.replace(/&amp;amp=1/g, '&amp=1')
            }
            : null,
    ].filter(nonNullable)

}
