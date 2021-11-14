/*@jsxRuntime automatic @jsxImportSource react*/
import React from "react";
const MDXLayout = class extends React.Component {
  render() {
    return <>{this.props.children}</>;
  }
};
function MDXContent(props = {}) {
  const _components = Object.assign({
    p: "p"
  }, props.components);
  const _content = <><_components.p>{"a"}</_components.p></>;
  return MDXLayout ? <MDXLayout {...props}>{_content}</MDXLayout> : _content;
}
export default MDXContent;
