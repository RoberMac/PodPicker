/*!
 * Pod Picker - A Podcast Timeline Generator
 * https://github.com/RoberMac/PodPicker
 *
 * Copyright (c) 2015 RoberTu <robertu0717@gmail.com>
 * @license MIT
 * @version v0.2.4
 */

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

;(function (window, document) {

    'use strict';

    /**
     * Determines if a value is `undefined / string / boolean / array / object / hex color / timeString`
     *
     * @param {Any} value  The value need to be determined
     * @return {Boolean}
     */
    var isUndefined = function isUndefined(value) {
        return typeof value === 'undefined';
    },
        isString = function isString(value) {
        return typeof value === 'string';
    },
        isBoolean = function isBoolean(value) {
        return typeof value === 'boolean';
    },
        isArray = function isArray(value) {
        return value.constructor === Array;
    },
        isObject = function isObject(value) {
        return value.constructor === Object;
    },
        isHexColor = function isHexColor(value) {
        return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(value);
    },
        isTimeString = function isTimeString(value) {
        return /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/.test(value);
    };

    /**
     * Throw Error
     *
     * @param {String} ERROR_MSG  Error message
     */
    var throwError = function throwError(type, msg) {
        switch (type) {
            case 'type':
                throw new TypeError(msg);
                break;
            default:
                throw new Error(msg);
        }
    };

    /**
     * Error Messages
     *
     */
    var ERROR_MSG = {
        // `container` parameter
        container_param: 'Pod Picker: `container` parameter is required',
        container_type: 'Pod Picker: `container` parameter must be a string',
        container_elem: 'Pod Picker: `container` parameter is not related to an existing ID',
        // `items` parameter
        items_param: 'Pod Picker: `items` parameter is required',
        items_type: 'Pod Picker: `items` parameter must be an array',
        items_empty: 'Pod Picker: `items` parameter cannot be an empty array',
        // `options` parameter
        options_type: 'Pod Picker: `options` parameter must be an object',
        options_audioElem_type: 'Pod Picker: `options.audioElem` must be a string',
        options_timelineColor_type: 'Pod Picker: `options.timelineColor` must be a string',
        options_isShowStartTime_type: 'Pod Picker: `options.isShowStartTime` must be a boolean',
        options_timelineColor_type_value: 'Pod Picker: `options.timelineColor` must be a hex color',
        // others
        audioFile_format: 'Pod Picker: does not support MP3 file format',
        start_format: 'Pod Picker: `start` time string must be "hh:mm:ss", "mm:ss" or "ss" format'
    };

    /**
     * Convert time string to seconds
     *
     * @param {String} timeString  A time string 
     * @return {Number} seconds
     */
    var convertTime = function convertTime(timeString) {
        // Check time string
        isTimeString(timeString) ? null : throwError('default', ERROR_MSG.start_format);

        var timeArray = timeString.split(':'),
            len = timeArray.length;

        switch (len) {

            case 1:
                return timeArray[0] * 1;
                break;
            case 2:
                return timeArray[0] * 60 + timeArray[1] * 1;
                break;
            case 3:
                return timeArray[0] * 60 * 60 + timeArray[1] * 60 + timeArray[2] * 1;
                break;
            default:
                throwError('default', ERROR_MSG.start_format);
        }
    };

    var PodPicker = (function () {
        /**
         *
         * @constructor
         * @this  {PodPicker}
         * @param {String}    container  Wrapper element's id
         * @param {Array}     items      Data items
         * @param {Object}    options    Options
         *
         */

        function PodPicker(container, items, options) {
            _classCallCheck(this, PodPicker);

            // Set internal variables
            this._preTime = 0;
            this._itemsIndex = 0;
            this._seekingIndex = 0;
            this._startTimeSet = [];

            // Setup
            this.setParameters(container, items);
            this.setOptions(options);
            this.createTimeline();
        }

        /**
         * Set Parameters
         */

        _createClass(PodPicker, [{
            key: 'setParameters',
            value: function setParameters(container, items) {
                /**
                  * Basic Check
                  * throw an error if the parameters is invalid
                  *
                  */
                // Check `container` parameter
                isUndefined(container) ? throwError('default', ERROR_MSG.container_param) : isString(container) ? this._container = document.getElementById(container) : throwError('type', ERROR_MSG.container_type);

                !this._container ? throwError('default', ERROR_MSG.container_elem) : null;

                // Check `items` parameter
                isUndefined(items) ? throwError('default', ERROR_MSG.items_param) : isArray(items) ? items.length <= 0 ? throwError('default', ERROR_MSG.items_empty) : null : throwError('type', ERROR_MSG.items_type);

                // Sort items array by item object
                this._items = items.sort(function (pre, next) {

                    var pre = convertTime(pre.start),
                        next = convertTime(next.start);

                    if (pre > next) {
                        return 1;
                    } else if (pre < next) {
                        return -1;
                    } else {
                        return 0;
                    }
                });
            }

            /**
             * Set Options
             * Allow options: 'audioElem', 'timelineColor', 'isShowStartTime'
             *
             */
        }, {
            key: 'setOptions',
            value: function setOptions(options) {

                // Check `options` parameter
                !isUndefined(options) && !isObject(options) ? throwError('type', ERROR_MSG.options_type) : null;

                // Check option: 'audioElem'
                !isUndefined(options.audioElem) && !isString(options.audioElem) ? throwError('type', ERROR_MSG.options_audioElem_type) : null;

                // Check option: 'timelineColor'
                !isUndefined(options.timelineColor) ? !isString(options.timelineColor) ? throwError('type', ERROR_MSG.options_timelineColor_type) : isHexColor(options.timelineColor) ? null : throwError('type', ERROR_MSG.options_timelineColor_type_value) : null;

                // Check option: 'isShowStartTime'
                !isUndefined(options.isShowStartTime) && !isBoolean(options.isShowStartTime) ? throwError('type', ERROR_MSG.options_isShowStartTime_type) : null;

                // Set options
                this._audioElem = options.audioElem ? document.getElementById(options.audioElem) : document.getElementsByTagName('audio')[0], this._timelineColor = options.timelineColor || '#CECECF', this._isShowStartTime = options.isShowStartTime || false;
            }

            /**
             * Create the timeline if audio file is not MP3 file format
             *
             * For more details, see: 
             *   http://forums.codescript.in/javascript/html5-audio-currenttime-attribute-inaccurate-27606.html
             *   https://jsfiddle.net/yp3o8cyw/2/
             *
             */
        }, {
            key: 'createTimeline',
            value: function createTimeline() {
                var that = this;
                var currentSrcInterval = setInterval(function () {
                    var currentSrc = that._audioElem.currentSrc;
                    if (currentSrc) {
                        clearInterval(currentSrcInterval);
                        currentSrc.match(/\.mp3/i) ? throwError('default', ERROR_MSG.audioFile_format)
                        // then create timeline
                        : _createTimeline();
                    }
                }, 10);

                function _createTimeline() {
                    var items = that._items,
                        audioElem = that._audioElem;

                    var fragment = document.createDocumentFragment(''),
                        timeline = document.createElement('div'),
                        pointer = document.createElement('span'),
                        ul = document.createElement('ul');

                    for (var i = 0, len = items.length; i < len; i++) {

                        var item = document.createElement('li'),
                            span = document.createElement('span'),
                            start = convertTime(items[i].start),
                            title = that._isShowStartTime ? items[i].start + ' - ' + items[i].title : items[i].title;

                        // Extract all `item` start time and then push it to `that._startTimeSet`
                        that._startTimeSet.push(start);(function (_item, start) {
                            // Jump to certain time offsets in `audioElem`
                            // when user click the item > span element
                            _item.addEventListener('click', function () {
                                audioElem.play();
                                audioElem.currentTime = start;
                                that._seekingIndex = window.setTimeout(function () {
                                    document.getElementById('pp-pointer').className = 'seeking';
                                }, 500);
                            });
                        })(span, start);

                        item.className = 'pp-item';
                        span.appendChild(document.createTextNode(title));
                        item.appendChild(span);
                        ul.appendChild(item);
                    }

                    ul.style.color = that._timelineColor;
                    pointer.id = 'pp-pointer';
                    timeline.id = 'pp-timeline';
                    timeline.appendChild(ul);
                    timeline.appendChild(pointer);
                    fragment.appendChild(timeline);
                    that._container.appendChild(fragment);

                    // Register event handlers to `audioElem` element
                    audioElem.addEventListener('timeupdate', function () {
                        // init
                        var currentTime = audioElem.currentTime,
                            _startTimeSet = that._startTimeSet,
                            len = _startTimeSet.length;

                        if (Math.abs(that._preTime - currentTime) > 1) {
                            // user-triggered
                            for (var i = 0; i < len; i++) {
                                _startTimeSet[i + 1] // the last one
                                ? currentTime >= _startTimeSet[i] && currentTime <= _startTimeSet[i + 1] ? _setPointerPosition(i + 1) : null : currentTime >= _startTimeSet[i] ? _setPointerPosition(i + 1) : null;
                            }
                        } else {
                            // auto-triggered
                            for (var i = 0; i < len; i++) {
                                currentTime > _startTimeSet[i] - 1 && currentTime <= _startTimeSet[i] + 1 && that._itemsIndex !== i + 1 ? _setPointerPosition(i + 1) : null;
                            }
                        }

                        that._preTime = currentTime;
                    });
                    // Seeking
                    audioElem.addEventListener('seeking', function () {
                        audioElem.pause();
                    });
                    // Seeked
                    audioElem.addEventListener('seeked', function () {
                        window.clearTimeout(that._seekingIndex);
                        audioElem.play();
                        document.getElementById('pp-pointer').removeAttribute('class');
                    });
                }
                // Set or reset timeline pointer position
                function _setPointerPosition(index) {
                    var item = document.getElementsByClassName('pp-item'),
                        pointer = document.getElementById('pp-pointer'),
                        item_h = item[0].offsetHeight;

                    // Store current item(Section) index
                    that._itemsIndex = index;
                    // Set timeline section style
                    item[index - 1].children[0].className = 'currentSection';
                    for (var i = 0, item_len = item.length; i < item_len; i++) {
                        i !== index - 1 ? item[i].children[0].removeAttribute('class') : null;
                    }
                    // Set timeline pointer position
                    pointer.style.top = index * item_h - item_h / 2 - 6 + 'px';
                }
            }
        }]);

        return PodPicker;
    })()

    // Browser globals
    ;

    if (!window.PodPicker) {
        window.PodPicker = PodPicker;
    }
})(window, document);

// Register event handlers to `item` element