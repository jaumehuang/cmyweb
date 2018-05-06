//	 	鼠标长按弹窗
var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'load', 'lazyload', 'layer'], function($, commom, load, lazyload, layer) {

		$(function() {

			person();

		});
		//获取商品二维码
		function GetCode() {

			//启动加载
			var Load = new load();
			var is = typeof commom.getCookie('memlogid') == 'string' ? true : false;
			if(is) {

				var param = {

					MemLoginId: commom.getCookie('memlogid')
				}
				//启动加载
				var Load = new load();
				$.ajax({
					url: commom.path.httpurl + "?action=GetMember",
					method: 'get',
					dataType: "json",
					timeout: 1000,
					data: param,
					success: function(ret) {
						//关闭加载
						Load.hide();
						if(!ret.IsError) {

							var arrList = JSON.parse(ret.Msg);
							var param2 = {};
							param2.Id = arrList[0].Id;
							$.ajax({
								url: commom.path.httpurl + "?action=QrCode",
								method: 'get',
								dataType: "json",
								timeout: 1000,
								data: param2,
								success: function(ret) {

									if(!ret.isError) {
										$(".show_code .code_img").attr('src', ret.Msg);
									} else {
										layer.open({
											content: ret.Msg,
											skin: 'msg',
											time: 2 //2秒后自动关闭
										});　
									}
								}
							})
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
			} else {
				window.location.href = '../html/login.html';
			};
		}
		//个人信息
		function person() {
			
			var is = typeof commom.getCookie('memlogid') == 'string' ? true : false;

			if(!is) {

				window.location.href = '../html/login.html';
				return false;
			}
			var param = {
				MemLoginId: commom.getCookie('memlogid')
			}
			//  alert(param.MemLoginId);
			$.ajax({
				url: commom.path.httpurl + "?action=GetMember",
				method: 'get',
				dataType: "json",
				timeout: 1000,
				data: param,
				success: function(ret) {

					if(!ret.isError) {
						var arryList = JSON.parse(ret.Msg);
						//						$api.setStorage('person', arryList[0]);
						$(".user img").attr("src", arryList[0].Photo);
						$(".user .myname").text(arryList[0].RealName);
						GetCode();

					} else {

						layer.open({
							content: ret.Msg,
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
					}
				}
			});
		}
		//底部分界线
	})
})