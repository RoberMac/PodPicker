angular.module('ppApp', ['ngRoute'])
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
.controller('ppController', ['$scope', function($scope){

    // 開場動畫結束
    $scope.isLoaded = true
}])
.controller('demoController', ['$scope', '$rootScope', function($scope, $rootScope){

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
.controller('postController', ['$scope', '$rootScope', function($scope, $rootScope){

    $rootScope.currentPage = 'post'
}])
.controller('guideController', ['$scope', '$rootScope', function($scope, $rootScope){

    $rootScope.currentPage = 'guide'
}])
