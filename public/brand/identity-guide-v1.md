# ALPHA — Identidad visual JPG / PNG · v1

Fuente: `public/brand/alpha-isologo.jpg`. Este kit es una nueva familia raster basada en esa referencia. Las imágenes JPG/PNG anteriores y los SVG de la web se conservan.

## Construcción triangular

La A facetada y la palabra ALPHA son una unidad. La palabra se coloca inmediatamente bajo el símbolo, centrada sobre su eje vertical. Su ancho continúa visualmente las diagonales exteriores del emblema: la primera A y la última A funcionan como extremos de la base ampliada del mismo triángulo.

La alineación es óptica, con tolerancia por la forma de las letras y el brillo. Para futuras composiciones, si el símbolo mide W de ancho y H de alto desde el vértice hasta su base, la línea de base del texto situada d por debajo pide un ancho orientativo W × (H + d) / H. No comprimir ALPHA al ancho interior del símbolo ni separar la palabra a la derecha. En la versión horizontal, conservar toda la unidad triangular a la izquierda y colocar los descriptores a la derecha.

## Archivos y usos

| Archivo | Uso |
| --- | --- |
| alpha-logo.jpg / .png | Marca completa vertical sobre fondo oscuro; presentaciones y portada |
| alpha-logo-claro.jpg / .png | Marca completa vertical sobre blanco; documentos e impresión |
| alpha-isologotipo.jpg / .png | Composición horizontal, manteniendo A + ALPHA como unidad |
| alpha-isologo.jpg | Copia íntegra de la referencia, sin texto |
| alpha-isologo-transparente.png | Símbolo con canal alfa para composiciones sobre otros fondos |
| alpha-perfil-marca-1080.jpg | Perfil cuadrado con marca y descriptores |
| alpha-portada-1600x800.jpg | Cabecera horizontal de marca |
| alpha-avatar-512.png | Avatar cuadrado transparente; símbolo sin texto |
| alpha-icono-192.png | Icono de aplicación |
| alpha-favicon-64.png / alpha-favicon-32.png | Iconos de navegador; validar legibilidad a tamaño real |

Los JPG tienen fondo fijo y calidad 95. Los PNG del logo y del isologotipo también tienen fondo fijo; solo el símbolo transparente y sus iconos derivados contienen transparencia. Los exportados mantienen la relación de aspecto y no estiran el dibujo. Los tamaños pequeños sirven para reconocimiento de la silueta; las facetas finas no serán legibles a 32 px.

## Paleta de apoyo

- Fondo oscuro: #030B16.
- Azul institucional / texto sobre blanco: #0B2A4A.
- Cian de apoyo: #10C7D9.
- Dorado de apoyo: #FFD34A.
- Blanco de apoyo: #F4F8FC.

Estos colores sirven para piezas de comunicación; el emblema contiene gradientes y matices adicionales.

## Tipografía y protección

Usar una sans geométrica robusta para titulares (Montserrat Bold o equivalente) y una sans legible para cuerpo. La palabra ALPHA de las imágenes forma parte del arte y no debe recomponerse con otra fuente. Dejar alrededor de la marca un margen mínimo equivalente al 10% del ancho de la unidad triangular. No deformar, recortar el vértice, cambiar el orden de los descriptores ni cubrir el núcleo luminoso.

## Producción

Generado con la herramienta integrada de imágenes. La skill de imágenes guio la conservación de la referencia, la construcción de las variantes y la revisión visual. El JPG es raster: no utilizar estos archivos como originales vectoriales para grandes ampliaciones, bordado o corte. Las variantes generadas pueden tener pequeñas diferencias de facetas respecto del JPG fuente; la copia `alpha-isologo.jpg` conserva el original exacto.

Brief aplicado: «Conservar la A facetada azul/cian/dorada y su núcleo solar. Unir A + ALPHA mediante las diagonales del mismo triángulo. Crear marca vertical oscura, variante clara, composición horizontal con la unidad triangular a la izquierda y símbolo transparente. Texto: ALPHA; DIGITAL TRANSFORMATION; CONSULTORA DE DATOS E IA».

Los prompts completos se guardan en `prompts-generacion.txt`. No se ha cambiado automáticamente la marca que utiliza la web.
