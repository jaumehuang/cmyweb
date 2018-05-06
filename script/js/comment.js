var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer', 'load','infinitescroll','raty','labs'], function($, commom, layer, load,infinitescroll,raty,labs) {
		//初始化
		$(function() {

			var guid = commom.GetQueryString('str');

			GetProductBaskOrder(guid, 1);
			//页数
			var page = 1;
			//加载数据
			var InfiniteScroll = new infinitescroll({
				loadListFn: function() {
					page = $(".comment_list .ul_list").attr("data-page");
					InfiniteScroll.options.open = $(".comment_list .ul_list").attr("bool-page");
					page++;
					GetProductBaskOrder(guid, page);
				}
			})
		});

		//评论列表
		function GetProductBaskOrder(guid, PageIndex) {
			//启动加载
			var Load = new load();
			var param = {
				PageIndex: PageIndex,
				PageCount: 5,
				ProductGuid: guid
			}

			$.ajax({
					url: commom.path.httpurl + "?action=GetProductBaskOrder",
					method: 'get',
					dataType: "json",
					timeout: 500,
					data: param,
					success: function(ret) {
						//关闭加载
						Load.hide();
						if(!ret.isError) {

							$(".loading_more").show();
							$(".loading_more").find(".loading-time").hide();
							$(".loading_more").find(".loading_fish").show();
							var arryList = JSON.parse(ret.Msg);
							var str = '';

							for(var i = 0; i < arryList.length; i++) {
								str += '<li class="list_li">';
								str += '<div class="top-title clearbox clearfix">';
								str += '<div class="user-comment">';
								str += '<img class="" src="' + arryList[i].Photo + '"/>';
								str += '<span>' + arryList[i].RealName + '</span>';
								str += '</div>';
								str += '<div class="show-star">';
								str += '<div class="readOnly1" data-level="' + arryList[i].level + '" ></div>';
								str += '</div></div>';

								str += '<div class="user-p">';
								str += '<div class="txt-p active">' + arryList[i].Content + '</div>';

								if((arryList[i].Image).length > 0) {

									if(arryList[i].Image.indexOf(",") > 0) {
										var arrImg = (arryList[i].Image).split(",");
										str += '<div class="show-img clearfix" onclick="imageBrowser(\'' + [arrImg] + '\')">';
										for(var j = 0; j < arrImg.length; j++) {

											str += '<img class="" src="' + arrImg[j] + '"/>';

										}

									} else {
										arr = [];
										arr.push(arryList[i].Image);
										str += '<div class="show-img clearfix" onclick="imageBrowser(\'' + arr + '\')">';
										str += '<img class="" src="' + arryList[i].Image + '"/>';

									}
								}

								str += '</div></div>';
								str += '<div class="user-p clearfix">';
								str += '<div class="start"><span>' + arryList[i].CreateTime + '</span></div>';
								str += '<div class="thumbs-up " data-id="' + arryList[i].Guid + '">';
								str += '	<i class="icon"></i> 有用（<span>' + arryList[i].GoodsCount + '</span>）';
								str += '</div></div></li>';

							}

							$(".comment_list .ul_list").append(str);
							$(".comment_list .ul_list").attr("data-page", param.PageIndex);
							$(".comment_list .ul_list").attr("bool-page", true);
							$.fn.raty.defaults.path = '../image';
							var $star = $(".show-star .readOnly1");

							for(var i = 0; i < $star.length; i++) {
								var j = $($star[i]).attr("data-level");

								$($star[i]).raty({
									readOnly: true,
									score: $($star[i]).attr("data-level")
								});

							}
							//点赞
							$(document).on("click", '.list_li .user-p .thumbs-up', function() {
								var $self = $(this);
								var i = parseInt($(this).children("span").text());
								$self.children(".icon").toggleClass("active_icon");
								if($self.children(".icon").is(".active_icon")) {
									ClickGoods(0, $self.attr("data-id"));
									$self.children("span").text(i + 1);
								} else {
									ClickGoods(1, $self.attr("data-id"));
									$self.children("span").text(i - 1);
								}

							});

							//展开更多介绍
							$(document).on("click", ".user-p .txt-p", function(e) {
								e.stopPropagation();
								var $self = $(this);
								$self.toggleClass("active");
							});

						} else {

							$(".comment_list .ul_list").attr("bool-page", false);
							$(".loading_more").show();
							$(".loading_more").find(".loading-time").hide();
							$(".loading_more").find(".loading_fish").show();
						}
					}
			})
		}
       //底部分界线
	})
})