"use strict";
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [
        16
    ],
    {
        /***/ 19: /***/ function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
            /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                /* harmony export */ hJ: function() {
                    return /* binding */ ba;
                },
                /* harmony export */ PL: function() {
                    return /* binding */ lh;
                }
            });
            /* unused harmony exports AbstractUserDataWriter, Bytes, CACHE_SIZE_UNLIMITED, CollectionReference, DocumentReference, DocumentSnapshot, FieldPath, FieldValue, Firestore, FirestoreError, GeoPoint, LoadBundleTask, Query, QueryConstraint, QueryDocumentSnapshot, QuerySnapshot, SnapshotMetadata, Timestamp, Transaction, WriteBatch, _DatabaseId, _DocumentKey, _EmptyCredentialsProvider, _FieldPath, _cast, _debugAssert, _isBase64Available, _logWarn, _validateIsNotUsedTogether, addDoc, arrayRemove, arrayUnion, clearIndexedDbPersistence, collectionGroup, connectFirestoreEmulator, deleteDoc, deleteField, disableNetwork, doc, documentId, enableIndexedDbPersistence, enableMultiTabIndexedDbPersistence, enableNetwork, endAt, endBefore, ensureFirestoreConfigured, executeWrite, getDoc, getDocFromCache, getDocFromServer, getDocsFromCache, getDocsFromServer, getFirestore, increment, initializeFirestore, limit, limitToLast, loadBundle, namedQuery, onSnapshot, onSnapshotsInSync, orderBy, query, queryEqual, refEqual, runTransaction, serverTimestamp, setDoc, setLogLevel, snapshotEqual, startAfter, startAt, terminate, updateDoc, waitForPendingWrites, where, writeBatch */ /* harmony import */ var hn, ln, _firebase_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2238), _firebase_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8463), _firebase_logger__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3333), _firebase_util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4444), _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(3510);
            __webpack_require__(4155);
            const S = "@firebase/firestore";
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * Simple wrapper around a nullable UID. Mostly exists to make code more
                 * readable.
                 */ class D {
                constructor(t){
                    this.uid = t;
                }
                isAuthenticated() {
                    return null != this.uid;
                }
                /**
                     * Returns a key representing this user, suitable for inclusion in a
                     * dictionary.
                     */ toKey() {
                    return this.isAuthenticated() ? "uid:" + this.uid : "anonymous-user";
                }
                isEqual(t) {
                    return t.uid === this.uid;
                }
            }
            /** A user with a null UID. */ D.UNAUTHENTICATED = new D(null), // TODO(mikelehen): Look into getting a proper uid-equivalent for
            // non-FirebaseAuth providers.
            D.GOOGLE_CREDENTIALS = new D("google-credentials-uid"), D.FIRST_PARTY = new D("first-party-uid"), D.MOCK_USER = new D("mock-user");
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ let C = "9.4.0";
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ const N = new _firebase_logger__WEBPACK_IMPORTED_MODULE_2__ /* .Logger */ .Yd("@firebase/firestore");
            // Helper methods are needed because variables can't be exported as read/write
            function x() {
                return N.logLevel;
            }
            function $(t, ...e) {
                if (N.logLevel <= _firebase_logger__WEBPACK_IMPORTED_MODULE_2__ /* .LogLevel.DEBUG */ .in.DEBUG) {
                    const n = e.map(M);
                    N.debug(`Firestore (${C}): ${t}`, ...n);
                }
            }
            function O(t, ...e) {
                if (N.logLevel <= _firebase_logger__WEBPACK_IMPORTED_MODULE_2__ /* .LogLevel.ERROR */ .in.ERROR) {
                    const n = e.map(M);
                    N.error(`Firestore (${C}): ${t}`, ...n);
                }
            }
            /**
                 * @internal
                 */ function F(t, ...e) {
                if (N.logLevel <= _firebase_logger__WEBPACK_IMPORTED_MODULE_2__ /* .LogLevel.WARN */ .in.WARN) {
                    const n = e.map(M);
                    N.warn(`Firestore (${C}): ${t}`, ...n);
                }
            }
            /**
                 * Converts an additional log parameter to a string representation.
                 */ function M(t) {
                if ("string" == typeof t) return t;
                try {
                    return JSON.stringify(t);
                } catch (e) {
                    // Converting to JSON failed, just log the object directly
                    return t;
                }
            }
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * Unconditionally fails, throwing an Error with the given message.
                 * Messages are stripped in production builds.
                 *
                 * Returns `never` and can be used in expressions:
                 * @example
                 * let futureVar = fail('not implemented yet');
                 */ function L(t = "Unexpected state") {
                // Log the failure in addition to throw an exception, just in case the
                // exception is swallowed.
                const e = `FIRESTORE (${C}) INTERNAL ASSERTION FAILED: ` + t;
                // NOTE: We don't use FirestoreError here because these are internal failures
                // that cannot be handled by the user. (Also it would create a circular
                // dependency between the error and assert modules which doesn't work.)
                throw O(e), Error(e);
            }
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ const K = {
                // Causes are copied from:
                // https://github.com/grpc/grpc/blob/bceec94ea4fc5f0085d81235d8e1c06798dc341a/include/grpc%2B%2B/impl/codegen/status_code_enum.h
                /** Not an error; returned on success. */ OK: "ok",
                /** The operation was cancelled (typically by the caller). */ CANCELLED: "cancelled",
                /** Unknown error or an error from a different error domain. */ UNKNOWN: "unknown",
                /**
                     * Client specified an invalid argument. Note that this differs from
                     * FAILED_PRECONDITION. INVALID_ARGUMENT indicates arguments that are
                     * problematic regardless of the state of the system (e.g., a malformed file
                     * name).
                     */ INVALID_ARGUMENT: "invalid-argument",
                /**
                     * Deadline expired before operation could complete. For operations that
                     * change the state of the system, this error may be returned even if the
                     * operation has completed successfully. For example, a successful response
                     * from a server could have been delayed long enough for the deadline to
                     * expire.
                     */ DEADLINE_EXCEEDED: "deadline-exceeded",
                /** Some requested entity (e.g., file or directory) was not found. */ NOT_FOUND: "not-found",
                /**
                     * Some entity that we attempted to create (e.g., file or directory) already
                     * exists.
                     */ ALREADY_EXISTS: "already-exists",
                /**
                     * The caller does not have permission to execute the specified operation.
                     * PERMISSION_DENIED must not be used for rejections caused by exhausting
                     * some resource (use RESOURCE_EXHAUSTED instead for those errors).
                     * PERMISSION_DENIED must not be used if the caller can not be identified
                     * (use UNAUTHENTICATED instead for those errors).
                     */ PERMISSION_DENIED: "permission-denied",
                /**
                     * The request does not have valid authentication credentials for the
                     * operation.
                     */ UNAUTHENTICATED: "unauthenticated",
                /**
                     * Some resource has been exhausted, perhaps a per-user quota, or perhaps the
                     * entire file system is out of space.
                     */ RESOURCE_EXHAUSTED: "resource-exhausted",
                /**
                     * Operation was rejected because the system is not in a state required for
                     * the operation's execution. For example, directory to be deleted may be
                     * non-empty, an rmdir operation is applied to a non-directory, etc.
                     *
                     * A litmus test that may help a service implementor in deciding
                     * between FAILED_PRECONDITION, ABORTED, and UNAVAILABLE:
                     *  (a) Use UNAVAILABLE if the client can retry just the failing call.
                     *  (b) Use ABORTED if the client should retry at a higher-level
                     *      (e.g., restarting a read-modify-write sequence).
                     *  (c) Use FAILED_PRECONDITION if the client should not retry until
                     *      the system state has been explicitly fixed. E.g., if an "rmdir"
                     *      fails because the directory is non-empty, FAILED_PRECONDITION
                     *      should be returned since the client should not retry unless
                     *      they have first fixed up the directory by deleting files from it.
                     *  (d) Use FAILED_PRECONDITION if the client performs conditional
                     *      REST Get/Update/Delete on a resource and the resource on the
                     *      server does not match the condition. E.g., conflicting
                     *      read-modify-write on the same resource.
                     */ FAILED_PRECONDITION: "failed-precondition",
                /**
                     * The operation was aborted, typically due to a concurrency issue like
                     * sequencer check failures, transaction aborts, etc.
                     *
                     * See litmus test above for deciding between FAILED_PRECONDITION, ABORTED,
                     * and UNAVAILABLE.
                     */ ABORTED: "aborted",
                /**
                     * Operation was attempted past the valid range. E.g., seeking or reading
                     * past end of file.
                     *
                     * Unlike INVALID_ARGUMENT, this error indicates a problem that may be fixed
                     * if the system state changes. For example, a 32-bit file system will
                     * generate INVALID_ARGUMENT if asked to read at an offset that is not in the
                     * range [0,2^32-1], but it will generate OUT_OF_RANGE if asked to read from
                     * an offset past the current file size.
                     *
                     * There is a fair bit of overlap between FAILED_PRECONDITION and
                     * OUT_OF_RANGE. We recommend using OUT_OF_RANGE (the more specific error)
                     * when it applies so that callers who are iterating through a space can
                     * easily look for an OUT_OF_RANGE error to detect when they are done.
                     */ OUT_OF_RANGE: "out-of-range",
                /** Operation is not implemented or not supported/enabled in this service. */ UNIMPLEMENTED: "unimplemented",
                /**
                     * Internal errors. Means some invariants expected by underlying System has
                     * been broken. If you see one of these errors, Something is very broken.
                     */ INTERNAL: "internal",
                /**
                     * The service is currently unavailable. This is a most likely a transient
                     * condition and may be corrected by retrying with a backoff.
                     *
                     * See litmus test above for deciding between FAILED_PRECONDITION, ABORTED,
                     * and UNAVAILABLE.
                     */ UNAVAILABLE: "unavailable",
                /** Unrecoverable data loss or corruption. */ DATA_LOSS: "data-loss"
            };
            /** An error returned by a Firestore operation. */ class j extends Error {
                /** @hideconstructor */ constructor(/**
                         * The backend error code associated with this error.
                         */ t, /**
                         * A custom error description.
                         */ e){
                    super(e), this.code = t, this.message = e, /** The custom name for all FirestoreErrors. */ this.name = "FirebaseError", // HACK: We write a toString property directly because Error is not a real
                    // class and so inheritance does not work correctly. We could alternatively
                    // do the same "back-door inheritance" trick that FirebaseError does.
                    this.toString = ()=>`${this.name}: [code=${this.code}]: ${this.message}`;
                }
            }
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ class Q {
                constructor(){
                    this.promise = new Promise((t, e)=>{
                        this.resolve = t, this.reject = e;
                    });
                }
            }
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ class W {
                constructor(t, e){
                    this.user = e, this.type = "OAuth", this.authHeaders = {}, // Set the headers using Object Literal notation to avoid minification
                    this.authHeaders.Authorization = `Bearer ${t}`;
                }
            }
            /**
                 * A CredentialsProvider that always yields an empty token.
                 * @internal
                 */ class G {
                getToken() {
                    return Promise.resolve(null);
                }
                invalidateToken() {}
                start(t, e) {
                    // Fire with initial user.
                    t.enqueueRetryable(()=>e(D.UNAUTHENTICATED));
                }
                shutdown() {}
            }
            class H {
                constructor(t){
                    this.t = t, /** Tracks the current User. */ this.currentUser = D.UNAUTHENTICATED, /**
                             * Counter used to detect if the token changed while a getToken request was
                             * outstanding.
                             */ this.i = 0, this.forceRefresh = !1, this.auth = null;
                }
                start(t, e) {
                    let n = this.i;
                    // A change listener that prevents double-firing for the same token change.
                    const s = (t)=>this.i !== n ? (n = this.i, e(t)) : Promise.resolve();
                    // A promise that can be waited on to block on the next token change.
                    // This promise is re-created after each change.
                    let i = new Q();
                    this.o = ()=>{
                        this.i++, this.currentUser = this.u(), i.resolve(), i = new Q(), t.enqueueRetryable(()=>s(this.currentUser));
                    };
                    const r = ()=>{
                        const e = i;
                        t.enqueueRetryable(async ()=>{
                            await e.promise, await s(this.currentUser);
                        });
                    }, o = (t)=>{
                        $("FirebaseCredentialsProvider", "Auth detected"), this.auth = t, this.auth.addAuthTokenListener(this.o), r();
                    };
                    this.t.onInit((t)=>o(t)), // Our users can initialize Auth right after Firestore, so we give it
                    // a chance to register itself with the component framework before we
                    // determine whether to start up in unauthenticated mode.
                    setTimeout(()=>{
                        if (!this.auth) {
                            const t = this.t.getImmediate({
                                optional: !0
                            });
                            t ? o(t) : ($("FirebaseCredentialsProvider", "Auth not yet detected"), i.resolve(), i = new Q());
                        }
                    }, 0), r();
                }
                getToken() {
                    // Take note of the current value of the tokenCounter so that this method
                    // can fail (with an ABORTED error) if there is a token change while the
                    // request is outstanding.
                    const t = this.i, e = this.forceRefresh;
                    return this.forceRefresh = !1, this.auth ? this.auth.getToken(e).then((e)=>// Cancel the request since the token changed while the request was
                        // outstanding so the response is potentially for a previous user (which
                        // user, we can't be sure).
                        this.i !== t ? ($("FirebaseCredentialsProvider", "getToken aborted due to token change."), this.getToken()) : e ? ("string" == typeof e.accessToken || L(), new W(e.accessToken, this.currentUser)) : null) : Promise.resolve(null);
                }
                invalidateToken() {
                    this.forceRefresh = !0;
                }
                shutdown() {
                    this.auth && this.auth.removeAuthTokenListener(this.o);
                }
                // Auth.getUid() can return null even with a user logged in. It is because
                // getUid() is synchronous, but the auth code populating Uid is asynchronous.
                // This method should only be called in the AuthTokenListener callback
                // to guarantee to get the actual user.
                u() {
                    const t = this.auth && this.auth.getUid();
                    return null === t || "string" == typeof t || L(), new D(t);
                }
            }
            /*
                 * FirstPartyToken provides a fresh token each time its value
                 * is requested, because if the token is too old, requests will be rejected.
                 * Technically this may no longer be necessary since the SDK should gracefully
                 * recover from unauthenticated errors (see b/33147818 for context), but it's
                 * safer to keep the implementation as-is.
                 */ class J {
                constructor(t, e, n){
                    this.h = t, this.l = e, this.m = n, this.type = "FirstParty", this.user = D.FIRST_PARTY;
                }
                get authHeaders() {
                    const t = {
                        "X-Goog-AuthUser": this.l
                    }, e = this.h.auth.getAuthHeaderValueForFirstParty([]);
                    // Use array notation to prevent minification
                    return e && (t.Authorization = e), this.m && (t["X-Goog-Iam-Authorization-Token"] = this.m), t;
                }
            }
            /*
                 * Provides user credentials required for the Firestore JavaScript SDK
                 * to authenticate the user, using technique that is only available
                 * to applications hosted by Google.
                 */ class Y {
                constructor(t, e, n){
                    this.h = t, this.l = e, this.m = n;
                }
                getToken() {
                    return Promise.resolve(new J(this.h, this.l, this.m));
                }
                start(t, e) {
                    // Fire with initial uid.
                    t.enqueueRetryable(()=>e(D.FIRST_PARTY));
                }
                shutdown() {}
                invalidateToken() {}
            }
            /**
                 * Builds a CredentialsProvider depending on the type of
                 * the credentials passed in.
                 */ /**
                 * @license
                 * Copyright 2018 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * `ListenSequence` is a monotonic sequence. It is initialized with a minimum value to
                 * exceed. All subsequent calls to next will return increasing values. If provided with a
                 * `SequenceNumberSyncer`, it will additionally bump its next value when told of a new value, as
                 * well as write out sequence numbers that it produces via `next()`.
                 */ class X {
                constructor(t, e){
                    this.previousValue = t, e && (e.sequenceNumberHandler = (t)=>this.g(t), this.p = (t)=>e.writeSequenceNumber(t));
                }
                g(t) {
                    return this.previousValue = Math.max(t, this.previousValue), this.previousValue;
                }
                next() {
                    const t = ++this.previousValue;
                    return this.p && this.p(t), t;
                }
            }
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ X.T = -1;
            class tt {
                static I() {
                    // Alphanumeric characters
                    const t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", e = Math.floor(256 / t.length) * t.length;
                    // The largest byte value that is a multiple of `char.length`.
                    let n = "";
                    for(; n.length < 20;){
                        const s = /**
                 * @license
                 * Copyright 2020 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * Generates `nBytes` of random bytes.
                 *
                 * If `nBytes < 0` , an error will be thrown.
                 */ function(t) {
                            // Polyfills for IE and WebWorker by using `self` and `msCrypto` when `crypto` is not available.
                            const e = // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            "undefined" != typeof self && (self.crypto || self.msCrypto), n = new Uint8Array(40);
                            if (e && "function" == typeof e.getRandomValues) e.getRandomValues(n);
                            else for(let e = 0; e < 40; e++)n[e] = Math.floor(256 * Math.random());
                            return n;
                        }(0);
                        for(let i = 0; i < s.length; ++i)// Only accept values that are [0, maxMultiple), this ensures they can
                        // be evenly mapped to indices of `chars` via a modulo operation.
                        n.length < 20 && s[i] < e && (n += t.charAt(s[i] % t.length));
                    }
                    return n;
                }
            }
            function et(t, e) {
                return t < e ? -1 : t > e ? 1 : 0;
            }
            /** Helper to compare arrays using isEqual(). */ function nt(t, e, n) {
                return t.length === e.length && t.every((t, s)=>n(t, e[s]));
            }
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ // The earliest date supported by Firestore timestamps (0001-01-01T00:00:00Z).
            /**
                 * A `Timestamp` represents a point in time independent of any time zone or
                 * calendar, represented as seconds and fractions of seconds at nanosecond
                 * resolution in UTC Epoch time.
                 *
                 * It is encoded using the Proleptic Gregorian Calendar which extends the
                 * Gregorian calendar backwards to year one. It is encoded assuming all minutes
                 * are 60 seconds long, i.e. leap seconds are "smeared" so that no leap second
                 * table is needed for interpretation. Range is from 0001-01-01T00:00:00Z to
                 * 9999-12-31T23:59:59.999999999Z.
                 *
                 * For examples and further specifications, refer to the
                 * {@link https://github.com/google/protobuf/blob/master/src/google/protobuf/timestamp.proto | Timestamp definition}.
                 */ class it {
                /**
                     * Creates a new timestamp.
                     *
                     * @param seconds - The number of seconds of UTC time since Unix epoch
                     *     1970-01-01T00:00:00Z. Must be from 0001-01-01T00:00:00Z to
                     *     9999-12-31T23:59:59Z inclusive.
                     * @param nanoseconds - The non-negative fractions of a second at nanosecond
                     *     resolution. Negative second values with fractions must still have
                     *     non-negative nanoseconds values that count forward in time. Must be
                     *     from 0 to 999,999,999 inclusive.
                     */ constructor(/**
                         * The number of seconds of UTC time since Unix epoch 1970-01-01T00:00:00Z.
                         */ t, /**
                         * The fractions of a second at nanosecond resolution.*
                         */ e){
                    if (this.seconds = t, this.nanoseconds = e, e < 0 || e >= 1e9) throw new j(K.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + e);
                    if (t < -62135596800 || t >= 253402300800) throw new j(K.INVALID_ARGUMENT, "Timestamp seconds out of range: " + t);
                }
                /**
                     * Creates a new timestamp with the current date, with millisecond precision.
                     *
                     * @returns a new timestamp representing the current date.
                     */ static now() {
                    return it.fromMillis(Date.now());
                }
                /**
                     * Creates a new timestamp from the given date.
                     *
                     * @param date - The date to initialize the `Timestamp` from.
                     * @returns A new `Timestamp` representing the same point in time as the given
                     *     date.
                     */ static fromDate(t) {
                    return it.fromMillis(t.getTime());
                }
                /**
                     * Creates a new timestamp from the given number of milliseconds.
                     *
                     * @param milliseconds - Number of milliseconds since Unix epoch
                     *     1970-01-01T00:00:00Z.
                     * @returns A new `Timestamp` representing the same point in time as the given
                     *     number of milliseconds.
                     */ static fromMillis(t) {
                    const e = Math.floor(t / 1e3), n = Math.floor(1e6 * (t - 1e3 * e));
                    return new it(e, n);
                }
                /**
                     * Converts a `Timestamp` to a JavaScript `Date` object. This conversion
                     * causes a loss of precision since `Date` objects only support millisecond
                     * precision.
                     *
                     * @returns JavaScript `Date` object representing the same point in time as
                     *     this `Timestamp`, with millisecond precision.
                     */ toDate() {
                    return new Date(this.toMillis());
                }
                /**
                     * Converts a `Timestamp` to a numeric timestamp (in milliseconds since
                     * epoch). This operation causes a loss of precision.
                     *
                     * @returns The point in time corresponding to this timestamp, represented as
                     *     the number of milliseconds since Unix epoch 1970-01-01T00:00:00Z.
                     */ toMillis() {
                    return 1e3 * this.seconds + this.nanoseconds / 1e6;
                }
                _compareTo(t) {
                    return this.seconds === t.seconds ? et(this.nanoseconds, t.nanoseconds) : et(this.seconds, t.seconds);
                }
                /**
                     * Returns true if this `Timestamp` is equal to the provided one.
                     *
                     * @param other - The `Timestamp` to compare against.
                     * @returns true if this `Timestamp` is equal to the provided one.
                     */ isEqual(t) {
                    return t.seconds === this.seconds && t.nanoseconds === this.nanoseconds;
                }
                /** Returns a textual representation of this `Timestamp`. */ toString() {
                    return "Timestamp(seconds=" + this.seconds + ", nanoseconds=" + this.nanoseconds + ")";
                }
                /** Returns a JSON-serializable representation of this `Timestamp`. */ toJSON() {
                    return {
                        seconds: this.seconds,
                        nanoseconds: this.nanoseconds
                    };
                }
                /**
                     * Converts this object to a primitive string, which allows `Timestamp` objects
                     * to be compared using the `>`, `<=`, `>=` and `>` operators.
                     */ valueOf() {
                    // Note: Up to 12 decimal digits are required to represent all valid
                    // 'seconds' values.
                    return String(this.seconds - -62135596800).padStart(12, "0") + "." + String(this.nanoseconds).padStart(9, "0");
                }
            }
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * A version of a document in Firestore. This corresponds to the version
                 * timestamp, such as update_time or read_time.
                 */ class rt {
                constructor(t){
                    this.timestamp = t;
                }
                static fromTimestamp(t) {
                    return new rt(t);
                }
                static min() {
                    return new rt(new it(0, 0));
                }
                compareTo(t) {
                    return this.timestamp._compareTo(t.timestamp);
                }
                isEqual(t) {
                    return this.timestamp.isEqual(t.timestamp);
                }
                /** Returns a number representation of the version for use in spec tests. */ toMicroseconds() {
                    // Convert to microseconds.
                    return 1e6 * this.timestamp.seconds + this.timestamp.nanoseconds / 1e3;
                }
                toString() {
                    return "SnapshotVersion(" + this.timestamp.toString() + ")";
                }
                toTimestamp() {
                    return this.timestamp;
                }
            }
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ function ot(t) {
                let e = 0;
                for(const n in t)Object.prototype.hasOwnProperty.call(t, n) && e++;
                return e;
            }
            function ct(t, e) {
                for(const n in t)Object.prototype.hasOwnProperty.call(t, n) && e(n, t[n]);
            }
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * Path represents an ordered sequence of string segments.
                 */ class ut {
                constructor(t, e, n){
                    void 0 === e ? e = 0 : e > t.length && L(), void 0 === n ? n = t.length - e : n > t.length - e && L(), this.segments = t, this.offset = e, this.len = n;
                }
                get length() {
                    return this.len;
                }
                isEqual(t) {
                    return 0 === ut.comparator(this, t);
                }
                child(t) {
                    const e = this.segments.slice(this.offset, this.limit());
                    return t instanceof ut ? t.forEach((t)=>{
                        e.push(t);
                    }) : e.push(t), this.construct(e);
                }
                /** The index of one past the last segment of the path. */ limit() {
                    return this.offset + this.length;
                }
                popFirst(t) {
                    return t = void 0 === t ? 1 : t, this.construct(this.segments, this.offset + t, this.length - t);
                }
                popLast() {
                    return this.construct(this.segments, this.offset, this.length - 1);
                }
                firstSegment() {
                    return this.segments[this.offset];
                }
                lastSegment() {
                    return this.get(this.length - 1);
                }
                get(t) {
                    return this.segments[this.offset + t];
                }
                isEmpty() {
                    return 0 === this.length;
                }
                isPrefixOf(t) {
                    if (t.length < this.length) return !1;
                    for(let e = 0; e < this.length; e++)if (this.get(e) !== t.get(e)) return !1;
                    return !0;
                }
                isImmediateParentOf(t) {
                    if (this.length + 1 !== t.length) return !1;
                    for(let e = 0; e < this.length; e++)if (this.get(e) !== t.get(e)) return !1;
                    return !0;
                }
                forEach(t) {
                    for(let e = this.offset, n = this.limit(); e < n; e++)t(this.segments[e]);
                }
                toArray() {
                    return this.segments.slice(this.offset, this.limit());
                }
                static comparator(t, e) {
                    const n = Math.min(t.length, e.length);
                    for(let s = 0; s < n; s++){
                        const n = t.get(s), i = e.get(s);
                        if (n < i) return -1;
                        if (n > i) return 1;
                    }
                    return t.length < e.length ? -1 : t.length > e.length ? 1 : 0;
                }
            }
            /**
                 * A slash-separated path for navigating resources (documents and collections)
                 * within Firestore.
                 *
                 * @internal
                 */ class ht extends ut {
                construct(t, e, n) {
                    return new ht(t, e, n);
                }
                canonicalString() {
                    // NOTE: The client is ignorant of any path segments containing escape
                    // sequences (e.g. __id123__) and just passes them through raw (they exist
                    // for legacy reasons and should not be used frequently).
                    return this.toArray().join("/");
                }
                toString() {
                    return this.canonicalString();
                }
                /**
                     * Creates a resource path from the given slash-delimited string. If multiple
                     * arguments are provided, all components are combined. Leading and trailing
                     * slashes from all components are ignored.
                     */ static fromString(...t) {
                    // NOTE: The client is ignorant of any path segments containing escape
                    // sequences (e.g. __id123__) and just passes them through raw (they exist
                    // for legacy reasons and should not be used frequently).
                    const e = [];
                    for (const n of t){
                        if (n.indexOf("//") >= 0) throw new j(K.INVALID_ARGUMENT, `Invalid segment (${n}). Paths must not contain // in them.`);
                        // Strip leading and traling slashed.
                        e.push(...n.split("/").filter((t)=>t.length > 0));
                    }
                    return new ht(e);
                }
                static emptyPath() {
                    return new ht([]);
                }
            }
            const lt = /^[_a-zA-Z][_a-zA-Z0-9]*$/;
            /**
                 * A dot-separated path for navigating sub-objects within a document.
                 * @internal
                 */ class ft extends ut {
                construct(t, e, n) {
                    return new ft(t, e, n);
                }
                /**
                     * Returns true if the string could be used as a segment in a field path
                     * without escaping.
                     */ static isValidIdentifier(t) {
                    return lt.test(t);
                }
                canonicalString() {
                    return this.toArray().map((t)=>(t = t.replace(/\\/g, "\\\\").replace(/`/g, "\\`"), ft.isValidIdentifier(t) || (t = "`" + t + "`"), t)).join(".");
                }
                toString() {
                    return this.canonicalString();
                }
                /**
                     * Returns true if this field references the key of a document.
                     */ isKeyField() {
                    return 1 === this.length && "__name__" === this.get(0);
                }
                /**
                     * The field designating the key of a document.
                     */ static keyField() {
                    return new ft([
                        "__name__"
                    ]);
                }
                /**
                     * Parses a field string from the given server-formatted string.
                     *
                     * - Splitting the empty string is not allowed (for now at least).
                     * - Empty segments within the string (e.g. if there are two consecutive
                     *   separators) are not allowed.
                     *
                     * TODO(b/37244157): we should make this more strict. Right now, it allows
                     * non-identifier path components, even if they aren't escaped.
                     */ static fromServerFormat(t) {
                    const e = [];
                    let n = "", s = 0;
                    const i = ()=>{
                        if (0 === n.length) throw new j(K.INVALID_ARGUMENT, `Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);
                        e.push(n), n = "";
                    };
                    let r = !1;
                    for(; s < t.length;){
                        const e = t[s];
                        if ("\\" === e) {
                            if (s + 1 === t.length) throw new j(K.INVALID_ARGUMENT, "Path has trailing escape character: " + t);
                            const e = t[s + 1];
                            if ("\\" !== e && "." !== e && "`" !== e) throw new j(K.INVALID_ARGUMENT, "Path has invalid escape sequence: " + t);
                            n += e, s += 2;
                        } else "`" === e ? r = !r : "." !== e || r ? n += e : i(), s++;
                    }
                    if (i(), r) throw new j(K.INVALID_ARGUMENT, "Unterminated ` in path: " + t);
                    return new ft(e);
                }
                static emptyPath() {
                    return new ft([]);
                }
            }
            /**
                 * @license
                 * Copyright 2020 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * Immutable class that represents a "proto" byte string.
                 *
                 * Proto byte strings can either be Base64-encoded strings or Uint8Arrays when
                 * sent on the wire. This class abstracts away this differentiation by holding
                 * the proto byte string in a common class that must be converted into a string
                 * before being sent as a proto.
                 * @internal
                 */ class _t {
                constructor(t){
                    this.binaryString = t;
                }
                static fromBase64String(t) {
                    return new _t(atob(t));
                }
                static fromUint8Array(t) {
                    return new _t(/**
                             * Helper function to convert an Uint8array to a binary string.
                             */ function(t) {
                        let e = "";
                        for(let n = 0; n < t.length; ++n)e += String.fromCharCode(t[n]);
                        return e;
                    }(/**
                                 * Helper function to convert a binary string to an Uint8Array.
                                 */ t));
                }
                toBase64() {
                    return btoa(this.binaryString);
                }
                toUint8Array() {
                    return function(t) {
                        const e = new Uint8Array(t.length);
                        for(let n = 0; n < t.length; n++)e[n] = t.charCodeAt(n);
                        return e;
                    }(/**
                             * @license
                             * Copyright 2020 Google LLC
                             *
                             * Licensed under the Apache License, Version 2.0 (the "License");
                             * you may not use this file except in compliance with the License.
                             * You may obtain a copy of the License at
                             *
                             *   http://www.apache.org/licenses/LICENSE-2.0
                             *
                             * Unless required by applicable law or agreed to in writing, software
                             * distributed under the License is distributed on an "AS IS" BASIS,
                             * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                             * See the License for the specific language governing permissions and
                             * limitations under the License.
                             */ // A RegExp matching ISO 8601 UTC timestamps with optional fraction.
                    this.binaryString);
                }
                approximateByteSize() {
                    return 2 * this.binaryString.length;
                }
                compareTo(t) {
                    return et(this.binaryString, t.binaryString);
                }
                isEqual(t) {
                    return this.binaryString === t.binaryString;
                }
            }
            _t.EMPTY_BYTE_STRING = new _t("");
            const mt = new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);
            /**
                 * Converts the possible Proto values for a timestamp value into a "seconds and
                 * nanos" representation.
                 */ function gt(t) {
                // The json interface (for the browser) will return an iso timestamp string,
                // while the proto js library (for node) will return a
                // google.protobuf.Timestamp instance.
                if (t || L(), "string" == typeof t) {
                    // The date string can have higher precision (nanos) than the Date class
                    // (millis), so we do some custom parsing here.
                    // Parse the nanos right out of the string.
                    let e = 0;
                    const n = mt.exec(t);
                    if (n || L(), n[1]) {
                        // Pad the fraction out to 9 digits (nanos).
                        let t = n[1];
                        e = Number(t = (t + "000000000").substr(0, 9));
                    }
                    return {
                        seconds: Math.floor(new Date(t).getTime() / 1e3),
                        nanos: e
                    };
                }
                return {
                    seconds: yt(t.seconds),
                    nanos: yt(t.nanos)
                };
            }
            /**
                 * Converts the possible Proto types for numbers into a JavaScript number.
                 * Returns 0 if the value is not numeric.
                 */ function yt(t) {
                // TODO(bjornick): Handle int64 greater than 53 bits.
                return "number" == typeof t ? t : "string" == typeof t ? Number(t) : 0;
            }
            /** Converts the possible Proto types for Blobs into a ByteString. */ function pt(t) {
                return "string" == typeof t ? _t.fromBase64String(t) : _t.fromUint8Array(t);
            }
            /**
                 * @license
                 * Copyright 2020 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * Represents a locally-applied ServerTimestamp.
                 *
                 * Server Timestamps are backed by MapValues that contain an internal field
                 * `__type__` with a value of `server_timestamp`. The previous value and local
                 * write time are stored in its `__previous_value__` and `__local_write_time__`
                 * fields respectively.
                 *
                 * Notes:
                 * - ServerTimestampValue instances are created as the result of applying a
                 *   transform. They can only exist in the local view of a document. Therefore
                 *   they do not need to be parsed or serialized.
                 * - When evaluated locally (e.g. for snapshot.data()), they by default
                 *   evaluate to `null`. This behavior can be configured by passing custom
                 *   FieldValueOptions to value().
                 * - With respect to other ServerTimestampValues, they sort by their
                 *   localWriteTime.
                 */ function Tt(t) {
                var e, n;
                return "server_timestamp" === (null === (n = ((null === (e = null == t ? void 0 : t.mapValue) || void 0 === e ? void 0 : e.fields) || {}).__type__) || void 0 === n ? void 0 : n.stringValue);
            }
            /**
                 * Returns the local time at which this timestamp was first set.
                 */ function It(t) {
                const e = gt(t.mapValue.fields.__local_write_time__.timestampValue);
                return new it(e.seconds, e.nanos);
            }
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /** Sentinel value that sorts before any Mutation Batch ID. */ /**
                 * Returns whether a variable is either undefined or null.
                 */ function At(t) {
                return null == t;
            }
            /** Returns whether the value represents -0. */ function Rt(t) {
                // Detect if the value is -0.0. Based on polyfill from
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
                return 0 === t && 1 / t == -1 / 0;
            }
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * @internal
                 */ class Pt {
                constructor(t){
                    this.path = t;
                }
                static fromPath(t) {
                    return new Pt(ht.fromString(t));
                }
                static fromName(t) {
                    return new Pt(ht.fromString(t).popFirst(5));
                }
                /** Returns true if the document is in the specified collectionId. */ hasCollectionId(t) {
                    return this.path.length >= 2 && this.path.get(this.path.length - 2) === t;
                }
                isEqual(t) {
                    return null !== t && 0 === ht.comparator(this.path, t.path);
                }
                toString() {
                    return this.path.toString();
                }
                static comparator(t, e) {
                    return ht.comparator(t.path, e.path);
                }
                static isDocumentKey(t) {
                    return t.length % 2 == 0;
                }
                /**
                     * Creates and returns a new document key with the given segments.
                     *
                     * @param segments - The segments of the path to the document
                     * @returns A new instance of DocumentKey
                     */ static fromSegments(t) {
                    return new Pt(new ht(t.slice()));
                }
            }
            /**
                 * @license
                 * Copyright 2020 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /** Extracts the backend's type order for the provided value. */ function vt(t) {
                return "nullValue" in t ? 0 /* NullValue */  : "booleanValue" in t ? 1 /* BooleanValue */  : "integerValue" in t || "doubleValue" in t ? 2 /* NumberValue */  : "timestampValue" in t ? 3 /* TimestampValue */  : "stringValue" in t ? 5 /* StringValue */  : "bytesValue" in t ? 6 /* BlobValue */  : "referenceValue" in t ? 7 /* RefValue */  : "geoPointValue" in t ? 8 /* GeoPointValue */  : "arrayValue" in t ? 9 /* ArrayValue */  : "mapValue" in t ? Tt(t) ? 4 /* ServerTimestampValue */  : 10 /* ObjectValue */  : L();
            }
            /** Tests `left` and `right` for equality based on the backend semantics. */ function Vt(t, e) {
                const n = vt(t);
                if (n !== vt(e)) return !1;
                switch(n){
                    case 0 /* NullValue */ :
                        return !0;
                    case 1 /* BooleanValue */ :
                        return t.booleanValue === e.booleanValue;
                    case 4 /* ServerTimestampValue */ :
                        return It(t).isEqual(It(e));
                    case 3 /* TimestampValue */ :
                        return function(t, e) {
                            if ("string" == typeof t.timestampValue && "string" == typeof e.timestampValue && t.timestampValue.length === e.timestampValue.length) // Use string equality for ISO 8601 timestamps
                            return t.timestampValue === e.timestampValue;
                            const n = gt(t.timestampValue), s = gt(e.timestampValue);
                            return n.seconds === s.seconds && n.nanos === s.nanos;
                        }(t, e);
                    case 5 /* StringValue */ :
                        return t.stringValue === e.stringValue;
                    case 6 /* BlobValue */ :
                        return pt(t.bytesValue).isEqual(pt(e.bytesValue));
                    case 7 /* RefValue */ :
                        return t.referenceValue === e.referenceValue;
                    case 8 /* GeoPointValue */ :
                        return yt(t.geoPointValue.latitude) === yt(e.geoPointValue.latitude) && yt(t.geoPointValue.longitude) === yt(e.geoPointValue.longitude);
                    case 2 /* NumberValue */ :
                        return function(t, e) {
                            if ("integerValue" in t && "integerValue" in e) return yt(t.integerValue) === yt(e.integerValue);
                            if ("doubleValue" in t && "doubleValue" in e) {
                                const n = yt(t.doubleValue), s = yt(e.doubleValue);
                                return n === s ? Rt(n) === Rt(s) : isNaN(n) && isNaN(s);
                            }
                            return !1;
                        }(t, e);
                    case 9 /* ArrayValue */ :
                        return nt(t.arrayValue.values || [], e.arrayValue.values || [], Vt);
                    case 10 /* ObjectValue */ :
                        return function(t, e) {
                            const n = t.mapValue.fields || {}, s = e.mapValue.fields || {};
                            if (ot(n) !== ot(s)) return !1;
                            for(const t in n)if (n.hasOwnProperty(t) && (void 0 === s[t] || !Vt(n[t], s[t]))) return !1;
                            return !0;
                        }(/** Returns true if the ArrayValue contains the specified element. */ t, e);
                    default:
                        return L();
                }
            }
            function St(t, e) {
                return void 0 !== (t.values || []).find((t)=>Vt(t, e));
            }
            function Dt(t, e) {
                const n = vt(t), s = vt(e);
                if (n !== s) return et(n, s);
                switch(n){
                    case 0 /* NullValue */ :
                        return 0;
                    case 1 /* BooleanValue */ :
                        return et(t.booleanValue, e.booleanValue);
                    case 2 /* NumberValue */ :
                        return function(t, e) {
                            const n = yt(t.integerValue || t.doubleValue), s = yt(e.integerValue || e.doubleValue);
                            return n < s ? -1 : n > s ? 1 : n === s ? 0 : isNaN(n) ? isNaN(s) ? 0 : -1 : 1;
                        }(t, e);
                    case 3 /* TimestampValue */ :
                        return Ct(t.timestampValue, e.timestampValue);
                    case 4 /* ServerTimestampValue */ :
                        return Ct(It(t), It(e));
                    case 5 /* StringValue */ :
                        return et(t.stringValue, e.stringValue);
                    case 6 /* BlobValue */ :
                        return function(t, e) {
                            const n = pt(t), s = pt(e);
                            return n.compareTo(s);
                        }(t.bytesValue, e.bytesValue);
                    case 7 /* RefValue */ :
                        return function(t, e) {
                            const n = t.split("/"), s = e.split("/");
                            for(let t = 0; t < n.length && t < s.length; t++){
                                const e = et(n[t], s[t]);
                                if (0 !== e) return e;
                            }
                            return et(n.length, s.length);
                        }(t.referenceValue, e.referenceValue);
                    case 8 /* GeoPointValue */ :
                        return function(t, e) {
                            const n = et(yt(t.latitude), yt(e.latitude));
                            return 0 !== n ? n : et(yt(t.longitude), yt(e.longitude));
                        }(t.geoPointValue, e.geoPointValue);
                    case 9 /* ArrayValue */ :
                        return function(t, e) {
                            const n = t.values || [], s = e.values || [];
                            for(let t = 0; t < n.length && t < s.length; ++t){
                                const e = Dt(n[t], s[t]);
                                if (e) return e;
                            }
                            return et(n.length, s.length);
                        }(t.arrayValue, e.arrayValue);
                    case 10 /* ObjectValue */ :
                        return function(t, e) {
                            const n = t.fields || {}, s = Object.keys(n), i = e.fields || {}, r = Object.keys(i);
                            // Even though MapValues are likely sorted correctly based on their insertion
                            // order (e.g. when received from the backend), local modifications can bring
                            // elements out of order. We need to re-sort the elements to ensure that
                            // canonical IDs are independent of insertion order.
                            s.sort(), r.sort();
                            for(let t = 0; t < s.length && t < r.length; ++t){
                                const e = et(s[t], r[t]);
                                if (0 !== e) return e;
                                const o = Dt(n[s[t]], i[r[t]]);
                                if (0 !== o) return o;
                            }
                            return et(s.length, r.length);
                        }(/**
                                 * Generates the canonical ID for the provided field value (as used in Target
                                 * serialization).
                                 */ t.mapValue, e.mapValue);
                    default:
                        throw L();
                }
            }
            function Ct(t, e) {
                if ("string" == typeof t && "string" == typeof e && t.length === e.length) return et(t, e);
                const n = gt(t), s = gt(e), i = et(n.seconds, s.seconds);
                return 0 !== i ? i : et(n.nanos, s.nanos);
            }
            function xt(t) {
                var e, n;
                return "nullValue" in t ? "null" : "booleanValue" in t ? "" + t.booleanValue : "integerValue" in t ? "" + t.integerValue : "doubleValue" in t ? "" + t.doubleValue : "timestampValue" in t ? function(t) {
                    const e = gt(t);
                    return `time(${e.seconds},${e.nanos})`;
                }(t.timestampValue) : "stringValue" in t ? t.stringValue : "bytesValue" in t ? pt(t.bytesValue).toBase64() : "referenceValue" in t ? (n = t.referenceValue, Pt.fromName(n).toString()) : "geoPointValue" in t ? `geo(${(e = t.geoPointValue).latitude},${e.longitude})` : "arrayValue" in t ? function(t) {
                    let e = "[", n = !0;
                    for (const s of t.values || [])n ? n = !1 : e += ",", e += xt(s);
                    return e + "]";
                }(/** Returns a reference value for the provided database and key. */ t.arrayValue) : "mapValue" in t ? function(t) {
                    // Iteration order in JavaScript is not guaranteed. To ensure that we generate
                    // matching canonical IDs for identical maps, we need to sort the keys.
                    const e = Object.keys(t.fields || {}).sort();
                    let n = "{", s = !0;
                    for (const i of e)s ? s = !1 : n += ",", n += `${i}:${xt(t.fields[i])}`;
                    return n + "}";
                }(t.mapValue) : L();
            }
            /** Returns true if `value` is an IntegerValue . */ function $t(t) {
                return !!t && "integerValue" in t;
            }
            /** Returns true if `value` is a DoubleValue. */ /** Returns true if `value` is an ArrayValue. */ function Ot(t) {
                return !!t && "arrayValue" in t;
            }
            /** Returns true if `value` is a NullValue. */ function Ft(t) {
                return !!t && "nullValue" in t;
            }
            /** Returns true if `value` is NaN. */ function Mt(t) {
                return !!t && "doubleValue" in t && isNaN(Number(t.doubleValue));
            }
            /** Returns true if `value` is a MapValue. */ function Lt(t) {
                return !!t && "mapValue" in t;
            }
            /** Creates a deep copy of `source`. */ function Bt(t) {
                if (t.geoPointValue) return {
                    geoPointValue: Object.assign({}, t.geoPointValue)
                };
                if (t.timestampValue && "object" == typeof t.timestampValue) return {
                    timestampValue: Object.assign({}, t.timestampValue)
                };
                if (t.mapValue) {
                    const e = {
                        mapValue: {
                            fields: {}
                        }
                    };
                    return ct(t.mapValue.fields, (t, n)=>e.mapValue.fields[t] = Bt(n)), e;
                }
                if (t.arrayValue) {
                    const e = {
                        arrayValue: {
                            values: []
                        }
                    };
                    for(let n = 0; n < (t.arrayValue.values || []).length; ++n)e.arrayValue.values[n] = Bt(t.arrayValue.values[n]);
                    return e;
                }
                return Object.assign({}, t);
            }
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * An ObjectValue represents a MapValue in the Firestore Proto and offers the
                 * ability to add and remove fields (via the ObjectValueBuilder).
                 */ class Ut {
                constructor(t){
                    this.value = t;
                }
                static empty() {
                    return new Ut({
                        mapValue: {}
                    });
                }
                /**
                     * Returns the value at the given path or null.
                     *
                     * @param path - the path to search
                     * @returns The value at the path or null if the path is not set.
                     */ field(t) {
                    if (t.isEmpty()) return this.value;
                    {
                        let e = this.value;
                        for(let n = 0; n < t.length - 1; ++n)if (!Lt(e = (e.mapValue.fields || {})[t.get(n)])) return null;
                        return (e = (e.mapValue.fields || {})[t.lastSegment()]) || null;
                    }
                }
                /**
                     * Sets the field to the provided value.
                     *
                     * @param path - The field path to set.
                     * @param value - The value to set.
                     */ set(t, e) {
                    this.getFieldsMap(t.popLast())[t.lastSegment()] = Bt(e);
                }
                /**
                     * Sets the provided fields to the provided values.
                     *
                     * @param data - A map of fields to values (or null for deletes).
                     */ setAll(t) {
                    let e = ft.emptyPath(), n = {}, s = [];
                    t.forEach((t, i)=>{
                        if (!e.isImmediateParentOf(i)) {
                            // Insert the accumulated changes at this parent location
                            const t = this.getFieldsMap(e);
                            this.applyChanges(t, n, s), n = {}, s = [], e = i.popLast();
                        }
                        t ? n[i.lastSegment()] = Bt(t) : s.push(i.lastSegment());
                    });
                    const i = this.getFieldsMap(e);
                    this.applyChanges(i, n, s);
                }
                /**
                     * Removes the field at the specified path. If there is no field at the
                     * specified path, nothing is changed.
                     *
                     * @param path - The field path to remove.
                     */ delete(t) {
                    const e = this.field(t.popLast());
                    Lt(e) && e.mapValue.fields && delete e.mapValue.fields[t.lastSegment()];
                }
                isEqual(t) {
                    return Vt(this.value, t.value);
                }
                /**
                     * Returns the map that contains the leaf element of `path`. If the parent
                     * entry does not yet exist, or if it is not a map, a new map will be created.
                     */ getFieldsMap(t) {
                    let e = this.value;
                    e.mapValue.fields || (e.mapValue = {
                        fields: {}
                    });
                    for(let n = 0; n < t.length; ++n){
                        let s = e.mapValue.fields[t.get(n)];
                        Lt(s) && s.mapValue.fields || (s = {
                            mapValue: {
                                fields: {}
                            }
                        }, e.mapValue.fields[t.get(n)] = s), e = s;
                    }
                    return e.mapValue.fields;
                }
                /**
                     * Modifies `fieldsMap` by adding, replacing or deleting the specified
                     * entries.
                     */ applyChanges(t, e, n) {
                    for (const e1 of (ct(e, (e, n)=>t[e] = n), n))delete t[e1];
                }
                clone() {
                    return new Ut(Bt(this.value));
                }
            }
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * Represents a document in Firestore with a key, version, data and whether it
                 * has local mutations applied to it.
                 *
                 * Documents can transition between states via `convertToFoundDocument()`,
                 * `convertToNoDocument()` and `convertToUnknownDocument()`. If a document does
                 * not transition to one of these states even after all mutations have been
                 * applied, `isValidDocument()` returns false and the document should be removed
                 * from all views.
                 */ class Kt {
                constructor(t, e, n, s, i){
                    this.key = t, this.documentType = e, this.version = n, this.data = s, this.documentState = i;
                }
                /**
                     * Creates a document with no known version or data, but which can serve as
                     * base document for mutations.
                     */ static newInvalidDocument(t) {
                    return new Kt(t, 0 /* INVALID */ , rt.min(), Ut.empty(), 0 /* SYNCED */ );
                }
                /**
                     * Creates a new document that is known to exist with the given data at the
                     * given version.
                     */ static newFoundDocument(t, e, n) {
                    return new Kt(t, 1 /* FOUND_DOCUMENT */ , e, n, 0 /* SYNCED */ );
                }
                /** Creates a new document that is known to not exist at the given version. */ static newNoDocument(t, e) {
                    return new Kt(t, 2 /* NO_DOCUMENT */ , e, Ut.empty(), 0 /* SYNCED */ );
                }
                /**
                     * Creates a new document that is known to exist at the given version but
                     * whose data is not known (e.g. a document that was updated without a known
                     * base document).
                     */ static newUnknownDocument(t, e) {
                    return new Kt(t, 3 /* UNKNOWN_DOCUMENT */ , e, Ut.empty(), 2 /* HAS_COMMITTED_MUTATIONS */ );
                }
                /**
                     * Changes the document type to indicate that it exists and that its version
                     * and data are known.
                     */ convertToFoundDocument(t, e) {
                    return this.version = t, this.documentType = 1, this.data = e, this.documentState = 0, this;
                }
                /**
                     * Changes the document type to indicate that it doesn't exist at the given
                     * version.
                     */ convertToNoDocument(t) {
                    return this.version = t, this.documentType = 2, this.data = Ut.empty(), this.documentState = 0, this;
                }
                /**
                     * Changes the document type to indicate that it exists at a given version but
                     * that its data is not known (e.g. a document that was updated without a known
                     * base document).
                     */ convertToUnknownDocument(t) {
                    return this.version = t, this.documentType = 3, this.data = Ut.empty(), this.documentState = 2, this;
                }
                setHasCommittedMutations() {
                    return this.documentState = 2, this;
                }
                setHasLocalMutations() {
                    return this.documentState = 1, this;
                }
                get hasLocalMutations() {
                    return 1 /* HAS_LOCAL_MUTATIONS */  === this.documentState;
                }
                get hasCommittedMutations() {
                    return 2 /* HAS_COMMITTED_MUTATIONS */  === this.documentState;
                }
                get hasPendingWrites() {
                    return this.hasLocalMutations || this.hasCommittedMutations;
                }
                isValidDocument() {
                    return 0 /* INVALID */  !== this.documentType;
                }
                isFoundDocument() {
                    return 1 /* FOUND_DOCUMENT */  === this.documentType;
                }
                isNoDocument() {
                    return 2 /* NO_DOCUMENT */  === this.documentType;
                }
                isUnknownDocument() {
                    return 3 /* UNKNOWN_DOCUMENT */  === this.documentType;
                }
                isEqual(t) {
                    return t instanceof Kt && this.key.isEqual(t.key) && this.version.isEqual(t.version) && this.documentType === t.documentType && this.documentState === t.documentState && this.data.isEqual(t.data);
                }
                clone() {
                    return new Kt(this.key, this.documentType, this.version, this.data.clone(), this.documentState);
                }
                toString() {
                    return `Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`;
                }
            }
            /**
                 * Compares the value for field `field` in the provided documents. Throws if
                 * the field does not exist in both documents.
                 */ /**
                 * @license
                 * Copyright 2019 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ // Visible for testing
            class jt {
                constructor(t, e = null, n = [], s = [], i = null, r = null, o = null){
                    this.path = t, this.collectionGroup = e, this.orderBy = n, this.filters = s, this.limit = i, this.startAt = r, this.endAt = o, this.A = null;
                }
            }
            /**
                 * Initializes a Target with a path and optional additional query constraints.
                 * Path must currently be empty if this is a collection group query.
                 *
                 * NOTE: you should always construct `Target` from `Query.toTarget` instead of
                 * using this factory method, because `Query` provides an implicit `orderBy`
                 * property.
                 */ function Qt(t, e = null, n = [], s = [], i = null, r = null, o = null) {
                return new jt(t, e, n, s, i, r, o);
            }
            function Wt(t) {
                if (null === t.A) {
                    let t1 = t.path.canonicalString();
                    null !== t.collectionGroup && (t1 += "|cg:" + t.collectionGroup), t1 += "|f:", t1 += t.filters.map((t)=>t.field.canonicalString() + t.op.toString() + xt(t.value)).join(","), t1 += "|ob:", t1 += t.orderBy.map((t)=>t.field.canonicalString() + t.dir).join(","), At(t.limit) || (t1 += "|l:", t1 += t.limit), t.startAt && (t1 += "|lb:", t1 += ce(t.startAt)), t.endAt && (t1 += "|ub:", t1 += ce(t.endAt)), t.A = t1;
                }
                return t.A;
            }
            function zt(t, e) {
                var n, s, t1, e1;
                if (t.limit !== e.limit || t.orderBy.length !== e.orderBy.length) return !1;
                for(let n = 0; n < t.orderBy.length; n++)if (t1 = t.orderBy[n], e1 = e.orderBy[n], !(t1.dir === e1.dir && t1.field.isEqual(e1.field))) return !1;
                if (t.filters.length !== e.filters.length) return !1;
                for(let i = 0; i < t.filters.length; i++)if (n = t.filters[i], s = e.filters[i], n.op !== s.op || !n.field.isEqual(s.field) || !Vt(n.value, s.value)) return !1;
                return t.collectionGroup === e.collectionGroup && !!t.path.isEqual(e.path) && !!le(t.startAt, e.startAt) && le(t.endAt, e.endAt);
            }
            function Ht(t) {
                return Pt.isDocumentKey(t.path) && null === t.collectionGroup && 0 === t.filters.length;
            }
            class Jt extends class {
            } {
                constructor(t, e, n){
                    super(), this.field = t, this.op = e, this.value = n;
                }
                /**
                     * Creates a filter based on the provided arguments.
                     */ static create(t, e, n) {
                    return t.isKeyField() ? "in" /* IN */  === e || "not-in" /* NOT_IN */  === e ? this.R(t, e, n) : new Xt(t, e, n) : "array-contains" /* ARRAY_CONTAINS */  === e ? new ne(t, n) : "in" /* IN */  === e ? new se(t, n) : "not-in" /* NOT_IN */  === e ? new ie(t, n) : "array-contains-any" /* ARRAY_CONTAINS_ANY */  === e ? new re(t, n) : new Jt(t, e, n);
                }
                static R(t, e, n) {
                    return "in" /* IN */  === e ? new Zt(t, n) : new te(t, n);
                }
                matches(t) {
                    const e = t.data.field(this.field);
                    // Types do not have to match in NOT_EQUAL filters.
                    return "!=" /* NOT_EQUAL */  === this.op ? null !== e && this.P(Dt(e, this.value)) : null !== e && vt(this.value) === vt(e) && this.P(Dt(e, this.value));
                // Only compare types with matching backend order (such as double and int).
                }
                P(t) {
                    switch(this.op){
                        case "<" /* LESS_THAN */ :
                            return t < 0;
                        case "<=" /* LESS_THAN_OR_EQUAL */ :
                            return t <= 0;
                        case "==" /* EQUAL */ :
                            return 0 === t;
                        case "!=" /* NOT_EQUAL */ :
                            return 0 !== t;
                        case ">" /* GREATER_THAN */ :
                            return t > 0;
                        case ">=" /* GREATER_THAN_OR_EQUAL */ :
                            return t >= 0;
                        default:
                            return L();
                    }
                }
                v() {
                    return [
                        "<" /* LESS_THAN */ ,
                        "<=" /* LESS_THAN_OR_EQUAL */ ,
                        ">" /* GREATER_THAN */ ,
                        ">=" /* GREATER_THAN_OR_EQUAL */ ,
                        "!=" /* NOT_EQUAL */ ,
                        "not-in" /* NOT_IN */ 
                    ].indexOf(this.op) >= 0;
                }
            }
            class Xt extends Jt {
                constructor(t, e, n){
                    super(t, e, n), this.key = Pt.fromName(n.referenceValue);
                }
                matches(t) {
                    const e = Pt.comparator(t.key, this.key);
                    return this.P(e);
                }
            }
            /** Filter that matches on key fields within an array. */ class Zt extends Jt {
                constructor(t, e){
                    super(t, "in" /* IN */ , e), this.keys = ee("in" /* IN */ , e);
                }
                matches(t) {
                    return this.keys.some((e)=>e.isEqual(t.key));
                }
            }
            /** Filter that matches on key fields not present within an array. */ class te extends Jt {
                constructor(t, e){
                    super(t, "not-in" /* NOT_IN */ , e), this.keys = ee("not-in" /* NOT_IN */ , e);
                }
                matches(t) {
                    return !this.keys.some((e)=>e.isEqual(t.key));
                }
            }
            function ee(t, e) {
                var n;
                return ((null === (n = e.arrayValue) || void 0 === n ? void 0 : n.values) || []).map((t)=>Pt.fromName(t.referenceValue));
            }
            /** A Filter that implements the array-contains operator. */ class ne extends Jt {
                constructor(t, e){
                    super(t, "array-contains" /* ARRAY_CONTAINS */ , e);
                }
                matches(t) {
                    const e = t.data.field(this.field);
                    return Ot(e) && St(e.arrayValue, this.value);
                }
            }
            /** A Filter that implements the IN operator. */ class se extends Jt {
                constructor(t, e){
                    super(t, "in" /* IN */ , e);
                }
                matches(t) {
                    const e = t.data.field(this.field);
                    return null !== e && St(this.value.arrayValue, e);
                }
            }
            /** A Filter that implements the not-in operator. */ class ie extends Jt {
                constructor(t, e){
                    super(t, "not-in" /* NOT_IN */ , e);
                }
                matches(t) {
                    if (St(this.value.arrayValue, {
                        nullValue: "NULL_VALUE"
                    })) return !1;
                    const e = t.data.field(this.field);
                    return null !== e && !St(this.value.arrayValue, e);
                }
            }
            /** A Filter that implements the array-contains-any operator. */ class re extends Jt {
                constructor(t, e){
                    super(t, "array-contains-any" /* ARRAY_CONTAINS_ANY */ , e);
                }
                matches(t) {
                    const e = t.data.field(this.field);
                    return !(!Ot(e) || !e.arrayValue.values) && e.arrayValue.values.some((t)=>St(this.value.arrayValue, t));
                }
            }
            /**
                 * Represents a bound of a query.
                 *
                 * The bound is specified with the given components representing a position and
                 * whether it's just before or just after the position (relative to whatever the
                 * query order is).
                 *
                 * The position represents a logical index position for a query. It's a prefix
                 * of values for the (potentially implicit) order by clauses of a query.
                 *
                 * Bound provides a function to determine whether a document comes before or
                 * after a bound. This is influenced by whether the position is just before or
                 * just after the provided values.
                 */ class oe {
                constructor(t, e){
                    this.position = t, this.before = e;
                }
            }
            function ce(t) {
                // TODO(b/29183165): Make this collision robust.
                return `${t.before ? "b" : "a"}:${t.position.map((t)=>xt(t)).join(",")}`;
            }
            /**
                 * An ordering on a field, in some Direction. Direction defaults to ASCENDING.
                 */ class ae {
                constructor(t, e = "asc" /* ASCENDING */ ){
                    this.field = t, this.dir = e;
                }
            }
            /**
                 * Returns true if a document sorts before a bound using the provided sort
                 * order.
                 */ function he(t, e, n) {
                let s = 0;
                for(let i = 0; i < t.position.length; i++){
                    const r = e[i], o = t.position[i];
                    if (s = r.field.isKeyField() ? Pt.comparator(Pt.fromName(o.referenceValue), n.key) : Dt(o, n.data.field(r.field)), "desc" /* DESCENDING */  === r.dir && (s *= -1), 0 !== s) break;
                }
                return t.before ? s <= 0 : s < 0;
            }
            function le(t, e) {
                if (null === t) return null === e;
                if (null === e || t.before !== e.before || t.position.length !== e.position.length) return !1;
                for(let n = 0; n < t.position.length; n++)if (!Vt(t.position[n], e.position[n])) return !1;
                return !0;
            }
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * Query encapsulates all the query attributes we support in the SDK. It can
                 * be run against the LocalStore, as well as be converted to a `Target` to
                 * query the RemoteStore results.
                 *
                 * Visible for testing.
                 */ class fe {
                /**
                     * Initializes a Query with a path and optional additional query constraints.
                     * Path must currently be empty if this is a collection group query.
                     */ constructor(t, e = null, n = [], s = [], i = null, r = "F" /* First */ , o = null, c = null){
                    this.path = t, this.collectionGroup = e, this.explicitOrderBy = n, this.filters = s, this.limit = i, this.limitType = r, this.startAt = o, this.endAt = c, this.V = null, // The corresponding `Target` of this `Query` instance.
                    this.S = null, this.startAt, this.endAt;
                }
            }
            /**
                 * Helper to convert a collection group query into a collection query at a
                 * specific path. This is used when executing collection group queries, since
                 * we have to split the query into a set of collection queries at multiple
                 * paths.
                 */ function _e(t) {
                return !At(t.limit) && "F" /* First */  === t.limitType;
            }
            function me(t) {
                return !At(t.limit) && "L" /* Last */  === t.limitType;
            }
            /**
                 * Returns the implicit order by constraint that is used to execute the Query,
                 * which can be different from the order by constraints the user provided (e.g.
                 * the SDK and backend always orders by `__name__`).
                 */ function Te(t) {
                if (null === t.V) {
                    t.V = [];
                    const t1 = function(t) {
                        for (const e of t.filters)if (e.v()) return e.field;
                        return null;
                    }(t), n = t.explicitOrderBy.length > 0 ? t.explicitOrderBy[0].field : null;
                    if (null !== t1 && null === n) // In order to implicitly add key ordering, we must also add the
                    // inequality filter field for it to be a valid query.
                    // Note that the default inequality field and key ordering is ascending.
                    t1.isKeyField() || t.V.push(new ae(t1)), t.V.push(new ae(ft.keyField(), "asc" /* ASCENDING */ ));
                    else {
                        let t1 = !1;
                        for (const n of t.explicitOrderBy)t.V.push(n), n.field.isKeyField() && (t1 = !0);
                        if (!t1) {
                            // The order of the implicit key ordering always matches the last
                            // explicit order by
                            const t1 = t.explicitOrderBy.length > 0 ? t.explicitOrderBy[t.explicitOrderBy.length - 1].dir : "asc"; /* ASCENDING */ 
                            t.V.push(new ae(ft.keyField(), t1));
                        }
                    }
                }
                return t.V;
            }
            /**
                 * Converts this `Query` instance to it's corresponding `Target` representation.
                 */ function Ee(t) {
                if (!t.S) {
                    if ("F" /* First */  === t.limitType) t.S = Qt(t.path, t.collectionGroup, Te(t), t.filters, t.limit, t.startAt, t.endAt);
                    else {
                        // Flip the orderBy directions since we want the last results
                        const t1 = [];
                        for (const n of Te(t)){
                            const e = "desc" /* DESCENDING */  === n.dir ? "asc" /* ASCENDING */  : "desc"; /* DESCENDING */ 
                            t1.push(new ae(n.field, e));
                        }
                        // We need to swap the cursors to match the now-flipped query ordering.
                        const n = t.endAt ? new oe(t.endAt.position, !t.endAt.before) : null, s = t.startAt ? new oe(t.startAt.position, !t.startAt.before) : null;
                        // Now return as a LimitType.First query.
                        t.S = Qt(t.path, t.collectionGroup, t1, t.filters, t.limit, n, s);
                    }
                }
                return t.S;
            }
            function Ae(t, e) {
                return zt(Ee(t), Ee(e)) && t.limitType === e.limitType;
            }
            // TODO(b/29183165): This is used to get a unique string from a query to, for
            // example, use as a dictionary key, but the implementation is subject to
            // collisions. Make it collision-free.
            function Re(t) {
                return `${Wt(Ee(t))}|lt:${t.limitType}`;
            }
            function be(t) {
                var t1;
                let e;
                return `Query(target=${e = (t1 = Ee(t)).path.canonicalString(), null !== t1.collectionGroup && (e += " collectionGroup=" + t1.collectionGroup), t1.filters.length > 0 && (e += `, filters: [${t1.filters.map((t)=>`${t.field.canonicalString()} ${t.op} ${xt(t.value)}`).join(", ")}]`), At(t1.limit) || (e += ", limit: " + t1.limit), t1.orderBy.length > 0 && (e += `, orderBy: [${t1.orderBy.map((t)=>`${t.field.canonicalString()} (${t.dir})`).join(", ")}]`), t1.startAt && (e += ", startAt: " + ce(t1.startAt)), t1.endAt && (e += ", endAt: " + ce(t1.endAt)), `Target(${e})`}; limitType=${t.limitType})`;
            }
            /** Returns whether `doc` matches the constraints of `query`. */ function Pe(t, e) {
                return e.isFoundDocument() && function(t, e) {
                    const n = e.key.path;
                    return null !== t.collectionGroup ? e.key.hasCollectionId(t.collectionGroup) && t.path.isPrefixOf(n) : Pt.isDocumentKey(t.path) ? t.path.isEqual(n) : t.path.isImmediateParentOf(n);
                }(/**
                             * A document must have a value for every ordering clause in order to show up
                             * in the results.
                             */ t, e) && function(t, e) {
                    // order by key always matches
                    for (const n of t.explicitOrderBy)if (!n.field.isKeyField() && null === e.data.field(n.field)) return !1;
                    return !0;
                }(t, e) && function(t, e) {
                    for (const n of t.filters)if (!n.matches(e)) return !1;
                    return !0;
                }(/** Makes sure a document is within the bounds, if provided. */ t, e) && !(/**
                             * Returns a new comparator function that can be used to compare two documents
                             * based on the Query's ordering constraint.
                             */ t.startAt && !he(t.startAt, Te(t), e) || t.endAt && he(t.endAt, Te(t), e));
            }
            function ve(t) {
                return (e, n)=>{
                    let s = !1;
                    for (const i of Te(t)){
                        const t = function(t, e, n) {
                            const s = t.field.isKeyField() ? Pt.comparator(e.key, n.key) : function(t, e, n) {
                                const s = e.data.field(t), i = n.data.field(t);
                                return null !== s && null !== i ? Dt(s, i) : L();
                            }(t.field, e, n);
                            switch(t.dir){
                                case "asc" /* ASCENDING */ :
                                    return s;
                                case "desc" /* DESCENDING */ :
                                    return -1 * s;
                                default:
                                    return L();
                            }
                        }(i, e, n);
                        if (0 !== t) return t;
                        s = s || i.field.isKeyField();
                    }
                    return 0;
                };
            }
            /**
                 * @license
                 * Copyright 2018 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /** Used to represent a field transform on a mutation. */ class Ne {
                constructor(){
                    // Make sure that the structural type of `TransformOperation` is unique.
                    // See https://github.com/microsoft/TypeScript/issues/5451
                    this._ = void 0;
                }
            }
            /** Transforms a value into a server-generated timestamp. */ class Oe extends Ne {
            }
            /** Transforms an array value via a union operation. */ class Fe extends Ne {
                constructor(t){
                    super(), this.elements = t;
                }
            }
            function Me(t, e) {
                const n = Ke(e);
                for (const e of t.elements)n.some((t)=>Vt(t, e)) || n.push(e);
                return {
                    arrayValue: {
                        values: n
                    }
                };
            }
            /** Transforms an array value via a remove operation. */ class Le extends Ne {
                constructor(t){
                    super(), this.elements = t;
                }
            }
            function Be(t, e) {
                let n = Ke(e);
                for (const e of t.elements)n = n.filter((t)=>!Vt(t, e));
                return {
                    arrayValue: {
                        values: n
                    }
                };
            }
            /**
                 * Implements the backend semantics for locally computed NUMERIC_ADD (increment)
                 * transforms. Converts all field values to integers or doubles, but unlike the
                 * backend does not cap integer values at 2^63. Instead, JavaScript number
                 * arithmetic is used and precision loss can occur for values greater than 2^53.
                 */ class Ue extends Ne {
                constructor(t, e){
                    super(), this.N = t, this.C = e;
                }
            }
            function qe(t) {
                return yt(t.integerValue || t.doubleValue);
            }
            function Ke(t) {
                return Ot(t) && t.arrayValue.values ? t.arrayValue.values.slice() : [];
            }
            /** Returns true if the preconditions is valid for the given document. */ function ze(t, e) {
                return void 0 !== t.updateTime ? e.isFoundDocument() && e.version.isEqual(t.updateTime) : void 0 === t.exists || t.exists === e.isFoundDocument();
            }
            /**
                 * A mutation describes a self-contained change to a document. Mutations can
                 * create, replace, delete, and update subsets of documents.
                 *
                 * Mutations not only act on the value of the document but also its version.
                 *
                 * For local mutations (mutations that haven't been committed yet), we preserve
                 * the existing version for Set and Patch mutations. For Delete mutations, we
                 * reset the version to 0.
                 *
                 * Here's the expected transition table.
                 *
                 * MUTATION           APPLIED TO            RESULTS IN
                 *
                 * SetMutation        Document(v3)          Document(v3)
                 * SetMutation        NoDocument(v3)        Document(v0)
                 * SetMutation        InvalidDocument(v0)   Document(v0)
                 * PatchMutation      Document(v3)          Document(v3)
                 * PatchMutation      NoDocument(v3)        NoDocument(v3)
                 * PatchMutation      InvalidDocument(v0)   UnknownDocument(v3)
                 * DeleteMutation     Document(v3)          NoDocument(v0)
                 * DeleteMutation     NoDocument(v3)        NoDocument(v0)
                 * DeleteMutation     InvalidDocument(v0)   NoDocument(v0)
                 *
                 * For acknowledged mutations, we use the updateTime of the WriteResponse as
                 * the resulting version for Set and Patch mutations. As deletes have no
                 * explicit update time, we use the commitTime of the WriteResponse for
                 * Delete mutations.
                 *
                 * If a mutation is acknowledged by the backend but fails the precondition check
                 * locally, we transition to an `UnknownDocument` and rely on Watch to send us
                 * the updated version.
                 *
                 * Field transforms are used only with Patch and Set Mutations. We use the
                 * `updateTransforms` message to store transforms, rather than the `transforms`s
                 * messages.
                 *
                 * ## Subclassing Notes
                 *
                 * Every type of mutation needs to implement its own applyToRemoteDocument() and
                 * applyToLocalView() to implement the actual behavior of applying the mutation
                 * to some source document (see `setMutationApplyToRemoteDocument()` for an
                 * example).
                 */ class He {
            }
            /**
                 * Applies this mutation to the given document for the purposes of computing
                 * the new local view of a document. If the input document doesn't match the
                 * expected state, the document is not modified.
                 *
                 * @param mutation - The mutation to apply.
                 * @param document - The document to mutate. The input document can be an
                 *     invalid document if the client has no knowledge of the pre-mutation state
                 *     of the document.
                 * @param localWriteTime - A timestamp indicating the local write time of the
                 *     batch this mutation is a part of.
                 */ function Ye(t, e, n) {
                t instanceof en ? function(t, e, n) {
                    if (!ze(t.precondition, e)) // The mutation failed to apply (e.g. a document ID created with add()
                    // caused a name collision).
                    return;
                    const s = t.value.clone(), i = on(t.fieldTransforms, n, e);
                    s.setAll(i), e.convertToFoundDocument(tn(e), s).setHasLocalMutations();
                }(/**
                               * A mutation that modifies fields of the document at the given key with the
                               * given values. The values are applied through a field mask:
                               *
                               *  * When a field is in both the mask and the values, the corresponding field
                               *    is updated.
                               *  * When a field is in neither the mask nor the values, the corresponding
                               *    field is unmodified.
                               *  * When a field is in the mask but not in the values, the corresponding field
                               *    is deleted.
                               *  * When a field is not in the mask but is in the values, the values map is
                               *    ignored.
                               */ t, e, n) : t instanceof nn ? function(t, e, n) {
                    if (!ze(t.precondition, e)) return;
                    const s = on(t.fieldTransforms, n, e), i = e.data;
                    i.setAll(sn(t)), i.setAll(s), e.convertToFoundDocument(tn(e), i).setHasLocalMutations();
                }(/**
                               * Returns a FieldPath/Value map with the content of the PatchMutation.
                               */ t, e, n) : ze(/**
                               * A mutation that verifies the existence of the document at the given key with
                               * the provided precondition.
                               *
                               * The `verify` operation is only used in Transactions, and this class serves
                               * primarily to facilitate serialization into protos.
                               */ t.precondition, e) && // We don't call `setHasLocalMutations()` since we want to be backwards
                // compatible with the existing SDK behavior.
                e.convertToNoDocument(rt.min());
            }
            function Ze(t, e) {
                var t1, e1;
                return t.type === e.type && !!t.key.isEqual(e.key) && !!t.precondition.isEqual(e.precondition) && (t1 = t.fieldTransforms, e1 = e.fieldTransforms, !!(void 0 === t1 && void 0 === e1 || !(!t1 || !e1) && nt(t1, e1, (t, e)=>{
                    var t1, e1;
                    return t.field.isEqual(e.field) && (t1 = t.transform, e1 = e.transform, t1 instanceof Fe && e1 instanceof Fe || t1 instanceof Le && e1 instanceof Le ? nt(t1.elements, e1.elements, Vt) : t1 instanceof Ue && e1 instanceof Ue ? Vt(t1.C, e1.C) : t1 instanceof Oe && e1 instanceof Oe);
                }))) && (0 /* Set */  === t.type ? t.value.isEqual(e.value) : 1 /* Patch */  !== t.type || t.data.isEqual(e.data) && t.fieldMask.isEqual(e.fieldMask));
            }
            /**
                 * Returns the version from the given document for use as the result of a
                 * mutation. Mutations are defined to return the version of the base document
                 * only if it is an existing document. Deleted and unknown documents have a
                 * post-mutation version of SnapshotVersion.min().
                 */ function tn(t) {
                return t.isFoundDocument() ? t.version : rt.min();
            }
            /**
                 * A mutation that creates or replaces the document at the given key with the
                 * object value contents.
                 */ class en extends He {
                constructor(t, e, n, s = []){
                    super(), this.key = t, this.value = e, this.precondition = n, this.fieldTransforms = s, this.type = 0 /* Set */ ;
                }
            }
            class nn extends He {
                constructor(t, e, n, s, i = []){
                    super(), this.key = t, this.data = e, this.fieldMask = n, this.precondition = s, this.fieldTransforms = i, this.type = 1 /* Patch */ ;
                }
            }
            function sn(t) {
                const e = new Map();
                return t.fieldMask.fields.forEach((n)=>{
                    if (!n.isEmpty()) {
                        const s = t.data.field(n);
                        e.set(n, s);
                    }
                }), e;
            }
            /**
                 * Creates a list of "transform results" (a transform result is a field value
                 * representing the result of applying a transform) for use after a mutation
                 * containing transforms has been acknowledged by the server.
                 *
                 * @param fieldTransforms - The field transforms to apply the result to.
                 * @param mutableDocument - The current state of the document after applying all
                 * previous mutations.
                 * @param serverTransformResults - The transform results received by the server.
                 * @returns The transform results list.
                 */ function rn(t, e, n) {
                var n1;
                const s = new Map();
                t.length === n.length || L();
                for(let i = 0; i < n.length; i++){
                    const r = t[i], o = r.transform, c = e.data.field(r.field);
                    s.set(r.field, (n1 = n[i], o instanceof Fe ? Me(o, c) : o instanceof Le ? Be(o, c) : n1));
                }
                return s;
            }
            /**
                 * Creates a list of "transform results" (a transform result is a field value
                 * representing the result of applying a transform) for use when applying a
                 * transform locally.
                 *
                 * @param fieldTransforms - The field transforms to apply the result to.
                 * @param localWriteTime - The local time of the mutation (used to
                 *     generate ServerTimestampValues).
                 * @param mutableDocument - The current state of the document after applying all
                 *     previous mutations.
                 * @returns The transform results list.
                 */ function on(t, e, n) {
                const s = new Map();
                for (const i of t){
                    const t = i.transform, r = n.data.field(i.field);
                    s.set(i.field, t instanceof Oe ? function(t, e) {
                        const n = {
                            fields: {
                                __type__: {
                                    stringValue: "server_timestamp"
                                },
                                __local_write_time__: {
                                    timestampValue: {
                                        seconds: t.seconds,
                                        nanos: t.nanoseconds
                                    }
                                }
                            }
                        };
                        return e && (n.fields.__previous_value__ = e), {
                            mapValue: n
                        };
                    }(e, r) : t instanceof Fe ? Me(t, r) : t instanceof Le ? Be(t, r) : function(t, e) {
                        // PORTING NOTE: Since JavaScript's integer arithmetic is limited to 53 bit
                        // precision and resolves overflows by reducing precision, we do not
                        // manually cap overflows at 2^63.
                        const n = t instanceof Ue ? $t(e) || e && "doubleValue" in e ? e : {
                            integerValue: 0
                        } : null, s = qe(n) + qe(t.C);
                        return $t(n) && $t(t.C) ? {
                            integerValue: "" + s
                        } : /**
                 * @license
                 * Copyright 2020 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * Returns an DoubleValue for `value` that is encoded based the serializer's
                 * `useProto3Json` setting.
                 */ function(t, e) {
                            if (t.D) {
                                if (isNaN(e)) return {
                                    doubleValue: "NaN"
                                };
                                if (e === 1 / 0) return {
                                    doubleValue: "Infinity"
                                };
                                if (e === -1 / 0) return {
                                    doubleValue: "-Infinity"
                                };
                            }
                            return {
                                doubleValue: Rt(e) ? "-0" : e
                            };
                        }(t.N, s);
                    }(t, r));
                }
                return s;
            }
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ class un {
                // TODO(b/33078163): just use simplest form of existence filter for now
                constructor(t){
                    this.count = t;
                }
            }
            /**
                 * Determines whether an error code represents a permanent error when received
                 * in response to a write operation.
                 *
                 * Write operations must be handled specially because as of b/119437764, ABORTED
                 * errors on the write stream should be retried too (even though ABORTED errors
                 * are not generally retryable).
                 *
                 * Note that during the initial handshake on the write stream an ABORTED error
                 * signals that we should discard our stream token (i.e. it is permanent). This
                 * means a handshake error should be classified with isPermanentError, above.
                 */ /**
                 * Maps an error Code from GRPC status code number, like 0, 1, or 14. These
                 * are not the same as HTTP status codes.
                 *
                 * @returns The Code equivalent to the given GRPC status code. Fails if there
                 *     is no match.
                 */ function dn(t) {
                if (void 0 === t) // This shouldn't normally happen, but in certain error cases (like trying
                // to send invalid proto messages) we may get an error with no GRPC code.
                return O("GRPC error has no .code"), K.UNKNOWN;
                switch(t){
                    case hn.OK:
                        return K.OK;
                    case hn.CANCELLED:
                        return K.CANCELLED;
                    case hn.UNKNOWN:
                        return K.UNKNOWN;
                    case hn.DEADLINE_EXCEEDED:
                        return K.DEADLINE_EXCEEDED;
                    case hn.RESOURCE_EXHAUSTED:
                        return K.RESOURCE_EXHAUSTED;
                    case hn.INTERNAL:
                        return K.INTERNAL;
                    case hn.UNAVAILABLE:
                        return K.UNAVAILABLE;
                    case hn.UNAUTHENTICATED:
                        return K.UNAUTHENTICATED;
                    case hn.INVALID_ARGUMENT:
                        return K.INVALID_ARGUMENT;
                    case hn.NOT_FOUND:
                        return K.NOT_FOUND;
                    case hn.ALREADY_EXISTS:
                        return K.ALREADY_EXISTS;
                    case hn.PERMISSION_DENIED:
                        return K.PERMISSION_DENIED;
                    case hn.FAILED_PRECONDITION:
                        return K.FAILED_PRECONDITION;
                    case hn.ABORTED:
                        return K.ABORTED;
                    case hn.OUT_OF_RANGE:
                        return K.OUT_OF_RANGE;
                    case hn.UNIMPLEMENTED:
                        return K.UNIMPLEMENTED;
                    case hn.DATA_LOSS:
                        return K.DATA_LOSS;
                    default:
                        return L();
                }
            }
            /**
                 * Converts an HTTP response's error status to the equivalent error code.
                 *
                 * @param status - An HTTP error response status ("FAILED_PRECONDITION",
                 * "UNKNOWN", etc.)
                 * @returns The equivalent Code. Non-matching responses are mapped to
                 *     Code.UNKNOWN.
                 */ (ln = hn || (hn = {}))[ln.OK = 0] = "OK", ln[ln.CANCELLED = 1] = "CANCELLED", ln[ln.UNKNOWN = 2] = "UNKNOWN", ln[ln.INVALID_ARGUMENT = 3] = "INVALID_ARGUMENT", ln[ln.DEADLINE_EXCEEDED = 4] = "DEADLINE_EXCEEDED", ln[ln.NOT_FOUND = 5] = "NOT_FOUND", ln[ln.ALREADY_EXISTS = 6] = "ALREADY_EXISTS", ln[ln.PERMISSION_DENIED = 7] = "PERMISSION_DENIED", ln[ln.UNAUTHENTICATED = 16] = "UNAUTHENTICATED", ln[ln.RESOURCE_EXHAUSTED = 8] = "RESOURCE_EXHAUSTED", ln[ln.FAILED_PRECONDITION = 9] = "FAILED_PRECONDITION", ln[ln.ABORTED = 10] = "ABORTED", ln[ln.OUT_OF_RANGE = 11] = "OUT_OF_RANGE", ln[ln.UNIMPLEMENTED = 12] = "UNIMPLEMENTED", ln[ln.INTERNAL = 13] = "INTERNAL", ln[ln.UNAVAILABLE = 14] = "UNAVAILABLE", ln[ln.DATA_LOSS = 15] = "DATA_LOSS";
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ // An immutable sorted map implementation, based on a Left-leaning Red-Black
            // tree.
            class wn {
                constructor(t, e){
                    this.comparator = t, this.root = e || mn.EMPTY;
                }
                // Returns a copy of the map, with the specified key/value added or replaced.
                insert(t, e) {
                    return new wn(this.comparator, this.root.insert(t, e, this.comparator).copy(null, null, mn.BLACK, null, null));
                }
                // Returns a copy of the map, with the specified key removed.
                remove(t) {
                    return new wn(this.comparator, this.root.remove(t, this.comparator).copy(null, null, mn.BLACK, null, null));
                }
                // Returns the value of the node with the given key, or null.
                get(t) {
                    let e = this.root;
                    for(; !e.isEmpty();){
                        const n = this.comparator(t, e.key);
                        if (0 === n) return e.value;
                        n < 0 ? e = e.left : n > 0 && (e = e.right);
                    }
                    return null;
                }
                // Returns the index of the element in this sorted map, or -1 if it doesn't
                // exist.
                indexOf(t) {
                    // Number of nodes that were pruned when descending right
                    let e = 0, n = this.root;
                    for(; !n.isEmpty();){
                        const s = this.comparator(t, n.key);
                        if (0 === s) return e + n.left.size;
                        s < 0 ? n = n.left : (e += n.left.size + 1, n = n.right);
                    }
                    // Node not found
                    return -1;
                }
                isEmpty() {
                    return this.root.isEmpty();
                }
                // Returns the total number of nodes in the map.
                get size() {
                    return this.root.size;
                }
                // Returns the minimum key in the map.
                minKey() {
                    return this.root.minKey();
                }
                // Returns the maximum key in the map.
                maxKey() {
                    return this.root.maxKey();
                }
                // Traverses the map in key order and calls the specified action function
                // for each key/value pair. If action returns true, traversal is aborted.
                // Returns the first truthy value returned by action, or the last falsey
                // value returned by action.
                inorderTraversal(t) {
                    return this.root.inorderTraversal(t);
                }
                forEach(t) {
                    this.inorderTraversal((e, n)=>(t(e, n), !1));
                }
                toString() {
                    const t = [];
                    return this.inorderTraversal((e, n)=>(t.push(`${e}:${n}`), !1)), `{${t.join(", ")}}`;
                }
                // Traverses the map in reverse key order and calls the specified action
                // function for each key/value pair. If action returns true, traversal is
                // aborted.
                // Returns the first truthy value returned by action, or the last falsey
                // value returned by action.
                reverseTraversal(t) {
                    return this.root.reverseTraversal(t);
                }
                // Returns an iterator over the SortedMap.
                getIterator() {
                    return new _n(this.root, null, this.comparator, !1);
                }
                getIteratorFrom(t) {
                    return new _n(this.root, t, this.comparator, !1);
                }
                getReverseIterator() {
                    return new _n(this.root, null, this.comparator, !0);
                }
                getReverseIteratorFrom(t) {
                    return new _n(this.root, t, this.comparator, !0);
                }
            }
            // end SortedMap
            // An iterator over an LLRBNode.
            class _n {
                constructor(t, e, n, s){
                    this.isReverse = s, this.nodeStack = [];
                    let i = 1;
                    for(; !t.isEmpty();)if (i = e ? n(t.key, e) : 1, // flip the comparison if we're going in reverse
                    s && (i *= -1), i < 0) // This node is less than our start key. ignore it
                    t = this.isReverse ? t.left : t.right;
                    else {
                        if (0 === i) {
                            // This node is exactly equal to our start key. Push it on the stack,
                            // but stop iterating;
                            this.nodeStack.push(t);
                            break;
                        }
                        // This node is greater than our start key, add it to the stack and move
                        // to the next one
                        this.nodeStack.push(t), t = this.isReverse ? t.right : t.left;
                    }
                }
                getNext() {
                    let t = this.nodeStack.pop();
                    const e = {
                        key: t.key,
                        value: t.value
                    };
                    if (this.isReverse) for(t = t.left; !t.isEmpty();)this.nodeStack.push(t), t = t.right;
                    else for(t = t.right; !t.isEmpty();)this.nodeStack.push(t), t = t.left;
                    return e;
                }
                hasNext() {
                    return this.nodeStack.length > 0;
                }
                peek() {
                    if (0 === this.nodeStack.length) return null;
                    const t = this.nodeStack[this.nodeStack.length - 1];
                    return {
                        key: t.key,
                        value: t.value
                    };
                }
            }
            // end SortedMapIterator
            // Represents a node in a Left-leaning Red-Black tree.
            class mn {
                constructor(t, e, n, s, i){
                    this.key = t, this.value = e, this.color = null != n ? n : mn.RED, this.left = null != s ? s : mn.EMPTY, this.right = null != i ? i : mn.EMPTY, this.size = this.left.size + 1 + this.right.size;
                }
                // Returns a copy of the current node, optionally replacing pieces of it.
                copy(t, e, n, s, i) {
                    return new mn(null != t ? t : this.key, null != e ? e : this.value, null != n ? n : this.color, null != s ? s : this.left, null != i ? i : this.right);
                }
                isEmpty() {
                    return !1;
                }
                // Traverses the tree in key order and calls the specified action function
                // for each node. If action returns true, traversal is aborted.
                // Returns the first truthy value returned by action, or the last falsey
                // value returned by action.
                inorderTraversal(t) {
                    return this.left.inorderTraversal(t) || t(this.key, this.value) || this.right.inorderTraversal(t);
                }
                // Traverses the tree in reverse key order and calls the specified action
                // function for each node. If action returns true, traversal is aborted.
                // Returns the first truthy value returned by action, or the last falsey
                // value returned by action.
                reverseTraversal(t) {
                    return this.right.reverseTraversal(t) || t(this.key, this.value) || this.left.reverseTraversal(t);
                }
                // Returns the minimum node in the tree.
                min() {
                    return this.left.isEmpty() ? this : this.left.min();
                }
                // Returns the maximum key in the tree.
                minKey() {
                    return this.min().key;
                }
                // Returns the maximum key in the tree.
                maxKey() {
                    return this.right.isEmpty() ? this.key : this.right.maxKey();
                }
                // Returns new tree, with the key/value added.
                insert(t, e, n) {
                    let s = this;
                    const i = n(t, s.key);
                    return (s = i < 0 ? s.copy(null, null, null, s.left.insert(t, e, n), null) : 0 === i ? s.copy(null, e, null, null, null) : s.copy(null, null, null, null, s.right.insert(t, e, n))).fixUp();
                }
                removeMin() {
                    if (this.left.isEmpty()) return mn.EMPTY;
                    let t = this;
                    return t.left.isRed() || t.left.left.isRed() || (t = t.moveRedLeft()), (t = t.copy(null, null, null, t.left.removeMin(), null)).fixUp();
                }
                // Returns new tree, with the specified item removed.
                remove(t, e) {
                    let n, s = this;
                    if (0 > e(t, s.key)) s.left.isEmpty() || s.left.isRed() || s.left.left.isRed() || (s = s.moveRedLeft()), s = s.copy(null, null, null, s.left.remove(t, e), null);
                    else {
                        if (s.left.isRed() && (s = s.rotateRight()), s.right.isEmpty() || s.right.isRed() || s.right.left.isRed() || (s = s.moveRedRight()), 0 === e(t, s.key)) {
                            if (s.right.isEmpty()) return mn.EMPTY;
                            n = s.right.min(), s = s.copy(n.key, n.value, null, null, s.right.removeMin());
                        }
                        s = s.copy(null, null, null, null, s.right.remove(t, e));
                    }
                    return s.fixUp();
                }
                isRed() {
                    return this.color;
                }
                // Returns new tree after performing any needed rotations.
                fixUp() {
                    let t = this;
                    return t.right.isRed() && !t.left.isRed() && (t = t.rotateLeft()), t.left.isRed() && t.left.left.isRed() && (t = t.rotateRight()), t.left.isRed() && t.right.isRed() && (t = t.colorFlip()), t;
                }
                moveRedLeft() {
                    let t = this.colorFlip();
                    return t.right.left.isRed() && (t = (t = (t = t.copy(null, null, null, null, t.right.rotateRight())).rotateLeft()).colorFlip()), t;
                }
                moveRedRight() {
                    let t = this.colorFlip();
                    return t.left.left.isRed() && (t = (t = t.rotateRight()).colorFlip()), t;
                }
                rotateLeft() {
                    const t = this.copy(null, null, mn.RED, null, this.right.left);
                    return this.right.copy(null, null, this.color, t, null);
                }
                rotateRight() {
                    const t = this.copy(null, null, mn.RED, this.left.right, null);
                    return this.left.copy(null, null, this.color, null, t);
                }
                colorFlip() {
                    const t = this.left.copy(null, null, !this.left.color, null, null), e = this.right.copy(null, null, !this.right.color, null, null);
                    return this.copy(null, null, !this.color, t, e);
                }
                // For testing.
                checkMaxDepth() {
                    return Math.pow(2, this.check()) <= this.size + 1;
                }
                // In a balanced RB tree, the black-depth (number of black nodes) from root to
                // leaves is equal on both sides.  This function verifies that or asserts.
                check() {
                    if (this.isRed() && this.left.isRed() || this.right.isRed()) throw L();
                    const t = this.left.check();
                    if (t !== this.right.check()) throw L();
                    return t + (this.isRed() ? 0 : 1);
                }
            }
            // end LLRBNode
            // Empty node is shared between all LLRB trees.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            mn.EMPTY = null, mn.RED = !0, mn.BLACK = !1, // end LLRBEmptyNode
            mn.EMPTY = new class {
                constructor(){
                    this.size = 0;
                }
                get key() {
                    throw L();
                }
                get value() {
                    throw L();
                }
                get color() {
                    throw L();
                }
                get left() {
                    throw L();
                }
                get right() {
                    throw L();
                }
                // Returns a copy of the current node.
                copy(t, e, n, s, i) {
                    return this;
                }
                // Returns a copy of the tree, with the specified key/value added.
                insert(t, e, n) {
                    return new mn(t, e);
                }
                // Returns a copy of the tree, with the specified key removed.
                remove(t, e) {
                    return this;
                }
                isEmpty() {
                    return !0;
                }
                inorderTraversal(t) {
                    return !1;
                }
                reverseTraversal(t) {
                    return !1;
                }
                minKey() {
                    return null;
                }
                maxKey() {
                    return null;
                }
                isRed() {
                    return !1;
                }
                // For testing.
                checkMaxDepth() {
                    return !0;
                }
                check() {
                    return 0;
                }
            }();
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * SortedSet is an immutable (copy-on-write) collection that holds elements
                 * in order specified by the provided comparator.
                 *
                 * NOTE: if provided comparator returns 0 for two elements, we consider them to
                 * be equal!
                 */ class gn {
                constructor(t){
                    this.comparator = t, this.data = new wn(this.comparator);
                }
                has(t) {
                    return null !== this.data.get(t);
                }
                first() {
                    return this.data.minKey();
                }
                last() {
                    return this.data.maxKey();
                }
                get size() {
                    return this.data.size;
                }
                indexOf(t) {
                    return this.data.indexOf(t);
                }
                /** Iterates elements in order defined by "comparator" */ forEach(t) {
                    this.data.inorderTraversal((e, n)=>(t(e), !1));
                }
                /** Iterates over `elem`s such that: range[0] &lt;= elem &lt; range[1]. */ forEachInRange(t, e) {
                    const n = this.data.getIteratorFrom(t[0]);
                    for(; n.hasNext();){
                        const s = n.getNext();
                        if (this.comparator(s.key, t[1]) >= 0) return;
                        e(s.key);
                    }
                }
                /**
                     * Iterates over `elem`s such that: start &lt;= elem until false is returned.
                     */ forEachWhile(t, e) {
                    let n;
                    for(n = void 0 !== e ? this.data.getIteratorFrom(e) : this.data.getIterator(); n.hasNext();)if (!t(n.getNext().key)) return;
                }
                /** Finds the least element greater than or equal to `elem`. */ firstAfterOrEqual(t) {
                    const e = this.data.getIteratorFrom(t);
                    return e.hasNext() ? e.getNext().key : null;
                }
                getIterator() {
                    return new yn(this.data.getIterator());
                }
                getIteratorFrom(t) {
                    return new yn(this.data.getIteratorFrom(t));
                }
                /** Inserts or updates an element */ add(t) {
                    return this.copy(this.data.remove(t).insert(t, !0));
                }
                /** Deletes an element */ delete(t) {
                    return this.has(t) ? this.copy(this.data.remove(t)) : this;
                }
                isEmpty() {
                    return this.data.isEmpty();
                }
                unionWith(t) {
                    let e = this;
                    // Make sure `result` always refers to the larger one of the two sets.
                    return e.size < t.size && (e = t, t = this), t.forEach((t)=>{
                        e = e.add(t);
                    }), e;
                }
                isEqual(t) {
                    if (!(t instanceof gn) || this.size !== t.size) return !1;
                    const e = this.data.getIterator(), n = t.data.getIterator();
                    for(; e.hasNext();){
                        const t = e.getNext().key, s = n.getNext().key;
                        if (0 !== this.comparator(t, s)) return !1;
                    }
                    return !0;
                }
                toArray() {
                    const t = [];
                    return this.forEach((e)=>{
                        t.push(e);
                    }), t;
                }
                toString() {
                    const t = [];
                    return this.forEach((e)=>t.push(e)), "SortedSet(" + t.toString() + ")";
                }
                copy(t) {
                    const e = new gn(this.comparator);
                    return e.data = t, e;
                }
            }
            class yn {
                constructor(t){
                    this.iter = t;
                }
                getNext() {
                    return this.iter.getNext().key;
                }
                hasNext() {
                    return this.iter.hasNext();
                }
            }
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ const pn = new wn(Pt.comparator), En = new wn(Pt.comparator);
            new wn(Pt.comparator);
            const bn = new gn(Pt.comparator);
            function Pn(...t) {
                let e = bn;
                for (const n of t)e = e.add(n);
                return e;
            }
            const vn = new gn(et);
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * An event from the RemoteStore. It is split into targetChanges (changes to the
                 * state or the set of documents in our watched targets) and documentUpdates
                 * (changes to the actual documents).
                 */ class Sn {
                constructor(/**
                         * The snapshot version this event brings us up to, or MIN if not set.
                         */ t, /**
                         * A map from target to changes to the target. See TargetChange.
                         */ e, /**
                         * A set of targets that is known to be inconsistent. Listens for these
                         * targets should be re-established without resume tokens.
                         */ n, /**
                         * A set of which documents have changed or been deleted, along with the
                         * doc's new values (if not deleted).
                         */ s, /**
                         * A set of which document updates are due only to limbo resolution targets.
                         */ i){
                    this.snapshotVersion = t, this.targetChanges = e, this.targetMismatches = n, this.documentUpdates = s, this.resolvedLimboDocuments = i;
                }
                /**
                     * HACK: Views require RemoteEvents in order to determine whether the view is
                     * CURRENT, but secondary tabs don't receive remote events. So this method is
                     * used to create a synthesized RemoteEvent that can be used to apply a
                     * CURRENT status change to a View, for queries executed in a different tab.
                     */ // PORTING NOTE: Multi-tab only
                static createSynthesizedRemoteEventForCurrentChange(t, e) {
                    const n = new Map();
                    return n.set(t, Dn.createSynthesizedTargetChangeForCurrentChange(t, e)), new Sn(rt.min(), n, vn, pn, Pn());
                }
            }
            /**
                 * A TargetChange specifies the set of changes for a specific target as part of
                 * a RemoteEvent. These changes track which documents are added, modified or
                 * removed, as well as the target's resume token and whether the target is
                 * marked CURRENT.
                 * The actual changes *to* documents are not part of the TargetChange since
                 * documents may be part of multiple targets.
                 */ class Dn {
                constructor(/**
                         * An opaque, server-assigned token that allows watching a query to be resumed
                         * after disconnecting without retransmitting all the data that matches the
                         * query. The resume token essentially identifies a point in time from which
                         * the server should resume sending results.
                         */ t, /**
                         * The "current" (synced) status of this target. Note that "current"
                         * has special meaning in the RPC protocol that implies that a target is
                         * both up-to-date and consistent with the rest of the watch stream.
                         */ e, /**
                         * The set of documents that were newly assigned to this target as part of
                         * this remote event.
                         */ n, /**
                         * The set of documents that were already assigned to this target but received
                         * an update during this remote event.
                         */ s, /**
                         * The set of documents that were removed from this target as part of this
                         * remote event.
                         */ i){
                    this.resumeToken = t, this.current = e, this.addedDocuments = n, this.modifiedDocuments = s, this.removedDocuments = i;
                }
                /**
                     * This method is used to create a synthesized TargetChanges that can be used to
                     * apply a CURRENT status change to a View (for queries executed in a different
                     * tab) or for new queries (to raise snapshots with correct CURRENT status).
                     */ static createSynthesizedTargetChangeForCurrentChange(t, e) {
                    return new Dn(_t.EMPTY_BYTE_STRING, e, Pn(), Pn(), Pn());
                }
            }
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * Represents a changed document and a list of target ids to which this change
                 * applies.
                 *
                 * If document has been deleted NoDocument will be provided.
                 */ class Cn {
                constructor(/** The new document applies to all of these targets. */ t, /** The new document is removed from all of these targets. */ e, /** The key of the document for this change. */ n, /**
                         * The new document or NoDocument if it was deleted. Is null if the
                         * document went out of view without the server sending a new document.
                         */ s){
                    this.k = t, this.removedTargetIds = e, this.key = n, this.$ = s;
                }
            }
            class Nn {
                constructor(t, e){
                    this.targetId = t, this.O = e;
                }
            }
            class xn {
                constructor(/** What kind of change occurred to the watch target. */ t, /** The target IDs that were added/removed/set. */ e, /**
                         * An opaque, server-assigned token that allows watching a target to be
                         * resumed after disconnecting without retransmitting all the data that
                         * matches the target. The resume token essentially identifies a point in
                         * time from which the server should resume sending results.
                         */ n = _t.EMPTY_BYTE_STRING, /** An RPC error indicating why the watch failed. */ s = null){
                    this.state = t, this.targetIds = e, this.resumeToken = n, this.cause = s;
                }
            }
            /** Tracks the internal state of a Watch target. */ class kn {
                constructor(){
                    /**
                         * The number of pending responses (adds or removes) that we are waiting on.
                         * We only consider targets active that have no pending responses.
                         */ this.F = 0, /**
                             * Keeps track of the document changes since the last raised snapshot.
                             *
                             * These changes are continuously updated as we receive document updates and
                             * always reflect the current set of changes against the last issued snapshot.
                             */ this.M = Fn(), /** See public getters for explanations of these fields. */ this.L = _t.EMPTY_BYTE_STRING, this.B = !1, /**
                             * Whether this target state should be included in the next snapshot. We
                             * initialize to true so that newly-added targets are included in the next
                             * RemoteEvent.
                             */ this.U = !0;
                }
                /**
                     * Whether this target has been marked 'current'.
                     *
                     * 'Current' has special meaning in the RPC protocol: It implies that the
                     * Watch backend has sent us all changes up to the point at which the target
                     * was added and that the target is consistent with the rest of the watch
                     * stream.
                     */ get current() {
                    return this.B;
                }
                /** The last resume token sent to us for this target. */ get resumeToken() {
                    return this.L;
                }
                /** Whether this target has pending target adds or target removes. */ get q() {
                    return 0 !== this.F;
                }
                /** Whether we have modified any state that should trigger a snapshot. */ get K() {
                    return this.U;
                }
                /**
                     * Applies the resume token to the TargetChange, but only when it has a new
                     * value. Empty resumeTokens are discarded.
                     */ j(t) {
                    t.approximateByteSize() > 0 && (this.U = !0, this.L = t);
                }
                /**
                     * Creates a target change from the current set of changes.
                     *
                     * To reset the document changes after raising this snapshot, call
                     * `clearPendingChanges()`.
                     */ W() {
                    let t = Pn(), e = Pn(), n = Pn();
                    return this.M.forEach((s, i)=>{
                        switch(i){
                            case 0 /* Added */ :
                                t = t.add(s);
                                break;
                            case 2 /* Modified */ :
                                e = e.add(s);
                                break;
                            case 1 /* Removed */ :
                                n = n.add(s);
                                break;
                            default:
                                L();
                        }
                    }), new Dn(this.L, this.B, t, e, n);
                }
                /**
                     * Resets the document changes and sets `hasPendingChanges` to false.
                     */ G() {
                    this.U = !1, this.M = Fn();
                }
                H(t, e) {
                    this.U = !0, this.M = this.M.insert(t, e);
                }
                J(t) {
                    this.U = !0, this.M = this.M.remove(t);
                }
                Y() {
                    this.F += 1;
                }
                X() {
                    this.F -= 1;
                }
                Z() {
                    this.U = !0, this.B = !0;
                }
            }
            /**
                 * A helper class to accumulate watch changes into a RemoteEvent.
                 */ class $n {
                constructor(t){
                    this.tt = t, /** The internal state of all tracked targets. */ this.et = new Map(), /** Keeps track of the documents to update since the last raised snapshot. */ this.nt = pn, /** A mapping of document keys to their set of target IDs. */ this.st = On(), /**
                             * A list of targets with existence filter mismatches. These targets are
                             * known to be inconsistent and their listens needs to be re-established by
                             * RemoteStore.
                             */ this.it = new gn(et);
                }
                /**
                     * Processes and adds the DocumentWatchChange to the current set of changes.
                     */ rt(t) {
                    for (const e of t.k)t.$ && t.$.isFoundDocument() ? this.ot(e, t.$) : this.ct(e, t.key, t.$);
                    for (const e of t.removedTargetIds)this.ct(e, t.key, t.$);
                }
                /** Processes and adds the WatchTargetChange to the current set of changes. */ at(t) {
                    this.forEachTarget(t, (e)=>{
                        const n = this.ut(e);
                        switch(t.state){
                            case 0 /* NoChange */ :
                                this.ht(e) && n.j(t.resumeToken);
                                break;
                            case 1 /* Added */ :
                                // We need to decrement the number of pending acks needed from watch
                                // for this targetId.
                                n.X(), n.q || // We have a freshly added target, so we need to reset any state
                                // that we had previously. This can happen e.g. when remove and add
                                // back a target for existence filter mismatches.
                                n.G(), n.j(t.resumeToken);
                                break;
                            case 2 /* Removed */ :
                                // We need to keep track of removed targets to we can post-filter and
                                // remove any target changes.
                                // We need to decrement the number of pending acks needed from watch
                                // for this targetId.
                                n.X(), n.q || this.removeTarget(e);
                                break;
                            case 3 /* Current */ :
                                this.ht(e) && (n.Z(), n.j(t.resumeToken));
                                break;
                            case 4 /* Reset */ :
                                this.ht(e) && // Reset the target and synthesizes removes for all existing
                                // documents. The backend will re-add any documents that still
                                // match the target before it sends the next global snapshot.
                                (this.lt(e), n.j(t.resumeToken));
                                break;
                            default:
                                L();
                        }
                    });
                }
                /**
                     * Iterates over all targetIds that the watch change applies to: either the
                     * targetIds explicitly listed in the change or the targetIds of all currently
                     * active targets.
                     */ forEachTarget(t, e) {
                    t.targetIds.length > 0 ? t.targetIds.forEach(e) : this.et.forEach((t, n)=>{
                        this.ht(n) && e(n);
                    });
                }
                /**
                     * Handles existence filters and synthesizes deletes for filter mismatches.
                     * Targets that are invalidated by filter mismatches are added to
                     * `pendingTargetResets`.
                     */ ft(t) {
                    const e = t.targetId, n = t.O.count, s = this.dt(e);
                    if (s) {
                        const t = s.target;
                        if (Ht(t)) {
                            if (0 === n) {
                                // The existence filter told us the document does not exist. We deduce
                                // that this document does not exist and apply a deleted document to
                                // our updates. Without applying this deleted document there might be
                                // another query that will raise this document as part of a snapshot
                                // until it is resolved, essentially exposing inconsistency between
                                // queries.
                                const n = new Pt(t.path);
                                this.ct(e, n, Kt.newNoDocument(n, rt.min()));
                            } else 1 === n || L();
                        } else this.wt(e) !== n && // Existence filter mismatch: We reset the mapping and raise a new
                        // snapshot with `isFromCache:true`.
                        (this.lt(e), this.it = this.it.add(e));
                    }
                }
                /**
                     * Converts the currently accumulated state into a remote event at the
                     * provided snapshot version. Resets the accumulated changes before returning.
                     */ _t(t) {
                    const e = new Map();
                    this.et.forEach((n, s)=>{
                        const i = this.dt(s);
                        if (i) {
                            if (n.current && Ht(i.target)) {
                                // Document queries for document that don't exist can produce an empty
                                // result set. To update our local cache, we synthesize a document
                                // delete if we have not previously received the document. This
                                // resolves the limbo state of the document, removing it from
                                // limboDocumentRefs.
                                // TODO(dimond): Ideally we would have an explicit lookup target
                                // instead resulting in an explicit delete message and we could
                                // remove this special logic.
                                const e = new Pt(i.target.path);
                                null !== this.nt.get(e) || this.gt(s, e) || this.ct(s, e, Kt.newNoDocument(e, t));
                            }
                            n.K && (e.set(s, n.W()), n.G());
                        }
                    });
                    let n = Pn();
                    // We extract the set of limbo-only document updates as the GC logic
                    // special-cases documents that do not appear in the target cache.
                    // TODO(gsoltis): Expand on this comment once GC is available in the JS
                    // client.
                    this.st.forEach((t, e)=>{
                        let s = !0;
                        e.forEachWhile((t)=>{
                            const e = this.dt(t);
                            return !e || 2 /* LimboResolution */  === e.purpose || (s = !1, !1);
                        }), s && (n = n.add(t));
                    });
                    const s = new Sn(t, e, this.it, this.nt, n);
                    return this.nt = pn, this.st = On(), this.it = new gn(et), s;
                }
                /**
                     * Adds the provided document to the internal list of document updates and
                     * its document key to the given target's mapping.
                     */ // Visible for testing.
                ot(t, e) {
                    if (!this.ht(t)) return;
                    const n = this.gt(t, e.key) ? 2 /* Modified */  : 0; /* Added */ 
                    this.ut(t).H(e.key, n), this.nt = this.nt.insert(e.key, e), this.st = this.st.insert(e.key, this.yt(e.key).add(t));
                }
                /**
                     * Removes the provided document from the target mapping. If the
                     * document no longer matches the target, but the document's state is still
                     * known (e.g. we know that the document was deleted or we received the change
                     * that caused the filter mismatch), the new document can be provided
                     * to update the remote document cache.
                     */ // Visible for testing.
                ct(t, e, n) {
                    if (!this.ht(t)) return;
                    const s = this.ut(t);
                    this.gt(t, e) ? s.H(e, 1 /* Removed */ ) : // snapshot, so we can just ignore the change.
                    s.J(e), this.st = this.st.insert(e, this.yt(e).delete(t)), n && (this.nt = this.nt.insert(e, n));
                }
                removeTarget(t) {
                    this.et.delete(t);
                }
                /**
                     * Returns the current count of documents in the target. This includes both
                     * the number of documents that the LocalStore considers to be part of the
                     * target as well as any accumulated changes.
                     */ wt(t) {
                    const e = this.ut(t).W();
                    return this.tt.getRemoteKeysForTarget(t).size + e.addedDocuments.size - e.removedDocuments.size;
                }
                /**
                     * Increment the number of acks needed from watch before we can consider the
                     * server to be 'in-sync' with the client's active targets.
                     */ Y(t) {
                    this.ut(t).Y();
                }
                ut(t) {
                    let e = this.et.get(t);
                    return e || (e = new kn(), this.et.set(t, e)), e;
                }
                yt(t) {
                    let e = this.st.get(t);
                    return e || (e = new gn(et), this.st = this.st.insert(t, e)), e;
                }
                /**
                     * Verifies that the user is still interested in this target (by calling
                     * `getTargetDataForTarget()`) and that we are not waiting for pending ADDs
                     * from watch.
                     */ ht(t) {
                    const e = null !== this.dt(t);
                    return e || $("WatchChangeAggregator", "Detected inactive target", t), e;
                }
                /**
                     * Returns the TargetData for an active target (i.e. a target that the user
                     * is still interested in that has no outstanding target change requests).
                     */ dt(t) {
                    const e = this.et.get(t);
                    return e && e.q ? null : this.tt.Tt(t);
                }
                /**
                     * Resets the state of a Watch target to its initial state (e.g. sets
                     * 'current' to false, clears the resume token and removes its target mapping
                     * from all documents).
                     */ lt(t) {
                    this.et.set(t, new kn()), this.tt.getRemoteKeysForTarget(t).forEach((e)=>{
                        this.ct(t, e, /*updatedDocument=*/ null);
                    });
                }
                /**
                     * Returns whether the LocalStore considers the document to be part of the
                     * specified target.
                     */ gt(t, e) {
                    return this.tt.getRemoteKeysForTarget(t).has(e);
                }
            }
            function On() {
                return new wn(Pt.comparator);
            }
            function Fn() {
                return new wn(Pt.comparator);
            }
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ const Mn = {
                asc: "ASCENDING",
                desc: "DESCENDING"
            }, Ln = {
                "<": "LESS_THAN",
                "<=": "LESS_THAN_OR_EQUAL",
                ">": "GREATER_THAN",
                ">=": "GREATER_THAN_OR_EQUAL",
                "==": "EQUAL",
                "!=": "NOT_EQUAL",
                "array-contains": "ARRAY_CONTAINS",
                in: "IN",
                "not-in": "NOT_IN",
                "array-contains-any": "ARRAY_CONTAINS_ANY"
            };
            /**
                 * This class generates JsonObject values for the Datastore API suitable for
                 * sending to either GRPC stub methods or via the JSON/HTTP REST API.
                 *
                 * The serializer supports both Protobuf.js and Proto3 JSON formats. By
                 * setting `useProto3Json` to true, the serializer will use the Proto3 JSON
                 * format.
                 *
                 * For a description of the Proto3 JSON format check
                 * https://developers.google.com/protocol-buffers/docs/proto3#json
                 *
                 * TODO(klimt): We can remove the databaseId argument if we keep the full
                 * resource name in documents.
                 */ class Bn {
                constructor(t, e){
                    this.databaseId = t, this.D = e;
                }
            }
            function jn(t) {
                return t || L(), rt.fromTimestamp(function(t) {
                    const e = gt(t);
                    return new it(e.seconds, e.nanos);
                }(t));
            }
            function Wn(t) {
                const e = ht.fromString(t);
                return Ts(e) || L(), e;
            }
            function zn(t, e) {
                const n = Wn(e);
                if (n.get(1) !== t.databaseId.projectId) throw new j(K.INVALID_ARGUMENT, "Tried to deserialize key from different project: " + n.get(1) + " vs " + t.databaseId.projectId);
                if (n.get(3) !== t.databaseId.database) throw new j(K.INVALID_ARGUMENT, "Tried to deserialize key from different database: " + n.get(3) + " vs " + t.databaseId.database);
                return new Pt(Xn(n));
            }
            function Hn(t, e) {
                var t1;
                return new ht([
                    "projects",
                    (t1 = t.databaseId).projectId,
                    "databases",
                    t1.database
                ]).child("documents").child(e).canonicalString();
            }
            function Yn(t) {
                return new ht([
                    "projects",
                    t.databaseId.projectId,
                    "databases",
                    t.databaseId.database
                ]).canonicalString();
            }
            function Xn(t) {
                return t.length > 4 && "documents" === t.get(4) || L(), t.popFirst(5);
            }
            function ls(t) {
                return {
                    before: t.before,
                    values: t.position
                };
            }
            function fs(t) {
                const e = !!t.before;
                return new oe(t.values || [], e);
            }
            function _s(t) {
                return {
                    fieldPath: t.canonicalString()
                };
            }
            function ms(t) {
                return ft.fromServerFormat(t.fieldPath);
            }
            function Ts(t) {
                // Resource names have at least 4 components (project ID, database ID)
                return t.length >= 4 && "projects" === t.get(0) && "databases" === t.get(2);
            }
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * Encodes a resource path into a IndexedDb-compatible string form.
                 */ function Es(t) {
                let e = "";
                for(let n = 0; n < t.length; n++)e.length > 0 && (e += ""), e = /** Encodes a single segment of a resource path into the given result */ function(t, e) {
                    let n = e;
                    const s = t.length;
                    for(let e = 0; e < s; e++){
                        const s = t.charAt(e);
                        switch(s){
                            case "\0":
                                n += "";
                                break;
                            case "":
                                n += "";
                                break;
                            default:
                                n += s;
                        }
                    }
                    return n;
                }(t.get(n), e);
                return e + "";
            }
            /**
                 * A singleton object to be stored in the 'owner' store in IndexedDb.
                 *
                 * A given database can have a single primary tab assigned at a given time. That
                 * tab must validate that it is still holding the primary lease before every
                 * operation that requires locked access. The primary tab should regularly
                 * write an updated timestamp to this lease to prevent other tabs from
                 * "stealing" the primary lease
                 */ class Ps {
                constructor(t, /** Whether to allow shared access from multiple tabs. */ e, n){
                    this.ownerId = t, this.allowTabSynchronization = e, this.leaseTimestampMs = n;
                }
            }
            /**
                 * Name of the IndexedDb object store.
                 *
                 * Note that the name 'owner' is chosen to ensure backwards compatibility with
                 * older clients that only supported single locked access to the persistence
                 * layer.
                 */ Ps.store = "owner", /**
                     * The key string used for the single object that exists in the
                     * DbPrimaryClient store.
                     */ Ps.key = "owner";
            /**
                 * An object to be stored in the 'mutationQueues' store in IndexedDb.
                 *
                 * Each user gets a single queue of MutationBatches to apply to the server.
                 * DbMutationQueue tracks the metadata about the queue.
                 */ class vs {
                constructor(/**
                         * The normalized user ID to which this queue belongs.
                         */ t, /**
                         * An identifier for the highest numbered batch that has been acknowledged
                         * by the server. All MutationBatches in this queue with batchIds less
                         * than or equal to this value are considered to have been acknowledged by
                         * the server.
                         *
                         * NOTE: this is deprecated and no longer used by the code.
                         */ e, /**
                         * A stream token that was previously sent by the server.
                         *
                         * See StreamingWriteRequest in datastore.proto for more details about
                         * usage.
                         *
                         * After sending this token, earlier tokens may not be used anymore so
                         * only a single stream token is retained.
                         *
                         * NOTE: this is deprecated and no longer used by the code.
                         */ n){
                    this.userId = t, this.lastAcknowledgedBatchId = e, this.lastStreamToken = n;
                }
            }
            /** Name of the IndexedDb object store.  */ vs.store = "mutationQueues", /** Keys are automatically assigned via the userId property. */ vs.keyPath = "userId";
            /**
                 * An object to be stored in the 'mutations' store in IndexedDb.
                 *
                 * Represents a batch of user-level mutations intended to be sent to the server
                 * in a single write. Each user-level batch gets a separate DbMutationBatch
                 * with a new batchId.
                 */ class Vs {
                constructor(/**
                         * The normalized user ID to which this batch belongs.
                         */ t, /**
                         * An identifier for this batch, allocated using an auto-generated key.
                         */ e, /**
                         * The local write time of the batch, stored as milliseconds since the
                         * epoch.
                         */ n, /**
                         * A list of "mutations" that represent a partial base state from when this
                         * write batch was initially created. During local application of the write
                         * batch, these baseMutations are applied prior to the real writes in order
                         * to override certain document fields from the remote document cache. This
                         * is necessary in the case of non-idempotent writes (e.g. `increment()`
                         * transforms) to make sure that the local view of the modified documents
                         * doesn't flicker if the remote document cache receives the result of the
                         * non-idempotent write before the write is removed from the queue.
                         *
                         * These mutations are never sent to the backend.
                         */ s, /**
                         * A list of mutations to apply. All mutations will be applied atomically.
                         *
                         * Mutations are serialized via toMutation().
                         */ i){
                    this.userId = t, this.batchId = e, this.localWriteTimeMs = n, this.baseMutations = s, this.mutations = i;
                }
            }
            /** Name of the IndexedDb object store.  */ Vs.store = "mutations", /** Keys are automatically assigned via the userId, batchId properties. */ Vs.keyPath = "batchId", /** The index name for lookup of mutations by user. */ Vs.userMutationsIndex = "userMutationsIndex", /** The user mutations index is keyed by [userId, batchId] pairs. */ Vs.userMutationsKeyPath = [
                "userId",
                "batchId"
            ];
            /**
                 * An object to be stored in the 'documentMutations' store in IndexedDb.
                 *
                 * A manually maintained index of all the mutation batches that affect a given
                 * document key. The rows in this table are references based on the contents of
                 * DbMutationBatch.mutations.
                 */ class Ss {
                constructor(){}
                /**
                     * Creates a [userId] key for use in the DbDocumentMutations index to iterate
                     * over all of a user's document mutations.
                     */ static prefixForUser(t) {
                    return [
                        t
                    ];
                }
                /**
                     * Creates a [userId, encodedPath] key for use in the DbDocumentMutations
                     * index to iterate over all at document mutations for a given path or lower.
                     */ static prefixForPath(t, e) {
                    return [
                        t,
                        Es(e)
                    ];
                }
                /**
                     * Creates a full index key of [userId, encodedPath, batchId] for inserting
                     * and deleting into the DbDocumentMutations index.
                     */ static key(t, e, n) {
                    return [
                        t,
                        Es(e),
                        n
                    ];
                }
            }
            Ss.store = "documentMutations", /**
                     * Because we store all the useful information for this store in the key,
                     * there is no useful information to store as the value. The raw (unencoded)
                     * path cannot be stored because IndexedDb doesn't store prototype
                     * information.
                     */ Ss.PLACEHOLDER = new Ss();
            /**
                 * An object to be stored in the 'remoteDocuments' store in IndexedDb.
                 * It represents either:
                 *
                 * - A complete document.
                 * - A "no document" representing a document that is known not to exist (at
                 * some version).
                 * - An "unknown document" representing a document that is known to exist (at
                 * some version) but whose contents are unknown.
                 *
                 * Note: This is the persisted equivalent of a MaybeDocument and could perhaps
                 * be made more general if necessary.
                 */ class Ns {
                // TODO: We are currently storing full document keys almost three times
                // (once as part of the primary key, once - partly - as `parentPath` and once
                // inside the encoded documents). During our next migration, we should
                // rewrite the primary key as parentPath + document ID which would allow us
                // to drop one value.
                constructor(/**
                         * Set to an instance of DbUnknownDocument if the data for a document is
                         * not known, but it is known that a document exists at the specified
                         * version (e.g. it had a successful update applied to it)
                         */ t, /**
                         * Set to an instance of a DbNoDocument if it is known that no document
                         * exists.
                         */ e, /**
                         * Set to an instance of a Document if there's a cached version of the
                         * document.
                         */ n, /**
                         * Documents that were written to the remote document store based on
                         * a write acknowledgment are marked with `hasCommittedMutations`. These
                         * documents are potentially inconsistent with the backend's copy and use
                         * the write's commit version as their document version.
                         */ s, /**
                         * When the document was read from the backend. Undefined for data written
                         * prior to schema version 9.
                         */ i, /**
                         * The path of the collection this document is part of. Undefined for data
                         * written prior to schema version 9.
                         */ r){
                    this.unknownDocument = t, this.noDocument = e, this.document = n, this.hasCommittedMutations = s, this.readTime = i, this.parentPath = r;
                }
            }
            Ns.store = "remoteDocuments", /**
                     * An index that provides access to all entries sorted by read time (which
                     * corresponds to the last modification time of each row).
                     *
                     * This index is used to provide a changelog for Multi-Tab.
                     */ Ns.readTimeIndex = "readTimeIndex", Ns.readTimeIndexPath = "readTime", /**
                     * An index that provides access to documents in a collection sorted by read
                     * time.
                     *
                     * This index is used to allow the RemoteDocumentCache to fetch newly changed
                     * documents in a collection.
                     */ Ns.collectionReadTimeIndex = "collectionReadTimeIndex", Ns.collectionReadTimeIndexPath = [
                "parentPath",
                "readTime"
            ];
            /**
                 * Contains a single entry that has metadata about the remote document cache.
                 */ class xs {
                /**
                     * @param byteSize - Approximately the total size in bytes of all the
                     * documents in the document cache.
                     */ constructor(t){
                    this.byteSize = t;
                }
            }
            xs.store = "remoteDocumentGlobal", xs.key = "remoteDocumentGlobalKey";
            /**
                 * An object to be stored in the 'targets' store in IndexedDb.
                 *
                 * This is based on and should be kept in sync with the proto used in the iOS
                 * client.
                 *
                 * Each query the client listens to against the server is tracked on disk so
                 * that the query can be efficiently resumed on restart.
                 */ class ks {
                constructor(/**
                         * An auto-generated sequential numeric identifier for the query.
                         *
                         * Queries are stored using their canonicalId as the key, but these
                         * canonicalIds can be quite long so we additionally assign a unique
                         * queryId which can be used by referenced data structures (e.g.
                         * indexes) to minimize the on-disk cost.
                         */ t, /**
                         * The canonical string representing this query. This is not unique.
                         */ e, /**
                         * The last readTime received from the Watch Service for this query.
                         *
                         * This is the same value as TargetChange.read_time in the protos.
                         */ n, /**
                         * An opaque, server-assigned token that allows watching a query to be
                         * resumed after disconnecting without retransmitting all the data
                         * that matches the query. The resume token essentially identifies a
                         * point in time from which the server should resume sending results.
                         *
                         * This is related to the snapshotVersion in that the resumeToken
                         * effectively also encodes that value, but the resumeToken is opaque
                         * and sometimes encodes additional information.
                         *
                         * A consequence of this is that the resumeToken should be used when
                         * asking the server to reason about where this client is in the watch
                         * stream, but the client should use the snapshotVersion for its own
                         * purposes.
                         *
                         * This is the same value as TargetChange.resume_token in the protos.
                         */ s, /**
                         * A sequence number representing the last time this query was
                         * listened to, used for garbage collection purposes.
                         *
                         * Conventionally this would be a timestamp value, but device-local
                         * clocks are unreliable and they must be able to create new listens
                         * even while disconnected. Instead this should be a monotonically
                         * increasing number that's incremented on each listen call.
                         *
                         * This is different from the queryId since the queryId is an
                         * immutable identifier assigned to the Query on first use while
                         * lastListenSequenceNumber is updated every time the query is
                         * listened to.
                         */ i, /**
                         * Denotes the maximum snapshot version at which the associated query view
                         * contained no limbo documents.  Undefined for data written prior to
                         * schema version 9.
                         */ r, /**
                         * The query for this target.
                         *
                         * Because canonical ids are not unique we must store the actual query. We
                         * use the proto to have an object we can persist without having to
                         * duplicate translation logic to and from a `Query` object.
                         */ o){
                    this.targetId = t, this.canonicalId = e, this.readTime = n, this.resumeToken = s, this.lastListenSequenceNumber = i, this.lastLimboFreeSnapshotVersion = r, this.query = o;
                }
            }
            ks.store = "targets", /** Keys are automatically assigned via the targetId property. */ ks.keyPath = "targetId", /** The name of the queryTargets index. */ ks.queryTargetsIndexName = "queryTargetsIndex", /**
                     * The index of all canonicalIds to the targets that they match. This is not
                     * a unique mapping because canonicalId does not promise a unique name for all
                     * possible queries, so we append the targetId to make the mapping unique.
                     */ ks.queryTargetsKeyPath = [
                "canonicalId",
                "targetId"
            ];
            /**
                 * An object representing an association between a target and a document, or a
                 * sentinel row marking the last sequence number at which a document was used.
                 * Each document cached must have a corresponding sentinel row before lru
                 * garbage collection is enabled.
                 *
                 * The target associations and sentinel rows are co-located so that orphaned
                 * documents and their sequence numbers can be identified efficiently via a scan
                 * of this store.
                 */ class $s {
                constructor(/**
                         * The targetId identifying a target or 0 for a sentinel row.
                         */ t, /**
                         * The path to the document, as encoded in the key.
                         */ e, /**
                         * If this is a sentinel row, this should be the sequence number of the last
                         * time the document specified by `path` was used. Otherwise, it should be
                         * `undefined`.
                         */ n){
                    this.targetId = t, this.path = e, this.sequenceNumber = n;
                }
            }
            /** Name of the IndexedDb object store.  */ $s.store = "targetDocuments", /** Keys are automatically assigned via the targetId, path properties. */ $s.keyPath = [
                "targetId",
                "path"
            ], /** The index name for the reverse index. */ $s.documentTargetsIndex = "documentTargetsIndex", /** We also need to create the reverse index for these properties. */ $s.documentTargetsKeyPath = [
                "path",
                "targetId"
            ];
            /**
                 * A record of global state tracked across all Targets, tracked separately
                 * to avoid the need for extra indexes.
                 *
                 * This should be kept in-sync with the proto used in the iOS client.
                 */ class Os {
                constructor(/**
                         * The highest numbered target id across all targets.
                         *
                         * See DbTarget.targetId.
                         */ t, /**
                         * The highest numbered lastListenSequenceNumber across all targets.
                         *
                         * See DbTarget.lastListenSequenceNumber.
                         */ e, /**
                         * A global snapshot version representing the last consistent snapshot we
                         * received from the backend. This is monotonically increasing and any
                         * snapshots received from the backend prior to this version (e.g. for
                         * targets resumed with a resumeToken) should be suppressed (buffered)
                         * until the backend has caught up to this snapshot version again. This
                         * prevents our cache from ever going backwards in time.
                         */ n, /**
                         * The number of targets persisted.
                         */ s){
                    this.highestTargetId = t, this.highestListenSequenceNumber = e, this.lastRemoteSnapshotVersion = n, this.targetCount = s;
                }
            }
            /**
                 * The key string used for the single object that exists in the
                 * DbTargetGlobal store.
                 */ Os.key = "targetGlobalKey", Os.store = "targetGlobal";
            /**
                 * An object representing an association between a Collection id (e.g. 'messages')
                 * to a parent path (e.g. '/chats/123') that contains it as a (sub)collection.
                 * This is used to efficiently find all collections to query when performing
                 * a Collection Group query.
                 */ class Fs {
                constructor(/**
                         * The collectionId (e.g. 'messages')
                         */ t, /**
                         * The path to the parent (either a document location or an empty path for
                         * a root-level collection).
                         */ e){
                    this.collectionId = t, this.parent = e;
                }
            }
            /** Name of the IndexedDb object store. */ Fs.store = "collectionParents", /** Keys are automatically assigned via the collectionId, parent properties. */ Fs.keyPath = [
                "collectionId",
                "parent"
            ];
            /**
                 * A record of the metadata state of each client.
                 *
                 * PORTING NOTE: This is used to synchronize multi-tab state and does not need
                 * to be ported to iOS or Android.
                 */ class Ms {
                constructor(// Note: Previous schema versions included a field
                // "lastProcessedDocumentChangeId". Don't use anymore.
                /** The auto-generated client id assigned at client startup. */ t, /** The last time this state was updated. */ e, /** Whether the client's network connection is enabled. */ n, /** Whether this client is running in a foreground tab. */ s){
                    this.clientId = t, this.updateTimeMs = e, this.networkEnabled = n, this.inForeground = s;
                }
            }
            /** Name of the IndexedDb object store. */ Ms.store = "clientMetadata", /** Keys are automatically assigned via the clientId properties. */ Ms.keyPath = "clientId";
            /**
                 * A object representing a bundle loaded by the SDK.
                 */ class Ls {
                constructor(/** The ID of the loaded bundle. */ t, /** The create time of the loaded bundle. */ e, /** The schema version of the loaded bundle. */ n){
                    this.bundleId = t, this.createTime = e, this.version = n;
                }
            }
            /** Name of the IndexedDb object store. */ Ls.store = "bundles", Ls.keyPath = "bundleId";
            /**
                 * A object representing a named query loaded by the SDK via a bundle.
                 */ class Bs {
                constructor(/** The name of the query. */ t, /** The read time of the results saved in the bundle from the named query. */ e, /** The query saved in the bundle. */ n){
                    this.name = t, this.readTime = e, this.bundledQuery = n;
                }
            }
            /** Name of the IndexedDb object store. */ Bs.store = "namedQueries", Bs.keyPath = "name", vs.store, Vs.store, Ss.store, Ns.store, ks.store, Ps.store, Os.store, $s.store, Ms.store, xs.store, Fs.store, Ls.store, Bs.store;
            // V2 is no longer usable (see comment at top of file)
            // Visible for testing
            /**
                 * A base class representing a persistence transaction, encapsulating both the
                 * transaction's sequence numbers as well as a list of onCommitted listeners.
                 *
                 * When you call Persistence.runTransaction(), it will create a transaction and
                 * pass it to your callback. You then pass it to any method that operates
                 * on persistence.
                 */ class Ks {
                constructor(){
                    this.onCommittedListeners = [];
                }
                addOnCommittedListener(t) {
                    this.onCommittedListeners.push(t);
                }
                raiseOnCommittedEvent() {
                    this.onCommittedListeners.forEach((t)=>t());
                }
            }
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * PersistencePromise is essentially a re-implementation of Promise except
                 * it has a .next() method instead of .then() and .next() and .catch() callbacks
                 * are executed synchronously when a PersistencePromise resolves rather than
                 * asynchronously (Promise implementations use setImmediate() or similar).
                 *
                 * This is necessary to interoperate with IndexedDB which will automatically
                 * commit transactions if control is returned to the event loop without
                 * synchronously initiating another operation on the transaction.
                 *
                 * NOTE: .then() and .catch() only allow a single consumer, unlike normal
                 * Promises.
                 */ class js {
                constructor(t){
                    // NOTE: next/catchCallback will always point to our own wrapper functions,
                    // not the user's raw next() or catch() callbacks.
                    this.nextCallback = null, this.catchCallback = null, // When the operation resolves, we'll set result or error and mark isDone.
                    this.result = void 0, this.error = void 0, this.isDone = !1, // Set to true when .then() or .catch() are called and prevents additional
                    // chaining.
                    this.callbackAttached = !1, t((t)=>{
                        this.isDone = !0, this.result = t, this.nextCallback && // value should be defined unless T is Void, but we can't express
                        // that in the type system.
                        this.nextCallback(t);
                    }, (t)=>{
                        this.isDone = !0, this.error = t, this.catchCallback && this.catchCallback(t);
                    });
                }
                catch(t) {
                    return this.next(void 0, t);
                }
                next(t, e) {
                    return this.callbackAttached && L(), this.callbackAttached = !0, this.isDone ? this.error ? this.wrapFailure(e, this.error) : this.wrapSuccess(t, this.result) : new js((n, s)=>{
                        this.nextCallback = (e)=>{
                            this.wrapSuccess(t, e).next(n, s);
                        }, this.catchCallback = (t)=>{
                            this.wrapFailure(e, t).next(n, s);
                        };
                    });
                }
                toPromise() {
                    return new Promise((t, e)=>{
                        this.next(t, e);
                    });
                }
                wrapUserFunction(t) {
                    try {
                        const e = t();
                        return e instanceof js ? e : js.resolve(e);
                    } catch (t) {
                        return js.reject(t);
                    }
                }
                wrapSuccess(t, e) {
                    return t ? this.wrapUserFunction(()=>t(e)) : js.resolve(e);
                }
                wrapFailure(t, e) {
                    return t ? this.wrapUserFunction(()=>t(e)) : js.reject(e);
                }
                static resolve(t) {
                    return new js((e, n)=>{
                        e(t);
                    });
                }
                static reject(t) {
                    return new js((e, n)=>{
                        n(t);
                    });
                }
                static waitFor(// Accept all Promise types in waitFor().
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                t) {
                    return new js((e, n)=>{
                        let s = 0, i = 0, r = !1;
                        t.forEach((t)=>{
                            ++s, t.next(()=>{
                                ++i, r && i === s && e();
                            }, (t)=>n(t));
                        }), r = !0, i === s && e();
                    });
                }
                /**
                     * Given an array of predicate functions that asynchronously evaluate to a
                     * boolean, implements a short-circuiting `or` between the results. Predicates
                     * will be evaluated until one of them returns `true`, then stop. The final
                     * result will be whether any of them returned `true`.
                     */ static or(t) {
                    let e = js.resolve(!1);
                    for (const n of t)e = e.next((t)=>t ? js.resolve(t) : n());
                    return e;
                }
                static forEach(t, e) {
                    const n = [];
                    return t.forEach((t, s)=>{
                        n.push(e.call(this, t, s));
                    }), this.waitFor(n);
                }
            }
            /** Verifies whether `e` is an IndexedDbTransactionError. */ function Hs(t) {
                // Use name equality, as instanceof checks on errors don't work with errors
                // that wrap other errors.
                return "IndexedDbTransactionError" === t.name;
            }
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * A batch of mutations that will be sent as one unit to the backend.
                 */ class ni {
                /**
                     * @param batchId - The unique ID of this mutation batch.
                     * @param localWriteTime - The original write time of this mutation.
                     * @param baseMutations - Mutations that are used to populate the base
                     * values when this mutation is applied locally. This can be used to locally
                     * overwrite values that are persisted in the remote document cache. Base
                     * mutations are never sent to the backend.
                     * @param mutations - The user-provided mutations in this mutation batch.
                     * User-provided mutations are applied both locally and remotely on the
                     * backend.
                     */ constructor(t, e, n, s){
                    this.batchId = t, this.localWriteTime = e, this.baseMutations = n, this.mutations = s;
                }
                /**
                     * Applies all the mutations in this MutationBatch to the specified document
                     * to compute the state of the remote document
                     *
                     * @param document - The document to apply mutations to.
                     * @param batchResult - The result of applying the MutationBatch to the
                     * backend.
                     */ applyToRemoteDocument(t, e) {
                    const n = e.mutationResults;
                    for(let e = 0; e < this.mutations.length; e++){
                        const s = this.mutations[e];
                        if (s.key.isEqual(t.key)) {
                            var n1;
                            n1 = n[e], s instanceof en ? function(t, e, n) {
                                // Unlike setMutationApplyToLocalView, if we're applying a mutation to a
                                // remote document the server has accepted the mutation so the precondition
                                // must have held.
                                const s = t.value.clone(), i = rn(t.fieldTransforms, e, n.transformResults);
                                s.setAll(i), e.convertToFoundDocument(n.version, s).setHasCommittedMutations();
                            }(s, t, n1) : s instanceof nn ? function(t, e, n) {
                                if (!ze(t.precondition, e)) // Since the mutation was not rejected, we know that the precondition
                                // matched on the backend. We therefore must not have the expected version
                                // of the document in our cache and convert to an UnknownDocument with a
                                // known updateTime.
                                return void e.convertToUnknownDocument(n.version);
                                const s = rn(t.fieldTransforms, e, n.transformResults), i = e.data;
                                i.setAll(sn(t)), i.setAll(s), e.convertToFoundDocument(n.version, i).setHasCommittedMutations();
                            }(s, t, n1) : function(t, e, n) {
                                // Unlike applyToLocalView, if we're applying a mutation to a remote
                                // document the server has accepted the mutation so the precondition must
                                // have held.
                                e.convertToNoDocument(n.version).setHasCommittedMutations();
                            }(0, t, n1);
                        }
                    }
                }
                /**
                     * Computes the local view of a document given all the mutations in this
                     * batch.
                     *
                     * @param document - The document to apply mutations to.
                     */ applyToLocalView(t) {
                    // First, apply the base state. This allows us to apply non-idempotent
                    // transform against a consistent set of values.
                    for (const e of this.baseMutations)e.key.isEqual(t.key) && Ye(e, t, this.localWriteTime);
                    // Second, apply all user-provided mutations.
                    for (const e of this.mutations)e.key.isEqual(t.key) && Ye(e, t, this.localWriteTime);
                }
                /**
                     * Computes the local view for all provided documents given the mutations in
                     * this batch.
                     */ applyToLocalDocumentSet(t) {
                    // TODO(mrschmidt): This implementation is O(n^2). If we apply the mutations
                    // directly (as done in `applyToLocalView()`), we can reduce the complexity
                    // to O(n).
                    this.mutations.forEach((e)=>{
                        const n = t.get(e.key);
                        // TODO(mutabledocuments): This method should take a MutableDocumentMap
                        // and we should remove this cast.
                        this.applyToLocalView(n), n.isValidDocument() || n.convertToNoDocument(rt.min());
                    });
                }
                keys() {
                    return this.mutations.reduce((t, e)=>t.add(e.key), Pn());
                }
                isEqual(t) {
                    return this.batchId === t.batchId && nt(this.mutations, t.mutations, (t, e)=>Ze(t, e)) && nt(this.baseMutations, t.baseMutations, (t, e)=>Ze(t, e));
                }
            }
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * An immutable set of metadata that the local store tracks for each target.
                 */ class ii {
                constructor(/** The target being listened to. */ t, /**
                         * The target ID to which the target corresponds; Assigned by the
                         * LocalStore for user listens and by the SyncEngine for limbo watches.
                         */ e, /** The purpose of the target. */ n, /**
                         * The sequence number of the last transaction during which this target data
                         * was modified.
                         */ s, /** The latest snapshot version seen for this target. */ i = rt.min(), /**
                         * The maximum snapshot version at which the associated view
                         * contained no limbo documents.
                         */ r = rt.min(), /**
                         * An opaque, server-assigned token that allows watching a target to be
                         * resumed after disconnecting without retransmitting all the data that
                         * matches the target. The resume token essentially identifies a point in
                         * time from which the server should resume sending results.
                         */ o = _t.EMPTY_BYTE_STRING){
                    this.target = t, this.targetId = e, this.purpose = n, this.sequenceNumber = s, this.snapshotVersion = i, this.lastLimboFreeSnapshotVersion = r, this.resumeToken = o;
                }
                /** Creates a new target data instance with an updated sequence number. */ withSequenceNumber(t) {
                    return new ii(this.target, this.targetId, this.purpose, t, this.snapshotVersion, this.lastLimboFreeSnapshotVersion, this.resumeToken);
                }
                /**
                     * Creates a new target data instance with an updated resume token and
                     * snapshot version.
                     */ withResumeToken(t, e) {
                    return new ii(this.target, this.targetId, this.purpose, this.sequenceNumber, e, this.lastLimboFreeSnapshotVersion, t);
                }
                /**
                     * Creates a new target data instance with an updated last limbo free
                     * snapshot version number.
                     */ withLastLimboFreeSnapshotVersion(t) {
                    return new ii(this.target, this.targetId, this.purpose, this.sequenceNumber, this.snapshotVersion, t, this.resumeToken);
                }
            }
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /** Serializer for values stored in the LocalStore. */ class ri {
                constructor(t){
                    this.Wt = t;
                }
            }
            /**
                 * @license
                 * Copyright 2019 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * An in-memory implementation of IndexManager.
                 */ class pi {
                constructor(){
                    this.Gt = new Ti();
                }
                addToCollectionParentIndex(t, e) {
                    return this.Gt.add(e), js.resolve();
                }
                getCollectionParents(t, e) {
                    return js.resolve(this.Gt.getEntries(e));
                }
            }
            /**
                 * Internal implementation of the collection-parent index exposed by MemoryIndexManager.
                 * Also used for in-memory caching by IndexedDbIndexManager and initial index population
                 * in indexeddb_schema.ts
                 */ class Ti {
                constructor(){
                    this.index = {};
                }
                // Returns false if the entry already existed.
                add(t) {
                    const e = t.lastSegment(), n = t.popLast(), s = this.index[e] || new gn(ht.comparator), i = !s.has(n);
                    return this.index[e] = s.add(n), i;
                }
                has(t) {
                    const e = t.lastSegment(), n = t.popLast(), s = this.index[e];
                    return s && s.has(n);
                }
                getEntries(t) {
                    return (this.index[t] || new gn(ht.comparator)).toArray();
                }
            }
            class Ri {
                constructor(// When we attempt to collect, we will only do so if the cache size is greater than this
                // threshold. Passing `COLLECTION_DISABLED` here will cause collection to always be skipped.
                t, // The percentage of sequence numbers that we will attempt to collect
                e, // A cap on the total number of sequence numbers that will be collected. This prevents
                // us from collecting a huge number of sequence numbers if the cache has grown very large.
                n){
                    this.cacheSizeCollectionThreshold = t, this.percentileToCollect = e, this.maximumSequenceNumbersToCollect = n;
                }
                static withCacheSize(t) {
                    return new Ri(t, Ri.DEFAULT_COLLECTION_PERCENTILE, Ri.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT);
                }
            }
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /** A mutation queue for a specific user, backed by IndexedDB. */ Ri.DEFAULT_COLLECTION_PERCENTILE = 10, Ri.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT = 1e3, Ri.DEFAULT = new Ri(41943040, Ri.DEFAULT_COLLECTION_PERCENTILE, Ri.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT), Ri.DISABLED = new Ri(-1, 0, 0);
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /** Offset to ensure non-overlapping target ids. */ /**
                 * Generates monotonically increasing target IDs for sending targets to the
                 * watch stream.
                 *
                 * The client constructs two generators, one for the target cache, and one for
                 * for the sync engine (to generate limbo documents targets). These
                 * generators produce non-overlapping IDs (by using even and odd IDs
                 * respectively).
                 *
                 * By separating the target ID space, the query cache can generate target IDs
                 * that persist across client restarts, while sync engine can independently
                 * generate in-memory target IDs that are transient and can be reused after a
                 * restart.
                 */ class Ni {
                constructor(t){
                    this.ne = t;
                }
                next() {
                    return this.ne += 2, this.ne;
                }
                static se() {
                    // The target cache generator must return '2' in its first call to `next()`
                    // as there is no differentiation in the protocol layer between an unset
                    // number and the number '0'. If we were to sent a target with target ID
                    // '0', the backend would consider it unset and replace it with its own ID.
                    return new Ni(0);
                }
                static ie() {
                    // Sync engine assigns target IDs for limbo document detection.
                    return new Ni(-1);
                }
            }
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * Verifies the error thrown by a LocalStore operation. If a LocalStore
                 * operation fails because the primary lease has been taken by another client,
                 * we ignore the error (the persistence layer will immediately call
                 * `applyPrimaryLease` to propagate the primary state change). All other errors
                 * are re-thrown.
                 *
                 * @param err - An error returned by a LocalStore operation.
                 * @returns A Promise that resolves after we recovered, or the original error.
                 */ async function Fi(t) {
                if (t.code !== K.FAILED_PRECONDITION || "The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab." !== t.message) throw t;
                $("LocalStore", "Unexpectedly lost primary lease");
            }
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * A map implementation that uses objects as keys. Objects must have an
                 * associated equals function and must be immutable. Entries in the map are
                 * stored together with the key being produced from the mapKeyFn. This map
                 * automatically handles collisions of keys.
                 */ class ji {
                constructor(t, e){
                    this.mapKeyFn = t, this.equalsFn = e, /**
                             * The inner map for a key/value pair. Due to the possibility of collisions we
                             * keep a list of entries that we do a linear search through to find an actual
                             * match. Note that collisions should be rare, so we still expect near
                             * constant time lookups in practice.
                             */ this.inner = {};
                }
                /** Get a value for this key, or undefined if it does not exist. */ get(t) {
                    const e = this.mapKeyFn(t), n = this.inner[e];
                    if (void 0 !== n) {
                        for (const [e, s] of n)if (this.equalsFn(e, t)) return s;
                    }
                }
                has(t) {
                    return void 0 !== this.get(t);
                }
                /** Put this key and value in the map. */ set(t, e) {
                    const n = this.mapKeyFn(t), s = this.inner[n];
                    if (void 0 !== s) {
                        for(let n = 0; n < s.length; n++)if (this.equalsFn(s[n][0], t)) return void (s[n] = [
                            t,
                            e
                        ]);
                        s.push([
                            t,
                            e
                        ]);
                    } else this.inner[n] = [
                        [
                            t,
                            e
                        ]
                    ];
                }
                /**
                     * Remove this key from the map. Returns a boolean if anything was deleted.
                     */ delete(t) {
                    const e = this.mapKeyFn(t), n = this.inner[e];
                    if (void 0 === n) return !1;
                    for(let s = 0; s < n.length; s++)if (this.equalsFn(n[s][0], t)) return 1 === n.length ? delete this.inner[e] : n.splice(s, 1), !0;
                    return !1;
                }
                forEach(t) {
                    ct(this.inner, (e, n)=>{
                        for (const [e, s] of n)t(e, s);
                    });
                }
                isEmpty() {
                    return function(t) {
                        for(const e in t)if (Object.prototype.hasOwnProperty.call(t, e)) return !1;
                        return !0;
                    }(this.inner);
                }
            }
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * An in-memory buffer of entries to be written to a RemoteDocumentCache.
                 * It can be used to batch up a set of changes to be written to the cache, but
                 * additionally supports reading entries back with the `getEntry()` method,
                 * falling back to the underlying RemoteDocumentCache if no entry is
                 * buffered.
                 *
                 * Entries added to the cache *must* be read first. This is to facilitate
                 * calculating the size delta of the pending changes.
                 *
                 * PORTING NOTE: This class was implemented then removed from other platforms.
                 * If byte-counting ends up being needed on the other platforms, consider
                 * porting this class as part of that implementation work.
                 */ class Qi {
                constructor(){
                    // A mapping of document key to the new cache entry that should be written (or null if any
                    // existing cache entry should be removed).
                    this.changes = new ji((t)=>t.toString(), (t, e)=>t.isEqual(e)), this.changesApplied = !1;
                }
                getReadTime(t) {
                    const e = this.changes.get(t);
                    return e ? e.readTime : rt.min();
                }
                /**
                     * Buffers a `RemoteDocumentCache.addEntry()` call.
                     *
                     * You can only modify documents that have already been retrieved via
                     * `getEntry()/getEntries()` (enforced via IndexedDbs `apply()`).
                     */ addEntry(t, e) {
                    this.assertNotApplied(), this.changes.set(t.key, {
                        document: t,
                        readTime: e
                    });
                }
                /**
                     * Buffers a `RemoteDocumentCache.removeEntry()` call.
                     *
                     * You can only remove documents that have already been retrieved via
                     * `getEntry()/getEntries()` (enforced via IndexedDbs `apply()`).
                     */ removeEntry(t, e = null) {
                    this.assertNotApplied(), this.changes.set(t, {
                        document: Kt.newInvalidDocument(t),
                        readTime: e
                    });
                }
                /**
                     * Looks up an entry in the cache. The buffered changes will first be checked,
                     * and if no buffered change applies, this will forward to
                     * `RemoteDocumentCache.getEntry()`.
                     *
                     * @param transaction - The transaction in which to perform any persistence
                     *     operations.
                     * @param documentKey - The key of the entry to look up.
                     * @returns The cached document or an invalid document if we have nothing
                     * cached.
                     */ getEntry(t, e) {
                    this.assertNotApplied();
                    const n = this.changes.get(e);
                    return void 0 !== n ? js.resolve(n.document) : this.getFromCache(t, e);
                }
                /**
                     * Looks up several entries in the cache, forwarding to
                     * `RemoteDocumentCache.getEntry()`.
                     *
                     * @param transaction - The transaction in which to perform any persistence
                     *     operations.
                     * @param documentKeys - The keys of the entries to look up.
                     * @returns A map of cached documents, indexed by key. If an entry cannot be
                     *     found, the corresponding key will be mapped to an invalid document.
                     */ getEntries(t, e) {
                    return this.getAllFromCache(t, e);
                }
                /**
                     * Applies buffered changes to the underlying RemoteDocumentCache, using
                     * the provided transaction.
                     */ apply(t) {
                    return this.assertNotApplied(), this.changesApplied = !0, this.applyChanges(t);
                }
                /** Helper to assert this.changes is not null  */ assertNotApplied() {}
            }
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * A readonly view of the local state of all documents we're tracking (i.e. we
                 * have a cached version in remoteDocumentCache or local mutations for the
                 * document). The view is computed by applying the mutations in the
                 * MutationQueue to the RemoteDocumentCache.
                 */ class rr {
                constructor(t, e, n){
                    this.He = t, this.In = e, this.Ht = n;
                }
                /**
                     * Get the local view of the document identified by `key`.
                     *
                     * @returns Local view of the document or null if we don't have any cached
                     * state for it.
                     */ An(t, e) {
                    return this.In.getAllMutationBatchesAffectingDocumentKey(t, e).next((n)=>this.Rn(t, e, n));
                }
                /** Internal version of `getDocument` that allows reusing batches. */ Rn(t, e, n) {
                    return this.He.getEntry(t, e).next((t)=>{
                        for (const e of n)e.applyToLocalView(t);
                        return t;
                    });
                }
                // Returns the view of the given `docs` as they would appear after applying
                // all mutations in the given `batches`.
                bn(t, e) {
                    t.forEach((t, n)=>{
                        for (const t of e)t.applyToLocalView(n);
                    });
                }
                /**
                     * Gets the local view of the documents identified by `keys`.
                     *
                     * If we don't have cached state for a document in `keys`, a NoDocument will
                     * be stored for that key in the resulting set.
                     */ Pn(t, e) {
                    return this.He.getEntries(t, e).next((e)=>this.vn(t, e).next(()=>e));
                }
                /**
                     * Applies the local view the given `baseDocs` without retrieving documents
                     * from the local store.
                     */ vn(t, e) {
                    return this.In.getAllMutationBatchesAffectingDocumentKeys(t, e).next((t)=>this.bn(e, t));
                }
                /**
                     * Performs a query against the local view of all documents.
                     *
                     * @param transaction - The persistence transaction.
                     * @param query - The query to match documents against.
                     * @param sinceReadTime - If not set to SnapshotVersion.min(), return only
                     *     documents that have been read since this snapshot version (exclusive).
                     */ getDocumentsMatchingQuery(t, e, n) {
                    /**
                         * Returns whether the query matches a single document by path (rather than a
                         * collection).
                         */ return Pt.isDocumentKey(e.path) && null === e.collectionGroup && 0 === e.filters.length ? this.Vn(t, e.path) : null !== e.collectionGroup ? this.Sn(t, e, n) : this.Dn(t, e, n);
                }
                Vn(t, e) {
                    // Just do a simple document lookup.
                    return this.An(t, new Pt(e)).next((t)=>{
                        let e = En;
                        return t.isFoundDocument() && (e = e.insert(t.key, t)), e;
                    });
                }
                Sn(t, e, n) {
                    const s = e.collectionGroup;
                    let i = En;
                    return this.Ht.getCollectionParents(t, s).next((r)=>js.forEach(r, (r)=>{
                            const o = new fe(r.child(s), /*collectionGroup=*/ null, /**
                                         * Returns true if this query does not specify any query constraints that
                                         * could remove results.
                                         */ e.explicitOrderBy.slice(), e.filters.slice(), e.limit, e.limitType, e.startAt, e.endAt);
                            return this.Dn(t, o, n).next((t)=>{
                                t.forEach((t, e)=>{
                                    i = i.insert(t, e);
                                });
                            });
                        }).next(()=>i));
                }
                Dn(t, e, n) {
                    // Query the remote documents and overlay mutations.
                    let s, i;
                    return this.He.getDocumentsMatchingQuery(t, e, n).next((n)=>(s = n, this.In.getAllMutationBatchesAffectingQuery(t, e))).next((e)=>(i = e, this.Cn(t, i, s).next((t)=>{
                            for (const t1 of (s = t, i))for (const e of t1.mutations){
                                const n = e.key;
                                let i = s.get(n);
                                null == i && // Create invalid document to apply mutations on top of
                                (i = Kt.newInvalidDocument(n), s = s.insert(n, i)), Ye(e, i, t1.localWriteTime), i.isFoundDocument() || (s = s.remove(n));
                            }
                        }))).next(()=>// Finally, filter out any documents that don't actually match
                        // the query.
                        (s.forEach((t, n)=>{
                            Pe(e, n) || (s = s.remove(t));
                        }), s));
                }
                Cn(t, e, n) {
                    let s = Pn();
                    for (const t of e)for (const e of t.mutations)e instanceof nn && null === n.get(e.key) && (s = s.add(e.key));
                    let i = n;
                    return this.He.getEntries(t, s).next((t)=>(t.forEach((t, e)=>{
                            e.isFoundDocument() && (i = i.insert(t, e));
                        }), i));
                }
            }
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * A set of changes to what documents are currently in view and out of view for
                 * a given query. These changes are sent to the LocalStore by the View (via
                 * the SyncEngine) and are used to pin / unpin documents as appropriate.
                 */ class or {
                constructor(t, e, n, s){
                    this.targetId = t, this.fromCache = e, this.Nn = n, this.xn = s;
                }
                static kn(t, e) {
                    let n = Pn(), s = Pn();
                    for (const t of e.docChanges)switch(t.type){
                        case 0 /* Added */ :
                            n = n.add(t.doc.key);
                            break;
                        case 1 /* Removed */ :
                            s = s.add(t.doc.key);
                    }
                    return new or(t, e.fromCache, n, s);
                }
            }
            /**
                 * @license
                 * Copyright 2019 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * A query engine that takes advantage of the target document mapping in the
                 * QueryCache. Query execution is optimized by only reading the documents that
                 * previously matched a query plus any documents that were edited after the
                 * query was last listened to.
                 *
                 * There are some cases when this optimization is not guaranteed to produce
                 * the same results as full collection scans. In these cases, query
                 * processing falls back to full scans. These cases are:
                 *
                 * - Limit queries where a document that matched the query previously no longer
                 *   matches the query.
                 *
                 * - Limit queries where a document edit may cause the document to sort below
                 *   another document that is in the local cache.
                 *
                 * - Queries that have never been CURRENT or free of limbo documents.
                 */ class cr {
                /** Sets the document view to query against. */ $n(t) {
                    this.On = t;
                }
                /** Returns all local documents matching the specified query. */ getDocumentsMatchingQuery(t, e, n, s) {
                    // Queries that match all documents don't benefit from using
                    // key-based lookups. It is more efficient to scan all documents in a
                    // collection, rather than to perform individual lookups.
                    return 0 === e.filters.length && null === e.limit && null == e.startAt && null == e.endAt && (0 === e.explicitOrderBy.length || 1 === e.explicitOrderBy.length && e.explicitOrderBy[0].field.isKeyField()) || n.isEqual(rt.min()) ? this.Fn(t, e) : this.On.Pn(t, s).next((i)=>{
                        const r = this.Mn(e, i);
                        return (_e(e) || me(e)) && this.Ln(e.limitType, r, s, n) ? this.Fn(t, e) : (x() <= _firebase_logger__WEBPACK_IMPORTED_MODULE_2__ /* .LogLevel.DEBUG */ .in.DEBUG && $("QueryEngine", "Re-using previous result from %s to execute query: %s", n.toString(), be(e)), this.On.getDocumentsMatchingQuery(t, e, n).next((t)=>// We merge `previousResults` into `updateResults`, since
                            // `updateResults` is already a DocumentMap. If a document is
                            // contained in both lists, then its contents are the same.
                            (r.forEach((e)=>{
                                t = t.insert(e.key, e);
                            }), t)));
                    });
                // Queries that have never seen a snapshot without limbo free documents
                // should also be run as a full collection scan.
                }
                /** Applies the query filter and sorting to the provided documents.  */ Mn(t, e) {
                    // Sort the documents and re-apply the query filter since previously
                    // matching documents do not necessarily still match the query.
                    let n = new gn(ve(t));
                    return e.forEach((e, s)=>{
                        Pe(t, s) && (n = n.add(s));
                    }), n;
                }
                /**
                     * Determines if a limit query needs to be refilled from cache, making it
                     * ineligible for index-free execution.
                     *
                     * @param sortedPreviousResults - The documents that matched the query when it
                     * was last synchronized, sorted by the query's comparator.
                     * @param remoteKeys - The document keys that matched the query at the last
                     * snapshot.
                     * @param limboFreeSnapshotVersion - The version of the snapshot when the
                     * query was last synchronized.
                     */ Ln(t, e, n, s) {
                    // The query needs to be refilled if a previously matching document no
                    // longer matches.
                    if (n.size !== e.size) return !0;
                    // Limit queries are not eligible for index-free query execution if there is
                    // a potential that an older document from cache now sorts before a document
                    // that was previously part of the limit. This, however, can only happen if
                    // the document at the edge of the limit goes out of limit.
                    // If a document that is not the limit boundary sorts differently,
                    // the boundary of the limit itself did not change and documents from cache
                    // will continue to be "rejected" by this boundary. Therefore, we can ignore
                    // any modifications that don't affect the last document.
                    const i = "F" /* First */  === t ? e.last() : e.first();
                    return !!i && (i.hasPendingWrites || i.version.compareTo(s) > 0);
                }
                Fn(t, e) {
                    return x() <= _firebase_logger__WEBPACK_IMPORTED_MODULE_2__ /* .LogLevel.DEBUG */ .in.DEBUG && $("QueryEngine", "Using full collection scan to execute query:", be(e)), this.On.getDocumentsMatchingQuery(t, e, rt.min());
                }
            }
            /**
                 * @license
                 * Copyright 2020 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * Implements `LocalStore` interface.
                 *
                 * Note: some field defined in this class might have public access level, but
                 * the class is not exported so they are only accessible from this module.
                 * This is useful to implement optional features (like bundles) in free
                 * functions, such that they are tree-shakeable.
                 */ class ar {
                constructor(/** Manages our in-memory or durable persistence. */ t, e, n, s){
                    this.persistence = t, this.Bn = e, this.N = s, /**
                             * Maps a targetID to data about its target.
                             *
                             * PORTING NOTE: We are using an immutable data structure on Web to make re-runs
                             * of `applyRemoteEvent()` idempotent.
                             */ this.Un = new wn(et), /** Maps a target to its targetID. */ // TODO(wuandy): Evaluate if TargetId can be part of Target.
                    this.qn = new ji((t)=>Wt(t), zt), /**
                             * The read time of the last entry processed by `getNewDocumentChanges()`.
                             *
                             * PORTING NOTE: This is only used for multi-tab synchronization.
                             */ this.Kn = rt.min(), this.In = t.getMutationQueue(n), this.jn = t.getRemoteDocumentCache(), this.ze = t.getTargetCache(), this.Qn = new rr(this.jn, this.In, this.persistence.getIndexManager()), this.Je = t.getBundleCache(), this.Bn.$n(this.Qn);
                }
                collectGarbage(t) {
                    return this.persistence.runTransaction("Collect garbage", "readwrite-primary", (e)=>t.collect(e, this.Un));
                }
            }
            /**
                 * Tells the LocalStore that the currently authenticated user has changed.
                 *
                 * In response the local store switches the mutation queue to the new user and
                 * returns any resulting document changes.
                 */ // PORTING NOTE: Android and iOS only return the documents affected by the
            // change.
            async function hr(t, e) {
                let s = t.In, i = t.Qn;
                const r = await t.persistence.runTransaction("Handle user change", "readonly", (t1)=>{
                    // Swap out the mutation queue, grabbing the pending mutation batches
                    // before and after.
                    let r;
                    return t.In.getAllMutationBatches(t1).next((o)=>(r = o, s = t.persistence.getMutationQueue(e), // Recreate our LocalDocumentsView using the new
                        // MutationQueue.
                        i = new rr(t.jn, s, t.persistence.getIndexManager()), s.getAllMutationBatches(t1))).next((e)=>{
                        const n = [], s = [];
                        // Union the old/new changed keys.
                        let o = Pn();
                        for (const t of r)for (const e of (n.push(t.batchId), t.mutations))o = o.add(e.key);
                        for (const t of e)for (const e of (s.push(t.batchId), t.mutations))o = o.add(e.key);
                        // Return the set of all (potentially) changed documents and the list
                        // of mutation batch IDs that were affected by change.
                        return i.Pn(t1, o).next((t)=>({
                                Wn: t,
                                removedBatchIds: n,
                                addedBatchIds: s
                            }));
                    });
                });
                return t.In = s, t.Qn = i, t.Bn.$n(t.Qn), r;
            }
            /**
                 * Removes mutations from the MutationQueue for the specified batch;
                 * LocalDocuments will be recalculated.
                 *
                 * @returns The resulting modified documents.
                 */ /**
                 * Returns the last consistent snapshot processed (used by the RemoteStore to
                 * determine whether to buffer incoming snapshots from the backend).
                 */ function fr(t) {
                return t.persistence.runTransaction("Get last remote snapshot version", "readonly", (t1)=>t.ze.getLastRemoteSnapshotVersion(t1));
            }
            /**
                 * Returns the TargetData as seen by the LocalStore, including updates that may
                 * have not yet been persisted to the TargetCache.
                 */ // Visible for testing.
            /**
                 * Unpins all the documents associated with the given target. If
                 * `keepPersistedTargetData` is set to false and Eager GC enabled, the method
                 * directly removes the associated target data from the target cache.
                 *
                 * Releasing a non-existing `Target` is a no-op.
                 */ // PORTING NOTE: `keepPersistedTargetData` is multi-tab only.
            async function gr(t, e, n) {
                const i = t.Un.get(e);
                try {
                    n || await t.persistence.runTransaction("Release target", n ? "readwrite" : "readwrite-primary", (t1)=>t.persistence.referenceDelegate.removeTarget(t1, i));
                } catch (t) {
                    if (!Hs(t)) throw t;
                    // All `releaseTarget` does is record the final metadata state for the
                    // target, but we've been recording this periodically during target
                    // activity. If we lose this write this could cause a very slight
                    // difference in the order of target deletion during GC, but we
                    // don't define exact LRU semantics so this is acceptable.
                    $("LocalStore", `Failed to update sequence numbers for target ${e}: ${t}`);
                }
                t.Un = t.Un.remove(e), t.qn.delete(i.target);
            }
            /**
                 * Runs the specified query against the local store and returns the results,
                 * potentially taking advantage of query data from previous executions (such
                 * as the set of remote keys).
                 *
                 * @param usePreviousResults - Whether results from previous executions can
                 * be used to optimize this query execution.
                 */ function yr(t, e, n) {
                let i = rt.min(), r = Pn();
                return t.persistence.runTransaction("Execute query", "readonly", (t1)=>(function(t, e, n) {
                        const i = t.qn.get(n);
                        return void 0 !== i ? js.resolve(t.Un.get(i)) : t.ze.getTargetData(e, n);
                    })(t, t1, Ee(e)).next((e)=>{
                        if (e) return i = e.lastLimboFreeSnapshotVersion, t.ze.getMatchingKeysForTargetId(t1, e.targetId).next((t)=>{
                            r = t;
                        });
                    }).next(()=>t.Bn.getDocumentsMatchingQuery(t1, e, n ? i : rt.min(), n ? r : Pn())).next((t)=>({
                            documents: t,
                            Gn: r
                        })));
            }
            /**
                 * @license
                 * Copyright 2020 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ class Rr {
                constructor(t){
                    this.N = t, this.Yn = new Map(), this.Xn = new Map();
                }
                getBundleMetadata(t, e) {
                    return js.resolve(this.Yn.get(e));
                }
                saveBundleMetadata(t, e) {
                    return this.Yn.set(e.id, {
                        id: e.id,
                        version: e.version,
                        createTime: jn(e.createTime)
                    }), js.resolve();
                }
                getNamedQuery(t, e) {
                    return js.resolve(this.Xn.get(e));
                }
                saveNamedQuery(t, e) {
                    return this.Xn.set(e.name, {
                        name: e.name,
                        query: /**
                 * A helper function for figuring out what kind of query has been stored.
                 */ /**
                 * Encodes a `BundledQuery` from bundle proto to a Query object.
                 *
                 * This reconstructs the original query used to build the bundle being loaded,
                 * including features exists only in SDKs (for example: limit-to-last).
                 */ function(t) {
                            var e;
                            const e1 = function(t) {
                                var t1;
                                let e, e1 = function(t) {
                                    const e = Wn(t);
                                    // In v1beta1 queries for collections at the root did not have a trailing
                                    // "/documents". In v1 all resource paths contain "/documents". Preserve the
                                    // ability to read the v1beta1 form for compatibility with queries persisted
                                    // in the local target cache.
                                    return 4 === e.length ? ht.emptyPath() : Xn(e);
                                }(t.parent);
                                const n = t.structuredQuery, s = n.from ? n.from.length : 0;
                                let i = null;
                                if (s > 0) {
                                    1 === s || L();
                                    const t = n.from[0];
                                    t.allDescendants ? i = t.collectionId : e1 = e1.child(t.collectionId);
                                }
                                let r = [];
                                n.where && (r = function hs(t) {
                                    return t ? void 0 !== t.unaryFilter ? [
                                        function(t) {
                                            switch(t.unaryFilter.op){
                                                case "IS_NAN":
                                                    const e = ms(t.unaryFilter.field);
                                                    return Jt.create(e, "==" /* EQUAL */ , {
                                                        doubleValue: NaN
                                                    });
                                                case "IS_NULL":
                                                    const n = ms(t.unaryFilter.field);
                                                    return Jt.create(n, "==" /* EQUAL */ , {
                                                        nullValue: "NULL_VALUE"
                                                    });
                                                case "IS_NOT_NAN":
                                                    const s = ms(t.unaryFilter.field);
                                                    return Jt.create(s, "!=" /* NOT_EQUAL */ , {
                                                        doubleValue: NaN
                                                    });
                                                case "IS_NOT_NULL":
                                                    const i = ms(t.unaryFilter.field);
                                                    return Jt.create(i, "!=" /* NOT_EQUAL */ , {
                                                        nullValue: "NULL_VALUE"
                                                    });
                                                default:
                                                    return L();
                                            }
                                        }(t)
                                    ] : void 0 !== t.fieldFilter ? [
                                        Jt.create(ms(t.fieldFilter.field), function(t) {
                                            switch(t){
                                                case "EQUAL":
                                                    return "==" /* EQUAL */ ;
                                                case "NOT_EQUAL":
                                                    return "!=" /* NOT_EQUAL */ ;
                                                case "GREATER_THAN":
                                                    return ">" /* GREATER_THAN */ ;
                                                case "GREATER_THAN_OR_EQUAL":
                                                    return ">=" /* GREATER_THAN_OR_EQUAL */ ;
                                                case "LESS_THAN":
                                                    return "<" /* LESS_THAN */ ;
                                                case "LESS_THAN_OR_EQUAL":
                                                    return "<=" /* LESS_THAN_OR_EQUAL */ ;
                                                case "ARRAY_CONTAINS":
                                                    return "array-contains" /* ARRAY_CONTAINS */ ;
                                                case "IN":
                                                    return "in" /* IN */ ;
                                                case "NOT_IN":
                                                    return "not-in" /* NOT_IN */ ;
                                                case "ARRAY_CONTAINS_ANY":
                                                    return "array-contains-any" /* ARRAY_CONTAINS_ANY */ ;
                                                default:
                                                    return L();
                                            }
                                        }(t.fieldFilter.op), t.fieldFilter.value)
                                    ] : void 0 !== t.compositeFilter ? t.compositeFilter.filters.map((t)=>hs(t)).reduce((t, e)=>t.concat(e)) : L() : [];
                                }(n.where));
                                let o = [];
                                n.orderBy && (o = n.orderBy.map((t)=>new ae(ms(t.field), // visible for testing
                                    function(t) {
                                        switch(t){
                                            case "ASCENDING":
                                                return "asc" /* ASCENDING */ ;
                                            case "DESCENDING":
                                                return "desc" /* DESCENDING */ ;
                                            default:
                                                return;
                                        }
                                    }(// visible for testing
                                    t.direction))));
                                let c = null;
                                n.limit && (c = At(e = "object" == typeof (t1 = n.limit) ? t1.value : t1) ? null : e);
                                let a = null;
                                n.startAt && (a = fs(n.startAt));
                                let u = null;
                                return n.endAt && (u = fs(n.endAt)), new fe(e1, i, o, r, c, "F" /* First */ , a, u);
                            }({
                                parent: t.parent,
                                structuredQuery: t.structuredQuery
                            });
                            return "LAST" === t.limitType ? (e = e1.limit, new fe(e1.path, e1.collectionGroup, e1.explicitOrderBy.slice(), e1.filters.slice(), e, "L" /* Last */ , e1.startAt, e1.endAt)) : e1;
                        }(e.bundledQuery),
                        readTime: jn(e.readTime)
                    }), js.resolve();
                }
            }
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * A collection of references to a document from some kind of numbered entity
                 * (either a target ID or batch ID). As references are added to or removed from
                 * the set corresponding events are emitted to a registered garbage collector.
                 *
                 * Each reference is represented by a DocumentReference object. Each of them
                 * contains enough information to uniquely identify the reference. They are all
                 * stored primarily in a set sorted by key. A document is considered garbage if
                 * there's no references in that set (this can be efficiently checked thanks to
                 * sorting by key).
                 *
                 * ReferenceSet also keeps a secondary set that contains references sorted by
                 * IDs. This one is used to efficiently implement removal of all references by
                 * some target ID.
                 */ class br {
                constructor(){
                    // A set of outstanding references to a document sorted by key.
                    this.Zn = new gn(Pr.ts), // A set of outstanding references to a document sorted by target id.
                    this.es = new gn(Pr.ns);
                }
                /** Returns true if the reference set contains no references. */ isEmpty() {
                    return this.Zn.isEmpty();
                }
                /** Adds a reference to the given document key for the given ID. */ addReference(t, e) {
                    const n = new Pr(t, e);
                    this.Zn = this.Zn.add(n), this.es = this.es.add(n);
                }
                /** Add references to the given document keys for the given ID. */ ss(t, e) {
                    t.forEach((t)=>this.addReference(t, e));
                }
                /**
                     * Removes a reference to the given document key for the given
                     * ID.
                     */ removeReference(t, e) {
                    this.rs(new Pr(t, e));
                }
                os(t, e) {
                    t.forEach((t)=>this.removeReference(t, e));
                }
                /**
                     * Clears all references with a given ID. Calls removeRef() for each key
                     * removed.
                     */ cs(t) {
                    const e = new Pt(new ht([])), n = new Pr(e, t), s = new Pr(e, t + 1), i = [];
                    return this.es.forEachInRange([
                        n,
                        s
                    ], (t)=>{
                        this.rs(t), i.push(t.key);
                    }), i;
                }
                us() {
                    this.Zn.forEach((t)=>this.rs(t));
                }
                rs(t) {
                    this.Zn = this.Zn.delete(t), this.es = this.es.delete(t);
                }
                hs(t) {
                    const e = new Pt(new ht([])), n = new Pr(e, t), s = new Pr(e, t + 1);
                    let i = Pn();
                    return this.es.forEachInRange([
                        n,
                        s
                    ], (t)=>{
                        i = i.add(t.key);
                    }), i;
                }
                containsKey(t) {
                    const e = new Pr(t, 0), n = this.Zn.firstAfterOrEqual(e);
                    return null !== n && t.isEqual(n.key);
                }
            }
            class Pr {
                constructor(t, e){
                    this.key = t, this.ls = e;
                }
                /** Compare by key then by ID */ static ts(t, e) {
                    return Pt.comparator(t.key, e.key) || et(t.ls, e.ls);
                }
                /** Compare by ID then by key */ static ns(t, e) {
                    return et(t.ls, e.ls) || Pt.comparator(t.key, e.key);
                }
            }
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ class vr {
                constructor(t, e){
                    this.Ht = t, this.referenceDelegate = e, /**
                             * The set of all mutations that have been sent but not yet been applied to
                             * the backend.
                             */ this.In = [], /** Next value to use when assigning sequential IDs to each mutation batch. */ this.fs = 1, /** An ordered mapping between documents and the mutations batch IDs. */ this.ds = new gn(Pr.ts);
                }
                checkEmpty(t) {
                    return js.resolve(0 === this.In.length);
                }
                addMutationBatch(t, e, n, s) {
                    const i = this.fs;
                    this.fs++, this.In.length > 0 && this.In[this.In.length - 1];
                    const r = new ni(i, e, n, s);
                    // Track references by document key and index collection parents.
                    for (const e of (this.In.push(r), s))this.ds = this.ds.add(new Pr(e.key, i)), this.Ht.addToCollectionParentIndex(t, e.key.path.popLast());
                    return js.resolve(r);
                }
                lookupMutationBatch(t, e) {
                    return js.resolve(this.ws(e));
                }
                getNextMutationBatchAfterBatchId(t, e) {
                    const s = this._s(e + 1), i = s < 0 ? 0 : s;
                    // The requested batchId may still be out of range so normalize it to the
                    // start of the queue.
                    return js.resolve(this.In.length > i ? this.In[i] : null);
                }
                getHighestUnacknowledgedBatchId() {
                    return js.resolve(0 === this.In.length ? -1 : this.fs - 1);
                }
                getAllMutationBatches(t) {
                    return js.resolve(this.In.slice());
                }
                getAllMutationBatchesAffectingDocumentKey(t, e) {
                    const n = new Pr(e, 0), s = new Pr(e, Number.POSITIVE_INFINITY), i = [];
                    return this.ds.forEachInRange([
                        n,
                        s
                    ], (t)=>{
                        const e = this.ws(t.ls);
                        i.push(e);
                    }), js.resolve(i);
                }
                getAllMutationBatchesAffectingDocumentKeys(t, e) {
                    let n = new gn(et);
                    return e.forEach((t)=>{
                        const e = new Pr(t, 0), s = new Pr(t, Number.POSITIVE_INFINITY);
                        this.ds.forEachInRange([
                            e,
                            s
                        ], (t)=>{
                            n = n.add(t.ls);
                        });
                    }), js.resolve(this.gs(n));
                }
                getAllMutationBatchesAffectingQuery(t, e) {
                    // Use the query path as a prefix for testing if a document matches the
                    // query.
                    const n = e.path, s = n.length + 1;
                    // Construct a document reference for actually scanning the index. Unlike
                    // the prefix the document key in this reference must have an even number of
                    // segments. The empty segment can be used a suffix of the query path
                    // because it precedes all other segments in an ordered traversal.
                    let i = n;
                    Pt.isDocumentKey(i) || (i = i.child(""));
                    const r = new Pr(new Pt(i), 0);
                    // Find unique batchIDs referenced by all documents potentially matching the
                    // query.
                    let o = new gn(et);
                    return this.ds.forEachWhile((t)=>{
                        const e = t.key.path;
                        return !!n.isPrefixOf(e) && // Rows with document keys more than one segment longer than the query
                        // path can't be matches. For example, a query on 'rooms' can't match
                        // the document /rooms/abc/messages/xyx.
                        // TODO(mcg): we'll need a different scanner when we implement
                        // ancestor queries.
                        (e.length === s && (o = o.add(t.ls)), !0);
                    }, r), js.resolve(this.gs(o));
                }
                gs(t) {
                    // Construct an array of matching batches, sorted by batchID to ensure that
                    // multiple mutations affecting the same document key are applied in order.
                    const e = [];
                    return t.forEach((t)=>{
                        const n = this.ws(t);
                        null !== n && e.push(n);
                    }), e;
                }
                removeMutationBatch(t, e) {
                    0 === this.ys(e.batchId, "removed") || L(), this.In.shift();
                    let n = this.ds;
                    return js.forEach(e.mutations, (s)=>{
                        const i = new Pr(s.key, e.batchId);
                        return n = n.delete(i), this.referenceDelegate.markPotentiallyOrphaned(t, s.key);
                    }).next(()=>{
                        this.ds = n;
                    });
                }
                te(t) {
                // No-op since the memory mutation queue does not maintain a separate cache.
                }
                containsKey(t, e) {
                    const n = new Pr(e, 0), s = this.ds.firstAfterOrEqual(n);
                    return js.resolve(e.isEqual(s && s.key));
                }
                performConsistencyCheck(t) {
                    return this.In.length, js.resolve();
                }
                /**
                     * Finds the index of the given batchId in the mutation queue and asserts that
                     * the resulting index is within the bounds of the queue.
                     *
                     * @param batchId - The batchId to search for
                     * @param action - A description of what the caller is doing, phrased in passive
                     * form (e.g. "acknowledged" in a routine that acknowledges batches).
                     */ ys(t, e) {
                    return this._s(t);
                }
                /**
                     * Finds the index of the given batchId in the mutation queue. This operation
                     * is O(1).
                     *
                     * @returns The computed index of the batch with the given batchId, based on
                     * the state of the queue. Note this index can be negative if the requested
                     * batchId has already been remvoed from the queue or past the end of the
                     * queue if the batchId is larger than the last added batch.
                     */ _s(t) {
                    return 0 === this.In.length ? 0 : t - this.In[0].batchId;
                }
                /**
                     * A version of lookupMutationBatch that doesn't return a promise, this makes
                     * other functions that uses this code easier to read and more efficent.
                     */ ws(t) {
                    const e = this._s(t);
                    return e < 0 || e >= this.In.length ? null : this.In[e];
                }
            }
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * The memory-only RemoteDocumentCache for IndexedDb. To construct, invoke
                 * `newMemoryRemoteDocumentCache()`.
                 */ class Vr {
                /**
                     * @param sizer - Used to assess the size of a document. For eager GC, this is
                     * expected to just return 0 to avoid unnecessarily doing the work of
                     * calculating the size.
                     */ constructor(t, e){
                    this.Ht = t, this.ps = e, /** Underlying cache of documents and their read times. */ this.docs = new wn(Pt.comparator), /** Size of all cached documents. */ this.size = 0;
                }
                /**
                     * Adds the supplied entry to the cache and updates the cache size as appropriate.
                     *
                     * All calls of `addEntry`  are required to go through the RemoteDocumentChangeBuffer
                     * returned by `newChangeBuffer()`.
                     */ addEntry(t, e, n) {
                    const s = e.key, i = this.docs.get(s), r = i ? i.size : 0, o = this.ps(e);
                    return this.docs = this.docs.insert(s, {
                        document: e.clone(),
                        size: o,
                        readTime: n
                    }), this.size += o - r, this.Ht.addToCollectionParentIndex(t, s.path.popLast());
                }
                /**
                     * Removes the specified entry from the cache and updates the cache size as appropriate.
                     *
                     * All calls of `removeEntry` are required to go through the RemoteDocumentChangeBuffer
                     * returned by `newChangeBuffer()`.
                     */ removeEntry(t) {
                    const e = this.docs.get(t);
                    e && (this.docs = this.docs.remove(t), this.size -= e.size);
                }
                getEntry(t, e) {
                    const n = this.docs.get(e);
                    return js.resolve(n ? n.document.clone() : Kt.newInvalidDocument(e));
                }
                getEntries(t, e) {
                    let n = pn;
                    return e.forEach((t)=>{
                        const e = this.docs.get(t);
                        n = n.insert(t, e ? e.document.clone() : Kt.newInvalidDocument(t));
                    }), js.resolve(n);
                }
                getDocumentsMatchingQuery(t, e, n) {
                    let s = pn;
                    // Documents are ordered by key, so we can use a prefix scan to narrow down
                    // the documents we need to match the query against.
                    const i = new Pt(e.path.child("")), r = this.docs.getIteratorFrom(i);
                    for(; r.hasNext();){
                        const { key: t, value: { document: i, readTime: o } } = r.getNext();
                        if (!e.path.isPrefixOf(t.path)) break;
                        0 >= o.compareTo(n) || Pe(e, i) && (s = s.insert(i.key, i.clone()));
                    }
                    return js.resolve(s);
                }
                Ts(t, e) {
                    return js.forEach(this.docs, (t)=>e(t));
                }
                newChangeBuffer(t) {
                    // `trackRemovals` is ignores since the MemoryRemoteDocumentCache keeps
                    // a separate changelog and does not need special handling for removals.
                    return new Sr(this);
                }
                getSize(t) {
                    return js.resolve(this.size);
                }
            }
            /**
                 * Creates a new memory-only RemoteDocumentCache.
                 *
                 * @param indexManager - A class that manages collection group indices.
                 * @param sizer - Used to assess the size of a document. For eager GC, this is
                 * expected to just return 0 to avoid unnecessarily doing the work of
                 * calculating the size.
                 */ /**
                 * Handles the details of adding and updating documents in the MemoryRemoteDocumentCache.
                 */ class Sr extends Qi {
                constructor(t){
                    super(), this.Se = t;
                }
                applyChanges(t) {
                    const e = [];
                    return this.changes.forEach((n, s)=>{
                        s.document.isValidDocument() ? e.push(this.Se.addEntry(t, s.document, this.getReadTime(n))) : this.Se.removeEntry(n);
                    }), js.waitFor(e);
                }
                getFromCache(t, e) {
                    return this.Se.getEntry(t, e);
                }
                getAllFromCache(t, e) {
                    return this.Se.getEntries(t, e);
                }
            }
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ class Dr {
                constructor(t){
                    this.persistence = t, /**
                             * Maps a target to the data about that target
                             */ this.Es = new ji((t)=>Wt(t), zt), /** The last received snapshot version. */ this.lastRemoteSnapshotVersion = rt.min(), /** The highest numbered target ID encountered. */ this.highestTargetId = 0, /** The highest sequence number encountered. */ this.Is = 0, /**
                             * A ordered bidirectional mapping between documents and the remote target
                             * IDs.
                             */ this.As = new br(), this.targetCount = 0, this.Rs = Ni.se();
                }
                forEachTarget(t, e) {
                    return this.Es.forEach((t, n)=>e(n)), js.resolve();
                }
                getLastRemoteSnapshotVersion(t) {
                    return js.resolve(this.lastRemoteSnapshotVersion);
                }
                getHighestSequenceNumber(t) {
                    return js.resolve(this.Is);
                }
                allocateTargetId(t) {
                    return this.highestTargetId = this.Rs.next(), js.resolve(this.highestTargetId);
                }
                setTargetsMetadata(t, e, n) {
                    return n && (this.lastRemoteSnapshotVersion = n), e > this.Is && (this.Is = e), js.resolve();
                }
                ce(t) {
                    this.Es.set(t.target, t);
                    const e = t.targetId;
                    e > this.highestTargetId && (this.Rs = new Ni(e), this.highestTargetId = e), t.sequenceNumber > this.Is && (this.Is = t.sequenceNumber);
                }
                addTargetData(t, e) {
                    return this.ce(e), this.targetCount += 1, js.resolve();
                }
                updateTargetData(t, e) {
                    return this.ce(e), js.resolve();
                }
                removeTargetData(t, e) {
                    return this.Es.delete(e.target), this.As.cs(e.targetId), this.targetCount -= 1, js.resolve();
                }
                removeTargets(t, e, n) {
                    let s = 0;
                    const i = [];
                    return this.Es.forEach((r, o)=>{
                        o.sequenceNumber <= e && null === n.get(o.targetId) && (this.Es.delete(r), i.push(this.removeMatchingKeysForTargetId(t, o.targetId)), s++);
                    }), js.waitFor(i).next(()=>s);
                }
                getTargetCount(t) {
                    return js.resolve(this.targetCount);
                }
                getTargetData(t, e) {
                    const n = this.Es.get(e) || null;
                    return js.resolve(n);
                }
                addMatchingKeys(t, e, n) {
                    return this.As.ss(e, n), js.resolve();
                }
                removeMatchingKeys(t, e, n) {
                    this.As.os(e, n);
                    const s = this.persistence.referenceDelegate, i = [];
                    return s && e.forEach((e)=>{
                        i.push(s.markPotentiallyOrphaned(t, e));
                    }), js.waitFor(i);
                }
                removeMatchingKeysForTargetId(t, e) {
                    return this.As.cs(e), js.resolve();
                }
                getMatchingKeysForTargetId(t, e) {
                    const n = this.As.hs(e);
                    return js.resolve(n);
                }
                containsKey(t, e) {
                    return js.resolve(this.As.containsKey(e));
                }
            }
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * A memory-backed instance of Persistence. Data is stored only in RAM and
                 * not persisted across sessions.
                 */ class Cr {
                /**
                     * The constructor accepts a factory for creating a reference delegate. This
                     * allows both the delegate and this instance to have strong references to
                     * each other without having nullable fields that would then need to be
                     * checked or asserted on every access.
                     */ constructor(t, e){
                    this.bs = {}, this.Le = new X(0), this.Be = !1, this.Be = !0, this.referenceDelegate = t(this), this.ze = new Dr(this), this.Ht = new pi(), this.He = new Vr(this.Ht, (t)=>this.referenceDelegate.Ps(t)), this.N = new ri(e), this.Je = new Rr(this.N);
                }
                start() {
                    return Promise.resolve();
                }
                shutdown() {
                    // No durable state to ensure is closed on shutdown.
                    return this.Be = !1, Promise.resolve();
                }
                get started() {
                    return this.Be;
                }
                setDatabaseDeletedListener() {
                // No op.
                }
                setNetworkEnabled() {
                // No op.
                }
                getIndexManager() {
                    return this.Ht;
                }
                getMutationQueue(t) {
                    let e = this.bs[t.toKey()];
                    return e || (e = new vr(this.Ht, this.referenceDelegate), this.bs[t.toKey()] = e), e;
                }
                getTargetCache() {
                    return this.ze;
                }
                getRemoteDocumentCache() {
                    return this.He;
                }
                getBundleCache() {
                    return this.Je;
                }
                runTransaction(t, e, n) {
                    $("MemoryPersistence", "Starting transaction:", t);
                    const s = new Nr(this.Le.next());
                    return this.referenceDelegate.vs(), n(s).next((t)=>this.referenceDelegate.Vs(s).next(()=>t)).toPromise().then((t)=>(s.raiseOnCommittedEvent(), t));
                }
                Ss(t, e) {
                    return js.or(Object.values(this.bs).map((n)=>()=>n.containsKey(t, e)));
                }
            }
            /**
                 * Memory persistence is not actually transactional, but future implementations
                 * may have transaction-scoped state.
                 */ class Nr extends Ks {
                constructor(t){
                    super(), this.currentSequenceNumber = t;
                }
            }
            class xr {
                constructor(t){
                    this.persistence = t, /** Tracks all documents that are active in Query views. */ this.Ds = new br(), /** The list of documents that are potentially GCed after each transaction. */ this.Cs = null;
                }
                static Ns(t) {
                    return new xr(t);
                }
                get xs() {
                    if (this.Cs) return this.Cs;
                    throw L();
                }
                addReference(t, e, n) {
                    return this.Ds.addReference(n, e), this.xs.delete(n.toString()), js.resolve();
                }
                removeReference(t, e, n) {
                    return this.Ds.removeReference(n, e), this.xs.add(n.toString()), js.resolve();
                }
                markPotentiallyOrphaned(t, e) {
                    return this.xs.add(e.toString()), js.resolve();
                }
                removeTarget(t, e) {
                    this.Ds.cs(e.targetId).forEach((t)=>this.xs.add(t.toString()));
                    const n = this.persistence.getTargetCache();
                    return n.getMatchingKeysForTargetId(t, e.targetId).next((t)=>{
                        t.forEach((t)=>this.xs.add(t.toString()));
                    }).next(()=>n.removeTargetData(t, e));
                }
                vs() {
                    this.Cs = new Set();
                }
                Vs(t) {
                    // Remove newly orphaned documents.
                    const e = this.persistence.getRemoteDocumentCache().newChangeBuffer();
                    return js.forEach(this.xs, (n)=>{
                        const s = Pt.fromPath(n);
                        return this.ks(t, s).next((t)=>{
                            t || e.removeEntry(s);
                        });
                    }).next(()=>(this.Cs = null, e.apply(t)));
                }
                updateLimboDocument(t, e) {
                    return this.ks(t, e).next((t)=>{
                        t ? this.xs.delete(e.toString()) : this.xs.add(e.toString());
                    });
                }
                Ps(t) {
                    // For eager GC, we don't care about the document size, there are no size thresholds.
                    return 0;
                }
                ks(t, e) {
                    return js.or([
                        ()=>js.resolve(this.Ds.containsKey(e)),
                        ()=>this.persistence.getTargetCache().containsKey(t, e),
                        ()=>this.persistence.Ss(t, e)
                    ]);
                }
            }
            /**
                 * Metadata state of the local client. Unlike `RemoteClientState`, this class is
                 * mutable and keeps track of all pending mutations, which allows us to
                 * update the range of pending mutation batch IDs as new mutations are added or
                 * removed.
                 *
                 * The data in `LocalClientState` is not read from WebStorage and instead
                 * updated via its instance methods. The updated state can be serialized via
                 * `toWebStorageJSON()`.
                 */ // Visible for testing.
            class Ur {
                constructor(){
                    this.activeTargetIds = vn;
                }
                Fs(t) {
                    this.activeTargetIds = this.activeTargetIds.add(t);
                }
                Ms(t) {
                    this.activeTargetIds = this.activeTargetIds.delete(t);
                }
                /**
                     * Converts this entry into a JSON-encoded format we can use for WebStorage.
                     * Does not encode `clientId` as it is part of the key in WebStorage.
                     */ Os() {
                    return JSON.stringify({
                        activeTargetIds: this.activeTargetIds.toArray(),
                        updateTimeMs: Date.now()
                    });
                }
            }
            class Kr {
                constructor(){
                    this.yi = new Ur(), this.pi = {}, this.onlineStateHandler = null, this.sequenceNumberHandler = null;
                }
                addPendingMutation(t) {
                // No op.
                }
                updateMutationState(t, e, n) {
                // No op.
                }
                addLocalQueryTarget(t) {
                    return this.yi.Fs(t), this.pi[t] || "not-current";
                }
                updateQueryState(t, e, n) {
                    this.pi[t] = e;
                }
                removeLocalQueryTarget(t) {
                    this.yi.Ms(t);
                }
                isLocalQueryTarget(t) {
                    return this.yi.activeTargetIds.has(t);
                }
                clearQueryState(t) {
                    delete this.pi[t];
                }
                getAllActiveQueryTargets() {
                    return this.yi.activeTargetIds;
                }
                isActiveQueryTarget(t) {
                    return this.yi.activeTargetIds.has(t);
                }
                start() {
                    return this.yi = new Ur(), Promise.resolve();
                }
                handleUserChange(t, e, n) {
                // No op.
                }
                setOnlineState(t) {
                // No op.
                }
                shutdown() {}
                writeSequenceNumber(t) {}
                notifyBundleLoaded() {
                // No op.
                }
            }
            /**
                 * @license
                 * Copyright 2019 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ class jr {
                Ti(t) {
                // No-op.
                }
                shutdown() {
                // No-op.
                }
            }
            /**
                 * @license
                 * Copyright 2019 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ // References to `window` are guarded by BrowserConnectivityMonitor.isAvailable()
            /* eslint-disable no-restricted-globals */ /**
                 * Browser implementation of ConnectivityMonitor.
                 */ class Qr {
                constructor(){
                    this.Ei = ()=>this.Ii(), this.Ai = ()=>this.Ri(), this.bi = [], this.Pi();
                }
                Ti(t) {
                    this.bi.push(t);
                }
                shutdown() {
                    window.removeEventListener("online", this.Ei), window.removeEventListener("offline", this.Ai);
                }
                Pi() {
                    window.addEventListener("online", this.Ei), window.addEventListener("offline", this.Ai);
                }
                Ii() {
                    for (const t of ($("ConnectivityMonitor", "Network connectivity changed: AVAILABLE"), this.bi))t(0 /* AVAILABLE */ );
                }
                Ri() {
                    for (const t of ($("ConnectivityMonitor", "Network connectivity changed: UNAVAILABLE"), this.bi))t(1 /* UNAVAILABLE */ );
                }
                // TODO(chenbrian): Consider passing in window either into this component or
                // here for testing via FakeWindow.
                /** Checks that all used attributes of window are available. */ static bt() {
                    return "undefined" != typeof window && void 0 !== window.addEventListener && void 0 !== window.removeEventListener;
                }
            }
            /**
                 * @license
                 * Copyright 2020 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ const Wr = {
                BatchGetDocuments: "batchGet",
                Commit: "commit",
                RunQuery: "runQuery"
            };
            /**
                 * Maps RPC names to the corresponding REST endpoint name.
                 *
                 * We use array notation to avoid mangling.
                 */ /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * Provides a simple helper class that implements the Stream interface to
                 * bridge to other implementations that are streams but do not implement the
                 * interface. The stream callbacks are invoked with the callOn... methods.
                 */ class Gr {
                constructor(t){
                    this.vi = t.vi, this.Vi = t.Vi;
                }
                Si(t) {
                    this.Di = t;
                }
                Ci(t) {
                    this.Ni = t;
                }
                onMessage(t) {
                    this.xi = t;
                }
                close() {
                    this.Vi();
                }
                send(t) {
                    this.vi(t);
                }
                ki() {
                    this.Di();
                }
                $i(t) {
                    this.Ni(t);
                }
                Oi(t) {
                    this.xi(t);
                }
            }
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ class zr extends class {
                constructor(t){
                    this.databaseInfo = t, this.databaseId = t.databaseId;
                    const e = t.ssl ? "https" : "http";
                    this.Fi = e + "://" + t.host, this.Mi = "projects/" + this.databaseId.projectId + "/databases/" + this.databaseId.database + "/documents";
                }
                Li(t, e, n, s) {
                    const i = this.Bi(t, e);
                    $("RestConnection", "Sending: ", i, n);
                    const r = {};
                    return this.Ui(r, s), this.qi(t, i, r, n).then((t)=>($("RestConnection", "Received: ", t), t), (e)=>{
                        throw F("RestConnection", `${t} failed with error: `, e, "url: ", i, "request:", n), e;
                    });
                }
                Ki(t, e, n, s) {
                    // The REST API automatically aggregates all of the streamed results, so we
                    // can just use the normal invoke() method.
                    return this.Li(t, e, n, s);
                }
                /**
                         * Modifies the headers for a request, adding any authorization token if
                         * present and any additional headers for the request.
                         */ Ui(t, e) {
                    if (t["X-Goog-Api-Client"] = "gl-js/ fire/" + C, // Content-Type: text/plain will avoid preflight requests which might
                    // mess with CORS and redirects by proxies. If we add custom headers
                    // we will need to change this code to potentially use the $httpOverwrite
                    // parameter supported by ESF to avoid triggering preflight requests.
                    t["Content-Type"] = "text/plain", this.databaseInfo.appId && (t["X-Firebase-GMPID"] = this.databaseInfo.appId), e) for(const n in e.authHeaders)e.authHeaders.hasOwnProperty(n) && (t[n] = e.authHeaders[n]);
                }
                Bi(t, e) {
                    const n = Wr[t];
                    return `${this.Fi}/v1/${e}:${n}`;
                }
            } {
                constructor(t){
                    super(t), this.forceLongPolling = t.forceLongPolling, this.autoDetectLongPolling = t.autoDetectLongPolling, this.useFetchStreams = t.useFetchStreams;
                }
                qi(t, e, n, s) {
                    return new Promise((i, r)=>{
                        const o = new _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__ /* .XhrIo */ .JJ();
                        o.listenOnce(_firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__ /* .EventType.COMPLETE */ .tw.COMPLETE, ()=>{
                            try {
                                switch(o.getLastErrorCode()){
                                    case _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__ /* .ErrorCode.NO_ERROR */ .jK.NO_ERROR:
                                        const e = o.getResponseJson();
                                        $("Connection", "XHR received:", JSON.stringify(e)), i(e);
                                        break;
                                    case _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__ /* .ErrorCode.TIMEOUT */ .jK.TIMEOUT:
                                        $("Connection", 'RPC "' + t + '" timed out'), r(new j(K.DEADLINE_EXCEEDED, "Request time out"));
                                        break;
                                    case _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__ /* .ErrorCode.HTTP_ERROR */ .jK.HTTP_ERROR:
                                        const n = o.getStatus();
                                        if ($("Connection", 'RPC "' + t + '" failed with status:', n, "response text:", o.getResponseText()), n > 0) {
                                            const t = o.getResponseJson().error;
                                            if (t && t.status && t.message) {
                                                const e = function(t) {
                                                    const e = t.toLowerCase().replace(/_/g, "-");
                                                    return Object.values(K).indexOf(e) >= 0 ? e : K.UNKNOWN;
                                                }(t.status);
                                                r(new j(e, t.message));
                                            } else r(new j(K.UNKNOWN, "Server responded with status " + o.getStatus()));
                                        } else r(new j(K.UNAVAILABLE, "Connection failed."));
                                        break;
                                    default:
                                        L();
                                }
                            } finally{
                                $("Connection", 'RPC "' + t + '" completed.');
                            }
                        });
                        const c = JSON.stringify(s);
                        o.send(e, "POST", c, n, 15);
                    });
                }
                ji(t, e) {
                    const n = [
                        this.Fi,
                        "/",
                        "google.firestore.v1.Firestore",
                        "/",
                        t,
                        "/channel"
                    ], s = (0, _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__ /* .createWebChannelTransport */ .UE)(), i = (0, _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__ /* .getStatEventTarget */ .FJ)(), r = {
                        // Required for backend stickiness, routing behavior is based on this
                        // parameter.
                        httpSessionIdParam: "gsessionid",
                        initMessageHeaders: {},
                        messageUrlParams: {
                            // This param is used to improve routing and project isolation by the
                            // backend and must be included in every request.
                            database: `projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`
                        },
                        sendRawJson: !0,
                        supportsCrossDomainXhr: !0,
                        internalChannelParams: {
                            // Override the default timeout (randomized between 10-20 seconds) since
                            // a large write batch on a slow internet connection may take a long
                            // time to send to the backend. Rather than have WebChannel impose a
                            // tight timeout which could lead to infinite timeouts and retries, we
                            // set it very large (5-10 minutes) and rely on the browser's builtin
                            // timeouts to kick in if the request isn't working.
                            forwardChannelRequestTimeoutMs: 6e5
                        },
                        forceLongPolling: this.forceLongPolling,
                        detectBufferingProxy: this.autoDetectLongPolling
                    };
                    this.useFetchStreams && (r.xmlHttpFactory = new _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__ /* .FetchXmlHttpFactory */ .zI({})), this.Ui(r.initMessageHeaders, e), // Sending the custom headers we just added to request.initMessageHeaders
                    // (Authorization, etc.) will trigger the browser to make a CORS preflight
                    // request because the XHR will no longer meet the criteria for a "simple"
                    // CORS request:
                    // https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#Simple_requests
                    // Therefore to avoid the CORS preflight request (an extra network
                    // roundtrip), we use the httpHeadersOverwriteParam option to specify that
                    // the headers should instead be encoded into a special "$httpHeaders" query
                    // parameter, which is recognized by the webchannel backend. This is
                    // formally defined here:
                    // https://github.com/google/closure-library/blob/b0e1815b13fb92a46d7c9b3c30de5d6a396a3245/closure/goog/net/rpc/httpcors.js#L32
                    // TODO(b/145624756): There is a backend bug where $httpHeaders isn't respected if the request
                    // doesn't have an Origin header. So we have to exclude a few browser environments that are
                    // known to (sometimes) not include an Origin. See
                    // https://github.com/firebase/firebase-js-sdk/issues/1491.
                    (0, _firebase_util__WEBPACK_IMPORTED_MODULE_3__ /* .isMobileCordova */ .uI)() || (0, _firebase_util__WEBPACK_IMPORTED_MODULE_3__ /* .isReactNative */ .b$)() || (0, _firebase_util__WEBPACK_IMPORTED_MODULE_3__ /* .isElectron */ .d)() || (0, _firebase_util__WEBPACK_IMPORTED_MODULE_3__ /* .isIE */ .w1)() || (0, _firebase_util__WEBPACK_IMPORTED_MODULE_3__ /* .isUWP */ .Mn)() || (0, _firebase_util__WEBPACK_IMPORTED_MODULE_3__ /* .isBrowserExtension */ .ru)() || (r.httpHeadersOverwriteParam = "$httpHeaders");
                    const o = n.join("");
                    $("Connection", "Creating WebChannel: " + o, r);
                    const c = s.createWebChannel(o, r);
                    // WebChannel supports sending the first message with the handshake - saving
                    // a network round trip. However, it will have to call send in the same
                    // JS event loop as open. In order to enforce this, we delay actually
                    // opening the WebChannel until send is called. Whether we have called
                    // open is tracked with this variable.
                    let a = !1, u = !1;
                    // A flag to determine whether the stream was closed (by us or through an
                    // error/close event) to avoid delivering multiple close events or sending
                    // on a closed stream
                    const h = new Gr({
                        vi: (t)=>{
                            u ? $("Connection", "Not sending because WebChannel is closed:", t) : (a || ($("Connection", "Opening WebChannel transport."), c.open(), a = !0), $("Connection", "WebChannel sending:", t), c.send(t));
                        },
                        Vi: ()=>c.close()
                    }), g = (t, e, n)=>{
                        // TODO(dimond): closure typing seems broken because WebChannel does
                        // not implement goog.events.Listenable
                        t.listen(e, (t)=>{
                            try {
                                n(t);
                            } catch (t) {
                                setTimeout(()=>{
                                    throw t;
                                }, 0);
                            }
                        });
                    };
                    // Closure events are guarded and exceptions are swallowed, so catch any
                    // exception and rethrow using a setTimeout so they become visible again.
                    // Note that eventually this function could go away if we are confident
                    // enough the code is exception free.
                    return g(c, _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__ /* .WebChannel.EventType.OPEN */ .ii.EventType.OPEN, ()=>{
                        u || $("Connection", "WebChannel transport opened.");
                    }), g(c, _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__ /* .WebChannel.EventType.CLOSE */ .ii.EventType.CLOSE, ()=>{
                        u || (u = !0, $("Connection", "WebChannel transport closed"), h.$i());
                    }), g(c, _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__ /* .WebChannel.EventType.ERROR */ .ii.EventType.ERROR, (t)=>{
                        u || (u = !0, F("Connection", "WebChannel transport errored:", t), h.$i(new j(K.UNAVAILABLE, "The operation could not be completed")));
                    }), g(c, _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__ /* .WebChannel.EventType.MESSAGE */ .ii.EventType.MESSAGE, (t)=>{
                        var e;
                        if (!u) {
                            const n = t.data[0];
                            n || L();
                            // TODO(b/35143891): There is a bug in One Platform that caused errors
                            // (and only errors) to be wrapped in an extra array. To be forward
                            // compatible with the bug we need to check either condition. The latter
                            // can be removed once the fix has been rolled out.
                            // Use any because msgData.error is not typed.
                            const i = n.error || (null === (e = n[0]) || void 0 === e ? void 0 : e.error);
                            if (i) {
                                $("Connection", "WebChannel received error:", i);
                                // error.status will be a string like 'OK' or 'NOT_FOUND'.
                                const t = i.status;
                                let e = /**
                                                     * Maps an error Code from a GRPC status identifier like 'NOT_FOUND'.
                                                     *
                                                     * @returns The Code equivalent to the given status string or undefined if
                                                     *     there is no match.
                                                     */ function(t) {
                                    // lookup by string
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    const e = hn[t];
                                    if (void 0 !== e) return dn(e);
                                }(t), n = i.message;
                                void 0 === e && (e = K.INTERNAL, n = "Unknown error status: " + t + " with message " + i.message), // Mark closed so no further events are propagated
                                u = !0, h.$i(new j(e, n)), c.close();
                            } else $("Connection", "WebChannel received:", n), h.Oi(n);
                        }
                    }), g(i, _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__ /* .Event.STAT_EVENT */ .ju.STAT_EVENT, (t)=>{
                        t.stat === _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__ /* .Stat.PROXY */ .kN.PROXY ? $("Connection", "Detected buffering proxy") : t.stat === _firebase_webchannel_wrapper__WEBPACK_IMPORTED_MODULE_4__ /* .Stat.NOPROXY */ .kN.NOPROXY && $("Connection", "Detected no buffering proxy");
                    }), setTimeout(()=>{
                        // Technically we could/should wait for the WebChannel opened event,
                        // but because we want to send the first message with the WebChannel
                        // handshake we pretend the channel opened here (asynchronously), and
                        // then delay the actual open until the first message is sent.
                        h.ki();
                    }, 0), h;
                }
            }
            /** The Platform's 'document' implementation or null if not available. */ function Jr() {
                // `document` is not always available, e.g. in ReactNative and WebWorkers.
                // eslint-disable-next-line no-restricted-globals
                return "undefined" != typeof document ? document : null;
            }
            /**
                 * An instance of the Platform's 'TextEncoder' implementation.
                 */ /**
                 * A helper for running delayed tasks following an exponential backoff curve
                 * between attempts.
                 *
                 * Each delay is made up of a "base" delay which follows the exponential
                 * backoff curve, and a +/- 50% "jitter" that is calculated and added to the
                 * base delay. This prevents clients from accidentally synchronizing their
                 * delays causing spikes of load to the backend.
                 */ class Xr {
                constructor(/**
                         * The AsyncQueue to run backoff operations on.
                         */ t, /**
                         * The ID to use when scheduling backoff operations on the AsyncQueue.
                         */ e, /**
                         * The initial delay (used as the base delay on the first retry attempt).
                         * Note that jitter will still be applied, so the actual delay could be as
                         * little as 0.5*initialDelayMs.
                         */ n = 1e3, /**
                         * The multiplier to use to determine the extended base delay after each
                         * attempt.
                         */ s = 1.5, /**
                         * The maximum base delay after which no further backoff is performed.
                         * Note that jitter will still be applied, so the actual delay could be as
                         * much as 1.5*maxDelayMs.
                         */ i = 6e4){
                    this.Oe = t, this.timerId = e, this.Qi = n, this.Wi = s, this.Gi = i, this.zi = 0, this.Hi = null, /** The last backoff attempt, as epoch milliseconds. */ this.Ji = Date.now(), this.reset();
                }
                /**
                     * Resets the backoff delay.
                     *
                     * The very next backoffAndWait() will have no delay. If it is called again
                     * (i.e. due to an error), initialDelayMs (plus jitter) will be used, and
                     * subsequent ones will increase according to the backoffFactor.
                     */ reset() {
                    this.zi = 0;
                }
                /**
                     * Resets the backoff delay to the maximum delay (e.g. for use after a
                     * RESOURCE_EXHAUSTED error).
                     */ Yi() {
                    this.zi = this.Gi;
                }
                /**
                     * Returns a promise that resolves after currentDelayMs, and increases the
                     * delay for any subsequent attempts. If there was a pending backoff operation
                     * already, it will be canceled.
                     */ Xi(t) {
                    // Cancel any pending backoff operation.
                    this.cancel();
                    // First schedule using the current base (which may be 0 and should be
                    // honored as such).
                    const e = Math.floor(this.zi + this.Zi()), n = Math.max(0, Date.now() - this.Ji), s = Math.max(0, e - n);
                    // Guard against lastAttemptTime being in the future due to a clock change.
                    s > 0 && $("ExponentialBackoff", `Backing off for ${s} ms (base delay: ${this.zi} ms, delay with jitter: ${e} ms, last attempt: ${n} ms ago)`), this.Hi = this.Oe.enqueueAfterDelay(this.timerId, s, ()=>(this.Ji = Date.now(), t())), // Apply backoff factor to determine next delay and ensure it is within
                    // bounds.
                    this.zi *= this.Wi, this.zi < this.Qi && (this.zi = this.Qi), this.zi > this.Gi && (this.zi = this.Gi);
                }
                tr() {
                    null !== this.Hi && (this.Hi.skipDelay(), this.Hi = null);
                }
                cancel() {
                    null !== this.Hi && (this.Hi.cancel(), this.Hi = null);
                }
                /** Returns a random value in the range [-currentBaseMs/2, currentBaseMs/2] */ Zi() {
                    return (Math.random() - 0.5) * this.zi;
                }
            }
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * A PersistentStream is an abstract base class that represents a streaming RPC
                 * to the Firestore backend. It's built on top of the connections own support
                 * for streaming RPCs, and adds several critical features for our clients:
                 *
                 *   - Exponential backoff on failure
                 *   - Authentication via CredentialsProvider
                 *   - Dispatching all callbacks into the shared worker queue
                 *   - Closing idle streams after 60 seconds of inactivity
                 *
                 * Subclasses of PersistentStream implement serialization of models to and
                 * from the JSON representation of the protocol buffers for a specific
                 * streaming RPC.
                 *
                 * ## Starting and Stopping
                 *
                 * Streaming RPCs are stateful and need to be start()ed before messages can
                 * be sent and received. The PersistentStream will call the onOpen() function
                 * of the listener once the stream is ready to accept requests.
                 *
                 * Should a start() fail, PersistentStream will call the registered onClose()
                 * listener with a FirestoreError indicating what went wrong.
                 *
                 * A PersistentStream can be started and stopped repeatedly.
                 *
                 * Generic types:
                 *  SendType: The type of the outgoing message of the underlying
                 *    connection stream
                 *  ReceiveType: The type of the incoming message of the underlying
                 *    connection stream
                 *  ListenerType: The type of the listener that will be used for callbacks
                 */ class Zr {
                constructor(t, e, n, s, i, r, o){
                    this.Oe = t, this.er = n, this.nr = s, this.sr = i, this.credentialsProvider = r, this.listener = o, this.state = 0, /**
                             * A close count that's incremented every time the stream is closed; used by
                             * getCloseGuardedDispatcher() to invalidate callbacks that happen after
                             * close.
                             */ this.ir = 0, this.rr = null, this.cr = null, this.stream = null, this.ar = new Xr(t, e);
                }
                /**
                     * Returns true if start() has been called and no error has occurred. True
                     * indicates the stream is open or in the process of opening (which
                     * encompasses respecting backoff, getting auth tokens, and starting the
                     * actual RPC). Use isOpen() to determine if the stream is open and ready for
                     * outbound requests.
                     */ ur() {
                    return 1 /* Starting */  === this.state || 5 /* Backoff */  === this.state || this.hr();
                }
                /**
                     * Returns true if the underlying RPC is open (the onOpen() listener has been
                     * called) and the stream is ready for outbound requests.
                     */ hr() {
                    return 2 /* Open */  === this.state || 3 /* Healthy */  === this.state;
                }
                /**
                     * Starts the RPC. Only allowed if isStarted() returns false. The stream is
                     * not immediately ready for use: onOpen() will be invoked when the RPC is
                     * ready for outbound requests, at which point isOpen() will return true.
                     *
                     * When start returns, isStarted() will return true.
                     */ start() {
                    4 /* Error */  !== this.state ? this.auth() : this.lr();
                }
                /**
                     * Stops the RPC. This call is idempotent and allowed regardless of the
                     * current isStarted() state.
                     *
                     * When stop returns, isStarted() and isOpen() will both return false.
                     */ async stop() {
                    this.ur() && await this.close(0 /* Initial */ );
                }
                /**
                     * After an error the stream will usually back off on the next attempt to
                     * start it. If the error warrants an immediate restart of the stream, the
                     * sender can use this to indicate that the receiver should not back off.
                     *
                     * Each error will call the onClose() listener. That function can decide to
                     * inhibit backoff if required.
                     */ dr() {
                    this.state = 0, this.ar.reset();
                }
                /**
                     * Marks this stream as idle. If no further actions are performed on the
                     * stream for one minute, the stream will automatically close itself and
                     * notify the stream's onClose() handler with Status.OK. The stream will then
                     * be in a !isStarted() state, requiring the caller to start the stream again
                     * before further use.
                     *
                     * Only streams that are in state 'Open' can be marked idle, as all other
                     * states imply pending network operations.
                     */ wr() {
                    // Starts the idle time if we are in state 'Open' and are not yet already
                    // running a timer (in which case the previous idle timeout still applies).
                    this.hr() && null === this.rr && (this.rr = this.Oe.enqueueAfterDelay(this.er, 6e4, ()=>this._r()));
                }
                /** Sends a message to the underlying stream. */ mr(t) {
                    this.gr(), this.stream.send(t);
                }
                /** Called by the idle timer when the stream should close due to inactivity. */ async _r() {
                    if (this.hr()) // When timing out an idle stream there's no reason to force the stream into backoff when
                    // it restarts so set the stream state to Initial instead of Error.
                    return this.close(0 /* Initial */ );
                }
                /** Marks the stream as active again. */ gr() {
                    this.rr && (this.rr.cancel(), this.rr = null);
                }
                /** Cancels the health check delayed operation. */ yr() {
                    this.cr && (this.cr.cancel(), this.cr = null);
                }
                /**
                     * Closes the stream and cleans up as necessary:
                     *
                     * * closes the underlying GRPC stream;
                     * * calls the onClose handler with the given 'error';
                     * * sets internal stream state to 'finalState';
                     * * adjusts the backoff timer based on the error
                     *
                     * A new stream can be opened by calling start().
                     *
                     * @param finalState - the intended state of the stream after closing.
                     * @param error - the error the connection was closed with.
                     */ async close(t, e) {
                    // Cancel any outstanding timers (they're guaranteed not to execute).
                    this.gr(), this.yr(), this.ar.cancel(), // Invalidates any stream-related callbacks (e.g. from auth or the
                    // underlying stream), guaranteeing they won't execute.
                    this.ir++, 4 /* Error */  !== t ? this.ar.reset() : e && e.code === K.RESOURCE_EXHAUSTED ? (O(e.toString()), O("Using maximum backoff delay to prevent overloading the backend."), this.ar.Yi()) : e && e.code === K.UNAUTHENTICATED && 3 /* Healthy */  !== this.state && // "unauthenticated" error means the token was rejected. This should rarely
                    // happen since both Auth and AppCheck ensure a sufficient TTL when we
                    // request a token. If a user manually resets their system clock this can
                    // fail, however. In this case, we should get a Code.UNAUTHENTICATED error
                    // before we received the first message and we need to invalidate the token
                    // to ensure that we fetch a new token.
                    this.credentialsProvider.invalidateToken(), // Clean up the underlying stream because we are no longer interested in events.
                    null !== this.stream && (this.pr(), this.stream.close(), this.stream = null), // This state must be assigned before calling onClose() to allow the callback to
                    // inhibit backoff or otherwise manipulate the state in its non-started state.
                    this.state = t, // Notify the listener that the stream closed.
                    await this.listener.Ci(e);
                }
                /**
                     * Can be overridden to perform additional cleanup before the stream is closed.
                     * Calling super.tearDown() is not required.
                     */ pr() {}
                auth() {
                    this.state = 1 /* Starting */ ;
                    const t = this.Tr(this.ir), e = this.ir;
                    // TODO(mikelehen): Just use dispatchIfNotClosed, but see TODO below.
                    this.credentialsProvider.getToken().then((t)=>{
                        // Stream can be stopped while waiting for authentication.
                        // TODO(mikelehen): We really should just use dispatchIfNotClosed
                        // and let this dispatch onto the queue, but that opened a spec test can
                        // of worms that I don't want to deal with in this PR.
                        this.ir === e && // Normally we'd have to schedule the callback on the AsyncQueue.
                        // However, the following calls are safe to be called outside the
                        // AsyncQueue since they don't chain asynchronous calls
                        this.Er(t);
                    }, (e)=>{
                        t(()=>{
                            const t = new j(K.UNKNOWN, "Fetching auth token failed: " + e.message);
                            return this.Ir(t);
                        });
                    });
                }
                Er(t) {
                    const e = this.Tr(this.ir);
                    this.stream = this.Ar(t), this.stream.Si(()=>{
                        e(()=>(this.state = 2, this.cr = this.Oe.enqueueAfterDelay(this.nr, 1e4, ()=>(this.hr() && (this.state = 3), Promise.resolve())), this.listener.Si()));
                    }), this.stream.Ci((t)=>{
                        e(()=>this.Ir(t));
                    }), this.stream.onMessage((t)=>{
                        e(()=>this.onMessage(t));
                    });
                }
                lr() {
                    this.state = 5, this.ar.Xi(async ()=>{
                        this.state = 0, this.start();
                    });
                }
                // Visible for tests
                Ir(t) {
                    // In theory the stream could close cleanly, however, in our current model
                    // we never expect this to happen because if we stop a stream ourselves,
                    // this callback will never be called. To prevent cases where we retry
                    // without a backoff accidentally, we set the stream to error in all cases.
                    return $("PersistentStream", `close with error: ${t}`), this.stream = null, this.close(4 /* Error */ , t);
                }
                /**
                     * Returns a "dispatcher" function that dispatches operations onto the
                     * AsyncQueue but only runs them if closeCount remains unchanged. This allows
                     * us to turn auth / stream callbacks into no-ops if the stream is closed /
                     * re-opened, etc.
                     */ Tr(t) {
                    return (e)=>{
                        this.Oe.enqueueAndForget(()=>this.ir === t ? e() : ($("PersistentStream", "stream callback skipped by getCloseGuardedDispatcher."), Promise.resolve()));
                    };
                }
            }
            /**
                 * A PersistentStream that implements the Listen RPC.
                 *
                 * Once the Listen stream has called the onOpen() listener, any number of
                 * listen() and unlisten() calls can be made to control what changes will be
                 * sent from the server for ListenResponses.
                 */ class to extends Zr {
                constructor(t, e, n, s, i){
                    super(t, "listen_stream_connection_backoff" /* ListenStreamConnectionBackoff */ , "listen_stream_idle" /* ListenStreamIdle */ , "health_check_timeout" /* HealthCheckTimeout */ , e, n, i), this.N = s;
                }
                Ar(t) {
                    return this.sr.ji("Listen", t);
                }
                onMessage(t) {
                    // A successful response means the stream is healthy
                    this.ar.reset();
                    const e = function(t, e) {
                        let n;
                        if ("targetChange" in e) {
                            var t1, e1;
                            e.targetChange;
                            // proto3 default value is unset in JSON (undefined), so use 'NO_CHANGE'
                            // if unset
                            const s = "NO_CHANGE" === (t1 = e.targetChange.targetChangeType || "NO_CHANGE") ? 0 /* NoChange */  : "ADD" === t1 ? 1 /* Added */  : "REMOVE" === t1 ? 2 /* Removed */  : "CURRENT" === t1 ? 3 /* Current */  : "RESET" === t1 ? 4 /* Reset */  : L(), i = e.targetChange.targetIds || [], r = (e1 = e.targetChange.resumeToken, t.D ? (void 0 === e1 || "string" == typeof e1 || L(), _t.fromBase64String(e1 || "")) : (void 0 === e1 || e1 instanceof Uint8Array || L(), _t.fromUint8Array(e1 || new Uint8Array()))), o = e.targetChange.cause;
                            n = new xn(s, i, r, o && new j(void 0 === /**
                                     * Returns a value for a number (or null) that's appropriate to put into
                                     * a google.protobuf.Int32Value proto.
                                     * DO NOT USE THIS FOR ANYTHING ELSE.
                                     * This method cheats. It's typed as returning "number" because that's what
                                     * our generated proto interfaces say Int32Value must be. But GRPC actually
                                     * expects a { value: <number> } struct.
                                     */ o.code ? K.UNKNOWN : dn(o.code), o.message || "") || null);
                        } else if ("documentChange" in e) {
                            e.documentChange;
                            const s = e.documentChange;
                            s.document, s.document.name, s.document.updateTime;
                            const i = zn(t, s.document.name), r = jn(s.document.updateTime), o = new Ut({
                                mapValue: {
                                    fields: s.document.fields
                                }
                            }), c = Kt.newFoundDocument(i, r, o);
                            n = new Cn(s.targetIds || [], s.removedTargetIds || [], c.key, c);
                        } else if ("documentDelete" in e) {
                            e.documentDelete;
                            const s = e.documentDelete;
                            s.document;
                            const i = zn(t, s.document), r = s.readTime ? jn(s.readTime) : rt.min(), o = Kt.newNoDocument(i, r);
                            n = new Cn([], s.removedTargetIds || [], o.key, o);
                        } else if ("documentRemove" in e) {
                            e.documentRemove;
                            const s = e.documentRemove;
                            s.document;
                            const i = zn(t, s.document);
                            n = new Cn([], s.removedTargetIds || [], i, null);
                        } else {
                            if (!("filter" in e)) return L();
                            {
                                e.filter;
                                const t = e.filter;
                                t.targetId;
                                const i = new un(t.count || 0);
                                n = new Nn(t.targetId, i);
                            }
                        }
                        return n;
                    }(this.N, t), n = function(t) {
                        // We have only reached a consistent snapshot for the entire stream if there
                        // is a read_time set and it applies to all targets (i.e. the list of
                        // targets is empty). The backend is guaranteed to send such responses.
                        if (!("targetChange" in t)) return rt.min();
                        const e = t.targetChange;
                        return e.targetIds && e.targetIds.length ? rt.min() : e.readTime ? jn(e.readTime) : rt.min();
                    }(t);
                    return this.listener.Rr(e, n);
                }
                /**
                     * Registers interest in the results of the given target. If the target
                     * includes a resumeToken it will be included in the request. Results that
                     * affect the target will be streamed back as WatchChange messages that
                     * reference the targetId.
                     */ br(t) {
                    const e = {};
                    e.database = Yn(this.N), e.addTarget = function(t, e) {
                        var e1, e2;
                        let n;
                        const s = e.target;
                        return (n = Ht(s) ? {
                            documents: {
                                documents: [
                                    Hn(t, s.path)
                                ]
                            }
                        } : {
                            query: function(t, e) {
                                var e1;
                                // Dissect the path into parent, collectionId, and optional key filter.
                                const n = {
                                    structuredQuery: {}
                                }, s = e.path;
                                null !== e.collectionGroup ? (n.parent = Hn(t, s), n.structuredQuery.from = [
                                    {
                                        collectionId: e.collectionGroup,
                                        allDescendants: !0
                                    }
                                ]) : (n.parent = Hn(t, s.popLast()), n.structuredQuery.from = [
                                    {
                                        collectionId: s.lastSegment()
                                    }
                                ]);
                                const i = function(t) {
                                    if (0 === t.length) return;
                                    const e = t.map((t)=>// visible for testing
                                        (function(t) {
                                            if ("==" /* EQUAL */  === t.op) {
                                                if (Mt(t.value)) return {
                                                    unaryFilter: {
                                                        field: _s(t.field),
                                                        op: "IS_NAN"
                                                    }
                                                };
                                                if (Ft(t.value)) return {
                                                    unaryFilter: {
                                                        field: _s(t.field),
                                                        op: "IS_NULL"
                                                    }
                                                };
                                            } else if ("!=" /* NOT_EQUAL */  === t.op) {
                                                if (Mt(t.value)) return {
                                                    unaryFilter: {
                                                        field: _s(t.field),
                                                        op: "IS_NOT_NAN"
                                                    }
                                                };
                                                if (Ft(t.value)) return {
                                                    unaryFilter: {
                                                        field: _s(t.field),
                                                        op: "IS_NOT_NULL"
                                                    }
                                                };
                                            }
                                            return {
                                                fieldFilter: {
                                                    field: _s(t.field),
                                                    op: Ln[t.op],
                                                    value: t.value
                                                }
                                            };
                                        })(t));
                                    return 1 === e.length ? e[0] : {
                                        compositeFilter: {
                                            op: "AND",
                                            filters: e
                                        }
                                    };
                                }(e.filters);
                                i && (n.structuredQuery.where = i);
                                const r = function(t) {
                                    if (0 !== t.length) return t.map((t)=>({
                                            field: _s(t.field),
                                            direction: Mn[t.dir]
                                        }));
                                }(e.orderBy);
                                r && (n.structuredQuery.orderBy = r);
                                const o = (e1 = e.limit, /**
                         * Returns a number (or null) from a google.protobuf.Int32Value proto.
                         */ t.D || At(e1) ? e1 : {
                                    value: e1
                                });
                                return null !== o && (n.structuredQuery.limit = o), e.startAt && (n.structuredQuery.startAt = ls(e.startAt)), e.endAt && (n.structuredQuery.endAt = ls(e.endAt)), n;
                            }(t, s)
                        }).targetId = e.targetId, e.resumeToken.approximateByteSize() > 0 ? n.resumeToken = (e1 = e.resumeToken, t.D ? e1.toBase64() : e1.toUint8Array()) : e.snapshotVersion.compareTo(rt.min()) > 0 && // TODO(wuandy): Consider removing above check because it is most likely true.
                        // Right now, many tests depend on this behaviour though (leaving min() out
                        // of serialization).
                        (n.readTime = (e2 = e.snapshotVersion.toTimestamp(), t.D ? `${new Date(1e3 * e2.seconds).toISOString().replace(/\.\d*/, "").replace("Z", "")}.${("000000000" + e2.nanoseconds).slice(-9)}Z` : {
                            seconds: "" + e2.seconds,
                            nanos: e2.nanoseconds
                        })), n;
                    }(this.N, t);
                    const n = function(t, e) {
                        const n = function(t, e) {
                            switch(e){
                                case 0 /* Listen */ :
                                    return null;
                                case 1 /* ExistenceFilterMismatch */ :
                                    return "existence-filter-mismatch";
                                case 2 /* LimboResolution */ :
                                    return "limbo-document";
                                default:
                                    return L();
                            }
                        }(0, e.purpose);
                        return null == n ? null : {
                            "goog-listen-tags": n
                        };
                    }(this.N, t);
                    n && (e.labels = n), this.mr(e);
                }
                /**
                     * Unregisters interest in the results of the target associated with the
                     * given targetId.
                     */ Pr(t) {
                    const e = {};
                    e.database = Yn(this.N), e.removeTarget = t, this.mr(e);
                }
            }
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * Datastore and its related methods are a wrapper around the external Google
                 * Cloud Datastore grpc API, which provides an interface that is more convenient
                 * for the rest of the client SDK architecture to consume.
                 */ /**
                 * An implementation of Datastore that exposes additional state for internal
                 * consumption.
                 */ class no extends class {
            } {
                constructor(t, e, n){
                    super(), this.credentials = t, this.sr = e, this.N = n, this.kr = !1;
                }
                $r() {
                    if (this.kr) throw new j(K.FAILED_PRECONDITION, "The client has already been terminated.");
                }
                /** Gets an auth token and invokes the provided RPC. */ Li(t, e, n) {
                    return this.$r(), this.credentials.getToken().then((s)=>this.sr.Li(t, e, n, s)).catch((t)=>{
                        throw "FirebaseError" === t.name ? (t.code === K.UNAUTHENTICATED && this.credentials.invalidateToken(), t) : new j(K.UNKNOWN, t.toString());
                    });
                }
                /** Gets an auth token and invokes the provided RPC with streamed results. */ Ki(t, e, n) {
                    return this.$r(), this.credentials.getToken().then((s)=>this.sr.Ki(t, e, n, s)).catch((t)=>{
                        throw "FirebaseError" === t.name ? (t.code === K.UNAUTHENTICATED && this.credentials.invalidateToken(), t) : new j(K.UNKNOWN, t.toString());
                    });
                }
                terminate() {
                    this.kr = !0;
                }
            }
            // TODO(firestorexp): Make sure there is only one Datastore instance per
            // firestore-exp client.
            /**
                 * A component used by the RemoteStore to track the OnlineState (that is,
                 * whether or not the client as a whole should be considered to be online or
                 * offline), implementing the appropriate heuristics.
                 *
                 * In particular, when the client is trying to connect to the backend, we
                 * allow up to MAX_WATCH_STREAM_FAILURES within ONLINE_STATE_TIMEOUT_MS for
                 * a connection to succeed. If we have too many failures or the timeout elapses,
                 * then we set the OnlineState to Offline, and the client will behave as if
                 * it is offline (get()s will return cached data, etc.).
                 */ class so {
                constructor(t, e){
                    this.asyncQueue = t, this.onlineStateHandler = e, /** The current OnlineState. */ this.state = "Unknown", /**
                             * A count of consecutive failures to open the stream. If it reaches the
                             * maximum defined by MAX_WATCH_STREAM_FAILURES, we'll set the OnlineState to
                             * Offline.
                             */ this.Or = 0, /**
                             * A timer that elapses after ONLINE_STATE_TIMEOUT_MS, at which point we
                             * transition from OnlineState.Unknown to OnlineState.Offline without waiting
                             * for the stream to actually fail (MAX_WATCH_STREAM_FAILURES times).
                             */ this.Fr = null, /**
                             * Whether the client should log a warning message if it fails to connect to
                             * the backend (initially true, cleared after a successful stream, or if we've
                             * logged the message already).
                             */ this.Mr = !0;
                }
                /**
                     * Called by RemoteStore when a watch stream is started (including on each
                     * backoff attempt).
                     *
                     * If this is the first attempt, it sets the OnlineState to Unknown and starts
                     * the onlineStateTimer.
                     */ Lr() {
                    0 === this.Or && (this.Br("Unknown" /* Unknown */ ), this.Fr = this.asyncQueue.enqueueAfterDelay("online_state_timeout" /* OnlineStateTimeout */ , 1e4, ()=>(this.Fr = null, this.Ur("Backend didn't respond within 10 seconds."), this.Br("Offline" /* Offline */ ), Promise.resolve())));
                }
                /**
                     * Updates our OnlineState as appropriate after the watch stream reports a
                     * failure. The first failure moves us to the 'Unknown' state. We then may
                     * allow multiple failures (based on MAX_WATCH_STREAM_FAILURES) before we
                     * actually transition to the 'Offline' state.
                     */ qr(t) {
                    "Online" /* Online */  === this.state ? this.Br("Unknown" /* Unknown */ ) : (this.Or++, this.Or >= 1 && (this.Kr(), this.Ur(`Connection failed 1 times. Most recent error: ${t.toString()}`), this.Br("Offline" /* Offline */ )));
                }
                /**
                     * Explicitly sets the OnlineState to the specified state.
                     *
                     * Note that this resets our timers / failure counters, etc. used by our
                     * Offline heuristics, so must not be used in place of
                     * handleWatchStreamStart() and handleWatchStreamFailure().
                     */ set(t) {
                    this.Kr(), this.Or = 0, "Online" /* Online */  === t && // We've connected to watch at least once. Don't warn the developer
                    // about being offline going forward.
                    (this.Mr = !1), this.Br(t);
                }
                Br(t) {
                    t !== this.state && (this.state = t, this.onlineStateHandler(t));
                }
                Ur(t) {
                    const e = `Could not reach Cloud Firestore backend. ${t}\nThis typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;
                    this.Mr ? (O(e), this.Mr = !1) : $("OnlineStateTracker", e);
                }
                Kr() {
                    null !== this.Fr && (this.Fr.cancel(), this.Fr = null);
                }
            }
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ class io {
                constructor(/**
                         * The local store, used to fill the write pipeline with outbound mutations.
                         */ t, /** The client-side proxy for interacting with the backend. */ e, n, s, i){
                    this.localStore = t, this.datastore = e, this.asyncQueue = n, this.remoteSyncer = {}, /**
                             * A list of up to MAX_PENDING_WRITES writes that we have fetched from the
                             * LocalStore via fillWritePipeline() and have or will send to the write
                             * stream.
                             *
                             * Whenever writePipeline.length > 0 the RemoteStore will attempt to start or
                             * restart the write stream. When the stream is established the writes in the
                             * pipeline will be sent in order.
                             *
                             * Writes remain in writePipeline until they are acknowledged by the backend
                             * and thus will automatically be re-sent if the stream is interrupted /
                             * restarted before they're acknowledged.
                             *
                             * Write responses from the backend are linked to their originating request
                             * purely based on order, and so we can just shift() writes from the front of
                             * the writePipeline as we receive responses.
                             */ this.jr = [], /**
                             * A mapping of watched targets that the client cares about tracking and the
                             * user has explicitly called a 'listen' for this target.
                             *
                             * These targets may or may not have been sent to or acknowledged by the
                             * server. On re-establishing the listen stream, these targets should be sent
                             * to the server. The targets removed with unlistens are removed eagerly
                             * without waiting for confirmation from the listen stream.
                             */ this.Qr = new Map(), /**
                             * A set of reasons for why the RemoteStore may be offline. If empty, the
                             * RemoteStore may start its network connections.
                             */ this.Wr = new Set(), /**
                             * Event handlers that get called when the network is disabled or enabled.
                             *
                             * PORTING NOTE: These functions are used on the Web client to create the
                             * underlying streams (to support tree-shakeable streams). On Android and iOS,
                             * the streams are created during construction of RemoteStore.
                             */ this.Gr = [], this.zr = i, this.zr.Ti((t)=>{
                        n.enqueueAndForget(async ()=>{
                            // Porting Note: Unlike iOS, `restartNetwork()` is called even when the
                            // network becomes unreachable as we don't have any other way to tear
                            // down our streams.
                            wo(this) && ($("RemoteStore", "Restarting streams for network reachability change."), await async function(t) {
                                t.Wr.add(4 /* ConnectivityChange */ ), await oo(t), t.Hr.set("Unknown" /* Unknown */ ), t.Wr.delete(4 /* ConnectivityChange */ ), await ro(t);
                            }(this));
                        });
                    }), this.Hr = new so(n, s);
                }
            }
            async function ro(t) {
                if (wo(t)) for (const e of t.Gr)await e(/* enabled= */ !0);
            }
            /**
                 * Temporarily disables the network. The network can be re-enabled using
                 * enableNetwork().
                 */ async function oo(t) {
                for (const e of t.Gr)await e(/* enabled= */ !1);
            }
            /**
                 * Starts new listen for the given target. Uses resume token if provided. It
                 * is a no-op if the target of given `TargetData` is already being listened to.
                 */ function co(t, e) {
                t.Qr.has(e.targetId) || // Mark this as something the client is currently listening for.
                (t.Qr.set(e.targetId, e), fo(t) ? lo(t) : Co(t).hr() && uo(t, e));
            }
            /**
                 * Removes the listen from server. It is a no-op if the given target id is
                 * not being listened to.
                 */ function ao(t, e) {
                const s = Co(t);
                t.Qr.delete(e), s.hr() && ho(t, e), 0 === t.Qr.size && (s.hr() ? s.wr() : wo(t) && // Revert to OnlineState.Unknown if the watch stream is not open and we
                // have no listeners, since without any listens to send we cannot
                // confirm if the stream is healthy and upgrade to OnlineState.Online.
                t.Hr.set("Unknown" /* Unknown */ ));
            }
            /**
                 * We need to increment the the expected number of pending responses we're due
                 * from watch so we wait for the ack to process any messages from this target.
                 */ function uo(t, e) {
                t.Jr.Y(e.targetId), Co(t).br(e);
            }
            /**
                 * We need to increment the expected number of pending responses we're due
                 * from watch so we wait for the removal on the server before we process any
                 * messages from this target.
                 */ function ho(t, e) {
                t.Jr.Y(e), Co(t).Pr(e);
            }
            function lo(t) {
                t.Jr = new $n({
                    getRemoteKeysForTarget: (e)=>t.remoteSyncer.getRemoteKeysForTarget(e),
                    Tt: (e)=>t.Qr.get(e) || null
                }), Co(t).start(), t.Hr.Lr();
            }
            /**
                 * Returns whether the watch stream should be started because it's necessary
                 * and has not yet been started.
                 */ function fo(t) {
                return wo(t) && !Co(t).ur() && t.Qr.size > 0;
            }
            function wo(t) {
                return 0 === t.Wr.size;
            }
            async function mo(t) {
                t.Qr.forEach((e, n)=>{
                    uo(t, e);
                });
            }
            async function go(t, e) {
                t.Jr = void 0, // If we still need the watch stream, retry the connection.
                fo(t) ? (t.Hr.qr(e), lo(t)) : // The online state is set to unknown because there is no active attempt
                // at establishing a connection
                t.Hr.set("Unknown" /* Unknown */ );
            }
            async function yo(t, e, n) {
                if (// Mark the client as online since we got a message from the server
                t.Hr.set("Online" /* Online */ ), e instanceof xn && 2 /* Removed */  === e.state && e.cause) // There was an error on a target, don't wait for a consistent snapshot
                // to raise events
                try {
                    await /** Handles an error on a target */ async function(t, e) {
                        const n = e.cause;
                        // A watched target might have been removed already.
                        for (const s of e.targetIds)t.Qr.has(s) && (await t.remoteSyncer.rejectListen(s, n), t.Qr.delete(s), t.Jr.removeTarget(s));
                    }(/**
                                 * Attempts to fill our write pipeline with writes from the LocalStore.
                                 *
                                 * Called internally to bootstrap or refill the write pipeline and by
                                 * SyncEngine whenever there are new mutations to process.
                                 *
                                 * Starts the write stream if necessary.
                                 */ t, e);
                } catch (n) {
                    $("RemoteStore", "Failed to remove targets %s: %s ", e.targetIds.join(","), n), await po(t, n);
                }
                else if (e instanceof Cn ? t.Jr.rt(e) : e instanceof Nn ? t.Jr.ft(e) : t.Jr.at(e), !n.isEqual(rt.min())) try {
                    const e = await fr(t.localStore);
                    n.compareTo(e) >= 0 && // We have received a target change with a global snapshot if the snapshot
                    // version is not equal to SnapshotVersion.min().
                    await /**
                                 * Takes a batch of changes from the Datastore, repackages them as a
                                 * RemoteEvent, and passes that on to the listener, which is typically the
                                 * SyncEngine.
                                 */ function(t, e) {
                        const n = t.Jr._t(e);
                        // Update in-memory resume tokens. LocalStore will update the
                        // persistent view of these when applying the completed RemoteEvent.
                        return n.targetChanges.forEach((n, s)=>{
                            if (n.resumeToken.approximateByteSize() > 0) {
                                const i = t.Qr.get(s);
                                // A watched target might have been removed already.
                                i && t.Qr.set(s, i.withResumeToken(n.resumeToken, e));
                            }
                        }), // Re-establish listens for the targets that have been invalidated by
                        // existence filter mismatches.
                        n.targetMismatches.forEach((e)=>{
                            const n = t.Qr.get(e);
                            if (!n) // A watched target might have been removed already.
                            return;
                            // Clear the resume token for the target, since we're in a known mismatch
                            // state.
                            t.Qr.set(e, n.withResumeToken(_t.EMPTY_BYTE_STRING, n.snapshotVersion)), // Cause a hard reset by unwatching and rewatching immediately, but
                            // deliberately don't send a resume token so that we get a full update.
                            ho(t, e);
                            // Mark the target we send as being on behalf of an existence filter
                            // mismatch, but don't actually retain that in listenTargets. This ensures
                            // that we flag the first re-listen this way without impacting future
                            // listens of this target (that might happen e.g. on reconnect).
                            const s = new ii(n.target, e, 1 /* ExistenceFilterMismatch */ , n.sequenceNumber);
                            uo(t, s);
                        }), t.remoteSyncer.applyRemoteEvent(n);
                    }(t, n);
                } catch (e) {
                    $("RemoteStore", "Failed to raise snapshot:", e), await po(t, e);
                }
            }
            /**
                 * Recovery logic for IndexedDB errors that takes the network offline until
                 * `op` succeeds. Retries are scheduled with backoff using
                 * `enqueueRetryable()`. If `op()` is not provided, IndexedDB access is
                 * validated via a generic operation.
                 *
                 * The returned Promise is resolved once the network is disabled and before
                 * any retry attempt.
                 */ async function po(t, e, n) {
                if (!Hs(e)) throw e;
                t.Wr.add(1 /* IndexedDbFailed */ ), // Disable network and raise offline snapshots
                await oo(t), t.Hr.set("Offline" /* Offline */ ), n || // Use a simple read operation to determine if IndexedDB recovered.
                // Ideally, we would expose a health check directly on SimpleDb, but
                // RemoteStore only has access to persistence through LocalStore.
                (n = ()=>fr(t.localStore)), // Probe IndexedDB periodically and re-enable network
                t.asyncQueue.enqueueRetryable(async ()=>{
                    $("RemoteStore", "Retrying IndexedDB access"), await n(), t.Wr.delete(1 /* IndexedDbFailed */ ), await ro(t);
                });
            }
            /**
                 * Toggles the network state when the client gains or loses its primary lease.
                 */ async function Do(t, e) {
                e ? (t.Wr.delete(2 /* IsSecondary */ ), await ro(t)) : e || (t.Wr.add(2 /* IsSecondary */ ), await oo(t), t.Hr.set("Unknown" /* Unknown */ ));
            }
            /**
                 * If not yet initialized, registers the WatchStream and its network state
                 * callback with `remoteStoreImpl`. Returns the existing stream if one is
                 * already available.
                 *
                 * PORTING NOTE: On iOS and Android, the WatchStream gets registered on startup.
                 * This is not done on Web to allow it to be tree-shaken.
                 */ function Co(t) {
                var t1, e, n;
                return t.Yr || // Create stream (but note that it is not started yet).
                (t.Yr = (t1 = /**
                                 * @license
                                 * Copyright 2018 Google LLC
                                 *
                                 * Licensed under the Apache License, Version 2.0 (the "License");
                                 * you may not use this file except in compliance with the License.
                                 * You may obtain a copy of the License at
                                 *
                                 *   http://www.apache.org/licenses/LICENSE-2.0
                                 *
                                 * Unless required by applicable law or agreed to in writing, software
                                 * distributed under the License is distributed on an "AS IS" BASIS,
                                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                 * See the License for the specific language governing permissions and
                                 * limitations under the License.
                                 */ t.datastore, e = t.asyncQueue, n = {
                    Si: mo.bind(null, t),
                    Ci: go.bind(null, t),
                    Rr: yo.bind(null, t)
                }, t1.$r(), new to(e, t1.sr, t1.credentials, t1.N, n)), t.Gr.push(async (e)=>{
                    e ? (t.Yr.dr(), fo(t) ? lo(t) : t.Hr.set("Unknown" /* Unknown */ )) : (await t.Yr.stop(), t.Jr = void 0);
                })), t.Yr;
            }
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * Represents an operation scheduled to be run in the future on an AsyncQueue.
                 *
                 * It is created via DelayedOperation.createAndSchedule().
                 *
                 * Supports cancellation (via cancel()) and early execution (via skipDelay()).
                 *
                 * Note: We implement `PromiseLike` instead of `Promise`, as the `Promise` type
                 * in newer versions of TypeScript defines `finally`, which is not available in
                 * IE.
                 */ class xo {
                constructor(t, e, n, s, i){
                    this.asyncQueue = t, this.timerId = e, this.targetTimeMs = n, this.op = s, this.removalCallback = i, this.deferred = new Q(), this.then = this.deferred.promise.then.bind(this.deferred.promise), // It's normal for the deferred promise to be canceled (due to cancellation)
                    // and so we attach a dummy catch callback to avoid
                    // 'UnhandledPromiseRejectionWarning' log spam.
                    this.deferred.promise.catch((t)=>{});
                }
                /**
                     * Creates and returns a DelayedOperation that has been scheduled to be
                     * executed on the provided asyncQueue after the provided delayMs.
                     *
                     * @param asyncQueue - The queue to schedule the operation on.
                     * @param id - A Timer ID identifying the type of operation this is.
                     * @param delayMs - The delay (ms) before the operation should be scheduled.
                     * @param op - The operation to run.
                     * @param removalCallback - A callback to be called synchronously once the
                     *   operation is executed or canceled, notifying the AsyncQueue to remove it
                     *   from its delayedOperations list.
                     *   PORTING NOTE: This exists to prevent making removeDelayedOperation() and
                     *   the DelayedOperation class public.
                     */ static createAndSchedule(t, e, n, s, i) {
                    const o = new xo(t, e, Date.now() + n, s, i);
                    return o.start(n), o;
                }
                /**
                     * Starts the timer. This is called immediately after construction by
                     * createAndSchedule().
                     */ start(t) {
                    this.timerHandle = setTimeout(()=>this.handleDelayElapsed(), t);
                }
                /**
                     * Queues the operation to run immediately (if it hasn't already been run or
                     * canceled).
                     */ skipDelay() {
                    return this.handleDelayElapsed();
                }
                /**
                     * Cancels the operation if it hasn't already been executed or canceled. The
                     * promise will be rejected.
                     *
                     * As long as the operation has not yet been run, calling cancel() provides a
                     * guarantee that the operation will not be run.
                     */ cancel(t) {
                    null !== this.timerHandle && (this.clearTimeout(), this.deferred.reject(new j(K.CANCELLED, "Operation cancelled" + (t ? ": " + t : ""))));
                }
                handleDelayElapsed() {
                    this.asyncQueue.enqueueAndForget(()=>null !== this.timerHandle ? (this.clearTimeout(), this.op().then((t)=>this.deferred.resolve(t))) : Promise.resolve());
                }
                clearTimeout() {
                    null !== this.timerHandle && (this.removalCallback(this), clearTimeout(this.timerHandle), this.timerHandle = null);
                }
            }
            /**
                 * Returns a FirestoreError that can be surfaced to the user if the provided
                 * error is an IndexedDbTransactionError. Re-throws the error otherwise.
                 */ function ko(t, e) {
                if (O("AsyncQueue", `${e}: ${t}`), Hs(t)) return new j(K.UNAVAILABLE, `${e}: ${t}`);
                throw t;
            }
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * DocumentSet is an immutable (copy-on-write) collection that holds documents
                 * in order specified by the provided comparator. We always add a document key
                 * comparator on top of what is provided to guarantee document equality based on
                 * the key.
                 */ class $o {
                /** The default ordering is by key if the comparator is omitted */ constructor(t){
                    // We are adding document key comparator to the end as it's the only
                    // guaranteed unique property of a document.
                    this.comparator = t ? (e, n)=>t(e, n) || Pt.comparator(e.key, n.key) : (t, e)=>Pt.comparator(t.key, e.key), this.keyedMap = En, this.sortedSet = new wn(this.comparator);
                }
                /**
                     * Returns an empty copy of the existing DocumentSet, using the same
                     * comparator.
                     */ static emptySet(t) {
                    return new $o(t.comparator);
                }
                has(t) {
                    return null != this.keyedMap.get(t);
                }
                get(t) {
                    return this.keyedMap.get(t);
                }
                first() {
                    return this.sortedSet.minKey();
                }
                last() {
                    return this.sortedSet.maxKey();
                }
                isEmpty() {
                    return this.sortedSet.isEmpty();
                }
                /**
                     * Returns the index of the provided key in the document set, or -1 if the
                     * document key is not present in the set;
                     */ indexOf(t) {
                    const e = this.keyedMap.get(t);
                    return e ? this.sortedSet.indexOf(e) : -1;
                }
                get size() {
                    return this.sortedSet.size;
                }
                /** Iterates documents in order defined by "comparator" */ forEach(t) {
                    this.sortedSet.inorderTraversal((e, n)=>(t(e), !1));
                }
                /** Inserts or updates a document with the same key */ add(t) {
                    // First remove the element if we have it.
                    const e = this.delete(t.key);
                    return e.copy(e.keyedMap.insert(t.key, t), e.sortedSet.insert(t, null));
                }
                /** Deletes a document with a given key */ delete(t) {
                    const e = this.get(t);
                    return e ? this.copy(this.keyedMap.remove(t), this.sortedSet.remove(e)) : this;
                }
                isEqual(t) {
                    if (!(t instanceof $o) || this.size !== t.size) return !1;
                    const e = this.sortedSet.getIterator(), n = t.sortedSet.getIterator();
                    for(; e.hasNext();){
                        const t = e.getNext().key, s = n.getNext().key;
                        if (!t.isEqual(s)) return !1;
                    }
                    return !0;
                }
                toString() {
                    const t = [];
                    return this.forEach((e)=>{
                        t.push(e.toString());
                    }), 0 === t.length ? "DocumentSet ()" : "DocumentSet (\n  " + t.join("  \n") + "\n)";
                }
                copy(t, e) {
                    const n = new $o();
                    return n.comparator = this.comparator, n.keyedMap = t, n.sortedSet = e, n;
                }
            }
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * DocumentChangeSet keeps track of a set of changes to docs in a query, merging
                 * duplicate events for the same doc.
                 */ class Oo {
                constructor(){
                    this.Zr = new wn(Pt.comparator);
                }
                track(t) {
                    const e = t.doc.key, n = this.Zr.get(e);
                    n ? 0 /* Added */  !== t.type && 3 /* Metadata */  === n.type ? this.Zr = this.Zr.insert(e, t) : 3 /* Metadata */  === t.type && 1 /* Removed */  !== n.type ? this.Zr = this.Zr.insert(e, {
                        type: n.type,
                        doc: t.doc
                    }) : 2 /* Modified */  === t.type && 2 /* Modified */  === n.type ? this.Zr = this.Zr.insert(e, {
                        type: 2 /* Modified */ ,
                        doc: t.doc
                    }) : 2 /* Modified */  === t.type && 0 /* Added */  === n.type ? this.Zr = this.Zr.insert(e, {
                        type: 0 /* Added */ ,
                        doc: t.doc
                    }) : 1 /* Removed */  === t.type && 0 /* Added */  === n.type ? this.Zr = this.Zr.remove(e) : 1 /* Removed */  === t.type && 2 /* Modified */  === n.type ? this.Zr = this.Zr.insert(e, {
                        type: 1 /* Removed */ ,
                        doc: n.doc
                    }) : 0 /* Added */  === t.type && 1 /* Removed */  === n.type ? this.Zr = this.Zr.insert(e, {
                        type: 2 /* Modified */ ,
                        doc: t.doc
                    }) : // Added->Added
                    // Removed->Removed
                    // Modified->Added
                    // Removed->Modified
                    // Metadata->Added
                    // Removed->Metadata
                    L() : this.Zr = this.Zr.insert(e, t);
                }
                eo() {
                    const t = [];
                    return this.Zr.inorderTraversal((e, n)=>{
                        t.push(n);
                    }), t;
                }
            }
            class Fo {
                constructor(t, e, n, s, i, r, o, c){
                    this.query = t, this.docs = e, this.oldDocs = n, this.docChanges = s, this.mutatedKeys = i, this.fromCache = r, this.syncStateChanged = o, this.excludesMetadataChanges = c;
                }
                /** Returns a view snapshot as if all documents in the snapshot were added. */ static fromInitialDocuments(t, e, n, s) {
                    const i = [];
                    return e.forEach((t)=>{
                        i.push({
                            type: 0 /* Added */ ,
                            doc: t
                        });
                    }), new Fo(t, e, $o.emptySet(e), i, n, s, /* syncStateChanged= */ !0, /* excludesMetadataChanges= */ !1);
                }
                get hasPendingWrites() {
                    return !this.mutatedKeys.isEmpty();
                }
                isEqual(t) {
                    if (!(this.fromCache === t.fromCache && this.syncStateChanged === t.syncStateChanged && this.mutatedKeys.isEqual(t.mutatedKeys) && Ae(this.query, t.query) && this.docs.isEqual(t.docs) && this.oldDocs.isEqual(t.oldDocs))) return !1;
                    const e = this.docChanges, n = t.docChanges;
                    if (e.length !== n.length) return !1;
                    for(let t = 0; t < e.length; t++)if (e[t].type !== n[t].type || !e[t].doc.isEqual(n[t].doc)) return !1;
                    return !0;
                }
            }
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * Holds the listeners and the last received ViewSnapshot for a query being
                 * tracked by EventManager.
                 */ class Mo {
                constructor(){
                    this.no = void 0, this.listeners = [];
                }
            }
            class Lo {
                constructor(){
                    this.queries = new ji((t)=>Re(t), Ae), this.onlineState = "Unknown", this.so = new Set();
                }
            }
            async function Bo(t, e) {
                const s = e.query;
                let i = !1, r = t.queries.get(s);
                if (r || (i = !0, r = new Mo()), i) try {
                    r.no = await t.onListen(s);
                } catch (t) {
                    const n = ko(t, `Initialization of query '${be(e.query)}' failed`);
                    return void e.onError(n);
                }
                t.queries.set(s, r), r.listeners.push(e), // Run global snapshot listeners if a consistent snapshot has been emitted.
                e.io(t.onlineState), r.no && e.ro(r.no) && jo(t);
            }
            async function Uo(t, e) {
                const s = e.query;
                let i = !1;
                const r = t.queries.get(s);
                if (r) {
                    const t = r.listeners.indexOf(e);
                    t >= 0 && (r.listeners.splice(t, 1), i = 0 === r.listeners.length);
                }
                if (i) return t.queries.delete(s), t.onUnlisten(s);
            }
            function qo(t, e) {
                let s = !1;
                for (const t1 of e){
                    const e = t1.query, i = t.queries.get(e);
                    if (i) {
                        for (const e of i.listeners)e.ro(t1) && (s = !0);
                        i.no = t1;
                    }
                }
                s && jo(t);
            }
            function Ko(t, e, n) {
                const i = t.queries.get(e);
                if (i) for (const t of i.listeners)t.onError(n);
                // Remove all listeners. NOTE: We don't need to call syncEngine.unlisten()
                // after an error.
                t.queries.delete(e);
            }
            // Call all global snapshot listeners that have been set.
            function jo(t) {
                t.so.forEach((t)=>{
                    t.next();
                });
            }
            /**
                 * QueryListener takes a series of internal view snapshots and determines
                 * when to raise the event.
                 *
                 * It uses an Observer to dispatch events.
                 */ class Qo {
                constructor(t, e, n){
                    this.query = t, this.oo = e, /**
                             * Initial snapshots (e.g. from cache) may not be propagated to the wrapped
                             * observer. This flag is set to true once we've actually raised an event.
                             */ this.co = !1, this.ao = null, this.onlineState = "Unknown", this.options = n || {};
                }
                /**
                     * Applies the new ViewSnapshot to this listener, raising a user-facing event
                     * if applicable (depending on what changed, whether the user has opted into
                     * metadata-only changes, etc.). Returns true if a user-facing event was
                     * indeed raised.
                     */ ro(t) {
                    if (!this.options.includeMetadataChanges) {
                        // Remove the metadata only changes.
                        const e = [];
                        for (const n of t.docChanges)3 /* Metadata */  !== n.type && e.push(n);
                        t = new Fo(t.query, t.docs, t.oldDocs, e, t.mutatedKeys, t.fromCache, t.syncStateChanged, /* excludesMetadataChanges= */ !0);
                    }
                    let e = !1;
                    return this.co ? this.uo(t) && (this.oo.next(t), e = !0) : this.ho(t, this.onlineState) && (this.lo(t), e = !0), this.ao = t, e;
                }
                onError(t) {
                    this.oo.error(t);
                }
                /** Returns whether a snapshot was raised. */ io(t) {
                    this.onlineState = t;
                    let e = !1;
                    return this.ao && !this.co && this.ho(this.ao, t) && (this.lo(this.ao), e = !0), e;
                }
                ho(t, e) {
                    return(// Always raise the first event when we're synced
                    !t.fromCache || (!this.options.fo || !("Offline" /* Offline */  !== e)) && (!t.docs.isEmpty() || "Offline" /* Offline */  === e));
                // Raise data from cache if we have any documents or we are offline
                }
                uo(t) {
                    // We don't need to handle includeDocumentMetadataChanges here because
                    // the Metadata only changes have already been stripped out if needed.
                    // At this point the only changes we will see are the ones we should
                    // propagate.
                    if (t.docChanges.length > 0) return !0;
                    const e = this.ao && this.ao.hasPendingWrites !== t.hasPendingWrites;
                    return !(!t.syncStateChanged && !e) && !0 === this.options.includeMetadataChanges;
                // Generally we should have hit one of the cases above, but it's possible
                // to get here if there were only metadata docChanges and they got
                // stripped out.
                }
                lo(t) {
                    t = Fo.fromInitialDocuments(t.query, t.docs, t.mutatedKeys, t.fromCache), this.co = !0, this.oo.next(t);
                }
            }
            /**
                 * Returns a `LoadBundleTaskProgress` representing the progress that the loading
                 * has succeeded.
                 */ /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ class Jo {
                constructor(t){
                    this.key = t;
                }
            }
            class Yo {
                constructor(t){
                    this.key = t;
                }
            }
            /**
                 * View is responsible for computing the final merged truth of what docs are in
                 * a query. It gets notified of local and remote changes to docs, and applies
                 * the query filters and limits to determine the most correct possible results.
                 */ class Xo {
                constructor(t, /** Documents included in the remote target */ e){
                    this.query = t, this.po = e, this.To = null, /**
                             * A flag whether the view is current with the backend. A view is considered
                             * current after it has seen the current flag from the backend and did not
                             * lose consistency within the watch stream (e.g. because of an existence
                             * filter mismatch).
                             */ this.current = !1, /** Documents in the view but not in the remote target */ this.Eo = Pn(), /** Document Keys that have local changes */ this.mutatedKeys = Pn(), this.Io = ve(t), this.Ao = new $o(this.Io);
                }
                /**
                     * The set of remote documents that the server has told us belongs to the target associated with
                     * this view.
                     */ get Ro() {
                    return this.po;
                }
                /**
                     * Iterates over a set of doc changes, applies the query limit, and computes
                     * what the new results should be, what the changes were, and whether we may
                     * need to go back to the local cache for more results. Does not make any
                     * changes to the view.
                     * @param docChanges - The doc changes to apply to this view.
                     * @param previousChanges - If this is being called with a refill, then start
                     *        with this set of docs and changes instead of the current view.
                     * @returns a new set of docs, changes, and refill flag.
                     */ bo(t, e) {
                    const n = e ? e.Po : new Oo(), s = e ? e.Ao : this.Ao;
                    let i = e ? e.mutatedKeys : this.mutatedKeys, r = s, o = !1;
                    // Track the last doc in a (full) limit. This is necessary, because some
                    // update (a delete, or an update moving a doc past the old limit) might
                    // mean there is some other document in the local cache that either should
                    // come (1) between the old last limit doc and the new last document, in the
                    // case of updates, or (2) after the new last document, in the case of
                    // deletes. So we keep this doc at the old limit to compare the updates to.
                    // Note that this should never get used in a refill (when previousChanges is
                    // set), because there will only be adds -- no deletes or updates.
                    const c = _e(this.query) && s.size === this.query.limit ? s.last() : null, a = me(this.query) && s.size === this.query.limit ? s.first() : null;
                    // Drop documents out to meet limit/limitToLast requirement.
                    if (t.inorderTraversal((t, e)=>{
                        const u = s.get(t), h = Pe(this.query, e) ? e : null, l = !!u && this.mutatedKeys.has(u.key), f = !!h && (h.hasLocalMutations || // We only consider committed mutations for documents that were
                        // mutated during the lifetime of the view.
                        this.mutatedKeys.has(h.key) && h.hasCommittedMutations);
                        let d = !1;
                        u && h ? u.data.isEqual(h.data) ? l !== f && (n.track({
                            type: 3 /* Metadata */ ,
                            doc: h
                        }), d = !0) : this.vo(u, h) || (n.track({
                            type: 2 /* Modified */ ,
                            doc: h
                        }), d = !0, (c && this.Io(h, c) > 0 || a && 0 > this.Io(h, a)) && // This doc moved from inside the limit to outside the limit.
                        // That means there may be some other doc in the local cache
                        // that should be included instead.
                        (o = !0)) : !u && h ? (n.track({
                            type: 0 /* Added */ ,
                            doc: h
                        }), d = !0) : u && !h && (n.track({
                            type: 1 /* Removed */ ,
                            doc: u
                        }), d = !0, (c || a) && // A doc was removed from a full limit query. We'll need to
                        // requery from the local cache to see if we know about some other
                        // doc that should be in the results.
                        (o = !0)), d && (h ? (r = r.add(h), i = f ? i.add(t) : i.delete(t)) : (r = r.delete(t), i = i.delete(t)));
                    }), _e(this.query) || me(this.query)) for(; r.size > this.query.limit;){
                        const t = _e(this.query) ? r.last() : r.first();
                        r = r.delete(t.key), i = i.delete(t.key), n.track({
                            type: 1 /* Removed */ ,
                            doc: t
                        });
                    }
                    return {
                        Ao: r,
                        Po: n,
                        Ln: o,
                        mutatedKeys: i
                    };
                }
                vo(t, e) {
                    // We suppress the initial change event for documents that were modified as
                    // part of a write acknowledgment (e.g. when the value of a server transform
                    // is applied) as Watch will send us the same document again.
                    // By suppressing the event, we only raise two user visible events (one with
                    // `hasPendingWrites` and the final state of the document) instead of three
                    // (one with `hasPendingWrites`, the modified document with
                    // `hasPendingWrites` and the final state of the document).
                    return t.hasLocalMutations && e.hasCommittedMutations && !e.hasLocalMutations;
                }
                /**
                     * Updates the view with the given ViewDocumentChanges and optionally updates
                     * limbo docs and sync state from the provided target change.
                     * @param docChanges - The set of changes to make to the view's docs.
                     * @param updateLimboDocuments - Whether to update limbo documents based on
                     *        this change.
                     * @param targetChange - A target change to apply for computing limbo docs and
                     *        sync state.
                     * @returns A new ViewChange with the given docs, changes, and sync state.
                     */ // PORTING NOTE: The iOS/Android clients always compute limbo document changes.
                applyChanges(t, e, n) {
                    const s = this.Ao;
                    this.Ao = t.Ao, this.mutatedKeys = t.mutatedKeys;
                    // Sort changes based on type and query comparator
                    const i = t.Po.eo();
                    i.sort((t, e)=>(function(t, e) {
                            const n = (t)=>{
                                switch(t){
                                    case 0 /* Added */ :
                                        return 1;
                                    case 2 /* Modified */ :
                                    case 3 /* Metadata */ :
                                        // A metadata change is converted to a modified change at the public
                                        // api layer.  Since we sort by document key and then change type,
                                        // metadata and modified changes must be sorted equivalently.
                                        return 2;
                                    case 1 /* Removed */ :
                                        return 0;
                                    default:
                                        return L();
                                }
                            };
                            return n(t) - n(e);
                        })(/**
                                     * @license
                                     * Copyright 2020 Google LLC
                                     *
                                     * Licensed under the Apache License, Version 2.0 (the "License");
                                     * you may not use this file except in compliance with the License.
                                     * You may obtain a copy of the License at
                                     *
                                     *   http://www.apache.org/licenses/LICENSE-2.0
                                     *
                                     * Unless required by applicable law or agreed to in writing, software
                                     * distributed under the License is distributed on an "AS IS" BASIS,
                                     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                     * See the License for the specific language governing permissions and
                                     * limitations under the License.
                                     */ t.type, e.type) || this.Io(t.doc, e.doc)), this.Vo(n);
                    const r = e ? this.So() : [], o = 0 === this.Eo.size && this.current ? 1 /* Synced */  : 0 /* Local */ , c = o !== this.To;
                    return (this.To = o, 0 !== i.length || c) ? {
                        snapshot: new Fo(this.query, t.Ao, s, i, t.mutatedKeys, 0 /* Local */  === o, c, /* excludesMetadataChanges= */ !1),
                        Do: r
                    } : {
                        Do: r
                    };
                }
                /**
                     * Applies an OnlineState change to the view, potentially generating a
                     * ViewChange if the view's syncState changes as a result.
                     */ io(t) {
                    return this.current && "Offline" /* Offline */  === t ? // to refresh our syncState and generate a ViewChange as appropriate. We
                    // are guaranteed to get a new TargetChange that sets `current` back to
                    // true once the client is back online.
                    (this.current = !1, this.applyChanges({
                        Ao: this.Ao,
                        Po: new Oo(),
                        mutatedKeys: this.mutatedKeys,
                        Ln: !1
                    }, /* updateLimboDocuments= */ !1)) : {
                        Do: []
                    };
                }
                /**
                     * Returns whether the doc for the given key should be in limbo.
                     */ Co(t) {
                    // If the remote end says it's part of this query, it's not in limbo.
                    return !this.po.has(t) && // The local store doesn't think it's a result, so it shouldn't be in limbo.
                    !!this.Ao.has(t) && !this.Ao.get(t).hasLocalMutations;
                }
                /**
                     * Updates syncedDocuments, current, and limbo docs based on the given change.
                     * Returns the list of changes to which docs are in limbo.
                     */ Vo(t) {
                    t && (t.addedDocuments.forEach((t)=>this.po = this.po.add(t)), t.modifiedDocuments.forEach((t)=>{}), t.removedDocuments.forEach((t)=>this.po = this.po.delete(t)), this.current = t.current);
                }
                So() {
                    // We can only determine limbo documents when we're in-sync with the server.
                    if (!this.current) return [];
                    // TODO(klimt): Do this incrementally so that it's not quadratic when
                    // updating many documents.
                    const t = this.Eo;
                    this.Eo = Pn(), this.Ao.forEach((t)=>{
                        this.Co(t.key) && (this.Eo = this.Eo.add(t.key));
                    });
                    // Diff the new limbo docs with the old limbo docs.
                    const e = [];
                    return t.forEach((t)=>{
                        this.Eo.has(t) || e.push(new Yo(t));
                    }), this.Eo.forEach((n)=>{
                        t.has(n) || e.push(new Jo(n));
                    }), e;
                }
                /**
                     * Update the in-memory state of the current view with the state read from
                     * persistence.
                     *
                     * We update the query view whenever a client's primary status changes:
                     * - When a client transitions from primary to secondary, it can miss
                     *   LocalStorage updates and its query views may temporarily not be
                     *   synchronized with the state on disk.
                     * - For secondary to primary transitions, the client needs to update the list
                     *   of `syncedDocuments` since secondary clients update their query views
                     *   based purely on synthesized RemoteEvents.
                     *
                     * @param queryResult.documents - The documents that match the query according
                     * to the LocalStore.
                     * @param queryResult.remoteKeys - The keys of the documents that match the
                     * query according to the backend.
                     *
                     * @returns The ViewChange that resulted from this synchronization.
                     */ // PORTING NOTE: Multi-tab only.
                No(t) {
                    this.po = t.Gn, this.Eo = Pn();
                    const e = this.bo(t.documents);
                    return this.applyChanges(e, /*updateLimboDocuments=*/ !0);
                }
                /**
                     * Returns a view snapshot as if this query was just listened to. Contains
                     * a document add for every existing document and the `fromCache` and
                     * `hasPendingWrites` status of the already established view.
                     */ // PORTING NOTE: Multi-tab only.
                xo() {
                    return Fo.fromInitialDocuments(this.query, this.Ao, this.mutatedKeys, 0 /* Local */  === this.To);
                }
            }
            /**
                 * QueryView contains all of the data that SyncEngine needs to keep track of for
                 * a particular query.
                 */ class Zo {
                constructor(/**
                         * The query itself.
                         */ t, /**
                         * The target number created by the client that is used in the watch
                         * stream to identify this query.
                         */ e, /**
                         * The view is responsible for computing the final merged truth of what
                         * docs are in the query. It gets notified of local and remote changes,
                         * and applies the query filters and limits to determine the most correct
                         * possible results.
                         */ n){
                    this.query = t, this.targetId = e, this.view = n;
                }
            }
            /** Tracks a limbo resolution. */ class tc {
                constructor(t){
                    this.key = t, /**
                             * Set to true once we've received a document. This is used in
                             * getRemoteKeysForTarget() and ultimately used by WatchChangeAggregator to
                             * decide whether it needs to manufacture a delete event for the target once
                             * the target is CURRENT.
                             */ this.ko = !1;
                }
            }
            /**
                 * An implementation of `SyncEngine` coordinating with other parts of SDK.
                 *
                 * The parts of SyncEngine that act as a callback to RemoteStore need to be
                 * registered individually. This is done in `syncEngineWrite()` and
                 * `syncEngineListen()` (as well as `applyPrimaryState()`) as these methods
                 * serve as entry points to RemoteStore's functionality.
                 *
                 * Note: some field defined in this class might have public access level, but
                 * the class is not exported so they are only accessible from this module.
                 * This is useful to implement optional features (like bundles) in free
                 * functions, such that they are tree-shakeable.
                 */ class ec {
                constructor(t, e, n, // PORTING NOTE: Manages state synchronization in multi-tab environments.
                s, i, r){
                    this.localStore = t, this.remoteStore = e, this.eventManager = n, this.sharedClientState = s, this.currentUser = i, this.maxConcurrentLimboResolutions = r, this.$o = {}, this.Oo = new ji((t)=>Re(t), Ae), this.Fo = new Map(), /**
                             * The keys of documents that are in limbo for which we haven't yet started a
                             * limbo resolution query. The strings in this set are the result of calling
                             * `key.path.canonicalString()` where `key` is a `DocumentKey` object.
                             *
                             * The `Set` type was chosen because it provides efficient lookup and removal
                             * of arbitrary elements and it also maintains insertion order, providing the
                             * desired queue-like FIFO semantics.
                             */ this.Mo = new Set(), /**
                             * Keeps track of the target ID for each document that is in limbo with an
                             * active target.
                             */ this.Lo = new wn(Pt.comparator), /**
                             * Keeps track of the information about an active limbo resolution for each
                             * active target ID that was started for the purpose of limbo resolution.
                             */ this.Bo = new Map(), this.Uo = new br(), /** Stores user completion handlers, indexed by User and BatchId. */ this.qo = {}, /** Stores user callbacks waiting for all pending writes to be acknowledged. */ this.Ko = new Map(), this.jo = Ni.ie(), this.onlineState = "Unknown", // The primary state is set to `true` or `false` immediately after Firestore
                    // startup. In the interim, a client should only be considered primary if
                    // `isPrimary` is true.
                    this.Qo = void 0;
                }
                get isPrimaryClient() {
                    return !0 === this.Qo;
                }
            }
            /**
                 * Initiates the new listen, resolves promise when listen enqueued to the
                 * server. All the subsequent view snapshots or errors are sent to the
                 * subscribed handlers. Returns the initial snapshot.
                 */ async function nc(t, e) {
                var t1, e1;
                let s, i;
                const n = (t.remoteStore.remoteSyncer.applyRemoteEvent = oc.bind(null, t), t.remoteStore.remoteSyncer.getRemoteKeysForTarget = Ec.bind(null, t), t.remoteStore.remoteSyncer.rejectListen = ac.bind(null, t), t.$o.Rr = qo.bind(null, t.eventManager), t.$o.Go = Ko.bind(null, t.eventManager), t), r = n.Oo.get(e);
                if (r) // PORTING NOTE: With Multi-Tab Web, it is possible that a query view
                // already exists when EventManager calls us for the first time. This
                // happens when the primary tab is already listening to this query on
                // behalf of another tab and the user of the primary also starts listening
                // to the query. EventManager will not have an assigned target ID in this
                // case and calls `listen` to obtain this ID.
                s = r.targetId, n.sharedClientState.addLocalQueryTarget(s), i = r.view.xo();
                else {
                    const t = await (t1 = n.localStore, e1 = Ee(e), t1.persistence.runTransaction("Allocate target", "readwrite", (t)=>{
                        let s;
                        return t1.ze.getTargetData(t, e1).next((i)=>i ? // previous targetID.
                            // TODO(mcg): freshen last accessed date?
                            (s = i, js.resolve(s)) : t1.ze.allocateTargetId(t).next((i)=>(s = new ii(e1, i, 0 /* Listen */ , t.currentSequenceNumber), t1.ze.addTargetData(t, s).next(()=>s))));
                    }).then((t)=>{
                        // If Multi-Tab is enabled, the existing target data may be newer than
                        // the in-memory data
                        const s = t1.Un.get(t.targetId);
                        return (null === s || t.snapshotVersion.compareTo(s.snapshotVersion) > 0) && (t1.Un = t1.Un.insert(t.targetId, t), t1.qn.set(e1, t.targetId)), t;
                    })), r = n.sharedClientState.addLocalQueryTarget(t.targetId);
                    s = t.targetId, i = await sc(n, e, s, "current" === r), n.isPrimaryClient && co(n.remoteStore, t);
                }
                return i;
            }
            /**
                 * Registers a view for a previously unknown query and computes its initial
                 * snapshot.
                 */ async function sc(t, e, n, s) {
                // PORTING NOTE: On Web only, we inject the code that registers new Limbo
                // targets based on view changes. This allows us to only depend on Limbo
                // changes when user code includes queries.
                t.Wo = (e, n, s)=>(async function(t, e, n, s) {
                        let i = e.view.bo(n);
                        i.Ln && // The query has a limit and some docs were removed, so we need
                        // to re-run the query against the local store to make sure we
                        // didn't lose any good docs that had been past the limit.
                        (i = await yr(t.localStore, e.query, /* usePreviousResults= */ !1).then(({ documents: t })=>e.view.bo(t, i)));
                        const r = s && s.targetChanges.get(e.targetId), o = e.view.applyChanges(i, /* updateLimboDocuments= */ t.isPrimaryClient, r);
                        return mc(t, e.targetId, o.Do), o.snapshot;
                    })(t, e, n, s);
                const i = await yr(t.localStore, e, /* usePreviousResults= */ !0), r = new Xo(e, i.Gn), o = r.bo(i.documents), c = Dn.createSynthesizedTargetChangeForCurrentChange(n, s && "Offline" /* Offline */  !== t.onlineState), a = r.applyChanges(o, /* updateLimboDocuments= */ t.isPrimaryClient, c);
                mc(t, n, a.Do);
                const u = new Zo(e, n, r);
                return t.Oo.set(e, u), t.Fo.has(n) ? t.Fo.get(n).push(e) : t.Fo.set(n, [
                    e
                ]), a.snapshot;
            }
            /** Stops listening to the query. */ async function ic(t, e) {
                const s = t.Oo.get(e), i = t.Fo.get(s.targetId);
                if (i.length > 1) return t.Fo.set(s.targetId, i.filter((t)=>!Ae(t, e))), void t.Oo.delete(e);
                // No other queries are mapped to the target, clean up the query and the target.
                t.isPrimaryClient ? (// We need to remove the local query target first to allow us to verify
                // whether any other client is still interested in this target.
                t.sharedClientState.removeLocalQueryTarget(s.targetId), t.sharedClientState.isActiveQueryTarget(s.targetId) || await gr(t.localStore, s.targetId, /*keepPersistedTargetData=*/ !1).then(()=>{
                    t.sharedClientState.clearQueryState(s.targetId), ao(t.remoteStore, s.targetId), wc(t, s.targetId);
                }).catch(Fi)) : (wc(t, s.targetId), await gr(t.localStore, s.targetId, /*keepPersistedTargetData=*/ !0));
            }
            /**
                 * Applies one remote event to the sync engine, notifying any views of the
                 * changes, and releasing any pending mutation batches that would become
                 * visible because of the snapshot version the remote event contains.
                 */ async function oc(t, e) {
                try {
                    const t1 = await /**
                 * Updates the "ground-state" (remote) documents. We assume that the remote
                 * event reflects any write batches that have been acknowledged or rejected
                 * (i.e. we do not re-apply local mutations to updates from this event).
                 *
                 * LocalDocuments are re-calculated if there are remaining mutations in the
                 * queue.
                 */ function(t, e) {
                        const s = e.snapshotVersion;
                        let i = t.Un;
                        return t.persistence.runTransaction("Apply remote event", "readwrite-primary", (t1)=>{
                            var n, // TODO(wuandy): We could add `readTime` to MaybeDocument instead to remove
                            // this parameter.
                            i1;
                            let r;
                            const r1 = t.jn.newChangeBuffer({
                                trackRemovals: !0
                            });
                            // Reset newTargetDataByTargetMap in case this transaction gets re-run.
                            i = t.Un;
                            const o = [];
                            e.targetChanges.forEach((e, r)=>{
                                const c = i.get(r);
                                if (!c) return;
                                // Only update the remote keys if the target is still active. This
                                // ensures that we can persist the updated target data along with
                                // the updated assignment.
                                o.push(t.ze.removeMatchingKeys(t1, e.removedDocuments, r).next(()=>t.ze.addMatchingKeys(t1, e.addedDocuments, r)));
                                const a = e.resumeToken;
                                // Update the resume token if the change includes one.
                                if (a.approximateByteSize() > 0) {
                                    const u = c.withResumeToken(a, s).withSequenceNumber(t1.currentSequenceNumber);
                                    i = i.insert(r, u), u.resumeToken.approximateByteSize() > 0 || L(), (0 === /**
                                                 * Notifies local store of the changed views to locally pin documents.
                                                 */ c.resumeToken.approximateByteSize() || u.snapshotVersion.toMicroseconds() - c.snapshotVersion.toMicroseconds() >= 3e8 || e.addedDocuments.size + e.modifiedDocuments.size + e.removedDocuments.size > 0) && o.push(t.ze.updateTargetData(t1, u));
                                }
                            });
                            let c = pn;
                            // HACK: The only reason we allow a null snapshot version is so that we
                            // can synthesize remote events when we get permission denied errors while
                            // trying to resolve the state of a locally cached document that is in
                            // limbo.
                            if (e.documentUpdates.forEach((s, i)=>{
                                e.resolvedLimboDocuments.has(s) && o.push(t.persistence.referenceDelegate.updateLimboDocument(t1, s));
                            }), // Each loop iteration only affects its "own" doc, so it's safe to get all the remote
                            // documents in advance in a single call.
                            o.push((n = e.documentUpdates, i1 = void 0, r = Pn(), n.forEach((t)=>r = r.add(t)), r1.getEntries(t1, r).next((t)=>{
                                let r = pn;
                                return n.forEach((n, o)=>{
                                    const c = t.get(n), a = (null == i1 ? void 0 : i1.get(n)) || s;
                                    // Note: The order of the steps below is important, since we want
                                    // to ensure that rejected limbo resolutions (which fabricate
                                    // NoDocuments with SnapshotVersion.min()) never add documents to
                                    // cache.
                                    o.isNoDocument() && o.version.isEqual(rt.min()) ? // events. We remove these documents from cache since we lost
                                    // access.
                                    (r1.removeEntry(n, a), r = r.insert(n, o)) : !c.isValidDocument() || o.version.compareTo(c.version) > 0 || 0 === o.version.compareTo(c.version) && c.hasPendingWrites ? (r1.addEntry(o, a), r = r.insert(n, o)) : $("LocalStore", "Ignoring outdated watch update for ", n, ". Current version:", c.version, " Watch version:", o.version);
                                }), r;
                            })).next((t)=>{
                                c = t;
                            })), !s.isEqual(rt.min())) {
                                const e = t.ze.getLastRemoteSnapshotVersion(t1).next((e)=>t.ze.setTargetsMetadata(t1, t1.currentSequenceNumber, s));
                                o.push(e);
                            }
                            return js.waitFor(o).next(()=>r1.apply(t1)).next(()=>t.Qn.vn(t1, c)).next(()=>c);
                        }).then((t1)=>(t.Un = i, t1));
                    }(t.localStore, e);
                    // Update `receivedDocument` as appropriate for any limbo targets.
                    e.targetChanges.forEach((t1, e)=>{
                        const s = t.Bo.get(e);
                        s && // Since this is a limbo resolution lookup, it's for a single document
                        // and it could be added, modified, or removed, but not a combination.
                        (t1.addedDocuments.size + t1.modifiedDocuments.size + t1.removedDocuments.size <= 1 || L(), t1.addedDocuments.size > 0 ? s.ko = !0 : t1.modifiedDocuments.size > 0 ? s.ko || L() : t1.removedDocuments.size > 0 && (s.ko || L(), s.ko = !1));
                    }), await pc(t, t1, e);
                } catch (t) {
                    await Fi(t);
                }
            }
            /**
                 * Applies an OnlineState change to the sync engine and notifies any views of
                 * the change.
                 */ function cc(t, e, n) {
                var t1;
                // If we are the secondary client, we explicitly ignore the remote store's
                // online state (the local client may go offline, even though the primary
                // tab remains online) and only apply the primary tab's online state from
                // SharedClientState.
                if (t.isPrimaryClient && 0 /* RemoteStore */  === n || !t.isPrimaryClient && 1 /* SharedClientState */  === n) {
                    let s;
                    const t2 = [];
                    t.Oo.forEach((n, s)=>{
                        const i = s.view.io(e);
                        i.snapshot && t2.push(i.snapshot);
                    }), (t1 = t.eventManager).onlineState = e, s = !1, t1.queries.forEach((t, n)=>{
                        // Run global snapshot listeners if a consistent snapshot has been emitted.
                        for (const t of n.listeners)t.io(e) && (s = !0);
                    }), s && jo(t1), t2.length && t.$o.Rr(t2), t.onlineState = e, t.isPrimaryClient && t.sharedClientState.setOnlineState(e);
                }
            }
            /**
                 * Rejects the listen for the given targetID. This can be triggered by the
                 * backend for any active target.
                 *
                 * @param syncEngine - The sync engine implementation.
                 * @param targetId - The targetID corresponds to one previously initiated by the
                 * user as part of TargetData passed to listen() on RemoteStore.
                 * @param err - A description of the condition that has forced the rejection.
                 * Nearly always this will be an indication that the user is no longer
                 * authorized to see the data matching the target.
                 */ async function ac(t, e, n) {
                // PORTING NOTE: Multi-tab only.
                t.sharedClientState.updateQueryState(e, "rejected", n);
                const i = t.Bo.get(e), r = i && i.key;
                if (r) {
                    // TODO(klimt): We really only should do the following on permission
                    // denied errors, but we don't have the cause code here.
                    // It's a limbo doc. Create a synthetic event saying it was deleted.
                    // This is kind of a hack. Ideally, we would have a method in the local
                    // store to purge a document. However, it would be tricky to keep all of
                    // the local store's invariants with another method.
                    let t1 = new wn(Pt.comparator);
                    t1 = t1.insert(r, Kt.newNoDocument(r, rt.min()));
                    const n = Pn().add(r), i = new Sn(rt.min(), /* targetChanges= */ new Map(), /* targetMismatches= */ new gn(et), t1, n);
                    await oc(t, i), // Since this query failed, we won't want to manually unlisten to it.
                    // We only remove it from bookkeeping after we successfully applied the
                    // RemoteEvent. If `applyRemoteEvent()` throws, we want to re-listen to
                    // this query when the RemoteStore restarts the Watch stream, which should
                    // re-trigger the target failure.
                    t.Lo = t.Lo.remove(r), t.Bo.delete(e), yc(t);
                } else await gr(t.localStore, e, /* keepPersistedTargetData */ !1).then(()=>wc(t, e, n)).catch(Fi);
            }
            function wc(t, e, n = null) {
                for (const s of (t.sharedClientState.removeLocalQueryTarget(e), t.Fo.get(e)))t.Oo.delete(s), n && t.$o.Go(s, n);
                t.Fo.delete(e), t.isPrimaryClient && t.Uo.cs(e).forEach((e)=>{
                    t.Uo.containsKey(e) || // We removed the last reference for this key
                    _c(t, e);
                });
            }
            function _c(t, e) {
                t.Mo.delete(e.path.canonicalString());
                // It's possible that the target already got removed because the query failed. In that case,
                // the key won't exist in `limboTargetsByKey`. Only do the cleanup if we still have the target.
                const n = t.Lo.get(e);
                null !== n && (ao(t.remoteStore, n), t.Lo = t.Lo.remove(e), t.Bo.delete(n), yc(t));
            }
            function mc(t, e, n) {
                for (const s of n)s instanceof Jo ? (t.Uo.addReference(s.key, e), function(t, e) {
                    const n = e.key, s = n.path.canonicalString();
                    t.Lo.get(n) || t.Mo.has(s) || ($("SyncEngine", "New document in limbo: " + n), t.Mo.add(s), yc(t));
                }(t, s)) : s instanceof Yo ? ($("SyncEngine", "Document no longer in limbo: " + s.key), t.Uo.removeReference(s.key, e), t.Uo.containsKey(s.key) || // We removed the last reference for this key
                _c(t, s.key)) : L();
            }
            /**
                 * Starts listens for documents in limbo that are enqueued for resolution,
                 * subject to a maximum number of concurrent resolutions.
                 *
                 * Without bounding the number of concurrent resolutions, the server can fail
                 * with "resource exhausted" errors which can lead to pathological client
                 * behavior as seen in https://github.com/firebase/firebase-js-sdk/issues/2683.
                 */ function yc(t) {
                for(; t.Mo.size > 0 && t.Lo.size < t.maxConcurrentLimboResolutions;){
                    const e = t.Mo.values().next().value;
                    t.Mo.delete(e);
                    const n = new Pt(ht.fromString(e)), s = t.jo.next();
                    t.Bo.set(s, new tc(n)), t.Lo = t.Lo.insert(n, s), co(t.remoteStore, new ii(Ee(new fe(n.path)), s, 2 /* LimboResolution */ , X.T));
                }
            }
            async function pc(t, e, n) {
                const i = [], r = [], o = [];
                t.Oo.isEmpty() || (t.Oo.forEach((t1, c)=>{
                    o.push(t.Wo(c, e, n).then((t1)=>{
                        if (t1) {
                            t.isPrimaryClient && t.sharedClientState.updateQueryState(c.targetId, t1.fromCache ? "not-current" : "current"), i.push(t1);
                            const e = or.kn(c.targetId, t1);
                            r.push(e);
                        }
                    }));
                }), await Promise.all(o), t.$o.Rr(i), await async function(t, e) {
                    try {
                        await t.persistence.runTransaction("notifyLocalViewChanges", "readwrite", (t1)=>js.forEach(e, (e)=>js.forEach(e.Nn, (s)=>t.persistence.referenceDelegate.addReference(t1, e.targetId, s)).next(()=>js.forEach(e.xn, (s)=>t.persistence.referenceDelegate.removeReference(t1, e.targetId, s)))));
                    } catch (t) {
                        if (!Hs(t)) throw t;
                        // If `notifyLocalViewChanges` fails, we did not advance the sequence
                        // number for the documents that were included in this transaction.
                        // This might trigger them to be deleted earlier than they otherwise
                        // would have, but it should not invalidate the integrity of the data.
                        $("LocalStore", "Failed to update sequence numbers: " + t);
                    }
                    for (const t1 of e){
                        const e = t1.targetId;
                        if (!t1.fromCache) {
                            const t1 = t.Un.get(e), s = t1.snapshotVersion, i = t1.withLastLimboFreeSnapshotVersion(s);
                            // Advance the last limbo free snapshot version
                            t.Un = t.Un.insert(e, i);
                        }
                    }
                }(t.localStore, r));
            }
            async function Tc(t, e) {
                var e1;
                if (!t.currentUser.isEqual(e)) {
                    $("SyncEngine", "User change. New user:", e.toKey());
                    const t1 = await hr(t.localStore, e);
                    t.currentUser = e, e1 = "'waitForPendingWrites' promise is rejected due to a user change.", t.Ko.forEach((t)=>{
                        t.forEach((t)=>{
                            t.reject(new j(K.CANCELLED, e1));
                        });
                    }), t.Ko.clear(), // TODO(b/114226417): Consider calling this only in the primary tab.
                    t.sharedClientState.handleUserChange(e, t1.removedBatchIds, t1.addedBatchIds), await pc(t, t1.Wn);
                }
            }
            function Ec(t, e) {
                const s = t.Bo.get(e);
                if (s && s.ko) return Pn().add(s.key);
                {
                    let t1 = Pn();
                    const s = t.Fo.get(e);
                    if (!s) return t1;
                    for (const e of s){
                        const s = t.Oo.get(e);
                        t1 = t1.unionWith(s.view.Ro);
                    }
                    return t1;
                }
            }
            class kc {
                constructor(){
                    this.synchronizeTabs = !1;
                }
                async initialize(t) {
                    this.N = new Bn(t.databaseInfo.databaseId, /* useProto3Json= */ !0), this.sharedClientState = this.Ho(t), this.persistence = this.Jo(t), await this.persistence.start(), this.gcScheduler = this.Yo(t), this.localStore = this.Xo(t);
                }
                Yo(t) {
                    return null;
                }
                Xo(t) {
                    return new ar(this.persistence, new cr(), t.initialUser, this.N);
                }
                Jo(t) {
                    return new Cr(xr.Ns, this.N);
                }
                Ho(t) {
                    return new Kr();
                }
                async terminate() {
                    this.gcScheduler && this.gcScheduler.stop(), await this.sharedClientState.shutdown(), await this.persistence.shutdown();
                }
            }
            /**
                 * Initializes and wires the components that are needed to interface with the
                 * network.
                 */ class Fc {
                async initialize(t, e) {
                    this.localStore || (this.localStore = t.localStore, this.sharedClientState = t.sharedClientState, this.datastore = this.createDatastore(e), this.remoteStore = this.createRemoteStore(e), this.eventManager = this.createEventManager(e), this.syncEngine = this.createSyncEngine(e, /* startAsPrimary=*/ !t.synchronizeTabs), this.sharedClientState.onlineStateHandler = (t)=>cc(this.syncEngine, t, 1 /* SharedClientState */ ), this.remoteStore.remoteSyncer.handleCredentialChange = Tc.bind(null, this.syncEngine), await Do(this.remoteStore, this.syncEngine.isPrimaryClient));
                }
                createEventManager(t) {
                    return new Lo();
                }
                createDatastore(t) {
                    const e = new Bn(t.databaseInfo.databaseId, !0), n = new zr(t.databaseInfo);
                    /** Return the Platform-specific connectivity monitor. */ return new no(t.credentials, n, e);
                }
                createRemoteStore(t) {
                    return new io(this.localStore, this.datastore, t.asyncQueue, (t)=>cc(this.syncEngine, t, 0 /* RemoteStore */ ), Qr.bt() ? new Qr() : new jr());
                /** Re-enables the network. Idempotent. */ }
                createSyncEngine(t, e) {
                    return function(t, e, n, // PORTING NOTE: Manages state synchronization in multi-tab environments.
                    s, i, r, o) {
                        const c = new ec(t, e, n, s, i, r);
                        return o && (c.Qo = !0), c;
                    }(this.localStore, this.remoteStore, this.eventManager, this.sharedClientState, t.initialUser, t.maxConcurrentLimboResolutions, e);
                }
                terminate() {
                    return async function(t) {
                        $("RemoteStore", "RemoteStore shutting down."), t.Wr.add(5 /* Shutdown */ ), await oo(t), t.zr.shutdown(), // Set the OnlineState to Unknown (rather than Offline) to avoid potentially
                        // triggering spurious listener events with cached data, etc.
                        t.Hr.set("Unknown" /* Unknown */ );
                    }(this.remoteStore);
                }
            }
            /**
                 * @license
                 * Copyright 2020 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * On web, a `ReadableStream` is wrapped around by a `ByteStreamReader`.
                 */ /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /*
                 * A wrapper implementation of Observer<T> that will dispatch events
                 * asynchronously. To allow immediate silencing, a mute call is added which
                 * causes events scheduled to no longer be raised.
                 */ class Lc {
                constructor(t){
                    this.observer = t, /**
                             * When set to true, will not raise future events. Necessary to deal with
                             * async detachment of listener.
                             */ this.muted = !1;
                }
                next(t) {
                    this.observer.next && this.tc(this.observer.next, t);
                }
                error(t) {
                    this.observer.error ? this.tc(this.observer.error, t) : console.error("Uncaught Error in snapshot listener:", t);
                }
                ec() {
                    this.muted = !0;
                }
                tc(t, e) {
                    this.muted || setTimeout(()=>{
                        this.muted || t(e);
                    }, 0);
                }
            }
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * FirestoreClient is a top-level class that constructs and owns all of the
                 * pieces of the client SDK architecture. It is responsible for creating the
                 * async queue that is shared by all of the other components in the system.
                 */ class Kc {
                constructor(t, /**
                         * Asynchronous queue responsible for all of our internal processing. When
                         * we get incoming work from the user (via public API) or the network
                         * (incoming GRPC messages), we should always schedule onto this queue.
                         * This ensures all of our work is properly serialized (e.g. we don't
                         * start processing a new operation while the previous one is waiting for
                         * an async I/O to complete).
                         */ e, n){
                    this.credentials = t, this.asyncQueue = e, this.databaseInfo = n, this.user = D.UNAUTHENTICATED, this.clientId = tt.I(), this.credentialListener = ()=>Promise.resolve(), this.credentials.start(e, async (t)=>{
                        $("FirestoreClient", "Received user=", t.uid), await this.credentialListener(t), this.user = t;
                    });
                }
                async getConfiguration() {
                    return {
                        asyncQueue: this.asyncQueue,
                        databaseInfo: this.databaseInfo,
                        clientId: this.clientId,
                        credentials: this.credentials,
                        initialUser: this.user,
                        maxConcurrentLimboResolutions: 100
                    };
                }
                setCredentialChangeListener(t) {
                    this.credentialListener = t;
                }
                /**
                     * Checks that the client has not been terminated. Ensures that other methods on
                     * this class cannot be called after the client is terminated.
                     */ verifyNotTerminated() {
                    if (this.asyncQueue.isShuttingDown) throw new j(K.FAILED_PRECONDITION, "The client has already been terminated.");
                }
                terminate() {
                    this.asyncQueue.enterRestrictedMode();
                    const t = new Q();
                    return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async ()=>{
                        try {
                            this.onlineComponents && await this.onlineComponents.terminate(), this.offlineComponents && await this.offlineComponents.terminate(), // The credentials provider must be terminated after shutting down the
                            // RemoteStore as it will prevent the RemoteStore from retrieving auth
                            // tokens.
                            this.credentials.shutdown(), t.resolve();
                        } catch (e) {
                            const n = ko(e, "Failed to shutdown persistence");
                            t.reject(n);
                        }
                    }), t.promise;
                }
            }
            async function jc(t, e) {
                t.asyncQueue.verifyOperationInProgress(), $("FirestoreClient", "Initializing OfflineComponentProvider");
                const n = await t.getConfiguration();
                await e.initialize(n);
                let s = n.initialUser;
                t.setCredentialChangeListener(async (t)=>{
                    s.isEqual(t) || (await hr(e.localStore, t), s = t);
                }), // When a user calls clearPersistence() in one client, all other clients
                // need to be terminated to allow the delete to succeed.
                e.persistence.setDatabaseDeletedListener(()=>t.terminate()), t.offlineComponents = e;
            }
            async function Qc(t, e) {
                t.asyncQueue.verifyOperationInProgress();
                const n = await Wc(t);
                $("FirestoreClient", "Initializing OnlineComponentProvider");
                const s = await t.getConfiguration();
                await e.initialize(n, s), // The CredentialChangeListener of the online component provider takes
                // precedence over the offline component provider.
                t.setCredentialChangeListener((t)=>(async function(t, e) {
                        t.asyncQueue.verifyOperationInProgress(), $("RemoteStore", "RemoteStore received new credentials");
                        const s = wo(t);
                        // Tear down and re-create our network streams. This will ensure we get a
                        // fresh auth token for the new user and re-fill the write pipeline with
                        // new mutations from the LocalStore (since mutations are per-user).
                        t.Wr.add(3 /* CredentialChange */ ), await oo(t), s && // Don't set the network status to Unknown if we are offline.
                        t.Hr.set("Unknown" /* Unknown */ ), await t.remoteSyncer.handleCredentialChange(e), t.Wr.delete(3 /* CredentialChange */ ), await ro(t);
                    })(e.remoteStore, t)), t.onlineComponents = e;
            }
            async function Wc(t) {
                return t.offlineComponents || ($("FirestoreClient", "Using default OfflineComponentProvider"), await jc(t, new kc())), t.offlineComponents;
            }
            async function Gc(t) {
                return t.onlineComponents || ($("FirestoreClient", "Using default OnlineComponentProvider"), await Qc(t, new Fc())), t.onlineComponents;
            }
            async function Xc(t) {
                const e = await Gc(t), n = e.eventManager;
                return n.onListen = nc.bind(null, e.syncEngine), n.onUnlisten = ic.bind(null, e.syncEngine), n;
            }
            class ua {
                /**
                     * Constructs a DatabaseInfo using the provided host, databaseId and
                     * persistenceKey.
                     *
                     * @param databaseId - The database to use.
                     * @param appId - The Firebase App Id.
                     * @param persistenceKey - A unique identifier for this Firestore's local
                     * storage (used in conjunction with the databaseId).
                     * @param host - The Firestore backend host to connect to.
                     * @param ssl - Whether to use SSL when connecting.
                     * @param forceLongPolling - Whether to use the forceLongPolling option
                     * when using WebChannel as the network transport.
                     * @param autoDetectLongPolling - Whether to use the detectBufferingProxy
                     * option when using WebChannel as the network transport.
                     * @param useFetchStreams Whether to use the Fetch API instead of
                     * XMLHTTPRequest
                     */ constructor(t, e, n, s, i, r, o, c){
                    this.databaseId = t, this.appId = e, this.persistenceKey = n, this.host = s, this.ssl = i, this.forceLongPolling = r, this.autoDetectLongPolling = o, this.useFetchStreams = c;
                }
            }
            /** The default database name for a project. */ /**
                 * Represents the database ID a Firestore client is associated with.
                 * @internal
                 */ class ha {
                constructor(t, e){
                    this.projectId = t, this.database = e || "(default)";
                }
                get isDefaultDatabase() {
                    return "(default)" === this.database;
                }
                isEqual(t) {
                    return t instanceof ha && t.projectId === this.projectId && t.database === this.database;
                }
            }
            /**
                 * @license
                 * Copyright 2020 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ const la = new Map();
            /**
                 * Validates that `path` refers to a collection (indicated by the fact it
                 * contains an odd numbers of segments).
                 */ function _a(t) {
                if (Pt.isDocumentKey(t)) throw new j(K.INVALID_ARGUMENT, `Invalid collection reference. Collection references must have an odd number of segments, but ${t} has ${t.length}.`);
            }
            function ga(t, // eslint-disable-next-line @typescript-eslint/no-explicit-any
            e) {
                if ("_delegate" in t && // Unwrap Compat types
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (t = t._delegate), !(t instanceof e)) {
                    if (e.name === t.constructor.name) throw new j(K.INVALID_ARGUMENT, "Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");
                    {
                        const n = /**
                 * Returns true if it's a non-null object without a custom prototype
                 * (i.e. excludes Array, Date, etc.).
                 */ /** Returns a string describing the type / value of the provided input. */ function(t) {
                            if (void 0 === t) return "undefined";
                            if (null === t) return "null";
                            if ("string" == typeof t) return t.length > 20 && (t = `${t.substring(0, 20)}...`), JSON.stringify(t);
                            if ("number" == typeof t || "boolean" == typeof t) return "" + t;
                            if ("object" == typeof t) {
                                if (t instanceof Array) return "an array";
                                {
                                    var t1;
                                    const e = (t1 = /**
                                     * Casts `obj` to `T`, optionally unwrapping Compat types to expose the
                                     * underlying instance. Throws if  `obj` is not an instance of `T`.
                                     *
                                     * This cast is used in the Lite and Full SDK to verify instance types for
                                     * arguments passed to the public API.
                                     * @internal
                                     */ t).constructor ? t1.constructor.name : null;
                                    return e ? `a custom ${e} object` : "an object";
                                }
                            }
                            return "function" == typeof t ? "a function" : L();
                        }(t);
                        throw new j(K.INVALID_ARGUMENT, `Expected type '${e.name}', but it was: ${n}`);
                    }
                }
                return t;
            }
            /**
                 * @license
                 * Copyright 2020 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ // settings() defaults:
            /**
                 * A concrete type describing all the values that can be applied via a
                 * user-supplied `FirestoreSettings` object. This is a separate type so that
                 * defaults can be supplied and the value can be checked for equality.
                 */ class pa {
                constructor(t){
                    var e;
                    if (void 0 === t.host) {
                        if (void 0 !== t.ssl) throw new j(K.INVALID_ARGUMENT, "Can't provide ssl option if host option is not set");
                        this.host = "firestore.googleapis.com", this.ssl = !0;
                    } else this.host = t.host, this.ssl = null === (e = t.ssl) || void 0 === e || e;
                    if (this.credentials = t.credentials, this.ignoreUndefinedProperties = !!t.ignoreUndefinedProperties, void 0 === t.cacheSizeBytes) this.cacheSizeBytes = 41943040;
                    else {
                        if (-1 !== t.cacheSizeBytes && t.cacheSizeBytes < 1048576) throw new j(K.INVALID_ARGUMENT, "cacheSizeBytes must be at least 1048576");
                        this.cacheSizeBytes = t.cacheSizeBytes;
                    }
                    this.experimentalForceLongPolling = !!t.experimentalForceLongPolling, this.experimentalAutoDetectLongPolling = !!t.experimentalAutoDetectLongPolling, this.useFetchStreams = !!t.useFetchStreams, /**
                 * Validates that two boolean options are not set at the same time.
                 * @internal
                 */ function(t, e, n, s) {
                        if (!0 === e && !0 === s) throw new j(K.INVALID_ARGUMENT, `${t} and ${n} cannot be used together.`);
                    }("experimentalForceLongPolling", t.experimentalForceLongPolling, "experimentalAutoDetectLongPolling", t.experimentalAutoDetectLongPolling);
                }
                isEqual(t) {
                    return this.host === t.host && this.ssl === t.ssl && this.credentials === t.credentials && this.cacheSizeBytes === t.cacheSizeBytes && this.experimentalForceLongPolling === t.experimentalForceLongPolling && this.experimentalAutoDetectLongPolling === t.experimentalAutoDetectLongPolling && this.ignoreUndefinedProperties === t.ignoreUndefinedProperties && this.useFetchStreams === t.useFetchStreams;
                }
            }
            /**
                 * @license
                 * Copyright 2020 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * The Cloud Firestore service interface.
                 *
                 * Do not call this constructor directly. Instead, use {@link getFirestore}.
                 */ class Ta {
                /** @hideconstructor */ constructor(t, e){
                    this._credentials = e, /**
                             * Whether it's a Firestore or Firestore Lite instance.
                             */ this.type = "firestore-lite", this._persistenceKey = "(lite)", this._settings = new pa({}), this._settingsFrozen = !1, t instanceof ha ? this._databaseId = t : (this._app = t, this._databaseId = function(t) {
                        if (!Object.prototype.hasOwnProperty.apply(t.options, [
                            "projectId"
                        ])) throw new j(K.INVALID_ARGUMENT, '"projectId" not provided in firebase.initializeApp.');
                        return new ha(t.options.projectId);
                    }(/**
                                       * Modify this instance to communicate with the Cloud Firestore emulator.
                                       *
                                       * Note: This must be called before this instance has been used to do any
                                       * operations.
                                       *
                                       * @param firestore - The `Firestore` instance to configure to connect to the
                                       * emulator.
                                       * @param host - the emulator host (ex: localhost).
                                       * @param port - the emulator port (ex: 9000).
                                       * @param options.mockUserToken - the mock auth token to use for unit testing
                                       * Security Rules.
                                       */ t));
                }
                /**
                     * The {@link @firebase/app#FirebaseApp} associated with this `Firestore` service
                     * instance.
                     */ get app() {
                    if (!this._app) throw new j(K.FAILED_PRECONDITION, "Firestore was not initialized using the Firebase SDK. 'app' is not available");
                    return this._app;
                }
                get _initialized() {
                    return this._settingsFrozen;
                }
                get _terminated() {
                    return void 0 !== this._terminateTask;
                }
                _setSettings(t) {
                    if (this._settingsFrozen) throw new j(K.FAILED_PRECONDITION, "Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");
                    this._settings = new pa(t), void 0 !== t.credentials && (this._credentials = function(t) {
                        if (!t) return new G();
                        switch(t.type){
                            case "gapi":
                                const e = t.client;
                                // Make sure this really is a Gapi client.
                                return "object" == typeof e && null !== e && e.auth && e.auth.getAuthHeaderValueForFirstParty || L(), new Y(e, t.sessionIndex || "0", t.iamToken || null);
                            case "provider":
                                return t.client;
                            default:
                                throw new j(K.INVALID_ARGUMENT, "makeCredentialsProvider failed due to invalid credential type");
                        }
                    }(t.credentials));
                }
                _getSettings() {
                    return this._settings;
                }
                _freezeSettings() {
                    return this._settingsFrozen = !0, this._settings;
                }
                _delete() {
                    return this._terminateTask || (this._terminateTask = this._terminate()), this._terminateTask;
                }
                /** Returns a JSON-serializable representation of this `Firestore` instance. */ toJSON() {
                    return {
                        app: this._app,
                        databaseId: this._databaseId,
                        settings: this._settings
                    };
                }
                /**
                     * Terminates all components used by this client. Subclasses can override
                     * this method to clean up their own dependencies, but must also call this
                     * method.
                     *
                     * Only ever called once.
                     */ _terminate() {
                    /**
                         * Removes all components associated with the provided instance. Must be called
                         * when the `Firestore` instance is terminated.
                         */ return function(t) {
                        const e = la.get(t);
                        e && ($("ComponentProvider", "Removing Datastore"), la.delete(t), e.terminate());
                    }(this), Promise.resolve();
                }
            }
            /**
                 * @license
                 * Copyright 2020 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * A `DocumentReference` refers to a document location in a Firestore database
                 * and can be used to write, read, or listen to the location. The document at
                 * the referenced location may or may not exist.
                 */ class Ia {
                /** @hideconstructor */ constructor(t, /**
                         * If provided, the `FirestoreDataConverter` associated with this instance.
                         */ e, n){
                    this.converter = e, this._key = n, /** The type of this Firestore reference. */ this.type = "document", this.firestore = t;
                }
                get _path() {
                    return this._key.path;
                }
                /**
                     * The document's identifier within its collection.
                     */ get id() {
                    return this._key.path.lastSegment();
                }
                /**
                     * A string representing the path of the referenced document (relative
                     * to the root of the database).
                     */ get path() {
                    return this._key.path.canonicalString();
                }
                /**
                     * The collection this `DocumentReference` belongs to.
                     */ get parent() {
                    return new Ra(this.firestore, this.converter, this._key.path.popLast());
                }
                withConverter(t) {
                    return new Ia(this.firestore, t, this._key);
                }
            }
            /**
                 * A `Query` refers to a query which you can read or listen to. You can also
                 * construct refined `Query` objects by adding filters and ordering.
                 */ class Aa {
                // This is the lite version of the Query class in the main SDK.
                /** @hideconstructor protected */ constructor(t, /**
                         * If provided, the `FirestoreDataConverter` associated with this instance.
                         */ e, n){
                    this.converter = e, this._query = n, /** The type of this Firestore reference. */ this.type = "query", this.firestore = t;
                }
                withConverter(t) {
                    return new Aa(this.firestore, t, this._query);
                }
            }
            /**
                 * A `CollectionReference` object can be used for adding documents, getting
                 * document references, and querying for documents (using {@link query}).
                 */ class Ra extends Aa {
                /** @hideconstructor */ constructor(t, e, n){
                    super(t, e, new fe(n)), this._path = n, /** The type of this Firestore reference. */ this.type = "collection";
                }
                /** The collection's identifier. */ get id() {
                    return this._query.path.lastSegment();
                }
                /**
                     * A string representing the path of the referenced collection (relative
                     * to the root of the database).
                     */ get path() {
                    return this._query.path.canonicalString();
                }
                /**
                     * A reference to the containing `DocumentReference` if this is a
                     * subcollection. If this isn't a subcollection, the reference is null.
                     */ get parent() {
                    const t = this._path.popLast();
                    return t.isEmpty() ? null : new Ia(this.firestore, /* converter= */ null, new Pt(t));
                }
                withConverter(t) {
                    return new Ra(this.firestore, t, this._path);
                }
            }
            function ba(t, e, ...n) {
                if (t = (0, _firebase_util__WEBPACK_IMPORTED_MODULE_3__ /* .getModularInstance */ .m9)(t), /**
                 * An instance map that ensures only one Datastore exists per Firestore
                 * instance.
                 */ /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ function(t, e, n) {
                    if (!n) throw new j(K.INVALID_ARGUMENT, `Function ${t}() cannot be called with an empty ${e}.`);
                }("collection", "path", e), t instanceof Ta) {
                    const s = ht.fromString(e, ...n);
                    return _a(s), new Ra(t, /* converter= */ null, s);
                }
                {
                    if (!(t instanceof Ia || t instanceof Ra)) throw new j(K.INVALID_ARGUMENT, "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
                    const s = t._path.child(ht.fromString(e, ...n));
                    return _a(s), new Ra(t.firestore, /* converter= */ null, s);
                }
            }
            /**
                 * @license
                 * Copyright 2020 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ class Da {
                constructor(){
                    // The last promise in the queue.
                    this._c = Promise.resolve(), // A list of retryable operations. Retryable operations are run in order and
                    // retried with backoff.
                    this.mc = [], // Is this AsyncQueue being shut down? Once it is set to true, it will not
                    // be changed again.
                    this.gc = !1, // Operations scheduled to be queued in the future. Operations are
                    // automatically removed after they are run or canceled.
                    this.yc = [], // visible for testing
                    this.Tc = null, // Flag set while there's an outstanding AsyncQueue operation, used for
                    // assertion sanity-checks.
                    this.Ec = !1, // Enabled during shutdown on Safari to prevent future access to IndexedDB.
                    this.Ic = !1, // List of TimerIds to fast-forward delays for.
                    this.Ac = [], // Backoff timer used to schedule retries for retryable operations
                    this.ar = new Xr(this, "async_queue_retry" /* AsyncQueueRetry */ ), // Visibility handler that triggers an immediate retry of all retryable
                    // operations. Meant to speed up recovery when we regain file system access
                    // after page comes into foreground.
                    this.Rc = ()=>{
                        const t = Jr();
                        t && $("AsyncQueue", "Visibility state changed to " + t.visibilityState), this.ar.tr();
                    };
                    const t = Jr();
                    t && "function" == typeof t.addEventListener && t.addEventListener("visibilitychange", this.Rc);
                }
                get isShuttingDown() {
                    return this.gc;
                }
                /**
                     * Adds a new operation to the queue without waiting for it to complete (i.e.
                     * we ignore the Promise result).
                     */ enqueueAndForget(t) {
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    this.enqueue(t);
                }
                enqueueAndForgetEvenWhileRestricted(t) {
                    this.bc(), // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    this.Pc(t);
                }
                enterRestrictedMode(t) {
                    if (!this.gc) {
                        this.gc = !0, this.Ic = t || !1;
                        const e = Jr();
                        e && "function" == typeof e.removeEventListener && e.removeEventListener("visibilitychange", this.Rc);
                    }
                }
                enqueue(t) {
                    if (this.bc(), this.gc) // Return a Promise which never resolves.
                    return new Promise(()=>{});
                    // Create a deferred Promise that we can return to the callee. This
                    // allows us to return a "hanging Promise" only to the callee and still
                    // advance the queue even when the operation is not run.
                    const e = new Q();
                    return this.Pc(()=>this.gc && this.Ic ? Promise.resolve() : (t().then(e.resolve, e.reject), e.promise)).then(()=>e.promise);
                }
                enqueueRetryable(t) {
                    this.enqueueAndForget(()=>(this.mc.push(t), this.vc()));
                }
                /**
                     * Runs the next operation from the retryable queue. If the operation fails,
                     * reschedules with backoff.
                     */ async vc() {
                    if (0 !== this.mc.length) {
                        try {
                            await this.mc[0](), this.mc.shift(), this.ar.reset();
                        } catch (t) {
                            if (!Hs(t)) throw t;
                            // Failure will be handled by AsyncQueue
                            $("AsyncQueue", "Operation failed with retryable error: " + t);
                        }
                        this.mc.length > 0 && // If there are additional operations, we re-schedule `retryNextOp()`.
                        // This is necessary to run retryable operations that failed during
                        // their initial attempt since we don't know whether they are already
                        // enqueued. If, for example, `op1`, `op2`, `op3` are enqueued and `op1`
                        // needs to  be re-run, we will run `op1`, `op1`, `op2` using the
                        // already enqueued calls to `retryNextOp()`. `op3()` will then run in the
                        // call scheduled here.
                        // Since `backoffAndRun()` cancels an existing backoff and schedules a
                        // new backoff on every call, there is only ever a single additional
                        // operation in the queue.
                        this.ar.Xi(()=>this.vc());
                    }
                }
                Pc(t) {
                    const e = this._c.then(()=>(this.Ec = !0, t().catch((t)=>{
                            let e;
                            // Re-throw the error so that this.tail becomes a rejected Promise and
                            // all further attempts to chain (via .then) will just short-circuit
                            // and return the rejected Promise.
                            throw this.Tc = t, this.Ec = !1, O("INTERNAL UNHANDLED ERROR: ", (e = /**
                                                 * @license
                                                 * Copyright 2017 Google LLC
                                                 *
                                                 * Licensed under the Apache License, Version 2.0 (the "License");
                                                 * you may not use this file except in compliance with the License.
                                                 * You may obtain a copy of the License at
                                                 *
                                                 *   http://www.apache.org/licenses/LICENSE-2.0
                                                 *
                                                 * Unless required by applicable law or agreed to in writing, software
                                                 * distributed under the License is distributed on an "AS IS" BASIS,
                                                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                 * See the License for the specific language governing permissions and
                                                 * limitations under the License.
                                                 */ t.message || "", t.stack && (e = t.stack.includes(t.message) ? t.stack : t.message + "\n" + t.stack), e)), t;
                        }).then((t)=>(this.Ec = !1, t))));
                    return this._c = e, e;
                }
                enqueueAfterDelay(t, e, n) {
                    this.bc(), // Fast-forward delays for timerIds that have been overriden.
                    this.Ac.indexOf(t) > -1 && (e = 0);
                    const s = xo.createAndSchedule(this, t, e, n, (t)=>this.Vc(t));
                    return this.yc.push(s), s;
                }
                bc() {
                    this.Tc && L();
                }
                verifyOperationInProgress() {}
                /**
                     * Waits until all currently queued tasks are finished executing. Delayed
                     * operations are not run.
                     */ async Sc() {
                    // Operations in the queue prior to draining may have enqueued additional
                    // operations. Keep draining the queue until the tail is no longer advanced,
                    // which indicates that no more new operations were enqueued and that all
                    // operations were executed.
                    let t;
                    do t = this._c, await t;
                    while (t !== this._c)
                }
                /**
                     * For Tests: Determine if a delayed operation with a particular TimerId
                     * exists.
                     */ Dc(t) {
                    for (const e of this.yc)if (e.timerId === t) return !0;
                    return !1;
                }
                /**
                     * For Tests: Runs some or all delayed operations early.
                     *
                     * @param lastTimerId - Delayed operations up to and including this TimerId
                     * will be drained. Pass TimerId.All to run all delayed operations.
                     * @returns a Promise that resolves once all operations have been run.
                     */ Cc(t) {
                    // Note that draining may generate more delayed ops, so we do that first.
                    return this.Sc().then(()=>{
                        for (const e of (// Run ops in the same order they'd run if they ran naturally.
                        this.yc.sort((t, e)=>t.targetTimeMs - e.targetTimeMs), this.yc))if (e.skipDelay(), "all" /* All */  !== t && e.timerId === t) break;
                        return this.Sc();
                    });
                }
                /**
                     * For Tests: Skip all subsequent delays for a timer id.
                     */ Nc(t) {
                    this.Ac.push(t);
                }
                /** Called once a DelayedOperation is run or canceled. */ Vc(t) {
                    // NOTE: indexOf / slice are O(n), but delayedOperations is expected to be small.
                    const e = this.yc.indexOf(t);
                    this.yc.splice(e, 1);
                }
            }
            /**
                 * The Cloud Firestore service interface.
                 *
                 * Do not call this constructor directly. Instead, use {@link getFirestore}.
                 */ class ka extends Ta {
                /** @hideconstructor */ constructor(t, e){
                    super(t, e), /**
                             * Whether it's a {@link Firestore} or Firestore Lite instance.
                             */ this.type = "firestore", this._queue = new Da(), this._persistenceKey = "name" in t ? t.name : "[DEFAULT]";
                }
                _terminate() {
                    return this._firestoreClient || // The client must be initialized to ensure that all subsequent API
                    // usage throws an exception.
                    Ma(this), this._firestoreClient.terminate();
                }
            }
            function Ma(t) {
                var e;
                const n = t._freezeSettings(), s = new ua(t._databaseId, (null === (e = t._app) || void 0 === e ? void 0 : e.options.appId) || "", t._persistenceKey, n.host, n.ssl, n.experimentalForceLongPolling, n.experimentalAutoDetectLongPolling, n.useFetchStreams);
                t._firestoreClient = new Kc(t._credentials, t._queue, s);
            }
            /**
                 * @license
                 * Copyright 2020 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * @license
                 * Copyright 2020 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * A `FieldPath` refers to a field in a document. The path may consist of a
                 * single field name (referring to a top-level field in the document), or a
                 * list of field names (referring to a nested field in the document).
                 *
                 * Create a `FieldPath` by providing field names. If more than one field
                 * name is provided, the path will point to a nested field in a document.
                 */ class Ja {
                /**
                     * Creates a `FieldPath` from the provided field names. If more than one field
                     * name is provided, the path will point to a nested field in a document.
                     *
                     * @param fieldNames - A list of field names.
                     */ constructor(...t){
                    for(let e = 0; e < t.length; ++e)if (0 === t[e].length) throw new j(K.INVALID_ARGUMENT, "Invalid field name at argument $(i + 1). Field names must not be empty.");
                    this._internalPath = new ft(t);
                }
                /**
                     * Returns true if this `FieldPath` is equal to the provided one.
                     *
                     * @param other - The `FieldPath` to compare against.
                     * @returns true if this `FieldPath` is equal to the provided one.
                     */ isEqual(t) {
                    return this._internalPath.isEqual(t._internalPath);
                }
            }
            /**
                 * @license
                 * Copyright 2020 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * An immutable object representing an array of bytes.
                 */ class Xa {
                /** @hideconstructor */ constructor(t){
                    this._byteString = t;
                }
                /**
                     * Creates a new `Bytes` object from the given Base64 string, converting it to
                     * bytes.
                     *
                     * @param base64 - The Base64 string used to create the `Bytes` object.
                     */ static fromBase64String(t) {
                    try {
                        return new Xa(_t.fromBase64String(t));
                    } catch (t) {
                        throw new j(K.INVALID_ARGUMENT, "Failed to construct data from Base64 string: " + t);
                    }
                }
                /**
                     * Creates a new `Bytes` object from the given Uint8Array.
                     *
                     * @param array - The Uint8Array used to create the `Bytes` object.
                     */ static fromUint8Array(t) {
                    return new Xa(_t.fromUint8Array(t));
                }
                /**
                     * Returns the underlying bytes as a Base64-encoded string.
                     *
                     * @returns The Base64-encoded string created from the `Bytes` object.
                     */ toBase64() {
                    return this._byteString.toBase64();
                }
                /**
                     * Returns the underlying bytes in a new `Uint8Array`.
                     *
                     * @returns The Uint8Array created from the `Bytes` object.
                     */ toUint8Array() {
                    return this._byteString.toUint8Array();
                }
                /**
                     * Returns a string representation of the `Bytes` object.
                     *
                     * @returns A string representation of the `Bytes` object.
                     */ toString() {
                    return "Bytes(base64: " + this.toBase64() + ")";
                }
                /**
                     * Returns true if this `Bytes` object is equal to the provided one.
                     *
                     * @param other - The `Bytes` object to compare against.
                     * @returns true if this `Bytes` object is equal to the provided one.
                     */ isEqual(t) {
                    return this._byteString.isEqual(t._byteString);
                }
            }
            /**
                 * @license
                 * Copyright 2017 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * An immutable object representing a geographic location in Firestore. The
                 * location is represented as latitude/longitude pair.
                 *
                 * Latitude values are in the range of [-90, 90].
                 * Longitude values are in the range of [-180, 180].
                 */ class tu {
                /**
                     * Creates a new immutable `GeoPoint` object with the provided latitude and
                     * longitude values.
                     * @param latitude - The latitude as number between -90 and 90.
                     * @param longitude - The longitude as number between -180 and 180.
                     */ constructor(t, e){
                    if (!isFinite(t) || t < -90 || t > 90) throw new j(K.INVALID_ARGUMENT, "Latitude must be a number between -90 and 90, but was: " + t);
                    if (!isFinite(e) || e < -180 || e > 180) throw new j(K.INVALID_ARGUMENT, "Longitude must be a number between -180 and 180, but was: " + e);
                    this._lat = t, this._long = e;
                }
                /**
                     * The latitude of this `GeoPoint` instance.
                     */ get latitude() {
                    return this._lat;
                }
                /**
                     * The longitude of this `GeoPoint` instance.
                     */ get longitude() {
                    return this._long;
                }
                /**
                     * Returns true if this `GeoPoint` is equal to the provided one.
                     *
                     * @param other - The `GeoPoint` to compare against.
                     * @returns true if this `GeoPoint` is equal to the provided one.
                     */ isEqual(t) {
                    return this._lat === t._lat && this._long === t._long;
                }
                /** Returns a JSON-serializable representation of this GeoPoint. */ toJSON() {
                    return {
                        latitude: this._lat,
                        longitude: this._long
                    };
                }
                /**
                     * Actually private to JS consumers of our API, so this function is prefixed
                     * with an underscore.
                     */ _compareTo(t) {
                    return et(this._lat, t._lat) || et(this._long, t._long);
                }
            }
            /**
                 * Matches any characters in a field path string that are reserved.
                 */ const Au = RegExp("[~\\*/\\[\\]]");
            function bu(t, e, n, s, i) {
                const r = s && !s.isEmpty(), o = void 0 !== i;
                let c = `Function ${e}() called with invalid data`;
                n && (c += " (via `toFirestore()`)"), c += ". ";
                let a = "";
                return (r || o) && (a += " (found", r && (a += ` in field ${s}`), o && (a += ` in document ${i}`), a += ")"), new j(K.INVALID_ARGUMENT, c + t + a);
            }
            /**
                 * @license
                 * Copyright 2020 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * A `DocumentSnapshot` contains data read from a document in your Firestore
                 * database. The data can be extracted with `.data()` or `.get(<field>)` to
                 * get a specific field.
                 *
                 * For a `DocumentSnapshot` that points to a non-existing document, any data
                 * access will return 'undefined'. You can use the `exists()` method to
                 * explicitly verify a document's existence.
                 */ class vu {
                // Note: This class is stripped down version of the DocumentSnapshot in
                // the legacy SDK. The changes are:
                // - No support for SnapshotMetadata.
                // - No support for SnapshotOptions.
                /** @hideconstructor protected */ constructor(t, e, n, s, i){
                    this._firestore = t, this._userDataWriter = e, this._key = n, this._document = s, this._converter = i;
                }
                /** Property of the `DocumentSnapshot` that provides the document's ID. */ get id() {
                    return this._key.path.lastSegment();
                }
                /**
                     * The `DocumentReference` for the document included in the `DocumentSnapshot`.
                     */ get ref() {
                    return new Ia(this._firestore, this._converter, this._key);
                }
                /**
                     * Signals whether or not the document at the snapshot's location exists.
                     *
                     * @returns true if the document exists.
                     */ exists() {
                    return null !== this._document;
                }
                /**
                     * Retrieves all fields in the document as an `Object`. Returns `undefined` if
                     * the document doesn't exist.
                     *
                     * @returns An `Object` containing all fields in the document or `undefined`
                     * if the document doesn't exist.
                     */ data() {
                    if (this._document) {
                        if (this._converter) {
                            // We only want to use the converter and create a new DocumentSnapshot
                            // if a converter has been provided.
                            const t = new Vu(this._firestore, this._userDataWriter, this._key, this._document, /* converter= */ null);
                            return this._converter.fromFirestore(t);
                        }
                        return this._userDataWriter.convertValue(this._document.data.value);
                    }
                }
                /**
                     * Retrieves the field specified by `fieldPath`. Returns `undefined` if the
                     * document or field doesn't exist.
                     *
                     * @param fieldPath - The path (for example 'foo' or 'foo.bar') to a specific
                     * field.
                     * @returns The data at the specified field location or undefined if no such
                     * field exists in the document.
                     */ // We are using `any` here to avoid an explicit cast by our users.
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                get(t) {
                    if (this._document) {
                        const e = this._document.data.field(Su("DocumentSnapshot.get", t));
                        if (null !== e) return this._userDataWriter.convertValue(e);
                    }
                }
            }
            /**
                 * A `QueryDocumentSnapshot` contains data read from a document in your
                 * Firestore database as part of a query. The document is guaranteed to exist
                 * and its data can be extracted with `.data()` or `.get(<field>)` to get a
                 * specific field.
                 *
                 * A `QueryDocumentSnapshot` offers the same API surface as a
                 * `DocumentSnapshot`. Since query results contain only existing documents, the
                 * `exists` property will always be true and `data()` will never return
                 * 'undefined'.
                 */ class Vu extends vu {
                /**
                     * Retrieves all fields in the document as an `Object`.
                     *
                     * @override
                     * @returns An `Object` containing all fields in the document.
                     */ data() {
                    return super.data();
                }
            }
            /**
                 * Helper that calls `fromDotSeparatedString()` but wraps any error thrown.
                 */ function Su(t, e) {
                return "string" == typeof e ? /**
                 * Wraps fromDotSeparatedString with an error message about the method that
                 * was thrown.
                 * @param methodName - The publicly visible method name
                 * @param path - The dot-separated string form of a field path which will be
                 * split on dots.
                 * @param targetDoc - The document against which the field path will be
                 * evaluated.
                 */ function(t, e, n) {
                    if (e.search(Au) >= 0) throw bu(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`, t, /* hasConverter= */ !1, /* path= */ void 0, void 0);
                    try {
                        return new Ja(...e.split("."))._internalPath;
                    } catch (s) {
                        throw bu(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`, t, /* hasConverter= */ !1, /* path= */ void 0, void 0);
                    }
                }(t, e) : e instanceof Ja ? e._internalPath : e._delegate._internalPath;
            }
            /**
                 * @license
                 * Copyright 2020 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * Metadata about a snapshot, describing the state of the snapshot.
                 */ class Du {
                /** @hideconstructor */ constructor(t, e){
                    this.hasPendingWrites = t, this.fromCache = e;
                }
                /**
                     * Returns true if this `SnapshotMetadata` is equal to the provided one.
                     *
                     * @param other - The `SnapshotMetadata` to compare against.
                     * @returns true if this `SnapshotMetadata` is equal to the provided one.
                     */ isEqual(t) {
                    return this.hasPendingWrites === t.hasPendingWrites && this.fromCache === t.fromCache;
                }
            }
            /**
                 * A `DocumentSnapshot` contains data read from a document in your Firestore
                 * database. The data can be extracted with `.data()` or `.get(<field>)` to
                 * get a specific field.
                 *
                 * For a `DocumentSnapshot` that points to a non-existing document, any data
                 * access will return 'undefined'. You can use the `exists()` method to
                 * explicitly verify a document's existence.
                 */ class Cu extends vu {
                /** @hideconstructor protected */ constructor(t, e, n, s, i, r){
                    super(t, e, n, s, r), this._firestore = t, this._firestoreImpl = t, this.metadata = i;
                }
                /**
                     * Property of the `DocumentSnapshot` that signals whether or not the data
                     * exists. True if the document exists.
                     */ exists() {
                    return super.exists();
                }
                /**
                     * Retrieves all fields in the document as an `Object`. Returns `undefined` if
                     * the document doesn't exist.
                     *
                     * By default, `FieldValue.serverTimestamp()` values that have not yet been
                     * set to their final value will be returned as `null`. You can override
                     * this by passing an options object.
                     *
                     * @param options - An options object to configure how data is retrieved from
                     * the snapshot (for example the desired behavior for server timestamps that
                     * have not yet been set to their final value).
                     * @returns An `Object` containing all fields in the document or `undefined` if
                     * the document doesn't exist.
                     */ data(t = {}) {
                    if (this._document) {
                        if (this._converter) {
                            // We only want to use the converter and create a new DocumentSnapshot
                            // if a converter has been provided.
                            const e = new Nu(this._firestore, this._userDataWriter, this._key, this._document, this.metadata, /* converter= */ null);
                            return this._converter.fromFirestore(e, t);
                        }
                        return this._userDataWriter.convertValue(this._document.data.value, t.serverTimestamps);
                    }
                }
                /**
                     * Retrieves the field specified by `fieldPath`. Returns `undefined` if the
                     * document or field doesn't exist.
                     *
                     * By default, a `FieldValue.serverTimestamp()` that has not yet been set to
                     * its final value will be returned as `null`. You can override this by
                     * passing an options object.
                     *
                     * @param fieldPath - The path (for example 'foo' or 'foo.bar') to a specific
                     * field.
                     * @param options - An options object to configure how the field is retrieved
                     * from the snapshot (for example the desired behavior for server timestamps
                     * that have not yet been set to their final value).
                     * @returns The data at the specified field location or undefined if no such
                     * field exists in the document.
                     */ // We are using `any` here to avoid an explicit cast by our users.
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                get(t, e = {}) {
                    if (this._document) {
                        const n = this._document.data.field(Su("DocumentSnapshot.get", t));
                        if (null !== n) return this._userDataWriter.convertValue(n, e.serverTimestamps);
                    }
                }
            }
            /**
                 * A `QueryDocumentSnapshot` contains data read from a document in your
                 * Firestore database as part of a query. The document is guaranteed to exist
                 * and its data can be extracted with `.data()` or `.get(<field>)` to get a
                 * specific field.
                 *
                 * A `QueryDocumentSnapshot` offers the same API surface as a
                 * `DocumentSnapshot`. Since query results contain only existing documents, the
                 * `exists` property will always be true and `data()` will never return
                 * 'undefined'.
                 */ class Nu extends Cu {
                /**
                     * Retrieves all fields in the document as an `Object`.
                     *
                     * By default, `FieldValue.serverTimestamp()` values that have not yet been
                     * set to their final value will be returned as `null`. You can override
                     * this by passing an options object.
                     *
                     * @override
                     * @param options - An options object to configure how data is retrieved from
                     * the snapshot (for example the desired behavior for server timestamps that
                     * have not yet been set to their final value).
                     * @returns An `Object` containing all fields in the document.
                     */ data(t = {}) {
                    return super.data(t);
                }
            }
            /**
                 * A `QuerySnapshot` contains zero or more `DocumentSnapshot` objects
                 * representing the results of a query. The documents can be accessed as an
                 * array via the `docs` property or enumerated using the `forEach` method. The
                 * number of documents can be determined via the `empty` and `size`
                 * properties.
                 */ class xu {
                /** @hideconstructor */ constructor(t, e, n, s){
                    this._firestore = t, this._userDataWriter = e, this._snapshot = s, this.metadata = new Du(s.hasPendingWrites, s.fromCache), this.query = n;
                }
                /** An array of all the documents in the `QuerySnapshot`. */ get docs() {
                    const t = [];
                    return this.forEach((e)=>t.push(e)), t;
                }
                /** The number of documents in the `QuerySnapshot`. */ get size() {
                    return this._snapshot.docs.size;
                }
                /** True if there are no documents in the `QuerySnapshot`. */ get empty() {
                    return 0 === this.size;
                }
                /**
                     * Enumerates all of the documents in the `QuerySnapshot`.
                     *
                     * @param callback - A callback to be called with a `QueryDocumentSnapshot` for
                     * each document in the snapshot.
                     * @param thisArg - The `this` binding for the callback.
                     */ forEach(t, e) {
                    this._snapshot.docs.forEach((n)=>{
                        t.call(e, new Nu(this._firestore, this._userDataWriter, n.key, n, new Du(this._snapshot.mutatedKeys.has(n.key), this._snapshot.fromCache), this.query.converter));
                    });
                }
                /**
                     * Returns an array of the documents changes since the last snapshot. If this
                     * is the first snapshot, all documents will be in the list as 'added'
                     * changes.
                     *
                     * @param options - `SnapshotListenOptions` that control whether metadata-only
                     * changes (i.e. only `DocumentSnapshot.metadata` changed) should trigger
                     * snapshot events.
                     */ docChanges(t = {}) {
                    const e = !!t.includeMetadataChanges;
                    if (e && this._snapshot.excludesMetadataChanges) throw new j(K.INVALID_ARGUMENT, "To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");
                    return this._cachedChanges && this._cachedChangesIncludeMetadataChanges === e || (this._cachedChanges = /** Calculates the array of `DocumentChange`s for a given `ViewSnapshot`. */ function(t, e) {
                        if (t._snapshot.oldDocs.isEmpty()) {
                            let e = 0;
                            return t._snapshot.docChanges.map((n)=>({
                                    type: "added",
                                    doc: new Nu(t._firestore, t._userDataWriter, n.doc.key, n.doc, new Du(t._snapshot.mutatedKeys.has(n.doc.key), t._snapshot.fromCache), t.query.converter),
                                    oldIndex: -1,
                                    newIndex: e++
                                }));
                        }
                        {
                            // A `DocumentSet` that is updated incrementally as changes are applied to use
                            // to lookup the index of a document.
                            let n = t._snapshot.oldDocs;
                            return t._snapshot.docChanges.filter((t)=>e || 3 /* Metadata */  !== t.type).map((e)=>{
                                const s = new Nu(t._firestore, t._userDataWriter, e.doc.key, e.doc, new Du(t._snapshot.mutatedKeys.has(e.doc.key), t._snapshot.fromCache), t.query.converter);
                                let i = -1, r = -1;
                                return 0 /* Added */  !== e.type && (i = n.indexOf(e.doc.key), n = n.delete(e.doc.key)), 1 /* Removed */  !== e.type && (r = (n = n.add(e.doc)).indexOf(e.doc.key)), {
                                    type: function(t) {
                                        switch(t){
                                            case 0 /* Added */ :
                                                return "added";
                                            case 2 /* Modified */ :
                                            case 3 /* Metadata */ :
                                                return "modified";
                                            case 1 /* Removed */ :
                                                return "removed";
                                            default:
                                                return L();
                                        }
                                    }(e.type),
                                    doc: s,
                                    oldIndex: i,
                                    newIndex: r
                                };
                            });
                        }
                    }(this, e), this._cachedChangesIncludeMetadataChanges = e), this._cachedChanges;
                }
            }
            /**
                 * @license
                 * Copyright 2020 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ /**
                 * Converts Firestore's internal types to the JavaScript types that we expose
                 * to the user.
                 *
                 * @internal
                 */ class nh {
                convertValue(t, e = "none") {
                    switch(vt(t)){
                        case 0 /* NullValue */ :
                            return null;
                        case 1 /* BooleanValue */ :
                            return t.booleanValue;
                        case 2 /* NumberValue */ :
                            return yt(t.integerValue || t.doubleValue);
                        case 3 /* TimestampValue */ :
                            return this.convertTimestamp(t.timestampValue);
                        case 4 /* ServerTimestampValue */ :
                            return this.convertServerTimestamp(t, e);
                        case 5 /* StringValue */ :
                            return t.stringValue;
                        case 6 /* BlobValue */ :
                            return this.convertBytes(pt(t.bytesValue));
                        case 7 /* RefValue */ :
                            return this.convertReference(t.referenceValue);
                        case 8 /* GeoPointValue */ :
                            return this.convertGeoPoint(t.geoPointValue);
                        case 9 /* ArrayValue */ :
                            return this.convertArray(t.arrayValue, e);
                        case 10 /* ObjectValue */ :
                            return this.convertObject(t.mapValue, e);
                        default:
                            throw L();
                    }
                }
                convertObject(t, e) {
                    const n = {};
                    return ct(t.fields, (t, s)=>{
                        n[t] = this.convertValue(s, e);
                    }), n;
                }
                convertGeoPoint(t) {
                    return new tu(yt(t.latitude), yt(t.longitude));
                }
                convertArray(t, e) {
                    return (t.values || []).map((t)=>this.convertValue(t, e));
                }
                convertServerTimestamp(t, e) {
                    switch(e){
                        case "previous":
                            const n = /**
                 * Creates a new ServerTimestamp proto value (using the internal format).
                 */ /**
                 * Returns the value of the field before this ServerTimestamp was set.
                 *
                 * Preserving the previous values allows the user to display the last resoled
                 * value until the backend responds with the timestamp.
                 */ function Et(t) {
                                const e = t.mapValue.fields.__previous_value__;
                                return Tt(e) ? Et(e) : e;
                            }(t);
                            return null == n ? null : this.convertValue(n, e);
                        case "estimate":
                            return this.convertTimestamp(It(t));
                        default:
                            return null;
                    }
                }
                convertTimestamp(t) {
                    const e = gt(t);
                    return new it(e.seconds, e.nanos);
                }
                convertDocumentKey(t, e) {
                    const n = ht.fromString(t);
                    Ts(n) || L();
                    const s = new ha(n.get(1), n.get(3)), i = new Pt(n.popFirst(5));
                    return s.isEqual(e) || // TODO(b/64130202): Somehow support foreign references.
                    O(`Document ${i} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${e.projectId}/${e.database}) instead.`), i;
                }
            }
            class ah extends nh {
                constructor(t){
                    super(), this.firestore = t;
                }
                convertBytes(t) {
                    return new Xa(t);
                }
                convertReference(t) {
                    const e = this.convertDocumentKey(t, this.firestore._databaseId);
                    return new Ia(this.firestore, /* converter= */ null, e);
                }
            }
            /**
                 * Executes the query and returns the results as a `QuerySnapshot`.
                 *
                 * Note: `getDocs()` attempts to provide up-to-date data when possible by
                 * waiting for data from the server, but it may return cached data or fail if
                 * you are offline and the server cannot be reached. To specify this behavior,
                 * invoke {@link getDocsFromCache} or {@link getDocsFromServer}.
                 *
                 * @returns A `Promise` that will be resolved with the results of the query.
                 */ function lh(t) {
                t = ga(t, Aa);
                const e = ga(t.firestore, ka), n = (e._firestoreClient || Ma(e), e._firestoreClient.verifyNotTerminated(), e._firestoreClient), s = new ah(e);
                return(/**
                 * @license
                 * Copyright 2020 Google LLC
                 *
                 * Licensed under the Apache License, Version 2.0 (the "License");
                 * you may not use this file except in compliance with the License.
                 * You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing, software
                 * distributed under the License is distributed on an "AS IS" BASIS,
                 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                 * See the License for the specific language governing permissions and
                 * limitations under the License.
                 */ function(t) {
                    if (me(t) && 0 === t.explicitOrderBy.length) throw new j(K.UNIMPLEMENTED, "limitToLast() queries require specifying at least one orderBy() clause");
                }(t._query), (function(t, e, n = {}) {
                    const s = new Q();
                    return t.asyncQueue.enqueueAndForget(async ()=>(function(t, e, n, s, i) {
                            const o = new Qo(n, new Lc({
                                next: (n)=>{
                                    // Remove query first before passing event to user to avoid
                                    // user actions affecting the now stale query.
                                    e.enqueueAndForget(()=>Uo(t, o)), n.fromCache && "server" === s.source ? i.reject(new j(K.UNAVAILABLE, 'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')) : i.resolve(n);
                                },
                                error: (t)=>i.reject(t)
                            }), {
                                includeMetadataChanges: !0,
                                fo: !0
                            });
                            return Bo(t, o);
                        })(await Xc(t), t.asyncQueue, e, n, s)), s.promise;
                })(n, t._query).then((n)=>new xu(e, s, t, n)));
            }
            /**
                 * Cloud Firestore
                 *
                 * @packageDocumentation
                 */ !function(t, e = !0) {
                C = _firebase_app__WEBPACK_IMPORTED_MODULE_0__ /* .SDK_VERSION */ .Jn, (0, _firebase_app__WEBPACK_IMPORTED_MODULE_0__ /* ._registerComponent */ .Xd)(new _firebase_component__WEBPACK_IMPORTED_MODULE_1__ /* .Component */ .wA("firestore", (t, { options: n })=>{
                    const i = new ka(t.getProvider("app").getImmediate(), new H(t.getProvider("auth-internal")));
                    return n = Object.assign({
                        useFetchStreams: e
                    }, n), i._setSettings(n), i;
                }, "PUBLIC" /* PUBLIC */ )), (0, _firebase_app__WEBPACK_IMPORTED_MODULE_0__ /* .registerVersion */ .KN)(S, "3.3.0", void 0), // BUILD_TARGET will be replaced by values like esm5, esm2017, cjs5, etc during the compilation
                (0, _firebase_app__WEBPACK_IMPORTED_MODULE_0__ /* .registerVersion */ .KN)(S, "3.3.0", "esm2017");
            }();
        //# sourceMappingURL=index.esm2017.js.map
        /***/ }
    }
]);
