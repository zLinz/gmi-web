/**
 * @description Index page logic
 * @author Liam
 */
var Global = require('tool/global');
var Host = require('tool/host');

$(function () {
    var app = new Vue({
        el: '.index-page',
        data: {

        },
        mounted: function () {
            new Swiper ('.swiper-container', {
                direction: 'horizontal',
                loop: true,
                effect: 'slide',
                zoom: 1,
                freeMode: false,
                autoplay: {
                    delay: 2000,
                    disableOnInteraction: false
                },
                scrollbar: {
                    draggable: true
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true
                },

            })
        },
        methods: {

        }
    });

})