var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer'], function($, commom,layer) {
		
		//初始化数据
		$(function() {
			
			
			$('.btn_in').on('click',function(){
				getPhone(); 
			})
		})
		function getPhone() {

			var phone = $(".phone").val();
			if (phone.length == 0) {

				layer.open({

					content: '请输入手机号码',
					skin: 'msg',
					time: 2 //2秒后自动关闭
				});
				return false;
			};
			commom.OpenView('supply_info',phone)
		}
	})
})