(function () {
    var window = this,
        undefined, _jQuery = window.jQuery,
        _$ = window.$,
        jQuery = window.jQuery = window.$ = function (selector, context) {
            return new jQuery.fn.init(selector, context)
        },
        quickExpr = /^[^<]*(<(.|\s)+>)[^>]*$|^#([\w-]+)$/,
        isSimple = /^.[^:#\[\.,]*$/;
    jQuery.fn = jQuery.prototype = {
        init: function (selector, context) {
            selector = selector || document;
            if (selector.nodeType) {
                this[0] = selector;
                this.length = 1;
                this.context = selector;
                return this
            }
            if (typeof selector === "string") {
                var match = quickExpr.exec(selector);
                if (match && (match[1] || !context)) {
                    if (match[1]) selector = jQuery.clean([match[1]], context);
                    else {
                        var elem = document.getElementById(match[3]);
                        if (elem && elem.id != match[3]) return jQuery().find(selector);
                        var ret = jQuery(elem || []);
                        ret.context = document;
                        ret.selector = selector;
                        return ret
                    }
                } else return jQuery(context).find(selector)
            } else if (jQuery.isFunction(selector)) return jQuery(document).ready(selector);
            if (selector.selector && selector.context) {
                this.selector = selector.selector;
                this.context = selector.context
            }
            return this.setArray(jQuery.isArray(selector) ? selector : jQuery.makeArray(selector))
        },
        selector: "",
        jquery: "1.3.2",
        size: function () {
            return this.length
        },
        get: function (num) {
            return num === undefined ? Array.prototype.slice.call(this) : this[num]
        },
        pushStack: function (elems, name, selector) {
            var ret = jQuery(elems);
            ret.prevObject = this;
            ret.context = this.context;
            if (name === "find") ret.selector = this.selector + (this.selector ? " " : "") + selector;
            else if (name) ret.selector = this.selector + "." + name + "(" + selector + ")";
            return ret
        },
        setArray: function (elems) {
            this.length = 0;
            Array.prototype.push.apply(this, elems);
            return this
        },
        each: function (callback, args) {
            return jQuery.each(this, callback, args)
        },
        index: function (elem) {
            return jQuery.inArray(elem && elem.jquery ? elem[0] : elem, this)
        },
        attr: function (name, value, type) {
            var options = name;
            if (typeof name === "string") if (value === undefined) return this[0] && jQuery[type || "attr"](this[0], name);
            else {
                options = {};
                options[name] = value
            }
            return this.each(function (i) {
                for (name in options) jQuery.attr(type ? this.style : this, name, jQuery.prop(this, options[name], type, i, name))
            })
        },
        css: function (key, value) {
            if ((key == 'width' || key == 'height') && parseFloat(value) < 0) value = undefined;
            return this.attr(key, value, "curCSS")
        },
        text: function (text) {
            if (typeof text !== "object" && text != null) return this.empty().append((this[0] && this[0].ownerDocument || document).createTextNode(text));
            var ret = "";
            jQuery.each(text || this, function () {
                jQuery.each(this.childNodes, function () {
                    if (this.nodeType != 8) ret += this.nodeType != 1 ? this.nodeValue : jQuery.fn.text([this])
                })
            });
            return ret
        },
        wrapAll: function (html) {
            if (this[0]) {
                var wrap = jQuery(html, this[0].ownerDocument).clone();
                if (this[0].parentNode) wrap.insertBefore(this[0]);
                wrap.map(function () {
                    var elem = this;
                    while (elem.firstChild) elem = elem.firstChild;
                    return elem
                }).append(this)
            }
            return this
        },
        wrapInner: function (html) {
            return this.each(function () {
                jQuery(this).contents().wrapAll(html)
            })
        },
        wrap: function (html) {
            return this.each(function () {
                jQuery(this).wrapAll(html)
            })
        },
        append: function () {
            return this.domManip(arguments, true, function (elem) {
                if (this.nodeType == 1) this.appendChild(elem)
            })
        },
        prepend: function () {
            return this.domManip(arguments, true, function (elem) {
                if (this.nodeType == 1) this.insertBefore(elem, this.firstChild)
            })
        },
        before: function () {
            return this.domManip(arguments, false, function (elem) {
                this.parentNode.insertBefore(elem, this)
            })
        },
        after: function () {
            return this.domManip(arguments, false, function (elem) {
                this.parentNode.insertBefore(elem, this.nextSibling)
            })
        },
        end: function () {
            return this.prevObject || jQuery([])
        },
        push: [].push,
        sort: [].sort,
        splice: [].splice,
        find: function (selector) {
            if (this.length === 1) {
                var ret = this.pushStack([], "find", selector);
                ret.length = 0;
                jQuery.find(selector, this[0], ret);
                return ret
            } else {
                return this.pushStack(jQuery.unique(jQuery.map(this, function (elem) {
                    return jQuery.find(selector, elem)
                })), "find", selector)
            }
        },
        clone: function (events) {
            var ret = this.map(function () {
                if (!jQuery.support.noCloneEvent && !jQuery.isXMLDoc(this)) {
                    var html = this.outerHTML;
                    if (!html) {
                        var div = this.ownerDocument.createElement("div");
                        div.appendChild(this.cloneNode(true));
                        html = div.innerHTML
                    }
                    return jQuery.clean([html.replace(/ jQuery\d+="(?:\d+|null)"/g, "").replace(/^\s*/, "")])[0]
                } else return this.cloneNode(true)
            });
            if (events === true) {
                var orig = this.find("*").andSelf(),
                    i = 0;
                ret.find("*").andSelf().each(function () {
                    if (this.nodeName !== orig[i].nodeName) return;
                    var events = jQuery.data(orig[i], "events");
                    for (var type in events) {
                        for (var handler in events[type]) {
                            jQuery.event.add(this, type, events[type][handler], events[type][handler].data)
                        }
                    }
                    i++
                })
            }
            return ret
        },
        filter: function (selector) {
            return this.pushStack(jQuery.isFunction(selector) && jQuery.grep(this, function (elem, i) {
                return selector.call(elem, i)
            }) || jQuery.multiFilter(selector, jQuery.grep(this, function (elem) {
                return elem.nodeType === 1
            })), "filter", selector)
        },
        closest: function (selector) {
            var pos = jQuery.expr.match.POS.test(selector) ? jQuery(selector) : null,
                closer = 0;
            return this.map(function () {
                var cur = this;
                while (cur && cur.ownerDocument) {
                    if (pos ? pos.index(cur) > -1 : jQuery(cur).is(selector)) {
                        jQuery.data(cur, "closest", closer);
                        return cur
                    }
                    cur = cur.parentNode;
                    closer++
                }
            })
        },
        not: function (selector) {
            if (typeof selector === "string") if (isSimple.test(selector)) return this.pushStack(jQuery.multiFilter(selector, this, true), "not", selector);
            else selector = jQuery.multiFilter(selector, this);
            var isArrayLike = selector.length && selector[selector.length - 1] !== undefined && !selector.nodeType;
            return this.filter(function () {
                return isArrayLike ? jQuery.inArray(this, selector) < 0 : this != selector
            })
        },
        add: function (selector) {
            return this.pushStack(jQuery.unique(jQuery.merge(this.get(), typeof selector === "string" ? jQuery(selector) : jQuery.makeArray(selector))))
        },
        is: function (selector) {
            return !!selector && jQuery.multiFilter(selector, this).length > 0
        },
        hasClass: function (selector) {
            return !!selector && this.is("." + selector)
        },
        val: function (value) {
            if (value === undefined) {
                var elem = this[0];
                if (elem) {
                    if (jQuery.nodeName(elem, 'option')) return (elem.attributes.value || {}).specified ? elem.value : elem.text;
                    if (jQuery.nodeName(elem, "select")) {
                        var index = elem.selectedIndex,
                            values = [],
                            options = elem.options,
                            one = elem.type == "select-one";
                        if (index < 0) return null;
                        for (var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++) {
                            var option = options[i];
                            if (option.selected) {
                                value = jQuery(option).val();
                                if (one) return value;
                                values.push(value)
                            }
                        }
                        return values
                    }
                    return (elem.value || "").replace(/\r/g, "")
                }
                return undefined
            }
            if (typeof value === "number") value += '';
            return this.each(function () {
                if (this.nodeType != 1) return;
                if (jQuery.isArray(value) && /radio|checkbox/.test(this.type)) this.checked = (jQuery.inArray(this.value, value) >= 0 || jQuery.inArray(this.name, value) >= 0);
                else if (jQuery.nodeName(this, "select")) {
                    var values = jQuery.makeArray(value);
                    jQuery("option", this).each(function () {
                        this.selected = (jQuery.inArray(this.value, values) >= 0 || jQuery.inArray(this.text, values) >= 0)
                    });
                    if (!values.length) this.selectedIndex = -1
                } else this.value = value
            })
        },
        html: function (value) {
            return value === undefined ? (this[0] ? this[0].innerHTML.replace(/ jQuery\d+="(?:\d+|null)"/g, "") : null) : this.empty().append(value)
        },
        replaceWith: function (value) {
            return this.after(value).remove()
        },
        eq: function (i) {
            return this.slice(i, +i + 1)
        },
        slice: function () {
            return this.pushStack(Array.prototype.slice.apply(this, arguments), "slice", Array.prototype.slice.call(arguments).join(","))
        },
        map: function (callback) {
            return this.pushStack(jQuery.map(this, function (elem, i) {
                return callback.call(elem, i, elem)
            }))
        },
        andSelf: function () {
            return this.add(this.prevObject)
        },
        domManip: function (args, table, callback) {
            if (this[0]) {
                var fragment = (this[0].ownerDocument || this[0]).createDocumentFragment(),
                    scripts = jQuery.clean(args, (this[0].ownerDocument || this[0]), fragment),
                    first = fragment.firstChild;
                if (first) for (var i = 0, l = this.length; i < l; i++) callback.call(root(this[i], first), this.length > 1 || i > 0 ? fragment.cloneNode(true) : fragment);
                if (scripts) jQuery.each(scripts, evalScript)
            }
            return this;

            function root(elem, cur) {
                return table && jQuery.nodeName(elem, "table") && jQuery.nodeName(cur, "tr") ? (elem.getElementsByTagName("tbody")[0] || elem.appendChild(elem.ownerDocument.createElement("tbody"))) : elem
            }
        }
    };
    jQuery.fn.init.prototype = jQuery.fn;

    function evalScript(i, elem) {
        if (elem.src) jQuery.ajax({
            url: elem.src,
            async: false,
            dataType: "script"
        });
        else jQuery.globalEval(elem.text || elem.textContent || elem.innerHTML || "");
        if (elem.parentNode) elem.parentNode.removeChild(elem)
    }
    function now() {
        return +new Date
    }
    jQuery.extend = jQuery.fn.extend = function () {
        var target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false,
            options;
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[1] || {};
            i = 2
        }
        if (typeof target !== "object" && !jQuery.isFunction(target)) target = {};
        if (length == i) {
            target = this;
            --i
        }
        for (; i < length; i++) if ((options = arguments[i]) != null) for (var name in options) {
            var src = target[name],
                copy = options[name];
            if (target === copy) continue;
            if (deep && copy && typeof copy === "object" && !copy.nodeType) target[name] = jQuery.extend(deep, src || (copy.length != null ? [] : {}), copy);
            else if (copy !== undefined) target[name] = copy
        }
        return target
    };
    var exclude = /z-?index|font-?weight|opacity|zoom|line-?height/i,
        defaultView = document.defaultView || {},
        toString = Object.prototype.toString;
    jQuery.extend({
        noConflict: function (deep) {
            window.$ = _$;
            if (deep) window.jQuery = _jQuery;
            return jQuery
        },
        isFunction: function (obj) {
            return toString.call(obj) === "[object Function]"
        },
        isArray: function (obj) {
            return toString.call(obj) === "[object Array]"
        },
        isXMLDoc: function (elem) {
            return elem.nodeType === 9 && elem.documentElement.nodeName !== "HTML" || !! elem.ownerDocument && jQuery.isXMLDoc(elem.ownerDocument)
        },
        globalEval: function (data) {
            if (data && /\S/.test(data)) {
                var head = document.getElementsByTagName("head")[0] || document.documentElement,
                    script = document.createElement("script");
                script.type = "text/javascript";
                if (jQuery.support.scriptEval) script.appendChild(document.createTextNode(data));
                else script.text = data;
                head.insertBefore(script, head.firstChild);
                head.removeChild(script)
            }
        },
        nodeName: function (elem, name) {
            return elem.nodeName && elem.nodeName.toUpperCase() == name.toUpperCase()
        },
        each: function (object, callback, args) {
            var name, i = 0,
                length = object.length;
            if (args) {
                if (length === undefined) {
                    for (name in object) if (callback.apply(object[name], args) === false) break
                } else for (; i < length;) if (callback.apply(object[i++], args) === false) break
            } else {
                if (length === undefined) {
                    for (name in object) if (callback.call(object[name], name, object[name]) === false) break
                } else for (var value = object[0]; i < length && callback.call(value, i, value) !== false; value = object[++i]) {}
            }
            return object
        },
        prop: function (elem, value, type, i, name) {
            if (jQuery.isFunction(value)) value = value.call(elem, i);
            return typeof value === "number" && type == "curCSS" && !exclude.test(name) ? value + "px" : value
        },
        className: {
            add: function (elem, classNames) {
                jQuery.each((classNames || "").split(/\s+/), function (i, className) {
                    if (elem.nodeType == 1 && !jQuery.className.has(elem.className, className)) elem.className += (elem.className ? " " : "") + className
                })
            },
            remove: function (elem, classNames) {
                if (elem.nodeType == 1) elem.className = classNames !== undefined ? jQuery.grep(elem.className.split(/\s+/), function (className) {
                    return !jQuery.className.has(classNames, className)
                }).join(" ") : ""
            },
            has: function (elem, className) {
                return elem && jQuery.inArray(className, (elem.className || elem).toString().split(/\s+/)) > -1
            }
        },
        swap: function (elem, options, callback) {
            var old = {};
            for (var name in options) {
                old[name] = elem.style[name];
                elem.style[name] = options[name]
            }
            callback.call(elem);
            for (var name in options) elem.style[name] = old[name]
        },
        css: function (elem, name, force, extra) {
            if (name == "width" || name == "height") {
                var val, props = {
                    position: "absolute",
                    visibility: "hidden",
                    display: "block"
                },
                    which = name == "width" ? ["Left", "Right"] : ["Top", "Bottom"];

                function getWH() {
                    val = name == "width" ? elem.offsetWidth : elem.offsetHeight;
                    if (extra === "border") return;
                    jQuery.each(which, function () {
                        if (!extra) val -= parseFloat(jQuery.curCSS(elem, "padding" + this, true)) || 0;
                        if (extra === "margin") val += parseFloat(jQuery.curCSS(elem, "margin" + this, true)) || 0;
                        else val -= parseFloat(jQuery.curCSS(elem, "border" + this + "Width", true)) || 0
                    })
                }
                if (elem.offsetWidth !== 0) getWH();
                else jQuery.swap(elem, props, getWH);
                return Math.max(0, Math.round(val))
            }
            return jQuery.curCSS(elem, name, force)
        },
        curCSS: function (elem, name, force) {
            var ret, style = elem.style;
            if (name == "opacity" && !jQuery.support.opacity) {
                ret = jQuery.attr(style, "opacity");
                return ret == "" ? "1" : ret
            }
            if (name.match(/float/i)) name = styleFloat;
            if (!force && style && style[name]) ret = style[name];
            else if (defaultView.getComputedStyle) {
                if (name.match(/float/i)) name = "float";
                name = name.replace(/([A-Z])/g, "-$1").toLowerCase();
                var computedStyle = defaultView.getComputedStyle(elem, null);
                if (computedStyle) ret = computedStyle.getPropertyValue(name);
                if (name == "opacity" && ret == "") ret = "1"
            } else if (elem.currentStyle) {
                var camelCase = name.replace(/\-(\w)/g, function (all, letter) {
                    return letter.toUpperCase()
                });
                ret = elem.currentStyle[name] || elem.currentStyle[camelCase];
                if (!/^\d+(px)?$/i.test(ret) && /^\d/.test(ret)) {
                    var left = style.left,
                        rsLeft = elem.runtimeStyle.left;
                    elem.runtimeStyle.left = elem.currentStyle.left;
                    style.left = ret || 0;
                    ret = style.pixelLeft + "px";
                    style.left = left;
                    elem.runtimeStyle.left = rsLeft
                }
            }
            return ret
        },
        clean: function (elems, context, fragment) {
            context = context || document;
            if (typeof context.createElement === "undefined") context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
            if (!fragment && elems.length === 1 && typeof elems[0] === "string") {
                var match = /^<(\w+)\s*\/?>$/.exec(elems[0]);
                if (match) return [context.createElement(match[1])]
            }
            var ret = [],
                scripts = [],
                div = context.createElement("div");
            jQuery.each(elems, function (i, elem) {
                if (typeof elem === "number") elem += '';
                if (!elem) return;
                if (typeof elem === "string") {
                    elem = elem.replace(/(<(\w+)[^>]*?)\/>/g, function (all, front, tag) {
                        return tag.match(/^(abbr|br|col|img|input|link|meta|param|hr|area|embed)$/i) ? all : front + "></" + tag + ">"
                    });
                    var tags = elem.replace(/^\s+/, "").substring(0, 10).toLowerCase();
                    var wrap = !tags.indexOf("<opt") && [1, "<select multiple='multiple'>", "</select>"] || !tags.indexOf("<leg") && [1, "<fieldset>", "</fieldset>"] || tags.match(/^<(thead|tbody|tfoot|colg|cap)/) && [1, "<table>", "</table>"] || !tags.indexOf("<tr") && [2, "<table><tbody>", "</tbody></table>"] || (!tags.indexOf("<td") || !tags.indexOf("<th")) && [3, "<table><tbody><tr>", "</tr></tbody></table>"] || !tags.indexOf("<col") && [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"] || !jQuery.support.htmlSerialize && [1, "div<div>", "</div>"] || [0, "", ""];
                    div.innerHTML = wrap[1] + elem + wrap[2];
                    while (wrap[0]--) div = div.lastChild;
                    if (!jQuery.support.tbody) {
                        var hasBody = /<tbody/i.test(elem),
                            tbody = !tags.indexOf("<table") && !hasBody ? div.firstChild && div.firstChild.childNodes : wrap[1] == "<table>" && !hasBody ? div.childNodes : [];
                        for (var j = tbody.length - 1; j >= 0; --j) if (jQuery.nodeName(tbody[j], "tbody") && !tbody[j].childNodes.length) tbody[j].parentNode.removeChild(tbody[j])
                    }
                    if (!jQuery.support.leadingWhitespace && /^\s/.test(elem)) div.insertBefore(context.createTextNode(elem.match(/^\s*/)[0]), div.firstChild);
                    elem = jQuery.makeArray(div.childNodes)
                }
                if (elem.nodeType) ret.push(elem);
                else ret = jQuery.merge(ret, elem)
            });
            if (fragment) {
                for (var i = 0; ret[i]; i++) {
                    if (jQuery.nodeName(ret[i], "script") && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript")) {
                        scripts.push(ret[i].parentNode ? ret[i].parentNode.removeChild(ret[i]) : ret[i])
                    } else {
                        if (ret[i].nodeType === 1) ret.splice.apply(ret, [i + 1, 0].concat(jQuery.makeArray(ret[i].getElementsByTagName("script"))));
                        fragment.appendChild(ret[i])
                    }
                }
                return scripts
            }
            return ret
        },
        attr: function (elem, name, value) {
            if (!elem || elem.nodeType == 3 || elem.nodeType == 8) return undefined;
            var notxml = !jQuery.isXMLDoc(elem),
                set = value !== undefined;
            name = notxml && jQuery.props[name] || name;
            if (elem.tagName) {
                var special = /href|src|style/.test(name);
                if (name == "selected" && elem.parentNode) elem.parentNode.selectedIndex;
                if (name in elem && notxml && !special) {
                    if (set) {
                        if (name == "type" && jQuery.nodeName(elem, "input") && elem.parentNode) throw "type property can't be changed";
                        elem[name] = value
                    }
                    if (jQuery.nodeName(elem, "form") && elem.getAttributeNode(name)) return elem.getAttributeNode(name).nodeValue;
                    if (name == "tabIndex") {
                        var attributeNode = elem.getAttributeNode("tabIndex");
                        return attributeNode && attributeNode.specified ? attributeNode.value : elem.nodeName.match(/(button|input|object|select|textarea)/i) ? 0 : elem.nodeName.match(/^(a|area)$/i) && elem.href ? 0 : undefined
                    }
                    return elem[name]
                }
                if (!jQuery.support.style && notxml && name == "style") return jQuery.attr(elem.style, "cssText", value);
                if (set) elem.setAttribute(name, "" + value);
                var attr = !jQuery.support.hrefNormalized && notxml && special ? elem.getAttribute(name, 2) : elem.getAttribute(name);
                return attr === null ? undefined : attr
            }
            if (!jQuery.support.opacity && name == "opacity") {
                if (set) {
                    elem.zoom = 1;
                    elem.filter = (elem.filter || "").replace(/alpha\([^)]*\)/, "") + (parseInt(value) + '' == "NaN" ? "" : "alpha(opacity=" + value * 100 + ")")
                }
                return elem.filter && elem.filter.indexOf("opacity=") >= 0 ? (parseFloat(elem.filter.match(/opacity=([^)]*)/)[1]) / 100) + '' : ""
            }
            name = name.replace(/-([a-z])/ig, function (all, letter) {
                return letter.toUpperCase()
            });
            if (set) elem[name] = value;
            return elem[name]
        },
        trim: function (text) {
            return (text || "").replace(/^\s+|\s+$/g, "")
        },
        makeArray: function (array) {
            var ret = [];
            if (array != null) {
                var i = array.length;
                if (i == null || typeof array === "string" || jQuery.isFunction(array) || array.setInterval) ret[0] = array;
                else while (i) ret[--i] = array[i]
            }
            return ret
        },
        inArray: function (elem, array) {
            for (var i = 0, length = array.length; i < length; i++) if (array[i] === elem) return i;
            return -1
        },
        merge: function (first, second) {
            var i = 0,
                elem, pos = first.length;
            if (!jQuery.support.getAll) {
                while ((elem = second[i++]) != null) if (elem.nodeType != 8) first[pos++] = elem
            } else while ((elem = second[i++]) != null) first[pos++] = elem;
            return first
        },
        unique: function (array) {
            var ret = [],
                done = {};
            try {
                for (var i = 0, length = array.length; i < length; i++) {
                    var id = jQuery.data(array[i]);
                    if (!done[id]) {
                        done[id] = true;
                        ret.push(array[i])
                    }
                }
            } catch (e) {
                ret = array
            }
            return ret
        },
        grep: function (elems, callback, inv) {
            var ret = [];
            for (var i = 0, length = elems.length; i < length; i++) if (!inv != !callback(elems[i], i)) ret.push(elems[i]);
            return ret
        },
        map: function (elems, callback) {
            var ret = [];
            for (var i = 0, length = elems.length; i < length; i++) {
                var value = callback(elems[i], i);
                if (value != null) ret[ret.length] = value
            }
            return ret.concat.apply([], ret)
        }
    });
    var userAgent = navigator.userAgent.toLowerCase();
    jQuery.browser = {
        version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [0, '0'])[1],
        safari: /webkit/.test(userAgent),
        opera: /opera/.test(userAgent),
        msie: /msie/.test(userAgent) && !/opera/.test(userAgent),
        mozilla: /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent)
    };
    jQuery.each({
        parent: function (elem) {
            return elem.parentNode
        },
        parents: function (elem) {
            return jQuery.dir(elem, "parentNode")
        },
        next: function (elem) {
            return jQuery.nth(elem, 2, "nextSibling")
        },
        prev: function (elem) {
            return jQuery.nth(elem, 2, "previousSibling")
        },
        nextAll: function (elem) {
            return jQuery.dir(elem, "nextSibling")
        },
        prevAll: function (elem) {
            return jQuery.dir(elem, "previousSibling")
        },
        siblings: function (elem) {
            return jQuery.sibling(elem.parentNode.firstChild, elem)
        },
        children: function (elem) {
            return jQuery.sibling(elem.firstChild)
        },
        contents: function (elem) {
            return jQuery.nodeName(elem, "iframe") ? elem.contentDocument || elem.contentWindow.document : jQuery.makeArray(elem.childNodes)
        }
    }, function (name, fn) {
        jQuery.fn[name] = function (selector) {
            var ret = jQuery.map(this, fn);
            if (selector && typeof selector == "string") ret = jQuery.multiFilter(selector, ret);
            return this.pushStack(jQuery.unique(ret), name, selector)
        }
    });
    jQuery.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function (name, original) {
        jQuery.fn[name] = function (selector) {
            var ret = [],
                insert = jQuery(selector);
            for (var i = 0, l = insert.length; i < l; i++) {
                var elems = (i > 0 ? this.clone(true) : this).get();
                jQuery.fn[original].apply(jQuery(insert[i]), elems);
                ret = ret.concat(elems)
            }
            return this.pushStack(ret, name, selector)
        }
    });
    jQuery.each({
        removeAttr: function (name) {
            jQuery.attr(this, name, "");
            if (this.nodeType == 1) this.removeAttribute(name)
        },
        addClass: function (classNames) {
            jQuery.className.add(this, classNames)
        },
        removeClass: function (classNames) {
            jQuery.className.remove(this, classNames)
        },
        toggleClass: function (classNames, state) {
            if (typeof state !== "boolean") state = !jQuery.className.has(this, classNames);
            jQuery.className[state ? "add" : "remove"](this, classNames)
        },
        remove: function (selector) {
            if (!selector || jQuery.filter(selector, [this]).length) {
                jQuery("*", this).add([this]).each(function () {
                    jQuery.event.remove(this);
                    jQuery.removeData(this)
                });
                if (this.parentNode) this.parentNode.removeChild(this)
            }
        },
        empty: function () {
            jQuery(this).children().remove();
            while (this.firstChild) this.removeChild(this.firstChild)
        }
    }, function (name, fn) {
        jQuery.fn[name] = function () {
            return this.each(fn, arguments)
        }
    });

    function num(elem, prop) {
        return elem[0] && parseInt(jQuery.curCSS(elem[0], prop, true), 10) || 0
    }
    var expando = "jQuery" + now(),
        uuid = 0,
        windowData = {};
    jQuery.extend({
        cache: {},
        data: function (elem, name, data) {
            elem = elem == window ? windowData : elem;
            var id = elem[expando];
            if (!id) id = elem[expando] = ++uuid;
            if (name && !jQuery.cache[id]) jQuery.cache[id] = {};
            if (data !== undefined) jQuery.cache[id][name] = data;
            return name ? jQuery.cache[id][name] : id
        },
        removeData: function (elem, name) {
            elem = elem == window ? windowData : elem;
            var id = elem[expando];
            if (name) {
                if (jQuery.cache[id]) {
                    delete jQuery.cache[id][name];
                    name = "";
                    for (name in jQuery.cache[id]) break;
                    if (!name) jQuery.removeData(elem)
                }
            } else {
                try {
                    delete elem[expando]
                } catch (e) {
                    if (elem.removeAttribute) elem.removeAttribute(expando)
                }
                delete jQuery.cache[id]
            }
        },
        queue: function (elem, type, data) {
            if (elem) {
                type = (type || "fx") + "queue";
                var q = jQuery.data(elem, type);
                if (!q || jQuery.isArray(data)) q = jQuery.data(elem, type, jQuery.makeArray(data));
                else if (data) q.push(data)
            }
            return q
        },
        dequeue: function (elem, type) {
            var queue = jQuery.queue(elem, type),
                fn = queue.shift();
            if (!type || type === "fx") fn = queue[0];
            if (fn !== undefined) fn.call(elem)
        }
    });
    jQuery.fn.extend({
        data: function (key, value) {
            var parts = key.split(".");
            parts[1] = parts[1] ? "." + parts[1] : "";
            if (value === undefined) {
                var data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);
                if (data === undefined && this.length) data = jQuery.data(this[0], key);
                return data === undefined && parts[1] ? this.data(parts[0]) : data
            } else return this.trigger("setData" + parts[1] + "!", [parts[0], value]).each(function () {
                jQuery.data(this, key, value)
            })
        },
        removeData: function (key) {
            return this.each(function () {
                jQuery.removeData(this, key)
            })
        },
        queue: function (type, data) {
            if (typeof type !== "string") {
                data = type;
                type = "fx"
            }
            if (data === undefined) return jQuery.queue(this[0], type);
            return this.each(function () {
                var queue = jQuery.queue(this, type, data);
                if (type == "fx" && queue.length == 1) queue[0].call(this)
            })
        },
        dequeue: function (type) {
            return this.each(function () {
                jQuery.dequeue(this, type)
            })
        }
    });
    (function () {
        var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?/g,
            done = 0,
            toString = Object.prototype.toString;
        var Sizzle = function (selector, context, results, seed) {
            results = results || [];
            context = context || document;
            if (context.nodeType !== 1 && context.nodeType !== 9) return [];
            if (!selector || typeof selector !== "string") {
                return results
            }
            var parts = [],
                m, set, checkSet, check, mode, extra, prune = true;
            chunker.lastIndex = 0;
            while ((m = chunker.exec(selector)) !== null) {
                parts.push(m[1]);
                if (m[2]) {
                    extra = RegExp.rightContext;
                    break
                }
            }
            if (parts.length > 1 && origPOS.exec(selector)) {
                if (parts.length === 2 && Expr.relative[parts[0]]) {
                    set = posProcess(parts[0] + parts[1], context)
                } else {
                    set = Expr.relative[parts[0]] ? [context] : Sizzle(parts.shift(), context);
                    while (parts.length) {
                        selector = parts.shift();
                        if (Expr.relative[selector]) selector += parts.shift();
                        set = posProcess(selector, set)
                    }
                }
            } else {
                var ret = seed ? {
                    expr: parts.pop(),
                    set: makeArray(seed)
                } : Sizzle.find(parts.pop(), parts.length === 1 && context.parentNode ? context.parentNode : context, isXML(context));
                set = Sizzle.filter(ret.expr, ret.set);
                if (parts.length > 0) {
                    checkSet = makeArray(set)
                } else {
                    prune = false
                }
                while (parts.length) {
                    var cur = parts.pop(),
                        pop = cur;
                    if (!Expr.relative[cur]) {
                        cur = ""
                    } else {
                        pop = parts.pop()
                    }
                    if (pop == null) {
                        pop = context
                    }
                    Expr.relative[cur](checkSet, pop, isXML(context))
                }
            }
            if (!checkSet) {
                checkSet = set
            }
            if (!checkSet) {
                throw "Syntax error, unrecognized expression: " + (cur || selector)
            }
            if (toString.call(checkSet) === "[object Array]") {
                if (!prune) {
                    results.push.apply(results, checkSet)
                } else if (context.nodeType === 1) {
                    for (var i = 0; checkSet[i] != null; i++) {
                        if (checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && contains(context, checkSet[i]))) {
                            results.push(set[i])
                        }
                    }
                } else {
                    for (var i = 0; checkSet[i] != null; i++) {
                        if (checkSet[i] && checkSet[i].nodeType === 1) {
                            results.push(set[i])
                        }
                    }
                }
            } else {
                makeArray(checkSet, results)
            }
            if (extra) {
                Sizzle(extra, context, results, seed);
                if (sortOrder) {
                    hasDuplicate = false;
                    results.sort(sortOrder);
                    if (hasDuplicate) {
                        for (var i = 1; i < results.length; i++) {
                            if (results[i] === results[i - 1]) {
                                results.splice(i--, 1)
                            }
                        }
                    }
                }
            }
            return results
        };
        Sizzle.matches = function (expr, set) {
            return Sizzle(expr, null, null, set)
        };
        Sizzle.find = function (expr, context, isXML) {
            var set, match;
            if (!expr) {
                return []
            }
            for (var i = 0, l = Expr.order.length; i < l; i++) {
                var type = Expr.order[i],
                    match;
                if ((match = Expr.match[type].exec(expr))) {
                    var left = RegExp.leftContext;
                    if (left.substr(left.length - 1) !== "\\") {
                        match[1] = (match[1] || "").replace(/\\/g, "");
                        set = Expr.find[type](match, context, isXML);
                        if (set != null) {
                            expr = expr.replace(Expr.match[type], "");
                            break
                        }
                    }
                }
            }
            if (!set) {
                set = context.getElementsByTagName("*")
            }
            return {
                set: set,
                expr: expr
            }
        };
        Sizzle.filter = function (expr, set, inplace, not) {
            var old = expr,
                result = [],
                curLoop = set,
                match, anyFound, isXMLFilter = set && set[0] && isXML(set[0]);
            while (expr && set.length) {
                for (var type in Expr.filter) {
                    if ((match = Expr.match[type].exec(expr)) != null) {
                        var filter = Expr.filter[type],
                            found, item;
                        anyFound = false;
                        if (curLoop == result) {
                            result = []
                        }
                        if (Expr.preFilter[type]) {
                            match = Expr.preFilter[type](match, curLoop, inplace, result, not, isXMLFilter);
                            if (!match) {
                                anyFound = found = true
                            } else if (match === true) {
                                continue
                            }
                        }
                        if (match) {
                            for (var i = 0;
                            (item = curLoop[i]) != null; i++) {
                                if (item) {
                                    found = filter(item, match, i, curLoop);
                                    var pass = not ^ !! found;
                                    if (inplace && found != null) {
                                        if (pass) {
                                            anyFound = true
                                        } else {
                                            curLoop[i] = false
                                        }
                                    } else if (pass) {
                                        result.push(item);
                                        anyFound = true
                                    }
                                }
                            }
                        }
                        if (found !== undefined) {
                            if (!inplace) {
                                curLoop = result
                            }
                            expr = expr.replace(Expr.match[type], "");
                            if (!anyFound) {
                                return []
                            }
                            break
                        }
                    }
                }
                if (expr == old) {
                    if (anyFound == null) {
                        throw "Syntax error, unrecognized expression: " + expr
                    } else {
                        break
                    }
                }
                old = expr
            }
            return curLoop
        };
        var Expr = Sizzle.selectors = {
            order: ["ID", "NAME", "TAG"],
            match: {
                ID: /#((?:[\w\u00c0-\uFFFF_-]|\\.)+)/,
                CLASS: /\.((?:[\w\u00c0-\uFFFF_-]|\\.)+)/,
                NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF_-]|\\.)+)['"]*\]/,
                ATTR: /\[\s*((?:[\w\u00c0-\uFFFF_-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,
                TAG: /^((?:[\w\u00c0-\uFFFF\*_-]|\\.)+)/,
                CHILD: /:(only|nth|last|first)-child(?:\((even|odd|[\dn+-]*)\))?/,
                POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^-]|$)/,
                PSEUDO: /:((?:[\w\u00c0-\uFFFF_-]|\\.)+)(?:\((['"]*)((?:\([^\)]+\)|[^\2\(\)]*)+)\2\))?/
            },
            attrMap: {
                "class": "className",
                "for": "htmlFor"
            },
            attrHandle: {
                href: function (elem) {
                    return elem.getAttribute("href")
                }
            },
            relative: {
                "+": function (checkSet, part, isXML) {
                    var isPartStr = typeof part === "string",
                        isTag = isPartStr && !/\W/.test(part),
                        isPartStrNotTag = isPartStr && !isTag;
                    if (isTag && !isXML) {
                        part = part.toUpperCase()
                    }
                    for (var i = 0, l = checkSet.length, elem; i < l; i++) {
                        if ((elem = checkSet[i])) {
                            while ((elem = elem.previousSibling) && elem.nodeType !== 1) {}
                            checkSet[i] = isPartStrNotTag || elem && elem.nodeName === part ? elem || false : elem === part
                        }
                    }
                    if (isPartStrNotTag) {
                        Sizzle.filter(part, checkSet, true)
                    }
                },
                ">": function (checkSet, part, isXML) {
                    var isPartStr = typeof part === "string";
                    if (isPartStr && !/\W/.test(part)) {
                        part = isXML ? part : part.toUpperCase();
                        for (var i = 0, l = checkSet.length; i < l; i++) {
                            var elem = checkSet[i];
                            if (elem) {
                                var parent = elem.parentNode;
                                checkSet[i] = parent.nodeName === part ? parent : false
                            }
                        }
                    } else {
                        for (var i = 0, l = checkSet.length; i < l; i++) {
                            var elem = checkSet[i];
                            if (elem) {
                                checkSet[i] = isPartStr ? elem.parentNode : elem.parentNode === part
                            }
                        }
                        if (isPartStr) {
                            Sizzle.filter(part, checkSet, true)
                        }
                    }
                },
                "": function (checkSet, part, isXML) {
                    var doneName = done++,
                        checkFn = dirCheck;
                    if (!part.match(/\W/)) {
                        var nodeCheck = part = isXML ? part : part.toUpperCase();
                        checkFn = dirNodeCheck
                    }
                    checkFn("parentNode", part, doneName, checkSet, nodeCheck, isXML)
                },
                "~": function (checkSet, part, isXML) {
                    var doneName = done++,
                        checkFn = dirCheck;
                    if (typeof part === "string" && !part.match(/\W/)) {
                        var nodeCheck = part = isXML ? part : part.toUpperCase();
                        checkFn = dirNodeCheck
                    }
                    checkFn("previousSibling", part, doneName, checkSet, nodeCheck, isXML)
                }
            },
            find: {
                ID: function (match, context, isXML) {
                    if (typeof context.getElementById !== "undefined" && !isXML) {
                        var m = context.getElementById(match[1]);
                        return m ? [m] : []
                    }
                },
                NAME: function (match, context, isXML) {
                    if (typeof context.getElementsByName !== "undefined") {
                        var ret = [],
                            results = context.getElementsByName(match[1]);
                        for (var i = 0, l = results.length; i < l; i++) {
                            if (results[i].getAttribute("name") === match[1]) {
                                ret.push(results[i])
                            }
                        }
                        return ret.length === 0 ? null : ret
                    }
                },
                TAG: function (match, context) {
                    return context.getElementsByTagName(match[1])
                }
            },
            preFilter: {
                CLASS: function (match, curLoop, inplace, result, not, isXML) {
                    match = " " + match[1].replace(/\\/g, "") + " ";
                    if (isXML) {
                        return match
                    }
                    for (var i = 0, elem;
                    (elem = curLoop[i]) != null; i++) {
                        if (elem) {
                            if (not ^ (elem.className && (" " + elem.className + " ").indexOf(match) >= 0)) {
                                if (!inplace) result.push(elem)
                            } else if (inplace) {
                                curLoop[i] = false
                            }
                        }
                    }
                    return false
                },
                ID: function (match) {
                    return match[1].replace(/\\/g, "")
                },
                TAG: function (match, curLoop) {
                    for (var i = 0; curLoop[i] === false; i++) {}
                    return curLoop[i] && isXML(curLoop[i]) ? match[1] : match[1].toUpperCase()
                },
                CHILD: function (match) {
                    if (match[1] == "nth") {
                        var test = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(match[2] == "even" && "2n" || match[2] == "odd" && "2n+1" || !/\D/.test(match[2]) && "0n+" + match[2] || match[2]);
                        match[2] = (test[1] + (test[2] || 1)) - 0;
                        match[3] = test[3] - 0
                    }
                    match[0] = done++;
                    return match
                },
                ATTR: function (match, curLoop, inplace, result, not, isXML) {
                    var name = match[1].replace(/\\/g, "");
                    if (!isXML && Expr.attrMap[name]) {
                        match[1] = Expr.attrMap[name]
                    }
                    if (match[2] === "~=") {
                        match[4] = " " + match[4] + " "
                    }
                    return match
                },
                PSEUDO: function (match, curLoop, inplace, result, not) {
                    if (match[1] === "not") {
                        if (match[3].match(chunker).length > 1 || /^\w/.test(match[3])) {
                            match[3] = Sizzle(match[3], null, null, curLoop)
                        } else {
                            var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);
                            if (!inplace) {
                                result.push.apply(result, ret)
                            }
                            return false
                        }
                    } else if (Expr.match.POS.test(match[0]) || Expr.match.CHILD.test(match[0])) {
                        return true
                    }
                    return match
                },
                POS: function (match) {
                    match.unshift(true);
                    return match
                }
            },
            filters: {
                enabled: function (elem) {
                    return elem.disabled === false && elem.type !== "hidden"
                },
                disabled: function (elem) {
                    return elem.disabled === true
                },
                checked: function (elem) {
                    return elem.checked === true
                },
                selected: function (elem) {
                    elem.parentNode.selectedIndex;
                    return elem.selected === true
                },
                parent: function (elem) {
                    return !!elem.firstChild
                },
                empty: function (elem) {
                    return !elem.firstChild
                },
                has: function (elem, i, match) {
                    return !!Sizzle(match[3], elem).length
                },
                header: function (elem) {
                    return /h\d/i.test(elem.nodeName)
                },
                text: function (elem) {
                    return "text" === elem.type
                },
                radio: function (elem) {
                    return "radio" === elem.type
                },
                checkbox: function (elem) {
                    return "checkbox" === elem.type
                },
                file: function (elem) {
                    return "file" === elem.type
                },
                password: function (elem) {
                    return "password" === elem.type
                },
                submit: function (elem) {
                    return "submit" === elem.type
                },
                image: function (elem) {
                    return "image" === elem.type
                },
                reset: function (elem) {
                    return "reset" === elem.type
                },
                button: function (elem) {
                    return "button" === elem.type || elem.nodeName.toUpperCase() === "BUTTON"
                },
                input: function (elem) {
                    return /input|select|textarea|button/i.test(elem.nodeName)
                }
            },
            setFilters: {
                first: function (elem, i) {
                    return i === 0
                },
                last: function (elem, i, match, array) {
                    return i === array.length - 1
                },
                even: function (elem, i) {
                    return i % 2 === 0
                },
                odd: function (elem, i) {
                    return i % 2 === 1
                },
                lt: function (elem, i, match) {
                    return i < match[3] - 0
                },
                gt: function (elem, i, match) {
                    return i > match[3] - 0
                },
                nth: function (elem, i, match) {
                    return match[3] - 0 == i
                },
                eq: function (elem, i, match) {
                    return match[3] - 0 == i
                }
            },
            filter: {
                PSEUDO: function (elem, match, i, array) {
                    var name = match[1],
                        filter = Expr.filters[name];
                    if (filter) {
                        return filter(elem, i, match, array)
                    } else if (name === "contains") {
                        return (elem.textContent || elem.innerText || "").indexOf(match[3]) >= 0
                    } else if (name === "not") {
                        var not = match[3];
                        for (var i = 0, l = not.length; i < l; i++) {
                            if (not[i] === elem) {
                                return false
                            }
                        }
                        return true
                    }
                },
                CHILD: function (elem, match) {
                    var type = match[1],
                        node = elem;
                    switch (type) {
                    case 'only':
                    case 'first':
                        while (node = node.previousSibling) {
                            if (node.nodeType === 1) return false
                        }
                        if (type == 'first') return true;
                        node = elem;
                    case 'last':
                        while (node = node.nextSibling) {
                            if (node.nodeType === 1) return false
                        }
                        return true;
                    case 'nth':
                        var first = match[2],
                            last = match[3];
                        if (first == 1 && last == 0) {
                            return true
                        }
                        var doneName = match[0],
                            parent = elem.parentNode;
                        if (parent && (parent.sizcache !== doneName || !elem.nodeIndex)) {
                            var count = 0;
                            for (node = parent.firstChild; node; node = node.nextSibling) {
                                if (node.nodeType === 1) {
                                    node.nodeIndex = ++count
                                }
                            }
                            parent.sizcache = doneName
                        }
                        var diff = elem.nodeIndex - last;
                        if (first == 0) {
                            return diff == 0
                        } else {
                            return (diff % first == 0 && diff / first >= 0)
                        }
                    }
                },
                ID: function (elem, match) {
                    return elem.nodeType === 1 && elem.getAttribute("id") === match
                },
                TAG: function (elem, match) {
                    return (match === "*" && elem.nodeType === 1) || elem.nodeName === match
                },
                CLASS: function (elem, match) {
                    return (" " + (elem.className || elem.getAttribute("class")) + " ").indexOf(match) > -1
                },
                ATTR: function (elem, match) {
                    var name = match[1],
                        result = Expr.attrHandle[name] ? Expr.attrHandle[name](elem) : elem[name] != null ? elem[name] : elem.getAttribute(name),
                        value = result + "",
                        type = match[2],
                        check = match[4];
                    return result == null ? type === "!=" : type === "=" ? value === check : type === "*=" ? value.indexOf(check) >= 0 : type === "~=" ? (" " + value + " ").indexOf(check) >= 0 : !check ? value && result !== false : type === "!=" ? value != check : type === "^=" ? value.indexOf(check) === 0 : type === "$=" ? value.substr(value.length - check.length) === check : type === "|=" ? value === check || value.substr(0, check.length + 1) === check + "-" : false
                },
                POS: function (elem, match, i, array) {
                    var name = match[2],
                        filter = Expr.setFilters[name];
                    if (filter) {
                        return filter(elem, i, match, array)
                    }
                }
            }
        };
        var origPOS = Expr.match.POS;
        for (var type in Expr.match) {
            Expr.match[type] = RegExp(Expr.match[type].source + /(?![^\[]*\])(?![^\(]*\))/.source)
        }
        var makeArray = function (array, results) {
            array = Array.prototype.slice.call(array);
            if (results) {
                results.push.apply(results, array);
                return results
            }
            return array
        };
        try {
            Array.prototype.slice.call(document.documentElement.childNodes)
        } catch (e) {
            makeArray = function (array, results) {
                var ret = results || [];
                if (toString.call(array) === "[object Array]") {
                    Array.prototype.push.apply(ret, array)
                } else {
                    if (typeof array.length === "number") {
                        for (var i = 0, l = array.length; i < l; i++) {
                            ret.push(array[i])
                        }
                    } else {
                        for (var i = 0; array[i]; i++) {
                            ret.push(array[i])
                        }
                    }
                }
                return ret
            }
        }
        var sortOrder;
        if (document.documentElement.compareDocumentPosition) {
            sortOrder = function (a, b) {
                var ret = a.compareDocumentPosition(b) & 4 ? -1 : a === b ? 0 : 1;
                if (ret === 0) {
                    hasDuplicate = true
                }
                return ret
            }
        } else if ("sourceIndex" in document.documentElement) {
            sortOrder = function (a, b) {
                var ret = a.sourceIndex - b.sourceIndex;
                if (ret === 0) {
                    hasDuplicate = true
                }
                return ret
            }
        } else if (document.createRange) {
            sortOrder = function (a, b) {
                var aRange = a.ownerDocument.createRange(),
                    bRange = b.ownerDocument.createRange();
                aRange.selectNode(a);
                aRange.collapse(true);
                bRange.selectNode(b);
                bRange.collapse(true);
                var ret = aRange.compareBoundaryPoints(Range.START_TO_END, bRange);
                if (ret === 0) {
                    hasDuplicate = true
                }
                return ret
            }
        }(function () {
            var form = document.createElement("form"),
                id = "script" + (new Date).getTime();
            form.innerHTML = "<input name='" + id + "'/>";
            var root = document.documentElement;
            root.insertBefore(form, root.firstChild);
            if ( !! document.getElementById(id)) {
                Expr.find.ID = function (match, context, isXML) {
                    if (typeof context.getElementById !== "undefined" && !isXML) {
                        var m = context.getElementById(match[1]);
                        return m ? m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ? [m] : undefined : []
                    }
                };
                Expr.filter.ID = function (elem, match) {
                    var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
                    return elem.nodeType === 1 && node && node.nodeValue === match
                }
            }
            root.removeChild(form)
        })();
        (function () {
            var div = document.createElement("div");
            div.appendChild(document.createComment(""));
            if (div.getElementsByTagName("*").length > 0) {
                Expr.find.TAG = function (match, context) {
                    var results = context.getElementsByTagName(match[1]);
                    if (match[1] === "*") {
                        var tmp = [];
                        for (var i = 0; results[i]; i++) {
                            if (results[i].nodeType === 1) {
                                tmp.push(results[i])
                            }
                        }
                        results = tmp
                    }
                    return results
                }
            }
            div.innerHTML = "<a href='#'></a>";
            if (div.firstChild && typeof div.firstChild.getAttribute !== "undefined" && div.firstChild.getAttribute("href") !== "#") {
                Expr.attrHandle.href = function (elem) {
                    return elem.getAttribute("href", 2)
                }
            }
        })();
        if (document.querySelectorAll)(function () {
            var oldSizzle = Sizzle,
                div = document.createElement("div");
            div.innerHTML = "<p class='TEST'></p>";
            if (div.querySelectorAll && div.querySelectorAll(".TEST").length === 0) {
                return
            }
            Sizzle = function (query, context, extra, seed) {
                context = context || document;
                if (!seed && context.nodeType === 9 && !isXML(context)) {
                    try {
                        return makeArray(context.querySelectorAll(query), extra)
                    } catch (e) {}
                }
                return oldSizzle(query, context, extra, seed)
            };
            Sizzle.find = oldSizzle.find;
            Sizzle.filter = oldSizzle.filter;
            Sizzle.selectors = oldSizzle.selectors;
            Sizzle.matches = oldSizzle.matches
        })();
        if (document.getElementsByClassName && document.documentElement.getElementsByClassName)(function () {
            var div = document.createElement("div");
            div.innerHTML = "<div class='test e'></div><div class='test'></div>";
            if (div.getElementsByClassName("e").length === 0) return;
            div.lastChild.className = "e";
            if (div.getElementsByClassName("e").length === 1) return;
            Expr.order.splice(1, 0, "CLASS");
            Expr.find.CLASS = function (match, context, isXML) {
                if (typeof context.getElementsByClassName !== "undefined" && !isXML) {
                    return context.getElementsByClassName(match[1])
                }
            }
        })();

        function dirNodeCheck(dir, cur, doneName, checkSet, nodeCheck, isXML) {
            var sibDir = dir == "previousSibling" && !isXML;
            for (var i = 0, l = checkSet.length; i < l; i++) {
                var elem = checkSet[i];
                if (elem) {
                    if (sibDir && elem.nodeType === 1) {
                        elem.sizcache = doneName;
                        elem.sizset = i
                    }
                    elem = elem[dir];
                    var match = false;
                    while (elem) {
                        if (elem.sizcache === doneName) {
                            match = checkSet[elem.sizset];
                            break
                        }
                        if (elem.nodeType === 1 && !isXML) {
                            elem.sizcache = doneName;
                            elem.sizset = i
                        }
                        if (elem.nodeName === cur) {
                            match = elem;
                            break
                        }
                        elem = elem[dir]
                    }
                    checkSet[i] = match
                }
            }
        }
        function dirCheck(dir, cur, doneName, checkSet, nodeCheck, isXML) {
            var sibDir = dir == "previousSibling" && !isXML;
            for (var i = 0, l = checkSet.length; i < l; i++) {
                var elem = checkSet[i];
                if (elem) {
                    if (sibDir && elem.nodeType === 1) {
                        elem.sizcache = doneName;
                        elem.sizset = i
                    }
                    elem = elem[dir];
                    var match = false;
                    while (elem) {
                        if (elem.sizcache === doneName) {
                            match = checkSet[elem.sizset];
                            break
                        }
                        if (elem.nodeType === 1) {
                            if (!isXML) {
                                elem.sizcache = doneName;
                                elem.sizset = i
                            }
                            if (typeof cur !== "string") {
                                if (elem === cur) {
                                    match = true;
                                    break
                                }
                            } else if (Sizzle.filter(cur, [elem]).length > 0) {
                                match = elem;
                                break
                            }
                        }
                        elem = elem[dir]
                    }
                    checkSet[i] = match
                }
            }
        }
        var contains = document.compareDocumentPosition ?
        function (a, b) {
            return a.compareDocumentPosition(b) & 16
        } : function (a, b) {
            return a !== b && (a.contains ? a.contains(b) : true)
        };
        var isXML = function (elem) {
            return elem.nodeType === 9 && elem.documentElement.nodeName !== "HTML" || !! elem.ownerDocument && isXML(elem.ownerDocument)
        };
        var posProcess = function (selector, context) {
            var tmpSet = [],
                later = "",
                match, root = context.nodeType ? [context] : context;
            while ((match = Expr.match.PSEUDO.exec(selector))) {
                later += match[0];
                selector = selector.replace(Expr.match.PSEUDO, "")
            }
            selector = Expr.relative[selector] ? selector + "*" : selector;
            for (var i = 0, l = root.length; i < l; i++) {
                Sizzle(selector, root[i], tmpSet)
            }
            return Sizzle.filter(later, tmpSet)
        };
        jQuery.find = Sizzle;
        jQuery.filter = Sizzle.filter;
        jQuery.expr = Sizzle.selectors;
        jQuery.expr[":"] = jQuery.expr.filters;
        Sizzle.selectors.filters.hidden = function (elem) {
            return elem.offsetWidth === 0 || elem.offsetHeight === 0
        };
        Sizzle.selectors.filters.visible = function (elem) {
            return elem.offsetWidth > 0 || elem.offsetHeight > 0
        };
        Sizzle.selectors.filters.animated = function (elem) {
            return jQuery.grep(jQuery.timers, function (fn) {
                return elem === fn.elem
            }).length
        };
        jQuery.multiFilter = function (expr, elems, not) {
            if (not) {
                expr = ":not(" + expr + ")"
            }
            return Sizzle.matches(expr, elems)
        };
        jQuery.dir = function (elem, dir) {
            var matched = [],
                cur = elem[dir];
            while (cur && cur != document) {
                if (cur.nodeType == 1) matched.push(cur);
                cur = cur[dir]
            }
            return matched
        };
        jQuery.nth = function (cur, result, dir, elem) {
            result = result || 1;
            var num = 0;
            for (; cur; cur = cur[dir]) if (cur.nodeType == 1 && ++num == result) break;
            return cur
        };
        jQuery.sibling = function (n, elem) {
            var r = [];
            for (; n; n = n.nextSibling) {
                if (n.nodeType == 1 && n != elem) r.push(n)
            }
            return r
        };
        return;
        window.Sizzle = Sizzle
    })();
    jQuery.event = {
        add: function (elem, types, handler, data) {
            if (elem.nodeType == 3 || elem.nodeType == 8) return;
            if (elem.setInterval && elem != window) elem = window;
            if (!handler.guid) handler.guid = this.guid++;
            if (data !== undefined) {
                var fn = handler;
                handler = this.proxy(fn);
                handler.data = data
            }
            var events = jQuery.data(elem, "events") || jQuery.data(elem, "events", {}),
                handle = jQuery.data(elem, "handle") || jQuery.data(elem, "handle", function () {
                    return typeof jQuery !== "undefined" && !jQuery.event.triggered ? jQuery.event.handle.apply(arguments.callee.elem, arguments) : undefined
                });
            handle.elem = elem;
            jQuery.each(types.split(/\s+/), function (index, type) {
                var namespaces = type.split(".");
                type = namespaces.shift();
                handler.type = namespaces.slice().sort().join(".");
                var handlers = events[type];
                if (jQuery.event.specialAll[type]) jQuery.event.specialAll[type].setup.call(elem, data, namespaces);
                if (!handlers) {
                    handlers = events[type] = {};
                    if (!jQuery.event.special[type] || jQuery.event.special[type].setup.call(elem, data, namespaces) === false) {
                        if (elem.addEventListener) elem.addEventListener(type, handle, false);
                        else if (elem.attachEvent) elem.attachEvent("on" + type, handle)
                    }
                }
                handlers[handler.guid] = handler;
                jQuery.event.global[type] = true
            });
            elem = null
        },
        guid: 1,
        global: {},
        remove: function (elem, types, handler) {
            if (elem.nodeType == 3 || elem.nodeType == 8) return;
            var events = jQuery.data(elem, "events"),
                ret, index;
            if (events) {
                if (types === undefined || (typeof types === "string" && types.charAt(0) == ".")) for (var type in events) this.remove(elem, type + (types || ""));
                else {
                    if (types.type) {
                        handler = types.handler;
                        types = types.type
                    }
                    jQuery.each(types.split(/\s+/), function (index, type) {
                        var namespaces = type.split(".");
                        type = namespaces.shift();
                        var namespace = RegExp("(^|\\.)" + namespaces.slice().sort().join(".*\\.") + "(\\.|$)");
                        if (events[type]) {
                            if (handler) delete events[type][handler.guid];
                            else for (var handle in events[type]) if (namespace.test(events[type][handle].type)) delete events[type][handle];
                            if (jQuery.event.specialAll[type]) jQuery.event.specialAll[type].teardown.call(elem, namespaces);
                            for (ret in events[type]) break;
                            if (!ret) {
                                if (!jQuery.event.special[type] || jQuery.event.special[type].teardown.call(elem, namespaces) === false) {
                                    if (elem.removeEventListener) elem.removeEventListener(type, jQuery.data(elem, "handle"), false);
                                    else if (elem.detachEvent) elem.detachEvent("on" + type, jQuery.data(elem, "handle"))
                                }
                                ret = null;
                                delete events[type]
                            }
                        }
                    })
                }
                for (ret in events) break;
                if (!ret) {
                    var handle = jQuery.data(elem, "handle");
                    if (handle) handle.elem = null;
                    jQuery.removeData(elem, "events");
                    jQuery.removeData(elem, "handle")
                }
            }
        },
        trigger: function (event, data, elem, bubbling) {
            var type = event.type || event;
            if (!bubbling) {
                event = typeof event === "object" ? event[expando] ? event : jQuery.extend(jQuery.Event(type), event) : jQuery.Event(type);
                if (type.indexOf("!") >= 0) {
                    event.type = type = type.slice(0, -1);
                    event.exclusive = true
                }
                if (!elem) {
                    event.stopPropagation();
                    if (this.global[type]) jQuery.each(jQuery.cache, function () {
                        if (this.events && this.events[type]) jQuery.event.trigger(event, data, this.handle.elem)
                    })
                }
                if (!elem || elem.nodeType == 3 || elem.nodeType == 8) return undefined;
                event.result = undefined;
                event.target = elem;
                data = jQuery.makeArray(data);
                data.unshift(event)
            }
            event.currentTarget = elem;
            var handle = jQuery.data(elem, "handle");
            if (handle) handle.apply(elem, data);
            if ((!elem[type] || (jQuery.nodeName(elem, 'a') && type == "click")) && elem["on" + type] && elem["on" + type].apply(elem, data) === false) event.result = false;
            if (!bubbling && elem[type] && !event.isDefaultPrevented() && !(jQuery.nodeName(elem, 'a') && type == "click")) {
                this.triggered = true;
                try {
                    elem[type]()
                } catch (e) {}
            }
            this.triggered = false;
            if (!event.isPropagationStopped()) {
                var parent = elem.parentNode || elem.ownerDocument;
                if (parent) jQuery.event.trigger(event, data, parent, true)
            }
        },
        handle: function (event) {
            var all, handlers;
            event = arguments[0] = jQuery.event.fix(event || window.event);
            event.currentTarget = this;
            var namespaces = event.type.split(".");
            event.type = namespaces.shift();
            all = !namespaces.length && !event.exclusive;
            var namespace = RegExp("(^|\\.)" + namespaces.slice().sort().join(".*\\.") + "(\\.|$)");
            handlers = (jQuery.data(this, "events") || {})[event.type];
            for (var j in handlers) {
                var handler = handlers[j];
                if (all || namespace.test(handler.type)) {
                    event.handler = handler;
                    event.data = handler.data;
                    var ret = handler.apply(this, arguments);
                    if (ret !== undefined) {
                        event.result = ret;
                        if (ret === false) {
                            event.preventDefault();
                            event.stopPropagation()
                        }
                    }
                    if (event.isImmediatePropagationStopped()) break
                }
            }
        },
        props: "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode metaKey newValue originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),
        fix: function (event) {
            if (event[expando]) return event;
            var originalEvent = event;
            event = jQuery.Event(originalEvent);
            for (var i = this.props.length, prop; i;) {
                prop = this.props[--i];
                event[prop] = originalEvent[prop]
            }
            if (!event.target) event.target = event.srcElement || document;
            if (event.target.nodeType == 3) event.target = event.target.parentNode;
            if (!event.relatedTarget && event.fromElement) event.relatedTarget = event.fromElement == event.target ? event.toElement : event.fromElement;
            if (event.pageX == null && event.clientX != null) {
                var doc = document.documentElement,
                    body = document.body;
                event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc.clientLeft || 0);
                event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc.clientTop || 0)
            }
            if (!event.which && ((event.charCode || event.charCode === 0) ? event.charCode : event.keyCode)) event.which = event.charCode || event.keyCode;
            if (!event.metaKey && event.ctrlKey) event.metaKey = event.ctrlKey;
            if (!event.which && event.button) event.which = (event.button & 1 ? 1 : (event.button & 2 ? 3 : (event.button & 4 ? 2 : 0)));
            return event
        },
        proxy: function (fn, proxy) {
            proxy = proxy ||
            function () {
                return fn.apply(this, arguments)
            };
            proxy.guid = fn.guid = fn.guid || proxy.guid || this.guid++;
            return proxy
        },
        special: {
            ready: {
                setup: bindReady,
                teardown: function () {}
            }
        },
        specialAll: {
            live: {
                setup: function (selector, namespaces) {
                    jQuery.event.add(this, namespaces[0], liveHandler)
                },
                teardown: function (namespaces) {
                    if (namespaces.length) {
                        var remove = 0,
                            name = RegExp("(^|\\.)" + namespaces[0] + "(\\.|$)");
                        jQuery.each((jQuery.data(this, "events").live || {}), function () {
                            if (name.test(this.type)) remove++
                        });
                        if (remove < 1) jQuery.event.remove(this, namespaces[0], liveHandler)
                    }
                }
            }
        }
    };
    jQuery.Event = function (src) {
        if (!this.preventDefault) return new jQuery.Event(src);
        if (src && src.type) {
            this.originalEvent = src;
            this.type = src.type
        } else this.type = src;
        this.timeStamp = now();
        this[expando] = true
    };

    function returnFalse() {
        return false
    }
    function returnTrue() {
        return true
    }
    jQuery.Event.prototype = {
        preventDefault: function () {
            this.isDefaultPrevented = returnTrue;
            var e = this.originalEvent;
            if (!e) return;
            if (e.preventDefault) e.preventDefault();
            e.returnValue = false
        },
        stopPropagation: function () {
            this.isPropagationStopped = returnTrue;
            var e = this.originalEvent;
            if (!e) return;
            if (e.stopPropagation) e.stopPropagation();
            e.cancelBubble = true
        },
        stopImmediatePropagation: function () {
            this.isImmediatePropagationStopped = returnTrue;
            this.stopPropagation()
        },
        isDefaultPrevented: returnFalse,
        isPropagationStopped: returnFalse,
        isImmediatePropagationStopped: returnFalse
    };
    var withinElement = function (event) {
        var parent = event.relatedTarget;
        while (parent && parent != this) try {
            parent = parent.parentNode
        } catch (e) {
            parent = this
        }
        if (parent != this) {
            event.type = event.data;
            jQuery.event.handle.apply(this, arguments)
        }
    };
    jQuery.each({
        mouseover: 'mouseenter',
        mouseout: 'mouseleave'
    }, function (orig, fix) {
        jQuery.event.special[fix] = {
            setup: function () {
                jQuery.event.add(this, orig, withinElement, fix)
            },
            teardown: function () {
                jQuery.event.remove(this, orig, withinElement)
            }
        }
    });
    jQuery.fn.extend({
        bind: function (type, data, fn) {
            return type == "unload" ? this.one(type, data, fn) : this.each(function () {
                jQuery.event.add(this, type, fn || data, fn && data)
            })
        },
        one: function (type, data, fn) {
            var one = jQuery.event.proxy(fn || data, function (event) {
                jQuery(this).unbind(event, one);
                return (fn || data).apply(this, arguments)
            });
            return this.each(function () {
                jQuery.event.add(this, type, one, fn && data)
            })
        },
        unbind: function (type, fn) {
            return this.each(function () {
                jQuery.event.remove(this, type, fn)
            })
        },
        trigger: function (type, data) {
            return this.each(function () {
                jQuery.event.trigger(type, data, this)
            })
        },
        triggerHandler: function (type, data) {
            if (this[0]) {
                var event = jQuery.Event(type);
                event.preventDefault();
                event.stopPropagation();
                jQuery.event.trigger(event, data, this[0]);
                return event.result
            }
        },
        toggle: function (fn) {
            var args = arguments,
                i = 1;
            while (i < args.length) jQuery.event.proxy(fn, args[i++]);
            return this.click(jQuery.event.proxy(fn, function (event) {
                this.lastToggle = (this.lastToggle || 0) % i;
                event.preventDefault();
                return args[this.lastToggle++].apply(this, arguments) || false
            }))
        },
        hover: function (fnOver, fnOut) {
            return this.mouseenter(fnOver).mouseleave(fnOut)
        },
        ready: function (fn) {
            bindReady();
            if (jQuery.isReady) fn.call(document, jQuery);
            else jQuery.readyList.push(fn);
            return this
        },
        live: function (type, fn) {
            var proxy = jQuery.event.proxy(fn);
            proxy.guid += this.selector + type;
            jQuery(document).bind(liveConvert(type, this.selector), this.selector, proxy);
            return this
        },
        die: function (type, fn) {
            jQuery(document).unbind(liveConvert(type, this.selector), fn ? {
                guid: fn.guid + this.selector + type
            } : null);
            return this
        }
    });

    function liveHandler(event) {
        var check = RegExp("(^|\\.)" + event.type + "(\\.|$)"),
            stop = true,
            elems = [];
        jQuery.each(jQuery.data(this, "events").live || [], function (i, fn) {
            if (check.test(fn.type)) {
                var elem = jQuery(event.target).closest(fn.data)[0];
                if (elem) elems.push({
                    elem: elem,
                    fn: fn
                })
            }
        });
        elems.sort(function (a, b) {
            return jQuery.data(a.elem, "closest") - jQuery.data(b.elem, "closest")
        });
        jQuery.each(elems, function () {
            if (this.fn.call(this.elem, event, this.fn.data) === false) return (stop = false)
        });
        return stop
    }
    function liveConvert(type, selector) {
        return ["live", type, selector.replace(/\./g, "`").replace(/ /g, "|")].join(".")
    }
    jQuery.extend({
        isReady: false,
        readyList: [],
        ready: function () {
            if (!jQuery.isReady) {
                jQuery.isReady = true;
                if (jQuery.readyList) {
                    jQuery.each(jQuery.readyList, function () {
                        this.call(document, jQuery)
                    });
                    jQuery.readyList = null
                }
                jQuery(document).triggerHandler("ready")
            }
        }
    });
    var readyBound = false;

    function bindReady() {
        if (readyBound) return;
        readyBound = true;
        if (document.addEventListener) {
            document.addEventListener("DOMContentLoaded", function () {
                document.removeEventListener("DOMContentLoaded", arguments.callee, false);
                jQuery.ready()
            }, false)
        } else if (document.attachEvent) {
            document.attachEvent("onreadystatechange", function () {
                if (document.readyState === "complete") {
                    document.detachEvent("onreadystatechange", arguments.callee);
                    jQuery.ready()
                }
            });
            if (document.documentElement.doScroll && window == window.top)(function () {
                if (jQuery.isReady) return;
                try {
                    document.documentElement.doScroll("left")
                } catch (error) {
                    setTimeout(arguments.callee, 0);
                    return
                }
                jQuery.ready()
            })()
        }
        jQuery.event.add(window, "load", jQuery.ready)
    }
    jQuery.each(("blur,focus,load,resize,scroll,unload,click,dblclick," + "mousedown,mouseup,mousemove,mouseover,mouseout,mouseenter,mouseleave," + "change,select,submit,keydown,keypress,keyup,error").split(","), function (i, name) {
        jQuery.fn[name] = function (fn) {
            return fn ? this.bind(name, fn) : this.trigger(name)
        }
    });
    jQuery(window).bind('unload', function () {
        for (var id in jQuery.cache) if (id != 1 && jQuery.cache[id].handle) jQuery.event.remove(jQuery.cache[id].handle.elem)
    });
    (function () {
        jQuery.support = {};
        var root = document.documentElement,
            script = document.createElement("script"),
            div = document.createElement("div"),
            id = "script" + (new Date).getTime();
        div.style.display = "none";
        div.innerHTML = '   <link/><table></table><a href="/a" style="color:red;float:left;opacity:.5;">a</a><select><option>text</option></select><object><param/></object>';
        var all = div.getElementsByTagName("*"),
            a = div.getElementsByTagName("a")[0];
        if (!all || !all.length || !a) {
            return
        }
        jQuery.support = {
            leadingWhitespace: div.firstChild.nodeType == 3,
            tbody: !div.getElementsByTagName("tbody").length,
            objectAll: !! div.getElementsByTagName("object")[0].getElementsByTagName("*").length,
            htmlSerialize: !! div.getElementsByTagName("link").length,
            style: /red/.test(a.getAttribute("style")),
            hrefNormalized: a.getAttribute("href") === "/a",
            opacity: a.style.opacity === "0.5",
            cssFloat: !! a.style.cssFloat,
            scriptEval: false,
            noCloneEvent: true,
            boxModel: null
        };
        script.type = "text/javascript";
        try {
            script.appendChild(document.createTextNode("window." + id + "=1;"))
        } catch (e) {}
        root.insertBefore(script, root.firstChild);
        if (window[id]) {
            jQuery.support.scriptEval = true;
            delete window[id]
        }
        root.removeChild(script);
        if (div.attachEvent && div.fireEvent) {
            div.attachEvent("onclick", function () {
                jQuery.support.noCloneEvent = false;
                div.detachEvent("onclick", arguments.callee)
            });
            div.cloneNode(true).fireEvent("onclick")
        }
        jQuery(function () {
            var div = document.createElement("div");
            div.style.width = div.style.paddingLeft = "1px";
            document.body.appendChild(div);
            jQuery.boxModel = jQuery.support.boxModel = div.offsetWidth === 2;
            document.body.removeChild(div).style.display = 'none'
        })
    })();
    var styleFloat = jQuery.support.cssFloat ? "cssFloat" : "styleFloat";
    jQuery.props = {
        "for": "htmlFor",
        "class": "className",
        "float": styleFloat,
        cssFloat: styleFloat,
        styleFloat: styleFloat,
        readonly: "readOnly",
        maxlength: "maxLength",
        cellspacing: "cellSpacing",
        rowspan: "rowSpan",
        tabindex: "tabIndex"
    };
    jQuery.fn.extend({
        _load: jQuery.fn.load,
        load: function (url, params, callback) {
            if (typeof url !== "string") return this._load(url);
            var off = url.indexOf(" ");
            if (off >= 0) {
                var selector = url.slice(off, url.length);
                url = url.slice(0, off)
            }
            var type = "GET";
            if (params) if (jQuery.isFunction(params)) {
                callback = params;
                params = null
            } else if (typeof params === "object") {
                params = jQuery.param(params);
                type = "POST"
            }
            var self = this;
            jQuery.ajax({
                url: url,
                type: type,
                dataType: "html",
                data: params,
                complete: function (res, status) {
                    if (status == "success" || status == "notmodified") self.html(selector ? jQuery("<div/>").append(res.responseText.replace(/<script(.|\s)*?\/script>/g, "")).find(selector) : res.responseText);
                    if (callback) self.each(callback, [res.responseText, status, res])
                }
            });
            return this
        },
        serialize: function () {
            return jQuery.param(this.serializeArray())
        },
        serializeArray: function () {
            return this.map(function () {
                return this.elements ? jQuery.makeArray(this.elements) : this
            }).filter(function () {
                return this.name && !this.disabled && (this.checked || /select|textarea/i.test(this.nodeName) || /text|hidden|password|search/i.test(this.type))
            }).map(function (i, elem) {
                var val = jQuery(this).val();
                return val == null ? null : jQuery.isArray(val) ? jQuery.map(val, function (val, i) {
                    return {
                        name: elem.name,
                        value: val
                    }
                }) : {
                    name: elem.name,
                    value: val
                }
            }).get()
        }
    });
    jQuery.each("ajaxStart,ajaxStop,ajaxComplete,ajaxError,ajaxSuccess,ajaxSend".split(","), function (i, o) {
        jQuery.fn[o] = function (f) {
            return this.bind(o, f)
        }
    });
    var jsc = now();
    jQuery.extend({
        get: function (url, data, callback, type) {
            if (jQuery.isFunction(data)) {
                callback = data;
                data = null
            }
            return jQuery.ajax({
                type: "GET",
                url: url,
                data: data,
                success: callback,
                dataType: type
            })
        },
        getScript: function (url, callback) {
            return jQuery.get(url, null, callback, "script")
        },
        getJSON: function (url, data, callback) {
            return jQuery.get(url, data, callback, "json")
        },
        post: function (url, data, callback, type) {
            if (jQuery.isFunction(data)) {
                callback = data;
                data = {}
            }
            return jQuery.ajax({
                type: "POST",
                url: url,
                data: data,
                success: callback,
                dataType: type
            })
        },
        ajaxSetup: function (settings) {
            jQuery.extend(jQuery.ajaxSettings, settings)
        },
        ajaxSettings: {
            url: location.href,
            global: true,
            type: "GET",
            contentType: "application/x-www-form-urlencoded",
            processData: true,
            async: true,
            xhr: function () {
                return window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest()
            },
            accepts: {
                xml: "application/xml, text/xml",
                html: "text/html",
                script: "text/javascript, application/javascript",
                json: "application/json, text/javascript",
                text: "text/plain",
                _default: "*/*"
            }
        },
        lastModified: {},
        ajax: function (s) {
            s = jQuery.extend(true, s, jQuery.extend(true, {}, jQuery.ajaxSettings, s));
            var jsonp, jsre = /=\?(&|$)/g,
                status, data, type = s.type.toUpperCase();
            if (s.data && s.processData && typeof s.data !== "string") s.data = jQuery.param(s.data);
            if (s.dataType == "jsonp") {
                if (type == "GET") {
                    if (!s.url.match(jsre)) s.url += (s.url.match(/\?/) ? "&" : "?") + (s.jsonp || "callback") + "=?"
                } else if (!s.data || !s.data.match(jsre)) s.data = (s.data ? s.data + "&" : "") + (s.jsonp || "callback") + "=?";
                s.dataType = "json"
            }
            if (s.dataType == "json" && (s.data && s.data.match(jsre) || s.url.match(jsre))) {
                jsonp = "jsonp" + jsc++;
                if (s.data) s.data = (s.data + "").replace(jsre, "=" + jsonp + "$1");
                s.url = s.url.replace(jsre, "=" + jsonp + "$1");
                s.dataType = "script";
                window[jsonp] = function (tmp) {
                    data = tmp;
                    success();
                    complete();
                    window[jsonp] = undefined;
                    try {
                        delete window[jsonp]
                    } catch (e) {}
                    if (head) head.removeChild(script)
                }
            }
            if (s.dataType == "script" && s.cache == null) s.cache = false;
            if (s.cache === false && type == "GET") {
                var ts = now();
                var ret = s.url.replace(/(\?|&)_=.*?(&|$)/, "$1_=" + ts + "$2");
                s.url = ret + ((ret == s.url) ? (s.url.match(/\?/) ? "&" : "?") + "_=" + ts : "")
            }
            if (s.data && type == "GET") {
                s.url += (s.url.match(/\?/) ? "&" : "?") + s.data;
                s.data = null
            }
            if (s.global && !jQuery.active++) jQuery.event.trigger("ajaxStart");
            var parts = /^(\w+:)?\/\/([^\/?#]+)/.exec(s.url);
            if (s.dataType == "script" && type == "GET" && parts && (parts[1] && parts[1] != location.protocol || parts[2] != location.host)) {
                var head = document.getElementsByTagName("head")[0];
                var script = document.createElement("script");
                script.src = s.url;
                if (s.scriptCharset) script.charset = s.scriptCharset;
                if (!jsonp) {
                    var done = false;
                    script.onload = script.onreadystatechange = function () {
                        if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
                            done = true;
                            success();
                            complete();
                            script.onload = script.onreadystatechange = null;
                            head.removeChild(script)
                        }
                    }
                }
                head.appendChild(script);
                return undefined
            }
            var requestDone = false;
            var xhr = s.xhr();
            if (s.username) xhr.open(type, s.url, s.async, s.username, s.password);
            else xhr.open(type, s.url, s.async);
            try {
                if (s.data) xhr.setRequestHeader("Content-Type", s.contentType);
                if (s.ifModified) xhr.setRequestHeader("If-Modified-Since", jQuery.lastModified[s.url] || "Thu, 01 Jan 1970 00:00:00 GMT");
                xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                xhr.setRequestHeader("Accept", s.dataType && s.accepts[s.dataType] ? s.accepts[s.dataType] + ", */*" : s.accepts._default)
            } catch (e) {}
            if (s.beforeSend && s.beforeSend(xhr, s) === false) {
                if (s.global && !--jQuery.active) jQuery.event.trigger("ajaxStop");
                xhr.abort();
                return false
            }
            if (s.global) jQuery.event.trigger("ajaxSend", [xhr, s]);
            var onreadystatechange = function (isTimeout) {
                if (xhr.readyState == 0) {
                    if (ival) {
                        clearInterval(ival);
                        ival = null;
                        if (s.global && !--jQuery.active) jQuery.event.trigger("ajaxStop")
                    }
                } else if (!requestDone && xhr && (xhr.readyState == 4 || isTimeout == "timeout")) {
                    requestDone = true;
                    if (ival) {
                        clearInterval(ival);
                        ival = null
                    }
                    status = isTimeout == "timeout" ? "timeout" : !jQuery.httpSuccess(xhr) ? "error" : s.ifModified && jQuery.httpNotModified(xhr, s.url) ? "notmodified" : "success";
                    if (status == "success") {
                        try {
                            data = jQuery.httpData(xhr, s.dataType, s)
                        } catch (e) {
                            status = "parsererror"
                        }
                    }
                    if (status == "success") {
                        var modRes;
                        try {
                            modRes = xhr.getResponseHeader("Last-Modified")
                        } catch (e) {}
                        if (s.ifModified && modRes) jQuery.lastModified[s.url] = modRes;
                        if (!jsonp) success()
                    } else jQuery.handleError(s, xhr, status);
                    complete();
                    if (isTimeout) xhr.abort();
                    if (s.async) xhr = null
                }
            };
            if (s.async) {
                var ival = setInterval(onreadystatechange, 13);
                if (s.timeout > 0) setTimeout(function () {
                    if (xhr && !requestDone) onreadystatechange("timeout")
                }, s.timeout)
            }
            try {
                xhr.send(s.data)
            } catch (e) {
                jQuery.handleError(s, xhr, null, e)
            }
            if (!s.async) onreadystatechange();

            function success() {
                if (s.success) s.success(data, status);
                if (s.global) jQuery.event.trigger("ajaxSuccess", [xhr, s])
            }
            function complete() {
                if (s.complete) s.complete(xhr, status);
                if (s.global) jQuery.event.trigger("ajaxComplete", [xhr, s]);
                if (s.global && !--jQuery.active) jQuery.event.trigger("ajaxStop")
            }
            return xhr
        },
        handleError: function (s, xhr, status, e) {
            if (s.error) s.error(xhr, status, e);
            if (s.global) jQuery.event.trigger("ajaxError", [xhr, s, e])
        },
        active: 0,
        httpSuccess: function (xhr) {
            try {
                return !xhr.status && location.protocol == "file:" || (xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || xhr.status == 1223
            } catch (e) {}
            return false
        },
        httpNotModified: function (xhr, url) {
            try {
                var xhrRes = xhr.getResponseHeader("Last-Modified");
                return xhr.status == 304 || xhrRes == jQuery.lastModified[url]
            } catch (e) {}
            return false
        },
        httpData: function (xhr, type, s) {
            var ct = xhr.getResponseHeader("content-type"),
                xml = type == "xml" || !type && ct && ct.indexOf("xml") >= 0,
                data = xml ? xhr.responseXML : xhr.responseText;
            if (xml && data.documentElement.tagName == "parsererror") throw "parsererror";
            if (s && s.dataFilter) data = s.dataFilter(data, type);
            if (typeof data === "string") {
                if (type == "script") jQuery.globalEval(data);
                if (type == "json") data = window["eval"]("(" + data + ")")
            }
            return data
        },
        param: function (a) {
            var s = [];

            function add(key, value) {
                s[s.length] = encodeURIComponent(key) + '=' + encodeURIComponent(value)
            };
            if (jQuery.isArray(a) || a.jquery) jQuery.each(a, function () {
                add(this.name, this.value)
            });
            else for (var j in a) if (jQuery.isArray(a[j])) jQuery.each(a[j], function () {
                add(j, this)
            });
            else add(j, jQuery.isFunction(a[j]) ? a[j]() : a[j]);
            return s.join("&").replace(/%20/g, "+")
        }
    });
    var elemdisplay = {},
        timerId, fxAttrs = [
            ["height", "marginTop", "marginBottom", "paddingTop", "paddingBottom"],
            ["width", "marginLeft", "marginRight", "paddingLeft", "paddingRight"],
            ["opacity"]
        ];

    function genFx(type, num) {
        var obj = {};
        jQuery.each(fxAttrs.concat.apply([], fxAttrs.slice(0, num)), function () {
            obj[this] = type
        });
        return obj
    }
    jQuery.fn.extend({
        show: function (speed, callback) {
            if (speed) {
                return this.animate(genFx("show", 3), speed, callback)
            } else {
                for (var i = 0, l = this.length; i < l; i++) {
                    var old = jQuery.data(this[i], "olddisplay");
                    this[i].style.display = old || "";
                    if (jQuery.css(this[i], "display") === "none") {
                        var tagName = this[i].tagName,
                            display;
                        if (elemdisplay[tagName]) {
                            display = elemdisplay[tagName]
                        } else {
                            var elem = jQuery("<" + tagName + " />").appendTo("body");
                            display = elem.css("display");
                            if (display === "none") display = "block";
                            elem.remove();
                            elemdisplay[tagName] = display
                        }
                        jQuery.data(this[i], "olddisplay", display)
                    }
                }
                for (var i = 0, l = this.length; i < l; i++) {
                    this[i].style.display = jQuery.data(this[i], "olddisplay") || ""
                }
                return this
            }
        },
        hide: function (speed, callback) {
            if (speed) {
                return this.animate(genFx("hide", 3), speed, callback)
            } else {
                for (var i = 0, l = this.length; i < l; i++) {
                    var old = jQuery.data(this[i], "olddisplay");
                    if (!old && old !== "none") jQuery.data(this[i], "olddisplay", jQuery.css(this[i], "display"))
                }
                for (var i = 0, l = this.length; i < l; i++) {
                    this[i].style.display = "none"
                }
                return this
            }
        },
        _toggle: jQuery.fn.toggle,
        toggle: function (fn, fn2) {
            var bool = typeof fn === "boolean";
            return jQuery.isFunction(fn) && jQuery.isFunction(fn2) ? this._toggle.apply(this, arguments) : fn == null || bool ? this.each(function () {
                var state = bool ? fn : jQuery(this).is(":hidden");
                jQuery(this)[state ? "show" : "hide"]()
            }) : this.animate(genFx("toggle", 3), fn, fn2)
        },
        fadeTo: function (speed, to, callback) {
            return this.animate({
                opacity: to
            }, speed, callback)
        },
        animate: function (prop, speed, easing, callback) {
            var optall = jQuery.speed(speed, easing, callback);
            return this[optall.queue === false ? "each" : "queue"](function () {
                var opt = jQuery.extend({}, optall),
                    p, hidden = this.nodeType == 1 && jQuery(this).is(":hidden"),
                    self = this;
                for (p in prop) {
                    if (prop[p] == "hide" && hidden || prop[p] == "show" && !hidden) return opt.complete.call(this);
                    if ((p == "height" || p == "width") && this.style) {
                        opt.display = jQuery.css(this, "display");
                        opt.overflow = this.style.overflow
                    }
                }
                if (opt.overflow != null) this.style.overflow = "hidden";
                opt.curAnim = jQuery.extend({}, prop);
                jQuery.each(prop, function (name, val) {
                    var e = new jQuery.fx(self, opt, name);
                    if (/toggle|show|hide/.test(val)) e[val == "toggle" ? hidden ? "show" : "hide" : val](prop);
                    else {
                        var parts = val.toString().match(/^([+-]=)?([\d+-.]+)(.*)$/),
                            start = e.cur(true) || 0;
                        if (parts) {
                            var end = parseFloat(parts[2]),
                                unit = parts[3] || "px";
                            if (unit != "px") {
                                self.style[name] = (end || 1) + unit;
                                start = ((end || 1) / e.cur(true)) * start;
                                self.style[name] = start + unit
                            }
                            if (parts[1]) end = ((parts[1] == "-=" ? -1 : 1) * end) + start;
                            e.custom(start, end, unit)
                        } else e.custom(start, val, "")
                    }
                });
                return true
            })
        },
        stop: function (clearQueue, gotoEnd) {
            var timers = jQuery.timers;
            if (clearQueue) this.queue([]);
            this.each(function () {
                for (var i = timers.length - 1; i >= 0; i--) if (timers[i].elem == this) {
                    if (gotoEnd) timers[i](true);
                    timers.splice(i, 1)
                }
            });
            if (!gotoEnd) this.dequeue();
            return this
        }
    });
    jQuery.each({
        slideDown: genFx("show", 1),
        slideUp: genFx("hide", 1),
        slideToggle: genFx("toggle", 1),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        }
    }, function (name, props) {
        jQuery.fn[name] = function (speed, callback) {
            return this.animate(props, speed, callback)
        }
    });
    jQuery.extend({
        speed: function (speed, easing, fn) {
            var opt = typeof speed === "object" ? speed : {
                complete: fn || !fn && easing || jQuery.isFunction(speed) && speed,
                duration: speed,
                easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
            };
            opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration : jQuery.fx.speeds[opt.duration] || jQuery.fx.speeds._default;
            opt.old = opt.complete;
            opt.complete = function () {
                if (opt.queue !== false) jQuery(this).dequeue();
                if (jQuery.isFunction(opt.old)) opt.old.call(this)
            };
            return opt
        },
        easing: {
            linear: function (p, n, firstNum, diff) {
                return firstNum + diff * p
            },
            swing: function (p, n, firstNum, diff) {
                return ((-Math.cos(p * Math.PI) / 2) + 0.5) * diff + firstNum
            }
        },
        timers: [],
        fx: function (elem, options, prop) {
            this.options = options;
            this.elem = elem;
            this.prop = prop;
            if (!options.orig) options.orig = {}
        }
    });
    jQuery.fx.prototype = {
        update: function () {
            if (this.options.step) this.options.step.call(this.elem, this.now, this);
            (jQuery.fx.step[this.prop] || jQuery.fx.step._default)(this);
            if ((this.prop == "height" || this.prop == "width") && this.elem.style) this.elem.style.display = "block"
        },
        cur: function (force) {
            if (this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null)) return this.elem[this.prop];
            var r = parseFloat(jQuery.css(this.elem, this.prop, force));
            return r && r > -10000 ? r : parseFloat(jQuery.curCSS(this.elem, this.prop)) || 0
        },
        custom: function (from, to, unit) {
            this.startTime = now();
            this.start = from;
            this.end = to;
            this.unit = unit || this.unit || "px";
            this.now = this.start;
            this.pos = this.state = 0;
            var self = this;

            function t(gotoEnd) {
                return self.step(gotoEnd)
            }
            t.elem = this.elem;
            if (t() && jQuery.timers.push(t) && !timerId) {
                timerId = setInterval(function () {
                    var timers = jQuery.timers;
                    for (var i = 0; i < timers.length; i++) if (!timers[i]()) timers.splice(i--, 1);
                    if (!timers.length) {
                        clearInterval(timerId);
                        timerId = undefined
                    }
                }, 13)
            }
        },
        show: function () {
            this.options.orig[this.prop] = jQuery.attr(this.elem.style, this.prop);
            this.options.show = true;
            this.custom(this.prop == "width" || this.prop == "height" ? 1 : 0, this.cur());
            jQuery(this.elem).show()
        },
        hide: function () {
            this.options.orig[this.prop] = jQuery.attr(this.elem.style, this.prop);
            this.options.hide = true;
            this.custom(this.cur(), 0)
        },
        step: function (gotoEnd) {
            var t = now();
            if (gotoEnd || t >= this.options.duration + this.startTime) {
                this.now = this.end;
                this.pos = this.state = 1;
                this.update();
                this.options.curAnim[this.prop] = true;
                var done = true;
                for (var i in this.options.curAnim) if (this.options.curAnim[i] !== true) done = false;
                if (done) {
                    if (this.options.display != null) {
                        this.elem.style.overflow = this.options.overflow;
                        this.elem.style.display = this.options.display;
                        if (jQuery.css(this.elem, "display") == "none") this.elem.style.display = "block"
                    }
                    if (this.options.hide) jQuery(this.elem).hide();
                    if (this.options.hide || this.options.show) for (var p in this.options.curAnim) jQuery.attr(this.elem.style, p, this.options.orig[p]);
                    this.options.complete.call(this.elem)
                }
                return false
            } else {
                var n = t - this.startTime;
                this.state = n / this.options.duration;
                this.pos = jQuery.easing[this.options.easing || (jQuery.easing.swing ? "swing" : "linear")](this.state, n, 0, 1, this.options.duration);
                this.now = this.start + ((this.end - this.start) * this.pos);
                this.update()
            }
            return true
        }
    };
    jQuery.extend(jQuery.fx, {
        speeds: {
            slow: 600,
            fast: 200,
            _default: 400
        },
        step: {
            opacity: function (fx) {
                jQuery.attr(fx.elem.style, "opacity", fx.now)
            },
            _default: function (fx) {
                if (fx.elem.style && fx.elem.style[fx.prop] != null) fx.elem.style[fx.prop] = fx.now + fx.unit;
                else fx.elem[fx.prop] = fx.now
            }
        }
    });
    if (document.documentElement["getBoundingClientRect"]) jQuery.fn.offset = function () {
        if (!this[0]) return {
            top: 0,
            left: 0
        };
        if (this[0] === this[0].ownerDocument.body) return jQuery.offset.bodyOffset(this[0]);
        var box = this[0].getBoundingClientRect(),
            doc = this[0].ownerDocument,
            body = doc.body,
            docElem = doc.documentElement,
            clientTop = docElem.clientTop || body.clientTop || 0,
            clientLeft = docElem.clientLeft || body.clientLeft || 0,
            top = box.top + (self.pageYOffset || jQuery.boxModel && docElem.scrollTop || body.scrollTop) - clientTop,
            left = box.left + (self.pageXOffset || jQuery.boxModel && docElem.scrollLeft || body.scrollLeft) - clientLeft;
        return {
            top: top,
            left: left
        }
    };
    else jQuery.fn.offset = function () {
        if (!this[0]) return {
            top: 0,
            left: 0
        };
        if (this[0] === this[0].ownerDocument.body) return jQuery.offset.bodyOffset(this[0]);
        jQuery.offset.initialized || jQuery.offset.initialize();
        var elem = this[0],
            offsetParent = elem.offsetParent,
            prevOffsetParent = elem,
            doc = elem.ownerDocument,
            computedStyle, docElem = doc.documentElement,
            body = doc.body,
            defaultView = doc.defaultView,
            prevComputedStyle = defaultView.getComputedStyle(elem, null),
            top = elem.offsetTop,
            left = elem.offsetLeft;
        while ((elem = elem.parentNode) && elem !== body && elem !== docElem) {
            computedStyle = defaultView.getComputedStyle(elem, null);
            top -= elem.scrollTop, left -= elem.scrollLeft;
            if (elem === offsetParent) {
                top += elem.offsetTop, left += elem.offsetLeft;
                if (jQuery.offset.doesNotAddBorder && !(jQuery.offset.doesAddBorderForTableAndCells && /^t(able|d|h)$/i.test(elem.tagName))) top += parseInt(computedStyle.borderTopWidth, 10) || 0, left += parseInt(computedStyle.borderLeftWidth, 10) || 0;
                prevOffsetParent = offsetParent, offsetParent = elem.offsetParent
            }
            if (jQuery.offset.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible") top += parseInt(computedStyle.borderTopWidth, 10) || 0, left += parseInt(computedStyle.borderLeftWidth, 10) || 0;
            prevComputedStyle = computedStyle
        }
        if (prevComputedStyle.position === "relative" || prevComputedStyle.position === "static") top += body.offsetTop, left += body.offsetLeft;
        if (prevComputedStyle.position === "fixed") top += Math.max(docElem.scrollTop, body.scrollTop), left += Math.max(docElem.scrollLeft, body.scrollLeft);
        return {
            top: top,
            left: left
        }
    };
    jQuery.offset = {
        initialize: function () {
            if (this.initialized) return;
            var body = document.body,
                container = document.createElement('div'),
                innerDiv, checkDiv, table, td, rules, prop, bodyMarginTop = body.style.marginTop,
                html = '<div style="position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;"><div></div></div><table style="position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;" cellpadding="0" cellspacing="0"><tr><td></td></tr></table>';
            rules = {
                position: 'absolute',
                top: 0,
                left: 0,
                margin: 0,
                border: 0,
                width: '1px',
                height: '1px',
                visibility: 'hidden'
            };
            for (prop in rules) container.style[prop] = rules[prop];
            container.innerHTML = html;
            body.insertBefore(container, body.firstChild);
            innerDiv = container.firstChild, checkDiv = innerDiv.firstChild, td = innerDiv.nextSibling.firstChild.firstChild;
            this.doesNotAddBorder = (checkDiv.offsetTop !== 5);
            this.doesAddBorderForTableAndCells = (td.offsetTop === 5);
            innerDiv.style.overflow = 'hidden', innerDiv.style.position = 'relative';
            this.subtractsBorderForOverflowNotVisible = (checkDiv.offsetTop === -5);
            body.style.marginTop = '1px';
            this.doesNotIncludeMarginInBodyOffset = (body.offsetTop === 0);
            body.style.marginTop = bodyMarginTop;
            body.removeChild(container);
            this.initialized = true
        },
        bodyOffset: function (body) {
            jQuery.offset.initialized || jQuery.offset.initialize();
            var top = body.offsetTop,
                left = body.offsetLeft;
            if (jQuery.offset.doesNotIncludeMarginInBodyOffset) top += parseInt(jQuery.curCSS(body, 'marginTop', true), 10) || 0, left += parseInt(jQuery.curCSS(body, 'marginLeft', true), 10) || 0;
            return {
                top: top,
                left: left
            }
        }
    };
    jQuery.fn.extend({
        position: function () {
            var left = 0,
                top = 0,
                results;
            if (this[0]) {
                var offsetParent = this.offsetParent(),
                    offset = this.offset(),
                    parentOffset = /^body|html$/i.test(offsetParent[0].tagName) ? {
                        top: 0,
                        left: 0
                    } : offsetParent.offset();
                offset.top -= num(this, 'marginTop');
                offset.left -= num(this, 'marginLeft');
                parentOffset.top += num(offsetParent, 'borderTopWidth');
                parentOffset.left += num(offsetParent, 'borderLeftWidth');
                results = {
                    top: offset.top - parentOffset.top,
                    left: offset.left - parentOffset.left
                }
            }
            return results
        },
        offsetParent: function () {
            var offsetParent = this[0].offsetParent || document.body;
            while (offsetParent && (!/^body|html$/i.test(offsetParent.tagName) && jQuery.css(offsetParent, 'position') == 'static')) offsetParent = offsetParent.offsetParent;
            return jQuery(offsetParent)
        }
    });
    jQuery.each(['Left', 'Top'], function (i, name) {
        var method = 'scroll' + name;
        jQuery.fn[method] = function (val) {
            if (!this[0]) return null;
            return val !== undefined ? this.each(function () {
                this == window || this == document ? window.scrollTo(!i ? val : jQuery(window).scrollLeft(), i ? val : jQuery(window).scrollTop()) : this[method] = val
            }) : this[0] == window || this[0] == document ? self[i ? 'pageYOffset' : 'pageXOffset'] || jQuery.boxModel && document.documentElement[method] || document.body[method] : this[0][method]
        }
    });
    jQuery.each(["Height", "Width"], function (i, name) {
        var tl = i ? "Left" : "Top",
            br = i ? "Right" : "Bottom",
            lower = name.toLowerCase();
        jQuery.fn["inner" + name] = function () {
            return this[0] ? jQuery.css(this[0], lower, false, "padding") : null
        };
        jQuery.fn["outer" + name] = function (margin) {
            return this[0] ? jQuery.css(this[0], lower, false, margin ? "margin" : "border") : null
        };
        var type = name.toLowerCase();
        jQuery.fn[type] = function (size) {
            return this[0] == window ? document.compatMode == "CSS1Compat" && document.documentElement["client" + name] || document.body["client" + name] : this[0] == document ? Math.max(document.documentElement["client" + name], document.body["scroll" + name], document.documentElement["scroll" + name], document.body["offset" + name], document.documentElement["offset" + name]) : size === undefined ? (this.length ? jQuery.css(this[0], type) : null) : this.css(type, typeof size === "string" ? size : size + "px")
        }
    })
})();
var Common = {};
Common.trim = function (s) {
    return s.replace(/(^\s*)|(\s*$)/g, "")
};
var validator = {
    errinput: 'errinput',
    errmsg: 'errmsg',
    errcls: 'no',
    yescls: 'yes',
    errorTip: 'errorTip',
    errorInput: 'errorInput',
    validTip: 'validTip',
    require: /[^(^\s*)|(\s*$)]/,
    email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
    domain: /^\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
    phone: /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/,
    mobile: /^13\d{9}$|^15\d{9}$|^18\d{9}$|^0\d{9,10}$/,
    url: /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/,
    idcard: "this.isIdCard(value)",
    money: /^\d+(\.\d+)?$/,
    number: /^\d+$/,
    zip: /^\d{6}$/,
    ip: /^[\d\.]{7,15}$/,
    qq: /^[1-9]\d{4,9}$/,
    integer: /^[-\+]?\d+$/,
    double: /^[-\+]?\d+(\.\d+)?$/,
    english: /^[A-Za-z]+$/,
    chinese: /^[\u0391-\uFFE5]+$/,
    enandcn: /^[\w\u0391-\uFFE5][\w\u0391-\uFFE5\-\.]+$/,
    username: /^[\w]+[\-\.\w]{2,}$/i,
    unsafe: /[<>\?\#\$\*\&;\\\/\[\]\{\}=\(\)\.\^%,]/,
    safestring: "this.isSafe(value)",
    filter: "this.doFilter(value)",
    limit: "this.checkLimit(value.length)",
    limitb: "this.checkLimit(this.LenB(value))",
    limitc: "this.checkLimit(value.length)",
    date: "this.isDate(value)",
    repeat: "this.checkRepeat(value)",
    range: "this.checkRange(value)",
    compare: "this.checkCompare(value)",
    custom: "this.Exec(value)",
    group: "this.mustChecked()",
    ajax: "this.doajax(errindex)",
    isIdCard: function (number) {
        var date, Ai;
        var verify = "10x98765432";
        var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        var area = ['', '', '', '', '', '', '', '', '', '', '', '北京', '天津', '河北', '山西', '内蒙古', '', '', '', '', '', '辽宁', '吉林', '黑龙江', '', '', '', '', '', '', '', '上海', '江苏', '浙江', '安微', '福建', '江西', '山东', '', '', '', '河南', '湖北', '湖南', '广东', '广西', '海南', '', '', '', '重庆', '四川', '贵州', '云南', '西藏', '', '', '', '', '', '', '陕西', '甘肃', '青海', '宁夏', '新疆', '', '', '', '', '', '台湾', '', '', '', '', '', '', '', '', '', '香港', '澳门', '', '', '', '', '', '', '', '', '国外'];
        var re = number.match(/^(\d{2})\d{4}(((\d{2})(\d{2})(\d{2})(\d{3}))|((\d{4})(\d{2})(\d{2})(\d{3}[x\d])))$/i);
        if (re == null) return false;
        if (re[1] >= area.length || area[re[1]] == "") return false;
        if (re[2].length == 12) {
            Ai = number.substr(0, 17);
            date = [re[9], re[10], re[11]].join("-")
        } else {
            Ai = number.substr(0, 6) + "19" + number.substr(6);
            date = ["19" + re[4], re[5], re[6]].join("-")
        }
        if (!this.isDate(date, "ymd")) return false;
        var sum = 0;
        for (var i = 0; i <= 16; i++) {
            sum += Ai.charAt(i) * Wi[i]
        }
        Ai += verify.charAt(sum % 11);
        return (number.length == 15 || number.length == 18 && number == Ai)
    },
    isSafe: function (str) {
        return !this.unsafe.test(str)
    },
    isDate: function (op) {
        var formatString = this['element'].attr('format');
        formatString = formatString || "ymd";
        var m, year, month, day;
        switch (formatString) {
        case "ymd":
            m = op.match(new RegExp("^((\\d{4})|(\\d{2}))([-./])(\\d{1,2})\\4(\\d{1,2})$"));
            if (m == null) return false;
            day = m[6];
            month = m[5] * 1;
            year = (m[2].length == 4) ? m[2] : GetFullYear(parseInt(m[3], 10));
            break;
        case "dmy":
            m = op.match(new RegExp("^(\\d{1,2})([-./])(\\d{1,2})\\2((\\d{4})|(\\d{2}))$"));
            if (m == null) return false;
            day = m[1];
            month = m[3] * 1;
            year = (m[5].length == 4) ? m[5] : GetFullYear(parseInt(m[6], 10));
            break;
        default:
            break
        }
        if (!parseInt(month)) return false;
        month = month == 0 ? 12 : month;
        var date = new Date(year, month - 1, day);
        return (typeof(date) == "object" && year == date.getFullYear() && month == (date.getMonth() + 1) && day == date.getDate());

        function GetFullYear(y) {
            return ((y < 30 ? "20" : "19") + y) | 0
        }
    },
    doFilter: function (value) {
        var filter = this['element'].attr('accept');
        return new RegExp("^.+\.(?=EXT)(EXT)$".replace(/EXT/g, filter.split(/\s*,\s*/).join("|")), "gi").test(value)
    },
    checkLimit: function (len) {
        var minval = this['element'].attr('min') || Number.MIN_VALUE;
        var maxval = this['element'].attr('max') || Number.MAX_VALUE;
        return (minval <= len && len <= maxval)
    },
    LenB: function (str) {
        return str.replace(/[^\x00-\xff]/g, "**").length
    },
    checkRepeat: function (value) {
        var to = this['element'].attr('to');
        return value == jQuery('input[name="' + to + '"]').eq(0).val()
    },
    checkRange: function (value) {
        value = value | 0;
        var minval = this['element'].attr('min') || Number.MIN_VALUE;
        var maxval = this['element'].attr('max') || Number.MAX_VALUE;
        return (minval <= value && value <= maxval)
    },
    checkCompare: function (value) {
        var compareid = this['element'].attr('compare');
        if (!value) return false;
        return jQuery('#' + compareid).attr('value') == value
    },
    Exec: function (value) {
        var reg = this['element'].attr('regexp');
        return new RegExp(reg, "gi").test(value)
    },
    mustChecked: function () {
        var tagName = this['element'].attr('name');
        var f = this['element'].parents('form');
        var n = f.find('input[name="' + tagName + '"][checked]').length;
        var count = f.find('input[name="' + tagName + '"]').length;
        var minval = this['element'].attr('min') || 1;
        var maxval = this['element'].attr('max') || count;
        return (minval <= n && n <= maxval)
    },
    doajax: function (value) {
        var element = this['element'];
        var errindex = this['errindex'];
        var url = this['element'].attr('url');
        var vname = this['element'].attr('vname');
        var msgid = jQuery('#' + element.attr('msgid'));
        var val = this['element'].val();
        var str_errmsg = this['element'].attr('msg');
        var arr_errmsg;
        var errmsg;
        if (str_errmsg.indexOf('|') > -1) {
            arr_errmsg = str_errmsg.split('|');
            errmsg = arr_errmsg[errindex]
        } else {
            errmsg = ''
        }
        var type = this['element'].attr('type');
        var Charset = jQuery.browser.msie ? document.charset : document.characterSet;
        var methodtype = (Charset.toLowerCase() == 'utf-8') ? 'post' : 'get';
        var method = this['element'].attr('method') || methodtype;
        var name = this['element'].attr('name');
        if (url == "" || url == undefined) {
            alert('Please specify url');
            return false
        } else if (vname == "" || vname == undefined) {
            alert('Please specify vname');
            return false
        }
        if (url.indexOf('?') > -1) {
            url = url + "&n=" + vname + "&v=" + escape(val)
        } else {
            url = url + '?n=' + vname + "&v=" + escape(val)
        }
        var s = $.ajax({
            type: method,
            url: url,
            data: {},
            cache: false,
            async: false,
            success: function (data) {
                data = data.replace(/(^\s*)|(\s*$)/g, "");
                data = eval('(' + data + ')');
                if (data.error != 0) {
                    errmsg = errmsg == "" ? data.data : errmsg;
                    (type != 'checkbox' && type != 'radio' && element.addClass(validator.errorInput));
                    if (!errmsg) return false;
                    if (msgid.length > 0) {
                        msgid.removeClass(validator.validTip).addClass(validator.errorTip).html(errmsg)
                    } else {
                        jQuery("<span class='" + validator.errorTip + "'></span>").html(errmsg).insertAfter(element)
                    }
                    return false
                } else if (data.error == 0) {
                    if (!errmsg) return true;
                    if (msgid.length > 0) {
                        msgid.removeClass(validator.errorTip).addClass(validator.validTip).html('')
                    } else {
                        jQuery("<span class='" + validator.validTip + "'></span>").insertAfter(element)
                    }
                    return true
                }
            }
        }).responseText;
        return (eval('(' + s.replace(/(^\s*)|(\s*$)/g, "") + ')').error == 0)
    }
};
validator.showErr = function (element, errindex) {
    var str_errmsg = element.attr('msg') || '';
    var arr_errmsg = str_errmsg.split('|');
    var errmsg = arr_errmsg[errindex] ? arr_errmsg[errindex] : arr_errmsg[0];
    var msgid = jQuery('#' + element.attr('msgid'));
    var type = element.attr('type');
    (type != 'checkbox' && type != 'radio' && element.addClass(this['errorinput']));
    if (!errmsg) return false;
    if (msgid.length > 0) {
        msgid.removeClass(this['validTip']).addClass(this['errorTip']).html(errmsg)
    } else {
        element.parent('*').find('.' + this['errorTip']).remove();
        jQuery("<span class='" + this['errorTip'] + "'></span>").html(errmsg).insertAfter(element)
    }
    return false
};
validator.removeErr = function (element) {
    element.removeClass(this['errorInput']);
    var msgid = jQuery('#' + element.attr('msgid'));
    if (msgid.length == 0) {
        element.parent('*').find('span .' + this['errorTip']).remove();
        element.parent('*').find('span .' + this['validTip']).remove()
    }
};
validator.checkajax = function (element, datatype, errindex) {
    var value = jQuery.trim(element.val());
    this['element'] = element;
    this['errindex'] = errindex;
    validator.removeErr(element);
    return eval(this[datatype])
};
validator.checkDatatype = function (element, datatype) {
    var value = jQuery.trim(element.val());
    this['element'] = element;
    validator.removeErr(element);
    switch (datatype) {
    case "idcard":
    case "date":
    case "repeat":
    case "range":
    case "compare":
    case "custom":
    case "group":
    case "limit":
    case "limitb":
    case "limitc":
    case "safestring":
    case "filter":
        return eval(this[datatype]);
        break;
    default:
        return this[datatype].test(value);
        break
    }
};
validator.check = function (obj, submit) {
    var datatype = obj.attr('datatype');
    var lastvalue = obj.attr('lastvalue');
    var value = jQuery.trim(obj.val());
    if (typeof(datatype) == "undefined") return true;
    if (obj.attr('require') != "true" && value == "") {
        obj.removeClass(validator.errorInput);
        return true
    }
    var isValid = true;
    var datatypes = datatype.split('|');
    if (($.inArray('repeat', datatypes) == -1) && ($.inArray('ajax', datatypes) != -1) && (submit == true || (lastvalue && lastvalue == value))) {
        var e = obj.parent('*').find('.' + validator.errorTip);
        var v = obj.parent('*').find('.' + validator.validTip);
        if (e.length > 0 || v.length > 0) {
            return (v.length > 0)
        }
    }
    jQuery.each(datatypes, function (index, type) {
        if (typeof(validator[type]) == "undefined") {
            isValid = false;
            return false
        }
        if (type == 'ajax') return isValid = validator.checkajax(obj, type, index);
        if (validator.checkDatatype(obj, type) == false) {
            obj.addClass(validator.errorInput);
            validator.showErr(obj, index);
            return isValid = false
        } else {
            validator.showErr(obj, index);
            obj.removeClass(validator.errorInput);
            var msgid = jQuery('#' + obj.attr('msgid'));
            if (msgid.length > 0) {
                msgid.removeClass(validator.errorTip).addClass(validator.validTip).html('')
            } else {
                obj.parent('*').find('.' + validator.errorTip + ',.' + validator.validTip).remove()
            }
        }
    });
    obj.attr('lastvalue', value);
    return isValid
};
jQuery.fn.validateForm = function (no, form) {
    var isValid = true;
    var errIndex = new Array();
    var n = 0;
    var emsg = '';
    var elements = jQuery(form).find(':input[require]');
    elements.each(function (i) {
        if (false == validator.check(jQuery(this), true)) {
            var m = jQuery(this).parent('*').find('.' + validator.errorTip).html();
            if (m) {
                emsg += (emsg == '') ? m : '\n' + m
            }
            isValid = false;
            errIndex[n++] = i
        }
    });
    if (isValid == false) {
        elements.eq(errIndex[0]).focus().select();
        return false
    }
    return true
};
jQuery.fn.checkForm = function (jform) {
    var jform = jQuery(jform);
    var elements = jform.find(':input[require]');
    elements.blur(function () {
        return validator.check(jQuery(this))
    });
    jform.submit(function () {
        return jQuery.fn.validateForm('', jform)
    })
};
jQuery.fn.extend({
    everyTime: function (interval, label, fn, times) {
        return this.each(function () {
            jQuery.timer.add(this, interval, label, fn, times)
        })
    },
    oneTime: function (interval, label, fn) {
        return this.each(function () {
            jQuery.timer.add(this, interval, label, fn, 1)
        })
    },
    stopTime: function (label, fn) {
        return this.each(function () {
            jQuery.timer.remove(this, label, fn)
        })
    }
});
jQuery.extend({
    timer: {
        global: [],
        guid: 1,
        dataKey: "jQuery.timer",
        regex: /^([0-9]+(?:\.[0-9]*)?)\s*(.*s)?$/,
        powers: {
            'ms': 1,
            'cs': 10,
            'ds': 100,
            's': 1000,
            'das': 10000,
            'hs': 100000,
            'ks': 1000000
        },
        timeParse: function (value) {
            if (value == undefined || value == null) return null;
            var result = this.regex.exec(jQuery.trim(value.toString()));
            if (result[2]) {
                var num = parseFloat(result[1]);
                var mult = this.powers[result[2]] || 1;
                return num * mult
            } else {
                return value
            }
        },
        add: function (element, interval, label, fn, times) {
            var counter = 0;
            if (jQuery.isFunction(label)) {
                if (!times) times = fn;
                fn = label;
                label = interval
            }
            interval = jQuery.timer.timeParse(interval);
            if (typeof interval != 'number' || isNaN(interval) || interval < 0) return;
            if (typeof times != 'number' || isNaN(times) || times < 0) times = 0;
            times = times || 0;
            var timers = jQuery.data(element, this.dataKey) || jQuery.data(element, this.dataKey, {});
            if (!timers[label]) timers[label] = {};
            fn.timerID = fn.timerID || this.guid++;
            var handler = function () {
                if ((++counter > times && times !== 0) || fn.call(element, counter) === false) jQuery.timer.remove(element, label, fn)
            };
            handler.timerID = fn.timerID;
            if (!timers[label][fn.timerID]) timers[label][fn.timerID] = window.setInterval(handler, interval);
            this.global.push(element)
        },
        remove: function (element, label, fn) {
            var timers = jQuery.data(element, this.dataKey),
                ret;
            if (timers) {
                if (!label) {
                    for (label in timers) this.remove(element, label, fn)
                } else if (timers[label]) {
                    if (fn) {
                        if (fn.timerID) {
                            window.clearInterval(timers[label][fn.timerID]);
                            delete timers[label][fn.timerID]
                        }
                    } else {
                        for (var fn in timers[label]) {
                            window.clearInterval(timers[label][fn]);
                            delete timers[label][fn]
                        }
                    }
                    for (ret in timers[label]) break;
                    if (!ret) {
                        ret = null;
                        delete timers[label]
                    }
                }
                for (ret in timers) break;
                if (!ret) jQuery.removeData(element, this.dataKey)
            }
        }
    }
});
jQuery(window).bind("unload", function () {
    jQuery.each(jQuery.timer.global, function (index, item) {
        jQuery.timer.remove(item)
    })
});
(function ($) {
    $.fn.ajaxSubmit = function (options) {
        if (!this.length) {
            log('ajaxSubmit: skipping submit process - no element selected');
            return this
        }
        if (typeof options == 'function') options = {
            success: options
        };
        var url = this.attr('action') || window.location.href;
        url = (url.match(/^([^#]+)/) || [])[1];
        url = url || '';
        options = $.extend({
            url: url,
            type: this.attr('method') || 'GET'
        }, options || {});
        var veto = {};
        this.trigger('form-pre-serialize', [this, options, veto]);
        if (veto.veto) {
            log('ajaxSubmit: submit vetoed via form-pre-serialize trigger');
            return this
        }
        if (options.beforeSerialize && options.beforeSerialize(this, options) === false) {
            log('ajaxSubmit: submit aborted via beforeSerialize callback');
            return this
        }
        var a = this.formToArray(options.semantic);
        if (options.data) {
            options.extraData = options.data;
            for (var n in options.data) {
                if (options.data[n] instanceof Array) {
                    for (var k in options.data[n]) a.push({
                        name: n,
                        value: options.data[n][k]
                    })
                } else a.push({
                    name: n,
                    value: options.data[n]
                })
            }
        }
        if (options.beforeSubmit && options.beforeSubmit(a, this, options) === false) {
            log('ajaxSubmit: submit aborted via beforeSubmit callback');
            return this
        }
        this.trigger('form-submit-validate', [a, this, options, veto]);
        if (veto.veto) {
            log('ajaxSubmit: submit vetoed via form-submit-validate trigger');
            return this
        }
        var q = $.param(a);
        if (options.type.toUpperCase() == 'GET') {
            options.url += (options.url.indexOf('?') >= 0 ? '&' : '?') + q;
            options.data = null
        } else options.data = q;
        var $form = this,
            callbacks = [];
        if (options.resetForm) callbacks.push(function () {
            $form.resetForm()
        });
        if (options.clearForm) callbacks.push(function () {
            $form.clearForm()
        });
        if (!options.dataType && options.target) {
            var oldSuccess = options.success ||
            function () {};
            callbacks.push(function (data) {
                $(options.target).html(data).each(oldSuccess, arguments)
            })
        } else if (options.success) callbacks.push(options.success);
        options.success = function (data, status) {
            for (var i = 0, max = callbacks.length; i < max; i++) callbacks[i].apply(options, [data, status, $form])
        };
        var files = $('input:file', this).fieldValue();
        var found = false;
        for (var j = 0; j < files.length; j++) if (files[j]) found = true;
        if (options.iframe || found) {
            if (options.closeKeepAlive) $.get(options.closeKeepAlive, fileUpload);
            else fileUpload()
        } else $.ajax(options);
        this.trigger('form-submit-notify', [this, options]);
        return this;

        function fileUpload() {
            var form = $form[0];
            if ($(':input[name=submit]', form).length) {
                alert('Error: Form elements must not be named "submit".');
                return
            }
            var opts = $.extend({}, $.ajaxSettings, options);
            var s = $.extend(true, {}, $.extend(true, {}, $.ajaxSettings), opts);
            var id = 'jqFormIO' + (new Date().getTime());
            var $io = $('<iframe id="' + id + '" name="' + id + '" src="about:blank" />');
            var io = $io[0];
            $io.css({
                position: 'absolute',
                top: '-1000px',
                left: '-1000px'
            });
            var xhr = {
                aborted: 0,
                responseText: null,
                responseXML: null,
                status: 0,
                statusText: 'n/a',
                getAllResponseHeaders: function () {},
                getResponseHeader: function () {},
                setRequestHeader: function () {},
                abort: function () {
                    this.aborted = 1;
                    $io.attr('src', 'about:blank')
                }
            };
            var g = opts.global;
            if (g && !$.active++) $.event.trigger("ajaxStart");
            if (g) $.event.trigger("ajaxSend", [xhr, opts]);
            if (s.beforeSend && s.beforeSend(xhr, s) === false) {
                s.global && $.active--;
                return
            }
            if (xhr.aborted) return;
            var cbInvoked = 0;
            var timedOut = 0;
            var sub = form.clk;
            if (sub) {
                var n = sub.name;
                if (n && !sub.disabled) {
                    options.extraData = options.extraData || {};
                    options.extraData[n] = sub.value;
                    if (sub.type == "image") {
                        options.extraData[name + '.x'] = form.clk_x;
                        options.extraData[name + '.y'] = form.clk_y
                    }
                }
            }
            setTimeout(function () {
                var t = $form.attr('target'),
                    a = $form.attr('action');
                form.setAttribute('target', id);
                if (form.getAttribute('method') != 'POST') form.setAttribute('method', 'POST');
                if (form.getAttribute('action') != opts.url) form.setAttribute('action', opts.url);
                if (!options.skipEncodingOverride) {
                    $form.attr({
                        encoding: 'multipart/form-data',
                        enctype: 'multipart/form-data'
                    })
                }
                if (opts.timeout) setTimeout(function () {
                    timedOut = true;
                    cb()
                }, opts.timeout);
                var extraInputs = [];
                try {
                    if (options.extraData) for (var n in options.extraData) extraInputs.push($('<input type="hidden" name="' + n + '" value="' + options.extraData[n] + '" />').appendTo(form)[0]);
                    $io.appendTo('body');
                    io.attachEvent ? io.attachEvent('onload', cb) : io.addEventListener('load', cb, false);
                    form.submit()
                } finally {
                    form.setAttribute('action', a);
                    t ? form.setAttribute('target', t) : $form.removeAttr('target');
                    $(extraInputs).remove()
                }
            }, 10);
            var nullCheckFlag = 0;

            function cb() {
                if (cbInvoked++) return;
                io.detachEvent ? io.detachEvent('onload', cb) : io.removeEventListener('load', cb, false);
                var ok = true;
                try {
                    if (timedOut) throw 'timeout';
                    var data, doc;
                    doc = io.contentWindow ? io.contentWindow.document : io.contentDocument ? io.contentDocument : io.document;
                    if ((doc.body == null || doc.body.innerHTML == '') && !nullCheckFlag) {
                        nullCheckFlag = 1;
                        cbInvoked--;
                        setTimeout(cb, 100);
                        return
                    }
                    xhr.responseText = doc.body ? doc.body.innerHTML : null;
                    xhr.responseXML = doc.XMLDocument ? doc.XMLDocument : doc;
                    xhr.getResponseHeader = function (header) {
                        var headers = {
                            'content-type': opts.dataType
                        };
                        return headers[header]
                    };
                    if (opts.dataType == 'json' || opts.dataType == 'script') {
                        var ta = doc.getElementsByTagName('textarea')[0];
                        xhr.responseText = ta ? ta.value : xhr.responseText
                    } else if (opts.dataType == 'xml' && !xhr.responseXML && xhr.responseText != null) {
                        xhr.responseXML = toXml(xhr.responseText)
                    }
                    data = $.httpData(xhr, opts.dataType)
                } catch (e) {
                    ok = false;
                    $.handleError(opts, xhr, 'error', e)
                }
                if (ok) {
                    opts.success(data, 'success');
                    if (g) $.event.trigger("ajaxSuccess", [xhr, opts])
                }
                if (g) $.event.trigger("ajaxComplete", [xhr, opts]);
                if (g && !--$.active) $.event.trigger("ajaxStop");
                if (opts.complete) opts.complete(xhr, ok ? 'success' : 'error');
                setTimeout(function () {
                    $io.remove();
                    xhr.responseXML = null
                }, 100)
            };

            function toXml(s, doc) {
                if (window.ActiveXObject) {
                    doc = new ActiveXObject('Microsoft.XMLDOM');
                    doc.async = 'false';
                    doc.loadXML(s)
                } else doc = (new DOMParser()).parseFromString(s, 'text/xml');
                return (doc && doc.documentElement && doc.documentElement.tagName != 'parsererror') ? doc : null
            }
        }
    };
    $.fn.ajaxForm = function (options) {
        return this.ajaxFormUnbind().bind('submit.form-plugin', function () {
            $(this).ajaxSubmit(options);
            return false
        }).each(function () {
            $(":submit,input:image", this).bind('click.form-plugin', function (e) {
                var form = this.form;
                form.clk = this;
                if (this.type == 'image') {
                    if (e.offsetX != undefined) {
                        form.clk_x = e.offsetX;
                        form.clk_y = e.offsetY
                    } else if (typeof $.fn.offset == 'function') {
                        var offset = $(this).offset();
                        form.clk_x = e.pageX - offset.left;
                        form.clk_y = e.pageY - offset.top
                    } else {
                        form.clk_x = e.pageX - this.offsetLeft;
                        form.clk_y = e.pageY - this.offsetTop
                    }
                }
                setTimeout(function () {
                    form.clk = form.clk_x = form.clk_y = null
                }, 10)
            })
        })
    };
    $.fn.ajaxFormUnbind = function () {
        this.unbind('submit.form-plugin');
        return this.each(function () {
            $(":submit,input:image", this).unbind('click.form-plugin')
        })
    };
    $.fn.formToArray = function (semantic) {
        var a = [];
        if (this.length == 0) return a;
        var form = this[0];
        var els = semantic ? form.getElementsByTagName('*') : form.elements;
        if (!els) return a;
        for (var i = 0, max = els.length; i < max; i++) {
            var el = els[i];
            var n = el.name;
            if (!n) continue;
            if (semantic && form.clk && el.type == "image") {
                if (!el.disabled && form.clk == el) a.push({
                    name: n + '.x',
                    value: form.clk_x
                }, {
                    name: n + '.y',
                    value: form.clk_y
                });
                continue
            }
            var v = $.fieldValue(el, true);
            if (v && v.constructor == Array) {
                for (var j = 0, jmax = v.length; j < jmax; j++) a.push({
                    name: n,
                    value: v[j]
                })
            } else if (v !== null && typeof v != 'undefined') a.push({
                name: n,
                value: v
            })
        }
        if (!semantic && form.clk) {
            var inputs = form.getElementsByTagName("input");
            for (var i = 0, max = inputs.length; i < max; i++) {
                var input = inputs[i];
                var n = input.name;
                if (n && !input.disabled && input.type == "image" && form.clk == input) a.push({
                    name: n + '.x',
                    value: form.clk_x
                }, {
                    name: n + '.y',
                    value: form.clk_y
                })
            }
        }
        return a
    };
    $.fn.formSerialize = function (semantic) {
        return $.param(this.formToArray(semantic))
    };
    $.fn.fieldSerialize = function (successful) {
        var a = [];
        this.each(function () {
            var n = this.name;
            if (!n) return;
            var v = $.fieldValue(this, successful);
            if (v && v.constructor == Array) {
                for (var i = 0, max = v.length; i < max; i++) a.push({
                    name: n,
                    value: v[i]
                })
            } else if (v !== null && typeof v != 'undefined') a.push({
                name: this.name,
                value: v
            })
        });
        return $.param(a)
    };
    $.fn.fieldValue = function (successful) {
        for (var val = [], i = 0, max = this.length; i < max; i++) {
            var el = this[i];
            var v = $.fieldValue(el, successful);
            if (v === null || typeof v == 'undefined' || (v.constructor == Array && !v.length)) continue;
            v.constructor == Array ? $.merge(val, v) : val.push(v)
        }
        return val
    };
    $.fieldValue = function (el, successful) {
        var n = el.name,
            t = el.type,
            tag = el.tagName.toLowerCase();
        if (typeof successful == 'undefined') successful = true;
        if (successful && (!n || el.disabled || t == 'reset' || t == 'button' || (t == 'checkbox' || t == 'radio') && !el.checked || (t == 'submit' || t == 'image') && el.form && el.form.clk != el || tag == 'select' && el.selectedIndex == -1)) return null;
        if (tag == 'select') {
            var index = el.selectedIndex;
            if (index < 0) return null;
            var a = [],
                ops = el.options;
            var one = (t == 'select-one');
            var max = (one ? index + 1 : ops.length);
            for (var i = (one ? index : 0); i < max; i++) {
                var op = ops[i];
                if (op.selected) {
                    var v = op.value;
                    if (!v) v = (op.attributes && op.attributes['value'] && !(op.attributes['value'].specified)) ? op.text : op.value;
                    if (one) return v;
                    a.push(v)
                }
            }
            return a
        }
        return el.value
    };
    $.fn.clearForm = function () {
        return this.each(function () {
            $('input,select,textarea', this).clearFields()
        })
    };
    $.fn.clearFields = $.fn.clearInputs = function () {
        return this.each(function () {
            var t = this.type,
                tag = this.tagName.toLowerCase();
            if (t == 'text' || t == 'password' || tag == 'textarea') this.value = '';
            else if (t == 'checkbox' || t == 'radio') this.checked = false;
            else if (tag == 'select') this.selectedIndex = -1
        })
    };
    $.fn.resetForm = function () {
        return this.each(function () {
            if (typeof this.reset == 'function' || (typeof this.reset == 'object' && !this.reset.nodeType)) this.reset()
        })
    };
    $.fn.enable = function (b) {
        if (b == undefined) b = true;
        return this.each(function () {
            this.disabled = !b
        })
    };
    $.fn.selected = function (select) {
        if (select == undefined) select = true;
        return this.each(function () {
            var t = this.type;
            if (t == 'checkbox' || t == 'radio') this.checked = select;
            else if (this.tagName.toLowerCase() == 'option') {
                var $sel = $(this).parent('select');
                if (select && $sel[0] && $sel[0].type == 'select-one') {
                    $sel.find('option').selected(false)
                }
                this.selected = select
            }
        })
    };

    function log() {
        if ($.fn.ajaxSubmit.debug && window.console && window.console.log) window.console.log('[jquery.form] ' + Array.prototype.join.call(arguments, ''))
    }
})(jQuery);
var X = {};
X.hook = function () {
    var pre_init_str = 'x_init_hook_';
    for (var h in window) {
        if (0 != h.indexOf(pre_init_str)) continue;
        var func = window[h];
        if (typeof func == 'function') {
            try {
                func()
            } catch (e) {}
        }
    }
};
X.get = function (u) {
    return X.ajax(u, 'GET')
};
X.post = function (u) {
    return X.ajax(u, 'POST')
};
X.ajax = function (u, method) {
    jQuery.ajax({
        url: u,
        dataType: "json",
        success: X.json
    });
    return false
};
X.json = function (r) {
    var type = r['data']['type'];
    var data = r['data']['data'];
    if (type == 'alert') {
        alert(data)
    } else if (type == 'eval') {
        eval(data)
    } else if (type == 'refresh') {
        window.location.reload()
    } else if (type == 'updater') {
        var id = data['id'];
        var inner = data['html'];
        jQuery('#' + id).html(inner)
    } else if (type == 'dialog') {
        X.boxShow(data, true)
    } else if (type == 'mix') {
        for (var x in data) {
            r['data'] = data[x];
            X.json(r)
        }
    }
};
X.getXY = function () {
    var x, y;
    if (document.body.scrollTop) {
        x = document.body.scrollLeft;
        y = document.body.scrollTop
    } else {
        x = document.documentElement.scrollLeft;
        y = document.documentElement.scrollTop
    }
    return {
        x: x,
        y: y
    }
};
X.boxMask = function (display) {
    var height = jQuery('body').height() + 'px';
    var width = jQuery(window).width() + 'px';
    jQuery('#pagemasker').css({
        'position': 'absolute',
        'z-index': '3000',
        'width': width,
        'height': height,
        'filter': 'alpha(opacity=0.5)',
        'opacity': 0.5,
        'top': 0,
        'left': 0,
        'background': '#CCC',
        'display': display
    });
    jQuery('#dialog').css('display', display)
};
X.boxShow = function (innerHTML, mask) {
    var dialog = jQuery('#dialog');
    dialog.html(innerHTML);
    if (mask) {
        X.boxMask('block')
    }
    var ew = dialog.get(0).scrollWidth;
    var ww = jQuery(window).width();
    var lt = (ww / 2 - ew / 2) + 'px';
    var wh = jQuery(window).height();
    var xy = X.getXY();
    var tp = (wh * 0.15 + xy.y) + 'px';
    dialog.css('background-color', '#FFF');
    dialog.css('left', lt);
    dialog.css('top', tp);
    dialog.css('z-index', 9999);
    dialog.css('display', 'block');
    return false
};
X.boxClose = function () {
    jQuery('#dialog').html('').css('z-index', -9999);
    X.boxMask('none');
    return false
};
X.location = function (url) {
    jQuery('#ifra_show').attr({
        src: url
    })
};
jQuery(document).ready(X.hook);
var WEB_ROOT = WEB_ROOT || '';
var LOGINUID = LOGINUID || 0;
window.x_init_hook_validator = function () {
    jQuery('form.validator').each(function () {
        jQuery.fn.checkForm(this)
    });
    jQuery('a.needlogin').click(X.misc.needlogin)
};
window.x_init_hook_dealimage = function () {
    var teamside = jQuery('#team_partner_side_0').size() > 0;
    var m = teamside ? 600 : 380;
    if (teamside) {
        jQuery('#team_main_side').css('width', '640px');
        jQuery('.side #side-business img').each(function () {
            X.misc.scaleimage(this, m)
        })
    } else {
        jQuery('.side #side-business img').each(function () {
            X.misc.scaleimage(this, 195)
        })
    }
    jQuery('#deal-stuff img').each(function () {
        X.misc.scaleimage(this, m)
    });
    jQuery('div.sbox-content img').each(function () {
        X.misc.scaleimage(this, 195)
    })
};
window.x_init_hook_myaccount = function () {
    var ma = jQuery('#myaccount');
    var mm = jQuery('#myaccount-menu');
    ma.hover(function () {
        mm.show();
        ma.toggleClass('hover', true)
    }, function () {
        var menuhide = function () {
            mm.hide();
            ma.toggleClass('hover', false)
        };
        menuout = setTimeout(menuhide, 100)
    });
    mm.hover(function () {
        clearTimeout(menuout)
    }, function () {
        jQuery(this).hide();
        ma.toggleClass('hover', false)
    })
};
window.x_init_hook_click = function () {
    jQuery("div:not(#guides-city-change)").click(function () {
        jQuery('#guides-city-list').css('display', 'none')
    });
    jQuery('#guides-city-change').click(function () {
        return !jQuery('#guides-city-list').toggle()
    });
    jQuery('#sysmsg-guide-close').click(function () {
        jQuery('#sysmsg-guide').remove();
        return !X.get(WEB_ROOT + '/ajax/newbie.php')
    });
    jQuery('#sysmsg-error span.close').click(function () {
        return !jQuery('#sysmsg-error').remove()
    });
    jQuery('#sysmsg-success span.close').click(function () {
        return !jQuery('#sysmsg-success').remove()
    });
    jQuery('#deal-share-im').click(function () {
        return !jQuery('#deal-share-im-c').toggle()
    });
    jQuery('a.ajaxlink').click(function () {
        if (jQuery(this).attr('no') == 'yes') return false;
        var link = jQuery(this).attr('href');
        var ask = jQuery(this).attr('ask');
        if (link.indexOf('/delete') > 0 && !confirm('确定删除本条记录吗？')) {
            return false
        } else if (ask && !confirm(ask)) {
            return false
        }
        X.get(jQuery(this).attr('href'));
        return false
    });
    jQuery('a.remove').click(function () {
        var u = jQuery(this).attr('href');
        if (confirm('确定删除该条记录吗？')) {
            X.get(u)
        }
        return false
    });
    jQuery('.remove-record').click(function () {
        return confirm('确定删除该条记录吗？')
    });
    jQuery('a.delay').click(function () {
        var u = jQuery(this).attr('href');
        if (confirm('确定要将此团购项目延期一天吗？')) {
            return !X.get(u) && false
        }
        return false
    });
    jQuery('#cardcode-link').click(function () {
        jQuery('.cardcode .act').toggle()
    });
    jQuery('#cardcode-verify-id').click(X.misc.cardcode);
    jQuery('#consult-add-form input[name="commit"]').click(function () {
        jQuery('#consult-add-form').ajaxSubmit({
            'success': function () {
                X.team.consultation_again()
            }
        });
        return false
    });
    jQuery('#consult-add-more').click(X.team.consultation_again);
    jQuery('#express-zone-div input').click(function () {
        var v = jQuery(this).attr('value');
        if (v == 'express') {
            jQuery('#express-zone-express').css('display', 'block');
            jQuery('#express-zone-pickup').css('display', 'none');
            jQuery('#express-zone-coupon').css('display', 'none')
        } else if (v == 'pickup') {
            jQuery('#express-zone-pickup').css('display', 'block');
            jQuery('#express-zone-express').css('display', 'none');
            jQuery('#express-zone-coupon').css('display', 'none')
        } else if (v == 'coupon') {
            jQuery('#express-zone-coupon').css('display', 'block');
            jQuery('#express-zone-pickup').css('display', 'none');
            jQuery('#express-zone-express').css('display', 'none')
        }
    });
    jQuery('#mail-zone-div input').click(function () {
        var v = jQuery(this).attr('value');
        if (v == 'smtp') {
            jQuery('#mail-zone-smtp').css('display', 'block')
        } else {
            jQuery('#mail-zone-smtp').css('display', 'none')
        }
    });
    jQuery('#share-copy-text').click(function () {
        jQuery(this).select()
    });
    jQuery('#share-copy-button').click(function () {
        X.misc.copyToCB('share-copy-text')
    });
    jQuery('#verify-coupon-id').click(function () {
        X.get(WEB_ROOT + '/ajax/coupon.php?action=dialog')
    });
    jQuery('#deal-subscribe-form').submit(function () {
        var v = jQuery('#deal-subscribe-form-email').attr('value');
        return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(v)
    });
    jQuery('#header-subscribe-form').submit(function () {
        var v = jQuery('#header-subscribe-email').attr('value');
        return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(v)
    });
    jQuery('input[xtip$="."]').each(X.misc.inputblur);
    jQuery('input[xtip$="."]').focus(X.misc.inputclick);
    jQuery('input[xtip$="."]').blur(X.misc.inputblur)
};
window.x_init_hook_imagerotate = function () {
    var imgListCurr = 0;
    var imgListCount = jQuery('#img_list a').size();
    if (imgListCount < 2) return;
    var imagesRun = function () {
        var imgListNext = imgListCurr + 1;
        if (imgListCurr == imgListCount - 1) imgListNext = 0;
        imagesPlay(imgListNext);
        imgListCurr++;
        if (imgListCurr > imgListCount - 1) {
            imgListCurr = 0;
            imgListNext = imgListCurr + 1
        }
    };
    jQuery('#team_images').everyTime(3000, 'imagerotate', imagesRun);
    jQuery('#team_images li,#img_list a').hover(function () {
        jQuery('#team_images').stopTime('imagerotate')
    }, function () {
        jQuery('#team_images').everyTime(3000, 'imagerotate', imagesRun)
    });
    jQuery('#img_list a').click(function () {
        var index = jQuery('#img_list a').index(this);
        if (imgListCurr != index) {
            imagesPlay(index);
            imgListCurr = index
        };
        return false
    });
    var imagesPlay = function (next) {
        jQuery('#team_images li').eq(imgListCurr).css({
            'opacity': '0.5'
        }).animate({
            'left': '-440px',
            'opacity': '1'
        }, 'slow', function () {
            jQuery(this).css({
                'left': '440px'
            })
        }).end().eq(next).animate({
            'left': '0px',
            'opacity': '1'
        }, 'slow', function () {
            jQuery('#img_list a').siblings('a').removeClass('active').end().eq(next).addClass('active')
        })
    }
};
window.x_init_hook_clock = function () {
    var a = parseInt(jQuery('div.deal-timeleft').attr('diff'));
    if (!a > 0) return;
    var b = (new Date()).getTime();
    var e = function () {
        var c = (new Date()).getTime();
        var ls = a + b - c;
        if (ls > 0) {
            var ld = parseInt(ls / 86400000);
            ls = ls % 86400000;
            var lh = parseInt(ls / 3600000);
            ls = ls % 3600000;
            var lm = parseInt(ls / 60000);
            var ls = parseInt(Math.round(ls % 60000) / 1000);
            if (ld > 0) {
                var html = '<li><span>' + ld + '</span>天</li><li><span>' + lh + '</span>小时</li><li><span>' + lm + '</span>分钟</li>'
            } else {
                var html = '<li><span>' + lh + '</span>小时</li><li><span>' + lm + '</span>分钟</li><li><span>' + ls + '</span>秒</li>'
            }
            jQuery('ul#counter').html(html)
        } else {
            jQuery("ul#counter").stopTime('counter');
            jQuery('ul#counter').html('end');
            window.location.reload()
        }
    };
    jQuery("ul#counter").everyTime(996, 'counter', e)
};
window.x_init_hook_team = function () {
    jQuery('#deal-buy-quantity-input').bind("keyup", function () {
        var n = parseInt(jQuery(this).attr('value'), 10);
        var per = parseInt(jQuery('#deal-per-number').attr('value'), 10);
        if (n > per && per > 0) {
            n = per
        }
        n = isNaN(n) ? '' : n;
        jQuery(this).attr('value', n);
        var p = parseFloat(jQuery('#deal-buy-price').html(), 10);
        p = isNaN(p) ? 0 : p;
        n = isNaN(n) ? 0 : n;
        var t = n * p;
        jQuery('#deal-buy-total').html(t.toFixed(2));
        X.team.dealbuy_totalprice()
    })
};
window.x_init_hook_order = function () {
    jQuery('form[id="order-pay-form"]').bind('submit', function () {
        X.get(WEB_ROOT + '/ajax/order.php?action=dialog&id=' + jQuery(this).attr('sid'))
    })
};
X.misc = {};
X.misc.copyToCB = function (tid) {
    var o = jQuery('#' + tid);
    o.select();
    var maintext = o.val();
    if (window.clipboardData) {
        if ((window.clipboardData.setData("Text", maintext))) {
            var tip = o.attr('tip');
            if (tip) alert(tip);
            return true
        }
    } else if (window.netscape) {
        netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
        var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
        if (!clip) return;
        var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
        if (!trans) return;
        trans.addDataFlavor('text/unicode');
        var str = new Object();
        var len = new Object();
        var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
        var copytext = maintext;
        str.data = copytext;
        trans.setTransferData("text/unicode", str, copytext.length * 2);
        var clipid = Components.interfaces.nsIClipboard;
        if (!clip) return false;
        clip.setData(trans, null, clipid.kGlobalClipboard);
        var tip = o.attr('tip');
        if (tip) alert(tip);
        return true
    }
    return false
};
X.misc.scaleimage = function (o, mw) {
    var w = jQuery(o).width();
    if (w > mw) jQuery(o).css('width', mw + 'px')
};
X.misc.inputblur = function () {
    var v = jQuery(this).attr('value');
    var t = jQuery(this).attr('xtip');
    if (v == t || !v) {
        jQuery(this).attr('value', t);
        jQuery(this).css('color', '#999')
    }
};
X.misc.inputclick = function () {
    var v = jQuery(this).attr('value');
    var t = jQuery(this).attr('xtip');
    if (v == t) {
        jQuery(this).attr('value', '')
    }
    jQuery(this).css('color', '#333')
};
X.misc.noticenext = function (tid, nid) {
    jQuery('#dialog_subscribe_count_id').html(nid);
    return X.get(WEB_ROOT + '/ajax/manage.php?action=noticesubscribe&id=' + tid + '&nid=' + nid)
};
X.misc.noticenextsms = function (tid, nid) {
    jQuery('#dialog_smssubscribe_count_id').html(nid);
    return X.get(WEB_ROOT + '/ajax/manage.php?action=noticesmssubscribe&id=' + tid + '&nid=' + nid)
};
X.misc.noticesms = function (tid, nid) {
    jQuery('#dialog_sms_count_id').html(nid);
    return X.get(WEB_ROOT + '/ajax/manage.php?action=noticesms&id=' + tid + '&nid=' + nid)
};
X.misc.needlogin = function () {
    return LOGINUID > 0 ? true : !X.get(WEB_ROOT + '/ajax/system.php?action=needlogin')
};
X.misc.cardcode = function () {
    var oid = jQuery('#cardcode-order-id').attr('value');
    var cid = jQuery('#cardcode-card-id').attr('value');
    if (oid && cid) return !X.get(WEB_ROOT + '/ajax/order.php?action=cardcode&id=' + oid + '&cid=' + cid)
};
X.misc.smscount = function () {
    var l = jQuery('#sms-content-id').val().length;
    var s = Math.ceil(l / 70);
    jQuery('#span-sms-length-id').html(l);
    jQuery('#span-sms-split-id').html(s)
};
X.misc.locale = function () {
    return X.get(WEB_ROOT + '/ajax/system.php?action=locale')
};
X.team = {};
X.team.consultation_again = function () {
    jQuery('#consult-content').val('');
    jQuery('#consult-add-form').toggle();
    jQuery('#consult-add-succ').toggle()
};
X.team.dealbuy_totalprice = function () {
    var n = parseFloat(jQuery('#deal-buy-total').html(), 10);
    n = isNaN(n) ? 0 : n;
    var p = parseFloat(jQuery('#deal-express-total').html(), 10);
    p = isNaN(p) ? 0 : p;
    var t = n + p;
    jQuery('#deal-buy-total-t').html(t.toFixed(2))
};
X.team.changetype = function (type) {
    var display = (type == 'goods') ? 'none' : 'block';
    if (type == 'goods') jQuery('#team-create-per-number').val('0');
    if (type != 'seconds') {
        jQuery('#team-create-begin-time').val(jQuery('#team-create-begin-time').attr('xd'));
        jQuery('#team-create-end-time').val(jQuery('#team-create-end-time').attr('xd'));
        jQuery('#team-create-begin-time').attr('maxLength', 10);
        jQuery('#team-create-end-time').attr('maxLength', 10)
    } else {
        jQuery('#team-create-begin-time').val(jQuery('#team-create-begin-time').attr('xd') + ' ' + jQuery('#team-create-begin-time').attr('xt'));
        jQuery('#team-create-end-time').val(jQuery('#team-create-end-time').attr('xd') + ' ' + jQuery('#team-create-end-time').attr('xt'));
        jQuery('#team-create-begin-time').attr('maxLength', 19);
        jQuery('#team-create-end-time').attr('maxLength', 19)
    }
    jQuery('#field_city').css('display', display);
    jQuery('#field_num').css('display', display);
    jQuery('#field_notice').css('display', display);
    jQuery('#field_card').css('display', display);
    jQuery('#field_userreview').css('display', display);
    jQuery('#field_systemreview').css('display', display);
    jQuery('#field_limit').css('display', display)
};
X.coupon = {};
X.coupon.dialogquery = function () {
    var id = jQuery('#coupon-dialog-input-id').attr('value');
    if (id) return !X.get(WEB_ROOT + '/ajax/coupon.php?action=query&id=' + encodeURIComponent(id))
};
X.coupon.dialogconsume = function () {
    var id = jQuery('#coupon-dialog-input-id').attr('value');
    var secret = jQuery('#coupon-dialog-input-secret').attr('value');
    if (id && secret) {
        var ask = jQuery('#coupon-dialog-consume').attr('ask');
        return confirm(ask) && !X.get(WEB_ROOT + '/ajax/coupon.php?action=consume&id=' + encodeURIComponent(id) + '&secret=' + encodeURIComponent(secret))
    }
};
X.coupon.dialoginputkeyup = function (o) {
    jQuery(o).attr('value', jQuery(o).attr('value').toUpperCase())
};
X.manage = {};
X.manage.loadtemplate = function (id) {
    window.location.href = WEB_ROOT + '/manage/system/template.php?id=' + id
};
X.manage.loadpage = function (id) {
    window.location.href = WEB_ROOT + '/manage/system/page.php?id=' + id
};
X.manage.usermoney = function () {
    var money = parseInt(jQuery('#user-dialog-input-id').attr('value'));
    var uid = jQuery('#user-dialog-input-id').attr('uid');
    var ask = jQuery('#user-dialog-input-id').attr('ask');
    if (uid && money && (!ask || confirm(ask))) return !X.get(WEB_ROOT + '/ajax/manage.php?action=usermoney&id=' + uid + '&money=' + encodeURIComponent(money))
};
X.manage.orderexpress = function () {
    var eid = parseInt(jQuery('#order-dialog-select-id').val());
    var nid = jQuery('#order-dialog-input-id').attr('value');
    var oid = jQuery('#dialog-order-id').attr('oid');
    if (oid) return !X.get(WEB_ROOT + '/ajax/manage.php?action=orderexpress&id=' + oid + '&eid=' + eid + '&nid=' + encodeURIComponent(nid))
};
X.manage.orderrefund = function () {
    var rid = jQuery('#order-dialog-refund-id').val();
    var oid = jQuery('#dialog-order-id').attr('oid');
    if (oid && rid) return !X.get(WEB_ROOT + '/ajax/manage.php?action=orderrefund&id=' + oid + '&rid=' + rid)
};
X.manage.teamcoupon = function (tid) {
    return !X.get(WEB_ROOT + '/ajax/manage.php?action=teamcoupon&id=' + tid)
};
X.miscajax = function (script, action) {
    return !X.get(WEB_ROOT + '/ajax/' + script + '.php?action=' + action)
};
if (typeof deconcept == "undefined") {
    var deconcept = new Object()
}
if (typeof deconcept.util == "undefined") {
    deconcept.util = new Object()
}
if (typeof deconcept.SWFObjectUtil == "undefined") {
    deconcept.SWFObjectUtil = new Object()
}
deconcept.SWFObject = function (_1, id, w, h, _5, c, _7, _8, _9, _a, _b) {
    if (!document.createElement || !document.getElementById) {
        return
    }
    this.DETECT_KEY = _b ? _b : "detectflash";
    this.skipDetect = true;
    this.params = new Object();
    this.variables = new Object();
    this.attributes = new Array();
    if (_1) {
        this.setAttribute("swf", _1)
    }
    if (id) {
        this.setAttribute("id", id)
    }
    if (w) {
        this.setAttribute("width", w)
    }
    if (h) {
        this.setAttribute("height", h)
    }
    if (_5) {
        this.setAttribute("version", new deconcept.PlayerVersion(_5.toString().split(".")))
    }
    this.installedVer = deconcept.SWFObjectUtil.getPlayerVersion(this.getAttribute("version"), _7);
    if (c) {
        this.addParam("bgcolor", c)
    } else {
        this.addParam("wmode", "transparent")
    }
    var q = _8 ? _8 : "high";
    this.addParam("quality", q);
    this.setAttribute("useExpressInstall", _7);
    this.setAttribute("doExpressInstall", false);
    var _d = (_9) ? _9 : window.location;
    this.setAttribute("xiRedirectUrl", _d);
    this.setAttribute("redirectUrl", "");
    if (_a) {
        this.setAttribute("redirectUrl", _a)
    }
};
deconcept.SWFObject.prototype = {
    setAttribute: function (_e, _f) {
        this.attributes[_e] = _f
    },
    getAttribute: function (_10) {
        return this.attributes[_10]
    },
    addParam: function (_11, _12) {
        this.params[_11] = _12
    },
    getParams: function () {
        return this.params
    },
    addVariable: function (_13, _14) {
        this.variables[_13] = _14
    },
    getVariable: function (_15) {
        return this.variables[_15]
    },
    getVariables: function () {
        return this.variables
    },
    getVariablePairs: function () {
        var _16 = new Array();
        var key;
        var _18 = this.getVariables();
        for (key in _18) {
            _16.push(key + "=" + _18[key])
        }
        return _16
    },
    getSWFHTML: function () {
        var _19 = "";
        if (navigator.plugins && navigator.mimeTypes && navigator.mimeTypes.length) {
            if (this.getAttribute("doExpressInstall")) {
                this.addVariable("MMplayerType", "PlugIn")
            }
            _19 = "<embed type=\"application/x-shockwave-flash\" src=\"" + this.getAttribute("swf") + "\" width=\"" + this.getAttribute("width") + "\" height=\"" + this.getAttribute("height") + "\"";
            _19 += " id=\"" + this.getAttribute("id") + "\" name=\"" + this.getAttribute("id") + "\" ";
            var _1a = this.getParams();
            for (var key in _1a) {
                _19 += [key] + "=\"" + _1a[key] + "\" "
            }
            var _1c = this.getVariablePairs().join("&");
            if (_1c.length > 0) {
                _19 += "flashvars=\"" + _1c + "\""
            }
            _19 += " pluginspage=\"http://www.macromedia.com/go/getflashplayer\"/>"
        } else {
            if (this.getAttribute("doExpressInstall")) {
                this.addVariable("MMplayerType", "ActiveX")
            }
            _19 = "<object id=\"" + this.getAttribute("id") + "\" classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" width=\"" + this.getAttribute("width") + "\" height=\"" + this.getAttribute("height") + "\" codebase=\"http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0\">";
            _19 += "<param name=\"movie\" value=\"" + this.getAttribute("swf") + "\" />";
            var _1d = this.getParams();
            for (var key in _1d) {
                _19 += "<param name=\"" + key + "\" value=\"" + _1d[key] + "\" />"
            }
            var _1f = this.getVariablePairs().join("&");
            if (_1f.length > 0) {
                _19 += "<param name=\"flashvars\" value=\"" + _1f + "\" />"
            }
            _19 += "</object>"
        }
        return _19
    },
    write: function (_20) {
        if (this.getAttribute("useExpressInstall")) {
            var _21 = new deconcept.PlayerVersion([6, 0, 65]);
            if (this.installedVer.versionIsValid(_21) && !this.installedVer.versionIsValid(this.getAttribute("version"))) {
                this.setAttribute("doExpressInstall", true);
                this.addVariable("MMredirectURL", escape(this.getAttribute("xiRedirectUrl")));
                document.title = document.title.slice(0, 47) + " - Flash Player Installation";
                this.addVariable("MMdoctitle", document.title)
            }
        }
        if (this.skipDetect || this.getAttribute("doExpressInstall") || this.installedVer.versionIsValid(this.getAttribute("version"))) {
            var n = (typeof _20 == "string") ? document.getElementById(_20) : _20;
            n.innerHTML = this.getSWFHTML();
            return true
        } else {
            if (this.getAttribute("redirectUrl") != "") {
                document.location.replace(this.getAttribute("redirectUrl"))
            }
        }
        return false
    }
};
deconcept.SWFObjectUtil.getPlayerVersion = function (_23, _24) {
    var _25 = new deconcept.PlayerVersion([0, 0, 0]);
    if (navigator.plugins && navigator.mimeTypes.length) {
        var x = navigator.plugins["Shockwave Flash"];
        if (x && x.description) {
            _25 = new deconcept.PlayerVersion(x.description.replace(/([a-z]|[A-Z]|\s)+/, "").replace(/(\s+r|\s+b[0-9]+)/, ".").split("."))
        }
    } else {
        try {
            var axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
            for (var i = 15; i > 6; i--) {
                try {
                    axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + i);
                    _25 = new deconcept.PlayerVersion([i, 0, 0]);
                    break
                } catch (e) {}
            }
        } catch (e) {}
        if (_23 && _25.major > _23.major) {
            return _25
        }
        if (!_23 || ((_23.minor != 0 || _23.rev != 0) && _25.major == _23.major) || _25.major != 6 || _24) {
            try {
                _25 = new deconcept.PlayerVersion(axo.GetVariable("$version").split(" ")[1].split(","))
            } catch (e) {}
        }
    }
    return _25
};
deconcept.PlayerVersion = function (_29) {
    this.major = parseInt(_29[0]) != null ? parseInt(_29[0]) : 0;
    this.minor = parseInt(_29[1]) || 0;
    this.rev = parseInt(_29[2]) || 0
};
deconcept.PlayerVersion.prototype.versionIsValid = function (fv) {
    if (this.major < fv.major) {
        return false
    }
    if (this.major > fv.major) {
        return true
    }
    if (this.minor < fv.minor) {
        return false
    }
    if (this.minor > fv.minor) {
        return true
    }
    if (this.rev < fv.rev) {
        return false
    }
    return true
};
deconcept.util = {
    getRequestParameter: function (_2b) {
        var q = document.location.search || document.location.hash;
        if (q) {
            var _2d = q.indexOf(_2b + "=");
            var _2e = (q.indexOf("&", _2d) > -1) ? q.indexOf("&", _2d) : q.length;
            if (q.length > 1 && _2d > -1) {
                return q.substring(q.indexOf("=", _2d) + 1, _2e)
            }
        }
        return ""
    }
};
if (Array.prototype.push == null) {
    Array.prototype.push = function (_2f) {
        this[this.length] = _2f;
        return this.length
    }
}
var getQueryParamValue = deconcept.util.getRequestParameter;
var FlashObject = deconcept.SWFObject;
var SWFObject = deconcept.SWFObject;
var hexcase = 0;
var b64pad = "";

function hex_md5(s) {
    return rstr2hex(rstr_md5(str2rstr_utf8(s)))
}
function b64_md5(s) {
    return rstr2b64(rstr_md5(str2rstr_utf8(s)))
}
function any_md5(s, e) {
    return rstr2any(rstr_md5(str2rstr_utf8(s)), e)
}
function hex_hmac_md5(k, d) {
    return rstr2hex(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d)))
}
function b64_hmac_md5(k, d) {
    return rstr2b64(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d)))
}
function any_hmac_md5(k, d, e) {
    return rstr2any(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d)), e)
}
function md5_vm_test() {
    return hex_md5("abc").toLowerCase() == "900150983cd24fb0d6963f7d28e17f72"
}
function rstr_md5(s) {
    return binl2rstr(binl_md5(rstr2binl(s), s.length * 8))
}
function rstr_hmac_md5(key, data) {
    var bkey = rstr2binl(key);
    if (bkey.length > 16) bkey = binl_md5(bkey, key.length * 8);
    var ipad = Array(16),
        opad = Array(16);
    for (var i = 0; i < 16; i++) {
        ipad[i] = bkey[i] ^ 0x36363636;
        opad[i] = bkey[i] ^ 0x5C5C5C5C
    }
    var hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
    return binl2rstr(binl_md5(opad.concat(hash), 512 + 128))
}
function rstr2hex(input) {
    try {
        hexcase
    } catch (e) {
        hexcase = 0
    }
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var output = "";
    var x;
    for (var i = 0; i < input.length; i++) {
        x = input.charCodeAt(i);
        output += hex_tab.charAt((x >>> 4) & 0x0F) + hex_tab.charAt(x & 0x0F)
    }
    return output
}
function rstr2b64(input) {
    try {
        b64pad
    } catch (e) {
        b64pad = ''
    }
    var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var output = "";
    var len = input.length;
    for (var i = 0; i < len; i += 3) {
        var triplet = (input.charCodeAt(i) << 16) | (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0) | (i + 2 < len ? input.charCodeAt(i + 2) : 0);
        for (var j = 0; j < 4; j++) {
            if (i * 8 + j * 6 > input.length * 8) output += b64pad;
            else output += tab.charAt((triplet >>> 6 * (3 - j)) & 0x3F)
        }
    }
    return output
}
function rstr2any(input, encoding) {
    var divisor = encoding.length;
    var i, j, q, x, quotient;
    var dividend = Array(Math.ceil(input.length / 2));
    for (i = 0; i < dividend.length; i++) {
        dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1)
    }
    var full_length = Math.ceil(input.length * 8 / (Math.log(encoding.length) / Math.log(2)));
    var remainders = Array(full_length);
    for (j = 0; j < full_length; j++) {
        quotient = Array();
        x = 0;
        for (i = 0; i < dividend.length; i++) {
            x = (x << 16) + dividend[i];
            q = Math.floor(x / divisor);
            x -= q * divisor;
            if (quotient.length > 0 || q > 0) quotient[quotient.length] = q
        }
        remainders[j] = x;
        dividend = quotient
    }
    var output = "";
    for (i = remainders.length - 1; i >= 0; i--) output += encoding.charAt(remainders[i]);
    return output
}
function str2rstr_utf8(input) {
    var output = "";
    var i = -1;
    var x, y;
    while (++i < input.length) {
        x = input.charCodeAt(i);
        y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
        if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
            x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
            i++
        }
        if (x <= 0x7F) output += String.fromCharCode(x);
        else if (x <= 0x7FF) output += String.fromCharCode(0xC0 | ((x >>> 6) & 0x1F), 0x80 | (x & 0x3F));
        else if (x <= 0xFFFF) output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F));
        else if (x <= 0x1FFFFF) output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07), 0x80 | ((x >>> 12) & 0x3F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F))
    }
    return output
}
function str2rstr_utf16le(input) {
    var output = "";
    for (var i = 0; i < input.length; i++) output += String.fromCharCode(input.charCodeAt(i) & 0xFF, (input.charCodeAt(i) >>> 8) & 0xFF);
    return output
}
function str2rstr_utf16be(input) {
    var output = "";
    for (var i = 0; i < input.length; i++) output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF, input.charCodeAt(i) & 0xFF);
    return output
}
function rstr2binl(input) {
    var output = Array(input.length >> 2);
    for (var i = 0; i < output.length; i++) output[i] = 0;
    for (var i = 0; i < input.length * 8; i += 8) output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
    return output
}
function binl2rstr(input) {
    var output = "";
    for (var i = 0; i < input.length * 32; i += 8) output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
    return output
}
function binl_md5(x, len) {
    x[len >> 5] |= 0x80 << ((len) % 32);
    x[(((len + 64) >>> 9) << 4) + 14] = len;
    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;
    for (var i = 0; i < x.length; i += 16) {
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;
        a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
        d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
        c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
        b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
        a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
        d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
        c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
        b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
        a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
        d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
        c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
        b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
        a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
        d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
        c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
        b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
        a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
        d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
        c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
        b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
        a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
        d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
        c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
        b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
        a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
        d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
        c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
        b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
        a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
        d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
        c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
        b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
        a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
        d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
        c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
        b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
        a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
        d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
        c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
        b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
        a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
        d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
        c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
        b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
        a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
        d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
        c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
        b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
        a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
        d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
        c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
        b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
        a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
        d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
        c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
        b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
        a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
        d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
        c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
        b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
        a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
        d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
        c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
        b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
        a = safe_add(a, olda);
        b = safe_add(b, oldb);
        c = safe_add(c, oldc);
        d = safe_add(d, oldd)
    }
    return Array(a, b, c, d)
}
function md5_cmn(q, a, b, x, s, t) {
    return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b)
}
function md5_ff(a, b, c, d, x, s, t) {
    return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t)
}
function md5_gg(a, b, c, d, x, s, t) {
    return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t)
}
function md5_hh(a, b, c, d, x, s, t) {
    return md5_cmn(b ^ c ^ d, a, b, x, s, t)
}
function md5_ii(a, b, c, d, x, s, t) {
    return md5_cmn(c ^ (b | (~d)), a, b, x, s, t)
}
function safe_add(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF)
}
function bit_rol(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt))
}