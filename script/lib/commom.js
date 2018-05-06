define(['jquery'], function($) {
	var obj = {};
	//请求路径
	obj.path = {
		httpurl: 'http://cmyapi.jshcn.cn/ApiInterface.ashx',
		pathUrl: 'https://api.cmyqc.com/WebForm/LeadPage.aspx?id=',
		pathUrl2: 'https://api.cmyqc.com/WebForm/LeadProduct.aspx?id=',
		pathUrl3: 'https://api.cmyqc.com/WebForm/LeadProduct1.aspx?id='
	};
	//url
	obj.GetQueryString = function(name) {
		// 获取参数
		var url = window.location.search;
		// 正则筛选地址栏
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		// 匹配目标参数
		var result = url.substr(1).match(reg);
		//返回参数值
		return result ? decodeURIComponent(result[2]) : null;
	};
	//跳转页面
	obj.OpenView = function(Url, str) {

		window.location.href = '../html/' + Url + '.html?str=' + str;
	};
	/*格式转换*/
	obj.Transformation = function(str) {

		return str = typeof str == 'string' ? JSON.parse(str) : str;
	}
	//  cookie存储
	obj.setCookie = function(name, value) {
		var Days = 1;
		var exp = new Date();
		exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
		document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
	};
	//读取cookie
	obj.getCookie = function(name) {

		var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
		if(arr = document.cookie.match(reg))
			return unescape(arr[2]);
		else
			return null;
	};
	//删除cookie
	obj.delCookie = function(name,callback) {
		
		var exp = new Date();
		exp.setTime(exp.getTime() - 1);
		var cval = obj.getCookie(name);
		if(cval != null)
			document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
			
	    callback(true);
	};
	//sessionc存储,浏览器关闭后消失
	obj.setItem = function(arr) {
		// 设置值
		//var length = b instanceof Array ? b.concat(a) : a.push(b);  
	
		for(var i = 0; i < arr.length; i++) {

			sessionStorage.setItem(arr[i].name, arr[i].value);

		}
		window.history.back();
	};
	obj.getItem = function(name) {
		// 取值
		return sessionStorage.getItem(name);
	};
	obj.removeItem = function(name) {
		// 删除
		sessionStorage.removeItem(name);
	};
	//本地存储
	obj.localSetItem = function(name, value, closeWindow) {
		// 设置值
		localStorage.setItem(name, value);
		if(closeWindow) {
			window.history.back();
		}
	};
	obj.localGetItem = function(name) {
		// 取值
		return localStorage.getItem(name);
	};
	obj.localRemoveItem = function(name) {
		// 删除
		localStorage.removeItem(name);
	};
	//搜索或首次加载没有数据
	obj.nodataMsg = function(msg, el) {

		var defaultTxt = {

			msg: '没有数据',
			el: $("body")
		};
		if(msg) {
			defaultTxt.msg = msg;
		};
		if(el) {

			defaultTxt.el = el;
		}
		var str = '';
		str += '<div class="null_list search_null">';
		str += '<img src="../image/null_list.png" />';
		str += '<span>' + defaultTxt.msg + '</span>';
		str += '</div>';
		defaultTxt.el.append(str);
		$(".null_list").show();
	}
	//判断是否登录平台
	obj.isLogin = function(Url, str) {

		var is = typeof obj.getCookie('memlogid') == 'string' ? true : false;

		if(!is) {

			window.location.href = '../html/login.html';

		} else {

			if(Url) {

				window.location.href = '../html/' + Url + '.html?str=' + str;
			}
		}
	}
	return obj;　

});