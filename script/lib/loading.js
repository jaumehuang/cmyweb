define(['jquery'], function($) {

	var Load = function(opts) {
		//默认配置
		this.defaults = {
				icon: '../image/loading.png',
				title: '加载中',
				open:true
			},
			this.options = $.extend({}, this.defaults, opts);
		    var self = this;
		   this.show(self);
	};
	Load.prototype.show = function(self) {
	
			var str = '';
			str += '<div class="loadTime" style="">';
			str += '<img src="' + self.options.icon + '" />';
			str += '<div class="text" >' + self.options.title + '</div>';
			str += '</div>';
			$("body").append(str);
	};
	Load.prototype.hide = function() {

		$("body").find(".loadTime").remove();
	};
	return Load;
})