/**
 * Registers Decap CMS preview templates that render the live site in an iframe.
 * Requires React 18 UMD globals (loaded in index.html before this script).
 */
(function () {
  var createElement = React.createElement;
  var useEffect = React.useEffect;
  var useRef = React.useRef;

  function CmsPagePreview(props) {
    var entry = props.entry;
    var iframeRef = useRef(null);
    var data = entry.getIn(["data"]).toJS();

    useEffect(
      function () {
        var iframe = iframeRef.current;
        if (!iframe) return;

        function sendPreview() {
          if (!iframe.contentWindow) return;
          iframe.contentWindow.postMessage({ type: "cms-preview", payload: data }, "*");
        }

        function onReady(event) {
          if (event.data && event.data.type === "cms-preview-ready") {
            sendPreview();
          }
        }

        window.addEventListener("message", onReady);
        iframe.addEventListener("load", sendPreview);
        sendPreview();

        return function () {
          window.removeEventListener("message", onReady);
          iframe.removeEventListener("load", sendPreview);
        };
      },
      [data]
    );

    return createElement("iframe", {
      ref: iframeRef,
      src: "/cms-preview",
      title: "Page preview",
      style: {
        width: "100%",
        height: "100%",
        minHeight: "80vh",
        border: "0",
        display: "block",
        background: "transparent",
      },
    });
  }

  var CMS = window.CMS || window.DecapCMS;
  if (!CMS || !CMS.registerPreviewTemplate) {
    console.warn("Decap CMS preview: CMS not found — preview templates not registered.");
    return;
  }

  ["site_pages", "pages"].forEach(function (collectionName) {
    CMS.registerPreviewTemplate(collectionName, CmsPagePreview);
  });
})();
