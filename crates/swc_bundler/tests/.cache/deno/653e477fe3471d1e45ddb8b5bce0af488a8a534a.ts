// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/rest/create_request_body.ts


import type { FileContent } from "../types/discordeno/file_content.ts";
import { USER_AGENT } from "../util/constants.ts";
import { rest, RestPayload, RestRequest } from "./rest.ts";

/** Creates the request body and headers that are necessary to send a request. Will handle different types of methods and everything necessary for discord. */
export function createRequestBody(queuedRequest: { request: RestRequest; payload: RestPayload }) {
  const headers: { [key: string]: string } = {
    Authorization: rest.token,
    "User-Agent": USER_AGENT,
  };

  // GET METHODS SHOULD NOT HAVE A BODY
  if (queuedRequest.request.method.toUpperCase() === "GET") {
    queuedRequest.payload.body = undefined;
  }

  // IF A REASON IS PROVIDED ENCODE IT IN HEADERS
  if (queuedRequest.payload.body?.reason) {
    headers["X-Audit-Log-Reason"] = encodeURIComponent(queuedRequest.payload.body.reason as string);
  }

  // IF A FILE/ATTACHMENT IS PRESENT WE NEED SPECIAL HANDLING
  if (queuedRequest.payload.body?.file) {
    if (!Array.isArray(queuedRequest.payload.body.file)) {
      queuedRequest.payload.body.file = [queuedRequest.payload.body.file];
    }

    const form = new FormData();

    for (let i = 0; i < (queuedRequest.payload.body.file as FileContent[]).length; i++) {
      form.append(
        `file${i}`,
        (queuedRequest.payload.body.file as FileContent[])[i].blob,
        (queuedRequest.payload.body.file as FileContent[])[i].name
      );
    }

    form.append("payload_json", JSON.stringify({ ...queuedRequest.payload.body, file: undefined }));
    queuedRequest.payload.body.file = form;
  } else if (queuedRequest.payload.body && !["GET", "DELETE"].includes(queuedRequest.request.method)) {
    headers["Content-Type"] = "application/json";
  }

  return {
    headers,
    body: (queuedRequest.payload.body?.file || JSON.stringify(queuedRequest.payload.body)) as FormData | string,
    method: queuedRequest.request.method.toUpperCase(),
  };
}
