var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer', 'load', 'jquery_form', 'raty', 'labs'], function($, commom, layer, load, jquery_form, raty, labs) {

		//星级
		$.fn.raty.defaults.path = '../image';
		$('#readOnly1').raty({
			score: function() {
				return $(this).attr('data-score')
			}
		});
		//初始化数据
		$(function() {

			var guidArr = (commom.GetQueryString("str")).split("|");
			goodProduct(guidArr[0]);
            console.log(guidArr)
			//上传图片
			$(".file-img").on("change", function() {

				var $self = $(this);
				UpdatePhoto($self);

			});
			$(".btn_in").on("click",function(){
				
				 Submit();
			})
		});

		function goodProduct(guid) {

			//启动加载
			var Load = new load();
			$.ajax({
				url: commom.path.httpurl + "?action=GetOrderProduct&OrderInfoProductGuid=" + guid,
				method: 'get',
				dataType: "json",
				timeout: 1000,
				success: function(ret) {
					Load.hide();
					if(!ret.isError) {

						var arryList = JSON.parse(ret.Msg);
						var str = '';
						str += '<a href="#" class="fl show_img">';
						str += '<img src="' + arryList[0].OriginalImge + '" onclick="open_details1(\'' + arryList[0].ProductGuid + '\')" data-guid="' + arryList[0].ProductGuid + '"/></a>';
						str += '<div class="list_mian fl">';
						str += '<div class="title">' + arryList[0].Name + '</div>';
						str += '<div class="price clearfix">';
						str += '<div class="fl"><span>' + arryList[0].Attributes + '</span></div>';
						str += '<div class="fr">X' + arryList[0].BuyNumber + '</div></div>';
						str += '<div class="price">';
						str += '实付漫豆：<span>' + arryList[0].MarketPrice + '</span></div>';
						str += '</div></div>';
						$(".list_li").append(str);
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

		function UpdatePhoto($self) {

			//遍历
			var fileName = $("#imgfile").val();

			if(fileName.indexOf("\\") != -1) fileName = fileName.substring(fileName.lastIndexOf("\\") +
				1, fileName.length);
			console.log($self.parentsUntil())
			console.log($self.parentsUntil().eq(2));
			//启动加载
			var Load = new load();
			$self.parentsUntil().eq(2).find(".form-img").ajaxSubmit({

				url: commom.path.httpurl + '?action=fileSave&FileType=photo&FileName=' + fileName,
				type: "POST",
				dataType: "json",
				timeout: 800000,
				success: function(ret) {
					Load.hide();

					if(!ret.isError) {
						var str = '';
						str += '<div class="show_li fl" data-photo="' + ret.Msg + '" onclick="DeletePhoto()">';
						str += '<img src="' + ret.Msg + '" />';
						str += '<i class="delete_icon"></i>';
						str += '</div>';
						$(".show_photo_list .null_photo ").before(str);
						var i = $(".null_photo .photo_p span").text();
						$(".null_photo .photo_p span").text(parseInt(i) + 1);

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
		//提交品论
		function Submit() {

			var photoList = [];
			if($("textarea").val().length == 0) {

				layer.open({
					content: '请在输入框填写文字',
					skin: 'msg',
					time: 2 //2秒后自动关闭
				});
				return false;
			}
			$.each($(".show_li"), function(index, ele) {

				if($(ele).attr("data-photo") && $(ele).attr("data-photo") != 'undefined') {

					photoList.push($(ele).attr("data-photo"));
				}

			})

			if(photoList.length > 0 || photoList.length == 0) {
				//  var photoUrlList =  UpdatePhoto(photoList);

				var photoUrlList = [];
				var guidArr = (commom.GetQueryString("str")).split("|");
				var param = {
					MemLoginId: commom.getCookie('memlogid'),
					ProductGuid: $(".list_li img ").attr("data-guid"),
					OrderNumber: guidArr[1],
					ProductName: $(".list_li .title").text(),
					Level: $(".describe #readOnly1 input").val(),
//					Title: '',
					Content: $("textarea").val(),
					ImagePath: photoList.join(",")
				}
				UpdateComment(param)
			}
		};
		//评论内容上传
		function UpdateComment(param) {
            console.log(param)
			//启动加载
			var Load = new load();
			$.ajax({
				url: commom.path.httpurl + "?action=AddProductBaskOrder",
				method: 'get',
				dataType: "json",
				timeout: 1000,
				data:param,
				success: function(ret) {
			
					Load.hide();
					if(!ret.isError) {

						layer.open({
							content: '评论上传成功',
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
						setTimeout(function() {

							window.history.back();

						}, 2000);
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
	})
})