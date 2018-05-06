var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer', 'load'], function($, commom, layer, load) {
		//初始化数据
		$(function() {
            //启动加载
            var Load= new load();
			$.ajax({
				url: commom.path.httpurl + "?action=LoadApp",
				method: 'get',
				dataType: "json",
				timeout: 1000,
				success: function(ret) {
					Load.hide();
					if(!ret.isError) {
						
						$(".cmy_t").after(ret.Msg);
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
		})
	})
})