export function printPdf(pdfUrl: string) {
  if (typeof document === "undefined") return;

  const separator = pdfUrl.includes("?") ? "&" : "?";
  const printUrl = `${pdfUrl}${separator}inline=1`;
  const iframe = document.createElement("iframe");

  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.style.opacity = "0";
  iframe.setAttribute("aria-hidden", "true");

  const cleanup = () => {
    if (iframe.parentNode) {
      iframe.parentNode.removeChild(iframe);
    }
  };

  iframe.onload = () => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      window.setTimeout(cleanup, 60_000);
    } catch {
      cleanup();
      window.open(printUrl, "_blank", "noopener,noreferrer");
    }
  };

  iframe.onerror = () => {
    cleanup();
    window.open(printUrl, "_blank", "noopener,noreferrer");
  };

  iframe.src = printUrl;
  document.body.appendChild(iframe);
}
