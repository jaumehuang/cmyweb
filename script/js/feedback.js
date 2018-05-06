var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer', 'load'], function($, commom, layer, load) {
		//初始化数据
		$(function() {
			
			$(".btn_in").on("click",function(){
				 
				 feedback();
			})
		})

		function feedback() {
			var $textarea = $("textarea").eq(0).val();
			var $phone = $("textarea").eq(1).val();
			if($textarea.length == 0 || $phone.length == 0) {

				//提示
				layer.open({
					content: '输入框不能为空！',
					skin: 'msg',
					time: 2 //2秒后自动关闭
				});
				return false;
			}
			
			var str = "问题描述：" + $textarea + ';' + '联系方式：' + $phone;
			var param = {
				MemLoginId: $api.getStorage('userData').Phone,
				MeaageType: '留言',
				Title: '意见反馈',
				Content: str

			}
			$.ajax({
				url: commom.path.httpurl + "?action=GetMessageBoard",
				method: 'post',
				dataType: "json",
				timeout: 1000,
				data: param,
				success: function(ret) {
				    //启动加载
				    var Load =new load()
					if(!ret.isError) {
						//提示
						layer.open({
							content: '问题提交成功，我们会及时给你答复！',
							skin: 'msg',
							time: 3 //2秒后自动关闭
						});
					    setTimeout(function(){
					    	
					    	    window.history.back();
					    	    
					    },3000)
					} else {
						//提示
						layer.open({
							content:ret.Msg,
							skin: 'msg',
							time: 3 //2秒后自动关闭
						});
					}
				}
			})
		}
	})
})