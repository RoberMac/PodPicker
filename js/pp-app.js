angular.module('ppApp', ['ngRoute', 'ngAnimate', 'angular-storage'])
.config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(false).hashPrefix('!');

    $routeProvider.
      when('/', {
            templateUrl: 'template/first-contact.min.html',
            controller: 'demoController'
      }).
      when('/postpicker', {
            templateUrl: 'template/post-picker.min.html',
            controller: 'postController'
      }).
      when('/guide', {
            templateUrl: 'template/guide.min.html',
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
    $http.get('template/guide.min.html', {
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
    setTimeout(function (){
        var pp = new PodPicker('pp-wrapper', itgonglun)
    }, 0)
}])
.controller('postController', ['$scope', '$rootScope', '$timeout', 'store', function($scope, $rootScope, $timeout, store){

    $rootScope.currentPage = 'post'
    $scope.isConsole       = true
    $scope.isLoadAudioFile = true

    var audioFile   = document.getElementById('audio_file'),
        ngAudioFile = angular.element(audioFile),
        audioPlayer, ngAudioPlayer, audioFileSrc,
        audioStore; // 用於存儲該音頻文件編輯／播放信息

    listenAudioFile()

    // 載入音頻文件
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
        $scope.sectionItemsData = audioStore.get('sectionItemsData') || []
    })


    /**
     * 音頻控制
     *
     */
    $scope.skip = function (sec){
        audioPlayer.currentTime += sec
        audioPlayer.play()
    }
    $scope.toggleRate = function (){
        var rateIcon = angular.element(document.getElementById('rate_icon'))
        if (audioPlayer.playbackRate === 2){
            audioPlayer.playbackRate = 1
            rateIcon.removeClass('sprite-Rate-2x-Selected')
            rateIcon.addClass('sprite-Rate-2x')
        } else {
            audioPlayer.playbackRate = 2
            rateIcon.removeClass('sprite-Rate-2x')
            rateIcon.addClass('sprite-Rate-2x-Selected')
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
        $scope.newSection.original_start = timeObject
        document.getElementById('section_title').focus()
    }


    /**
     * 章節編輯
     *
     */
    /* 章節 */
    $scope.sectionItems       = []
    $scope.sectionItemsData   = []
    $scope.editSectionItems   = []
    $scope.newSection         = {}
    $scope.isShowSectionItems = false
    $scope.isEditSectionItems = false
    $scope.isShowItemsData    = false
    $scope.isShowAlert        = false
    $scope.isDeleteItem       = false
    $scope.sectionSubmit = function (){
        // 存儲「新章節」
        $scope.sectionItems.push($scope.newSection)
        $scope.sectionItemsData.push({
            'start': secObjToTimeString($scope.newSection.original_start),
            'title': $scope.newSection.title
        })
        // 存儲完成，清除數據
        $scope.newSection = {}
        // 動畫提醒
        var itemsIcon  = angular.element(document.getElementById('items_icon'));
        itemsIcon.removeClass('sprite-Section-Items')
        itemsIcon.addClass('sprite-Section-Items-Selected')
        $timeout(function (){
            itemsIcon.removeClass('sprite-Section-Items-Selected')
            itemsIcon.addClass('sprite-Section-Items')
            // 繼續播放
            audioPlayer.play()
        }, 717)
    }
    /* 顯示／隱藏「時間線」演示 */
    $scope.toggleSectionItems = function (){
        var isShowSectionItems = $scope.isShowSectionItems,
            isEmpty            = $scope.sectionItems.length > 0;
        if (!isShowSectionItems && isEmpty){
            // 移除 `audioPlayer` 元素上的所有 Event Listeners
            ngAudioPlayer.replaceWith(ngAudioPlayer.clone())
            refreshAudioFile()
            refreshTimeline()
        } else if (isShowSectionItems && isEmpty){
            // 還原上次播放時間
            audioPlayer.currentTime = audioStore.get('lastPlayTime')
            listenAudioFile()
        } else {
            return
        }
        $scope.isShowSectionItems = !$scope.isShowSectionItems
    }
    /* 顯示／隱藏（保存）數據項 */
    $scope.toggleEditSectionItems = function (){
        if ($scope.isEditSectionItems){
            // 更新「時間線」
            $scope.sectionItems = angular.copy($scope.editSectionItems)
            refreshSectionItemsData()
            refreshTimeline()
        } else {
            $scope.editSectionItems = angular.copy($scope.sectionItems)
            $scope.isDeleteItem = false
        }
        $scope.isEditSectionItems = !$scope.isEditSectionItems
    }
    /* 顯示／隱藏刪除按鈕 */
    $scope.toggleDeleteItem = function (){
        $scope.isDeleteItem = !$scope.isDeleteItem
    }
    /* 刪除單項數據 */
    $scope.deleteItem = function (index){
        $scope.editSectionItems.splice(index, 1)        
    }
    // 監聽 `sectionItems` & `sectionItemsData` 改動，自動存儲於本地
    $scope.$watchCollection('sectionItems', function (newVal){
        audioStore.set('sectionItems', newVal)
    })
    $scope.$watchCollection('sectionItemsData', function (newVal){
        audioStore.set('sectionItemsData', newVal)
    })


    /**
     * 提示框
     *
     */
    $scope.alertTitle = ''
    $scope.alertAction = ''
    $scope.ok = function (){
        if ($scope.alertAction === 'clearSectionItems'){
            /* 清空所有數據 */
            $scope.toggleSectionItems()
            $scope.sectionItems = []
            $scope.sectionItemsData = []
        }
        $scope.isEditSectionItems = !$scope.isEditSectionItems
        $scope.isShowAlert = false
    }
    /* 顯示／隱藏提示框 */
    $scope.toggleShowAlert = function (title, action){
        // 當數據沒改動過，直接退出
        if (title === 'UNDO ALL CHANGES' && angular.equals($scope.editSectionItems, $scope.sectionItems)){
            $scope.isEditSectionItems = !$scope.isEditSectionItems
            $scope.isShowAlert = false
            return;
        }
        $scope.alertTitle = title ? title : null
        $scope.alertAction = action ? action : null
        $scope.isShowAlert = !$scope.isShowAlert
    }
    /* 顯示／隱藏數據 */
    $scope.toggleItemsData = function (){
        if (!$scope.isShowItemsData){
            var blob = new Blob([JSON.stringify($scope.sectionItemsData)], {type: "application/json"}),
                url  = URL.createObjectURL(blob),
                elem = document.getElementById('downloadItemsData')
            elem.download = 'items_data.json'
            elem.href     = url
        }
        $scope.isShowItemsData = !$scope.isShowItemsData
    }

    /**
     * Helper
     *
     */
    // via http://stackoverflow.com/a/6313008/3786947
    function secNumToTimeArray(secNum){
        var sec_num = parseInt(secNum, 10),
            hours   = Math.floor(sec_num / 3600),
            minutes = Math.floor((sec_num - (hours * 3600)) / 60),
            seconds = sec_num - (hours * 3600) - (minutes * 60);
        return [hours, minutes, seconds]
    }
    function secObjToTimeString (secObj){
        var start_h    = secObj.h,
            start_m    = secObj.m,
            start_s    = secObj.s,
            h          = start_h < 10 ? '0' + start_h : start_h,
            m          = start_m < 10 ? '0' + start_m : start_m,
            s          = start_s < 10 ? '0' + start_s : start_s,
            timeString =  h + ':' + m + ':' + s;
        return timeString
    }
    function refreshAudioFile(){
        // 刷新元素引用
        audioPlayer    = document.getElementById('audio_player')
        ngAudioPlayer  = angular.element(audioPlayer)
    }
    function listenAudioFile(){
        refreshAudioFile()
        // 判斷是否需要更新時間
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
    }
    // 刷新「時間線」
    function refreshTimeline(){
        var ngTimeline = angular.element(document.getElementById('pp-timeline'))
        if (ngTimeline){
            ngTimeline.remove()
        }
        var pp = new PodPicker('pp-wrapper', $scope.sectionItemsData, {
            "isShowStartTime": true
        })
    }
    // 刷新章節（導出）數據
    function refreshSectionItemsData (){
        var len   = $scope.sectionItems.length,
            cache = [];
        for (var i = 0; i < len; i++){
            cache.push({
                'start': secObjToTimeString($scope.sectionItems[i].original_start),
                'title': $scope.sectionItems[i].title
            })
        }
        $scope.sectionItemsData = cache
    }
}])
.controller('guideController', ['$rootScope', function($rootScope){

    $rootScope.currentPage = 'guide'
}])
