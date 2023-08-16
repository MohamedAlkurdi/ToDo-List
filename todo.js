const plusBtn = document.querySelector(".plusBtn");
const inputBoard = document.querySelector(".input-board");
const editBoard = document.querySelector(".edit-board");
const titleInput = document.getElementById("title-input");
const detailsInput = document.getElementById("details-input");
const titleEdit = document.getElementById("title-edit");
const detailsEdit = document.getElementById("details-edit");
const addBtn = document.getElementById("addBtn");
const tasksList = document.querySelector(".list");
const detailsContent = document.querySelector(".details-content");
const editBoradBtn = document.getElementById("editBoradBtn");
let tasksArray = [];
const taskInfo = {
    id:new Date().getTime(),
    title:"",
    details:"",
    complete:false,
}
let editedTitle = taskInfo.title ;
let editedDetails = taskInfo.details;
function generateAppropriateBgColor(length){
    let key = length%5;
    switch(key){
        case 0:
            return 'background-color:rgba(240, 128, 128,0.5)';
        case 1:
            return 'background-color:rgba(171, 240, 128, 0.5)';
        case 2:
            return 'background-color:rgba(128, 208, 240, 0.5)';
        case 3:
            return  'background-color:rgba(201, 128, 240, 0.5)';
        case 4:
            return  'background-color:rgba(240, 234, 128, 0.5);';
        default:
        break;
    }
}
function checkInput(value){
    return value === undefined || value === "";
}
plusBtn.addEventListener("click",()=>{
    inputBoard.classList.remove("none");
})
document.addEventListener("click",(e)=>{
    if(e.target.classList.contains("input-board") || e.target.classList.contains("edit-board")){
        e.target.classList.add("none")
    }
    if(e.target.parentElement.classList.contains("details")){
        e.target.parentElement.nextElementSibling.classList.toggle("grow");
    }
    calculateStats();
})
titleInput.addEventListener("blur",()=>{
    if(titleInput.value !== undefined){
        taskInfo.title = titleInput.value;
        console.log("oops")
    }
    else{
        console.log("not oops")
    }
})
detailsInput.addEventListener("blur",()=>{
    if(titleInput.value !== undefined){
        taskInfo.details = detailsInput.value;
        console.log("oops")
    }
})
titleEdit.addEventListener("blur",()=>{
    editedTitle = titleEdit.value;
})
detailsEdit.addEventListener("blur",()=>{
    editedDetails = detailsEdit.value;
})
addBtn.addEventListener("click",(e)=>{
    const {title,details,id,complete} = taskInfo;
    e.preventDefault();
    if(checkInput(title)||checkInput(details)){
        console.log(title)
        console.log(details)
        alert("u cant leave the fields empty")
    }else{
    inputBoard.classList.add("none"); // hiding the input page
    titleInput.value=""; // resetting the inputs fields to the default case
    detailsInput.value=""; // resetting the inputs fields to the default case
    let storedTaskInfo = JSON.stringify(taskInfo);
    localStorage.setItem(id,storedTaskInfo)
    location.reload();
}
})
function createTask(taskInfo,bgColor,taskKey){
    let task = `
    <div style='${bgColor}' class="task user-oriented" data-id="${taskKey}" data-complete=${taskInfo.complete}  >
                <div class="task-title">
                <p>${taskInfo.title}</p>
                <ul>
                    <li class="check" style="background-color: gray;"><i class="fa-solid fa-check"></i></li>
                    <li class="edit" style="background-color: rgb(154 77 226);" ><i class="fa-solid fa-pen"></i></li>
                    <li class="delete" style="background-color: rgb(216 60 60);"><i class="fa-solid fa-trash"></i></li>
                </ul>
                </div>
                <div class="task-details">
                    <div class="details"><i class="fa-solid fa-angle-down"></i><p>details</p></div>
                    <p class="details-content">
                        ${taskInfo.details}
                    </p>
                </div>
            </div>`
    return task;
}
function displyTasks(){
    const tasksKeys = Object.keys(localStorage)
    tasksKeys.sort((a, b) => parseInt(a) - parseInt(b));
    for(let i = 0;i<tasksKeys.length;i++){
        let taskKey =  tasksKeys[i];
        const bgColor = generateAppropriateBgColor(i);
        const storedTaskInfo = JSON.parse(localStorage.getItem(taskKey));
        let taskMarkup =createTask(storedTaskInfo,bgColor,taskKey,storedTaskInfo.complete);
        tasksList.innerHTML+=taskMarkup;
    }
    setAsComplete()
}
window.onload = ()=>{
    displyTasks();
    const deleteBtns = Array.from(document.querySelectorAll(".delete"));
    const checkBtns = Array.from(document.querySelectorAll(".check"));
    const editBtns = Array.from(document.querySelectorAll(".edit"));
    deleteBtns.forEach((deleteBtn)=>{
        deleteBtn.addEventListener("click",(e)=>{
            const task = e.target.closest(".task");
            const taskId = task.dataset.id;
            localStorage.removeItem(taskId);
            task.remove();
        })
    })
    checkBtns.forEach((checkBtn)=>{
        checkBtn.addEventListener("click",(e)=>{
            let task = e.target.closest(".task");
            let id = task.dataset.id;
            let editedObject = JSON.parse(localStorage.getItem(id)); 
            editedObject.complete = true; 
            localStorage.setItem(id, JSON.stringify(editedObject)); 
            task.setAttribute("data-complete",true);
            task.querySelector("p").classList.add("lineThroughTitle");
            task.querySelector(".check").style.backgroundColor="rgb(60 168 60)";
            task.querySelector(".edit").style.backgroundColor="gray";
            task.querySelector(".edit").style.pointerEvents="none";
        })
        calculateStats()
    })
    editBtns.forEach(btn=>{
    btn.addEventListener("click",()=>{
        const task = btn.closest(".task");
        const taskId = task.dataset.id;
        editBoard.classList.remove("none");
        editBoradBtn.addEventListener("click",(e)=>{
            e.preventDefault();
            console.log("clicked")
            editBoard.classList.add("none");
            const extractedItemFromStorage =JSON.parse(localStorage.getItem(taskId));
            console.log(extractedItemFromStorage);
            if(!checkInput(editedTitle)) extractedItemFromStorage.title = editedTitle;
            if(!checkInput(editedDetails)) extractedItemFromStorage.details = editedDetails;
            console.log(extractedItemFromStorage)
            localStorage.setItem(taskId, JSON.stringify(extractedItemFromStorage));
            location.reload()
        })
    })
})
calculateStats()
}
function setAsComplete(){
    const allTasks = document.querySelectorAll(".task");
    allTasks.forEach(task=>{
        if(task.dataset.complete === "true"){
            task.querySelector("p").classList.add("lineThroughTitle");
            task.querySelector(".check").style.backgroundColor="rgb(60 168 60)";
            task.querySelector(".edit").style="background-color:gray;pointer-event:none;";
        }
    })
}
function calculateStats(){
    let tasksNumber = localStorage.length;
    let completeTasksNumber=0;
    let incompleteTasksNumber=0;
    let objectsInStorage = Object.keys(localStorage);
    for(let i =0;i<objectsInStorage.length;i++){
    const object = JSON.parse(localStorage.getItem(objectsInStorage[i]));
    if(object.complete === "false" || object.complete === false){
        incompleteTasksNumber++;
    }else{
        completeTasksNumber++;
    }}
    document.querySelector("#allTasksNumber span").innerText = tasksNumber;
    document.querySelector("#finishedTasksNumber span").innerText = completeTasksNumber;
    document.querySelector("#unFinishedTasksNumber span").innerText = incompleteTasksNumber;
}