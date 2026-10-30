# Identidad ALPHA en la web

Los SVG de esta carpeta son copias de los originales de `ALPHA-identidad-vectorial`.
Usar la variante `claro` sobre fondos blancos y `oscuro` sobre fondos negros.
Conservar geometría, proporciones y espacio de seguridad.

El sistema visual se define en `src/index.css`:

- Negro y blanco como únicos colores de marca. Bordes y textos secundarios usan opacidad del mismo color.
- Barlow para texto e interfaz, como sustituto abierto de la sans serif industrial de la referencia SpaceX; titulares en mayúsculas, negrita y con espaciado amplio. El logotipo conserva sus trazados originales.
- Controles circulares y botones redondeados; paneles de contenido con radios de 24–28 px.
- Secciones invertidas para casos de uso y contacto; ambos temas comparten las mismas reglas.
- Movimiento de ilustraciones activado por la persona y compatible con movimiento reducido.
- Formularios, diálogos, asistentes y estados de error utilizan los mismos componentes visuales.

Para regenerar la imagen social y el icono de Apple desde los SVG:

```sh
node scripts/render-brand-assets.mjs
```
