var ModalPreviewInstanceCtrl = function ($scope, $sce, $modalInstance, videoLink) {

    $scope.videoUrl = $sce.trustAsResourceUrl(videoLink);
};