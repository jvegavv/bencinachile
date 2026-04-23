$(document).ready(function () {

    ordenar_select_bencina("1-8");

    $('#pxp-sort-results').on('change', function() {
        // Obtenemos el valor seleccionado
        var seleccion = $(this).val();
        ordenar_select_bencina(seleccion)

    });
});

function ordenar_select_bencina(seleccion){

    /*
    <option value="4-12">Kerosene</option>
    <option value="3-11">Petroleo Diesel</option>
    <option value="1-8">Gasolina 93</option>
    <option value="7-9">Gasolina 95</option>
    <option value="2-10">Gasolina 97</option>
    <option value="6">GLP Vehicular</option>
    <option value="5">GNC</option>

     item_order por par:
        93 / A93  -> value 1-8
        95 / A95  -> value 7-9
        97 / A97  -> value 2-10
        DI / ADI  -> value 3-11
        KE / AKE  -> value 4-12
    */

    var item_order_primary   = "93";
    var item_order_secondary = "A93";
    var esPar = true;
    var elementos = "";

    if (seleccion == "4-12"){
        item_order_primary   = "KE";
        item_order_secondary = "AKE";
        esPar    = true;
        elementos = document.querySelectorAll('.combustible_KE, .combustible_AKE');
    } else if (seleccion == "3-11"){
        item_order_primary   = "DI";
        item_order_secondary = "ADI";
        esPar    = true;
        elementos = document.querySelectorAll('.combustible_DI, .combustible_ADI');
    } else if (seleccion == "1-8"){
        item_order_primary   = "93";
        item_order_secondary = "A93";
        esPar    = true;
        elementos = document.querySelectorAll('.combustible_93, .combustible_A93');
    } else if (seleccion == "7-9"){
        item_order_primary   = "95";
        item_order_secondary = "A95";
        esPar    = true;
        elementos = document.querySelectorAll('.combustible_95, .combustible_A95');
    } else if (seleccion == "2-10"){
        item_order_primary   = "97";
        item_order_secondary = "A97";
        esPar    = true;
        elementos = document.querySelectorAll('.combustible_97, .combustible_A97');
    } else if (seleccion == "6"){
        item_order_primary   = "GLP";
        item_order_secondary = null;
        esPar    = false;
        elementos = document.querySelectorAll('.combustible_GLP');
    } else if (seleccion == "5"){
        item_order_primary   = "GNC";
        item_order_secondary = null;
        esPar    = false;
        elementos = document.querySelectorAll('.combustible_GNC');
    } else {
        item_order_primary   = "93";
        item_order_secondary = "A93";
        esPar    = true;
        elementos = document.querySelectorAll('.combustible_93, .combustible_A93');
    }

    console.log("Item Orden " + item_order_primary + (item_order_secondary ? "/" + item_order_secondary : ""));


    var listaElementos = $('.estacion-item').toArray();
    var contenedor = $('.estacion-item').parent();


    listaElementos.sort(function(a, b) {

        // Precio del combustible primario
        var valA_p = $(a).find('input#' + item_order_primary).val();
        var valB_p = $(b).find('input#' + item_order_primary).val();
        var pA_p = (valA_p !== undefined && valA_p !== "") ? parseFloat(valA_p) : Infinity;
        var pB_p = (valB_p !== undefined && valB_p !== "") ? parseFloat(valB_p) : Infinity;

        var precioA = pA_p;
        var precioB = pB_p;

        // Si es un par, considerar el más económico entre primario y autoservicio
        if (esPar && item_order_secondary) {
            var valA_s = $(a).find('input#' + item_order_secondary).val();
            var valB_s = $(b).find('input#' + item_order_secondary).val();
            var pA_s = (valA_s !== undefined && valA_s !== "") ? parseFloat(valA_s) : Infinity;
            var pB_s = (valB_s !== undefined && valB_s !== "") ? parseFloat(valB_s) : Infinity;
            precioA = Math.min(pA_p, pA_s);
            precioB = Math.min(pB_p, pB_s);
        }

        // Si ambos son Infinity (sin precio), mantener orden original
        if (precioA === Infinity && precioB === Infinity) return 0;

        // Orden ascendente: precio más barato arriba
        return precioA - precioB;
    });


    $.each(listaElementos, function(index, elemento) {
        contenedor.append(elemento);
    });


    /* Limpiamos todos los resaltados previos */
    $('[class*="combustible_"]').removeClass('highlight');

    /* Resaltamos los que corresponden con la selección */
    $(elementos).addClass('highlight');

    /* Movemos el badge resaltado a la posición arriba-izquierda de cada tarjeta */
    $('.estacion-item').each(function() {
        var $station = $(this);
        var grid = $station.find('.fuel-price-grid').first();
        if (!grid.length) return;

        if (esPar && item_order_secondary) {
            var badge_p = grid.find('.combustible_' + item_order_primary);
            var badge_s = grid.find('.combustible_' + item_order_secondary);
            
            if (badge_p.length && badge_s.length) {
                // Ambos existen: determinar el más económico para ponerlo a la izquierda
                var val_p = parseFloat($station.find('input#' + item_order_primary).val()) || Infinity;
                var val_s = parseFloat($station.find('input#' + item_order_secondary).val()) || Infinity;
                
                if (val_s < val_p) {
                    // Autoservicio es más barato: prepend Normal primero, luego Autoservicio
                    badge_p.detach().prependTo(grid);
                    badge_s.detach().prependTo(grid);
                } else {
                    // Normal es más barato (o igual): prepend Autoservicio primero, luego Normal
                    badge_s.detach().prependTo(grid);
                    badge_p.detach().prependTo(grid);
                }
            } else if (badge_p.length) {
                badge_p.detach().prependTo(grid);
            } else if (badge_s.length) {
                badge_s.detach().prependTo(grid);
            }
        } else {
            // No es par (GLP/GNC): solo movemos el que está resaltado
            var highlighted = grid.find('.fuel-badge.highlight').first();
            if (highlighted.length) {
                highlighted.detach().prependTo(grid);
            }
        }
    });
}