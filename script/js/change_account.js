var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer', 'load'], function($, commom, layer, load) {
		//初始化数据
		$(function() {

			$(".chenge_e .icon-chuyidong").on("click", function() {

				$("input[type=text]").val('');

			});
			//提交修改数据
			$(".btn_in").on("click", function() {

				if($("input[type=text]").val().length > 0) {

					var reg = /^.{2,10}$/;
					var str = $("input[type=text]").val() + "";
					if(!reg.test(str)) {

						layer.open({
							content: '2-10个字符，可由中英文、数字组成',
							btn: '我知道了'
						});

					} else {
						//启动加载
						var Load = new load();
						var param = {
							
							MemLoginId: commom.getCookie('memlogid'),
							OperateType: 'UpdateRealName',
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
								Load.hide();
								if(!ret.isError) {
									//保存配置数据
					                commom.localSetItem('IsName', true);
				                    window.history.back();
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
			});
		})
	})
})