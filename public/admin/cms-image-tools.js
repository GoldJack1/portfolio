/**
 * Adds edit/crop support to image fields and the media library upload flow.
 * Uses Cropper.js (loaded from CDN in index.html). No React hooks.
 */
(function () {
  var REACT_ELEMENT_TYPE = Symbol.for("react.element");

  function createElement(type, props) {
    var children = Array.prototype.slice.call(arguments, 2);
    var propsCopy = props ? Object.assign({}, props) : {};

    if (children.length === 1) {
      propsCopy.children = children[0];
    } else if (children.length > 1) {
      propsCopy.children = children;
    }

    return {
      $$typeof: REACT_ELEMENT_TYPE,
      type: type,
      key: props && props.key != null ? String(props.key) : null,
      ref: props && props.ref != null ? props.ref : null,
      props: propsCopy,
      _owner: null,
    };
  }

  function resolveImageUrl(value) {
    if (!value || typeof value !== "string") {
      return "";
    }
    if (/^https?:\/\//i.test(value)) {
      return value;
    }
    if (value.charAt(0) === "/") {
      return value;
    }
    return "/" + value;
  }

  function deriveFileName(value, suffix) {
    var base = "image";
    if (value && typeof value === "string") {
      var parts = value.split("/");
      base = parts[parts.length - 1] || base;
      base = base.replace(/\.[a-z0-9]+$/i, "");
    }
    return base + "-" + suffix + ".jpg";
  }

  function closeModal(overlay) {
    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
    if (window._cmsCropper) {
      window._cmsCropper.destroy();
      window._cmsCropper = null;
    }
  }

  function openCropEditor(props) {
    var value = props.value;
    var imageUrl = resolveImageUrl(value);

    if (!imageUrl) {
      window.alert("Select an image before cropping.");
      return;
    }

    if (typeof window.Cropper === "undefined") {
      window.alert("Image cropper failed to load. Please refresh the page.");
      return;
    }

    var overlay = document.createElement("div");
    overlay.style.cssText =
      "position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,0.75);display:flex;align-items:center;justify-content:center;padding:24px;box-sizing:border-box;";

    var panel = document.createElement("div");
    panel.style.cssText =
      "background:#fff;border-radius:8px;max-width:960px;width:100%;max-height:90vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.35);";

    var header = document.createElement("div");
    header.style.cssText =
      "display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid #e5e5e5;font:600 14px/1.4 system-ui,sans-serif;";
    header.textContent = "Edit / crop image";

    var body = document.createElement("div");
    body.style.cssText = "flex:1;overflow:auto;padding:16px;background:#111;";

    var image = document.createElement("img");
    image.style.cssText = "display:block;max-width:100%;";
    image.src = imageUrl;
    image.alt = "Crop preview";
    body.appendChild(image);

    var footer = document.createElement("div");
    footer.style.cssText =
      "display:flex;gap:8px;justify-content:flex-end;padding:12px 16px;border-top:1px solid #e5e5e5;";

    function makeButton(label, primary) {
      var button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.style.cssText = primary
        ? "padding:8px 14px;border:0;border-radius:4px;background:#3b4bdd;color:#fff;font:500 13px system-ui,sans-serif;cursor:pointer;"
        : "padding:8px 14px;border:1px solid #ccc;border-radius:4px;background:#fff;font:500 13px system-ui,sans-serif;cursor:pointer;";
      return button;
    }

    var cancelButton = makeButton("Cancel", false);
    var saveButton = makeButton("Save cropped image", true);

    cancelButton.addEventListener("click", function () {
      closeModal(overlay);
    });

    saveButton.addEventListener("click", function () {
      if (!window._cmsCropper) {
        return;
      }

      saveButton.disabled = true;
      saveButton.textContent = "Saving…";

      var canvas = window._cmsCropper.getCroppedCanvas({
        maxWidth: 4096,
        maxHeight: 4096,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: "high",
      });

      if (!canvas) {
        saveButton.disabled = false;
        saveButton.textContent = "Save cropped image";
        window.alert("Could not crop this image.");
        return;
      }

      canvas.toBlob(
        function (blob) {
          if (!blob) {
            saveButton.disabled = false;
            saveButton.textContent = "Save cropped image";
            window.alert("Could not export the cropped image.");
            return;
          }

          var fileName = deriveFileName(value, "cropped-" + Date.now());
          var file = new File([blob], fileName, { type: "image/jpeg" });

          var uploadField = props.field;
          if (uploadField && uploadField.set) {
            uploadField = uploadField
              .set("media_folder", "/public/uploads")
              .set("public_folder", "/uploads");
          }

          var persist = props.onPersistMedia;
          if (!persist) {
            saveButton.disabled = false;
            saveButton.textContent = "Save cropped image";
            window.alert("Upload is unavailable in this context.");
            return;
          }

          Promise.resolve(persist(file, { field: uploadField }))
            .then(function () {
              props.onChange("/uploads/" + fileName);
              closeModal(overlay);
            })
            .catch(function (error) {
              console.error(error);
              saveButton.disabled = false;
              saveButton.textContent = "Save cropped image";
              window.alert("Failed to save cropped image. Try again.");
            });
        },
        "image/jpeg",
        0.92
      );
    });

    footer.appendChild(cancelButton);
    footer.appendChild(saveButton);
    panel.appendChild(header);
    panel.appendChild(body);
    panel.appendChild(footer);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) {
        closeModal(overlay);
      }
    });

    image.addEventListener("load", function () {
      window._cmsCropper = new window.Cropper(image, {
        viewMode: 1,
        dragMode: "move",
        autoCropArea: 1,
        responsive: true,
        background: false,
      });
    });

    image.addEventListener("error", function () {
      window.alert("Could not load the image for cropping.");
      closeModal(overlay);
    });
  }

  function enhanceImageWidget() {
    var CMS = window.CMS || window.DecapCMS;
    if (!CMS || !CMS.getWidget || !CMS.registerWidget) {
      return false;
    }

    var imageWidget = CMS.getWidget("image");
    if (!imageWidget || !imageWidget.control) {
      return false;
    }

    var OriginalControl = imageWidget.control;

    function EnhancedImageControl(props) {
      var value = props.value;
      var hasValue = typeof value === "string" && value.length > 0;

      return createElement(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: "8px" } },
        createElement(OriginalControl, props),
        hasValue
          ? createElement(
              "button",
              {
                type: "button",
                onClick: function () {
                  openCropEditor(props);
                },
                style: {
                  alignSelf: "flex-start",
                  padding: "6px 12px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  background: "#fff",
                  cursor: "pointer",
                  font: "500 13px system-ui, sans-serif",
                },
              },
              "Edit / crop image"
            )
          : null
      );
    }

    CMS.registerWidget("image", EnhancedImageControl, imageWidget.preview);
    return true;
  }

  function init() {
    if (!enhanceImageWidget()) {
      window.setTimeout(init, 100);
      return;
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
