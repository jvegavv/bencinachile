# 🎨 Documentación de Estilos (CSS) - Resideo

Este listado detalla la función de cada archivo de hojas de estilo utilizado en la plataforma, clasificado por su jerarquía de impacto en el diseño.

---

## 🏗️ 1. Estilos Base y Frameworks
*Son el cimiento visual. Definen reglas globales, rejillas y tipografías.*

| Archivo | Función Principal |
| :--- | :--- |
| **`bootstrap.min.css`** | **Framework Principal.** Provee el sistema de columnas (grid), normaliza estilos entre navegadores y define los componentes básicos (botones, alertas, navegación). |
| **`font-awesome.min.css`** | **Iconografía.** Biblioteca de fuentes que permite insertar iconos vectoriales (ej: íconos de baños, camas, redes sociales) usando clases CSS. |

---

## 🛠️ 2. Estilos de Plugins (Específicos)
*Estilos requeridos para que los componentes interactivos de terceros se vean correctamente.*



### 📦 Carruseles (Owl Carousel)
* **`owl.carousel.min.css`**: Gestiona la estructura técnica (posicionamiento de los elementos en el slider, visibilidad y transición).
* **`owl.theme.default.min.css`**: Define la estética de los controles (color de los puntos de navegación y diseño de las flechas).

### 🖼️ Galería (PhotoSwipe)
* **`photoswipe.css`**: Define el fondo oscuro (overlay), los controles de cierre, zoom y la disposición de las fotos en pantalla completa.

### 📤 Subida de Archivos (Dropzone)
* **`dropzone.css`**: Estiliza el cuadro de arrastre de archivos, las barras de progreso de carga y las miniaturas de las imágenes.

---

## ✒️ 3. Personalización y Diseño Final
*Donde reside la identidad única del sitio web.*

| Archivo | Función Principal |
| :--- | :--- |
| **`style.css`** | **Hoja de Estilos Maestra.** Contiene el diseño personalizado de Resideo: colores de marca, sombras, bordes redondeados específicos, diseño de las tarjetas de propiedades y ajustes de secciones. |

---

## 📌 Jerarquía de Carga Sugerida
Para asegurar que tus personalizaciones tengan prioridad y no existan conflictos, el orden en el `<head>` de tu HTML debe ser:

1.  `bootstrap.min.css` (Base)
2.  `font-awesome.min.css` (Iconos)
3.  `owl.carousel.min.css` / `photoswipe.css` / `dropzone.css` (Plugins)
4.  **`style.css`** (Tu diseño - debe ir al final para sobrescribir a los anteriores).

---

## 💡 Nota sobre Estilos "Inline"
En el archivo `properties.html`, se detectó un bloque `<style>` adicional que maneja la apariencia del buscador **Select2**. 

> **Recomendación:** Para una mejor mantenibilidad, se sugiere mover esas reglas de `properties.html` al final de tu archivo `style.css`.