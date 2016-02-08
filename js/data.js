        
        
        var formatFunc = gantt.date.date_to_str("%d/%m/%Y");
        var color = [];
        var underline = [];
        var duration;
        var early = new Date();
        var count;
        early.setYear(early.getFullYear()-1);
        
        var load =  {data:[],links:[]};

        var tasks = [
            {"name":"John", "start":"02-09-2016", "end":"02-11-2016", "trade":1},
            {"name":"Anna", "start":"02-09-2016", "end":"02-14-2016", "trade":3},
            {"name":"Rick", "start":"02-11-2017", "end":"02-13-2017", "trade":2},
            {"name":"Ricky", "start":"02-01-2016", "end":"02-14-2016", "trade":2},
            {"name":"Rick", "start":"01-11-2016", "end":"02-13-2016", "trade":2}] ;

        var trades = [
            {"name":"Ecraft", "open":true, "color":"blue" },
            {"name":"Fletchers", "open":true, "color":"red"},
            {"name":"Plumb Co", "open":true, "color":"purple"}
        ];

        var unscheduled = [
            {"name":"Bob", "trade":1},
            {"name":"Doug", "trade":1},
            {"name":"Bob", "trade":2},
            {"name":"Doug", "trade":2},
            {"name":"Doug", "trade":1},
            {"name":"Bob", "trade":3},
            {"name":"Doug", "trade":3},
            {"name":"Sam", "trade":1}
        ];



        function daysBetween(one, another) {
            var timeDiff = Math.abs(one.getTime() - another.getTime());
            return Math.ceil(timeDiff / (1000 * 3600 * 24)); 
        }

		function fill() {

            underline.length = 0;

            count = 1;

            for (var i in trades) {
                c = i + 1;
                load.data[i] = {id: count , text: trades[i].name ,  start_date: early, duration:9999, parent: 0, color: trades[i].color, order:10, open: trades[i].open};
                color[count] = trades[i].color;
                count++;
            }
            for (var i in tasks) {
                var start = new Date(tasks[i].start);
                var end = new Date(tasks[i].end);

                    if(start > endOfWeek || end < startOfWeek ) {
                        load.data[count - 1] = {id: count , text: tasks[i].name , unscheduled:true , start_date: early , duration: 9999, color: color[tasks[i].trade], order:10, parent: [tasks[i].trade]};
                    
                    }
                    else {
                        dur = daysBetween( start, end);
                        markCells(tasks[i].trade, start, dur);
                        load.data[count - 1] = {id: count , text: tasks[i].name , unscheduled: false , start_date: formatFunc(start) , duration: dur+1, color: color[tasks[i].trade], order:10, parent: [tasks[i].trade]};
  
                    }
                count++;
            }

            addUnscheduled();
            height = (count*40);
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


        

        gantt.init("gantt_here");
        gantt.config.api_date = "%m-%d-%Y";
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

        if(zoom) {
          underlineTasks();
        }
        
      }

      mediaQuery();

      

