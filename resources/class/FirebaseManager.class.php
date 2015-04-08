<?php

require_once('../vendor/firebaseLib.php');

class FirebaseManager {

	private $_fb;

	function __construct($url, $token) {

		$this->_initFirebase($url, $token);
	}

	private function _initFirebase($url, $token) {

		$this->_fb = new fireBase($url, $token);

		return $this;
	}

	public function addComment($username, $message) {

		$date = time();

		$newContent = array(
			'username' => $username,
			'message' => $message,
			'post_date' => $date
		);

		$response = $this->_fb->push('/guestbook', $newContent);

		return $response;
	}
}