var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer', 'load', 'cookie'], function($, commom, layer, load) {

		//解决输入框影响固定定位的样式
		var h = document.body.scrollHeight;
		$(window).resize(function() {

			if($(window).height() < h) {
				$("footer").hide();
			}
			if($(window).height() >= h) {
				$("footer").show();
			}
		});
		//初始化
		$(function() {

			//防止虚拟键盘遮挡按钮
			$('input').on('focus', function() {
				//			   alert("ss")
				$(window).resize();
			}).on('blur', function() {
				$(window).resize();
			});
			login();

		});

		function login() {

			$(".btn_in").on("click", function() {
				//验证
				var $phone = $(".phone").val();
				var $password = $(".password").val();
				var reg = /^1[3|4|5|7|8][0-9]\d{4,8}$/;
				var param = {
					Phone: $phone,
					Pwd: $password
				}
				// alert(JSON.stringify(param));
				if(($phone.length == 0) || ($password.length == 0)) {

					layer.open({
						content: '手机号或密码为空',
						skin: 'msg',
						time: 2 //2秒后自动关闭
					});
				} else if(!reg.test($phone)) {
					layer.open({
						content: '手机号格式错误',
						skin: 'msg',
						time: 2 //2秒后自动关闭
					});
				} else if(!(/^.{6,20}$/).test($password)) {
					layer.open({
						content: '6~20位密码',
						skin: 'msg',
						time: 2 //2秒后自动关闭
					});
				} else {
					//启动加载
					var Load = new load();
					$.ajax({
						url: commom.path.httpurl + "?action=memberlogin",
						method: 'post',
						dataType: "json",
						data: param,
						success: function(ret) {
							//关闭加载
							Load.hide();

							if(!ret.isError) {

								var list = JSON.parse(ret.Msg);
								//								alert(JSON.stringify(list));
								//本地保存数据
								commom.setCookie('memlogid', list.MemLoginId);
								//								alert(commom.getCookie('memlogid'))
								window.history.back();

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
		};
		//			底部分界线
	})
})