var ModalInstanceCtrl = function ($scope, $modalInstance, $upload, contentItem, tags, types, scheduled, configService, rfc4122) {

    // rather than assigning directly, push all the values in a new object 
    // to avoid updating the item on the page
    $scope.item = {};
    $scope.scheduled = scheduled;
    $scope.saving = false;
    $scope.key = contentItem.key;
    $scope.item.filter = contentItem.filter;
    $scope.item.type = contentItem.type;
    $scope.item.title = contentItem.title;
    $scope.item.author = contentItem.author;
    $scope.item.url = contentItem.url;
    $scope.item.published = contentItem.published;
    $scope.item.publishDate = contentItem.publish_date;
    $scope.item.dateString = new Date(contentItem.publish_date*1000).toString();
    $scope.item.img = {};
    $scope.item.img.id = '';
    $scope.item.img.src = contentItem.image;
    $scope.item.img.thumbSrc = '';
    $scope.item.img.rawSrc = '';
    $scope.item.img.loading = false;
    $scope.item.img.hasChanged = false;
    $scope.tags = tags;
    $scope.contentTypes = types;
    $scope.item.contentType = {};
    $scope.item.contentTag = {};

    // select the content type
    // for (var i = 0; i < $scope.contentTypes.length; i++) {
    //     if ($scope.contentTypes[i].value == $scope.item.type) {
    //         $scope.item.contentType = $scope.contentTypes[i];
    //     }
    // }

    // select the content tag                
    for (var j = 0; j < $scope.tags.length; j++) {
        if ($scope.tags[j].name == $scope.item.filter) {                        
            $scope.item.contentTag = $scope.tags[j];
        }
    }

    $scope.isSocialContent = function ( contentType ) {

        return contentType == 'instagramTag'
               || contentType == 'twitterTag'
               || contentType == 'tumblrTag'
               || contentType == 'instagramUsers'
               || contentType == 'twitterUsers'
               || contentType == 'instagramLocation';
    };

    $scope.onFileSelect = function ( $files ) {

        $scope.item.img.loading = true;

        for ( var i = 0 ; i < $files.length ; i ++ ) {
            var file = $files[ i ];
            var useCDN = configService.useFileCDN;
            var uuid = rfc4122.newuuid();
            $scope.item.img.id = uuid;
            var mediumSuffix = configService.standardImgSuffix;
            var thumbSuffix = configService.thumbImgSuffix;
            var cdnContainer = configService.CDNContainer;
            var cdnHostname = configService.CDN_CNAME;
            $scope.upload = $upload.upload( {
                url   : 'resources/endpoint/ImageUpload.php',
                method: 'POST',
                data  : {
                    state       : 'custom_image_preview',
                    imageId     : uuid,
                    isCDN       : useCDN,
                    CDNContainer: cdnContainer,
                    medSuffix   : mediumSuffix,
                    thumbSuffix : thumbSuffix,
                    CDNHostname : cdnHostname
                },
                file  : file
            } ).progress( function ( evt ) {
                console.log( 'percent: ' + parseInt( 100.0 * evt.loaded / evt.total ) );
            } ).success( function ( data, status, headers, config ) {

                $scope.item.img.loading = false;

                // if there was an error, display it on the form
                if ( data.errors.length > 0 ) {
                    // add a form error message here
                }
                else {
                    // file is uploaded successfully - update preview image
                    $scope.item.img.hasChanged = true;

                    $scope.item.img.src = data.images.raw;
                }
            } );
            //.then(success, error, progress);
        }
    };

    $scope.onScheduleTimeSet = function(newDate, oldDate) {
        $scope.item.publishDate = newDate;
        $scope.dateString = new Date(newDate*1000).toString();
    };

    $scope.save = function () {

        $scope.saving = true;

        if ( $scope.item.img.hasChanged ) {

            $scope.updateFirebaseWithImage( $scope.item.published );

        } else {

            $scope.updateFirebase( $scope.item.published );
        }
    };

    $scope.showFileUpload = function ( contentType ) {

        if ( $scope.isSocialContent( contentType ) || contentType == 'text' ) {
            return false;
        }
        else if ( contentType !== undefined && ! $scope.item.img.loading ) {
            return true;
        }
        else {
            return false;
        }
    };

    $scope.updateFirebase = function ( published ) {
        var params = [], url;

        // Always save in database with http
        if ( $scope.item.url.indexOf( 'http' ) > - 1 ) {
            url = $scope.item.url;
        } else {
            url = 'http://' + $scope.item.url;
        }

        var state = 'edit';

        params.push({ key: 'key', value: $scope.key });
        params.push( { key: 'type', value: $scope.item.type } );
        params.push( { key: 'filter', value: $scope.item.contentTag.name } );
        params.push( { key: 'author', value: $scope.item.author } );
        params.push( { key: 'title', value: $scope.item.title } );
        params.push( { key: 'url', value: url } );
        params.push( { key: 'published', value: published } );
        

        if ( $scope.item.img.hasChanged ) {

            state = 'edit_new_image';
            params.push( { key: 'image', value: $scope.item.img.src } );
            params.push( { key: 'image_thumb', value: $scope.item.img.thumbSrc } );
            params.push( { key: 'image_raw', value: $scope.item.img.rawSrc } );
        }

        params.push( { key: 'state', value: state } );

        postRequest(
            'resources/endpoint/FirebaseUpdate.php',
            params,
            function ( result ) {
                // turn off the saving status and close the modal
                $scope.saving = false;

                // refresh the scope
                $scope.$apply();

                $modalInstance.close();
            },
            function () {
                // ERROR
                // turn off the saving status and close the modal
                $scope.saving = false;

                // refresh the scope
                $scope.$apply();
            }
        );
    };

    $scope.updateFirebaseWithImage = function ( published ) {

        var params = [];

        var useCDN = configService.useFileCDN;
        var cdnContainer = configService.CDNContainer;
        var cdnHostname = configService.CDN_CNAME;
        var uuid = $scope.item.img.id;
        var mediumSuffix = configService.standardImgSuffix;
        var thumbSuffix = configService.thumbImgSuffix;

        var state = ($scope.isSocialContent( $scope.item.type ) ? 'social_image_publish': 'custom_image_publish');

        params.push( { key: 'state', value: state } );
        params.push( { key: 'imageId', value: uuid } );
        params.push( { key: 'isCDN', value: useCDN } );
        params.push( { key: 'CDNContainer', value: cdnContainer } );
        params.push( { key: 'CDNHostname', value: cdnHostname } );
        params.push( { key: 'medSuffix', value: mediumSuffix } );
        params.push( { key: 'thumbSuffix', value: thumbSuffix } );
        params.push( { key: 'imgUrl', value: $scope.item.img.src } );

        postRequest(
            'resources/endpoint/ImageUpload.php',
            params,
            function ( result ) {

                var resultJSON = JSON.parse( result );

                // if there was an error, display it on the form
                if ( resultJSON.errors.length > 0 ) {

                    // add a form error message here

                    //$scope.form[ $scope.content.type.value ].isValid = false;
                    //$scope.form[ $scope.content.type.value ].uploadStatus = 'There was an error with the upload.';
                    //$scope.form[ $scope.content.type.value ].publishing = false;

                    // file upload failed, remove preview image
                    //$scope.form[ $scope.content.type.value ].content.img.src = $scope.content.img.src = '';
                    //$scope.form[ $scope.content.type.value ].content.img.thumbSrc = $scope.content.img.thumbSrc = '';
                    //$scope.form[ $scope.content.type.value ].content.img.rawSrc = $scope.content.img.rawSrc = '';

                    // refresh the scope
                    $scope.$apply();
                }
                else {
                    // file is uploaded successfully
                    $scope.item.img.src = resultJSON.images.medium;
                    $scope.item.img.thumbSrc = resultJSON.images.thumb;
                    $scope.item.img.rawSrc = resultJSON.images.raw;

                    // refresh the scope
                    $scope.$apply();

                    $scope.updateFirebase( published );
                }
            },
            function () {

                // refresh the scope
                $scope.$apply();
            }
        );
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.testLink = function(contentType) {

        window.open($scope.item.url);
    };
};