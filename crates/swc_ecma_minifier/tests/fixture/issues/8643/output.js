const Cache = {
    enabled: !1,
    files: {},
    add: function(key, file) {
        !1 !== this.enabled && // console.log( 'THREE.Cache', 'Adding key:', key );
        (this.files[key] = file);
    },
    get: function(key) {
        if (!1 !== this.enabled) // console.log( 'THREE.Cache', 'Checking key:', key );
        return this.files[key];
    },
    remove: function(key) {
        delete this.files[key];
    },
    clear: function() {
        this.files = {};
    }
};
class Loader {
    constructor(manager){
        this.manager = void 0 !== manager ? manager : DefaultLoadingManager, this.crossOrigin = 'anonymous', this.withCredentials = !1, this.path = '', this.resourcePath = '', this.requestHeader = {};
    }
    load() {}
    loadAsync(url, onProgress) {
        const scope = this;
        return new Promise(function(resolve, reject) {
            scope.load(url, resolve, onProgress, reject);
        });
    }
    parse() {}
    setCrossOrigin(crossOrigin) {
        return this.crossOrigin = crossOrigin, this;
    }
    setWithCredentials(value) {
        return this.withCredentials = value, this;
    }
    setPath(path) {
        return this.path = path, this;
    }
    setResourcePath(resourcePath) {
        return this.resourcePath = resourcePath, this;
    }
    setRequestHeader(requestHeader) {
        return this.requestHeader = requestHeader, this;
    }
}
Loader.DEFAULT_MATERIAL_NAME = '__DEFAULT';
const loading = {};
class HttpError extends Error {
    constructor(message, response){
        super(message), this.response = response;
    }
}
export class FileLoader extends Loader {
    constructor(manager){
        super(manager);
    }
    load(url, onLoad, onProgress, onError) {
        void 0 === url && (url = ''), void 0 !== this.path && (url = this.path + url), url = this.manager.resolveURL(url);
        const cached = Cache.get(url);
        if (void 0 !== cached) return this.manager.itemStart(url), setTimeout(()=>{
            onLoad && onLoad(cached), this.manager.itemEnd(url);
        }, 0), cached;
        // Check if request is duplicate
        if (void 0 !== loading[url]) {
            loading[url].push({
                onLoad: onLoad,
                onProgress: onProgress,
                onError: onError
            });
            return;
        }
        // Initialise array for duplicate requests
        loading[url] = [], loading[url].push({
            onLoad: onLoad,
            onProgress: onProgress,
            onError: onError
        });
        // create request
        const req = new Request(url, {
            headers: new Headers(this.requestHeader),
            credentials: this.withCredentials ? 'include' : 'same-origin'
        }), mimeType = this.mimeType, responseType = this.responseType;
        // start the fetch
        fetch(req).then((response)=>{
            if (200 === response.status || 0 === response.status) {
                // Workaround: Checking if response.body === undefined for Alipay browser #23548
                if (0 === response.status && console.warn('THREE.FileLoader: HTTP Status 0 received.'), 'undefined' == typeof ReadableStream || void 0 === response.body || void 0 === response.body.getReader) return response;
                const callbacks = loading[url], reader = response.body.getReader(), contentLength = response.headers.get('Content-Length') || response.headers.get('X-File-Size'), total = contentLength ? parseInt(contentLength) : 0, lengthComputable = 0 !== total;
                let loaded = 0;
                return new Response(new ReadableStream({
                    start (controller) {
                        (function readData() {
                            reader.read().then(({ done, value })=>{
                                if (done) controller.close();
                                else {
                                    const event = new ProgressEvent('progress', {
                                        lengthComputable,
                                        loaded: loaded += value.byteLength,
                                        total
                                    });
                                    for(let i = 0, il = callbacks.length; i < il; i++){
                                        const callback = callbacks[i];
                                        callback.onProgress && callback.onProgress(event);
                                    }
                                    controller.enqueue(value), readData();
                                }
                            });
                        })();
                    }
                }));
            }
            throw new HttpError(`fetch for "${response.url}" responded with ${response.status}: ${response.statusText}`, response);
        }).then((response)=>{
            switch(responseType){
                case 'arraybuffer':
                    return response.arrayBuffer();
                case 'blob':
                    return response.blob();
                case 'document':
                    return response.text().then((text)=>new DOMParser().parseFromString(text, mimeType));
                case 'json':
                    return response.json();
                default:
                    if (void 0 === mimeType) return response.text();
                    {
                        const exec = /charset="?([^;"\s]*)"?/i.exec(mimeType), decoder = new TextDecoder(exec && exec[1] ? exec[1].toLowerCase() : void 0);
                        return response.arrayBuffer().then((ab)=>decoder.decode(ab));
                    }
            }
        }).then((data)=>{
            // Add to cache only on HTTP success, so that we do not cache
            // error response bodies as proper responses to requests.
            Cache.add(url, data);
            const callbacks = loading[url];
            delete loading[url];
            for(let i = 0, il = callbacks.length; i < il; i++){
                const callback = callbacks[i];
                callback.onLoad && callback.onLoad(data);
            }
        }).catch((err)=>{
            // Abort errors and other errors are handled the same
            const callbacks = loading[url];
            if (void 0 === callbacks) throw(// When onLoad was called and url was deleted in `loading`
            this.manager.itemError(url), err);
            delete loading[url];
            for(let i = 0, il = callbacks.length; i < il; i++){
                const callback = callbacks[i];
                callback.onError && callback.onError(err);
            }
            this.manager.itemError(url);
        }).finally(()=>{
            this.manager.itemEnd(url);
        }), this.manager.itemStart(url);
    }
    setResponseType(value) {
        return this.responseType = value, this;
    }
    setMimeType(value) {
        return this.mimeType = value, this;
    }
}
