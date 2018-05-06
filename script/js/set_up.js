var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer', 'load','cookie'], function($, commom, layer, load) {
		//初始化数据
		$(function() {
			
			//t退出登录
			$(".outLogin").on("click",function(){
				
				OutLogin()
			})
		})
		//退出登录
		function OutLogin() {

			layer.open({
				content: '您确定要退出登录？',
				btn: ['确定', '取消'],
				yes: function(index) {
					
					layer.close(index);
					commom.delCookie("memlogid",function(){
						
						 window.location.href="login.html"
					})
				}
			})
		}
	})
})