# Roadmap de Tareas - TodoBencina.

Este archivo contiene la lista de tareas pendientes para mejorar y completar la plataforma de TodoBencina.

## Automatización y Datos
- [ ] Configurar un script de scraping o consumo de API (CNE) para actualizar los precios diariamente de forma automática.
- [ ] Implementar un sistema de logs en Python para monitorear errores de generación de páginas.
- [ ] Limpiar archivos JSON antiguos y optimizar el almacenamiento de datos históricos.

## Mejoras de Interfaz (UI/UX)
- [ ] **Modo Oscuro**: Implementar un toggle para cambiar entre modo claro y oscuro respetando la estética premium.
- [ ] **Filtros Avanzados**: Añadir filtros por tipo de combustible (93, 95, 97, Diesel) directamente en el mapa.
- [ ] **Geolocalización Real**: Mejorar el botón de "Bencineras Cerca" para que use la API de Google Maps o Leaflet con mayor precisión.
- [ ] **Favoritos**: Permitir a los usuarios guardar estaciones de servicio favoritas usando LocalStorage.

## Rendimiento y SEO
- [ ] **Optimización de Imágenes**: Convertir todas las imágenes de `images/` a formato WebP para reducir tiempos de carga.
- [ ] **Páginas 404/500**: Crear páginas de error personalizadas con el diseño del sitio.
- [ ] **Sitemap y Robots**: Generar automáticamente el archivo `sitemap.xml` para mejorar la indexación en Google.
- [ ] **Meta Tags Dinámicos**: Asegurar que cada página de comuna tenga un meta-description único generado por el script de Python.

## Funcionalidades Extra
- [ ] **Historial de Precios**: Añadir un gráfico simple de evolución de precios en la página de cada estación.
- [ ] **Calculadora de Ahorro**: Crear una herramienta donde el usuario ponga cuántos litros carga y le diga cuánto ahorra respecto a la bencinera más cara de la zona.
- [ ] **Descuentos por Tarjetas**: Añadir información sobre qué días hay descuentos con qué bancos en cada estación.
