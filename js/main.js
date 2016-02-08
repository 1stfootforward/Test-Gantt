		gantt.config.show_unscheduled = true;
		
		gantt.config.show_grid = false;
		gantt.config.drag_resize = false;
		gantt.config.drag_progress = false;
		gantt.config.drag_move = false;
		gantt.config.drag_links = true;



		var date_range = 6

		var today = new Date();
		var startOfWeek = getMonday(new Date());
		var endOfWeek = new Date(startOfWeek.setDate(startOfWeek.getDate()+date_range));

		startOfWeek = getMonday(new Date());
		gantt.config.start_date = startOfWeek;
		gantt.config.end_date = endOfWeek;

		var zoom = true;
		var collapse = true;

		function left() {
			startOfWeek.setDate(startOfWeek.getDate()-7);
			endOfWeek.setDate(endOfWeek.getDate()-7);

			gantt.config.start_date = startOfWeek;
			gantt.config.end_date = endOfWeek;

			refresh();
		};

		function right() {
			startOfWeek.setDate(startOfWeek.getDate()+7);
			endOfWeek.setDate(endOfWeek.getDate()+7);

			gantt.config.start_date = startOfWeek;
			gantt.config.end_date = endOfWeek;

			refresh();
		};

		function toggleTimeFrame() {
			if(zoom) {
				zoom = false;

				var weekScaleTemplate = function(date){
					var dateToStr = gantt.date.date_to_str("%d %M");
					var endDate = gantt.date.add(gantt.date.add(date, 1, "week"), -1, "day");
					return dateToStr(date) + " - " + dateToStr(endDate);
				};
				gantt.templates.date_scale = weekScaleTemplate;
				date_range = 20;
				gantt.config.scale_unit = "week";
				startOfWeek.setDate(startOfWeek.getDate()-7);
				endOfWeek.setDate(endOfWeek.getDate()+7);
				gantt.config.step = 1;
			} else {
				zoom = true;

				gantt.templates.date_scale = null;
				gantt.config.scale_unit = "day";
				gantt.config.date_scale = "%F %d"; 
				date_range = 6;

				startOfWeek.setDate(startOfWeek.getDate()+7);
				endOfWeek.setDate(endOfWeek.getDate()-7);
				gantt.config.step = 1;
			}

			gantt.config.start_date = startOfWeek;
			gantt.config.end_date = endOfWeek;
			gantt.render();
		};

		function mediaQuery() {

			if(window.innerWidth < 1000) {
				toggleTimeFrame();
			}
		};

		function getMonday(d) {
		  d = new Date(d);
		  var day = d.getDay(),
		      diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
		  return new Date(d.setDate(diff));
		};


		gantt.templates.scale_cell_class = function(date){
			if(date.toDateString()==today.toDateString()){ return "today"; }
        	if(date.getDay()==0||date.getDay()==6){ return "weekend"; }
        	
    	};





		function taskFired(task){

			var id = task.id - underline.length;
			$( "#modalTitle" ).html(tasks[id].name);
			$( "#modalContent" ).html(tasks[id].content);
			$( "#modalSDate" ).html(tasks[id].start);
			$( "#modalEDate" ).html(tasks[id].end);
			$( "#modalTrade" ).html(trades[tasks[id].trade - 1].name);
			$('#myModal').foundation('reveal', 'open');

		}

		function collapseTasks() {
			if(collapse) {
				gantt.eachTask(function(task){
					if(task.parent==0) {
					    gantt.open(task.id);
					    trades[task.id-1].open = true;
					}
				});
				collapse = false;				
			} else {
				gantt.eachTask(function(task){
					if(task.parent==0) {
				    	gantt.close(task.id)
				    	trades[task.id-1].open = false;
				    }
				});
				collapse = true;
			}
			refresh();
		}
    

		gantt.templates.task_class = function(start, end, task){
    		 
        	 if(task.parent>0) {
        	 	parent = gantt.getTask(task.parent);
	        	 if (parent.shrunk) {
	        	 	return task.color + " shrunk";
	        	 }
	        	 else {
	        	 	return task.color + " big";
	        	 }
	       	 } else { return task.color + " project"; }

        	 	
    	};

    	gantt.templates.task_row_class = function(start, end, task){ 
        	
        	
        	if(task.parent>0) {
        	 	
	        	 	return task.color ;
	        	 
	       	 } else { 
	       	 		return task.color + " parent_row";
	       	 	 
	       	 }
	        	 
    	};

