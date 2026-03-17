(function($) {
    "use strict";

    $(window).scroll(function() {
        var scrollDistance = $(window).scrollTop() + 100;

        $('h2, h3').each(function(i) {
            if ($(this).position().top <= scrollDistance) {
                $('.side-nav-toc a.active').removeClass('active');
                $('.side-nav-toc a').eq(i).addClass('active');
            }
        });
    }).scroll();

    $('.side-nav-toc a, .in-page').click(function(event) {
        var target = $(this).attr('href');
        var elemTop = $(target).offset().top;
        var elemTopPlus = elemTop - 90;

        setTimeout(function() {
            $('html').stop().animate({
                scrollTop: elemTopPlus
            }, 100);
        }, 120);
    });

    var hash = location.hash;
    if(hash != '') {
        var elemTop = $(hash).offset().top;
        var elemTopPlus = elemTop - 90;

        setTimeout(function() {
            $('html').stop().animate({
                scrollTop: elemTopPlus
            }, 100);
        }, 300);
    }

    var searchItems = [];
    var parentH = '';
    const searchInput = document.querySelector('#doc-search');
    const searchResults = document.querySelector('.search-results');

    $('.content > h2, .content > h3, .content > h4, .content > p, .content > ol > li').each(function(index, el) {
        if($(this).is('h2') || $(this).is('h3') || $(this).is('h4')) {
            parentH = $(this).attr('id');

            searchItems.push({'text' : $(this).text().trim(), 'parent' : parentH, 'is_title' : 'yes'});
        }

        searchItems.push({'text' : $(this).text().trim(), 'parent' : parentH, 'is_title' : 'no'});
    });

    function findSearchItems(wordToMatch, searchItems) {
        return searchItems.filter(function(item) {
            const regex = new RegExp(wordToMatch, 'gi');

            return item.text.match(regex) || item.is_title == 'yes';
        });
    }

    function displaySearchItems() {
        const matchArray = findSearchItems(searchInput.value, searchItems);

        const html = matchArray.map(function(item) {
            if(item.is_title == 'yes') {
                return '<li class="search-results-cat">' + item.text + '</li>';
            } else {
                return '<li><a href="#' + item.parent + '">' + item.text + '</a></li>';
            }
        }).join('');

        searchResults.innerHTML = html;

        $('.search-results-cat').each( function() {
            if($(this).next().hasClass('search-results-cat') || $(this).next().length <= 0) {
                $(this).remove();
            }
        });
    }

    searchInput.addEventListener('keyup', displaySearchItems);
    searchInput.addEventListener('focus', displaySearchItems);

    $('body').on('click', '.dropdown-menu > li > a', function(event) {
        event.preventDefault();

        var target = $(this).attr('href');
        var elemTop = $(target).offset().top;
        var elemTopPlus = elemTop - 90;

        setTimeout(function() {
            $('html').stop().animate({
                scrollTop: elemTopPlus
            }, 100);
        }, 120);
    });
})(jQuery);