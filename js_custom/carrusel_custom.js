(function($) {
    "use strict";

    $(document).ready(function() {
        var $carousel = $('#pxp-services-tabs-carousel');
        var $btn = $('#pxp-services-carousel-pause-play');
        var $icon = $btn.find('span');

        // --- FUNCIONES DE CONTROL DE REPRODUCCIÓN ---
        
        function playCarousel() {
            $carousel.carousel('cycle');
            $icon.removeClass('fa-play').addClass('fa-pause');
            $btn.attr('title', 'Pausar');
            $btn.css('color', '#fec42d');
        }

        function pauseCarousel() {
            $carousel.carousel('pause');
            $icon.removeClass('fa-pause').addClass('fa-play');
            $btn.attr('title', 'Reproducir');
            $btn.css('color', '#333');
        }

        // --- FUNCIONALIDAD DE PAUSE/PLAY MANUAL ---
        $btn.on('click', function() {
            if ($icon.hasClass('fa-pause')) {
                pauseCarousel();
            } else {
                playCarousel();
            }
        });

        // --- CONTROL INTELIGENTE (FOCO Y VISIBILIDAD) ---
        
        var isVisibleInViewport = true;
        
        // 1. Detección de Foco de Ventana y Visibilidad de Pestaña
        function handleVisibilityChange() {
            if (document.hidden || !document.hasFocus()) {
                $carousel.carousel('pause');
            } else {
                // Si la ventana recupera el foco y el elemento es visible en el viewport, reanudar
                if (isVisibleInViewport) {
                    playCarousel();
                }
            }
        }

        $(window).on('focus blur', handleVisibilityChange);
        $(document).on('visibilitychange', handleVisibilityChange);

        // 2. Detección de Scroll (Intersection Observer)
        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        isVisibleInViewport = true;
                        // Solo reanudar automáticamente si el navegador tiene el foco
                        if (!document.hidden && document.hasFocus()) {
                            playCarousel();
                        }
                    } else {
                        isVisibleInViewport = false;
                        $carousel.carousel('pause');
                    }
                });
            }, { 
                threshold: 0.2 // Se activa cuando el 20% del carrusel es visible
            });

            observer.observe($carousel[0]);
        }
    });
})(jQuery);
