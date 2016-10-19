(function () {
    'use strict';

    angular
        .module('app')
        .controller('Tasks.IndexController', Controller);

    function Controller($scope, $compile, $window, UserService, TaskService, FlashService) {
        var vm = this;

        vm.user = null;
		vm.tasks = null;
		
		vm.activeListAvail = true;
		vm.inactiveListAvail = true;
		vm.completeListAvail = true;
		
		vm.toggleComplete = toggleComplete;
		vm.toggleActive = toggleActive;
		vm.deleteTask = deleteTask;
		vm.confirmDeleteTask = confirmDeleteTask;
		vm.confirmDeleteAllCompletedTasks = confirmDeleteAllCompletedTasks;
		
        initController();
		
        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
				
				// Get tasks for user
				getTasks();
				
				// Populate the filter selection
				populateViewOptionsDropdown();
            });
        }

		function deleteTask(_id) {
			TaskService.Delete(_id).then(function (user) {
				FlashService.Error("Task deleted.");
				refreshTasksLists();
            });
		}
		
		function confirmDeleteAllCompletedTasks() {
			var r = confirm("Are you sure you want to delete ALL completed tasks?");
			if (r == true) {
				deleteAllCompletedTasks();
			} 
		}
		
		function deleteAllCompletedTasks() {
			var len = vm.tasks.length;
			for (var i = 0; i < len; i++) {
				var task = vm.tasks[i];
				if(task.taskcompleted){
					deleteTask(task._id);
				}
			}
		}
		
		function refreshTasksLists(){
			if(vm.activeListAvail)
				clearChildNodes('activeTasks');
			if(vm.inactiveListAvail)
				clearChildNodes('inactiveTasks');
			if(vm.completeListAvail)
				clearChildNodes('completedTasks');
			getTasks();
		}
		
		function clearChildNodes(node){
			var node = $window.document.getElementById(node);
			while (node.firstChild) {
				node.removeChild(node.firstChild);
			}
		}
		
		function confirmDeleteTask(_id) {
			var r = confirm("Are you sure you want to delete this task?");
			if (r == true) {
				deleteTask(_id);
			} 
		}
		
		function getLocalTaskInfo(_id){
			var len = vm.tasks.length;
			for (var i = 0; i < len; i++) {
				var task = vm.tasks[i];
				if(task._id == _id)
					return task;
			}
			FlashService.Error("Unable to modify requested task.");
		}
		
		function toggleComplete(_id){
			var task = getLocalTaskInfo(_id);
			
			if(task.taskcompleted){
				task.taskactive = true;
				task.taskcompleted = false;
				TaskService.Update(task).then(function (user) {
					FlashService.Success("Task '"+task.taskname+"' marked as incomplete.");
					refreshTasksLists();
				});
			}
			else{
				task.taskactive = false;
				task.taskcompleted = true;
				TaskService.Update(task).then(function (user) {
					FlashService.Success("Task '"+task.taskname+"' marked as completed.");
					refreshTasksLists();
				});
			}
		}
		
		function toggleActive(_id){
			var task = getLocalTaskInfo(_id);
			
			if(task.taskactive){
				task.taskactive = false;
				TaskService.Update(task).then(function (user) {
					FlashService.Success("Task '"+task.taskname+"' moved to inactive tasks.");
					refreshTasksLists();
				});
			}
			else{
				task.taskactive = true;
				TaskService.Update(task).then(function (user) {
					FlashService.Success("Task '"+task.taskname+"' moved to active tasks.");
					refreshTasksLists();
				});
			}
		}
		
		function getTasks(){
			// get users tasks
			TaskService.GetUsersTasks(vm.user._id).then(function (tasks) {
				vm.tasks = tasks;
				displayTasks();
			});
		}
		
		function displayTasks(){
			var div_activeTasks = $window.document.getElementById('activeTasks');
			if(div_activeTasks==null)
				vm.activeListAvail = false;

			var div_inactiveTasks = $window.document.getElementById('inactiveTasks');
			if(div_inactiveTasks==null)
				vm.inactiveListAvail = false;

			var div_completedTasks = $window.document.getElementById('completedTasks');
			if(div_completedTasks==null)
				vm.completeListAvail = false;

			var activeCount = 0;
			var inactiveCount = 0;
			var completedCount = 0;
			
			var len = vm.tasks.length;
			for (var i = 0; i < len; i++) {
				var task = vm.tasks[i];

				if(task.taskactive && !task.taskcompleted && vm.activeListAvail){
					div_activeTasks.appendChild(generateTaskElementListItem(task, "list-group-item-active-task"));
					activeCount++;
				}
				if(!task.taskactive && !task.taskcompleted && vm.inactiveListAvail){
					div_inactiveTasks.appendChild(generateTaskElementListItem(task, "list-group-item-inactive-task"));
					inactiveCount++;
				}
				if(task.taskcompleted && vm.completeListAvail){
					div_completedTasks.appendChild(generateTaskElementListItem(task, "list-group-item-completed-task"));
					completedCount++;
				}
			}
			
			if(vm.activeListAvail){
				var activeTasksLabel = $window.document.getElementById('activeTasksLabel');
				activeTasksLabel.innerHTML = "Active ("+activeCount.toString()+")";
			}
			if(vm.inactiveListAvail){
				var inactiveTasksLabel = $window.document.getElementById('inactiveTasksLabel');
				inactiveTasksLabel.innerHTML = "Inactive ("+inactiveCount.toString()+")";
			}
			if(vm.completeListAvail){
				var completedTasksLabel = $window.document.getElementById('completedTasksLabel');
				completedTasksLabel.innerHTML = "Completed ("+completedCount.toString()+")";
			}
		}
		
		function populateViewOptionsDropdown(){
			var dropdownMenuViewOptions = $window.document.getElementById('dropdownMenuViewOptions');
			
			dropdownMenuViewOptions.appendChild(generateViewOptionsDropdownItem("#/all", "All"));
			dropdownMenuViewOptions.appendChild(generateViewOptionsDropdownItem("#/active", "Active"));
			dropdownMenuViewOptions.appendChild(generateViewOptionsDropdownItem("#/inactive", "Inactive"));
			dropdownMenuViewOptions.appendChild(generateViewOptionsDropdownItem("#/completed", "Completed"));
		}
		
		function generateViewOptionsDropdownItem(link, text){
			var listItem = $window.document.createElement("li");
			var linkElement = $window.document.createElement("a");
			linkElement.setAttribute('href', link);
			linkElement.innerHTML = text;
			listItem.appendChild(linkElement);
			
			return listItem;
		}
		
		function generateTaskElementListItem(task, addlClass){
			var taskItemListContainer = $window.document.createElement("li");
			taskItemListContainer.setAttribute('class', 'list-group-item ' + addlClass);
			
			var tasksTable = $window.document.createElement("table");
			tasksTable.setAttribute('class', 'task-item');
			taskItemListContainer.appendChild(tasksTable);
			
			var tasksTableRow = $window.document.createElement("tr");
			tasksTable.appendChild(tasksTableRow);
			
			var taskInfoContainer = $window.document.createElement("td");
			tasksTableRow.appendChild(taskInfoContainer);
			
			// Append data to task info cell
			taskInfoContainer.appendChild(generateTaskInfoDiv(task));
			
			var taskButtonContainer = $window.document.createElement("td");
			tasksTableRow.appendChild(taskButtonContainer);

			// Append data to task buttons cell
			taskButtonContainer.appendChild(generateActionButtonDiv(task));
			
			return taskItemListContainer;
		}
		
		function generateTaskInfoDiv(task){
			// Task Info Div
			var taskInfoDiv = $window.document.createElement("div");
			taskInfoDiv.appendChild(generateGenericLabelDiv("Name: ", task.taskname));
			taskInfoDiv.appendChild(generateGenericLabelDiv("Description: ", task.taskdesc));
			taskInfoDiv.appendChild(generateGenericLabelDiv("Created: ", task.taskcreatedon));
			
			return taskInfoDiv;
		}
		
		function generateGenericLabelDiv(title, content){
			// Label div
			var labelDiv = $window.document.createElement("div");
			labelDiv.setAttribute('class', 'form-group');
			
			// Title label
			var titleLabel = $window.document.createElement("label");
			titleLabel.setAttribute('class', 'titleLabel');
			titleLabel.innerHTML = title;
			
			// Content label
			var contentLabel = $window.document.createElement("p");
			contentLabel.innerHTML = content;
			
			// Add labels to div
			labelDiv.appendChild(titleLabel);
			labelDiv.appendChild(contentLabel);
			
			return labelDiv;
		}
		
		function generateActionButtonDiv(task){
			// Active / Inactive task button
			var activeInactivebutton = $window.document.createElement("button");
			activeInactivebutton.setAttribute('class', 'btn-sm btn-warning');

			if(task.taskactive){
				activeInactivebutton.innerHTML = "Mark Inactive";
			}
			else{
				activeInactivebutton.innerHTML = "Mark Active";
			}
			activeInactivebutton.setAttribute('ng-click', 'vm.toggleActive(\''+task._id+'\')');
			$compile(activeInactivebutton)($scope);
			
			// Completed task
			var completeButton = $window.document.createElement("button");
			completeButton.setAttribute('class', 'btn-sm btn-success');
			
			if(task.taskcompleted){
				completeButton.innerHTML = "Mark Incomplete";
			}
			else{
				completeButton.innerHTML = "Mark Complete";
			}
			completeButton.setAttribute('ng-click', 'vm.toggleComplete(\''+task._id+'\')');
			$compile(completeButton)($scope);
			
			// Delete task
			var deleteButtonDiv = $window.document.createElement("div");
			deleteButtonDiv.setAttribute('class', 'ng-scope');
			var deleteButton = $window.document.createElement("button");
			deleteButton.setAttribute('class', 'btn-sm btn-danger');
			deleteButton.setAttribute('ng-click', 'vm.confirmDeleteTask(\''+task._id+'\')');
			deleteButton.innerHTML = "Delete Task";
			deleteButtonDiv.appendChild(deleteButton);
			$compile(deleteButtonDiv)($scope);
			
			// Create div and add children
			var buttonContainer = $window.document.createElement("div");
			if(!task.taskcompleted){
				buttonContainer.appendChild(activeInactivebutton);
			}
			buttonContainer.appendChild($window.document.createElement("br"));
			buttonContainer.appendChild(completeButton);
			buttonContainer.appendChild($window.document.createElement("br"));
			buttonContainer.appendChild(deleteButtonDiv);
			
			return buttonContainer;
		}
	}
})();
