var file_dependency = [
    // Angular
    'http://my.kapook.com/angular/1.3.15/angular.min.js',
    'http://my.kapook.com/angular/1.3.15/angular-aria.min.js',
    'http://my.kapook.com/angular/1.3.15/angular-sanitize.min.js',
    'http://my.kapook.com/angular/1.3.15/angular-resource.min.js',
    
    // CSS
    'http://my.kapook.com/fonts/display/fontface.css',
    'http://my.kapook.com/css/relate_th.css'
];

var file_dependency_extend = [
    // Controller
    'http://my.kapook.com/angular/app/content_relate/js/app.js'
];

head.load(file_dependency, function () {
    head.load(file_dependency_extend, function () {
        angular.element(document).ready(function() {
            angular.bootstrap(document, ['contentRelateApp']);
        });
    });
});