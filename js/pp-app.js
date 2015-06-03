angular.module('ppApp', ['ngRoute', 'ngAnimate', 'angular-storage'])
.config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(false).hashPrefix('!');

    $routeProvider.
      when('/', {
            templateUrl: 'template/first-contact.html',
            controller: 'demoController'
      }).
      when('/postpicker', {
            templateUrl: 'template/post-picker.html',
            controller: 'postController'
      }).
      when('/guide', {
            templateUrl: 'template/guide.html',
            controller: 'guideController'
      }).
      otherwise({
            redirectTo: '/'
      });

}])
.controller('ppController', ['$scope', '$http', '$templateCache', function($scope, $http, $templateCache){

    // 開場動畫結束
    $scope.isLoaded = true
    // 預加載「The Picker's Guide」模板，預防從「PostPicker」跳轉來時失效
    $http.get('template/guide.html', {
        cache: $templateCache
    })

}])
.controller('demoController', ['$rootScope', function($rootScope){

    $rootScope.currentPage = 'demo'

    var itgonglun = [
        {"start": "00:00", "title": "開始"},
        {"start": "01:42", "title": "會員廣告"},
        {"start": "04:43", "title": "聽眾反饋一：虛擬現實"},
        {"start": "20:40", "title": "聽眾反饋二"},
        {"start": "28:20", "title": "Rio 的 Apple Watch 体验"},
        {"start": "48:53", "title": "和《IT 公论》「抢生意」的 Vox + LOOP"},
        {"start": "01:07:05", "title": "Mike Matas 新作、Facebook 的 Instant Articles"},
        {"start": "01:19:22", "title": "URL 的終結？"},
        {"start": "01:49:53", "title": "App 推薦"},
        {"start": "01:52:03", "title": "結束"}
    ]
    var pp = new PodPicker('pp-wrapper', itgonglun)
}])
.controller('postController', ['$scope', '$rootScope', '$timeout', 'store', function($scope, $rootScope, $timeout, store){

    $rootScope.currentPage = 'post'
    $scope.isConsole       = true
    $scope.isLoadAudioFile = true

    var audioFile      = document.getElementById('audio_file'),
        audioPlayer    = document.getElementById('audio_player'),
        ngAudioFile    = angular.element(audioFile),
        ngAudioPlayer  = angular.element(audioPlayer),
        audioFileSrc,
        audioStore; // 用於存儲該音頻文件編輯／播放信息

    // 事件
    ngAudioFile.bind('change', function (){
        var file = audioFile.files[0],
            audioFileIndex = file.lastModified + file.name; // 音頻文件 ID，方便存儲數據與本地
        // 初始化用戶存儲該音頻文件的命名空間
        audioStore = store.getNamespacedStore(audioFileIndex)
        // 加載音頻文件 
        $scope.$apply(function (){
            $scope.isLoadAudioFile = false
            $scope.isConsole = false
            audioPlayer.src = URL.createObjectURL(file)
            $timeout(function (){
                audioPlayer.currentTime = audioStore.get('lastPlayTime')
            }, 100)
        })
        // 恢復上次編輯的數據
        $scope.sectionItems = audioStore.get('sectionItems') || []
    })
    ngAudioPlayer.bind('pause', function (){
        if (Object.getOwnPropertyNames($scope.newSection).length <= 0){
            var timeArray  = secNumToTimeArray(audioPlayer.currentTime),
                timeObject = {
                    "h": timeArray[0],
                    "m": timeArray[1],
                    "s": timeArray[2]
                };
            $scope.$apply(function (){
                $scope.newSection.start = timeObject
            })
        }
    })
    // 存儲當前播放時間
    ngAudioPlayer.bind('timeupdate', function (){
        audioStore.set('lastPlayTime', audioPlayer.currentTime)
    })
    // via http://stackoverflow.com/a/6313008/3786947
    function secNumToTimeArray(secNum){
        var sec_num = parseInt(secNum, 10),
            hours   = Math.floor(sec_num / 3600),
            minutes = Math.floor((sec_num - (hours * 3600)) / 60),
            seconds = sec_num - (hours * 3600) - (minutes * 60);

        return [hours, minutes, seconds]
    }

    // 控制音頻播放
    $scope.skip = function (sec){
        audioPlayer.currentTime += sec
        audioPlayer.play()
    }
    $scope.toggleRate = function (){
        var rateIcon = angular.element(document.getElementById('rate_icon'))
        if (audioPlayer.playbackRate === 2){
            audioPlayer.playbackRate = 1
            rateIcon.removeClass('reversion')
        } else {
            audioPlayer.playbackRate = 2
            rateIcon.addClass('reversion')
        }
        audioPlayer.play()
    }
    $scope.refreshStartTime = function (){
        var timeArray = secNumToTimeArray(audioPlayer.currentTime),
            timeObject = {
                "h": timeArray[0],
                "m": timeArray[1],
                "s": timeArray[2]
            };
        $scope.newSection.start = timeObject
        document.getElementById('section_title').focus()
    }
    $scope.toggleSectionItems = function (){
        $scope.isShowSectionItems = !$scope.isShowSectionItems
    }
    /* 章節 */
    $scope.sectionItems    = []
    $scope.newSection = {}
    $scope.isShowSectionItems = false
    $scope.sectionSubmit = function (){
        var start_h    = $scope.newSection.start.h,
            start_m    = $scope.newSection.start.m,
            start_s    = $scope.newSection.start.s,
            h          = start_h < 10 ? '0' + start_h : start_h,
            m          = start_m < 10 ? '0' + start_m : start_m,
            s          = start_s < 10 ? '0' + start_s : start_s,
            timeString =  h + ':' + m + ':' + s,
            itemsIcon  = angular.element(document.getElementById('items_icon'));

        $scope.sectionItems.push({
            "start": timeString,
            "title": $scope.newSection.title
        })
        // 動畫提醒
        itemsIcon.addClass('reversion')
        $timeout(function (){
            itemsIcon.removeClass('reversion')
        }, 717)
        // 編輯完成後清除數據
        $scope.newSection = {}
        // 繼續播放
        audioPlayer.play()
        // 存儲當前編輯的數據於本地
        audioStore.set('sectionItems', $scope.sectionItems)
    }
}])
.directive('ppItems', function (){
    return {
        restrict: 'E',
        replace : true,
        template: '<div id="">'
                +     '<div id="pp-wrapper"></div>'
                + '</div>',
        link: function (scope, elem, attr){
            var pp = new PodPicker('pp-wrapper', scope.sectionItems, {
                "isShowStartTime": true
            })
        }
    }
})
.controller('guideController', ['$rootScope', function($rootScope){

    $rootScope.currentPage = 'guide'
}])
