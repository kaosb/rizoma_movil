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

.controller('ScansCtrl', function($scope) {
  $scope.scans = [
    { title: 'Cargamento palta', id: 1 },
    { title: 'Cargamento manzana', id: 2 },
    { title: 'El floral', id: 3 },
    { title: 'Mingus', id: 4 },
    { title: 'Cargamento x', id: 5 },
    { title: 'Cargamento xxx', id: 6 }
  ];
})

.controller("ScanCtrl", function($scope, $cordovaBarcodeScanner) {
	$scope.codes = []
	$scope.scanBarcode = function() {
		$cordovaBarcodeScanner.scan().then(function(imageData) {
			$scope.codes.push(imageData.text);
			alert(imageData.text);
			console.log("Barcode Format -> " + imageData.format);
			console.log("Cancelled -> " + imageData.cancelled);
		}, function(error) {
			console.log("An error happened -> " + error);
		});
	};
})

.controller("NewScanCtrl", function($scope, $cordovaBarcodeScanner) {
    $scope.codes = []
    $scope.scanBarcode = function() {
        $cordovaBarcodeScanner.scan().then(function(imageData) {
            $scope.codes.push(imageData.text);
            // alert(imageData.text);
            // console.log("Barcode Format -> " + imageData.format);
            // console.log("Cancelled -> " + imageData.cancelled);
        }, function(error) {
            // console.log("An error happened -> " + error);
        });
    };
});

// .controller('ScanCtrl', function($scope, $stateParams) {
// });
