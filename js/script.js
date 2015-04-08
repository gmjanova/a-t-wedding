var weddingApp = angular.module( 'wedding-app', [ 'firebase', 'ui.bootstrap', 'ui.router', 'ngModal' ] );

weddingApp
	.controller("BackgroundController", ["$scope", "$window", 
		function($scope, $window) {

			var imgAspectRatio = 1024 / 1024;  /* default ratio for desktop background (width / height) */

			var resizeBackground = function() {

		        var winWidth = Math.min(document.documentElement.clientWidth, $window.innerWidth || 0);
		        var winHeight = Math.min(document.documentElement.clientHeight, $window.innerHeight || 0);

		        var winAspectRatio = winWidth / winHeight;

		        var bgWrapper = angular.element(document.querySelector('#bg-wrapper'));
		         
		        bgWrapper.css({
		            "width": winWidth + "px",
		            "height": winHeight + "px"
		        });

	            // if window is wider than the image
	            if (winAspectRatio > imgAspectRatio) {
	                var newHeight = (1 / imgAspectRatio) * winWidth;

	                bgWrapper.find('img').css({
	                	"width" : winWidth + "px",
	                	"height" : newHeight + "px",
	                	"left" : 0
	                });
	            }
	            // window is skinnier or same width as image
	            else if (winAspectRatio <= imgAspectRatio) {
	                var newWidth = winHeight * imgAspectRatio;

	                bgWrapper.find('img').css({
	                	"width" : newWidth + "px",
	                	"height" : winHeight + "px",
	                	"left" : ((newWidth - winWidth) / 2) * -1
	                });
	            }
			}

			// resize the background on init
			resizeBackground();

			// resize the background image when the window size changes
			angular.element($window).bind('resize', function() {
				resizeBackground();
			});
		}
	])
	.controller("NavigationController", ["$scope",
		function($scope) {
			$scope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
				
				// remove 'selected' class from all nav items
				angular.element(document.querySelector('nav .nav-item.selected')).removeClass('selected');

			}); 
			$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){

				// add 'selected' class for new state nav item
				angular.element(document.querySelector('nav .nav-item.'+toState.name)).addClass('selected');
			}); 
		}
	])
	.controller("AudioController", ["$scope", 
		function($scope) {

			// initialize the audio.js player
			audiojs.events.ready(function() {
		        var audioPlayer = document.getElementsByTagName('audio');
				var ajs = audiojs.create(audioPlayer, {
					createPlayer: {
						markup: '\
						<div class="player-wrapper"> \
							<div class="play-pause"> \
								<p class="play"></p> \
								<p class="pause"></p> \
								<p class="loading"></p> \
								<p class="error"></p> \
							</div> \
							<div class="scrubber"> \
			                	<div class="progress"></div> \
			                	<div class="loaded"></div> \
			              	</div> \
							<div class="track-name"> \
								My Morning Jacket - "One Big Holiday" \
							</div> \
							<div class="time"> \
							<em class="played">00:00</em>/<strong class="duration">00:00</strong> \
							</div> \
							<div class="error-message"></div> \
						</div>',
						playPauseClass: 'play-pause',
						timeClass: 'time',
						durationClass: 'duration',
						playedClass: 'played',
						errorMessageClass: 'error-message',
						playingClass: 'playing',
						loadingClass: 'loading',
						errorClass: 'error'
					}
				});
			});
		}
	])
	.config( function ( $stateProvider, $urlRouterProvider ) {

		$urlRouterProvider.otherwise( '/welcome' );

		$stateProvider
			.state( 'welcome', {
				url        : '/welcome',
				templateUrl: 'app/welcome/welcome.html',
				controller : WelcomeController /* defined in /app/welcome/welcome-controller.js */
			} )
			.state( 'event', {
				url        : '/event',
				templateUrl: 'app/event/event.html',
				controller : EventController /* defined in /app/event/event-controller.js */
			} )
			.state( 'accommodations', {
				url        : '/accommodations',
				templateUrl: 'app/accommodations/accommodations.html',
				controller : AccommodationsController /* defined in /app/accommodations/accommodations-controller.js */
			} )
			.state( 'registry', {
				url        : '/registry',
				templateUrl: 'app/registry/registry.html',
				controller : RegistryController /* defined in /app/registry/registry-controller.js */
			} )
			.state( 'guestbook', {
				url        : '/guestbook',
				templateUrl: 'app/guestbook/guestbook.html',
				controller : GuestbookController /* defined in /app/guestbook/guestbook-controller.js */
			} );

	} )
	.filter( 'iif', function () {
		return function ( input, trueValue, falseValue ) {
			return input ? trueValue: falseValue;
		};
	} )
	.directive( 'ngEnter', function () {
		return function ( scope, element, attrs ) {
			element.bind( "keydown keypress", function ( event ) {
				if ( event.which === 13 ) {
					scope.$apply( function () {
						scope.$eval( attrs.ngEnter );
					} );

					event.preventDefault();
				}
			} );
		};
	} );