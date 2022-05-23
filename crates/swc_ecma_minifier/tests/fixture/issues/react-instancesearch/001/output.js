import { defer } from "./utils";
export default function createWidgetsManager(onWidgetsUpdate) {
    const widgets = [];
    let scheduled = !1;
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
};
