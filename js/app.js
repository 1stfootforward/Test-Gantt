'use strict';

/* App Module */

var app = angular.module('ganttApp', [ ]);


var schema = [
    {"name":"John", "start":"28-01-2016", "end":"28-02-2016", "trade":"Ecraft"},
    {"name":"Anna", "start":"28-01-2016", "end":"28-02-2016", "trade":"Ecraft"},
    {"name":"Peter","start": "28-01-2016", "end":"28-02-2016", "trade":"Ecraft"}
];

var trades = [
    {"name":"Ecraft", "open":true, "color":"blue" },
    {"name":"Fletchers", "open":true, "color":"red"}
];


app.controller('MainGanttCtrl', function($scope) {


  $scope.tasks = {
    data:[
      {id:1, text:"Company ", start_date:"25-01-2014", duration:9999, order:10, open: true, color:"blue"},
      {id:2, text:"Task ",    start_date:"25-01-2016", duration:2, order:10, parent:1, color:"blue"},
      {id:3, text: schema[1].name ,    start_date:"28-01-2016", duration:9, order:10, parent:1, color:"blue", unscheduled:true},
      {id:4, text:"Company ", start_date:"25-01-2000", duration:9999, order:10, open: true, color:"red"},
      {id:5, text:"Task ",    start_date:"25-01-2016", duration:2, order:10, parent:4, color:"red"},
      {id:6, text:"Task ",    start_date:"26-01-2016", duration:3, order:10, parent:4, color:"red"},
      {id:7, text:"Company ", start_date:"25-01-2000", duration:9999,order:10, open: true, color:"orange"},
      {id:8, text:"Task ",    start_date:"25-01-2016", duration:2, order:10, parent:7, color:"orange"},
      {id:9, text:"Task ",    start_date:"28-01-2016", duration:5, order:10, parent:7, color:"orange"},
      {id:10, text:"Company ", start_date:"22-01-2000", duration:9999,order:10, open: true, color:"green"},
      {id:11, text:"Task ",    start_date:"22-01-2016", duration:2, order:10, parent:10, color:"green"},
      {id:12, text:"Task ",    start_date:"22-01-2016", duration:7, order:10, parent:10, color:"green"},
      {id:13, text:"Company ", start_date:"1-02-2000", duration:9999, order:10, open: true, color:"purple"},
      {id:14, text:"Task ",    start_date:"1-02-2016", duration:2, order:10, parent:13, color:"purple"},
      {id:15, text:"Task ",    start_date:"3-02-2016", duration:3, order:10, parent:13, color:"purple"},
      {id:19, text:"Company ", start_date:"25-01-2000", duration:9999, order:10, open: true, color:"navy"},
      {id:20, text:"Task ",    start_date:"25-01-2016", duration:2, order:10, parent:19, color:"red"},
      {id:21, text:"Task ",    start_date:"28-01-2016", duration:5, order:10, parent:19, color:"navy"}
    ], 
    links:[
      { id:1, source:1, target:2, type:"1"},
      { id:2, source:2, target:3, type:"0"},
      { id:3, source:3, target:4, type:"0"},
      { id:4, source:2, target:5, type:"2"},
    ]};

    $scope.oldtasks = {
    links:[
      { id:1, source:1, target:2, type:"1"},
      { id:2, source:2, target:3, type:"0"},
      { id:3, source:3, target:4, type:"0"},
      { id:4, source:2, target:5, type:"2"},
    ]};
});

function fill() {

    gantt.parse({
    "data":[
      {"id":11, "text":"Project #1", type:gantt.config.types.project, "progress": 0.6, "open": true},

      {"id":12, "text":"Task #1", "start_date":"03-04-2013", "duration":"5", "parent":"11", "progress": 1, "open": true},
      {"id":13, "text":"Unscheduled Project", "start_date":"03-04-2013", type:gantt.config.types.project, "parent":"11", "progress": 0.5, "open": true},
      {"id":14, "text":"Task #3", "start_date":"02-04-2013", "duration":"6", "parent":"11", "progress": 0.8, "open": true},
      {"id":15, "text":"Task #4", "start_date":"03-04-2013", type:gantt.config.types.project, "parent":"11", "progress": 0.2, "open": true},
      {"id":16, "text":"Final milestone", "start_date":"15-04-2013", type:gantt.config.types.milestone, "parent":"11", "progress": 0, "open": true},

      {"id":17, "text":"Task #2.1", unscheduled:true, "parent":"13", "progress": 1, "open": true},
      {"id":18, "text":"Task #2.2", unscheduled:true, "parent":"13", "progress": 0.8, "open": true},
      {"id":19, "text":"Task #2.3", unscheduled:true, "parent":"13", "progress": 0.2, "open": true},
      {"id":20, "text":"Task #2.4", unscheduled:true, "parent":"13", "progress": 0, "open": true},
      {"id":21, "text":"Task #4.1", unscheduled:true, "parent":"15", "progress": 0.5, "open": true},
      {"id":22, "text":"Task #4.2", unscheduled:true, "parent":"15", "progress": 0.1, "open": true},
      {"id":23, "text":"Mediate milestone", unscheduled:true,  type:gantt.config.types.milestone, "parent":"15", "progress": 0, "open": true}
    ],
    "links":[
      {"id":"10","source":"11","target":"12","type":"1"},
      {"id":"11","source":"11","target":"13","type":"1"},
      {"id":"12","source":"11","target":"14","type":"1"},
      {"id":"13","source":"11","target":"15","type":"1"},
      {"id":"14","source":"23","target":"16","type":"0"},
      {"id":"15","source":"13","target":"17","type":"1"},
      {"id":"16","source":"17","target":"18","type":"0"},
      {"id":"17","source":"18","target":"19","type":"0"},
      {"id":"18","source":"19","target":"20","type":"0"},
      {"id":"19","source":"15","target":"21","type":"2"},
      {"id":"20","source":"15","target":"22","type":"2"},
      {"id":"21","source":"15","target":"23","type":"0"}
    ]
  });

}