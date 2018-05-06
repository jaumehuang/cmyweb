var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer', 'load', 'jquery_form'], function($, commom, layer, load, jquery_form) {

		//初始化数据
		$(function() {
			//处理卡号
			$(".BankAccount").on('keyup', function() {

				formatBankNo(this);

			}).on('keydown', function() {

				formatBankNo(this);
			});
			//上传图片
			$(".add_photo").on("change", '.file-img', function() {

				var $self = $(this);
				UpdatePhoto($self)

			});
			//申请成为渠道商
			$(".bottom_btn").on("click", function() {
		
				Istrader();
			})
		});
		//银行卡号验证
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
		//申请
		function SubmitApply() {
			//判断
			var $name = $(".name").val();
			var $phone = $(".phone").val();
			var $BankAccount = $(".BankAccount").val().replace(/\s+/g, "");
			var $BankName = $(".BankName").val();
			var reg = /^1[3|4|5|7|8][0-9]\d{4,8}$/;
			if($name.length == 0 || $phone.length == 0 || $BankAccount.length == 0 || $BankName.length == 0) {
				layer.open({
					content: '输入框为空',
					skin: 'msg',
					time: 2 //2秒后自动关闭
				});
				return;
			}
			if(!reg.test($phone)) {
				layer.open({
					content: '手机号码格式错误',
					skin: 'msg',
					time: 2 //2秒后自动关闭
				});
				return;
			}
			if($('.add_photo').find(".icon").eq(0).css("display") == "block" || $('.add_photo').find(".icon").eq(1).css("display") == "block") {

				layer.open({
					content: '请上传身份证照片',
					skin: 'msg',
					time: 2 //2秒后自动关闭
				});
				return;
			}
			Istrader();

		};
		//上传图片
		function UpdatePhoto($self) {

			//遍历
			var fileName = $("#imgfile").val();
			if(fileName.indexOf("\\") != -1) fileName = fileName.substring(fileName.lastIndexOf("\\") +
				1, fileName.length);
			console.log($self.parentsUntil().eq(1).find(".form-img"));
			//启动加载
			var Load = new load();
			$self.parentsUntil().eq(1).find(".form-img").ajaxSubmit({

				url: commom.path.httpurl + '?action=fileSave&FileType=baskorder&FileName=' + fileName,
				type: "POST",
				dataType: "json",
				timeout: 800000,
				success: function(ret) {
					Load.hide();
					console.log(ret)
					if(!ret.isError) {

						$self.parentsUntil().eq(1).attr("data-photo", ret.Msg);

						$self.parentsUntil().eq(1).find("img").attr("src", ret.Msg).show().siblings().hide();

					} else {

						layer.open({
							content: ret.Msg,
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
					}
				}

			})
		};
		//判断是否为渠道商
		function Istrader() {

			var param = {
				MemLoginId: commom.getCookie('memlogid')
			}
			//			  alert(param.MemLoginId);
			$.ajax({
				url: commom.path.httpurl + "?action=GetMember",
				method: 'get',
				dataType: "json",
				timeout: 1000,
				data: param,
				success: function(ret) {

					if(!ret.isError) {
						var arryList = JSON.parse(ret.Msg);

						if(arryList[0].IsAgentID == 1 && arryList[0].IsSetTemplates == 0 || arryList[0].IsAgentID == 1 && arryList[0].IsSetTemplates == 1) {

							layer.open({
								content: '你已经申请过,不能再次申请',
								skin: 'msg',
								time: 1 //2秒后自动关闭
							});
							setTimeout(function() {

								api.closeWin();

							}, 1000);
						} else {

							var photoList = [];
							$.each($(".add_photo"), function(index, ele) {

								if($(ele).attr("data-photo") && $(ele).attr("data-photo") != 'undefined') {

									photoList.push($(ele).attr("data-photo"));
								};

							});
							//启动加载
							var Load = new load();
							var param = {
								MemLoginId: commom.getCookie('memlogid'),
								UserName: $(".name").val(),
								Mobile: $(".phone").val(),
								BankName: $(".BankName").val(),
								BankAccount: $(".BankAccount").val(),
								CardImage: photoList.join(","),

							};
							$.ajax({
								url: commom.path.httpurl + "?action=AgentApply",
								method: 'post',
								dataType: "json",
								data: param,
								success: function(ret) {
									//关闭加载 
									Load.hide();
									if(!ret.isError) {

										layer.open({
											content: '申请成功',
											skin: 'msg',
											time: 1 //2秒后自动关闭
										});
										setTimeout(function() {

											window.history.back();

										}, 1000);
									} else {

										layer.open({
											content: ret.Msg,
											skin: 'msg',
											time: 1 //2秒后自动关闭
										});

									}
								}
							});
						};
					}
				}
			});
		};

		//底部分界线
	})
})