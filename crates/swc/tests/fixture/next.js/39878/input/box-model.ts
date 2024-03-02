import type { UIStore, UIThunkAction } from "ui/actions";
import { isInspectorSelected } from "ui/reducers/app";
import { AppStartListening } from "ui/setup/listenerMiddleware";
import { getBoundingRectAsync, getComputedStyleAsync } from "ui/suspense/styleCaches";

import { nodeSelected } from "../../markup/reducers/markup";
import { LAYOUT_NUMERIC_FIELDS, Layout, layoutUpdated } from "../reducers/box-model";

export function setupBoxModel(store: UIStore, startAppListening: AppStartListening) {
  // Any time a new node is selected in the "Markup" panel,
  // try to update the box model layout data
  startAppListening({
    actionCreator: nodeSelected,
    effect: async (action, listenerApi) => {
      const { extra, getState, dispatch } = listenerApi;
      const { ThreadFront, protocolClient, replayClient } = extra;
      const state = getState();
      const { selectedNode, tree } = state.markup;

      if (!isInspectorSelected(state) || !selectedNode || !ThreadFront.currentPause?.pauseId) {
        return;
      }

      const nodeInfo = tree.entities[selectedNode];

      if (!nodeInfo) {
        return;
      }

      const [bounds, style] = await Promise.all([
        getBoundingRectAsync(
          protocolClient,
          ThreadFront.sessionId!,
          ThreadFront.currentPause.pauseId,
          selectedNode
        ),
        getComputedStyleAsync(
          protocolClient,
          ThreadFront.sessionId!,
          ThreadFront.currentPause.pauseId,
          selectedNode
        ),
      ]);

      if (!bounds || !style) {
        return;
      }

      const layout = {
        width: parseFloat(bounds.width.toPrecision(6)),
        height: parseFloat(bounds.height.toPrecision(6)),
        autoMargins: {},
      } as Layout;

      for (const prop of LAYOUT_NUMERIC_FIELDS) {
        layout[prop] = style.get(prop)!;
      }

      // Update the redux store with the latest layout properties and update the box model view.
      dispatch(layoutUpdated(layout));
    },
  });
}
