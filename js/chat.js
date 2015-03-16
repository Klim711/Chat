var generateId = function () {
	var date = Date.now();
	var random = Math.random() * Math.random();

	return Math.floor(date * random).toString();
};

var theMessage = function (text1, text2) {
    return {
        name: text1,
        textOfMessage: text2,
        id: generateId(),
        master: false
    };
};

var allMessages = [];

function run() {    
    var appContainer = document.getElementsByClassName("body")[0];
    appContainer.addEventListener("keydown", keyPress);
    appContainer.addEventListener("keyup", delEnter);
    
    var messages = document.getElementsByClassName("messages")[0];
    messages.addEventListener("click", messageEvent);
    
    var resMessages = restoreMessages();    
    createAllMessages(resMessages);
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

var changeFlag = false;

function messageEvent(e) {
    var element = e.target;
    if(element.parentElement.master == true) {
        if(element.classList.contains("del-button") ) {
            deleteMessage(element.parentElement);    
        }
        if(element.classList.contains("change-message-button")) {
            if(!changeFlag)
                beginChangeMessage(element.parentElement);  
            else endChangeMessage(e);        
            }
    }
}

function deleteMessage(oneMessage) {
    oneMessage.parentElement.removeChild(oneMessage);
    oneMessage.remove();
    for(var i = 0; i < allMessages.length; ++i) {
        if(oneMessage.id == allMessages[i].id) {
            allMessages.splice(i, 1);
            storeMessages();
        }
    }
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
    parentDiv = parentDiv.parentElement;
    for(var i = 0; i < allMessages.length; ++i) {
        if(parentDiv.id == allMessages[i].id) {
            allMessages[i].textOfMessage = text;
            storeMessages();
        }
    }
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
    var name = document.getElementById("userName");
    var theMes = theMessage(name.innerHTML, message.value);
    theMes.master = true;
    addMessage(theMes);
    
    message.value = "";
    var messages = document.getElementsByClassName("messages")[0];
    messages.scrollTop = messages.scrollHeight;
    
}

function addMessage(theMes) {
    if (!theMes.textOfMessage) {
        return;
    }
    var message = createMessage(theMes);
    message.id = theMes.id;
    message.master = theMes.master;
    var messages = document.getElementsByClassName("messages")[0];
    messages.appendChild(message);
    allMessages.push(theMes);
    storeMessages();
}

function createMessage(theMes) {
	var oneMessage = document.createElement("div"); 
	oneMessage.classList.add("oneMessage");
    
    var userName = document.createElement("div");
    userName.classList.add("user-name");
    userName.innerHTML = theMes.name;
    oneMessage.appendChild(userName);
    
    if(theMes.master) {
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
    }
    var textMessage = document.createElement("div");
	textMessage.classList.add("text-message"); 
	textMessage.innerHTML = theMes.textOfMessage; 
    oneMessage.appendChild(textMessage);
    
    return oneMessage;
}

function storeMessages() {
    if(typeof(Storage) == "undefined") {
		alert('localStorage is not accessible');
		return;
	}
    
    localStorage.setItem("Chat messages", JSON.stringify(allMessages));
}

function restoreMessages() {
    if(typeof(Storage) == "undefined") {
		alert('localStorage is not accessible');
		return;
	}
    
    var item = localStorage.getItem("Chat messages");
    return item && JSON.parse(item);
}

function createAllMessages (messages){
    if(messages != null) {        
        for(var i = 0; i < messages.length; i++) {
            if(messages[i].master == true) {
                document.getElementById("userName").innerHTML = messages[i].name;
            }
            addMessage(messages[i]);   
        }
    }
}