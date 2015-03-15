var changeFlag = false;
function run() {    
    var appContainer = document.getElementsByClassName("body")[0];
    appContainer.addEventListener("keydown", keyPress);
    appContainer.addEventListener("keyup", delEnter);
    var messages = document.getElementsByClassName("messages")[0];
    messages.addEventListener("click", messageEvent);
}

function keyPress(e) {
    if(e.keyCode == 13) {
        enterPress(e);
    }
}

function delEnter(e) {
    if(e.keyCode == 13) {
        if(e.target.className == "textArea") {
            document.getElementsByClassName("textArea")[0].value="";
        }
        if(e.target.className == "edit-name") {
            document.getElementsByClassName("edit-name")[0].value="";
        }
    }
}
function messageEvent(e) {
    var element = e.target;
    if(element.classList.contains("del-button") ) {
        deleteMessage(element.parentElement);    
    }
    if(element.classList.contains("change-message-button")) {
        if(!changeFlag)
            beginChangeMessage(element.parentElement);  
        else endChangeMessage(e);
        
    }
}

function deleteMessage(oneMessage) {
    oneMessage.parentElement.removeChild(oneMessage);
    oneMessage.remove();    
}

function beginChangeMessage(oneMessage) {
    var divText = oneMessage.childNodes[3];
    var text = divText.innerHTML;
    var textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.classList.add("temp-area");
    divText.innerHTML = null;
    divText.appendChild(textArea, divText);
    changeFlag = true;
}

function endChangeMessage(e) {
    var area = document.getElementsByClassName("temp-area")[0];
    var text = area.value;
    var parentDiv = area.parentElement;
    parentDiv.removeChild(area);
    parentDiv.innerHTML = text;
    changeFlag = false;
}

function enterPress(e) {
    if(e.target.className == "textArea") {
        onClickSendMessage();
    }
    if(e.target.className == "edit-name") {
        onClickChange();
    }
    if(e.target.className == "temp-area") {
        endChangeMessage(e);
    }
}

function onClickChange() {
    var textArea = document.getElementsByClassName("edit-name")[0];
    if(textArea.value != "") {
        document.getElementById("userName").innerHTML =
            textArea.value;
        textArea.value = "";
    }
}

function onClickSendMessage() {
    var message = document.getElementsByClassName("textArea")[0];
    addMessage(message.value);
    message.value = "";
    var messages = document.getElementsByClassName("messages")[0];
    messages.scrollTop = messages.scrollHeight;
}

function addMessage(text) {
    if (!text) {
        return;
    }
    var message = createMessage(text);
    var messages = document.getElementsByClassName("messages")[0];
    messages.appendChild(message);
}

function createMessage(text) {
	var oneMessage = document.createElement("div"); 
	oneMessage.classList.add("oneMessage");
    
    var userName = document.createElement("div");
    userName.classList.add("user-name");
    var name = document.getElementById("userName").innerText;
    userName.innerHTML = name;
    oneMessage.appendChild(userName);
        
    var delSpan = document.createElement("span");
    delSpan.classList.add("glyphicon");
    delSpan.classList.add("glyphicon-remove");    
    delSpan.classList.add("del-button");
    oneMessage.appendChild(delSpan);
    
    var changeSpan = document.createElement("span");
    changeSpan.classList.add("glyphicon");
    changeSpan.classList.add("glyphicon-pencil");    
    changeSpan.classList.add("change-message-button");
    oneMessage.appendChild(changeSpan);
    
    var textMessage = document.createElement("div");
	textMessage.classList.add("text-message"); 
	textMessage.innerHTML = text; 
    oneMessage.appendChild(textMessage);
    
    return oneMessage;
}