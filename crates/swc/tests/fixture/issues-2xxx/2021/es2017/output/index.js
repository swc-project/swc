import { _ as _define_property } from "@swc/helpers/_/_define_property";
class Item extends Component {
    constructor(props){
        super(props);
        _define_property(this, "input", this.props.item);
    }
}
