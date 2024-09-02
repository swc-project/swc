var _define_property = require("@swc/helpers/_/_define_property");
class Item extends Component {
    constructor(props){
        super(props), _define_property._(this, "input", this.props.item);
    }
}
