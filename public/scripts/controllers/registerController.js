tabtalent.controller('RegisterController', ['$http', '$scope', '$stateParams', '$state', '$rootScope', function ($http, $scope, $stateParams, $state, $rootScope) {

    $scope.data = {};
    
    $(document).on("focus", ".datepicker", function(){
        $(this).daterangepicker({
            singleDatePicker: true,
            showDropdowns: true
        })
            .change(dateChanged)
            .on('changeDate', dateChanged);
    });

      $(document).on("focus", ".datepickeredu", function(){
        $(this).daterangepicker({
            singleDatePicker: true,
            showDropdowns: true
        })
            .change(dateEduChanged)
            .on('changeDate', dateEduChanged);
    });
    
   
    
    $scope.postDetails = function () {

        var toPush = [];
        $rootScope.user.experiences.forEach(function (value, index) {
            if(!angular.equals(value, {})){
                toPush.push(index);
            }
        });
        var temp = [];
        toPush.forEach(function (value) {
            temp.push($rootScope.user.experiences[value])
        });
        $rootScope.user.experiences = temp;
        
        console.log($rootScope.user.experiences);
        $rootScope.user.experiences.forEach(function (toMatch, index) {
            if(toMatch.selectedCompany){
                if(typeof toMatch.selectedCompany.originalObject == 'string'){
                    toMatch.companyName = toMatch.selectedCompany.originalObject;
                    toMatch.linkedTo = null;
                } else {
                    toMatch.companyName = toMatch.selectedCompany.originalObject.name;
                    toMatch.linkedTo = toMatch.selectedCompany.originalObject._id
                }
            }
        });


        console.log($rootScope.user.experiences);
        
        $http.post('http://localhost/tab_api/index.php/users/update', $rootScope.user).then(function (res) { 
            $rootScope.user =  (res.data || {}).data;
            $rootScope.user.skills =  $rootScope.user.skills || [];
            $rootScope.user.educations = $rootScope.user.educations  || [];
            localStorage.setItem('TabTalentUser', JSON.stringify($rootScope.user));
            $state.go('app.profile');
        })    
    };
    
    function dateChanged(e) {
        var name = e.target.name.substr(0, e.target.name.length-1);
        var index = e.target.name.substr(e.target.name.length-1, 1);
        
        if(name == 'datefrom'){
            $rootScope.user.experiences[parseInt(index)].dateFrom = e.target.value;
        } else {
            $rootScope.user.experiences[parseInt(index)].dateTo = e.target.value;
        }
    }

    $scope.getallCompanyData = function () {
        $http.get('http://localhost/tab_api/index.php/company/getall').then(function (response) {
            $scope.companies = response.data;
        })
    };
    
}]);