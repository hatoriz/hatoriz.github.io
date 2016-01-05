// Vars
var domain = document.domain.split('.')[0];
var prefix_url = 'http://cms.kapook.com/content_relate/get_json_obj';

// App
var app = angular.module('contentRelateApp', [
    'ngResource',
    'ngSanitize'
]);

app.config(['$sceDelegateProvider',
    function ($sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            'http://my.kapook.com/angular/app/content_relate/template/**',
        ]);
    }
]);

/* -- All -- */
function jsonp_callback(data) {
    var el = document.getElementById('relateBox');
    var scope_relate = angular.element(el).scope();

    scope_relate.$apply(function () {
        el.style.display = 'block';
        scope_relate.clip = data.video;
        scope_relate.article = data.article;
        scope_relate.photo = data.photo;
    });
}

app.controller('relateCtrl', ['$http', '$scope',
    function ($http, $scope) {
        $scope.clip = [];
        $scope.keypages = 'relates_' + domain;
        var url_cur = 'http://' + window.location.host + window.location.pathname;
//        var url_cur = 'http://' + window.location.host + decodeURIComponent(window.location.pathname);
//        url_cur = encodeURIComponent(url_cur);

        if (domain == 'cooking') {
            var objType = 'cooking_video';
        }
        var url = 'http://cms.kapook.com/obj_relate/get_json_portal?url=' + url_cur + '&objType=' + objType + '&callback=jsonp_callback';
        console.log(url);
        console.log(window.location.pathname);

        $http.jsonp(url);
    }
]);

app.directive('fallbackSrc', function () {
    var fallbackSrc = {
        link: function postLink(scope, iElement, iAttrs) {
            iElement.bind('error', function () {
                angular.element(this).attr("src", iAttrs.fallbackSrc);
            });
        }
    };

    return fallbackSrc;
});

app.directive('relateBox', function () {
    return {
        restrict: 'AE',
        templateUrl: function () {
            return 'http://my.kapook.com/angular/app/content_relate/template/relate.html';
        }
    };
});

/* -- Clip -- */
function clip_callback(data) {
    var el_clip = document.getElementById('clipBox');
    var scope_clip = angular.element(el_clip).scope();

    scope_clip.$apply(function () {
        el_clip.style.display = 'block';
        scope_clip.clip = data;
    });
}

app.controller('clipCtrl', ['$http', '$scope',
    function ($http, $scope) {
        $scope.clip = [];
        var url = 'http://cms.kapook.com/content_relate/get_json_movieObj?callback=clip_callback&url=http://movie.kapook.com/Inside%20Out&last_id=undefined';

        $http.jsonp(url);
    }
]);

app.directive('clipBox', function () {
    return {
        restrict: 'AE',
        templateUrl: function () {
            return 'http://my.kapook.com/angular/app/content_relate/template/clip.html';
        }
    };
});

/* -- Article -- */
function article_callback(data) {
    var el_article = document.getElementById('articleBox');
    var scope_article = angular.element(el_article).scope();

    console.log(data);

    scope_article.$apply(function () {
        el_article.style.display = 'block';
        scope_article.article = data.article;
    });
}

app.controller('articleCtrl', ['$http', '$scope',
    function ($http, $scope) {
        $scope.article = [];
        var url = 'http://cms.kapook.com/content_relate/get_json_portal/' + portal + '/' + id + '/5?callback=article_callback';

        $http.jsonp(url);
    }
]);

app.directive('articleBox', function () {
    return {
        restrict: 'AE',
        templateUrl: function () {
            return 'http://my.kapook.com/angular/app/content_relate/template/article.html';
        }
    };
});

/* -- Photo -- */
function photo_callback(data) {
    var el_photo = document.getElementById('photoBox');
    var scope_photo = angular.element(el_photo).scope();

    scope_photo.$apply(function () {
        el_photo.style.display = 'block';
        scope_photo.photo = data.photo;
    });
}

app.controller('photoCtrl', ['$http', '$scope',
    function ($http, $scope) {
        $scope.photo = [];
        var url = 'http://cms.kapook.com/content_relate/get_json_portal/' + portal + '/' + id + '/5?callback=photo_callback';

        $http.jsonp(url);
    }
]);

app.directive('photoBox', function () {
    return {
        restrict: 'AE',
        templateUrl: function () {
            return 'http://my.kapook.com/angular/app/content_relate/template/photo.html';
        }
    };
});

app.filter('replaceCacheImg', function ($filter, $rootScope) {
    return function (img) {
        var new_img = '';
        new_img = img.replace("http://s.img.kapook.com/photo", "http://cache.s.img.kapook.com/o/photo");
        if (img.match(/thumb/g)) {
            new_img = new_img.replace("thumb_kapook_world", "thumbhome_kapook_world");
        } else {
            new_img = new_img.replace("kapook_world", "thumbhome_kapook_world");
        }

        return new_img;
    };
});

app.filter('replaceEncodeContent', function ($filter, $rootScope, $sce) {
    return function (content) {
        return $sce.trustAsHtml(content);
    };
});