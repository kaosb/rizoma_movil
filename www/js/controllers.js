angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http, $localStorage, $location, $window) {

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

.controller("ScanCtrl", function($scope, $ionicModal, $cordovaBarcodeScanner, $http, $localStorage, $location, $stateParams){
	// Chequeo la session.
	$scope.checkSession();
	// Ejecuto la magia.
	// Obtengo parametro del cliente.
	$scope.client = $stateParams.clientId;
	// Array que mantiene los codigos.
	$scope.codes = Array();
	$scope.palets = Array();

	// funcion prueba
	$scope.pruebaCodes = function(){
		codigo = ['57e36a8b861ca32ac8000005', '57e36aa0861ca32ac8000008', '57e36a76861ca32ac8000002'];
		for(i = 0; i < codigo.length; i++){
			$http({
				url: "http://app.rizoma.io/api/v1/item_group/"+codigo[i]+".json?auth_token="+$scope.storage.token,
				method: "GET"
			}).success(function(data, status){
				// Al ser valido lo agrego como positivo.
				$scope.codes.push(data);
			}).error(function(data, status, headers, config){
				alert("No fue posible validar el codigo capturado.");
			});
		}
	}

	// Funcion responsable de lanzar el escaner.
	$scope.scanBarcode = function(){
		$cordovaBarcodeScanner.scan().then(function(imageData){
			// Verifico si el codigo es valido.
			$http({
				url: "http://app.rizoma.io/api/v1/item_group/"+imageData.text+".json?auth_token="+$scope.storage.token,
				method: "GET"
			}).success(function(data, status){
				// Al ser valido lo agrego como positivo.
				// $scope.codes.push(imageData.text);
				$scope.codes.push(data);
			}).error(function(data, status, headers, config){
				alert("No fue posible validar el codigo capturado.");
			});
		}, function(error) {
			console.log("An error happened -> " + error);
		});
	};

	// Funcion responsable de enviar los codigos al servidor.
	$scope.sendCodes = function(){

			var stockFields = document.querySelectorAll("input[name^='stock']");
			console.log(stockFields);
			var obj1 = {};
			for(i = 0; i < stockFields.length; i++){
				var paletid = stockFields[i].getAttribute("paletid");
				var itemid = stockFields[i].getAttribute("itemid");
				var stock = stockFields[i].value;
				var obj2 = {};
				obj2[itemid] = stock;
				if(obj1[paletid] instanceof Array){
					obj1[paletid].push(obj2);
				}else{
					obj1[paletid] = Array();
					obj1[paletid].push(obj2);
				}
			}
			console.log(obj1);
			$scope.palets = obj1;

		// Construyo el objeto a enviar.
		var data = {
			"auth_token": $scope.storage.token,
			"transaction_client": $scope.client,
			"transaction_items_groups": $scope.palets
		}
		// Realizo la llamada.
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

	//Funcion responsable de desplegar el detalle de un palet a partir del codigo.
	$scope.showDetail = function(data){
		// console.log("showDetail");
		if($scope.isDetailShown(data)){
			$scope.shownDetail = null;
		}else{
			$scope.shownDetail = data;
		}
	}

	// Funcion responsable de determinar si el bloque detalle fue o no activado.
	$scope.isDetailShown = function(data){
		var response = $scope.shownDetail === data;
		// console.log(response);
		return response;
	}

})

.controller("NewFromOther", function($scope, $ionicModal, $cordovaBarcodeScanner, $http, $localStorage, $location, $stateParams){
	// Chequeo la session.
	$scope.checkSession();
	// Ejecuto la magia.
	// Obtengo parametro del cliente.
	$scope.client = $stateParams.clientId;
	// Array que mantiene los codigos.
	$scope.codes = Array();
	$scope.palets = Array();

	// funcion prueba
	$scope.pruebaCodes = function(){
		// '57e36aa0861ca32ac8000008', '57e36a76861ca32ac8000002', '57e36a8b861ca32ac8000005',
		codigo = ['582e65a5861ca30edc000730'];
		for(i = 0; i < codigo.length; i++){
			$http({
				url: "http://app.rizoma.io/api/v1/item_group/"+codigo[i]+".json?auth_token="+$scope.storage.token,
				method: "GET"
			}).success(function(data, status){
				// Al ser valido lo agrego como positivo.
				$scope.codes.push(data);
			}).error(function(data, status, headers, config){
				alert("No fue posible validar el codigo capturado.");
			});
		}
	}

	// Funcion responsable de lanzar el escaner.
	$scope.scanBarcode = function(){
		$cordovaBarcodeScanner.scan().then(function(imageData){
			// Verifico si el codigo es valido.
			$http({
				url: "http://app.rizoma.io/api/v1/item_group/"+imageData.text+".json?auth_token="+$scope.storage.token,
				method: "GET"
			}).success(function(data, status){
				// Al ser valido lo agrego como positivo.
				// $scope.codes.push(imageData.text);
				$scope.codes.push(data);
			}).error(function(data, status, headers, config){
				alert("No fue posible validar el codigo capturado.");
			});
		}, function(error) {
			console.log("An error happened -> " + error);
		});
	};

	// Funcion responsable de enviar los codigos al servidor.
	$scope.sendCodes = function(){

			var stockFields = document.querySelectorAll("input[name^='stock']");
			console.log(stockFields);
			var obj1 = {};
			for(i = 0; i < stockFields.length; i++){
				var paletid = stockFields[i].getAttribute("paletid");
				var itemid = stockFields[i].getAttribute("itemid");
				var stock = stockFields[i].value;
				var obj2 = {};
				obj2[itemid] = stock;
				if(obj1[paletid] instanceof Array){
					obj1[paletid].push(obj2);
				}else{
					obj1[paletid] = Array();
					obj1[paletid].push(obj2);
				}
			}
			console.log(obj1);
			 $scope.palets = obj1;

		// Construyo el objeto a enviar.
		var data = {
			"auth_token": $scope.storage.token,
			"transaction_client": $scope.client,
			"transaction_items_groups": $scope.palets
		}
		// Realizo la llamada.
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

	//Funcion responsable de desplegar el detalle de un palet a partir del codigo.
	$scope.showDetail = function(data){
		if($scope.isDetailShown(data)){
			$scope.shownDetail = null;
		}else{
			$scope.shownDetail = data;
		}
	}

	// Funcion responsable de determinar si el bloque detalle fue o no activado.
	$scope.isDetailShown = function(data){
		var response = $scope.shownDetail === data;
		return response;
	}

	// Funcion pija
	$scope.itemvalue = {};
	$scope.createPanelFromOther = function(codes){
		result = [];
		for(var index in $scope.itemvalue){
			result.push({id: index, quantity: $scope.itemvalue[index].quantity});
		}
		// Construyo el objeto a enviar.
		var data = {
			"auth_token": $scope.storage.token,
			"items": result
		}
		// Realizo la llamada.
		$http({
			url: "http://app.rizoma.io/api/v1/item_group/"+codes[0]._id.$oid+"/create_item_group_from_other.json",
			method: "POST",
			data: data
		}).success(function(data, status, headers, config) {
			alert("El nuevo pallet se creo de forma exitosa.");
			$location.path( "/" );
		}).error(function(data, status, headers, config) {
			alert("No fue posible crear el pallet.");
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
});
