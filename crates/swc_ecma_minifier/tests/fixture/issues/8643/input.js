
const Cache = {

    enabled: false,

    files: {},

    add: function (key, file) {

        if (this.enabled === false) return;

        // console.log( 'THREE.Cache', 'Adding key:', key );

        this.files[key] = file;

    },

    get: function (key) {

        if (this.enabled === false) return;

        // console.log( 'THREE.Cache', 'Checking key:', key );

        return this.files[key];

    },

    remove: function (key) {

        delete this.files[key];

    },

    clear: function () {

        this.files = {};

    }

};




class Loader {

    constructor(manager) {

        this.manager = (manager !== undefined) ? manager : DefaultLoadingManager;

        this.crossOrigin = 'anonymous';
        this.withCredentials = false;
        this.path = '';
        this.resourcePath = '';
        this.requestHeader = {};

    }

    load( /* url, onLoad, onProgress, onError */) { }

    loadAsync(url, onProgress) {

        const scope = this;

        return new Promise(function (resolve, reject) {

            scope.load(url, resolve, onProgress, reject);

        });

    }

    parse( /* data */) { }

    setCrossOrigin(crossOrigin) {

        this.crossOrigin = crossOrigin;
        return this;

    }

    setWithCredentials(value) {

        this.withCredentials = value;
        return this;

    }

    setPath(path) {

        this.path = path;
        return this;

    }

    setResourcePath(resourcePath) {

        this.resourcePath = resourcePath;
        return this;

    }

    setRequestHeader(requestHeader) {

        this.requestHeader = requestHeader;
        return this;

    }

}

Loader.DEFAULT_MATERIAL_NAME = '__DEFAULT';

const loading = {};

class HttpError extends Error {

    constructor(message, response) {

        super(message);
        this.response = response;

    }

}

export class FileLoader extends Loader {

    constructor(manager) {

        super(manager);

    }

    load(url, onLoad, onProgress, onError) {

        if (url === undefined) url = '';

        if (this.path !== undefined) url = this.path + url;

        url = this.manager.resolveURL(url);

        const cached = Cache.get(url);

        if (cached !== undefined) {

            this.manager.itemStart(url);

            setTimeout(() => {

                if (onLoad) onLoad(cached);

                this.manager.itemEnd(url);

            }, 0);

            return cached;

        }

        // Check if request is duplicate

        if (loading[url] !== undefined) {

            loading[url].push({

                onLoad: onLoad,
                onProgress: onProgress,
                onError: onError

            });

            return;

        }

        // Initialise array for duplicate requests
        loading[url] = [];

        loading[url].push({
            onLoad: onLoad,
            onProgress: onProgress,
            onError: onError,
        });

        // create request
        const req = new Request(url, {
            headers: new Headers(this.requestHeader),
            credentials: this.withCredentials ? 'include' : 'same-origin',
            // An abort controller could be added within a future PR
        });

        // record states ( avoid data race )
        const mimeType = this.mimeType;
        const responseType = this.responseType;

        // start the fetch
        fetch(req)
            .then(response => {

                if (response.status === 200 || response.status === 0) {

                    // Some browsers return HTTP Status 0 when using non-http protocol
                    // e.g. 'file://' or 'data://'. Handle as success.

                    if (response.status === 0) {

                        console.warn('THREE.FileLoader: HTTP Status 0 received.');

                    }

                    // Workaround: Checking if response.body === undefined for Alipay browser #23548

                    if (typeof ReadableStream === 'undefined' || response.body === undefined || response.body.getReader === undefined) {

                        return response;

                    }

                    const callbacks = loading[url];
                    const reader = response.body.getReader();

                    // Nginx needs X-File-Size check
                    // https://serverfault.com/questions/482875/why-does-nginx-remove-content-length-header-for-chunked-content
                    const contentLength = response.headers.get('Content-Length') || response.headers.get('X-File-Size');
                    const total = contentLength ? parseInt(contentLength) : 0;
                    const lengthComputable = total !== 0;
                    let loaded = 0;

                    // periodically read data into the new stream tracking while download progress
                    const stream = new ReadableStream({
                        start(controller) {

                            readData();

                            function readData() {

                                reader.read().then(({ done, value }) => {

                                    if (done) {

                                        controller.close();

                                    } else {

                                        loaded += value.byteLength;

                                        const event = new ProgressEvent('progress', { lengthComputable, loaded, total });
                                        for (let i = 0, il = callbacks.length; i < il; i++) {

                                            const callback = callbacks[i];
                                            if (callback.onProgress) callback.onProgress(event);

                                        }

                                        controller.enqueue(value);
                                        readData();

                                    }

                                });

                            }

                        }

                    });

                    return new Response(stream);

                } else {

                    throw new HttpError(`fetch for "${response.url}" responded with ${response.status}: ${response.statusText}`, response);

                }

            })
            .then(response => {

                switch (responseType) {

                    case 'arraybuffer':

                        return response.arrayBuffer();

                    case 'blob':

                        return response.blob();

                    case 'document':

                        return response.text()
                            .then(text => {

                                const parser = new DOMParser();
                                return parser.parseFromString(text, mimeType);

                            });

                    case 'json':

                        return response.json();

                    default:

                        if (mimeType === undefined) {

                            return response.text();

                        } else {

                            // sniff encoding
                            const re = /charset="?([^;"\s]*)"?/i;
                            const exec = re.exec(mimeType);
                            const label = exec && exec[1] ? exec[1].toLowerCase() : undefined;
                            const decoder = new TextDecoder(label);
                            return response.arrayBuffer().then(ab => decoder.decode(ab));

                        }

                }

            })
            .then(data => {

                // Add to cache only on HTTP success, so that we do not cache
                // error response bodies as proper responses to requests.
                Cache.add(url, data);

                const callbacks = loading[url];
                delete loading[url];

                for (let i = 0, il = callbacks.length; i < il; i++) {

                    const callback = callbacks[i];
                    if (callback.onLoad) callback.onLoad(data);

                }

            })
            .catch(err => {

                // Abort errors and other errors are handled the same

                const callbacks = loading[url];

                if (callbacks === undefined) {

                    // When onLoad was called and url was deleted in `loading`
                    this.manager.itemError(url);
                    throw err;

                }

                delete loading[url];

                for (let i = 0, il = callbacks.length; i < il; i++) {

                    const callback = callbacks[i];
                    if (callback.onError) callback.onError(err);

                }

                this.manager.itemError(url);

            })
            .finally(() => {

                this.manager.itemEnd(url);

            });

        this.manager.itemStart(url);

    }

    setResponseType(value) {

        this.responseType = value;
        return this;

    }

    setMimeType(value) {

        this.mimeType = value;
        return this;

    }

}
