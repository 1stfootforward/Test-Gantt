		gantt.config.show_grid = false;

		var today = new Date();
		var startOfWeek = getMonday(new Date());
		var endOfWeek = new Date(startOfWeek.setDate(startOfWeek.getDate()+7));

		var listOfStartDates = [];
		var listOfEndDates = [];
		

		var zoom = true;
		var toggle = false;

		init();

		function left() {
			startOfWeek.setDate(startOfWeek.getDate()-7);
			endOfWeek.setDate(endOfWeek.getDate()-7);

			gantt.config.start_date = startOfWeek;
			gantt.config.end_date = endOfWeek;

			 gantt.render();
		};

		function right() {
			startOfWeek.setDate(startOfWeek.getDate()+7);
			endOfWeek.setDate(endOfWeek.getDate()+7);

			gantt.config.start_date = startOfWeek;
			gantt.config.end_date = endOfWeek;

			 gantt.render();
		};

		function toggleTimeFrame() {

			if(zoom) {
				zoom = false;
				startOfWeek.setDate(startOfWeek.getDate()-7);
				endOfWeek.setDate(endOfWeek.getDate()+7);
				gantt.config.step = 2;
			} else {
				zoom = true;
				startOfWeek.setDate(startOfWeek.getDate()+7);
				endOfWeek.setDate(endOfWeek.getDate()-7);
				gantt.config.step = 1;
			}

			gantt.config.start_date = startOfWeek;
			gantt.config.end_date = endOfWeek;
			gantt.render();
		};

		function mediaQuery() {
			if(window.innerWidth < 800) {
				gantt.config.step = 2;
			}
		};

		function getMonday(d) {
		  d = new Date(d);
		  var day = d.getDay(),
		      diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
		  return new Date(d.setDate(diff));
		};

		function init() {
			
			startOfWeek = getMonday(new Date());
			gantt.config.start_date = startOfWeek;
			gantt.config.end_date = endOfWeek;
			mediaQuery();
		};

		gantt.templates.scale_cell_class = function(date){
        	if(date.getDay()==0||date.getDay()==6){ return "weekend"; }
        	if(date.toDateString()==today.toDateString()){ return "today"; }
    	};

    	gantt.templates.task_class = function(start, end, task){
    		 
        	 return task.color;
    	};

    	gantt.attachEvent("onTaskDblClick", function(id,e){
		    
		    if( gantt.getTask(id).open) { 
		    	gantt.close(id)
		    	gantt.getTask(id).open = false;

		    } else {
				gantt.open(id);
				gantt.getTask(id).open = true;
			}
		});

		gantt.attachEvent("onTaskClick", function(id,e){

		    if( gantt.getTask(id).open) { 
		    	gantt.close(id)
		    	gantt.getTask(id).open = false;
		    } else {
				gantt.open(id);
				gantt.getTask(id).open = true;
			}
		});

		function collapse() {

			if(toggle) {
				gantt.eachTask(function(task){
				    gantt.open(task.id)
				    gantt.getTask(task.id).open = true;
				});
				gantt.render();
				toggle = false;
				
			} else {

				gantt.eachTask(function(task){

				    gantt.close(task.id)
				    gantt.getTask(task.id).open = false;
				});
				gantt.render();
				toggle = true;
				
			}
		}

		function setProjects() {
			gantt.eachTask(function(task){
				if(task.parent != 0) {			
					var calc = gantt.calculateEndDate(task.end_date, task.duration);

					if(listOfStartDates[task.parent]<task.start_date || listOfStartDates[task.parent] == null) { listOfStartDates[task.parent]=task.start_date;}

					if(listOfEndDates[task.parent]>calc || listOfEndDates[task.parent] == null) { 
						
						listOfEndDates[task.parent]=calc;
					}
				}
			});
			gantt.eachTask(function(task){
				if(task.parent == 0) {			
					task.start_date = listOfStartDates[task.id];
					task.duration = gantt.calculateDuration(listOfStartDates[task.id], listOfEndDates[task.id]);
					task.end_date = listOfEndDates[task.id];
					console.log(task.end_date);	
				}
			});
			gantt.render();
		}

		gantt.attachEvent("onTaskDrag", function(id, mode, task, original){
		    
		});

		gantt.attachEvent("onTaskCreated", function(task){
			
		 var level = gantt.calculateTaskLevel(task),
		   types = gantt.config.types;
		 
		 //assign task type based on task level
		 switch (level){
		  case 0:
		   task.type = types.project;
		   break;
		  case 1:
		   task.type = types.subproject;
		   break;
		  default:
		   task.type = types.task;
		   break;
		 }
		 return true;
		});