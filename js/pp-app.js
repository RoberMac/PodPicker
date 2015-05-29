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
}])
.controller('postController', ['$scope', '$rootScope', function($scope, $rootScope){

    $rootScope.currentPage = 'post'
}])
.controller('guideController', ['$scope', '$rootScope', function($scope, $rootScope){

    $rootScope.currentPage = 'guide'
}])
