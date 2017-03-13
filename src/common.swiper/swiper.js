define(function(require, exports, module) {
    var $ = require("jquery");
    var Engine = require("engine");
    var box = Engine.init();
        require("src/common.swiper/swiper.min.css");
    var swiperTpl = require("src/common.swiper/swiper.tpl");
    var Swiper = require("swiper");


    var swiperApp = {
        swiperIndex: function(banner){ //首页需要
            box.render($("#swiperIndex"), banner, swiperTpl);
        
            var len  = banner.length;
            var ww = $(window).width()*0.37;
            var wHeight = $(window).height();

            $("#swiperIndex .swiper-wrapper").css("width",ww*len+"px");
            $("#swiperIndex .swiper-wrapper img").css("width",ww+"px");

            var wHeight = $(window).height();
            if(wHeight>900){
                $("#swiperIndex,.bannerSide,#swiperIndex .swiper-wrapper,#swiperIndex .swiper-slide img").css("height","220px");
            }else{
                $("#swiperIndex,.bannerSide,#swiperIndex .swiper-wrapper,#swiperIndex .swiper-slide img").css("height","180px");
            }
            
            
            var swiper = new Swiper('#swiperIndex', {
                pagination: '.swiper-pagination',
                paginationClickable: true,
                spaceBetween: 0,
                centeredSlides: true,
                autoplay: 6000,
                autoplayDisableOnInteraction: false,
            });
        },
        swiperInfo: function(banner){ //电站详情需要
            box.render($("#swiperInfo"), banner, swiperTpl);
            
            var swiper = new Swiper('#swiperInfo', {
                pagination: '.swiper-pagination',
                paginationClickable: true,
                spaceBetween: 0,
                centeredSlides: true,
                autoplay: 6000,
                autoplayDisableOnInteraction: false,
            }); 
        }
    };
    
    module.exports = swiperApp;
});