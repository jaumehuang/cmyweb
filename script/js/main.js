 requirejs.config({
	 
	 baseUrl: "../script/lib",
	 shim: {
　　　　　　'lazyload': {
　　　　　　　　deps: ['jquery'],
　　　　　　　　exports: 'jQuery.fn.lazyload'
　　　　　　},
           'pinyin': {
　　　　　　　　deps: ['jquery'],
　　　　　　　　exports: 'pinyin'
　　　　　　},
           'sort': {
　　　　　　　　deps: ['jquery'],
　　　　　　　　exports: 'sort'
　　　　　　},
           'rangeslider': {
　　　　　　　　deps: ['jquery'],
　　　　　　　　exports: 'rangeslider'
　　　　　　},
           'raty': {
　　　　　　　　deps: ['jquery'],
　　　　　　　　exports: 'jQuery.fn.raty'
　　　　　　},
           'labs': {
　　　　　　　　deps: ['jquery'],
　　　　　　　　exports: 'labs'
　　　　　　},
           'mobiscroll': {
　　　　　　　　deps: ['jquery'],
　　　　　　　　exports: 'mobiscroll'
　　　　　　},
           'jquery_form': {
　　　　　　　　deps: ['jquery'],
　　　　　　　　exports: 'jquery_form'
　　　　　　},
          'CNAddrArr': {
　　　　　　　
　　　　　　　　exports: 'CNAddrArr'
　　　　　　},
           "scs":{
           	  　deps: ['jquery'],
　　　　　　　　  exports: 'scs'
           },
            "TouchSlide":{
　　　　　　　　  exports: 'TouchSlide'
           },
            "keyboard":{
            	
            	    deps: ['jquery'],
　　　　　　　　  exports: 'keyboard'
           },
            'cookie': {
　　　　　　　　deps: ['jquery'],
　　　　　　　　exports: 'cookie'
　　　　　　}

　　　　},
	 paths:{
	 	
	 	"jquery":'jquery',
	 	"swiper":'swiper',
	 	"commom":"commom",
	 	"layer":"layer",
	 	"load":"loading",
	 	"infinitescroll":"infinitescroll"
	 	
	 }
});