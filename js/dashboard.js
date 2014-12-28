var dashboard = angular.module('dashboard', ['dashboard.controllers', 'dashboard.services', 'dashboard.constants', 'dashboard.filters', 'dashboard.directives']);
var controllers = angular.module('dashboard.controllers', [ 'tc.chartjs', 'ngActivityIndicator' ]);
var services = angular.module('dashboard.services', []);
var constants = angular.module('dashboard.constants', []);
var filters = angular.module('dashboard.filters', []);
var directives = angular.module('dashboard.directives', []);
