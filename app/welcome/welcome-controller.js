/*
 *   Welcome Controller - Angular controller for the Welcome page
 */
var WelcomeController = function ( $scope, $firebase, $filter ) {

	// initialize the audio.js player
	// audiojs.events.ready(function() {
 //        var audioPlayer = document.getElementsByTagName('audio');
	// 	var ajs = audiojs.create(audioPlayer, {
	// 		createPlayer: {
	// 			markup: '\
	// 			<div class="player-wrapper"> \
	// 				<div class="play-pause"> \
	// 					<p class="play"></p> \
	// 					<p class="pause"></p> \
	// 					<p class="loading"></p> \
	// 					<p class="error"></p> \
	// 				</div> \
	// 				<div class="scrubber"> \
	//                 	<div class="progress"></div> \
	//                 	<div class="loaded"></div> \
	//               	</div> \
	// 				<div class="track-name"> \
	// 					My Morning Jacket - "One Big Holiday" \
	// 				</div> \
	// 				<div class="time"> \
	// 				<em class="played">00:00</em>/<strong class="duration">00:00</strong> \
	// 				</div> \
	// 				<div class="error-message"></div> \
	// 			</div>',
	// 			playPauseClass: 'play-pause',
	// 			timeClass: 'time',
	// 			durationClass: 'duration',
	// 			playedClass: 'played',
	// 			errorMessageClass: 'error-message',
	// 			playingClass: 'playing',
	// 			loadingClass: 'loading',
	// 			errorClass: 'error'
	// 		}
	// 	});
	// });
};