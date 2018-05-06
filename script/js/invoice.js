var require = require(['main'], function(main) {

	require(['jquery', 'commom', "load","layer"], function($, commom, load,layer) {
		//初始化
		$(function() {
            
            $(".invioce_p .ul_list .li_li").on("click", function() {

				var $index = $(this).index();

				$(this).addClass("active").siblings().removeClass("active");
				if ($index == 0) {
					$(".form_list").show();
				} else {
					$(".form_list").hide();
				}
			});
			//提交数据
			$(".btn_in").on("click",function(){
				 
				 getData();
			})
		});
			//提交数据
		function getData() {
			
			var param = {
				f1: $(".form_list input.name").val(),
				f2: $(".form_list input.number").val(),
			}
//			api.sendEvent({
//				name: 'invoice',
//				extra: {
//					key1: $(".invioce_p .ul_list .active").text(),
//					key2: param
//				}
//			});
//			api.closeWin();
		   commom.setItem([{"name":"invoice-key1","value":$(".invioce_p .ul_list .active").text()},{"name":'invoice-key2',"value":JSON.stringify(param)}])

		}
      })
})