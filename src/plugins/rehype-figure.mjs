// ![Подпись](/images/a.jpg "right small")  ->  <figure class="right small"><img><figcaption>Подпись</figcaption></figure>
const isBlank = (n) => n.type === 'text' && !n.value.trim();

export default function rehypeFigure() {
  const walk = (node) => {
    if (!node.children) return;
    node.children = node.children.map((c) => {
      if (c.type === 'element' && c.tagName === 'p') {
        const kids = c.children.filter((k) => !isBlank(k));
        const img = kids[0];
        if (kids.length === 1 && img.type === 'element' && img.tagName === 'img') {
          const { title, alt } = img.properties || {};
          const cls = title ? String(title).split(/\s+/) : [];
          delete img.properties.title;
          img.properties.loading = 'lazy';
          const cap = alt ? [{ type: 'element', tagName: 'figcaption', properties: {}, children: [{ type: 'text', value: String(alt) }] }] : [];
          return { type: 'element', tagName: 'figure', properties: { className: cls }, children: [img, ...cap] };
        }
      }
      walk(c);
      return c;
    });
  };
  return (tree) => walk(tree);
}
