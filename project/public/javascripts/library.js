document.addEventListener("DOMContentLoaded", main);

function main(evt){
    var addLibButton = document.querySelector('#addLibBtn');
    addLibButton.addEventListener('click', addLibs);    
    
    initialLibrary(evt);   
}

/************************************************************/
function initialLibrary(evt){
    
    var req = new XMLHttpRequest();  
    //var url = 'http://i6.cims.nyu.edu:12361/api/admin-home';
    var url = 'http://localhost:3000/api/admin-home';
    req.open('GET', url);
    req.addEventListener('load', function(){
        if (this.status >= 200 && this.status < 400){
            console.log("initial load");     
            var books = JSON.parse(req.responseText);
            addLibList(books);
        }
    });
    req.send();
}

function addLibs(evt){
    evt.preventDefault();
    
    var req = new XMLHttpRequest();
    req.open('POST', '/api/admin-home/create');
    
    req.addEventListener('error', function(){
        console.log(req.responseText);
    });
    
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    
    var libName = document.getElementById('libName').value;
    var data = 'libName='+libName;
    console.log(data);
    
    req.send(data);
    initialLibrary(evt); 
    
}

function addLibList(list){      
    var oldList = document.getElementById('lib-all-list'),
        newList = document.createElement('ul');
    
    newList.setAttribute('id', 'lib-all-list');
    newList.setAttribute('class', 'list-group');
    
    if (list.length == 0) {
        console.log("obj.name");
        var item = document.createElement('li');
        item.setAttribute('class', 'list-group-item'); 

        item.appendChild(document.createTextNode("You don't have any yet"));

        newList.appendChild(item);
    }
    list.forEach(function(obj){
        console.log("obj.name");
        if (obj){
            console.log(obj.name);

            var item = document.createElement('li');
            item.setAttribute('class', 'list-group-item'); 
            
            var link = document.createElement('a');
            link.href = '/admin-library';
            
            link.appendChild(document.createTextNode(obj.name));

            item.appendChild(link);

            newList.appendChild(item);
        } 
    });
    oldList.parentNode.replaceChild(newList, oldList); 
}


/************************************************************/

/*
//Attempt at collapsable List view
function addCollapseItem(num, title, author, genre){
    var id = 'collapse'+num;
    
    var panHeading = document.createElement('div');
    panHeading.setAttribute('class', 'panel-heading');
    
    var panTitle = document.createElement('h4');
    panTitle.setAttribute('class', 'panel-title');
    
    var toggle = document.createElement('a');
    toggle.setAttribute('data-toggle', 'collapse-heading');
    toggle.setAttribute('href', id);
    toggle.appendChild(document.createTextNode(title));
    
    panTitle.appendChild(toggle);
    
    
    var list = document.createElement();       
}
*/
