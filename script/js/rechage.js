var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer', 'load'], function($, commom, layer, load) {
		//初始化数据
		$(function() {

			//初始化
			InitMoney();
			ChangeMoney();
			$(".btn_ti .btn_in").on("click", function() {
                SibmitMoney();
			})
		});
		//获取可充值曼豆
		function InitMoney() {

			var Load = new load();
			var param = {
				MemLoginId: commom.getCookie('memlogid'),
				Type: 'Recharge'
			};
			console.log(param)
			$.ajax({
				url: commom.path.httpurl + "?action=LimitRechargeAndWithdrawal",
				method: 'get',
				dataType: "json",
				timeout: 1000,
				data: param,
				success: function(ret) {
			
					Load.hide();
					if(!ret.isError) {
						var arryList = JSON.parse(ret.Msg);

						$(".money_p .Limit").text("当日可充值额度为" + arryList.AmountDaily);
						$(".money_in .money_f").attr("AvailableAmount", arryList.AvailableAmount);
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
		};
		//漫豆转化率
		function ChangeMoney() {
			//启动加载
			var Load = new load();
			$.ajax({
				url: commom.path.httpurl + "?action=GetRate",
				method: 'get',
				dataType: "json",
				timeout: 500,
				async: false,
				success: function(ret) {
					//关闭加载
					Load.hide();
					if(!ret.isError) {

						$(".recharge-num").text(ret.Msg);

					} else {

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
			});
		};
		//获取可充值订单
		function rechange() {

			var Load = new load();
			var moneyNum = $("input").val();
			var param = {

				MemLoginId: commom.getCookie('memlogid'),
				RechargeBalance:moneyNum

			};
			console.log(param)
			$.ajax({
				url: commom.path.httpurl + "?action=Recharge",
				method: 'post',
				dataType: "json",
				timeout: 500,
				async: false,
				data: param,
				success: function(ret) {
					Load.hide();
			
					if(!ret.isError) {
						
						//开始充值
						var ObjList = JSON.parse(ret.Msg);
						 window.location.href="http://cmyapi.jshcn.cn/webform/pay/WxPayByJsApi.aspx?OrderNumber="+ObjList.OrderNumber;
					} else {

						layer.open({
							content: ret.Msg,
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});　
					};
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
		};
		//提交数据
		function SibmitMoney() {

			var index = $(".btn_ti .btn_in ").attr("data-pay");
			var moneyNum = $("input").val();
			if(moneyNum < 10) {

				layer.open({
					content: '充值10元起',
					skin: 'msg',
					time: 2 //2秒后自动关闭
				});　　　
				return false;
			};
			if(moneyNum > parseInt($(".money_in .money_f").attr("AvailableAmount"))) {

				layer.open({
					content: '只可充值' + $(".money_in .money_f").attr("AvailableAmount"),
					skin: 'msg',
					time: 2 //2秒后自动关闭
				});　
				return false;
			};
			// alert(moneyNum);
			if(moneyNum.length == 0) {

				layer.open({
					content: '请输入金额',
					skin: 'msg',
					time: 2 //2秒后自动关闭
				});　　
				return false;
			};
			//获取订单
			 rechange();
		};
		

	})
})