// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/ws/close_ws.ts


/** Use this function to close a ws connection properly */
export function closeWS(ws: WebSocket, code?: number, reason?: string) {
  if (ws.readyState !== WebSocket.OPEN) return;

  ws.close(code, reason);
}
