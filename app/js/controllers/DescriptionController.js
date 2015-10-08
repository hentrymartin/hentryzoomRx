/**
*	This controller is to show the selected description and also to change or delete it
*/
(function() {

	'use strict';

	angular.module('zoomRx')
		.controller('DescriptionController', descriptionController);

		descriptionController.$inject = ['$scope', '$stateParams', '$filter', 'listService', '$state', 'localStorageService', 'toaster'];	//Dependency injection

		function descriptionController($scope, $stateParams, $filter, listService, $state, localStorageService, toaster) {


			/**
			*	This is to get the exact selected card from the list id and card id
			*/
			function extractCard() {

				var selectedList = _.filter($scope.parentList, function(list) {
					return list.id == $stateParams.listId;
				});

				if (selectedList.length == 0) return {};

				var selectedCard = _.filter(selectedList[0].cards, function(card) {
					return card.id == $stateParams.cardId;
				});

				if (selectedCard.length == 0) return {};

				return selectedCard[0];
			}

			/**
			*	This is to add a new comment to the card
			*/
			$scope.addComment = function() {

				if ($scope.comment.length == 0) {
					toaster.pop('error', 'Please fill something in comment field');	
					return;
				}

				var temp = {
					commentTitle : angular.copy($scope.comment),
					date : $filter('date')(new Date(), 'dd MMM yyyy')
				}
				if (!$scope.selectedCard.comments) $scope.selectedCard.comments = [];

				$scope.selectedCard.comments.push(temp);
				$scope.comment = '';
				localStorageService.set('zoomRx-lists', $scope.parentList);
				toaster.pop('success', 'comment added successfully');
			};

			$scope.deleteThisCard = function() {


				var selectedList = _.filter($scope.parentList, function(list) {
					return list.id == $stateParams.listId;
				});

				if (selectedList.length == 0) return {};


				_.remove(selectedList[0].cards, function(card) {
					return card.id == $stateParams.cardId;
				});
				localStorageService.set('zoomRx-lists', $scope.parentList);

				$state.go('listOfCards');
				toaster.pop('success', 'Card deleted successfully');
			}
			
			/**
			*	This is to format the dates in the comment section of the card
			*/
			function dateFormatter() {
				for (var index = 0; index < $scope.selectedCard.comments.length; index++) {
					var each = $scope.selectedCard.comments[index];
					each.date = $filter('date')(each.date, 'dd MMM yyyy');
				}
			}

			/**
			*	This is the starting point of the controller functionality
			*/
			$scope.init = function() {
				$scope.states.isList = false;
				$scope.comment = '';
				$scope.parentList = localStorageService.get('zoomRx-lists');
				$scope.selectedCard = extractCard();
				dateFormatter();
			};

			$scope.init();
		}
})();