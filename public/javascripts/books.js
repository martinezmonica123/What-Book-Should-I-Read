document.addEventListener("DOMContentLoaded", main);

function main(evt){
    var addButton = document.querySelector('#addBtn');
    addButton.addEventListener('click', addtoLib);
    
    initialBooks(evt);
}


function initialBooks(evt){
    var req = new XMLHttpRequest();  
    //var url = 'http://i6.cims.nyu.edu:12361/api/admin-library';
    var url = 'http://localhost:3000/api/admin-library';
    req.open('GET', url);
    req.addEventListener('load', function(){
        if (this.status >= 200 && this.status < 400){
            console.log("initial load");     
            var books = JSON.parse(req.responseText);
            addLibBookList(books);
            document.getElementById("defaultBooks").reset();
            document.getElementById("suggestionBooks").reset();
        }
    });
    req.send();
}

// add books to library 
function addtoLib(evt){
    evt.preventDefault();
    
    var req = new XMLHttpRequest();
    req.open('POST', '/api/admin-library/books/add-def');
    
    req.addEventListener('error', function(){
        console.log(req.responseText);
    });
    
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    
// FIGURE OUT HOW TO LOOP ALL OF THESE BC DAMN    
    // For Default Lib
    var title1 = document.getElementById('defTitle1').value;
    var author1 = document.getElementById('defAuthor1').value;
    var genre1 = document.getElementById('defGenre1').value;
    var id1 = document.getElementById('def_id_num1').value;
    
  
    var title2 = document.getElementById('defTitle2').value;
    var author2 = document.getElementById('defAuthor2').value;
    var genre2 = document.getElementById('defGenre2').value;
    var id2 = document.getElementById('def_id_num2').value;
    
    var title3 = document.getElementById('defTitle3').value;
    var author3 = document.getElementById('defAuthor3').value;
    var genre3 = document.getElementById('defGenre3').value;
    var id3 = document.getElementById('def_id_num3').value;
    
    // For Suggestions Lib
    var sugtitle1 = document.getElementById('sugTitle1').value;
    var sugauthor1 = document.getElementById('sugAuthor1').value;
    var suggenre1 = document.getElementById('sugGenre1').value;
    var sugid1 = document.getElementById('sug_id_num1').value;
    
  
    var sugtitle2 = document.getElementById('sugTitle2').value;
    var sugauthor2 = document.getElementById('sugAuthor2').value;
    var suggenre2 = document.getElementById('sugGenre2').value;
    var sugid2 = document.getElementById('sug_id_num2').value;
    
    var sugtitle3 = document.getElementById('sugTitle3').value;
    var sugauthor3 = document.getElementById('sugAuthor3').value;
    var suggenre3 = document.getElementById('sugGenre3').value;
    var sugid3 = document.getElementById('sug_id_num3').value;
    
    
    var data ='defTitle1='+title1+'&defAuthor1='+author1+'&defGenre1='+genre1+'&def_id_num1='+id1+'&defTitle2='+title2+'&defAuthor2='+author2+'&defGenre2='+genre2+'&def_id_num2='+id2+'&defTitle3='+title3+'&defAuthor3='+author3+'&defGenre3='+genre3+'&def_id_num3='+id3+'&sugTitle1='+sugtitle1+'&sugAuthor1='+sugauthor1+'&sugGenre1='+suggenre1+'&sug_id_num1='+sugid1+'&sugTitle2='+sugtitle2+'&sugAuthor2='+sugauthor2+'&sugGenre2='+suggenre2+'&sug_id_num2='+sugid2+'&sugTitle3='+sugtitle3+'&sugAuthor3='+sugauthor3+'&sugGenre3='+suggenre3+'&sug_id_num3='+sugid3;
    
    console.log(data);
    
    req.send(data);
    initialBooks(evt);    
}

function addLibBookList(list){      
    var oldList = document.getElementById('lib-list'),
        newList = document.createElement('ul');
    
    newList.setAttribute('id', 'lib-list');
    newList.setAttribute('class', 'list-group');
    
    list.forEach(function(obj){
         if (obj.hasOwnProperty('books')){
            for (var prop in obj) {
                if (prop == 'books') {
                    for (var i=0; i<obj.books.length; i++){                
                        var item = document.createElement('li');
                        item.setAttribute('class', 'list-group-item');
                        
                        if (obj.books[i].title != undefined) {
                            item.appendChild(
                                document.createTextNode(
                                    obj.books[i].title + " - " + obj.books[i].author + " - " + obj.books[i].IDNum));  
                            newList.appendChild(item);            
                        }
                    }
                }
            }
         }       
    });
    oldList.parentNode.replaceChild(newList, oldList);      
}

function clearForm() {
    var form = arguments[0];
    var inputs = form.getElementsByTagName('input');
    
    for(var i = 0; i < inputs.length; i++) {
        if(inputs[i].type == 'text') {
            inputs[i].value = '';
        }
    }
}
