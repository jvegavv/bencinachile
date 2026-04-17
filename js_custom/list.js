$(document).ready(function () {
    // Desactivar el click en los cuadros de precios para evitar el scroll al top por el <a href="#">
    $(document).on('click', '.fuel-badge', function(e) {
        e.preventDefault();
        e.stopPropagation();
    });
});
