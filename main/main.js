let a = [];
let numpage = 1;
let sizebaze = 3;
let serverdata;
let maxpage;
let sortfield = ['id', 'username', 'email', 'status'];
let sortdirection = ['asc', 'desc'];
let sf = 0;
let sd = 0;
let temporaltoken = 0;
let print_id;
var promise;

GiveData(sf, sd);

function GiveData(sf, sd) {
    promise = $.ajax({
        method: 'GET',
        url: 'https://uxcandy.com/~shapoval/test-task-backend/v2/?developer=Vladimir_Zeveke&sort_field='+sortfield[sf]+'&sort_direction='+sortdirection[sd]+'&page='+numpage
    }).then(function (result){
        serverdata = result;
        maxpage = serverdata.message.total_task_count/sizebaze;
        let x = serverdata.message;
        for (let i=0; i<sizebaze; i++) { 
            if (x.tasks[i] !== undefined) {
                a[i] = new Array(); 
                a[i][0] = x.tasks[i].username;
                a[i][1] = x.tasks[i].email;
                a[i][2] = x.tasks[i].text;
                a[i][3] = x.tasks[i].status;
                a[i][4] = x.tasks[i].id;
            } else {
                a[i] = undefined;
            }
        }
        DrawList();
    })
    RefreshBox();
}

function DrawList() {
    document.getElementById("numberpage").textContent = numpage;
    for (let i=0; i<sizebaze; i++) {
        if (a[i] != undefined) {
            let mess = document.createElement('div');
            mess.className = "strmess";
            mess.innerHTML = mess.innerHTML+"<div class='usernamecard'>"+a[i][0]+"</div>";
            mess.innerHTML = mess.innerHTML+"<div class='emailcard'>"+a[i][1]+"</div>";
            mess.innerHTML = mess.innerHTML+"<div class='textcard'>"+a[i][2]+"</div>";
            mess.innerHTML = mess.innerHTML+"<div name='statuscard' class='statuscard'>"+a[i][3]+"</div>";
            mess.innerHTML = mess.innerHTML+"<input id="+i+" class='confirmcard' type='image' onclick='ButtonClick(this.id)'>";
            mess.innerHTML = mess.innerHTML+"<input name="+i+" class='confirmcard' type='image' src='https://cdn.icon-icons.com/icons2/569/PNG/128/pen-black-diagonal-symbol-of-writing-tool_icon-icons.com_54470.png' onclick='WinEditData(this.name)'>";
            document.getElementById("box").append(mess);
             ButtonUpdate();
        }
    }
}

function LeftPage() {
    if (numpage > 1) {
        numpage--;
        document.getElementById("numberpage").textContent = numpage;
        GiveData(sf, sd);
    }
}

function RightPage() {
    if (numpage < maxpage) {
        numpage++;
        document.getElementById("numberpage").textContent = numpage;
        GiveData(sf, sd);
    }
}

function RefreshBox() {
    document.getElementById("box").remove(document.getElementsByClassName("strmess"));
    let box = document.createElement('div');
    box.className = "box";
    box.id = "box";
    box.innerHTML = "";
    document.getElementById("table").append(box);
}

function ButtonClick(clicked_id) {
    if (serverdata.message.tasks[clicked_id].status < 10) {
        serverdata.message.tasks[clicked_id].status = serverdata.message.tasks[clicked_id].status + 10;
    }
    else {
        serverdata.message.tasks[clicked_id].status = serverdata.message.tasks[clicked_id].status - 10;
    }
    var form = new FormData();
    form.append("status", serverdata.message.tasks[clicked_id].status);
    form.append("token", temporaltoken);
        $.ajax({
        url: 'https://uxcandy.com/~shapoval/test-task-backend/v2/edit/'+serverdata.message.tasks[clicked_id].id+'?developer=Vladimir_Zeveke',
        crossDomain: true,
        method: 'POST',
        mimeType: "multipart/form-data",
        contentType: false,
        processData: false,
        data: form,
        dataType: "json",
        success: function(data) {
            ButtonUpdate();
            GiveData(sf, sd);
        }
    })
}

function WinEditData(clicked_id) {
    print_id = clicked_id;
    let winedit = document.createElement('div');
            winedit.className = "strmess";
            winedit.id = "winedit"
            winedit.innerHTML = winedit.innerHTML+"<input class='textcard'></input>";
            winedit.innerHTML = winedit.innerHTML+"<input class='confirmcard' type='image' src='https://image.flaticon.com/icons/png/512/1828/1828710.png' onclick='EditData(print_id)'>";
            document.getElementById("box").append(winedit);
}

function EditData(clicked_id) {
	if ((serverdata.message.tasks[clicked_id].status == 0) || (serverdata.message.tasks[clicked_id].status == 10)) {
        serverdata.message.tasks[clicked_id].status = serverdata.message.tasks[clicked_id].status + 1;
    }
    let databufer = document.getElementById("winedit");
    var form = new FormData();
    form.append("text", databufer.childNodes[0].value);
	form.append("status", serverdata.message.tasks[clicked_id].status);
	form.append("token", temporaltoken);
    $.ajax({
        url: 'https://uxcandy.com/~shapoval/test-task-backend/v2/edit/'+serverdata.message.tasks[clicked_id].id+'?developer=Vladimir_Zeveke',
        crossDomain: true,
        method: 'POST',
        mimeType: "multipart/form-data",
        contentType: false,
        processData: false,
        data: form,
        dataType: "json",
        success: function(data) {
            GiveData(sf, sd);
        }
    })
}

function ButtonUpdate() {
    let arr = Array.from(document.getElementById("box").children);
    arr.forEach(el => {
        if (el.childNodes[3].textContent >= 10) {
            el.childNodes[4].src = "https://image.flaticon.com/icons/png/512/1828/1828759.png";
            el.childNodes[4].className = "confirmcard";
        }
        else {
            el.childNodes[4].src='https://image.flaticon.com/icons/png/512/1828/1828651.png';
            el.childNodes[4].className = "confirmcard";
        }
    });
}

function addQwest() {
    $(document).ready(function() {
        var form = new FormData();
        form.append("username", document.getElementById("username").value);
        form.append("email", document.getElementById("email").value);
        form.append("text", document.getElementById("text").value);

        $.ajax({
            url: 'https://uxcandy.com/~shapoval/test-task-backend/v2/create?developer=Vladimir_Zeveke',
            crossDomain: true,
            method: 'POST',
            mimeType: "multipart/form-data",
            contentType: false,
            processData: false,
            data: form,
            dataType: "json",
            success: function(data) {
                console.log(data);
            }
        });
    });
}

function MasterSort(mode, x) {
    if (x == 0) {
        sf = mode;
    }
    else {
        sd = mode;
    }
    GiveData(sf, sd);
}

function addLogWin() {
    document.getElementById("loginwinbutton").remove(document.getElementsByClassName("strmess"));

    let loginwindow = document.createElement('div');
    loginwindow.className = "sendform";
    loginwindow.id = "logingenerate"
    loginwindow.innerHTML = `<div id='loginwindow'>
    <h1>Вход</h1>
    <div class="loginblock">
        <form name="logform" method="post">
            <p class="inputname">Логин: </p><input id="login"/><br>
            <p class="inputname">Пароль: </p><input id="password" type="password"/><br><br>
            <div class="inputbutton">
            <input type="button" value="submit" onclick='ButtonClickLog()'/>
            </div>
        </form>
    </div>
</div>`;
    document.getElementById("logwin").append(loginwindow);
}

function ButtonClickLog() {
    let login = document.getElementById('login').value;
    let password = document.getElementById('password').value;

    var form = new FormData();
    form.append("username", login);
    form.append("password", password);

    $.ajax({
        url: 'https://uxcandy.com/~shapoval/test-task-backend/v2/login/?developer=Vladimir_Zeveke',
        crossDomain: true,
        method: 'POST',
        mimeType: "multipart/form-data",
        contentType: false,
        processData: false,
        data: form,
        dataType: "json",
        success: function(data) {
            temporaltoken = data.message.token;
            document.getElementById("logingenerate").remove(document.getElementsByClassName("strmess"));
            GiveData(sf, sd);
        }
    });
}