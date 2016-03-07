//var angular = require("angular"); //If don't have internet to try angular
var app = angular.module("WebImage",[]);

app.controller('WebImageController', ['$scope', function($scope){
	$scope.title = require("./app.js").name;
    $scope.searchBar = true;
    $scope.showSearchBar = function(){
        $scope.searchBar = false;  
    };

}]);