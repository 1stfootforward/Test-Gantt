'use strict';

/* App Module */

var app = angular.module('ganttApp', [ ]);

app.controller('MainGanttCtrl', function($scope) {

  $scope.tasks = {
    data:[
      {id:1, text:"Company ", start_date:"25-01-2016", duration:6, order:10, open: true, color:"blue"},
      {id:2, text:"Task ",    start_date:"25-01-2016", duration:2, order:10, parent:1, color:"blue"},
      {id:3, text:"Task ",    start_date:"28-01-2016", duration:3, order:10, parent:1, color:"blue"},
      {id:4, text:"Company ", start_date:"25-01-2016", duration:4,order:10, open: false, color:"red"},
      {id:5, text:"Task ",    start_date:"25-01-2016", duration:2, order:10, parent:4, color:"red"},
      {id:6, text:"Task ",    start_date:"26-01-2016", duration:3, order:10, parent:4, color:"red"},
      {id:7, text:"Company ", start_date:"25-01-2016", duration:8,order:10, open: false, color:"orange"},
      {id:8, text:"Task ",    start_date:"25-01-2016", duration:2, order:10, parent:7, color:"orange"},
      {id:9, text:"Task ",    start_date:"28-01-2016", duration:5, order:10, parent:7, color:"orange"},
      {id:10, text:"Company ", start_date:"22-01-2016", duration:7,order:10, open: false, color:"green"},
      {id:11, text:"Task ",    start_date:"22-01-2016", duration:2, order:10, parent:10, color:"green"},
      {id:12, text:"Task ",    start_date:"22-01-2016", duration:7, order:10, parent:10, color:"green"},
      {id:13, text:"Company ", start_date:"1-02-2016", duration:5, order:10, open: false, color:"purple"},
      {id:14, text:"Task ",    start_date:"1-02-2016", duration:2, order:10, parent:13, color:"purple"},
      {id:15, text:"Task ",    start_date:"3-02-2016", duration:3, order:10, parent:13, color:"purple"},
      {id:19, text:"Company ", start_date:"25-01-2015", duration:7, order:10, open: false, color:"navy"},
      {id:20, text:"Task ",    start_date:"25-01-2016", duration:2, order:10, parent:19, color:"red"},
      {id:21, text:"Task ",    start_date:"28-01-2016", duration:5, order:10, parent:19, color:"navy"}
    ]};

    $scope.oldtasks = {
    links:[
      { id:1, source:1, target:2, type:"1"},
      { id:2, source:2, target:3, type:"0"},
      { id:3, source:3, target:4, type:"0"},
      { id:4, source:2, target:5, type:"2"},
    ]};

});