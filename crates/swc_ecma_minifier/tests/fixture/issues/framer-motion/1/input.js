// `resolveVariantFromProps` in framer-motion
// https://github.com/motiondivision/motion/blob/ecd97f7dce8954be300aa73ab6a96208437941c5/packages/framer-motion/src/render/utils/resolve-variants.ts#L31-L72

export function resolveVariantFromProps(props, definition, custom, visualElement) {
    if (typeof definition === "function") {
        const [current, velocity] = getValueState(visualElement)
        definition = definition(
            custom !== undefined ? custom : props.custom,
            current,
            velocity
        )
    }

    if (typeof definition === "string") {
        definition = props.variants && props.variants[definition]
    }

    if (typeof definition === "function") {
        const [current, velocity] = getValueState(visualElement)
        definition = definition(
            custom !== undefined ? custom : props.custom,
            current,
            velocity
        )
    }

    return definition
}
