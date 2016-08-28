angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http, $localStorage, $location, $window) {
// With the new view caching in Ionic, Controllers are only called
// when they are recreated or on app start, instead of every page change.
// To listen for when this page is active (for example, to refresh data),
// listen for the $ionicView.enter event:
//$scope.$on('$ionicView.enter', function(e) {
//});

	// Construyo el elemento que mantendra el storage local.
	$scope.storage = $localStorage;
  
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
			$scope.storage.status = status;
			$scope.storage.token = data.token;
			$scope.closeLogin();
			$window.location.reload(true);
		}).error(function(data, status, headers, config) {
			console.log("No fue posible autenticarte.");
		});
	};

	// Obtiene los clientes contra el endpoint de rizoma.
	// $scope.getClients = function(){
	// 	console.log("getClients -> " + $scope.storage.token);
	// 	$http({
	// 		url: "http://app.rizoma.io/api/v1/clients.json?auth_token="+$scope.storage.token,
	// 		method: "GET"
	// 	}).success(function(data, status){
	// 		return data;
	// 	}).error(function(data, status, headers, config){
	// 		console.log("No fue posible obtener los clientes.");
	// 		return null;
	// 	});
	// };

	// Verificar Session.
	$scope.checkSession = function(){
		if($scope.storage.hasOwnProperty("token") && $scope.storage.status == 200){
			console.log("Tu token es: " + $scope.storage.token);
		}else{
			alert("No se encontro la session, es necesario que te identifiques.");
			// $scope.login();
			// $location.path( "/login" );
		}
	};

	// Eliminar Session.
	$scope.deleteSession = function(){
		$scope.storage.$reset();
		$scope.login();
	};

})

.controller("NewScanCtrl", function($scope, $ionicModal, $cordovaBarcodeScanner, $http, $localStorage, $location){
	// Chequeo la session.
	$scope.checkSession();
	// Ejecuto la magia.
	// Array que mantiene los codigos.
	$scope.codes = []
	// Funcion responsable de lanzar el escaner.
	$scope.scanBarcode = function(){
		$cordovaBarcodeScanner.scan().then(function(imageData){
			// Verifico si el codigo es valido.
			$http({
				url: "http://app.rizoma.io/api/v1/item_group/"+imageData.text+".json?auth_token="+$scope.storage.token,
				method: "GET"
			}).success(function(data, status){
				// Al ser valido lo agrego como positivo.
				$scope.codes.push(imageData.text);
			}).error(function(data, status, headers, config){
				console.log("No fue posible validar el codigo capturado.");
			});
		}, function(error) {
			// console.log("An error happened -> " + error);
		});
	};

	// Funcion responsable de enviar los codigos al servidor.
	$scope.sendCodes = function(){
		console.log("pase por aqui -> "+$scope.storage.token);
		var data = {
			"auth_token":$scope.storage.token,
			"transaction_client": "57b9f21a861ca36309000003",
			"transaction_items_groups": ['57b9f3ef861ca36309000019','57bf3e4f861ca36195000006','57bf3e5f861ca36195000009']
		}
		$http({
			url: "http://app.rizoma.io/api/v1/transactions.json",
			method: "POST",
			data: data
		}).success(function(data, status, headers, config) {
			console.log("Se envio de forma exitosa la carga.");
			$location.path( "/" );
		}).error(function(data, status, headers, config) {
			console.log("No se puedo enviar la carga..");
		});
	}
})

.controller("ScanCtrl", function($scope, $ionicModal, $cordovaBarcodeScanner, $http, $localStorage, $location, $stateParams){
	// Chequeo la session.
	$scope.checkSession();
	// Ejecuto la magia.
	// Obtengo parametro del cliente.
	$scope.client = $stateParams.clientId;
	// Array que mantiene los codigos.
	$scope.codes = Array();
	// Funcion responsable de lanzar el escaner.
	$scope.scanBarcode = function(){
		$cordovaBarcodeScanner.scan().then(function(imageData){
			// Verifico si el codigo es valido.
			$http({
				url: "http://app.rizoma.io/api/v1/item_group/"+imageData.text+".json?auth_token="+$scope.storage.token,
				method: "GET"
			}).success(function(data, status){
				// Al ser valido lo agrego como positivo.
				$scope.codes.push(imageData.text);
			}).error(function(data, status, headers, config){
				alert("No fue posible validar el codigo capturado.");
			});
		}, function(error) {
			// console.log("An error happened -> " + error);
		});
	};
	// Funcion responsable de enviar los codigos al servidor.
	$scope.sendCodes = function(){
		console.log("Envio como token: -> "+$scope.storage.token);
		console.log("client uid: -> "+$scope.client);
		console.log("codes: -> "+$scope.codes);
		var data = {
			"auth_token": $scope.storage.token,
			"transaction_client": $scope.client,
			"transaction_items_groups": $scope.codes
		}
		$http({
			url: "http://app.rizoma.io/api/v1/transactions.json",
			method: "POST",
			data: data
		}).success(function(data, status, headers, config) {
			alert("Se envio de forma exitosa la carga.");
			$location.path( "/" );
		}).error(function(data, status, headers, config) {
			alert("No se puedo enviar la carga.");
		});
	}
})

.controller('ClientsCtrl', function($scope, $ionicModal, $stateParams, $http, $localStorage, $window) {
	// Chequeo la session.
	$scope.checkSession();
	// Ejecuto la magia.
	if($scope.storage.token){
		console.log("getClients -> " + $scope.storage.token);
		$http({
			url: "http://app.rizoma.io/api/v1/clients.json?auth_token="+$scope.storage.token,
			method: "GET"
		}).success(function(data, status){
			$scope.clients = Array();
			for(i = 0; i < data.length; i++){
				$scope.clients.push({ id: data[i].id, name: data[i].name });
			}
		}).error(function(data, status, headers, config){
			console.log("No fue posible obtener los clientes.");
		});
	}
	// $window.location.reload(true);
	// $location.path( "/" );
});

// .controller('ScanCtrl', function($scope, $stateParams) {
// });
