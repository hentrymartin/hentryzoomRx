/**
*	This is to get the list of cards from the data file
*/
(function() {
	'use strict';

	angular.module('zoomRx')
		.factory('listService', listService);

	listService.$inject = ['$http'];

	function listService($http) {

		return {
			getAllLists : getAllLists
		}

		function getAllLists() {
			return $http.get('/zoomRx/data/lists.json');
		}
	}
})();