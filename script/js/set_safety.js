var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer', 'load'], function($, commom, layer, load) {

		$(function() {
           person()
		})

		function person() {
			
			//启动加载
			var Load =new load();
			var param = {
				MemLoginId: commom.getCookie('memlogid')
			}
			$.ajax({
				url: commom.path.httpurl + "?action=GetMember",
				method: 'get',
				dataType: "json",
				timeout: 1000,
				data: param,
				success: function(ret) {
					
					Load.hide();
					if(!ret.isError) {
						var arryList = JSON.parse(ret.Msg);
						$(".set_up .input_in").eq(0).find("span.fr").text(arryList[0].MemLoginID);
						$(".set_up .input_in").eq(2).find("div.fr span.fl").text(arryList[0].Mobile);
						$(".set_up .input_in").eq(3).find("div.fr span.fl").text(arryList[0].Email);
						commom.setCookie('Mobile', arryList[0].Mobile);	
					}
				},
				complete: function(XMLHttpRequest, status) { //请求完成后最终执行参数
					　　　　
					if(status == 'timeout') { //超时,status还有success,error等值的情况
						//关闭加载
						Load.hide();　　　　　　　　　
						layer.open({
							content: '请求超时,检查网络',
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});　　　　
					}　　
				}
			})
		}
	})
})