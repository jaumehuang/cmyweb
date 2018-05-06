define(function() {
	var infinitescroll = function(opts) {
		this.defaults = {
			el: window,
			page: 1,
			pageSize: 5,
			open: true,
			loadListFn: null, // 加载数据方法

		}
		this.options = $.extend({}, this.defaults, opts);
		var self = this;
		//初始化数据
		this.init(self);
	};
	infinitescroll.prototype.init = function(self) {

		$(self.options.el).scroll(function() {

			var type = self.options.el==window ? 1 : 2;
			if(type==1) {

				if($(document).scrollTop() >= $(document).height() - $(window).height()) { //到达底部100px时,加载新内容

					if(self.options.open) {
						//加载
						self.options.loadListFn();
					}
				};
			}else{
				
				var $this = $(this),
					viewH = $(this).height(), //可见高度
					contentH = $(this).get(0).scrollHeight, //内容高度
					scrollTop = $(this).scrollTop(); //滚动高度
				if (contentH - viewH - scrollTop <= 20) { //到达底部100px时,加载新内容
				      
				      if(self.options.open) {
						//加载
						self.options.loadListFn();
					}
				}
			}

		});
	};
	return infinitescroll;
})