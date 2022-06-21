import _define_property from "@swc/helpers/src/_define_property.mjs";
class Item extends Component {
    constructor(props){
        super(props);
        _define_property(this, "input", this.props.item);
    }
}
