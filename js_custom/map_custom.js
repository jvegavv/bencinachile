var marcadoresEstaciones = {};
var map;
var latitud = -33.447487
var longitud = -70.673676
var carMarker;
const rutaJson = 'python/comunas_data/quillon.json'; 


document.addEventListener('DOMContentLoaded', function () {

    /*-----------------------------------------------------------------
       ###################### Inicializar Mapa ######################
    -----------------------------------------------------------------*/

    latitud = $('#latitud').val();
    longitud = $('#longitud').val();

    map = L.map('results-map', {
        zoomControl: false // Los controles de Resideo suelen chocar, mejor quitarlos o moverlos
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



                // 2. Escuchar el evento 'locationfound'
                map.on('locationfound', function (e) {
                    console.log(`[${new Date().toLocaleTimeString()}] location-found 1`);
                    if (!carMarker) {

                        // Primera vez: creamos el marcador y centramos el mapa
                        carMarker = L.marker(e.latlng, { icon: iconoAuto }).addTo(map)
                            .bindPopup("Estás aqui").openPopup();
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
                    alert("No se pudo obtener tu ubicación 1: " + e.message);
                });




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
            alert("No se pudo obtener tu ubicación 2: " + e.message);
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
              setTimeout(function () {
                  map.invalidateSize({
                      animate: true
                  });
                  console.log("Mapa recalculado");
              }, 300);
          });
      });
    
    /*-----------------------------------------------------------------
     ###################### ###################### ####################
    -----------------------------------------------------------------*/

   /*-----------------------------------------------------------------
     ###################### Cargar estaciones ####################
    -----------------------------------------------------------------*/

    var iconoBomba = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448636.png',
        iconSize: [35, 35],
        iconAnchor: [17, 34],
        popupAnchor: [0, -30]
    });


    // 3. Carga dinámica de Datos desde el JSON de la comuna
// Ajusta la ruta según donde esté tu carpeta 'comunas_data' respecto al HTML


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


            let preciosHTML="";
            
            est.combustibles.forEach(function (combustible){

                preciosHTML = preciosHTML+`<span> ${combustible.nombre_largo} : $ ${combustible.precio} (${combustible.unidad_cobro})</span></br>`

            });

            var marker_map = L.marker([est.latitud, est.longitud], { icon: iconoBomba })
                .addTo(map)
                .bindPopup(`
                    <b>${est.nombre_bencinera}</br>
                    <small>${est.direccion}</small><br>
                    <div class="precio">
                        ${preciosHTML}
                    </div>
                `);

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
    
});

