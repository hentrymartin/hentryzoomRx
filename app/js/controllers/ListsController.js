/**
*	This controller is used to list the list of cards as well implements the functionality for drag and drop
*/
(function() {

	'use strict';
	angular.module('zoomRx')
		.controller('ListsController', listsController);


	listsController.$inject = ['$scope', 'listService', '$state', '$rootScope', 'localStorageService', '$timeout', 'toaster']; // DI

	function listsController($scope, listService, $state, $rootScope, localStorageService, $timeout, toaster) {
		

		 $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
		 	$scope.states.isList = !(toState.name == 'listOfCards.description');
		 	if (toState.name == 'listOfCards') {
		 		$scope.init();
		 	}
		 });

		/**
		*	This is to get all the cards in the list
		*/
		function getAllLists() {

			NProgress.start()
			listService.getAllLists().then(function(data) {
				$scope.lists = data.data;
				localStorageService.set('zoomRx-lists', $scope.lists);
			}).finally(function() {
				NProgress.done();
			});
		}

		function getLatestId() {

			var sorted = $scope.lists.sort(function(a, b) {
				return parseInt(a.id) - parseInt(b.id);
			});

			return sorted.reverse()[0].id;
		}

		/**
		*	This is to add a new list to the lists
		*/
		$scope.addNewList = function() {

			var temp = angular.copy($scope.tempListItem);
			temp.id = (parseInt(getLatestId()) + 1);
			temp.name = "List " + (parseInt(getLatestId()) + 1);
			$scope.lists.push(temp);
			localStorageService.set('zoomRx-lists', $scope.lists);
			toaster.pop('info', 'New list added');
		};

		/**
		*	This is to delete a particular list from the existing lists
		*/
		$scope.deleteList = function(id) {
			_.remove($scope.lists, function(item) {
				return item.id == id;
			});
			localStorageService.set('zoomRx-lists', $scope.lists);
			toaster.pop('success', 'list deleted successfully');
		};

		/**
		*	This is to add a new card into available list of cards
		*/
		$scope.addNewCard = function(cards) {

			if (!cards) return;
			cards.push({
				"title" : "Newly Created",
				"id" : cards.length + 1,
				"description" : "Newly Created",
				"comments" : []
			});

			localStorageService.set('zoomRx-lists', $scope.lists);
			toaster.pop('success', 'new card added successfully');
		};

		/**
		*	This is to navigate to the description state of that card
		*/
		$scope.goToDescription = function(list, card) {
			$state.go('listOfCards.description', {listId : list.id, cardId : card.id});
		}

		/**
		*	This is the starting point of the controller functionality
		*/
		$scope.init = function() {

			//This is just for the progress bar. We can use nprogress for service call indication
			NProgress.start();
			$timeout(function() {
				NProgress.done();
			},200);

			$scope.lists = localStorageService.get('zoomRx-lists') ? localStorageService.get('zoomRx-lists') : [];
			$scope.states = {};
			$scope.states.isList = true;
			$scope.tempListItem = {
				"name" : "List 3",
				"id" : "1",
				"cards" : [{
						"title" : "Card Title",
						"id" : 1,
						"description" : "This is the card 1",
						"comments" : []
					}]
			};
			if ($scope.lists.length == 0) {
				getAllLists();
			}
		};

		$scope.init();
	}
})();