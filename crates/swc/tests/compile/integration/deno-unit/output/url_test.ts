// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { unitTest, assert, assertEquals, assertThrows } from "./test_util.ts";
unitTest(function urlParsing() {
    var url = new URL("https://foo:bar@baz.qat:8000/qux/quux?foo=bar&baz=12#qat");
    assertEquals(url.hash, "#qat");
    assertEquals(url.host, "baz.qat:8000");
    assertEquals(url.hostname, "baz.qat");
    assertEquals(url.href, "https://foo:bar@baz.qat:8000/qux/quux?foo=bar&baz=12#qat");
    assertEquals(url.origin, "https://baz.qat:8000");
    assertEquals(url.password, "bar");
    assertEquals(url.pathname, "/qux/quux");
    assertEquals(url.port, "8000");
    assertEquals(url.protocol, "https:");
    assertEquals(url.search, "?foo=bar&baz=12");
    assertEquals(url.searchParams.getAll("foo"), [
        "bar"
    ]);
    assertEquals(url.searchParams.getAll("baz"), [
        "12"
    ]);
    assertEquals(url.username, "foo");
    assertEquals(String(url), "https://foo:bar@baz.qat:8000/qux/quux?foo=bar&baz=12#qat");
    assertEquals(JSON.stringify({
        key: url
    }), '{"key":"https://foo:bar@baz.qat:8000/qux/quux?foo=bar&baz=12#qat"}');
    // IPv6 type hostname.
    var urlv6 = new URL("https://foo:bar@[::1]:8000/qux/quux?foo=bar&baz=12#qat");
    assertEquals(urlv6.origin, "https://[::1]:8000");
    assertEquals(urlv6.password, "bar");
    assertEquals(urlv6.pathname, "/qux/quux");
    assertEquals(urlv6.port, "8000");
    assertEquals(urlv6.protocol, "https:");
    assertEquals(urlv6.search, "?foo=bar&baz=12");
    assertEquals(urlv6.searchParams.getAll("foo"), [
        "bar"
    ]);
    assertEquals(urlv6.searchParams.getAll("baz"), [
        "12"
    ]);
    assertEquals(urlv6.username, "foo");
    assertEquals(String(urlv6), "https://foo:bar@[::1]:8000/qux/quux?foo=bar&baz=12#qat");
    assertEquals(JSON.stringify({
        key: urlv6
    }), '{"key":"https://foo:bar@[::1]:8000/qux/quux?foo=bar&baz=12#qat"}');
});
unitTest(function urlModifications() {
    var url = new URL("https://foo:bar@baz.qat:8000/qux/quux?foo=bar&baz=12#qat");
    url.hash = "";
    assertEquals(url.href, "https://foo:bar@baz.qat:8000/qux/quux?foo=bar&baz=12");
    url.host = "qat.baz:8080";
    assertEquals(url.href, "https://foo:bar@qat.baz:8080/qux/quux?foo=bar&baz=12");
    url.hostname = "foo.bar";
    assertEquals(url.href, "https://foo:bar@foo.bar:8080/qux/quux?foo=bar&baz=12");
    url.password = "qux";
    assertEquals(url.href, "https://foo:qux@foo.bar:8080/qux/quux?foo=bar&baz=12");
    url.pathname = "/foo/bar%qat";
    assertEquals(url.href, "https://foo:qux@foo.bar:8080/foo/bar%qat?foo=bar&baz=12");
    url.port = "";
    assertEquals(url.href, "https://foo:qux@foo.bar/foo/bar%qat?foo=bar&baz=12");
    url.protocol = "http:";
    assertEquals(url.href, "http://foo:qux@foo.bar/foo/bar%qat?foo=bar&baz=12");
    url.search = "?foo=bar&foo=baz";
    assertEquals(url.href, "http://foo:qux@foo.bar/foo/bar%qat?foo=bar&foo=baz");
    assertEquals(url.searchParams.getAll("foo"), [
        "bar",
        "baz"
    ]);
    url.username = "foo@bar";
    assertEquals(url.href, "http://foo%40bar:qux@foo.bar/foo/bar%qat?foo=bar&foo=baz");
    url.searchParams.set("bar", "qat");
    assertEquals(url.href, "http://foo%40bar:qux@foo.bar/foo/bar%qat?foo=bar&foo=baz&bar=qat");
    url.searchParams.delete("foo");
    assertEquals(url.href, "http://foo%40bar:qux@foo.bar/foo/bar%qat?bar=qat");
    url.searchParams.append("foo", "bar");
    assertEquals(url.href, "http://foo%40bar:qux@foo.bar/foo/bar%qat?bar=qat&foo=bar");
});
unitTest(function urlModifyHref() {
    var url = new URL("http://example.com/");
    url.href = "https://foo:bar@example.com:8080/baz/qat#qux";
    assertEquals(url.protocol, "https:");
    assertEquals(url.username, "foo");
    assertEquals(url.password, "bar");
    assertEquals(url.host, "example.com:8080");
    assertEquals(url.hostname, "example.com");
    assertEquals(url.pathname, "/baz/qat");
    assertEquals(url.hash, "#qux");
});
unitTest(function urlNormalize() {
    var url = new URL("http://example.com");
    assertEquals(url.pathname, "/");
    assertEquals(url.href, "http://example.com/");
});
unitTest(function urlModifyPathname() {
    var url = new URL("http://foo.bar/baz%qat/qux%quux");
    assertEquals(url.pathname, "/baz%qat/qux%quux");
    url.pathname = url.pathname;
    assertEquals(url.pathname, "/baz%qat/qux%quux");
    url.pathname = "baz#qat qux";
    assertEquals(url.pathname, "/baz%23qat%20qux");
    url.pathname = url.pathname;
    assertEquals(url.pathname, "/baz%23qat%20qux");
});
unitTest(function urlModifyHash() {
    var url = new URL("http://foo.bar");
    url.hash = "%foo bar/qat%qux#bar";
    assertEquals(url.hash, "#%foo%20bar/qat%qux#bar");
    url.hash = url.hash;
    assertEquals(url.hash, "#%foo%20bar/qat%qux#bar");
});
unitTest(function urlSearchParamsReuse() {
    var url = new URL("https://foo:bar@baz.qat:8000/qux/quux?foo=bar&baz=12#qat");
    var sp = url.searchParams;
    url.host = "baz.qat";
    assert(sp === url.searchParams, "Search params should be reused.");
});
unitTest(function urlBackSlashes() {
    var url = new URL("https:\\\\foo:bar@baz.qat:8000\\qux\\quux?foo=bar&baz=12#qat");
    assertEquals(url.href, "https://foo:bar@baz.qat:8000/qux/quux?foo=bar&baz=12#qat");
});
unitTest(function urlRequireHost() {
    assertEquals(new URL("file:///").href, "file:///");
    assertThrows(function() {
        new URL("ftp:///");
    });
    assertThrows(function() {
        new URL("http:///");
    });
    assertThrows(function() {
        new URL("https:///");
    });
    assertThrows(function() {
        new URL("ws:///");
    });
    assertThrows(function() {
        new URL("wss:///");
    });
});
unitTest(function urlDriveLetter() {
    assertEquals(new URL("file:///C:").href, Deno.build.os == "windows" ? "file:///C:/" : "file:///C:");
    assertEquals(new URL("http://example.com/C:").href, "http://example.com/C:");
});
unitTest(function urlUncHostname() {
    assertEquals(new URL("file:////").href, Deno.build.os == "windows" ? "file:///" : "file:////");
    assertEquals(new URL("file:////server").href, Deno.build.os == "windows" ? "file://server/" : "file:////server");
    assertEquals(new URL("file:////server/file").href, Deno.build.os == "windows" ? "file://server/file" : "file:////server/file");
});
unitTest(function urlHostnameUpperCase() {
    assertEquals(new URL("https://EXAMPLE.COM").href, "https://example.com/");
});
unitTest(function urlTrim() {
    assertEquals(new URL(" https://example.com  ").href, "https://example.com/");
});
unitTest(function urlEncoding() {
    assertEquals(new URL("https://a !$&*()=,;+'\"@example.com").username, "a%20!$&*()%3D,%3B+%27%22");
    assertEquals(new URL("https://:a !$&*()=,;+'\"@example.com").password, "a%20!$&*()%3D,%3B+%27%22");
    // FIXME: https://url.spec.whatwg.org/#idna
    // assertEquals(
    //   new URL("https://a !$&*()=,+'\"").hostname,
    //   "a%20%21%24%26%2A%28%29%3D%2C+%27%22"
    // );
    assertEquals(new URL("https://example.com/a ~!@$&*()=:/,;+'\"\\").pathname, "/a%20~!@$&*()=:/,;+'%22/");
    assertEquals(new URL("https://example.com?a ~!@$&*()=:/,;?+'\"\\").search, "?a%20~!@$&*()=:/,;?+%27%22\\");
    assertEquals(new URL("https://example.com#a ~!@#$&*()=:/,;?+'\"\\").hash, "#a%20~!@#$&*()=:/,;?+'%22\\");
});
unitTest(function urlBaseURL() {
    var base = new URL("https://foo:bar@baz.qat:8000/qux/quux?foo=bar&baz=12#qat");
    var url = new URL("/foo/bar?baz=foo#qux", base);
    assertEquals(url.href, "https://foo:bar@baz.qat:8000/foo/bar?baz=foo#qux");
});
unitTest(function urlBaseString() {
    var url = new URL("/foo/bar?baz=foo#qux", "https://foo:bar@baz.qat:8000/qux/quux?foo=bar&baz=12#qat");
    assertEquals(url.href, "https://foo:bar@baz.qat:8000/foo/bar?baz=foo#qux");
});
unitTest(function urlRelativeWithBase() {
    assertEquals(new URL("", "file:///a/a/a").href, "file:///a/a/a");
    assertEquals(new URL(".", "file:///a/a/a").href, "file:///a/a/");
    assertEquals(new URL("..", "file:///a/a/a").href, "file:///a/");
    assertEquals(new URL("b", "file:///a/a/a").href, "file:///a/a/b");
    assertEquals(new URL("b", "file:///a/a/a/").href, "file:///a/a/a/b");
    assertEquals(new URL("b/", "file:///a/a/a").href, "file:///a/a/b/");
    assertEquals(new URL("../b", "file:///a/a/a").href, "file:///a/b");
});
unitTest(function urlDriveLetterBase() {
    assertEquals(new URL("/b", "file:///C:/a/b").href, Deno.build.os == "windows" ? "file:///C:/b" : "file:///b");
    assertEquals(new URL("D:", "file:///C:/a/b").href, Deno.build.os == "windows" ? "file:///D:/" : "file:///C:/a/D:");
    assertEquals(new URL("/D:", "file:///C:/a/b").href, Deno.build.os == "windows" ? "file:///D:/" : "file:///D:");
    assertEquals(new URL("D:/b", "file:///C:/a/b").href, Deno.build.os == "windows" ? "file:///D:/b" : "file:///C:/a/D:/b");
});
unitTest(function emptyBasePath() {
    assertEquals(new URL("", "http://example.com").href, "http://example.com/");
});
unitTest(function deletingAllParamsRemovesQuestionMarkFromURL() {
    var url = new URL("http://example.com/?param1&param2");
    url.searchParams.delete("param1");
    url.searchParams.delete("param2");
    assertEquals(url.href, "http://example.com/");
    assertEquals(url.search, "");
});
unitTest(function removingNonExistentParamRemovesQuestionMarkFromURL() {
    var url = new URL("http://example.com/?");
    assertEquals(url.href, "http://example.com/?");
    url.searchParams.delete("param1");
    assertEquals(url.href, "http://example.com/");
    assertEquals(url.search, "");
});
unitTest(function sortingNonExistentParamRemovesQuestionMarkFromURL() {
    var url = new URL("http://example.com/?");
    assertEquals(url.href, "http://example.com/?");
    url.searchParams.sort();
    assertEquals(url.href, "http://example.com/");
    assertEquals(url.search, "");
});
unitTest({
    // FIXME(bartlomieju)
    ignore: true
}, function customInspectFunction() {
    var url = new URL("http://example.com/?");
    assertEquals(Deno.inspect(url), 'URL { href: "http://example.com/?", origin: "http://example.com", protocol: "http:", username: "", password: "", host: "example.com", hostname: "example.com", port: "", pathname: "/", hash: "", search: "?" }');
});
unitTest(function protocolNotHttpOrFile() {
    var url = new URL("about:blank");
    assertEquals(url.href, "about:blank");
    assertEquals(url.protocol, "about:");
    assertEquals(url.origin, "null");
});
unitTest(function createBadUrl() {
    assertThrows(function() {
        new URL("0.0.0.0:8080");
    });
});
unitTest(function throwForInvalidPortConstructor() {
    var urls = [
        // If port is greater than 2^16 − 1, validation error, return failure.
        "https://baz.qat:".concat(Math.pow(2, 16)),
        "https://baz.qat:-32",
        "https://baz.qat:deno",
        "https://baz.qat:9land",
        "https://baz.qat:10.5"
    ];
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        var _loop = function() {
            var url = _step.value;
            assertThrows(function() {
                return new URL(url);
            }, TypeError, "Invalid URL.");
        };
        for(var _iterator = urls[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true)_loop();
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    // Do not throw for 0 & 65535
    new URL("https://baz.qat:65535");
    new URL("https://baz.qat:0");
});
unitTest(function throwForInvalidSchemeConstructor() {
    assertThrows(function() {
        return new URL("invalid_scheme://baz.qat");
    }, TypeError, "Invalid URL.");
});
unitTest(function doNotOverridePortIfInvalid() {
    var initialPort = "3000";
    var ports = [
        // If port is greater than 2^16 − 1, validation error, return failure.
        "".concat(Math.pow(2, 16)),
        "-32",
        "deno",
        "9land",
        "10.5"
    ];
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = ports[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var port = _step.value;
            var url = new URL("https://deno.land:".concat(initialPort));
            url.port = port;
            assertEquals(url.port, initialPort);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
});
unitTest(function emptyPortForSchemeDefaultPort() {
    var nonDefaultPort = "3500";
    var urls = [
        {
            url: "ftp://baz.qat:21",
            port: "21",
            protocol: "ftp:"
        },
        {
            url: "https://baz.qat:443",
            port: "443",
            protocol: "https:"
        },
        {
            url: "wss://baz.qat:443",
            port: "443",
            protocol: "wss:"
        },
        {
            url: "http://baz.qat:80",
            port: "80",
            protocol: "http:"
        },
        {
            url: "ws://baz.qat:80",
            port: "80",
            protocol: "ws:"
        },
        {
            url: "file://home/index.html",
            port: "",
            protocol: "file:"
        },
        {
            url: "/foo",
            baseUrl: "ftp://baz.qat:21",
            port: "21",
            protocol: "ftp:"
        },
        {
            url: "/foo",
            baseUrl: "https://baz.qat:443",
            port: "443",
            protocol: "https:"
        },
        {
            url: "/foo",
            baseUrl: "wss://baz.qat:443",
            port: "443",
            protocol: "wss:"
        },
        {
            url: "/foo",
            baseUrl: "http://baz.qat:80",
            port: "80",
            protocol: "http:"
        },
        {
            url: "/foo",
            baseUrl: "ws://baz.qat:80",
            port: "80",
            protocol: "ws:"
        },
        {
            url: "/foo",
            baseUrl: "file://home/index.html",
            port: "",
            protocol: "file:"
        }
    ];
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = urls[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var _step_value = _step.value, urlString = _step_value.url, baseUrl = _step_value.baseUrl, port = _step_value.port, protocol = _step_value.protocol;
            var url = new URL(urlString, baseUrl);
            assertEquals(url.port, "");
            url.port = nonDefaultPort;
            assertEquals(url.port, nonDefaultPort);
            url.port = port;
            assertEquals(url.port, "");
            // change scheme
            url.protocol = "sftp:";
            assertEquals(url.port, port);
            url.protocol = protocol;
            assertEquals(url.port, "");
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
});
