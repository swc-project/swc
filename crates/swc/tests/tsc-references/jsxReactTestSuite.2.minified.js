//// [jsxReactTestSuite.tsx]
<div>text</div>, <div>
  {this.props.children}
</div>, <div>
  <div><br/></div>
  <Component>{foo}<br/>{bar}</Component>
  <br/>
</div>, <Composite>
    {this.props.children}
</Composite>, <Composite>
    <Composite2/>
</Composite>;
var x = <div attr1={"foobar"} attr2={"foobarbazbug"} attr3={"foobarbazbug"} attr4="baz">
  </div>;
<div>
    {}
    {}
    <span>
      {}
    </span>
    {}
    <br/>
    {}
    {}
  </div>, <div attr1="foo">
    <span attr2="bar"/>
  </div>, <div>&nbsp;</div>, <div>&nbsp; </div>, <hasOwnProperty>testing</hasOwnProperty>, <Component constructor="foo"/>, <Namespace.Component/>, <Namespace.DeepNamespace.Component/>, <Component {...x} y={2} z/>, <Component {...this.props} sound="moo"/>, <font-face/>, <Component x={y}/>, <x-component/>, <Component {...x}/>, <Component {...x} y={2}/>, <Component {...x} y={2} z/>, <Component x={1} {...y}/>, <Component x={1} y="2" {...z} {...z}><Child/></Component>, <Component x="1" {...z = {
    y: 2
}} z={3}>Text</Component>;
