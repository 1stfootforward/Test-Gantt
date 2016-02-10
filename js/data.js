        
        
        var formatFunc = gantt.date.date_to_str("%d/%m/%Y");
        var color = [];
        var underline = [];
        var duration;
        var early = new Date();
        var count;
        var removeHeight;
        early.setYear(early.getFullYear()-1);
        
        var load =  {data:[],links:[]};

        var tasks = [
            {"content":"Description of task","name":"Task One Name", "start":"02-09-2016", "end":"02-11-2016", "trade":1},
            {"content":"Description of task","name":"Task Two", "start":"02-09-2016", "end":"02-14-2016", "trade":3},
            {"content":"Description of task","name":"Task Three", "start":"02-11-2016", "end":"02-13-2016", "trade":2},
            {"content":"Description of task","name":"Task Four", "start":"02-01-2016", "end":"02-14-2016", "trade":2},
            {"content":"Description of task","name":"Task six", "start":"02-1-2016", "end":"02-6-2016", "trade":2},
            {"content":"Description of task","name":"Task seven", "start":"02-18-2016", "end":"02-22-2016", "trade":3},
            {"content":"Description of task","name":"Task Four", "start":"02-01-2017", "end":"02-14-2017", "trade":2},
            {"content":"Description of task","name":"Task eight", "start":"02-01-2015", "end":"02-14-2015", "trade":2},
            {"content":"Description of task","name":"Task Five", "start":"01-11-2016", "end":"02-13-2016", "trade":2}] ;

        var trades = [
            {"name":"Trade Category One", "open":false, "color":"blue" },
            {"name":"Trade Category Two", "open":false, "color":"red"},
            {"name":"Trade Category Three", "open":false, "color":"purple"}
        ];

        var unscheduled = [
            {"name":"Unscheduled One", "trade":1},
            {"name":"Unscheduled Two", "trade":1},
            {"name":"Unscheduled Three", "trade":2},
            {"name":"Unscheduled Four", "trade":2},
            {"name":"Unscheduled Five", "trade":1},
            {"name":"Unscheduled Six", "trade":3},
            {"name":"Unscheduled Seven", "trade":3},
            {"name":"Unscheduled Eight", "trade":1}
        ];



        function daysBetween(one, another) {
            var timeDiff = Math.abs(one.getTime() - another.getTime());
            return Math.ceil(timeDiff / (1000 * 3600 * 24)); 
        }

		function fill() {

            underline.length = 0;
            removeHeight=0;
            count = 1;
            var side = "";

            for (var i in trades) {
                c = i + 1;
                load.data[i] = {id: count , text: trades[i].name ,  start_date: early, duration:9999, parent: 0, color: trades[i].color, order:10, open: trades[i].open, direction: ""};
                color[count] = trades[i].color;
                count++;
            }
            for (var i in tasks) {
                var start = new Date(tasks[i].start);
                var end = new Date(tasks[i].end);

                    if(start > endOfWeek || end < startOfWeek ) {
                        if(start > endOfWeek){side = "rightArrow";}else{side = "leftArrow"}
                        load.data[count - 1] = {id: count , text: tasks[i].name , unscheduled:true , start_date: early , duration: 9999, color: color[tasks[i].trade], order:10, parent: [tasks[i].trade], direction: side};
                        
                    }
                    else {
                        dur = daysBetween( start, end);
                        markCells(tasks[i].trade, start, dur);
                        load.data[count - 1] = {id: count , text: tasks[i].name , unscheduled: false , start_date: formatFunc(start) , duration: dur+1, color: color[tasks[i].trade], order:10, parent: [tasks[i].trade], direction: ""};
  
                    }
                count++;
            }

            addUnscheduled();
            height = ((count - removeHeight )*40);
            document.getElementById('gantt_here').setAttribute("style","height:"+height+"px");

        }

        function addUnscheduled() {
          var groups = []
          for (var i = unscheduled.length - 1; i >= 0; i--) {
            if(isNaN(groups[unscheduled[i].trade])) {
              groups[unscheduled[i].trade] = 1;
            } else {groups[unscheduled[i].trade]++;}
          };
          
          for (var i = groups.length - 1; i > 0; i--) {
            load.data[count - 1] = {id: count , text: "+ " + groups[i] , unscheduled: false , start_date: startOfWeek , duration: 1, color: "unscheduled "+color[i], order:10, parent: i};
            count++;
          };
        }


          function markCells(parent, start, dur) {

            var before = daysBetween(startOfWeek, start);
            var array = underline[parent];
            if(array == null) {array = [];}
            if(startOfWeek > start) {dur = dur-before+1; before = 0;}
            if(dur>date_range) { dur = 7;}
            for (var i = 0; i < before; i++) {

               
            };
            
            for (var i = 0; i <= dur; i++) {

               array[before + i] = true;
            };

            for (; i <= date_range; i++) {

               
            };
            underline[parent] = array;

        }


        grabTasks();

        gantt.init("gantt_here");
        fill();

        gantt.parse(load);

        underlineTasks();


     function underlineCells(id, color) {
        var list = underline[id];
        if(list != undefined) {
          for (var i = 0; i < list.length; i++) {
            if(list[i]) {
              
              $(".gantt_task_row.parent_row."+color).children().eq(i).addClass("shade");
            }
          };
        }

      }

      function underlineTasks() {

        
          for (var i = underline.length - 1; i > 0; i--) {
            task = gantt.getTask(i);

            if(!task.open) {
              underlineCells(i, task.color);
            }
          };
        
      }


    function refresh() {
        gantt.init("gantt_here");
        fill();
        gantt.parse(load);
        gantt.render();

        if(zoom) { underlineTasks();}
        arrows();
        
    }

      mediaQuery();

    gantt.attachEvent("onTaskDblClick", function(id,e){
        task = gantt.getTask(id);

      if(task.parent==0) {
          if( gantt.getTask(id).open) { 
            gantt.close(id)
            trades[task.id-1].open = false;
            refresh();
          } else {
          gantt.open(task.id);
          trades[task.id-1].open = true;
          refresh();
        }
      } else {taskFired(task);}
    });

    gantt.attachEvent("onTaskClick", function(id,e){
      task = gantt.getTask(id);
      if(task.parent==0) {
          if( gantt.getTask(id).open) { 
            gantt.close(id)
            trades[task.id-1].open = false;
            refresh();
          } else {

          gantt.open(task.id);
          trades[task.id-1].open = true;
          refresh();
        }
      } else {
              if(task.text.length == 3) 
                {unscheduledFire(task.parent);} else {taskFired(task);}

              
          }
    });

function arrows() {   
  $( ".rightArrow .gantt_last_cell" ).each(function( index ) {
     $( this ).html( "<sup> > </sup> " );
  });
  $( ".leftArrow" ).each(function( index ) {
     $( this ).children().eq(0).html( "<sup> < </sup> " );
  }); 
}

function grabTasks() {

  $( ".incomplete" ).each(function( index ) {

    var string = $( this ).text();
    var name = string.substring(0, string.indexOf("Starts"));
    var start = string.substring(string.indexOf("Starts")+7, string.indexOf("|"));
    var end = string.substring(string.indexOf("Ends")+5);

    if(start = "Not Specified") {
      unscheduled[index].name = name;
      unscheduled[index].trade = 0;
    } else {
      tasks[index].name = name;
      tasks[index].start = start;
      tasks[index].end = end;
      tasks[index].trade = 0;
    }


  });
}


