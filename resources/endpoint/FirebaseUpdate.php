<?php
	
require_once('../class/FirebaseManager.class.php');

$firebase = new FirebaseManager('https://aubrey-tyler-dev.firebaseio.com/', 'QWkF6I4NjNwg6nMDAAmDjD2LqsdLt6hQ0nDBQfrR');

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

if ($request->method == 'add_comment') {

	$firebase->addComment($request->user, $request->message);

}