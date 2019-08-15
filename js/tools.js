$(document).ready(function() {

    $.validator.addMethod('phoneRU',
        function(phone_number, element) {
            return this.optional(element) || phone_number.match(/^\+7 \(\d{3}\) \d{3}\-\d{2}\-\d{2}$/);
        },
        'Ошибка заполнения'
    );

    $('body').on('change', '.form-file input', function() {
        var curInput = $(this);
        var curField = curInput.parents().filter('.form-file');
        var curForm = curField.parents().filter('form');
        var curName = curInput.val().replace(/.*(\/|\\)/, '');
        var curNameArray = curName.split('.');
        var curExt = curNameArray[curNameArray.length - 1];
        curNameArray.pop();
        var curNameText = curNameArray.join('.');
        if (curNameText.length > 10) {
            curNameText = curNameText.substring(0, 10) + '...' + curNameText.slice(-1);
        }
        curField.find('.form-file-name-text').html(curNameText + '.' + curExt);
        curForm.find('.form-files').append(curForm.data('filesCode'));
    });

    $('form').each(function() {
        initForm($(this));
    });

    $('body').on('click', '.form-file-name-remove', function() {
        var curField = $(this).parents().filter('.form-file');
        curField.remove();
    });

    $('.menu-catalogue-link').click(function(e) {
        $('html').toggleClass('menu-open');
        e.preventDefault();
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

    $('body').on('click', '.catalogue-item-favourite', function(e) {
        var curItem = $(this).parents().filter('.catalogue-item');
        curItem.toggleClass('in-favourite');
        e.preventDefault();
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

    $('.product-gallery-big-list').slick({
        infinite: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: false
    }).on('setPosition', function(event, slick) {
        var currentSlide = $('.product-gallery-big-list').slick('slickCurrentSlide');
        $('.product-gallery-preview ul li.active').removeClass('active');
        $('.product-gallery-preview ul li').eq(currentSlide).addClass('active');
    });

    $('.product-gallery-preview ul li a').click(function(e) {
        var curIndex = $('.product-gallery-preview ul li').index($(this).parent());
        $('.product-gallery-big-list').slick('slickGoTo', curIndex);
        e.preventDefault();
    });

    $('.product-gallery-big-item img').each(function() {
        new Drift(this, {
            paneContainer: $('.product-info')[0],
            containInline: true,
            hoverBoundingBox: true
        });
    });

});

$(window).on('load resize', function() {
    resizeCatalogue();
});

function resizeCatalogue() {
    $('.catalogue-list').each(function() {
        var curList = $(this);

        curList.find('.catalogue-item-inner').css({'min-height': '0px'});

        curList.find('.catalogue-item-inner').each(function() {
            var curBlock = $(this);
            var curHeight = curBlock.outerHeight();
            var curTop = curBlock.offset().top;

            curList.find('.catalogue-item-inner').each(function() {
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

function initForm(curForm) {
    curForm.find('input.phoneRU').mask('+7 (000) 000-00-00');

    if (curForm.find('.form-files').length > 0) {
        curForm.data('filesCode', curForm.find('.form-files').html());
    }

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
    if ($('html').hasClass('menu-open')) {
        $('.wrapper').css({'top': 'auto'});
        $('html').removeClass('menu-open');
        $(window).scrollTop($('.wrapper').data('curScroll'));
    }

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

        $('.window-container-preload').removeClass('window-container-preload');

        $('.window form').each(function() {
            initForm($(this));
        });

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