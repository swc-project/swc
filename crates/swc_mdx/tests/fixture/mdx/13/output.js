function MDXContent(props = {
}) {
    const { wrapper: MDXLayout  } = props.components || {
    };
    return MDXLayout ? <MDXLayout {...props}><_createMdxContent /></MDXLayout> : _createMdxContent();
    function _createMdxContent() {
        const _components = Object.assign(props.components);
        return <>a {} b</>;
    }
}
export default MDXContent;
