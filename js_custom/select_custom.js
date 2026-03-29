$(document).ready(function () {

    let comuna = $('#comuna').val();

    /********************* Select Comunas*******************/

    // 1. Inicializar Select2 con los estilos
    if ($('#pxp-p-search-location').length > 0) {
        $('#pxp-p-search-location').select2({
            placeholder: comuna,
            width: '100%',
            // minimumResultsForSearch: Infinity // Descomenta esto si NO quieres que aparezca el buscador interno
        });
    }

    // 2. Cargar los datos desde el JSON generado por el script de Python
    fetch('python/mapeo_identificadores.json')
        .then(response => response.json())
        .then(data => {
            const select = $('#pxp-p-search-location');
            select.empty().append(new Option("Selecciona Comuna", ""));

          /*  // Agregar Regiones como Grupo
            const grupoRegiones = $('<optgroup label="Regiones"></optgroup>');
            data.regiones.forEach(reg => {
                // Creamos el elemento option manualmente para añadirle el atributo data
                const option = new Option(reg.nombre, 'reg_' + reg.id);
                $(option).attr('data-nombre-pagina', reg.nombre_pagina);
                grupoRegiones.append(option);
            });
            select.append(grupoRegiones);*/

            // Agregar Comunas como Grupo
            const grupoComunas = $('<optgroup label="Comunas"></optgroup>');
            data.comunas.forEach(com => {
                const option = new Option(com.nombre, 'com_' + com.id);
                $(option).attr('data-nombre-pagina', com.nombre_pagina);
                grupoComunas.append(option);
            });
            select.append(grupoComunas);
        })
        .catch(error => console.error('Error cargando ubicaciones:', error));

    // 3. Evento al seleccionar una ubicación
    $('#pxp-p-search-location').on('select2:select', function (e) {
        localStorage.setItem('centrarMapaEnAuto', false);
        // Obtenemos el ID seleccionado (ej: reg_1 o com_15)
        const idSeleccionado = e.params.data.id;

        // Obtenemos el atributo 'data-nombre-pagina' del elemento <option> real
        const nombrePagina = $(this).find(':selected').data('nombre-pagina');

        console.log("ID Seleccionado:", idSeleccionado);
        console.log("Nombre para URL (Slug):", nombrePagina);

        // Ejemplo de uso: Redirigir o filtrar
        if (nombrePagina) {
            window.location.href = nombrePagina;
        }
    });
});