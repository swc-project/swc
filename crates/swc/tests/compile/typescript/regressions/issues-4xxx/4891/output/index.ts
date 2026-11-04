import { _ as _class_private_field_loose_base } from "@swc/helpers/_/_class_private_field_loose_base";
import { _ as _class_private_field_loose_key } from "@swc/helpers/_/_class_private_field_loose_key";
var _channelName = /*#__PURE__*/ _class_private_field_loose_key("_channelName"), _listeners = /*#__PURE__*/ _class_private_field_loose_key("_listeners");
export class LocalStorageChannel {
    constructor(channelName){
        Object.defineProperty(this, _channelName, {
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, _listeners, {
            writable: true,
            value: void 0
        });
        _class_private_field_loose_base(this, _channelName)[_channelName] = channelName;
        _class_private_field_loose_base(this, _listeners)[_listeners] = [];
        window.addEventListener("storage", (event)=>this.onStorageEvent(event));
    }
}
