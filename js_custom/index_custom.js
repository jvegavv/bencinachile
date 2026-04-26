(function () {
    var indicator = document.getElementById('window-size-indicator');
    if (!indicator) return;

    var hideTimer = null;

    function updateSize() {
        var w = window.innerWidth;
        var h = window.innerHeight;
        indicator.textContent = w + ' × ' + h + ' px';
        indicator.style.display = 'block';
        indicator.style.opacity = '1';

        if (hideTimer) clearTimeout(hideTimer);
        hideTimer = setTimeout(function () {
            indicator.style.opacity = '0';
            setTimeout(function () {
                indicator.style.display = 'none';
            }, 300);
        }, 1500);
    }

    window.addEventListener('resize', updateSize);
})();
