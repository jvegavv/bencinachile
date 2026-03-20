# 📂 Inventario de Librerías y Scripts JS

Este listado detalla las dependencias de JavaScript utilizadas en el proyecto, clasificadas por su funcionalidad principal.

## 🛠️ 1. Infraestructura y Librerías Base
| Archivo | Descripción |
| :--- | :--- |
| `jquery-3.4.1.min.js` | **Librería fundamental.** Facilita la manipulación del HTML, manejo de eventos y animaciones. Es requerida por casi todos los demás scripts. |
| `popper.min.js` | Motor de posicionamiento para elementos emergentes (tooltips, dropdowns). Requisito indispensable para Bootstrap 4. |
| `bootstrap.min.js` | Proporciona la lógica interactiva de los componentes de la interfaz (menús, ventanas modales, alertas). |

## 🗺️ 2. Mapas y Geolocalización (Google Maps)
| Archivo | Funcionalidad |
| :--- | :--- |
| `map.js` | Lógica principal del mapa de resultados y búsqueda global de propiedades. |
| `markerclusterer.js` | Agrupa múltiples marcadores cercanos en un solo icono numérico para evitar el desorden visual en el mapa. |
| `infobox.js` | Permite crear ventanas de información con diseño avanzado y personalizado sobre los pines del mapa. |
| `contact-map.js` | Configuración específica del mapa para la página de contacto o ubicación de oficinas. |
| `single-map.js` | Mapa para la vista de detalle de una propiedad. Gestiona puntos de interés cercanos (escuelas, tiendas). |
| `submit-property-map.js` | Mapa interactivo que permite al usuario ubicar su propiedad mediante un pin al publicarla. |

## 🖼️ 3. Multimedia y Experiencia Visual
| Archivo | Propósito |
| :--- | :--- |
| `photoswipe.min.js` | Motor de galería de imágenes con soporte para zoom, gestos táctiles y pantalla completa. |
| `photoswipe-ui-default.min.js` | Interfaz de usuario estándar (botones de cierre, flechas, contador) para la galería PhotoSwipe. |
| `gallery.js` | Script personalizado que conecta las fotos de la propiedad con el motor de PhotoSwipe. |
| `owl.carousel.min.js` | Crea carruseles o "sliders" horizontales responsivos (ej. para propiedades destacadas). |
| `video.js` | Gestiona la carga y reproducción de videos de YouTube dentro de ventanas modales. |

## ⚙️ 4. Utilidades y Comportamiento de Interfaz
| Archivo | Uso |
| :--- | :--- |
| `dropzone.js` | Habilita la zona de "arrastrar y soltar" para subir archivos/fotos de forma sencilla. |
| `jquery.sticky.js` | Hace que elementos (como el formulario del agente) se queden fijos en pantalla durante el scroll. |
| `numscroller-1.0.js` | Crea la animación de números que suben rápidamente (útil para contadores de estadísticas). |
| `Chart.min.js` | Renderiza gráficos estadísticos interactivos (barras, líneas, etc.) para análisis de precios. |

## 🧠 5. Lógica del Sitio
* **`main.js`**: Es el archivo central. Contiene la configuración específica del sitio, inicializa las librerías mencionadas arriba y define comportamientos únicos como el menú móvil y los filtros de búsqueda.

---

> **⚠️ Nota de implementación:** Para evitar errores de ejecución, el archivo `jquery-3.4.1.min.js` debe cargarse siempre antes que cualquier otro script en el documento HTML.