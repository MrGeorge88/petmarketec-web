# petmarketec.com — landing World's Best Cat Litter Ecuador

Sitio estático (HTML + CSS + JS) sin build step. Se despliega tal cual en Vercel.

- `index.html` — toda la página (logos embebidos como data URI).
- `styles.css` — tokens de diseño y estilos.
- `main.js` — animaciones (GSAP + ScrollTrigger + Lenis desde CDN), calculadora de rendimiento.
- `assets/` — logos (SVG) y fotos de bolsas (WebP sin fondo). En `index.html` las fotos van embebidas como data URI; si crece el catálogo, conviene pasarlas a archivos.

## Editar contenido
- WhatsApp: buscar `wa.me/593997897533` y reemplazar.
- Tamaños/fórmulas: sección `#productos` en `index.html` y las opciones del formulario `#calc`.
- Regla de rendimiento: `DAYS_PER_LB_PER_CAT` en `main.js` (tabla oficial WBCL: 8 lb → 38+ días, 1 gato).

## Fuentes de los claims
Ver `docs/wbcl-datos-verificados.md`.
