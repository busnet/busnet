/*!
* jQuery JavaScript Library v1.10.2
* http://jquery.com/
*
* Includes Sizzle.js
* http://sizzlejs.com/
*
* Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
* Released under the MIT license
* http://jquery.org/license
*
* Date: 2013-07-03T13:48Z
*/
(function (window, undefined) {

    // Can't do this because several apps including ASP.NET trace
    // the stack via arguments.caller.callee and Firefox dies if
    // you try to trace through "use strict" call chains. (#13335)
    // Support: Firefox 18+
    //"use strict";
    var 
    // The deferred used on DOM ready
	readyList,

    // A central reference to the root jQuery(document)
	rootjQuery,

    // Support: IE<10
    // For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
	core_strundefined = typeof undefined,

    // Use the correct document accordingly with window argument (sandbox)
	location = window.location,
	document = window.document,
	docElem = document.documentElement,

    // Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

    // Map over the $ in case of overwrite
	_$ = window.$,

    // [[Class]] -> type pairs
	class2type = {},

    // List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.10.2",

    // Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

    // Define a local copy of jQuery
	jQuery = function (selector, context) {
	    // The jQuery object is actually just the init constructor 'enhanced'
	    return new jQuery.fn.init(selector, context, rootjQuery);
	},

    // Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

    // Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

    // Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

    // A simple way to check for HTML strings
    // Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
    // Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

    // Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

    // JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

    // Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

    // Used by jQuery.camelCase as callback to replace()
	fcamelCase = function (all, letter) {
	    return letter.toUpperCase();
	},

    // The ready event handler
	completed = function (event) {

	    // readyState === "complete" is good enough for us to call the dom ready in oldIE
	    if (document.addEventListener || event.type === "load" || document.readyState === "complete") {
	        detach();
	        jQuery.ready();
	    }
	},
    // Clean-up method for dom ready events
	detach = function () {
	    if (document.addEventListener) {
	        document.removeEventListener("DOMContentLoaded", completed, false);
	        window.removeEventListener("load", completed, false);

	    } else {
	        document.detachEvent("onreadystatechange", completed);
	        window.detachEvent("onload", completed);
	    }
	};

    jQuery.fn = jQuery.prototype = {
        // The current version of jQuery being used
        jquery: core_version,

        constructor: jQuery,
        init: function (selector, context, rootjQuery) {
            var match, elem;

            // HANDLE: $(""), $(null), $(undefined), $(false)
            if (!selector) {
                return this;
            }

            // Handle HTML strings
            if (typeof selector === "string") {
                if (selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3) {
                    // Assume that strings that start and end with <> are HTML and skip the regex check
                    match = [null, selector, null];

                } else {
                    match = rquickExpr.exec(selector);
                }

                // Match html or make sure no context is specified for #id
                if (match && (match[1] || !context)) {

                    // HANDLE: $(html) -> $(array)
                    if (match[1]) {
                        context = context instanceof jQuery ? context[0] : context;

                        // scripts is true for back-compat
                        jQuery.merge(this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					));

                        // HANDLE: $(html, props)
                        if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
                            for (match in context) {
                                // Properties of context are called as methods if possible
                                if (jQuery.isFunction(this[match])) {
                                    this[match](context[match]);

                                    // ...and otherwise set as attributes
                                } else {
                                    this.attr(match, context[match]);
                                }
                            }
                        }

                        return this;

                        // HANDLE: $(#id)
                    } else {
                        elem = document.getElementById(match[2]);

                        // Check parentNode to catch when Blackberry 4.6 returns
                        // nodes that are no longer in the document #6963
                        if (elem && elem.parentNode) {
                            // Handle the case where IE and Opera return items
                            // by name instead of ID
                            if (elem.id !== match[2]) {
                                return rootjQuery.find(selector);
                            }

                            // Otherwise, we inject the element directly into the jQuery object
                            this.length = 1;
                            this[0] = elem;
                        }

                        this.context = document;
                        this.selector = selector;
                        return this;
                    }

                    // HANDLE: $(expr, $(...))
                } else if (!context || context.jquery) {
                    return (context || rootjQuery).find(selector);

                    // HANDLE: $(expr, context)
                    // (which is just equivalent to: $(context).find(expr)
                } else {
                    return this.constructor(context).find(selector);
                }

                // HANDLE: $(DOMElement)
            } else if (selector.nodeType) {
                this.context = this[0] = selector;
                this.length = 1;
                return this;

                // HANDLE: $(function)
                // Shortcut for document ready
            } else if (jQuery.isFunction(selector)) {
                return rootjQuery.ready(selector);
            }

            if (selector.selector !== undefined) {
                this.selector = selector.selector;
                this.context = selector.context;
            }

            return jQuery.makeArray(selector, this);
        },

        // Start with an empty selector
        selector: "",

        // The default length of a jQuery object is 0
        length: 0,

        toArray: function () {
            return core_slice.call(this);
        },

        // Get the Nth element in the matched element set OR
        // Get the whole matched element set as a clean array
        get: function (num) {
            return num == null ?

            // Return a 'clean' array
			this.toArray() :

            // Return just the object
			(num < 0 ? this[this.length + num] : this[num]);
        },

        // Take an array of elements and push it onto the stack
        // (returning the new matched element set)
        pushStack: function (elems) {

            // Build a new jQuery matched element set
            var ret = jQuery.merge(this.constructor(), elems);

            // Add the old object onto the stack (as a reference)
            ret.prevObject = this;
            ret.context = this.context;

            // Return the newly-formed element set
            return ret;
        },

        // Execute a callback for every element in the matched set.
        // (You can seed the arguments with an array of args, but this is
        // only used internally.)
        each: function (callback, args) {
            return jQuery.each(this, callback, args);
        },

        ready: function (fn) {
            // Add the callback
            jQuery.ready.promise().done(fn);

            return this;
        },

        slice: function () {
            return this.pushStack(core_slice.apply(this, arguments));
        },

        first: function () {
            return this.eq(0);
        },

        last: function () {
            return this.eq(-1);
        },

        eq: function (i) {
            var len = this.length,
			j = +i + (i < 0 ? len : 0);
            return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
        },

        map: function (callback) {
            return this.pushStack(jQuery.map(this, function (elem, i) {
                return callback.call(elem, i, elem);
            }));
        },

        end: function () {
            return this.prevObject || this.constructor(null);
        },

        // For internal use only.
        // Behaves like an Array's method, not like a jQuery method.
        push: core_push,
        sort: [].sort,
        splice: [].splice
    };

    // Give the init function the jQuery prototype for later instantiation
    jQuery.fn.init.prototype = jQuery.fn;

    jQuery.extend = jQuery.fn.extend = function () {
        var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

        // Handle a deep copy situation
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[1] || {};
            // skip the boolean and the target
            i = 2;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if (typeof target !== "object" && !jQuery.isFunction(target)) {
            target = {};
        }

        // extend jQuery itself if only one argument is passed
        if (length === i) {
            target = this;
            --i;
        }

        for (; i < length; i++) {
            // Only deal with non-null/undefined values
            if ((options = arguments[i]) != null) {
                // Extend the base object
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    // Prevent never-ending loop
                    if (target === copy) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && jQuery.isArray(src) ? src : [];

                        } else {
                            clone = src && jQuery.isPlainObject(src) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[name] = jQuery.extend(deep, clone, copy);

                        // Don't bring in undefined values
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    };

    jQuery.extend({
        // Unique for each copy of jQuery on the page
        // Non-digits removed to match rinlinejQuery
        expando: "jQuery" + (core_version + Math.random()).replace(/\D/g, ""),

        noConflict: function (deep) {
            if (window.$ === jQuery) {
                window.$ = _$;
            }

            if (deep && window.jQuery === jQuery) {
                window.jQuery = _jQuery;
            }

            return jQuery;
        },

        // Is the DOM ready to be used? Set to true once it occurs.
        isReady: false,

        // A counter to track how many items to wait for before
        // the ready event fires. See #6781
        readyWait: 1,

        // Hold (or release) the ready event
        holdReady: function (hold) {
            if (hold) {
                jQuery.readyWait++;
            } else {
                jQuery.ready(true);
            }
        },

        // Handle when the DOM is ready
        ready: function (wait) {

            // Abort if there are pending holds or we're already ready
            if (wait === true ? --jQuery.readyWait : jQuery.isReady) {
                return;
            }

            // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
            if (!document.body) {
                return setTimeout(jQuery.ready);
            }

            // Remember that the DOM is ready
            jQuery.isReady = true;

            // If a normal DOM Ready event fired, decrement, and wait if need be
            if (wait !== true && --jQuery.readyWait > 0) {
                return;
            }

            // If there are functions bound, to execute
            readyList.resolveWith(document, [jQuery]);

            // Trigger any bound ready events
            if (jQuery.fn.trigger) {
                jQuery(document).trigger("ready").off("ready");
            }
        },

        // See test/unit/core.js for details concerning isFunction.
        // Since version 1.3, DOM methods and functions like alert
        // aren't supported. They return false on IE (#2968).
        isFunction: function (obj) {
            return jQuery.type(obj) === "function";
        },

        isArray: Array.isArray || function (obj) {
            return jQuery.type(obj) === "array";
        },

        isWindow: function (obj) {
            /* jshint eqeqeq: false */
            return obj != null && obj == obj.window;
        },

        isNumeric: function (obj) {
            return !isNaN(parseFloat(obj)) && isFinite(obj);
        },

        type: function (obj) {
            if (obj == null) {
                return String(obj);
            }
            return typeof obj === "object" || typeof obj === "function" ?
			class2type[core_toString.call(obj)] || "object" :
			typeof obj;
        },

        isPlainObject: function (obj) {
            var key;

            // Must be an Object.
            // Because of IE, we also have to check the presence of the constructor property.
            // Make sure that DOM nodes and window objects don't pass through, as well
            if (!obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow(obj)) {
                return false;
            }

            try {
                // Not own constructor property must be Object
                if (obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                    return false;
                }
            } catch (e) {
                // IE8,9 Will throw exceptions on certain host objects #9897
                return false;
            }

            // Support: IE<9
            // Handle iteration over inherited properties before own properties.
            if (jQuery.support.ownLast) {
                for (key in obj) {
                    return core_hasOwn.call(obj, key);
                }
            }

            // Own properties are enumerated firstly, so to speed up,
            // if last one is own, then all properties are own.
            for (key in obj) { }

            return key === undefined || core_hasOwn.call(obj, key);
        },

        isEmptyObject: function (obj) {
            var name;
            for (name in obj) {
                return false;
            }
            return true;
        },

        error: function (msg) {
            throw new Error(msg);
        },

        // data: string of html
        // context (optional): If specified, the fragment will be created in this context, defaults to document
        // keepScripts (optional): If true, will include scripts passed in the html string
        parseHTML: function (data, context, keepScripts) {
            if (!data || typeof data !== "string") {
                return null;
            }
            if (typeof context === "boolean") {
                keepScripts = context;
                context = false;
            }
            context = context || document;

            var parsed = rsingleTag.exec(data),
			scripts = !keepScripts && [];

            // Single tag
            if (parsed) {
                return [context.createElement(parsed[1])];
            }

            parsed = jQuery.buildFragment([data], context, scripts);
            if (scripts) {
                jQuery(scripts).remove();
            }
            return jQuery.merge([], parsed.childNodes);
        },

        parseJSON: function (data) {
            // Attempt to parse using the native JSON parser first
            if (window.JSON && window.JSON.parse) {
                return window.JSON.parse(data);
            }

            if (data === null) {
                return data;
            }

            if (typeof data === "string") {

                // Make sure leading/trailing whitespace is removed (IE can't handle it)
                data = jQuery.trim(data);

                if (data) {
                    // Make sure the incoming data is actual JSON
                    // Logic borrowed from http://json.org/json2.js
                    if (rvalidchars.test(data.replace(rvalidescape, "@")
					.replace(rvalidtokens, "]")
					.replace(rvalidbraces, ""))) {

                        return (new Function("return " + data))();
                    }
                }
            }

            jQuery.error("Invalid JSON: " + data);
        },

        // Cross-browser xml parsing
        parseXML: function (data) {
            var xml, tmp;
            if (!data || typeof data !== "string") {
                return null;
            }
            try {
                if (window.DOMParser) { // Standard
                    tmp = new DOMParser();
                    xml = tmp.parseFromString(data, "text/xml");
                } else { // IE
                    xml = new ActiveXObject("Microsoft.XMLDOM");
                    xml.async = "false";
                    xml.loadXML(data);
                }
            } catch (e) {
                xml = undefined;
            }
            if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
                jQuery.error("Invalid XML: " + data);
            }
            return xml;
        },

        noop: function () { },

        // Evaluates a script in a global context
        // Workarounds based on findings by Jim Driscoll
        // http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
        globalEval: function (data) {
            if (data && jQuery.trim(data)) {
                // We use execScript on Internet Explorer
                // We use an anonymous function so that context is window
                // rather than jQuery in Firefox
                (window.execScript || function (data) {
                    window["eval"].call(window, data);
                })(data);
            }
        },

        // Convert dashed to camelCase; used by the css and data modules
        // Microsoft forgot to hump their vendor prefix (#9572)
        camelCase: function (string) {
            return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
        },

        nodeName: function (elem, name) {
            return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
        },

        // args is for internal usage only
        each: function (obj, callback, args) {
            var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike(obj);

            if (args) {
                if (isArray) {
                    for (; i < length; i++) {
                        value = callback.apply(obj[i], args);

                        if (value === false) {
                            break;
                        }
                    }
                } else {
                    for (i in obj) {
                        value = callback.apply(obj[i], args);

                        if (value === false) {
                            break;
                        }
                    }
                }

                // A special, fast, case for the most common use of each
            } else {
                if (isArray) {
                    for (; i < length; i++) {
                        value = callback.call(obj[i], i, obj[i]);

                        if (value === false) {
                            break;
                        }
                    }
                } else {
                    for (i in obj) {
                        value = callback.call(obj[i], i, obj[i]);

                        if (value === false) {
                            break;
                        }
                    }
                }
            }

            return obj;
        },

        // Use native String.trim function wherever possible
        trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function (text) {
		    return text == null ?
				"" :
				core_trim.call(text);
		} :

        // Otherwise use our own trimming functionality
		function (text) {
		    return text == null ?
				"" :
				(text + "").replace(rtrim, "");
		},

        // results is for internal usage only
        makeArray: function (arr, results) {
            var ret = results || [];

            if (arr != null) {
                if (isArraylike(Object(arr))) {
                    jQuery.merge(ret,
					typeof arr === "string" ?
					[arr] : arr
				);
                } else {
                    core_push.call(ret, arr);
                }
            }

            return ret;
        },

        inArray: function (elem, arr, i) {
            var len;

            if (arr) {
                if (core_indexOf) {
                    return core_indexOf.call(arr, elem, i);
                }

                len = arr.length;
                i = i ? i < 0 ? Math.max(0, len + i) : i : 0;

                for (; i < len; i++) {
                    // Skip accessing in sparse arrays
                    if (i in arr && arr[i] === elem) {
                        return i;
                    }
                }
            }

            return -1;
        },

        merge: function (first, second) {
            var l = second.length,
			i = first.length,
			j = 0;

            if (typeof l === "number") {
                for (; j < l; j++) {
                    first[i++] = second[j];
                }
            } else {
                while (second[j] !== undefined) {
                    first[i++] = second[j++];
                }
            }

            first.length = i;

            return first;
        },

        grep: function (elems, callback, inv) {
            var retVal,
			ret = [],
			i = 0,
			length = elems.length;
            inv = !!inv;

            // Go through the array, only saving the items
            // that pass the validator function
            for (; i < length; i++) {
                retVal = !!callback(elems[i], i);
                if (inv !== retVal) {
                    ret.push(elems[i]);
                }
            }

            return ret;
        },

        // arg is for internal usage only
        map: function (elems, callback, arg) {
            var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike(elems),
			ret = [];

            // Go through the array, translating each of the items to their
            if (isArray) {
                for (; i < length; i++) {
                    value = callback(elems[i], i, arg);

                    if (value != null) {
                        ret[ret.length] = value;
                    }
                }

                // Go through every key on the object,
            } else {
                for (i in elems) {
                    value = callback(elems[i], i, arg);

                    if (value != null) {
                        ret[ret.length] = value;
                    }
                }
            }

            // Flatten any nested arrays
            return core_concat.apply([], ret);
        },

        // A global GUID counter for objects
        guid: 1,

        // Bind a function to a context, optionally partially applying any
        // arguments.
        proxy: function (fn, context) {
            var args, proxy, tmp;

            if (typeof context === "string") {
                tmp = fn[context];
                context = fn;
                fn = tmp;
            }

            // Quick check to determine if target is callable, in the spec
            // this throws a TypeError, but we will just return undefined.
            if (!jQuery.isFunction(fn)) {
                return undefined;
            }

            // Simulated bind
            args = core_slice.call(arguments, 2);
            proxy = function () {
                return fn.apply(context || this, args.concat(core_slice.call(arguments)));
            };

            // Set the guid of unique handler to the same of original handler, so it can be removed
            proxy.guid = fn.guid = fn.guid || jQuery.guid++;

            return proxy;
        },

        // Multifunctional method to get and set values of a collection
        // The value/s can optionally be executed if it's a function
        access: function (elems, fn, key, value, chainable, emptyGet, raw) {
            var i = 0,
			length = elems.length,
			bulk = key == null;

            // Sets many values
            if (jQuery.type(key) === "object") {
                chainable = true;
                for (i in key) {
                    jQuery.access(elems, fn, i, key[i], true, emptyGet, raw);
                }

                // Sets one value
            } else if (value !== undefined) {
                chainable = true;

                if (!jQuery.isFunction(value)) {
                    raw = true;
                }

                if (bulk) {
                    // Bulk operations run against the entire set
                    if (raw) {
                        fn.call(elems, value);
                        fn = null;

                        // ...except when executing function values
                    } else {
                        bulk = fn;
                        fn = function (elem, key, value) {
                            return bulk.call(jQuery(elem), value);
                        };
                    }
                }

                if (fn) {
                    for (; i < length; i++) {
                        fn(elems[i], key, raw ? value : value.call(elems[i], i, fn(elems[i], key)));
                    }
                }
            }

            return chainable ?
			elems :

            // Gets
			bulk ?
				fn.call(elems) :
				length ? fn(elems[0], key) : emptyGet;
        },

        now: function () {
            return (new Date()).getTime();
        },

        // A method for quickly swapping in/out CSS properties to get correct calculations.
        // Note: this method belongs to the css module but it's needed here for the support module.
        // If support gets modularized, this method should be moved back to the css module.
        swap: function (elem, options, callback, args) {
            var ret, name,
			old = {};

            // Remember the old values, and insert the new ones
            for (name in options) {
                old[name] = elem.style[name];
                elem.style[name] = options[name];
            }

            ret = callback.apply(elem, args || []);

            // Revert the old values
            for (name in options) {
                elem.style[name] = old[name];
            }

            return ret;
        }
    });

    jQuery.ready.promise = function (obj) {
        if (!readyList) {

            readyList = jQuery.Deferred();

            // Catch cases where $(document).ready() is called after the browser event has already occurred.
            // we once tried to use readyState "interactive" here, but it caused issues like the one
            // discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
            if (document.readyState === "complete") {
                // Handle it asynchronously to allow scripts the opportunity to delay ready
                setTimeout(jQuery.ready);

                // Standards-based browsers support DOMContentLoaded
            } else if (document.addEventListener) {
                // Use the handy event callback
                document.addEventListener("DOMContentLoaded", completed, false);

                // A fallback to window.onload, that will always work
                window.addEventListener("load", completed, false);

                // If IE event model is used
            } else {
                // Ensure firing before onload, maybe late but safe also for iframes
                document.attachEvent("onreadystatechange", completed);

                // A fallback to window.onload, that will always work
                window.attachEvent("onload", completed);

                // If IE and not a frame
                // continually check to see if the document is ready
                var top = false;

                try {
                    top = window.frameElement == null && document.documentElement;
                } catch (e) { }

                if (top && top.doScroll) {
                    (function doScrollCheck() {
                        if (!jQuery.isReady) {

                            try {
                                // Use the trick by Diego Perini
                                // http://javascript.nwbox.com/IEContentLoaded/
                                top.doScroll("left");
                            } catch (e) {
                                return setTimeout(doScrollCheck, 50);
                            }

                            // detach all dom ready events
                            detach();

                            // and execute any waiting functions
                            jQuery.ready();
                        }
                    })();
                }
            }
        }
        return readyList.promise(obj);
    };

    // Populate the class2type map
    jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (i, name) {
        class2type["[object " + name + "]"] = name.toLowerCase();
    });

    function isArraylike(obj) {
        var length = obj.length,
		type = jQuery.type(obj);

        if (jQuery.isWindow(obj)) {
            return false;
        }

        if (obj.nodeType === 1 && length) {
            return true;
        }

        return type === "array" || type !== "function" &&
		(length === 0 ||
		typeof length === "number" && length > 0 && (length - 1) in obj);
    }

    // All jQuery objects should point back to these
    rootjQuery = jQuery(document);
    /*!
    * Sizzle CSS Selector Engine v1.10.2
    * http://sizzlejs.com/
    *
    * Copyright 2013 jQuery Foundation, Inc. and other contributors
    * Released under the MIT license
    * http://jquery.org/license
    *
    * Date: 2013-07-03
    */
    (function (window, undefined) {

        var i,
	support,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,

        // Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

        // Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	hasDuplicate = false,
	sortOrder = function (a, b) {
	    if (a === b) {
	        hasDuplicate = true;
	        return 0;
	    }
	    return 0;
	},

        // General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

        // Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
        // Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function (elem) {
	    var i = 0,
			len = this.length;
	    for (; i < len; i++) {
	        if (this[i] === elem) {
	            return i;
	        }
	    }
	    return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

        // Regular expressions

        // Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
        // http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

        // Loosely modeled on CSS identifier characters
        // An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
        // Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace("w", "w#"),

        // Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

        // Prefer arguments quoted,
        //   then not containing pseudos/brackets,
        //   then attribute selectors/non-parenthetical expressions,
        //   then anything else
        // These preferences are here to reduce the number of selectors
        //   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace(3, 8) + ")*)|.*)\\)|)",

        // Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"),

	rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"),
	rcombinators = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"),

	rsibling = new RegExp(whitespace + "*[+~]"),
	rattributeQuotes = new RegExp("=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g"),

	rpseudo = new RegExp(pseudos),
	ridentifier = new RegExp("^" + identifier + "$"),

	matchExpr = {
	    "ID": new RegExp("^#(" + characterEncoding + ")"),
	    "CLASS": new RegExp("^\\.(" + characterEncoding + ")"),
	    "TAG": new RegExp("^(" + characterEncoding.replace("w", "w*") + ")"),
	    "ATTR": new RegExp("^" + attributes),
	    "PSEUDO": new RegExp("^" + pseudos),
	    "CHILD": new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i"),
	    "bool": new RegExp("^(?:" + booleans + ")$", "i"),
	    // For use in libraries implementing .is()
	    // We use this for POS matching in `select`
	    "needsContext": new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
	},

	rnative = /^[^{]+\{\s*\[native \w/,

        // Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,

        // CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp("\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig"),
	funescape = function (_, escaped, escapedWhitespace) {
	    var high = "0x" + escaped - 0x10000;
	    // NaN means non-codepoint
	    // Support: Firefox
	    // Workaround erroneous numeric interpretation of +"0x"
	    return high !== high || escapedWhitespace ?
			escaped :
	    // BMP codepoint
			high < 0 ?
				String.fromCharCode(high + 0x10000) :
	    // Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode(high >> 10 | 0xD800, high & 0x3FF | 0xDC00);
	};

        // Optimize for push.apply( _, NodeList )
        try {
            push.apply(
		(arr = slice.call(preferredDoc.childNodes)),
		preferredDoc.childNodes
	);
            // Support: Android<4.0
            // Detect silently failing push.apply
            arr[preferredDoc.childNodes.length].nodeType;
        } catch (e) {
            push = { apply: arr.length ?

                // Leverage slice if possible
		function (target, els) {
		    push_native.apply(target, slice.call(els));
		} :

                // Support: IE<9
                // Otherwise append directly
		function (target, els) {
		    var j = target.length,
				i = 0;
		    // Can't trust NodeList.length
		    while ((target[j++] = els[i++])) { }
		    target.length = j - 1;
		}
            };
        }

        function Sizzle(selector, context, results, seed) {
            var match, elem, m, nodeType,
            // QSA vars
		i, groups, old, nid, newContext, newSelector;

            if ((context ? context.ownerDocument || context : preferredDoc) !== document) {
                setDocument(context);
            }

            context = context || document;
            results = results || [];

            if (!selector || typeof selector !== "string") {
                return results;
            }

            if ((nodeType = context.nodeType) !== 1 && nodeType !== 9) {
                return [];
            }

            if (documentIsHTML && !seed) {

                // Shortcuts
                if ((match = rquickExpr.exec(selector))) {
                    // Speed-up: Sizzle("#ID")
                    if ((m = match[1])) {
                        if (nodeType === 9) {
                            elem = context.getElementById(m);
                            // Check parentNode to catch when Blackberry 4.6 returns
                            // nodes that are no longer in the document #6963
                            if (elem && elem.parentNode) {
                                // Handle the case where IE, Opera, and Webkit return items
                                // by name instead of ID
                                if (elem.id === m) {
                                    results.push(elem);
                                    return results;
                                }
                            } else {
                                return results;
                            }
                        } else {
                            // Context is not a document
                            if (context.ownerDocument && (elem = context.ownerDocument.getElementById(m)) &&
						contains(context, elem) && elem.id === m) {
                                results.push(elem);
                                return results;
                            }
                        }

                        // Speed-up: Sizzle("TAG")
                    } else if (match[2]) {
                        push.apply(results, context.getElementsByTagName(selector));
                        return results;

                        // Speed-up: Sizzle(".CLASS")
                    } else if ((m = match[3]) && support.getElementsByClassName && context.getElementsByClassName) {
                        push.apply(results, context.getElementsByClassName(m));
                        return results;
                    }
                }

                // QSA path
                if (support.qsa && (!rbuggyQSA || !rbuggyQSA.test(selector))) {
                    nid = old = expando;
                    newContext = context;
                    newSelector = nodeType === 9 && selector;

                    // qSA works strangely on Element-rooted queries
                    // We can work around this by specifying an extra ID on the root
                    // and working up from there (Thanks to Andrew Dupont for the technique)
                    // IE 8 doesn't work on object elements
                    if (nodeType === 1 && context.nodeName.toLowerCase() !== "object") {
                        groups = tokenize(selector);

                        if ((old = context.getAttribute("id"))) {
                            nid = old.replace(rescape, "\\$&");
                        } else {
                            context.setAttribute("id", nid);
                        }
                        nid = "[id='" + nid + "'] ";

                        i = groups.length;
                        while (i--) {
                            groups[i] = nid + toSelector(groups[i]);
                        }
                        newContext = rsibling.test(selector) && context.parentNode || context;
                        newSelector = groups.join(",");
                    }

                    if (newSelector) {
                        try {
                            push.apply(results,
						newContext.querySelectorAll(newSelector)
					);
                            return results;
                        } catch (qsaError) {
                        } finally {
                            if (!old) {
                                context.removeAttribute("id");
                            }
                        }
                    }
                }
            }

            // All others
            return select(selector.replace(rtrim, "$1"), context, results, seed);
        }

        /**
        * Create key-value caches of limited size
        * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
        *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
        *	deleting the oldest entry
        */
        function createCache() {
            var keys = [];

            function cache(key, value) {
                // Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
                if (keys.push(key += " ") > Expr.cacheLength) {
                    // Only keep the most recent entries
                    delete cache[keys.shift()];
                }
                return (cache[key] = value);
            }
            return cache;
        }

        /**
        * Mark a function for special use by Sizzle
        * @param {Function} fn The function to mark
        */
        function markFunction(fn) {
            fn[expando] = true;
            return fn;
        }

        /**
        * Support testing using an element
        * @param {Function} fn Passed the created div and expects a boolean result
        */
        function assert(fn) {
            var div = document.createElement("div");

            try {
                return !!fn(div);
            } catch (e) {
                return false;
            } finally {
                // Remove from its parent by default
                if (div.parentNode) {
                    div.parentNode.removeChild(div);
                }
                // release memory in IE
                div = null;
            }
        }

        /**
        * Adds the same handler for all of the specified attrs
        * @param {String} attrs Pipe-separated list of attributes
        * @param {Function} handler The method that will be applied
        */
        function addHandle(attrs, handler) {
            var arr = attrs.split("|"),
		i = attrs.length;

            while (i--) {
                Expr.attrHandle[arr[i]] = handler;
            }
        }

        /**
        * Checks document order of two siblings
        * @param {Element} a
        * @param {Element} b
        * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
        */
        function siblingCheck(a, b) {
            var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			(~b.sourceIndex || MAX_NEGATIVE) -
			(~a.sourceIndex || MAX_NEGATIVE);

            // Use IE sourceIndex if available on both nodes
            if (diff) {
                return diff;
            }

            // Check if b follows a
            if (cur) {
                while ((cur = cur.nextSibling)) {
                    if (cur === b) {
                        return -1;
                    }
                }
            }

            return a ? 1 : -1;
        }

        /**
        * Returns a function to use in pseudos for input types
        * @param {String} type
        */
        function createInputPseudo(type) {
            return function (elem) {
                var name = elem.nodeName.toLowerCase();
                return name === "input" && elem.type === type;
            };
        }

        /**
        * Returns a function to use in pseudos for buttons
        * @param {String} type
        */
        function createButtonPseudo(type) {
            return function (elem) {
                var name = elem.nodeName.toLowerCase();
                return (name === "input" || name === "button") && elem.type === type;
            };
        }

        /**
        * Returns a function to use in pseudos for positionals
        * @param {Function} fn
        */
        function createPositionalPseudo(fn) {
            return markFunction(function (argument) {
                argument = +argument;
                return markFunction(function (seed, matches) {
                    var j,
				matchIndexes = fn([], seed.length, argument),
				i = matchIndexes.length;

                    // Match elements found at the specified indexes
                    while (i--) {
                        if (seed[(j = matchIndexes[i])]) {
                            seed[j] = !(matches[j] = seed[j]);
                        }
                    }
                });
            });
        }

        /**
        * Detect xml
        * @param {Element|Object} elem An element or a document
        */
        isXML = Sizzle.isXML = function (elem) {
            // documentElement is verified for cases where it doesn't yet exist
            // (such as loading iframes in IE - #4833)
            var documentElement = elem && (elem.ownerDocument || elem).documentElement;
            return documentElement ? documentElement.nodeName !== "HTML" : false;
        };

        // Expose support vars for convenience
        support = Sizzle.support = {};

        /**
        * Sets document-related variables once based on the current document
        * @param {Element|Object} [doc] An element or document object to use to set the document
        * @returns {Object} Returns the current document
        */
        setDocument = Sizzle.setDocument = function (node) {
            var doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

            // If no document and documentElement is available, return
            if (doc === document || doc.nodeType !== 9 || !doc.documentElement) {
                return document;
            }

            // Set our document
            document = doc;
            docElem = doc.documentElement;

            // Support tests
            documentIsHTML = !isXML(doc);

            // Support: IE>8
            // If iframe document is assigned to "document" variable and if iframe has been reloaded,
            // IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
            // IE6-8 do not support the defaultView property so parent will be undefined
            if (parent && parent.attachEvent && parent !== parent.top) {
                parent.attachEvent("onbeforeunload", function () {
                    setDocument();
                });
            }

            /* Attributes
            ---------------------------------------------------------------------- */

            // Support: IE<8
            // Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
            support.attributes = assert(function (div) {
                div.className = "i";
                return !div.getAttribute("className");
            });

            /* getElement(s)By*
            ---------------------------------------------------------------------- */

            // Check if getElementsByTagName("*") returns only elements
            support.getElementsByTagName = assert(function (div) {
                div.appendChild(doc.createComment(""));
                return !div.getElementsByTagName("*").length;
            });

            // Check if getElementsByClassName can be trusted
            support.getElementsByClassName = assert(function (div) {
                div.innerHTML = "<div class='a'></div><div class='a i'></div>";

                // Support: Safari<4
                // Catch class over-caching
                div.firstChild.className = "i";
                // Support: Opera<10
                // Catch gEBCN failure to find non-leading classes
                return div.getElementsByClassName("i").length === 2;
            });

            // Support: IE<10
            // Check if getElementById returns elements by name
            // The broken getElementById methods don't pick up programatically-set names,
            // so use a roundabout getElementsByName test
            support.getById = assert(function (div) {
                docElem.appendChild(div).id = expando;
                return !doc.getElementsByName || !doc.getElementsByName(expando).length;
            });

            // ID find and filter
            if (support.getById) {
                Expr.find["ID"] = function (id, context) {
                    if (typeof context.getElementById !== strundefined && documentIsHTML) {
                        var m = context.getElementById(id);
                        // Check parentNode to catch when Blackberry 4.6 returns
                        // nodes that are no longer in the document #6963
                        return m && m.parentNode ? [m] : [];
                    }
                };
                Expr.filter["ID"] = function (id) {
                    var attrId = id.replace(runescape, funescape);
                    return function (elem) {
                        return elem.getAttribute("id") === attrId;
                    };
                };
            } else {
                // Support: IE6/7
                // getElementById is not reliable as a find shortcut
                delete Expr.find["ID"];

                Expr.filter["ID"] = function (id) {
                    var attrId = id.replace(runescape, funescape);
                    return function (elem) {
                        var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
                        return node && node.value === attrId;
                    };
                };
            }

            // Tag
            Expr.find["TAG"] = support.getElementsByTagName ?
		function (tag, context) {
		    if (typeof context.getElementsByTagName !== strundefined) {
		        return context.getElementsByTagName(tag);
		    }
		} :
		function (tag, context) {
		    var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName(tag);

		    // Filter out possible comments
		    if (tag === "*") {
		        while ((elem = results[i++])) {
		            if (elem.nodeType === 1) {
		                tmp.push(elem);
		            }
		        }

		        return tmp;
		    }
		    return results;
		};

            // Class
            Expr.find["CLASS"] = support.getElementsByClassName && function (className, context) {
                if (typeof context.getElementsByClassName !== strundefined && documentIsHTML) {
                    return context.getElementsByClassName(className);
                }
            };

            /* QSA/matchesSelector
            ---------------------------------------------------------------------- */

            // QSA and matchesSelector support

            // matchesSelector(:active) reports false when true (IE9/Opera 11.5)
            rbuggyMatches = [];

            // qSa(:focus) reports false when true (Chrome 21)
            // We allow this because of a bug in IE8/9 that throws an error
            // whenever `document.activeElement` is accessed on an iframe
            // So, we allow :focus to pass through QSA all the time to avoid the IE error
            // See http://bugs.jquery.com/ticket/13378
            rbuggyQSA = [];

            if ((support.qsa = rnative.test(doc.querySelectorAll))) {
                // Build QSA regex
                // Regex strategy adopted from Diego Perini
                assert(function (div) {
                    // Select is set to empty string on purpose
                    // This is to test IE's treatment of not explicitly
                    // setting a boolean content attribute,
                    // since its presence should be enough
                    // http://bugs.jquery.com/ticket/12359
                    div.innerHTML = "<select><option selected=''></option></select>";

                    // Support: IE8
                    // Boolean attributes and "value" are not treated correctly
                    if (!div.querySelectorAll("[selected]").length) {
                        rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")");
                    }

                    // Webkit/Opera - :checked should return selected option elements
                    // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
                    // IE8 throws error here and will not see later tests
                    if (!div.querySelectorAll(":checked").length) {
                        rbuggyQSA.push(":checked");
                    }
                });

                assert(function (div) {

                    // Support: Opera 10-12/IE8
                    // ^= $= *= and empty values
                    // Should not select anything
                    // Support: Windows 8 Native Apps
                    // The type attribute is restricted during .innerHTML assignment
                    var input = doc.createElement("input");
                    input.setAttribute("type", "hidden");
                    div.appendChild(input).setAttribute("t", "");

                    if (div.querySelectorAll("[t^='']").length) {
                        rbuggyQSA.push("[*^$]=" + whitespace + "*(?:''|\"\")");
                    }

                    // FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
                    // IE8 throws error here and will not see later tests
                    if (!div.querySelectorAll(":enabled").length) {
                        rbuggyQSA.push(":enabled", ":disabled");
                    }

                    // Opera 10-11 does not throw on post-comma invalid pseudos
                    div.querySelectorAll("*,:x");
                    rbuggyQSA.push(",.*:");
                });
            }

            if ((support.matchesSelector = rnative.test((matches = docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector)))) {

                assert(function (div) {
                    // Check to see if it's possible to do matchesSelector
                    // on a disconnected node (IE 9)
                    support.disconnectedMatch = matches.call(div, "div");

                    // This should fail with an exception
                    // Gecko does not error, returns false instead
                    matches.call(div, "[s!='']:x");
                    rbuggyMatches.push("!=", pseudos);
                });
            }

            rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|"));
            rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join("|"));

            /* Contains
            ---------------------------------------------------------------------- */

            // Element contains another
            // Purposefully does not implement inclusive descendent
            // As in, an element does not contain itself
            contains = rnative.test(docElem.contains) || docElem.compareDocumentPosition ?
		function (a, b) {
		    var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
		    return a === bup || !!(bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains(bup) :
					a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16
			));
		} :
		function (a, b) {
		    if (b) {
		        while ((b = b.parentNode)) {
		            if (b === a) {
		                return true;
		            }
		        }
		    }
		    return false;
		};

            /* Sorting
            ---------------------------------------------------------------------- */

            // Document order sorting
            sortOrder = docElem.compareDocumentPosition ?
	function (a, b) {

	    // Flag for duplicate removal
	    if (a === b) {
	        hasDuplicate = true;
	        return 0;
	    }

	    var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition(b);

	    if (compare) {
	        // Disconnected nodes
	        if (compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition(a) === compare)) {

	            // Choose the first element that is related to our preferred document
	            if (a === doc || contains(preferredDoc, a)) {
	                return -1;
	            }
	            if (b === doc || contains(preferredDoc, b)) {
	                return 1;
	            }

	            // Maintain original order
	            return sortInput ?
					(indexOf.call(sortInput, a) - indexOf.call(sortInput, b)) :
					0;
	        }

	        return compare & 4 ? -1 : 1;
	    }

	    // Not directly comparable, sort on existence of method
	    return a.compareDocumentPosition ? -1 : 1;
	} :
	function (a, b) {
	    var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [a],
			bp = [b];

	    // Exit early if the nodes are identical
	    if (a === b) {
	        hasDuplicate = true;
	        return 0;

	        // Parentless nodes are either documents or disconnected
	    } else if (!aup || !bup) {
	        return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				(indexOf.call(sortInput, a) - indexOf.call(sortInput, b)) :
				0;

	        // If the nodes are siblings, we can do a quick check
	    } else if (aup === bup) {
	        return siblingCheck(a, b);
	    }

	    // Otherwise we need full lists of their ancestors for comparison
	    cur = a;
	    while ((cur = cur.parentNode)) {
	        ap.unshift(cur);
	    }
	    cur = b;
	    while ((cur = cur.parentNode)) {
	        bp.unshift(cur);
	    }

	    // Walk down the tree looking for a discrepancy
	    while (ap[i] === bp[i]) {
	        i++;
	    }

	    return i ?
	    // Do a sibling check if the nodes have a common ancestor
			siblingCheck(ap[i], bp[i]) :

	    // Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

            return doc;
        };

        Sizzle.matches = function (expr, elements) {
            return Sizzle(expr, null, null, elements);
        };

        Sizzle.matchesSelector = function (elem, expr) {
            // Set document vars if needed
            if ((elem.ownerDocument || elem) !== document) {
                setDocument(elem);
            }

            // Make sure that attribute selectors are quoted
            expr = expr.replace(rattributeQuotes, "='$1']");

            if (support.matchesSelector && documentIsHTML &&
		(!rbuggyMatches || !rbuggyMatches.test(expr)) &&
		(!rbuggyQSA || !rbuggyQSA.test(expr))) {

                try {
                    var ret = matches.call(elem, expr);

                    // IE 9's matchesSelector returns false on disconnected nodes
                    if (ret || support.disconnectedMatch ||
                    // As well, disconnected nodes are said to be in a document
                    // fragment in IE 9
					elem.document && elem.document.nodeType !== 11) {
                        return ret;
                    }
                } catch (e) { }
            }

            return Sizzle(expr, document, null, [elem]).length > 0;
        };

        Sizzle.contains = function (context, elem) {
            // Set document vars if needed
            if ((context.ownerDocument || context) !== document) {
                setDocument(context);
            }
            return contains(context, elem);
        };

        Sizzle.attr = function (elem, name) {
            // Set document vars if needed
            if ((elem.ownerDocument || elem) !== document) {
                setDocument(elem);
            }

            var fn = Expr.attrHandle[name.toLowerCase()],
            // Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ?
			fn(elem, name, !documentIsHTML) :
			undefined;

            return val === undefined ?
		support.attributes || !documentIsHTML ?
			elem.getAttribute(name) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null :
		val;
        };

        Sizzle.error = function (msg) {
            throw new Error("Syntax error, unrecognized expression: " + msg);
        };

        /**
        * Document sorting and removing duplicates
        * @param {ArrayLike} results
        */
        Sizzle.uniqueSort = function (results) {
            var elem,
		duplicates = [],
		j = 0,
		i = 0;

            // Unless we *know* we can detect duplicates, assume their presence
            hasDuplicate = !support.detectDuplicates;
            sortInput = !support.sortStable && results.slice(0);
            results.sort(sortOrder);

            if (hasDuplicate) {
                while ((elem = results[i++])) {
                    if (elem === results[i]) {
                        j = duplicates.push(i);
                    }
                }
                while (j--) {
                    results.splice(duplicates[j], 1);
                }
            }

            return results;
        };

        /**
        * Utility function for retrieving the text value of an array of DOM nodes
        * @param {Array|Element} elem
        */
        getText = Sizzle.getText = function (elem) {
            var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

            if (!nodeType) {
                // If no nodeType, this is expected to be an array
                for (; (node = elem[i]); i++) {
                    // Do not traverse comment nodes
                    ret += getText(node);
                }
            } else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
                // Use textContent for elements
                // innerText usage removed for consistency of new lines (see #11153)
                if (typeof elem.textContent === "string") {
                    return elem.textContent;
                } else {
                    // Traverse its children
                    for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                        ret += getText(elem);
                    }
                }
            } else if (nodeType === 3 || nodeType === 4) {
                return elem.nodeValue;
            }
            // Do not include comment or processing instruction nodes

            return ret;
        };

        Expr = Sizzle.selectors = {

            // Can be adjusted by the user
            cacheLength: 50,

            createPseudo: markFunction,

            match: matchExpr,

            attrHandle: {},

            find: {},

            relative: {
                ">": { dir: "parentNode", first: true },
                " ": { dir: "parentNode" },
                "+": { dir: "previousSibling", first: true },
                "~": { dir: "previousSibling" }
            },

            preFilter: {
                "ATTR": function (match) {
                    match[1] = match[1].replace(runescape, funescape);

                    // Move the given value to match[3] whether quoted or unquoted
                    match[3] = (match[4] || match[5] || "").replace(runescape, funescape);

                    if (match[2] === "~=") {
                        match[3] = " " + match[3] + " ";
                    }

                    return match.slice(0, 4);
                },

                "CHILD": function (match) {
                    /* matches from matchExpr["CHILD"]
                    1 type (only|nth|...)
                    2 what (child|of-type)
                    3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
                    4 xn-component of xn+y argument ([+-]?\d*n|)
                    5 sign of xn-component
                    6 x of xn-component
                    7 sign of y-component
                    8 y of y-component
                    */
                    match[1] = match[1].toLowerCase();

                    if (match[1].slice(0, 3) === "nth") {
                        // nth-* requires argument
                        if (!match[3]) {
                            Sizzle.error(match[0]);
                        }

                        // numeric x and y parameters for Expr.filter.CHILD
                        // remember that false/true cast respectively to 0/1
                        match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (match[3] === "even" || match[3] === "odd"));
                        match[5] = +((match[7] + match[8]) || match[3] === "odd");

                        // other types prohibit arguments
                    } else if (match[3]) {
                        Sizzle.error(match[0]);
                    }

                    return match;
                },

                "PSEUDO": function (match) {
                    var excess,
				unquoted = !match[5] && match[2];

                    if (matchExpr["CHILD"].test(match[0])) {
                        return null;
                    }

                    // Accept quoted arguments as-is
                    if (match[3] && match[4] !== undefined) {
                        match[2] = match[4];

                        // Strip excess characters from unquoted arguments
                    } else if (unquoted && rpseudo.test(unquoted) &&
                    // Get excess from tokenize (recursively)
				(excess = tokenize(unquoted, true)) &&
                    // advance to the next closing parenthesis
				(excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)) {

                        // excess is a negative index
                        match[0] = match[0].slice(0, excess);
                        match[2] = unquoted.slice(0, excess);
                    }

                    // Return only captures needed by the pseudo filter method (type and argument)
                    return match.slice(0, 3);
                }
            },

            filter: {

                "TAG": function (nodeNameSelector) {
                    var nodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
                    return nodeNameSelector === "*" ?
				function () { return true; } :
				function (elem) {
				    return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
                },

                "CLASS": function (className) {
                    var pattern = classCache[className + " "];

                    return pattern ||
				(pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) &&
				classCache(className, function (elem) {
				    return pattern.test(typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "");
				});
                },

                "ATTR": function (name, operator, check) {
                    return function (elem) {
                        var result = Sizzle.attr(elem, name);

                        if (result == null) {
                            return operator === "!=";
                        }
                        if (!operator) {
                            return true;
                        }

                        result += "";

                        return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf(check) === 0 :
					operator === "*=" ? check && result.indexOf(check) > -1 :
					operator === "$=" ? check && result.slice(-check.length) === check :
					operator === "~=" ? (" " + result + " ").indexOf(check) > -1 :
					operator === "|=" ? result === check || result.slice(0, check.length + 1) === check + "-" :
					false;
                    };
                },

                "CHILD": function (type, what, argument, first, last) {
                    var simple = type.slice(0, 3) !== "nth",
				forward = type.slice(-4) !== "last",
				ofType = what === "of-type";

                    return first === 1 && last === 0 ?

                    // Shortcut for :nth-*(n)
				function (elem) {
				    return !!elem.parentNode;
				} :

				function (elem, context, xml) {
				    var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

				    if (parent) {

				        // :(first|last|only)-(child|of-type)
				        if (simple) {
				            while (dir) {
				                node = elem;
				                while ((node = node[dir])) {
				                    if (ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) {
				                        return false;
				                    }
				                }
				                // Reverse direction for :only-* (if we haven't yet done so)
				                start = dir = type === "only" && !start && "nextSibling";
				            }
				            return true;
				        }

				        start = [forward ? parent.firstChild : parent.lastChild];

				        // non-xml :nth-child(...) stores cache data on `parent`
				        if (forward && useCache) {
				            // Seek `elem` from a previously-cached index
				            outerCache = parent[expando] || (parent[expando] = {});
				            cache = outerCache[type] || [];
				            nodeIndex = cache[0] === dirruns && cache[1];
				            diff = cache[0] === dirruns && cache[2];
				            node = nodeIndex && parent.childNodes[nodeIndex];

				            while ((node = ++nodeIndex && node && node[dir] ||

				            // Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop())) {

				                // When found, cache indexes on `parent` and break
				                if (node.nodeType === 1 && ++diff && node === elem) {
				                    outerCache[type] = [dirruns, nodeIndex, diff];
				                    break;
				                }
				            }

				            // Use previously-cached element index if available
				        } else if (useCache && (cache = (elem[expando] || (elem[expando] = {}))[type]) && cache[0] === dirruns) {
				            diff = cache[1];

				            // xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
				        } else {
				            // Use the same loop as above to seek `elem` from the start
				            while ((node = ++nodeIndex && node && node[dir] ||
								(diff = nodeIndex = 0) || start.pop())) {

				                if ((ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) && ++diff) {
				                    // Cache the index of each encountered element
				                    if (useCache) {
				                        (node[expando] || (node[expando] = {}))[type] = [dirruns, diff];
				                    }

				                    if (node === elem) {
				                        break;
				                    }
				                }
				            }
				        }

				        // Incorporate the offset, then check against cycle size
				        diff -= last;
				        return diff === first || (diff % first === 0 && diff / first >= 0);
				    }
				};
                },

                "PSEUDO": function (pseudo, argument) {
                    // pseudo-class names are case-insensitive
                    // http://www.w3.org/TR/selectors/#pseudo-classes
                    // Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
                    // Remember that setFilters inherits from pseudos
                    var args,
				fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] ||
					Sizzle.error("unsupported pseudo: " + pseudo);

                    // The user may use createPseudo to indicate that
                    // arguments are needed to create the filter function
                    // just as Sizzle does
                    if (fn[expando]) {
                        return fn(argument);
                    }

                    // But maintain support for old signatures
                    if (fn.length > 1) {
                        args = [pseudo, pseudo, "", argument];
                        return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ?
					markFunction(function (seed, matches) {
					    var idx,
							matched = fn(seed, argument),
							i = matched.length;
					    while (i--) {
					        idx = indexOf.call(seed, matched[i]);
					        seed[idx] = !(matches[idx] = matched[i]);
					    }
					}) :
					function (elem) {
					    return fn(elem, 0, args);
					};
                    }

                    return fn;
                }
            },

            pseudos: {
                // Potentially complex pseudos
                "not": markFunction(function (selector) {
                    // Trim the selector passed to compile
                    // to avoid treating leading and trailing
                    // spaces as combinators
                    var input = [],
				results = [],
				matcher = compile(selector.replace(rtrim, "$1"));

                    return matcher[expando] ?
				markFunction(function (seed, matches, context, xml) {
				    var elem,
						unmatched = matcher(seed, null, xml, []),
						i = seed.length;

				    // Match elements unmatched by `matcher`
				    while (i--) {
				        if ((elem = unmatched[i])) {
				            seed[i] = !(matches[i] = elem);
				        }
				    }
				}) :
				function (elem, context, xml) {
				    input[0] = elem;
				    matcher(input, null, xml, results);
				    return !results.pop();
				};
                }),

                "has": markFunction(function (selector) {
                    return function (elem) {
                        return Sizzle(selector, elem).length > 0;
                    };
                }),

                "contains": markFunction(function (text) {
                    return function (elem) {
                        return (elem.textContent || elem.innerText || getText(elem)).indexOf(text) > -1;
                    };
                }),

                // "Whether an element is represented by a :lang() selector
                // is based solely on the element's language value
                // being equal to the identifier C,
                // or beginning with the identifier C immediately followed by "-".
                // The matching of C against the element's language value is performed case-insensitively.
                // The identifier C does not have to be a valid language name."
                // http://www.w3.org/TR/selectors/#lang-pseudo
                "lang": markFunction(function (lang) {
                    // lang value must be a valid identifier
                    if (!ridentifier.test(lang || "")) {
                        Sizzle.error("unsupported lang: " + lang);
                    }
                    lang = lang.replace(runescape, funescape).toLowerCase();
                    return function (elem) {
                        var elemLang;
                        do {
                            if ((elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang"))) {

                                elemLang = elemLang.toLowerCase();
                                return elemLang === lang || elemLang.indexOf(lang + "-") === 0;
                            }
                        } while ((elem = elem.parentNode) && elem.nodeType === 1);
                        return false;
                    };
                }),

                // Miscellaneous
                "target": function (elem) {
                    var hash = window.location && window.location.hash;
                    return hash && hash.slice(1) === elem.id;
                },

                "root": function (elem) {
                    return elem === docElem;
                },

                "focus": function (elem) {
                    return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
                },

                // Boolean properties
                "enabled": function (elem) {
                    return elem.disabled === false;
                },

                "disabled": function (elem) {
                    return elem.disabled === true;
                },

                "checked": function (elem) {
                    // In CSS3, :checked should return both checked and selected elements
                    // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
                    var nodeName = elem.nodeName.toLowerCase();
                    return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
                },

                "selected": function (elem) {
                    // Accessing this property makes selected-by-default
                    // options in Safari work properly
                    if (elem.parentNode) {
                        elem.parentNode.selectedIndex;
                    }

                    return elem.selected === true;
                },

                // Contents
                "empty": function (elem) {
                    // http://www.w3.org/TR/selectors/#empty-pseudo
                    // :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
                    //   not comment, processing instructions, or others
                    // Thanks to Diego Perini for the nodeName shortcut
                    //   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
                    for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                        if (elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4) {
                            return false;
                        }
                    }
                    return true;
                },

                "parent": function (elem) {
                    return !Expr.pseudos["empty"](elem);
                },

                // Element/input types
                "header": function (elem) {
                    return rheader.test(elem.nodeName);
                },

                "input": function (elem) {
                    return rinputs.test(elem.nodeName);
                },

                "button": function (elem) {
                    var name = elem.nodeName.toLowerCase();
                    return name === "input" && elem.type === "button" || name === "button";
                },

                "text": function (elem) {
                    var attr;
                    // IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
                    // use getAttribute instead to test this case
                    return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				((attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type);
                },

                // Position-in-collection
                "first": createPositionalPseudo(function () {
                    return [0];
                }),

                "last": createPositionalPseudo(function (matchIndexes, length) {
                    return [length - 1];
                }),

                "eq": createPositionalPseudo(function (matchIndexes, length, argument) {
                    return [argument < 0 ? argument + length : argument];
                }),

                "even": createPositionalPseudo(function (matchIndexes, length) {
                    var i = 0;
                    for (; i < length; i += 2) {
                        matchIndexes.push(i);
                    }
                    return matchIndexes;
                }),

                "odd": createPositionalPseudo(function (matchIndexes, length) {
                    var i = 1;
                    for (; i < length; i += 2) {
                        matchIndexes.push(i);
                    }
                    return matchIndexes;
                }),

                "lt": createPositionalPseudo(function (matchIndexes, length, argument) {
                    var i = argument < 0 ? argument + length : argument;
                    for (; --i >= 0; ) {
                        matchIndexes.push(i);
                    }
                    return matchIndexes;
                }),

                "gt": createPositionalPseudo(function (matchIndexes, length, argument) {
                    var i = argument < 0 ? argument + length : argument;
                    for (; ++i < length; ) {
                        matchIndexes.push(i);
                    }
                    return matchIndexes;
                })
            }
        };

        Expr.pseudos["nth"] = Expr.pseudos["eq"];

        // Add button/input type pseudos
        for (i in { radio: true, checkbox: true, file: true, password: true, image: true }) {
            Expr.pseudos[i] = createInputPseudo(i);
        }
        for (i in { submit: true, reset: true }) {
            Expr.pseudos[i] = createButtonPseudo(i);
        }

        // Easy API for creating new setFilters
        function setFilters() { }
        setFilters.prototype = Expr.filters = Expr.pseudos;
        Expr.setFilters = new setFilters();

        function tokenize(selector, parseOnly) {
            var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[selector + " "];

            if (cached) {
                return parseOnly ? 0 : cached.slice(0);
            }

            soFar = selector;
            groups = [];
            preFilters = Expr.preFilter;

            while (soFar) {

                // Comma and first run
                if (!matched || (match = rcomma.exec(soFar))) {
                    if (match) {
                        // Don't consume trailing commas as valid
                        soFar = soFar.slice(match[0].length) || soFar;
                    }
                    groups.push(tokens = []);
                }

                matched = false;

                // Combinators
                if ((match = rcombinators.exec(soFar))) {
                    matched = match.shift();
                    tokens.push({
                        value: matched,
                        // Cast descendant combinators to space
                        type: match[0].replace(rtrim, " ")
                    });
                    soFar = soFar.slice(matched.length);
                }

                // Filters
                for (type in Expr.filter) {
                    if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] ||
				(match = preFilters[type](match)))) {
                        matched = match.shift();
                        tokens.push({
                            value: matched,
                            type: type,
                            matches: match
                        });
                        soFar = soFar.slice(matched.length);
                    }
                }

                if (!matched) {
                    break;
                }
            }

            // Return the length of the invalid excess
            // if we're just parsing
            // Otherwise, throw an error or return tokens
            return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error(selector) :
            // Cache the tokens
			tokenCache(selector, groups).slice(0);
        }

        function toSelector(tokens) {
            var i = 0,
		len = tokens.length,
		selector = "";
            for (; i < len; i++) {
                selector += tokens[i].value;
            }
            return selector;
        }

        function addCombinator(matcher, combinator, base) {
            var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

            return combinator.first ?
            // Check against closest ancestor/preceding element
		function (elem, context, xml) {
		    while ((elem = elem[dir])) {
		        if (elem.nodeType === 1 || checkNonElements) {
		            return matcher(elem, context, xml);
		        }
		    }
		} :

            // Check against all ancestor/preceding elements
		function (elem, context, xml) {
		    var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

		    // We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
		    if (xml) {
		        while ((elem = elem[dir])) {
		            if (elem.nodeType === 1 || checkNonElements) {
		                if (matcher(elem, context, xml)) {
		                    return true;
		                }
		            }
		        }
		    } else {
		        while ((elem = elem[dir])) {
		            if (elem.nodeType === 1 || checkNonElements) {
		                outerCache = elem[expando] || (elem[expando] = {});
		                if ((cache = outerCache[dir]) && cache[0] === dirkey) {
		                    if ((data = cache[1]) === true || data === cachedruns) {
		                        return data === true;
		                    }
		                } else {
		                    cache = outerCache[dir] = [dirkey];
		                    cache[1] = matcher(elem, context, xml) || cachedruns;
		                    if (cache[1] === true) {
		                        return true;
		                    }
		                }
		            }
		        }
		    }
		};
        }

        function elementMatcher(matchers) {
            return matchers.length > 1 ?
		function (elem, context, xml) {
		    var i = matchers.length;
		    while (i--) {
		        if (!matchers[i](elem, context, xml)) {
		            return false;
		        }
		    }
		    return true;
		} :
		matchers[0];
        }

        function condense(unmatched, map, filter, context, xml) {
            var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

            for (; i < len; i++) {
                if ((elem = unmatched[i])) {
                    if (!filter || filter(elem, context, xml)) {
                        newUnmatched.push(elem);
                        if (mapped) {
                            map.push(i);
                        }
                    }
                }
            }

            return newUnmatched;
        }

        function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
            if (postFilter && !postFilter[expando]) {
                postFilter = setMatcher(postFilter);
            }
            if (postFinder && !postFinder[expando]) {
                postFinder = setMatcher(postFinder, postSelector);
            }
            return markFunction(function (seed, results, context, xml) {
                var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

                // Get initial elements from seed or context
			elems = seed || multipleContexts(selector || "*", context.nodeType ? [context] : context, []),

                // Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && (seed || !selector) ?
				condense(elems, preMap, preFilter, context, xml) :
				elems,

			matcherOut = matcher ?
                // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || (seed ? preFilter : preexisting || postFilter) ?

                // ...intermediate processing is necessary
					[] :

                // ...otherwise use results directly
					results :
				matcherIn;

                // Find primary matches
                if (matcher) {
                    matcher(matcherIn, matcherOut, context, xml);
                }

                // Apply postFilter
                if (postFilter) {
                    temp = condense(matcherOut, postMap);
                    postFilter(temp, [], context, xml);

                    // Un-match failing elements by moving them back to matcherIn
                    i = temp.length;
                    while (i--) {
                        if ((elem = temp[i])) {
                            matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem);
                        }
                    }
                }

                if (seed) {
                    if (postFinder || preFilter) {
                        if (postFinder) {
                            // Get the final matcherOut by condensing this intermediate into postFinder contexts
                            temp = [];
                            i = matcherOut.length;
                            while (i--) {
                                if ((elem = matcherOut[i])) {
                                    // Restore matcherIn since elem is not yet a final match
                                    temp.push((matcherIn[i] = elem));
                                }
                            }
                            postFinder(null, (matcherOut = []), temp, xml);
                        }

                        // Move matched elements from seed to results to keep them synchronized
                        i = matcherOut.length;
                        while (i--) {
                            if ((elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call(seed, elem) : preMap[i]) > -1) {

                                seed[temp] = !(results[temp] = elem);
                            }
                        }
                    }

                    // Add elements to results, through postFinder if defined
                } else {
                    matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice(preexisting, matcherOut.length) :
					matcherOut
			);
                    if (postFinder) {
                        postFinder(null, results, matcherOut, xml);
                    } else {
                        push.apply(results, matcherOut);
                    }
                }
            });
        }

        function matcherFromTokens(tokens) {
            var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[tokens[0].type],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

            // The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator(function (elem) {
		    return elem === checkContext;
		}, implicitRelative, true),
		matchAnyContext = addCombinator(function (elem) {
		    return indexOf.call(checkContext, elem) > -1;
		}, implicitRelative, true),
		matchers = [function (elem, context, xml) {
		    return (!leadingRelative && (xml || context !== outermostContext)) || (
				(checkContext = context).nodeType ?
					matchContext(elem, context, xml) :
					matchAnyContext(elem, context, xml));
		} ];

            for (; i < len; i++) {
                if ((matcher = Expr.relative[tokens[i].type])) {
                    matchers = [addCombinator(elementMatcher(matchers), matcher)];
                } else {
                    matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches);

                    // Return special upon seeing a positional matcher
                    if (matcher[expando]) {
                        // Find the next relative operator (if any) for proper handling
                        j = ++i;
                        for (; j < len; j++) {
                            if (Expr.relative[tokens[j].type]) {
                                break;
                            }
                        }
                        return setMatcher(
					i > 1 && elementMatcher(matchers),
					i > 1 && toSelector(
                        // If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice(0, i - 1).concat({ value: tokens[i - 2].type === " " ? "*" : "" })
					).replace(rtrim, "$1"),
					matcher,
					i < j && matcherFromTokens(tokens.slice(i, j)),
					j < len && matcherFromTokens((tokens = tokens.slice(j))),
					j < len && toSelector(tokens)
				);
                    }
                    matchers.push(matcher);
                }
            }

            return elementMatcher(matchers);
        }

        function matcherFromGroupMatchers(elementMatchers, setMatchers) {
            // A counter to specify which element is currently being matched
            var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function (seed, context, xml, results, expandContext) {
		    var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
		    // We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]("*", expandContext && context.parentNode || context),
		    // Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

		    if (outermost) {
		        outermostContext = context !== document && context;
		        cachedruns = matcherCachedRuns;
		    }

		    // Add elements passing elementMatchers directly to results
		    // Keep `i` a string if there are no elements so `matchedCount` will be "00" below
		    for (; (elem = elems[i]) != null; i++) {
		        if (byElement && elem) {
		            j = 0;
		            while ((matcher = elementMatchers[j++])) {
		                if (matcher(elem, context, xml)) {
		                    results.push(elem);
		                    break;
		                }
		            }
		            if (outermost) {
		                dirruns = dirrunsUnique;
		                cachedruns = ++matcherCachedRuns;
		            }
		        }

		        // Track unmatched elements for set filters
		        if (bySet) {
		            // They will have gone through all possible matchers
		            if ((elem = !matcher && elem)) {
		                matchedCount--;
		            }

		            // Lengthen the array for every element, matched or not
		            if (seed) {
		                unmatched.push(elem);
		            }
		        }
		    }

		    // Apply set filters to unmatched elements
		    matchedCount += i;
		    if (bySet && i !== matchedCount) {
		        j = 0;
		        while ((matcher = setMatchers[j++])) {
		            matcher(unmatched, setMatched, context, xml);
		        }

		        if (seed) {
		            // Reintegrate element matches to eliminate the need for sorting
		            if (matchedCount > 0) {
		                while (i--) {
		                    if (!(unmatched[i] || setMatched[i])) {
		                        setMatched[i] = pop.call(results);
		                    }
		                }
		            }

		            // Discard index placeholder values to get only actual matches
		            setMatched = condense(setMatched);
		        }

		        // Add matches to results
		        push.apply(results, setMatched);

		        // Seedless set matches succeeding multiple successful matchers stipulate sorting
		        if (outermost && !seed && setMatched.length > 0 &&
					(matchedCount + setMatchers.length) > 1) {

		            Sizzle.uniqueSort(results);
		        }
		    }

		    // Override manipulation of globals by nested matchers
		    if (outermost) {
		        dirruns = dirrunsUnique;
		        outermostContext = contextBackup;
		    }

		    return unmatched;
		};

            return bySet ?
		markFunction(superMatcher) :
		superMatcher;
        }

        compile = Sizzle.compile = function (selector, group /* Internal Use Only */) {
            var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[selector + " "];

            if (!cached) {
                // Generate a function of recursive functions that can be used to check each element
                if (!group) {
                    group = tokenize(selector);
                }
                i = group.length;
                while (i--) {
                    cached = matcherFromTokens(group[i]);
                    if (cached[expando]) {
                        setMatchers.push(cached);
                    } else {
                        elementMatchers.push(cached);
                    }
                }

                // Cache the compiled function
                cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers));
            }
            return cached;
        };

        function multipleContexts(selector, contexts, results) {
            var i = 0,
		len = contexts.length;
            for (; i < len; i++) {
                Sizzle(selector, contexts[i], results);
            }
            return results;
        }

        function select(selector, context, results, seed) {
            var i, tokens, token, type, find,
		match = tokenize(selector);

            if (!seed) {
                // Try to minimize operations if there is only one group
                if (match.length === 1) {

                    // Take a shortcut and set the context if the root selector is an ID
                    tokens = match[0] = match[0].slice(0);
                    if (tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[tokens[1].type]) {

                        context = (Expr.find["ID"](token.matches[0].replace(runescape, funescape), context) || [])[0];
                        if (!context) {
                            return results;
                        }
                        selector = selector.slice(tokens.shift().value.length);
                    }

                    // Fetch a seed set for right-to-left matching
                    i = matchExpr["needsContext"].test(selector) ? 0 : tokens.length;
                    while (i--) {
                        token = tokens[i];

                        // Abort if we hit a combinator
                        if (Expr.relative[(type = token.type)]) {
                            break;
                        }
                        if ((find = Expr.find[type])) {
                            // Search, expanding context for leading sibling combinators
                            if ((seed = find(
						token.matches[0].replace(runescape, funescape),
						rsibling.test(tokens[0].type) && context.parentNode || context
					))) {

                                // If seed is empty or no tokens remain, we can return early
                                tokens.splice(i, 1);
                                selector = seed.length && toSelector(tokens);
                                if (!selector) {
                                    push.apply(results, seed);
                                    return results;
                                }

                                break;
                            }
                        }
                    }
                }
            }

            // Compile and execute a filtering function
            // Provide `match` to avoid retokenization if we modified the selector above
            compile(selector, match)(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test(selector)
	);
            return results;
        }

        // One-time assignments

        // Sort stability
        support.sortStable = expando.split("").sort(sortOrder).join("") === expando;

        // Support: Chrome<14
        // Always assume duplicates if they aren't passed to the comparison function
        support.detectDuplicates = hasDuplicate;

        // Initialize against the default document
        setDocument();

        // Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
        // Detached nodes confoundingly follow *each other*
        support.sortDetached = assert(function (div1) {
            // Should return 1, but returns 4 (following)
            return div1.compareDocumentPosition(document.createElement("div")) & 1;
        });

        // Support: IE<8
        // Prevent attribute/property "interpolation"
        // http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
        if (!assert(function (div) {
            div.innerHTML = "<a href='#'></a>";
            return div.firstChild.getAttribute("href") === "#";
        })) {
            addHandle("type|href|height|width", function (elem, name, isXML) {
                if (!isXML) {
                    return elem.getAttribute(name, name.toLowerCase() === "type" ? 1 : 2);
                }
            });
        }

        // Support: IE<9
        // Use defaultValue in place of getAttribute("value")
        if (!support.attributes || !assert(function (div) {
            div.innerHTML = "<input/>";
            div.firstChild.setAttribute("value", "");
            return div.firstChild.getAttribute("value") === "";
        })) {
            addHandle("value", function (elem, name, isXML) {
                if (!isXML && elem.nodeName.toLowerCase() === "input") {
                    return elem.defaultValue;
                }
            });
        }

        // Support: IE<9
        // Use getAttributeNode to fetch booleans when getAttribute lies
        if (!assert(function (div) {
            return div.getAttribute("disabled") == null;
        })) {
            addHandle(booleans, function (elem, name, isXML) {
                var val;
                if (!isXML) {
                    return (val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				elem[name] === true ? name.toLowerCase() : null;
                }
            });
        }

        jQuery.find = Sizzle;
        jQuery.expr = Sizzle.selectors;
        jQuery.expr[":"] = jQuery.expr.pseudos;
        jQuery.unique = Sizzle.uniqueSort;
        jQuery.text = Sizzle.getText;
        jQuery.isXMLDoc = Sizzle.isXML;
        jQuery.contains = Sizzle.contains;


    })(window);
    // String to Object options format cache
    var optionsCache = {};

    // Convert String-formatted options into Object-formatted ones and store in cache
    function createOptions(options) {
        var object = optionsCache[options] = {};
        jQuery.each(options.match(core_rnotwhite) || [], function (_, flag) {
            object[flag] = true;
        });
        return object;
    }

    /*
    * Create a callback list using the following parameters:
    *
    *	options: an optional list of space-separated options that will change how
    *			the callback list behaves or a more traditional option object
    *
    * By default a callback list will act like an event callback list and can be
    * "fired" multiple times.
    *
    * Possible options:
    *
    *	once:			will ensure the callback list can only be fired once (like a Deferred)
    *
    *	memory:			will keep track of previous values and will call any callback added
    *					after the list has been fired right away with the latest "memorized"
    *					values (like a Deferred)
    *
    *	unique:			will ensure a callback can only be added once (no duplicate in the list)
    *
    *	stopOnFalse:	interrupt callings when a callback returns false
    *
    */
    jQuery.Callbacks = function (options) {

        // Convert options from String-formatted to Object-formatted if needed
        // (we check in cache first)
        options = typeof options === "string" ?
		(optionsCache[options] || createOptions(options)) :
		jQuery.extend({}, options);

        var // Flag to know if list is currently firing
		firing,
        // Last fire value (for non-forgettable lists)
		memory,
        // Flag to know if list was already fired
		fired,
        // End of the loop when firing
		firingLength,
        // Index of currently firing callback (modified by remove if needed)
		firingIndex,
        // First callback to fire (used internally by add and fireWith)
		firingStart,
        // Actual callback list
		list = [],
        // Stack of fire calls for repeatable lists
		stack = !options.once && [],
        // Fire callbacks
		fire = function (data) {
		    memory = options.memory && data;
		    fired = true;
		    firingIndex = firingStart || 0;
		    firingStart = 0;
		    firingLength = list.length;
		    firing = true;
		    for (; list && firingIndex < firingLength; firingIndex++) {
		        if (list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse) {
		            memory = false; // To prevent further calls using add
		            break;
		        }
		    }
		    firing = false;
		    if (list) {
		        if (stack) {
		            if (stack.length) {
		                fire(stack.shift());
		            }
		        } else if (memory) {
		            list = [];
		        } else {
		            self.disable();
		        }
		    }
		},
        // Actual Callbacks object
		self = {
		    // Add a callback or a collection of callbacks to the list
		    add: function () {
		        if (list) {
		            // First, we save the current length
		            var start = list.length;
		            (function add(args) {
		                jQuery.each(args, function (_, arg) {
		                    var type = jQuery.type(arg);
		                    if (type === "function") {
		                        if (!options.unique || !self.has(arg)) {
		                            list.push(arg);
		                        }
		                    } else if (arg && arg.length && type !== "string") {
		                        // Inspect recursively
		                        add(arg);
		                    }
		                });
		            })(arguments);
		            // Do we need to add the callbacks to the
		            // current firing batch?
		            if (firing) {
		                firingLength = list.length;
		                // With memory, if we're not firing then
		                // we should call right away
		            } else if (memory) {
		                firingStart = start;
		                fire(memory);
		            }
		        }
		        return this;
		    },
		    // Remove a callback from the list
		    remove: function () {
		        if (list) {
		            jQuery.each(arguments, function (_, arg) {
		                var index;
		                while ((index = jQuery.inArray(arg, list, index)) > -1) {
		                    list.splice(index, 1);
		                    // Handle firing indexes
		                    if (firing) {
		                        if (index <= firingLength) {
		                            firingLength--;
		                        }
		                        if (index <= firingIndex) {
		                            firingIndex--;
		                        }
		                    }
		                }
		            });
		        }
		        return this;
		    },
		    // Check if a given callback is in the list.
		    // If no argument is given, return whether or not list has callbacks attached.
		    has: function (fn) {
		        return fn ? jQuery.inArray(fn, list) > -1 : !!(list && list.length);
		    },
		    // Remove all callbacks from the list
		    empty: function () {
		        list = [];
		        firingLength = 0;
		        return this;
		    },
		    // Have the list do nothing anymore
		    disable: function () {
		        list = stack = memory = undefined;
		        return this;
		    },
		    // Is it disabled?
		    disabled: function () {
		        return !list;
		    },
		    // Lock the list in its current state
		    lock: function () {
		        stack = undefined;
		        if (!memory) {
		            self.disable();
		        }
		        return this;
		    },
		    // Is it locked?
		    locked: function () {
		        return !stack;
		    },
		    // Call all callbacks with the given context and arguments
		    fireWith: function (context, args) {
		        if (list && (!fired || stack)) {
		            args = args || [];
		            args = [context, args.slice ? args.slice() : args];
		            if (firing) {
		                stack.push(args);
		            } else {
		                fire(args);
		            }
		        }
		        return this;
		    },
		    // Call all the callbacks with the given arguments
		    fire: function () {
		        self.fireWith(this, arguments);
		        return this;
		    },
		    // To know if the callbacks have already been called at least once
		    fired: function () {
		        return !!fired;
		    }
		};

        return self;
    };
    jQuery.extend({

        Deferred: function (func) {
            var tuples = [
            // action, add listener, listener list, final state
				["resolve", "done", jQuery.Callbacks("once memory"), "resolved"],
				["reject", "fail", jQuery.Callbacks("once memory"), "rejected"],
				["notify", "progress", jQuery.Callbacks("memory")]
			],
			state = "pending",
			promise = {
			    state: function () {
			        return state;
			    },
			    always: function () {
			        deferred.done(arguments).fail(arguments);
			        return this;
			    },
			    then: function ( /* fnDone, fnFail, fnProgress */) {
			        var fns = arguments;
			        return jQuery.Deferred(function (newDefer) {
			            jQuery.each(tuples, function (i, tuple) {
			                var action = tuple[0],
								fn = jQuery.isFunction(fns[i]) && fns[i];
			                // deferred[ done | fail | progress ] for forwarding actions to newDefer
			                deferred[tuple[1]](function () {
			                    var returned = fn && fn.apply(this, arguments);
			                    if (returned && jQuery.isFunction(returned.promise)) {
			                        returned.promise()
										.done(newDefer.resolve)
										.fail(newDefer.reject)
										.progress(newDefer.notify);
			                    } else {
			                        newDefer[action + "With"](this === promise ? newDefer.promise() : this, fn ? [returned] : arguments);
			                    }
			                });
			            });
			            fns = null;
			        }).promise();
			    },
			    // Get a promise for this deferred
			    // If obj is provided, the promise aspect is added to the object
			    promise: function (obj) {
			        return obj != null ? jQuery.extend(obj, promise) : promise;
			    }
			},
			deferred = {};

            // Keep pipe for back-compat
            promise.pipe = promise.then;

            // Add list-specific methods
            jQuery.each(tuples, function (i, tuple) {
                var list = tuple[2],
				stateString = tuple[3];

                // promise[ done | fail | progress ] = list.add
                promise[tuple[1]] = list.add;

                // Handle state
                if (stateString) {
                    list.add(function () {
                        // state = [ resolved | rejected ]
                        state = stateString;

                        // [ reject_list | resolve_list ].disable; progress_list.lock
                    }, tuples[i ^ 1][2].disable, tuples[2][2].lock);
                }

                // deferred[ resolve | reject | notify ]
                deferred[tuple[0]] = function () {
                    deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments);
                    return this;
                };
                deferred[tuple[0] + "With"] = list.fireWith;
            });

            // Make the deferred a promise
            promise.promise(deferred);

            // Call given func if any
            if (func) {
                func.call(deferred, deferred);
            }

            // All done!
            return deferred;
        },

        // Deferred helper
        when: function (subordinate /* , ..., subordinateN */) {
            var i = 0,
			resolveValues = core_slice.call(arguments),
			length = resolveValues.length,

            // the count of uncompleted subordinates
			remaining = length !== 1 || (subordinate && jQuery.isFunction(subordinate.promise)) ? length : 0,

            // the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

            // Update function for both resolve and progress values
			updateFunc = function (i, contexts, values) {
			    return function (value) {
			        contexts[i] = this;
			        values[i] = arguments.length > 1 ? core_slice.call(arguments) : value;
			        if (values === progressValues) {
			            deferred.notifyWith(contexts, values);
			        } else if (!(--remaining)) {
			            deferred.resolveWith(contexts, values);
			        }
			    };
			},

			progressValues, progressContexts, resolveContexts;

            // add listeners to Deferred subordinates; treat others as resolved
            if (length > 1) {
                progressValues = new Array(length);
                progressContexts = new Array(length);
                resolveContexts = new Array(length);
                for (; i < length; i++) {
                    if (resolveValues[i] && jQuery.isFunction(resolveValues[i].promise)) {
                        resolveValues[i].promise()
						.done(updateFunc(i, resolveContexts, resolveValues))
						.fail(deferred.reject)
						.progress(updateFunc(i, progressContexts, progressValues));
                    } else {
                        --remaining;
                    }
                }
            }

            // if we're not waiting on anything, resolve the master
            if (!remaining) {
                deferred.resolveWith(resolveContexts, resolveValues);
            }

            return deferred.promise();
        }
    });
    jQuery.support = (function (support) {

        var all, a, input, select, fragment, opt, eventName, isSupported, i,
		div = document.createElement("div");

        // Setup
        div.setAttribute("className", "t");
        div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

        // Finish early in limited (non-browser) environments
        all = div.getElementsByTagName("*") || [];
        a = div.getElementsByTagName("a")[0];
        if (!a || !a.style || !all.length) {
            return support;
        }

        // First batch of tests
        select = document.createElement("select");
        opt = select.appendChild(document.createElement("option"));
        input = div.getElementsByTagName("input")[0];

        a.style.cssText = "top:1px;float:left;opacity:.5";

        // Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
        support.getSetAttribute = div.className !== "t";

        // IE strips leading whitespace when .innerHTML is used
        support.leadingWhitespace = div.firstChild.nodeType === 3;

        // Make sure that tbody elements aren't automatically inserted
        // IE will insert them into empty tables
        support.tbody = !div.getElementsByTagName("tbody").length;

        // Make sure that link elements get serialized correctly by innerHTML
        // This requires a wrapper element in IE
        support.htmlSerialize = !!div.getElementsByTagName("link").length;

        // Get the style information from getAttribute
        // (IE uses .cssText instead)
        support.style = /top/.test(a.getAttribute("style"));

        // Make sure that URLs aren't manipulated
        // (IE normalizes it by default)
        support.hrefNormalized = a.getAttribute("href") === "/a";

        // Make sure that element opacity exists
        // (IE uses filter instead)
        // Use a regex to work around a WebKit issue. See #5145
        support.opacity = /^0.5/.test(a.style.opacity);

        // Verify style float existence
        // (IE uses styleFloat instead of cssFloat)
        support.cssFloat = !!a.style.cssFloat;

        // Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
        support.checkOn = !!input.value;

        // Make sure that a selected-by-default option has a working selected property.
        // (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
        support.optSelected = opt.selected;

        // Tests for enctype support on a form (#6743)
        support.enctype = !!document.createElement("form").enctype;

        // Makes sure cloning an html5 element does not cause problems
        // Where outerHTML is undefined, this still works
        support.html5Clone = document.createElement("nav").cloneNode(true).outerHTML !== "<:nav></:nav>";

        // Will be defined later
        support.inlineBlockNeedsLayout = false;
        support.shrinkWrapBlocks = false;
        support.pixelPosition = false;
        support.deleteExpando = true;
        support.noCloneEvent = true;
        support.reliableMarginRight = true;
        support.boxSizingReliable = true;

        // Make sure checked status is properly cloned
        input.checked = true;
        support.noCloneChecked = input.cloneNode(true).checked;

        // Make sure that the options inside disabled selects aren't marked as disabled
        // (WebKit marks them as disabled)
        select.disabled = true;
        support.optDisabled = !opt.disabled;

        // Support: IE<9
        try {
            delete div.test;
        } catch (e) {
            support.deleteExpando = false;
        }

        // Check if we can trust getAttribute("value")
        input = document.createElement("input");
        input.setAttribute("value", "");
        support.input = input.getAttribute("value") === "";

        // Check if an input maintains its value after becoming a radio
        input.value = "t";
        input.setAttribute("type", "radio");
        support.radioValue = input.value === "t";

        // #11217 - WebKit loses check when the name is after the checked attribute
        input.setAttribute("checked", "t");
        input.setAttribute("name", "t");

        fragment = document.createDocumentFragment();
        fragment.appendChild(input);

        // Check if a disconnected checkbox will retain its checked
        // value of true after appended to the DOM (IE6/7)
        support.appendChecked = input.checked;

        // WebKit doesn't clone checked state correctly in fragments
        support.checkClone = fragment.cloneNode(true).cloneNode(true).lastChild.checked;

        // Support: IE<9
        // Opera does not clone events (and typeof div.attachEvent === undefined).
        // IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
        if (div.attachEvent) {
            div.attachEvent("onclick", function () {
                support.noCloneEvent = false;
            });

            div.cloneNode(true).click();
        }

        // Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
        // Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
        for (i in { submit: true, change: true, focusin: true }) {
            div.setAttribute(eventName = "on" + i, "t");

            support[i + "Bubbles"] = eventName in window || div.attributes[eventName].expando === false;
        }

        div.style.backgroundClip = "content-box";
        div.cloneNode(true).style.backgroundClip = "";
        support.clearCloneStyle = div.style.backgroundClip === "content-box";

        // Support: IE<9
        // Iteration over object's inherited properties before its own.
        for (i in jQuery(support)) {
            break;
        }
        support.ownLast = i !== "0";

        // Run tests that need a body at doc ready
        jQuery(function () {
            var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

            if (!body) {
                // Return for frameset docs that don't have a body
                return;
            }

            container = document.createElement("div");
            container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

            body.appendChild(container).appendChild(div);

            // Support: IE8
            // Check if table cells still have offsetWidth/Height when they are set
            // to display:none and there are still other visible table cells in a
            // table row; if so, offsetWidth/Height are not reliable for use when
            // determining if an element has been hidden directly using
            // display:none (it is still safe to use offsets if a parent element is
            // hidden; don safety goggles and see bug #4512 for more information).
            div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
            tds = div.getElementsByTagName("td");
            tds[0].style.cssText = "padding:0;margin:0;border:0;display:none";
            isSupported = (tds[0].offsetHeight === 0);

            tds[0].style.display = "";
            tds[1].style.display = "none";

            // Support: IE8
            // Check if empty table cells still have offsetWidth/Height
            support.reliableHiddenOffsets = isSupported && (tds[0].offsetHeight === 0);

            // Check box-sizing and margin behavior.
            div.innerHTML = "";
            div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";

            // Workaround failing boxSizing test due to offsetWidth returning wrong value
            // with some non-1 values of body zoom, ticket #13543
            jQuery.swap(body, body.style.zoom != null ? { zoom: 1} : {}, function () {
                support.boxSizing = div.offsetWidth === 4;
            });

            // Use window.getComputedStyle because jsdom on node.js will break without it.
            if (window.getComputedStyle) {
                support.pixelPosition = (window.getComputedStyle(div, null) || {}).top !== "1%";
                support.boxSizingReliable = (window.getComputedStyle(div, null) || { width: "4px" }).width === "4px";

                // Check if div with explicit width and no margin-right incorrectly
                // gets computed margin-right based on width of container. (#3333)
                // Fails in WebKit before Feb 2011 nightlies
                // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
                marginDiv = div.appendChild(document.createElement("div"));
                marginDiv.style.cssText = div.style.cssText = divReset;
                marginDiv.style.marginRight = marginDiv.style.width = "0";
                div.style.width = "1px";

                support.reliableMarginRight =
				!parseFloat((window.getComputedStyle(marginDiv, null) || {}).marginRight);
            }

            if (typeof div.style.zoom !== core_strundefined) {
                // Support: IE<8
                // Check if natively block-level elements act like inline-block
                // elements when setting their display to 'inline' and giving
                // them layout
                div.innerHTML = "";
                div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
                support.inlineBlockNeedsLayout = (div.offsetWidth === 3);

                // Support: IE6
                // Check if elements with layout shrink-wrap their children
                div.style.display = "block";
                div.innerHTML = "<div></div>";
                div.firstChild.style.width = "5px";
                support.shrinkWrapBlocks = (div.offsetWidth !== 3);

                if (support.inlineBlockNeedsLayout) {
                    // Prevent IE 6 from affecting layout for positioned elements #11048
                    // Prevent IE from shrinking the body in IE 7 mode #12869
                    // Support: IE<8
                    body.style.zoom = 1;
                }
            }

            body.removeChild(container);

            // Null elements to avoid leaks in IE
            container = div = tds = marginDiv = null;
        });

        // Null elements to avoid leaks in IE
        all = select = fragment = opt = a = input = null;

        return support;
    })({});

    var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

    function internalData(elem, name, data, pvt /* Internal Use Only */) {
        if (!jQuery.acceptData(elem)) {
            return;
        }

        var ret, thisCache,
		internalKey = jQuery.expando,

        // We have to handle DOM nodes and JS objects differently because IE6-7
        // can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

        // Only DOM nodes need the global jQuery cache; JS object data is
        // attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

        // Only defining an ID for JS objects if its cache already exists allows
        // the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[internalKey] : elem[internalKey] && internalKey;

        // Avoid doing any more work than we need to when trying to get data on an
        // object that has no data at all
        if ((!id || !cache[id] || (!pvt && !cache[id].data)) && data === undefined && typeof name === "string") {
            return;
        }

        if (!id) {
            // Only DOM nodes need a new unique ID for each element since their data
            // ends up in the global cache
            if (isNode) {
                id = elem[internalKey] = core_deletedIds.pop() || jQuery.guid++;
            } else {
                id = internalKey;
            }
        }

        if (!cache[id]) {
            // Avoid exposing jQuery metadata on plain JS objects when the object
            // is serialized using JSON.stringify
            cache[id] = isNode ? {} : { toJSON: jQuery.noop };
        }

        // An object can be passed to jQuery.data instead of a key/value pair; this gets
        // shallow copied over onto the existing cache
        if (typeof name === "object" || typeof name === "function") {
            if (pvt) {
                cache[id] = jQuery.extend(cache[id], name);
            } else {
                cache[id].data = jQuery.extend(cache[id].data, name);
            }
        }

        thisCache = cache[id];

        // jQuery data() is stored in a separate object inside the object's internal data
        // cache in order to avoid key collisions between internal data and user-defined
        // data.
        if (!pvt) {
            if (!thisCache.data) {
                thisCache.data = {};
            }

            thisCache = thisCache.data;
        }

        if (data !== undefined) {
            thisCache[jQuery.camelCase(name)] = data;
        }

        // Check for both converted-to-camel and non-converted data property names
        // If a data property was specified
        if (typeof name === "string") {

            // First Try to find as-is property data
            ret = thisCache[name];

            // Test for null|undefined property data
            if (ret == null) {

                // Try to find the camelCased property
                ret = thisCache[jQuery.camelCase(name)];
            }
        } else {
            ret = thisCache;
        }

        return ret;
    }

    function internalRemoveData(elem, name, pvt) {
        if (!jQuery.acceptData(elem)) {
            return;
        }

        var thisCache, i,
		isNode = elem.nodeType,

        // See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[jQuery.expando] : jQuery.expando;

        // If there is already no cache entry for this object, there is no
        // purpose in continuing
        if (!cache[id]) {
            return;
        }

        if (name) {

            thisCache = pvt ? cache[id] : cache[id].data;

            if (thisCache) {

                // Support array or space separated string names for data keys
                if (!jQuery.isArray(name)) {

                    // try the string as a key before any manipulation
                    if (name in thisCache) {
                        name = [name];
                    } else {

                        // split the camel cased version by spaces unless a key with the spaces exists
                        name = jQuery.camelCase(name);
                        if (name in thisCache) {
                            name = [name];
                        } else {
                            name = name.split(" ");
                        }
                    }
                } else {
                    // If "name" is an array of keys...
                    // When data is initially created, via ("key", "val") signature,
                    // keys will be converted to camelCase.
                    // Since there is no way to tell _how_ a key was added, remove
                    // both plain key and camelCase key. #12786
                    // This will only penalize the array argument path.
                    name = name.concat(jQuery.map(name, jQuery.camelCase));
                }

                i = name.length;
                while (i--) {
                    delete thisCache[name[i]];
                }

                // If there is no data left in the cache, we want to continue
                // and let the cache object itself get destroyed
                if (pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache)) {
                    return;
                }
            }
        }

        // See jQuery.data for more information
        if (!pvt) {
            delete cache[id].data;

            // Don't destroy the parent cache unless the internal data object
            // had been the only thing left in it
            if (!isEmptyDataObject(cache[id])) {
                return;
            }
        }

        // Destroy the cache
        if (isNode) {
            jQuery.cleanData([elem], true);

            // Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
            /* jshint eqeqeq: false */
        } else if (jQuery.support.deleteExpando || cache != cache.window) {
            /* jshint eqeqeq: true */
            delete cache[id];

            // When all else fails, null
        } else {
            cache[id] = null;
        }
    }

    jQuery.extend({
        cache: {},

        // The following elements throw uncatchable exceptions if you
        // attempt to add expando properties to them.
        noData: {
            "applet": true,
            "embed": true,
            // Ban all objects except for Flash (which handle expandos)
            "object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
        },

        hasData: function (elem) {
            elem = elem.nodeType ? jQuery.cache[elem[jQuery.expando]] : elem[jQuery.expando];
            return !!elem && !isEmptyDataObject(elem);
        },

        data: function (elem, name, data) {
            return internalData(elem, name, data);
        },

        removeData: function (elem, name) {
            return internalRemoveData(elem, name);
        },

        // For internal use only.
        _data: function (elem, name, data) {
            return internalData(elem, name, data, true);
        },

        _removeData: function (elem, name) {
            return internalRemoveData(elem, name, true);
        },

        // A method for determining if a DOM node can handle the data expando
        acceptData: function (elem) {
            // Do not set data on non-element because it will not be cleared (#8335).
            if (elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9) {
                return false;
            }

            var noData = elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()];

            // nodes accept data unless otherwise specified; rejection can be conditional
            return !noData || noData !== true && elem.getAttribute("classid") === noData;
        }
    });

    jQuery.fn.extend({
        data: function (key, value) {
            var attrs, name,
			data = null,
			i = 0,
			elem = this[0];

            // Special expections of .data basically thwart jQuery.access,
            // so implement the relevant behavior ourselves

            // Gets all values
            if (key === undefined) {
                if (this.length) {
                    data = jQuery.data(elem);

                    if (elem.nodeType === 1 && !jQuery._data(elem, "parsedAttrs")) {
                        attrs = elem.attributes;
                        for (; i < attrs.length; i++) {
                            name = attrs[i].name;

                            if (name.indexOf("data-") === 0) {
                                name = jQuery.camelCase(name.slice(5));

                                dataAttr(elem, name, data[name]);
                            }
                        }
                        jQuery._data(elem, "parsedAttrs", true);
                    }
                }

                return data;
            }

            // Sets multiple values
            if (typeof key === "object") {
                return this.each(function () {
                    jQuery.data(this, key);
                });
            }

            return arguments.length > 1 ?

            // Sets one value
			this.each(function () {
			    jQuery.data(this, key, value);
			}) :

            // Gets one value
            // Try to fetch any internally stored data first
			elem ? dataAttr(elem, key, jQuery.data(elem, key)) : null;
        },

        removeData: function (key) {
            return this.each(function () {
                jQuery.removeData(this, key);
            });
        }
    });

    function dataAttr(elem, key, data) {
        // If nothing was found internally, try to fetch any
        // data from the HTML5 data-* attribute
        if (data === undefined && elem.nodeType === 1) {

            var name = "data-" + key.replace(rmultiDash, "-$1").toLowerCase();

            data = elem.getAttribute(name);

            if (typeof data === "string") {
                try {
                    data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
                    // Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test(data) ? jQuery.parseJSON(data) :
						data;
                } catch (e) { }

                // Make sure we set the data so it isn't changed later
                jQuery.data(elem, key, data);

            } else {
                data = undefined;
            }
        }

        return data;
    }

    // checks a cache object for emptiness
    function isEmptyDataObject(obj) {
        var name;
        for (name in obj) {

            // if the public data object is empty, the private is still empty
            if (name === "data" && jQuery.isEmptyObject(obj[name])) {
                continue;
            }
            if (name !== "toJSON") {
                return false;
            }
        }

        return true;
    }
    jQuery.extend({
        queue: function (elem, type, data) {
            var queue;

            if (elem) {
                type = (type || "fx") + "queue";
                queue = jQuery._data(elem, type);

                // Speed up dequeue by getting out quickly if this is just a lookup
                if (data) {
                    if (!queue || jQuery.isArray(data)) {
                        queue = jQuery._data(elem, type, jQuery.makeArray(data));
                    } else {
                        queue.push(data);
                    }
                }
                return queue || [];
            }
        },

        dequeue: function (elem, type) {
            type = type || "fx";

            var queue = jQuery.queue(elem, type),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks(elem, type),
			next = function () {
			    jQuery.dequeue(elem, type);
			};

            // If the fx queue is dequeued, always remove the progress sentinel
            if (fn === "inprogress") {
                fn = queue.shift();
                startLength--;
            }

            if (fn) {

                // Add a progress sentinel to prevent the fx queue from being
                // automatically dequeued
                if (type === "fx") {
                    queue.unshift("inprogress");
                }

                // clear up the last queue stop function
                delete hooks.stop;
                fn.call(elem, next, hooks);
            }

            if (!startLength && hooks) {
                hooks.empty.fire();
            }
        },

        // not intended for public consumption - generates a queueHooks object, or returns the current one
        _queueHooks: function (elem, type) {
            var key = type + "queueHooks";
            return jQuery._data(elem, key) || jQuery._data(elem, key, {
                empty: jQuery.Callbacks("once memory").add(function () {
                    jQuery._removeData(elem, type + "queue");
                    jQuery._removeData(elem, key);
                })
            });
        }
    });

    jQuery.fn.extend({
        queue: function (type, data) {
            var setter = 2;

            if (typeof type !== "string") {
                data = type;
                type = "fx";
                setter--;
            }

            if (arguments.length < setter) {
                return jQuery.queue(this[0], type);
            }

            return data === undefined ?
			this :
			this.each(function () {
			    var queue = jQuery.queue(this, type, data);

			    // ensure a hooks for this queue
			    jQuery._queueHooks(this, type);

			    if (type === "fx" && queue[0] !== "inprogress") {
			        jQuery.dequeue(this, type);
			    }
			});
        },
        dequeue: function (type) {
            return this.each(function () {
                jQuery.dequeue(this, type);
            });
        },
        // Based off of the plugin by Clint Helfers, with permission.
        // http://blindsignals.com/index.php/2009/07/jquery-delay/
        delay: function (time, type) {
            time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
            type = type || "fx";

            return this.queue(type, function (next, hooks) {
                var timeout = setTimeout(next, time);
                hooks.stop = function () {
                    clearTimeout(timeout);
                };
            });
        },
        clearQueue: function (type) {
            return this.queue(type || "fx", []);
        },
        // Get a promise resolved when queues of a certain type
        // are emptied (fx is the type by default)
        promise: function (type, obj) {
            var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function () {
			    if (!(--count)) {
			        defer.resolveWith(elements, [elements]);
			    }
			};

            if (typeof type !== "string") {
                obj = type;
                type = undefined;
            }
            type = type || "fx";

            while (i--) {
                tmp = jQuery._data(elements[i], type + "queueHooks");
                if (tmp && tmp.empty) {
                    count++;
                    tmp.empty.add(resolve);
                }
            }
            resolve();
            return defer.promise(obj);
        }
    });
    var nodeHook, boolHook,
	rclass = /[\t\r\n\f]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	getSetInput = jQuery.support.input;

    jQuery.fn.extend({
        attr: function (name, value) {
            return jQuery.access(this, jQuery.attr, name, value, arguments.length > 1);
        },

        removeAttr: function (name) {
            return this.each(function () {
                jQuery.removeAttr(this, name);
            });
        },

        prop: function (name, value) {
            return jQuery.access(this, jQuery.prop, name, value, arguments.length > 1);
        },

        removeProp: function (name) {
            name = jQuery.propFix[name] || name;
            return this.each(function () {
                // try/catch handles cases where IE balks (such as removing a property on window)
                try {
                    this[name] = undefined;
                    delete this[name];
                } catch (e) { }
            });
        },

        addClass: function (value) {
            var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

            if (jQuery.isFunction(value)) {
                return this.each(function (j) {
                    jQuery(this).addClass(value.call(this, j, this.className));
                });
            }

            if (proceed) {
                // The disjunction here is for better compressibility (see removeClass)
                classes = (value || "").match(core_rnotwhite) || [];

                for (; i < len; i++) {
                    elem = this[i];
                    cur = elem.nodeType === 1 && (elem.className ?
					(" " + elem.className + " ").replace(rclass, " ") :
					" "
				);

                    if (cur) {
                        j = 0;
                        while ((clazz = classes[j++])) {
                            if (cur.indexOf(" " + clazz + " ") < 0) {
                                cur += clazz + " ";
                            }
                        }
                        elem.className = jQuery.trim(cur);

                    }
                }
            }

            return this;
        },

        removeClass: function (value) {
            var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

            if (jQuery.isFunction(value)) {
                return this.each(function (j) {
                    jQuery(this).removeClass(value.call(this, j, this.className));
                });
            }
            if (proceed) {
                classes = (value || "").match(core_rnotwhite) || [];

                for (; i < len; i++) {
                    elem = this[i];
                    // This expression is here for better compressibility (see addClass)
                    cur = elem.nodeType === 1 && (elem.className ?
					(" " + elem.className + " ").replace(rclass, " ") :
					""
				);

                    if (cur) {
                        j = 0;
                        while ((clazz = classes[j++])) {
                            // Remove *all* instances
                            while (cur.indexOf(" " + clazz + " ") >= 0) {
                                cur = cur.replace(" " + clazz + " ", " ");
                            }
                        }
                        elem.className = value ? jQuery.trim(cur) : "";
                    }
                }
            }

            return this;
        },

        toggleClass: function (value, stateVal) {
            var type = typeof value;

            if (typeof stateVal === "boolean" && type === "string") {
                return stateVal ? this.addClass(value) : this.removeClass(value);
            }

            if (jQuery.isFunction(value)) {
                return this.each(function (i) {
                    jQuery(this).toggleClass(value.call(this, i, this.className, stateVal), stateVal);
                });
            }

            return this.each(function () {
                if (type === "string") {
                    // toggle individual class names
                    var className,
					i = 0,
					self = jQuery(this),
					classNames = value.match(core_rnotwhite) || [];

                    while ((className = classNames[i++])) {
                        // check each className given, space separated list
                        if (self.hasClass(className)) {
                            self.removeClass(className);
                        } else {
                            self.addClass(className);
                        }
                    }

                    // Toggle whole class name
                } else if (type === core_strundefined || type === "boolean") {
                    if (this.className) {
                        // store className if set
                        jQuery._data(this, "__className__", this.className);
                    }

                    // If the element has a class name or if we're passed "false",
                    // then remove the whole classname (if there was one, the above saved it).
                    // Otherwise bring back whatever was previously saved (if anything),
                    // falling back to the empty string if nothing was stored.
                    this.className = this.className || value === false ? "" : jQuery._data(this, "__className__") || "";
                }
            });
        },

        hasClass: function (selector) {
            var className = " " + selector + " ",
			i = 0,
			l = this.length;
            for (; i < l; i++) {
                if (this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf(className) >= 0) {
                    return true;
                }
            }

            return false;
        },

        val: function (value) {
            var ret, hooks, isFunction,
			elem = this[0];

            if (!arguments.length) {
                if (elem) {
                    hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()];

                    if (hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== undefined) {
                        return ret;
                    }

                    ret = elem.value;

                    return typeof ret === "string" ?
                    // handle most common string cases
					ret.replace(rreturn, "") :
                    // handle cases where value is null/undef or number
					ret == null ? "" : ret;
                }

                return;
            }

            isFunction = jQuery.isFunction(value);

            return this.each(function (i) {
                var val;

                if (this.nodeType !== 1) {
                    return;
                }

                if (isFunction) {
                    val = value.call(this, i, jQuery(this).val());
                } else {
                    val = value;
                }

                // Treat null/undefined as ""; convert numbers to string
                if (val == null) {
                    val = "";
                } else if (typeof val === "number") {
                    val += "";
                } else if (jQuery.isArray(val)) {
                    val = jQuery.map(val, function (value) {
                        return value == null ? "" : value + "";
                    });
                }

                hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()];

                // If set returns undefined, fall back to normal setting
                if (!hooks || !("set" in hooks) || hooks.set(this, val, "value") === undefined) {
                    this.value = val;
                }
            });
        }
    });

    jQuery.extend({
        valHooks: {
            option: {
                get: function (elem) {
                    // Use proper attribute retrieval(#6932, #12072)
                    var val = jQuery.find.attr(elem, "value");
                    return val != null ?
					val :
					elem.text;
                }
            },
            select: {
                get: function (elem) {
                    var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

                    // Loop through all the selected options
                    for (; i < max; i++) {
                        option = options[i];

                        // oldIE doesn't update selected after form reset (#2551)
                        if ((option.selected || i === index) &&
                        // Don't return options that are disabled or in a disabled optgroup
							(jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
							(!option.parentNode.disabled || !jQuery.nodeName(option.parentNode, "optgroup"))) {

                            // Get the specific value for the option
                            value = jQuery(option).val();

                            // We don't need an array for one selects
                            if (one) {
                                return value;
                            }

                            // Multi-Selects return an array
                            values.push(value);
                        }
                    }

                    return values;
                },

                set: function (elem, value) {
                    var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray(value),
					i = options.length;

                    while (i--) {
                        option = options[i];
                        if ((option.selected = jQuery.inArray(jQuery(option).val(), values) >= 0)) {
                            optionSet = true;
                        }
                    }

                    // force browsers to behave consistently when non-matching value is set
                    if (!optionSet) {
                        elem.selectedIndex = -1;
                    }
                    return values;
                }
            }
        },

        attr: function (elem, name, value) {
            var hooks, ret,
			nType = elem.nodeType;

            // don't get/set attributes on text, comment and attribute nodes
            if (!elem || nType === 3 || nType === 8 || nType === 2) {
                return;
            }

            // Fallback to prop when attributes are not supported
            if (typeof elem.getAttribute === core_strundefined) {
                return jQuery.prop(elem, name, value);
            }

            // All attributes are lowercase
            // Grab necessary hook if one is defined
            if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
                name = name.toLowerCase();
                hooks = jQuery.attrHooks[name] ||
				(jQuery.expr.match.bool.test(name) ? boolHook : nodeHook);
            }

            if (value !== undefined) {

                if (value === null) {
                    jQuery.removeAttr(elem, name);

                } else if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined) {
                    return ret;

                } else {
                    elem.setAttribute(name, value + "");
                    return value;
                }

            } else if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
                return ret;

            } else {
                ret = jQuery.find.attr(elem, name);

                // Non-existent attributes return null, we normalize to undefined
                return ret == null ?
				undefined :
				ret;
            }
        },

        removeAttr: function (elem, value) {
            var name, propName,
			i = 0,
			attrNames = value && value.match(core_rnotwhite);

            if (attrNames && elem.nodeType === 1) {
                while ((name = attrNames[i++])) {
                    propName = jQuery.propFix[name] || name;

                    // Boolean attributes get special treatment (#10870)
                    if (jQuery.expr.match.bool.test(name)) {
                        // Set corresponding property to false
                        if (getSetInput && getSetAttribute || !ruseDefault.test(name)) {
                            elem[propName] = false;
                            // Support: IE<9
                            // Also clear defaultChecked/defaultSelected (if appropriate)
                        } else {
                            elem[jQuery.camelCase("default-" + name)] =
							elem[propName] = false;
                        }

                        // See #9699 for explanation of this approach (setting first, then removal)
                    } else {
                        jQuery.attr(elem, name, "");
                    }

                    elem.removeAttribute(getSetAttribute ? name : propName);
                }
            }
        },

        attrHooks: {
            type: {
                set: function (elem, value) {
                    if (!jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input")) {
                        // Setting the type on a radio button after the value resets the value in IE6-9
                        // Reset value to default in case type is set after value during creation
                        var val = elem.value;
                        elem.setAttribute("type", value);
                        if (val) {
                            elem.value = val;
                        }
                        return value;
                    }
                }
            }
        },

        propFix: {
            "for": "htmlFor",
            "class": "className"
        },

        prop: function (elem, name, value) {
            var ret, hooks, notxml,
			nType = elem.nodeType;

            // don't get/set properties on text, comment and attribute nodes
            if (!elem || nType === 3 || nType === 8 || nType === 2) {
                return;
            }

            notxml = nType !== 1 || !jQuery.isXMLDoc(elem);

            if (notxml) {
                // Fix name and attach hooks
                name = jQuery.propFix[name] || name;
                hooks = jQuery.propHooks[name];
            }

            if (value !== undefined) {
                return hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined ?
				ret :
				(elem[name] = value);

            } else {
                return hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null ?
				ret :
				elem[name];
            }
        },

        propHooks: {
            tabIndex: {
                get: function (elem) {
                    // elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
                    // http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
                    // Use proper attribute retrieval(#12072)
                    var tabindex = jQuery.find.attr(elem, "tabindex");

                    return tabindex ?
					parseInt(tabindex, 10) :
					rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href ?
						0 :
						-1;
                }
            }
        }
    });

    // Hooks for boolean attributes
    boolHook = {
        set: function (elem, value, name) {
            if (value === false) {
                // Remove boolean attributes when set to false
                jQuery.removeAttr(elem, name);
            } else if (getSetInput && getSetAttribute || !ruseDefault.test(name)) {
                // IE<8 needs the *property* name
                elem.setAttribute(!getSetAttribute && jQuery.propFix[name] || name, name);

                // Use defaultChecked and defaultSelected for oldIE
            } else {
                elem[jQuery.camelCase("default-" + name)] = elem[name] = true;
            }

            return name;
        }
    };
    jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function (i, name) {
        var getter = jQuery.expr.attrHandle[name] || jQuery.find.attr;

        jQuery.expr.attrHandle[name] = getSetInput && getSetAttribute || !ruseDefault.test(name) ?
		function (elem, name, isXML) {
		    var fn = jQuery.expr.attrHandle[name],
				ret = isXML ?
					undefined :
		    /* jshint eqeqeq: false */
					(jQuery.expr.attrHandle[name] = undefined) !=
						getter(elem, name, isXML) ?

						name.toLowerCase() :
						null;
		    jQuery.expr.attrHandle[name] = fn;
		    return ret;
		} :
		function (elem, name, isXML) {
		    return isXML ?
				undefined :
				elem[jQuery.camelCase("default-" + name)] ?
					name.toLowerCase() :
					null;
		};
    });

    // fix oldIE attroperties
    if (!getSetInput || !getSetAttribute) {
        jQuery.attrHooks.value = {
            set: function (elem, value, name) {
                if (jQuery.nodeName(elem, "input")) {
                    // Does not return so that setAttribute is also used
                    elem.defaultValue = value;
                } else {
                    // Use nodeHook if defined (#1954); otherwise setAttribute is fine
                    return nodeHook && nodeHook.set(elem, value, name);
                }
            }
        };
    }

    // IE6/7 do not support getting/setting some attributes with get/setAttribute
    if (!getSetAttribute) {

        // Use this for any attribute in IE6/7
        // This fixes almost every IE6/7 issue
        nodeHook = {
            set: function (elem, value, name) {
                // Set the existing or create a new attribute node
                var ret = elem.getAttributeNode(name);
                if (!ret) {
                    elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute(name))
				);
                }

                ret.value = value += "";

                // Break association with cloned elements by also using setAttribute (#9646)
                return name === "value" || value === elem.getAttribute(name) ?
				value :
				undefined;
            }
        };
        jQuery.expr.attrHandle.id = jQuery.expr.attrHandle.name = jQuery.expr.attrHandle.coords =
        // Some attributes are constructed with empty-string values when not defined
		function (elem, name, isXML) {
		    var ret;
		    return isXML ?
				undefined :
				(ret = elem.getAttributeNode(name)) && ret.value !== "" ?
					ret.value :
					null;
		};
        jQuery.valHooks.button = {
            get: function (elem, name) {
                var ret = elem.getAttributeNode(name);
                return ret && ret.specified ?
				ret.value :
				undefined;
            },
            set: nodeHook.set
        };

        // Set contenteditable to false on removals(#10429)
        // Setting to empty string throws an error as an invalid value
        jQuery.attrHooks.contenteditable = {
            set: function (elem, value, name) {
                nodeHook.set(elem, value === "" ? false : value, name);
            }
        };

        // Set width and height to auto instead of 0 on empty string( Bug #8150 )
        // This is for removals
        jQuery.each(["width", "height"], function (i, name) {
            jQuery.attrHooks[name] = {
                set: function (elem, value) {
                    if (value === "") {
                        elem.setAttribute(name, "auto");
                        return value;
                    }
                }
            };
        });
    }


    // Some attributes require a special call on IE
    // http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
    if (!jQuery.support.hrefNormalized) {
        // href/src property should get the full normalized URL (#10299/#12915)
        jQuery.each(["href", "src"], function (i, name) {
            jQuery.propHooks[name] = {
                get: function (elem) {
                    return elem.getAttribute(name, 4);
                }
            };
        });
    }

    if (!jQuery.support.style) {
        jQuery.attrHooks.style = {
            get: function (elem) {
                // Return undefined in the case of empty string
                // Note: IE uppercases css property names, but if we were to .toLowerCase()
                // .cssText, that would destroy case senstitivity in URL's, like in "background"
                return elem.style.cssText || undefined;
            },
            set: function (elem, value) {
                return (elem.style.cssText = value + "");
            }
        };
    }

    // Safari mis-reports the default selected property of an option
    // Accessing the parent's selectedIndex property fixes it
    if (!jQuery.support.optSelected) {
        jQuery.propHooks.selected = {
            get: function (elem) {
                var parent = elem.parentNode;

                if (parent) {
                    parent.selectedIndex;

                    // Make sure that it also works with optgroups, see #5701
                    if (parent.parentNode) {
                        parent.parentNode.selectedIndex;
                    }
                }
                return null;
            }
        };
    }

    jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function () {
    jQuery.propFix[this.toLowerCase()] = this;
});

    // IE6/7 call enctype encoding
    if (!jQuery.support.enctype) {
        jQuery.propFix.enctype = "encoding";
    }

    // Radios and checkboxes getter/setter
    jQuery.each(["radio", "checkbox"], function () {
        jQuery.valHooks[this] = {
            set: function (elem, value) {
                if (jQuery.isArray(value)) {
                    return (elem.checked = jQuery.inArray(jQuery(elem).val(), value) >= 0);
                }
            }
        };
        if (!jQuery.support.checkOn) {
            jQuery.valHooks[this].get = function (elem) {
                // Support: Webkit
                // "" is returned instead of "on" if a value isn't specified
                return elem.getAttribute("value") === null ? "on" : elem.value;
            };
        }
    });
    var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

    function returnTrue() {
        return true;
    }

    function returnFalse() {
        return false;
    }

    function safeActiveElement() {
        try {
            return document.activeElement;
        } catch (err) { }
    }

    /*
    * Helper functions for managing events -- not part of the public interface.
    * Props to Dean Edwards' addEvent library for many of the ideas.
    */
    jQuery.event = {

        global: {},

        add: function (elem, types, handler, data, selector) {
            var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data(elem);

            // Don't attach events to noData or text/comment nodes (but allow plain objects)
            if (!elemData) {
                return;
            }

            // Caller can pass in an object of custom data in lieu of the handler
            if (handler.handler) {
                handleObjIn = handler;
                handler = handleObjIn.handler;
                selector = handleObjIn.selector;
            }

            // Make sure that the handler has a unique ID, used to find/remove it later
            if (!handler.guid) {
                handler.guid = jQuery.guid++;
            }

            // Init the element's event structure and main handler, if this is the first
            if (!(events = elemData.events)) {
                events = elemData.events = {};
            }
            if (!(eventHandle = elemData.handle)) {
                eventHandle = elemData.handle = function (e) {
                    // Discard the second event of a jQuery.event.trigger() and
                    // when an event is called after a page has unloaded
                    return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply(eventHandle.elem, arguments) :
					undefined;
                };
                // Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
                eventHandle.elem = elem;
            }

            // Handle multiple events separated by a space
            types = (types || "").match(core_rnotwhite) || [""];
            t = types.length;
            while (t--) {
                tmp = rtypenamespace.exec(types[t]) || [];
                type = origType = tmp[1];
                namespaces = (tmp[2] || "").split(".").sort();

                // There *must* be a type, no attaching namespace-only handlers
                if (!type) {
                    continue;
                }

                // If event changes its type, use the special event handlers for the changed type
                special = jQuery.event.special[type] || {};

                // If selector defined, determine special event api type, otherwise given type
                type = (selector ? special.delegateType : special.bindType) || type;

                // Update special based on newly reset type
                special = jQuery.event.special[type] || {};

                // handleObj is passed to all event handlers
                handleObj = jQuery.extend({
                    type: type,
                    origType: origType,
                    data: data,
                    handler: handler,
                    guid: handler.guid,
                    selector: selector,
                    needsContext: selector && jQuery.expr.match.needsContext.test(selector),
                    namespace: namespaces.join(".")
                }, handleObjIn);

                // Init the event handler queue if we're the first
                if (!(handlers = events[type])) {
                    handlers = events[type] = [];
                    handlers.delegateCount = 0;

                    // Only use addEventListener/attachEvent if the special events handler returns false
                    if (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false) {
                        // Bind the global event handler to the element
                        if (elem.addEventListener) {
                            elem.addEventListener(type, eventHandle, false);

                        } else if (elem.attachEvent) {
                            elem.attachEvent("on" + type, eventHandle);
                        }
                    }
                }

                if (special.add) {
                    special.add.call(elem, handleObj);

                    if (!handleObj.handler.guid) {
                        handleObj.handler.guid = handler.guid;
                    }
                }

                // Add to the element's handler list, delegates in front
                if (selector) {
                    handlers.splice(handlers.delegateCount++, 0, handleObj);
                } else {
                    handlers.push(handleObj);
                }

                // Keep track of which events have ever been used, for event optimization
                jQuery.event.global[type] = true;
            }

            // Nullify elem to prevent memory leaks in IE
            elem = null;
        },

        // Detach an event or set of events from an element
        remove: function (elem, types, handler, selector, mappedTypes) {
            var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData(elem) && jQuery._data(elem);

            if (!elemData || !(events = elemData.events)) {
                return;
            }

            // Once for each type.namespace in types; type may be omitted
            types = (types || "").match(core_rnotwhite) || [""];
            t = types.length;
            while (t--) {
                tmp = rtypenamespace.exec(types[t]) || [];
                type = origType = tmp[1];
                namespaces = (tmp[2] || "").split(".").sort();

                // Unbind all events (on this namespace, if provided) for the element
                if (!type) {
                    for (type in events) {
                        jQuery.event.remove(elem, type + types[t], handler, selector, true);
                    }
                    continue;
                }

                special = jQuery.event.special[type] || {};
                type = (selector ? special.delegateType : special.bindType) || type;
                handlers = events[type] || [];
                tmp = tmp[2] && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)");

                // Remove matching events
                origCount = j = handlers.length;
                while (j--) {
                    handleObj = handlers[j];

                    if ((mappedTypes || origType === handleObj.origType) &&
					(!handler || handler.guid === handleObj.guid) &&
					(!tmp || tmp.test(handleObj.namespace)) &&
					(!selector || selector === handleObj.selector || selector === "**" && handleObj.selector)) {
                        handlers.splice(j, 1);

                        if (handleObj.selector) {
                            handlers.delegateCount--;
                        }
                        if (special.remove) {
                            special.remove.call(elem, handleObj);
                        }
                    }
                }

                // Remove generic event handler if we removed something and no more handlers exist
                // (avoids potential for endless recursion during removal of special event handlers)
                if (origCount && !handlers.length) {
                    if (!special.teardown || special.teardown.call(elem, namespaces, elemData.handle) === false) {
                        jQuery.removeEvent(elem, type, elemData.handle);
                    }

                    delete events[type];
                }
            }

            // Remove the expando if it's no longer used
            if (jQuery.isEmptyObject(events)) {
                delete elemData.handle;

                // removeData also checks for emptiness and clears the expando if empty
                // so use it instead of delete
                jQuery._removeData(elem, "events");
            }
        },

        trigger: function (event, data, elem, onlyHandlers) {
            var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [elem || document],
			type = core_hasOwn.call(event, "type") ? event.type : event,
			namespaces = core_hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];

            cur = tmp = elem = elem || document;

            // Don't do events on text and comment nodes
            if (elem.nodeType === 3 || elem.nodeType === 8) {
                return;
            }

            // focus/blur morphs to focusin/out; ensure we're not firing them right now
            if (rfocusMorph.test(type + jQuery.event.triggered)) {
                return;
            }

            if (type.indexOf(".") >= 0) {
                // Namespaced trigger; create a regexp to match event type in handle()
                namespaces = type.split(".");
                type = namespaces.shift();
                namespaces.sort();
            }
            ontype = type.indexOf(":") < 0 && "on" + type;

            // Caller can pass in a jQuery.Event object, Object, or just an event type string
            event = event[jQuery.expando] ?
			event :
			new jQuery.Event(type, typeof event === "object" && event);

            // Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
            event.isTrigger = onlyHandlers ? 2 : 3;
            event.namespace = namespaces.join(".");
            event.namespace_re = event.namespace ?
			new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") :
			null;

            // Clean up the event in case it is being reused
            event.result = undefined;
            if (!event.target) {
                event.target = elem;
            }

            // Clone any incoming data and prepend the event, creating the handler arg list
            data = data == null ?
			[event] :
			jQuery.makeArray(data, [event]);

            // Allow special events to draw outside the lines
            special = jQuery.event.special[type] || {};
            if (!onlyHandlers && special.trigger && special.trigger.apply(elem, data) === false) {
                return;
            }

            // Determine event propagation path in advance, per W3C events spec (#9951)
            // Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
            if (!onlyHandlers && !special.noBubble && !jQuery.isWindow(elem)) {

                bubbleType = special.delegateType || type;
                if (!rfocusMorph.test(bubbleType + type)) {
                    cur = cur.parentNode;
                }
                for (; cur; cur = cur.parentNode) {
                    eventPath.push(cur);
                    tmp = cur;
                }

                // Only add window if we got to document (e.g., not plain obj or detached DOM)
                if (tmp === (elem.ownerDocument || document)) {
                    eventPath.push(tmp.defaultView || tmp.parentWindow || window);
                }
            }

            // Fire handlers on the event path
            i = 0;
            while ((cur = eventPath[i++]) && !event.isPropagationStopped()) {

                event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

                // jQuery handler
                handle = (jQuery._data(cur, "events") || {})[event.type] && jQuery._data(cur, "handle");
                if (handle) {
                    handle.apply(cur, data);
                }

                // Native handler
                handle = ontype && cur[ontype];
                if (handle && jQuery.acceptData(cur) && handle.apply && handle.apply(cur, data) === false) {
                    event.preventDefault();
                }
            }
            event.type = type;

            // If nobody prevented the default action, do it now
            if (!onlyHandlers && !event.isDefaultPrevented()) {

                if ((!special._default || special._default.apply(eventPath.pop(), data) === false) &&
				jQuery.acceptData(elem)) {

                    // Call a native DOM method on the target with the same name name as the event.
                    // Can't use an .isFunction() check here because IE6/7 fails that test.
                    // Don't do default actions on window, that's where global variables be (#6170)
                    if (ontype && elem[type] && !jQuery.isWindow(elem)) {

                        // Don't re-trigger an onFOO event when we call its FOO() method
                        tmp = elem[ontype];

                        if (tmp) {
                            elem[ontype] = null;
                        }

                        // Prevent re-triggering of the same event, since we already bubbled it above
                        jQuery.event.triggered = type;
                        try {
                            elem[type]();
                        } catch (e) {
                            // IE<9 dies on focus/blur to hidden element (#1486,#12518)
                            // only reproducible on winXP IE8 native, not IE9 in IE8 mode
                        }
                        jQuery.event.triggered = undefined;

                        if (tmp) {
                            elem[ontype] = tmp;
                        }
                    }
                }
            }

            return event.result;
        },

        dispatch: function (event) {

            // Make a writable jQuery.Event from the native event object
            event = jQuery.event.fix(event);

            var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = core_slice.call(arguments),
			handlers = (jQuery._data(this, "events") || {})[event.type] || [],
			special = jQuery.event.special[event.type] || {};

            // Use the fix-ed jQuery.Event rather than the (read-only) native event
            args[0] = event;
            event.delegateTarget = this;

            // Call the preDispatch hook for the mapped type, and let it bail if desired
            if (special.preDispatch && special.preDispatch.call(this, event) === false) {
                return;
            }

            // Determine handlers
            handlerQueue = jQuery.event.handlers.call(this, event, handlers);

            // Run delegates first; they may want to stop propagation beneath us
            i = 0;
            while ((matched = handlerQueue[i++]) && !event.isPropagationStopped()) {
                event.currentTarget = matched.elem;

                j = 0;
                while ((handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped()) {

                    // Triggered event must either 1) have no namespace, or
                    // 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
                    if (!event.namespace_re || event.namespace_re.test(handleObj.namespace)) {

                        event.handleObj = handleObj;
                        event.data = handleObj.data;

                        ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler)
							.apply(matched.elem, args);

                        if (ret !== undefined) {
                            if ((event.result = ret) === false) {
                                event.preventDefault();
                                event.stopPropagation();
                            }
                        }
                    }
                }
            }

            // Call the postDispatch hook for the mapped type
            if (special.postDispatch) {
                special.postDispatch.call(this, event);
            }

            return event.result;
        },

        handlers: function (event, handlers) {
            var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

            // Find delegate handlers
            // Black-hole SVG <use> instance trees (#13180)
            // Avoid non-left-click bubbling in Firefox (#3861)
            if (delegateCount && cur.nodeType && (!event.button || event.type !== "click")) {

                /* jshint eqeqeq: false */
                for (; cur != this; cur = cur.parentNode || this) {
                    /* jshint eqeqeq: true */

                    // Don't check non-elements (#13208)
                    // Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
                    if (cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click")) {
                        matches = [];
                        for (i = 0; i < delegateCount; i++) {
                            handleObj = handlers[i];

                            // Don't conflict with Object.prototype properties (#13203)
                            sel = handleObj.selector + " ";

                            if (matches[sel] === undefined) {
                                matches[sel] = handleObj.needsContext ?
								jQuery(sel, this).index(cur) >= 0 :
								jQuery.find(sel, this, null, [cur]).length;
                            }
                            if (matches[sel]) {
                                matches.push(handleObj);
                            }
                        }
                        if (matches.length) {
                            handlerQueue.push({ elem: cur, handlers: matches });
                        }
                    }
                }
            }

            // Add the remaining (directly-bound) handlers
            if (delegateCount < handlers.length) {
                handlerQueue.push({ elem: this, handlers: handlers.slice(delegateCount) });
            }

            return handlerQueue;
        },

        fix: function (event) {
            if (event[jQuery.expando]) {
                return event;
            }

            // Create a writable copy of the event object and normalize some properties
            var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[type];

            if (!fixHook) {
                this.fixHooks[type] = fixHook =
				rmouseEvent.test(type) ? this.mouseHooks :
				rkeyEvent.test(type) ? this.keyHooks :
				{};
            }
            copy = fixHook.props ? this.props.concat(fixHook.props) : this.props;

            event = new jQuery.Event(originalEvent);

            i = copy.length;
            while (i--) {
                prop = copy[i];
                event[prop] = originalEvent[prop];
            }

            // Support: IE<9
            // Fix target property (#1925)
            if (!event.target) {
                event.target = originalEvent.srcElement || document;
            }

            // Support: Chrome 23+, Safari?
            // Target should not be a text node (#504, #13143)
            if (event.target.nodeType === 3) {
                event.target = event.target.parentNode;
            }

            // Support: IE<9
            // For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
            event.metaKey = !!event.metaKey;

            return fixHook.filter ? fixHook.filter(event, originalEvent) : event;
        },

        // Includes some event props shared by KeyEvent and MouseEvent
        props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

        fixHooks: {},

        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function (event, original) {

                // Add which for key events
                if (event.which == null) {
                    event.which = original.charCode != null ? original.charCode : original.keyCode;
                }

                return event;
            }
        },

        mouseHooks: {
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function (event, original) {
                var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

                // Calculate pageX/Y if missing and clientX/Y available
                if (event.pageX == null && original.clientX != null) {
                    eventDoc = event.target.ownerDocument || document;
                    doc = eventDoc.documentElement;
                    body = eventDoc.body;

                    event.pageX = original.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
                    event.pageY = original.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
                }

                // Add relatedTarget, if necessary
                if (!event.relatedTarget && fromElement) {
                    event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
                }

                // Add which for click: 1 === left; 2 === middle; 3 === right
                // Note: button is not normalized, so don't use it
                if (!event.which && button !== undefined) {
                    event.which = (button & 1 ? 1 : (button & 2 ? 3 : (button & 4 ? 2 : 0)));
                }

                return event;
            }
        },

        special: {
            load: {
                // Prevent triggered image.load events from bubbling to window.load
                noBubble: true
            },
            focus: {
                // Fire native event if possible so blur/focus sequence is correct
                trigger: function () {
                    if (this !== safeActiveElement() && this.focus) {
                        try {
                            this.focus();
                            return false;
                        } catch (e) {
                            // Support: IE<9
                            // If we error on focus to hidden element (#1486, #12518),
                            // let .trigger() run the handlers
                        }
                    }
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function () {
                    if (this === safeActiveElement() && this.blur) {
                        this.blur();
                        return false;
                    }
                },
                delegateType: "focusout"
            },
            click: {
                // For checkbox, fire native event so checked state will be right
                trigger: function () {
                    if (jQuery.nodeName(this, "input") && this.type === "checkbox" && this.click) {
                        this.click();
                        return false;
                    }
                },

                // For cross-browser consistency, don't fire native .click() on links
                _default: function (event) {
                    return jQuery.nodeName(event.target, "a");
                }
            },

            beforeunload: {
                postDispatch: function (event) {

                    // Even when returnValue equals to undefined Firefox will still show alert
                    if (event.result !== undefined) {
                        event.originalEvent.returnValue = event.result;
                    }
                }
            }
        },

        simulate: function (type, elem, event, bubble) {
            // Piggyback on a donor event to simulate a different one.
            // Fake originalEvent to avoid donor's stopPropagation, but if the
            // simulated event prevents default then we do the same on the donor.
            var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
			    type: type,
			    isSimulated: true,
			    originalEvent: {}
			}
		);
            if (bubble) {
                jQuery.event.trigger(e, null, elem);
            } else {
                jQuery.event.dispatch.call(elem, e);
            }
            if (e.isDefaultPrevented()) {
                event.preventDefault();
            }
        }
    };

    jQuery.removeEvent = document.removeEventListener ?
	function (elem, type, handle) {
	    if (elem.removeEventListener) {
	        elem.removeEventListener(type, handle, false);
	    }
	} :
	function (elem, type, handle) {
	    var name = "on" + type;

	    if (elem.detachEvent) {

	        // #8545, #7054, preventing memory leaks for custom events in IE6-8
	        // detachEvent needed property on element, by name of that event, to properly expose it to GC
	        if (typeof elem[name] === core_strundefined) {
	            elem[name] = null;
	        }

	        elem.detachEvent(name, handle);
	    }
	};

    jQuery.Event = function (src, props) {
        // Allow instantiation without the 'new' keyword
        if (!(this instanceof jQuery.Event)) {
            return new jQuery.Event(src, props);
        }

        // Event object
        if (src && src.type) {
            this.originalEvent = src;
            this.type = src.type;

            // Events bubbling up the document may have been marked as prevented
            // by a handler lower down the tree; reflect the correct value.
            this.isDefaultPrevented = (src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault()) ? returnTrue : returnFalse;

            // Event type
        } else {
            this.type = src;
        }

        // Put explicitly provided properties onto the event object
        if (props) {
            jQuery.extend(this, props);
        }

        // Create a timestamp if incoming event doesn't have one
        this.timeStamp = src && src.timeStamp || jQuery.now();

        // Mark it as fixed
        this[jQuery.expando] = true;
    };

    // jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
    // http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
    jQuery.Event.prototype = {
        isDefaultPrevented: returnFalse,
        isPropagationStopped: returnFalse,
        isImmediatePropagationStopped: returnFalse,

        preventDefault: function () {
            var e = this.originalEvent;

            this.isDefaultPrevented = returnTrue;
            if (!e) {
                return;
            }

            // If preventDefault exists, run it on the original event
            if (e.preventDefault) {
                e.preventDefault();

                // Support: IE
                // Otherwise set the returnValue property of the original event to false
            } else {
                e.returnValue = false;
            }
        },
        stopPropagation: function () {
            var e = this.originalEvent;

            this.isPropagationStopped = returnTrue;
            if (!e) {
                return;
            }
            // If stopPropagation exists, run it on the original event
            if (e.stopPropagation) {
                e.stopPropagation();
            }

            // Support: IE
            // Set the cancelBubble property of the original event to true
            e.cancelBubble = true;
        },
        stopImmediatePropagation: function () {
            this.isImmediatePropagationStopped = returnTrue;
            this.stopPropagation();
        }
    };

    // Create mouseenter/leave events using mouseover/out and event-time checks
    jQuery.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout"
    }, function (orig, fix) {
        jQuery.event.special[orig] = {
            delegateType: fix,
            bindType: fix,

            handle: function (event) {
                var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

                // For mousenter/leave call the handler if related is outside the target.
                // NB: No relatedTarget if the mouse left/entered the browser window
                if (!related || (related !== target && !jQuery.contains(target, related))) {
                    event.type = handleObj.origType;
                    ret = handleObj.handler.apply(this, arguments);
                    event.type = fix;
                }
                return ret;
            }
        };
    });

    // IE submit delegation
    if (!jQuery.support.submitBubbles) {

        jQuery.event.special.submit = {
            setup: function () {
                // Only need this for delegated form submit events
                if (jQuery.nodeName(this, "form")) {
                    return false;
                }

                // Lazy-add a submit handler when a descendant form may potentially be submitted
                jQuery.event.add(this, "click._submit keypress._submit", function (e) {
                    // Node name check avoids a VML-related crash in IE (#9807)
                    var elem = e.target,
					form = jQuery.nodeName(elem, "input") || jQuery.nodeName(elem, "button") ? elem.form : undefined;
                    if (form && !jQuery._data(form, "submitBubbles")) {
                        jQuery.event.add(form, "submit._submit", function (event) {
                            event._submit_bubble = true;
                        });
                        jQuery._data(form, "submitBubbles", true);
                    }
                });
                // return undefined since we don't need an event listener
            },

            postDispatch: function (event) {
                // If form was submitted by the user, bubble the event up the tree
                if (event._submit_bubble) {
                    delete event._submit_bubble;
                    if (this.parentNode && !event.isTrigger) {
                        jQuery.event.simulate("submit", this.parentNode, event, true);
                    }
                }
            },

            teardown: function () {
                // Only need this for delegated form submit events
                if (jQuery.nodeName(this, "form")) {
                    return false;
                }

                // Remove delegated handlers; cleanData eventually reaps submit handlers attached above
                jQuery.event.remove(this, "._submit");
            }
        };
    }

    // IE change delegation and checkbox/radio fix
    if (!jQuery.support.changeBubbles) {

        jQuery.event.special.change = {

            setup: function () {

                if (rformElems.test(this.nodeName)) {
                    // IE doesn't fire change on a check/radio until blur; trigger it on click
                    // after a propertychange. Eat the blur-change in special.change.handle.
                    // This still fires onchange a second time for check/radio after blur.
                    if (this.type === "checkbox" || this.type === "radio") {
                        jQuery.event.add(this, "propertychange._change", function (event) {
                            if (event.originalEvent.propertyName === "checked") {
                                this._just_changed = true;
                            }
                        });
                        jQuery.event.add(this, "click._change", function (event) {
                            if (this._just_changed && !event.isTrigger) {
                                this._just_changed = false;
                            }
                            // Allow triggered, simulated change events (#11500)
                            jQuery.event.simulate("change", this, event, true);
                        });
                    }
                    return false;
                }
                // Delegated event; lazy-add a change handler on descendant inputs
                jQuery.event.add(this, "beforeactivate._change", function (e) {
                    var elem = e.target;

                    if (rformElems.test(elem.nodeName) && !jQuery._data(elem, "changeBubbles")) {
                        jQuery.event.add(elem, "change._change", function (event) {
                            if (this.parentNode && !event.isSimulated && !event.isTrigger) {
                                jQuery.event.simulate("change", this.parentNode, event, true);
                            }
                        });
                        jQuery._data(elem, "changeBubbles", true);
                    }
                });
            },

            handle: function (event) {
                var elem = event.target;

                // Swallow native change events from checkbox/radio, we already triggered them above
                if (this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox")) {
                    return event.handleObj.handler.apply(this, arguments);
                }
            },

            teardown: function () {
                jQuery.event.remove(this, "._change");

                return !rformElems.test(this.nodeName);
            }
        };
    }

    // Create "bubbling" focus and blur events
    if (!jQuery.support.focusinBubbles) {
        jQuery.each({ focus: "focusin", blur: "focusout" }, function (orig, fix) {

            // Attach a single capturing handler while someone wants focusin/focusout
            var attaches = 0,
			handler = function (event) {
			    jQuery.event.simulate(fix, event.target, jQuery.event.fix(event), true);
			};

            jQuery.event.special[fix] = {
                setup: function () {
                    if (attaches++ === 0) {
                        document.addEventListener(orig, handler, true);
                    }
                },
                teardown: function () {
                    if (--attaches === 0) {
                        document.removeEventListener(orig, handler, true);
                    }
                }
            };
        });
    }

    jQuery.fn.extend({

        on: function (types, selector, data, fn, /*INTERNAL*/one) {
            var type, origFn;

            // Types can be a map of types/handlers
            if (typeof types === "object") {
                // ( types-Object, selector, data )
                if (typeof selector !== "string") {
                    // ( types-Object, data )
                    data = data || selector;
                    selector = undefined;
                }
                for (type in types) {
                    this.on(type, selector, data, types[type], one);
                }
                return this;
            }

            if (data == null && fn == null) {
                // ( types, fn )
                fn = selector;
                data = selector = undefined;
            } else if (fn == null) {
                if (typeof selector === "string") {
                    // ( types, selector, fn )
                    fn = data;
                    data = undefined;
                } else {
                    // ( types, data, fn )
                    fn = data;
                    data = selector;
                    selector = undefined;
                }
            }
            if (fn === false) {
                fn = returnFalse;
            } else if (!fn) {
                return this;
            }

            if (one === 1) {
                origFn = fn;
                fn = function (event) {
                    // Can use an empty set, since event contains the info
                    jQuery().off(event);
                    return origFn.apply(this, arguments);
                };
                // Use same guid so caller can remove using origFn
                fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
            }
            return this.each(function () {
                jQuery.event.add(this, types, fn, data, selector);
            });
        },
        one: function (types, selector, data, fn) {
            return this.on(types, selector, data, fn, 1);
        },
        off: function (types, selector, fn) {
            var handleObj, type;
            if (types && types.preventDefault && types.handleObj) {
                // ( event )  dispatched jQuery.Event
                handleObj = types.handleObj;
                jQuery(types.delegateTarget).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
                return this;
            }
            if (typeof types === "object") {
                // ( types-object [, selector] )
                for (type in types) {
                    this.off(type, selector, types[type]);
                }
                return this;
            }
            if (selector === false || typeof selector === "function") {
                // ( types [, fn] )
                fn = selector;
                selector = undefined;
            }
            if (fn === false) {
                fn = returnFalse;
            }
            return this.each(function () {
                jQuery.event.remove(this, types, fn, selector);
            });
        },

        trigger: function (type, data) {
            return this.each(function () {
                jQuery.event.trigger(type, data, this);
            });
        },
        triggerHandler: function (type, data) {
            var elem = this[0];
            if (elem) {
                return jQuery.event.trigger(type, data, elem, true);
            }
        }
    });
    var isSimple = /^.[^:#\[\.,]*$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	rneedsContext = jQuery.expr.match.needsContext,
    // methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
	    children: true,
	    contents: true,
	    next: true,
	    prev: true
	};

    jQuery.fn.extend({
        find: function (selector) {
            var i,
			ret = [],
			self = this,
			len = self.length;

            if (typeof selector !== "string") {
                return this.pushStack(jQuery(selector).filter(function () {
                    for (i = 0; i < len; i++) {
                        if (jQuery.contains(self[i], this)) {
                            return true;
                        }
                    }
                }));
            }

            for (i = 0; i < len; i++) {
                jQuery.find(selector, self[i], ret);
            }

            // Needed because $( selector, context ) becomes $( context ).find( selector )
            ret = this.pushStack(len > 1 ? jQuery.unique(ret) : ret);
            ret.selector = this.selector ? this.selector + " " + selector : selector;
            return ret;
        },

        has: function (target) {
            var i,
			targets = jQuery(target, this),
			len = targets.length;

            return this.filter(function () {
                for (i = 0; i < len; i++) {
                    if (jQuery.contains(this, targets[i])) {
                        return true;
                    }
                }
            });
        },

        not: function (selector) {
            return this.pushStack(winnow(this, selector || [], true));
        },

        filter: function (selector) {
            return this.pushStack(winnow(this, selector || [], false));
        },

        is: function (selector) {
            return !!winnow(
			this,

            // If this is a positional/relative selector, check membership in the returned set
            // so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test(selector) ?
				jQuery(selector) :
				selector || [],
			false
		).length;
        },

        closest: function (selectors, context) {
            var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test(selectors) || typeof selectors !== "string" ?
				jQuery(selectors, context || this.context) :
				0;

            for (; i < l; i++) {
                for (cur = this[i]; cur && cur !== context; cur = cur.parentNode) {
                    // Always skip document fragments
                    if (cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

                    // Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors))) {

                        cur = ret.push(cur);
                        break;
                    }
                }
            }

            return this.pushStack(ret.length > 1 ? jQuery.unique(ret) : ret);
        },

        // Determine the position of an element within
        // the matched set of elements
        index: function (elem) {

            // No argument, return index in parent
            if (!elem) {
                return (this[0] && this[0].parentNode) ? this.first().prevAll().length : -1;
            }

            // index in selector
            if (typeof elem === "string") {
                return jQuery.inArray(this[0], jQuery(elem));
            }

            // Locate the position of the desired element
            return jQuery.inArray(
            // If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this);
        },

        add: function (selector, context) {
            var set = typeof selector === "string" ?
				jQuery(selector, context) :
				jQuery.makeArray(selector && selector.nodeType ? [selector] : selector),
			all = jQuery.merge(this.get(), set);

            return this.pushStack(jQuery.unique(all));
        },

        addBack: function (selector) {
            return this.add(selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
        }
    });

    function sibling(cur, dir) {
        do {
            cur = cur[dir];
        } while (cur && cur.nodeType !== 1);

        return cur;
    }

    jQuery.each({
        parent: function (elem) {
            var parent = elem.parentNode;
            return parent && parent.nodeType !== 11 ? parent : null;
        },
        parents: function (elem) {
            return jQuery.dir(elem, "parentNode");
        },
        parentsUntil: function (elem, i, until) {
            return jQuery.dir(elem, "parentNode", until);
        },
        next: function (elem) {
            return sibling(elem, "nextSibling");
        },
        prev: function (elem) {
            return sibling(elem, "previousSibling");
        },
        nextAll: function (elem) {
            return jQuery.dir(elem, "nextSibling");
        },
        prevAll: function (elem) {
            return jQuery.dir(elem, "previousSibling");
        },
        nextUntil: function (elem, i, until) {
            return jQuery.dir(elem, "nextSibling", until);
        },
        prevUntil: function (elem, i, until) {
            return jQuery.dir(elem, "previousSibling", until);
        },
        siblings: function (elem) {
            return jQuery.sibling((elem.parentNode || {}).firstChild, elem);
        },
        children: function (elem) {
            return jQuery.sibling(elem.firstChild);
        },
        contents: function (elem) {
            return jQuery.nodeName(elem, "iframe") ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge([], elem.childNodes);
        }
    }, function (name, fn) {
        jQuery.fn[name] = function (until, selector) {
            var ret = jQuery.map(this, fn, until);

            if (name.slice(-5) !== "Until") {
                selector = until;
            }

            if (selector && typeof selector === "string") {
                ret = jQuery.filter(selector, ret);
            }

            if (this.length > 1) {
                // Remove duplicates
                if (!guaranteedUnique[name]) {
                    ret = jQuery.unique(ret);
                }

                // Reverse order for parents* and prev-derivatives
                if (rparentsprev.test(name)) {
                    ret = ret.reverse();
                }
            }

            return this.pushStack(ret);
        };
    });

    jQuery.extend({
        filter: function (expr, elems, not) {
            var elem = elems[0];

            if (not) {
                expr = ":not(" + expr + ")";
            }

            return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector(elem, expr) ? [elem] : [] :
			jQuery.find.matches(expr, jQuery.grep(elems, function (elem) {
			    return elem.nodeType === 1;
			}));
        },

        dir: function (elem, dir, until) {
            var matched = [],
			cur = elem[dir];

            while (cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery(cur).is(until))) {
                if (cur.nodeType === 1) {
                    matched.push(cur);
                }
                cur = cur[dir];
            }
            return matched;
        },

        sibling: function (n, elem) {
            var r = [];

            for (; n; n = n.nextSibling) {
                if (n.nodeType === 1 && n !== elem) {
                    r.push(n);
                }
            }

            return r;
        }
    });

    // Implement the identical functionality for filter and not
    function winnow(elements, qualifier, not) {
        if (jQuery.isFunction(qualifier)) {
            return jQuery.grep(elements, function (elem, i) {
                /* jshint -W018 */
                return !!qualifier.call(elem, i, elem) !== not;
            });

        }

        if (qualifier.nodeType) {
            return jQuery.grep(elements, function (elem) {
                return (elem === qualifier) !== not;
            });

        }

        if (typeof qualifier === "string") {
            if (isSimple.test(qualifier)) {
                return jQuery.filter(qualifier, elements, not);
            }

            qualifier = jQuery.filter(qualifier, elements);
        }

        return jQuery.grep(elements, function (elem) {
            return (jQuery.inArray(elem, qualifier) >= 0) !== not;
        });
    }
    function createSafeFragment(document) {
        var list = nodeNames.split("|"),
		safeFrag = document.createDocumentFragment();

        if (safeFrag.createElement) {
            while (list.length) {
                safeFrag.createElement(
				list.pop()
			);
            }
        }
        return safeFrag;
    }

    var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
    // checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

    // We have to close these tags to support XHTML (#13200)
	wrapMap = {
	    option: [1, "<select multiple='multiple'>", "</select>"],
	    legend: [1, "<fieldset>", "</fieldset>"],
	    area: [1, "<map>", "</map>"],
	    param: [1, "<object>", "</object>"],
	    thead: [1, "<table>", "</table>"],
	    tr: [2, "<table><tbody>", "</tbody></table>"],
	    col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
	    td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],

	    // IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
	    // unless wrapped in a div with non-breaking characters in front of it.
	    _default: jQuery.support.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
	},
	safeFragment = createSafeFragment(document),
	fragmentDiv = safeFragment.appendChild(document.createElement("div"));

    wrapMap.optgroup = wrapMap.option;
    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
    wrapMap.th = wrapMap.td;

    jQuery.fn.extend({
        text: function (value) {
            return jQuery.access(this, function (value) {
                return value === undefined ?
				jQuery.text(this) :
				this.empty().append((this[0] && this[0].ownerDocument || document).createTextNode(value));
            }, null, value, arguments.length);
        },

        append: function () {
            return this.domManip(arguments, function (elem) {
                if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                    var target = manipulationTarget(this, elem);
                    target.appendChild(elem);
                }
            });
        },

        prepend: function () {
            return this.domManip(arguments, function (elem) {
                if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                    var target = manipulationTarget(this, elem);
                    target.insertBefore(elem, target.firstChild);
                }
            });
        },

        before: function () {
            return this.domManip(arguments, function (elem) {
                if (this.parentNode) {
                    this.parentNode.insertBefore(elem, this);
                }
            });
        },

        after: function () {
            return this.domManip(arguments, function (elem) {
                if (this.parentNode) {
                    this.parentNode.insertBefore(elem, this.nextSibling);
                }
            });
        },

        // keepData is for internal use only--do not document
        remove: function (selector, keepData) {
            var elem,
			elems = selector ? jQuery.filter(selector, this) : this,
			i = 0;

            for (; (elem = elems[i]) != null; i++) {

                if (!keepData && elem.nodeType === 1) {
                    jQuery.cleanData(getAll(elem));
                }

                if (elem.parentNode) {
                    if (keepData && jQuery.contains(elem.ownerDocument, elem)) {
                        setGlobalEval(getAll(elem, "script"));
                    }
                    elem.parentNode.removeChild(elem);
                }
            }

            return this;
        },

        empty: function () {
            var elem,
			i = 0;

            for (; (elem = this[i]) != null; i++) {
                // Remove element nodes and prevent memory leaks
                if (elem.nodeType === 1) {
                    jQuery.cleanData(getAll(elem, false));
                }

                // Remove any remaining nodes
                while (elem.firstChild) {
                    elem.removeChild(elem.firstChild);
                }

                // If this is a select, ensure that it displays empty (#12336)
                // Support: IE<9
                if (elem.options && jQuery.nodeName(elem, "select")) {
                    elem.options.length = 0;
                }
            }

            return this;
        },

        clone: function (dataAndEvents, deepDataAndEvents) {
            dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
            deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

            return this.map(function () {
                return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
            });
        },

        html: function (value) {
            return jQuery.access(this, function (value) {
                var elem = this[0] || {},
				i = 0,
				l = this.length;

                if (value === undefined) {
                    return elem.nodeType === 1 ?
					elem.innerHTML.replace(rinlinejQuery, "") :
					undefined;
                }

                // See if we can take a shortcut and just use innerHTML
                if (typeof value === "string" && !rnoInnerhtml.test(value) &&
				(jQuery.support.htmlSerialize || !rnoshimcache.test(value)) &&
				(jQuery.support.leadingWhitespace || !rleadingWhitespace.test(value)) &&
				!wrapMap[(rtagName.exec(value) || ["", ""])[1].toLowerCase()]) {

                    value = value.replace(rxhtmlTag, "<$1></$2>");

                    try {
                        for (; i < l; i++) {
                            // Remove element nodes and prevent memory leaks
                            elem = this[i] || {};
                            if (elem.nodeType === 1) {
                                jQuery.cleanData(getAll(elem, false));
                                elem.innerHTML = value;
                            }
                        }

                        elem = 0;

                        // If using innerHTML throws an exception, use the fallback method
                    } catch (e) { }
                }

                if (elem) {
                    this.empty().append(value);
                }
            }, null, value, arguments.length);
        },

        replaceWith: function () {
            var 
            // Snapshot the DOM in case .domManip sweeps something relevant into its fragment
			args = jQuery.map(this, function (elem) {
			    return [elem.nextSibling, elem.parentNode];
			}),
			i = 0;

            // Make the changes, replacing each context element with the new content
            this.domManip(arguments, function (elem) {
                var next = args[i++],
				parent = args[i++];

                if (parent) {
                    // Don't use the snapshot next if it has moved (#13810)
                    if (next && next.parentNode !== parent) {
                        next = this.nextSibling;
                    }
                    jQuery(this).remove();
                    parent.insertBefore(elem, next);
                }
                // Allow new content to include elements from the context set
            }, true);

            // Force removal if there was no new content (e.g., from empty arguments)
            return i ? this : this.remove();
        },

        detach: function (selector) {
            return this.remove(selector, true);
        },

        domManip: function (args, callback, allowIntersection) {

            // Flatten any nested arrays
            args = core_concat.apply([], args);

            var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction(value);

            // We can't cloneNode fragments that contain checked, in WebKit
            if (isFunction || !(l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test(value))) {
                return this.each(function (index) {
                    var self = set.eq(index);
                    if (isFunction) {
                        args[0] = value.call(this, index, self.html());
                    }
                    self.domManip(args, callback, allowIntersection);
                });
            }

            if (l) {
                fragment = jQuery.buildFragment(args, this[0].ownerDocument, false, !allowIntersection && this);
                first = fragment.firstChild;

                if (fragment.childNodes.length === 1) {
                    fragment = first;
                }

                if (first) {
                    scripts = jQuery.map(getAll(fragment, "script"), disableScript);
                    hasScripts = scripts.length;

                    // Use the original fragment for the last item instead of the first because it can end up
                    // being emptied incorrectly in certain situations (#8070).
                    for (; i < l; i++) {
                        node = fragment;

                        if (i !== iNoClone) {
                            node = jQuery.clone(node, true, true);

                            // Keep references to cloned scripts for later restoration
                            if (hasScripts) {
                                jQuery.merge(scripts, getAll(node, "script"));
                            }
                        }

                        callback.call(this[i], node, i);
                    }

                    if (hasScripts) {
                        doc = scripts[scripts.length - 1].ownerDocument;

                        // Reenable scripts
                        jQuery.map(scripts, restoreScript);

                        // Evaluate executable scripts on first document insertion
                        for (i = 0; i < hasScripts; i++) {
                            node = scripts[i];
                            if (rscriptType.test(node.type || "") &&
							!jQuery._data(node, "globalEval") && jQuery.contains(doc, node)) {

                                if (node.src) {
                                    // Hope ajax is available...
                                    jQuery._evalUrl(node.src);
                                } else {
                                    jQuery.globalEval((node.text || node.textContent || node.innerHTML || "").replace(rcleanScript, ""));
                                }
                            }
                        }
                    }

                    // Fix #11809: Avoid leaking memory
                    fragment = first = null;
                }
            }

            return this;
        }
    });

    // Support: IE<8
    // Manipulating tables requires a tbody
    function manipulationTarget(elem, content) {
        return jQuery.nodeName(elem, "table") &&
		jQuery.nodeName(content.nodeType === 1 ? content : content.firstChild, "tr") ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild(elem.ownerDocument.createElement("tbody")) :
		elem;
    }

    // Replace/restore the type attribute of script elements for safe DOM manipulation
    function disableScript(elem) {
        elem.type = (jQuery.find.attr(elem, "type") !== null) + "/" + elem.type;
        return elem;
    }
    function restoreScript(elem) {
        var match = rscriptTypeMasked.exec(elem.type);
        if (match) {
            elem.type = match[1];
        } else {
            elem.removeAttribute("type");
        }
        return elem;
    }

    // Mark scripts as having already been evaluated
    function setGlobalEval(elems, refElements) {
        var elem,
		i = 0;
        for (; (elem = elems[i]) != null; i++) {
            jQuery._data(elem, "globalEval", !refElements || jQuery._data(refElements[i], "globalEval"));
        }
    }

    function cloneCopyEvent(src, dest) {

        if (dest.nodeType !== 1 || !jQuery.hasData(src)) {
            return;
        }

        var type, i, l,
		oldData = jQuery._data(src),
		curData = jQuery._data(dest, oldData),
		events = oldData.events;

        if (events) {
            delete curData.handle;
            curData.events = {};

            for (type in events) {
                for (i = 0, l = events[type].length; i < l; i++) {
                    jQuery.event.add(dest, type, events[type][i]);
                }
            }
        }

        // make the cloned public data object a copy from the original
        if (curData.data) {
            curData.data = jQuery.extend({}, curData.data);
        }
    }

    function fixCloneNodeIssues(src, dest) {
        var nodeName, e, data;

        // We do not need to do anything for non-Elements
        if (dest.nodeType !== 1) {
            return;
        }

        nodeName = dest.nodeName.toLowerCase();

        // IE6-8 copies events bound via attachEvent when using cloneNode.
        if (!jQuery.support.noCloneEvent && dest[jQuery.expando]) {
            data = jQuery._data(dest);

            for (e in data.events) {
                jQuery.removeEvent(dest, e, data.handle);
            }

            // Event data gets referenced instead of copied if the expando gets copied too
            dest.removeAttribute(jQuery.expando);
        }

        // IE blanks contents when cloning scripts, and tries to evaluate newly-set text
        if (nodeName === "script" && dest.text !== src.text) {
            disableScript(dest).text = src.text;
            restoreScript(dest);

            // IE6-10 improperly clones children of object elements using classid.
            // IE10 throws NoModificationAllowedError if parent is null, #12132.
        } else if (nodeName === "object") {
            if (dest.parentNode) {
                dest.outerHTML = src.outerHTML;
            }

            // This path appears unavoidable for IE9. When cloning an object
            // element in IE9, the outerHTML strategy above is not sufficient.
            // If the src has innerHTML and the destination does not,
            // copy the src.innerHTML into the dest.innerHTML. #10324
            if (jQuery.support.html5Clone && (src.innerHTML && !jQuery.trim(dest.innerHTML))) {
                dest.innerHTML = src.innerHTML;
            }

        } else if (nodeName === "input" && manipulation_rcheckableType.test(src.type)) {
            // IE6-8 fails to persist the checked state of a cloned checkbox
            // or radio button. Worse, IE6-7 fail to give the cloned element
            // a checked appearance if the defaultChecked value isn't also set

            dest.defaultChecked = dest.checked = src.checked;

            // IE6-7 get confused and end up setting the value of a cloned
            // checkbox/radio button to an empty string instead of "on"
            if (dest.value !== src.value) {
                dest.value = src.value;
            }

            // IE6-8 fails to return the selected option to the default selected
            // state when cloning options
        } else if (nodeName === "option") {
            dest.defaultSelected = dest.selected = src.defaultSelected;

            // IE6-8 fails to set the defaultValue to the correct value when
            // cloning other types of input fields
        } else if (nodeName === "input" || nodeName === "textarea") {
            dest.defaultValue = src.defaultValue;
        }
    }

    jQuery.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function (name, original) {
        jQuery.fn[name] = function (selector) {
            var elems,
			i = 0,
			ret = [],
			insert = jQuery(selector),
			last = insert.length - 1;

            for (; i <= last; i++) {
                elems = i === last ? this : this.clone(true);
                jQuery(insert[i])[original](elems);

                // Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
                core_push.apply(ret, elems.get());
            }

            return this.pushStack(ret);
        };
    });

    function getAll(context, tag) {
        var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName(tag || "*") :
			typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll(tag || "*") :
			undefined;

        if (!found) {
            for (found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++) {
                if (!tag || jQuery.nodeName(elem, tag)) {
                    found.push(elem);
                } else {
                    jQuery.merge(found, getAll(elem, tag));
                }
            }
        }

        return tag === undefined || tag && jQuery.nodeName(context, tag) ?
		jQuery.merge([context], found) :
		found;
    }

    // Used in buildFragment, fixes the defaultChecked property
    function fixDefaultChecked(elem) {
        if (manipulation_rcheckableType.test(elem.type)) {
            elem.defaultChecked = elem.checked;
        }
    }

    jQuery.extend({
        clone: function (elem, dataAndEvents, deepDataAndEvents) {
            var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains(elem.ownerDocument, elem);

            if (jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test("<" + elem.nodeName + ">")) {
                clone = elem.cloneNode(true);

                // IE<=8 does not properly clone detached, unknown element nodes
            } else {
                fragmentDiv.innerHTML = elem.outerHTML;
                fragmentDiv.removeChild(clone = fragmentDiv.firstChild);
            }

            if ((!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem)) {

                // We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
                destElements = getAll(clone);
                srcElements = getAll(elem);

                // Fix all IE cloning issues
                for (i = 0; (node = srcElements[i]) != null; ++i) {
                    // Ensure that the destination node is not null; Fixes #9587
                    if (destElements[i]) {
                        fixCloneNodeIssues(node, destElements[i]);
                    }
                }
            }

            // Copy the events from the original to the clone
            if (dataAndEvents) {
                if (deepDataAndEvents) {
                    srcElements = srcElements || getAll(elem);
                    destElements = destElements || getAll(clone);

                    for (i = 0; (node = srcElements[i]) != null; i++) {
                        cloneCopyEvent(node, destElements[i]);
                    }
                } else {
                    cloneCopyEvent(elem, clone);
                }
            }

            // Preserve script evaluation history
            destElements = getAll(clone, "script");
            if (destElements.length > 0) {
                setGlobalEval(destElements, !inPage && getAll(elem, "script"));
            }

            destElements = srcElements = node = null;

            // Return the cloned set
            return clone;
        },

        buildFragment: function (elems, context, scripts, selection) {
            var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

            // Ensure a safe fragment
			safe = createSafeFragment(context),

			nodes = [],
			i = 0;

            for (; i < l; i++) {
                elem = elems[i];

                if (elem || elem === 0) {

                    // Add nodes directly
                    if (jQuery.type(elem) === "object") {
                        jQuery.merge(nodes, elem.nodeType ? [elem] : elem);

                        // Convert non-html into a text node
                    } else if (!rhtml.test(elem)) {
                        nodes.push(context.createTextNode(elem));

                        // Convert html into DOM nodes
                    } else {
                        tmp = tmp || safe.appendChild(context.createElement("div"));

                        // Deserialize a standard representation
                        tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
                        wrap = wrapMap[tag] || wrapMap._default;

                        tmp.innerHTML = wrap[1] + elem.replace(rxhtmlTag, "<$1></$2>") + wrap[2];

                        // Descend through wrappers to the right content
                        j = wrap[0];
                        while (j--) {
                            tmp = tmp.lastChild;
                        }

                        // Manually add leading whitespace removed by IE
                        if (!jQuery.support.leadingWhitespace && rleadingWhitespace.test(elem)) {
                            nodes.push(context.createTextNode(rleadingWhitespace.exec(elem)[0]));
                        }

                        // Remove IE's autoinserted <tbody> from table fragments
                        if (!jQuery.support.tbody) {

                            // String was a <table>, *may* have spurious <tbody>
                            elem = tag === "table" && !rtbody.test(elem) ?
							tmp.firstChild :

                            // String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test(elem) ?
								tmp :
								0;

                            j = elem && elem.childNodes.length;
                            while (j--) {
                                if (jQuery.nodeName((tbody = elem.childNodes[j]), "tbody") && !tbody.childNodes.length) {
                                    elem.removeChild(tbody);
                                }
                            }
                        }

                        jQuery.merge(nodes, tmp.childNodes);

                        // Fix #12392 for WebKit and IE > 9
                        tmp.textContent = "";

                        // Fix #12392 for oldIE
                        while (tmp.firstChild) {
                            tmp.removeChild(tmp.firstChild);
                        }

                        // Remember the top-level container for proper cleanup
                        tmp = safe.lastChild;
                    }
                }
            }

            // Fix #11356: Clear elements from fragment
            if (tmp) {
                safe.removeChild(tmp);
            }

            // Reset defaultChecked for any radios and checkboxes
            // about to be appended to the DOM in IE 6/7 (#8060)
            if (!jQuery.support.appendChecked) {
                jQuery.grep(getAll(nodes, "input"), fixDefaultChecked);
            }

            i = 0;
            while ((elem = nodes[i++])) {

                // #4087 - If origin and destination elements are the same, and this is
                // that element, do not do anything
                if (selection && jQuery.inArray(elem, selection) !== -1) {
                    continue;
                }

                contains = jQuery.contains(elem.ownerDocument, elem);

                // Append to fragment
                tmp = getAll(safe.appendChild(elem), "script");

                // Preserve script evaluation history
                if (contains) {
                    setGlobalEval(tmp);
                }

                // Capture executables
                if (scripts) {
                    j = 0;
                    while ((elem = tmp[j++])) {
                        if (rscriptType.test(elem.type || "")) {
                            scripts.push(elem);
                        }
                    }
                }
            }

            tmp = null;

            return safe;
        },

        cleanData: function (elems, /* internal */acceptData) {
            var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

            for (; (elem = elems[i]) != null; i++) {

                if (acceptData || jQuery.acceptData(elem)) {

                    id = elem[internalKey];
                    data = id && cache[id];

                    if (data) {
                        if (data.events) {
                            for (type in data.events) {
                                if (special[type]) {
                                    jQuery.event.remove(elem, type);

                                    // This is a shortcut to avoid jQuery.event.remove's overhead
                                } else {
                                    jQuery.removeEvent(elem, type, data.handle);
                                }
                            }
                        }

                        // Remove cache only if it was not already removed by jQuery.event.remove
                        if (cache[id]) {

                            delete cache[id];

                            // IE does not allow us to delete expando properties from nodes,
                            // nor does it have a removeAttribute function on Document nodes;
                            // we must handle all of these cases
                            if (deleteExpando) {
                                delete elem[internalKey];

                            } else if (typeof elem.removeAttribute !== core_strundefined) {
                                elem.removeAttribute(internalKey);

                            } else {
                                elem[internalKey] = null;
                            }

                            core_deletedIds.push(id);
                        }
                    }
                }
            }
        },

        _evalUrl: function (url) {
            return jQuery.ajax({
                url: url,
                type: "GET",
                dataType: "script",
                async: false,
                global: false,
                "throws": true
            });
        }
    });
    jQuery.fn.extend({
        wrapAll: function (html) {
            if (jQuery.isFunction(html)) {
                return this.each(function (i) {
                    jQuery(this).wrapAll(html.call(this, i));
                });
            }

            if (this[0]) {
                // The elements to wrap the target around
                var wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);

                if (this[0].parentNode) {
                    wrap.insertBefore(this[0]);
                }

                wrap.map(function () {
                    var elem = this;

                    while (elem.firstChild && elem.firstChild.nodeType === 1) {
                        elem = elem.firstChild;
                    }

                    return elem;
                }).append(this);
            }

            return this;
        },

        wrapInner: function (html) {
            if (jQuery.isFunction(html)) {
                return this.each(function (i) {
                    jQuery(this).wrapInner(html.call(this, i));
                });
            }

            return this.each(function () {
                var self = jQuery(this),
				contents = self.contents();

                if (contents.length) {
                    contents.wrapAll(html);

                } else {
                    self.append(html);
                }
            });
        },

        wrap: function (html) {
            var isFunction = jQuery.isFunction(html);

            return this.each(function (i) {
                jQuery(this).wrapAll(isFunction ? html.call(this, i) : html);
            });
        },

        unwrap: function () {
            return this.parent().each(function () {
                if (!jQuery.nodeName(this, "body")) {
                    jQuery(this).replaceWith(this.childNodes);
                }
            }).end();
        }
    });
    var iframe, getStyles, curCSS,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
    // swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
    // see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp("^(" + core_pnum + ")(.*)$", "i"),
	rnumnonpx = new RegExp("^(" + core_pnum + ")(?!px)[a-z%]+$", "i"),
	rrelNum = new RegExp("^([+-])=(" + core_pnum + ")", "i"),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
	    letterSpacing: 0,
	    fontWeight: 400
	},

	cssExpand = ["Top", "Right", "Bottom", "Left"],
	cssPrefixes = ["Webkit", "O", "Moz", "ms"];

    // return a css property mapped to a potentially vendor prefixed property
    function vendorPropName(style, name) {

        // shortcut for names that are not vendor prefixed
        if (name in style) {
            return name;
        }

        // check for vendor prefixed names
        var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

        while (i--) {
            name = cssPrefixes[i] + capName;
            if (name in style) {
                return name;
            }
        }

        return origName;
    }

    function isHidden(elem, el) {
        // isHidden might be called from jQuery#filter function;
        // in that case, element will be second argument
        elem = el || elem;
        return jQuery.css(elem, "display") === "none" || !jQuery.contains(elem.ownerDocument, elem);
    }

    function showHide(elements, show) {
        var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

        for (; index < length; index++) {
            elem = elements[index];
            if (!elem.style) {
                continue;
            }

            values[index] = jQuery._data(elem, "olddisplay");
            display = elem.style.display;
            if (show) {
                // Reset the inline display of this element to learn if it is
                // being hidden by cascaded rules or not
                if (!values[index] && display === "none") {
                    elem.style.display = "";
                }

                // Set elements which have been overridden with display: none
                // in a stylesheet to whatever the default browser style is
                // for such an element
                if (elem.style.display === "" && isHidden(elem)) {
                    values[index] = jQuery._data(elem, "olddisplay", css_defaultDisplay(elem.nodeName));
                }
            } else {

                if (!values[index]) {
                    hidden = isHidden(elem);

                    if (display && display !== "none" || !hidden) {
                        jQuery._data(elem, "olddisplay", hidden ? display : jQuery.css(elem, "display"));
                    }
                }
            }
        }

        // Set the display of most of the elements in a second loop
        // to avoid the constant reflow
        for (index = 0; index < length; index++) {
            elem = elements[index];
            if (!elem.style) {
                continue;
            }
            if (!show || elem.style.display === "none" || elem.style.display === "") {
                elem.style.display = show ? values[index] || "" : "none";
            }
        }

        return elements;
    }

    jQuery.fn.extend({
        css: function (name, value) {
            return jQuery.access(this, function (elem, name, value) {
                var len, styles,
				map = {},
				i = 0;

                if (jQuery.isArray(name)) {
                    styles = getStyles(elem);
                    len = name.length;

                    for (; i < len; i++) {
                        map[name[i]] = jQuery.css(elem, name[i], false, styles);
                    }

                    return map;
                }

                return value !== undefined ?
				jQuery.style(elem, name, value) :
				jQuery.css(elem, name);
            }, name, value, arguments.length > 1);
        },
        show: function () {
            return showHide(this, true);
        },
        hide: function () {
            return showHide(this);
        },
        toggle: function (state) {
            if (typeof state === "boolean") {
                return state ? this.show() : this.hide();
            }

            return this.each(function () {
                if (isHidden(this)) {
                    jQuery(this).show();
                } else {
                    jQuery(this).hide();
                }
            });
        }
    });

    jQuery.extend({
        // Add in style property hooks for overriding the default
        // behavior of getting and setting a style property
        cssHooks: {
            opacity: {
                get: function (elem, computed) {
                    if (computed) {
                        // We should always get a number back from opacity
                        var ret = curCSS(elem, "opacity");
                        return ret === "" ? "1" : ret;
                    }
                }
            }
        },

        // Don't automatically add "px" to these possibly-unitless properties
        cssNumber: {
            "columnCount": true,
            "fillOpacity": true,
            "fontWeight": true,
            "lineHeight": true,
            "opacity": true,
            "order": true,
            "orphans": true,
            "widows": true,
            "zIndex": true,
            "zoom": true
        },

        // Add in properties whose names you wish to fix before
        // setting or getting the value
        cssProps: {
            // normalize float css property
            "float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
        },

        // Get and set the style property on a DOM Node
        style: function (elem, name, value, extra) {
            // Don't set styles on text and comment nodes
            if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
                return;
            }

            // Make sure that we're working with the right name
            var ret, type, hooks,
			origName = jQuery.camelCase(name),
			style = elem.style;

            name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(style, origName));

            // gets hook for the prefixed version
            // followed by the unprefixed version
            hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];

            // Check if we're setting a value
            if (value !== undefined) {
                type = typeof value;

                // convert relative number strings (+= or -=) to relative numbers. #7345
                if (type === "string" && (ret = rrelNum.exec(value))) {
                    value = (ret[1] + 1) * ret[2] + parseFloat(jQuery.css(elem, name));
                    // Fixes bug #9237
                    type = "number";
                }

                // Make sure that NaN and null values aren't set. See: #7116
                if (value == null || type === "number" && isNaN(value)) {
                    return;
                }

                // If a number was passed in, add 'px' to the (except for certain CSS properties)
                if (type === "number" && !jQuery.cssNumber[origName]) {
                    value += "px";
                }

                // Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
                // but it would mean to define eight (for every problematic property) identical functions
                if (!jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0) {
                    style[name] = "inherit";
                }

                // If a hook was provided, use that value, otherwise just set the specified value
                if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value, extra)) !== undefined) {

                    // Wrapped to prevent IE from throwing errors when 'invalid' values are provided
                    // Fixes bug #5509
                    try {
                        style[name] = value;
                    } catch (e) { }
                }

            } else {
                // If a hook was provided get the non-computed value from there
                if (hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== undefined) {
                    return ret;
                }

                // Otherwise just get the value from the style object
                return style[name];
            }
        },

        css: function (elem, name, extra, styles) {
            var num, val, hooks,
			origName = jQuery.camelCase(name);

            // Make sure that we're working with the right name
            name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(elem.style, origName));

            // gets hook for the prefixed version
            // followed by the unprefixed version
            hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];

            // If a hook was provided get the computed value from there
            if (hooks && "get" in hooks) {
                val = hooks.get(elem, true, extra);
            }

            // Otherwise, if a way to get the computed value exists, use that
            if (val === undefined) {
                val = curCSS(elem, name, styles);
            }

            //convert "normal" to computed value
            if (val === "normal" && name in cssNormalTransform) {
                val = cssNormalTransform[name];
            }

            // Return, converting to number if forced or a qualifier was provided and val looks numeric
            if (extra === "" || extra) {
                num = parseFloat(val);
                return extra === true || jQuery.isNumeric(num) ? num || 0 : val;
            }
            return val;
        }
    });

    // NOTE: we've included the "window" in window.getComputedStyle
    // because jsdom on node.js will break without it.
    if (window.getComputedStyle) {
        getStyles = function (elem) {
            return window.getComputedStyle(elem, null);
        };

        curCSS = function (elem, name, _computed) {
            var width, minWidth, maxWidth,
			computed = _computed || getStyles(elem),

            // getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue(name) || computed[name] : undefined,
			style = elem.style;

            if (computed) {

                if (ret === "" && !jQuery.contains(elem.ownerDocument, elem)) {
                    ret = jQuery.style(elem, name);
                }

                // A tribute to the "awesome hack by Dean Edwards"
                // Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
                // Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
                // this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
                if (rnumnonpx.test(ret) && rmargin.test(name)) {

                    // Remember the original values
                    width = style.width;
                    minWidth = style.minWidth;
                    maxWidth = style.maxWidth;

                    // Put in the new values to get a computed value out
                    style.minWidth = style.maxWidth = style.width = ret;
                    ret = computed.width;

                    // Revert the changed values
                    style.width = width;
                    style.minWidth = minWidth;
                    style.maxWidth = maxWidth;
                }
            }

            return ret;
        };
    } else if (document.documentElement.currentStyle) {
        getStyles = function (elem) {
            return elem.currentStyle;
        };

        curCSS = function (elem, name, _computed) {
            var left, rs, rsLeft,
			computed = _computed || getStyles(elem),
			ret = computed ? computed[name] : undefined,
			style = elem.style;

            // Avoid setting ret to empty string here
            // so we don't default to auto
            if (ret == null && style && style[name]) {
                ret = style[name];
            }

            // From the awesome hack by Dean Edwards
            // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

            // If we're not dealing with a regular pixel number
            // but a number that has a weird ending, we need to convert it to pixels
            // but not position css attributes, as those are proportional to the parent element instead
            // and we can't measure the parent instead because it might trigger a "stacking dolls" problem
            if (rnumnonpx.test(ret) && !rposition.test(name)) {

                // Remember the original values
                left = style.left;
                rs = elem.runtimeStyle;
                rsLeft = rs && rs.left;

                // Put in the new values to get a computed value out
                if (rsLeft) {
                    rs.left = elem.currentStyle.left;
                }
                style.left = name === "fontSize" ? "1em" : ret;
                ret = style.pixelLeft + "px";

                // Revert the changed values
                style.left = left;
                if (rsLeft) {
                    rs.left = rsLeft;
                }
            }

            return ret === "" ? "auto" : ret;
        };
    }

    function setPositiveNumber(elem, value, subtract) {
        var matches = rnumsplit.exec(value);
        return matches ?
        // Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max(0, matches[1] - (subtract || 0)) + (matches[2] || "px") :
		value;
    }

    function augmentWidthOrHeight(elem, name, extra, isBorderBox, styles) {
        var i = extra === (isBorderBox ? "border" : "content") ?
        // If we already have the right measurement, avoid augmentation
		4 :
        // Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

        for (; i < 4; i += 2) {
            // both box models exclude margin, so add it if we want it
            if (extra === "margin") {
                val += jQuery.css(elem, extra + cssExpand[i], true, styles);
            }

            if (isBorderBox) {
                // border-box includes padding, so remove it if we want content
                if (extra === "content") {
                    val -= jQuery.css(elem, "padding" + cssExpand[i], true, styles);
                }

                // at this point, extra isn't border nor margin, so remove border
                if (extra !== "margin") {
                    val -= jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
                }
            } else {
                // at this point, extra isn't content, so add padding
                val += jQuery.css(elem, "padding" + cssExpand[i], true, styles);

                // at this point, extra isn't content nor padding, so add border
                if (extra !== "padding") {
                    val += jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
                }
            }
        }

        return val;
    }

    function getWidthOrHeight(elem, name, extra) {

        // Start with offset property, which is equivalent to the border-box value
        var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles(elem),
		isBorderBox = jQuery.support.boxSizing && jQuery.css(elem, "boxSizing", false, styles) === "border-box";

        // some non-html elements return undefined for offsetWidth, so check for null/undefined
        // svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
        // MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
        if (val <= 0 || val == null) {
            // Fall back to computed then uncomputed css if necessary
            val = curCSS(elem, name, styles);
            if (val < 0 || val == null) {
                val = elem.style[name];
            }

            // Computed unit is not pixels. Stop here and return.
            if (rnumnonpx.test(val)) {
                return val;
            }

            // we need the check for style in case a browser which returns unreliable values
            // for getComputedStyle silently falls back to the reliable elem.style
            valueIsBorderBox = isBorderBox && (jQuery.support.boxSizingReliable || val === elem.style[name]);

            // Normalize "", auto, and prepare for extra
            val = parseFloat(val) || 0;
        }

        // use the active box-sizing model to add/subtract irrelevant styles
        return (val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || (isBorderBox ? "border" : "content"),
			valueIsBorderBox,
			styles
		)
	) + "px";
    }

    // Try to determine the default display value of an element
    function css_defaultDisplay(nodeName) {
        var doc = document,
		display = elemdisplay[nodeName];

        if (!display) {
            display = actualDisplay(nodeName, doc);

            // If the simple way fails, read from inside an iframe
            if (display === "none" || !display) {
                // Use the already-created iframe if possible
                iframe = (iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css("cssText", "display:block !important")
			).appendTo(doc.documentElement);

                // Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
                doc = (iframe[0].contentWindow || iframe[0].contentDocument).document;
                doc.write("<!doctype html><html><body>");
                doc.close();

                display = actualDisplay(nodeName, doc);
                iframe.detach();
            }

            // Store the correct default display
            elemdisplay[nodeName] = display;
        }

        return display;
    }

    // Called ONLY from within css_defaultDisplay
    function actualDisplay(name, doc) {
        var elem = jQuery(doc.createElement(name)).appendTo(doc.body),
		display = jQuery.css(elem[0], "display");
        elem.remove();
        return display;
    }

    jQuery.each(["height", "width"], function (i, name) {
        jQuery.cssHooks[name] = {
            get: function (elem, computed, extra) {
                if (computed) {
                    // certain elements can have dimension info if we invisibly show them
                    // however, it must have a current display style that would benefit from this
                    return elem.offsetWidth === 0 && rdisplayswap.test(jQuery.css(elem, "display")) ?
					jQuery.swap(elem, cssShow, function () {
					    return getWidthOrHeight(elem, name, extra);
					}) :
					getWidthOrHeight(elem, name, extra);
                }
            },

            set: function (elem, value, extra) {
                var styles = extra && getStyles(elem);
                return setPositiveNumber(elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css(elem, "boxSizing", false, styles) === "border-box",
					styles
				) : 0
			);
            }
        };
    });

    if (!jQuery.support.opacity) {
        jQuery.cssHooks.opacity = {
            get: function (elem, computed) {
                // IE uses filters for opacity
                return ropacity.test((computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "") ?
				(0.01 * parseFloat(RegExp.$1)) + "" :
				computed ? "1" : "";
            },

            set: function (elem, value) {
                var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric(value) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

                // IE has trouble with opacity if it does not have layout
                // Force it by setting the zoom level
                style.zoom = 1;

                // if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
                // if value === "", then remove inline opacity #12685
                if ((value >= 1 || value === "") &&
					jQuery.trim(filter.replace(ralpha, "")) === "" &&
					style.removeAttribute) {

                    // Setting style.filter to null, "" & " " still leave "filter:" in the cssText
                    // if "filter:" is present at all, clearType is disabled, we want to avoid this
                    // style.removeAttribute is IE Only, but so apparently is this code path...
                    style.removeAttribute("filter");

                    // if there is no filter style applied in a css rule or unset inline opacity, we are done
                    if (value === "" || currentStyle && !currentStyle.filter) {
                        return;
                    }
                }

                // otherwise, set new filter values
                style.filter = ralpha.test(filter) ?
				filter.replace(ralpha, opacity) :
				filter + " " + opacity;
            }
        };
    }

    // These hooks cannot be added until DOM ready because the support test
    // for it is not run until after DOM ready
    jQuery(function () {
        if (!jQuery.support.reliableMarginRight) {
            jQuery.cssHooks.marginRight = {
                get: function (elem, computed) {
                    if (computed) {
                        // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
                        // Work around by temporarily setting element display to inline-block
                        return jQuery.swap(elem, { "display": "inline-block" },
						curCSS, [elem, "marginRight"]);
                    }
                }
            };
        }

        // Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
        // getComputedStyle returns percent when specified for top/left/bottom/right
        // rather than make the css module depend on the offset module, we just check for it here
        if (!jQuery.support.pixelPosition && jQuery.fn.position) {
            jQuery.each(["top", "left"], function (i, prop) {
                jQuery.cssHooks[prop] = {
                    get: function (elem, computed) {
                        if (computed) {
                            computed = curCSS(elem, prop);
                            // if curCSS returns percentage, fallback to offset
                            return rnumnonpx.test(computed) ?
							jQuery(elem).position()[prop] + "px" :
							computed;
                        }
                    }
                };
            });
        }

    });

    if (jQuery.expr && jQuery.expr.filters) {
        jQuery.expr.filters.hidden = function (elem) {
            // Support: Opera <= 12.12
            // Opera reports offsetWidths and offsetHeights less than zero on some elements
            return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
			(!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css(elem, "display")) === "none");
        };

        jQuery.expr.filters.visible = function (elem) {
            return !jQuery.expr.filters.hidden(elem);
        };
    }

    // These hooks are used by animate to expand properties
    jQuery.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function (prefix, suffix) {
        jQuery.cssHooks[prefix + suffix] = {
            expand: function (value) {
                var i = 0,
				expanded = {},

                // assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [value];

                for (; i < 4; i++) {
                    expanded[prefix + cssExpand[i] + suffix] =
					parts[i] || parts[i - 2] || parts[0];
                }

                return expanded;
            }
        };

        if (!rmargin.test(prefix)) {
            jQuery.cssHooks[prefix + suffix].set = setPositiveNumber;
        }
    });
    var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

    jQuery.fn.extend({
        serialize: function () {
            return jQuery.param(this.serializeArray());
        },
        serializeArray: function () {
            return this.map(function () {
                // Can add propHook for "elements" to filter or add form elements
                var elements = jQuery.prop(this, "elements");
                return elements ? jQuery.makeArray(elements) : this;
            })
		.filter(function () {
		    var type = this.type;
		    // Use .is(":disabled") so that fieldset[disabled] works
		    return this.name && !jQuery(this).is(":disabled") &&
				rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) &&
				(this.checked || !manipulation_rcheckableType.test(type));
		})
		.map(function (i, elem) {
		    var val = jQuery(this).val();

		    return val == null ?
				null :
				jQuery.isArray(val) ?
					jQuery.map(val, function (val) {
					    return { name: elem.name, value: val.replace(rCRLF, "\r\n") };
					}) :
					{ name: elem.name, value: val.replace(rCRLF, "\r\n") };
		}).get();
        }
    });

    //Serialize an array of form elements or a set of
    //key/values into a query string
    jQuery.param = function (a, traditional) {
        var prefix,
		s = [],
		add = function (key, value) {
		    // If value is a function, invoke it and return its value
		    value = jQuery.isFunction(value) ? value() : (value == null ? "" : value);
		    s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
		};

        // Set traditional to true for jQuery <= 1.3.2 behavior.
        if (traditional === undefined) {
            traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
        }

        // If an array was passed in, assume that it is an array of form elements.
        if (jQuery.isArray(a) || (a.jquery && !jQuery.isPlainObject(a))) {
            // Serialize the form elements
            jQuery.each(a, function () {
                add(this.name, this.value);
            });

        } else {
            // If traditional, encode the "old" way (the way 1.3.2 or older
            // did it), otherwise encode params recursively.
            for (prefix in a) {
                buildParams(prefix, a[prefix], traditional, add);
            }
        }

        // Return the resulting serialization
        return s.join("&").replace(r20, "+");
    };

    function buildParams(prefix, obj, traditional, add) {
        var name;

        if (jQuery.isArray(obj)) {
            // Serialize array item.
            jQuery.each(obj, function (i, v) {
                if (traditional || rbracket.test(prefix)) {
                    // Treat each array item as a scalar.
                    add(prefix, v);

                } else {
                    // Item is non-scalar (array or object), encode its numeric index.
                    buildParams(prefix + "[" + (typeof v === "object" ? i : "") + "]", v, traditional, add);
                }
            });

        } else if (!traditional && jQuery.type(obj) === "object") {
            // Serialize object item.
            for (name in obj) {
                buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
            }

        } else {
            // Serialize scalar item.
            add(prefix, obj);
        }
    }
    jQuery.each(("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function (i, name) {

	    // Handle event binding
	    jQuery.fn[name] = function (data, fn) {
	        return arguments.length > 0 ?
			this.on(name, null, data, fn) :
			this.trigger(name);
	    };
	});

    jQuery.fn.extend({
        hover: function (fnOver, fnOut) {
            return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
        },

        bind: function (types, data, fn) {
            return this.on(types, null, data, fn);
        },
        unbind: function (types, fn) {
            return this.off(types, null, fn);
        },

        delegate: function (selector, types, data, fn) {
            return this.on(types, selector, data, fn);
        },
        undelegate: function (selector, types, fn) {
            // ( namespace ) or ( selector, types [, fn] )
            return arguments.length === 1 ? this.off(selector, "**") : this.off(types, selector || "**", fn);
        }
    });
    var 
    // Document location
	ajaxLocParts,
	ajaxLocation,
	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
    // #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

    // Keep a copy of the old load method
	_load = jQuery.fn.load,

    /* Prefilters
    * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
    * 2) These are called:
    *    - BEFORE asking for a transport
    *    - AFTER param serialization (s.data is a string if s.processData is true)
    * 3) key is the dataType
    * 4) the catchall symbol "*" can be used
    * 5) execution will start with transport dataType and THEN continue down to "*" if needed
    */
	prefilters = {},

    /* Transports bindings
    * 1) key is the dataType
    * 2) the catchall symbol "*" can be used
    * 3) selection will start with transport dataType and THEN go to "*" if needed
    */
	transports = {},

    // Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

    // #8138, IE may throw an exception when accessing
    // a field from window.location if document.domain has been set
    try {
        ajaxLocation = location.href;
    } catch (e) {
        // Use the href attribute of an A element
        // since IE will modify it given document.location
        ajaxLocation = document.createElement("a");
        ajaxLocation.href = "";
        ajaxLocation = ajaxLocation.href;
    }

    // Segment location into parts
    ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || [];

    // Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
    function addToPrefiltersOrTransports(structure) {

        // dataTypeExpression is optional and defaults to "*"
        return function (dataTypeExpression, func) {

            if (typeof dataTypeExpression !== "string") {
                func = dataTypeExpression;
                dataTypeExpression = "*";
            }

            var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match(core_rnotwhite) || [];

            if (jQuery.isFunction(func)) {
                // For each dataType in the dataTypeExpression
                while ((dataType = dataTypes[i++])) {
                    // Prepend if requested
                    if (dataType[0] === "+") {
                        dataType = dataType.slice(1) || "*";
                        (structure[dataType] = structure[dataType] || []).unshift(func);

                        // Otherwise append
                    } else {
                        (structure[dataType] = structure[dataType] || []).push(func);
                    }
                }
            }
        };
    }

    // Base inspection function for prefilters and transports
    function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {

        var inspected = {},
		seekingTransport = (structure === transports);

        function inspect(dataType) {
            var selected;
            inspected[dataType] = true;
            jQuery.each(structure[dataType] || [], function (_, prefilterOrFactory) {
                var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);
                if (typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[dataTypeOrTransport]) {
                    options.dataTypes.unshift(dataTypeOrTransport);
                    inspect(dataTypeOrTransport);
                    return false;
                } else if (seekingTransport) {
                    return !(selected = dataTypeOrTransport);
                }
            });
            return selected;
        }

        return inspect(options.dataTypes[0]) || !inspected["*"] && inspect("*");
    }

    // A special extend for ajax options
    // that takes "flat" options (not to be deep extended)
    // Fixes #9887
    function ajaxExtend(target, src) {
        var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

        for (key in src) {
            if (src[key] !== undefined) {
                (flatOptions[key] ? target : (deep || (deep = {})))[key] = src[key];
            }
        }
        if (deep) {
            jQuery.extend(true, target, deep);
        }

        return target;
    }

    jQuery.fn.load = function (url, params, callback) {
        if (typeof url !== "string" && _load) {
            return _load.apply(this, arguments);
        }

        var selector, response, type,
		self = this,
		off = url.indexOf(" ");

        if (off >= 0) {
            selector = url.slice(off, url.length);
            url = url.slice(0, off);
        }

        // If it's a function
        if (jQuery.isFunction(params)) {

            // We assume that it's the callback
            callback = params;
            params = undefined;

            // Otherwise, build a param string
        } else if (params && typeof params === "object") {
            type = "POST";
        }

        // If we have elements to modify, make the request
        if (self.length > 0) {
            jQuery.ajax({
                url: url,

                // if "type" variable is undefined, then "GET" method will be used
                type: type,
                dataType: "html",
                data: params
            }).done(function (responseText) {

                // Save response for use in complete callback
                response = arguments;

                self.html(selector ?

                // If a selector was specified, locate the right elements in a dummy div
                // Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector) :

                // Otherwise use the full result
				responseText);

            }).complete(callback && function (jqXHR, status) {
                self.each(callback, response || [jqXHR.responseText, status, jqXHR]);
            });
        }

        return this;
    };

    // Attach a bunch of functions for handling common AJAX events
    jQuery.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (i, type) {
        jQuery.fn[type] = function (fn) {
            return this.on(type, fn);
        };
    });

    jQuery.extend({

        // Counter for holding the number of active queries
        active: 0,

        // Last-Modified header cache for next request
        lastModified: {},
        etag: {},

        ajaxSettings: {
            url: ajaxLocation,
            type: "GET",
            isLocal: rlocalProtocol.test(ajaxLocParts[1]),
            global: true,
            processData: true,
            async: true,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            /*
            timeout: 0,
            data: null,
            dataType: null,
            username: null,
            password: null,
            cache: null,
            throws: false,
            traditional: false,
            headers: {},
            */

            accepts: {
                "*": allTypes,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },

            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },

            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },

            // Data converters
            // Keys separate source (or catchall "*") and destination types with a single space
            converters: {

                // Convert anything to text
                "* text": String,

                // Text to html (true = no transformation)
                "text html": true,

                // Evaluate text as a json expression
                "text json": jQuery.parseJSON,

                // Parse text as xml
                "text xml": jQuery.parseXML
            },

            // For options that shouldn't be deep extended:
            // you can add your own custom options here if
            // and when you create one that shouldn't be
            // deep extended (see ajaxExtend)
            flatOptions: {
                url: true,
                context: true
            }
        },

        // Creates a full fledged settings object into target
        // with both ajaxSettings and settings fields.
        // If target is omitted, writes into ajaxSettings.
        ajaxSetup: function (target, settings) {
            return settings ?

            // Building a settings object
			ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings) :

            // Extending ajaxSettings
			ajaxExtend(jQuery.ajaxSettings, target);
        },

        ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
        ajaxTransport: addToPrefiltersOrTransports(transports),

        // Main method
        ajax: function (url, options) {

            // If url is an object, simulate pre-1.5 signature
            if (typeof url === "object") {
                options = url;
                url = undefined;
            }

            // Force options to be an object
            options = options || {};

            var // Cross-domain detection vars
			parts,
            // Loop variable
			i,
            // URL without anti-cache param
			cacheURL,
            // Response headers as string
			responseHeadersString,
            // timeout handle
			timeoutTimer,

            // To know if global events are to be dispatched
			fireGlobals,

			transport,
            // Response headers
			responseHeaders,
            // Create the final options object
			s = jQuery.ajaxSetup({}, options),
            // Callbacks context
			callbackContext = s.context || s,
            // Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && (callbackContext.nodeType || callbackContext.jquery) ?
				jQuery(callbackContext) :
				jQuery.event,
            // Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
            // Status-dependent callbacks
			statusCode = s.statusCode || {},
            // Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
            // The jqXHR state
			state = 0,
            // Default abort message
			strAbort = "canceled",
            // Fake xhr
			jqXHR = {
			    readyState: 0,

			    // Builds headers hashtable if needed
			    getResponseHeader: function (key) {
			        var match;
			        if (state === 2) {
			            if (!responseHeaders) {
			                responseHeaders = {};
			                while ((match = rheaders.exec(responseHeadersString))) {
			                    responseHeaders[match[1].toLowerCase()] = match[2];
			                }
			            }
			            match = responseHeaders[key.toLowerCase()];
			        }
			        return match == null ? null : match;
			    },

			    // Raw string
			    getAllResponseHeaders: function () {
			        return state === 2 ? responseHeadersString : null;
			    },

			    // Caches the header
			    setRequestHeader: function (name, value) {
			        var lname = name.toLowerCase();
			        if (!state) {
			            name = requestHeadersNames[lname] = requestHeadersNames[lname] || name;
			            requestHeaders[name] = value;
			        }
			        return this;
			    },

			    // Overrides response content-type header
			    overrideMimeType: function (type) {
			        if (!state) {
			            s.mimeType = type;
			        }
			        return this;
			    },

			    // Status-dependent callbacks
			    statusCode: function (map) {
			        var code;
			        if (map) {
			            if (state < 2) {
			                for (code in map) {
			                    // Lazy-add the new callback in a way that preserves old ones
			                    statusCode[code] = [statusCode[code], map[code]];
			                }
			            } else {
			                // Execute the appropriate callbacks
			                jqXHR.always(map[jqXHR.status]);
			            }
			        }
			        return this;
			    },

			    // Cancel the request
			    abort: function (statusText) {
			        var finalText = statusText || strAbort;
			        if (transport) {
			            transport.abort(finalText);
			        }
			        done(0, finalText);
			        return this;
			    }
			};

            // Attach deferreds
            deferred.promise(jqXHR).complete = completeDeferred.add;
            jqXHR.success = jqXHR.done;
            jqXHR.error = jqXHR.fail;

            // Remove hash character (#7531: and string promotion)
            // Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
            // Handle falsy url in the settings object (#10093: consistency with old signature)
            // We also use the url parameter if available
            s.url = ((url || s.url || ajaxLocation) + "").replace(rhash, "").replace(rprotocol, ajaxLocParts[1] + "//");

            // Alias method option to type as per ticket #12004
            s.type = options.method || options.type || s.method || s.type;

            // Extract dataTypes list
            s.dataTypes = jQuery.trim(s.dataType || "*").toLowerCase().match(core_rnotwhite) || [""];

            // A cross-domain request is in order when we have a protocol:host:port mismatch
            if (s.crossDomain == null) {
                parts = rurl.exec(s.url.toLowerCase());
                s.crossDomain = !!(parts &&
				(parts[1] !== ajaxLocParts[1] || parts[2] !== ajaxLocParts[2] ||
					(parts[3] || (parts[1] === "http:" ? "80" : "443")) !==
						(ajaxLocParts[3] || (ajaxLocParts[1] === "http:" ? "80" : "443")))
			);
            }

            // Convert data if not already a string
            if (s.data && s.processData && typeof s.data !== "string") {
                s.data = jQuery.param(s.data, s.traditional);
            }

            // Apply prefilters
            inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);

            // If request was aborted inside a prefilter, stop there
            if (state === 2) {
                return jqXHR;
            }

            // We can fire global events as of now if asked to
            fireGlobals = s.global;

            // Watch for a new set of requests
            if (fireGlobals && jQuery.active++ === 0) {
                jQuery.event.trigger("ajaxStart");
            }

            // Uppercase the type
            s.type = s.type.toUpperCase();

            // Determine if request has content
            s.hasContent = !rnoContent.test(s.type);

            // Save the URL in case we're toying with the If-Modified-Since
            // and/or If-None-Match header later on
            cacheURL = s.url;

            // More options handling for requests with no content
            if (!s.hasContent) {

                // If data is available, append data to url
                if (s.data) {
                    cacheURL = (s.url += (ajax_rquery.test(cacheURL) ? "&" : "?") + s.data);
                    // #9682: remove data so that it's not used in an eventual retry
                    delete s.data;
                }

                // Add anti-cache in url if needed
                if (s.cache === false) {
                    s.url = rts.test(cacheURL) ?

                    // If there is already a '_' parameter, set its value
					cacheURL.replace(rts, "$1_=" + ajax_nonce++) :

                    // Otherwise add one to the end
					cacheURL + (ajax_rquery.test(cacheURL) ? "&" : "?") + "_=" + ajax_nonce++;
                }
            }

            // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
            if (s.ifModified) {
                if (jQuery.lastModified[cacheURL]) {
                    jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[cacheURL]);
                }
                if (jQuery.etag[cacheURL]) {
                    jqXHR.setRequestHeader("If-None-Match", jQuery.etag[cacheURL]);
                }
            }

            // Set the correct header, if data is being sent
            if (s.data && s.hasContent && s.contentType !== false || options.contentType) {
                jqXHR.setRequestHeader("Content-Type", s.contentType);
            }

            // Set the Accepts header for the server, depending on the dataType
            jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[0] && s.accepts[s.dataTypes[0]] ?
				s.accepts[s.dataTypes[0]] + (s.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "") :
				s.accepts["*"]
		);

            // Check for headers option
            for (i in s.headers) {
                jqXHR.setRequestHeader(i, s.headers[i]);
            }

            // Allow custom headers/mimetypes and early abort
            if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === false || state === 2)) {
                // Abort if not done already and return
                return jqXHR.abort();
            }

            // aborting is no longer a cancellation
            strAbort = "abort";

            // Install callbacks on deferreds
            for (i in { success: 1, error: 1, complete: 1 }) {
                jqXHR[i](s[i]);
            }

            // Get transport
            transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);

            // If no transport, we auto-abort
            if (!transport) {
                done(-1, "No Transport");
            } else {
                jqXHR.readyState = 1;

                // Send global event
                if (fireGlobals) {
                    globalEventContext.trigger("ajaxSend", [jqXHR, s]);
                }
                // Timeout
                if (s.async && s.timeout > 0) {
                    timeoutTimer = setTimeout(function () {
                        jqXHR.abort("timeout");
                    }, s.timeout);
                }

                try {
                    state = 1;
                    transport.send(requestHeaders, done);
                } catch (e) {
                    // Propagate exception as error if not done
                    if (state < 2) {
                        done(-1, e);
                        // Simply rethrow otherwise
                    } else {
                        throw e;
                    }
                }
            }

            // Callback for when everything is done
            function done(status, nativeStatusText, responses, headers) {
                var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

                // Called once
                if (state === 2) {
                    return;
                }

                // State is "done" now
                state = 2;

                // Clear timeout if it exists
                if (timeoutTimer) {
                    clearTimeout(timeoutTimer);
                }

                // Dereference transport for early garbage collection
                // (no matter how long the jqXHR object will be used)
                transport = undefined;

                // Cache response headers
                responseHeadersString = headers || "";

                // Set readyState
                jqXHR.readyState = status > 0 ? 4 : 0;

                // Determine if successful
                isSuccess = status >= 200 && status < 300 || status === 304;

                // Get response data
                if (responses) {
                    response = ajaxHandleResponses(s, jqXHR, responses);
                }

                // Convert no matter what (that way responseXXX fields are always set)
                response = ajaxConvert(s, response, jqXHR, isSuccess);

                // If successful, handle type chaining
                if (isSuccess) {

                    // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
                    if (s.ifModified) {
                        modified = jqXHR.getResponseHeader("Last-Modified");
                        if (modified) {
                            jQuery.lastModified[cacheURL] = modified;
                        }
                        modified = jqXHR.getResponseHeader("etag");
                        if (modified) {
                            jQuery.etag[cacheURL] = modified;
                        }
                    }

                    // if no content
                    if (status === 204 || s.type === "HEAD") {
                        statusText = "nocontent";

                        // if not modified
                    } else if (status === 304) {
                        statusText = "notmodified";

                        // If we have data, let's convert it
                    } else {
                        statusText = response.state;
                        success = response.data;
                        error = response.error;
                        isSuccess = !error;
                    }
                } else {
                    // We extract error from statusText
                    // then normalize statusText and status for non-aborts
                    error = statusText;
                    if (status || !statusText) {
                        statusText = "error";
                        if (status < 0) {
                            status = 0;
                        }
                    }
                }

                // Set data for the fake xhr object
                jqXHR.status = status;
                jqXHR.statusText = (nativeStatusText || statusText) + "";

                // Success/Error
                if (isSuccess) {
                    deferred.resolveWith(callbackContext, [success, statusText, jqXHR]);
                } else {
                    deferred.rejectWith(callbackContext, [jqXHR, statusText, error]);
                }

                // Status-dependent callbacks
                jqXHR.statusCode(statusCode);
                statusCode = undefined;

                if (fireGlobals) {
                    globalEventContext.trigger(isSuccess ? "ajaxSuccess" : "ajaxError",
					[jqXHR, s, isSuccess ? success : error]);
                }

                // Complete
                completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);

                if (fireGlobals) {
                    globalEventContext.trigger("ajaxComplete", [jqXHR, s]);
                    // Handle the global AJAX counter
                    if (!(--jQuery.active)) {
                        jQuery.event.trigger("ajaxStop");
                    }
                }
            }

            return jqXHR;
        },

        getJSON: function (url, data, callback) {
            return jQuery.get(url, data, callback, "json");
        },

        getScript: function (url, callback) {
            return jQuery.get(url, undefined, callback, "script");
        }
    });

    jQuery.each(["get", "post"], function (i, method) {
        jQuery[method] = function (url, data, callback, type) {
            // shift arguments if data argument was omitted
            if (jQuery.isFunction(data)) {
                type = type || callback;
                callback = data;
                data = undefined;
            }

            return jQuery.ajax({
                url: url,
                type: method,
                dataType: type,
                data: data,
                success: callback
            });
        };
    });

    /* Handles responses to an ajax request:
    * - finds the right dataType (mediates between content-type and expected dataType)
    * - returns the corresponding response
    */
    function ajaxHandleResponses(s, jqXHR, responses) {
        var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

        // Remove auto dataType and get content-type in the process
        while (dataTypes[0] === "*") {
            dataTypes.shift();
            if (ct === undefined) {
                ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
            }
        }

        // Check if we're dealing with a known content-type
        if (ct) {
            for (type in contents) {
                if (contents[type] && contents[type].test(ct)) {
                    dataTypes.unshift(type);
                    break;
                }
            }
        }

        // Check to see if we have a response for the expected dataType
        if (dataTypes[0] in responses) {
            finalDataType = dataTypes[0];
        } else {
            // Try convertible dataTypes
            for (type in responses) {
                if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
                    finalDataType = type;
                    break;
                }
                if (!firstDataType) {
                    firstDataType = type;
                }
            }
            // Or just use first one
            finalDataType = finalDataType || firstDataType;
        }

        // If we found a dataType
        // We add the dataType to the list if needed
        // and return the corresponding response
        if (finalDataType) {
            if (finalDataType !== dataTypes[0]) {
                dataTypes.unshift(finalDataType);
            }
            return responses[finalDataType];
        }
    }

    /* Chain conversions given the request and the original response
    * Also sets the responseXXX fields on the jqXHR instance
    */
    function ajaxConvert(s, response, jqXHR, isSuccess) {
        var conv2, current, conv, tmp, prev,
		converters = {},
        // Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

        // Create converters map with lowercased keys
        if (dataTypes[1]) {
            for (conv in s.converters) {
                converters[conv.toLowerCase()] = s.converters[conv];
            }
        }

        current = dataTypes.shift();

        // Convert to each sequential dataType
        while (current) {

            if (s.responseFields[current]) {
                jqXHR[s.responseFields[current]] = response;
            }

            // Apply the dataFilter if provided
            if (!prev && isSuccess && s.dataFilter) {
                response = s.dataFilter(response, s.dataType);
            }

            prev = current;
            current = dataTypes.shift();

            if (current) {

                // There's only work to do if current dataType is non-auto
                if (current === "*") {

                    current = prev;

                    // Convert response if prev dataType is non-auto and differs from current
                } else if (prev !== "*" && prev !== current) {

                    // Seek a direct converter
                    conv = converters[prev + " " + current] || converters["* " + current];

                    // If none found, seek a pair
                    if (!conv) {
                        for (conv2 in converters) {

                            // If conv2 outputs current
                            tmp = conv2.split(" ");
                            if (tmp[1] === current) {

                                // If prev can be converted to accepted input
                                conv = converters[prev + " " + tmp[0]] ||
								converters["* " + tmp[0]];
                                if (conv) {
                                    // Condense equivalence converters
                                    if (conv === true) {
                                        conv = converters[conv2];

                                        // Otherwise, insert the intermediate dataType
                                    } else if (converters[conv2] !== true) {
                                        current = tmp[0];
                                        dataTypes.unshift(tmp[1]);
                                    }
                                    break;
                                }
                            }
                        }
                    }

                    // Apply converter (if not an equivalence)
                    if (conv !== true) {

                        // Unless errors are allowed to bubble, catch and return them
                        if (conv && s["throws"]) {
                            response = conv(response);
                        } else {
                            try {
                                response = conv(response);
                            } catch (e) {
                                return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
                            }
                        }
                    }
                }
            }
        }

        return { state: "success", data: response };
    }
    // Install script dataType
    jQuery.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /(?:java|ecma)script/
        },
        converters: {
            "text script": function (text) {
                jQuery.globalEval(text);
                return text;
            }
        }
    });

    // Handle cache's special case and global
    jQuery.ajaxPrefilter("script", function (s) {
        if (s.cache === undefined) {
            s.cache = false;
        }
        if (s.crossDomain) {
            s.type = "GET";
            s.global = false;
        }
    });

    // Bind script tag hack transport
    jQuery.ajaxTransport("script", function (s) {

        // This transport only deals with cross domain requests
        if (s.crossDomain) {

            var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

            return {

                send: function (_, callback) {

                    script = document.createElement("script");

                    script.async = true;

                    if (s.scriptCharset) {
                        script.charset = s.scriptCharset;
                    }

                    script.src = s.url;

                    // Attach handlers for all browsers
                    script.onload = script.onreadystatechange = function (_, isAbort) {

                        if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {

                            // Handle memory leak in IE
                            script.onload = script.onreadystatechange = null;

                            // Remove the script
                            if (script.parentNode) {
                                script.parentNode.removeChild(script);
                            }

                            // Dereference the script
                            script = null;

                            // Callback if not abort
                            if (!isAbort) {
                                callback(200, "success");
                            }
                        }
                    };

                    // Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
                    // Use native DOM manipulation to avoid our domManip AJAX trickery
                    head.insertBefore(script, head.firstChild);
                },

                abort: function () {
                    if (script) {
                        script.onload(undefined, true);
                    }
                }
            };
        }
    });
    var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

    // Default jsonp settings
    jQuery.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function () {
            var callback = oldCallbacks.pop() || (jQuery.expando + "_" + (ajax_nonce++));
            this[callback] = true;
            return callback;
        }
    });

    // Detect, normalize options and install callbacks for jsonp requests
    jQuery.ajaxPrefilter("json jsonp", function (s, originalSettings, jqXHR) {

        var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && (rjsonp.test(s.url) ?
			"url" :
			typeof s.data === "string" && !(s.contentType || "").indexOf("application/x-www-form-urlencoded") && rjsonp.test(s.data) && "data"
		);

        // Handle iff the expected data type is "jsonp" or we have a parameter to set
        if (jsonProp || s.dataTypes[0] === "jsonp") {

            // Get callback name, remembering preexisting value associated with it
            callbackName = s.jsonpCallback = jQuery.isFunction(s.jsonpCallback) ?
			s.jsonpCallback() :
			s.jsonpCallback;

            // Insert callback into url or form data
            if (jsonProp) {
                s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + callbackName);
            } else if (s.jsonp !== false) {
                s.url += (ajax_rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" + callbackName;
            }

            // Use data converter to retrieve json after script execution
            s.converters["script json"] = function () {
                if (!responseContainer) {
                    jQuery.error(callbackName + " was not called");
                }
                return responseContainer[0];
            };

            // force json dataType
            s.dataTypes[0] = "json";

            // Install callback
            overwritten = window[callbackName];
            window[callbackName] = function () {
                responseContainer = arguments;
            };

            // Clean-up function (fires after converters)
            jqXHR.always(function () {
                // Restore preexisting value
                window[callbackName] = overwritten;

                // Save back as free
                if (s[callbackName]) {
                    // make sure that re-using the options doesn't screw things around
                    s.jsonpCallback = originalSettings.jsonpCallback;

                    // save the callback name for future use
                    oldCallbacks.push(callbackName);
                }

                // Call if it was a function and we have a response
                if (responseContainer && jQuery.isFunction(overwritten)) {
                    overwritten(responseContainer[0]);
                }

                responseContainer = overwritten = undefined;
            });

            // Delegate to script
            return "script";
        }
    });
    var xhrCallbacks, xhrSupported,
	xhrId = 0,
    // #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject && function () {
	    // Abort all pending requests
	    var key;
	    for (key in xhrCallbacks) {
	        xhrCallbacks[key](undefined, true);
	    }
	};

    // Functions to create xhrs
    function createStandardXHR() {
        try {
            return new window.XMLHttpRequest();
        } catch (e) { }
    }

    function createActiveXHR() {
        try {
            return new window.ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) { }
    }

    // Create the request object
    // (This is still attached to ajaxSettings for backward compatibility)
    jQuery.ajaxSettings.xhr = window.ActiveXObject ?
    /* Microsoft failed to properly
    * implement the XMLHttpRequest in IE7 (can't request local files),
    * so we use the ActiveXObject when it is available
    * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
    * we need a fallback.
    */
	function () {
	    return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
    // For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

    // Determine support properties
    xhrSupported = jQuery.ajaxSettings.xhr();
    jQuery.support.cors = !!xhrSupported && ("withCredentials" in xhrSupported);
    xhrSupported = jQuery.support.ajax = !!xhrSupported;

    // Create transport if the browser can provide an xhr
    if (xhrSupported) {

        jQuery.ajaxTransport(function (s) {
            // Cross domain only allowed if supported through XMLHttpRequest
            if (!s.crossDomain || jQuery.support.cors) {

                var callback;

                return {
                    send: function (headers, complete) {

                        // Get a new xhr
                        var handle, i,
						xhr = s.xhr();

                        // Open the socket
                        // Passing null username, generates a login popup on Opera (#2865)
                        if (s.username) {
                            xhr.open(s.type, s.url, s.async, s.username, s.password);
                        } else {
                            xhr.open(s.type, s.url, s.async);
                        }

                        // Apply custom fields if provided
                        if (s.xhrFields) {
                            for (i in s.xhrFields) {
                                xhr[i] = s.xhrFields[i];
                            }
                        }

                        // Override mime type if needed
                        if (s.mimeType && xhr.overrideMimeType) {
                            xhr.overrideMimeType(s.mimeType);
                        }

                        // X-Requested-With header
                        // For cross-domain requests, seeing as conditions for a preflight are
                        // akin to a jigsaw puzzle, we simply never set it to be sure.
                        // (it can always be set on a per-request basis or even using ajaxSetup)
                        // For same-domain requests, won't change header if already provided.
                        if (!s.crossDomain && !headers["X-Requested-With"]) {
                            headers["X-Requested-With"] = "XMLHttpRequest";
                        }

                        // Need an extra try/catch for cross domain requests in Firefox 3
                        try {
                            for (i in headers) {
                                xhr.setRequestHeader(i, headers[i]);
                            }
                        } catch (err) { }

                        // Do send the request
                        // This may raise an exception which is actually
                        // handled in jQuery.ajax (so no try/catch here)
                        xhr.send((s.hasContent && s.data) || null);

                        // Listener
                        callback = function (_, isAbort) {
                            var status, responseHeaders, statusText, responses;

                            // Firefox throws exceptions when accessing properties
                            // of an xhr when a network error occurred
                            // http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
                            try {

                                // Was never called and is aborted or complete
                                if (callback && (isAbort || xhr.readyState === 4)) {

                                    // Only called once
                                    callback = undefined;

                                    // Do not keep as active anymore
                                    if (handle) {
                                        xhr.onreadystatechange = jQuery.noop;
                                        if (xhrOnUnloadAbort) {
                                            delete xhrCallbacks[handle];
                                        }
                                    }

                                    // If it's an abort
                                    if (isAbort) {
                                        // Abort it manually if needed
                                        if (xhr.readyState !== 4) {
                                            xhr.abort();
                                        }
                                    } else {
                                        responses = {};
                                        status = xhr.status;
                                        responseHeaders = xhr.getAllResponseHeaders();

                                        // When requesting binary data, IE6-9 will throw an exception
                                        // on any attempt to access responseText (#11426)
                                        if (typeof xhr.responseText === "string") {
                                            responses.text = xhr.responseText;
                                        }

                                        // Firefox throws an exception when accessing
                                        // statusText for faulty cross-domain requests
                                        try {
                                            statusText = xhr.statusText;
                                        } catch (e) {
                                            // We normalize with Webkit giving an empty statusText
                                            statusText = "";
                                        }

                                        // Filter status for non standard behaviors

                                        // If the request is local and we have data: assume a success
                                        // (success with no data won't get notified, that's the best we
                                        // can do given current implementations)
                                        if (!status && s.isLocal && !s.crossDomain) {
                                            status = responses.text ? 200 : 404;
                                            // IE - #1450: sometimes returns 1223 when it should be 204
                                        } else if (status === 1223) {
                                            status = 204;
                                        }
                                    }
                                }
                            } catch (firefoxAccessException) {
                                if (!isAbort) {
                                    complete(-1, firefoxAccessException);
                                }
                            }

                            // Call complete if needed
                            if (responses) {
                                complete(status, statusText, responses, responseHeaders);
                            }
                        };

                        if (!s.async) {
                            // if we're in sync mode we fire the callback
                            callback();
                        } else if (xhr.readyState === 4) {
                            // (IE6 & IE7) if it's in cache and has been
                            // retrieved directly we need to fire the callback
                            setTimeout(callback);
                        } else {
                            handle = ++xhrId;
                            if (xhrOnUnloadAbort) {
                                // Create the active xhrs callbacks list if needed
                                // and attach the unload handler
                                if (!xhrCallbacks) {
                                    xhrCallbacks = {};
                                    jQuery(window).unload(xhrOnUnloadAbort);
                                }
                                // Add to list of active xhrs callbacks
                                xhrCallbacks[handle] = callback;
                            }
                            xhr.onreadystatechange = callback;
                        }
                    },

                    abort: function () {
                        if (callback) {
                            callback(undefined, true);
                        }
                    }
                };
            }
        });
    }
    var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp("^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i"),
	rrun = /queueHooks$/,
	animationPrefilters = [defaultPrefilter],
	tweeners = {
	    "*": [function (prop, value) {
	        var tween = this.createTween(prop, value),
				target = tween.cur(),
				parts = rfxnum.exec(value),
				unit = parts && parts[3] || (jQuery.cssNumber[prop] ? "" : "px"),

	        // Starting value computation is required for potential unit mismatches
				start = (jQuery.cssNumber[prop] || unit !== "px" && +target) &&
					rfxnum.exec(jQuery.css(tween.elem, prop)),
				scale = 1,
				maxIterations = 20;

	        if (start && start[3] !== unit) {
	            // Trust units reported by jQuery.css
	            unit = unit || start[3];

	            // Make sure we update the tween properties later on
	            parts = parts || [];

	            // Iteratively approximate from a nonzero starting point
	            start = +target || 1;

	            do {
	                // If previous iteration zeroed out, double until we get *something*
	                // Use a string for doubling factor so we don't accidentally see scale as unchanged below
	                scale = scale || ".5";

	                // Adjust and apply
	                start = start / scale;
	                jQuery.style(tween.elem, prop, start + unit);

	                // Update scale, tolerating zero or NaN from tween.cur()
	                // And breaking the loop if scale is unchanged or perfect, or if we've just had enough
	            } while (scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations);
	        }

	        // Update tween properties
	        if (parts) {
	            start = tween.start = +start || +target || 0;
	            tween.unit = unit;
	            // If a +=/-= token was provided, we're doing a relative animation
	            tween.end = parts[1] ?
					start + (parts[1] + 1) * parts[2] :
					+parts[2];
	        }

	        return tween;
	    } ]
	};

    // Animations created synchronously will run synchronously
    function createFxNow() {
        setTimeout(function () {
            fxNow = undefined;
        });
        return (fxNow = jQuery.now());
    }

    function createTween(value, prop, animation) {
        var tween,
		collection = (tweeners[prop] || []).concat(tweeners["*"]),
		index = 0,
		length = collection.length;
        for (; index < length; index++) {
            if ((tween = collection[index].call(animation, prop, value))) {

                // we're done with this property
                return tween;
            }
        }
    }

    function Animation(elem, properties, options) {
        var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always(function () {
		    // don't match elem in the :animated selector
		    delete tick.elem;
		}),
		tick = function () {
		    if (stopped) {
		        return false;
		    }
		    var currentTime = fxNow || createFxNow(),
				remaining = Math.max(0, animation.startTime + animation.duration - currentTime),
		    // archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

		    for (; index < length; index++) {
		        animation.tweens[index].run(percent);
		    }

		    deferred.notifyWith(elem, [animation, percent, remaining]);

		    if (percent < 1 && length) {
		        return remaining;
		    } else {
		        deferred.resolveWith(elem, [animation]);
		        return false;
		    }
		},
		animation = deferred.promise({
		    elem: elem,
		    props: jQuery.extend({}, properties),
		    opts: jQuery.extend(true, { specialEasing: {} }, options),
		    originalProperties: properties,
		    originalOptions: options,
		    startTime: fxNow || createFxNow(),
		    duration: options.duration,
		    tweens: [],
		    createTween: function (prop, end) {
		        var tween = jQuery.Tween(elem, animation.opts, prop, end,
						animation.opts.specialEasing[prop] || animation.opts.easing);
		        animation.tweens.push(tween);
		        return tween;
		    },
		    stop: function (gotoEnd) {
		        var index = 0,
		        // if we are going to the end, we want to run all the tweens
		        // otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
		        if (stopped) {
		            return this;
		        }
		        stopped = true;
		        for (; index < length; index++) {
		            animation.tweens[index].run(1);
		        }

		        // resolve when we played the last frame
		        // otherwise, reject
		        if (gotoEnd) {
		            deferred.resolveWith(elem, [animation, gotoEnd]);
		        } else {
		            deferred.rejectWith(elem, [animation, gotoEnd]);
		        }
		        return this;
		    }
		}),
		props = animation.props;

        propFilter(props, animation.opts.specialEasing);

        for (; index < length; index++) {
            result = animationPrefilters[index].call(animation, elem, props, animation.opts);
            if (result) {
                return result;
            }
        }

        jQuery.map(props, createTween, animation);

        if (jQuery.isFunction(animation.opts.start)) {
            animation.opts.start.call(elem, animation);
        }

        jQuery.fx.timer(
		jQuery.extend(tick, {
		    elem: elem,
		    anim: animation,
		    queue: animation.opts.queue
		})
	);

        // attach callbacks from options
        return animation.progress(animation.opts.progress)
		.done(animation.opts.done, animation.opts.complete)
		.fail(animation.opts.fail)
		.always(animation.opts.always);
    }

    function propFilter(props, specialEasing) {
        var index, name, easing, value, hooks;

        // camelCase, specialEasing and expand cssHook pass
        for (index in props) {
            name = jQuery.camelCase(index);
            easing = specialEasing[name];
            value = props[index];
            if (jQuery.isArray(value)) {
                easing = value[1];
                value = props[index] = value[0];
            }

            if (index !== name) {
                props[name] = value;
                delete props[index];
            }

            hooks = jQuery.cssHooks[name];
            if (hooks && "expand" in hooks) {
                value = hooks.expand(value);
                delete props[name];

                // not quite $.extend, this wont overwrite keys already present.
                // also - reusing 'index' from above because we have the correct "name"
                for (index in value) {
                    if (!(index in props)) {
                        props[index] = value[index];
                        specialEasing[index] = easing;
                    }
                }
            } else {
                specialEasing[name] = easing;
            }
        }
    }

    jQuery.Animation = jQuery.extend(Animation, {

        tweener: function (props, callback) {
            if (jQuery.isFunction(props)) {
                callback = props;
                props = ["*"];
            } else {
                props = props.split(" ");
            }

            var prop,
			index = 0,
			length = props.length;

            for (; index < length; index++) {
                prop = props[index];
                tweeners[prop] = tweeners[prop] || [];
                tweeners[prop].unshift(callback);
            }
        },

        prefilter: function (callback, prepend) {
            if (prepend) {
                animationPrefilters.unshift(callback);
            } else {
                animationPrefilters.push(callback);
            }
        }
    });

    function defaultPrefilter(elem, props, opts) {
        /* jshint validthis: true */
        var prop, value, toggle, tween, hooks, oldfire,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden(elem),
		dataShow = jQuery._data(elem, "fxshow");

        // handle queue: false promises
        if (!opts.queue) {
            hooks = jQuery._queueHooks(elem, "fx");
            if (hooks.unqueued == null) {
                hooks.unqueued = 0;
                oldfire = hooks.empty.fire;
                hooks.empty.fire = function () {
                    if (!hooks.unqueued) {
                        oldfire();
                    }
                };
            }
            hooks.unqueued++;

            anim.always(function () {
                // doing this makes sure that the complete handler will be called
                // before this completes
                anim.always(function () {
                    hooks.unqueued--;
                    if (!jQuery.queue(elem, "fx").length) {
                        hooks.empty.fire();
                    }
                });
            });
        }

        // height/width overflow pass
        if (elem.nodeType === 1 && ("height" in props || "width" in props)) {
            // Make sure that nothing sneaks out
            // Record all 3 overflow attributes because IE does not
            // change the overflow attribute when overflowX and
            // overflowY are set to the same value
            opts.overflow = [style.overflow, style.overflowX, style.overflowY];

            // Set display property to inline-block for height/width
            // animations on inline elements that are having width/height animated
            if (jQuery.css(elem, "display") === "inline" &&
				jQuery.css(elem, "float") === "none") {

                // inline-level elements accept inline-block;
                // block-level elements need to be inline with layout
                if (!jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay(elem.nodeName) === "inline") {
                    style.display = "inline-block";

                } else {
                    style.zoom = 1;
                }
            }
        }

        if (opts.overflow) {
            style.overflow = "hidden";
            if (!jQuery.support.shrinkWrapBlocks) {
                anim.always(function () {
                    style.overflow = opts.overflow[0];
                    style.overflowX = opts.overflow[1];
                    style.overflowY = opts.overflow[2];
                });
            }
        }


        // show/hide pass
        for (prop in props) {
            value = props[prop];
            if (rfxtypes.exec(value)) {
                delete props[prop];
                toggle = toggle || value === "toggle";
                if (value === (hidden ? "hide" : "show")) {
                    continue;
                }
                orig[prop] = dataShow && dataShow[prop] || jQuery.style(elem, prop);
            }
        }

        if (!jQuery.isEmptyObject(orig)) {
            if (dataShow) {
                if ("hidden" in dataShow) {
                    hidden = dataShow.hidden;
                }
            } else {
                dataShow = jQuery._data(elem, "fxshow", {});
            }

            // store state if its toggle - enables .stop().toggle() to "reverse"
            if (toggle) {
                dataShow.hidden = !hidden;
            }
            if (hidden) {
                jQuery(elem).show();
            } else {
                anim.done(function () {
                    jQuery(elem).hide();
                });
            }
            anim.done(function () {
                var prop;
                jQuery._removeData(elem, "fxshow");
                for (prop in orig) {
                    jQuery.style(elem, prop, orig[prop]);
                }
            });
            for (prop in orig) {
                tween = createTween(hidden ? dataShow[prop] : 0, prop, anim);

                if (!(prop in dataShow)) {
                    dataShow[prop] = tween.start;
                    if (hidden) {
                        tween.end = tween.start;
                        tween.start = prop === "width" || prop === "height" ? 1 : 0;
                    }
                }
            }
        }
    }

    function Tween(elem, options, prop, end, easing) {
        return new Tween.prototype.init(elem, options, prop, end, easing);
    }
    jQuery.Tween = Tween;

    Tween.prototype = {
        constructor: Tween,
        init: function (elem, options, prop, end, easing, unit) {
            this.elem = elem;
            this.prop = prop;
            this.easing = easing || "swing";
            this.options = options;
            this.start = this.now = this.cur();
            this.end = end;
            this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px");
        },
        cur: function () {
            var hooks = Tween.propHooks[this.prop];

            return hooks && hooks.get ?
			hooks.get(this) :
			Tween.propHooks._default.get(this);
        },
        run: function (percent) {
            var eased,
			hooks = Tween.propHooks[this.prop];

            if (this.options.duration) {
                this.pos = eased = jQuery.easing[this.easing](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
            } else {
                this.pos = eased = percent;
            }
            this.now = (this.end - this.start) * eased + this.start;

            if (this.options.step) {
                this.options.step.call(this.elem, this.now, this);
            }

            if (hooks && hooks.set) {
                hooks.set(this);
            } else {
                Tween.propHooks._default.set(this);
            }
            return this;
        }
    };

    Tween.prototype.init.prototype = Tween.prototype;

    Tween.propHooks = {
        _default: {
            get: function (tween) {
                var result;

                if (tween.elem[tween.prop] != null &&
				(!tween.elem.style || tween.elem.style[tween.prop] == null)) {
                    return tween.elem[tween.prop];
                }

                // passing an empty string as a 3rd parameter to .css will automatically
                // attempt a parseFloat and fallback to a string if the parse fails
                // so, simple values such as "10px" are parsed to Float.
                // complex values such as "rotate(1rad)" are returned as is.
                result = jQuery.css(tween.elem, tween.prop, "");
                // Empty strings, null, undefined and "auto" are converted to 0.
                return !result || result === "auto" ? 0 : result;
            },
            set: function (tween) {
                // use step hook for back compat - use cssHook if its there - use .style if its
                // available and use plain properties where available
                if (jQuery.fx.step[tween.prop]) {
                    jQuery.fx.step[tween.prop](tween);
                } else if (tween.elem.style && (tween.elem.style[jQuery.cssProps[tween.prop]] != null || jQuery.cssHooks[tween.prop])) {
                    jQuery.style(tween.elem, tween.prop, tween.now + tween.unit);
                } else {
                    tween.elem[tween.prop] = tween.now;
                }
            }
        }
    };

    // Support: IE <=9
    // Panic based approach to setting things on disconnected nodes

    Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
        set: function (tween) {
            if (tween.elem.nodeType && tween.elem.parentNode) {
                tween.elem[tween.prop] = tween.now;
            }
        }
    };

    jQuery.each(["toggle", "show", "hide"], function (i, name) {
        var cssFn = jQuery.fn[name];
        jQuery.fn[name] = function (speed, easing, callback) {
            return speed == null || typeof speed === "boolean" ?
			cssFn.apply(this, arguments) :
			this.animate(genFx(name, true), speed, easing, callback);
        };
    });

    jQuery.fn.extend({
        fadeTo: function (speed, to, easing, callback) {

            // show any hidden elements after setting opacity to 0
            return this.filter(isHidden).css("opacity", 0).show()

            // animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback);
        },
        animate: function (prop, speed, easing, callback) {
            var empty = jQuery.isEmptyObject(prop),
			optall = jQuery.speed(speed, easing, callback),
			doAnimation = function () {
			    // Operate on a copy of prop so per-property easing won't be lost
			    var anim = Animation(this, jQuery.extend({}, prop), optall);

			    // Empty animations, or finishing resolves immediately
			    if (empty || jQuery._data(this, "finish")) {
			        anim.stop(true);
			    }
			};
            doAnimation.finish = doAnimation;

            return empty || optall.queue === false ?
			this.each(doAnimation) :
			this.queue(optall.queue, doAnimation);
        },
        stop: function (type, clearQueue, gotoEnd) {
            var stopQueue = function (hooks) {
                var stop = hooks.stop;
                delete hooks.stop;
                stop(gotoEnd);
            };

            if (typeof type !== "string") {
                gotoEnd = clearQueue;
                clearQueue = type;
                type = undefined;
            }
            if (clearQueue && type !== false) {
                this.queue(type || "fx", []);
            }

            return this.each(function () {
                var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data(this);

                if (index) {
                    if (data[index] && data[index].stop) {
                        stopQueue(data[index]);
                    }
                } else {
                    for (index in data) {
                        if (data[index] && data[index].stop && rrun.test(index)) {
                            stopQueue(data[index]);
                        }
                    }
                }

                for (index = timers.length; index--; ) {
                    if (timers[index].elem === this && (type == null || timers[index].queue === type)) {
                        timers[index].anim.stop(gotoEnd);
                        dequeue = false;
                        timers.splice(index, 1);
                    }
                }

                // start the next in the queue if the last step wasn't forced
                // timers currently will call their complete callbacks, which will dequeue
                // but only if they were gotoEnd
                if (dequeue || !gotoEnd) {
                    jQuery.dequeue(this, type);
                }
            });
        },
        finish: function (type) {
            if (type !== false) {
                type = type || "fx";
            }
            return this.each(function () {
                var index,
				data = jQuery._data(this),
				queue = data[type + "queue"],
				hooks = data[type + "queueHooks"],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

                // enable finishing flag on private data
                data.finish = true;

                // empty the queue first
                jQuery.queue(this, type, []);

                if (hooks && hooks.stop) {
                    hooks.stop.call(this, true);
                }

                // look for any active animations, and finish them
                for (index = timers.length; index--; ) {
                    if (timers[index].elem === this && timers[index].queue === type) {
                        timers[index].anim.stop(true);
                        timers.splice(index, 1);
                    }
                }

                // look for any animations in the old queue and finish them
                for (index = 0; index < length; index++) {
                    if (queue[index] && queue[index].finish) {
                        queue[index].finish.call(this);
                    }
                }

                // turn off finishing flag
                delete data.finish;
            });
        }
    });

    // Generate parameters to create a standard animation
    function genFx(type, includeWidth) {
        var which,
		attrs = { height: type },
		i = 0;

        // if we include width, step value is 1 to do all cssExpand values,
        // if we don't include width, step value is 2 to skip over Left and Right
        includeWidth = includeWidth ? 1 : 0;
        for (; i < 4; i += 2 - includeWidth) {
            which = cssExpand[i];
            attrs["margin" + which] = attrs["padding" + which] = type;
        }

        if (includeWidth) {
            attrs.opacity = attrs.width = type;
        }

        return attrs;
    }

    // Generate shortcuts for custom animations
    jQuery.each({
        slideDown: genFx("show"),
        slideUp: genFx("hide"),
        slideToggle: genFx("toggle"),
        fadeIn: { opacity: "show" },
        fadeOut: { opacity: "hide" },
        fadeToggle: { opacity: "toggle" }
    }, function (name, props) {
        jQuery.fn[name] = function (speed, easing, callback) {
            return this.animate(props, speed, easing, callback);
        };
    });

    jQuery.speed = function (speed, easing, fn) {
        var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
            complete: fn || !fn && easing ||
			jQuery.isFunction(speed) && speed,
            duration: speed,
            easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
        };

        opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default;

        // normalize opt.queue - true/undefined/null -> "fx"
        if (opt.queue == null || opt.queue === true) {
            opt.queue = "fx";
        }

        // Queueing
        opt.old = opt.complete;

        opt.complete = function () {
            if (jQuery.isFunction(opt.old)) {
                opt.old.call(this);
            }

            if (opt.queue) {
                jQuery.dequeue(this, opt.queue);
            }
        };

        return opt;
    };

    jQuery.easing = {
        linear: function (p) {
            return p;
        },
        swing: function (p) {
            return 0.5 - Math.cos(p * Math.PI) / 2;
        }
    };

    jQuery.timers = [];
    jQuery.fx = Tween.prototype.init;
    jQuery.fx.tick = function () {
        var timer,
		timers = jQuery.timers,
		i = 0;

        fxNow = jQuery.now();

        for (; i < timers.length; i++) {
            timer = timers[i];
            // Checks the timer has not already been removed
            if (!timer() && timers[i] === timer) {
                timers.splice(i--, 1);
            }
        }

        if (!timers.length) {
            jQuery.fx.stop();
        }
        fxNow = undefined;
    };

    jQuery.fx.timer = function (timer) {
        if (timer() && jQuery.timers.push(timer)) {
            jQuery.fx.start();
        }
    };

    jQuery.fx.interval = 13;

    jQuery.fx.start = function () {
        if (!timerId) {
            timerId = setInterval(jQuery.fx.tick, jQuery.fx.interval);
        }
    };

    jQuery.fx.stop = function () {
        clearInterval(timerId);
        timerId = null;
    };

    jQuery.fx.speeds = {
        slow: 600,
        fast: 200,
        // Default speed
        _default: 400
    };

    // Back Compat <1.8 extension point
    jQuery.fx.step = {};

    if (jQuery.expr && jQuery.expr.filters) {
        jQuery.expr.filters.animated = function (elem) {
            return jQuery.grep(jQuery.timers, function (fn) {
                return elem === fn.elem;
            }).length;
        };
    }
    jQuery.fn.offset = function (options) {
        if (arguments.length) {
            return options === undefined ?
			this :
			this.each(function (i) {
			    jQuery.offset.setOffset(this, options, i);
			});
        }

        var docElem, win,
		box = { top: 0, left: 0 },
		elem = this[0],
		doc = elem && elem.ownerDocument;

        if (!doc) {
            return;
        }

        docElem = doc.documentElement;

        // Make sure it's not a disconnected DOM node
        if (!jQuery.contains(docElem, elem)) {
            return box;
        }

        // If we don't have gBCR, just use 0,0 rather than error
        // BlackBerry 5, iOS 3 (original iPhone)
        if (typeof elem.getBoundingClientRect !== core_strundefined) {
            box = elem.getBoundingClientRect();
        }
        win = getWindow(doc);
        return {
            top: box.top + (win.pageYOffset || docElem.scrollTop) - (docElem.clientTop || 0),
            left: box.left + (win.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || 0)
        };
    };

    jQuery.offset = {

        setOffset: function (elem, options, i) {
            var position = jQuery.css(elem, "position");

            // set position first, in-case top/left are set even on static elem
            if (position === "static") {
                elem.style.position = "relative";
            }

            var curElem = jQuery(elem),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css(elem, "top"),
			curCSSLeft = jQuery.css(elem, "left"),
			calculatePosition = (position === "absolute" || position === "fixed") && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

            // need to be able to calculate position if either top or left is auto and position is either absolute or fixed
            if (calculatePosition) {
                curPosition = curElem.position();
                curTop = curPosition.top;
                curLeft = curPosition.left;
            } else {
                curTop = parseFloat(curCSSTop) || 0;
                curLeft = parseFloat(curCSSLeft) || 0;
            }

            if (jQuery.isFunction(options)) {
                options = options.call(elem, i, curOffset);
            }

            if (options.top != null) {
                props.top = (options.top - curOffset.top) + curTop;
            }
            if (options.left != null) {
                props.left = (options.left - curOffset.left) + curLeft;
            }

            if ("using" in options) {
                options.using.call(elem, props);
            } else {
                curElem.css(props);
            }
        }
    };


    jQuery.fn.extend({

        position: function () {
            if (!this[0]) {
                return;
            }

            var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[0];

            // fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
            if (jQuery.css(elem, "position") === "fixed") {
                // we assume that getBoundingClientRect is available when computed position is fixed
                offset = elem.getBoundingClientRect();
            } else {
                // Get *real* offsetParent
                offsetParent = this.offsetParent();

                // Get correct offsets
                offset = this.offset();
                if (!jQuery.nodeName(offsetParent[0], "html")) {
                    parentOffset = offsetParent.offset();
                }

                // Add offsetParent borders
                parentOffset.top += jQuery.css(offsetParent[0], "borderTopWidth", true);
                parentOffset.left += jQuery.css(offsetParent[0], "borderLeftWidth", true);
            }

            // Subtract parent offsets and element margins
            // note: when an element has margin: auto the offsetLeft and marginLeft
            // are the same in Safari causing offset.left to incorrectly be 0
            return {
                top: offset.top - parentOffset.top - jQuery.css(elem, "marginTop", true),
                left: offset.left - parentOffset.left - jQuery.css(elem, "marginLeft", true)
            };
        },

        offsetParent: function () {
            return this.map(function () {
                var offsetParent = this.offsetParent || docElem;
                while (offsetParent && (!jQuery.nodeName(offsetParent, "html") && jQuery.css(offsetParent, "position") === "static")) {
                    offsetParent = offsetParent.offsetParent;
                }
                return offsetParent || docElem;
            });
        }
    });


    // Create scrollLeft and scrollTop methods
    jQuery.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function (method, prop) {
        var top = /Y/.test(prop);

        jQuery.fn[method] = function (val) {
            return jQuery.access(this, function (elem, method, val) {
                var win = getWindow(elem);

                if (val === undefined) {
                    return win ? (prop in win) ? win[prop] :
					win.document.documentElement[method] :
					elem[method];
                }

                if (win) {
                    win.scrollTo(
					!top ? val : jQuery(win).scrollLeft(),
					top ? val : jQuery(win).scrollTop()
				);

                } else {
                    elem[method] = val;
                }
            }, method, val, arguments.length, null);
        };
    });

    function getWindow(elem) {
        return jQuery.isWindow(elem) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
    }
    // Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
    jQuery.each({ Height: "height", Width: "width" }, function (name, type) {
        jQuery.each({ padding: "inner" + name, content: type, "": "outer" + name }, function (defaultExtra, funcName) {
            // margin is only for outerHeight, outerWidth
            jQuery.fn[funcName] = function (margin, value) {
                var chainable = arguments.length && (defaultExtra || typeof margin !== "boolean"),
				extra = defaultExtra || (margin === true || value === true ? "margin" : "border");

                return jQuery.access(this, function (elem, type, value) {
                    var doc;

                    if (jQuery.isWindow(elem)) {
                        // As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
                        // isn't a whole lot we can do. See pull request at this URL for discussion:
                        // https://github.com/jquery/jquery/pull/764
                        return elem.document.documentElement["client" + name];
                    }

                    // Get document width or height
                    if (elem.nodeType === 9) {
                        doc = elem.documentElement;

                        // Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
                        // unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
                        return Math.max(
						elem.body["scroll" + name], doc["scroll" + name],
						elem.body["offset" + name], doc["offset" + name],
						doc["client" + name]
					);
                    }

                    return value === undefined ?
                    // Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css(elem, type, extra) :

                    // Set width or height on the element
					jQuery.style(elem, type, value, extra);
                }, type, chainable ? margin : undefined, chainable, null);
            };
        });
    });
    // Limit scope pollution from any deprecated API
    // (function() {

    // The number of elements contained in the matched element set
    jQuery.fn.size = function () {
        return this.length;
    };

    jQuery.fn.andSelf = jQuery.fn.addBack;

    // })();
    if (typeof module === "object" && module && typeof module.exports === "object") {
        // Expose jQuery as module.exports in loaders that implement the Node
        // module pattern (including browserify). Do not create the global, since
        // the user will be storing it themselves locally, and globals are frowned
        // upon in the Node module world.
        module.exports = jQuery;
    } else {
        // Otherwise expose jQuery to the global object as usual
        window.jQuery = window.$ = jQuery;

        // Register as a named AMD module, since jQuery can be concatenated with other
        // files that may use define, but not via a proper concatenation script that
        // understands anonymous AMD modules. A named AMD is safest and most robust
        // way to register. Lowercase jquery is used because AMD module names are
        // derived from file names, and jQuery is normally delivered in a lowercase
        // file name. Do this after creating the global so that if an AMD module wants
        // to call noConflict to hide this version of jQuery, it will work.
        if (typeof define === "function" && define.amd) {
            define("jquery", [], function () { return jQuery; });
        }
    }

})(window);
/**
 * CoffeeScript Compiler v1.6.3
 * http://coffeescript.org
 *
 * Copyright 2011, Jeremy Ashkenas
 * Released under the MIT License
 */
!function(root){var CoffeeScript=function(){function require(e){return require[e]}return require["./helpers"]=function(){var e={},t={exports:e};return function(){var t,n,i,s,r,o;e.starts=function(e,t,n){return t===e.substr(n,t.length)},e.ends=function(e,t,n){var i;return i=t.length,t===e.substr(e.length-i-(n||0),i)},e.repeat=r=function(e,t){var n;for(n="";t>0;)1&t&&(n+=e),t>>>=1,e+=e;return n},e.compact=function(e){var t,n,i,s;for(s=[],n=0,i=e.length;i>n;n++)t=e[n],t&&s.push(t);return s},e.count=function(e,t){var n,i;if(n=i=0,!t.length)return 1/0;for(;i=1+e.indexOf(t,i);)n++;return n},e.merge=function(e,t){return n(n({},e),t)},n=e.extend=function(e,t){var n,i;for(n in t)i=t[n],e[n]=i;return e},e.flatten=i=function(e){var t,n,s,r;for(n=[],s=0,r=e.length;r>s;s++)t=e[s],t instanceof Array?n=n.concat(i(t)):n.push(t);return n},e.del=function(e,t){var n;return n=e[t],delete e[t],n},e.last=s=function(e,t){return e[e.length-(t||0)-1]},e.some=null!=(o=Array.prototype.some)?o:function(e){var t,n,i;for(n=0,i=this.length;i>n;n++)if(t=this[n],e(t))return!0;return!1},e.invertLiterate=function(e){var t,n,i;return i=!0,n=function(){var n,s,r,o;for(r=e.split("\n"),o=[],n=0,s=r.length;s>n;n++)t=r[n],i&&/^([ ]{4}|[ ]{0,3}\t)/.test(t)?o.push(t):(i=/^\s*$/.test(t))?o.push(t):o.push("# "+t);return o}(),n.join("\n")},t=function(e,t){return t?{first_line:e.first_line,first_column:e.first_column,last_line:t.last_line,last_column:t.last_column}:e},e.addLocationDataFn=function(e,n){return function(i){return"object"==typeof i&&i.updateLocationDataIfMissing&&i.updateLocationDataIfMissing(t(e,n)),i}},e.locationDataToString=function(e){var t;return"2"in e&&"first_line"in e[2]?t=e[2]:"first_line"in e&&(t=e),t?""+(t.first_line+1)+":"+(t.first_column+1)+"-"+(""+(t.last_line+1)+":"+(t.last_column+1)):"No location data"},e.baseFileName=function(e,t,n){var i,s;return null==t&&(t=!1),null==n&&(n=!1),s=n?/\\|\//:/\//,i=e.split(s),e=i[i.length-1],t?(i=e.split("."),i.pop(),"coffee"===i[i.length-1]&&i.length>1&&i.pop(),i.join(".")):e},e.isCoffee=function(e){return/\.((lit)?coffee|coffee\.md)$/.test(e)},e.isLiterate=function(e){return/\.(litcoffee|coffee\.md)$/.test(e)},e.throwSyntaxError=function(e,t){var n;throw null==t.last_line&&(t.last_line=t.first_line),null==t.last_column&&(t.last_column=t.first_column),n=new SyntaxError(e),n.location=t,n},e.prettyErrorMessage=function(e,t,n,i){var s,o,a,c,h,l,u,p,d,f,m;return e.location?(m=e.location,h=m.first_line,c=m.first_column,u=m.last_line,l=m.last_column,s=n.split("\n")[h],f=c,a=h===u?l+1:s.length,p=r(" ",f)+r("^",a-f),i&&(o=function(e){return"[1;31m"+e+"[0m"},s=s.slice(0,f)+o(s.slice(f,a))+s.slice(a),p=o(p)),d=""+t+":"+(h+1)+":"+(c+1)+": error: "+e.message+"\n"+s+"\n"+p):e.stack||""+e}}.call(this),t.exports}(),require["./rewriter"]=function(){var e={},t={exports:e};return function(){var t,n,i,s,r,o,a,c,h,l,u,p,d,f,m,b,k,g,y=[].indexOf||function(e){for(var t=0,n=this.length;n>t;t++)if(t in this&&this[t]===e)return t;return-1},v=[].slice;for(d=function(e,t){var n;return n=[e,t],n.generated=!0,n},e.Rewriter=function(){function e(){}return e.prototype.rewrite=function(e){return this.tokens=e,this.removeLeadingNewlines(),this.removeMidExpressionNewlines(),this.closeOpenCalls(),this.closeOpenIndexes(),this.addImplicitIndentation(),this.tagPostfixConditionals(),this.addImplicitBracesAndParens(),this.addLocationDataToGeneratedTokens(),this.tokens},e.prototype.scanTokens=function(e){var t,n,i;for(i=this.tokens,t=0;n=i[t];)t+=e.call(this,n,t,i);return!0},e.prototype.detectEnd=function(e,t,n){var r,o,a,c,h;for(a=this.tokens,r=0;o=a[e];){if(0===r&&t.call(this,o,e))return n.call(this,o,e);if(!o||0>r)return n.call(this,o,e-1);c=o[0],y.call(s,c)>=0?r+=1:(h=o[0],y.call(i,h)>=0&&(r-=1)),e+=1}return e-1},e.prototype.removeLeadingNewlines=function(){var e,t,n,i,s;for(s=this.tokens,e=n=0,i=s.length;i>n&&(t=s[e][0],"TERMINATOR"===t);e=++n);return e?this.tokens.splice(0,e):void 0},e.prototype.removeMidExpressionNewlines=function(){return this.scanTokens(function(e,t,i){var s;return"TERMINATOR"===e[0]&&(s=this.tag(t+1),y.call(n,s)>=0)?(i.splice(t,1),0):1})},e.prototype.closeOpenCalls=function(){var e,t;return t=function(e,t){var n;return")"===(n=e[0])||"CALL_END"===n||"OUTDENT"===e[0]&&")"===this.tag(t-1)},e=function(e,t){return this.tokens["OUTDENT"===e[0]?t-1:t][0]="CALL_END"},this.scanTokens(function(n,i){return"CALL_START"===n[0]&&this.detectEnd(i+1,t,e),1})},e.prototype.closeOpenIndexes=function(){var e,t;return t=function(e){var t;return"]"===(t=e[0])||"INDEX_END"===t},e=function(e){return e[0]="INDEX_END"},this.scanTokens(function(n,i){return"INDEX_START"===n[0]&&this.detectEnd(i+1,t,e),1})},e.prototype.matchTags=function(){var e,t,n,i,s,r,o;for(t=arguments[0],i=2<=arguments.length?v.call(arguments,1):[],e=0,n=s=0,r=i.length;r>=0?r>s:s>r;n=r>=0?++s:--s){for(;"HERECOMMENT"===this.tag(t+n+e);)e+=2;if(null!=i[n]&&("string"==typeof i[n]&&(i[n]=[i[n]]),o=this.tag(t+n+e),y.call(i[n],o)<0))return!1}return!0},e.prototype.looksObjectish=function(e){return this.matchTags(e,"@",null,":")||this.matchTags(e,null,":")},e.prototype.findTagsBackwards=function(e,t){var n,r,o,a,c,h,u;for(n=[];e>=0&&(n.length||(a=this.tag(e),y.call(t,a)<0&&(c=this.tag(e),y.call(s,c)<0||this.tokens[e].generated)&&(h=this.tag(e),y.call(l,h)<0)));)r=this.tag(e),y.call(i,r)>=0&&n.push(this.tag(e)),o=this.tag(e),y.call(s,o)>=0&&n.length&&n.pop(),e-=1;return u=this.tag(e),y.call(t,u)>=0},e.prototype.addImplicitBracesAndParens=function(){var e;return e=[],this.scanTokens(function(t,n,h){var u,p,f,m,b,k,g,v,w,T,C,F,L,N,x,E,D,S,R,A,I,_,$,O,j,M;if(A=t[0],T=(n>0?h[n-1]:[])[0],v=(n<h.length-1?h[n+1]:[])[0],x=function(){return e[e.length-1]},E=n,f=function(e){return n-E+e},m=function(){var e,t;return null!=(e=x())?null!=(t=e[2])?t.ours:void 0:void 0},b=function(){var e;return m()&&"("===(null!=(e=x())?e[0]:void 0)},g=function(){var e;return m()&&"{"===(null!=(e=x())?e[0]:void 0)},k=function(){var e;return m&&"CONTROL"===(null!=(e=x())?e[0]:void 0)},D=function(t){var i;return i=null!=t?t:n,e.push(["(",i,{ours:!0}]),h.splice(i,0,d("CALL_START","(")),null==t?n+=1:void 0},u=function(){return e.pop(),h.splice(n,0,d("CALL_END",")")),n+=1},S=function(t,i){var s;return null==i&&(i=!0),s=null!=t?t:n,e.push(["{",s,{sameLine:!0,startsLine:i,ours:!0}]),h.splice(s,0,d("{",d(new String("{")))),null==t?n+=1:void 0},p=function(t){return t=null!=t?t:n,e.pop(),h.splice(t,0,d("}","}")),n+=1},b()&&("IF"===A||"TRY"===A||"FINALLY"===A||"CATCH"===A||"CLASS"===A||"SWITCH"===A))return e.push(["CONTROL",n,{ours:!0}]),f(1);if("INDENT"===A&&m()){if("=>"!==T&&"->"!==T&&"["!==T&&"("!==T&&","!==T&&"{"!==T&&"TRY"!==T&&"ELSE"!==T&&"="!==T)for(;b();)u();return k()&&e.pop(),e.push([A,n]),f(1)}if(y.call(s,A)>=0)return e.push([A,n]),f(1);if(y.call(i,A)>=0){for(;m();)b()?u():g()?p():e.pop();e.pop()}if((y.call(a,A)>=0&&t.spaced&&!t.stringEnd||"?"===A&&n>0&&!h[n-1].spaced)&&(y.call(r,v)>=0||y.call(c,v)>=0&&!(null!=(I=h[n+1])?I.spaced:void 0)&&!(null!=(_=h[n+1])?_.newLine:void 0)))return"?"===A&&(A=t[0]="FUNC_EXIST"),D(n+1),f(2);if(y.call(a,A)>=0&&this.matchTags(n+1,"INDENT",null,":")&&!this.findTagsBackwards(n,["CLASS","EXTENDS","IF","CATCH","SWITCH","LEADING_WHEN","FOR","WHILE","UNTIL"]))return D(n+1),e.push(["INDENT",n+2]),f(3);if(":"===A){for(C="@"===this.tag(n-2)?n-2:n-1;"HERECOMMENT"===this.tag(C-2);)C-=2;return R=0===C||($=this.tag(C-1),y.call(l,$)>=0)||h[C-1].newLine,x()&&(O=x(),N=O[0],L=O[1],("{"===N||"INDENT"===N&&"{"===this.tag(L-1))&&(R||","===this.tag(C-1)||"{"===this.tag(C-1)))?f(1):(S(C,!!R),f(2))}if("OUTDENT"===T&&b()&&("."===A||"?."===A||"::"===A||"?::"===A))return u(),f(1);if(g()&&y.call(l,A)>=0&&(x()[2].sameLine=!1),y.call(o,A)>=0)for(;m();)if(j=x(),N=j[0],L=j[1],M=j[2],F=M.sameLine,R=M.startsLine,b()&&","!==T)u();else if(g()&&F&&!R)p();else{if(!g()||"TERMINATOR"!==A||","===T||R&&this.looksObjectish(n+1))break;p()}if(","===A&&!this.looksObjectish(n+1)&&g()&&("TERMINATOR"!==v||!this.looksObjectish(n+2)))for(w="OUTDENT"===v?1:0;g();)p(n+w);return f(1)})},e.prototype.addLocationDataToGeneratedTokens=function(){return this.scanTokens(function(e,t,n){var i,s,r,o,a,c;return e[2]?1:e.generated||e.explicit?("{"===e[0]&&(r=null!=(a=n[t+1])?a[2]:void 0)?(s=r.first_line,i=r.first_column):(o=null!=(c=n[t-1])?c[2]:void 0)?(s=o.last_line,i=o.last_column):s=i=0,e[2]={first_line:s,first_column:i,last_line:s,last_column:i},1):1})},e.prototype.addImplicitIndentation=function(){var e,t,n,i,s;return s=n=i=null,t=function(e){var t,n;return";"!==e[1]&&(t=e[0],y.call(u,t)>=0)&&!("ELSE"===e[0]&&"THEN"!==s)&&!!("CATCH"!==(n=e[0])&&"FINALLY"!==n||"->"!==s&&"=>"!==s)},e=function(e,t){return this.tokens.splice(","===this.tag(t-1)?t-1:t,0,i)},this.scanTokens(function(r,o,a){var c,h,l,u,d;if(h=r[0],"TERMINATOR"===h&&"THEN"===this.tag(o+1))return a.splice(o,1),0;if("ELSE"===h&&"OUTDENT"!==this.tag(o-1))return a.splice.apply(a,[o,0].concat(v.call(this.indentation()))),2;if("CATCH"===h)for(c=l=1;2>=l;c=++l)if("OUTDENT"===(u=this.tag(o+c))||"TERMINATOR"===u||"FINALLY"===u)return a.splice.apply(a,[o+c,0].concat(v.call(this.indentation()))),2+c;return y.call(p,h)>=0&&"INDENT"!==this.tag(o+1)&&("ELSE"!==h||"IF"!==this.tag(o+1))?(s=h,d=this.indentation(!0),n=d[0],i=d[1],"THEN"===s&&(n.fromThen=!0),a.splice(o+1,0,n),this.detectEnd(o+2,t,e),"THEN"===h&&a.splice(o,1),1):1})},e.prototype.tagPostfixConditionals=function(){var e,t,n;return n=null,t=function(e,t){var n,i;return i=e[0],n=this.tokens[t-1][0],"TERMINATOR"===i||"INDENT"===i&&y.call(p,n)<0},e=function(e){return"INDENT"!==e[0]||e.generated&&!e.fromThen?n[0]="POST_"+n[0]:void 0},this.scanTokens(function(i,s){return"IF"!==i[0]?1:(n=i,this.detectEnd(s+1,t,e),1)})},e.prototype.indentation=function(e){var t,n;return null==e&&(e=!1),t=["INDENT",2],n=["OUTDENT",2],e&&(t.generated=n.generated=!0),e||(t.explicit=n.explicit=!0),[t,n]},e.prototype.generate=d,e.prototype.tag=function(e){var t;return null!=(t=this.tokens[e])?t[0]:void 0},e}(),t=[["(",")"],["[","]"],["{","}"],["INDENT","OUTDENT"],["CALL_START","CALL_END"],["PARAM_START","PARAM_END"],["INDEX_START","INDEX_END"]],e.INVERSES=h={},s=[],i=[],b=0,k=t.length;k>b;b++)g=t[b],f=g[0],m=g[1],s.push(h[m]=f),i.push(h[f]=m);n=["CATCH","WHEN","ELSE","FINALLY"].concat(i),a=["IDENTIFIER","SUPER",")","CALL_END","]","INDEX_END","@","THIS"],r=["IDENTIFIER","NUMBER","STRING","JS","REGEX","NEW","PARAM_START","CLASS","IF","TRY","SWITCH","THIS","BOOL","NULL","UNDEFINED","UNARY","SUPER","THROW","@","->","=>","[","(","{","--","++"],c=["+","-"],o=["POST_IF","FOR","WHILE","UNTIL","WHEN","BY","LOOP","TERMINATOR"],p=["ELSE","->","=>","TRY","FINALLY","THEN"],u=["TERMINATOR","CATCH","FINALLY","ELSE","OUTDENT","LEADING_WHEN"],l=["TERMINATOR","INDENT","OUTDENT"]}.call(this),t.exports}(),require["./lexer"]=function(){var e={},t={exports:e};return function(){var t,n,i,s,r,o,a,c,h,l,u,p,d,f,m,b,k,g,y,v,w,T,C,F,L,N,x,E,D,S,R,A,I,_,$,O,j,M,B,V,P,U,q,H,G,W,X,Y,K,z,J,Z,Q,et=[].indexOf||function(e){for(var t=0,n=this.length;n>t;t++)if(t in this&&this[t]===e)return t;return-1};Z=require("./rewriter"),O=Z.Rewriter,g=Z.INVERSES,Q=require("./helpers"),H=Q.count,z=Q.starts,q=Q.compact,X=Q.last,K=Q.repeat,G=Q.invertLiterate,Y=Q.locationDataToString,J=Q.throwSyntaxError,e.Lexer=L=function(){function e(){}return e.prototype.tokenize=function(e,t){var n,i,s,r;for(null==t&&(t={}),this.literate=t.literate,this.indent=0,this.indebt=0,this.outdebt=0,this.indents=[],this.ends=[],this.tokens=[],this.chunkLine=t.line||0,this.chunkColumn=t.column||0,e=this.clean(e),i=0;this.chunk=e.slice(i);)n=this.identifierToken()||this.commentToken()||this.whitespaceToken()||this.lineToken()||this.heredocToken()||this.stringToken()||this.numberToken()||this.regexToken()||this.jsToken()||this.literalToken(),r=this.getLineAndColumnFromChunk(n),this.chunkLine=r[0],this.chunkColumn=r[1],i+=n;return this.closeIndentation(),(s=this.ends.pop())&&this.error("missing "+s),t.rewrite===!1?this.tokens:(new O).rewrite(this.tokens)},e.prototype.clean=function(e){return e.charCodeAt(0)===t&&(e=e.slice(1)),e=e.replace(/\r/g,"").replace(V,""),U.test(e)&&(e="\n"+e,this.chunkLine--),this.literate&&(e=G(e)),e},e.prototype.identifierToken=function(){var e,t,n,i,s,c,h,l,u,p,d,f,m,k;return(h=b.exec(this.chunk))?(c=h[0],i=h[1],e=h[2],s=i.length,l=void 0,"own"===i&&"FOR"===this.tag()?(this.token("OWN",i),i.length):(n=e||(u=X(this.tokens))&&("."===(f=u[0])||"?."===f||"::"===f||"?::"===f||!u.spaced&&"@"===u[0]),p="IDENTIFIER",!n&&(et.call(w,i)>=0||et.call(a,i)>=0)&&(p=i.toUpperCase(),"WHEN"===p&&(m=this.tag(),et.call(T,m)>=0)?p="LEADING_WHEN":"FOR"===p?this.seenFor=!0:"UNLESS"===p?p="IF":et.call(P,p)>=0?p="UNARY":et.call(_,p)>=0&&("INSTANCEOF"!==p&&this.seenFor?(p="FOR"+p,this.seenFor=!1):(p="RELATION","!"===this.value()&&(l=this.tokens.pop(),i="!"+i)))),et.call(v,i)>=0&&(n?(p="IDENTIFIER",i=new String(i),i.reserved=!0):et.call($,i)>=0&&this.error('reserved word "'+i+'"')),n||(et.call(r,i)>=0&&(i=o[i]),p=function(){switch(i){case"!":return"UNARY";case"==":case"!=":return"COMPARE";case"&&":case"||":return"LOGIC";case"true":case"false":return"BOOL";case"break":case"continue":return"STATEMENT";default:return p}}()),d=this.token(p,i,0,s),l&&(k=[l[2].first_line,l[2].first_column],d[2].first_line=k[0],d[2].first_column=k[1]),e&&(t=c.lastIndexOf(":"),this.token(":",":",t,e.length)),c.length)):0},e.prototype.numberToken=function(){var e,t,n,i,s;return(n=R.exec(this.chunk))?(i=n[0],/^0[BOX]/.test(i)?this.error("radix prefix '"+i+"' must be lowercase"):/E/.test(i)&&!/^0x/.test(i)?this.error("exponential notation '"+i+"' must be indicated with a lowercase 'e'"):/^0\d*[89]/.test(i)?this.error("decimal literal '"+i+"' must not be prefixed with '0'"):/^0\d+/.test(i)&&this.error("octal literal '"+i+"' must be prefixed with '0o'"),t=i.length,(s=/^0o([0-7]+)/.exec(i))&&(i="0x"+parseInt(s[1],8).toString(16)),(e=/^0b([01]+)/.exec(i))&&(i="0x"+parseInt(e[1],2).toString(16)),this.token("NUMBER",i,0,t),t):0},e.prototype.stringToken=function(){var e,t,n;switch(this.chunk.charAt(0)){case"'":if(!(e=M.exec(this.chunk)))return 0;n=e[0],this.token("STRING",n.replace(x,"\\\n"),0,n.length);break;case'"':if(!(n=this.balancedString(this.chunk,'"')))return 0;0<n.indexOf("#{",1)?this.interpolateString(n.slice(1,-1),{strOffset:1,lexedLength:n.length}):this.token("STRING",this.escapeLines(n,0,n.length));break;default:return 0}return(t=/^(?:\\.|[^\\])*\\(?:0[0-7]|[1-7])/.test(n))&&this.error("octal escape sequences "+n+" are not allowed"),n.length},e.prototype.heredocToken=function(){var e,t,n,i;return(n=u.exec(this.chunk))?(t=n[0],i=t.charAt(0),e=this.sanitizeHeredoc(n[2],{quote:i,indent:null}),'"'===i&&0<=e.indexOf("#{")?this.interpolateString(e,{heredoc:!0,strOffset:3,lexedLength:t.length}):this.token("STRING",this.makeString(e,i,!0),0,t.length),t.length):0},e.prototype.commentToken=function(){var e,t,n;return(n=this.chunk.match(c))?(e=n[0],t=n[1],t&&this.token("HERECOMMENT",this.sanitizeHeredoc(t,{herecomment:!0,indent:K(" ",this.indent)}),0,e.length),e.length):0},e.prototype.jsToken=function(){var e,t;return"`"===this.chunk.charAt(0)&&(e=y.exec(this.chunk))?(this.token("JS",(t=e[0]).slice(1,-1),0,t.length),t.length):0},e.prototype.regexToken=function(){var e,t,n,i,s,r,o;return"/"!==this.chunk.charAt(0)?0:(n=f.exec(this.chunk))?t=this.heregexToken(n):(i=X(this.tokens),i&&(r=i[0],et.call(i.spaced?D:S,r)>=0)?0:(n=I.exec(this.chunk))?(o=n,n=o[0],s=o[1],e=o[2],"/*"===s.slice(0,2)&&this.error("regular expressions cannot begin with `*`"),"//"===s&&(s="/(?:)/"),this.token("REGEX",""+s+e,0,n.length),n.length):0)},e.prototype.heregexToken=function(e){var t,n,i,s,r,o,a,c,h,l,u,p,d,f,b,k;if(s=e[0],t=e[1],n=e[2],0>t.indexOf("#{"))return a=t.replace(m,"").replace(/\//g,"\\/"),a.match(/^\*/)&&this.error("regular expressions cannot begin with `*`"),this.token("REGEX","/"+(a||"(?:)")+"/"+n,0,s.length),s.length;for(this.token("IDENTIFIER","RegExp",0,0),this.token("CALL_START","(",0,0),l=[],f=this.interpolateString(t,{regex:!0}),p=0,d=f.length;d>p;p++){if(h=f[p],c=h[0],u=h[1],"TOKENS"===c)l.push.apply(l,u);else if("NEOSTRING"===c){if(!(u=u.replace(m,"")))continue;u=u.replace(/\\/g,"\\\\"),h[0]="STRING",h[1]=this.makeString(u,'"',!0),l.push(h)}else this.error("Unexpected "+c);o=X(this.tokens),r=["+","+"],r[2]=o[2],l.push(r)}return l.pop(),"STRING"!==(null!=(b=l[0])?b[0]:void 0)&&(this.token("STRING",'""',0,0),this.token("+","+",0,0)),(k=this.tokens).push.apply(k,l),n&&(i=s.lastIndexOf(n),this.token(",",",",i,0),this.token("STRING",'"'+n+'"',i,n.length)),this.token(")",")",s.length-1,0),s.length},e.prototype.lineToken=function(){var e,t,n,i,s;if(!(n=E.exec(this.chunk)))return 0;if(t=n[0],this.seenFor=!1,s=t.length-1-t.lastIndexOf("\n"),i=this.unfinished(),s-this.indebt===this.indent)return i?this.suppressNewlines():this.newlineToken(0),t.length;if(s>this.indent){if(i)return this.indebt=s-this.indent,this.suppressNewlines(),t.length;e=s-this.indent+this.outdebt,this.token("INDENT",e,t.length-s,s),this.indents.push(e),this.ends.push("OUTDENT"),this.outdebt=this.indebt=0}else this.indebt=0,this.outdentToken(this.indent-s,i,t.length);return this.indent=s,t.length},e.prototype.outdentToken=function(e,t,n){for(var i,s;e>0;)s=this.indents.length-1,void 0===this.indents[s]?e=0:this.indents[s]===this.outdebt?(e-=this.outdebt,this.outdebt=0):this.indents[s]<this.outdebt?(this.outdebt-=this.indents[s],e-=this.indents[s]):(i=this.indents.pop()+this.outdebt,e-=i,this.outdebt=0,this.pair("OUTDENT"),this.token("OUTDENT",i,0,n));for(i&&(this.outdebt-=e);";"===this.value();)this.tokens.pop();return"TERMINATOR"===this.tag()||t||this.token("TERMINATOR","\n",n,0),this},e.prototype.whitespaceToken=function(){var e,t,n;return(e=U.exec(this.chunk))||(t="\n"===this.chunk.charAt(0))?(n=X(this.tokens),n&&(n[e?"spaced":"newLine"]=!0),e?e[0].length:0):0},e.prototype.newlineToken=function(e){for(;";"===this.value();)this.tokens.pop();return"TERMINATOR"!==this.tag()&&this.token("TERMINATOR","\n",e,0),this},e.prototype.suppressNewlines=function(){return"\\"===this.value()&&this.tokens.pop(),this},e.prototype.literalToken=function(){var e,t,n,r,o,a,c,u;if((e=A.exec(this.chunk))?(r=e[0],s.test(r)&&this.tagParameters()):r=this.chunk.charAt(0),n=r,t=X(this.tokens),"="===r&&t&&(!t[1].reserved&&(o=t[1],et.call(v,o)>=0)&&this.error('reserved word "'+this.value()+"\" can't be assigned"),"||"===(a=t[1])||"&&"===a))return t[0]="COMPOUND_ASSIGN",t[1]+="=",r.length;if(";"===r)this.seenFor=!1,n="TERMINATOR";else if(et.call(N,r)>=0)n="MATH";else if(et.call(h,r)>=0)n="COMPARE";else if(et.call(l,r)>=0)n="COMPOUND_ASSIGN";else if(et.call(P,r)>=0)n="UNARY";else if(et.call(j,r)>=0)n="SHIFT";else if(et.call(F,r)>=0||"?"===r&&(null!=t?t.spaced:void 0))n="LOGIC";else if(t&&!t.spaced)if("("===r&&(c=t[0],et.call(i,c)>=0))"?"===t[0]&&(t[0]="FUNC_EXIST"),n="CALL_START";else if("["===r&&(u=t[0],et.call(k,u)>=0))switch(n="INDEX_START",t[0]){case"?":t[0]="INDEX_SOAK"}switch(r){case"(":case"{":case"[":this.ends.push(g[r]);break;case")":case"}":case"]":this.pair(r)}return this.token(n,r),r.length},e.prototype.sanitizeHeredoc=function(e,t){var n,i,s,r,o;if(s=t.indent,i=t.herecomment){if(p.test(e)&&this.error('block comment cannot contain "*/", starting'),e.indexOf("\n")<0)return e}else for(;r=d.exec(e);)n=r[1],(null===s||0<(o=n.length)&&o<s.length)&&(s=n);return s&&(e=e.replace(RegExp("\\n"+s,"g"),"\n")),i||(e=e.replace(/^\n/,"")),e},e.prototype.tagParameters=function(){var e,t,n,i;if(")"!==this.tag())return this;for(t=[],i=this.tokens,e=i.length,i[--e][0]="PARAM_END";n=i[--e];)switch(n[0]){case")":t.push(n);break;case"(":case"CALL_START":if(!t.length)return"("===n[0]?(n[0]="PARAM_START",this):this;t.pop()}return this},e.prototype.closeIndentation=function(){return this.outdentToken(this.indent)},e.prototype.balancedString=function(e,t){var n,i,s,r,o,a,c,h;for(n=0,a=[t],i=c=1,h=e.length;h>=1?h>c:c>h;i=h>=1?++c:--c)if(n)--n;else{switch(s=e.charAt(i)){case"\\":++n;continue;case t:if(a.pop(),!a.length)return e.slice(0,+i+1||9e9);t=a[a.length-1];continue}"}"!==t||'"'!==s&&"'"!==s?"}"===t&&"/"===s&&(r=f.exec(e.slice(i))||I.exec(e.slice(i)))?n+=r[0].length-1:"}"===t&&"{"===s?a.push(t="}"):'"'===t&&"#"===o&&"{"===s&&a.push(t="}"):a.push(t=s),o=s}return this.error("missing "+a.pop()+", starting")},e.prototype.interpolateString=function(t,n){var i,s,r,o,a,c,h,l,u,p,d,f,m,b,k,g,y,v,w,T,C,F,L,N,x,E,D,S;for(null==n&&(n={}),r=n.heredoc,y=n.regex,m=n.offsetInChunk,w=n.strOffset,u=n.lexedLength,m=m||0,w=w||0,u=u||t.length,r&&t.length>0&&"\n"===t[0]&&(t=t.slice(1),w++),F=[],b=0,o=-1;l=t.charAt(o+=1);)"\\"!==l?"#"===l&&"{"===t.charAt(o+1)&&(s=this.balancedString(t.slice(o+1),"}"))&&(o>b&&F.push(this.makeToken("NEOSTRING",t.slice(b,o),w+b)),a=s.slice(1,-1),a.length&&(E=this.getLineAndColumnFromChunk(w+o+1),p=E[0],i=E[1],f=(new e).tokenize(a,{line:p,column:i,rewrite:!1}),g=f.pop(),"TERMINATOR"===(null!=(D=f[0])?D[0]:void 0)&&(g=f.shift()),(h=f.length)&&(h>1&&(f.unshift(this.makeToken("(","(",w+o+1,0)),f.push(this.makeToken(")",")",w+o+1+a.length,0))),F.push(["TOKENS",f]))),o+=s.length,b=o+1):o+=1;if(o>b&&b<t.length&&F.push(this.makeToken("NEOSTRING",t.slice(b),w+b)),y)return F;if(!F.length)return this.token("STRING",'""',m,u);for("NEOSTRING"!==F[0][0]&&F.unshift(this.makeToken("NEOSTRING","",m)),(c=F.length>1)&&this.token("(","(",m,0),o=N=0,x=F.length;x>N;o=++N)C=F[o],T=C[0],L=C[1],o&&(o&&(k=this.token("+","+")),d="TOKENS"===T?L[0]:C,k[2]={first_line:d[2].first_line,first_column:d[2].first_column,last_line:d[2].first_line,last_column:d[2].first_column}),"TOKENS"===T?(S=this.tokens).push.apply(S,L):"NEOSTRING"===T?(C[0]="STRING",C[1]=this.makeString(L,'"',r),this.tokens.push(C)):this.error("Unexpected "+T);return c&&(v=this.makeToken(")",")",m+u,0),v.stringEnd=!0,this.tokens.push(v)),F},e.prototype.pair=function(e){var t,n;return e!==(n=X(this.ends))?("OUTDENT"!==n&&this.error("unmatched "+e),this.indent-=t=X(this.indents),this.outdentToken(t,!0),this.pair(e)):this.ends.pop()},e.prototype.getLineAndColumnFromChunk=function(e){var t,n,i,s;return 0===e?[this.chunkLine,this.chunkColumn]:(s=e>=this.chunk.length?this.chunk:this.chunk.slice(0,+(e-1)+1||9e9),n=H(s,"\n"),t=this.chunkColumn,n>0?(i=s.split("\n"),t=X(i).length):t+=s.length,[this.chunkLine+n,t])},e.prototype.makeToken=function(e,t,n,i){var s,r,o,a,c;return null==n&&(n=0),null==i&&(i=t.length),r={},a=this.getLineAndColumnFromChunk(n),r.first_line=a[0],r.first_column=a[1],s=Math.max(0,i-1),c=this.getLineAndColumnFromChunk(n+s),r.last_line=c[0],r.last_column=c[1],o=[e,t,r]},e.prototype.token=function(e,t,n,i){var s;return s=this.makeToken(e,t,n,i),this.tokens.push(s),s},e.prototype.tag=function(e,t){var n;return(n=X(this.tokens,e))&&(t?n[0]=t:n[0])},e.prototype.value=function(e,t){var n;return(n=X(this.tokens,e))&&(t?n[1]=t:n[1])},e.prototype.unfinished=function(){var e;return C.test(this.chunk)||"\\"===(e=this.tag())||"."===e||"?."===e||"?::"===e||"UNARY"===e||"MATH"===e||"+"===e||"-"===e||"SHIFT"===e||"RELATION"===e||"COMPARE"===e||"LOGIC"===e||"THROW"===e||"EXTENDS"===e},e.prototype.escapeLines=function(e,t){return e.replace(x,t?"\\n":"")},e.prototype.makeString=function(e,t,n){return e?(e=e.replace(/\\([\s\S])/g,function(e,n){return"\n"===n||n===t?n:e}),e=e.replace(RegExp(""+t,"g"),"\\$&"),t+this.escapeLines(e,n)+t):t+t},e.prototype.error=function(e){return J(e,{first_line:this.chunkLine,first_column:this.chunkColumn})},e}(),w=["true","false","null","this","new","delete","typeof","in","instanceof","return","throw","break","continue","debugger","if","else","switch","for","while","do","try","catch","finally","class","extends","super"],a=["undefined","then","unless","until","loop","of","by","when"],o={and:"&&",or:"||",is:"==",isnt:"!=",not:"!",yes:"true",no:"false",on:"true",off:"false"},r=function(){var e;e=[];for(W in o)e.push(W);return e}(),a=a.concat(r),$=["case","default","function","var","void","with","const","let","enum","export","import","native","__hasProp","__extends","__slice","__bind","__indexOf","implements","interface","package","private","protected","public","static","yield"],B=["arguments","eval"],v=w.concat($).concat(B),e.RESERVED=$.concat(w).concat(a).concat(B),e.STRICT_PROSCRIBED=B,t=65279,b=/^([$A-Za-z_\x7f-\uffff][$\w\x7f-\uffff]*)([^\n\S]*:(?!:))?/,R=/^0b[01]+|^0o[0-7]+|^0x[\da-f]+|^\d*\.?\d+(?:e[+-]?\d+)?/i,u=/^("""|''')([\s\S]*?)(?:\n[^\n\S]*)?\1/,A=/^(?:[-=]>|[-+*\/%<>&|^!?=]=|>>>=?|([-+:])\1|([&|<>])\2=?|\?(\.|::)|\.{2,3})/,U=/^[^\n\S]+/,c=/^###([^#][\s\S]*?)(?:###[^\n\S]*|(?:###)$)|^(?:\s*#(?!##[^#]).*)+/,s=/^[-=]>/,E=/^(?:\n[^\n\S]*)+/,M=/^'[^\\']*(?:\\.[^\\']*)*'/,y=/^`[^\\`]*(?:\\.[^\\`]*)*`/,I=/^(\/(?![\s=])[^[\/\n\\]*(?:(?:\\[\s\S]|\[[^\]\n\\]*(?:\\[\s\S][^\]\n\\]*)*])[^[\/\n\\]*)*\/)([imgy]{0,4})(?!\w)/,f=/^\/{3}([\s\S]+?)\/{3}([imgy]{0,4})(?!\w)/,m=/\s+(?:#.*)?/g,x=/\n/g,d=/\n+([^\n\S]*)/g,p=/\*\//,C=/^\s*(?:,|\??\.(?![.\d])|::)/,V=/\s+$/,l=["-=","+=","/=","*=","%=","||=","&&=","?=","<<=",">>=",">>>=","&=","^=","|="],P=["!","~","NEW","TYPEOF","DELETE","DO"],F=["&&","||","&","|","^"],j=["<<",">>",">>>"],h=["==","!=","<",">","<=",">="],N=["*","/","%"],_=["IN","OF","INSTANCEOF"],n=["TRUE","FALSE"],D=["NUMBER","REGEX","BOOL","NULL","UNDEFINED","++","--"],S=D.concat(")","}","THIS","IDENTIFIER","STRING","]"),i=["IDENTIFIER","STRING","REGEX",")","]","}","?","::","@","THIS","SUPER"],k=i.concat("NUMBER","BOOL","NULL","UNDEFINED"),T=["INDENT","OUTDENT","TERMINATOR"]}.call(this),t.exports}(),require["./parser"]=function(){var e={},t={exports:e},n=function(){function e(){this.yy={}}var t={trace:function(){},yy:{},symbols_:{error:2,Root:3,Body:4,Block:5,TERMINATOR:6,Line:7,Expression:8,Statement:9,Return:10,Comment:11,STATEMENT:12,Value:13,Invocation:14,Code:15,Operation:16,Assign:17,If:18,Try:19,While:20,For:21,Switch:22,Class:23,Throw:24,INDENT:25,OUTDENT:26,Identifier:27,IDENTIFIER:28,AlphaNumeric:29,NUMBER:30,STRING:31,Literal:32,JS:33,REGEX:34,DEBUGGER:35,UNDEFINED:36,NULL:37,BOOL:38,Assignable:39,"=":40,AssignObj:41,ObjAssignable:42,":":43,ThisProperty:44,RETURN:45,HERECOMMENT:46,PARAM_START:47,ParamList:48,PARAM_END:49,FuncGlyph:50,"->":51,"=>":52,OptComma:53,",":54,Param:55,ParamVar:56,"...":57,Array:58,Object:59,Splat:60,SimpleAssignable:61,Accessor:62,Parenthetical:63,Range:64,This:65,".":66,"?.":67,"::":68,"?::":69,Index:70,INDEX_START:71,IndexValue:72,INDEX_END:73,INDEX_SOAK:74,Slice:75,"{":76,AssignList:77,"}":78,CLASS:79,EXTENDS:80,OptFuncExist:81,Arguments:82,SUPER:83,FUNC_EXIST:84,CALL_START:85,CALL_END:86,ArgList:87,THIS:88,"@":89,"[":90,"]":91,RangeDots:92,"..":93,Arg:94,SimpleArgs:95,TRY:96,Catch:97,FINALLY:98,CATCH:99,THROW:100,"(":101,")":102,WhileSource:103,WHILE:104,WHEN:105,UNTIL:106,Loop:107,LOOP:108,ForBody:109,FOR:110,ForStart:111,ForSource:112,ForVariables:113,OWN:114,ForValue:115,FORIN:116,FOROF:117,BY:118,SWITCH:119,Whens:120,ELSE:121,When:122,LEADING_WHEN:123,IfBlock:124,IF:125,POST_IF:126,UNARY:127,"-":128,"+":129,"--":130,"++":131,"?":132,MATH:133,SHIFT:134,COMPARE:135,LOGIC:136,RELATION:137,COMPOUND_ASSIGN:138,$accept:0,$end:1},terminals_:{2:"error",6:"TERMINATOR",12:"STATEMENT",25:"INDENT",26:"OUTDENT",28:"IDENTIFIER",30:"NUMBER",31:"STRING",33:"JS",34:"REGEX",35:"DEBUGGER",36:"UNDEFINED",37:"NULL",38:"BOOL",40:"=",43:":",45:"RETURN",46:"HERECOMMENT",47:"PARAM_START",49:"PARAM_END",51:"->",52:"=>",54:",",57:"...",66:".",67:"?.",68:"::",69:"?::",71:"INDEX_START",73:"INDEX_END",74:"INDEX_SOAK",76:"{",78:"}",79:"CLASS",80:"EXTENDS",83:"SUPER",84:"FUNC_EXIST",85:"CALL_START",86:"CALL_END",88:"THIS",89:"@",90:"[",91:"]",93:"..",96:"TRY",98:"FINALLY",99:"CATCH",100:"THROW",101:"(",102:")",104:"WHILE",105:"WHEN",106:"UNTIL",108:"LOOP",110:"FOR",114:"OWN",116:"FORIN",117:"FOROF",118:"BY",119:"SWITCH",121:"ELSE",123:"LEADING_WHEN",125:"IF",126:"POST_IF",127:"UNARY",128:"-",129:"+",130:"--",131:"++",132:"?",133:"MATH",134:"SHIFT",135:"COMPARE",136:"LOGIC",137:"RELATION",138:"COMPOUND_ASSIGN"},productions_:[0,[3,0],[3,1],[3,2],[4,1],[4,3],[4,2],[7,1],[7,1],[9,1],[9,1],[9,1],[8,1],[8,1],[8,1],[8,1],[8,1],[8,1],[8,1],[8,1],[8,1],[8,1],[8,1],[8,1],[5,2],[5,3],[27,1],[29,1],[29,1],[32,1],[32,1],[32,1],[32,1],[32,1],[32,1],[32,1],[17,3],[17,4],[17,5],[41,1],[41,3],[41,5],[41,1],[42,1],[42,1],[42,1],[10,2],[10,1],[11,1],[15,5],[15,2],[50,1],[50,1],[53,0],[53,1],[48,0],[48,1],[48,3],[48,4],[48,6],[55,1],[55,2],[55,3],[56,1],[56,1],[56,1],[56,1],[60,2],[61,1],[61,2],[61,2],[61,1],[39,1],[39,1],[39,1],[13,1],[13,1],[13,1],[13,1],[13,1],[62,2],[62,2],[62,2],[62,2],[62,1],[62,1],[70,3],[70,2],[72,1],[72,1],[59,4],[77,0],[77,1],[77,3],[77,4],[77,6],[23,1],[23,2],[23,3],[23,4],[23,2],[23,3],[23,4],[23,5],[14,3],[14,3],[14,1],[14,2],[81,0],[81,1],[82,2],[82,4],[65,1],[65,1],[44,2],[58,2],[58,4],[92,1],[92,1],[64,5],[75,3],[75,2],[75,2],[75,1],[87,1],[87,3],[87,4],[87,4],[87,6],[94,1],[94,1],[95,1],[95,3],[19,2],[19,3],[19,4],[19,5],[97,3],[97,3],[97,2],[24,2],[63,3],[63,5],[103,2],[103,4],[103,2],[103,4],[20,2],[20,2],[20,2],[20,1],[107,2],[107,2],[21,2],[21,2],[21,2],[109,2],[109,2],[111,2],[111,3],[115,1],[115,1],[115,1],[115,1],[113,1],[113,3],[112,2],[112,2],[112,4],[112,4],[112,4],[112,6],[112,6],[22,5],[22,7],[22,4],[22,6],[120,1],[120,2],[122,3],[122,4],[124,3],[124,5],[18,1],[18,3],[18,3],[18,3],[16,2],[16,2],[16,2],[16,2],[16,2],[16,2],[16,2],[16,2],[16,3],[16,3],[16,3],[16,3],[16,3],[16,3],[16,3],[16,3],[16,5],[16,4],[16,3]],performAction:function(e,t,n,i,s,r,o){var a=r.length-1;switch(s){case 1:return this.$=i.addLocationDataFn(o[a],o[a])(new i.Block);case 2:return this.$=r[a];case 3:return this.$=r[a-1];case 4:this.$=i.addLocationDataFn(o[a],o[a])(i.Block.wrap([r[a]]));break;case 5:this.$=i.addLocationDataFn(o[a-2],o[a])(r[a-2].push(r[a]));break;case 6:this.$=r[a-1];break;case 7:this.$=r[a];break;case 8:this.$=r[a];break;case 9:this.$=r[a];break;case 10:this.$=r[a];break;case 11:this.$=i.addLocationDataFn(o[a],o[a])(new i.Literal(r[a]));break;case 12:this.$=r[a];break;case 13:this.$=r[a];break;case 14:this.$=r[a];break;case 15:this.$=r[a];break;case 16:this.$=r[a];break;case 17:this.$=r[a];break;case 18:this.$=r[a];break;case 19:this.$=r[a];break;case 20:this.$=r[a];break;case 21:this.$=r[a];break;case 22:this.$=r[a];break;case 23:this.$=r[a];break;case 24:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Block);break;case 25:this.$=i.addLocationDataFn(o[a-2],o[a])(r[a-1]);break;case 26:this.$=i.addLocationDataFn(o[a],o[a])(new i.Literal(r[a]));break;case 27:this.$=i.addLocationDataFn(o[a],o[a])(new i.Literal(r[a]));break;case 28:this.$=i.addLocationDataFn(o[a],o[a])(new i.Literal(r[a]));break;case 29:this.$=r[a];break;case 30:this.$=i.addLocationDataFn(o[a],o[a])(new i.Literal(r[a]));break;case 31:this.$=i.addLocationDataFn(o[a],o[a])(new i.Literal(r[a]));break;case 32:this.$=i.addLocationDataFn(o[a],o[a])(new i.Literal(r[a]));break;case 33:this.$=i.addLocationDataFn(o[a],o[a])(new i.Undefined);break;case 34:this.$=i.addLocationDataFn(o[a],o[a])(new i.Null);break;case 35:this.$=i.addLocationDataFn(o[a],o[a])(new i.Bool(r[a]));break;case 36:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Assign(r[a-2],r[a]));break;case 37:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.Assign(r[a-3],r[a]));break;case 38:this.$=i.addLocationDataFn(o[a-4],o[a])(new i.Assign(r[a-4],r[a-1]));break;case 39:this.$=i.addLocationDataFn(o[a],o[a])(new i.Value(r[a]));break;case 40:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Assign(i.addLocationDataFn(o[a-2])(new i.Value(r[a-2])),r[a],"object"));break;case 41:this.$=i.addLocationDataFn(o[a-4],o[a])(new i.Assign(i.addLocationDataFn(o[a-4])(new i.Value(r[a-4])),r[a-1],"object"));break;case 42:this.$=r[a];break;case 43:this.$=r[a];break;case 44:this.$=r[a];break;case 45:this.$=r[a];break;case 46:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Return(r[a]));break;case 47:this.$=i.addLocationDataFn(o[a],o[a])(new i.Return);break;case 48:this.$=i.addLocationDataFn(o[a],o[a])(new i.Comment(r[a]));break;case 49:this.$=i.addLocationDataFn(o[a-4],o[a])(new i.Code(r[a-3],r[a],r[a-1]));break;case 50:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Code([],r[a],r[a-1]));
break;case 51:this.$=i.addLocationDataFn(o[a],o[a])("func");break;case 52:this.$=i.addLocationDataFn(o[a],o[a])("boundfunc");break;case 53:this.$=r[a];break;case 54:this.$=r[a];break;case 55:this.$=i.addLocationDataFn(o[a],o[a])([]);break;case 56:this.$=i.addLocationDataFn(o[a],o[a])([r[a]]);break;case 57:this.$=i.addLocationDataFn(o[a-2],o[a])(r[a-2].concat(r[a]));break;case 58:this.$=i.addLocationDataFn(o[a-3],o[a])(r[a-3].concat(r[a]));break;case 59:this.$=i.addLocationDataFn(o[a-5],o[a])(r[a-5].concat(r[a-2]));break;case 60:this.$=i.addLocationDataFn(o[a],o[a])(new i.Param(r[a]));break;case 61:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Param(r[a-1],null,!0));break;case 62:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Param(r[a-2],r[a]));break;case 63:this.$=r[a];break;case 64:this.$=r[a];break;case 65:this.$=r[a];break;case 66:this.$=r[a];break;case 67:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Splat(r[a-1]));break;case 68:this.$=i.addLocationDataFn(o[a],o[a])(new i.Value(r[a]));break;case 69:this.$=i.addLocationDataFn(o[a-1],o[a])(r[a-1].add(r[a]));break;case 70:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Value(r[a-1],[].concat(r[a])));break;case 71:this.$=r[a];break;case 72:this.$=r[a];break;case 73:this.$=i.addLocationDataFn(o[a],o[a])(new i.Value(r[a]));break;case 74:this.$=i.addLocationDataFn(o[a],o[a])(new i.Value(r[a]));break;case 75:this.$=r[a];break;case 76:this.$=i.addLocationDataFn(o[a],o[a])(new i.Value(r[a]));break;case 77:this.$=i.addLocationDataFn(o[a],o[a])(new i.Value(r[a]));break;case 78:this.$=i.addLocationDataFn(o[a],o[a])(new i.Value(r[a]));break;case 79:this.$=r[a];break;case 80:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Access(r[a]));break;case 81:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Access(r[a],"soak"));break;case 82:this.$=i.addLocationDataFn(o[a-1],o[a])([i.addLocationDataFn(o[a-1])(new i.Access(new i.Literal("prototype"))),i.addLocationDataFn(o[a])(new i.Access(r[a]))]);break;case 83:this.$=i.addLocationDataFn(o[a-1],o[a])([i.addLocationDataFn(o[a-1])(new i.Access(new i.Literal("prototype"),"soak")),i.addLocationDataFn(o[a])(new i.Access(r[a]))]);break;case 84:this.$=i.addLocationDataFn(o[a],o[a])(new i.Access(new i.Literal("prototype")));break;case 85:this.$=r[a];break;case 86:this.$=i.addLocationDataFn(o[a-2],o[a])(r[a-1]);break;case 87:this.$=i.addLocationDataFn(o[a-1],o[a])(i.extend(r[a],{soak:!0}));break;case 88:this.$=i.addLocationDataFn(o[a],o[a])(new i.Index(r[a]));break;case 89:this.$=i.addLocationDataFn(o[a],o[a])(new i.Slice(r[a]));break;case 90:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.Obj(r[a-2],r[a-3].generated));break;case 91:this.$=i.addLocationDataFn(o[a],o[a])([]);break;case 92:this.$=i.addLocationDataFn(o[a],o[a])([r[a]]);break;case 93:this.$=i.addLocationDataFn(o[a-2],o[a])(r[a-2].concat(r[a]));break;case 94:this.$=i.addLocationDataFn(o[a-3],o[a])(r[a-3].concat(r[a]));break;case 95:this.$=i.addLocationDataFn(o[a-5],o[a])(r[a-5].concat(r[a-2]));break;case 96:this.$=i.addLocationDataFn(o[a],o[a])(new i.Class);break;case 97:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Class(null,null,r[a]));break;case 98:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Class(null,r[a]));break;case 99:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.Class(null,r[a-1],r[a]));break;case 100:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Class(r[a]));break;case 101:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Class(r[a-1],null,r[a]));break;case 102:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.Class(r[a-2],r[a]));break;case 103:this.$=i.addLocationDataFn(o[a-4],o[a])(new i.Class(r[a-3],r[a-1],r[a]));break;case 104:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Call(r[a-2],r[a],r[a-1]));break;case 105:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Call(r[a-2],r[a],r[a-1]));break;case 106:this.$=i.addLocationDataFn(o[a],o[a])(new i.Call("super",[new i.Splat(new i.Literal("arguments"))]));break;case 107:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Call("super",r[a]));break;case 108:this.$=i.addLocationDataFn(o[a],o[a])(!1);break;case 109:this.$=i.addLocationDataFn(o[a],o[a])(!0);break;case 110:this.$=i.addLocationDataFn(o[a-1],o[a])([]);break;case 111:this.$=i.addLocationDataFn(o[a-3],o[a])(r[a-2]);break;case 112:this.$=i.addLocationDataFn(o[a],o[a])(new i.Value(new i.Literal("this")));break;case 113:this.$=i.addLocationDataFn(o[a],o[a])(new i.Value(new i.Literal("this")));break;case 114:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Value(i.addLocationDataFn(o[a-1])(new i.Literal("this")),[i.addLocationDataFn(o[a])(new i.Access(r[a]))],"this"));break;case 115:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Arr([]));break;case 116:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.Arr(r[a-2]));break;case 117:this.$=i.addLocationDataFn(o[a],o[a])("inclusive");break;case 118:this.$=i.addLocationDataFn(o[a],o[a])("exclusive");break;case 119:this.$=i.addLocationDataFn(o[a-4],o[a])(new i.Range(r[a-3],r[a-1],r[a-2]));break;case 120:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Range(r[a-2],r[a],r[a-1]));break;case 121:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Range(r[a-1],null,r[a]));break;case 122:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Range(null,r[a],r[a-1]));break;case 123:this.$=i.addLocationDataFn(o[a],o[a])(new i.Range(null,null,r[a]));break;case 124:this.$=i.addLocationDataFn(o[a],o[a])([r[a]]);break;case 125:this.$=i.addLocationDataFn(o[a-2],o[a])(r[a-2].concat(r[a]));break;case 126:this.$=i.addLocationDataFn(o[a-3],o[a])(r[a-3].concat(r[a]));break;case 127:this.$=i.addLocationDataFn(o[a-3],o[a])(r[a-2]);break;case 128:this.$=i.addLocationDataFn(o[a-5],o[a])(r[a-5].concat(r[a-2]));break;case 129:this.$=r[a];break;case 130:this.$=r[a];break;case 131:this.$=r[a];break;case 132:this.$=i.addLocationDataFn(o[a-2],o[a])([].concat(r[a-2],r[a]));break;case 133:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Try(r[a]));break;case 134:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Try(r[a-1],r[a][0],r[a][1]));break;case 135:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.Try(r[a-2],null,null,r[a]));break;case 136:this.$=i.addLocationDataFn(o[a-4],o[a])(new i.Try(r[a-3],r[a-2][0],r[a-2][1],r[a]));break;case 137:this.$=i.addLocationDataFn(o[a-2],o[a])([r[a-1],r[a]]);break;case 138:this.$=i.addLocationDataFn(o[a-2],o[a])([i.addLocationDataFn(o[a-1])(new i.Value(r[a-1])),r[a]]);break;case 139:this.$=i.addLocationDataFn(o[a-1],o[a])([null,r[a]]);break;case 140:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Throw(r[a]));break;case 141:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Parens(r[a-1]));break;case 142:this.$=i.addLocationDataFn(o[a-4],o[a])(new i.Parens(r[a-2]));break;case 143:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.While(r[a]));break;case 144:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.While(r[a-2],{guard:r[a]}));break;case 145:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.While(r[a],{invert:!0}));break;case 146:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.While(r[a-2],{invert:!0,guard:r[a]}));break;case 147:this.$=i.addLocationDataFn(o[a-1],o[a])(r[a-1].addBody(r[a]));break;case 148:this.$=i.addLocationDataFn(o[a-1],o[a])(r[a].addBody(i.addLocationDataFn(o[a-1])(i.Block.wrap([r[a-1]]))));break;case 149:this.$=i.addLocationDataFn(o[a-1],o[a])(r[a].addBody(i.addLocationDataFn(o[a-1])(i.Block.wrap([r[a-1]]))));break;case 150:this.$=i.addLocationDataFn(o[a],o[a])(r[a]);break;case 151:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.While(i.addLocationDataFn(o[a-1])(new i.Literal("true"))).addBody(r[a]));break;case 152:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.While(i.addLocationDataFn(o[a-1])(new i.Literal("true"))).addBody(i.addLocationDataFn(o[a])(i.Block.wrap([r[a]]))));break;case 153:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.For(r[a-1],r[a]));break;case 154:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.For(r[a-1],r[a]));break;case 155:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.For(r[a],r[a-1]));break;case 156:this.$=i.addLocationDataFn(o[a-1],o[a])({source:i.addLocationDataFn(o[a])(new i.Value(r[a]))});break;case 157:this.$=i.addLocationDataFn(o[a-1],o[a])(function(){return r[a].own=r[a-1].own,r[a].name=r[a-1][0],r[a].index=r[a-1][1],r[a]}());break;case 158:this.$=i.addLocationDataFn(o[a-1],o[a])(r[a]);break;case 159:this.$=i.addLocationDataFn(o[a-2],o[a])(function(){return r[a].own=!0,r[a]}());break;case 160:this.$=r[a];break;case 161:this.$=r[a];break;case 162:this.$=i.addLocationDataFn(o[a],o[a])(new i.Value(r[a]));break;case 163:this.$=i.addLocationDataFn(o[a],o[a])(new i.Value(r[a]));break;case 164:this.$=i.addLocationDataFn(o[a],o[a])([r[a]]);break;case 165:this.$=i.addLocationDataFn(o[a-2],o[a])([r[a-2],r[a]]);break;case 166:this.$=i.addLocationDataFn(o[a-1],o[a])({source:r[a]});break;case 167:this.$=i.addLocationDataFn(o[a-1],o[a])({source:r[a],object:!0});break;case 168:this.$=i.addLocationDataFn(o[a-3],o[a])({source:r[a-2],guard:r[a]});break;case 169:this.$=i.addLocationDataFn(o[a-3],o[a])({source:r[a-2],guard:r[a],object:!0});break;case 170:this.$=i.addLocationDataFn(o[a-3],o[a])({source:r[a-2],step:r[a]});break;case 171:this.$=i.addLocationDataFn(o[a-5],o[a])({source:r[a-4],guard:r[a-2],step:r[a]});break;case 172:this.$=i.addLocationDataFn(o[a-5],o[a])({source:r[a-4],step:r[a-2],guard:r[a]});break;case 173:this.$=i.addLocationDataFn(o[a-4],o[a])(new i.Switch(r[a-3],r[a-1]));break;case 174:this.$=i.addLocationDataFn(o[a-6],o[a])(new i.Switch(r[a-5],r[a-3],r[a-1]));break;case 175:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.Switch(null,r[a-1]));break;case 176:this.$=i.addLocationDataFn(o[a-5],o[a])(new i.Switch(null,r[a-3],r[a-1]));break;case 177:this.$=r[a];break;case 178:this.$=i.addLocationDataFn(o[a-1],o[a])(r[a-1].concat(r[a]));break;case 179:this.$=i.addLocationDataFn(o[a-2],o[a])([[r[a-1],r[a]]]);break;case 180:this.$=i.addLocationDataFn(o[a-3],o[a])([[r[a-2],r[a-1]]]);break;case 181:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.If(r[a-1],r[a],{type:r[a-2]}));break;case 182:this.$=i.addLocationDataFn(o[a-4],o[a])(r[a-4].addElse(new i.If(r[a-1],r[a],{type:r[a-2]})));break;case 183:this.$=r[a];break;case 184:this.$=i.addLocationDataFn(o[a-2],o[a])(r[a-2].addElse(r[a]));break;case 185:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.If(r[a],i.addLocationDataFn(o[a-2])(i.Block.wrap([r[a-2]])),{type:r[a-1],statement:!0}));break;case 186:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.If(r[a],i.addLocationDataFn(o[a-2])(i.Block.wrap([r[a-2]])),{type:r[a-1],statement:!0}));break;case 187:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Op(r[a-1],r[a]));break;case 188:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Op("-",r[a]));break;case 189:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Op("+",r[a]));break;case 190:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Op("--",r[a]));break;case 191:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Op("++",r[a]));break;case 192:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Op("--",r[a-1],null,!0));break;case 193:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Op("++",r[a-1],null,!0));break;case 194:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Existence(r[a-1]));break;case 195:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Op("+",r[a-2],r[a]));break;case 196:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Op("-",r[a-2],r[a]));break;case 197:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Op(r[a-1],r[a-2],r[a]));break;case 198:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Op(r[a-1],r[a-2],r[a]));break;case 199:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Op(r[a-1],r[a-2],r[a]));break;case 200:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Op(r[a-1],r[a-2],r[a]));break;case 201:this.$=i.addLocationDataFn(o[a-2],o[a])(function(){return"!"===r[a-1].charAt(0)?new i.Op(r[a-1].slice(1),r[a-2],r[a]).invert():new i.Op(r[a-1],r[a-2],r[a])}());break;case 202:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Assign(r[a-2],r[a],r[a-1]));break;case 203:this.$=i.addLocationDataFn(o[a-4],o[a])(new i.Assign(r[a-4],r[a-1],r[a-3]));break;case 204:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.Assign(r[a-3],r[a],r[a-2]));break;case 205:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Extends(r[a-2],r[a]))}},table:[{1:[2,1],3:1,4:2,5:3,7:4,8:6,9:7,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:[1,5],27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{1:[3]},{1:[2,2],6:[1,74]},{6:[1,75]},{1:[2,4],6:[2,4],26:[2,4],102:[2,4]},{4:77,7:4,8:6,9:7,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,26:[1,76],27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{1:[2,7],6:[2,7],26:[2,7],102:[2,7],103:87,104:[1,65],106:[1,66],109:88,110:[1,68],111:69,126:[1,86],128:[1,80],129:[1,79],132:[1,78],133:[1,81],134:[1,82],135:[1,83],136:[1,84],137:[1,85]},{1:[2,8],6:[2,8],26:[2,8],102:[2,8],103:90,104:[1,65],106:[1,66],109:91,110:[1,68],111:69,126:[1,89]},{1:[2,12],6:[2,12],25:[2,12],26:[2,12],49:[2,12],54:[2,12],57:[2,12],62:93,66:[1,95],67:[1,96],68:[1,97],69:[1,98],70:99,71:[1,100],73:[2,12],74:[1,101],78:[2,12],81:92,84:[1,94],85:[2,108],86:[2,12],91:[2,12],93:[2,12],102:[2,12],104:[2,12],105:[2,12],106:[2,12],110:[2,12],118:[2,12],126:[2,12],128:[2,12],129:[2,12],132:[2,12],133:[2,12],134:[2,12],135:[2,12],136:[2,12],137:[2,12]},{1:[2,13],6:[2,13],25:[2,13],26:[2,13],49:[2,13],54:[2,13],57:[2,13],62:103,66:[1,95],67:[1,96],68:[1,97],69:[1,98],70:99,71:[1,100],73:[2,13],74:[1,101],78:[2,13],81:102,84:[1,94],85:[2,108],86:[2,13],91:[2,13],93:[2,13],102:[2,13],104:[2,13],105:[2,13],106:[2,13],110:[2,13],118:[2,13],126:[2,13],128:[2,13],129:[2,13],132:[2,13],133:[2,13],134:[2,13],135:[2,13],136:[2,13],137:[2,13]},{1:[2,14],6:[2,14],25:[2,14],26:[2,14],49:[2,14],54:[2,14],57:[2,14],73:[2,14],78:[2,14],86:[2,14],91:[2,14],93:[2,14],102:[2,14],104:[2,14],105:[2,14],106:[2,14],110:[2,14],118:[2,14],126:[2,14],128:[2,14],129:[2,14],132:[2,14],133:[2,14],134:[2,14],135:[2,14],136:[2,14],137:[2,14]},{1:[2,15],6:[2,15],25:[2,15],26:[2,15],49:[2,15],54:[2,15],57:[2,15],73:[2,15],78:[2,15],86:[2,15],91:[2,15],93:[2,15],102:[2,15],104:[2,15],105:[2,15],106:[2,15],110:[2,15],118:[2,15],126:[2,15],128:[2,15],129:[2,15],132:[2,15],133:[2,15],134:[2,15],135:[2,15],136:[2,15],137:[2,15]},{1:[2,16],6:[2,16],25:[2,16],26:[2,16],49:[2,16],54:[2,16],57:[2,16],73:[2,16],78:[2,16],86:[2,16],91:[2,16],93:[2,16],102:[2,16],104:[2,16],105:[2,16],106:[2,16],110:[2,16],118:[2,16],126:[2,16],128:[2,16],129:[2,16],132:[2,16],133:[2,16],134:[2,16],135:[2,16],136:[2,16],137:[2,16]},{1:[2,17],6:[2,17],25:[2,17],26:[2,17],49:[2,17],54:[2,17],57:[2,17],73:[2,17],78:[2,17],86:[2,17],91:[2,17],93:[2,17],102:[2,17],104:[2,17],105:[2,17],106:[2,17],110:[2,17],118:[2,17],126:[2,17],128:[2,17],129:[2,17],132:[2,17],133:[2,17],134:[2,17],135:[2,17],136:[2,17],137:[2,17]},{1:[2,18],6:[2,18],25:[2,18],26:[2,18],49:[2,18],54:[2,18],57:[2,18],73:[2,18],78:[2,18],86:[2,18],91:[2,18],93:[2,18],102:[2,18],104:[2,18],105:[2,18],106:[2,18],110:[2,18],118:[2,18],126:[2,18],128:[2,18],129:[2,18],132:[2,18],133:[2,18],134:[2,18],135:[2,18],136:[2,18],137:[2,18]},{1:[2,19],6:[2,19],25:[2,19],26:[2,19],49:[2,19],54:[2,19],57:[2,19],73:[2,19],78:[2,19],86:[2,19],91:[2,19],93:[2,19],102:[2,19],104:[2,19],105:[2,19],106:[2,19],110:[2,19],118:[2,19],126:[2,19],128:[2,19],129:[2,19],132:[2,19],133:[2,19],134:[2,19],135:[2,19],136:[2,19],137:[2,19]},{1:[2,20],6:[2,20],25:[2,20],26:[2,20],49:[2,20],54:[2,20],57:[2,20],73:[2,20],78:[2,20],86:[2,20],91:[2,20],93:[2,20],102:[2,20],104:[2,20],105:[2,20],106:[2,20],110:[2,20],118:[2,20],126:[2,20],128:[2,20],129:[2,20],132:[2,20],133:[2,20],134:[2,20],135:[2,20],136:[2,20],137:[2,20]},{1:[2,21],6:[2,21],25:[2,21],26:[2,21],49:[2,21],54:[2,21],57:[2,21],73:[2,21],78:[2,21],86:[2,21],91:[2,21],93:[2,21],102:[2,21],104:[2,21],105:[2,21],106:[2,21],110:[2,21],118:[2,21],126:[2,21],128:[2,21],129:[2,21],132:[2,21],133:[2,21],134:[2,21],135:[2,21],136:[2,21],137:[2,21]},{1:[2,22],6:[2,22],25:[2,22],26:[2,22],49:[2,22],54:[2,22],57:[2,22],73:[2,22],78:[2,22],86:[2,22],91:[2,22],93:[2,22],102:[2,22],104:[2,22],105:[2,22],106:[2,22],110:[2,22],118:[2,22],126:[2,22],128:[2,22],129:[2,22],132:[2,22],133:[2,22],134:[2,22],135:[2,22],136:[2,22],137:[2,22]},{1:[2,23],6:[2,23],25:[2,23],26:[2,23],49:[2,23],54:[2,23],57:[2,23],73:[2,23],78:[2,23],86:[2,23],91:[2,23],93:[2,23],102:[2,23],104:[2,23],105:[2,23],106:[2,23],110:[2,23],118:[2,23],126:[2,23],128:[2,23],129:[2,23],132:[2,23],133:[2,23],134:[2,23],135:[2,23],136:[2,23],137:[2,23]},{1:[2,9],6:[2,9],26:[2,9],102:[2,9],104:[2,9],106:[2,9],110:[2,9],126:[2,9]},{1:[2,10],6:[2,10],26:[2,10],102:[2,10],104:[2,10],106:[2,10],110:[2,10],126:[2,10]},{1:[2,11],6:[2,11],26:[2,11],102:[2,11],104:[2,11],106:[2,11],110:[2,11],126:[2,11]},{1:[2,75],6:[2,75],25:[2,75],26:[2,75],40:[1,104],49:[2,75],54:[2,75],57:[2,75],66:[2,75],67:[2,75],68:[2,75],69:[2,75],71:[2,75],73:[2,75],74:[2,75],78:[2,75],84:[2,75],85:[2,75],86:[2,75],91:[2,75],93:[2,75],102:[2,75],104:[2,75],105:[2,75],106:[2,75],110:[2,75],118:[2,75],126:[2,75],128:[2,75],129:[2,75],132:[2,75],133:[2,75],134:[2,75],135:[2,75],136:[2,75],137:[2,75]},{1:[2,76],6:[2,76],25:[2,76],26:[2,76],49:[2,76],54:[2,76],57:[2,76],66:[2,76],67:[2,76],68:[2,76],69:[2,76],71:[2,76],73:[2,76],74:[2,76],78:[2,76],84:[2,76],85:[2,76],86:[2,76],91:[2,76],93:[2,76],102:[2,76],104:[2,76],105:[2,76],106:[2,76],110:[2,76],118:[2,76],126:[2,76],128:[2,76],129:[2,76],132:[2,76],133:[2,76],134:[2,76],135:[2,76],136:[2,76],137:[2,76]},{1:[2,77],6:[2,77],25:[2,77],26:[2,77],49:[2,77],54:[2,77],57:[2,77],66:[2,77],67:[2,77],68:[2,77],69:[2,77],71:[2,77],73:[2,77],74:[2,77],78:[2,77],84:[2,77],85:[2,77],86:[2,77],91:[2,77],93:[2,77],102:[2,77],104:[2,77],105:[2,77],106:[2,77],110:[2,77],118:[2,77],126:[2,77],128:[2,77],129:[2,77],132:[2,77],133:[2,77],134:[2,77],135:[2,77],136:[2,77],137:[2,77]},{1:[2,78],6:[2,78],25:[2,78],26:[2,78],49:[2,78],54:[2,78],57:[2,78],66:[2,78],67:[2,78],68:[2,78],69:[2,78],71:[2,78],73:[2,78],74:[2,78],78:[2,78],84:[2,78],85:[2,78],86:[2,78],91:[2,78],93:[2,78],102:[2,78],104:[2,78],105:[2,78],106:[2,78],110:[2,78],118:[2,78],126:[2,78],128:[2,78],129:[2,78],132:[2,78],133:[2,78],134:[2,78],135:[2,78],136:[2,78],137:[2,78]},{1:[2,79],6:[2,79],25:[2,79],26:[2,79],49:[2,79],54:[2,79],57:[2,79],66:[2,79],67:[2,79],68:[2,79],69:[2,79],71:[2,79],73:[2,79],74:[2,79],78:[2,79],84:[2,79],85:[2,79],86:[2,79],91:[2,79],93:[2,79],102:[2,79],104:[2,79],105:[2,79],106:[2,79],110:[2,79],118:[2,79],126:[2,79],128:[2,79],129:[2,79],132:[2,79],133:[2,79],134:[2,79],135:[2,79],136:[2,79],137:[2,79]},{1:[2,106],6:[2,106],25:[2,106],26:[2,106],49:[2,106],54:[2,106],57:[2,106],66:[2,106],67:[2,106],68:[2,106],69:[2,106],71:[2,106],73:[2,106],74:[2,106],78:[2,106],82:105,84:[2,106],85:[1,106],86:[2,106],91:[2,106],93:[2,106],102:[2,106],104:[2,106],105:[2,106],106:[2,106],110:[2,106],118:[2,106],126:[2,106],128:[2,106],129:[2,106],132:[2,106],133:[2,106],134:[2,106],135:[2,106],136:[2,106],137:[2,106]},{6:[2,55],25:[2,55],27:110,28:[1,73],44:111,48:107,49:[2,55],54:[2,55],55:108,56:109,58:112,59:113,76:[1,70],89:[1,114],90:[1,115]},{5:116,25:[1,5]},{8:117,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{8:119,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{8:120,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{13:122,14:123,27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:124,44:63,58:47,59:48,61:121,63:25,64:26,65:27,76:[1,70],83:[1,28],88:[1,58],89:[1,59],90:[1,57],101:[1,56]},{13:122,14:123,27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:124,44:63,58:47,59:48,61:125,63:25,64:26,65:27,76:[1,70],83:[1,28],88:[1,58],89:[1,59],90:[1,57],101:[1,56]},{1:[2,72],6:[2,72],25:[2,72],26:[2,72],40:[2,72],49:[2,72],54:[2,72],57:[2,72],66:[2,72],67:[2,72],68:[2,72],69:[2,72],71:[2,72],73:[2,72],74:[2,72],78:[2,72],80:[1,129],84:[2,72],85:[2,72],86:[2,72],91:[2,72],93:[2,72],102:[2,72],104:[2,72],105:[2,72],106:[2,72],110:[2,72],118:[2,72],126:[2,72],128:[2,72],129:[2,72],130:[1,126],131:[1,127],132:[2,72],133:[2,72],134:[2,72],135:[2,72],136:[2,72],137:[2,72],138:[1,128]},{1:[2,183],6:[2,183],25:[2,183],26:[2,183],49:[2,183],54:[2,183],57:[2,183],73:[2,183],78:[2,183],86:[2,183],91:[2,183],93:[2,183],102:[2,183],104:[2,183],105:[2,183],106:[2,183],110:[2,183],118:[2,183],121:[1,130],126:[2,183],128:[2,183],129:[2,183],132:[2,183],133:[2,183],134:[2,183],135:[2,183],136:[2,183],137:[2,183]},{5:131,25:[1,5]},{5:132,25:[1,5]},{1:[2,150],6:[2,150],25:[2,150],26:[2,150],49:[2,150],54:[2,150],57:[2,150],73:[2,150],78:[2,150],86:[2,150],91:[2,150],93:[2,150],102:[2,150],104:[2,150],105:[2,150],106:[2,150],110:[2,150],118:[2,150],126:[2,150],128:[2,150],129:[2,150],132:[2,150],133:[2,150],134:[2,150],135:[2,150],136:[2,150],137:[2,150]},{5:133,25:[1,5]},{8:134,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:[1,135],27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{1:[2,96],5:136,6:[2,96],13:122,14:123,25:[1,5],26:[2,96],27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:124,44:63,49:[2,96],54:[2,96],57:[2,96],58:47,59:48,61:138,63:25,64:26,65:27,73:[2,96],76:[1,70],78:[2,96],80:[1,137],83:[1,28],86:[2,96],88:[1,58],89:[1,59],90:[1,57],91:[2,96],93:[2,96],101:[1,56],102:[2,96],104:[2,96],105:[2,96],106:[2,96],110:[2,96],118:[2,96],126:[2,96],128:[2,96],129:[2,96],132:[2,96],133:[2,96],134:[2,96],135:[2,96],136:[2,96],137:[2,96]},{8:139,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{1:[2,47],6:[2,47],8:140,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,26:[2,47],27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],102:[2,47],103:39,104:[2,47],106:[2,47],107:40,108:[1,67],109:41,110:[2,47],111:69,119:[1,42],124:37,125:[1,64],126:[2,47],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{1:[2,48],6:[2,48],25:[2,48],26:[2,48],54:[2,48],78:[2,48],102:[2,48],104:[2,48],106:[2,48],110:[2,48],126:[2,48]},{1:[2,73],6:[2,73],25:[2,73],26:[2,73],40:[2,73],49:[2,73],54:[2,73],57:[2,73],66:[2,73],67:[2,73],68:[2,73],69:[2,73],71:[2,73],73:[2,73],74:[2,73],78:[2,73],84:[2,73],85:[2,73],86:[2,73],91:[2,73],93:[2,73],102:[2,73],104:[2,73],105:[2,73],106:[2,73],110:[2,73],118:[2,73],126:[2,73],128:[2,73],129:[2,73],132:[2,73],133:[2,73],134:[2,73],135:[2,73],136:[2,73],137:[2,73]},{1:[2,74],6:[2,74],25:[2,74],26:[2,74],40:[2,74],49:[2,74],54:[2,74],57:[2,74],66:[2,74],67:[2,74],68:[2,74],69:[2,74],71:[2,74],73:[2,74],74:[2,74],78:[2,74],84:[2,74],85:[2,74],86:[2,74],91:[2,74],93:[2,74],102:[2,74],104:[2,74],105:[2,74],106:[2,74],110:[2,74],118:[2,74],126:[2,74],128:[2,74],129:[2,74],132:[2,74],133:[2,74],134:[2,74],135:[2,74],136:[2,74],137:[2,74]},{1:[2,29],6:[2,29],25:[2,29],26:[2,29],49:[2,29],54:[2,29],57:[2,29],66:[2,29],67:[2,29],68:[2,29],69:[2,29],71:[2,29],73:[2,29],74:[2,29],78:[2,29],84:[2,29],85:[2,29],86:[2,29],91:[2,29],93:[2,29],102:[2,29],104:[2,29],105:[2,29],106:[2,29],110:[2,29],118:[2,29],126:[2,29],128:[2,29],129:[2,29],132:[2,29],133:[2,29],134:[2,29],135:[2,29],136:[2,29],137:[2,29]},{1:[2,30],6:[2,30],25:[2,30],26:[2,30],49:[2,30],54:[2,30],57:[2,30],66:[2,30],67:[2,30],68:[2,30],69:[2,30],71:[2,30],73:[2,30],74:[2,30],78:[2,30],84:[2,30],85:[2,30],86:[2,30],91:[2,30],93:[2,30],102:[2,30],104:[2,30],105:[2,30],106:[2,30],110:[2,30],118:[2,30],126:[2,30],128:[2,30],129:[2,30],132:[2,30],133:[2,30],134:[2,30],135:[2,30],136:[2,30],137:[2,30]},{1:[2,31],6:[2,31],25:[2,31],26:[2,31],49:[2,31],54:[2,31],57:[2,31],66:[2,31],67:[2,31],68:[2,31],69:[2,31],71:[2,31],73:[2,31],74:[2,31],78:[2,31],84:[2,31],85:[2,31],86:[2,31],91:[2,31],93:[2,31],102:[2,31],104:[2,31],105:[2,31],106:[2,31],110:[2,31],118:[2,31],126:[2,31],128:[2,31],129:[2,31],132:[2,31],133:[2,31],134:[2,31],135:[2,31],136:[2,31],137:[2,31]},{1:[2,32],6:[2,32],25:[2,32],26:[2,32],49:[2,32],54:[2,32],57:[2,32],66:[2,32],67:[2,32],68:[2,32],69:[2,32],71:[2,32],73:[2,32],74:[2,32],78:[2,32],84:[2,32],85:[2,32],86:[2,32],91:[2,32],93:[2,32],102:[2,32],104:[2,32],105:[2,32],106:[2,32],110:[2,32],118:[2,32],126:[2,32],128:[2,32],129:[2,32],132:[2,32],133:[2,32],134:[2,32],135:[2,32],136:[2,32],137:[2,32]},{1:[2,33],6:[2,33],25:[2,33],26:[2,33],49:[2,33],54:[2,33],57:[2,33],66:[2,33],67:[2,33],68:[2,33],69:[2,33],71:[2,33],73:[2,33],74:[2,33],78:[2,33],84:[2,33],85:[2,33],86:[2,33],91:[2,33],93:[2,33],102:[2,33],104:[2,33],105:[2,33],106:[2,33],110:[2,33],118:[2,33],126:[2,33],128:[2,33],129:[2,33],132:[2,33],133:[2,33],134:[2,33],135:[2,33],136:[2,33],137:[2,33]},{1:[2,34],6:[2,34],25:[2,34],26:[2,34],49:[2,34],54:[2,34],57:[2,34],66:[2,34],67:[2,34],68:[2,34],69:[2,34],71:[2,34],73:[2,34],74:[2,34],78:[2,34],84:[2,34],85:[2,34],86:[2,34],91:[2,34],93:[2,34],102:[2,34],104:[2,34],105:[2,34],106:[2,34],110:[2,34],118:[2,34],126:[2,34],128:[2,34],129:[2,34],132:[2,34],133:[2,34],134:[2,34],135:[2,34],136:[2,34],137:[2,34]},{1:[2,35],6:[2,35],25:[2,35],26:[2,35],49:[2,35],54:[2,35],57:[2,35],66:[2,35],67:[2,35],68:[2,35],69:[2,35],71:[2,35],73:[2,35],74:[2,35],78:[2,35],84:[2,35],85:[2,35],86:[2,35],91:[2,35],93:[2,35],102:[2,35],104:[2,35],105:[2,35],106:[2,35],110:[2,35],118:[2,35],126:[2,35],128:[2,35],129:[2,35],132:[2,35],133:[2,35],134:[2,35],135:[2,35],136:[2,35],137:[2,35]},{4:141,7:4,8:6,9:7,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:[1,142],27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{8:143,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:[1,147],27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,60:148,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],87:145,88:[1,58],89:[1,59],90:[1,57],91:[1,144],94:146,96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{1:[2,112],6:[2,112],25:[2,112],26:[2,112],49:[2,112],54:[2,112],57:[2,112],66:[2,112],67:[2,112],68:[2,112],69:[2,112],71:[2,112],73:[2,112],74:[2,112],78:[2,112],84:[2,112],85:[2,112],86:[2,112],91:[2,112],93:[2,112],102:[2,112],104:[2,112],105:[2,112],106:[2,112],110:[2,112],118:[2,112],126:[2,112],128:[2,112],129:[2,112],132:[2,112],133:[2,112],134:[2,112],135:[2,112],136:[2,112],137:[2,112]},{1:[2,113],6:[2,113],25:[2,113],26:[2,113],27:149,28:[1,73],49:[2,113],54:[2,113],57:[2,113],66:[2,113],67:[2,113],68:[2,113],69:[2,113],71:[2,113],73:[2,113],74:[2,113],78:[2,113],84:[2,113],85:[2,113],86:[2,113],91:[2,113],93:[2,113],102:[2,113],104:[2,113],105:[2,113],106:[2,113],110:[2,113],118:[2,113],126:[2,113],128:[2,113],129:[2,113],132:[2,113],133:[2,113],134:[2,113],135:[2,113],136:[2,113],137:[2,113]},{25:[2,51]},{25:[2,52]},{1:[2,68],6:[2,68],25:[2,68],26:[2,68],40:[2,68],49:[2,68],54:[2,68],57:[2,68],66:[2,68],67:[2,68],68:[2,68],69:[2,68],71:[2,68],73:[2,68],74:[2,68],78:[2,68],80:[2,68],84:[2,68],85:[2,68],86:[2,68],91:[2,68],93:[2,68],102:[2,68],104:[2,68],105:[2,68],106:[2,68],110:[2,68],118:[2,68],126:[2,68],128:[2,68],129:[2,68],130:[2,68],131:[2,68],132:[2,68],133:[2,68],134:[2,68],135:[2,68],136:[2,68],137:[2,68],138:[2,68]},{1:[2,71],6:[2,71],25:[2,71],26:[2,71],40:[2,71],49:[2,71],54:[2,71],57:[2,71],66:[2,71],67:[2,71],68:[2,71],69:[2,71],71:[2,71],73:[2,71],74:[2,71],78:[2,71],80:[2,71],84:[2,71],85:[2,71],86:[2,71],91:[2,71],93:[2,71],102:[2,71],104:[2,71],105:[2,71],106:[2,71],110:[2,71],118:[2,71],126:[2,71],128:[2,71],129:[2,71],130:[2,71],131:[2,71],132:[2,71],133:[2,71],134:[2,71],135:[2,71],136:[2,71],137:[2,71],138:[2,71]},{8:150,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{8:151,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{8:152,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{5:153,8:154,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:[1,5],27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{27:159,28:[1,73],44:160,58:161,59:162,64:155,76:[1,70],89:[1,114],90:[1,57],113:156,114:[1,157],115:158},{112:163,116:[1,164],117:[1,165]},{6:[2,91],11:169,25:[2,91],27:170,28:[1,73],29:171,30:[1,71],31:[1,72],41:167,42:168,44:172,46:[1,46],54:[2,91],77:166,78:[2,91],89:[1,114]},{1:[2,27],6:[2,27],25:[2,27],26:[2,27],43:[2,27],49:[2,27],54:[2,27],57:[2,27],66:[2,27],67:[2,27],68:[2,27],69:[2,27],71:[2,27],73:[2,27],74:[2,27],78:[2,27],84:[2,27],85:[2,27],86:[2,27],91:[2,27],93:[2,27],102:[2,27],104:[2,27],105:[2,27],106:[2,27],110:[2,27],118:[2,27],126:[2,27],128:[2,27],129:[2,27],132:[2,27],133:[2,27],134:[2,27],135:[2,27],136:[2,27],137:[2,27]},{1:[2,28],6:[2,28],25:[2,28],26:[2,28],43:[2,28],49:[2,28],54:[2,28],57:[2,28],66:[2,28],67:[2,28],68:[2,28],69:[2,28],71:[2,28],73:[2,28],74:[2,28],78:[2,28],84:[2,28],85:[2,28],86:[2,28],91:[2,28],93:[2,28],102:[2,28],104:[2,28],105:[2,28],106:[2,28],110:[2,28],118:[2,28],126:[2,28],128:[2,28],129:[2,28],132:[2,28],133:[2,28],134:[2,28],135:[2,28],136:[2,28],137:[2,28]},{1:[2,26],6:[2,26],25:[2,26],26:[2,26],40:[2,26],43:[2,26],49:[2,26],54:[2,26],57:[2,26],66:[2,26],67:[2,26],68:[2,26],69:[2,26],71:[2,26],73:[2,26],74:[2,26],78:[2,26],80:[2,26],84:[2,26],85:[2,26],86:[2,26],91:[2,26],93:[2,26],102:[2,26],104:[2,26],105:[2,26],106:[2,26],110:[2,26],116:[2,26],117:[2,26],118:[2,26],126:[2,26],128:[2,26],129:[2,26],130:[2,26],131:[2,26],132:[2,26],133:[2,26],134:[2,26],135:[2,26],136:[2,26],137:[2,26],138:[2,26]},{1:[2,6],6:[2,6],7:173,8:6,9:7,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,26:[2,6],27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],102:[2,6],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{1:[2,3]},{1:[2,24],6:[2,24],25:[2,24],26:[2,24],49:[2,24],54:[2,24],57:[2,24],73:[2,24],78:[2,24],86:[2,24],91:[2,24],93:[2,24],98:[2,24],99:[2,24],102:[2,24],104:[2,24],105:[2,24],106:[2,24],110:[2,24],118:[2,24],121:[2,24],123:[2,24],126:[2,24],128:[2,24],129:[2,24],132:[2,24],133:[2,24],134:[2,24],135:[2,24],136:[2,24],137:[2,24]},{6:[1,74],26:[1,174]},{1:[2,194],6:[2,194],25:[2,194],26:[2,194],49:[2,194],54:[2,194],57:[2,194],73:[2,194],78:[2,194],86:[2,194],91:[2,194],93:[2,194],102:[2,194],104:[2,194],105:[2,194],106:[2,194],110:[2,194],118:[2,194],126:[2,194],128:[2,194],129:[2,194],132:[2,194],133:[2,194],134:[2,194],135:[2,194],136:[2,194],137:[2,194]},{8:175,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{8:176,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{8:177,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{8:178,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{8:179,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{8:180,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{8:181,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{8:182,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{1:[2,149],6:[2,149],25:[2,149],26:[2,149],49:[2,149],54:[2,149],57:[2,149],73:[2,149],78:[2,149],86:[2,149],91:[2,149],93:[2,149],102:[2,149],104:[2,149],105:[2,149],106:[2,149],110:[2,149],118:[2,149],126:[2,149],128:[2,149],129:[2,149],132:[2,149],133:[2,149],134:[2,149],135:[2,149],136:[2,149],137:[2,149]},{1:[2,154],6:[2,154],25:[2,154],26:[2,154],49:[2,154],54:[2,154],57:[2,154],73:[2,154],78:[2,154],86:[2,154],91:[2,154],93:[2,154],102:[2,154],104:[2,154],105:[2,154],106:[2,154],110:[2,154],118:[2,154],126:[2,154],128:[2,154],129:[2,154],132:[2,154],133:[2,154],134:[2,154],135:[2,154],136:[2,154],137:[2,154]},{8:183,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{1:[2,148],6:[2,148],25:[2,148],26:[2,148],49:[2,148],54:[2,148],57:[2,148],73:[2,148],78:[2,148],86:[2,148],91:[2,148],93:[2,148],102:[2,148],104:[2,148],105:[2,148],106:[2,148],110:[2,148],118:[2,148],126:[2,148],128:[2,148],129:[2,148],132:[2,148],133:[2,148],134:[2,148],135:[2,148],136:[2,148],137:[2,148]},{1:[2,153],6:[2,153],25:[2,153],26:[2,153],49:[2,153],54:[2,153],57:[2,153],73:[2,153],78:[2,153],86:[2,153],91:[2,153],93:[2,153],102:[2,153],104:[2,153],105:[2,153],106:[2,153],110:[2,153],118:[2,153],126:[2,153],128:[2,153],129:[2,153],132:[2,153],133:[2,153],134:[2,153],135:[2,153],136:[2,153],137:[2,153]},{82:184,85:[1,106]},{1:[2,69],6:[2,69],25:[2,69],26:[2,69],40:[2,69],49:[2,69],54:[2,69],57:[2,69],66:[2,69],67:[2,69],68:[2,69],69:[2,69],71:[2,69],73:[2,69],74:[2,69],78:[2,69],80:[2,69],84:[2,69],85:[2,69],86:[2,69],91:[2,69],93:[2,69],102:[2,69],104:[2,69],105:[2,69],106:[2,69],110:[2,69],118:[2,69],126:[2,69],128:[2,69],129:[2,69],130:[2,69],131:[2,69],132:[2,69],133:[2,69],134:[2,69],135:[2,69],136:[2,69],137:[2,69],138:[2,69]},{85:[2,109]},{27:185,28:[1,73]},{27:186,28:[1,73]},{1:[2,84],6:[2,84],25:[2,84],26:[2,84],27:187,28:[1,73],40:[2,84],49:[2,84],54:[2,84],57:[2,84],66:[2,84],67:[2,84],68:[2,84],69:[2,84],71:[2,84],73:[2,84],74:[2,84],78:[2,84],80:[2,84],84:[2,84],85:[2,84],86:[2,84],91:[2,84],93:[2,84],102:[2,84],104:[2,84],105:[2,84],106:[2,84],110:[2,84],118:[2,84],126:[2,84],128:[2,84],129:[2,84],130:[2,84],131:[2,84],132:[2,84],133:[2,84],134:[2,84],135:[2,84],136:[2,84],137:[2,84],138:[2,84]},{27:188,28:[1,73]},{1:[2,85],6:[2,85],25:[2,85],26:[2,85],40:[2,85],49:[2,85],54:[2,85],57:[2,85],66:[2,85],67:[2,85],68:[2,85],69:[2,85],71:[2,85],73:[2,85],74:[2,85],78:[2,85],80:[2,85],84:[2,85],85:[2,85],86:[2,85],91:[2,85],93:[2,85],102:[2,85],104:[2,85],105:[2,85],106:[2,85],110:[2,85],118:[2,85],126:[2,85],128:[2,85],129:[2,85],130:[2,85],131:[2,85],132:[2,85],133:[2,85],134:[2,85],135:[2,85],136:[2,85],137:[2,85],138:[2,85]},{8:190,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],57:[1,194],58:47,59:48,61:36,63:25,64:26,65:27,72:189,75:191,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],92:192,93:[1,193],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{70:195,71:[1,100],74:[1,101]},{82:196,85:[1,106]},{1:[2,70],6:[2,70],25:[2,70],26:[2,70],40:[2,70],49:[2,70],54:[2,70],57:[2,70],66:[2,70],67:[2,70],68:[2,70],69:[2,70],71:[2,70],73:[2,70],74:[2,70],78:[2,70],80:[2,70],84:[2,70],85:[2,70],86:[2,70],91:[2,70],93:[2,70],102:[2,70],104:[2,70],105:[2,70],106:[2,70],110:[2,70],118:[2,70],126:[2,70],128:[2,70],129:[2,70],130:[2,70],131:[2,70],132:[2,70],133:[2,70],134:[2,70],135:[2,70],136:[2,70],137:[2,70],138:[2,70]},{6:[1,198],8:197,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:[1,199],27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{1:[2,107],6:[2,107],25:[2,107],26:[2,107],49:[2,107],54:[2,107],57:[2,107],66:[2,107],67:[2,107],68:[2,107],69:[2,107],71:[2,107],73:[2,107],74:[2,107],78:[2,107],84:[2,107],85:[2,107],86:[2,107],91:[2,107],93:[2,107],102:[2,107],104:[2,107],105:[2,107],106:[2,107],110:[2,107],118:[2,107],126:[2,107],128:[2,107],129:[2,107],132:[2,107],133:[2,107],134:[2,107],135:[2,107],136:[2,107],137:[2,107]},{8:202,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:[1,147],27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,60:148,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],86:[1,200],87:201,88:[1,58],89:[1,59],90:[1,57],94:146,96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{6:[2,53],25:[2,53],49:[1,203],53:205,54:[1,204]},{6:[2,56],25:[2,56],26:[2,56],49:[2,56],54:[2,56]},{6:[2,60],25:[2,60],26:[2,60],40:[1,207],49:[2,60],54:[2,60],57:[1,206]},{6:[2,63],25:[2,63],26:[2,63],40:[2,63],49:[2,63],54:[2,63],57:[2,63]},{6:[2,64],25:[2,64],26:[2,64],40:[2,64],49:[2,64],54:[2,64],57:[2,64]},{6:[2,65],25:[2,65],26:[2,65],40:[2,65],49:[2,65],54:[2,65],57:[2,65]},{6:[2,66],25:[2,66],26:[2,66],40:[2,66],49:[2,66],54:[2,66],57:[2,66]},{27:149,28:[1,73]},{8:202,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:[1,147],27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,60:148,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],87:145,88:[1,58],89:[1,59],90:[1,57],91:[1,144],94:146,96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{1:[2,50],6:[2,50],25:[2,50],26:[2,50],49:[2,50],54:[2,50],57:[2,50],73:[2,50],78:[2,50],86:[2,50],91:[2,50],93:[2,50],102:[2,50],104:[2,50],105:[2,50],106:[2,50],110:[2,50],118:[2,50],126:[2,50],128:[2,50],129:[2,50],132:[2,50],133:[2,50],134:[2,50],135:[2,50],136:[2,50],137:[2,50]},{1:[2,187],6:[2,187],25:[2,187],26:[2,187],49:[2,187],54:[2,187],57:[2,187],73:[2,187],78:[2,187],86:[2,187],91:[2,187],93:[2,187],102:[2,187],103:87,104:[2,187],105:[2,187],106:[2,187],109:88,110:[2,187],111:69,118:[2,187],126:[2,187],128:[2,187],129:[2,187],132:[1,78],133:[2,187],134:[2,187],135:[2,187],136:[2,187],137:[2,187]},{103:90,104:[1,65],106:[1,66],109:91,110:[1,68],111:69,126:[1,89]},{1:[2,188],6:[2,188],25:[2,188],26:[2,188],49:[2,188],54:[2,188],57:[2,188],73:[2,188],78:[2,188],86:[2,188],91:[2,188],93:[2,188],102:[2,188],103:87,104:[2,188],105:[2,188],106:[2,188],109:88,110:[2,188],111:69,118:[2,188],126:[2,188],128:[2,188],129:[2,188],132:[1,78],133:[2,188],134:[2,188],135:[2,188],136:[2,188],137:[2,188]},{1:[2,189],6:[2,189],25:[2,189],26:[2,189],49:[2,189],54:[2,189],57:[2,189],73:[2,189],78:[2,189],86:[2,189],91:[2,189],93:[2,189],102:[2,189],103:87,104:[2,189],105:[2,189],106:[2,189],109:88,110:[2,189],111:69,118:[2,189],126:[2,189],128:[2,189],129:[2,189],132:[1,78],133:[2,189],134:[2,189],135:[2,189],136:[2,189],137:[2,189]},{1:[2,190],6:[2,190],25:[2,190],26:[2,190],49:[2,190],54:[2,190],57:[2,190],66:[2,72],67:[2,72],68:[2,72],69:[2,72],71:[2,72],73:[2,190],74:[2,72],78:[2,190],84:[2,72],85:[2,72],86:[2,190],91:[2,190],93:[2,190],102:[2,190],104:[2,190],105:[2,190],106:[2,190],110:[2,190],118:[2,190],126:[2,190],128:[2,190],129:[2,190],132:[2,190],133:[2,190],134:[2,190],135:[2,190],136:[2,190],137:[2,190]},{62:93,66:[1,95],67:[1,96],68:[1,97],69:[1,98],70:99,71:[1,100],74:[1,101],81:92,84:[1,94],85:[2,108]},{62:103,66:[1,95],67:[1,96],68:[1,97],69:[1,98],70:99,71:[1,100],74:[1,101],81:102,84:[1,94],85:[2,108]},{66:[2,75],67:[2,75],68:[2,75],69:[2,75],71:[2,75],74:[2,75],84:[2,75],85:[2,75]},{1:[2,191],6:[2,191],25:[2,191],26:[2,191],49:[2,191],54:[2,191],57:[2,191],66:[2,72],67:[2,72],68:[2,72],69:[2,72],71:[2,72],73:[2,191],74:[2,72],78:[2,191],84:[2,72],85:[2,72],86:[2,191],91:[2,191],93:[2,191],102:[2,191],104:[2,191],105:[2,191],106:[2,191],110:[2,191],118:[2,191],126:[2,191],128:[2,191],129:[2,191],132:[2,191],133:[2,191],134:[2,191],135:[2,191],136:[2,191],137:[2,191]},{1:[2,192],6:[2,192],25:[2,192],26:[2,192],49:[2,192],54:[2,192],57:[2,192],73:[2,192],78:[2,192],86:[2,192],91:[2,192],93:[2,192],102:[2,192],104:[2,192],105:[2,192],106:[2,192],110:[2,192],118:[2,192],126:[2,192],128:[2,192],129:[2,192],132:[2,192],133:[2,192],134:[2,192],135:[2,192],136:[2,192],137:[2,192]},{1:[2,193],6:[2,193],25:[2,193],26:[2,193],49:[2,193],54:[2,193],57:[2,193],73:[2,193],78:[2,193],86:[2,193],91:[2,193],93:[2,193],102:[2,193],104:[2,193],105:[2,193],106:[2,193],110:[2,193],118:[2,193],126:[2,193],128:[2,193],129:[2,193],132:[2,193],133:[2,193],134:[2,193],135:[2,193],136:[2,193],137:[2,193]},{6:[1,210],8:208,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:[1,209],27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{8:211,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{5:212,25:[1,5],125:[1,213]},{1:[2,133],6:[2,133],25:[2,133],26:[2,133],49:[2,133],54:[2,133],57:[2,133],73:[2,133],78:[2,133],86:[2,133],91:[2,133],93:[2,133],97:214,98:[1,215],99:[1,216],102:[2,133],104:[2,133],105:[2,133],106:[2,133],110:[2,133],118:[2,133],126:[2,133],128:[2,133],129:[2,133],132:[2,133],133:[2,133],134:[2,133],135:[2,133],136:[2,133],137:[2,133]},{1:[2,147],6:[2,147],25:[2,147],26:[2,147],49:[2,147],54:[2,147],57:[2,147],73:[2,147],78:[2,147],86:[2,147],91:[2,147],93:[2,147],102:[2,147],104:[2,147],105:[2,147],106:[2,147],110:[2,147],118:[2,147],126:[2,147],128:[2,147],129:[2,147],132:[2,147],133:[2,147],134:[2,147],135:[2,147],136:[2,147],137:[2,147]},{1:[2,155],6:[2,155],25:[2,155],26:[2,155],49:[2,155],54:[2,155],57:[2,155],73:[2,155],78:[2,155],86:[2,155],91:[2,155],93:[2,155],102:[2,155],104:[2,155],105:[2,155],106:[2,155],110:[2,155],118:[2,155],126:[2,155],128:[2,155],129:[2,155],132:[2,155],133:[2,155],134:[2,155],135:[2,155],136:[2,155],137:[2,155]},{25:[1,217],103:87,104:[1,65],106:[1,66],109:88,110:[1,68],111:69,126:[1,86],128:[1,80],129:[1,79],132:[1,78],133:[1,81],134:[1,82],135:[1,83],136:[1,84],137:[1,85]},{120:218,122:219,123:[1,220]},{1:[2,97],6:[2,97],25:[2,97],26:[2,97],49:[2,97],54:[2,97],57:[2,97],73:[2,97],78:[2,97],86:[2,97],91:[2,97],93:[2,97],102:[2,97],104:[2,97],105:[2,97],106:[2,97],110:[2,97],118:[2,97],126:[2,97],128:[2,97],129:[2,97],132:[2,97],133:[2,97],134:[2,97],135:[2,97],136:[2,97],137:[2,97]},{8:221,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{1:[2,100],5:222,6:[2,100],25:[1,5],26:[2,100],49:[2,100],54:[2,100],57:[2,100],66:[2,72],67:[2,72],68:[2,72],69:[2,72],71:[2,72],73:[2,100],74:[2,72],78:[2,100],80:[1,223],84:[2,72],85:[2,72],86:[2,100],91:[2,100],93:[2,100],102:[2,100],104:[2,100],105:[2,100],106:[2,100],110:[2,100],118:[2,100],126:[2,100],128:[2,100],129:[2,100],132:[2,100],133:[2,100],134:[2,100],135:[2,100],136:[2,100],137:[2,100]},{1:[2,140],6:[2,140],25:[2,140],26:[2,140],49:[2,140],54:[2,140],57:[2,140],73:[2,140],78:[2,140],86:[2,140],91:[2,140],93:[2,140],102:[2,140],103:87,104:[2,140],105:[2,140],106:[2,140],109:88,110:[2,140],111:69,118:[2,140],126:[2,140],128:[1,80],129:[1,79],132:[1,78],133:[1,81],134:[1,82],135:[1,83],136:[1,84],137:[1,85]},{1:[2,46],6:[2,46],26:[2,46],102:[2,46],103:87,104:[2,46],106:[2,46],109:88,110:[2,46],111:69,126:[2,46],128:[1,80],129:[1,79],132:[1,78],133:[1,81],134:[1,82],135:[1,83],136:[1,84],137:[1,85]},{6:[1,74],102:[1,224]},{4:225,7:4,8:6,9:7,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{6:[2,129],25:[2,129],54:[2,129],57:[1,227],91:[2,129],92:226,93:[1,193],103:87,104:[1,65],106:[1,66],109:88,110:[1,68],111:69,126:[1,86],128:[1,80],129:[1,79],132:[1,78],133:[1,81],134:[1,82],135:[1,83],136:[1,84],137:[1,85]},{1:[2,115],6:[2,115],25:[2,115],26:[2,115],40:[2,115],49:[2,115],54:[2,115],57:[2,115],66:[2,115],67:[2,115],68:[2,115],69:[2,115],71:[2,115],73:[2,115],74:[2,115],78:[2,115],84:[2,115],85:[2,115],86:[2,115],91:[2,115],93:[2,115],102:[2,115],104:[2,115],105:[2,115],106:[2,115],110:[2,115],116:[2,115],117:[2,115],118:[2,115],126:[2,115],128:[2,115],129:[2,115],132:[2,115],133:[2,115],134:[2,115],135:[2,115],136:[2,115],137:[2,115]},{6:[2,53],25:[2,53],53:228,54:[1,229],91:[2,53]},{6:[2,124],25:[2,124],26:[2,124],54:[2,124],86:[2,124],91:[2,124]},{8:202,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:[1,147],27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,60:148,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],87:230,88:[1,58],89:[1,59],90:[1,57],94:146,96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{6:[2,130],25:[2,130],26:[2,130],54:[2,130],86:[2,130],91:[2,130]},{1:[2,114],6:[2,114],25:[2,114],26:[2,114],40:[2,114],43:[2,114],49:[2,114],54:[2,114],57:[2,114],66:[2,114],67:[2,114],68:[2,114],69:[2,114],71:[2,114],73:[2,114],74:[2,114],78:[2,114],80:[2,114],84:[2,114],85:[2,114],86:[2,114],91:[2,114],93:[2,114],102:[2,114],104:[2,114],105:[2,114],106:[2,114],110:[2,114],116:[2,114],117:[2,114],118:[2,114],126:[2,114],128:[2,114],129:[2,114],130:[2,114],131:[2,114],132:[2,114],133:[2,114],134:[2,114],135:[2,114],136:[2,114],137:[2,114],138:[2,114]},{5:231,25:[1,5],103:87,104:[1,65],106:[1,66],109:88,110:[1,68],111:69,126:[1,86],128:[1,80],129:[1,79],132:[1,78],133:[1,81],134:[1,82],135:[1,83],136:[1,84],137:[1,85]},{1:[2,143],6:[2,143],25:[2,143],26:[2,143],49:[2,143],54:[2,143],57:[2,143],73:[2,143],78:[2,143],86:[2,143],91:[2,143],93:[2,143],102:[2,143],103:87,104:[1,65],105:[1,232],106:[1,66],109:88,110:[1,68],111:69,118:[2,143],126:[2,143],128:[1,80],129:[1,79],132:[1,78],133:[1,81],134:[1,82],135:[1,83],136:[1,84],137:[1,85]},{1:[2,145],6:[2,145],25:[2,145],26:[2,145],49:[2,145],54:[2,145],57:[2,145],73:[2,145],78:[2,145],86:[2,145],91:[2,145],93:[2,145],102:[2,145],103:87,104:[1,65],105:[1,233],106:[1,66],109:88,110:[1,68],111:69,118:[2,145],126:[2,145],128:[1,80],129:[1,79],132:[1,78],133:[1,81],134:[1,82],135:[1,83],136:[1,84],137:[1,85]},{1:[2,151],6:[2,151],25:[2,151],26:[2,151],49:[2,151],54:[2,151],57:[2,151],73:[2,151],78:[2,151],86:[2,151],91:[2,151],93:[2,151],102:[2,151],104:[2,151],105:[2,151],106:[2,151],110:[2,151],118:[2,151],126:[2,151],128:[2,151],129:[2,151],132:[2,151],133:[2,151],134:[2,151],135:[2,151],136:[2,151],137:[2,151]},{1:[2,152],6:[2,152],25:[2,152],26:[2,152],49:[2,152],54:[2,152],57:[2,152],73:[2,152],78:[2,152],86:[2,152],91:[2,152],93:[2,152],102:[2,152],103:87,104:[1,65],105:[2,152],106:[1,66],109:88,110:[1,68],111:69,118:[2,152],126:[2,152],128:[1,80],129:[1,79],132:[1,78],133:[1,81],134:[1,82],135:[1,83],136:[1,84],137:[1,85]},{1:[2,156],6:[2,156],25:[2,156],26:[2,156],49:[2,156],54:[2,156],57:[2,156],73:[2,156],78:[2,156],86:[2,156],91:[2,156],93:[2,156],102:[2,156],104:[2,156],105:[2,156],106:[2,156],110:[2,156],118:[2,156],126:[2,156],128:[2,156],129:[2,156],132:[2,156],133:[2,156],134:[2,156],135:[2,156],136:[2,156],137:[2,156]},{116:[2,158],117:[2,158]},{27:159,28:[1,73],44:160,58:161,59:162,76:[1,70],89:[1,114],90:[1,115],113:234,115:158},{54:[1,235],116:[2,164],117:[2,164]},{54:[2,160],116:[2,160],117:[2,160]},{54:[2,161],116:[2,161],117:[2,161]},{54:[2,162],116:[2,162],117:[2,162]},{54:[2,163],116:[2,163],117:[2,163]},{1:[2,157],6:[2,157],25:[2,157],26:[2,157],49:[2,157],54:[2,157],57:[2,157],73:[2,157],78:[2,157],86:[2,157],91:[2,157],93:[2,157],102:[2,157],104:[2,157],105:[2,157],106:[2,157],110:[2,157],118:[2,157],126:[2,157],128:[2,157],129:[2,157],132:[2,157],133:[2,157],134:[2,157],135:[2,157],136:[2,157],137:[2,157]},{8:236,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{8:237,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{6:[2,53],25:[2,53],53:238,54:[1,239],78:[2,53]},{6:[2,92],25:[2,92],26:[2,92],54:[2,92],78:[2,92]},{6:[2,39],25:[2,39],26:[2,39],43:[1,240],54:[2,39],78:[2,39]},{6:[2,42],25:[2,42],26:[2,42],54:[2,42],78:[2,42]},{6:[2,43],25:[2,43],26:[2,43],43:[2,43],54:[2,43],78:[2,43]},{6:[2,44],25:[2,44],26:[2,44],43:[2,44],54:[2,44],78:[2,44]},{6:[2,45],25:[2,45],26:[2,45],43:[2,45],54:[2,45],78:[2,45]},{1:[2,5],6:[2,5],26:[2,5],102:[2,5]},{1:[2,25],6:[2,25],25:[2,25],26:[2,25],49:[2,25],54:[2,25],57:[2,25],73:[2,25],78:[2,25],86:[2,25],91:[2,25],93:[2,25],98:[2,25],99:[2,25],102:[2,25],104:[2,25],105:[2,25],106:[2,25],110:[2,25],118:[2,25],121:[2,25],123:[2,25],126:[2,25],128:[2,25],129:[2,25],132:[2,25],133:[2,25],134:[2,25],135:[2,25],136:[2,25],137:[2,25]},{1:[2,195],6:[2,195],25:[2,195],26:[2,195],49:[2,195],54:[2,195],57:[2,195],73:[2,195],78:[2,195],86:[2,195],91:[2,195],93:[2,195],102:[2,195],103:87,104:[2,195],105:[2,195],106:[2,195],109:88,110:[2,195],111:69,118:[2,195],126:[2,195],128:[2,195],129:[2,195],132:[1,78],133:[1,81],134:[2,195],135:[2,195],136:[2,195],137:[2,195]},{1:[2,196],6:[2,196],25:[2,196],26:[2,196],49:[2,196],54:[2,196],57:[2,196],73:[2,196],78:[2,196],86:[2,196],91:[2,196],93:[2,196],102:[2,196],103:87,104:[2,196],105:[2,196],106:[2,196],109:88,110:[2,196],111:69,118:[2,196],126:[2,196],128:[2,196],129:[2,196],132:[1,78],133:[1,81],134:[2,196],135:[2,196],136:[2,196],137:[2,196]},{1:[2,197],6:[2,197],25:[2,197],26:[2,197],49:[2,197],54:[2,197],57:[2,197],73:[2,197],78:[2,197],86:[2,197],91:[2,197],93:[2,197],102:[2,197],103:87,104:[2,197],105:[2,197],106:[2,197],109:88,110:[2,197],111:69,118:[2,197],126:[2,197],128:[2,197],129:[2,197],132:[1,78],133:[2,197],134:[2,197],135:[2,197],136:[2,197],137:[2,197]},{1:[2,198],6:[2,198],25:[2,198],26:[2,198],49:[2,198],54:[2,198],57:[2,198],73:[2,198],78:[2,198],86:[2,198],91:[2,198],93:[2,198],102:[2,198],103:87,104:[2,198],105:[2,198],106:[2,198],109:88,110:[2,198],111:69,118:[2,198],126:[2,198],128:[1,80],129:[1,79],132:[1,78],133:[1,81],134:[2,198],135:[2,198],136:[2,198],137:[2,198]},{1:[2,199],6:[2,199],25:[2,199],26:[2,199],49:[2,199],54:[2,199],57:[2,199],73:[2,199],78:[2,199],86:[2,199],91:[2,199],93:[2,199],102:[2,199],103:87,104:[2,199],105:[2,199],106:[2,199],109:88,110:[2,199],111:69,118:[2,199],126:[2,199],128:[1,80],129:[1,79],132:[1,78],133:[1,81],134:[1,82],135:[2,199],136:[2,199],137:[1,85]},{1:[2,200],6:[2,200],25:[2,200],26:[2,200],49:[2,200],54:[2,200],57:[2,200],73:[2,200],78:[2,200],86:[2,200],91:[2,200],93:[2,200],102:[2,200],103:87,104:[2,200],105:[2,200],106:[2,200],109:88,110:[2,200],111:69,118:[2,200],126:[2,200],128:[1,80],129:[1,79],132:[1,78],133:[1,81],134:[1,82],135:[1,83],136:[2,200],137:[1,85]},{1:[2,201],6:[2,201],25:[2,201],26:[2,201],49:[2,201],54:[2,201],57:[2,201],73:[2,201],78:[2,201],86:[2,201],91:[2,201],93:[2,201],102:[2,201],103:87,104:[2,201],105:[2,201],106:[2,201],109:88,110:[2,201],111:69,118:[2,201],126:[2,201],128:[1,80],129:[1,79],132:[1,78],133:[1,81],134:[1,82],135:[2,201],136:[2,201],137:[2,201]},{1:[2,186],6:[2,186],25:[2,186],26:[2,186],49:[2,186],54:[2,186],57:[2,186],73:[2,186],78:[2,186],86:[2,186],91:[2,186],93:[2,186],102:[2,186],103:87,104:[1,65],105:[2,186],106:[1,66],109:88,110:[1,68],111:69,118:[2,186],126:[1,86],128:[1,80],129:[1,79],132:[1,78],133:[1,81],134:[1,82],135:[1,83],136:[1,84],137:[1,85]},{1:[2,185],6:[2,185],25:[2,185],26:[2,185],49:[2,185],54:[2,185],57:[2,185],73:[2,185],78:[2,185],86:[2,185],91:[2,185],93:[2,185],102:[2,185],103:87,104:[1,65],105:[2,185],106:[1,66],109:88,110:[1,68],111:69,118:[2,185],126:[1,86],128:[1,80],129:[1,79],132:[1,78],133:[1,81],134:[1,82],135:[1,83],136:[1,84],137:[1,85]},{1:[2,104],6:[2,104],25:[2,104],26:[2,104],49:[2,104],54:[2,104],57:[2,104],66:[2,104],67:[2,104],68:[2,104],69:[2,104],71:[2,104],73:[2,104],74:[2,104],78:[2,104],84:[2,104],85:[2,104],86:[2,104],91:[2,104],93:[2,104],102:[2,104],104:[2,104],105:[2,104],106:[2,104],110:[2,104],118:[2,104],126:[2,104],128:[2,104],129:[2,104],132:[2,104],133:[2,104],134:[2,104],135:[2,104],136:[2,104],137:[2,104]},{1:[2,80],6:[2,80],25:[2,80],26:[2,80],40:[2,80],49:[2,80],54:[2,80],57:[2,80],66:[2,80],67:[2,80],68:[2,80],69:[2,80],71:[2,80],73:[2,80],74:[2,80],78:[2,80],80:[2,80],84:[2,80],85:[2,80],86:[2,80],91:[2,80],93:[2,80],102:[2,80],104:[2,80],105:[2,80],106:[2,80],110:[2,80],118:[2,80],126:[2,80],128:[2,80],129:[2,80],130:[2,80],131:[2,80],132:[2,80],133:[2,80],134:[2,80],135:[2,80],136:[2,80],137:[2,80],138:[2,80]},{1:[2,81],6:[2,81],25:[2,81],26:[2,81],40:[2,81],49:[2,81],54:[2,81],57:[2,81],66:[2,81],67:[2,81],68:[2,81],69:[2,81],71:[2,81],73:[2,81],74:[2,81],78:[2,81],80:[2,81],84:[2,81],85:[2,81],86:[2,81],91:[2,81],93:[2,81],102:[2,81],104:[2,81],105:[2,81],106:[2,81],110:[2,81],118:[2,81],126:[2,81],128:[2,81],129:[2,81],130:[2,81],131:[2,81],132:[2,81],133:[2,81],134:[2,81],135:[2,81],136:[2,81],137:[2,81],138:[2,81]},{1:[2,82],6:[2,82],25:[2,82],26:[2,82],40:[2,82],49:[2,82],54:[2,82],57:[2,82],66:[2,82],67:[2,82],68:[2,82],69:[2,82],71:[2,82],73:[2,82],74:[2,82],78:[2,82],80:[2,82],84:[2,82],85:[2,82],86:[2,82],91:[2,82],93:[2,82],102:[2,82],104:[2,82],105:[2,82],106:[2,82],110:[2,82],118:[2,82],126:[2,82],128:[2,82],129:[2,82],130:[2,82],131:[2,82],132:[2,82],133:[2,82],134:[2,82],135:[2,82],136:[2,82],137:[2,82],138:[2,82]},{1:[2,83],6:[2,83],25:[2,83],26:[2,83],40:[2,83],49:[2,83],54:[2,83],57:[2,83],66:[2,83],67:[2,83],68:[2,83],69:[2,83],71:[2,83],73:[2,83],74:[2,83],78:[2,83],80:[2,83],84:[2,83],85:[2,83],86:[2,83],91:[2,83],93:[2,83],102:[2,83],104:[2,83],105:[2,83],106:[2,83],110:[2,83],118:[2,83],126:[2,83],128:[2,83],129:[2,83],130:[2,83],131:[2,83],132:[2,83],133:[2,83],134:[2,83],135:[2,83],136:[2,83],137:[2,83],138:[2,83]},{73:[1,241]},{57:[1,194],73:[2,88],92:242,93:[1,193],103:87,104:[1,65],106:[1,66],109:88,110:[1,68],111:69,126:[1,86],128:[1,80],129:[1,79],132:[1,78],133:[1,81],134:[1,82],135:[1,83],136:[1,84],137:[1,85]},{73:[2,89]},{8:243,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,73:[2,123],76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{12:[2,117],28:[2,117],30:[2,117],31:[2,117],33:[2,117],34:[2,117],35:[2,117],36:[2,117],37:[2,117],38:[2,117],45:[2,117],46:[2,117],47:[2,117],51:[2,117],52:[2,117],73:[2,117],76:[2,117],79:[2,117],83:[2,117],88:[2,117],89:[2,117],90:[2,117],96:[2,117],100:[2,117],101:[2,117],104:[2,117],106:[2,117],108:[2,117],110:[2,117],119:[2,117],125:[2,117],127:[2,117],128:[2,117],129:[2,117],130:[2,117],131:[2,117]},{12:[2,118],28:[2,118],30:[2,118],31:[2,118],33:[2,118],34:[2,118],35:[2,118],36:[2,118],37:[2,118],38:[2,118],45:[2,118],46:[2,118],47:[2,118],51:[2,118],52:[2,118],73:[2,118],76:[2,118],79:[2,118],83:[2,118],88:[2,118],89:[2,118],90:[2,118],96:[2,118],100:[2,118],101:[2,118],104:[2,118],106:[2,118],108:[2,118],110:[2,118],119:[2,118],125:[2,118],127:[2,118],128:[2,118],129:[2,118],130:[2,118],131:[2,118]},{1:[2,87],6:[2,87],25:[2,87],26:[2,87],40:[2,87],49:[2,87],54:[2,87],57:[2,87],66:[2,87],67:[2,87],68:[2,87],69:[2,87],71:[2,87],73:[2,87],74:[2,87],78:[2,87],80:[2,87],84:[2,87],85:[2,87],86:[2,87],91:[2,87],93:[2,87],102:[2,87],104:[2,87],105:[2,87],106:[2,87],110:[2,87],118:[2,87],126:[2,87],128:[2,87],129:[2,87],130:[2,87],131:[2,87],132:[2,87],133:[2,87],134:[2,87],135:[2,87],136:[2,87],137:[2,87],138:[2,87]},{1:[2,105],6:[2,105],25:[2,105],26:[2,105],49:[2,105],54:[2,105],57:[2,105],66:[2,105],67:[2,105],68:[2,105],69:[2,105],71:[2,105],73:[2,105],74:[2,105],78:[2,105],84:[2,105],85:[2,105],86:[2,105],91:[2,105],93:[2,105],102:[2,105],104:[2,105],105:[2,105],106:[2,105],110:[2,105],118:[2,105],126:[2,105],128:[2,105],129:[2,105],132:[2,105],133:[2,105],134:[2,105],135:[2,105],136:[2,105],137:[2,105]},{1:[2,36],6:[2,36],25:[2,36],26:[2,36],49:[2,36],54:[2,36],57:[2,36],73:[2,36],78:[2,36],86:[2,36],91:[2,36],93:[2,36],102:[2,36],103:87,104:[2,36],105:[2,36],106:[2,36],109:88,110:[2,36],111:69,118:[2,36],126:[2,36],128:[1,80],129:[1,79],132:[1,78],133:[1,81],134:[1,82],135:[1,83],136:[1,84],137:[1,85]},{8:244,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{8:245,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{1:[2,110],6:[2,110],25:[2,110],26:[2,110],49:[2,110],54:[2,110],57:[2,110],66:[2,110],67:[2,110],68:[2,110],69:[2,110],71:[2,110],73:[2,110],74:[2,110],78:[2,110],84:[2,110],85:[2,110],86:[2,110],91:[2,110],93:[2,110],102:[2,110],104:[2,110],105:[2,110],106:[2,110],110:[2,110],118:[2,110],126:[2,110],128:[2,110],129:[2,110],132:[2,110],133:[2,110],134:[2,110],135:[2,110],136:[2,110],137:[2,110]},{6:[2,53],25:[2,53],53:246,54:[1,229],86:[2,53]},{6:[2,129],25:[2,129],26:[2,129],54:[2,129],57:[1,247],86:[2,129],91:[2,129],103:87,104:[1,65],106:[1,66],109:88,110:[1,68],111:69,126:[1,86],128:[1,80],129:[1,79],132:[1,78],133:[1,81],134:[1,82],135:[1,83],136:[1,84],137:[1,85]},{50:248,51:[1,60],52:[1,61]},{6:[2,54],25:[2,54],26:[2,54],27:110,28:[1,73],44:111,55:249,56:109,58:112,59:113,76:[1,70],89:[1,114],90:[1,115]},{6:[1,250],25:[1,251]},{6:[2,61],25:[2,61],26:[2,61],49:[2,61],54:[2,61]},{8:252,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{1:[2,202],6:[2,202],25:[2,202],26:[2,202],49:[2,202],54:[2,202],57:[2,202],73:[2,202],78:[2,202],86:[2,202],91:[2,202],93:[2,202],102:[2,202],103:87,104:[2,202],105:[2,202],106:[2,202],109:88,110:[2,202],111:69,118:[2,202],126:[2,202],128:[1,80],129:[1,79],132:[1,78],133:[1,81],134:[1,82],135:[1,83],136:[1,84],137:[1,85]},{8:253,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{8:254,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{1:[2,205],6:[2,205],25:[2,205],26:[2,205],49:[2,205],54:[2,205],57:[2,205],73:[2,205],78:[2,205],86:[2,205],91:[2,205],93:[2,205],102:[2,205],103:87,104:[2,205],105:[2,205],106:[2,205],109:88,110:[2,205],111:69,118:[2,205],126:[2,205],128:[1,80],129:[1,79],132:[1,78],133:[1,81],134:[1,82],135:[1,83],136:[1,84],137:[1,85]},{1:[2,184],6:[2,184],25:[2,184],26:[2,184],49:[2,184],54:[2,184],57:[2,184],73:[2,184],78:[2,184],86:[2,184],91:[2,184],93:[2,184],102:[2,184],104:[2,184],105:[2,184],106:[2,184],110:[2,184],118:[2,184],126:[2,184],128:[2,184],129:[2,184],132:[2,184],133:[2,184],134:[2,184],135:[2,184],136:[2,184],137:[2,184]},{8:255,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{1:[2,134],6:[2,134],25:[2,134],26:[2,134],49:[2,134],54:[2,134],57:[2,134],73:[2,134],78:[2,134],86:[2,134],91:[2,134],93:[2,134],98:[1,256],102:[2,134],104:[2,134],105:[2,134],106:[2,134],110:[2,134],118:[2,134],126:[2,134],128:[2,134],129:[2,134],132:[2,134],133:[2,134],134:[2,134],135:[2,134],136:[2,134],137:[2,134]},{5:257,25:[1,5]},{5:260,25:[1,5],27:258,28:[1,73],59:259,76:[1,70]},{120:261,122:219,123:[1,220]},{26:[1,262],121:[1,263],122:264,123:[1,220]},{26:[2,177],121:[2,177],123:[2,177]},{8:266,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],95:265,96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{1:[2,98],5:267,6:[2,98],25:[1,5],26:[2,98],49:[2,98],54:[2,98],57:[2,98],73:[2,98],78:[2,98],86:[2,98],91:[2,98],93:[2,98],102:[2,98],103:87,104:[1,65],105:[2,98],106:[1,66],109:88,110:[1,68],111:69,118:[2,98],126:[2,98],128:[1,80],129:[1,79],132:[1,78],133:[1,81],134:[1,82],135:[1,83],136:[1,84],137:[1,85]},{1:[2,101],6:[2,101],25:[2,101],26:[2,101],49:[2,101],54:[2,101],57:[2,101],73:[2,101],78:[2,101],86:[2,101],91:[2,101],93:[2,101],102:[2,101],104:[2,101],105:[2,101],106:[2,101],110:[2,101],118:[2,101],126:[2,101],128:[2,101],129:[2,101],132:[2,101],133:[2,101],134:[2,101],135:[2,101],136:[2,101],137:[2,101]},{8:268,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{1:[2,141],6:[2,141],25:[2,141],26:[2,141],49:[2,141],54:[2,141],57:[2,141],66:[2,141],67:[2,141],68:[2,141],69:[2,141],71:[2,141],73:[2,141],74:[2,141],78:[2,141],84:[2,141],85:[2,141],86:[2,141],91:[2,141],93:[2,141],102:[2,141],104:[2,141],105:[2,141],106:[2,141],110:[2,141],118:[2,141],126:[2,141],128:[2,141],129:[2,141],132:[2,141],133:[2,141],134:[2,141],135:[2,141],136:[2,141],137:[2,141]},{6:[1,74],26:[1,269]},{8:270,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{6:[2,67],12:[2,118],25:[2,67],28:[2,118],30:[2,118],31:[2,118],33:[2,118],34:[2,118],35:[2,118],36:[2,118],37:[2,118],38:[2,118],45:[2,118],46:[2,118],47:[2,118],51:[2,118],52:[2,118],54:[2,67],76:[2,118],79:[2,118],83:[2,118],88:[2,118],89:[2,118],90:[2,118],91:[2,67],96:[2,118],100:[2,118],101:[2,118],104:[2,118],106:[2,118],108:[2,118],110:[2,118],119:[2,118],125:[2,118],127:[2,118],128:[2,118],129:[2,118],130:[2,118],131:[2,118]},{6:[1,272],25:[1,273],91:[1,271]},{6:[2,54],8:202,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:[2,54],26:[2,54],27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,60:148,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],86:[2,54],88:[1,58],89:[1,59],90:[1,57],91:[2,54],94:274,96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{6:[2,53],25:[2,53],26:[2,53],53:275,54:[1,229]},{1:[2,181],6:[2,181],25:[2,181],26:[2,181],49:[2,181],54:[2,181],57:[2,181],73:[2,181],78:[2,181],86:[2,181],91:[2,181],93:[2,181],102:[2,181],104:[2,181],105:[2,181],106:[2,181],110:[2,181],118:[2,181],121:[2,181],126:[2,181],128:[2,181],129:[2,181],132:[2,181],133:[2,181],134:[2,181],135:[2,181],136:[2,181],137:[2,181]},{8:276,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{8:277,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{116:[2,159],117:[2,159]},{27:159,28:[1,73],44:160,58:161,59:162,76:[1,70],89:[1,114],90:[1,115],115:278},{1:[2,166],6:[2,166],25:[2,166],26:[2,166],49:[2,166],54:[2,166],57:[2,166],73:[2,166],78:[2,166],86:[2,166],91:[2,166],93:[2,166],102:[2,166],103:87,104:[2,166],105:[1,279],106:[2,166],109:88,110:[2,166],111:69,118:[1,280],126:[2,166],128:[1,80],129:[1,79],132:[1,78],133:[1,81],134:[1,82],135:[1,83],136:[1,84],137:[1,85]},{1:[2,167],6:[2,167],25:[2,167],26:[2,167],49:[2,167],54:[2,167],57:[2,167],73:[2,167],78:[2,167],86:[2,167],91:[2,167],93:[2,167],102:[2,167],103:87,104:[2,167],105:[1,281],106:[2,167],109:88,110:[2,167],111:69,118:[2,167],126:[2,167],128:[1,80],129:[1,79],132:[1,78],133:[1,81],134:[1,82],135:[1,83],136:[1,84],137:[1,85]},{6:[1,283],25:[1,284],78:[1,282]},{6:[2,54],11:169,25:[2,54],26:[2,54],27:170,28:[1,73],29:171,30:[1,71],31:[1,72],41:285,42:168,44:172,46:[1,46],78:[2,54],89:[1,114]},{8:286,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:[1,287],27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{1:[2,86],6:[2,86],25:[2,86],26:[2,86],40:[2,86],49:[2,86],54:[2,86],57:[2,86],66:[2,86],67:[2,86],68:[2,86],69:[2,86],71:[2,86],73:[2,86],74:[2,86],78:[2,86],80:[2,86],84:[2,86],85:[2,86],86:[2,86],91:[2,86],93:[2,86],102:[2,86],104:[2,86],105:[2,86],106:[2,86],110:[2,86],118:[2,86],126:[2,86],128:[2,86],129:[2,86],130:[2,86],131:[2,86],132:[2,86],133:[2,86],134:[2,86],135:[2,86],136:[2,86],137:[2,86],138:[2,86]},{8:288,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,73:[2,121],76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{73:[2,122],103:87,104:[1,65],106:[1,66],109:88,110:[1,68],111:69,126:[1,86],128:[1,80],129:[1,79],132:[1,78],133:[1,81],134:[1,82],135:[1,83],136:[1,84],137:[1,85]},{1:[2,37],6:[2,37],25:[2,37],26:[2,37],49:[2,37],54:[2,37],57:[2,37],73:[2,37],78:[2,37],86:[2,37],91:[2,37],93:[2,37],102:[2,37],103:87,104:[2,37],105:[2,37],106:[2,37],109:88,110:[2,37],111:69,118:[2,37],126:[2,37],128:[1,80],129:[1,79],132:[1,78],133:[1,81],134:[1,82],135:[1,83],136:[1,84],137:[1,85]},{26:[1,289],103:87,104:[1,65],106:[1,66],109:88,110:[1,68],111:69,126:[1,86],128:[1,80],129:[1,79],132:[1,78],133:[1,81],134:[1,82],135:[1,83],136:[1,84],137:[1,85]},{6:[1,272],25:[1,273],86:[1,290]},{6:[2,67],25:[2,67],26:[2,67],54:[2,67],86:[2,67],91:[2,67]},{5:291,25:[1,5]},{6:[2,57],25:[2,57],26:[2,57],49:[2,57],54:[2,57]},{27:110,28:[1,73],44:111,55:292,56:109,58:112,59:113,76:[1,70],89:[1,114],90:[1,115]},{6:[2,55],25:[2,55],26:[2,55],27:110,28:[1,73],44:111,48:293,54:[2,55],55:108,56:109,58:112,59:113,76:[1,70],89:[1,114],90:[1,115]},{6:[2,62],25:[2,62],26:[2,62],49:[2,62],54:[2,62],103:87,104:[1,65],106:[1,66],109:88,110:[1,68],111:69,126:[1,86],128:[1,80],129:[1,79],132:[1,78],133:[1,81],134:[1,82],135:[1,83],136:[1,84],137:[1,85]},{26:[1,294],103:87,104:[1,65],106:[1,66],109:88,110:[1,68],111:69,126:[1,86],128:[1,80],129:[1,79],132:[1,78],133:[1,81],134:[1,82],135:[1,83],136:[1,84],137:[1,85]},{1:[2,204],6:[2,204],25:[2,204],26:[2,204],49:[2,204],54:[2,204],57:[2,204],73:[2,204],78:[2,204],86:[2,204],91:[2,204],93:[2,204],102:[2,204],103:87,104:[2,204],105:[2,204],106:[2,204],109:88,110:[2,204],111:69,118:[2,204],126:[2,204],128:[1,80],129:[1,79],132:[1,78],133:[1,81],134:[1,82],135:[1,83],136:[1,84],137:[1,85]},{5:295,25:[1,5],103:87,104:[1,65],106:[1,66],109:88,110:[1,68],111:69,126:[1,86],128:[1,80],129:[1,79],132:[1,78],133:[1,81],134:[1,82],135:[1,83],136:[1,84],137:[1,85]},{5:296,25:[1,5]},{1:[2,135],6:[2,135],25:[2,135],26:[2,135],49:[2,135],54:[2,135],57:[2,135],73:[2,135],78:[2,135],86:[2,135],91:[2,135],93:[2,135],102:[2,135],104:[2,135],105:[2,135],106:[2,135],110:[2,135],118:[2,135],126:[2,135],128:[2,135],129:[2,135],132:[2,135],133:[2,135],134:[2,135],135:[2,135],136:[2,135],137:[2,135]},{5:297,25:[1,5]},{5:298,25:[1,5]},{1:[2,139],6:[2,139],25:[2,139],26:[2,139],49:[2,139],54:[2,139],57:[2,139],73:[2,139],78:[2,139],86:[2,139],91:[2,139],93:[2,139],98:[2,139],102:[2,139],104:[2,139],105:[2,139],106:[2,139],110:[2,139],118:[2,139],126:[2,139],128:[2,139],129:[2,139],132:[2,139],133:[2,139],134:[2,139],135:[2,139],136:[2,139],137:[2,139]},{26:[1,299],121:[1,300],122:264,123:[1,220]},{1:[2,175],6:[2,175],25:[2,175],26:[2,175],49:[2,175],54:[2,175],57:[2,175],73:[2,175],78:[2,175],86:[2,175],91:[2,175],93:[2,175],102:[2,175],104:[2,175],105:[2,175],106:[2,175],110:[2,175],118:[2,175],126:[2,175],128:[2,175],129:[2,175],132:[2,175],133:[2,175],134:[2,175],135:[2,175],136:[2,175],137:[2,175]},{5:301,25:[1,5]},{26:[2,178],121:[2,178],123:[2,178]},{5:302,25:[1,5],54:[1,303]},{25:[2,131],54:[2,131],103:87,104:[1,65],106:[1,66],109:88,110:[1,68],111:69,126:[1,86],128:[1,80],129:[1,79],132:[1,78],133:[1,81],134:[1,82],135:[1,83],136:[1,84],137:[1,85]},{1:[2,99],6:[2,99],25:[2,99],26:[2,99],49:[2,99],54:[2,99],57:[2,99],73:[2,99],78:[2,99],86:[2,99],91:[2,99],93:[2,99],102:[2,99],104:[2,99],105:[2,99],106:[2,99],110:[2,99],118:[2,99],126:[2,99],128:[2,99],129:[2,99],132:[2,99],133:[2,99],134:[2,99],135:[2,99],136:[2,99],137:[2,99]},{1:[2,102],5:304,6:[2,102],25:[1,5],26:[2,102],49:[2,102],54:[2,102],57:[2,102],73:[2,102],78:[2,102],86:[2,102],91:[2,102],93:[2,102],102:[2,102],103:87,104:[1,65],105:[2,102],106:[1,66],109:88,110:[1,68],111:69,118:[2,102],126:[2,102],128:[1,80],129:[1,79],132:[1,78],133:[1,81],134:[1,82],135:[1,83],136:[1,84],137:[1,85]},{102:[1,305]},{91:[1,306],103:87,104:[1,65],106:[1,66],109:88,110:[1,68],111:69,126:[1,86],128:[1,80],129:[1,79],132:[1,78],133:[1,81],134:[1,82],135:[1,83],136:[1,84],137:[1,85]},{1:[2,116],6:[2,116],25:[2,116],26:[2,116],40:[2,116],49:[2,116],54:[2,116],57:[2,116],66:[2,116],67:[2,116],68:[2,116],69:[2,116],71:[2,116],73:[2,116],74:[2,116],78:[2,116],84:[2,116],85:[2,116],86:[2,116],91:[2,116],93:[2,116],102:[2,116],104:[2,116],105:[2,116],106:[2,116],110:[2,116],116:[2,116],117:[2,116],118:[2,116],126:[2,116],128:[2,116],129:[2,116],132:[2,116],133:[2,116],134:[2,116],135:[2,116],136:[2,116],137:[2,116]},{8:202,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,60:148,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],94:307,96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{8:202,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:[1,147],27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,60:148,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],87:308,88:[1,58],89:[1,59],90:[1,57],94:146,96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{6:[2,125],25:[2,125],26:[2,125],54:[2,125],86:[2,125],91:[2,125]},{6:[1,272],25:[1,273],26:[1,309]},{1:[2,144],6:[2,144],25:[2,144],26:[2,144],49:[2,144],54:[2,144],57:[2,144],73:[2,144],78:[2,144],86:[2,144],91:[2,144],93:[2,144],102:[2,144],103:87,104:[1,65],105:[2,144],106:[1,66],109:88,110:[1,68],111:69,118:[2,144],126:[2,144],128:[1,80],129:[1,79],132:[1,78],133:[1,81],134:[1,82],135:[1,83],136:[1,84],137:[1,85]},{1:[2,146],6:[2,146],25:[2,146],26:[2,146],49:[2,146],54:[2,146],57:[2,146],73:[2,146],78:[2,146],86:[2,146],91:[2,146],93:[2,146],102:[2,146],103:87,104:[1,65],105:[2,146],106:[1,66],109:88,110:[1,68],111:69,118:[2,146],126:[2,146],128:[1,80],129:[1,79],132:[1,78],133:[1,81],134:[1,82],135:[1,83],136:[1,84],137:[1,85]},{116:[2,165],117:[2,165]},{8:310,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{8:311,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{8:312,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{1:[2,90],6:[2,90],25:[2,90],26:[2,90],40:[2,90],49:[2,90],54:[2,90],57:[2,90],66:[2,90],67:[2,90],68:[2,90],69:[2,90],71:[2,90],73:[2,90],74:[2,90],78:[2,90],84:[2,90],85:[2,90],86:[2,90],91:[2,90],93:[2,90],102:[2,90],104:[2,90],105:[2,90],106:[2,90],110:[2,90],116:[2,90],117:[2,90],118:[2,90],126:[2,90],128:[2,90],129:[2,90],132:[2,90],133:[2,90],134:[2,90],135:[2,90],136:[2,90],137:[2,90]},{11:169,27:170,28:[1,73],29:171,30:[1,71],31:[1,72],41:313,42:168,44:172,46:[1,46],89:[1,114]},{6:[2,91],11:169,25:[2,91],26:[2,91],27:170,28:[1,73],29:171,30:[1,71],31:[1,72],41:167,42:168,44:172,46:[1,46],54:[2,91],77:314,89:[1,114]},{6:[2,93],25:[2,93],26:[2,93],54:[2,93],78:[2,93]},{6:[2,40],25:[2,40],26:[2,40],54:[2,40],78:[2,40],103:87,104:[1,65],106:[1,66],109:88,110:[1,68],111:69,126:[1,86],128:[1,80],129:[1,79],132:[1,78],133:[1,81],134:[1,82],135:[1,83],136:[1,84],137:[1,85]},{8:315,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{73:[2,120],103:87,104:[1,65],106:[1,66],109:88,110:[1,68],111:69,126:[1,86],128:[1,80],129:[1,79],132:[1,78],133:[1,81],134:[1,82],135:[1,83],136:[1,84],137:[1,85]},{1:[2,38],6:[2,38],25:[2,38],26:[2,38],49:[2,38],54:[2,38],57:[2,38],73:[2,38],78:[2,38],86:[2,38],91:[2,38],93:[2,38],102:[2,38],104:[2,38],105:[2,38],106:[2,38],110:[2,38],118:[2,38],126:[2,38],128:[2,38],129:[2,38],132:[2,38],133:[2,38],134:[2,38],135:[2,38],136:[2,38],137:[2,38]},{1:[2,111],6:[2,111],25:[2,111],26:[2,111],49:[2,111],54:[2,111],57:[2,111],66:[2,111],67:[2,111],68:[2,111],69:[2,111],71:[2,111],73:[2,111],74:[2,111],78:[2,111],84:[2,111],85:[2,111],86:[2,111],91:[2,111],93:[2,111],102:[2,111],104:[2,111],105:[2,111],106:[2,111],110:[2,111],118:[2,111],126:[2,111],128:[2,111],129:[2,111],132:[2,111],133:[2,111],134:[2,111],135:[2,111],136:[2,111],137:[2,111]},{1:[2,49],6:[2,49],25:[2,49],26:[2,49],49:[2,49],54:[2,49],57:[2,49],73:[2,49],78:[2,49],86:[2,49],91:[2,49],93:[2,49],102:[2,49],104:[2,49],105:[2,49],106:[2,49],110:[2,49],118:[2,49],126:[2,49],128:[2,49],129:[2,49],132:[2,49],133:[2,49],134:[2,49],135:[2,49],136:[2,49],137:[2,49]},{6:[2,58],25:[2,58],26:[2,58],49:[2,58],54:[2,58]},{6:[2,53],25:[2,53],26:[2,53],53:316,54:[1,204]},{1:[2,203],6:[2,203],25:[2,203],26:[2,203],49:[2,203],54:[2,203],57:[2,203],73:[2,203],78:[2,203],86:[2,203],91:[2,203],93:[2,203],102:[2,203],104:[2,203],105:[2,203],106:[2,203],110:[2,203],118:[2,203],126:[2,203],128:[2,203],129:[2,203],132:[2,203],133:[2,203],134:[2,203],135:[2,203],136:[2,203],137:[2,203]},{1:[2,182],6:[2,182],25:[2,182],26:[2,182],49:[2,182],54:[2,182],57:[2,182],73:[2,182],78:[2,182],86:[2,182],91:[2,182],93:[2,182],102:[2,182],104:[2,182],105:[2,182],106:[2,182],110:[2,182],118:[2,182],121:[2,182],126:[2,182],128:[2,182],129:[2,182],132:[2,182],133:[2,182],134:[2,182],135:[2,182],136:[2,182],137:[2,182]},{1:[2,136],6:[2,136],25:[2,136],26:[2,136],49:[2,136],54:[2,136],57:[2,136],73:[2,136],78:[2,136],86:[2,136],91:[2,136],93:[2,136],102:[2,136],104:[2,136],105:[2,136],106:[2,136],110:[2,136],118:[2,136],126:[2,136],128:[2,136],129:[2,136],132:[2,136],133:[2,136],134:[2,136],135:[2,136],136:[2,136],137:[2,136]},{1:[2,137],6:[2,137],25:[2,137],26:[2,137],49:[2,137],54:[2,137],57:[2,137],73:[2,137],78:[2,137],86:[2,137],91:[2,137],93:[2,137],98:[2,137],102:[2,137],104:[2,137],105:[2,137],106:[2,137],110:[2,137],118:[2,137],126:[2,137],128:[2,137],129:[2,137],132:[2,137],133:[2,137],134:[2,137],135:[2,137],136:[2,137],137:[2,137]},{1:[2,138],6:[2,138],25:[2,138],26:[2,138],49:[2,138],54:[2,138],57:[2,138],73:[2,138],78:[2,138],86:[2,138],91:[2,138],93:[2,138],98:[2,138],102:[2,138],104:[2,138],105:[2,138],106:[2,138],110:[2,138],118:[2,138],126:[2,138],128:[2,138],129:[2,138],132:[2,138],133:[2,138],134:[2,138],135:[2,138],136:[2,138],137:[2,138]},{1:[2,173],6:[2,173],25:[2,173],26:[2,173],49:[2,173],54:[2,173],57:[2,173],73:[2,173],78:[2,173],86:[2,173],91:[2,173],93:[2,173],102:[2,173],104:[2,173],105:[2,173],106:[2,173],110:[2,173],118:[2,173],126:[2,173],128:[2,173],129:[2,173],132:[2,173],133:[2,173],134:[2,173],135:[2,173],136:[2,173],137:[2,173]},{5:317,25:[1,5]},{26:[1,318]},{6:[1,319],26:[2,179],121:[2,179],123:[2,179]},{8:320,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{1:[2,103],6:[2,103],25:[2,103],26:[2,103],49:[2,103],54:[2,103],57:[2,103],73:[2,103],78:[2,103],86:[2,103],91:[2,103],93:[2,103],102:[2,103],104:[2,103],105:[2,103],106:[2,103],110:[2,103],118:[2,103],126:[2,103],128:[2,103],129:[2,103],132:[2,103],133:[2,103],134:[2,103],135:[2,103],136:[2,103],137:[2,103]},{1:[2,142],6:[2,142],25:[2,142],26:[2,142],49:[2,142],54:[2,142],57:[2,142],66:[2,142],67:[2,142],68:[2,142],69:[2,142],71:[2,142],73:[2,142],74:[2,142],78:[2,142],84:[2,142],85:[2,142],86:[2,142],91:[2,142],93:[2,142],102:[2,142],104:[2,142],105:[2,142],106:[2,142],110:[2,142],118:[2,142],126:[2,142],128:[2,142],129:[2,142],132:[2,142],133:[2,142],134:[2,142],135:[2,142],136:[2,142],137:[2,142]},{1:[2,119],6:[2,119],25:[2,119],26:[2,119],49:[2,119],54:[2,119],57:[2,119],66:[2,119],67:[2,119],68:[2,119],69:[2,119],71:[2,119],73:[2,119],74:[2,119],78:[2,119],84:[2,119],85:[2,119],86:[2,119],91:[2,119],93:[2,119],102:[2,119],104:[2,119],105:[2,119],106:[2,119],110:[2,119],118:[2,119],126:[2,119],128:[2,119],129:[2,119],132:[2,119],133:[2,119],134:[2,119],135:[2,119],136:[2,119],137:[2,119]},{6:[2,126],25:[2,126],26:[2,126],54:[2,126],86:[2,126],91:[2,126]},{6:[2,53],25:[2,53],26:[2,53],53:321,54:[1,229]},{6:[2,127],25:[2,127],26:[2,127],54:[2,127],86:[2,127],91:[2,127]},{1:[2,168],6:[2,168],25:[2,168],26:[2,168],49:[2,168],54:[2,168],57:[2,168],73:[2,168],78:[2,168],86:[2,168],91:[2,168],93:[2,168],102:[2,168],103:87,104:[2,168],105:[2,168],106:[2,168],109:88,110:[2,168],111:69,118:[1,322],126:[2,168],128:[1,80],129:[1,79],132:[1,78],133:[1,81],134:[1,82],135:[1,83],136:[1,84],137:[1,85]},{1:[2,170],6:[2,170],25:[2,170],26:[2,170],49:[2,170],54:[2,170],57:[2,170],73:[2,170],78:[2,170],86:[2,170],91:[2,170],93:[2,170],102:[2,170],103:87,104:[2,170],105:[1,323],106:[2,170],109:88,110:[2,170],111:69,118:[2,170],126:[2,170],128:[1,80],129:[1,79],132:[1,78],133:[1,81],134:[1,82],135:[1,83],136:[1,84],137:[1,85]},{1:[2,169],6:[2,169],25:[2,169],26:[2,169],49:[2,169],54:[2,169],57:[2,169],73:[2,169],78:[2,169],86:[2,169],91:[2,169],93:[2,169],102:[2,169],103:87,104:[2,169],105:[2,169],106:[2,169],109:88,110:[2,169],111:69,118:[2,169],126:[2,169],128:[1,80],129:[1,79],132:[1,78],133:[1,81],134:[1,82],135:[1,83],136:[1,84],137:[1,85]},{6:[2,94],25:[2,94],26:[2,94],54:[2,94],78:[2,94]},{6:[2,53],25:[2,53],26:[2,53],53:324,54:[1,239]},{26:[1,325],103:87,104:[1,65],106:[1,66],109:88,110:[1,68],111:69,126:[1,86],128:[1,80],129:[1,79],132:[1,78],133:[1,81],134:[1,82],135:[1,83],136:[1,84],137:[1,85]},{6:[1,250],25:[1,251],26:[1,326]},{26:[1,327]},{1:[2,176],6:[2,176],25:[2,176],26:[2,176],49:[2,176],54:[2,176],57:[2,176],73:[2,176],78:[2,176],86:[2,176],91:[2,176],93:[2,176],102:[2,176],104:[2,176],105:[2,176],106:[2,176],110:[2,176],118:[2,176],126:[2,176],128:[2,176],129:[2,176],132:[2,176],133:[2,176],134:[2,176],135:[2,176],136:[2,176],137:[2,176]},{26:[2,180],121:[2,180],123:[2,180]},{25:[2,132],54:[2,132],103:87,104:[1,65],106:[1,66],109:88,110:[1,68],111:69,126:[1,86],128:[1,80],129:[1,79],132:[1,78],133:[1,81],134:[1,82],135:[1,83],136:[1,84],137:[1,85]},{6:[1,272],25:[1,273],26:[1,328]},{8:329,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{8:330,9:118,10:20,11:21,12:[1,22],13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:15,21:16,22:17,23:18,24:19,27:62,28:[1,73],29:49,30:[1,71],31:[1,72],32:24,33:[1,50],34:[1,51],35:[1,52],36:[1,53],37:[1,54],38:[1,55],39:23,44:63,45:[1,45],46:[1,46],47:[1,29],50:30,51:[1,60],52:[1,61],58:47,59:48,61:36,63:25,64:26,65:27,76:[1,70],79:[1,43],83:[1,28],88:[1,58],89:[1,59],90:[1,57],96:[1,38],100:[1,44],101:[1,56],103:39,104:[1,65],106:[1,66],107:40,108:[1,67],109:41,110:[1,68],111:69,119:[1,42],124:37,125:[1,64],127:[1,31],128:[1,32],129:[1,33],130:[1,34],131:[1,35]},{6:[1,283],25:[1,284],26:[1,331]},{6:[2,41],25:[2,41],26:[2,41],54:[2,41],78:[2,41]},{6:[2,59],25:[2,59],26:[2,59],49:[2,59],54:[2,59]},{1:[2,174],6:[2,174],25:[2,174],26:[2,174],49:[2,174],54:[2,174],57:[2,174],73:[2,174],78:[2,174],86:[2,174],91:[2,174],93:[2,174],102:[2,174],104:[2,174],105:[2,174],106:[2,174],110:[2,174],118:[2,174],126:[2,174],128:[2,174],129:[2,174],132:[2,174],133:[2,174],134:[2,174],135:[2,174],136:[2,174],137:[2,174]},{6:[2,128],25:[2,128],26:[2,128],54:[2,128],86:[2,128],91:[2,128]},{1:[2,171],6:[2,171],25:[2,171],26:[2,171],49:[2,171],54:[2,171],57:[2,171],73:[2,171],78:[2,171],86:[2,171],91:[2,171],93:[2,171],102:[2,171],103:87,104:[2,171],105:[2,171],106:[2,171],109:88,110:[2,171],111:69,118:[2,171],126:[2,171],128:[1,80],129:[1,79],132:[1,78],133:[1,81],134:[1,82],135:[1,83],136:[1,84],137:[1,85]},{1:[2,172],6:[2,172],25:[2,172],26:[2,172],49:[2,172],54:[2,172],57:[2,172],73:[2,172],78:[2,172],86:[2,172],91:[2,172],93:[2,172],102:[2,172],103:87,104:[2,172],105:[2,172],106:[2,172],109:88,110:[2,172],111:69,118:[2,172],126:[2,172],128:[1,80],129:[1,79],132:[1,78],133:[1,81],134:[1,82],135:[1,83],136:[1,84],137:[1,85]},{6:[2,95],25:[2,95],26:[2,95],54:[2,95],78:[2,95]}],defaultActions:{60:[2,51],61:[2,52],75:[2,3],94:[2,109],191:[2,89]},parseError:function(e){throw new Error(e)
},parse:function(e){function t(){var e;return e=n.lexer.lex()||1,"number"!=typeof e&&(e=n.symbols_[e]||e),e}var n=this,i=[0],s=[null],r=[],o=this.table,a="",c=0,h=0,l=0;this.lexer.setInput(e),this.lexer.yy=this.yy,this.yy.lexer=this.lexer,this.yy.parser=this,"undefined"==typeof this.lexer.yylloc&&(this.lexer.yylloc={});var u=this.lexer.yylloc;r.push(u);var p=this.lexer.options&&this.lexer.options.ranges;"function"==typeof this.yy.parseError&&(this.parseError=this.yy.parseError);for(var d,f,m,b,k,g,y,v,w,T={};;){if(m=i[i.length-1],this.defaultActions[m]?b=this.defaultActions[m]:((null===d||"undefined"==typeof d)&&(d=t()),b=o[m]&&o[m][d]),"undefined"==typeof b||!b.length||!b[0]){var C="";if(!l){w=[];for(g in o[m])this.terminals_[g]&&g>2&&w.push("'"+this.terminals_[g]+"'");C=this.lexer.showPosition?"Parse error on line "+(c+1)+":\n"+this.lexer.showPosition()+"\nExpecting "+w.join(", ")+", got '"+(this.terminals_[d]||d)+"'":"Parse error on line "+(c+1)+": Unexpected "+(1==d?"end of input":"'"+(this.terminals_[d]||d)+"'"),this.parseError(C,{text:this.lexer.match,token:this.terminals_[d]||d,line:this.lexer.yylineno,loc:u,expected:w})}}if(b[0]instanceof Array&&b.length>1)throw new Error("Parse Error: multiple actions possible at state: "+m+", token: "+d);switch(b[0]){case 1:i.push(d),s.push(this.lexer.yytext),r.push(this.lexer.yylloc),i.push(b[1]),d=null,f?(d=f,f=null):(h=this.lexer.yyleng,a=this.lexer.yytext,c=this.lexer.yylineno,u=this.lexer.yylloc,l>0&&l--);break;case 2:if(y=this.productions_[b[1]][1],T.$=s[s.length-y],T._$={first_line:r[r.length-(y||1)].first_line,last_line:r[r.length-1].last_line,first_column:r[r.length-(y||1)].first_column,last_column:r[r.length-1].last_column},p&&(T._$.range=[r[r.length-(y||1)].range[0],r[r.length-1].range[1]]),k=this.performAction.call(T,a,h,c,this.yy,b[1],s,r),"undefined"!=typeof k)return k;y&&(i=i.slice(0,2*-1*y),s=s.slice(0,-1*y),r=r.slice(0,-1*y)),i.push(this.productions_[b[1]][0]),s.push(T.$),r.push(T._$),v=o[i[i.length-2]][i[i.length-1]],i.push(v);break;case 3:return!0}}return!0}};return e.prototype=t,t.Parser=e,new e}();return"undefined"!=typeof require&&"undefined"!=typeof e&&(e.parser=n,e.Parser=n.Parser,e.parse=function(){return n.parse.apply(n,arguments)},e.main=function(t){t[1]||(console.log("Usage: "+t[0]+" FILE"),process.exit(1));var n=require("fs").readFileSync(require("path").normalize(t[1]),"utf8");return e.parser.parse(n)},"undefined"!=typeof t&&require.main===t&&e.main(process.argv.slice(1))),t.exports}(),require["./scope"]=function(){var e={},t={exports:e};return function(){var t,n,i,s;s=require("./helpers"),n=s.extend,i=s.last,e.Scope=t=function(){function e(t,n,i){this.parent=t,this.expressions=n,this.method=i,this.variables=[{name:"arguments",type:"arguments"}],this.positions={},this.parent||(e.root=this)}return e.root=null,e.prototype.add=function(e,t,n){return this.shared&&!n?this.parent.add(e,t,n):Object.prototype.hasOwnProperty.call(this.positions,e)?this.variables[this.positions[e]].type=t:this.positions[e]=this.variables.push({name:e,type:t})-1},e.prototype.namedMethod=function(){var e;return(null!=(e=this.method)?e.name:void 0)||!this.parent?this.method:this.parent.namedMethod()},e.prototype.find=function(e){return this.check(e)?!0:(this.add(e,"var"),!1)},e.prototype.parameter=function(e){return this.shared&&this.parent.check(e,!0)?void 0:this.add(e,"param")},e.prototype.check=function(e){var t;return!!(this.type(e)||(null!=(t=this.parent)?t.check(e):void 0))},e.prototype.temporary=function(e,t){return e.length>1?"_"+e+(t>1?t-1:""):"_"+(t+parseInt(e,36)).toString(36).replace(/\d/g,"a")},e.prototype.type=function(e){var t,n,i,s;for(s=this.variables,n=0,i=s.length;i>n;n++)if(t=s[n],t.name===e)return t.type;return null},e.prototype.freeVariable=function(e,t){var n,i;for(null==t&&(t=!0),n=0;this.check(i=this.temporary(e,n));)n++;return t&&this.add(i,"var",!0),i},e.prototype.assign=function(e,t){return this.add(e,{value:t,assigned:!0},!0),this.hasAssignments=!0},e.prototype.hasDeclarations=function(){return!!this.declaredVariables().length},e.prototype.declaredVariables=function(){var e,t,n,i,s,r;for(e=[],t=[],r=this.variables,i=0,s=r.length;s>i;i++)n=r[i],"var"===n.type&&("_"===n.name.charAt(0)?t:e).push(n.name);return e.sort().concat(t.sort())},e.prototype.assignedVariables=function(){var e,t,n,i,s;for(i=this.variables,s=[],t=0,n=i.length;n>t;t++)e=i[t],e.type.assigned&&s.push(""+e.name+" = "+e.type.value);return s},e}()}.call(this),t.exports}(),require["./nodes"]=function(){var e={},t={exports:e};return function(){var t,n,i,s,r,o,a,c,h,l,u,p,d,f,m,b,k,g,y,v,w,T,C,F,L,N,x,E,D,S,R,A,I,_,$,O,j,M,B,V,P,U,q,H,G,W,X,Y,K,z,J,Z,Q,et,tt,nt,it,st,rt,ot,at,ct,ht,lt,ut,pt,dt,ft,mt,bt,kt,gt={}.hasOwnProperty,yt=function(e,t){function n(){this.constructor=e}for(var i in t)gt.call(t,i)&&(e[i]=t[i]);return n.prototype=t.prototype,e.prototype=new n,e.__super__=t.prototype,e},vt=[].indexOf||function(e){for(var t=0,n=this.length;n>t;t++)if(t in this&&this[t]===e)return t;return-1},wt=[].slice;Error.stackTraceLimit=1/0,V=require("./scope").Scope,ft=require("./lexer"),$=ft.RESERVED,B=ft.STRICT_PROSCRIBED,mt=require("./helpers"),Q=mt.compact,it=mt.flatten,nt=mt.extend,at=mt.merge,et=mt.del,lt=mt.starts,tt=mt.ends,rt=mt.last,ht=mt.some,Z=mt.addLocationDataFn,ot=mt.locationDataToString,ut=mt.throwSyntaxError,e.extend=nt,e.addLocationDataFn=Z,J=function(){return!0},S=function(){return!1},G=function(){return this},D=function(){return this.negated=!this.negated,this},e.CodeFragment=l=function(){function e(e,t){var n;this.code=""+t,this.locationData=null!=e?e.locationData:void 0,this.type=(null!=e?null!=(n=e.constructor)?n.name:void 0:void 0)||"unknown"}return e.prototype.toString=function(){return""+this.code+(this.locationData?": "+ot(this.locationData):"")},e}(),st=function(e){var t;return function(){var n,i,s;for(s=[],n=0,i=e.length;i>n;n++)t=e[n],s.push(t.code);return s}().join("")},e.Base=s=function(){function e(){}return e.prototype.compile=function(e,t){return st(this.compileToFragments(e,t))},e.prototype.compileToFragments=function(e,t){var n;return e=nt({},e),t&&(e.level=t),n=this.unfoldSoak(e)||this,n.tab=e.indent,e.level!==N&&n.isStatement(e)?n.compileClosure(e):n.compileNode(e)},e.prototype.compileClosure=function(e){var t;return(t=this.jumps())&&t.error("cannot use a pure statement in an expression"),e.sharedScope=!0,c.wrap(this).compileNode(e)},e.prototype.cache=function(e,t,n){var s,r;return this.isComplex()?(s=new x(n||e.scope.freeVariable("ref")),r=new i(s,this),t?[r.compileToFragments(e,t),[this.makeCode(s.value)]]:[r,s]):(s=t?this.compileToFragments(e,t):this,[s,s])},e.prototype.cacheToCodeFragments=function(e){return[st(e[0]),st(e[1])]},e.prototype.makeReturn=function(e){var t;return t=this.unwrapAll(),e?new o(new x(""+e+".push"),[t]):new j(t)},e.prototype.contains=function(e){var t;return t=void 0,this.traverseChildren(!1,function(n){return e(n)?(t=n,!1):void 0}),t},e.prototype.lastNonComment=function(e){var t;for(t=e.length;t--;)if(!(e[t]instanceof u))return e[t];return null},e.prototype.toString=function(e,t){var n;return null==e&&(e=""),null==t&&(t=this.constructor.name),n="\n"+e+t,this.soak&&(n+="?"),this.eachChild(function(t){return n+=t.toString(e+H)}),n},e.prototype.eachChild=function(e){var t,n,i,s,r,o,a,c;if(!this.children)return this;for(a=this.children,i=0,r=a.length;r>i;i++)if(t=a[i],this[t])for(c=it([this[t]]),s=0,o=c.length;o>s;s++)if(n=c[s],e(n)===!1)return this;return this},e.prototype.traverseChildren=function(e,t){return this.eachChild(function(n){var i;return i=t(n),i!==!1?n.traverseChildren(e,t):void 0})},e.prototype.invert=function(){return new A("!",this)},e.prototype.unwrapAll=function(){var e;for(e=this;e!==(e=e.unwrap()););return e},e.prototype.children=[],e.prototype.isStatement=S,e.prototype.jumps=S,e.prototype.isComplex=J,e.prototype.isChainable=S,e.prototype.isAssignable=S,e.prototype.unwrap=G,e.prototype.unfoldSoak=S,e.prototype.assigns=S,e.prototype.updateLocationDataIfMissing=function(e){return this.locationData||(this.locationData=e),this.eachChild(function(t){return t.updateLocationDataIfMissing(e)})},e.prototype.error=function(e){return ut(e,this.locationData)},e.prototype.makeCode=function(e){return new l(this,e)},e.prototype.wrapInBraces=function(e){return[].concat(this.makeCode("("),e,this.makeCode(")"))},e.prototype.joinFragmentArrays=function(e,t){var n,i,s,r,o;for(n=[],s=r=0,o=e.length;o>r;s=++r)i=e[s],s&&n.push(this.makeCode(t)),n=n.concat(i);return n},e}(),e.Block=r=function(e){function t(e){this.expressions=Q(it(e||[]))}return yt(t,e),t.prototype.children=["expressions"],t.prototype.push=function(e){return this.expressions.push(e),this},t.prototype.pop=function(){return this.expressions.pop()},t.prototype.unshift=function(e){return this.expressions.unshift(e),this},t.prototype.unwrap=function(){return 1===this.expressions.length?this.expressions[0]:this},t.prototype.isEmpty=function(){return!this.expressions.length},t.prototype.isStatement=function(e){var t,n,i,s;for(s=this.expressions,n=0,i=s.length;i>n;n++)if(t=s[n],t.isStatement(e))return!0;return!1},t.prototype.jumps=function(e){var t,n,i,s;for(s=this.expressions,n=0,i=s.length;i>n;n++)if(t=s[n],t.jumps(e))return t},t.prototype.makeReturn=function(e){var t,n;for(n=this.expressions.length;n--;)if(t=this.expressions[n],!(t instanceof u)){this.expressions[n]=t.makeReturn(e),t instanceof j&&!t.expression&&this.expressions.splice(n,1);break}return this},t.prototype.compileToFragments=function(e,n){return null==e&&(e={}),e.scope?t.__super__.compileToFragments.call(this,e,n):this.compileRoot(e)},t.prototype.compileNode=function(e){var n,i,s,r,o,a,c,h,l;for(this.tab=e.indent,a=e.level===N,i=[],l=this.expressions,r=c=0,h=l.length;h>c;r=++c)o=l[r],o=o.unwrapAll(),o=o.unfoldSoak(e)||o,o instanceof t?i.push(o.compileNode(e)):a?(o.front=!0,s=o.compileToFragments(e),o.isStatement(e)||(s.unshift(this.makeCode(""+this.tab)),s.push(this.makeCode(";"))),i.push(s)):i.push(o.compileToFragments(e,C));return a?this.spaced?[].concat(this.joinFragmentArrays(i,"\n\n"),this.makeCode("\n")):this.joinFragmentArrays(i,"\n"):(n=i.length?this.joinFragmentArrays(i,", "):[this.makeCode("void 0")],i.length>1&&e.level>=C?this.wrapInBraces(n):n)},t.prototype.compileRoot=function(e){var t,n,i,s,r,o,a,c,h,l;for(e.indent=e.bare?"":H,e.level=N,this.spaced=!0,e.scope=new V(null,this,null),l=e.locals||[],c=0,h=l.length;h>c;c++)s=l[c],e.scope.parameter(s);return r=[],e.bare||(o=function(){var e,n,s,r;for(s=this.expressions,r=[],i=e=0,n=s.length;n>e&&(t=s[i],t.unwrap()instanceof u);i=++e)r.push(t);return r}.call(this),a=this.expressions.slice(o.length),this.expressions=o,o.length&&(r=this.compileNode(at(e,{indent:""})),r.push(this.makeCode("\n"))),this.expressions=a),n=this.compileWithDeclarations(e),e.bare?n:[].concat(r,this.makeCode("(function() {\n"),n,this.makeCode("\n}).call(this);\n"))},t.prototype.compileWithDeclarations=function(e){var t,n,i,s,r,o,a,c,h,l,p,d,f,m;for(s=[],o=[],d=this.expressions,r=l=0,p=d.length;p>l&&(i=d[r],i=i.unwrap(),i instanceof u||i instanceof x);r=++l);return e=at(e,{level:N}),r&&(a=this.expressions.splice(r,9e9),f=[this.spaced,!1],h=f[0],this.spaced=f[1],m=[this.compileNode(e),h],s=m[0],this.spaced=m[1],this.expressions=a),o=this.compileNode(e),c=e.scope,c.expressions===this&&(n=e.scope.hasDeclarations(),t=c.hasAssignments,n||t?(r&&s.push(this.makeCode("\n")),s.push(this.makeCode(""+this.tab+"var ")),n&&s.push(this.makeCode(c.declaredVariables().join(", "))),t&&(n&&s.push(this.makeCode(",\n"+(this.tab+H))),s.push(this.makeCode(c.assignedVariables().join(",\n"+(this.tab+H))))),s.push(this.makeCode(";\n"+(this.spaced?"\n":"")))):s.length&&o.length&&s.push(this.makeCode("\n"))),s.concat(o)},t.wrap=function(e){return 1===e.length&&e[0]instanceof t?e[0]:new t(e)},t}(s),e.Literal=x=function(e){function t(e){this.value=e}return yt(t,e),t.prototype.makeReturn=function(){return this.isStatement()?this:t.__super__.makeReturn.apply(this,arguments)},t.prototype.isAssignable=function(){return m.test(this.value)},t.prototype.isStatement=function(){var e;return"break"===(e=this.value)||"continue"===e||"debugger"===e},t.prototype.isComplex=S,t.prototype.assigns=function(e){return e===this.value},t.prototype.jumps=function(e){return"break"!==this.value||(null!=e?e.loop:void 0)||(null!=e?e.block:void 0)?"continue"!==this.value||(null!=e?e.loop:void 0)?void 0:this:this},t.prototype.compileNode=function(e){var t,n,i;return n="this"===this.value?(null!=(i=e.scope.method)?i.bound:void 0)?e.scope.method.context:this.value:this.value.reserved?'"'+this.value+'"':this.value,t=this.isStatement()?""+this.tab+n+";":n,[this.makeCode(t)]},t.prototype.toString=function(){return' "'+this.value+'"'},t}(s),e.Undefined=function(e){function t(){return bt=t.__super__.constructor.apply(this,arguments)}return yt(t,e),t.prototype.isAssignable=S,t.prototype.isComplex=S,t.prototype.compileNode=function(e){return[this.makeCode(e.level>=w?"(void 0)":"void 0")]},t}(s),e.Null=function(e){function t(){return kt=t.__super__.constructor.apply(this,arguments)}return yt(t,e),t.prototype.isAssignable=S,t.prototype.isComplex=S,t.prototype.compileNode=function(){return[this.makeCode("null")]},t}(s),e.Bool=function(e){function t(e){this.val=e}return yt(t,e),t.prototype.isAssignable=S,t.prototype.isComplex=S,t.prototype.compileNode=function(){return[this.makeCode(this.val)]},t}(s),e.Return=j=function(e){function t(e){e&&!e.unwrap().isUndefined&&(this.expression=e)}return yt(t,e),t.prototype.children=["expression"],t.prototype.isStatement=J,t.prototype.makeReturn=G,t.prototype.jumps=G,t.prototype.compileToFragments=function(e,n){var i,s;return i=null!=(s=this.expression)?s.makeReturn():void 0,!i||i instanceof t?t.__super__.compileToFragments.call(this,e,n):i.compileToFragments(e,n)},t.prototype.compileNode=function(e){var t;return t=[],t.push(this.makeCode(this.tab+("return"+(this.expression?" ":"")))),this.expression&&(t=t.concat(this.expression.compileToFragments(e,L))),t.push(this.makeCode(";")),t},t}(s),e.Value=K=function(e){function t(e,n,i){return!n&&e instanceof t?e:(this.base=e,this.properties=n||[],i&&(this[i]=!0),this)}return yt(t,e),t.prototype.children=["base","properties"],t.prototype.add=function(e){return this.properties=this.properties.concat(e),this},t.prototype.hasProperties=function(){return!!this.properties.length},t.prototype.isArray=function(){return!this.properties.length&&this.base instanceof n},t.prototype.isComplex=function(){return this.hasProperties()||this.base.isComplex()},t.prototype.isAssignable=function(){return this.hasProperties()||this.base.isAssignable()},t.prototype.isSimpleNumber=function(){return this.base instanceof x&&M.test(this.base.value)},t.prototype.isString=function(){return this.base instanceof x&&k.test(this.base.value)},t.prototype.isAtomic=function(){var e,t,n,i;for(i=this.properties.concat(this.base),t=0,n=i.length;n>t;t++)if(e=i[t],e.soak||e instanceof o)return!1;return!0},t.prototype.isStatement=function(e){return!this.properties.length&&this.base.isStatement(e)},t.prototype.assigns=function(e){return!this.properties.length&&this.base.assigns(e)},t.prototype.jumps=function(e){return!this.properties.length&&this.base.jumps(e)},t.prototype.isObject=function(e){return this.properties.length?!1:this.base instanceof R&&(!e||this.base.generated)},t.prototype.isSplice=function(){return rt(this.properties)instanceof P},t.prototype.unwrap=function(){return this.properties.length?this:this.base},t.prototype.cacheReference=function(e){var n,s,r,o;return r=rt(this.properties),this.properties.length<2&&!this.base.isComplex()&&!(null!=r?r.isComplex():void 0)?[this,this]:(n=new t(this.base,this.properties.slice(0,-1)),n.isComplex()&&(s=new x(e.scope.freeVariable("base")),n=new t(new _(new i(s,n)))),r?(r.isComplex()&&(o=new x(e.scope.freeVariable("name")),r=new v(new i(o,r.index)),o=new v(o)),[n.add(r),new t(s||n.base,[o||r])]):[n,s])},t.prototype.compileNode=function(e){var t,n,i,s,r;for(this.base.front=this.front,i=this.properties,t=this.base.compileToFragments(e,i.length?w:null),(this.base instanceof _||i.length)&&M.test(st(t))&&t.push(this.makeCode(".")),s=0,r=i.length;r>s;s++)n=i[s],t.push.apply(t,n.compileToFragments(e));return t},t.prototype.unfoldSoak=function(e){var n=this;return null!=this.unfoldedSoak?this.unfoldedSoak:this.unfoldedSoak=function(){var s,r,o,a,c,h,l,u,d,f;if(o=n.base.unfoldSoak(e))return(d=o.body.properties).push.apply(d,n.properties),o;for(f=n.properties,r=l=0,u=f.length;u>l;r=++l)if(a=f[r],a.soak)return a.soak=!1,s=new t(n.base,n.properties.slice(0,r)),h=new t(n.base,n.properties.slice(r)),s.isComplex()&&(c=new x(e.scope.freeVariable("ref")),s=new _(new i(c,s)),h.base=c),new g(new p(s),h,{soak:!0});return!1}()},t}(s),e.Comment=u=function(e){function t(e){this.comment=e}return yt(t,e),t.prototype.isStatement=J,t.prototype.makeReturn=G,t.prototype.compileNode=function(e,t){var n;return n="/*"+ct(this.comment,this.tab)+(vt.call(this.comment,"\n")>=0?"\n"+this.tab:"")+"*/\n",(t||e.level)===N&&(n=e.indent+n),[this.makeCode(n)]},t}(s),e.Call=o=function(e){function n(e,t,n){this.args=null!=t?t:[],this.soak=n,this.isNew=!1,this.isSuper="super"===e,this.variable=this.isSuper?null:e}return yt(n,e),n.prototype.children=["variable","args"],n.prototype.newInstance=function(){var e,t;return e=(null!=(t=this.variable)?t.base:void 0)||this.variable,e instanceof n&&!e.isNew?e.newInstance():this.isNew=!0,this},n.prototype.superReference=function(e){var n,i;return i=e.scope.namedMethod(),(null!=i?i.klass:void 0)?(n=[new t(new x("__super__"))],i["static"]&&n.push(new t(new x("constructor"))),n.push(new t(new x(i.name))),new K(new x(i.klass),n).compile(e)):(null!=i?i.ctor:void 0)?""+i.name+".__super__.constructor":this.error("cannot call super outside of an instance method.")},n.prototype.superThis=function(e){var t;return t=e.scope.method,t&&!t.klass&&t.context||"this"},n.prototype.unfoldSoak=function(e){var t,i,s,r,o,a,c,h,l;if(this.soak){if(this.variable){if(i=pt(e,this,"variable"))return i;h=new K(this.variable).cacheReference(e),s=h[0],o=h[1]}else s=new x(this.superReference(e)),o=new K(s);return o=new n(o,this.args),o.isNew=this.isNew,s=new x("typeof "+s.compile(e)+' === "function"'),new g(s,new K(o),{soak:!0})}for(t=this,r=[];;)if(t.variable instanceof n)r.push(t),t=t.variable;else{if(!(t.variable instanceof K))break;if(r.push(t),!((t=t.variable.base)instanceof n))break}for(l=r.reverse(),a=0,c=l.length;c>a;a++)t=l[a],i&&(t.variable instanceof n?t.variable=i:t.variable.base=i),i=pt(e,t,"variable");return i},n.prototype.compileNode=function(e){var t,n,i,s,r,o,a,c,h,l;if(null!=(h=this.variable)&&(h.front=this.front),s=U.compileSplattedArray(e,this.args,!0),s.length)return this.compileSplat(e,s);for(i=[],l=this.args,n=a=0,c=l.length;c>a;n=++a)t=l[n],n&&i.push(this.makeCode(", ")),i.push.apply(i,t.compileToFragments(e,C));return r=[],this.isSuper?(o=this.superReference(e)+(".call("+this.superThis(e)),i.length&&(o+=", "),r.push(this.makeCode(o))):(this.isNew&&r.push(this.makeCode("new ")),r.push.apply(r,this.variable.compileToFragments(e,w)),r.push(this.makeCode("("))),r.push.apply(r,i),r.push(this.makeCode(")")),r},n.prototype.compileSplat=function(e,t){var n,i,s,r,o,a;return this.isSuper?[].concat(this.makeCode(""+this.superReference(e)+".apply("+this.superThis(e)+", "),t,this.makeCode(")")):this.isNew?(r=this.tab+H,[].concat(this.makeCode("(function(func, args, ctor) {\n"+r+"ctor.prototype = func.prototype;\n"+r+"var child = new ctor, result = func.apply(child, args);\n"+r+"return Object(result) === result ? result : child;\n"+this.tab+"})("),this.variable.compileToFragments(e,C),this.makeCode(", "),t,this.makeCode(", function(){})"))):(n=[],i=new K(this.variable),(o=i.properties.pop())&&i.isComplex()?(a=e.scope.freeVariable("ref"),n=n.concat(this.makeCode("("+a+" = "),i.compileToFragments(e,C),this.makeCode(")"),o.compileToFragments(e))):(s=i.compileToFragments(e,w),M.test(st(s))&&(s=this.wrapInBraces(s)),o?(a=st(s),s.push.apply(s,o.compileToFragments(e))):a="null",n=n.concat(s)),n=n.concat(this.makeCode(".apply("+a+", "),t,this.makeCode(")")))},n}(s),e.Extends=d=function(e){function t(e,t){this.child=e,this.parent=t}return yt(t,e),t.prototype.children=["child","parent"],t.prototype.compileToFragments=function(e){return new o(new K(new x(dt("extends"))),[this.child,this.parent]).compileToFragments(e)},t}(s),e.Access=t=function(e){function t(e,t){this.name=e,this.name.asKey=!0,this.soak="soak"===t}return yt(t,e),t.prototype.children=["name"],t.prototype.compileToFragments=function(e){var t;return t=this.name.compileToFragments(e),m.test(st(t))?t.unshift(this.makeCode(".")):(t.unshift(this.makeCode("[")),t.push(this.makeCode("]"))),t},t.prototype.isComplex=S,t}(s),e.Index=v=function(e){function t(e){this.index=e}return yt(t,e),t.prototype.children=["index"],t.prototype.compileToFragments=function(e){return[].concat(this.makeCode("["),this.index.compileToFragments(e,L),this.makeCode("]"))},t.prototype.isComplex=function(){return this.index.isComplex()},t}(s),e.Range=O=function(e){function t(e,t,n){this.from=e,this.to=t,this.exclusive="exclusive"===n,this.equals=this.exclusive?"":"="}return yt(t,e),t.prototype.children=["from","to"],t.prototype.compileVariables=function(e){var t,n,i,s,r;return e=at(e,{top:!0}),n=this.cacheToCodeFragments(this.from.cache(e,C)),this.fromC=n[0],this.fromVar=n[1],i=this.cacheToCodeFragments(this.to.cache(e,C)),this.toC=i[0],this.toVar=i[1],(t=et(e,"step"))&&(s=this.cacheToCodeFragments(t.cache(e,C)),this.step=s[0],this.stepVar=s[1]),r=[this.fromVar.match(M),this.toVar.match(M)],this.fromNum=r[0],this.toNum=r[1],this.stepVar?this.stepNum=this.stepVar.match(M):void 0},t.prototype.compileNode=function(e){var t,n,i,s,r,o,a,c,h,l,u,p,d,f;return this.fromVar||this.compileVariables(e),e.index?(a=this.fromNum&&this.toNum,r=et(e,"index"),o=et(e,"name"),h=o&&o!==r,p=""+r+" = "+this.fromC,this.toC!==this.toVar&&(p+=", "+this.toC),this.step!==this.stepVar&&(p+=", "+this.step),d=[""+r+" <"+this.equals,""+r+" >"+this.equals],c=d[0],s=d[1],n=this.stepNum?+this.stepNum>0?""+c+" "+this.toVar:""+s+" "+this.toVar:a?(f=[+this.fromNum,+this.toNum],i=f[0],u=f[1],f,u>=i?""+c+" "+u:""+s+" "+u):(t=this.stepVar?""+this.stepVar+" > 0":""+this.fromVar+" <= "+this.toVar,""+t+" ? "+c+" "+this.toVar+" : "+s+" "+this.toVar),l=this.stepVar?""+r+" += "+this.stepVar:a?h?u>=i?"++"+r:"--"+r:u>=i?""+r+"++":""+r+"--":h?""+t+" ? ++"+r+" : --"+r:""+t+" ? "+r+"++ : "+r+"--",h&&(p=""+o+" = "+p),h&&(l=""+o+" = "+l),[this.makeCode(""+p+"; "+n+"; "+l)]):this.compileArray(e)},t.prototype.compileArray=function(e){var t,n,i,s,r,o,a,c,h,l,u,p,d;return this.fromNum&&this.toNum&&Math.abs(this.fromNum-this.toNum)<=20?(h=function(){d=[];for(var e=p=+this.fromNum,t=+this.toNum;t>=p?t>=e:e>=t;t>=p?e++:e--)d.push(e);return d}.apply(this),this.exclusive&&h.pop(),[this.makeCode("["+h.join(", ")+"]")]):(o=this.tab+H,r=e.scope.freeVariable("i"),l=e.scope.freeVariable("results"),c="\n"+o+l+" = [];",this.fromNum&&this.toNum?(e.index=r,n=st(this.compileNode(e))):(u=""+r+" = "+this.fromC+(this.toC!==this.toVar?", "+this.toC:""),i=""+this.fromVar+" <= "+this.toVar,n="var "+u+"; "+i+" ? "+r+" <"+this.equals+" "+this.toVar+" : "+r+" >"+this.equals+" "+this.toVar+"; "+i+" ? "+r+"++ : "+r+"--"),a="{ "+l+".push("+r+"); }\n"+o+"return "+l+";\n"+e.indent,s=function(e){return null!=e?e.contains(function(e){return e instanceof x&&"arguments"===e.value&&!e.asKey}):void 0},(s(this.from)||s(this.to))&&(t=", arguments"),[this.makeCode("(function() {"+c+"\n"+o+"for ("+n+")"+a+"}).apply(this"+(null!=t?t:"")+")")])},t}(s),e.Slice=P=function(e){function t(e){this.range=e,t.__super__.constructor.call(this)}return yt(t,e),t.prototype.children=["range"],t.prototype.compileNode=function(e){var t,n,i,s,r,o,a;return a=this.range,r=a.to,i=a.from,s=i&&i.compileToFragments(e,L)||[this.makeCode("0")],r&&(t=r.compileToFragments(e,L),n=st(t),(this.range.exclusive||-1!==+n)&&(o=", "+(this.range.exclusive?n:M.test(n)?""+(+n+1):(t=r.compileToFragments(e,w),"+"+st(t)+" + 1 || 9e9")))),[this.makeCode(".slice("+st(s)+(o||"")+")")]},t}(s),e.Obj=R=function(e){function t(e,t){this.generated=null!=t?t:!1,this.objects=this.properties=e||[]}return yt(t,e),t.prototype.children=["properties"],t.prototype.compileNode=function(e){var t,n,s,r,o,a,c,h,l,p,d,f,m;if(l=this.properties,!l.length)return[this.makeCode(this.front?"({})":"{}")];if(this.generated)for(p=0,f=l.length;f>p;p++)c=l[p],c instanceof K&&c.error("cannot have an implicit value in an implicit object");for(s=e.indent+=H,a=this.lastNonComment(this.properties),t=[],n=d=0,m=l.length;m>d;n=++d)h=l[n],o=n===l.length-1?"":h===a||h instanceof u?"\n":",\n",r=h instanceof u?"":s,h instanceof i&&h.variable instanceof K&&h.variable.hasProperties()&&h.variable.error("Invalid object key"),h instanceof K&&h["this"]&&(h=new i(h.properties[0].name,h,"object")),h instanceof u||(h instanceof i||(h=new i(h,h,"object")),(h.variable.base||h.variable).asKey=!0),r&&t.push(this.makeCode(r)),t.push.apply(t,h.compileToFragments(e,N)),o&&t.push(this.makeCode(o));return t.unshift(this.makeCode("{"+(l.length&&"\n"))),t.push(this.makeCode(""+(l.length&&"\n"+this.tab)+"}")),this.front?this.wrapInBraces(t):t},t.prototype.assigns=function(e){var t,n,i,s;for(s=this.properties,n=0,i=s.length;i>n;n++)if(t=s[n],t.assigns(e))return!0;return!1},t}(s),e.Arr=n=function(e){function t(e){this.objects=e||[]}return yt(t,e),t.prototype.children=["objects"],t.prototype.compileNode=function(e){var t,n,i,s,r,o,a;if(!this.objects.length)return[this.makeCode("[]")];if(e.indent+=H,t=U.compileSplattedArray(e,this.objects),t.length)return t;for(t=[],n=function(){var t,n,i,s;for(i=this.objects,s=[],t=0,n=i.length;n>t;t++)r=i[t],s.push(r.compileToFragments(e,C));return s}.call(this),s=o=0,a=n.length;a>o;s=++o)i=n[s],s&&t.push(this.makeCode(", ")),t.push.apply(t,i);return st(t).indexOf("\n")>=0?(t.unshift(this.makeCode("[\n"+e.indent)),t.push(this.makeCode("\n"+this.tab+"]"))):(t.unshift(this.makeCode("[")),t.push(this.makeCode("]"))),t},t.prototype.assigns=function(e){var t,n,i,s;for(s=this.objects,n=0,i=s.length;i>n;n++)if(t=s[n],t.assigns(e))return!0;return!1},t}(s),e.Class=a=function(e){function n(e,t,n){this.variable=e,this.parent=t,this.body=null!=n?n:new r,this.boundFuncs=[],this.body.classBody=!0}return yt(n,e),n.prototype.children=["variable","parent","body"],n.prototype.determineName=function(){var e,n;return this.variable?(e=(n=rt(this.variable.properties))?n instanceof t&&n.name.value:this.variable.base.value,vt.call(B,e)>=0&&this.variable.error("class variable name may not be "+e),e&&(e=m.test(e)&&e)):null},n.prototype.setContext=function(e){return this.body.traverseChildren(!1,function(t){return t.classBody?!1:t instanceof x&&"this"===t.value?t.value=e:t instanceof h&&(t.klass=e,t.bound)?t.context=e:void 0})},n.prototype.addBoundFunctions=function(e){var n,i,s,r,o;for(o=this.boundFuncs,s=0,r=o.length;r>s;s++)n=o[s],i=new K(new x("this"),[new t(n)]).compile(e),this.ctor.body.unshift(new x(""+i+" = "+dt("bind")+"("+i+", this)"))},n.prototype.addProperties=function(e,n,s){var r,o,a,c,l;return l=e.base.properties.slice(0),a=function(){var e;for(e=[];r=l.shift();)r instanceof i&&(o=r.variable.base,delete r.context,c=r.value,"constructor"===o.value?(this.ctor&&r.error("cannot define more than one constructor in a class"),c.bound&&r.error("cannot define a constructor as a bound function"),c instanceof h?r=this.ctor=c:(this.externalCtor=s.scope.freeVariable("class"),r=new i(new x(this.externalCtor),c))):r.variable["this"]?(c["static"]=!0,c.bound&&(c.context=n)):(r.variable=new K(new x(n),[new t(new x("prototype")),new t(o)]),c instanceof h&&c.bound&&(this.boundFuncs.push(o),c.bound=!1))),e.push(r);return e}.call(this),Q(a)},n.prototype.walkBody=function(e,t){var i=this;return this.traverseChildren(!1,function(s){var o,a,c,h,l,u,p;if(o=!0,s instanceof n)return!1;if(s instanceof r){for(p=a=s.expressions,c=l=0,u=p.length;u>l;c=++l)h=p[c],h instanceof K&&h.isObject(!0)&&(o=!1,a[c]=i.addProperties(h,e,t));s.expressions=a=it(a)}return o&&!(s instanceof n)})},n.prototype.hoistDirectivePrologue=function(){var e,t,n;for(t=0,e=this.body.expressions;(n=e[t])&&n instanceof u||n instanceof K&&n.isString();)++t;return this.directives=e.splice(0,t)},n.prototype.ensureConstructor=function(e,t){var n,s,r;return n=!this.ctor,this.ctor||(this.ctor=new h),this.ctor.ctor=this.ctor.name=e,this.ctor.klass=null,this.ctor.noReturn=!0,n?(this.parent&&(r=new x(""+e+".__super__.constructor.apply(this, arguments)")),this.externalCtor&&(r=new x(""+this.externalCtor+".apply(this, arguments)")),r&&(s=new x(t.scope.freeVariable("ref")),this.ctor.body.unshift(new i(s,r))),this.addBoundFunctions(t),r&&(this.ctor.body.push(s),this.ctor.body.makeReturn()),this.body.expressions.unshift(this.ctor)):this.addBoundFunctions(t)},n.prototype.compileNode=function(e){var t,n,s,r,o,a,l;return n=this.determineName(),o=n||"_Class",o.reserved&&(o="_"+o),r=new x(o),this.hoistDirectivePrologue(),this.setContext(o),this.walkBody(o,e),this.ensureConstructor(o,e),this.body.spaced=!0,this.ctor instanceof h||this.body.expressions.unshift(this.ctor),this.body.expressions.push(r),(l=this.body.expressions).unshift.apply(l,this.directives),t=c.wrap(this.body),this.parent&&(this.superClass=new x(e.scope.freeVariable("super",!1)),this.body.expressions.unshift(new d(r,this.superClass)),t.args.push(this.parent),a=t.variable.params||t.variable.base.params,a.push(new I(this.superClass))),s=new _(t,!0),this.variable&&(s=new i(this.variable,s)),s.compileToFragments(e)},n}(s),e.Assign=i=function(e){function n(e,t,n,i){var s,r,o;this.variable=e,this.value=t,this.context=n,this.param=i&&i.param,this.subpattern=i&&i.subpattern,o=r=this.variable.unwrapAll().value,s=vt.call(B,o)>=0,s&&"object"!==this.context&&this.variable.error('variable name may not be "'+r+'"')}return yt(n,e),n.prototype.children=["variable","value"],n.prototype.isStatement=function(e){return(null!=e?e.level:void 0)===N&&null!=this.context&&vt.call(this.context,"?")>=0},n.prototype.assigns=function(e){return this["object"===this.context?"value":"variable"].assigns(e)},n.prototype.unfoldSoak=function(e){return pt(e,this,"variable")},n.prototype.compileNode=function(e){var t,n,i,s,r,o,a,c,l,u,p;if(i=this.variable instanceof K){if(this.variable.isArray()||this.variable.isObject())return this.compilePatternMatch(e);if(this.variable.isSplice())return this.compileSplice(e);if("||="===(c=this.context)||"&&="===c||"?="===c)return this.compileConditional(e)}return n=this.variable.compileToFragments(e,C),r=st(n),this.context||(a=this.variable.unwrapAll(),a.isAssignable()||this.variable.error('"'+this.variable.compile(e)+'" cannot be assigned'),("function"==typeof a.hasProperties?a.hasProperties():void 0)||(this.param?e.scope.add(r,"var"):e.scope.find(r))),this.value instanceof h&&(s=E.exec(r))&&(s[1]&&(this.value.klass=s[1]),this.value.name=null!=(l=null!=(u=null!=(p=s[2])?p:s[3])?u:s[4])?l:s[5]),o=this.value.compileToFragments(e,C),"object"===this.context?n.concat(this.makeCode(": "),o):(t=n.concat(this.makeCode(" "+(this.context||"=")+" "),o),e.level<=C?t:this.wrapInBraces(t))},n.prototype.compilePatternMatch=function(e){var i,s,r,o,a,c,h,l,u,p,d,f,b,k,g,y,w,T,L,E,D,S,R,A,I,O,j,M;if(y=e.level===N,T=this.value,d=this.variable.base.objects,!(f=d.length))return r=T.compileToFragments(e),e.level>=F?this.wrapInBraces(r):r;if(h=this.variable.isObject(),y&&1===f&&!((p=d[0])instanceof U))return p instanceof n?(R=p,A=R.variable,c=A.base,p=R.value):c=h?p["this"]?p.properties[0].name:p:new x(0),i=m.test(c.unwrap().value||0),T=new K(T),T.properties.push(new(i?t:v)(c)),I=p.unwrap().value,vt.call($,I)>=0&&p.error("assignment to a reserved word: "+p.compile(e)),new n(p,T,null,{param:this.param}).compileToFragments(e,N);for(L=T.compileToFragments(e,C),E=st(L),s=[],g=!1,(!m.test(E)||this.variable.assigns(E))&&(s.push([this.makeCode(""+(b=e.scope.freeVariable("ref"))+" = ")].concat(wt.call(L))),L=[this.makeCode(b)],E=b),a=D=0,S=d.length;S>D;a=++D)p=d[a],c=a,h&&(p instanceof n?(O=p,j=O.variable,c=j.base,p=O.value):p.base instanceof _?(M=new K(p.unwrapAll()).cacheReference(e),p=M[0],c=M[1]):c=p["this"]?p.properties[0].name:p),!g&&p instanceof U?(u=p.name.unwrap().value,p=p.unwrap(),w=""+f+" <= "+E+".length ? "+dt("slice")+".call("+E+", "+a,(k=f-a-1)?(l=e.scope.freeVariable("i"),w+=", "+l+" = "+E+".length - "+k+") : ("+l+" = "+a+", [])"):w+=") : []",w=new x(w),g=""+l+"++"):(u=p.unwrap().value,p instanceof U&&p.error("multiple splats are disallowed in an assignment"),"number"==typeof c?(c=new x(g||c),i=!1):i=h&&m.test(c.unwrap().value||0),w=new K(new x(E),[new(i?t:v)(c)])),null!=u&&vt.call($,u)>=0&&p.error("assignment to a reserved word: "+p.compile(e)),s.push(new n(p,w,null,{param:this.param,subpattern:!0}).compileToFragments(e,C));
return y||this.subpattern||s.push(L),o=this.joinFragmentArrays(s,", "),e.level<C?o:this.wrapInBraces(o)},n.prototype.compileConditional=function(e){var t,i,s;return s=this.variable.cacheReference(e),t=s[0],i=s[1],!t.properties.length&&t.base instanceof x&&"this"!==t.base.value&&!e.scope.check(t.base.value)&&this.variable.error('the variable "'+t.base.value+"\" can't be assigned with "+this.context+" because it has not been declared before"),vt.call(this.context,"?")>=0&&(e.isExistentialEquals=!0),new A(this.context.slice(0,-1),t,new n(i,this.value,"=")).compileToFragments(e)},n.prototype.compileSplice=function(e){var t,n,i,s,r,o,a,c,h,l,u,p;return l=this.variable.properties.pop().range,i=l.from,a=l.to,n=l.exclusive,o=this.variable.compile(e),i?(u=this.cacheToCodeFragments(i.cache(e,F)),s=u[0],r=u[1]):s=r="0",a?(null!=i?i.isSimpleNumber():void 0)&&a.isSimpleNumber()?(a=+a.compile(e)-+r,n||(a+=1)):(a=a.compile(e,w)+" - "+r,n||(a+=" + 1")):a="9e9",p=this.value.cache(e,C),c=p[0],h=p[1],t=[].concat(this.makeCode("[].splice.apply("+o+", ["+s+", "+a+"].concat("),c,this.makeCode(")), "),h),e.level>N?this.wrapInBraces(t):t},n}(s),e.Code=h=function(e){function t(e,t,n){this.params=e||[],this.body=t||new r,this.bound="boundfunc"===n,this.bound&&(this.context="_this")}return yt(t,e),t.prototype.children=["params","body"],t.prototype.isStatement=function(){return!!this.ctor},t.prototype.jumps=S,t.prototype.compileNode=function(e){var t,s,r,o,a,c,h,l,u,p,d,f,m,b,k,y,v,T,C,F,L,N,E,D,S,R,I,_,$;for(e.scope=new V(e.scope,this.body,this),e.scope.shared=et(e,"sharedScope"),e.indent+=H,delete e.bare,delete e.isExistentialEquals,u=[],r=[],this.eachParamName(function(t){return e.scope.check(t)?void 0:e.scope.parameter(t)}),S=this.params,k=0,C=S.length;C>k;k++)if(l=S[k],l.splat){for(R=this.params,y=0,F=R.length;F>y;y++)h=R[y].name,h["this"]&&(h=h.properties[0].name),h.value&&e.scope.add(h.value,"var",!0);d=new i(new K(new n(function(){var t,n,i,s;for(i=this.params,s=[],t=0,n=i.length;n>t;t++)h=i[t],s.push(h.asReference(e));return s}.call(this))),new K(new x("arguments")));break}for(I=this.params,v=0,L=I.length;L>v;v++)l=I[v],l.isComplex()?(m=p=l.asReference(e),l.value&&(m=new A("?",p,l.value)),r.push(new i(new K(l.name),m,"=",{param:!0}))):(p=l,l.value&&(c=new x(p.name.value+" == null"),m=new i(new K(l.name),l.value,"="),r.push(new g(c,m)))),d||u.push(p);for(b=this.body.isEmpty(),d&&r.unshift(d),r.length&&(_=this.body.expressions).unshift.apply(_,r),o=T=0,N=u.length;N>T;o=++T)h=u[o],u[o]=h.compileToFragments(e),e.scope.parameter(st(u[o]));for(f=[],this.eachParamName(function(e,t){return vt.call(f,e)>=0&&t.error("multiple parameters named '"+e+"'"),f.push(e)}),b||this.noReturn||this.body.makeReturn(),this.bound&&((null!=($=e.scope.parent.method)?$.bound:void 0)?this.bound=this.context=e.scope.parent.method.context:this["static"]||e.scope.parent.assign("_this","this")),a=e.indent,s="function",this.ctor&&(s+=" "+this.name),s+="(",t=[this.makeCode(s)],o=D=0,E=u.length;E>D;o=++D)h=u[o],o&&t.push(this.makeCode(", ")),t.push.apply(t,h);return t.push(this.makeCode(") {")),this.body.isEmpty()||(t=t.concat(this.makeCode("\n"),this.body.compileWithDeclarations(e),this.makeCode("\n"+this.tab))),t.push(this.makeCode("}")),this.ctor?[this.makeCode(this.tab)].concat(wt.call(t)):this.front||e.level>=w?this.wrapInBraces(t):t},t.prototype.eachParamName=function(e){var t,n,i,s,r;for(s=this.params,r=[],n=0,i=s.length;i>n;n++)t=s[n],r.push(t.eachName(e));return r},t.prototype.traverseChildren=function(e,n){return e?t.__super__.traverseChildren.call(this,e,n):void 0},t}(s),e.Param=I=function(e){function t(e,t,n){var i;this.name=e,this.value=t,this.splat=n,i=e=this.name.unwrapAll().value,vt.call(B,i)>=0&&this.name.error('parameter name "'+e+'" is not allowed')}return yt(t,e),t.prototype.children=["name","value"],t.prototype.compileToFragments=function(e){return this.name.compileToFragments(e,C)},t.prototype.asReference=function(e){var t;return this.reference?this.reference:(t=this.name,t["this"]?(t=t.properties[0].name,t.value.reserved&&(t=new x(e.scope.freeVariable(t.value)))):t.isComplex()&&(t=new x(e.scope.freeVariable("arg"))),t=new K(t),this.splat&&(t=new U(t)),this.reference=t)},t.prototype.isComplex=function(){return this.name.isComplex()},t.prototype.eachName=function(e,t){var n,s,r,o,a,c;if(null==t&&(t=this.name),n=function(t){var n;return n=t.properties[0].name,n.value.reserved?void 0:e(n.value,n)},t instanceof x)return e(t.value,t);if(t instanceof K)return n(t);for(c=t.objects,o=0,a=c.length;a>o;o++)r=c[o],r instanceof i?this.eachName(e,r.value.unwrap()):r instanceof U?(s=r.name.unwrap(),e(s.value,s)):r instanceof K?r.isArray()||r.isObject()?this.eachName(e,r.base):r["this"]?n(r):e(r.base.value,r.base):r.error("illegal parameter "+r.compile())},t}(s),e.Splat=U=function(e){function t(e){this.name=e.compile?e:new x(e)}return yt(t,e),t.prototype.children=["name"],t.prototype.isAssignable=J,t.prototype.assigns=function(e){return this.name.assigns(e)},t.prototype.compileToFragments=function(e){return this.name.compileToFragments(e)},t.prototype.unwrap=function(){return this.name},t.compileSplattedArray=function(e,n,i){var s,r,o,a,c,h,l,u,p,d;for(l=-1;(u=n[++l])&&!(u instanceof t););if(l>=n.length)return[];if(1===n.length)return u=n[0],c=u.compileToFragments(e,C),i?c:[].concat(u.makeCode(""+dt("slice")+".call("),c,u.makeCode(")"));for(s=n.slice(l),h=p=0,d=s.length;d>p;h=++p)u=s[h],o=u.compileToFragments(e,C),s[h]=u instanceof t?[].concat(u.makeCode(""+dt("slice")+".call("),o,u.makeCode(")")):[].concat(u.makeCode("["),o,u.makeCode("]"));return 0===l?(u=n[0],a=u.joinFragmentArrays(s.slice(1),", "),s[0].concat(u.makeCode(".concat("),a,u.makeCode(")"))):(r=function(){var t,i,s,r;for(s=n.slice(0,l),r=[],t=0,i=s.length;i>t;t++)u=s[t],r.push(u.compileToFragments(e,C));return r}(),r=n[0].joinFragmentArrays(r,", "),a=n[l].joinFragmentArrays(s,", "),[].concat(n[0].makeCode("["),r,n[l].makeCode("].concat("),a,rt(n).makeCode(")")))},t}(s),e.While=z=function(e){function t(e,t){this.condition=(null!=t?t.invert:void 0)?e.invert():e,this.guard=null!=t?t.guard:void 0}return yt(t,e),t.prototype.children=["condition","guard","body"],t.prototype.isStatement=J,t.prototype.makeReturn=function(e){return e?t.__super__.makeReturn.apply(this,arguments):(this.returns=!this.jumps({loop:!0}),this)},t.prototype.addBody=function(e){return this.body=e,this},t.prototype.jumps=function(){var e,t,n,i;if(e=this.body.expressions,!e.length)return!1;for(n=0,i=e.length;i>n;n++)if(t=e[n],t.jumps({loop:!0}))return t;return!1},t.prototype.compileNode=function(e){var t,n,i,s;return e.indent+=H,s="",n=this.body,n.isEmpty()?n=this.makeCode(""):(this.returns&&(n.makeReturn(i=e.scope.freeVariable("results")),s=""+this.tab+i+" = [];\n"),this.guard&&(n.expressions.length>1?n.expressions.unshift(new g(new _(this.guard).invert(),new x("continue"))):this.guard&&(n=r.wrap([new g(this.guard,n)]))),n=[].concat(this.makeCode("\n"),n.compileToFragments(e,N),this.makeCode("\n"+this.tab))),t=[].concat(this.makeCode(s+this.tab+"while ("),this.condition.compileToFragments(e,L),this.makeCode(") {"),n,this.makeCode("}")),this.returns&&t.push(this.makeCode("\n"+this.tab+"return "+i+";")),t},t}(s),e.Op=A=function(e){function t(e,t,i,s){if("in"===e)return new y(t,i);if("do"===e)return this.generateDo(t);if("new"===e){if(t instanceof o&&!t["do"]&&!t.isNew)return t.newInstance();(t instanceof h&&t.bound||t["do"])&&(t=new _(t))}return this.operator=n[e]||e,this.first=t,this.second=i,this.flip=!!s,this}var n,s;return yt(t,e),n={"==":"===","!=":"!==",of:"in"},s={"!==":"===","===":"!=="},t.prototype.children=["first","second"],t.prototype.isSimpleNumber=S,t.prototype.isUnary=function(){return!this.second},t.prototype.isComplex=function(){var e;return!(this.isUnary()&&("+"===(e=this.operator)||"-"===e))||this.first.isComplex()},t.prototype.isChainable=function(){var e;return"<"===(e=this.operator)||">"===e||">="===e||"<="===e||"==="===e||"!=="===e},t.prototype.invert=function(){var e,n,i,r,o;if(this.isChainable()&&this.first.isChainable()){for(e=!0,n=this;n&&n.operator;)e&&(e=n.operator in s),n=n.first;if(!e)return new _(this).invert();for(n=this;n&&n.operator;)n.invert=!n.invert,n.operator=s[n.operator],n=n.first;return this}return(r=s[this.operator])?(this.operator=r,this.first.unwrap()instanceof t&&this.first.invert(),this):this.second?new _(this).invert():"!"===this.operator&&(i=this.first.unwrap())instanceof t&&("!"===(o=i.operator)||"in"===o||"instanceof"===o)?i:new t("!",this)},t.prototype.unfoldSoak=function(e){var t;return("++"===(t=this.operator)||"--"===t||"delete"===t)&&pt(e,this,"first")},t.prototype.generateDo=function(e){var t,n,s,r,a,c,l,u;for(r=[],n=e instanceof i&&(a=e.value.unwrap())instanceof h?a:e,u=n.params||[],c=0,l=u.length;l>c;c++)s=u[c],s.value?(r.push(s.value),delete s.value):r.push(s);return t=new o(e,r),t["do"]=!0,t},t.prototype.compileNode=function(e){var t,n,i,s;return n=this.isChainable()&&this.first.isChainable(),n||(this.first.front=this.front),"delete"===this.operator&&e.scope.check(this.first.unwrapAll().value)&&this.error("delete operand may not be argument or var"),("--"===(i=this.operator)||"++"===i)&&(s=this.first.unwrapAll().value,vt.call(B,s)>=0)&&this.error('cannot increment/decrement "'+this.first.unwrapAll().value+'"'),this.isUnary()?this.compileUnary(e):n?this.compileChain(e):"?"===this.operator?this.compileExistence(e):(t=[].concat(this.first.compileToFragments(e,F),this.makeCode(" "+this.operator+" "),this.second.compileToFragments(e,F)),e.level<=F?t:this.wrapInBraces(t))},t.prototype.compileChain=function(e){var t,n,i,s;return s=this.first.second.cache(e),this.first.second=s[0],i=s[1],n=this.first.compileToFragments(e,F),t=n.concat(this.makeCode(" "+(this.invert?"&&":"||")+" "),i.compileToFragments(e),this.makeCode(" "+this.operator+" "),this.second.compileToFragments(e,F)),this.wrapInBraces(t)},t.prototype.compileExistence=function(e){var t,n;return!e.isExistentialEquals&&this.first.isComplex()?(n=new x(e.scope.freeVariable("ref")),t=new _(new i(n,this.first))):(t=this.first,n=t),new g(new p(t),n,{type:"if"}).addElse(this.second).compileToFragments(e)},t.prototype.compileUnary=function(e){var n,i,s;return i=[],n=this.operator,i.push([this.makeCode(n)]),"!"===n&&this.first instanceof p?(this.first.negated=!this.first.negated,this.first.compileToFragments(e)):e.level>=w?new _(this).compileToFragments(e):(s="+"===n||"-"===n,("new"===n||"typeof"===n||"delete"===n||s&&this.first instanceof t&&this.first.operator===n)&&i.push([this.makeCode(" ")]),(s&&this.first instanceof t||"new"===n&&this.first.isStatement(e))&&(this.first=new _(this.first)),i.push(this.first.compileToFragments(e,F)),this.flip&&i.reverse(),this.joinFragmentArrays(i,""))},t.prototype.toString=function(e){return t.__super__.toString.call(this,e,this.constructor.name+" "+this.operator)},t}(s),e.In=y=function(e){function t(e,t){this.object=e,this.array=t}return yt(t,e),t.prototype.children=["object","array"],t.prototype.invert=D,t.prototype.compileNode=function(e){var t,n,i,s,r;if(this.array instanceof K&&this.array.isArray()){for(r=this.array.base.objects,i=0,s=r.length;s>i;i++)if(n=r[i],n instanceof U){t=!0;break}if(!t)return this.compileOrTest(e)}return this.compileLoopTest(e)},t.prototype.compileOrTest=function(e){var t,n,i,s,r,o,a,c,h,l,u,p;if(0===this.array.base.objects.length)return[this.makeCode(""+!!this.negated)];for(l=this.object.cache(e,F),o=l[0],r=l[1],u=this.negated?[" !== "," && "]:[" === "," || "],t=u[0],n=u[1],a=[],p=this.array.base.objects,i=c=0,h=p.length;h>c;i=++c)s=p[i],i&&a.push(this.makeCode(n)),a=a.concat(i?r:o,this.makeCode(t),s.compileToFragments(e,w));return e.level<F?a:this.wrapInBraces(a)},t.prototype.compileLoopTest=function(e){var t,n,i,s;return s=this.object.cache(e,C),i=s[0],n=s[1],t=[].concat(this.makeCode(dt("indexOf")+".call("),this.array.compileToFragments(e,C),this.makeCode(", "),n,this.makeCode(") "+(this.negated?"< 0":">= 0"))),st(i)===st(n)?t:(t=i.concat(this.makeCode(", "),t),e.level<C?t:this.wrapInBraces(t))},t.prototype.toString=function(e){return t.__super__.toString.call(this,e,this.constructor.name+(this.negated?"!":""))},t}(s),e.Try=X=function(e){function t(e,t,n,i){this.attempt=e,this.errorVariable=t,this.recovery=n,this.ensure=i}return yt(t,e),t.prototype.children=["attempt","recovery","ensure"],t.prototype.isStatement=J,t.prototype.jumps=function(e){var t;return this.attempt.jumps(e)||(null!=(t=this.recovery)?t.jumps(e):void 0)},t.prototype.makeReturn=function(e){return this.attempt&&(this.attempt=this.attempt.makeReturn(e)),this.recovery&&(this.recovery=this.recovery.makeReturn(e)),this},t.prototype.compileNode=function(e){var t,n,s,r;return e.indent+=H,r=this.attempt.compileToFragments(e,N),t=this.recovery?(s=new x("_error"),this.errorVariable?this.recovery.unshift(new i(this.errorVariable,s)):void 0,[].concat(this.makeCode(" catch ("),s.compileToFragments(e),this.makeCode(") {\n"),this.recovery.compileToFragments(e,N),this.makeCode("\n"+this.tab+"}"))):this.ensure||this.recovery?[]:[this.makeCode(" catch (_error) {}")],n=this.ensure?[].concat(this.makeCode(" finally {\n"),this.ensure.compileToFragments(e,N),this.makeCode("\n"+this.tab+"}")):[],[].concat(this.makeCode(""+this.tab+"try {\n"),r,this.makeCode("\n"+this.tab+"}"),t,n)},t}(s),e.Throw=W=function(e){function t(e){this.expression=e}return yt(t,e),t.prototype.children=["expression"],t.prototype.isStatement=J,t.prototype.jumps=S,t.prototype.makeReturn=G,t.prototype.compileNode=function(e){return[].concat(this.makeCode(this.tab+"throw "),this.expression.compileToFragments(e),this.makeCode(";"))},t}(s),e.Existence=p=function(e){function t(e){this.expression=e}return yt(t,e),t.prototype.children=["expression"],t.prototype.invert=D,t.prototype.compileNode=function(e){var t,n,i,s;return this.expression.front=this.front,i=this.expression.compile(e,F),m.test(i)&&!e.scope.check(i)?(s=this.negated?["===","||"]:["!==","&&"],t=s[0],n=s[1],i="typeof "+i+" "+t+' "undefined" '+n+" "+i+" "+t+" null"):i=""+i+" "+(this.negated?"==":"!=")+" null",[this.makeCode(e.level<=T?i:"("+i+")")]},t}(s),e.Parens=_=function(e){function t(e){this.body=e}return yt(t,e),t.prototype.children=["body"],t.prototype.unwrap=function(){return this.body},t.prototype.isComplex=function(){return this.body.isComplex()},t.prototype.compileNode=function(e){var t,n,i;return n=this.body.unwrap(),n instanceof K&&n.isAtomic()?(n.front=this.front,n.compileToFragments(e)):(i=n.compileToFragments(e,L),t=e.level<F&&(n instanceof A||n instanceof o||n instanceof f&&n.returns),t?i:this.wrapInBraces(i))},t}(s),e.For=f=function(e){function t(e,t){var n;this.source=t.source,this.guard=t.guard,this.step=t.step,this.name=t.name,this.index=t.index,this.body=r.wrap([e]),this.own=!!t.own,this.object=!!t.object,this.object&&(n=[this.index,this.name],this.name=n[0],this.index=n[1]),this.index instanceof K&&this.index.error("index cannot be a pattern matching expression"),this.range=this.source instanceof K&&this.source.base instanceof O&&!this.source.properties.length,this.pattern=this.name instanceof K,this.range&&this.index&&this.index.error("indexes do not apply to range loops"),this.range&&this.pattern&&this.name.error("cannot pattern match over range loops"),this.own&&!this.object&&this.index.error("cannot use own with for-in"),this.returns=!1}return yt(t,e),t.prototype.children=["body","source","guard","step"],t.prototype.compileNode=function(e){var t,n,s,o,a,c,h,l,u,p,d,f,b,k,y,v,w,T,F,L,E,D,S,R,A,I,$,O,B,V,P,U,q,G;return t=r.wrap([this.body]),T=null!=(q=rt(t.expressions))?q.jumps():void 0,T&&T instanceof j&&(this.returns=!1),$=this.range?this.source.base:this.source,I=e.scope,L=this.name&&this.name.compile(e,C),k=this.index&&this.index.compile(e,C),L&&!this.pattern&&I.find(L),k&&I.find(k),this.returns&&(A=I.freeVariable("results")),y=this.object&&k||I.freeVariable("i"),v=this.range&&L||k||y,w=v!==y?""+v+" = ":"",this.step&&!this.range&&(G=this.cacheToCodeFragments(this.step.cache(e,C)),O=G[0],V=G[1],B=V.match(M)),this.pattern&&(L=y),U="",d="",h="",f=this.tab+H,this.range?p=$.compileToFragments(at(e,{index:y,name:L,step:this.step})):(P=this.source.compile(e,C),!L&&!this.own||m.test(P)||(h+=""+this.tab+(D=I.freeVariable("ref"))+" = "+P+";\n",P=D),L&&!this.pattern&&(E=""+L+" = "+P+"["+v+"]"),this.object||(O!==V&&(h+=""+this.tab+O+";\n"),this.step&&B&&(u=0>+B)||(F=I.freeVariable("len")),a=""+w+y+" = 0, "+F+" = "+P+".length",c=""+w+y+" = "+P+".length - 1",s=""+y+" < "+F,o=""+y+" >= 0",this.step?(B?u&&(s=o,a=c):(s=""+V+" > 0 ? "+s+" : "+o,a="("+V+" > 0 ? ("+a+") : "+c+")"),b=""+y+" += "+V):b=""+(v!==y?"++"+y:""+y+"++"),p=[this.makeCode(""+a+"; "+s+"; "+w+b)])),this.returns&&(S=""+this.tab+A+" = [];\n",R="\n"+this.tab+"return "+A+";",t.makeReturn(A)),this.guard&&(t.expressions.length>1?t.expressions.unshift(new g(new _(this.guard).invert(),new x("continue"))):this.guard&&(t=r.wrap([new g(this.guard,t)]))),this.pattern&&t.expressions.unshift(new i(this.name,new x(""+P+"["+v+"]"))),l=[].concat(this.makeCode(h),this.pluckDirectCall(e,t)),E&&(U="\n"+f+E+";"),this.object&&(p=[this.makeCode(""+v+" in "+P)],this.own&&(d="\n"+f+"if (!"+dt("hasProp")+".call("+P+", "+v+")) continue;")),n=t.compileToFragments(at(e,{indent:f}),N),n&&n.length>0&&(n=[].concat(this.makeCode("\n"),n,this.makeCode("\n"))),[].concat(l,this.makeCode(""+(S||"")+this.tab+"for ("),p,this.makeCode(") {"+d+U),n,this.makeCode(""+this.tab+"}"+(R||"")))},t.prototype.pluckDirectCall=function(e,t){var n,s,r,a,c,l,u,p,d,f,m,b,k,g,y;for(s=[],f=t.expressions,c=p=0,d=f.length;d>p;c=++p)r=f[c],r=r.unwrapAll(),r instanceof o&&(u=r.variable.unwrapAll(),(u instanceof h||u instanceof K&&(null!=(m=u.base)?m.unwrapAll():void 0)instanceof h&&1===u.properties.length&&("call"===(b=null!=(k=u.properties[0].name)?k.value:void 0)||"apply"===b))&&(a=(null!=(g=u.base)?g.unwrapAll():void 0)||u,l=new x(e.scope.freeVariable("fn")),n=new K(l),u.base&&(y=[n,u],u.base=y[0],n=y[1]),t.expressions[c]=new o(n,r.args),s=s.concat(this.makeCode(this.tab),new i(l,a).compileToFragments(e,N),this.makeCode(";\n"))));return s},t}(z),e.Switch=q=function(e){function t(e,t,n){this.subject=e,this.cases=t,this.otherwise=n}return yt(t,e),t.prototype.children=["subject","cases","otherwise"],t.prototype.isStatement=J,t.prototype.jumps=function(e){var t,n,i,s,r,o,a;for(null==e&&(e={block:!0}),r=this.cases,i=0,s=r.length;s>i;i++)if(o=r[i],n=o[0],t=o[1],t.jumps(e))return t;return null!=(a=this.otherwise)?a.jumps(e):void 0},t.prototype.makeReturn=function(e){var t,n,i,s,o;for(s=this.cases,n=0,i=s.length;i>n;n++)t=s[n],t[1].makeReturn(e);return e&&(this.otherwise||(this.otherwise=new r([new x("void 0")]))),null!=(o=this.otherwise)&&o.makeReturn(e),this},t.prototype.compileNode=function(e){var t,n,i,s,r,o,a,c,h,l,u,p,d,f,m,b;for(c=e.indent+H,h=e.indent=c+H,o=[].concat(this.makeCode(this.tab+"switch ("),this.subject?this.subject.compileToFragments(e,L):this.makeCode("false"),this.makeCode(") {\n")),f=this.cases,a=l=0,p=f.length;p>l;a=++l){for(m=f[a],s=m[0],t=m[1],b=it([s]),u=0,d=b.length;d>u;u++)i=b[u],this.subject||(i=i.invert()),o=o.concat(this.makeCode(c+"case "),i.compileToFragments(e,L),this.makeCode(":\n"));if((n=t.compileToFragments(e,N)).length>0&&(o=o.concat(n,this.makeCode("\n"))),a===this.cases.length-1&&!this.otherwise)break;r=this.lastNonComment(t.expressions),r instanceof j||r instanceof x&&r.jumps()&&"debugger"!==r.value||o.push(i.makeCode(h+"break;\n"))}return this.otherwise&&this.otherwise.expressions.length&&o.push.apply(o,[this.makeCode(c+"default:\n")].concat(wt.call(this.otherwise.compileToFragments(e,N)),[this.makeCode("\n")])),o.push(this.makeCode(this.tab+"}")),o},t}(s),e.If=g=function(e){function t(e,t,n){this.body=t,null==n&&(n={}),this.condition="unless"===n.type?e.invert():e,this.elseBody=null,this.isChain=!1,this.soak=n.soak}return yt(t,e),t.prototype.children=["condition","body","elseBody"],t.prototype.bodyNode=function(){var e;return null!=(e=this.body)?e.unwrap():void 0},t.prototype.elseBodyNode=function(){var e;return null!=(e=this.elseBody)?e.unwrap():void 0},t.prototype.addElse=function(e){return this.isChain?this.elseBodyNode().addElse(e):(this.isChain=e instanceof t,this.elseBody=this.ensureBlock(e)),this},t.prototype.isStatement=function(e){var t;return(null!=e?e.level:void 0)===N||this.bodyNode().isStatement(e)||(null!=(t=this.elseBodyNode())?t.isStatement(e):void 0)},t.prototype.jumps=function(e){var t;return this.body.jumps(e)||(null!=(t=this.elseBody)?t.jumps(e):void 0)},t.prototype.compileNode=function(e){return this.isStatement(e)?this.compileStatement(e):this.compileExpression(e)},t.prototype.makeReturn=function(e){return e&&(this.elseBody||(this.elseBody=new r([new x("void 0")]))),this.body&&(this.body=new r([this.body.makeReturn(e)])),this.elseBody&&(this.elseBody=new r([this.elseBody.makeReturn(e)])),this},t.prototype.ensureBlock=function(e){return e instanceof r?e:new r([e])},t.prototype.compileStatement=function(e){var n,i,s,r,o,a,c;return s=et(e,"chainChild"),(o=et(e,"isExistentialEquals"))?new t(this.condition.invert(),this.elseBodyNode(),{type:"if"}).compileToFragments(e):(c=e.indent+H,r=this.condition.compileToFragments(e,L),i=this.ensureBlock(this.body).compileToFragments(at(e,{indent:c})),a=[].concat(this.makeCode("if ("),r,this.makeCode(") {\n"),i,this.makeCode("\n"+this.tab+"}")),s||a.unshift(this.makeCode(this.tab)),this.elseBody?(n=a.concat(this.makeCode(" else ")),this.isChain?(e.chainChild=!0,n=n.concat(this.elseBody.unwrap().compileToFragments(e,N))):n=n.concat(this.makeCode("{\n"),this.elseBody.compileToFragments(at(e,{indent:c}),N),this.makeCode("\n"+this.tab+"}")),n):a)},t.prototype.compileExpression=function(e){var t,n,i,s;return i=this.condition.compileToFragments(e,T),n=this.bodyNode().compileToFragments(e,C),t=this.elseBodyNode()?this.elseBodyNode().compileToFragments(e,C):[this.makeCode("void 0")],s=i.concat(this.makeCode(" ? "),n,this.makeCode(" : "),t),e.level>=T?this.wrapInBraces(s):s},t.prototype.unfoldSoak=function(){return this.soak&&this},t}(s),c={wrap:function(e,n,i){var s,a,c,l,u;return e.jumps()?e:(l=new h([],r.wrap([e])),s=[],a=e.contains(this.isLiteralArguments),a&&e.classBody&&a.error("Class bodies shouldn't reference arguments"),(a||e.contains(this.isLiteralThis))&&(u=new x(a?"apply":"call"),s=[new x("this")],a&&s.push(new x("arguments")),l=new K(l,[new t(u)])),l.noReturn=i,c=new o(l,s),n?r.wrap([c]):c)},isLiteralArguments:function(e){return e instanceof x&&"arguments"===e.value&&!e.asKey},isLiteralThis:function(e){return e instanceof x&&"this"===e.value&&!e.asKey||e instanceof h&&e.bound||e instanceof o&&e.isSuper}},pt=function(e,t,n){var i;if(i=t[n].unfoldSoak(e))return t[n]=i.body,i.body=new K(t),i},Y={"extends":function(){return"function(child, parent) { for (var key in parent) { if ("+dt("hasProp")+".call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; }"},bind:function(){return"function(fn, me){ return function(){ return fn.apply(me, arguments); }; }"},indexOf:function(){return"[].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; }"},hasProp:function(){return"{}.hasOwnProperty"},slice:function(){return"[].slice"}},N=1,L=2,C=3,T=4,F=5,w=6,H="  ",b="[$A-Za-z_\\x7f-\\uffff][$\\w\\x7f-\\uffff]*",m=RegExp("^"+b+"$"),M=/^[+-]?\d+$/,E=RegExp("^(?:("+b+")\\.prototype(?:\\.("+b+")|\\[(\"(?:[^\\\\\"\\r\\n]|\\\\.)*\"|'(?:[^\\\\'\\r\\n]|\\\\.)*')\\]|\\[(0x[\\da-fA-F]+|\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\]))|("+b+")$"),k=/^['"]/,dt=function(e){var t;return t="__"+e,V.root.assign(t,Y[e]()),t},ct=function(e,t){return e=e.replace(/\n/g,"$&"+t),e.replace(/\s+$/,"")}}.call(this),t.exports}(),require["./sourcemap"]=function(){var e={},t={exports:e};return function(){var e,n;e=function(){function e(e){this.line=e,this.columns=[]}return e.prototype.add=function(e,t,n){var i,s;return s=t[0],i=t[1],null==n&&(n={}),this.columns[e]&&n.noReplace?void 0:this.columns[e]={line:this.line,column:e,sourceLine:s,sourceColumn:i}},e.prototype.sourceLocation=function(e){for(var t;!((t=this.columns[e])||0>=e);)e--;return t&&[t.sourceLine,t.sourceColumn]},e}(),n=function(){function t(){this.lines=[]}var n,i,s,r;return t.prototype.add=function(t,n,i){var s,r,o,a;return null==i&&(i={}),r=n[0],s=n[1],o=(a=this.lines)[r]||(a[r]=new e(r)),o.add(s,t,i)},t.prototype.sourceLocation=function(e){var t,n,i;for(n=e[0],t=e[1];!((i=this.lines[n])||0>=n);)n--;return i&&i.sourceLocation(t)},t.prototype.generate=function(e,t){var n,i,s,r,o,a,c,h,l,u,p,d,f,m,b,k;for(null==e&&(e={}),null==t&&(t=null),u=0,i=0,r=0,s=0,h=!1,n="",b=this.lines,a=p=0,f=b.length;f>p;a=++p)if(o=b[a])for(k=o.columns,d=0,m=k.length;m>d;d++)if(c=k[d]){for(;u<c.line;)i=0,h=!1,n+=";",u++;h&&(n+=",",h=!1),n+=this.encodeVlq(c.column-i),i=c.column,n+=this.encodeVlq(0),n+=this.encodeVlq(c.sourceLine-r),r=c.sourceLine,n+=this.encodeVlq(c.sourceColumn-s),s=c.sourceColumn,h=!0}return l={version:3,file:e.generatedFile||"",sourceRoot:e.sourceRoot||"",sources:e.sourceFiles||[""],names:[],mappings:n},e.inline&&(l.sourcesContent=[t]),JSON.stringify(l,null,2)},s=5,i=1<<s,r=i-1,t.prototype.encodeVlq=function(e){var t,n,o,a;for(t="",o=0>e?1:0,a=(Math.abs(e)<<1)+o;a||!t;)n=a&r,a>>=s,a&&(n|=i),t+=this.encodeBase64(n);return t},n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",t.prototype.encodeBase64=function(e){return n[e]||function(){throw new Error("Cannot Base64 encode value: "+e)}()},t}(),t.exports=n}.call(this),t.exports}(),require["./coffee-script"]=function(){var e={},t={exports:e};return function(){var t,n,i,s,r,o,a,c,h,l,u,p,d,f,m,b,k,g,y,v,w,T,C={}.hasOwnProperty;if(l=require("fs"),y=require("vm"),k=require("path"),s=require("child_process"),t=require("./lexer").Lexer,f=require("./parser").parser,u=require("./helpers"),i=require("./sourcemap"),e.VERSION="1.6.3",e.helpers=u,e.compile=r=function(e,t){var n,s,r,o,a,c,h,l,d,m,b,k;for(null==t&&(t={}),d=u.merge,t.sourceMap&&(l=new i),a=f.parse(p.tokenize(e,t)).compileToFragments(t),r=0,t.header&&(r+=1),t.shiftLine&&(r+=1),s=0,h="",b=0,k=a.length;k>b;b++)o=a[b],t.sourceMap&&(o.locationData&&l.add([o.locationData.first_line,o.locationData.first_column],[r,s],{noReplace:!0}),m=u.count(o.code,"\n"),r+=m,s=o.code.length-(m?o.code.lastIndexOf("\n"):0)),h+=o.code;return t.header&&(c="Generated by CoffeeScript "+this.VERSION,h="// "+c+"\n"+h),t.sourceMap?(n={js:h},n.sourceMap=l,n.v3SourceMap=l.generate(t,e),n):h},e.tokens=function(e,t){return p.tokenize(e,t)},e.nodes=function(e,t){return"string"==typeof e?f.parse(p.tokenize(e,t)):f.parse(e)},e.run=function(e,t){var n,i;return null==t&&(t={}),i=require.main,null==t.sourceMap&&(t.sourceMap=!0),i.filename=process.argv[1]=t.filename?l.realpathSync(t.filename):".",i.moduleCache&&(i.moduleCache={}),i.paths=require("module")._nodeModulePaths(k.dirname(l.realpathSync(t.filename||"."))),!u.isCoffee(i.filename)||require.extensions?(n=r(e,t),m(),g[i.filename]=n.sourceMap,i._compile(n.js,i.filename)):i._compile(e,i.filename)},e.eval=function(e,t){var n,i,s,o,a,c,h,l,u,p,d,f,m,b;if(null==t&&(t={}),e=e.trim()){if(i=y.Script){if(null!=t.sandbox){if(t.sandbox instanceof i.createContext().constructor)h=t.sandbox;else{h=i.createContext(),f=t.sandbox;for(o in f)C.call(f,o)&&(l=f[o],h[o]=l)}h.global=h.root=h.GLOBAL=h}else h=global;if(h.__filename=t.filename||"eval",h.__dirname=k.dirname(h.__filename),h===global&&!h.module&&!h.require){for(n=require("module"),h.module=d=new n(t.modulename||"eval"),h.require=b=function(e){return n._load(e,d,!0)},d.filename=h.__filename,m=Object.getOwnPropertyNames(require),u=0,p=m.length;p>u;u++)c=m[u],"paths"!==c&&(b[c]=require[c]);b.paths=d.paths=n._nodeModulePaths(process.cwd()),b.resolve=function(e){return n._resolveFilename(e,d)}}}a={};for(o in t)C.call(t,o)&&(l=t[o],a[o]=l);return a.bare=!0,s=r(e,a),h===global?y.runInThisContext(s):y.runInContext(s,h)}},d=function(e,t){var n,i,s;return i=l.readFileSync(t,"utf8"),s=65279===i.charCodeAt(0)?i.substring(1):i,n=r(s,{filename:t,sourceMap:!0,literate:u.isLiterate(t)}),g[t]=n.sourceMap,e._compile(n.js,t)},require.extensions){for(T=[".coffee",".litcoffee",".coffee.md"],v=0,w=T.length;w>v;v++)o=T[v],require.extensions[o]=d;n=require("module"),a=function(e){var t,i;for(i=k.basename(e).split("."),""===i[0]&&i.shift();i.shift();)if(t="."+i.join("."),n._extensions[t])return t;return".js"},n.prototype.load=function(e){var t;return this.filename=e,this.paths=n._nodeModulePaths(k.dirname(e)),t=a(e),n._extensions[t](this,e),this.loaded=!0}}s&&(c=s.fork,s.fork=function(e,t,n){var i;return null==t&&(t=[]),null==n&&(n={}),i=u.isCoffee(e)?"coffee":null,Array.isArray(t)||(t=[],n=t||{}),n.execPath||(n.execPath=i),c(e,t,n)}),p=new t,f.lexer={lex:function(){var e,t;return t=this.tokens[this.pos++],t?(e=t[0],this.yytext=t[1],this.yylloc=t[2],this.yylineno=this.yylloc.first_line):e="",e},setInput:function(e){return this.tokens=e,this.pos=0},upcomingInput:function(){return""}},f.yy=require("./nodes"),f.yy.parseError=function(e,t){var n;return n=t.token,e="unexpected "+(1===n?"end of input":n),u.throwSyntaxError(e,f.lexer.yylloc)},b=!1,g={},m=function(){var t;if(!b)return b=!0,t=require.main,Error.prepareStackTrace=function(t,n){var i,s,r,o,a;return o={},r=function(e,t,n){var i,s;return s=g[e],s&&(i=s.sourceLocation([t-1,n-1])),i?[i[0]+1,i[1]+1]:null},s=function(){var t,s,o;for(o=[],t=0,s=n.length;s>t&&(i=n[t],i.getFunction()!==e.run);t++)o.push("  at "+h(i,r));return o}(),""+t.name+": "+(null!=(a=t.message)?a:"")+"\n"+s.join("\n")+"\n"}},h=function(e,t){var n,i,s,r,o,a,c,h,l,u,p,d;return r=void 0,s="",e.isNative()?s="native":(e.isEval()?(r=e.getScriptNameOrSourceURL(),r||(s=""+e.getEvalOrigin()+", ")):r=e.getFileName(),r||(r="<anonymous>"),h=e.getLineNumber(),i=e.getColumnNumber(),u=t(r,h,i),s=u?""+r+":"+u[0]+":"+u[1]+", <js>:"+h+":"+i:""+r+":"+h+":"+i),o=e.getFunctionName(),a=e.isConstructor(),c=!(e.isToplevel()||a),c?(l=e.getMethodName(),d=e.getTypeName(),o?(p=n="",d&&o.indexOf(d)&&(p=""+d+"."),l&&o.indexOf("."+l)!==o.length-l.length-1&&(n=" [as "+l+"]"),""+p+o+n+" ("+s+")"):""+d+"."+(l||"<anonymous>")+" ("+s+")"):a?"new "+(o||"<anonymous>")+" ("+s+")":o?""+o+" ("+s+")":s}}.call(this),t.exports}(),require["./browser"]=function(){var exports={},module={exports:exports};return function(){var CoffeeScript,compile,runScripts,__indexOf=[].indexOf||function(e){for(var t=0,n=this.length;n>t;t++)if(t in this&&this[t]===e)return t;return-1};CoffeeScript=require("./coffee-script"),CoffeeScript.require=require,compile=CoffeeScript.compile,CoffeeScript.eval=function(code,options){return null==options&&(options={}),null==options.bare&&(options.bare=!0),eval(compile(code,options))},CoffeeScript.run=function(e,t){return null==t&&(t={}),t.bare=!0,t.shiftLine=!0,Function(compile(e,t))()},"undefined"!=typeof window&&null!==window&&("undefined"!=typeof btoa&&null!==btoa&&"undefined"!=typeof JSON&&null!==JSON&&"undefined"!=typeof unescape&&null!==unescape&&"undefined"!=typeof encodeURIComponent&&null!==encodeURIComponent&&(compile=function(e,t){var n,i,s;return null==t&&(t={}),t.sourceMap=!0,t.inline=!0,s=CoffeeScript.compile(e,t),n=s.js,i=s.v3SourceMap,""+n+"\n//@ sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(i)))+"\n//@ sourceURL=coffeescript"}),CoffeeScript.load=function(e,t,n){var i;return null==n&&(n={}),n.sourceFiles=[e],i=window.ActiveXObject?new window.ActiveXObject("Microsoft.XMLHTTP"):new window.XMLHttpRequest,i.open("GET",e,!0),"overrideMimeType"in i&&i.overrideMimeType("text/plain"),i.onreadystatechange=function(){var s;if(4===i.readyState){if(0!==(s=i.status)&&200!==s)throw new Error("Could not load "+e);if(CoffeeScript.run(i.responseText,n),t)return t()}},i.send(null)},runScripts=function(){var e,t,n,i,s,r,o;return o=window.document.getElementsByTagName("script"),t=["text/coffeescript","text/literate-coffeescript"],e=function(){var e,n,i,s;
for(s=[],e=0,n=o.length;n>e;e++)r=o[e],i=r.type,__indexOf.call(t,i)>=0&&s.push(r);return s}(),i=0,s=e.length,(n=function(){var s,r,o;return o=e[i++],s=null!=o?o.type:void 0,__indexOf.call(t,s)>=0?(r={literate:"text/literate-coffeescript"===s},o.src?CoffeeScript.load(o.src,n,r):(r.sourceFiles=["embedded"],CoffeeScript.run(o.innerHTML,r),n())):void 0})(),null},window.addEventListener?window.addEventListener("DOMContentLoaded",runScripts,!1):window.attachEvent("onload",runScripts))}.call(this),module.exports}(),require["./coffee-script"]}();"function"==typeof define&&define.amd?define(function(){return CoffeeScript}):root.CoffeeScript=CoffeeScript}(this);/*!
* ECT CoffeeScript template engine v0.5.6
* https://github.com/baryshev/ect
*
* Copyright 2012-2013, Vadim M. Baryshev <vadimbaryshev@gmail.com>
* Licensed under the MIT license
* https://github.com/baryshev/ect/LICENSE
*
* Includes parts of node
* https://github.com/joyent/node
* Copyright Joyent, Inc. and other Node contributors
* Released under the MIT license
*
* Includes Cross-Browser Split 1.1.1
* http://xregexp.com/
* Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
* Released under the MIT license
*/
(function () {
    "use strict"; var fs; var path; var CoffeeScript; window.ECT = function (options) {
        if (!(this instanceof ECT)) { return new ECT(options) } this.options = { open: "<%", close: "%>", ext: "", cache: true, watch: false, root: "" };
        var ect = this, trimExp = /^[ \t]+|[ \t]+$/g, newlineExp = /\n/g, cache = {}, watchers = {}, indentChars = { ":": ":", ">": ">" }, escapeExp = /[&<>"]/, escapeAmpExp = /&/g, escapeLtExp = /</g, escapeGtExp = />/g, escapeQuotExp = /"/g, regExpEscape = function (str) { return String(str).replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&") }, read = function (file) { if (Object.prototype.toString.call(ect.options.root) === "[object Object]") { var data = file.split(".").reduce(function (currentContext, key) { return currentContext[key] }, ect.options.root); if (Object.prototype.toString.call(data) === "[object String]") { return data } else { throw new Error("Failed to load template " + file) } } else { try { return fs.readFileSync(file, "utf8") } catch (e) { throw new Error("Failed to load template " + file) } } }, compile = function (template) {
            var lineNo = 1, bufferStack = ["__ectOutput"], bufferStackPointer = 0, buffer = bufferStack[bufferStackPointer] + " = '", matches = template.split(new RegExp(regExpEscape(ect.options.open) + "((?:.|[\r\n])+?)(?:" + regExpEscape(ect.options.close) + "|$)")), output, text, command, line, prefix, postfix, newline, indentChar, indentation = "", indent = false, indentStack = [], indentStackPointer = -1, baseIndent, lines, j; for (var i = 0; i < matches.length; i++) {
                text = matches[i]; command = ""; if (i % 2 === 1) {
                    line = "__ectFileInfo.line = " + lineNo; switch (text.charAt(0)) { case "=": prefix = "' + (" + line + "\n'') + __ectTemplateContext.escape("; postfix = ") + '"; newline = ""; text = text.substr(1); output = "escaped"; break; case "-": prefix = "' + (" + line + "\n'') + (("; postfix = ") ? '') + '"; newline = ""; text = text.substr(1); output = "unescaped"; break; default: prefix = "'\n" + line; postfix = "\n" + bufferStack[bufferStackPointer] + " += '"; newline = "\n"; output = "none" } text = text.replace(trimExp, "");
                    command = text.split(/[^a-z]+/)[0]; if (indentChar = indentChars[text.charAt(text.length - 1)]) { text = text.replace(/:$/, "").replace(trimExp, ""); if (indentChar === ">") { if (/[$a-z_][0-9a-z_$]*[^=]+(-|=)>/i.test(text.replace(/'.*'|".*"/, ""))) { indentStack.push("capture_output_" + output); indentStackPointer++ } bufferStack.push("__ectFunction" + bufferStackPointer); bufferStackPointer++; postfix = "\n" + bufferStack[bufferStackPointer] + " = '"; command = "function" } indentStack.push(command); indentStackPointer++; indent = true } switch (command) { case "include": if (output === "none") { prefix = "' + (" + line + "\n'') + ("; postfix = ") + '" } buffer += prefix.replace(newlineExp, "\n" + indentation) + text + postfix.replace(newlineExp, "\n" + indentation); break; case "block": bufferStack.push("__ectTemplateContext.blocks['" + text.replace(/block\s+('|")([^'"]+)('|").*/, "$2") + "']"); bufferStackPointer++; prefix = "'\n"; postfix = "\n" + bufferStack[bufferStackPointer] + " += '"; text = "if " + text; buffer += prefix.replace(newlineExp, "\n" + indentation) + text; if (indent) { indentation += "  "; indent = false } buffer += postfix.replace(newlineExp, "\n" + indentation); break; case "content": if (output === "none") { prefix = "' + (" + line + "\n'') + ("; postfix = ") + '" } if (text === "content") { text = "content()" } buffer += prefix.replace(newlineExp, "\n" + indentation) + text + postfix.replace(newlineExp, "\n" + indentation); break; case "end": prefix = "'"; switch (indentStack[indentStackPointer]) { case "block": bufferStack.pop(); bufferStackPointer--; prefix = "'"; postfix = "\n" + bufferStack[bufferStackPointer] + " += '"; buffer += prefix.replace(newlineExp, "\n" + indentation); indentation = indentation.substr(2); buffer += postfix.replace(newlineExp, "\n" + indentation); break; case "when": postfix = "\n" + bufferStack[bufferStackPointer] + " += ''"; buffer += prefix.replace(newlineExp, "\n" + indentation) + postfix.replace(newlineExp, "\n" + indentation); indentation = indentation.substr(2); break; case "function": prefix = "'\n" + bufferStack[bufferStackPointer]; buffer += prefix.replace(newlineExp, "\n" + indentation); indentation = indentation.substr(2); bufferStack.pop(); bufferStackPointer--; postfix = "\n" + bufferStack[bufferStackPointer] + " += '"; switch (indentStack[indentStackPointer - 1]) { case "capture_output_escaped": indentStack.pop(); indentStackPointer--; buffer += ")"; break; case "capture_output_unescaped": indentStack.pop(); indentStackPointer--; buffer += ") ? '')"; break; case "capture_output_none": indentStack.pop(); indentStackPointer--; break } buffer += postfix.replace(newlineExp, "\n" + indentation); break; case "switch": prefix = "\n" + line; default: if (indentStack[indentStackPointer - 1] === "switch") { postfix = "" } indentation = indentation.substr(2); buffer += prefix.replace(newlineExp, "\n" + indentation) + postfix.replace(newlineExp, "\n" + indentation) } indentStack.pop(); indentStackPointer--; break; case "else": if (indentStack[indentStackPointer - 1] === "switch") { prefix = "" } else { prefix = "'" } buffer += prefix.replace(newlineExp, "\n" + indentation); if (indentStack[indentStackPointer - 1] === "if" || indentStack[indentStackPointer - 1] === "else") { indentStack.splice(-2, 1); indentStackPointer--; indentation = indentation.substr(2) } buffer += (newline.length ? newline + indentation : "") + text; if (indent) { indentation += "  "; indent = false } buffer += postfix.replace(newlineExp, "\n" + indentation); break; case "switch": buffer += prefix.replace(newlineExp, "\n" + indentation) + (newline.length ? newline + indentation : "") + text; if (indent) { indentation += "  "; indent = false } break; case "when": buffer += (newline.length ? newline + indentation : "") + text; if (indent) { indentation += "  "; indent = false } buffer += postfix.replace(newlineExp, "\n" + indentation); break; case "extend": text = "__ectExtended = true\n__ectParent = " + text.replace(/extend\s+/, ""); default: if (/\n/.test(text)) { lines = text.split(/\n/); buffer += prefix.replace(newlineExp, "\n" + indentation); for (j = 0; j < lines.length; j++) { if (/^\s*$/.test(lines[j])) { continue } if (typeof baseIndent === "undefined") { baseIndent = new RegExp("^" + lines[j].substr(0, lines[j].search(/[^\s]/))) } buffer += (newline.length ? newline + indentation : "") + lines[j].replace(baseIndent, "") } lines = undefined; baseIndent = undefined } else { buffer += prefix.replace(newlineExp, "\n" + indentation) + (newline.length ? newline + indentation : "") + text } if (indent) { indentation += "  "; indent = false } buffer += postfix.replace(newlineExp, "\n" + indentation); break } 
                } else { if (indentStack[indentStackPointer] !== "switch") { buffer += text.replace(/[\\']/g, "\\$&").replace(/\r/g, "").replace(newlineExp, "\\n").replace(/^\\n/, "") } } lineNo += text.split(newlineExp).length - 1
            } buffer += "'\nif not __ectExtended\n  return __ectOutput\nelse\n  __ectContainer = __ectTemplateContext.load __ectParent\n  __ectFileInfo.file = __ectContainer.file\n  __ectFileInfo.line = 1\n  __ectTemplateContext.childContent = __ectOutput\n  return __ectContainer.compiled.call(this, __ectTemplateContext, __ectFileInfo, include, content, block)"; buffer = "__ectExtended = false\n" + buffer; return eval("(function __ectTemplate(__ectTemplateContext, __ectFileInfo, include, content, block) {\n" + CoffeeScript.compile(buffer, { bare: true }) + "});")
        }; var TemplateContext = function (data) { this.blocks = {}; this.data = data || {}; this.childContent = "" }; TemplateContext.prototype.escape = function (text) { if (text == null) { return "" } var result = text.toString(); if (!escapeExp.test(result)) { return result } return result.replace(escapeAmpExp, "&#38;").replace(escapeLtExp, "&#60;").replace(escapeGtExp, "&#62;").replace(escapeQuotExp, "&#34;") }; TemplateContext.prototype.block = function (name) { if (!this.blocks[name]) { this.blocks[name] = "" } return !this.blocks[name].length }; TemplateContext.prototype.content = function (block) { if (block && block.length) { if (!this.blocks[block]) { return "" } return this.blocks[block] } else { return this.childContent } }; TemplateContext.prototype.load = function (template) { var file, compiled, container, data; if (ect.options.cache && cache[template]) { return cache[template] } else { var extExp = new RegExp(regExpEscape(ect.options.ext) + "$"); if (Object.prototype.toString.call(ect.options.root) === "[object String]") { if (typeof process !== "undefined" && process.platform === "win32") { file = path.normalize((ect.options.root.length && template.charAt(0) !== "/" && template.charAt(0) !== "\\" && !/^[a-zA-Z]:/.test(template) ? ect.options.root + "/" : "") + template.replace(extExp, "") + ect.options.ext) } else { file = path.normalize((ect.options.root.length && template.charAt(0) !== "/" ? ect.options.root + "/" : "") + template.replace(extExp, "") + ect.options.ext) } } else { file = template } data = read(file); if (data.substr(0, 24) === "(function __ectTemplate(") { try { compiled = eval(data) } catch (e) { e.message = e.message + " in " + file; throw e } } else { try { compiled = compile(data) } catch (e) { e.message = e.message.replace(/ on line \d+/, "") + " in " + file; throw e } } container = { file: file, compiled: compiled, source: "(" + compiled.toString() + ");", lastModified: (new Date).toUTCString(), gzip: null }; if (ect.options.cache) { cache[template] = container } if (ect.options.watch) { watchers[file] = fs.watch(file, { persistent: false }, function () { watchers[file].close(); delete watchers[file]; delete cache[template] }) } return container } }; TemplateContext.prototype.render = function (template, data) { var that = this; var container = this.load(template); var fileInfo = { file: container.file, line: 1 }; try { return container.compiled.call(data || this.data, this, fileInfo, function () { return that.render.apply(that, arguments) }, function () { return that.content.apply(that, arguments) }, function () { return that.block.apply(that, arguments) }) } catch (e) { if (!/ in /.test(e.message)) { e.message = e.message + " in " + fileInfo.file + " on line " + fileInfo.line } throw e } }; this.configure = function (options) { options = options || {}; for (var option in options) { this.options[option] = options[option] } }; this.compile = function (template) { var compiled; try { compiled = compile(template); return compiled } catch (e) { e.message = e.message.replace(/ on line \d+/, ""); throw e } }; this.render = function (template, data, callback) { var context; if (typeof arguments[arguments.length - 1] === "function") { if (arguments.length === 2) { callback = data; data = {} } context = new TemplateContext(data); try { callback(undefined, context.render(template)) } catch (e) { callback(e) } } else { context = new TemplateContext(data); return context.render(template) } }; this.clearCache = function (template) { if (template) { delete cache[template] } else { cache = {} } }; if (typeof module !== "undefined" && module.exports) { this.compiler = function (options) { var zlib = require("zlib"); options = options || {}; options.root = options.root || "/"; options.root = "/" + options.root.replace(/^\//, ""); options.root = options.root.replace(/\/$/, "") + "/"; var rootExp = new RegExp("^" + regExpEscape(options.root)); return function (req, res, next) { if (req.method !== "GET" && req.method !== "HEAD") { return next() } if (!options.root || req.url.substr(0, options.root.length) === options.root) { var template = req.url.replace(rootExp, ""); try { var context = new TemplateContext; var container = context.load(template); res.setHeader("Content-Type", "application/x-javascript; charset=utf-8"); res.setHeader("Last-Modified", container.lastModified); if (options.gzip) { res.setHeader("Content-Encoding", "gzip"); if (container.gzip === null) { zlib.gzip(container.source, function (err, buffer) { if (!err) { container.gzip = buffer; res.end(container.gzip) } else { next(err) } }) } else { res.end(container.gzip) } } else { res.setHeader("Content-Length", typeof Buffer !== "undefined" ? Buffer.byteLength(container.source, "utf8") : container.source.length); res.end(container.source) } } catch (e) { next(e) } } else { next() } } } } this.configure(options)
    }; if (typeof module !== "undefined" && module.exports) { fs = require("fs"); path = require("path"); if (typeof define === "function" && define.amd) { define("ect", ["coffee-script"], function (cs) { CoffeeScript = cs; return ECT }) } else { CoffeeScript = require("coffee-script"); module.exports = ECT } } else { if (!Array.prototype.filter) { Array.prototype.filter = function filter(fun, thisp) { var len = this.length >> 0, res = [], i, val; if (typeof fun !== "function") { throw new TypeError } for (i = 0; i < len; i++) { if (i in this) { val = this[i]; if (fun.call(thisp, val, i, this)) { res.push(val) } } } return res } } if (!Array.prototype.reduce) { Array.prototype.reduce = function reduce(accumulator) { if (this === null || this === undefined) { throw new TypeError("Object is null or undefined") } var i = 0, len = this.length >> 0, curr; if (typeof accumulator !== "function") { throw new TypeError("First argument is not callable") } if (arguments.length < 2) { if (len === 0) { throw new TypeError("Array length is 0 and no second argument") } curr = this[0]; i = 1 } else { curr = arguments[1] } while (i < len) { if (i in this) { curr = accumulator.call(undefined, curr, this[i], i, this) } ++i } return curr } } var split; split = split || function (undef) { var nativeSplit = String.prototype.split, compliantExecNpcg = /()??/.exec("")[1] === undef, self; self = function (str, separator, limit) { if (Object.prototype.toString.call(separator) !== "[object RegExp]") { return nativeSplit.call(str, separator, limit) } var output = [], flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + (separator.sticky ? "y" : ""), lastLastIndex = 0, separator = new RegExp(separator.source, flags + "g"), separator2, match, lastIndex, lastLength; str += ""; if (!compliantExecNpcg) { separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags) } limit = limit === undef ? -1 >>> 0 : limit >>> 0; while (match = separator.exec(str)) { lastIndex = match.index + match[0].length; if (lastIndex > lastLastIndex) { output.push(str.slice(lastLastIndex, match.index)); if (!compliantExecNpcg && match.length > 1) { match[0].replace(separator2, function () { for (var i = 1; i < arguments.length - 2; i++) { if (arguments[i] === undef) { match[i] = undef } } }) } if (match.length > 1 && match.index < str.length) { Array.prototype.push.apply(output, match.slice(1)) } lastLength = match[0].length; lastLastIndex = lastIndex; if (output.length >= limit) { break } } if (separator.lastIndex === match.index) { separator.lastIndex++ } } if (lastLastIndex === str.length) { if (lastLength || !separator.test("")) { output.push("") } } else { output.push(str.slice(lastLastIndex)) } return output.length > limit ? output.slice(0, limit) : output }; String.prototype.split = function (separator, limit) { return self(this, separator, limit) }; return self } (); if (typeof define === "function" && define.amd) { define("ect", ["coffee-script"], function (cs) { CoffeeScript = cs; return ECT }) } else { CoffeeScript = window.CoffeeScript; window.ECT = ECT } path = function () { var normalizeArray = function (parts, allowAboveRoot) { var up = 0, i, last; for (i = parts.length - 1; i >= 0; i--) { last = parts[i]; if (last === ".") { parts.splice(i, 1) } else if (last === "..") { parts.splice(i, 1); up++ } else if (up) { parts.splice(i, 1); up-- } } if (allowAboveRoot) { while (up) { parts.unshift(".."); up-- } } return parts }, normalize = function (path) { var isAbsolute = path.charAt(0) === "/", trailingSlash = path.slice(-1) === "/"; path = normalizeArray(path.split("/").filter(function (p) { return !!p }), !isAbsolute).join("/"); if (!path && !isAbsolute) { path = "." } if (path && trailingSlash) { path += "/" } return (isAbsolute ? "/" : "") + path }; return { normalize: normalize} } (); fs = function () { var readFileSync = function (file, encoding) { var AJAX; if (window.XMLHttpRequest) { AJAX = new XMLHttpRequest; if (AJAX.overrideMimeType) { AJAX.overrideMimeType("text/html") } } else { AJAX = new ActiveXObject("Microsoft.XMLHTTP") } if (AJAX) { AJAX.open("GET", file, false); AJAX.send(null); if (AJAX.status !== 0 && (AJAX.status < 200 || AJAX.status > 399)) { throw new Error("Failed to load template " + file) } return AJAX.responseText } else { throw new Error("Failed to load template " + file) } }, watch = function () { }; return { readFileSync: readFileSync, watch: watch} } () } 
})();(function (ng, $, undefined) {

    var renderQueue =[];
    
     $.ajax({ async: true
            , cache: true
            , dataType: "jsonp"
            , jsonpCallback : "cbJP"
            , url: '/min/Templates.js'
            , success: function(templates){
                var t = templates;
                ng.renderer = ECT({ root : t});
                for(var i=0; i<renderQueue.length; i++){
                    renderQueue[i]();
                }
                renderQueue = [];

            }
            , error: function (xhr, ajaxOptions, thrownError) {
                alert("err Templates.js:" +  thrownError);
                console.log(thrownError);
                console.log(xhr);
            }
            });

     ng.render = function(template,data,cb){
         if(ng.renderer){
            var h = ng.renderer.render(template,data);
            cb(h);
        }
         else{
             var t = template, d = data,cbf = cb;;
             renderQueue.push(function(){
                 var htm = ng.renderer.render(t,d);
                 cbf(htm);
             });
        }
    }

    // var spindelSocket = io.connect('http://' + window.location.host + '/spindel');
    // var  tmplatesQueue = [];


    //  spindelSocket.on('Partial', function (d) {
    //        if(requestNumber > d.Template.responseNum)
    //            return;
    //        d.Template.html = ng.renderer.render(d.Template.Template,d.Template.Data);
    //        console.log(d);

    //        if($(d.Template.Container).length > 0 ){
    //            $(d.Template.Container).html(d.Template.html);
    //            SetLinks(d.Template.Container);
    //            if(d.Template.Js)
    //                eval(d.Template.Js);

    //            for(var i = 0; i < tmplatesQueue.length; i++){
    //                if($(tmplatesQueue[i].Template.Container).length > 0 ){
    //                     $(tmplatesQueue[i].Template.Container).html(tmplatesQueue[i].Template.html);
    //                    tmplatesQueue.splice( i, 1 );
    //                }
    //            }

    //        }
    //        else{
    //            tmplatesQueue.push(d)
    //        }    
    //});


   
/*****************************************************************************************************************************/
      function SetLinks(containerSelector) {
            $(containerSelector + ' a').each(function (i, el) {
                var href = $(el).attr("href");
                if ($(el).attr('ajaxmode') == 'disabled'
                || !href || href == '#'
                || href.indexOf("http") > -1
                || href.indexOf("javascript:") > -1)
                    return;


                $(el).bind('click', function (e) {
                    var url = $(this).attr("href");
                    var container = $(this).attr('Container') ||  $(this).attr('container');
                    var disablescrolltop = $(this).attr('disablescrolltop');
                    var o = {Container:container,ScrollTop:(disablescrolltop != 'True')}

                   
                     if (url != '') {
                        ng.Load(url,o);
                        e.preventDefault();
                    }
                });

            });
        }
/*****************************************************************************************************************************/

        var requestNumber = 0;
        ng.ReloadContainer = function(container){
            ng.Load(window.location.pathname+window.location.search,{Container:container});
        };
        ng.Load = function(url,options){
            tmplatesQueue = [];
            var o = options || {};
            var cb = o.cb;
            delete o.cb;
            o.url = url
            o.requestNumber = requestNumber++;
            //spindelSocket.emit("get",o);
            $.ajax({
                async: true
           , type: "POST"
           , cache: false
           , dataType: "json"
           , data: { type: 'get', webReq: JSON.stringify(o) }
           , url: '/spindel'
           , success: function (d) {

               console.log(d);
               for (var i = 0; i < d.length; i++) {
                   var html = ng.renderer.render(d[i].Template, d[i].Data);
                   $(d[i].Container).html(html);
                   SetLinks(d[i].Container);
                   if (d[i].Js)
                       eval(d[i].Js);
               }
               $("#App").trigger("create");
               
               if (o.ScrollTop)
                   $(document).scrollTop(0);
               if (cb)
                   cb();
           }
           , error: function (xhr, ajaxOptions, thrownError) {
               console.log(thrownError);
               console.log(xhr);
           }
           });
            
             if (!o.DisablepushState) {
                 window.history.pushState(o, null, url);
                 initQS();
             }
            ng.current = o;
        };

        var wsCB = [];
        var wsReqCount = 0;

        ng.ws = function(funName,params,callback){
            var wsReq ={ 
                funcName:funName,
                params:params,
                reqNumber:wsReqCount++
            };

            //wsCB[wsReq.reqNumber] = callback;

            // spindelSocket.emit("ws",wsReq);
             $.ajax({ async: true
            ,type: "POST"
            , cache: false
            , dataType: "json"
            , data:{type:'ws', webReq: JSON.stringify(wsReq)}
            , url: '/spindel'
            , success: function(wsRes){
                callback(wsRes.data);
                }
            });
        };

        // spindelSocket.on('ws', function (wsRes) {
        //    wsCB[wsRes.reqNumber](wsRes.data);
        //    delete wsCB[wsRes.reqNumber];
        //});


         ng.bindForm = function (form,obj){
                         $('*[ng-form="'+form+'"] *[ng-key]').each(function(index,element){
                           var el = $(element);
                           var key = el.attr('ng-key');
                           if (!obj[key])
                               return;
                           if(el.is('input')){
                               switch(el.attr('type')){
                                   case 'text':
                                   el.val(obj[key]);
                                break;
                                case 'checkbox':
                                    el.prop('checked', obj[key]);
                               break;
                               case 'radio':
                                    var group = el.attr('name');
                                    $("input[name="+group+"][value=" + obj[key] + "]").attr('checked', 'checked');
                               break;
                              }
                          }
                          else
                          if(el.is('img')){
                              el.attr('src',obj[key]);
                          }
                          else
                          if(el.is('textarea')){
                              el.val(obj[key]);
                          }
                          else
                          if(el.is('select')){
                               el.val(obj[key]);
                          }
                           else
                          if(el.is('span')){
                               el.html(obj[key]);
                          }
                       });
                    };

        function parse(type,val){
            switch(type){
             case 'int':
                return parseInt(val);
             break;
            case 'intArray':
                for(var i = 0; i<val.length; i++)
                    val[i] = parseInt(val[i]);
                return val;
             break;
            case 'float':
                return parseFloat(val);
            break;
            default:
                return val;
            }
        }

        ng.validate = function(form){
            var isValid = true;
            $('*[ng-form="'+form+'"] *[ng-validate]').each(function(index,element){
                var el = $(element);
                var vt = el.attr('ng-validate');
                if(vt == "required"){
                    if(ignoreWatermark(el,el.val())!='')
                        el.removeClass('NotValid');
                    else{
                        el.addClass('NotValid');
                        isValid = false;
                    }
                }
            });
            return isValid;
        }

        ng.watermark = function(form){
            function wm(el,watermark){
                 if(el.val()==''){
                       el.val(watermark);
                       el.addClass('watermark');
                   }
                }
              $('*[ng-form="'+form+'"] *[ng-watermark]').each(function(index,element){
                   var el = $(element);
                   var watermark = el.attr('ng-watermark');
                   el.focus(function(){
                       el.removeClass('watermark');
                       if(el.val()==watermark)
                           el.val('');
                    });
                   el.blur(function(){
                       wm(el,watermark);
                    });

                    wm(el,watermark);
            });
        }

        function ignoreWatermark(el,val){
            var wm = el.attr('ng-watermark');
            if(wm && wm == val)
                return '';
            else
                return val;
        }

        ng.getFormData = function (form) {
            var obj = {};

            $('*[ng-form="' + form + '"] *[ng-key]').each(function (index, element) {
                var el = $(element);
                var key = el.attr('ng-key');
                if (el.is('input')) {
                    switch (el.attr('type')) {
                        case 'text':
                            obj[key] = parse(el.attr('ng-parse'), ignoreWatermark(el, el.val()));
                            break;
                        case 'password':
                            obj[key] = parse(el.attr('ng-parse'), ignoreWatermark(el, el.val()));
                            break;
                        case 'hidden':
                            obj[key] = parse(el.attr('ng-parse'), ignoreWatermark(el, el.val()));
                            break;
                        case 'checkbox':
                            obj[key] = el.prop('checked');
                            break;
                        case 'radio':
                            var group = el.attr('name');
                            obj[key] = $("input[name=" + group + "]:checked").val();
                            break;
                    }
                }
                else
                    if (el.is('img')) {
                        obj[key] = el.attr('src');
                    }
                    else
                        if (el.is('textarea')) {
                            obj[key] = ignoreWatermark(el, el.val());
                        }
                        else
                            if (el.is('select')) {
                                obj[key] = parse(el.attr('ng-parse'), el.val());
                                if (el.attr('ng-add-key')) {
                                    var addKey = el.attr('ng-add-key');
                                    el.find("option:selected").each(function () {
                                        obj[addKey] = $(this).attr('ng-' + addKey + '-val');
                                    });
                                }

                            }
                            else
                                if (el.is('span') || el.is('b')) {
                                    obj[key] = parse(el.attr('ng-parse'), el.html());
                                }
            });

            return obj;
        };

        function initQS() {
            var qs = {};
            var u = window.location.search.toString().replace('?','');
            var qsp = u.split("&");
            for (var i = 0; i < qsp.length; i++) {
                var qspp = qsp[i].split("=");
                if (qspp.length > 0)
                    qs[qspp[0]] = qspp[1];
            }
            ng.QS = qs;
        };


        initQS();

        $(document).ready(function () {
           
            setTimeout(function(){
                if(window.addEventListener)
                {
                     window.addEventListener("popstate", function (e) {
                        
                            var cur = ng.current.url;
                            if (cur.indexOf("/") != 0)
                                cur = "/" + cur;
                           // console.log(location.pathname + location.search + ' != ' + cur + (location.pathname + location.search != cur));
                            if (location.pathname + location.search != cur) {
                                //ng.Load(location.pathname + location.search,{DisablepushState:true,Container:'#Pane',ScrollTop:true});
                                window.location = location.pathname + location.search;
                            }
                       
                     }, false);
                 }
                 else
                 {
                    window.attachEvent("onpopstate ",function (e) {
                        
                            var cur = ng.current.url;
                            if (cur.indexOf("/") != 0)
                                cur = "/" + cur;
                           // console.log(location.pathname + location.search + ' != ' + cur + (location.pathname + location.search != cur));
                            if (location.pathname + location.search != cur) {
                                //ng.Load(location.pathname + location.search,{DisablepushState:true,Container:'#Pane',ScrollTop:true});
                                window.location = location.pathname + location.search;

                            }
                       
                     });
                 }
                 
                 console.log('ready... setLinks');
                 SetLinks('body');
            }, 500);

            
        });
}(window.ng = window.ng || {}, jQuery));


var litghtBox = {};

var weekDays = ["ראשון","שני","שלישי","רביעי","חמישי","שישי","שבת",]

function openLightBox(selector){
    $('#mask').show();
    var winH = $(window).height();
    var winW = $(window).width();
    //Set the popup window to center
    $('#lb').css('top',  winH/2-$(selector).height()/2);
    $('#lb').css('left', winW/2-$(selector).width()/2);
    litghtBox.parent = $(selector).parent();
    litghtBox.selector = selector;
    $('#lb').append($(selector).show()).fadeIn(400);
    //test/
}

function closeLightBox(){
    litghtBox.parent.append($(litghtBox.selector).hide());
    $('#lb').hide();
    $('#mask').hide();
    litghtBox ={};
}

function InitRedBar(type){
   if(type!='HP')
       $('#HeaderText').html('');
    $('#redBgBar').attr( "class" ,'redBgBar'+type);
}


function reffreshHP() {
    var options = { Container: '#Pane', ScrollTop: true };
    options.cb = function () { $('.ReffreshIcon').hide(); };
    ng.Load('/', options);
}


function initTopDate() {
    var d = new Date();
    
    var hours = d.getHours();
    var minutes = d.getMinutes();

    if(hours < 10 )
        hours = "0" + hours;

    if(minutes < 10 )
        minutes = "0" + minutes;

    var dayIndex = d.getDay();
    var day = weekDays[dayIndex];
    var time = hours + ':' + minutes;    
    var date = d.getDate() + '.' + (d.getMonth() + 1) + "." + d.getFullYear();

    $('#topDay').html("יום " + day + " ");
    $('#topDate').html(date);
    $('#topTime').html(time);
    
    setTimeout(initTopDate, 20 * 1000);
}

function InitSearch() {
    initTopDate();
    initNotifications();
    $(".GoogleSearchInput").val("");
    initGoogleSearch();
    $('.CompanyTitle').html($.cookie('name', { path: '/' }));

    ng.ws('getRss',{}, function (d) {
        ng.render('RSS/Rss',d,function(htm){
            $('.NewsFlash').html(htm);
        });
    });

   
   

    //Localizing The Datepicker To Hebrew
    $.datepicker.regional['he'] = {
        closeText: 'סגור',
        prevText: '&#x3c;הקודם',
        nextText: 'הבא&#x3e;',
        currentText: 'היום',
        monthNames: ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
        'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'],
        monthNamesShort: ['ינו', 'פבר', 'מרץ', 'אפר', 'מאי', 'יוני',
        'יולי', 'אוג', 'ספט', 'אוק', 'נוב', 'דצמ'],
        dayNames: ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'],
        dayNamesShort: ['א\'', 'ב\'', 'ג\'', 'ד\'', 'ה\'', 'ו\'', 'שבת'],
        dayNamesMin: ['א\'', 'ב\'', 'ג\'', 'ד\'', 'ה\'', 'ו\'', 'שבת'],
        weekHeader: 'Wk',
        dateFormat: 'dd/mm/yy',
        firstDay: 0,
        isRTL: true,
        showMonthAfterYear: false,
        yearSuffix: ''
    };

    $.datepicker.setDefaults($.datepicker.regional['he']);

    $("#dateInput").datepicker({ dateFormat: 'dd/mm/yy', minDate: new Date() });

    loadCalendar();    

    if (ng.QS['vt'])
        $('.sVehicleType').val(decodeURIComponent(ng.QS['vt']));
    if (ng.QS['ad'])
        $('#dateInput').val(ng.QS['ad']);
    if (ng.QS['area']) {
        $('#area').val(decodeURIComponent(ng.QS['area']));
        setTimeout(function () {
            $('.ui-filterable input').val(decodeURIComponent(ng.QS['area']));
            $(".ui-filterable input").change(function () {
                $('#area').val($(this).val());
                filter();
                $('#CityList').hide();
            });
        }, 500);
    }
    getSubContactionRides();

    $("#CityList li").click(function () {

        $('#area').val($(this).html());
        $('.ui-filterable input').val($(this).html());
        filter();
        $('#CityList').hide();
    });

   
}

function getSubContactionRides() {
    ng.ws('getSubContactionRides', {}, function (d) {
        ng.render('Board/SubContactionRides', d, function (htm) {
            $('.SubcontractionPane').html(htm);
        });
    });
}

function ClearInputs()
{
   // $(".SearchInput").val("הקלד עיר לחיפוש");
  //  $(".DateInput").val("");
}

//var isReportsMenueOpening = false;
//function OpenReportsMenu(event) {
//    event.stopPropagation();
//    isReportsMenueOpening = true;
//    $('#ReportsMenu').show(400);
//    setTimeout(function () { isReportsMenueOpening = false }, 500);
//}

//function CloseReportsMenu(event) {
//    event.stopPropagation();
//    if(!isReportsMenueOpening)
//        $('#ReportsMenu').hide();
//}

function filter() {
    var type = $('.sVehicleType').val();
    var url =  window.location.pathname + "?s=1";
    if(type)
        url+= '&vt='+type;
    var ad = $('#dateInput').val();
    if (ad)
        url += '&ad=' + ad;
    var area = $('#area').val();
    if (area)
        url += '&area=' + area;
    ng.Load(url, { Container: '#InnerPane' });

}

function initGoogleSearch() {

    $(".GoogleSearchBtn").click(function() {
    var href = "https://www.google.co.il/search?q=";
    var searchTerm = $(".GoogleSearchInput").val();
    if(searchTerm != "")
    {
        href += searchTerm;
        window.open(href, '_blank');
    }
});

    $(".GoogleSearchInput").bind('keypress', function(e) {
    var code = e.keyCode || e.which;
    if(code == 13) { //Enter keycode
        $(".GoogleSearchBtn").trigger("click");
    }
});

}
$(".SearchInput").focus(function() {
        var searchInputValue = $(this).val();
        if(searchInputValue == "חיפוש משתמש")
            $(this).val("");
        else if(searchInputValue == "חיפוש לפי עיר")
            $(this).val("");
        
});

$(".SearchInput").blur(function() {             
        var searchValue = $(this).val();
        var inputID = $(this).attr("id")
        if(searchValue == "" && inputID == "userInput")
            $(this).val("חיפוש משתמש") ;                          
        else if(searchValue == "" && inputID == "cityInput")
            $(this).val("חיפוש לפי עיר")                                    
});

$(".UserSearchIcon").click(function() {
    var userTxt = $(".UserInput").val();
    if(userTxt != "" && userTxt != "חיפוש משתמש")
        SearchUserName(userTxt);
    else
        return false;
});

$(".CitySearchIcon").click(function() {
    var cityTxt = $(".CityInput").val();
    if(cityTxt != "" && cityTxt != "חיפוש לפי עיר")
        SearchCityName(cityTxt);
    else
        return false;
});

function SearchUser(e) {
    if (e.keyCode == 13) {
        var userTxt = $(".UserInput").val();
        if(userTxt != "" && userTxt != "חיפוש משתמש")
            SearchUserName(userTxt);
    }
    else
        return false;
}

function SearchCity(e) {
    if (e.keyCode == 13) {
        var cityTxt = $(".CityInput").val();
        if(cityTxt != "" && cityTxt != "חיפוש לפי עיר")
            SearchCityName(cityTxt);
    }
    else
        return false;
}

function SearchUserName(userTxt)
{
    alert(userTxt);
}

function SearchCityName(cityTxt)
{
    alert(cityTxt);
}

    (function (admin, $, undefined) {
    var aCompany;
    admin.updateBusCompanyDtl = function () {
        if (!ng.validate("Company"))
            return;
        aCompany.dtl = ng.getFormData("Company");

        ng.ws('updateBusCompanyDtl', aCompany, function (d) {
            $('.AddCompanyProfileBtn').fadeOut(0);
            $('.SuccessMsg').fadeIn(800);
            setTimeout(function () {
                $('.AddCompanyProfileBtn').fadeIn(800);
                $('.SuccessMsg').fadeOut(0);
            }, 2500);
        });
    };

    admin.getBusCompanyDtl = function () {

        ng.ws('getBusCompany', parseInt(ng.QS['busCompanyID']), function (data) {
            aCompany = data;
            var c = aCompany.dtl || aCompany;
            ng.bindForm('Company', c);
        });
    };

    admin.setRequired = function (el) {
        if ($(el).prop('checked')) {
            $('.CalMember').attr('ng-validate', 'required');
        } else {
            $('.CalMember').attr('ng-validate', '');
        }
    };
    })(window.admin = window.admin || {}, jQuery)