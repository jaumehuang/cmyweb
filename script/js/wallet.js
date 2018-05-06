var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer', 'load', 'lazyload'], function($, commom, layer, load, lazyload) {
		//初始化数据
		$(function() {
			//获取钱包信息
			person();
			//充值方式

		});

		function Aipay() {
			var str = '';
			str += '<div class="pay_title">提现方式</div>';
			str += '<ul class="pay_list">';

			// str+='<li class="list_li clearfix" onclick="Withdrawals(\''+'Withdrawals0'+ '\')"><input type="radio" id="weixin" name="pay"/><i class="icon fl"></i><label for="weixin" class="fl">微信</label></li>';
			str += '<li class="list_li clearfix" data-url="Withdrawals1" ><input type="radio" id="alipay" name="pay"/><i class="icon fl"></i><label for="alipay" class="fl">支付宝</label></li>';
			str += '<li class="list_li clearfix" data-url="Withdrawals2" ><input type="radio" id="bank" name="pay"/><i class="icon fl"></i><label for="bank" class="fl">银行卡</label></li>';
			str += '</ul>';

			layer.open({
				content: str,
				btn: '取消'
			});
			//选择充值方式
			$("body").on("click", ".pay_list .list_li", function() {

				var Url = $(this).attr("data-url");
				Withdrawals(Url);
			})
		};

		function Withdrawals(Url) {

			var time = setTimeout(function() {
				$(".layui-m-layer").remove();
				clearTimeout(time);
				
			   window.location.href=Url+'.html'

			}, 500)

		};
		//个人信息
		function person() {

			var Load = new load();

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
						$(".wallet .num").text(arryList[0].AdvancePayment);
						//保存电话号码
						//commom.setItem([{"name":"Mobile","value":arryList[0].Mobile}]);
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
			});
		};
	})
})