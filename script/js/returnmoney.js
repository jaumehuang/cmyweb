var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer', 'load', 'raty', 'labs'], function($, commom, layer, load, raty, labs) {
		//初始化数据
		$(function() {

			if(commom.GetQueryString("str")) {
				
				var guidArr = (commom.GetQueryString("str")).split("|");
				goodProduct(guidArr[0]);
			}

			//提交
			$(".btn_in").on("click", function() {

				Submit();
			})
		});
		//商品
		function goodProduct(guid) {
			//启动加载
			var Load = new load();
			$.ajax({
				url: commom.path.httpurl + "?action=GetOrderProductList&OrderInfoGuid=" + guid,
				method: 'get',
				timeout: 1000,
				dataType: "json",
				success: function(ret) {
					//关闭加载
					Load.hide();
					if(!ret.isError) {

						var arryList = JSON.parse(ret.Msg);
						var str = '';
						for(var i = 0; i < arryList.length; i++) {
							str += '<div class="myreturn clearfix">'
							str += '<a href="javascript:" class="fl show_img">';
							str += '<img  src="' + arryList[0].OriginalImge + '" onclick="open_details1(\'' + arryList[i].Guid + '\')" data-guid="' + arryList[0].ProductGuid + '"/></a>';
							str += '<div class="list_mian fl">';
							str += '<div class="title">' + arryList[i].Name + '</div>';
							str += '<div class="price clearfix">';
							str += '<div class="fl"><span>' + arryList[i].Attributes + '</span></div>';
							str += '<div class="fr">X' + arryList[i].buyNumber + '</div></div>';
							str += '<div class="price">';
							str += '实付漫豆：<span>' + arryList[i].BuyPrice + '</span></div>';
							str += '</div></div></div>';

						}

						$(".list_li").append(str);
						//星级
						$.fn.raty.defaults.path = '../image';
						$('#readOnly1').raty({
							score: function() {
								return $(this).attr('data-score')
							}
						});
					} else {

						//提示
						layer.open({
							content: ret.Msg,
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
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

		//提交品论
		function Submit() {

			if($("textarea").val().length == 0) {
				layer.open({
					content: '请填写退款理由',
					skin: 'msg',
					time: 2 //2秒后自动关闭
				});
			   return false;
			};
			//启动加载
			var Load = new load();
			var guidArr = (commom.GetQueryString("str")).split("|");
			var param = {
				MemLoginId: commom.getCookie('memlogid'),
				OperateType: 'ReturnMoney',
				OrderNumber: guidArr[1],
				ApplyReason: $("textarea").val()
			};

			$.ajax({
				url: commom.path.httpurl + "?action=OperateOrderInfo",
				method: 'post',
				dataType: "json",
				data: param,
				success: function(ret) {
					//关闭加载
					Load.hide();
					if(!ret.isError) {
                        layer.open({
							content: '提交成功,2s跳转',
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
						setTimeout(function(){
							 window.history.back();
						},2000)
					} else {
						//提示
						layer.open({
							content: ret.Msg,
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
					}
				}
			})
		}
	})
})