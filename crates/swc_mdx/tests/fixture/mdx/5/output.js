/*@jsxRuntime automatic @jsxImportSource react*/
const MDXLayout = function Layout({components, ...props}) {
  return <section {...props} />;
};
function MDXContent(props = {}) {
  const _components = Object.assign({
    p: "p"
  }, props.components);
  const _content = <><_components.p>{"a"}</_components.p></>;
  return MDXLayout ? <MDXLayout {...props}>{_content}</MDXLayout> : _content;
}
export default MDXContent;
