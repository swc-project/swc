

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
                }
            }
            : null,
        process.env.NEXT_RUNTIME !== 'edge' && renderOpts.optimizeCss
            ? async (html: string) => {
            }
            : null,
        inAmpMode || hybridAmp
            ? (html: string) => {
                return html.replace(/&amp;amp=1/g, '&amp=1')
            }
            : null,
    ].filter(nonNullable)

}
