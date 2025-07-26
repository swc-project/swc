//// [tsxAttributeResolution14.tsx]
define([
    "require"
], function(require) {
    "use strict";
});
//// [react.d.ts]
define([
    "require"
], function(require) {
    "use strict";
});
//// [file.tsx]
define([
    "require"
], function(require) {
    "use strict";
    function VerticalNavMenuItem(prop) {
        return <div>props.primaryText</div>;
    }
    function VerticalNav() {
        return <div>
      <VerticalNavMenuItem primaryText={2}/>  // error
      <VerticalNavMenuItem justRandomProp={2} primaryText={"hello"}/>  // ok
      <VerticalNavMenuItem justRandomProp1={true} primaryText={"hello"}/>  // error
    </div>;
    }
});
