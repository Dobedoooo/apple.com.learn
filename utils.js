/**
 * 线性
 * @param {Number} x 自变量
 * @param {Number} x1 
 * @param {Number} x2 
 * @param {Number} y1 
 * @param {Number} y2 
 * @returns 因变量
 */
const _linear = function(x, x1, x2, y1, y2) {
    x1 = x1.toFixed(5)
    x2 = x2.toFixed(5)
    return (y2 - y1) / (x2 - x1) * ( x - x1 ) + y1
}
const _ease_out = function(x, x1, x2, y1, y2) {
    x1 = Number(x1.toFixed(5))
    x2 = Number(x2.toFixed(5))
    var direction = y2 - y1
    if(direction > 0) {
        ret = (-1 * (y2 - y1) * ((x - x2) / (x2 - x1)) * ((x - x2) / (x2 - x1)) + y2).toFixed(5)
    } else {
        ret = ((y1 - y2) * ((x - x2) / (x2 - x1)) * ((x - x2) / (x2 - x1)) + y2).toFixed(5)
    }
    return ret
}

const MODE = {
    'linear': _linear,
    'ease-out': _ease_out
}

class Scene {
    constructor(id, step, multiple, constant) {
        this.element = document.getElementById(id)
        // 开始位置由 步长 * 倍数 + 常量 算得
        this.start = step * multiple + constant
        this.step = step
        this.multiple = multiple
        this.constant = constant
        var _this = this
        Event.listen('change', function(sceneLength) {
            _this.step = sceneLength
            _this.start = _this.step * _this.multiple + _this.constant
        })
    }
    switchControl(switchClass) {
        if(document.documentElement.scrollTop >= this.start && document.documentElement.scrollTop < (this.start + this.step)) {
            this.element.classList.add(switchClass)
        } else {
            this.element.classList.remove(switchClass)
        }
    }
}

class MovableElement {

    /**
     * 构造函数
     * @param {*} id 
     * @param {*} scene 
     * @param {*} start 比例
     * @param {Number | 'mutation'} end 比例
     * @param {*} style 
     * @param {*} from 
     * @param {*} to 
     * @param {*} suffix 
     * @param {'linear' | 'ease-out'} mode 
     */
    constructor(id, scene, start, end, style, from, to, suffix = '', mode = 'linear', callback = null) {
        this.element = document.getElementById(id)
        this.scene = scene
        this.moveArgs = [{
            start,
            end,
            style: style.split('.')[0],
            subType: style.split('.')[1],
            from,
            to,
            suffix,
            mode
        }]
        this.callback = callback
    }
    moveControl() {
        this.moveArgs.forEach(arg => {
            if(arg.subType) {
                transformCalculate(document.documentElement.scrollTop, 
                    this.scene.start + arg.start * this.scene.step, 
                    this.scene.start + arg.end * this.scene.step,
                    this.element, arg.subType, arg.from, arg.to, arg.suffix, arg.mode, this.callback)
            } else {
                cssStyleCalculate(document.documentElement.scrollTop, this.scene.start + arg.start * this.scene.step,
                    arg.end === 'mutation' ? 'mutation' : this.scene.start + arg.end * this.scene.step,
                    this.element, arg.style, arg.from, arg.to, arg.suffix, arg.mode, this.callback)
            }
        })
    }
    /**
     * 
     * @param {*} start 
     * @param {Number | 'mutation'} end 
     * @param {*} style 
     * @param {*} from 
     * @param {*} to 
     * @param {*} suffix 
     * @param {'linear' | 'ease-out'} mode 
     */
    add(start, end, style, from, to, suffix, mode = 'linear') {
        this.moveArgs.push({ start, end, style: style.split('.')[0], subType: style.split('.')[1], from, to, suffix, mode })
    }
}

class Video {
    /**
     * 
     * @param {String} id 
     * @param {Scene} scene 
     * @param {Number} step 标准步长（跨度）
     * @param {Number} multiple 
     * @param {Number} constant 
     * @param {Number} fix 步长修正倍数
     */
    constructor(id, scene, step, multiple, constant, fix = 1) {
        this.videoElement = document.getElementById(id)
        this.scene = scene
        this.step = step * fix
        this.start = this.step * multiple + constant
        var _this = this
        Event.listen('change', function(sceneLength) {
            _this.step = sceneLength * fix
            _this.start = _this.step * multiple + constant
        })
    }
    durationControl() {
        if(document.documentElement.scrollTop < this.start) {
            this.videoElement.currentTime = 0
        } else if(document.documentElement.scrollTop > this.start + this.step) {
            this.videoElement.currentTime = this.videoElement.duration
        } else {
            // 视频格式为 mp4 时会出错
            this.videoElement.currentTime = (document.documentElement.scrollTop - this.start) / this.step * this.videoElement.duration
        }
    }
}

class FadeInElement {
    /**
     * 淡入
     * @param { String } className css类名
     */
    constructor(className, callback = null) {
        this.elements = document.querySelectorAll(`.${className}`)
        this.callback = callback
    }

    fadeControl() {
        this.elements.forEach(element => {
            cssStyleCalculate(document.documentElement.scrollTop,
                element.offsetTop - document.documentElement.clientHeight + 100,
                element.offsetTop + element.offsetHeight - document.documentElement.clientHeight + 100,
                element, 'opacity', 0, 1)
        })
    }
}

/**
 * tranform 函数线性渐变
 * @param { HtmlElement } scene 所属场景
 * @param { Number } x1 x1
 * @param { Number } x2 x2
 * @param { HtmlElement } negative 从动元素
 * @param { String } transformOption 变换函数
 * @param { Number } y1 y1
 * @param { Number } y2 y2
 * @param { String } suffix 单位
 * @param {'linear' | 'ease-out'} mode 
 */
 function transformCalculate(scrollTop, x1, x2, negative, transformOption, y1, y2, suffix = '', mode = 'linear', callback = null) {
    negative.style.setProperty('transform', `${transformOption}(${
        scrollTop < x1 ? y1 : (scrollTop > x2 ? y2 : MODE[mode](scrollTop, x1, x2, y1, y2))
    }${suffix})`)
    callback && callback()
}
/**
 * css 属性线性渐变
 * @param { HtmlElement } scene 
 * @param { Number } x1 
 * @param { Number | 'mutation' } x2 渐变 | 突变
 * @param { HtmlElement } negative 
 * @param { String } cssStyle 
 * @param { Number } y1 
 * @param { Number } y2 
 * @param { String } suffix 单位
 * @param {'linear' | 'ease-out'} mode 
 */
function cssStyleCalculate(scrollTop, x1, x2, negative, cssStyle, y1, y2, suffix = '', mode = 'linear', callback = null) {
    let y = 0
    if(x2 === 'mutation') {
        negative.style.setProperty(cssStyle, scrollTop < x1 ? y1 : y2)
    } else {
        y = MODE[mode](scrollTop, x1, x2, y1, y2)
        negative.style.setProperty(cssStyle, `${
            scrollTop < x1 ? y1 : (scrollTop > x2 ? y2 : y)
        }${suffix}`)
    }
    callback && callback(y)
}

var Event = (function() {
    var global = this,
        Event,
        _default = 'default'
    
    Event = function() {
        var _listen,
            _trigger,
            _remove,
            _slice = Array.prototype.slice,
            _shift = Array.prototype.shift,
            _unshift = Array.prototype.unshift,
            namespaceCache = {},
            _create,
            find,
            each = function(ary, fn) {
                var ret
                for(var i = 0, l = ary.length; i < l; i++) {
                    var n = ary[i]
                    ret = fn.call(n, i, n)
                }
                return ret
            }

            _listen = function(key, fn, cache) {
                if(!cache[key]) {
                    cache[key] = []
                }
                cache[key].push(fn)
            }

            _remove = function(key, cache, fn) {
                if(cache[key]) {
                    if(fn) {
                        for(var i = cache[key].length; i >= 0; i++) {
                            if(cache[key][i] === fn) {
                                cache[key].splice(i, 1)
                            }
                        }
                    } else {
                        cache[key] = []
                    }
                }
            }

            _trigger = function() {
                var cache = _shift.call(arguments),
                    key = _shift.call(arguments),
                    args = arguments,
                    _self = this,
                    ret,
                    stack = cache[key]
                
                if(!stack || !stack.length) {
                    return
                }

                return each(stack, function() {
                    return this.apply(_self, args)
                })
            }

            _create = function(namespace) {
                var namespace = namespace || _default
                var cache = {},
                    offlineStack = [],
                    ret = {
                        listen: function(key, fn, last) {
                            _listen(key, fn, cache)
                            if(offlineStack === null) {
                                return
                            }
                            if(last === 'last') {
                                offlineStack.length && offlineStack.pop()()
                            } else {
                                each(offlineStack, function() {
                                    this()
                                })
                            }

                            offlineStack = null
                        },
                        one: function(key, fn, last) {
                            _remove(key, cache);
                            this.listen(key, fn, last)
                        },
                        remove: function(key, fn) {
                            _remove(key, cache, fn)
                        },
                        trigger: function() {
                            var fn,
                                args,
                                _self = this
                            
                            _unshift.call(arguments, cache)
                            args = arguments
                            fn = function() {
                                return _trigger.apply(_self, args)
                            }

                            if(offlineStack) {
                                return offlineStack.push(fn)
                            }
                            return fn()
                        }
                    }

                    return namespace ? 
                        (namespaceCache[namespace] ? namespaceCache[namespace] : namespaceCache[namespace] = ret)
                        : ret
            }

            return {
                create: _create,
                one: function(key, fn, last) {
                    var event = this.create()
                    event.one(key, fn, last)
                },
                remove: function(key, fn) {
                    var event = this.create()
                    event.remove(key, fn)
                },
                listen: function(key, fn, last) {
                    var event = this.create()
                    event.listen(key, fn, last)
                },
                trigger: function() {
                    var event = this.create()
                    event.trigger.apply(this, arguments)
                }
            }
    }()
    return Event
}())
