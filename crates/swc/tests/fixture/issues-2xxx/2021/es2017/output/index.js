import _define_property from "@swc/helpers/lib/_define_property.js";
class Item extends Component {
    constructor(props){
        super(props);
        _define_property(this, "input", this.props.item);
    }
}
