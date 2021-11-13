function MDXContent(props = {
}) {
    const { wrapper: MDXLayout  } = props.components || {
    };
    return MDXLayout ? <MDXLayout {...props}><_createMdxContent /></MDXLayout> : _createMdxContent();
    function _createMdxContent() {
        const _components = Object.assign({
            em: "em",
            p: "p"
        }, props.components);
        return <_components.p ><_components.em >{"a"}</_components.em></_components.p>;
    }
}
export default MDXContent;
