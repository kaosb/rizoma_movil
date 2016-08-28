// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova', 'ngStorage'])

.run(function($ionicPlatform) {
	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			cordova.plugins.Keyboard.disableScroll(true);
		}
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleDefault();
		}
	});
})

.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider

	.state('app', {
		url: '/app',
		abstract: true,
		templateUrl: 'templates/menu.html',
		controller: 'AppCtrl'
	})

	.state('app.login', {
		url: '/login',
		abstract: true,
		templateUrl: 'templates/login.html',
		controller: 'LoginCtrl'
	})

	.state('app.scan', {
		url: '/scan/:clientId',
		views: {
			'menuContent': {
				templateUrl: 'templates/scan.html',
				controller: 'ScanCtrl'
			}
		}
	})

	.state('app.new', {
 		url: '/scan',
 		views: {
 			'menuContent': {
 				templateUrl: 'templates/scan.html',
 			controller: 'NewScanCtrl'
 			}
 		}
 	})

	.state('app.clients', {
		url: '/clients',
		views: {
			'menuContent': {
				templateUrl: 'templates/clients.html',
				controller: 'ClientsCtrl'
			}
		}
	});

	// Si ninguna ruta concuerda usa esta en su remplazo.
	$urlRouterProvider.otherwise('/app/clients');
});
