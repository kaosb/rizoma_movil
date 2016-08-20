angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

// .controller('PlaylistCtrl', function($scope, $stateParams) {
// });

.controller('PlaylistCtrl', ['$scope','$cordovaBarcodeScanner','$ionicPlatform',
	function($scope,$cordovaBarcodeScanner,$ionicPlatform) {
		// $scope.scan = function(){
		// 	$ionicPlatform.ready(function() {
				$cordovaBarcodeScanner.scan().then(function(barcodeData) {
					alert(JSON.stringify(barcodeData));
				}, function(error) {
					alert(JSON.stringify(error));
				});
		// 	});
		// }
	}
]);

// .config(function($stateProvider, $urlRouterProvider){
//    $stateProvider.state('home',{
//       url:'/home',
//       templateUrl: 'views/home.html',
//       controller: 'HomeCtrl'
//    });
//    $urlRouterProvider.otherwise('/home');
// });


// .controller('PlaylistCtrl', function($scope, $rootScope, $cordovaBarcodeScanner, $ionicPlatform) {
// 	alert("holi");
//     // var vm = this;
//     // vm.scan = function(){
//     //     $ionicPlatform.ready(function() {
//     //         $cordovaBarcodeScanner
//     //             .scan()
//     //             .then(function(result) {
//     //                 // Success! Barcode data is here
//     //                 vm.scanResults = "We got a barcode\n" +
//     //                 "Result: " + result.text + "\n" +
//     //                 "Format: " + result.format + "\n" +
//     //                 "Cancelled: " + result.cancelled;
//     //             }, function(error) {
//     //                 // An error occurred
//     //                 vm.scanResults = 'Error: ' + error;
//     //             });
//     //     });
//     // };
//     // vm.scanResults = '';
// });
