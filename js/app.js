'use strict';

/* App Module */

var app = angular.module('ganttApp', [ ]);

app.controller('MainGanttCtrl', function($scope) {

  $scope.tasks = {
    data:[
      {id:1, text:"Company ", start_date:"25-01-2016", duration:999, order:10, open: true, color:"blue", shrunk:true},
      {id:2, text:"Task ",    start_date:"25-01-2016", duration:2, order:10, parent:1, color:"blue", active:false},
      {id:3, text:"Task ",    start_date:"28-01-2016", duration:3, order:10, parent:1, color:"blue", active:false},
      {id:4, text:"Company ", start_date:"25-01-2016", duration:999,order:10, open: true, color:"red", shrunk:true},
      {id:5, text:"Task ",    start_date:"25-01-2016", duration:2, order:10, parent:4, color:"red" , active:false},
      {id:6, text:"Task ",    start_date:"26-01-2016", duration:3, order:10, parent:4, color:"red", active:false},
      {id:7, text:"Company ", start_date:"25-01-2016", duration:999,order:10, open: true, color:"orange" , shrunk:true},
      {id:8, text:"Task ",    start_date:"25-01-2016", duration:2, order:10, parent:7, color:"orange", active:false},
      {id:9, text:"Task ",    start_date:"28-01-2016", duration:5, order:10, parent:7, color:"orange", active:false},
      {id:10, text:"Company ", start_date:"22-01-2016", duration:999,order:10, open: true, color:"green", shrunk:true},
      {id:11, text:"Task ",    start_date:"22-01-2016", duration:2, order:10, parent:10, color:"green", active:false},
      {id:12, text:"Task ",    start_date:"22-01-2016", duration:7, order:10, parent:10, color:"green", active:false},
      {id:13, text:"Company ", start_date:"1-02-2016", duration:999, order:10, open: true, color:"purple", shrunk:true},
      {id:14, text:"Task ",    start_date:"1-02-2016", duration:2, order:10, parent:13, color:"purple", active:false},
      {id:15, text:"Task ",    start_date:"3-02-2016", duration:3, order:10, parent:13, color:"purple", active:false},
      {id:19, text:"Company ", start_date:"25-01-2015", duration:999, order:10, open: true, color:"navy", shrunk:true},
      {id:20, text:"Task ",    start_date:"25-01-2016", duration:2, order:10, parent:19, color:"red" , active:false},
      {id:21, text:"Task ",    start_date:"28-01-2016", duration:5, order:10, parent:19, color:"navy", active:false}
    ], links:[
      { id:1, source:1, target:2, type:"1"},
      { id:2, source:2, target:3, type:"0"},
      { id:3, source:3, target:4, type:"0"},
      { id:4, source:2, target:5, type:"2"},
    ]
  };

});