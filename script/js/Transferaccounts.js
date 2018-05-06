var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer', 'load', 'keyboard'], function($, commom, layer, load) {

		var rate = 0; //漫豆
		var isAccount = false; //是否存在用户
		var rechange = true; //转账标记
		var AccountId = ''; //转账用户ID
		//初始化数据
		$(function() {

			person();
			new inPassword('#J_KeyBoard1', '.btn-very-large');
			//转换漫豆
			$(".re-money").keyup(function() {

				var total = $(".re-money").val();
				if(total.length == 0) {

					$(".change-num").text(0);

					return false;
				}
				$(".change-num").text(total);
			});
			//检测是否存在用户
			$('.phone').change(function() {

				var reg = /^1[3|4|5|7|8][0-9]\d{4,8}$/;
				var phone = $('.phone').val();
				if(!reg.test(phone)) {

					layer.open({
						content: '手机格式错误',
						btn: '我知道了'
					});
					return false;
				};
				//启动加载
				var Load = new load();
				var param = {

					Mobile: $(this).val()
				}

				$.ajax({
					url: commom.path.httpurl + "?action=GetMemberByMobile",
					method: 'get',
					dataType: "json",
					timeout: 500,
					data: param,
					async: false,
					success: function(ret) {

						console.log(ret);
						//关闭加载
						Load.hide();
						if(!ret.isError) {

							isAccount = true;
							var arr = commom.Transformation(ret.Msg)
							AccountId = arr[0].MemLoginID;
						} else {
							isAccount = true;
							//信息框
							layer.open({
								content: '用户不存在，请仔细确认',
								btn: '我知道了'
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
			});

		});
		//提交数据
		function SubmitBtn(PayPwd) {

			//启动加载
			var Load = new load();
			var param = {

				MemLoginId: commom.getCookie('memlogid'),
				ToMemLoginId: AccountId,
				PayPwd: PayPwd,
				TransferMoney: $(".re-money").val()
			};
             console.log(param);
			$.ajax({
				url: commom.path.httpurl + "?action=GetMemberTransfer",
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

						rechange = false;
                        layer.open({
							content: '转账成功',
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
						setTimeout(function(){
							
							window.history.back();
							
						},2000);
						　
					} else {
						isAccount = true;
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
			});
		}
		//个人信息
		function person() {

			//启动加载
			var Load = new load();
			var param = {

				MemLoginId: commom.getCookie('memlogid')
			}

			$.ajax({
				url: commom.path.httpurl + "?action=GetMember",
				method: 'get',
				dataType: "json",
				timeout: 500,
				data: param,
				async: false,
				success: function(ret) {
					//关闭加载
					Load.hide();
					if(!ret.isError) {

						var arr = commom.Transformation(ret.Msg);
						$(".info-img").attr("src", arr[0].Photo);
						$(".person-photo .name").text(arr[0].RealName);
						$(".AdvancePayment").text(arr[0].AdvancePayment);
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
		//转换漫豆
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

						rate = ret.Msg

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
		//支付密码验证
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
					
	                var num= $(".re-money").val();
	                var phone=$(".phone").val();
	                if(num.length==0||phone.length==0){
	                	   
	                	   layer.open({
							content: '输入框为空',
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});　
					return false;
	                };
	                if(!isAccount){
	                	   
	                	   layer.open({
								content: '用户不存在，请仔细确认',
								btn: '我知道了'
							});
					  return false;
	                }
					$keyboard.keyBoard('open');
					// 六位密码输入完毕后执行
					$keyboard.on('done.ydui.keyboard', function(ret) {

						var InPayPwd = ret.password;

						SubmitBtn(InPayPwd);
						// 关闭键盘
						$keyboard.keyBoard('close');

					})
				});
			}(jQuery, YDUI);
		};

	})
})