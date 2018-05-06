var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer', 'load', 'keyboard'], function($, commom, layer, load, keyboard) {
		//初始化数据
		$(function() {
			//可以提现
			LimitMoney();
			//银行卡
			bankList()
		});

		function LimitMoney() {

			//初始化可提现额度
			var param = {

				MemLoginId: commom.getCookie('memlogid'),
				Type: 'Withdrawal'
			};
			//启动加载
			var Load = new load();
			$.ajax({
				url: commom.path.httpurl + "?action=LimitRechargeAndWithdrawal",
				method: 'get',
				dataType: "json",
				timeout: 1000,
				data: param,
				success: function(ret) {
					//关闭加载
					Load.hide();

					if(!ret.isError) {

						var arryList = JSON.parse(ret.Msg);
						$(".Withdrawals_limit .Limit").text("每日可提现额度" + arryList.AmountDaily);
						$(".num_pay").attr("AvailableAmount", arryList.AvailableAmount);
						payPassword();
						GetQuota();
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
		//获取金额提现额度
		function GetQuota() {

			var param = {

				MemLoginId: commom.getCookie('memlogid')
			};
			$.ajax({
				url: commom.path.httpurl + "?action=GetMemberAdvancePayment",
				method: 'get',
				dataType: "json",
				timeout: 10000,
				data: param,
				success: function(ret) {

					if(!ret.isError) {

						$(".num_pay").attr('placeholder', "额度" + ret.Msg + '元,提现30元起');
						$(".num_pay").attr("data-money", ret.Msg);
					}
				}

			});

		};
		//验证支付密码
		function payPassword() {

			! function($, ydui) {

				var dialog = ydui.dialog;

				var $keyboard = $('#J_KeyBoard');

				// 初始化参数
				$keyboard.keyBoard({
					disorder: false, // 是否打乱数字顺序
					title: '车漫游安全键盘' // 显示标题
				});

				// 打开键盘
				$('#J_OpenKeyBoard').on('click', function() {

					if($(".item_li .num_pay").val() > parseFloat($(".item_li .num_pay").attr("data-money"))) {

						layer.open({
							content: '超过可提现额度',
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
						return false;
					};
					if($(".item_li .num_pay").val() > parseInt($(".num_pay").attr("AvailableAmount"))) {

						api.toast({
							msg: '可提现额度' + $(".num_pay").attr("AvailableAmount"),
							duration: 2000,
							location: 'bottom'
						});
						return false;
					};
					if($(".item_li .realName").val().length == 0 || $(".item_li .num_pay").val().lenght == 0 || $(".item_li .pay_mode").text().length == 0 || $(".pay_account").val().length == 0) {
						layer.open({
							content: '输入框为空',
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
						return false;
					};
					if($(".item_li .num_pay").val() < 30) {

						layer.open({
							content: '提现金额30元起',
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
						return false;
					};
					$keyboard.keyBoard('open');
				});

				// 六位密码输入完毕后执行
				$keyboard.on('done.ydui.keyboard', function(ret) {

					console.log('输入的密码是：' + ret.password);
					var InPayPwd = ret.password;

					// 弹出请求中提示框
					dialog.loading.open('验证支付密码');
					//获取支付密码
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

							if(!ret.isError) {

								var arryList = JSON.parse(ret.Msg);

								if(arryList[0].PayPwd == '' || arryList[0].PayPwd == 'undefined' || arryList[0].PayPwd.length == 0) {

									//询问框
									layer.open({

										content: '请完成支付密码的设置',
										btn: ['确定', '取消'],
										yes: function(index) {

											open_win('pay_password');

											layer.close(index);
										}
									});

								} else {

									CheckPassword(InPayPwd)
									// dialog.loading.close();
								}
							}
						}
					})

				});
				//用户提现
				function Withdrawals() {
					var param = {
						
						MemLoginId: commom.getCookie('memlogid'),
						TrueName: $(".item_li .realName").val(),
						OperateMoney: $(".item_li .num_pay").val(),
						PaymentName: $(".item_li .pay_mode").val(),
						BankName: $(".item_li .bankName").val(),
						Account: $(".pay_account").val()
					}

					$.ajax({
						url: commom.path.httpurl + "?action=MemberWithdraw",
						method: 'post',
						dataType: "json",
						timeout: 1000,
						data: param,
						success: function(ret) {

							dialog.loading.close();
							if(!ret.isError) {

								api.sendEvent({
									name: 'recharge',
								});
								layer.open({
									content: '数据提交成功',
									skin: 'msg',
									time: 2 //2秒后自动关闭
								});
								$keyboard.keyBoard('close');
								setTimeout(function() {

									api.closeWin();

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

				//验证密码
				//用户验证密码
				function CheckPassword(InPayPwd) {

					//获取支付密码
					var param = {

						MemLoginId: commom.getCookie('memlogid'),
						PayPwd: InPayPwd
					}
					$.ajax({
						url: commom.path.httpurl + "?action=CheckPayPwd",
						method: 'post',
						dataType: "json",
						timeout: 1000,
						data: param,
						success: function(ret) {

							dialog.loading.close();
							if(ret.Msg == '正确') {

								Withdrawals();

							} else {

								$keyboard.keyBoard('error', '输入密码有误，请重新输入。');
							}
						}
					})

				}

			}(jQuery, YDUI);
		};

		function bankList() {

			var param = {
				MemLoginId: commom.getCookie('memlogid')
			}
			//  alert(param.MemLoginId);
			$.ajax({
				url: commom.path.httpurl + "?action=GetMemberBank",
				method: 'get',
				dataType: "json",
				timeout: 1000,
				data: param,
				success: function(ret) {

					if(!ret.isError) {

						var arryList = JSON.parse(ret.Msg);
						var str = '';
						var bankList = [];

						for(var i = 0; i < arryList.length; i++) {

							str += '<option value="' + i + '">' + arryList[i].BankAccountName + '</option>';
							bankList.push(arryList[i]);
						}
						str += '<option value="添加银行卡">添加银行卡</option>'
						$(".pay_mode").append(str);

						$(document).on("change", '.back_list .pay_mode ', function(e) {

							var $index = $(this).val();

							$(".item_li .realName").val(bankList[$index].BankName);
							$(".item_li .bankName").val(bankList[$index].BankAccountName);
							$(".pay_account").val(bankList[$index].BankAccountNumber)

							return false;

						});
						//获取可提现额度
						GetQuota();
					} else {
						var str = '';
						str += '<option value="添加银行卡">添加银行卡</option>'
						$(".pay_mode").append(str);
						layer.open({
							content: ret.Msg,
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});

						$("select").on("change", function() {

							selectBank();
						})
					}
				}
			})
		};
		//选中事件
		function selectBank() {

			if($(".pay_mode").val() == '添加银行卡') {

				window.location.href = "add_bank.html"
				return false;
			};

		}
	})
})