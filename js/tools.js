$(document).ready(function() {

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