//main function to be called on submit
function processData() {

    if (!navigator.onLine)
    {
        var firstName = document.querySelector('#product_name');
        var dataString = firstName.value;
        //var dataString = JSON.stringify(formSubmitData);
        //alert("==========="+formSubmitData);
        saveDataLocally(dataString);
        firstName.value = '';
    }
   }

//called on submit if device is online from processData()
function sendDataToServer(dataString) {
    //alert("====datastring======"+dataString);
    var data = {
        commit: "Create Product",
        //            authenticity_token: "A1SFBYS9/7s2btXFHabM80Ro/JOpmwpMUWa336D9UZ0=",
        //       utf8: "✓",
        product: {
            name: dataString
        }

    }
    $.ajax({
        type: "POST",
        url: "/products",
        data: data,
        dataType: "html"
    });
}

//called on submit if device is offline from processData()
function saveDataLocally(dataString) {

    var timeStamp = new Date();
    timeStamp.getTime();

    try {
        localStorage.setItem(timeStamp, dataString);
        alert('Saved locally: ' + dataString + '');
    } catch (e) {

        if (e == QUOTA_EXCEEDED_ERR) {
            console.log('Limit has been exceeded!');
        }
    }




    var length = window.localStorage.length;
    document.querySelector('#local-count').innerHTML = length;
}

//called if device goes online or when app is first loaded and device is online
//only sends data to server if locally stored data exists
function sendLocalDataToServer() {
    var status = document.querySelector('#status');
    status.className = 'online';
    status.innerHTML = 'Online';
    var i = 0,
    dataString = '';
    while (i <= window.localStorage.length - 1) {
        dataString = localStorage.key(i);
        if (dataString) {
            sendDataToServer(localStorage.getItem(dataString));
            window.localStorage.removeItem(dataString);
        }
        else {
            i++;
        }
    }
    document.querySelector('#local-count').innerHTML = window.localStorage.length;
    
}

//called when device goes offline
function notifyUserIsOffline() {
    var status = document.querySelector('#status');
    status.className = 'offline';
    status.innerHTML = 'Offline';
}

//called when DOM has fully loaded
function loaded() {

    //update local storage count
    var length = window.localStorage.length;
    document.querySelector('#local-count').innerHTML = length;

    //if online
    if (navigator.onLine) {

        //update connection status
        var status = document.querySelector('#status');
        status.className = 'online';
        status.innerHTML = 'Online';

        //if local data exists, send try post to server
        if (length !== 0) {
            sendLocalDataToServer();
        }
    }

    //listen for connection changes
    window.addEventListener('online', sendLocalDataToServer, false);
    window.addEventListener('offline', notifyUserIsOffline, false);

    document.querySelector('[type="submit"]').addEventListener('click', processData, false);
}

window.addEventListener('load', loaded, true);