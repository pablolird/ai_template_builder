const IFRAME_NATURAL_WIDTH = 794; // ~A4 at 96 dpi
const THUMBNAIL_SCALE = 0.32;
const THUMBNAIL_HEIGHT = 200;

export function TemplateThumbnail({ html }: { html: string }) {
  return (
    <div
      className="overflow-hidden bg-white rounded-t-lg border-b border-border"
      style={{ height: THUMBNAIL_HEIGHT }}
    >
      <iframe
        srcDoc={html}
        title="preview"
        style={{
          width: IFRAME_NATURAL_WIDTH,
          height: THUMBNAIL_HEIGHT / THUMBNAIL_SCALE,
          transform: `scale(${THUMBNAIL_SCALE})`,
          transformOrigin: "top left",
          border: "none",
          pointerEvents: "none",
        }}
        sandbox="allow-same-origin"
      />
    </div>
  );
}
