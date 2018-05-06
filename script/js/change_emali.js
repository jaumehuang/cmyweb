var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer', 'load'], function($, commom, layer, load) {
		//初始化数据
		$(function() {

			$(".chenge_e .icon-chuyidong").on("click", function() {

				$("input[type=text]").val('');
			});

			$(".btn_in").on("click", function() {

				if($("input[type=text]").val().length > 0) {

					var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
					var str = $("input[type=text]").val() + "";
					if(!reg.test(str)) {
						layer.open({
							content: '请输入正确的邮箱地址',
							btn: '我知道了'
						});
					} else {
						//启动加载
						var Load = new load();
						var param = {
							MemLoginId: commom.getCookie('memlogid'),
							OperateType: 'UpdateEmail',
							Values: $("input[type=text]").val(),
						}
						$.ajax({
							url: commom.path.httpurl + "?action=OperateMember",
							method: 'post',
							dataType: "json",
							timeout: 1000,
							data: param,
							success: function(ret) {
								//关闭加载
								Load.hide()
								if(!ret.isError) {
									
									window.history.back();
									
								} else {

									layer.open({
										content: ret.Msg,
										btn: '我知道了'
									});
								}
							}
						})
					}
				} else {
					layer.open({
						content: '请在输入框输入内容',
						btn: '我知道了'
					});
				}
			})
		});
	})
})