var marcadoresEstaciones = {};
var map;
var latitud = -33.447487
var longitud = -70.673676
var carMarker;
const ancho_responsive = 991



document.addEventListener('DOMContentLoaded', function () {

    /*-----------------------------------------------------------------
       ###################### Inicializar Mapa ######################
    -----------------------------------------------------------------*/

    latitud = $('#latitud').val();
    longitud = $('#longitud').val();

    map = L.map('results-map', {
        zoomControl: false,
        fullscreenControl: false // Lo dejamos en false aquí
        // Los controles de Resideo suelen chocar, mejor quitarlos o moverlos
    }).setView([latitud, longitud], 15);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    /*-----------------------------------------------------------------
     ###################### ###################### ####################
    -----------------------------------------------------------------*/


    /*-----------------------------------------------------------------
    ###################### Controles del Mapa ######################
    -----------------------------------------------------------------*/
    var fullScreen = new L.Control.Fullscreen({
        position: 'topright' // Asegúrate de que sea 'topright' (todo junto y minúsculas)
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    /*-----------------------------------------------------------------
    BOTÓN DE GEOUBICACIÓN
    -----------------------------------------------------------------*/
    L.Control.Locate = L.Control.extend({
        onAdd: function (map) {
            var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
            var button = L.DomUtil.create('a', 'leaflet-control-locate', container);
            button.innerHTML = '<i class="fa fa-crosshairs"></i>'; // Icono de mira de FontAwesome
            button.title = "Mi ubicación";

            L.DomEvent.on(button, 'click', function (e) {

                if (navigator.permissions) {
                    navigator.permissions.query({ name: 'geolocation' }).then(function (result) {
                        // El estado puede ser: 'granted', 'denied' o 'prompt'
                        console.log("Estado actual del permiso:", result.state);

                        permisos_geo_navegador(result);

                        // Escuchar si el usuario cambia el permiso mientras está en la página
                        result.onchange = function () {

                            permisos_geo_navegador(result);


                            console.log("El permiso ha cambiado a:", result.state);
                        };
                    });
                } else {
                    console.log("Tu navegador no soporta la API de Permisos.");
                }

            });

            return container;
        }
    });

    // Añadir el control al mapa (en la esquina inferior derecha, sobre el zoom)
    map.addControl(new L.Control.Locate({ position: 'bottomright' }));


    /*-----------------------------------------------------------------
      ###################### ###################### ####################
     -----------------------------------------------------------------*/

    /*-----------------------------------------------------------------
    ###################### GPS ######################
    -----------------------------------------------------------------*/



    // 3. Iconos Personalizados
    var iconoAuto = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/3085/3085330.png',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });

    let geolocalizar = localStorage.getItem('geolocalizar');

    if (geolocalizar == 'true') {

        console.log(" Geolocalizacion de segunda true");
        console.log(" carMarker 2 " + carMarker);
        console.log(" Boolean " + !carMarker);

        if (!carMarker) {

            map.stopLocate();
            map.off('locationfound');
            map.off('locationerror');


            // 4. Iniciar el movimiento
            map.locate({
                setView: false, // Lo manejamos manualmente arriba para mejor control
                watch: true,
                enableHighAccuracy: true,
                maximumAge: 1000, // No usar posiciones guardadas en caché de más de 1 seg
                timeout: 10000    // Tiempo límite para encontrar señal
            });


        }
        // 2. Escuchar el evento 'locationfound'
        map.on('locationfound', function (e) {
            console.log(`[${new Date().toLocaleTimeString()}] location-found 2`);
            if (!carMarker) {


                // Primera vez: creamos el marcador y centramos el mapa
                carMarker = L.marker(e.latlng, { icon: iconoAuto }).addTo(map)
                    .bindPopup("Estás aqui");


                console.log("GEO AUTO 2 - 1");

                // map.setView(e.latlng, 16); // Centrar la cámara la primera vez
            } else {
                // Actualizaciones siguientes: solo movemos el marcador
                carMarker.setLatLng(e.latlng);
                console.log("GEO AUTO 2 - 2");
                // OPCIONAL: Si quieres que el mapa SIEMPRE te siga al centro:
                // map.panTo(e.latlng);
            }
        });

        localStorage.setItem('geolocalizar', true);

        // 3. Manejo de errores (Muy importante en móviles)
        map.on('locationerror', function (e) {

            error_geo_localizacion(map);
        });


    }


    /*-----------------------------------------------------------------
     ###################### ###################### ####################
    -----------------------------------------------------------------*/

    /*-----------------------------------------------------------------
    ###################### Redimensionar MAPA  ######################
    -----------------------------------------------------------------*/


    // Seleccionamos todos los botones que activan cambios de vista
    const toggleButtons = document.querySelectorAll('.pxp-adv-toggle, .pxp-map-toggle, .pxp-list-toggle');

    toggleButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Esperamos un momento breve (200ms) para que la animación de CSS termine 
            // y el div tenga su tamaño final antes de recalcular.
            redimensionar_mapa(map)
        });
    });

    /*-----------------------------------------------------------------
     ###################### ###################### ####################
    -----------------------------------------------------------------*/

    /*-----------------------------------------------------------------
      ###################### Cargar estaciones ####################
     -----------------------------------------------------------------*/

    // 3. Iconos Personalizados - Definimos una función para crear marcadores dinámicos
    function crearIconoEstacion(logoUrl) {
        // Fallback si el logo es inválido o nulo
        const fallbackLogo = '../images/estacion_servicio_independientes.png';
        const finalLogo = (logoUrl && logoUrl !== '/') 
                          ? logoUrl : fallbackLogo;

        return L.divIcon({
            className: 'custom-marker-container',
            html: `
                <div class="custom-station-marker">
                    <div class="marker-logo-inner" style="background-image: url('${finalLogo}');"></div>
                </div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40]
        });
    }


    // 3. Carga dinámica de Datos desde el JSON de la comuna
    // Ajusta la ruta según donde esté tu carpeta 'comunas_data' respecto al HTML

    var nombre_json = $('#comuna_json').val();

    const rutaJson = '/comunas_data/' + nombre_json;

    fetch(rutaJson)
        .then(response => {
            if (!response.ok) {
                throw new Error(`No se pudo cargar el archivo: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            // Accedemos a data.estaciones porque así lo definimos en el script de Python
            const estaciones = data.estaciones;

            console.log(estaciones)
            // 4. Dibujar marcadores de bombas
            estaciones.forEach(function (est) {
                // Importante: Verifica que los nombres de las propiedades (lat, lng, nombre) 
                // coincidan exactamente con las que entrega la API de bencinaenlinea

                let valor_93 = "" //1
                let valor_95 = "" //7
                let valor_97 = "" //2
                let valor_DI = "" //3
                let valor_KE = "" //4
                let valor_GNC = "" //5
                let valor_GLP = "" //6
                let valor_A93 = "" //8
                let valor_A95 = "" //9
                let valor_A97 = "" //10
                let valor_ADI = "" //11
                let valor_AKE = "" //12
                let listado_bencineras_html = ""
                             est.combustibles.forEach(function (combustible) {
                    // Badge moderno por cada combustible
                    let badge_html = `
                        <div class="popup-fuel-badge">
                            <div class="popup-fuel-type">${combustible.nombre_largo}</div>
                            <div class="popup-fuel-price">${formatearTodoBencina(combustible.precio, "precio")} <span>${combustible.unidad_cobro}</span></div>
                        </div>
                    `;
                    listado_bencineras_html += badge_html;
                });

                // Logo con fallback para el popup
                const fallbackPopupLogo = '../images/estacion_servicio_independientes.png';
                const finalPopupLogo = (est.logo && est.logo !== '/') 
                                       ? est.logo : fallbackPopupLogo;

                var marker_map = L.marker([est.latitud, est.longitud], { icon: crearIconoEstacion(est.logo) })
                    .addTo(map)
                    .bindPopup(`
                        <div class="custom-bencina-popup">
                            <div class="popup-header">
                                <div class="brand-logo-circle">
                                    <img src="${finalPopupLogo}" alt="${est.nombre_bencinera}" onerror="this.src='${fallbackPopupLogo}'">
                                </div>
                                <div class="brand-info">
                                    <h3>${est.nombre_bencinera}</h3>
                                    <p><i class="bi bi-geo-alt"></i> ${est.direccion}</p>
                                </div>
                            </div>
                            
                            <div class="popup-prices-grid">
                                ${listado_bencineras_html}
                            </div>
                
                            <div class="popup-actions">
                                <a href="https://www.google.com/maps/search/?api=1&query=${est.latitud},${est.longitud}" 
                                   target="_blank" class="btn-popup-ruta gmaps">
                                   <i class="bi bi-geo-alt"></i> Google Maps
                                </a>
                                <a href="https://waze.com/ul?ll=${est.latitud},${est.longitud}&navigate=yes" 
                                   target="_blank" class="btn-popup-ruta waze">
                                   <i class="bi bi-compass"></i> Waze
                                </a>
                            </div>
                        </div>
                    `, {
                        maxWidth: 350,
                        minWidth: 300,
                        className: 'custom-popup-pane',
                        autoPan: true,
                        autoPanPadding: [50, 50], // Asegura que el popup siempre se vea
                        keepInView: true
                    });


                // Usamos la ID real de la estación para el objeto de seguimiento
                marcadoresEstaciones[est.id] = marker_map;
            });

            console.log("Marcadores cargados desde JSON:", marcadoresEstaciones);
        })
        .catch(error => {
            console.error("Error al cargar las estaciones:", error);
        });

    /*-----------------------------------------------------------------
     ###################### ###################### ####################
    -----------------------------------------------------------------*/


    /********************* POP UP MAPA *******************/

    // Detectar el paso del mouse sobre la tarjeta
    $('.pxp-agents-1-item').on('mouseenter', function () {
        // Obtenemos el ID de la estación desde el atributo data-prop
        var propId = $(this).attr('data-prop');

        console.log("mouse sobre tarjeta " + propId)
        // Verificamos si el marcador existe en nuestro objeto global
        if (marcadoresEstaciones[propId]) {
            var marker_map = marcadoresEstaciones[propId];

            // Abrimos el popup
            marker_map.openPopup();

            // Opcional: Centrar el mapa suavemente en la estación al pasar el mouse
            map.panTo(marker_map.getLatLng());
        }
    });

    // Opcional: Cerrar el popup al quitar el mouse
    $('.pxp-agents-1-item').on('mouseleave', function () {
        var propId = $(this).attr('data-prop');
        if (marcadoresEstaciones[propId]) {
            marcadoresEstaciones[propId].closePopup();
        }
    });


    /*************************Apretamos el boton MAPA en la version mobile *****************/


    $('.pxp-agents-1-item').on('click', function (e) {

        var anchoVentana = $(window).width();

        // Obtiene el valor "1838"
        var propId = $(this).data('prop');

        if (anchoVentana <= 991) {

            $('.pxp-map-side').addClass('pxp-max');
            $('.pxp-content-side').addClass('pxp-min');
            $('.pxp-list-toggle').show();

            if (marcadoresEstaciones[propId]) {
                var marker_map = marcadoresEstaciones[propId];
                marker_map.getPopup().options.closeOnClick = true;

                // Opcional: Centrar el mapa suavemente en la estación al pasar el mouse

                redimensionar_mapa(map).then(() => {

                    map.setView(marker_map.getLatLng(), 16); // Centrar la cámara la primera vez
                    map.once('moveend', function () {
                        marker_map.openPopup();
                    });

                });
            }
        }
    });





});







function redimensionar_mapa(map) {

    return new Promise((resolve) => {

        map.once('resize', () => {
            console.log("Evento resize completado");
            resolve();
        });

        setTimeout(function () {
            map.invalidateSize({ animate: true });
        }, 300);
    });

}


function geolocalizar_mapa(map) {

    var iconoAuto = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/3085/3085330.png',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });

    // 4. Iniciar el movimiento
    map.locate({
        setView: false, // Lo manejamos manualmente arriba para mejor control
        watch: true,
        enableHighAccuracy: true,
        maximumAge: 1000, // No usar posiciones guardadas en caché de más de 1 seg
        timeout: 10000    // Tiempo límite para encontrar señal
    });



    // 2. Escuchar el evento 'locationfound'
    map.on('locationfound', function (e) {
        console.log(`[${new Date().toLocaleTimeString()}] location-found 1`);
        if (!carMarker) {

            // Primera vez: creamos el marcador y centramos el mapa
            carMarker = L.marker(e.latlng, { icon: iconoAuto }).addTo(map)
            console.log("GEO AUTO 1 - 1");

            map.setView(e.latlng, 16); // Centrar la cámara la primera vez
        } else {
            // Actualizaciones siguientes: solo movemos el marcador
            carMarker.setLatLng(e.latlng);
            console.log("GEO AUTO 1 - 2");
            // OPCIONAL: Si quieres que el mapa SIEMPRE te siga al centro:
            map.panTo(e.latlng);
        }
    });

    localStorage.setItem('geolocalizar', true);

    // 3. Manejo de errores (Muy importante en móviles)
    map.on('locationerror', function (e) {
        error_geo_localizacion(map);
    });

}

function permisos_geo_navegador(result) {

    map.stopLocate();
    map.off('locationfound');
    map.off('locationerror');

    const modal = document.getElementById('gpsModal');
    const mapaContenedor = document.getElementById('results-map');

    map.locate({
        setView: false, // Lo manejamos manualmente arriba para mejor control
        watch: true,
        enableHighAccuracy: true,
        maximumAge: 1000, // No usar posiciones guardadas en caché de más de 1 seg
        timeout: 10000    // Tiempo límite para encontrar señal
    });

    if (result.state === 'granted') {
        console.log("✅ El usuario ya aprobó el uso.");
        geolocalizar_mapa(map)

        // Aquí puedes llamar a tu función de obtener ubicación
    } else if (result.state === 'prompt') {
        console.log("⏳ El navegador aún no ha preguntado o está esperando decisión.");

        if (document.fullscreenElement || document.webkitFullscreenElement) {
            console.log("Error en mapa full");
            mapaContenedor.appendChild(modal);
        }
        $('#gpsModal').modal('show');


    } else if (result.state === 'denied') {
        console.log("❌ El usuario bloqueó la geolocalización.");

        if (document.fullscreenElement || document.webkitFullscreenElement) {
            console.log("Error en mapa full");
            mapaContenedor.appendChild(modal);
        }
        $('#gpsModal').modal('show');


        localStorage.setItem('geolocalizar', false);
    }
}

function error_geo_localizacion(map) {

    map.stopLocate();
    map.off('locationfound');
    map.off('locationerror');
    localStorage.setItem('geolocalizar', false);
    console.log("❌ Llegamos por el error exception");
    $('#gpsModal').modal('show');

}

/**
 * Formatea datos técnicos al estándar de Chile
 * @param {string|number} valor - El dato raw (ej: "1000,000" o "2026-03-26")
 * @param {string} tipo - 'precio' o 'fecha'
 */
/**
 * Formatea datos técnicos al estándar de Chile (Incluye Fecha + Hora)
 * @param {string|number} valor - El dato raw (ej: "2026-03-26 14:30:00" o "1000,000")
 * @param {string} tipo - 'precio' o 'fecha'
 */
function formatearTodoBencina(valor, tipo) {
    if (!valor) return "N/D";

    if (tipo === 'precio') {
        let num = parseFloat(valor.toString().replace(',', '.'));
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(num);
    }

    if (tipo === 'fecha') {
        // Creamos el objeto Date. 
        // Si el valor ya trae hora, Date() lo reconocerá automáticamente.
        const fechaObj = new Date(valor.replace(' ', 'T'));

        return fechaObj.toLocaleString('es-CL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false // Formato 24 horas (ej: 14:30 en vez de 2:30 PM)
        });
    }

    return valor;
}