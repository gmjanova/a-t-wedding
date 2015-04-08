/*
*   Guestbook Controller - Angular controller for the Guest Book page
*/
var GuestbookController = function($scope, $firebase, $http) {

	$scope.contentModal = {
		show: false
	};

	$scope.form = {
		username: {
			error: false,
			text: ""
		},
		message: {
			error: false,
			text: ""
		},
		saving: false
	};

	// init the firebase connections
	var fbaseItems = new Firebase( 'https://aubrey-tyler-wedding.firebaseio.com/guestbook' );
	$scope.fbContent = $firebase( fbaseItems );

	$scope.addComment = function() {

		// reset the error flags
		$scope.form.username.error = false;
		$scope.form.message.error = false;

		if (!$scope.form.saving) {

			$scope.form.saving = true;

			// validate user and message inputs
			$scope.form.username.error = ($scope.form.username.text == "");
			$scope.form.message.error = ($scope.form.message.text == "");

			if (!$scope.form.username.error 
				&& !$scope.form.message.error) {

				var data = {
					'method' : 'add_comment',
					'user' : $scope.form.username.text,
					'message' : $scope.form.message.text
				};

				$http.post('resources/endpoint/FirebaseUpdate.php', data)
		        .success(function(data, status, headers, config)
		        {
		            $scope.form.saving = false;
		            $scope.contentModal.show = false;

		            // clear out the form
		            $scope.form.username.text = "";
		            $scope.form.message.text = "";
		        })
		        .error(function(data, status, headers, config)
		        {
		            console.log('error');
		            $scope.form.saving = false;
		            $scope.contentModal.show = false;
		        });
			} else {
				$scope.form.saving = false;
			}
		}
	}

    $scope.showMessageForm = function() {

		$scope.contentModal.show = true;
    }
};	