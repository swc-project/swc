var isIE = navigator.userAgent.match(/MSIE|Trident|Edge/);
var IEVersion = (navigator.userAgent.match(
  /(?:MSIE |Trident.*rv:|Edge\/)(\d+(\.\d+)?)/
) || [])[1];

if (isIE && parseInt(IEVersion, 10) <= 11) {
  document.getElementById("update-browser").style.display = "block";
  document.getElementById("app").style.display = "none";
}

if (isIE && parseInt(IEVersion, 10) === 11) {
  document.getElementById("update-browser-ie-normal").style.display = "none";
  document.getElementById("update-browser-ie11").style.display = "block";
}

/**
 * Set progress bar as downloading scripts
 */
var maxPercentage = 95;
var maxNumIterations = 30;
var preloaderIterations = 0;
var percentComplete = 0;

var preloaderInterval = setInterval(function() {
  preloaderIterations += 1;

  if (preloaderIterations >= maxNumIterations) {
    clearInterval(preloaderInterval);
  }

  var progressElement = document.getElementById("root-preloader-progress");

  if (progressElement) {
    percentComplete = parseInt(
      (preloaderIterations / maxNumIterations) * maxPercentage,
      10
    );
    progressElement.setAttribute("aria-valuenow", percentComplete);
    progressElement.setAttribute("style", "width:" + percentComplete + "%");
  }
}, 1000);
