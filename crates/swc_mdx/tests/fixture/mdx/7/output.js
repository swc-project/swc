function MDXContent(props = {
}) {
    const { wrapper: MDXLayout , X  } = props.components || {
    };
    return MDXLayout ? <MDXLayout {...props}><_createMdxContent /></MDXLayout> : _createMdxContent();
    function _createMdxContent() {
        return <X />;
    }
}
export default MDXContent;
