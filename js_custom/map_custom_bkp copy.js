var marcadoresEstaciones = {};
var map;

document.addEventListener('DOMContentLoaded', function () {

    /*-----------------------------------------------------------------
    Inicializar Mapa
    
    -----------------------------------------------------------------*/
    
    map = L.map('results-map', {
        zoomControl: false // Los controles de Resideo suelen chocar, mejor quitarlos o moverlos
    }).setView([-36.7412, -72.4643], 15);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);


    //2. Control Zool

    L.control.zoom({ position: 'bottomright' }).addTo(map);




 



    // 3. Iconos Personalizados
    var iconoAuto = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/3085/3085330.png',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });

    var iconoBomba = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448636.png',
        iconSize: [35, 35],
        iconAnchor: [17, 34],
        popupAnchor: [0, -30]
    });

    /*-----------------------------------------------------------------
    Datos Estaciones Markers
    
    -----------------------------------------------------------------*/


    // 3. Datos de las Estaciones
    var estaciones = [
        {
            lat: -36.74277021626831, lng: -72.47071266174316,
            nombre: "Aramco - Quillón",
            direccion: "Av Bernardo O Higgins N° 1033",
            precios: "93: $1.186 | 95: $1.222 | DI: $954",
            estacion_id: 1
        },
        {
            lat: -36.74126545532326, lng: -72.4643547882989,
            nombre: "Copec - Quillón",
            direccion: "Avda O`higgins 1192",
            precios: "93: $1.188 | 95: $1.224 | DI: $954",
            estacion_id: 2
        },
        {
            lat: -36.7391678501493, lng: -72.47076630592346,
            nombre: "Independiente - Quillón",
            direccion: "Avda O`higgins 1192",
            precios: "93: $1.188 | 95: $1.224 | DI: $954",
            estacion_id: 3
        }
    ];

    // 4. Dibujar marcadores de bombas

    estaciones.forEach(function (est) {
        var marker_map = L.marker([est.lat, est.lng], { icon: iconoBomba })
            .addTo(map)
            .bindPopup(`<b>${est.nombre}</b><br><small>${est.direccion}</small><br><div class="precio">${est.precios}</div>`);
        marcadoresEstaciones[est.estacion_id] = marker_map;
        console.log(marcadoresEstaciones);
    });

    /*-----------------------------------------------------------------
    GSP del auto
    
    -----------------------------------------------------------------*/

    // 1. Definir el marcador fuera para mayor control
    var userMarker;

    // 2. Escuchar el evento 'locationfound'
    map.on('locationfound', function (e) {


        if (!userMarker) {
            // Primera vez: creamos el marcador y centramos el mapa
            userMarker = L.marker(e.latlng, { icon: iconoAuto }).addTo(map)
                .bindPopup("Estás aqui").openPopup();

            map.setView(e.latlng, 16); // Centrar la cámara la primera vez
        } else {
            // Actualizaciones siguientes: solo movemos el marcador
            userMarker.setLatLng(e.latlng);

            // OPCIONAL: Si quieres que el mapa SIEMPRE te siga al centro:
            map.panTo(e.latlng);
        }
    });

    // 3. Manejo de errores (Muy importante en móviles)
    map.on('locationerror', function (e) {
        alert("No se pudo obtener tu ubicación: " + e.message);
    });

    // 4. Iniciar el movimiento
    map.locate({
        setView: false, // Lo manejamos manualmente arriba para mejor control
        watch: true,
        enableHighAccuracy: true,
        maximumAge: 1000, // No usar posiciones guardadas en caché de más de 1 seg
        timeout: 10000    // Tiempo límite para encontrar señal
    });


    // Seleccionamos todos los botones que activan cambios de vista
    const toggleButtons = document.querySelectorAll('.pxp-adv-toggle, .pxp-map-toggle, .pxp-list-toggle');

    toggleButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Esperamos un momento breve (200ms) para que la animación de CSS termine 
            // y el div tenga su tamaño final antes de recalcular.
            setTimeout(function () {
                map.invalidateSize({
                    animate: true
                });
                console.log("Mapa recalculado");
            }, 300);
        });
    });
});

$(document).ready(function () {



          
    /********************* POP UP MAPA *******************/

    // Detectar el paso del mouse sobre la tarjeta
    $('.pxp-results-card-1').on('mouseenter', function () {
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
    $('.pxp-results-card-1').on('mouseleave', function () {
        var propId = $(this).attr('data-prop');
        if (marcadoresEstaciones[propId]) {
            marcadoresEstaciones[propId].closePopup();
        }
    });





});