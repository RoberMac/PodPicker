# [Pod Picker](https://robermac.github.io/PodPicker)

*A Podcast Timeline Generator*

## Install
  - NPM: `npm install podpicker`
  - Bower: `bower install podpicker`
  - jsDelivr: `//cdn.jsdelivr.net/podpicker/latest/PodPicker.min.js` `//cdn.jsdelivr.net/podpicker/latest/PodPicker.min.css`

## Usage
#### Getting Started
- Include the scripts and style sheets in the \<head\> section
```html
<head>
    ...
    <link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/podpicker/latest/PodPicker.min.css">
    <script type="text/javascript" src="//cdn.jsdelivr.net/podpicker/latest/PodPicker.min.js"></script>
</head>
```

- Create a \<div\> wrapper which will contain the Pod Picker Timeline
```html
<div id="pp-wrapper"></div>
```

- Initialization the Pod Picker Timeline
```html
<script type="text/javascript">
    var pp = new PodPicker('pp-wrapper', [{'start': '00:00', 'title': 'INTRODUCTION'}]) // described in the following
</script>
```

### Parameters
```js
var pp = new PodPicker(id, items, options)
```
The PodPicker constructor accepts 3 parameters:
- `id` is the *`String`* value of a wrapper element's id attribute
- `items` is an *`Array`* containing items. (The properties of an item are described in section **Data Format**)
- `options` is an **optional** *`Object`* containing a name-value map with options. (described in section **Options**)

#### Data Format
The timeline must be provided with data items, which contain the properties `start` and `title`
  - `start` is the current Section Start Time
    - type: *`String`*
    - format: 'hh:mm:ss', 'mm:ss' or 'ss'
  - `title` is the current Section Title
    - type: *`String`*

For example:
```
  var items = [
    {"start":    "00:00", "title": "INTRODUCTION"},
    {"start":    "07:07", "title": "THE HISTORY AND CHRONOLOGY OF CUBISM"},
    {"start":    "40:55", "title": "PICASSO AND BRAQUE 1907-12"},
    {"start": "02:40:11", "title": "ICASSO, BRAQUE AND GRIS 1912-14"},
    {"start": "05:22:32", "title": "THE INFLUENCE OF CUBISM IN FRANCE 1910-14"},
    {"start": "06:30:50", "title": "CONCLUSION"},
  ]
```

#### Options
The following options are available.
  - `audioElem` is the audio element to interact with
    - type: *`String`*
    - format: id attribute (the default value is the first \<audio\> element of DOM) 
  - `timelineColor` is the timeline Section Title color
    - type: *`String`*
    - format: hex color (the default value is `#CECECF`)
  - `isShowStartTime` is to determine whether you need to show start time in front of the Section Title
    - type: *`Boolean`*
    - format: `true` or `false` (the default value is `false`)

For example:
```
  var pp_with_options = new PodPicker('pp-wrapper', items, {
      "audioElem"      : "podcast_audio",
      "timelineColor"  : "#F9441A",
      "isShowStartTime": true
  })
```

## [Postpicker](https://robermac.github.io/PodPicker/#!/postpicker)
*A Tool To Generate [Data Items](https://github.com/RoberMac/PodPicker#data-format) Relatively Quickly*
#### Getting Started
- [Import an audio file](https://raw.githubusercontent.com/RoberMac/PodPicker/master/img/step-1.gif) (Supports Ogg and AAC audio formats [\[1\]](https://github.com/RoberMac/PodPicker#troubleshoot))
- [Create a new section](https://raw.githubusercontent.com/RoberMac/PodPicker/master/img/step-2.gif)
- [Export Data Items](https://raw.githubusercontent.com/RoberMac/PodPicker/master/img/step-3.gif)

## Troubleshoot
#### Audio File Format
If audio file format is MP3, it's hard to accurate positioning to a specified time.

We recommend using the [AAC](https://www.wikiwand.com/en/Advanced_Audio_Coding) (.m4a) and [Ogg](https://www.wikiwand.com/en/Ogg) (.ogg) audio file format

For more details, see: [\[1\]](http://forums.codescript.in/javascript/html5-audio-currenttime-attribute-inaccurate-27606.html) and [\[2\]](https://jsfiddle.net/yp3o8cyw/2/)

For example:
```
  <audio id="podcast_audio" controls>
      <source src="your_audio_file.ogg" type="audio/ogg"> // for Chrome, Firefox 3.6+, Opera 10+
      <source src="your_audio_file.m4a" type="audio/mp4"> // for Safari, IE 9.0+, 
  </audio>
```
For more details, see [\[1\]](https://developer.mozilla.org/en-US/docs/Web/HTML/Supported_media_formats#Browser_compatibility)

##### Audio Converter
  - Convert to AAC: [Music Converter](https://itunes.apple.com/cn/app/music-converter/id468990728?l=en&mt=12)
  - Convert to Ogg: [Total Video Converter Lite](https://itunes.apple.com/cn/app/total-video-converter-lite/id520374433?l=en&mt=12)
  - Other options: [CloudConvert](https://cloudconvert.com)

## License
[MIT](https://github.com/RoberMac/PodPicker/blob/master/LICENSE)
