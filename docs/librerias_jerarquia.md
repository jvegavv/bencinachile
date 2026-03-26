# 🎖️ Jerarquía y Cadena de Mando (Dependencias JS)

Este documento detalla la relación de dependencia entre los scripts del proyecto. El orden de los niveles indica el orden crítico de carga en el HTML.

---

## 🔝 Nivel 0: El Cimiento (Requisitos Globales)
*Son las librerías base. Sin ellas, el resto de la cadena de mando no puede emitir órdenes.*

| Script | Rol | Depende de |
| :--- | :--- | :--- |
| **`jquery-3.4.1.min.js`** | **General en Jefe.** Provee el objeto `$` y la infraestructura para plugins. | Nadie (Independiente) |
| **`popper.min.js`** | **Especialista en Posición.** Realiza cálculos matemáticos para elementos flotantes. | Nadie (Independiente) |

---

## 🏛️ Nivel 1: La Estructura (Frameworks)
*Definen el comportamiento global de la interfaz de usuario.*

| Script | Rol | Invoca / Requiere a |
| :--- | :--- | :--- |
| **`bootstrap.min.js`** | **Infraestructura Visual.** Gestiona modales, menús y colapsables. | `jQuery` y `Popper.js` |

---

## 🛠️ Nivel 2: Los Especialistas (Plugins de Terceros)
*Herramientas que "enseñan" nuevas habilidades a jQuery o se integran con APIs externas.*



### 🔹 Dependientes de jQuery
* **`owl.carousel.min.js`**: Habilita la función `.owlCarousel()`.
* **`jquery.sticky.js`**: Habilita la función `.sticky()`.
* **`numscroller-1.0.js`**: Habilita la animación de contadores.
* **`dropzone.js`**: Habilita la carga de archivos por arrastre.

### 🔹 Dependientes de Google Maps API
* **`markerclusterer.js`**: Necesita los objetos de `google.maps` para agrupar pines.
* **`infobox.js`**: Extiende la clase `google.maps.OverlayView` para crear etiquetas personalizadas.

### 🔹 Ecosistema de Galería (PhotoSwipe)
* **`photoswipe-ui-default.min.js`**: Depende totalmente de **`photoswipe.min.js`** (el motor) para poder dibujar la interfaz.

---

## 👨‍💻 Nivel 3: Los Operadores (Scripts de Implementación)
*Contienen la lógica de negocio. Son los que realmente ejecutan las órdenes hacia los niveles superiores.*

| Script "Consumidor" | "Manda" a (Invocación) | Acción que realiza |
| :--- | :--- | :--- |
| **`gallery.js`** | `PhotoSwipe` | Ejecuta `new PhotoSwipe(...)` para abrir las fotos. |
| **`map.js`** | `MarkerClusterer` | Ejecuta `new MarkerClusterer(...)` para organizar el mapa. |
| **`video.js`** | `Bootstrap` | Ejecuta `.modal('show')` para abrir el reproductor de video. |
| **`single-map.js`** | `Google Maps` | Dibuja puntos de interés (restaurantes, etc.) sobre el mapa. |

---

## 🎼 Nivel 4: El Director de Orquesta (Lógica Final)
*El punto más alto de la jerarquía. Coordina múltiples librerías simultáneamente.*

### **`main.js`**
Este es el archivo de mayor jerarquía operativa. Sus funciones principales incluyen:
1. **Controlar a `jquery.sticky.js`**: Decide cuándo activar el panel lateral del agente (`.sticky()`) basado en el ancho de la ventana.
2. **Coordinar a `bootstrap.min.js`**: Escucha eventos de los carruseles (`slide.bs.carousel`) para sincronizar textos y animaciones.
3. **Gestión de Interfaz**: Abre y cierra formularios de búsqueda avanzada que afectan el diseño global.

---

## ⚠️ Regla de Oro para el Desarrollador
> **"El orden de carga es el orden de la pirámide"**: 
> Si cargas un **Operador (Nivel 3)** antes que su **Cimiento (Nivel 0)**, el navegador no reconocerá los comandos y la página fallará. Siempre coloca `jquery.js` al inicio y `main.js` al final del cuerpo (`</body>`).