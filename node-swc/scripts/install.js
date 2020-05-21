/*!
 * Copied from node-sass: scripts/install.js
 */

const fetch = require("node-fetch");

var fs = require("fs"),
  os = require("os"),
  eol = require("os").EOL,
  mkdir = require("mkdirp"),
  path = require("path"),
  swc = require("../src/extensions"),
  ProgressBar = require("progress"),
  env = process.env;

/**
 * Download file, if succeeds save, if not delete
 *
 * @param {String} url
 * @param {String} dest
 * @param {Function} cb
 * @api private
 */

function download(url, dest, cb) {
  var reportError = function(err) {
    var timeoutMessge;

    if (err.code === "ETIMEDOUT") {
      if (err.connect === true) {
        // timeout is hit while your client is attempting to establish a connection to a remote machine
        timeoutMessge = "Timed out attemping to establish a remote connection";
      } else {
        timeoutMessge = "Timed out whilst downloading the prebuilt binary";
        // occurs any time the server is too slow to send back a part of the response
      }
    }
    cb(
      [
        'Cannot download "',
        url,
        '": ',
        eol,
        eol,
        typeof err.message === "string" ? err.message : err,
        eol,
        eol,
        timeoutMessge ? timeoutMessge + eol + eol : timeoutMessge,
        "Hint: If github.com is not accessible in your location",
        eol,
        "      try setting a proxy via HTTP_PROXY, e.g. ",
        eol,
        eol,
        "      export HTTP_PROXY=http://example.com:1234",
        eol,
        eol,
        "or configure npm proxy via",
        eol,
        eol,
        "      npm config set proxy http://example.com:8080"
      ].join("")
    );
    process.exit(1);
  };

  console.log("Downloading binary from", url);

  try {
    fetch(url).then(function(resp) {
      if (200 <= resp.status && resp.status < 300) {
        const length = +resp.headers.get("Content-Length");
        var progress = new ProgressBar(":bar", { total: length });
        progress.render();
        // The `progress` is true by default. However if it has not
        // been explicitly set it's `undefined` which is considered
        // as far as npm is concerned.
        if (true) {
          resp.body
            .on("data", function(chunk) {
              progress.tick(chunk.length);
            })
            .on("end", function() {
              progress.terminate();
            });
        }

        resp.body.on("error", cb);
        resp.body.pipe(
          fs.createWriteStream(dest).on("finsih", function() {
            console.log("Download complete");
          })
        );
      } else {
        reportError(
          ["HTTP error", resp.statusCode, resp.statusMessage].join(" ")
        );
      }
    }, reportError);
  } catch (err) {
    cb(err);
  }
}

/**
 * Check and download binary
 *
 * @api private
 */

function checkAndDownloadBinary() {
  if (process.env.SKIP_SWC_BINARY_DOWNLOAD_FOR_CI) {
    console.log("Skipping downloading binaries on CI builds");
    return;
  }
  if (process.env.npm_config_build_from_source) {
    console.info("Building swc from source code");
    process.exit(1);
    return;
  }

  var cachedBinary = swc.getCachedBinary(),
    cachePath = swc.getBinaryCachePath(),
    binaryPath = swc.getBinaryPath();

  if (swc.hasBinary(binaryPath)) {
    console.log("node-swc build", "Binary found at", binaryPath);
    return;
  }

  try {
    mkdir.sync(path.dirname(binaryPath));
  } catch (err) {
    console.error("Unable to save binary", path.dirname(binaryPath), ":", err);
    return;
  }

  if (cachedBinary) {
    console.log("Cached binary found at", cachedBinary);
    fs.createReadStream(cachedBinary).pipe(fs.createWriteStream(binaryPath));
    return;
  }

  download(swc.getBinaryUrl(), binaryPath, function(err) {
    if (err) {
      console.error(err);
      return;
    }

    console.log("Binary saved to", binaryPath);

    cachedBinary = path.join(cachePath, swc.getBinaryName());

    if (cachePath) {
      console.log("Caching binary to", cachedBinary);

      try {
        mkdir.sync(path.dirname(cachedBinary));
        fs.createReadStream(binaryPath)
          .pipe(fs.createWriteStream(cachedBinary))
          .on("error", function(err) {
            console.log("Failed to cache binary:", err);
          });
      } catch (err) {
        console.log("Failed to cache binary:", err);
      }
    }
  });
}

var BANNER =
  "\u001B[96mThank you for using swc (\u001B[94m https://github.com/swc-project/swc \u001B[96m): super-fast javascript and typescript compiler \u001B[0m\n\n" +
  "\u001B[96mThe project needs your help! Please consider supporting swc on Open Collective: \u001B[0m\n" +
  "\u001B[96m>\u001B[94m https://opencollective.com/swc \u001B[0m\n";

var ADBLOCK = is(env.ADBLOCK);
var COLOR = is(env.npm_config_color);
var DISABLE_OPENCOLLECTIVE = is(env.DISABLE_OPENCOLLECTIVE);
var SILENT =
  ["silent", "error", "warn"].indexOf(env.npm_config_loglevel) !== -1;
var MINUTE = 60 * 1000;

// you could add a PR with an env variable for your CI detection
var CI = ["BUILD_NUMBER", "CI", "CONTINUOUS_INTEGRATION", "RUN_ID"].some(
  function(it) {
    return is(env[it]);
  }
);

function is(it) {
  return !!it && it !== "0" && it !== "false";
}

function isBannerRequired() {
  if (ADBLOCK || CI || DISABLE_OPENCOLLECTIVE || SILENT) return false;
  var file = path.join(os.tmpdir(), "core-js-banners");
  var banners = [];
  try {
    var DELTA = Date.now() - fs.statSync(file).mtime;
    if (DELTA >= 0 && DELTA < MINUTE * 3) {
      banners = JSON.parse(fs.readFileSync(file, "utf8"));
      if (banners.indexOf(BANNER) !== -1) return false;
    }
  } catch (error) {
    banners = [];
  }
  try {
    banners.push(BANNER);
    fs.writeFileSync(file, JSON.stringify(banners), "utf8");
  } catch (error) {
    /* empty */
  }
  return true;
}

function showBanner() {
  // eslint-disable-next-line no-console,no-control-regex
  console.log(COLOR ? BANNER : BANNER.replace(/\u001B\[\d+m/g, ""));
}

if (isBannerRequired()) showBanner();

/**
 * If binary does not exist, download it
 */

checkAndDownloadBinary();
