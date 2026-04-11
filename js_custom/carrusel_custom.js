(function($) {
    "use strict";

    $(document).ready(function() {
        var $carousel = $('#pxp-services-tabs-carousel');
        var $btn = $('#pxp-services-carousel-pause-play');
        var $icon = $btn.find('span');

        // Funcionalidad de pause/play
        $btn.on('click', function() {
            if ($icon.hasClass('fa-pause')) {
                // Si el icono es pause, queremos detener la reproducción
                $carousel.carousel('pause');
                $icon.removeClass('fa-pause').addClass('fa-play');
                $btn.attr('title', 'Reproducir');
                
                // Efecto visual sutil al pausar
                $btn.css('color', '#333');
            } else {
                // Si el icono es play, queremos reanudar la reproducción
                $carousel.carousel('cycle');
                $icon.removeClass('fa-play').addClass('fa-pause');
                $btn.attr('title', 'Pausar');

                // Efecto visual sutil al reanudar
                $btn.css('color', '#fec42d');
            }
        });

        // Asegurar que si el usuario interactúa manualmente con los indicadores, 
        // el estado del botón se mantenga coherente si decides pausar en interacción.
        // Bootstrap pausa el carrusel en 'hover' por defecto. 
        // Si quieres que el botón refleje eso, podrías añadir listeners adicionales.
    });
})(jQuery);
