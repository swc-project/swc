/*@jsxRuntime automatic @jsxImportSource react*/
export var X = () => <Y />;
function MDXContent(props = {}) {
  const _components = Object.assign({}, props.components), {wrapper: MDXLayout} = _components;
  const _content = <><X /></>;
  return MDXLayout ? <MDXLayout {...props}>{_content}</MDXLayout> : _content;
}
export default MDXContent;
