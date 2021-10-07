import { defer } from './utils';

export default function createWidgetsManager(onWidgetsUpdate) {
    const widgets = [];
    // Is an update scheduled?
    let scheduled = false;

    // The state manager's updates need to be batched since more than one
    // component can register or unregister widgets during the same tick.
    function scheduleUpdate() {
        if (scheduled) {
            return;
        }
        scheduled = true;
        defer(() => {
            scheduled = false;
            onWidgetsUpdate();
        });
    }

    return {
        registerWidget(widget) {
            widgets.push(widget);
            scheduleUpdate();
            return function unregisterWidget() {
                widgets.splice(widgets.indexOf(widget), 1);
                scheduleUpdate();
            };
        },
        update: scheduleUpdate,
        getWidgets() {
            return widgets;
        },
    };
}