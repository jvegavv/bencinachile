var marcadoresEstaciones = {};
var map;
var latitud = -33.447487
var longitud = -70.673676
var carMarker;
const ancho_responsive = 991
var mapInitialized = false;
var mapInitializing = false;

document.addEventListener('DOMContentLoaded', function () {
    const anchoVentana = $(window).width();

    if (anchoVentana > ancho_responsive) {
        initMap();
    }

    /*-----------------------------------------------------------------
    ###################### Redimensionar MAPA  ######################
    -----------------------------------------------------------------*/

    // Seleccionamos todos los botones que activan cambios de vista
    const toggleButtons = document.querySelectorAll('.pxp-adv-toggle, .pxp-map-toggle, .pxp-list-toggle');

    toggleButtons.forEach(button => {
        button.addEventListener('click', async function () {
            await initMapIfNecessary();
            // Esperamos un momento breve (200ms) para que la animación de CSS termine 
            // y el div tenga su tamaño final antes de recalcular.
            redimensionar_mapa(map)
        });
    });

    /*-----------------------------------------------------------------
     ###################### ###################### ####################
    -----------------------------------------------------------------*/

    /********************* POP UP MAPA *******************/

    // Detectar el paso del mouse sobre la tarjeta
    $('.pxp-agents-1-item').on('mouseenter', function () {
        if (!mapInitialized) return;

        // Obtenemos el ID de la estación desde el atributo data-prop
        var propId = $(this).attr('data-prop');

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
        if (!mapInitialized) return;

        var propId = $(this).attr('data-prop');
        if (marcadoresEstaciones[propId]) {
            marcadoresEstaciones[propId].closePopup();
        }
    });


    /*************************Apretamos el boton MAPA en la version mobile *****************/

    $('.pxp-agents-1-item').on('click', async function (e) {
        var anchoVentana = $(window).width();

        if (anchoVentana <= 991) {
            await initMapIfNecessary();

            // Obtiene el valor "1838"
            var propId = $(this).data('prop');

            $('.pxp-map-side').addClass('pxp-max');
            $('.pxp-content-side').addClass('pxp-min');
            $('.pxp-list-toggle').show();

            if (marcadoresEstaciones[propId]) {
                var marker_map = marcadoresEstaciones[propId];
                marker_map.getPopup().options.closeOnClick = true;

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

async function initMapIfNecessary() {
    if (mapInitialized) return;
    if (mapInitializing) {
        return new Promise(resolve => {
            const interval = setInterval(() => {
                if (mapInitialized) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
        });
    }

    mapInitializing = true;
    injectMapLoaderModal();
    $('#mapLoadingModal').modal('show');

    try {
        await initMap();
    } catch (error) {
        console.error("Error al inicializar el mapa:", error);
    } finally {
        mapInitialized = true;
        mapInitializing = false;
        setTimeout(() => {
            $('#mapLoadingModal').modal('hide');
        }, 500);
    }
}

function injectMapLoaderModal() {
    if (document.getElementById('mapLoadingModal')) return;

    const modalHtml = `
        <div class="modal fade" id="mapLoadingModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-body">
                        <div class="map-loader-container">
                            <div class="map-loader-spinner"></div>
                            <div class="map-loader-text">Inicializando Mapa...</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function initMap() {
    return new Promise((resolve, reject) => {
        latitud = $('#latitud').val() || latitud;
        longitud = $('#longitud').val() || longitud;

        map = L.map('results-map', {
            zoomControl: false,
            fullscreenControl: false
        }).setView([latitud, longitud], 15);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(map);

        new L.Control.Fullscreen({ position: 'topright' }).addTo(map);
        L.control.zoom({ position: 'bottomright' }).addTo(map);

        L.Control.Locate = L.Control.extend({
            onAdd: function (map) {
                var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
                var button = L.DomUtil.create('a', 'leaflet-control-locate', container);
                button.innerHTML = '<i class="fa fa-crosshairs"></i>';
                button.title = "Mi ubicación";

                L.DomEvent.on(button, 'click', function (e) {
                    if (navigator.permissions) {
                        navigator.permissions.query({ name: 'geolocation' }).then(function (result) {
                            permisos_geo_navegador(result);
                            result.onchange = function () {
                                permisos_geo_navegador(result);
                            };
                        });
                    }
                });
                return container;
            }
        });

        map.addControl(new L.Control.Locate({ position: 'bottomright' }));

        var iconoAuto = L.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/3085/3085330.png',
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });

        let geolocalizar = localStorage.getItem('geolocalizar');

        if (geolocalizar == 'true') {
            if (!carMarker) {
                map.stopLocate();
                map.off('locationfound');
                map.off('locationerror');

                map.locate({
                    setView: false,
                    watch: true,
                    enableHighAccuracy: true,
                    maximumAge: 1000,
                    timeout: 10000
                });
            }
            map.on('locationfound', function (e) {
                if (!carMarker) {
                    carMarker = L.marker(e.latlng, { icon: iconoAuto }).addTo(map).bindPopup("Estás aqui");
                } else {
                    carMarker.setLatLng(e.latlng);
                }
            });
            map.on('locationerror', function (e) {
                error_geo_localizacion(map);
            });
        }

        function crearIconoEstacion(logoUrl) {
            const fallbackLogo = '../images/estacion_servicio_independientes.png';
            const finalLogo = (logoUrl && logoUrl !== '/') ? logoUrl : fallbackLogo;

            return L.divIcon({
                className: 'custom-marker-container',
                html: `<div class="custom-station-marker"><div class="marker-logo-inner" style="background-image: url('${finalLogo}');"></div></div>`,
                iconSize: [40, 40],
                iconAnchor: [20, 40],
                popupAnchor: [0, -40]
            });
        }

        var nombre_json = $('#comuna_json').val();
        const rutaJson = '/comunas_data/' + nombre_json;

        fetch(rutaJson)
            .then(response => {
                if (!response.ok) throw new Error(`No se pudo cargar el archivo: ${response.statusText}`);
                return response.json();
            })
            .then(data => {
                const estaciones = data.estaciones;
                estaciones.forEach(function (est) {
                    let listado_bencineras_html = "";
                    est.combustibles.forEach(function (combustible) {
                        listado_bencineras_html += `<div class="popup-fuel-badge"><div class="popup-fuel-type">${combustible.nombre_largo}</div><div class="popup-fuel-price">${formatearTodoBencina(combustible.precio, "precio")} <span>${combustible.unidad_cobro}</span></div></div>`;
                    });

                    const fallbackPopupLogo = '../images/estacion_servicio_independientes.png';
                    const finalPopupLogo = (est.logo && est.logo !== '/') ? est.logo : fallbackPopupLogo;

                    var marker_map = L.marker([est.latitud, est.longitud], { icon: crearIconoEstacion(est.logo) })
                        .addTo(map)
                        .bindPopup(`
                            <div class="custom-bencina-popup">
                                <div class="popup-header">
                                    <div class="brand-logo-circle"><img src="${finalPopupLogo}" alt="${est.nombre_bencinera}" onerror="this.src='${fallbackPopupLogo}'"></div>
                                    <div class="brand-info"><h3>${est.nombre_bencinera}</h3><p><i class="bi bi-geo-alt"></i> ${est.direccion}</p></div>
                                </div>
                                <div class="popup-prices-grid">${listado_bencineras_html}</div>
                                <div class="popup-actions">
                                    <a href="https://www.google.com/maps/search/?api=1&query=${est.latitud},${est.longitud}" target="_blank" class="btn-popup-ruta gmaps"><i class="bi bi-geo-alt"></i> Google Maps</a>
                                    <a href="https://waze.com/ul?ll=${est.latitud},${est.longitud}&navigate=yes" target="_blank" class="btn-popup-ruta waze"><i class="bi bi-compass"></i> Waze</a>
                                </div>
                            </div>`, { maxWidth: 350, minWidth: 300, className: 'custom-popup-pane', autoPan: true, autoPanPadding: [50, 50], keepInView: true });
                    marcadoresEstaciones[est.id] = marker_map;
                });
                resolve();
            })
            .catch(error => {
                console.error("Error al cargar las estaciones:", error);
                reject(error);
            });
    });
}

function redimensionar_mapa(map) {
    if (!map) return Promise.resolve();
    return new Promise((resolve) => {
        map.once('resize', () => {
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

    map.locate({
        setView: false,
        watch: true,
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 10000
    });

    map.on('locationfound', function (e) {
        if (!carMarker) {
            carMarker = L.marker(e.latlng, { icon: iconoAuto }).addTo(map);
            map.setView(e.latlng, 16);
        } else {
            carMarker.setLatLng(e.latlng);
            map.panTo(e.latlng);
        }
    });

    localStorage.setItem('geolocalizar', true);

    map.on('locationerror', function (e) {
        error_geo_localizacion(map);
    });
}

function permisos_geo_navegador(result) {
    if (!map) return;
    map.stopLocate();
    map.off('locationfound');
    map.off('locationerror');

    const modal = document.getElementById('gpsModal');
    const mapaContenedor = document.getElementById('results-map');

    map.locate({
        setView: false,
        watch: true,
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 10000
    });

    if (result.state === 'granted') {
        geolocalizar_mapa(map)
    } else if (result.state === 'prompt') {
        if (document.fullscreenElement || document.webkitFullscreenElement) {
            mapaContenedor.appendChild(modal);
        }
        $('#gpsModal').modal('show');
    } else if (result.state === 'denied') {
        if (document.fullscreenElement || document.webkitFullscreenElement) {
            mapaContenedor.appendChild(modal);
        }
        $('#gpsModal').modal('show');
        localStorage.setItem('geolocalizar', false);
    }
}

function error_geo_localizacion(map) {
    if (!map) return;
    map.stopLocate();
    map.off('locationfound');
    map.off('locationerror');
    localStorage.setItem('geolocalizar', false);
    $('#gpsModal').modal('show');
}

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
        const fechaObj = new Date(valor.replace(' ', 'T'));
        return fechaObj.toLocaleString('es-CL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    }

    return valor;
}