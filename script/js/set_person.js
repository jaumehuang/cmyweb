var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer', 'load', 'jquery_form','cookie'], function($, commom, layer, load, jquery_form,cookie) {
			//初始化数据
			$(function() {

				person();
				//修改性别
				$(".sex_item").on("click", function() {

					EditSex();
				})
				//上传图片
				$(".set_user").on("change", '.file-img', function() {

					var $self = $(this);
					UpdatePhoto($self)

				});
				//监听返回键
				listen();

			})
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
					timeout: 1000,
					data: param,
					success: function(ret) {
						//关闭加载
						Load.hide();
						if(!ret.isError) {

							var arryList = JSON.parse(ret.Msg);
							$(".set_person img.user_photo").attr("src", arryList[0].Photo);

							if($(".set_person img.user_photo").attr("src") == '/images/noimage.png') {

								$(".set_person img.user_photo").attr("src", "../image/logo.png");

							};

							$(".set_person .phone").text(arryList[0].MemLoginID);
							$(".input_in .realName").text(arryList[0].RealName);
							$(".input_in .tuiCode").text(arryList[0].Id);

							if(arryList[0].Sex == "1") {
								$(".input_in .sex_txt").text('男');
							} else {
								$(".input_in .sex_txt").text('女');
							};
							//判断是否需要修改昵称
							IsChangeInfo(arryList[0].RealName);
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

			//修改性别;
			function EditSex() {

				var sex = $(".input_in .sex_txt").text();
				var str = '';
				str += '<div class="sex_title">修改性别</div>';
				if(sex == '男') {
					str += '<div class="girl sex clearfix"><input type="radio" name="sex" id="girl"/><i class="icon fl"></i><label for="girl" class="fl">女</label></div>';
					str += '<div class="box sex clearfix"><input type="radio" name="sex" id="box" checked="checked"/><i class="icon fl"></i><label for="box" class="fl">男</label></div>';
				} else {
					str += '<div class="girl sex clearfix"><input type="radio" name="sex" id="girl" checked="checked" /><i class="icon fl"></i><label for="girl" class="fl">女</label></div>';
					str += '<div class="box sex clearfix"><input type="radio" name="sex" id="box"/><i class="icon fl"></i><label for="box" class="fl">男</label></div>';

				};
				layer.open({
					content: str,
				});
				//确定按钮
				$(document).on("click", ".layui-m-layercont .sex", function(e) {

					e.stopPropagation();
					var $self = $(this);
					var $index = $self.index() - 1;
					$(".sex_item .sex_txt").text($self.find("label").text());

					var param = {
						MemLoginId: commom.getCookie('memlogid'),
						OperateType: 'UpdateSex',
						Values: $index,
					};
					$.ajax({
						url: commom.path.httpurl + "?action=OperateMember",
						method: 'post',
						dataType: "json",
						timeout: 1000,
						data: param,
						success: function(ret) {

							if(!ret.isError) {

								$self.parentsUntil().eq(4).remove();
							}
						}
					})
					return false;
				})
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

					url: commom.path.httpurl + '?action=fileSave&FileType=photo&FileName=' + fileName,
					type: "POST",
					dataType: "json",
					timeout: 800000,
					success: function(ret) {
						Load.hide();
						console.log(ret)
						if(!ret.isError) {

							$(".set_person img.user_photo").attr("src", ret.Msg);
							SibimtPhoto(ret.Msg);
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

				})
			};
			//提交上传路径
			function SibimtPhoto(Url) {

				var param = {
					MemLoginId: commom.getCookie('memlogid'),
					OperateType: 'UpdatePhoto',
					Values: Url,
				}
				$.ajax({
					url: commom.path.httpurl + "?action=OperateMember",
					method: 'post',
					dataType: "json",
					timeout: 1000,
					data: param,
					success: function(ret) {

						if(!ret.isError) {

							layer.open({
								content: '头像上传成功',
								skin: 'msg',
								time: 2 //2秒后自动关闭
							});

						} else {

							layer.open({
								content: ret.Msg,
								skin: 'msg',
								time: 2 //2秒后自动关闭
							});
						}
					}
				});
			};
			//判断是否需要修改资料
			function IsChangeInfo(name) {

				if(name == '游客') {

					//设置头像和昵称的判断,设置默认配置
					var SetObj = {
						IsName: false

					};
					//保存配置数据
					commom.localSetItem('IsName', false);
					layer.open({
						content: '请修改昵称',
						skin: 'msg',
						time: 2 //2秒后自动关闭
					});
				} else {

					//保存配置数据
					commom.localSetItem('IsName', true);
				}
		};
		//监听物理键返回,微信端;
		function listen() {

			history = $.cookie("history");

			function pushHistory() {
				var state = {
					title: "title",
					url: "#"
				};
				window.history.pushState(state, "title", "#");
			}

			pushHistory();
			window.addEventListener("popstate", function(e) {

				if(commom.localGetItem("IsName")) {
					
					window.history.go(-1);
					
				} else {

					layer.open({
						content: '请修改昵称',
						skin: 'msg',
						time: 2 //2秒后自动关闭
					});
				}
			})
		}
	})
})