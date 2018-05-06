var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer', 'load', 'jquery_form'], function($, commom, layer, load, jquery_form) {

		//初始化加载
		$(function() {

			//上传图片
			$(".form-img").on("change", '.file-img', function() {

				var $self = $(this);
				UploadImg($self);

			});
			//提叫数据
		    $(".bottom_btn").on("click",function(){
		    	   
		    	      MySubmit();
		     })
		});
		//图片上传
		function UploadImg($self) {

			var fileName = $("#imgfile").val();
			if(fileName.indexOf("\\") != -1) fileName = fileName.substring(fileName.lastIndexOf("\\") +
				1, fileName.length);
			//启动加载
			var Load = new load();
			$self.parentsUntil().eq(1).find(".form-img").ajaxSubmit({  

				url: commom.path.httpurl + '?action=fileSave&FileType=product&FileName=' + fileName,
				type: "POST",
				dataType: "json",
				timeout: 800000,
				success: function(ret) {
                
					Load.hide();
					if(!ret.isError) {

						$self.parentsUntil().eq(1).find('img').show();
						$self.parentsUntil().eq(1).find('i').show();
						$self.parentsUntil().eq(1).find('span').hide();
						$self.parentsUntil().eq(1).find('img').attr("src", ret.Msg);
						$self.parentsUntil().eq(1).attr("date-path", ret.Msg);
					} else {

						layer.open({
							content: ret.Msg,
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
					}
				},
				  error: function(msg) {  

					layer.open({
						content: '网络出错',
						skin: 'msg',
						time: 2 //2秒后自动关闭
					});
				} 
			}); 

		};
		// Submit()
		function MySubmit() {

			var pathUrl = [];
			$(".showImg_List .showImg_li").each(function(index, ele) {

				if($(ele).attr("date-path") && $(ele).attr("date-path") != 'undefined') {

					pathUrl.push($(ele).attr("date-path"));
				}
			})

			if(pathUrl.length < 10) {

				layer.open({
					content: '至少上传10张图片',
					skin: 'msg',
					time: 2 //2秒后自动关闭
				});

			} else {
				var param = {

					ProductGuid: commom.getCookie('memlogid'),
					Images: pathUrl.join(','),
					Types: 'detail',
				}
				// alert(JSON.stringify(param));
				//启动加载
				var Load=new load();
				$.ajax({
					url: commom.path.httpurl + "?action=InsertProductImage",
					method: 'post',
					dataType: "json",
					timeout: 1000,
					data: param,
					success: function(ret) {
                        //关闭加载
                        Load.hide();
						if(!ret.isError) {

							layer.open({
								content: '提交成功，稍后会有工作人员联系你',
								skin: 'msg',
								time: 2 //2秒后自动关闭
							});
							setTimeout(function() {
								//退回首页
								window.history.go(-3);
							}, 1000);

						} else {

							layer.open({
								
								content:ret.Msg,
								skin: 'msg',
								time: 2 //2秒后自动关闭
							});
						}
					}
				})
			}

		}
	})
})