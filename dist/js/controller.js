var keyEnc = "L6TGw!_&LLFP_^DBUqr*";

angular.module('HomeModule', [])
    .controller('mainCtrl', function ($scope, $rootScope, $http, $state, $localstorage, Permission, $q) {

        $rootScope.kirimPost = function (url, body) {
            var defer;
            defer = $q.defer();
            var tgl = moment().format("ddd, D MMM YYYY HH:mm:ss") + " GMT";
            var config = {
                headers: {
                    'Content-Type': 'application/json',
                    "Date": tgl,
                    'Authorization': "EOT " + $rootScope.user.name + ":" + CryptoJS.HmacSHA1($rootScope.user.name + "\n" + keyEnc + "\n" + "POST" + "\n" + JSON.stringify(body), $rootScope.user.password)
                }
            }
            $http.post(url, body, config).success(function (res) {
                defer.resolve(res);
            });
            return defer.promise;
        };

        $rootScope.kirimGet = function (url) {
            var defer;
            defer = $q.defer();
            var tgl = moment().format("ddd, D MMM YYYY HH:mm:ss") + " GMT";
            var config = {
                headers: {
                    'Content-Type': 'application/json',
                    "Date": tgl,
                    'Authorization': "EOT " + $rootScope.user.name + ":" + CryptoJS.HmacSHA1($rootScope.user.name + "\n" + keyEnc + "\n" + "GET", $rootScope.user.password)
                }
            }
            $http.get(url, config).success(function (res) {
                defer.resolve(res);
            });
            return defer.promise;
        };


        $rootScope.user = $localstorage.getObject("user-admin");
        console.log($rootScope.user);
        if (empty($rootScope.user)) {
            $rootScope.user = {
                role: "anonymous",
                name: "anonymous",
                id: 0,
                password: "",
                store: {}
            };

            $localstorage.setObject("user-admin", $rootScope.user);
        } else {

        }
    })
    .controller('dashboardCtrl', function ($scope, $http, $state, $localstorage, Permission, $rootScope) {
        $scope.daftar = 0;
        $scope.bayar = 0;
        $http.get(apiUrl + "rekap").success(function (row) {
            $scope.daftar = row.data.daftar;
            $scope.bayar = row.data.bayar;
        });

    })
    .controller('headerCtrl', function ($scope, $http, $state, $localstorage, Permission, $rootScope) {
        $scope.logout = function () {
            $rootScope.user = {
                role: "anonymous",
                name: "anonymous",
                id: 0,
                password: "",
                store: {}
            };
            $localstorage.setObject("user-admin", $rootScope.user);
            $state.go("login");
        };

    })
    .controller('paymentCtrl', function ($scope, $http, $state, $localstorage, Permission, $rootScope) {
        $scope.register = {
            mallid: "",
            chainmerchant: "",
            amount: "",
            purchaseamount: "",
            transidmerchant: "",
            words: "",
            requestdatetime: "",
            currency: "",
            basket: ""

        };
        $scope.getData = function () {
            //http://staging.doku.com/Suite/Receive
            var url_prod = "http://doku.menang5miliar.com/index.php/api/doku/payment"
            var url_dev = "http://doku.menang5miliar.com/dev/index.php/api/doku/payment";
            $http.post(url_prod, {id: $scope.id, method: $scope.method}).success(function (row) {
                $scope.register = {
                    mallid: row.data.MALLID,
                    chainmerchant: row.data.CHAINMERCHANT,
                    amount: parseInt(row.data.AMOUNT).toString() + ".00",
                    purchaseamount: parseInt(row.data.PURCHASEAMOUNT).toString() + ".00",
                    transidmerchant: row.data.TRANSIDMERCHANT,
                    words: row.data.WORDS,
                    requestdatetime: row.data.REQUESTDATETIME,
                    currency: row.data.CURRENCY,
                    basket: row.data.BASKET

                };
                //$("#formBayar").submit();
            });
        }

    })
    .controller('confirmCtrl', function ($scope, $http, $state, $localstorage, Permission, $stateParams) {
        $scope.register = {
            mallid: "",
            chainmerchant: "",
            amount: "",
            purchaseamount: "",
            transidmerchant: "",
            words: "",
            requestdatetime: "",
            currency: "",
            basket: ""

        };

        $http.get("http://doku.menang5miliar.com/dev/index.php/api/doku/confirm/id/" + $stateParams.id).success(function (row) {

            $scope.register = {
                id: row.data.registration_code,
                amount: row.data.totalamount,
                status: row.data.trxstatus,
                code: row.data.paymentcode,
                status: row.data.response_code

            };
        });

    })
    .controller('loginCtrl', function ($scope, $http, $state, $localstorage, Permission, $rootScope) {
        $scope.kirim = function () {
            var tgl = moment().format("ddd, D MMM YYYY HH:mm:ss") + " GMT";
            var body = {
                "username": $scope.username,
                "password": CryptoJS.SHA1($scope.password).toString()
            };
            var config = {
                headers: {
                    'Content-Type': 'application/json',
                    //"Date": tgl,
                    'Authorization': "EOT " + $scope.username + ":" + CryptoJS.HmacSHA1($scope.username + "\n" + keyEnc + "\n" + "POST" + "\n" + JSON.stringify(body), $scope.password)
                }
            }
            $http.post(apiUrl + "login", body, config).success(function (res) {
                $rootScope.user = {
                    role: res.data.user_role,
                    name: res.data.user_username,
                    id: res.data.user_id,
                    password: $scope.password,
                    store: {
                        name: res.data.store_name,
                        address: res.data.store_address,
                        city: res.data.store_city,
                        province: res.data.store_province,
                        fullAdress: res.data.store_full,
                        lat: res.data.store_lat,
                        long: res.data.store_long,
                        type: res.data.store_type
                    }
                };

                $localstorage.setObject("user-admin", $rootScope.user);
                $state.go("home.main");
                console.log($rootScope.user);
            });
        };
    })
    .controller('daftarCtrl', function ($scope, $http, $state, $localstorage, Permission, $rootScope, $uibModal) {
        $scope.sort =
        {
            id: {asc: 1, desc: 0},
            nik: {asc: 0, desc: 0},
            nama: {asc: 0, desc: 0},
            phone: {asc: 0, desc: 0},
            email: {asc: 0, desc: 0}
        };
        $scope.sortir = function (keysort, item) {
            $scope.sort =
            {
                id: {asc: 0, desc: 0},
                nama: {asc: 0, desc: 0},
                nik: {asc: 0, desc: 0},
                phone: {asc: 0, desc: 0},
                email: {asc: 0, desc: 0}
            };

            $scope.sort[keysort][item] = 0;
            if (item == 'asc') {
                $scope.sort[keysort].desc = 1;
            } else {
                $scope.sort[keysort].asc = 1;
            }
            $scope.urut = "&sort=" + keysort + "&sortby=" + item;
            $scope.loadData(0);
        };

        $scope.parseInt = parseInt;
        $scope.search = {
            id: "",
            nama: "",
            phone: "",
            email: "",
            nik: ""
        };
        $scope.pesertas = [];
        $scope.uri = apiUrl + "daftar";
        $scope.bigTotalItems = 0;
        $scope.limit = 20;

        $rootScope.kirimGet($scope.uri + '?tipe=total').then(function (total) {
            $scope.bigTotalItems = parseInt(total);
            $scope.sortir('id', 'asc');
        });

        $scope.bigCurrentPage = 1;
        $scope.maxSize = 20;

        $scope.cariparam = "";
        $scope.urut = "";

        $scope.tanggal = function (tgl) {
            return moment(tgl).format("YYYY-MM-DD");
        }

        $scope.loadData = function (n) {
            if (n == 1) {
                $scope.cariparam = "";
                $scope.urut = "";
                if ($scope.search.id != "") {
                    $scope.cariparam += "&id=" + $scope.search.id;
                }
                if ($scope.search.nama != "") {
                    $scope.cariparam += "&name=" + $scope.search.nama;
                }
                if ($scope.search.nik != "") {
                    $scope.cariparam += "&nik=" + $scope.search.nik;
                }
                if ($scope.search.phone != "") {
                    $scope.cariparam += "&phone=" + $scope.search.phone;
                }
                if ($scope.search.email != "") {
                    $scope.cariparam += "&email=" + $scope.search.email;
                }

                $scope.bigCurrentPage = 1;
                $rootScope.kirimGet($scope.uri + "?tipe=total" + $scope.cariparam).then(function (num) {
                    if (parseInt(num) != $scope.bigTotalItems) {
                        $scope.bigTotalItems = parseInt(num);
                    }
                    $scope.getData();
                });
            } else {
                $scope.getData();
            }
        };

        $scope.getData = function () {
            uri = "";
            uri = $scope.uri + '?page=' + ($scope.bigCurrentPage - 1) + "&limit=" + $scope.limit;
            if ($scope.cariparam != '') uri += $scope.cariparam;
            if ($scope.urut != '') uri += $scope.urut;
            $rootScope.kirimGet(uri).then(function (rows) {
                $scope.pesertas = rows.data;
            });
        };

        /*
         modal
         */

        $scope.animationsEnabled = true;

        $scope.open = function (row) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                resolve: {
                    peserta: function () {
                        return row;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                //$log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.toggleAnimation = function () {
            $scope.animationsEnabled = !$scope.animationsEnabled;
        };

    })
    .controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, peserta, $http, $rootScope, $localstorage) {

        $rootScope.peserta = peserta;
        //$scope.selected = {
        //    item: $scope.items[0]
        //};

        $rootScope.user = $localstorage.getObject("user-admin");

        $rootScope.mandiris = [];
        $scope.rows = [];
        //$scope.mandiri = {};
        $rootScope.selectedItem = "";
        $rootScope.mandiri = {};
        $rootScope.pindah = {
            id: $scope.peserta.registration_code,
            store_id: $scope.peserta.store_id,
            "date": $scope.peserta.competition_date,
            "session_id": $scope.peserta.competition_session
        };


        $scope.rubahJadwal = function () {
            console.log($rootScope.pindah);
            $http.post(apiUrl+"ganti-jadwal",$rootScope.pindah).success(function(){
                $uibModalInstance.dismiss('cancel');
            });
        };

        $scope.ok = function () {
            //console.log($rootScope.selectedItem);
            $http.get(apiUrl + "manual-mandiri/" + peserta.registration_code + "/" + $rootScope.mandiri.mandiri_id).success(function (res) {
                $uibModalInstance.dismiss('cancel');
            });
        };
        $rootScope.metode = "";
        $rootScope.voucher = "";
        $rootScope.reffno = "";
        $scope.konfirmasi = function () {
            $http.post(apiUrl + "confirmation", {
                id: peserta.registration_code,
                paymentMethod: $rootScope.metode,
                name: "",
                reffno: $rootScope.metode == 1 ? $rootScope.reffno : "",
                voucher: $rootScope.metode == 1 ? $rootScope.voucher : ""
            }).success(function (res) {
                $uibModalInstance.dismiss('cancel');
            });
        };

        $scope.rubah = function () {
            //console.log(item);
            var val = parseInt($rootScope.selectedItem);
            console.log(val);
            $rootScope.mandiri = $rootScope.mandiris[val];
            angular.forEach($rootScope.mandiris, function (item) {
                if (item.mandiri_id == val) {
                    $rootScope.mandiri = item;
                }
            });
            console.log($rootScope.mandiri);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };


        $http.get(apiUrl + "mandiri-not-taken").success(function (row) {
            $rootScope.mandiris = row.data;
        });

        $scope.parseInt = parseInt;

        $scope.kirimTiket = function () {
            $http.get(apiUrl + "ticket-resend/" + peserta.registration_code).success(function () {
                $uibModalInstance.dismiss('cancel');
            });

        };
    })
    .controller('mandiriCtrl', function ($scope, $http, $state, $localstorage, Permission, $rootScope, $uibModal) {
        $scope.sort =
        {
            id: {asc: 1, desc: 0},
            tgl: {asc: 0, desc: 0},
            nominal: {asc: 0, desc: 0}
        };
        $scope.sortir = function (keysort, item) {
            $scope.sort =
            {
                id: {asc: 0, desc: 0},
                tgl: {asc: 0, desc: 0},
                nominal: {asc: 0, desc: 0}
            };

            $scope.sort[keysort][item] = 0;
            if (item == 'asc') {
                $scope.sort[keysort].desc = 1;
            } else {
                $scope.sort[keysort].asc = 1;
            }
            $scope.urut = "&sort=" + keysort + "&sortby=" + item;
            $scope.loadData(0);
        };

        $scope.parseInt = parseInt;
        $scope.search = {
            id: "",
            tgl: "",
            nominal: ""
        };
        $scope.mandiris = [];
        $scope.uri = apiUrl + "mandiri";
        $scope.bigTotalItems = 0;
        $scope.limit = 20;

        $rootScope.kirimGet($scope.uri + '?tipe=total').then(function (row) {
            $scope.bigTotalItems = parseInt(row.total);
            $scope.sortir('id', 'asc');
        });

        $scope.bigCurrentPage = 1;
        $scope.maxSize = 20;

        $scope.cariparam = "";
        $scope.urut = "";

        $scope.tanggal = function (tgl) {
            return moment(tgl).format("YYYY-MM-DD");
        }

        $scope.loadData = function (n) {
            if (n == 1) {
                $scope.cariparam = "";
                $scope.urut = "";
                if ($scope.search.tgl != "") {
                    $scope.cariparam += "&tgl=" + $scope.search.tgl;
                }
                if ($scope.search.nominal != "") {
                    $scope.cariparam += "&nominal=" + $scope.search.nominal;
                }

                $scope.bigCurrentPage = 1;
                $rootScope.kirimGet($scope.uri + "?tipe=total" + $scope.cariparam).then(function (num) {
                    if (parseInt(num) != $scope.bigTotalItems) {
                        $scope.bigTotalItems = parseInt(num);
                    }
                    $scope.getData();
                });
            } else {
                $scope.getData();
            }
        };

        $scope.getData = function () {
            uri = "";
            uri = $scope.uri + '?page=' + ($scope.bigCurrentPage - 1) + "&limit=" + $scope.limit;
            if ($scope.cariparam != '') uri += $scope.cariparam;
            if ($scope.urut != '') uri += $scope.urut;
            $rootScope.kirimGet(uri).then(function (rows) {
                $scope.mandiris = rows.data;
            });
        };

        /*
         modal
         */

        $scope.animationsEnabled = true;

        $scope.tambah = function (row) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'mandiriContent.html',
                controller: 'MandiriInstanceCtrl',
                resolve: {
                    peserta: function () {
                        return row;
                    }
                }
            });

            console.log(modalInstance);

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                //$log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.toggleAnimation = function () {
            $scope.animationsEnabled = !$scope.animationsEnabled;
        };

    })
    .controller('MandiriInstanceCtrl', function ($scope, $uibModalInstance, peserta, $http, $rootScope, $localstorage) {

        $rootScope.user = $localstorage.getObject("user-admin");

        //$rootScope.mandiris = [];
        //$scope.rows = [];
        //$rootScope.selectedItem = "";
        $rootScope.mandiri = {};

        $scope.simpan = function () {
            $http.post(apiUrl + "mandiri-tambah",$rootScope.mandiri).success(function (res) {
                $uibModalInstance.dismiss('cancel');
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };


        //$http.get(apiUrl + "mandiri-not-taken").success(function (row) {
        //    $rootScope.mandiris = row.data;
        //});

        $scope.parseInt = parseInt;
    })
;