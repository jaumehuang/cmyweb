var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer', 'load', 'lazyload'], function($, commom, layer, load, lazyload) {
		//初始化数据
		$(function() {

			//启动加载
			var Load = new load();
			var param = {
				MemLoginId: commom.getCookie('memlogid')
			}
			$.ajax({
				url: commom.path.httpurl + "?action=GetMessage",
				method: 'get',
				dataType: "json",
				timeout: 1000,
				data: param,
				success: function(ret) {
					Load.hide();

					if(!ret.isError) {

						var arrList = typeof ret.Msg == 'string' ? JSON.parse(ret.Msg) : ret.Msg;
						var str = '';
						for(var i = 0; i < arrList.length; i++) {

							str += '<li class="infor_li">';
							str += '<div class="time">' + arrList[i].CreateTime + '</div>';
							str += '<div class="info_mian">';
							str += '<div class="title">' + arrList[i].Title + '</div>'
							str += '<div class="content">' + arrList[i].Content + '</div>';
							str += '</div></li>';
						}
						$(".my-information").append(str);
						//更新消息
						UpdateInformation();
					} else {

						commom.nodataMsg('没有消息');　
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
		//更新已阅读的消息
		function UpdateInformation() {

			var param = {

				MemLoginId: commom.getCookie('memlogid')
			}
			$.ajax({
				url: commom.path.httpurl + "?action=UpdateMessage",
				method: 'get',
				dataType: "json",
				timeout: 1000,
				data: param,
				success: function(ret) {
					
					if(!ret.isError) {

					}
				}
			});
		};
	})
})