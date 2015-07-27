/*!
 * Pod Picker - A Podcast Timeline Generator
 * https://github.com/RoberMac/PodPicker
 *
 * Copyright (c) 2015 RoberTu <robertu0717@gmail.com>
 * @license MIT
 * @version v0.2.3
 */

;(function (window, document){

    'use strict';

class PodPicker {
    /**
     *
     * @constructor
     * @this  {PodPicker}
     * @param {String}    container  Wrapper element's id
     * @param {Array}     items      Data items
     * @param {Object}    options    Options
     *
     */
    constructor (container, items, options){
        // init
        this.preTime = 0
        this.itemsIndex = 0
        this.seekingIndex = 0
        this.startTimeSet = []


       /**
         * Basic Check
         * throw an error if the parameters is invalid
         *
         */
        // Check `container` parameter
        PodPicker.isUndefined(container)
            ? PodPicker.throwError('default', PodPicker.ERROR_MSG.param_container)
            : PodPicker.isString(container)
                ? this.container = document.getElementById(container)
                : PodPicker.throwError('type', PodPicker.ERROR_MSG.type_container)

        !this.container
            ? PodPicker.throwError('default', PodPicker.ERROR_MSG.elem_container)
            : null

        // Check `items` parameter
        PodPicker.isUndefined(items)
            ? PodPicker.throwError('default', PodPicker.ERROR_MSG.param_items)
            : PodPicker.isArray(items)
                ? items.length <= 0
                    ? PodPicker.throwError('default', PodPicker.ERROR_MSG.empty_items)
                    : null
                : PodPicker.throwError('type', PodPicker.ERROR_MSG.type_items)

        // Check `options` parameter
        !PodPicker.isUndefined(options) && !PodPicker.isObject(options)
            ? PodPicker.throwError('type', PodPicker.ERROR_MSG.type_options)
            : this.options = options || {}

        // Sort items array by item object
        var that = this;
        this.items = items.sort(function (pre, next){

            var pre  = that.convertTime(pre.start),
                next = that.convertTime(next.start);

            if (pre > next){
                return 1;
            } else if (pre < next){
                return -1;
            } else {
                return 0;
            }
        })
        this.setup()
    }
    /**
     * Setup
     */
    setup (){
        var that = this;

        this.setOptions()

        /**
         * Check `audioElem` source file, throw error if audio file is MP3 file format
         *
         * For more details, see: 
         *   http://forums.codescript.in/javascript/html5-audio-currenttime-attribute-inaccurate-27606.html
         *   https://jsfiddle.net/yp3o8cyw/2/
         *
         */
        var currentSrcInterval = setInterval(function (){
            var currentSrc = that.audioElem.currentSrc
            if (currentSrc){
                clearInterval(currentSrcInterval)
                currentSrc.match(/\.mp3/i)
                    ? that.throwError('default', PodPicker.ERROR_MSG.format_audioFile)
                    : that.createTimeline()
            }
        }, 10)
    }
    /**
     * Set Options
     *
     */
    setOptions (){
        var options = this.options;

        // Allow options: 'audioElem', 'timelineColor', 'isShowStartTime'
        // Check option: 'audioElem'
        !PodPicker.isUndefined(options.audioElem) && !PodPicker.isString(options.audioElem)
            ? PodPicker.throwError('type', PodPicker.ERROR_MSG.type_options_audioElem)
            : null

        // Check option: 'timelineColor'
        !PodPicker.isUndefined(options.timelineColor)
            ? !PodPicker.isString(options.timelineColor)
                ? PodPicker.throwError('type', PodPicker.ERROR_MSG.type_options_timelineColor)
                : PodPicker.isHexColor(options.timelineColor)
                    ? null
                    : PodPicker.throwError('type', PodPicker.ERROR_MSG.type_value_options_timelineColor)
            : null

        // Check option: 'isShowStartTime'
        !PodPicker.isUndefined(options.isShowStartTime) && !PodPicker.isBoolean(options.isShowStartTime)
            ? PodPicker.throwError('type', PodPicker.ERROR_MSG.type_options_isShowStartTime)
            : null


        // Set options
        this.audioElem = options.audioElem
                            ? document.getElementById(options.audioElem)
                            : document.getElementsByTagName('audio')[0]
        this.timelineColor = options.timelineColor || '#CECECF'
        this.isShowStartTime = options.isShowStartTime
    }
    /**
     * Create the timeline element and then append it to `container` element
     *
     */
    createTimeline (){
        var that            = this,
            items           = this.items,
            audioElem       = this.audioElem,
            timelineColor   = this.timelineColor,
            isShowStartTime = this.isShowStartTime;

        var fragment = document.createDocumentFragment(''),
            timeline = document.createElement('div'),
            pointer  = document.createElement('span'),
            ul       = document.createElement('ul');

        for (let i = 0, len = items.length; i < len; i++){

            var item  = document.createElement('li'),
                span  = document.createElement('span'),
                start = this.convertTime(items[i].start),
                title = isShowStartTime ? items[i].start + ' - ' + items[i].title : items[i].title;

            // Extract all `item` start time and then push it to `this.startTimeSet`
            this.startTimeSet.push(start)

            // Register event handlers to `item` element
            ;(function (_item, start){
                // Jump to certain time offsets in `audioElem` 
                // when user click the item > span element
                _item.addEventListener('click', function (){
                    audioElem.play()
                    audioElem.currentTime = start
                    that.seekingIndex = window.setTimeout(function (){
                        document.getElementById('pp-pointer').className = 'seeking'
                    }, 500)
                })
            })(span, start)

            item.className = 'pp-item'
            span.appendChild(document.createTextNode(title))
            item.appendChild(span)
            ul.appendChild(item)
        }

        ul.style.color = timelineColor
        pointer.id = 'pp-pointer'
        timeline.id = 'pp-timeline'
        timeline.appendChild(ul)
        timeline.appendChild(pointer)
        fragment.appendChild(timeline)
        this.container.appendChild(fragment)

        // Register event handlers to `audioElem` element
        audioElem.addEventListener('timeupdate', function (){
            // init
            var currentTime  = audioElem.currentTime,
                startTimeSet = that.startTimeSet,
                len          = startTimeSet.length;

            if (Math.abs(that.preTime - currentTime) > 1){
                // user-triggered
                for (let i = 0; i < len; i++){
                    startTimeSet[i + 1] // the last one 
                        ? currentTime >= startTimeSet[i] && currentTime <= startTimeSet[i + 1]
                            ? that.setPointerPosition(i + 1)
                            : null
                        : currentTime >= startTimeSet[i]
                            ? that.setPointerPosition(i + 1)
                            : null
                }
            } else {
                // auto-triggered
                for (let i = 0; i < len; i++){
                    currentTime > startTimeSet[i] - 1 
                     && currentTime <= startTimeSet[i] + 1 
                     && that.itemsIndex !== i + 1
                        ? that.setPointerPosition(i + 1)
                        : null
                }
            }

            that.preTime = currentTime
        })
        // Seeking
        audioElem.addEventListener('seeking', function (){
            audioElem.pause()
        })
        // Seeked
        audioElem.addEventListener('seeked', function (){
            window.clearTimeout(that.seekingIndex)
            audioElem.play()
            document.getElementById('pp-pointer').removeAttribute('class')
        })
    }
    /**
     * Set or reset timeline pointer position
     *
     * @param {Number} index  Current pointer position
     */
    setPointerPosition (index){
        var item       = document.getElementsByClassName('pp-item'),
            pointer    = document.getElementById('pp-pointer'),
            item_h     = item[0].offsetHeight;

        // Store current item(Section) index
        this.itemsIndex = index
        // Set timeline section style
        item[index - 1].children[0].className = 'currentSection'
        for (let i = 0, item_len = item.length; i < item_len; i++){
            i !== index - 1
                ? item[i].children[0].removeAttribute('class')
                : null
        }
        // Set timeline pointer position
        pointer.style.top = (index * item_h - item_h / 2 - 6) + 'px'
    }
    /**
     * Convert time string to seconds
     *
     * @param {String} timeString  A time string 
     */
    convertTime (timeString){
        // Check time string
        PodPicker.isTimeString(timeString)
            ? null
            : PodPicker.throwError('default', PodPicker.ERROR_MSG.format_start)

        var timeArray = timeString.split(':'),
            len = timeArray.length;

        switch (len){

            case 1: 
                return timeArray[0] * 1
                break;
            case 2:
                return timeArray[0] * 60 + timeArray[1] * 1
                break;
            case 3:
                return timeArray[0] * 60 * 60 + timeArray[1] * 60 + timeArray[2] * 1
                break;
            default:
                PodPicker.throwError('default', PodPicker.ERROR_MSG.format_start)
        }        
    }
    /**
     * Error Messages
     *
     */
    static get ERROR_MSG (){
        return {
            // `container` parameter
            param_container: 'Pod Picker: `container` parameter is required',
            type_container: 'Pod Picker: `container` parameter must be a string',
            elem_container: 'Pod Picker: `container` parameter is not related to an existing ID',
            // `items` parameter
            param_items: 'Pod Picker: `items` parameter is required',
            type_items: 'Pod Picker: `items` parameter must be an array',
            empty_items: 'Pod Picker: `items` parameter cannot be an empty array',
            // `options` parameter
            type_options: 'Pod Picker: `options` parameter must be an object',
            type_options_audioElem: 'Pod Picker: `options.audioElem` must be a string',
            type_options_timelineColor: 'Pod Picker: `options.timelineColor` must be a string',
            type_options_isShowStartTime: 'Pod Picker: `options.isShowStartTime` must be a boolean',
            type_value_options_timelineColor: 'Pod Picker: `options.timelineColor` must be a hex color',
            // others
            format_audioFile: 'Pod Picker: does not support MP3 file format',
            format_start: 'Pod Picker: `start` time string must be "hh:mm:ss", "mm:ss" or "ss" format'
        }
    }
    /**
     * Throw Error
     *
     * @param {String} ERROR_MSG  Error message
     */
    static throwError (type, msg){

        switch (type){

            case 'type': 
                throw new TypeError(msg)
                break;
            default:
                throw new Error(msg)
                break;
        }
    }
    /**
     * Determines if a value is `undefined / string / boolean / array / object / hex color / timeString`
     *
     * @param {Any} value  The value need to be determined
     */
    static isUndefined (value){
        return typeof value === 'undefined';
    }
    static isString (value){
        return typeof value === 'string';
    }
    static isBoolean (value){
        return typeof value === 'boolean';
    }
    static isArray (value){
        return value.constructor === Array;
    }
    static isObject (value){
        return value.constructor === Object
    }
    static isHexColor (value){
        // via http://stackoverflow.com/a/8027444/3786947
        return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(value);
    }
    static isTimeString (value){
        return /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/.test(value)
    }
}


    // Browser globals
    if (!window.PodPicker){
        window.PodPicker = PodPicker;
    }

})(window, document);