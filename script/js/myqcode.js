var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer', 'load'], function($, commom, layer, load) {
		//初始化数据
		$(function() {
			//启动加载
			var Load = new load();
			$.ajax({
				url: commom.path.httpurl + "?action=GetTransferCode",
				method: 'get',
				dataType: "json",
				timeout: 1000,
				data: {
					MemLoginId: commom.getCookie('memlogid'),
				},
				success: function(ret) {
					Load.hide();
					console.log(ret)
					if(!ret.isError) {

						$(".myqcode img.code").attr('src', ret.Msg);
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
			});
			//初始化个人信息
			person();
		});
		//个人信息
		function person() {

			var Load = new load();
			$.ajax({
				url: commom.path.httpurl + "?action=GetMember",
				method: 'get',
				dataType: "json",
				timeout: 1000,
				data: {
					MemLoginId: commom.getCookie('memlogid'),
				},
				success: function(ret) {
					console.log(ret)
					Load.hide();
					if(!ret.isError) {
                       
                       var arr= commom.Transformation(ret.Msg);
                       $(".info-photo").attr("src",arr[0].Photo);
                       $(".name").text(arr[0].RealName);
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