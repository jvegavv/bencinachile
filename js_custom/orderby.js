$(document).ready(function () {

    $('#pxp-sort-results').on('change', function() {
        // Obtenemos el valor seleccionado
        var seleccion = $(this).val();
        var item_order = "93";     
        let elementos = "";
 
        /*
        <option value="4-12">Kerosene</option>
        <option value="3-11-">Petroleo Diesel</option>
        <option value="1-8">Gasolina 93</option>
        <option value="7-9">Gasolina 95</option>
        <option value="2-10">Gasolina 97</option>
        <option value="6">GLP Vehicular</option>
        <option value="5">GNC</option>

         valor_93 ="" #1
                valor_95 ="" #7
                valor_97 ="" #2
                valor_DI ="" #3
                valor_KE ="" #4
                valor_GNC ="" #5
                valor_GLP ="" #6
                valor_A93 ="" #8
                valor_A95 ="" #9
                valor_A97 ="" #10
                valor_ADI ="" #11
                valor_AKE ="" #12

        */

        if (seleccion == "4-12"){
            item_order = "KE"
            elementos = document.querySelectorAll('.combustible_KE, .combustible_AKE');
        }else if (seleccion == "3-11"){
            item_order = "DI"
            elementos = document.querySelectorAll('.combustible_DI, .combustible_ADI');
        }else if (seleccion == "1-8"){
            item_order = "93"
            elementos = document.querySelectorAll('.combustible_93, .combustible_A93');
        }else if (seleccion == "7-9"){
            item_order = "95"
            elementos = document.querySelectorAll('.combustible_95, .combustible_A95');
        }else if (seleccion == "2-10"){
            item_order = "97"
            elementos = document.querySelectorAll('.combustible_97, .combustible_A97');
        }else if (seleccion == "6"){
            item_order = "GLP"
            elementos = document.querySelectorAll('.combustible_GLP');
        }else if (seleccion == "5"){
            item_order="GNC"
            elementos = document.querySelectorAll('.combustible_GNC');
        }else{
            item_order = "93"
            elementos = document.querySelectorAll('.combustible_93, .combustible_A93'); 
        }

        console.log("Item Orden "+item_order)
    
    
        var listaElementos = $('.estacion-item').toArray();
        var contenedor = $('.estacion-item').parent();


        listaElementos.sort(function(a, b) {
            // Buscamos el valor del input
            var valA = $(a).find('input#'+item_order).val();
            var valB = $(b).find('input#'+item_order).val();

            // Si no existe el input o no tiene valor, le asignamos Infinity
            // para que siempre sea mayor que cualquier precio real.
            var precioA = (valA !== undefined && valA !== "") ? parseFloat(valA) : Infinity;
            var precioB = (valB !== undefined && valB !== "") ? parseFloat(valB) : Infinity;
        
            // 1. Manejo de casos donde AMBOS son Infinity (opcional, para mantener orden original)
            if (precioA === Infinity && precioB === Infinity) return 0;

            // 2. Orden ascendente: los precios reales (menores) arriba, Infinity abajo.
            return precioA - precioB;
        });


        $.each(listaElementos, function(index, elemento) {
            contenedor.append(elemento);
        });


       
        const todosLosCombustibles = document.querySelectorAll('[class*="combustible_"]');

        console.log(todosLosCombustibles.length)
        todosLosCombustibles.forEach(div => {
            console.log("Holi"+div)
        });

        console.log(todosLosCombustibles)
        todosLosCombustibles.forEach(div => {
            div.style.backgroundColor = 'white';
            div.style.color = '#333';
            div.style.padding = '0px';
            div.style.borderRadius = '0px';
        });


        /* Recorremos cada uno y cambiamos el color de fondo*/
        elementos.forEach(div => {
            div.style.backgroundColor = '#d4edda'; // Verde suave
            div.style.color = '#155724';           // Texto verde oscuro para que contraste
            div.style.padding = '5px';             // Opcional: para que se vea mejor el fondo
            div.style.borderRadius = '4px';        // Opcional: bordes redondeados
        });
    });
});