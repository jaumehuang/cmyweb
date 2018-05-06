var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'load', 'lazyload', 'layer'], function($, commom, load, lazyload, layer) {

		$(function() {
			//初始化数据
			Appointment();
			//取消预约
			$(".appoint_list").on("click", ".list_li .btn_cancel", function() {
				
                var $self=$(this);
				var guid = $(this).attr("data-guid");
				CancelAppont(guid,$self);
			})
		});
		//我的预约
		function Appointment() {
			var param = {
				MemLoginId: commom.getCookie('memlogid'),
				Type: 4
			};
			//启动加载
			var Load = new load();
			$.ajax({
				url: commom.path.httpurl + "?action=GetProductComment",
				method: 'get',
				dataType: "json",
				timeout: 1000,
				data: param,
				success: function(ret) {
					//关闭加载
					Load.hide();
					if(!ret.isError) {
						var arryList = JSON.parse(ret.Msg);
						var str = '';
						for(var i = 0; i < arryList.length; i++) {

							str += '<li class="list_li">';
							str += '<div class="time">' + arryList[i].SendTime + '</div>';
							str += '<div class="list_main clearfix">';
							str += '<a href="#" class="fl show_img" onclick="open_win(\'' + 'details2' + '\',\'' + arryList[i].ProductGuid + '\')" >';
							str += '<img src="' + arryList[i].OriginalImge + '" /></a>';
							str += '<div class="list_mian fl">';
							str += '<div class="title">' + arryList[i].ProductName + '</div>';
							str += '<div class="price look_time">' + arryList[i].Content + '</div></div></div>';
							str += '<div class="btn_group clearfix"><button class="btn_cancel fr" data-guid="' + arryList[i].Guid + '" >取消预约</button></div></li>';
						}
						$(".appoint_list").append(str);
					} else {
						alert("sss")
						commom.nodataMsg('没有相关预约');
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
		//取消预约onclick="open_details1(\''+ arryList[i].ProductGuid+ '\')" >';
		function CancelAppont(guid, $self) {
			layer.open({
				content: '您确定要取消该预约？',
				btn: ['确定', '取消'],
				yes: function(index) {
					//启动加载
					var Load = new load();
					$.ajax({
						url: commom.path.httpurl + "?action=DeleteProductComment&guid=" + guid,
						method: 'post',
						timeout: 1000,
						dataType: "json",
						success: function(ret) {
							Load.hide();
							$self.parentsUntil().eq(1).remove();
							if(!ret.isError) {
								layer.open({
									content: '取消成功',
									skin: 'msg',
									time: 2 //2秒后自动关闭
								});
							}
						}
					})
					layer.close(index);
				}
			});
		}
	})
})