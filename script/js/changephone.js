var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer', 'load'], function($, commom, layer, load) {
		//初始化数据
		$(function() {

			Iscode();
			//提交数据
			changePhone();
		});
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
					api.showProgress({
						title: '',
						text: '加载中,请稍后...',
						modal: false
					});
					//获取token
					$.ajax({
						url: commom.path.httpurl + "?action=GetToken",
						method: 'get',
						dataType: "json",
						timeout: 1000,
						success: function(ret) {
							api.hideProgress();

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
									url: commom.path.httpurl + "?action=getidentifyingcode&Token=" + token + "&CheckType=UpdateMobile&Phone=" + $phone + "&MemLoginId=" + $api.getStorage('userData').Phone,
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
					});
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

		}
		//数据提交
		function changePhone() {

			//验证开始
			$(".btn_in").on("click", function() {
				//输入框不能为空
				var $phone = $(".phone").val();
				var $code = $(".isCode").val();
				var param = {
					MemLoginId: commom.getCookie('memlogid'),
					OperateType: 'UpdateMobile',
					Values: $phone,
					Code: $code
				};

				if($phone.length == 0 || $code.length == 0) {
					layer.open({
						content: '手机号、验证码为空',
						btn: '确定'
					});
				} else {
					//启动加载
					var Load = new load();

					$.ajax({
						url: commom.path.httpurl + "?action=OperateMember",
						method: 'post',
						dataType: "json",
						timeout: 1000,
						data: param,
						success: function(ret) {
							//关闭加载
							if(!ret.isError) {
								layer.open({
									content: '修改成功',
									btn: '确定'
								});
								window.history.back();
							} else {
								layer.open({
									content: ret.Msg,
									btn: '确定'
								});
							}
						}
					})
				}
			})
		}
	})
})