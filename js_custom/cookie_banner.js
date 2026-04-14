/**
 * TodoBencina - Cookie Consent Banner
 * Inyecta dinámicamente un banner de cookies con diseño premium (Glassmorphism).
 * Incluye opciones de Aceptar y Rechazar.
 */
$(document).ready(function () {
    const COOKIE_KEY = 'pxp-cookies-consent';
    
    // Función para Cargar Scripts de Seguimiento (Google Analytics, etc.)
    function loadTrackingScripts() {
        console.log("TodoBencina: Cargando scripts de seguimiento (Consentimiento Aceptado)");
        
        /**
         * -------------------------------------------------------------------
         * ESPACIO PARA GOOGLE ANALYTICS (Punto de integración)
         * -------------------------------------------------------------------
         * Pega aquí tu fragmento de seguimiento (G-XXXXXXX) cuando lo tengas.
         * Este código solo se ejecutará si el usuario acepta las cookies.
         */
        
        /* Ejemplo de implementación futura:
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
        ga('create', 'UA-XXXXX-Y', 'auto');
        ga('send', 'pageview');
        */
    }

    // 1. Verificar si ya existe una decisión previa
    const consent = localStorage.getItem(COOKIE_KEY);
    
    if (consent === 'true') {
        // El usuario ya aceptó en el pasado, cargamos inmediatamente
        loadTrackingScripts();
        return;
    } else if (consent === 'false') {
        // El usuario ya rechazó, no hacemos nada
        return;
    }

    // 2. Si no hay decisión, creamos el HTML del Banner
    const bannerHTML = `
        <div id="pxp-cookie-banner">
            <div class="pxp-cookie-text">
                Utilizamos cookies propias y de terceros (Google Analytics) para mejorar tu experiencia y analizar el tráfico. 
                Al continuar navegando, aceptas su uso de acuerdo a nuestra 
                <a href="/politica-de-privacidad.html">Política de Privacidad</a>.
            </div>
            <div class="pxp-cookie-btns">
                <button type="button" class="pxp-cookie-btn-reject" id="pxp-cookie-reject">Rechazar</button>
                <button type="button" class="pxp-cookie-btn-accept" id="pxp-cookie-accept">Aceptar</button>
            </div>
        </div>
    `;

    // 3. Inyectar al final del body
    $('body').append(bannerHTML);

    // 4. Mostrar con un ligero retraso de 1.5 segundos
    setTimeout(function() {
        $('#pxp-cookie-banner').addClass('show');
    }, 1500);

    // 5. Función para cerrar el banner y guardar preferencia
    function closeBanner(accepted) {
        // Ocultar suavemente
        $('#pxp-cookie-banner').removeClass('show');
        
        // Guardar preferencia
        localStorage.setItem(COOKIE_KEY, accepted);
        
        // Si aceptó, cargar scripts de inmediato
        if (accepted) {
            loadTrackingScripts();
        }
        
        // Eliminar del DOM después de la transición
        setTimeout(function() {
            $('#pxp-cookie-banner').remove();
        }, 600);
    }

    // Eventos de clic
    $('#pxp-cookie-accept').on('click', function() {
        closeBanner(true);
    });

    $('#pxp-cookie-reject').on('click', function() {
        closeBanner(false);
    });
});
