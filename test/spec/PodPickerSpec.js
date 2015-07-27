describe('[Pod Picker]', function() {
 
    var items = [
        {"start":    "00:00", "title": "INTRODUCTION"},
        {"start":    "07:07", "title": "THE HISTORY AND CHRONOLOGY OF CUBISM"},
        {"start":    "18:55", "title": "PICASSO AND BRAQUE 1907-12"},
        {"start":    "40:11", "title": "ICASSO, BRAQUE AND GRIS 1912-14"},
        {"start": "01:22:32", "title": "THE INFLUENCE OF CUBISM IN FRANCE 1910-14"},
        {"start": "02:04:50", "title": "CONCLUSION"}
    ]

    var pp_target = document.createElement('div')
    pp_target.id = 'pp_target'
    document.body.appendChild(pp_target)


    /**
     * `id` parameter
     *
     */
    // `id` is `Undefined`
    it('should throw an error when the `id` is `Undefined`', function() {
        expect(function (){
            new PodPicker()
        }).toThrowError('Pod Picker: `container` parameter is required');
    });
    // `id` is not `String`
    it('should throw an error when the `id` is not a `String`', function() {
        expect(function (){
            new PodPicker({}, items)
        }).toThrowError('Pod Picker: `container` parameter must be a string');

        expect(function (){
            new PodPicker([], items)
        }).toThrowError('Pod Picker: `container` parameter must be a string');

        expect(function (){
            new PodPicker(document.getElementById('pp_target'), items)
        }).toThrowError('Pod Picker: `container` parameter must be a string');
    });
    // `id` is not related to an existing ID
    it('should throw an error when the `id` is not related to an existing ID', function() {
        expect(function (){
            new PodPicker('idNotExist', items)
        }).toThrowError('Pod Picker: `container` parameter is not related to an existing ID');
    });


    /**
     * `items` parameter
     *
     */
    // `items` is `Undefined`
    it('should throw an error when the `items` is `Undefined`', function() {
        expect(function (){
            new PodPicker('pp_target')
        }).toThrowError('Pod Picker: `items` parameter is required');
    });
    // `items` is not a `Array`
    it('should throw an error when the `items` is not a `Array`', function() {
        expect(function (){
            new PodPicker('pp_target', {})
        }).toThrowError('Pod Picker: `items` parameter must be an array')

        expect(function (){
            new PodPicker('pp_target', '')
        }).toThrowError('Pod Picker: `items` parameter must be an array')
    });
    // `items` is a empty `Array`
    it('should throw an error when the `items` is a empty `Array`', function() {
        expect(function (){
            new PodPicker('pp_target', [])
        }).toThrowError('Pod Picker: `items` parameter cannot be an empty array')
    });
    // `items` item `start` time string is wrong format
    it('should throw an error when the `items` item `start` time string is wrong format', function() {
        expect(function (){
            var wrongStartTimeStringItems = [
                {"start": "00:00", "title": "INTRODUCTION"},
                {"start": "07:61", "title": "THE HISTORY AND CHRONOLOGY OF CUBISM"}
            ]
            new PodPicker('pp_target', wrongStartTimeStringItems)
        }).toThrowError('Pod Picker: `start` time string must be "hh:mm:ss", "mm:ss" or "ss" format')
    });


    /**
     * `options` parameter
     *
     */
    // `options` is not a `Object`
    it('should throw an error when the `options` is not a `Object`', function() {
        expect(function (){
            new PodPicker('pp_target', items, [])
        }).toThrowError('Pod Picker: `options` parameter must be an object')

        expect(function (){
            new PodPicker('pp_target', items, '')
        }).toThrowError('Pod Picker: `options` parameter must be an object')
    });
    // `options.audioElem` is not a string
    it('should throw an error when the `options.audioElem` is not a string', function() {
        expect(function (){
            new PodPicker('pp_target', items, {
                audioElem: []
            })
        }).toThrowError('Pod Picker: `options.audioElem` must be a string')

        expect(function (){
            new PodPicker('pp_target', items, {
                audioElem: document.getElementById('pp_target')
            })
        }).toThrowError('Pod Picker: `options.audioElem` must be a string')
    });
    // `options.timelineColor` is not a string'
    it('should throw an error when the `options.timelineColor` is not a string', function() {
        expect(function (){
            new PodPicker('pp_target', items, {
                timelineColor: ['#CECECF', '#000', '#FFF']
            })
        }).toThrowError('Pod Picker: `options.timelineColor` must be a string')
    });
    // `options.isShowStartTime` is not a boolean
    it('should throw an error when the `options.isShowStartTime` is not a boolean', function() {
        expect(function (){
            new PodPicker('pp_target', items, {
                isShowStartTime: 'true'
            })
        }).toThrowError('Pod Picker: `options.isShowStartTime` must be a boolean')

        expect(function (){
            new PodPicker('pp_target', items, {
                isShowStartTime: ['true']
            })
        }).toThrowError('Pod Picker: `options.isShowStartTime` must be a boolean')
    });
    // `options.timelineColor` is not a hex color'
    it('should throw an error when the `options.timelineColor` is not a hex color', function() {
        expect(function (){
            new PodPicker('pp_target', items, {
                timelineColor: '#0000'
            })
        }).toThrowError('Pod Picker: `options.timelineColor` must be a hex color')

        expect(function (){
            new PodPicker('pp_target', items, {
                timelineColor: 'red'
            })
        }).toThrowError('Pod Picker: `options.timelineColor` must be a hex color')
    });

});