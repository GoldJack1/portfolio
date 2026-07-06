/**
 * Registers Decap CMS preview templates that render the live site in an iframe.
 * Uses DOM injection only — no React hooks (Decap bundles its own React 19).
 */
(function () {
  var CMS = window.CMS || window.DecapCMS;
  if (!CMS || !CMS.registerPreviewTemplate) {
    console.warn("Decap CMS preview: CMS not found — preview templates not registered.");
    return;
  }

  function serialize(data) {
    try {
      return JSON.stringify(data);
    } catch (error) {
      return String(Date.now());
    }
  }

  function createIframePreview(src, messageType, readyType, title) {
    return function Preview(props) {
      var doc = props.document;
      var win = props.window || window;
      var data = props.entry.getIn(["data"]).toJS();
      var serialized = serialize(data);

      if (!doc) {
        return null;
      }

      var root = doc.getElementById("cms-live-preview-root");
      if (!root) {
        doc.body.style.margin = "0";
        doc.body.style.height = "100%";

        root = doc.createElement("div");
        root.id = "cms-live-preview-root";
        root.style.cssText = "position:absolute;inset:0;display:flex;flex-direction:column;";
        doc.body.appendChild(root);

        var iframe = doc.createElement("iframe");
        iframe.setAttribute("title", title);
        iframe.src = src;
        iframe.style.cssText =
          "flex:1;width:100%;min-height:80vh;border:0;display:block;background:transparent;";
        root.appendChild(iframe);

        root._iframe = iframe;
        root._messageType = messageType;
        root._readyType = readyType;
        root._latestData = data;
        root._lastSerialized = serialized;

        function sendPreview() {
          if (!iframe.contentWindow || !root._latestData) {
            return;
          }
          iframe.contentWindow.postMessage(
            { type: root._messageType, payload: root._latestData },
            "*"
          );
        }

        function onReady(event) {
          if (event.source !== iframe.contentWindow) {
            return;
          }
          if (!event.data || event.data.type !== root._readyType) {
            return;
          }
          sendPreview();
        }

        iframe.addEventListener("load", sendPreview);
        win.addEventListener("message", onReady);
      }

      root._latestData = data;

      if (root._lastSerialized !== serialized) {
        root._lastSerialized = serialized;
        var frame = root._iframe;
        if (frame && frame.contentWindow) {
          frame.contentWindow.postMessage({ type: messageType, payload: data }, "*");
        }
      }

      return null;
    };
  }

  CMS.registerPreviewTemplate(
    "site_pages",
    createIframePreview("/cms-preview", "cms-preview", "cms-preview-ready", "Page preview")
  );
  CMS.registerPreviewTemplate(
    "pages",
    createIframePreview("/cms-preview", "cms-preview", "cms-preview-ready", "Page preview")
  );
  CMS.registerPreviewTemplate(
    "projects",
    createIframePreview(
      "/cms-preview/project",
      "cms-project-preview",
      "cms-project-preview-ready",
      "Project preview"
    )
  );
})();
