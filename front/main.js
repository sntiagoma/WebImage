var angular = require("angular");
var app = angular.module("WebImage",[]);

app.controller('WebImageController', ['$scope', function($scope){
	$scope.title = require("./app.js").name;
}]);