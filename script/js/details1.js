var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'swiper', 'layer', 'load'], function($, commom, swiper, layer, load) {
		var fage = true; //判断是否收藏成功
		var IsPackage= 0 ;//是否打包产品
		//初始化数据
		$(function() {

			var guid = commom.GetQueryString('id');
			auto_banner(guid, function() {

				//轮播图
				var mySwiper = new Swiper('.swiper-container', {
					autoplay: 3000,
					speed: 500,
					pagination: '.swiper-pagination',
					paginationClickable: true,
					loop: true,
					loopAdditionalSlides: 1,
					autoplayDisableOnInteraction: false,
				});
				GetProduct(guid);
				Comment(guid)
			});
			$(".btn_say").on("click", function() {

				commom.OpenView("comment", guid);
			})
			//收藏
			collection(guid);
			//选择规格
			$(document).on("click", ".layui-m-layer-footer .layui-m-layercont .specs .list .list_li", function() {

				$(this).addClass("active").siblings().removeClass("active");
				var Specifications = [];
				var $list_li = $(".specs .list .list_li");
				if($(".specs .list .active").length == $(".layui-m-layercont .specs ").length) {
					$.each($list_li, function(index, ele) {
						if($(ele).hasClass("active")) {
							Specifications.push($(ele).attr("data-id"));
						}
					});
					stockprice(Specifications.join(";"))
				}

			})

		});
		//获取产品库存
		function stockprice(Specifications) {

			param = {
				ProductGuid: commom.getCookie('memlogid'),
				productSpecification: Specifications,
			}
			$.ajax({
				url: commom.path.httpurl + "?action=GetProductSpecificationInfo",
				method: 'get',
				dataType: "json",
				timeout: 1000,
				data: param,
				success: function(ret) {
					if(!ret.IsError) {

						var listArry = JSON.parse(ret.Msg);
						$(".num_item .red_price").text("￥" + listArry[0].Price);
						$(".num_item .red_num").text(listArry[0].RepertoryCount);

					} else {

						layer.open({
							content: ret.msg,
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
					}
				}
			})
		}
		//多图轮播
		function auto_banner(guid, callback) {

			//启动加载
			var Load = new load();
			var str = '';
			$.ajax({

				url: commom.path.httpurl + "?action=getproductimages&ProductGuid=" + guid,
				method: 'get',
				dataType: "json",
				success: function(ret) {
					//关闭加载
					Load.hide();
					if(!ret.IsError) {

						var banner_arr = JSON.parse(ret.Msg);
						var str = '';
						str += '<div class="swiper-container">	<div class="swiper-wrapper">';
						for(var i = 0; i < banner_arr.length; i++) {
							str += '<div class="swiper-slide">';
							str += '<img src="' + banner_arr[i].OriginalImge + '" onclick="imageBrowser(\'' + banner_arr[i].OriginalImge + '\')"/>'
							str += "</div>";
						}
						str += '</div><div class="swiper-pagination"></div></div>';
						$(".details_main").before(str);
						callback(true)

					}
				}
			});

		};

		//详情展示
		function GetProduct(guid) {

			var str = '';
			$.ajax({

				url: commom.path.httpurl + "?action=getproduct&ProductGuid=" + guid,
				method: 'get',
				timeout: 500,
				dataType: "json",
				success: function(ret) {
                     
					if(!ret.isError) {
						var listArry = JSON.parse(ret.Msg);
						console.log(listArry)
						str += '<div class="title_p">' + listArry[0].Name + '</div>';
						str += '<div class="clearfix">';
						//str += '<div class="price">会员价:<span class="price_txt">￥<span class="red_price">' + listArry[0].ShopPrice + '</span></span></div>';
						str += '<div class="vip_price" style="float:left;">漫豆:<span class="price_txt" style="font-size:0.5rem">' + listArry[0].MarketPrice + '</span></div>';
						str += '<div class="back_price" style="float:right;">返利<span>' + listArry[0].PushMoney + '</span>漫豆</div></div>';

						var $Title_bottom = $(".title_bottom");
						$(".details_main").append(str);

						$Title_bottom.html(listArry[0].Detail)

						$Title_bottom.find("img").each(function(index, ele) {

							$(ele).attr("onclick", "imageBrowser('" + $(ele).attr("src") + "')");

						});

						//获取商品规格
						GetspecificationGuids(guid, listArry[0]);
						//切换打包样式
						if(listArry[0].IsPackage==1){
							 IsPackage=1;
							var str2='';
						    str2+='<a href="#" class="item cart" style="width:66.6%;">加入购物车</a>';
							$(".details_foot").append(str2);
						}else{
							var str3='';
						        str3+='<a href="#" class="item cart">加入购物车</a>';
						        str3+='<a href="#" class="item prodel">立即购买</a>';
							   $(".details_foot").append(str3);
						}

					} else {

						layer.open({
							content: ret.msg,
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
					};
				}

			});
		};
		//产品规格
		function GetspecificationGuids(guid, count) {

			var str = '';
			$.ajax({
				url: commom.path.httpurl + "?action=getproductspecification&ProductGuid=" + guid,
				method: 'get',
				timeout: 1000,
				dataType: "json",
				success: function(ret) {
					// alert(ret.Msg+'啦啦');
					if(!ret.isError) {
						var listArry = JSON.parse(ret.Msg);
						for(var i = 0; i < listArry.length; i++) {
							str += '<div class="specs"><div class="title">' + listArry[i].SpecKey + '</div>';
							str += '<ul class="list clearfix ">';
							for(var j = 0; j < listArry[i].SpecValue.length; j++) {
								str += '<li class="list_li fl" data-id="' + listArry[i].SpecValue[j].SpecificationGuid + ":" + listArry[i].SpecValue[j].Guid + '">' + listArry[i].SpecValue[j].Name + '</li>';
							};
							str += '</ul></div>';

						}
						str += '<div class="clearfix num_item"><span class="title fl">商品数量</span><div class="fr clearfix"><i class="fl iconfont icon-jian"></i><input type="number" class="fl" value="1"/><i class="fl iconfont icon-jia1"></i></div></div>';
						str += '<div class="num_item">库存：(<span class="red_num">' + count.RepertoryCount + '</span>)件</div>';
						str += '<div class="num_item">价格：<span class="red_price">' + count.MarketPrice + '漫豆</span></div>';
						str += '<div class="null"></div>';
						//打包
						if(IsPackage==1){
							
							str+='<footer class="clearfix"> <div class="fl cart" type="1" style="width:100%;">加入购物车</div></footer>';
							
						}else{
							
							str+='<footer class="clearfix"> <div class="fl cart" type="1" >加入购物车</div><div class="fl buyshop" type="1" >立即购买</div></footer>';
						}
						$(".cart").on("click", function() {
							format(str);
						});
						$(".guige").on("click", function() {
							format(str);
						})
						$(".prodel").on("click", function() {
							format(str);
						});
						//加入购物车
						$("body").on("click", "footer .cart", function() {

							BuyType(0);
						});
						//立即购买
						$("body").on("click", "footer .buyshop", function() {

							BuyType(1);
						})
						//商品数量加减

						$(document).on("click", '.layui-m-layer-footer .layui-m-layercont .num_item i.icon-jia1', function() {
							var $input = $(".num_item input");
							var i = parseInt($input.val());
							if(i >= count.RepertoryCount) {
								$(this).attr("disabled", "disabled");
								$(this).css("background", "	#EBEBEB");
								return false;
							}
							i++;
							$input.val(i);
						});

						$(document).on("click", '.layui-m-layer-footer .layui-m-layercont .num_item i.icon-jian', function() {
							var $input = $(".num_item input");
							var i = parseInt($input.val());
							i--;
							if(i <= 1) {
								$input.val(1);
							} else {
								$input.val(i);
							}
						})

					} else {

						str += '<div class="clearfix num_item"><span class="title fl">商品数量</span><div class="fr clearfix"><i class="fl iconfont icon-jian"></i><input type="number" class="fl" value="1"/><i class="fl iconfont icon-jia1"></i></div></div>';
						str += '<div class="num_item">库存：(<span class="red_num">' + count.RepertoryCount + '</span>)件</div>';
						str += '<div class="num_item">价格：<span class="red_price">' + count.MarketPrice + '漫豆</span></div>';
						str += '<div class="null none_model"></div>';
						//打包
						if(IsPackage==1){
							
							str+='<footer class="clearfix"> <div class="fl cart" type="1" style="width:100%;">加入购物车</div></footer>';
							
						}else{
							
							str+='<footer class="clearfix"> <div class="fl cart" type="1" >加入购物车</div><div class="fl buyshop" type="1" >立即购买</div></footer>';
						}

						$(".cart").on("click", function() {
							format(str);
						});
						$(".guige").on("click", function() {
							format(str);
						})
						$(".prodel").on("click", function() {
							format(str);
						});
						//加入购物车
						$("body").on("click", "footer .cart", function() {

							BuyType(0);
						});
						//立即购买
						$("body").on("click", "footer .buyshop", function() {

							BuyType(1);
						})
						//商品数量加减

						$(document).on("click", '.layui-m-layer-footer .layui-m-layercont .num_item i.icon-jia1', function() {
							var $input = $(".num_item input");
							var i = parseInt($input.val());

							if(i >= count.RepertoryCount) {
								$(this).attr("disabled", "disabled");
								$(this).css("background", "	#EBEBEB");
								return false;
							}
							i++;
							$input.val(i);

						});

						$(document).on("click", '.layui-m-layer-footer .layui-m-layercont .num_item i.icon-jian', function() {
							var $input = $(".num_item input");
							var i = parseInt($input.val());
							i--;
							if(i <= 1) {
								$input.val(1);
							} else {
								$input.val(i);
							};
						});
					};
				}
			});
		};
		//打开规格弹窗
		function format(str) {
			layer.open({
				content: str,
				btn: ['取消', ''],
				skin: 'footer',
				yes: function(index) {

					var $list_li = $(" .list .list_li");
					var $num = $(".num_item input ").val();
					var str = ''
					$.each($list_li, function(index, ele) {

						if($(ele).hasClass("active")) {
							str += $(ele).text() + ' ';

						}
					});

					if($(".specs .list .active").length == $(".layui-m-layercont .specs ").length) {
						$(".selected").text(str + ' ' + 'X' + $num);
						layer.close(index);
					} else {
						layer.close(index);
						layer.open({
							content: '未选择商品',
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
					}

				}
			});
			$(".layui-m-layer .layui-m-layer-footer").height($(".layui-m-layercont").height());
			if($(".layui-m-layercont").height() > 320) {
				$(".layui-m-layer .layui-m-layer-footer").height($(".layui-m-layercont").height() - $(".null").height());
				$(".layui-m-layercont").css({

					"height": '320px',
					'overflow-y': 'auto'
				})
			};
		}
		//加入购物车
		function BuyType(type) {
			//判断是否登录
			var is = typeof commom.getCookie('memlogid') == 'string' ? true : false;
			if(!is) {

				window.location.href = '../html/login.html';

			} else {

				if($(".num_item input").val() > parseInt($(".num_item .red_num").text())) {

                    var str =' <div class="totast" style="">商品数量告急</div>';
                    $('body').append(str);
                    var $totast=$('.totast');
                        $totast.animate({
                        	   bottom:'12%'
                        },100)
					  setTimeout(function(){
					  	
					  	$totast.remove();
					  	
					  },2000)
                     return false;
				} else {
				
					if($(".specs .list .active").length == $(".layui-m-layercont .specs ").length) {
						var $list_li = $(".specs .list .list_li");
						var Specifications = [];
						var num = $(".num_item input ").val();

						$.each($list_li, function(index, ele) {

							if($(ele).hasClass("active")) {
								Specifications.push($(ele).attr("data-id"));
							}
						});
						//启动加载
						var Load = new load();
						var param = {
							MemLoginId: commom.getCookie('memlogid'),
							ProductGuid: commom.GetQueryString('id'),
							SpecificationDetails: Specifications.join(";"),
							IsSelected: type,
							BuyNumbers: num
						}
						$.ajax({
							url: commom.path.httpurl + "?action=AddProduct",
							method: 'post',
							dataType: "json",
							timeout: 1000,
							data: param,
							success: function(ret) {
								//关闭加载
								Load.hide();
								if(!ret.isError) {

									$(".layui-m-layer").remove();
									if(type == 0) {

										layer.open({
											content: '商品已加入购物车',
											skin: 'msg',
											time: 2 //2秒后自动关闭
										});

									} else {

										window.location.href = "../html/order1.html"
									}

								} else {

									layer.open({
										content: ret.Msg,
										skin: 'msg',
										time: 2 //2秒后自动关闭
									});
								}
							}
						})
					} else {
						layer.open({
							content: "商品规格未选完",
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
					}
				}
			}
		};

		//收藏
		function collection(guid) {

			InitProductCollect(guid)
			$(".details_foot .call_phone ").on('click', function() {
				//判断是否登录
				commom.isLogin();
				var $self = $(this);
				if(fage) {

					UpdateProductCollect(0, guid, 1);

				} else {

					UpdateProductCollect(1, guid, 0);
				};
			})

		};
		//初始化收藏
		function InitProductCollect(guid) {
			//判断是否登录
			var is = typeof commom.getCookie('memlogid') == 'string' ? true : false;
			if(!is) {
				return false;
			}
			//初始化收藏数据
			var param = {
				MemLoginId: commom.getCookie('memlogid'),
				ProductGuid: guid,
			}
			//  alert(JSON.stringify(param))
			$.ajax({
				url: commom.path.httpurl + "?action=GetProductCollect",
				method: 'get',
				dataType: "json",
				timeout: 500,
				data: param,
				success: function(ret) {
                    console.log(ret.Msg)
					if(!ret.isError) {

						$(".details_foot .call_phone ").children("i").addClass("icon-xing").removeClass("icon-fav");
						$(".details_foot .call_phone ").children("i").css("color", "#d20000");
						fage = false;
					}
				}
			});
		};
		//提交收藏数据
		function UpdateProductCollect(type, guid, index) {

			//启动加载
			var Load = new load();
			var param = {
				MemLoginId: commom.getCookie('memlogid'),
				ProductGuid: guid,
				IsCollect: type
			};
			$.ajax({
				url: commom.path.httpurl + "?action=UpdateProductCollect",
				method: 'post',
				dataType: "json",
				timeout: 500,
				data: param,
				success: function(ret) {
					//关闭加载
					Load.hide();
					console.log(ret.Msg)
					if(!ret.isError) {
                       
						//提示
						if(index == 1) {
							layer.open({
								content: '收藏成功',
								skin: 'msg',
								time: 2 //2秒后自动关闭
							});
							$(".details_foot .call_phone ").children("i").addClass("icon-xing").removeClass("icon-fav");
							$(".details_foot .call_phone ").children("i").css("color", "#d20000");
							fage = false;
						} else if(index == 0) {
							layer.open({
								content: '取消收藏',
								skin: 'msg',
								time: 2 //2秒后自动关闭
							});
							$(".details_foot .call_phone ").children("i").addClass("icon-fav").removeClass("icon-xing");
							$(".details_foot .call_phone ").children("i").css("color", "#666");
							fage = true;
						}

					} else {

						layer.open({
							content: '收藏失败',
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
					}
				}
			})
		};
		//评论
		function Comment(guid) {

			$.ajax({
				url: commom.path.httpurl + "?action=GetProductBaskOrderCount&ProductGuid=" + guid,
				method: 'get',
				dataType: "json",
				timeout: 1000,
				success: function(ret) {

					if(!ret.isError) {
						var listArry = JSON.parse(ret.Msg);
						$(".title_item .love ").text(listArry[0].CommentRete + "%");
						$(".more span").text(listArry[0].CommentCount);
						//晒单
						var param = {
							PageIndex: 1,
							PageCount: 1,
							ProductGuid: guid,
						}
						$.ajax({
							url: commom.path.httpurl + "?action=getproductbaskorder",
							method: 'get',
							dataType: "json",
							data: param,
							success: function(ret) {
								// alert(ret.Msg);

								if(!ret.isError) {
									str = '';
									var arryList = JSON.parse(ret.Msg);
									str += '<div class="user clearfix">';
									str += '<img class="fl" src="' + arryList[0].Photo + '"/>';
									str += '<div class="party fl">';
									str += '<span class="account weight">' + arryList[0].RealName + '</span>';
									str += '<span class="txt">' + arryList[0].CreateTime + '</span>';
									str += '</div></div>';
									str += '<div class="say">' + arryList[0].Content + '</div>';
									$(".user_list").append(str);
								} else {}
							}
						})
					} else {

					}
				}
			})
		}
		//底部分界线
	})
})