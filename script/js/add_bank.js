var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer', 'load', 'keyboard'], function($, commom, layer, load, keyboard) {
		//初始化数据
		$(function() {

			//处理卡号
			$(".bankAccount").on('keyup', function() {

				formatBankNo(this);

			}).on('keydown', function() {

				formatBankNo(this);
			});
			//提交数据
			$(".btn_in").on("click", function() {

				addBank();
			})

			MatchingList();
		});

		function formatBankNo(BankNo) {
			if(BankNo.value == "") return;
			var account = new String(BankNo.value);
			account = account.substring(0, 22); /*帐号的总数, 包括空格在内 */
			if(account.match(".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}") == null) {
				/* 对照格式 */
				if(account.match(".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" + ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" +
						".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" + ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}") == null) {
					var accountNumeric = accountChar = "",
						i;
					for(i = 0; i < account.length; i++) {
						accountChar = account.substr(i, 1);
						if(!isNaN(accountChar) && (accountChar != " ")) accountNumeric = accountNumeric + accountChar;
					}
					account = "";
					for(i = 0; i < accountNumeric.length; i++) { /* 可将以下空格改为-,效果也不错 */
						if(i == 4) account = account + " "; /* 帐号第四位数后加空格 */
						if(i == 8) account = account + " "; /* 帐号第八位数后加空格 */
						if(i == 12) account = account + " "; /* 帐号第十二位后数后加空格 */
						account = account + accountNumeric.substr(i, 1)
					}
				}
			} else {
				account = " " + account.substring(1, 5) + " " + account.substring(6, 10) + " " + account.substring(14, 18) + "-" + account.substring(18, 25);
			}
			if(account != BankNo.value) BankNo.value = account;
		};

		function addBank() {

			var BankNumber = $(".form_li .bankAccount").val().replace(/\s+/g, "");
			if(commom.GetQueryString("str")) {

				var param = {
					MemLoginId: commom.getCookie('memlogid'),
					BankGuid: commom.GetQueryString("str"),
					BankName: $(".form_li .myName").val(),
					BankAccountName: $(".form_li .bankName").val(),
					BankAccountNumber: BankNumber
				}
			} else {

				var param = {
					MemLoginId: commom.getCookie('memlogid'),
					BankName: $(".form_li .myName").val(),
					BankAccountName: $(".form_li .bankName").val(),
					BankAccountNumber: BankNumber

				}
			}

			if($(".form_li .myName").val().length == 0 || $(".form_li .myName").val().lenght == 0 || $(".form_li .bankAccount").val().lenght == 0) {
				layer.open({
					content: '输入框为空',
					skin: 'msg',
					time: 2 //2秒后自动关闭
				});
			} else if(BankNumber.length < 16 || BankNumber.length > 19) {
				layer.open({
					content: '银行卡号长度必须在16到19之间',
					skin: 'msg',
					time: 2 //2秒后自动关闭
				});
			} else {
				//启动加载
				var Load = new load();

				$.ajax({
					url: commom.path.httpurl + "?action=EditMemberBank",
					method: 'post',
					dataType: "json",
					timeout: 1000,
					data: param,
					success: function(ret) {

						if(!ret.isError) {

							window.history.back();

						} else {

							layer.open({
								content: '银行卡号长度必须在16到19之间',
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

		};
		//匹配银行卡
		function MatchingList() {

			if(commom.GetQueryString("str")) {
				//匹配银行卡
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
							for(var i = 0; i < arryList.length; i++) {

								if(commom.GetQueryString("str") == arryList[i].Guid) {

									$(".form_li .myName").val(arryList[i].BankName);
									$(".form_li .bankName").val(arryList[i].BankAccountName);
									$(".form_li .bankAccount").val(arryList[i].BankAccountNumber);
								}
							}
						}
					}
				});
			}
		}
	})
})