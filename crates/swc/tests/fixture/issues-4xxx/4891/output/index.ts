import { _ as _class_private_field_loose_key } from "@swc/helpers/_/_class_private_field_loose_key";
var _channelName = _class_private_field_loose_key("_channelName"), _listeners = _class_private_field_loose_key("_listeners");
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
        this.#channelName = channelName;
        this.#listeners = [];
        window.addEventListener("storage", (event)=>this.onStorageEvent(event));
    }
}
