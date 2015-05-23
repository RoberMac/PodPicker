/**
 * Pod Picker v0.0.0
 * https://github.com/RoberMac/PodPicker
 *
 * Copyright (c) 2015 RoberTu <robertu0717@gmail.com>
 * @license MIT
 */

(function (window, document){

    'use strict';

    function PodPicker(container, items, options){

        /*
         * Basic Check
         * throw an error if the parameters is invalid
         **********************************************
         */

        // check `container` parameter
        typeof container === 'undefined'
        ? this.throwError('Pod Picker: `container` parameter is required')
        : container.constructor !== String
            ? this.throwError('Pod Picker: `container` parameter must be an string')
            : container = document.getElementById(container)

        !container
        ? this.throwError('Pod Picker: `container` parameter is not related to an existing ID')
        : null

        // check `items` parameter
        typeof items === 'undefined'
        ? this.throwError('Pod Picker: `items` parameter is required')
        : items.constructor !== Array
            ? this.throwError('Pod Picker: `items` parameter must be an array')
            : items.length <= 0
                ? this.throwError('Pod Picker: `items` parameter cannot be an empty array')
                : null

        // check `options` parameter
        typeof options !== 'undefined' && options.constructor !== Object
        ? this.throwError('Pod Picker: `options` parameter must be an object')
        : options = options || {}

        // Setup
        this.setup(container, items, options)
    }

    /**
     * Setup
     */
    PodPicker.prototype.setup = function (container, items, options){

        // allow options: 'audioElem', 'timelineColor'
        // check allow options: 'audioElem'
        typeof options.audioElem !== 'undefined'
        ? typeof options.audioElem !== 'string'
            ? this.throwError('Pod Picker: `options.audioElem` must be an string')
            : null
        : null

        // check allow options: 'timelineColor'
        typeof options.timelineColor !== 'undefined'
        ? typeof options.timelineColor !== 'string'
            ? this.throwError('Pod Picker: `options.timelineColor` must be an string')
            : /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(options.timelineColor)
                // via http://stackoverflow.com/a/8027444/3786947
                ? null
                : this.throwError('Pod Picker: `options.timelineColor` must be an hex color')
        : null

        var audioElem = options.audioElem
                ? document.getElementById(options.audioElem)
                : document.getElementsByTagName('audio')[0],
            timelineColor = options.timelineColor || '#000';

    }

    /**
     * Throw Error
     */
    PodPicker.prototype.throwError = function (error_string){
        throw new Error(error_string)
    }


    // Browser globals
    if (!window.PodPicker){
        window.PodPicker = PodPicker;
    }

})(window, document);