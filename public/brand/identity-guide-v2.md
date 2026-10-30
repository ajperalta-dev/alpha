# ALPHA — Identidad visual · v2

Revisión basada en `alpha-isologo.jpg` y en la composición v1, siguiendo los ajustes de diseño solicitados.

## Construcción

Los laterales exteriores del símbolo siguen la proyección de las diagonales exteriores de las dos A de ALPHA. La unidad conserva un eje central y una continuidad óptica de pendiente entre el símbolo y las letras. Las A tipográficas tienen travesaño, contraforma superior y abertura inferior; no se sustituyen por triángulos sólidos.

La palabra ALPHA tiene un acabado plano blanco o azul marino. Se han eliminado los halos y destellos de los vértices. Se mantiene la luz del núcleo central y el entramado dorado de las facetas.

En el formato horizontal se conserva completa la unidad símbolo + ALPHA a la izquierda, con los descriptores a la derecha. No separar la palabra de la proyección diagonal del símbolo ni deformar las letras.

## Entregables

- `alpha-logo.jpg` / `.png`: marca vertical sobre fondo oscuro.
- `alpha-logo-claro.jpg` / `.png`: marca vertical sobre blanco.
- `alpha-isologotipo.jpg` / `.png`: marca horizontal.
- `alpha-isologo.jpg`: símbolo revisado sobre fondo oscuro.
- `alpha-isologo-transparente.png`: símbolo con canal alfa.
- `alpha-perfil-marca-1080.jpg`: marca completa para perfil cuadrado.
- `alpha-portada-1600x800.jpg`: portada horizontal.
- `alpha-avatar-512.png`, `alpha-icono-192.png`, `alpha-favicon-64.png`, `alpha-favicon-32.png`: derivados transparentes para aplicaciones digitales.

## Uso

Mantener proporciones y un área libre mínima del 10% del ancho de la unidad. Usar la versión clara en documentos blancos y la versión oscura sobre su fondo incorporado. Los JPG no admiten transparencia; para el símbolo sobre fondos propios usar PNG.

Paleta de apoyo: fondo #030B16; marino #0B2A4A; cian #10C7D9; dorado #FFD34A; blanco #F4F8FC. Son colores de comunicación, no sustitutos de los matices del arte.

La tipografía del logo está integrada en la imagen. Para comunicaciones, usar una sans serif geométrica de acabado plano, sin efectos metálicos, bisel ni resplandor.

## Producción y alcance

Generado con la herramienta integrada de imágenes siguiendo la skill imagegen, con revisión visual de las A, la continuidad diagonal y la ausencia de destellos en vértices. Los prompts completos figuran en `prompts-generacion.txt`.

Los archivos son raster. La alineación de las diagonales es visual, no un plano vectorial medido. Las variantes generadas pueden mostrar diferencias menores en las facetas. El kit v1 permanece disponible como referencia anterior.

## Integración web

La cabecera, el hero y el pie usan el componente `Logo.tsx`: símbolo original de `alpha-logo-web.png` y lettering ALPHA dibujado con trazados SVG. La nueva palabra tiene menor peso, A abiertas con travesaño y separación de 28 unidades respecto al símbolo en una composición de 500 × 450. Las diagonales exteriores prolongan la pendiente del símbolo sin tocarlo. El componente conserva el mismo arte en ambos temas y cambia las letras a blanco sobre fondos oscuros. El hero muestra la marca sin tarjeta, borde, fondo rectangular ni sombra añadida. El pie usa letras blancas porque su fondo siempre es oscuro.

Este refinamiento corresponde a la marca de la web. Los JPG del kit anterior se conservan y no contienen este nuevo lettering.

Los favicons, el icono móvil y el avatar del asistente usan los derivados de identity-v2. La portada horizontal se usa como miniatura Open Graph y Twitter. Los SVG anteriores se conservan como referencia, pero estos componentes ya no los usan.
