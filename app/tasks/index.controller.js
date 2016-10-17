﻿(function () {
    'use strict';

    angular
        .module('app')
        .controller('Tasks.IndexController', Controller);

    function Controller($scope, $compile, $window, UserService, TaskService, FlashService) {
        var vm = this;

        vm.user = null;
		vm.tasks = null;
		

		vm.toggleComplete = toggleComplete;
		vm.deleteTask = deleteTask;
		vm.confirmDeleteTask = confirmDeleteTask;

        initController();

		function deleteTask(_id) {
			
			TaskService.Delete(_id);
			FlashService.Error("Task deleted.");
			
			refreshTasksLists();
			
		}
		
		function refreshTasksLists(){
			clearChildNodes('activeTasks');
			clearChildNodes('inactiveTasks');
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
				FlashService.Success("Task marked as incomplete.");
				task.taskactive = true;
				task.taskcompleted = false;
				//TaskService.Update(task);
			}
			else{
				FlashService.Success("Task marked as completed.");
				task.taskactive = false;
				task.taskcompleted = true;
				TaskService.Update(task);
			}
			
			refreshTasksLists();

		}
		
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
		
		
		function getTasks(){
			// get users tasks
			TaskService.GetUsersTasks(vm.user._id).then(function (tasks) {
				
				vm.tasks = tasks;
			
				displayTasks();
			});
		}
		
		
		function displayTasks(){

			var div_activeTasks = $window.document.getElementById('activeTasks');
			var div_inactiveTasks = $window.document.getElementById('inactiveTasks');
			var div_completedTasks = $window.document.getElementById('completedTasks');

			var activeCount = 0;
			var inactiveCount = 0;
			var completedCount = 0;
			
			var len = vm.tasks.length;
			for (var i = 0; i < len; i++) {
				var task = vm.tasks[i];

				if(task.taskactive && !task.taskdeleted && !task.completed){
					div_activeTasks.appendChild(generateTaskElementListItem(task._id, task.taskname, task.taskdesc, task.taskcreatedon, task.taskactive, task.taskcompleted));
					activeCount++;
				}
				if(!task.taskactive && !task.taskdeleted && !task.completed){
					div_inactiveTasks.appendChild(generateTaskElementListItem(task._id, task.taskname, task.taskdesc, task.taskcreatedon, task.taskactive, task.taskcompleted));
					inactiveCount++;
				}
				if(task.completed){
					div_completedTasks.appendChild(generateTaskElementListItem(task._id, task.taskname, task.taskdesc, task.taskcreatedon, task.taskactive, task.taskcompleted));
					completedCount++;
				}
			}
			
			var activeTasksLabel = $window.document.getElementById('activeTasksLabel');
			activeTasksLabel.innerHTML = "Active ("+activeCount.toString()+")";
			var inactiveTasksLabel = $window.document.getElementById('inactiveTasksLabel');
			inactiveTasksLabel.innerHTML = "Inactive ("+inactiveCount.toString()+")";
			var completedTasksLabel = $window.document.getElementById('completedTasksLabel');
			completedTasksLabel.innerHTML = "Completed ("+completedCount.toString()+")";
			
		}
		
		function populateViewOptionsDropdown(){
			
			var dropdownMenuViewOptions = $window.document.getElementById('dropdownMenuViewOptions');
			
			dropdownMenuViewOptions.appendChild(generateViewOptionsDropdownItem("#/all", "All"));
			dropdownMenuViewOptions.appendChild(generateViewOptionsDropdownItem("#/active", "Active"));
			dropdownMenuViewOptions.appendChild(generateViewOptionsDropdownItem("#/inactive", "Inactive"));
			dropdownMenuViewOptions.appendChild(generateViewOptionsDropdownItem("#/completed", "Completed"));
			dropdownMenuViewOptions.appendChild(generateViewOptionsDropdownItem("#/overdue", "Overdue"));
			
		}
		
		function generateViewOptionsDropdownItem(link, text){
			var listItem = $window.document.createElement("li");
			var linkElement = $window.document.createElement("a");
			linkElement.setAttribute('href', link);
			linkElement.innerHTML = text;
			listItem.appendChild(linkElement);
			
			
			return listItem;
		}
		
		
		
		
		function generateTaskElementListItem(_id, taskName, taskDesc, createdOn, taskActive, taskComplete){
			
			var taskItemListContainer = $window.document.createElement("li");
			taskItemListContainer.setAttribute('class', 'list-group-item');
			
			var tasksTable = $window.document.createElement("table");
			tasksTable.setAttribute('class', 'task-item');
			taskItemListContainer.appendChild(tasksTable);
			
			var tasksTableRow = $window.document.createElement("tr");
			tasksTable.appendChild(tasksTableRow);
			
			var taskInfoContainer = $window.document.createElement("td");
			tasksTableRow.appendChild(taskInfoContainer);
			
			// Append data to task info cell
			taskInfoContainer.appendChild(generateTaskInfoDiv(taskName, taskDesc, createdOn));
			
			var taskButtonContainer = $window.document.createElement("td");
			tasksTableRow.appendChild(taskButtonContainer);

			// Append data to task buttons cell
			taskButtonContainer.appendChild(generateActionButtonDiv(_id, taskActive, taskComplete));
			
			return taskItemListContainer;
		}
		
		function generateTaskInfoDiv(taskName, taskDesc, createdOn){
			
			// Task Info Div
			var taskInfoDiv = $window.document.createElement("div");
			taskInfoDiv.appendChild(generateGenericLabelDiv("Name: ", taskName));
			taskInfoDiv.appendChild(generateGenericLabelDiv("Description: ", taskDesc));
			taskInfoDiv.appendChild(generateGenericLabelDiv("Created: ", createdOn));
			
			
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
		
		function generateActionButtonDiv(_id, taskActive, taskComplete){
			
			// Active / Inactive task button
			
			var activeInactivebutton = $window.document.createElement("button");
			activeInactivebutton.setAttribute('class', 'btn-sm btn-warning');

			if(taskActive){
				activeInactivebutton.innerHTML = "Mark Inactive";
			}
			else{
				activeInactivebutton.innerHTML = "Mark Active";
			}
			
			// Completed task

			var completeButton = $window.document.createElement("button");
			completeButton.setAttribute('class', 'btn-sm btn-success');
			
			if(taskComplete){
				completeButton.innerHTML = "Mark Incomplete";
			}
			else{
				completeButton.innerHTML = "Mark Complete";
			}
			completeButton.setAttribute('ng-click', 'vm.toggleComplete(\''+_id+'\')');
			$compile(completeButton)($scope);
			// Delete task

			var deleteButtonDiv = $window.document.createElement("div");
			deleteButtonDiv.setAttribute('class', 'ng-scope');
			var deleteButton = $window.document.createElement("button");
			deleteButton.setAttribute('class', 'btn-sm btn-danger');
			deleteButton.setAttribute('ng-click', 'vm.confirmDeleteTask(\''+_id+'\')');
			deleteButton.innerHTML = "Delete Task";
			deleteButtonDiv.appendChild(deleteButton);
			$compile(deleteButtonDiv)($scope);
			
			// Create div and add children

			var buttonContainer = $window.document.createElement("div");
			buttonContainer.appendChild(activeInactivebutton);
			buttonContainer.appendChild($window.document.createElement("br"));
			buttonContainer.appendChild(completeButton);
			buttonContainer.appendChild($window.document.createElement("br"));
			buttonContainer.appendChild(deleteButtonDiv);
			
			return buttonContainer;
			
		}
		
	}
})();
