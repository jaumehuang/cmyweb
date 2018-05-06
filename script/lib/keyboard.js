/**
 * ydui main
 */
var YDUI={};
!function (window) {
    "use strict";

    var doc = window.document,
        ydui = {};

    /**
     * 直接绑定FastClick
     */
    $(window).on('load', function () {
        typeof FastClick == 'function' && FastClick.attach(doc.body);
    });

    var util = ydui.util = {
        /**
         * 格式化参数
         * @param string
         */
        parseOptions: function (string) {
            if ($.isPlainObject(string)) {
                return string;
            }

            var start = (string ? string.indexOf('{') : -1),
                options = {};

            if (start != -1) {
                try {
                    options = (new Function('', 'var json = ' + string.substr(start) + '; return JSON.parse(JSON.stringify(json));'))();
                } catch (e) {
                }
            }
            return options;
        },
        /**
         * 页面滚动方法【移动端】
         * @type {{lock, unlock}}
         * lock：禁止页面滚动, unlock：释放页面滚动
         */
        pageScroll: function () {
                var fn = function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                };
                var islock = false;

                return {
                    lock: function () {
                        if (islock)return;
                        islock = true;
                        doc.addEventListener('touchmove', fn);
                    },
                    unlock: function () {
                        islock = false;
                        doc.removeEventListener('touchmove', fn);
                    }
                };
            }(),
        /**
         * 本地存储
         */
        localStorage: function () {
            return storage(window.localStorage);
        }(),
        /**
         * Session存储
         */
        sessionStorage: function () {
            return storage(window.sessionStorage);
        }(),
        /**
         * 序列化
         * @param value
         * @returns {string}
         */
        serialize: function (value) {
            if (typeof value === 'string') return value;
            return JSON.stringify(value);
        },
        /**
         * 反序列化
         * @param value
         * @returns {*}
         */
        deserialize: function (value) {
            if (typeof value !== 'string') return undefined;
            try {
                return JSON.parse(value);
            } catch (e) {
                return value || undefined;
            }
        }
    };

    /**
     * HTML5存储
     */
    function storage (ls) {
        return {
            set: function (key, value) {
                ls.setItem(key, util.serialize(value));
            },
            get: function (key) {
                return util.deserialize(ls.getItem(key));
            },
            remove: function (key) {
                ls.removeItem(key);
            },
            clear: function () {
                ls.clear();
            }
        };
    }

    /**
     * 判断css3动画是否执行完毕
     * @git http://blog.alexmaccaw.com/css-transitions
     * @param duration
     */
    $.fn.emulateTransitionEnd = function (duration) {
        var called = false,
            $el = this;

        $(this).one('webkitTransitionEnd', function () {
            called = true;
        });

        var callback = function () {
            if (!called) $($el).trigger('webkitTransitionEnd');
        };

        setTimeout(callback, duration);
    };

    if (typeof define === 'function') {
        define(ydui);
    } else {
        window.YDUI = ydui;
    }

}(window);


/**
 * KeyBoard Plugin
 */
!function (window) {
    "use strict";

    var $body = $(window.document.body),
        isMobile = !!(window.navigator && window.navigator.userAgent || '').match(/AppleWebKit.*Mobile.*/) || 'ontouchstart' in window.document.documentElement,
        triggerEvent = isMobile ? 'touchstart' : 'click';

    function KeyBoard (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, KeyBoard.DEFAULTS, options || {});
        this.init();
    }

    KeyBoard.DEFAULTS = {
        disorder: false,
        title: '安全键盘'
    };

    KeyBoard.prototype.init = function () {
        var _this = this;

        _this.inputNums = '';

        _this.toggleClass = 'keyboard-show';

        function getDot () {
            var s = '';
            for (var i = 0; i < 6; i++) {
                s += '<li><i></i></li>';
            }
            return s;
        }

        var hd = '' +
            '<div class="keyboard-head"><strong>输入支付密码</strong></div>' +
            '<div class="keyboard-error"></div>' +
            '<ul class="keyboard-password J_FillPwdBox">' + getDot() + '</ul>';

        var ft = '' +
            '<div class="keyboard-content">' +
            '   <div class="keyboard-title">' + _this.options.title + '</div>' +
            '   <ul class="keyboard-numbers"></ul>' +
            '</div>';

        _this.$element.prepend(hd).append(ft);

        _this.$numsBox = _this.$element.find('.keyboard-numbers');

        _this.$mask = $('<div class="mask-black"></div>');
    };

    /**
     * 打开键盘窗口
     */
    KeyBoard.prototype.open = function () {
        var _this = this,
            $element = _this.$element,
            $numsBox = _this.$numsBox;
  
        YDUI.device.isIOS && $('.g-scrollview').addClass('g-fix-ios-overflow-scrolling-bug');

        $element.addClass(_this.toggleClass);

        if (_this.options.disorder || $numsBox.data('loaded-nums') != 1) {
            $numsBox.data('loaded-nums', 1).html(_this.createNumsHtml());
        }

        $body.append(_this.$mask);

        _this.bindEvent();
    };

    /**
     * 关闭键盘窗口
     */
    KeyBoard.prototype.close = function () {
        var _this = this;

        YDUI.device.isIOS && $('.g-scrollview').removeClass('g-fix-ios-overflow-scrolling-bug');

        _this.$mask.remove();
        _this.$element.removeClass(_this.toggleClass);
        _this.unbindEvent();

        _this.inputNums = '';
        _this.fillPassword();

        _this.clearError();
    };

    /**
     * 事件绑定
     */
    KeyBoard.prototype.bindEvent = function () {
        var _this = this,
            $element = _this.$element;

        _this.$mask.on(triggerEvent + '.ydui.keyboard.mask', function (e) {
            e.preventDefault();
            _this.close();
        });

        $element.on(triggerEvent + '.ydui.keyboard.nums', '.J_Nums', function (e) {
            if (_this.inputNums.length >= 6)return;

            _this.inputNums = _this.inputNums + $(this).html();

            _this.clearError();
            _this.fillPassword();
        });

        // 退格
        $element.on(triggerEvent + '.ydui.keyboard.backspace', '.J_Backspace', function (e) {
            e.preventDefault();
            _this.backspace();
        });

        // 取消
        $element.on(triggerEvent + '.ydui.keyboard.cancel', '.J_Cancel', function (e) {
            e.preventDefault();
            _this.close();
        });
    };

    /**
     * 解绑事件
     */
    KeyBoard.prototype.unbindEvent = function () {
        this.$element.off(triggerEvent + '.ydui.keyboard');
        $(window).off('hashchange.ydui.keyboard');
    };

    /**
     * 填充密码
     */
    KeyBoard.prototype.fillPassword = function () {
        var _this = this,
            inputNums = _this.inputNums,
            length = inputNums.length;

        var $li = _this.$element.find('.J_FillPwdBox').find('li');
        $li.find('i').hide();
        $li.filter(':lt(' + length + ')').find('i').css('display', 'block');

        if (length >= 6) {
            _this.$element.trigger($.Event('done.ydui.keyboard', {
                password: inputNums
            }));
        }
    };

    /**
     * 清空错误信息
     */
    KeyBoard.prototype.clearError = function () {
        this.$element.find('.keyboard-error').html('');
    };

    /**
     * 提示错误信息
     * @param mes
     */
    KeyBoard.prototype.error = function (mes) {
        var _this = this;
        _this.$element.find('.keyboard-error').html(mes);

        _this.inputNums = '';
        _this.fillPassword();
    };

    /**
     * 退格处理
     */
    KeyBoard.prototype.backspace = function () {
        var _this = this;

        var _inputNums = _this.inputNums;
        if (_inputNums) {
            _this.inputNums = _inputNums.substr(0, _inputNums.length - 1);
        }

        _this.fillPassword();
    };

    /**
     * 创建键盘HTML
     * @returns {string}
     */
    KeyBoard.prototype.createNumsHtml = function () {
        var _this = this,
            nums = _this.createNums();

        _this.options.disorder && _this.upsetOrder(nums);

        var arr = [];
        $.each(nums, function (k) {
            if (k % 3 == 0) {
                if (k >= nums.length - 2) {
                    arr.push('<li><a href="javascript:;" class="J_Cancel">取消</a>' + nums.slice(k, k + 3).join('') + '<a href="javascript:;" class="J_Backspace"></a></li>');
                } else {
                    arr.push('<li>' + nums.slice(k, k + 3).join('') + '</li>');
                }
            }
        });

        return arr.join('');
    };

    /**
     * 创建键盘数字
     * @returns {Array} DOM数组
     */
    KeyBoard.prototype.createNums = function () {
        var _this = this;
        var disorder = _this.options.disorder;

        if (disorder && _this.cacheNums) {
            return _this.cacheNums;
        }

        var strArr = [];
        for (var i = 1; i <= 10; i++) {
            strArr.push('<a href="javascript:;" class="J_Nums">' + (i % 10) + '</div>');
        }

        if (!disorder) {
            _this.cacheNums = strArr;
        }

        return strArr;
    };

    /**
     * 打乱数组顺序
     * @param arr 数组
     * @returns {*}
     */
    KeyBoard.prototype.upsetOrder = function (arr) {
        var floor = Math.floor,
            random = Math.random,
            len = arr.length, i, j, temp,
            n = floor(len / 2) + 1;
        while (n--) {
            i = floor(random() * len);
            j = floor(random() * len);
            if (i !== j) {
                temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        return arr;
    };

    function Plugin (option) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function () {

            var $this = $(this),
                keyboard = $this.data('ydui.keyboard');

            if (!keyboard) {
                $this.data('ydui.keyboard', (keyboard = new KeyBoard(this, option)));
            }

            if (typeof option == 'string') {
                keyboard[option] && keyboard[option].apply(keyboard, args);
            }
        });
    }

    $.fn.keyBoard = Plugin;

}(window);
/**
 * Dialog
 */
!function (window, ydui) {
    "use strict";

    var dialog = ydui.dialog = ydui.dialog || {},
        $body = $(window.document.body);

    /**
     * 确认提示框
     * @param title 标题String 【可选】
     * @param mes   内容String 【必填】
     * @param opts  按钮们Array 或 “确定按钮”回调函数Function 【必填】
     * @constructor
     */
    dialog.confirm = function (title, mes, opts) {
        var ID = 'YDUI_CONFRIM';

        $('#' + ID).remove();

        var args = arguments.length;
        if (args < 2) {
            console.error('From YDUI\'s confirm: Please set two or three parameters!!!');
            return;
        }

        if (typeof arguments[1] != 'function' && args == 2 && !arguments[1] instanceof Array) {
            console.error('From YDUI\'s confirm: The second parameter must be a function or array!!!');
            return;
        }

        if (args == 2) {
            opts = mes;
            mes = title;
            title = '提示';
        }

        var btnArr = opts;
        if (typeof opts === 'function') {
            btnArr = [{
                txt: '取消',
                color: false
            }, {
                txt: '确定',
                color: true,
                callback: function () {
                    opts && opts();
                }
            }];
        }

        var $dom = $('' +
            '<div class="mask-black-dialog" id="' + ID + '">' +
            '   <div class="m-confirm">' +
            '       <div class="confirm-hd"><strong class="confirm-title">' + title + '</strong></div>' +
            '       <div class="confirm-bd">' + mes + '</div>' +
            '   </div>' +
            '</div>');

        // 遍历按钮数组
        var $btnBox = $('<div class="confirm-ft"></div>');

        $.each(btnArr, function (i, val) {
            var $btn;
            // 指定按钮颜色
            if (typeof val.color == 'boolean') {
                $btn = $('<a href="javascript:;" class="' + 'confirm-btn ' + (val.color ? 'primary' : 'default') + '">' + (val.txt || '') + '</a>');
            } else if (typeof val.color == 'string') {
                $btn = $('<a href="javascript:;" style="color: ' + val.color + '">' + (val.txt || '') + '</a>');
            }

            // 给对应按钮添加点击事件
            (function (p) {
                $btn.on('click', function (e) {
                    e.stopPropagation();

                    // 是否保留弹窗
                    if (!btnArr[p].stay) {
                        // 释放页面滚动
                        ydui.util.pageScroll.unlock();
                        $dom.remove();
                    }
                    btnArr[p].callback && btnArr[p].callback();
                });
            })(i);
            $btnBox.append($btn);
        });

        $dom.find('.m-confirm').append($btnBox);

        // 禁止滚动屏幕【移动端】
        ydui.util.pageScroll.lock();

        $body.append($dom);
    };

    /**
     * 弹出警示框
     * @param mes       提示文字String 【必填】
     * @param callback  回调函数Function 【可选】
     */
    dialog.alert = function (mes, callback) {

        var ID = 'YDUI_ALERT';

        $('#' + ID).remove();

        var $dom = $('' +
            '<div id="' + ID + '">' +
            '   <div class="mask-black-dialog">' +
            '       <div class="m-confirm m-alert">' +
            '           <div class="confirm-bd">' + (mes || 'YDUI Touch') + '</div>' +
            '           <div class="confirm-ft">' +
            '               <a href="javascript:;" class="confirm-btn primary">确定</a>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '</div>');

        ydui.util.pageScroll.lock();

        $body.append($dom);

        $dom.find('a').on('click', function () {
            $dom.remove();
            ydui.util.pageScroll.unlock();
            typeof callback === 'function' && callback();
        });
    };

    /**
     * 弹出提示层
     */
    dialog.toast = function () {
        var timer = null;
        /**
         * @param mes       提示文字String 【必填】
         * @param type      类型String success or error 【必填】
         * @param timeout   多久后消失Number 毫秒 【默认：2000ms】【可选】
         * @param callback  回调函数Function 【可选】
         */
        return function (mes, type, timeout, callback) {

            clearTimeout(timer);

            var ID = 'YDUI_TOAST';

            $('#' + ID).remove();

            var args = arguments.length;
            if (args < 2) {
                console.error('From YDUI\'s toast: Please set two or more parameters!!!');
                return;
            }

            var iconHtml = '';
            if (type == 'success' || type == 'error') {
                iconHtml = '<div class="' + (type == 'error' ? 'toast-error-ico' : 'toast-success-ico') + '"></div>';
            }

            var $dom = $('' +
                '<div class="mask-white-dialog" id="' + ID + '">' +
                '    <div class="m-toast ' + (iconHtml == '' ? 'none-icon' : '') + '">' + iconHtml +
                '        <p class="toast-content">' + (mes || '') + '</p>' +
                '    </div>' +
                '</div>');

            ydui.util.pageScroll.lock();

            $body.append($dom);

            if (typeof timeout === 'function' && arguments.length >= 3) {
                callback = timeout;
                timeout = 2000;
            }

            timer = setTimeout(function () {
                clearTimeout(timer);
                ydui.util.pageScroll.unlock();
                $dom.remove();
                typeof callback === 'function' && callback();
            }, (~~timeout || 2000) + 100);//100为动画时间
        };
    }();

    /**
     * 顶部提示层
     */
    dialog.notify = function () {

        var timer = null;

        /**
         * @param mes       提示文字String 【必填】
         * @param timeout   多久后消失Number 毫秒 【默认：2000ms】【可选】
         */
        return function (mes, timeout, callback) {

            clearTimeout(timer);

            var ID = 'YDUI_NOTIFY';

            $('#' + ID).remove();

            var $dom = $('<div id="' + ID + '"><div class="m-notify">' + (mes || '') + '</div></div>');

            $body.append($dom);

            var next = function () {
                $dom.remove();
                typeof callback == 'function' && callback();
            };

            var closeNotify = function () {
                clearTimeout(timer);

                $dom.find('.m-notify').addClass('notify-out');

                $dom.one('webkitTransitionEnd', next).emulateTransitionEnd(150);
            };

            $dom.on('click', closeNotify);

            if (~~timeout > 0) {
                timer = setTimeout(closeNotify, timeout + 200);
            }
        }
    }();

    /**
     * 加载中提示框
     */
    dialog.loading = function () {

        var ID = 'YDUI_LOADING';

        return {
            /**
             * 加载中 - 显示
             * @param text 显示文字String 【可选】
             */
            open: function (text) {
                $('#' + ID).remove();

                var $dom = $('' +
                    '<div class="mask-white-dialog" id="' + ID + '">' +
                    '   <div class="m-loading">' +
                    '       <div class="loading-icon"></div>' +
                    '       <div class="loading-txt">' + (text || '数据加载中') + '</div>' +
                    '   </div>' +
                    '</div>').remove();

                ydui.util.pageScroll.lock();
                $body.append($dom);
            },
            /**
             * 加载中 - 隐藏
             */
            close: function () {
                ydui.util.pageScroll.unlock();
                $('#' + ID).remove();
            }
        };
    }();
}(window, YDUI);
/**
 * Device
 */
!function (window) {
    var doc = window.document,
        ydui = window.YDUI,
        ua = window.navigator && window.navigator.userAgent || '';

    var ipad = !!ua.match(/(iPad).*OS\s([\d_]+)/),
        ipod = !!ua.match(/(iPod)(.*OS\s([\d_]+))?/),
        iphone = !ipad && !!ua.match(/(iPhone\sOS)\s([\d_]+)/);

    ydui.device = {
        /**
         * 是否移动终端
         * @return {Boolean}
         */
        isMobile: !!ua.match(/AppleWebKit.*Mobile.*/) || 'ontouchstart' in doc.documentElement,
        /**
         * 是否IOS终端
         * @returns {boolean}
         */
        isIOS: !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
        /**
         * 是否Android终端
         * @returns {boolean}
         */
        isAndroid: !!ua.match(/(Android);?[\s\/]+([\d.]+)?/),
        /**
         * 是否ipad终端
         * @returns {boolean}
         */
        isIpad: ipad,
        /**
         * 是否ipod终端
         * @returns {boolean}
         */
        isIpod: ipod,
        /**
         * 是否iphone终端
         * @returns {boolean}
         */
        isIphone: iphone,
        /**
         * 是否webview
         * @returns {boolean}
         */
        isWebView: (iphone || ipad || ipod) && !!ua.match(/.*AppleWebKit(?!.*Safari)/i),
        /**
         * 是否微信端
         * @returns {boolean}
         */
        isWeixin: ua.indexOf('MicroMessenger') > -1,
        /**
         * 是否火狐浏览器
         */
        isMozilla: /firefox/.test(navigator.userAgent.toLowerCase()),
        /**
         * 设备像素比
         */
        pixelRatio: window.devicePixelRatio || 1
    };
}(window);


