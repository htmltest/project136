$(document).ready(function() {

    $('.table-scroll').mCustomScrollbar({
        axis: 'x'
    });

    $('.header-cart-content-list').mCustomScrollbar({
        axis: 'y'
    });

    $.validator.addMethod('phoneRU',
        function(phone_number, element) {
            return this.optional(element) || phone_number.match(/^\+7 \d{10,11}$/);
        },
        'Ошибка заполнения'
    );

    $('body').on('change', '.form-file input', function() {
        var curInput = $(this);
        var curField = curInput.parents().filter('.form-file');
        var curForm = curField.parents().filter('form');
        var curName = curInput.val().replace(/.*(\/|\\)/, '');
        if (curName != '') {
            curField.find('.form-file-input span').html(curName);
        } else {
            curField.find('.form-file-input span').html('Загрузка файла');
        }
    });

    $('form').each(function() {
        if ($(this).parents().filter('.to-window').length == 0) {
            initForm($(this));
        }
    });

    $('body').on('mouseenter', '.catalogue-item', function() {
        var curItem = $(this);
        curItem.find('.catalogue-item-preview').removeClass('active');
        curItem.find('.catalogue-item-preview:first-child').addClass('active');

        var curHeight = curItem.find('.catalogue-item-inner').outerHeight();
        var curItemPreviews = curItem.find('.catalogue-item-previews');
        if (curItemPreviews.length > 0) {
            if (curItemPreviews.outerHeight() > curHeight) {
                curHeight = curItemPreviews.outerHeight();
            }
        }
        curItem.find('.catalogue-item-inner-bg').css({'height': curHeight});
    });

    $('body').on('mouseleave', '.catalogue-item', function() {
        var curItem = $(this);
        curItem.find('.catalogue-item-photo img').attr('src', curItem.find('.catalogue-item-photo img').attr('data-src'));
    });

    $('body').on('mouseenter', '.catalogue-item-preview', function() {
        var curPreview = $(this);
        if (!curPreview.hasClass('active')) {
            var curItem = curPreview.parents().filter('.catalogue-item');
            curItem.find('.catalogue-item-preview.active').removeClass('active');
            curPreview.addClass('active');
            curItem.find('.catalogue-item-photo img').attr('src', curPreview.attr('data-src'));
        }
    });

    $('.catalogue-menu-inner ul li').each(function() {
        var curItem = $(this);
        if (curItem.find('ul').length > 0) {
            curItem.find('> a').after('<span class="catalogue-menu-inner-icon"></span>');
        }
    });

    $('body').on('click', '.catalogue-menu-inner-icon', function() {
        var curItem = $(this).parent();
        curItem.toggleClass('open');
        $(window).trigger('scroll');
    });

    $('body').on('click', '.catalogue-recommend-menu ul li a', function(e) {
        var curLi = $(this).parent();
        if (!curLi.hasClass('active')) {
            var curTabs = curLi.parents().filter('.catalogue-recommend');
            curTabs.find('.catalogue-recommend-menu ul li.active').removeClass('active');
            curLi.addClass('active');
            var curIndex = curTabs.find('.catalogue-recommend-menu ul li').index(curLi);
            curTabs.find('.catalogue-recommend-tab.active').removeClass('active');
            curTabs.find('.catalogue-recommend-tab').eq(curIndex).addClass('active');
        }
        e.preventDefault();
    });

    function createProductGallery() {
        $('.product-gallery-big-list').slick({
            infinite: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            dots: false,
            responsive: [
                {
                    breakpoint: 1079,
                    settings: {
                        dots: true
                    }
                }
            ]
        }).on('setPosition', function(event, slick) {
            var currentSlide = $('.product-gallery-big-list').slick('slickCurrentSlide');
            $('.product-gallery-preview-item.active').removeClass('active');
            $('.product-gallery-preview-item').eq(currentSlide).addClass('active');
        });

        $('.product-gallery-preview-item a').click(function(e) {
            var curIndex = $('.product-gallery-preview-item').index($(this).parent());
            $('.product-gallery-big-list').slick('slickGoTo', curIndex);
            e.preventDefault();
        });

        $('.product-gallery-preview-list').slick({
            infinite: false,
            slidesToShow: 4,
            slidesToScroll: 4,
            prevArrow: '<button type="button" class="slick-prev"><svg width="7" height="9" viewBox="0 0 7 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.73926 0.608887L1.73926 4.10889L5.73926 7.60889" stroke-width="1.4"/></svg></button>',
            nextArrow: '<button type="button" class="slick-next"><svg width="7" height="9" viewBox="0 0 7 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.26074 8.39111L5.26074 4.89111L1.26074 1.39111" stroke-width="1.4"/></svg></button>',
            dots: false,
            adaptiveHeight: true
        });

        $('.product-gallery-big-item img').each(function() {
            if ($(window).width() > 1079) {
                new Drift(this, {
                    paneContainer: $('.product-info')[0],
                    containInline: true,
                    hoverBoundingBox: true
                });
            }
        });
    }

    createProductGallery();

    $('body').on('click', '.product-colors-list-item a', function(e) {
        var curLink = $(this);
        var curItem = curLink.parent();
        if (!curItem.hasClass('active')) {
            $('.product-colors-list-item.active').removeClass('active');
            curItem.addClass('active');
            $('.product-gallery').addClass('loading');

            if (typeof(history.pushState) !== 'undefined') {
                history.pushState(null, null, curLink.attr('href'));
            }

            $.ajax({
                type: 'POST',
                url: curLink.attr('data-link'),
                dataType: 'html',
                cache: false
            }).done(function(html) {
                $('.product-gallery-big, .product-gallery-preview').remove();
                $('.product-gallery').prepend(html);
                createProductGallery();
                $('.product-gallery').removeClass('loading');
                if ($(window).width() < 1080) {
                    $('html, body').animate({'scrollTop': 0});
                }
            });
        }
        e.preventDefault();
    });

    $('.slider:not(.slider-new)').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        prevArrow: '<button type="button" class="slick-prev"><svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="49.5" y="49.5" width="49" height="49" rx="24.5" transform="rotate(-180 49.5 49.5)" stroke="#DFDFDF"/><path d="M21 34L30 25L21 16" stroke="white"/></svg></button>',
        nextArrow: '<button type="button" class="slick-next"><svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="49.5" y="49.5" width="49" height="49" rx="24.5" transform="rotate(-180 49.5 49.5)" stroke="#DFDFDF"/><path d="M21 34L30 25L21 16" stroke="white"/></svg></button>',
        dots: true,
        responsive: [
            {
                breakpoint: 1079,
                settings: {
                    arrows: false
                }
            }
        ]
    });

    $('.slider-new .slider-list').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: true,
        responsive: [
            {
                breakpoint: 1079,
                settings: {
                    dots: false
                }
            }
        ]
    });

    $('.gallery').each(function() {
        var curGallery = $(this);
        curGallery.find('.gallery-big').slick({
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            prevArrow: '<button type="button" class="slick-prev"><svg width="9" height="15" viewBox="0 0 9 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M2.23185 7.5L9 13.7832L8.05645 15L-3.27835e-07 7.5L8.05645 -3.52159e-07L9 1.21676L2.23185 7.5Z" /></svg></button>',
            nextArrow: '<button type="button" class="slick-next"><svg width="9" height="15" viewBox="0 0 9 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.76815 7.5L-7.94116e-07 1.21676L0.943547 1.05648e-06L9 7.5L0.943549 15L8.5378e-07 13.7832L6.76815 7.5Z" /></svg></button>',
            dots: false,
            responsive: [
                {
                    breakpoint: 1079,
                    settings: {
                        arrows: false,
                        dots: true
                    }
                }
            ]
        }).on('setPosition', function(event, slick) {
            var currentSlide = curGallery.find('.gallery-big').slick('slickCurrentSlide');
            curGallery.find('.gallery-preview .gallery-preview-item.active').removeClass('active');
            curGallery.find('.gallery-preview .gallery-preview-item').eq(currentSlide).addClass('active');
        });
        curGallery.find('.gallery-preview').slick({
            infinite: false,
            slidesToShow: 4,
            slidesToScroll: 4,
            arrows: false,
            dots: false
        });
        curGallery.find('.gallery-preview-item a').click(function(e) {
            var curIndex = curGallery.find('.gallery-preview-item').index($(this).parent());
            curGallery.find('.gallery-big').slick('slickGoTo', curIndex);
            e.preventDefault();
        });
    });

    $('body').on('click', '.window-link-self', function(e) {
        var toWindow = $($(this).attr('href'));
        if (toWindow.length > 0) {
            windowOpenHTML(toWindow.html());
        }
        e.preventDefault();
    });

    $('body').on('click', '.window-link', function(e) {
        if ($(this).hasClass('catalogue-item-size')) {
            $('.catalogue-item-size.to-window').removeClass('to-window');
            $(this).addClass('to-window');
        }
        windowOpen($(this).attr('href'));
        e.preventDefault();
    });

    $('body').on('click', '.btn-window-count', function(e) {
        var curItemSize = $('.catalogue-item-size.to-window');
        if (curItemSize.length > 0) {
            if (curItemSize.find('em').length == 0) {
                curItemSize.append('<em>0</em>');
            }
            curItemSize.find('em').html(parseInt($('.window-count .form-number .form-input input').val()) + parseInt(curItemSize.find('em').html()));
        }
        windowClose();
    });

    $('body').on('keyup', function(e) {
        if (e.keyCode == 27) {
            windowClose();
        }
    });

    $(document).click(function(e) {
        if ($(e.target).hasClass('window')) {
            windowClose();
        }
    });

    $(window).resize(function() {
        windowPosition();
    });

    $('body').on('click', '.window-close, .window-close-btn', function(e) {
        windowClose();
        e.preventDefault();
    });

    $('body').on('click', '.form-number-inc', function() {
        var curInput = $(this).parent().find('.form-input input');
        var value = parseInt(curInput.val());
        var max = parseInt(curInput.attr('data-max'));
        var step = parseInt(curInput.attr('data-step'));
        if (step == undefined) {
            step = 1;
        }
        if (max != undefined) {
            if (value + 1 > max) {
                return;
            }
        }
        curInput.val(value + step);
    });

    $('body').on('click', '.form-number-dec', function() {
        var curInput = $(this).parent().find('.form-input input');
        var value = parseInt(curInput.val());
        var min = parseInt(curInput.attr('data-min'));
        var step = parseInt(curInput.attr('data-step'));
        if (step == undefined) {
            step = 1;
        }
        if (min != undefined) {
            if (value - 1 < min) {
                return;
            }
        }
        curInput.val(value - step);
    });

    $('body').on('keypress', '.form-number .form-input input', function (evt) {
        var charCode = (evt.which) ? evt.which : evt.keyCode
        if (charCode > 31 && (charCode < 43 || charCode > 57)) {
            return false;
        }
        return true;
    });

    $('body').on('change', '.form-number .form-input input', function (evt) {
        var curInput = $(this);
        var value = parseInt(curInput.val());
        if (value == undefined) {
            value = 0;
        }
        var max = parseInt(curInput.attr('data-max'));
        var min = parseInt(curInput.attr('data-min'));
        if (max != undefined) {
            if (value > max) {
                value = max;
            }
        }
        if (min != undefined) {
            if (value < min) {
                value = min;
            }
        }
        curInput.val(value);
    });

    $('body').on('click', '.catalogue-sort-select-value', function(e) {
        var curSelect = $(this).parent();
        if (curSelect.hasClass('open')) {
            curSelect.removeClass('open');
        } else {
            $('.catalogue-sort-select.open').removeClass('open');
            curSelect.addClass('open');
        }
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.catalogue-sort-select').length == 0) {
            $('.catalogue-sort-select.open').removeClass('open');
        }
    });

    $('body').on('click', '.catalogue-sort-mobile-select-value', function(e) {
        var curSelect = $(this).parent();
        if (curSelect.hasClass('open')) {
            curSelect.removeClass('open');
        } else {
            $('.catalogue-sort-mobile-select.open').removeClass('open');
            curSelect.addClass('open');
        }
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.catalogue-sort-mobile-select').length == 0) {
            $('.catalogue-sort-mobile-select.open').removeClass('open');
        }
    });

    $('body').on('click', '.window-table-menu ul li a', function(e) {
        var curLi = $(this).parent();
        if (!curLi.hasClass('active')) {
            $('.window-table-menu ul li.active').removeClass('active');
            curLi.addClass('active');
            var curIndex = $('.window-table-menu ul li').index(curLi);
            $('.window-table-tab.active').removeClass('active');
            $('.window-table-tab').eq(curIndex).addClass('active');
        }
        e.preventDefault();
    });

    $('.up-link').click(function(e) {
        $('html, body').animate({'scrollTop': 0});
        e.preventDefault();
    });

    $('.catalogue-history .catalogue-list').on('init', function(event, slick) {
        resizeCatalogue();
    });

    $('.catalogue-history .catalogue-list').slick({
        infinite: false,
        slidesToShow: 3,
        slidesToScroll: 3,
        prevArrow: '<button type="button" class="slick-prev"><svg width="9" height="15" viewBox="0 0 9 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M2.23185 7.5L9 13.7832L8.05645 15L-3.27835e-07 7.5L8.05645 -3.52159e-07L9 1.21676L2.23185 7.5Z" /></svg></button>',
        nextArrow: '<button type="button" class="slick-next"><svg width="9" height="15" viewBox="0 0 9 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.76815 7.5L-7.94116e-07 1.21676L0.943547 1.05648e-06L9 7.5L0.943549 15L8.5378e-07 13.7832L6.76815 7.5Z" /></svg></button>',
        dots: true,
        adaptiveHeight: true,
        responsive: [
            {
                breakpoint: 1079,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    arrows: false
                }
            }
        ]
    });

    $('.main-catalogue .catalogue-list').on('init', function(event, slick) {
        resizeCatalogue();
    });

    $('.main-catalogue .catalogue-list').slick({
        infinite: false,
        slidesToShow: 4,
        slidesToScroll: 4,
        prevArrow: '<button type="button" class="slick-prev"><svg width="9" height="15" viewBox="0 0 9 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M2.23185 7.5L9 13.7832L8.05645 15L-3.27835e-07 7.5L8.05645 -3.52159e-07L9 1.21676L2.23185 7.5Z" /></svg></button>',
        nextArrow: '<button type="button" class="slick-next"><svg width="9" height="15" viewBox="0 0 9 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.76815 7.5L-7.94116e-07 1.21676L0.943547 1.05648e-06L9 7.5L0.943549 15L8.5378e-07 13.7832L6.76815 7.5Z" /></svg></button>',
        dots: true,
        adaptiveHeight: true,
        responsive: [
            {
                breakpoint: 1079,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    arrows: false
                }
            }
        ]
    });

    $('.catalogue-recommend-tab .catalogue-list').on('init', function(event, slick) {
        resizeCatalogue();
    });

    $('.catalogue-recommend-tab .catalogue-list').slick({
        infinite: false,
        slidesToShow: 3,
        slidesToScroll: 3,
        prevArrow: '<button type="button" class="slick-prev"><svg width="9" height="15" viewBox="0 0 9 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M2.23185 7.5L9 13.7832L8.05645 15L-3.27835e-07 7.5L8.05645 -3.52159e-07L9 1.21676L2.23185 7.5Z" /></svg></button>',
        nextArrow: '<button type="button" class="slick-next"><svg width="9" height="15" viewBox="0 0 9 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.76815 7.5L-7.94116e-07 1.21676L0.943547 1.05648e-06L9 7.5L0.943549 15L8.5378e-07 13.7832L6.76815 7.5Z" /></svg></button>',
        dots: true,
        adaptiveHeight: true,
        responsive: [
            {
                breakpoint: 1079,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    arrows: false
                }
            }
        ]
    });

    $('.catalogue-popular .catalogue-list').on('init', function(event, slick) {
        resizeCatalogue();
    });

    $('.catalogue-popular .catalogue-list').slick({
        infinite: false,
        slidesToShow: 4,
        slidesToScroll: 4,
        prevArrow: '<button type="button" class="slick-prev"><svg width="9" height="15" viewBox="0 0 9 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M2.23185 7.5L9 13.7832L8.05645 15L-3.27835e-07 7.5L8.05645 -3.52159e-07L9 1.21676L2.23185 7.5Z" /></svg></button>',
        nextArrow: '<button type="button" class="slick-next"><svg width="9" height="15" viewBox="0 0 9 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.76815 7.5L-7.94116e-07 1.21676L0.943547 1.05648e-06L9 7.5L0.943549 15L8.5378e-07 13.7832L6.76815 7.5Z" /></svg></button>',
        dots: true,
        adaptiveHeight: true,
        responsive: [
            {
                breakpoint: 1079,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    arrows: false
                }
            }
        ]
    });

    $('.mobile-menu-link').click(function(e) {
        if ($('html').hasClass('mobile-menu-open')) {
            $('html').removeClass('mobile-menu-open');
            $('meta[name="viewport"]').attr('content', 'width=device-width');
        } else {
            var curWidth = $(window).width();
            if (curWidth < 480) {
                curWidth = 480;
            }
            $('html').addClass('mobile-menu-open');
            $('meta[name="viewport"]').attr('content', 'width=' + curWidth);
        }
        e.preventDefault();
    });

    $(document).click(function(e) {
        if ($(e.target).hasClass('menu')) {
            $('html').toggleClass('mobile-menu-open');
            $('meta[name="viewport"]').attr('content', 'width=device-width');
        }
    });

    $('.header-user-icon').click(function(e) {
        if ($('.header-user-icon').hasClass('active') && $(window).width() < 1080) {
            if ($('html').hasClass('mobile-user-menu-open')) {
                $('html').removeClass('mobile-user-menu-open');
                $('meta[name="viewport"]').attr('content', 'width=device-width');
            } else {
                var curWidth = $(window).width();
                if (curWidth < 480) {
                    curWidth = 480;
                }
                $('html').addClass('mobile-user-menu-open');
                $('meta[name="viewport"]').attr('content', 'width=' + curWidth);
            }
            e.preventDefault();
        }
    });

    $(document).click(function(e) {
        if ($(e.target).hasClass('header-user-menu')) {
            $('html').toggleClass('mobile-user-menu-open');
            $('meta[name="viewport"]').attr('content', 'width=device-width');
        }
    });

    $('.menu-block').each(function() {
        if ($(this).find('.menu-block-list').length > 0) {
            $(this).find('.menu-block-title').append('<div class="menu-block-title-arrow"></div>');
        }
    });

    $('body').on('click', '.menu-block-title-arrow', function() {
        $(this).parent().parent().toggleClass('open');
    });

    $('.main-catalogue-col ul li').each(function() {
        if ($(this).find('ul').length > 0) {
            $(this).append('<div class="main-catalogue-arrow"></div>');
        }
    });

    $('body').on('click', '.main-catalogue-arrow', function() {
        $(this).parent().toggleClass('open');
    });

    $('.mobile-search-link').click(function(e) {
        $('html').addClass('mobile-search-open');
        e.preventDefault();
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.header-search').length == 0 && !$(e.target).hasClass('mobile-search-link')) {
            $('html').removeClass('mobile-search-open');
        }
    });

    $('.catalogue-menu-mobile-link a').click(function(e) {
        $('.catalogue-menu-mobile').toggleClass('open');
        e.preventDefault();
    });

    $('.catalogue-menu-mobile-content ul li').each(function() {
        if ($(this).find('ul').length > 0) {
            $(this).append('<div class="catalogue-menu-mobile-arrow"></div>');
        }
    });

    $('body').on('click', '.catalogue-menu-mobile-arrow', function() {
        $(this).parent().toggleClass('open');
    });

    $('.basket-checkout-container').each(function() {
        window.setInterval(function() {
            if ($(window).width() > 1079) {
                $('.bx-basket').css({'padding-bottom': 0});
            } else {
                $('.bx-basket').css({'padding-bottom': $('.basket-checkout-container').height()});
            }
        }, 100);
    });

    $('.main-popular-list-container').slick({
        infinite: false,
        slidesToShow: 6,
        slidesToScroll: 6,
        prevArrow: '<button type="button" class="slick-prev"><svg width="9" height="15" viewBox="0 0 9 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M2.23185 7.5L9 13.7832L8.05645 15L-3.27835e-07 7.5L8.05645 -3.52159e-07L9 1.21676L2.23185 7.5Z" /></svg></button>',
        nextArrow: '<button type="button" class="slick-next"><svg width="9" height="15" viewBox="0 0 9 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.76815 7.5L-7.94116e-07 1.21676L0.943547 1.05648e-06L9 7.5L0.943549 15L8.5378e-07 13.7832L6.76815 7.5Z" /></svg></button>',
        dots: false,
        adaptiveHeight: true,
        responsive: [
            {
                breakpoint: 1079,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                    arrows: false,
                    dots: true
                }
            },

            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    arrows: false,
                    dots: true
                }
            }
        ]
    });

    $('.footer-content-mobile-header').click(function() {
        $('.footer-content').toggleClass('open');
    });

    $('.footer-menu-mobile-header').click(function() {
        $('.footer-menu-mobile').toggleClass('open');
    });

    $('.product-descr-btn a').click(function(e) {
        $(this).parent().prev().toggleClass('open');
        e.preventDefault();
    });

    $.validator.addMethod('INN',
        function(curSeries, element) {
            return this.optional(element) || curSeries.match(/^[0-9]{10}$/) || curSeries.match(/^[0-9]{12}$/);
        },
        'ИНН должен содержать 10 или 12 цифр'
    );

    var optionsINN =  {
        translation: {
            'X': {
                pattern: /[0-9]/
            },
            'W': {
                pattern: /[0-9]/, optional: true
            }
        }
    }
    $('input.INN').mask('XXXXXXXXXXWW', optionsINN);

    $.validator.addMethod('OGRN',
        function(curSeries, element) {
            return this.optional(element) || curSeries.match(/^[0-9]{13}$/) || curSeries.match(/^[0-9]{15}$/);
        },
        'Поле должно содержать 13 или 15 цифр'
    );

    var optionsOGRN =  {
        translation: {
            'X': {
                pattern: /[0-9]/
            },
            'W': {
                pattern: /[0-9]/, optional: true
            }
        }
    }
    $('input.OGRN').mask('XXXXXXXXXXXXXWW', optionsOGRN);

    $('.main-catalogue-list a').on('mouseenter', function(e) {
        if (typeof($(this).attr('data-bg')) !== 'undefined') {
            $('.main-catalogue-list-bg-category').css({'background-image': 'url(' + $(this).attr('data-bg') + ')'});
            $('.main-catalogue-list-bg-category').addClass('visible');
        }
    });

    $('body').on('click', '.catalogue-menu-inner a', function(e) {
        var curBlock = $(this.hash);
        if (curBlock.length == 1) {
            $('html, body').animate({'scrollTop': curBlock.offset().top});
            e.preventDefault();
        }
    });

    $('body').on('click', '.catalogue-filter-group-reset a', function(e) {
        var curGroup = $(this).parent().parent().parent();
        curGroup.find('input').prop('checked', false);
        curGroup.find('input').eq(0).trigger('change');
        e.preventDefault();
    });

    $('.catalogue-filter-slider').each(function() {
        var curSlider = $(this);
        var curRange = curSlider.find('.catalogue-filter-slider-range-inner')[0];
        var curStartFrom = Number(curSlider.find('.catalogue-filter-slider-min').html());
        if (Number(curSlider.find('.catalogue-filter-slider-from').val()) !== 0) {
            curStartFrom = Number(curSlider.find('.catalogue-filter-slider-from').val());
        }
        var curStartTo = Number(curSlider.find('.catalogue-filter-slider-max').html());
        if (Number(curSlider.find('.catalogue-filter-slider-to').val()) !== 0) {
            curStartTo = Number(curSlider.find('.catalogue-filter-slider-to').val());
        }
        noUiSlider.create(curRange, {
            start: [curStartFrom, curStartTo],
            connect: true,
            range: {
                'min': Number(curSlider.find('.catalogue-filter-slider-min').html()),
                'max': Number(curSlider.find('.catalogue-filter-slider-max').html())
            },
            tooltips: [wNumb({thousand: ' '}), wNumb({thousand: ' '})],
            step: Number(curSlider.find('.catalogue-filter-slider-step').html()),
            format: wNumb({
                decimals: 0
            })
        });
        curRange.noUiSlider.on('update', function(values, handle) {
            if (handle == 0) {
                curSlider.find('.catalogue-filter-slider-hints-from input').val(values[handle]);
            } else {
                curSlider.find('.catalogue-filter-slider-hints-to input').val(values[handle]);
            }
        });
        curRange.noUiSlider.on('end', function(values, handle) {
            filterCatalogue();
        });
    });

    $('body').on('keypress', '.catalogue-filter-slider-hints input', function(evt) {
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 43 || charCode > 57)) {
            return false;
        }
        return true;
    });

    $('.catalogue-filter-slider-hints input').change(function() {
        var newValue = parseInt($(this).val());
        if (newValue >= 0) {
        } else {
            newValue = 0;
        }
        $(this).val(newValue);
        var curSlider = $(this).parents().filter('.catalogue-filter-slider');
        curSlider.find('.catalogue-filter-slider-range-inner')[0].noUiSlider.set([Number(curSlider.find('.catalogue-filter-slider-hints-from input').val()), Number(curSlider.find('.catalogue-filter-slider-hints-to input').val())]);
        filterCatalogue();
    });

    $('.catalogue-filter-group-list').mCustomScrollbar({
        axis: 'y'
    });

    $('.catalogue-side-mobile-menu-item a').click(function(e) {
        if ($(this).parent().hasClass('active')) {
            $(this).parent().removeClass('active');
        } else {
            $('.catalogue-side-mobile-menu-item.active').removeClass('active');
            $(this).parent().addClass('active');
        }
        if ($('.catalogue-side-mobile-menu-item-menu').parent().hasClass('active')) {
            $('.catalogue').addClass('catalogue-menu-inner-open');
        } else {
            $('.catalogue').removeClass('catalogue-menu-inner-open');
        }
        if ($('.catalogue-side-mobile-menu-item-filter').parent().hasClass('active')) {
            $('.catalogue').addClass('catalogue-filter-open');
        } else {
            $('.catalogue').removeClass('catalogue-filter-open');
        }
        if ($('.catalogue-side-mobile-menu-item-sort').parent().hasClass('active')) {
            $('.catalogue').addClass('catalogue-sort-open');
        } else {
            $('.catalogue').removeClass('catalogue-sort-open');
        }
        e.preventDefault();
    });

    $('.catalogue-filter-group-header').click(function() {
        $(this).parent().toggleClass('open')
    });

    $('.catalogue-filter-checkbox input').change(function() {
        filterCatalogue();
    });

    if ($('.catalogue-filter').length == 1) {
        updateFilterMobile();
    }

    $('.product-colors-list-inner').slick({
        infinite: false,
        slidesToShow: 3,
        slidesToScroll: 3,
        prevArrow: '<button type="button" class="slick-prev"><svg width="7" height="9" viewBox="0 0 7 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.73926 0.608887L1.73926 4.10889L5.73926 7.60889" stroke-width="1.4"/></svg></button>',
        nextArrow: '<button type="button" class="slick-next"><svg width="7" height="9" viewBox="0 0 7 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.26074 8.39111L5.26074 4.89111L1.26074 1.39111" stroke-width="1.4"/></svg></button>',
        dots: false,
        adaptiveHeight: true,
        responsive: [
            {
                breakpoint: 1079,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    arrows: false
                }
            }
        ]
    });

    $('body').on('click', '.auth-tabs-menu-item a', function(e) {
        var curItem = $(this).parent();
        if (!curItem.hasClass('active')) {
            var curAuth = curItem.parents().filter('.auth');
            curAuth.find('.auth-tabs-menu-item.active').removeClass('active');
            curItem.addClass('active');
            var curIndex = curAuth.find('.auth-tabs-menu-item').index(curItem);
            curAuth.find('.auth-tabs-item.active').removeClass('active');
            curAuth.find('.auth-tabs-item').eq(curIndex).addClass('active');
        }
        e.preventDefault();
    });
    
});

function updateFilterMobile() {
    $('.catalogue-filter-group-list').each(function() {
        var curGroup = $(this).parents().filter('.catalogue-filter-group');
        curGroup.find('.catalogue-filter-group-values-mobile').html('');
        curGroup.find('.catalogue-filter-checkbox input:checked').each(function() {
            curGroup.find('.catalogue-filter-group-values-mobile').append('<div class="catalogue-filter-group-values-mobile-item">' + $(this).parent().find('span').html() + '</div>');
        });
    });

    $('.catalogue-filter-slider').each(function() {
        var curGroup = $(this).parents().filter('.catalogue-filter-group');
        curGroup.find('.catalogue-filter-group-values-mobile').html('');
        curGroup.find('.catalogue-filter-slider-hints-from').each(function() {
            curGroup.find('.catalogue-filter-group-values-mobile').append('<div class="catalogue-filter-group-values-mobile-item">от ' + $(this).find('input').val() + '</div>');
        });
        curGroup.find('.catalogue-filter-slider-hints-to').each(function() {
            curGroup.find('.catalogue-filter-group-values-mobile').append('<div class="catalogue-filter-group-values-mobile-item">до ' + $(this).find('input').val() + '</div>');
        });
    });
}

function filterCatalogue() {
    updateFilterMobile();
}

$(window).on('load resize', function() {
    resizeCatalogue();

    if ($(window).width() > 1079) {
        $('.main-news-list, .contacts-photos').each(function() {
            var curList = $(this);
            if (curList.hasClass('slick-slider')) {
                curList.slick('unslick');
            }
        });
    } else {
        $('.main-news-list').each(function() {
            var curList = $(this);
            if (!curList.hasClass('slick-slider')) {
                curList.slick({
                    infinite: false,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                    variableWidth: true,
                    dots: true
                });
            }
        });

        $('.contacts-photos').each(function() {
            var curList = $(this);
            if (!curList.hasClass('slick-slider')) {
                curList.slick({
                    infinite: false,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                    dots: true
                });
            }
        });
    }

    $('.product-descr-container').each(function() {
        var curBlock = $(this);
        curBlock.removeClass('open');
        if (curBlock.height() < curBlock.find('.product-descr-content').height()) {
            curBlock.addClass('with-btn');
        } else {
            curBlock.removeClass('with-btn');
        }
    });

});

function resizeCatalogue() {
    $('.catalogue-list').each(function() {
        var curList = $(this);

        curList.find('.catalogue-item-title').css({'min-height': '0px'});

        curList.find('.catalogue-item-title').each(function() {
            var curBlock = $(this);
            var curHeight = curBlock.outerHeight();
            var curTop = curBlock.offset().top;

            curList.find('.catalogue-item-title').each(function() {
                var otherBlock = $(this);
                if (otherBlock.offset().top == curTop) {
                    var newHeight = otherBlock.outerHeight();
                    if (newHeight > curHeight) {
                        curBlock.css({'min-height': newHeight + 'px'});
                    } else {
                        otherBlock.css({'min-height': curHeight + 'px'});
                    }
                }
            });
        });

        curList.find('.catalogue-item-sizes').css({'min-height': '0px'});

        curList.find('.catalogue-item-sizes').each(function() {
            var curBlock = $(this);
            var curHeight = curBlock.outerHeight();
            var curTop = curBlock.offset().top;

            curList.find('.catalogue-item-sizes').each(function() {
                var otherBlock = $(this);
                if (otherBlock.offset().top == curTop) {
                    var newHeight = otherBlock.outerHeight();
                    if (newHeight > curHeight) {
                        curBlock.css({'min-height': newHeight + 'px'});
                    } else {
                        otherBlock.css({'min-height': curHeight + 'px'});
                    }
                }
            });
        });
    });
}

$(window).on('resize', function() {
    $('.form-select select').chosen('destroy');
    $('.form-select select').chosen({disable_search: true});
});

function initForm(curForm) {
    curForm.find('.form-select select').chosen({disable_search: true});

    var optionsPhoneRU =  {
        translation: {
            'X': {
                pattern: /[0-9]/
            },
            'W': {
                pattern: /[0-9]/, optional: true
            }
        }
    }
    curForm.find('input.phoneRU').mask('+7 XXXXXXXXXXW', optionsPhoneRU);
    curForm.find('input.phoneRU').on('focus', function() {
        if ($(this).val() == '') {
            $(this).val('+7 ');
        }
    });

    curForm.find('input.birthdate').mask('99.99.9999');

    if (curForm.find('.policy-checkbox').length == 1 && !curForm.find('.policy-checkbox').prop('checked')) {
        curForm.find('.form-submit input').prop('disabled', true);
    }

    curForm.find('.policy-checkbox').change(function() {
        if ($(this).prop('checked')) {
            curForm.find('.form-submit input').prop('disabled', false);
        } else {
            curForm.find('.form-submit input').prop('disabled', true);
        }
    });

    curForm.validate({
        ignore: '',
        submitHandler: function(form) {
            if ($(form).hasClass('ajax-form')) {
                var formData = new FormData(form);

                if ($(form).find('[type=file]').length != 0) {
                    var file = $(form).find('[type=file]')[0].files[0];
                    formData.append('file', file);
                }

                windowOpen($(form).attr('action'), formData);
            } else {
                form.submit();
            }
        }
    });
}

function windowOpen(linkWindow, dataWindow) {
    if ($('.window').length > 0) {
        windowClose();
    }

    var curPadding = $('.wrapper').width();
    var curWidth = $(window).width();
    if (curWidth < 480) {
        curWidth = 480;
    }
    var curScroll = $(window).scrollTop();
    $('html').addClass('window-open');
    curPadding = $('.wrapper').width() - curPadding;
    $('body').css({'margin-right': curPadding + 'px'});
    $('body').append('<div class="window"><div class="window-loading"></div></div>')
    $('.wrapper').css({'top': -curScroll});
    $('.wrapper').data('curScroll', curScroll);
    $('meta[name="viewport"]').attr('content', 'width=' + curWidth);

    $.ajax({
        type: 'POST',
        url: linkWindow,
        processData: false,
        contentType: false,
        dataType: 'html',
        data: dataWindow,
        cache: false
    }).done(function(html) {
        $('.window').append('<div class="window-container window-container-preload"><div class="window-content">' + html + '<a href="#" class="window-close"></a></div></div>')

        windowPosition();
        if ($(window).width() < 1080) {
            $('.window-close').css({'height': $('.window-title').outerHeight()});
        }

        $('.window-container-preload').removeClass('window-container-preload');

        $('.window .table-scroll').mCustomScrollbar({
            axis: 'x'
        });

        $('.window form').each(function() {
            initForm($(this));
        });

    });
}

function windowOpenHTML(htmlWindow) {
    if ($('.window').length > 0) {
        windowClose();
    }

    var curPadding = $('.wrapper').width();
    var curWidth = $(window).width();
    if (curWidth < 480) {
        curWidth = 480;
    }
    var curScroll = $(window).scrollTop();
    $('html').addClass('window-open');
    curPadding = $('.wrapper').width() - curPadding;
    $('body').css({'margin-right': curPadding + 'px'});
    $('body').append('<div class="window"><div class="window-loading"></div></div>')
    $('.wrapper').css({'top': -curScroll});
    $('.wrapper').data('curScroll', curScroll);
    $('meta[name="viewport"]').attr('content', 'width=' + curWidth);

    $('.window').append('<div class="window-container window-container-preload"><div class="window-content">' + htmlWindow + '<a href="#" class="window-close"></a></div></div>')

    windowPosition();
    if ($(window).width() < 1080) {
        $('.window-close').css({'height': $('.window-title').outerHeight()});
    }

    $('.window-container-preload').removeClass('window-container-preload');

    $('.window .table-scroll').mCustomScrollbar({
        axis: 'x'
    });

    $('.window form').each(function() {
        initForm($(this));
    });
}

function windowPosition() {
    if ($('.window').length > 0) {
        $('.window-container').css({'left': '50%', 'margin-left': -$('.window-container').width() / 2});

        $('.window-container').css({'top': '50%', 'margin-top': -$('.window-container').height() / 2, 'padding-bottom': 0});
        if ($('.window-container').height() > $('.window').height() - 80) {
            $('.window-container').css({'top': 40, 'margin-top': 0, 'padding-bottom': 40});
        }
    }
}

function windowClose() {
    if ($('.window').length > 0) {
        $('.window').remove();
        $('html').removeClass('window-open');
        $('body').css({'margin-right': 0});
        $('.wrapper').css({'top': 0});
        $(window).scrollTop($('.wrapper').data('curScroll'));
        $('meta[name="viewport"]').attr('content', 'width=device-width');
    }
}

$(window).on('load resize scroll', function() {
    var curScroll = $(window).scrollTop();

    if (curScroll > $(window).height()) {
        $('.up-link').addClass('visible');
    } else {
        $('.up-link').removeClass('visible');
    }

	if ($('.bx-soa-sidebar').length > 0) {
		var curScroll = $(window).scrollTop();
		var curTop = $('.bx-soa-sidebar').offset().top - 20;
        $('.bx-soa-sidebar').height($('.bx-soa-sidebar .bx-soa-cart-total').outerHeight(true));
		if (curTop < curScroll) {
            $('.bx-soa-sidebar .bx-soa-cart-total').addClass('fixed');
            $('.bx-soa-sidebar .bx-soa-cart-total').css({'margin-top': 0});
            var curOffset = ($('.bx-soa-sidebar .bx-soa-cart-total').offset().top + $('.bx-soa-sidebar .bx-soa-cart-total').outerHeight(true)) - ($('#bx-soa-order').offset().top + $('#bx-soa-order').outerHeight(true));
            if (curOffset > 0) {
                $('.bx-soa-sidebar .bx-soa-cart-total').css({'margin-top': -curOffset});
            } else {
                $('.bx-soa-sidebar .bx-soa-cart-total').css({'margin-top': 0});
            }
		} else {
			$('.bx-soa-sidebar .bx-soa-cart-total').removeClass('fixed');
            $('.bx-soa-sidebar .bx-soa-cart-total').css({'margin-top': 0});
		}
	}
});

$(window).on('resize', function() {
    if ($(window).width() < 1080) {
        $('.window-close').css({'height': $('.window-title').outerHeight()});
    } else {
        $('.window-close').css({'height': 39});
    }
});