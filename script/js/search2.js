var require = require(['main'], function(main) {

	require(['jquery', 'commom'], function($, commom) {
		//初始化
		$(function() {
			//获取焦点
			$(".search_list .search_hot input").focus();
			var str = commom.localGetItem('historyRecord2');
			historyList(str);
			//点击确定
			$(".search_hot input").on('keypress',function(){
				 
				 if (event.keyCode == 13) {
				      getKeywords();
			      };
			});
			//清除历史记录
			$(".hot_title .clearHostory").on("click",function(){
				 
				 DeleteHostry();
			})
			//点击历史文字
			ClickHostory();

		});
		//历史记录列表
		function historyList(str) {
             
			if(str && str != 'undefined') {
                 var str2='';
				if(str.indexOf("|") > 0) {

					var ArrList = str.split("|");
					for(var i = 0; i < ArrList.length; i++) {

						str2 += '<li class="list_li" >' + ArrList[i] + '</li>';
					}
				} else {
					str2 += '<li class="list_li" >' + str + '</li>';
				};

				$(".hot_list").append(str2);
			}

		};
		//点击搜索记录
		function ClickHostory() {

			$(".hot_list").on("click",'.list_li',function(){
				
				  commom.OpenView('search_list2', $(this).text());
			
			})
		};
		
		//清除历史记录
		function DeleteHostry() {

			$(".hot_list .list_li").remove();

			if (commom.localGetItem('historyRecord2')) {

				commom.localRemoveItem('historyRecord2');

			};
		};
		//关键字
		function getKeywords() {
			var $Keywords = $(".search_list .search_hot input").val();

			if (commom.localGetItem('historyRecord2')) {
				var str = commom.localGetItem('historyRecord2');

				str = str + '|' + $Keywords;
				commom.localSetItem('historyRecord2',str);

			} else {

				commom.localSetItem('historyRecord2',$Keywords);
			};

			commom.OpenView('search_list2', $Keywords);

		};
		
	});
})