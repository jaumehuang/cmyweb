var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer', 'load', 'keyboard'], function($, commom, layer, load, keyboard) {
		//初始化数据
		$(function() {

			//初始化数据
			var orderNumber = commom.GetQueryString("str");

			GetPrice(orderNumber);
			inPassword('#J_KeyBoard', ".bottom_btn");
		});
		//
		//获取订单信息
		function GetPrice(orderNumber) {
			//启动加载
			var Load = new load();
			var param = {
				MemLoginId: commom.getCookie('memlogid'),
				OrderNumber: orderNumber
			};
			console.log(param);
			$.ajax({
				url: commom.path.httpurl + "?action=GetOrderInfoDetail",
				method: 'get',
				dataType: "json",
				data: param,
				timeout: 1000,
				success: function(ret) {
					Load.hide();
					
					if(!ret.isError) {
						
						var arryList = commom.Transformation(ret.Msg);
				
						$(".pay_show .pay_li").eq(0).find("label span").text("需支付漫豆(" + arryList[0].AdvancepaymentPayPrice + ")");
						$("#J_OpenKeyBoard").attr("data-AdvancepaymentPayPrice", arryList[0].AdvancepaymentPayPrice);
						$("#J_OpenKeyBoard").attr("data-ShouldPayPrice", arryList[0].ShouldPayPrice);
					}
				},
				complete: function(XMLHttpRequest, status) { //请求完成后最终执行参数
					//						console.log(XMLHttpRequest)　　　　
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
		};

		function payKeyboard(InPayPwd) {

			var param = {
				MemLoginId: commom.getCookie('memlogid'),
				OrderNumber: commom.GetQueryString("str"),
				PayPwd: InPayPwd
			};
			//启动加载
			var Load = new load();
			$.ajax({
				url: commom.path.httpurl + "?action=PayAdvancepayment",
				method: 'post',
				dataType: "json",
				timeout: 500,
				data: param,
				async: false,
				success: function(ret) {
					console.log(ret)
					//关闭加载
					Load.hide();
					if(!ret.isError) {

						layer.open({
							content: '支付成功',
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
						setTimeout(function() {

                            window.location.href="../html/myorder.html?id=0";
						}, 2000);　
					} else {
						//信息框
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

		function inPassword(ele, ele2) {

			! function($, ydui) {

				var dialog = ydui.dialog;

				var $keyboard = $(ele);
				// 初始化参数
				$keyboard.keyBoard({
					disorder: false, // 是否打乱数字顺序
					title: '车漫游安全键盘' // 显示标题
				});
				$(".J_OpenKeyBoard").focus(function() {
					document.activeElement.blur();
				});
				// 打开键盘
				$(ele2).on('click', function(e) {
					
					$keyboard.keyBoard('open');
					// 六位密码输入完毕后执行
					$keyboard.on('done.ydui.keyboard', function(ret) {

						var InPayPwd = ret.password;
                         payKeyboard(InPayPwd);
						// 关闭键盘
						$keyboard.keyBoard('close');

					})
				});
			}(jQuery, YDUI);
		}
	})
})