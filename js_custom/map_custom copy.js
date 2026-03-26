var marcadoresEstaciones = {};
var map;
var latitud = -33.447487
var longitud = -70.673676
var comunaActual = "";


navigator.geolocation.getCurrentPosition(async (pos) => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    
    // Asignamos el resultado a la variable externa
    comunaActual = await getComuna(lat, lon);
    
    console.log("Variable global actualizada:", comunaActual);
});


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

                $('#log_html').text("click geo ubicacion");
                geolocalizar(map, true)
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


    let invocar_geolocalizacion = localStorage.getItem('geolocalizar');
    console.log("valor : invocar_geolocalizacion " + invocar_geolocalizacion);

    if (invocar_geolocalizacion == 'true') {
        console.log("invocar geolocalizacion")
        geolocalizar(map, true)
    }

    // 1. Definir el marcador fuera para mayor control
    var carMarker;

    // 2. Escuchar el evento 'locationfound'
    map.on('locationfound', function (e) {

        let centrarMapaEnAuto = localStorage.getItem('centrarMapaEnAuto');

        if (!carMarker) {
            // Primera vez: creamos el marcador y centramos el mapa
            carMarker = L.marker(e.latlng, { icon: iconoAuto }).addTo(map)
                .bindPopup("Estás aqui").openPopup();

            

            if (centrarMapaEnAuto == 'true'){
                map.setView(e.latlng, 16); // Centrar la cámara la primera vez
                console.log("map.setView")  
            }else{
                console.log("NO map.setView")
            }
        } else {

            carMarker.setLatLng(e.latlng).bindPopup("Estás aqui2").openPopup();

            console.log("**** centrarMapaEnAuto ****" + centrarMapaEnAuto)
            if (centrarMapaEnAuto == 'true') {
                map.panTo(e.latlng);
                console.log("map.panTo") 
            } else {
                console.log("NO map.panTo") 
            }
        }
    });

    // 3. Manejo de errores (Muy importante en móviles)
    map.on('locationerror', function (e) {
        alert("No se pudo obtener tu ubicación: " + e.message);
    });



    map.on('drag', function (e) {
        console.log("El mapa se está moviendo...");
        localStorage.setItem('centrarMapaEnAuto', false);
    });





    /*-----------------------------------------------------------------
     ###################### ###################### ####################
    -----------------------------------------------------------------*/

});


function geolocalizar(map, estado) {
    console.log("Geolozalicando :" + estado);

    // Solicitud de ubicarse en el mapa
    if (estado) {
        map.locate({
            setView: false, // Lo manejamos manualmente arriba para mejor control
            watch: true,
            enableHighAccuracy: true,
            maximumAge: 1000, // No usar posiciones guardadas en caché de más de 1 seg
            timeout: 10000    // Tiempo límite para encontrar señal
        });


        let comuna = $('#comuna').val();

        console.log("comuna " + comuna)

        if (comuna == comunaActual) {

            localStorage.setItem('centrarMapaEnAuto', estado);
            console.log("Centrar mapa en auto")

        } else {

            localStorage.setItem('comuna', comuna)
            localStorage.setItem('centrarMapaEnAuto', false);
            console.log("No centrar mapa en auto")
            console.log("Cambiar comuna")

        }
    }

    localStorage.setItem('geolocalizar', estado);



}


async function getComuna(lat, lon) {
    // 1. Construimos la URL de la API de Nominatim (OpenStreetMap)
    // El parámetro 'addressdetails=1' es clave para que nos dé el detalle de la comuna
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&addressdetails=1`;

    try {
        const response = await fetch(url, {
            headers: {
                // Es obligatorio identificarse ante la API de OSM para evitar bloqueos
                'User-Agent': 'MiAplicacionMapaChile/1.0'
            }
        });

        if (!response.ok) throw new Error("Error en la red");

        const data = await response.json();
        
        // 2. Extraemos la comuna. 
        // En Chile, OSM suele guardarla en 'city', 'town' o 'county'.
        const direccion = data.address;
        const comuna = direccion.city || direccion.town || direccion.county || direccion.village || "Comuna no encontrada";

        return comuna;

    } catch (error) {
        console.error("Hubo un problema con la petición:", error);
        return null;
    }
}
