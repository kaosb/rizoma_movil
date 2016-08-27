angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http, $sessionStorage) {
// With the new view caching in Ionic, Controllers are only called
// when they are recreated or on app start, instead of every page change.
// To listen for when this page is active (for example, to refresh data),
// listen for the $ionicView.enter event:
//$scope.$on('$ionicView.enter', function(e) {
//});
  
	// Construyo el elemento que mantendra a la session.
	$scope.session = $sessionStorage;
  
	// Datos de formulario para el formulario de login.
	$scope.loginData = {};

	// Crea el modal de login, que posteriormente se usa.
	$ionicModal.fromTemplateUrl('templates/login.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.modal = modal;
	});

	// Oculta el modal de login.
	$scope.closeLogin = function() {
		$scope.modal.hide();
	};

	// Abre el modal de login.
	$scope.login = function() {
		$scope.modal.show();
	};

	// Ejecuta el login, contra el endpoint con la informacion del formulario.
	$scope.doLogin = function() {
		var data = {
			"email": $scope.loginData.username,
			"password": $scope.loginData.password
		}
		$http({
			url: "http://app.rizoma.io/api/v1/tokens.json",
			method: "POST",
			data: data
		}).success(function(data, status, headers, config) {
			$scope.session.status = status;
			$scope.session.token = data.token;
			alert($scope.session);
			$scope.closeLogin();
		}).error(function(data, status, headers, config) {
			$scope.session.status = status;
			alert("No fue posible autenticarte.");
		});
	};

	// Obtiene los clientes contra el endpoint de rizoma.
	$scope.getClients = function(){
		if($scope.session){
			$http({
				url: "http://app.rizoma.io/api/v1/clients.json",
				method: "GET",
				data: {'auth_token': $scope.session}
			}).success(function(data, status) {
				alert(status);
				alert(data.session);
				$scope.scans = data;
				return data;
			}).error(function(data, status, headers, config) {
				$scope.status = status;
				alert("No fue posible obtener los clientes.");
				return null;
			});
		}
	};

})

.controller('ScansCtrl', function($scope) {
	$scope.scans = $scope.getClients();
	alert($scope.scans);
	// $scope.scans = [
	// // 	{ title: 'Cargamento palta', id: 1 },
	// // 	{ title: 'Cargamento manzana', id: 2 },
	// // 	{ title: 'El floral', id: 3 },
	// // 	{ title: 'Mingus', id: 4 },
	// // 	{ title: 'Cargamento x', id: 5 },
	// // 	{ title: 'Cargamento xxx', id: 6 }
	// ];
})

.controller("ScanCtrl", function($scope, $cordovaBarcodeScanner) {
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
