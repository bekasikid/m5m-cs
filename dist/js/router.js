'use strict';
//var apiUrl = "http://localhost/storesell-php/index.php/api/";
//var apiUrl = "http://localhost:3000/";
var apiUrl = "http://kfc-prod.ap-southeast-1.elasticbeanstalk.com/";
var myApp = angular.module('eatOrTreatApp', ['ui.router', 'HomeModule', 'ui.bootstrap','chieffancypants.loadingBar','permission',"datePicker"]);
myApp.filter('propsFilter', function () {
        return function (items, props) {
            var out = [];

            if (angular.isArray(items)) {
                items.forEach(function (item) {
                    var itemMatches = false;

                    var keys = Object.keys(props);
                    for (var i = 0; i < keys.length; i++) {
                        var prop = keys[i];
                        var text = props[prop].toLowerCase();
                        if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                            itemMatches = true;
                            break;
                        }
                    }

                    if (itemMatches) {
                        out.push(item);
                    }
                });
            } else {
                // Let the output be the input untouched
                out = items;
            }

            return out;
        }
    })
    .factory('$localstorage', ['$window', function ($window) {
        return {
            set: function (key, value) {
                $window.localStorage[key] = value;
            },
            get: function (key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function (key) {
                return JSON.parse($window.localStorage[key] || '{}');
            },
            remove: function (key) {
                $window.localStorage.removeItem(key);
            }
        }
    }])
;

myApp.config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('login', {
                url: '/login',
                data: {
                    permissions: {
                        only: ['anonymous'],
                        redirectTo: 'home.main'
                    }
                },
                views: {
                    'content': {
                        templateUrl: './login.html'
                    }
                }
            })
            .state('home', {
                url: '/home',
                abstract: true,
                views: {
                    'content': {
                        templateUrl: './index-content.html'
                    }
                }
            })
            .state('home.main', {
                url: '/main',
                data: {
                    permissions: {
                        only: ['admin','marketing','finance'],
                        redirectTo: 'login'
                    }
                },
                views: {
                    'mainContent': {
                        templateUrl: './pages/content.html'
                    }
                }
            })
            .state('home.daftar', {
                url: '/daftar',
                data: {
                    permissions: {
                        only: ['admin','marketing','finance'],
                        redirectTo: 'login'
                    }
                },
                views: {
                    'mainContent': {
                        templateUrl: './pages/daftar.html'
                    }
                }
            })
            .state('home.doku', {
                url: '/doku',
                data: {
                    permissions: {
                        only: ['admin'],
                        redirectTo: 'login'
                    }
                },
                views: {
                    'mainContent': {
                        templateUrl: './pages/doku.html'
                    }
                }
            })
            .state('home.register', {
                url: '/register/:id',
                data: {
                    permissions: {
                        only: ['admin','marketing','finance'],
                        redirectTo: 'login'
                    }
                },
                views: {
                    'mainContent': {
                        templateUrl: './pages/register.html'
                    }
                }
            })
            .state('home.peserta', {
                url: '/peserta',
                data: {
                    permissions: {
                        only: ['admin','marketing','finance'],
                        redirectTo: 'login'
                    }
                },
                views: {
                    'mainContent': {
                        templateUrl: './pages/peserta.html'
                    }
                }
            })
            .state('home.mandiri', {
                url: '/mandiri',
                data: {
                    permissions: {
                        only: ['admin','finance'],
                        redirectTo: 'login'
                    }
                },
                views: {
                    'mainContent': {
                        templateUrl: './pages/mandiri.html'
                    }
                }
            })
            ;
        $urlRouterProvider.otherwise( function($injector) {
            var $state = $injector.get("$state");
            $state.go('home.main');
        });


    })
    .directive("select", function() {
        return {
            restrict: "E",
            require: "?ngModel",
            scope: false,
            link: function (scope, element, attrs, ngModel) {
                if (!ngModel) {
                    return;
                }
                element.bind("keyup", function() {
                    element.triggerHandler("change");
                })
            }
        }
    })
    .run(function ($rootScope, $urlRouter,Permission,$localstorage) {
        $rootScope.$on('$viewContentLoaded', function (event) {
        });
        Permission.defineRole('anonymous', function (stateParams) {
            var user = $localstorage.getObject("user-admin");
            if(empty(user)){
                return true;
            }else if(user.role=='anonymous'){
                return true;
            }
            return false;
        }).defineRole('admin', function (stateParams) {
            var user = $localstorage.getObject("user-admin");
            if(user.role=='admin'){
                return true;
            }
            return false;
        }).defineRole('marketing', function (stateParams) {
            var user = $localstorage.getObject("user-admin");
            if(user.role=='marketing'){
                return true;
            }
            return false;
        }).defineRole('finance', function (stateParams) {
            var user = $localstorage.getObject("user-admin");
            if(user.role=='finance'){
                return true;
            }
            return false;
        }).defineRole('runner', function (stateParams) {
            var user = $localstorage.getObject("user-admin");
            if(user.role=='runner'){
                return true;
            }
            return false;
        });
    });