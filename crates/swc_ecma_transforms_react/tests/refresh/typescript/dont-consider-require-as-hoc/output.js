const A = require('A');
const B = foo ? require('X') : require('Y');
const C = requireCond(gk, 'C');
const D = import('D');
import E = require('E');
export default function App() {
    return <div>
          <A/>
          <B/>
          <C/>
          <D/>
          <E/>
        </div>;
}
_c = App;
var _c;
$RefreshReg$(_c, "App");
