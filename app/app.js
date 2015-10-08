/**
*	This is the application config file 
*	In this application, I am following the best practices 
*	from john papa angular practice guide
*	https://github.com/johnpapa/angular-styleguide [Refer to this site for more details]	
*	Author : Hentry Martin
*	Date : 09/Sep/2015
*/
(function() {

	'use strict';
	angular.module('zoomRx', ['ui.router', 'LocalStorageModule', 'ngDragDrop', 'toaster'])
	.config(configurator);

	configurator.$inject = ['$stateProvider', '$urlRouterProvider', 'localStorageServiceProvider'];

	function configurator($stateProvider, $urlRouterProvider, localStorageServiceProvider) {


  		localStorageServiceProvider
  			.setPrefix('zoomRx')
    		.setStorageType('sessionStorage')
    		.setNotify(true, true); // This is the configuration for the local storage

		$stateProvider
			.state('listOfCards', {
				url : '/list',
				templateUrl : 'app/partials/lists.html',
				controller : 'ListsController'
			}).state('listOfCards.description', {
				url : '/description/:listId/:cardId',
				templateUrl : 'app/partials/description.html',
				controller : 'DescriptionController'
			});

			$urlRouterProvider.otherwise('/list');
	}


})();