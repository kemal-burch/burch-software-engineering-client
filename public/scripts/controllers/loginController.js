tabtalent.controller('LoginController', ['$http', '$scope', '$stateParams', '$state', '$rootScope', function ($http, $scope, $stateParams, $state, $rootScope) {

    $scope.post = function () {

        $http.post('http://localhost/tab_api/index.php/users/login', $scope.cred).then(function (res) {
            $rootScope.user = (res.data || {}).data || {};
            console.log("\r\n\n\n  $rootScope.user ",  $rootScope.user)
            $state.go('app.profile');
        }, function (error) {
            $scope.message = error.data.message;
        });
    }
    
}]);