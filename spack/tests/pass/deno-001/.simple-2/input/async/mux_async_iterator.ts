import { deferred } from "./deferred";

export class MuxAsyncIterator<T> implements AsyncIterable<T> {
  private signal = deferred();
}
