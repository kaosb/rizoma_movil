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
			$scope.closeLogin();
		}).error(function(data, status, headers, config) {
			console.log("No fue posible autenticarte.");
		});
	};

	// Obtiene los clientes contra el endpoint de rizoma.
	$scope.getClients = function(){
		$http({
			url: "http://app.rizoma.io/api/v1/clients.json?auth_token=qELVaZPPdpXr-N84hLRq",
			method: "GET"
		}).success(function(data, status){
			$scope.session.clients = data;
			return true;
		}).error(function(data, status, headers, config){
			console.log("No fue posible obtener los clientes.");
			return false;
		});
	};

	// Verificar Session.
	$scope.checkSession = function(){
		if($scope.session.hasOwnProperty("token") && $scope.session.status == 200){
			console.log("Tu token es: "+$scope.session.token);
			return true;
		}else{
			console.log("La session no existe, es necesario autenticar.");
			// $scope.login();
			// $location.path( "/login" );
			return false;
		}
	}

	// Eliminar Session.
	$scope.deleteSession = function(){
		$scope.session.$reset();
		$scope.login();
	}

})

.controller("ScanCtrl", function($scope, $ionicModal, $cordovaBarcodeScanner){
	// Chequeo la session.
	$scope.checkSession();
	// Ejecuto la magia.
	$scope.codes = []
	$scope.scanBarcode = function() {
		$cordovaBarcodeScanner.scan().then(function(imageData){
			$scope.codes.push(imageData.text);
			// alert(imageData.text);
			// console.log("Barcode Format -> " + imageData.format);
			// console.log("Cancelled -> " + imageData.cancelled);
		}, function(error) {
			// console.log("An error happened -> " + error);
		});
	};
})

.controller('ClientsCtrl', function($scope, $ionicModal, $stateParams) {
	// Chequeo la session.
	$scope.checkSession();
	// Ejecuto la magia.
	if($scope.session && $scope.session.clients){
		$scope.getClients();
		$scope.clients = Array();
		for(i = 0; i < $scope.session.clients.length; i++){
			$scope.clients.push({ id: $scope.session.clients[i].id, name: $scope.session.clients[i].name });
		}
	}
});

// .controller('ScanCtrl', function($scope, $stateParams) {
// });
