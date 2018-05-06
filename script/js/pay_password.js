var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer', 'load', 'keyboard'], function($, commom, layer, load, keyboard) {
		//初始化数据
		$(function() {

			//获取电话
			if(commom.getCookie("Mobile")){
				
				var Mobile = commom.getCookie("Mobile");
			    $(".input_text .phone").val(Mobile);
			}
			Iscode();
			changePassword();
			//初始化函数
		
				new inPassword('#J_KeyBoard1', '.password');
			    new inPassword('#J_KeyBoard2', '.Ispassword');

		})
		//获取验证码 
		function Iscode() {
			//获取验证标志
			var flag = true;
			var $code_btn = $(".register .code_p ");
			$code_btn.on("click", function() {
				//验证手机号码

				var $phone = $(".phone").val();
				var reg = /^1[3|4|5|7|8][0-9]\d{4,8}$/;
				if($phone.length == 0) {
					layer.open({
						content: '手机号码不能为空',
						btn: '确定'
					});
				} else if(!reg.test($phone)) {
					layer.open({
						content: '手机号码格式错误',
						btn: '确定'
					});
				} else {
					//启动加载
					var Load = new load();
					//获取token
					$.ajax({
						url: commom.path.httpurl + "?action=GetToken",
						method: 'get',
						dataType: "json",
						timeout: 1000,
						success: function(ret) {

							Load.hide();
							if(!ret.isError) {
								var token = ret.Msg;
								if(ret.Msg == 'token失效') {

									layer.open({
										content: 'token失效,刷新页面重新获取验证码？',
										btn: ['刷新', '取消'],
										yes: function(index) {
											location.reload();
											layer.close(index);
										}
									});
									return false;
								};
								$.ajax({
									url: commom.path.httpurl + "?action=getidentifyingcode&Token=" + token + "&CheckType=UpdatePwd&Phone=" + $phone,
									method: 'get',
									dataType: "json",
									timeout: 1000,
									success: function(ret) {

										if(!ret.isError) {
											if(flag) {
												countDown(3);
											}
											flag = false;
										} else {
											layer.open({
												content: ret.Msg,
												skin: 'msg',
												time: 2 //2秒后自动关闭
											});
										}
									}
								})
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
			})

			function countDown(minute) {
				var i = minute * 60;
				var time = setInterval(function() {
					if(i == 0) {
						flag = true;
						$code_btn.removeClass("load_time");
						$code_btn.text('重新获取');
						clearInterval(time);
					} else {
						$code_btn.text('有效时间（' + i + '）');
						$code_btn.addClass("load_time");
					}

					i--;
				}, 1000);
			};
		};
		//提交数据
		function changePassword() {

			//验证开始
			$(".btn_in").on("click", function() {
				//输入框不能为空
				var $phone = $(".phone").val();
				var $code = $(".code").val();
				var $Ispassword = $(".Ispassword").val();
				var $password = $(".password").val();

				var param = {
					MemLoginId: commom.getCookie('memlogid'),
					OperateType: 'UpdatePayPwd',
					Values: $password,
					Code: $code
				}
				if($code.length == 0 || $password.length == 0) {
					layer.open({
						content: '验证码、或密码为空',
						skin: 'msg',
						time: 2 //2秒后自动关闭
					});
				} else if($password != $Ispassword) {

					layer.open({
						content: '两次输入密码不一致',
						skin: 'msg',
						time: 2 //2秒后自动关闭
					});

					$(".Ispassword").val('');
					$(".password").val('');
				} else {
					//启动加载
					var Load = new load();
					// alert(JSON.stringify(param));
					$.ajax({
						url: commom.path.httpurl + "?action=OperateMember",
						method: 'post',
						dataType: "json",
						data: param,
						success: function(ret) {
							//关闭加载
							Load.hide();
							if(!ret.isError) {

								layer.open({
									content: '操作成功',
									skin: 'msg',
									time: 2 //2秒后自动关闭
								});

								setTimeout(function() {

									window.history.back()
								}, 2000)

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
			})
		};

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
					$(ele2).val('');
					$keyboard.keyBoard('open');
					// 六位密码输入完毕后执行
					$keyboard.on('done.ydui.keyboard', function(ret) {

						var InPayPwd = ret.password;

						$(ele2).val(ret.password);
						// 关闭键盘
						$keyboard.keyBoard('close');

					})
				});
			}(jQuery, YDUI);
		}
	})
})