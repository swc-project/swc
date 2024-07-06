import { defer } from "./utils";
export default function createWidgetsManager(onWidgetsUpdate) {
    const widgets = [];
    // Is an update scheduled?
    let scheduled = !1;
    // The state manager's updates need to be batched since more than one
    // component can register or unregister widgets during the same tick.
    function scheduleUpdate() {
        scheduled || (scheduled = !0, defer(()=>{
            scheduled = !1, onWidgetsUpdate();
        }));
    }
    return {
        registerWidget: (widget)=>(widgets.push(widget), scheduleUpdate(), function() {
                widgets.splice(widgets.indexOf(widget), 1), scheduleUpdate();
            }),
        update: scheduleUpdate,
        getWidgets: ()=>widgets
    };
}
