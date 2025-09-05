export function parseTextToHtml(text: string): string {
  const lines = text.split("\n");
  let html = "";
  let olOpen = false;
  let ulOpen = false;

  const closeLists = () => {
    if (olOpen) { html += "</ol>"; olOpen = false; }
    if (ulOpen) { html += "</ul>"; ulOpen = false; }
  };

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;

    const olMatch = trimmed.match(/^\d+\.\s+(.*)/);
    const ulMatch = trimmed.match(/^\-\s+(.*)/);
    const boldTitleMatch = trimmed.match(/^(.+):$/); // línea que termina con ":"

    if (olMatch) {
      closeLists();
      html += `<ol style="margin-top: 1em;"><li><strong>${olMatch[1]}</strong></li></ol>`;
    } else if (ulMatch) {
      if (!ulOpen) { html += '<ul style="margin-top: 1em;">'; ulOpen = true; }
      html += `<li>${ulMatch[1]}</li>`;
    } else if (boldTitleMatch) {
      closeLists();
      html += `<p style="margin-top: 1em;"><strong>${boldTitleMatch[1]}</strong></p>`;
    } else {
      closeLists();
      html += `<p style="margin-top: 0.5em;">${trimmed}</p>`;
    }
  });

  closeLists();
  return html;
}
