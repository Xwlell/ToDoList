window.addEventListener('DOMContentLoaded', (e) => {
    e.preventDefault();


    const head = document.querySelector("head"),
    header = document.querySelector(".headers"),
    form = document.querySelector(".task-form"),
    input = form.querySelector("#task-input"),
    task_list = document.querySelector(".task-list");

    let todos = [];
    
    if (localStorage.getItem('todos')) {
        todos = JSON.parse(localStorage.getItem('todos'));
    }; 
    
    todos.forEach(doit => {
        renderTask(doit);
    });

    const link = document.createElement("link");
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.setAttribute('href','day.css');
    head.appendChild(link); 

    const header_btn = document.createElement("div");
    header_btn.classList.add("header-btn");
    header.appendChild(header_btn); 

    const btn_theme = document.createElement("button");
    btn_theme.classList.add("btn-change");
    btn_theme.innerHTML = '<img src="sun.png" width="24px" height="24px">';
       
    header_btn.appendChild(btn_theme);
    
    btn_theme.addEventListener('click', () => {
        if (btn_theme.innerHTML == '<img src="sun.png" width="24px" height="24px">') {
            link.removeAttribute('href','day.css');
            link.setAttribute('href','night.css');
            btn_theme.innerHTML = '<img src="moon.png" width="24px" height="24px">';
        } else {
            link.removeAttribute('href','night.css');
            link.setAttribute('href','day.css');
            btn_theme.innerHTML = '<img src="sun.png" width="24px" height="24px">';
        }
    });


    function renderTask (doit) {
        const cssClass =  doit.done ? "check" : "uncheck";
        
        const tasks = document.createElement("div");
        tasks.classList.add("tasks");
        tasks.id = `${doit.id}`;

        const task_check = document.createElement("button");
        task_check.classList.add(`${cssClass}`);
        task_check.id ="task_check_id";
        task_check.setAttribute('data-action','check');
        tasks.appendChild(task_check);

        const task_el = document.createElement("input");
        task_el.type = "text";
        task_el.value = `${doit.text}`;
        task_el.setAttribute('maxLength',55);
        task_el.id ="task-list-input";

        task_el.setAttribute("readonly", "readonly"); 
        tasks.appendChild(task_el);
        
        const task_edit = document.createElement("button");
        task_edit.classList.add("edit");
        task_edit.setAttribute('data-action','edit_btn');
        task_edit.setAttribute('title','Редактировать');
        /* task_edit.innerHTML = '<img src="/css/pen.png" width="15px" height="15px">'; */

        const task_delete = document.createElement("button");
        task_delete.classList.add("delete");
        task_delete.setAttribute('data-action','delete');
        task_delete.setAttribute('title','Удалить');
        /* task_delete.innerHTML = '<img src="/css/delete.png" width="15px" height="15px">'; */

        tasks.appendChild(task_edit);
        tasks.appendChild(task_delete);
        task_list.appendChild(tasks); 
    }

    form.addEventListener('submit', addTask);
    
    task_list.addEventListener('click', check);
    task_list.addEventListener('click', edit);
    task_list.addEventListener('click', delete_task);

    function addTask(event) {
        event.preventDefault();

        const taskText = input.value;

        const newTask = {
            id: Date.now(),
            text: taskText,
            done: false,
        };
        
        if (taskText ==="" || taskText.length <= 2) {
            alert("Так дело не пойдет");
            tasks.remove();
            return false;
        };

        todos.push(newTask);

        toLocalStorage();
       
        renderTask (newTask);
        input.value = '';
    }
    
     function check (event) {
        event.preventDefault();

        if (event.target.dataset.action !== "check") return;


        const parentNode = event.target.closest('.tasks');
        const check = parentNode.querySelector('#task_check_id');

        const id = Number(parentNode.id);
        
        const task = todos.find(function (task) {
            if (task.id === id ) {
                check.classList.toggle("uncheck");
                return true
            }
        })

        task.done = !task.done;
        check.classList.toggle("check");

        toLocalStorage();
    }
    
    function edit (event) {
        event.preventDefault();

        if (event.target.dataset.action !== "edit_btn") return;

        const parentNode = event.target.closest('.tasks');
        const task_el = parentNode.querySelector('#task-list-input');
      
        const id = Number(parentNode.id);

        const task = todos.find( function (task) {
            if (task.id === id) {
            task_el.toggleAttribute("readonly");
            task_el.focus();
            return true;
            }
        })

        task.text = task_el.value;
        toLocalStorage();
    }
    
    function delete_task (event) {
        event.preventDefault();

        if (event.target.dataset.action !== "delete") return;

        const parentNode = event.target.closest(".tasks");

        const id = Number(parentNode.id);

        todos = todos.filter(function (task) {
            if (task.id === id) {
                return false
            } else {
                return true
            }
        })
        
        parentNode.remove(); 
        toLocalStorage();
    }
           
    function toLocalStorage() {
        localStorage.setItem("todos", JSON.stringify(todos));
    }

})
