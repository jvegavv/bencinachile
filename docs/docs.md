1. Librerías de Base (Infraestructura)

jquery-3.4.1.min.js: Es la base de casi todo lo demás. Facilita la manipulación del HTML, el manejo de eventos y animaciones. Sin esta librería, muchos de los otros archivos (como main.js o jquery.sticky.js) no funcionarían.

bootstrap.min.js: Es el componente lógico de Bootstrap. Se encarga de que los elementos interactivos de la interfaz funcionen, como los menús desplegables (dropdowns), ventanas modales, alertas y el sistema de pestañas.

2. Visualización y Multimedia
Chart.min.js: Se utiliza para crear gráficos estadísticos interactivos (barras, líneas, pasteles). En una página de propiedades, suele usarse para mostrar la evolución de precios o estadísticas del sector.

gallery.js: Gestiona la visualización de las fotos de la propiedad. Probablemente permite abrir las imágenes en pantalla completa, navegar entre ellas y aplicar efectos de transición (utiliza internamente PhotoSwipe según el código).

dropzone.js: Es una librería que permite arrastrar y soltar archivos (drag & drop) para subirlos al servidor. Es común verla en formularios donde el usuario debe subir fotos de su propia casa.

3. Mapas e Información Geográfica
contact-map.js: Configura y personaliza un mapa de Google Maps para mostrar la ubicación exacta de la propiedad o de la oficina de contacto. Define las coordenadas iniciales y el estilo visual del mapa.

infobox.js: Es un complemento para los mapas. Permite crear ventanas de información personalizadas y con mejor diseño que las que vienen por defecto en Google Maps cuando haces clic en un marcador.

4. Comportamiento y Diseño de la Interfaz
jquery.sticky.js: Se utiliza para hacer que un elemento se quede "pegado" en la parte superior de la pantalla mientras el usuario hace scroll hacia abajo. En tu archivo main.js, se usa específicamente para que la sección del agente inmobiliario (.pxp-sp-agent-section) sea persistente.

main.js: Es el "cerebro" personalizado de tu sitio. Aquí se configura cómo deben reaccionar los elementos específicos de tu plantilla:

Controla el menú móvil.
Activa la función "sticky" mencionada arriba.
Maneja la apertura y cierre de la búsqueda avanzada.
Configura el funcionamiento de los sliders (carruseles) de promociones.

5. Visualización de Imágenes y Galerías Pro
photoswipe.min.js y photoswipe-ui-default.min.js: Es una de las mejores librerías para crear galerías de imágenes. A diferencia de una galería simple, PhotoSwipe permite hacer zoom táctil en móviles, deslizar entre fotos con gestos y manejar la "historia" del navegador (para que si el usuario pulsa "atrás", se cierre la foto en lugar de salir de la página).

owl.carousel.min.js: Es un plugin muy popular para crear "carruseles" o sliders. Se usa para que las listas de propiedades o testimonios se puedan deslizar horizontalmente de forma fluida y responsiva.

6. Mapas Avanzados (Google Maps Ecosystem)
Estos tres archivos trabajan juntos para la búsqueda de propiedades:

map.js: Es el script principal que controla el mapa de resultados. Se encarga de mostrar todas las propiedades disponibles, centrar el mapa y gestionar la interacción (por ejemplo, que al pasar el mouse sobre una tarjeta de propiedad, el marcador en el mapa se resalte).

markerclusterer.js: Fundamental si tienes muchas propiedades. Sirve para "agrupar" marcadores. Si hay 20 casas en una misma zona, en lugar de ver 20 iconos amontonados, verás un círculo con el número "20". Al hacer clic, el mapa se acerca y los separa.

single-map.js: Se usa específicamente en la página de detalle de una propiedad. Su función suele ser mostrar no solo dónde está la casa, sino también los "Puntos de Interés" cercanos (colegios, farmacias, transporte).

submit-property-map.js: Este script se activa en el formulario donde un usuario sube una propiedad. Permite que la persona mueva un pin en el mapa para indicar la ubicación exacta de su inmueble.

7. Utilidades y Efectos Visuales
popper.min.js: Es una librería de posicionamiento. Se usa principalmente para que los "tooltips" (globos de texto) y menús desplegables se ubiquen correctamente y no se corten si están cerca del borde de la pantalla. Es un requisito para que Bootstrap funcione al 100%.

numscroller-1.0.js: Sirve para crear un efecto de "contador animado". Cuando el usuario baja hasta una sección de estadísticas (ej: "Más de 500 casas vendidas"), el número empieza a subir rápidamente desde 0 hasta llegar al valor final.

video.js: Este script personalizado gestiona la reproducción de videos (probablemente de YouTube) dentro de ventanas modales en la página, asegurándose de que el video se detenga cuando cierras la ventana y que se adapte al tamaño de la pantalla.