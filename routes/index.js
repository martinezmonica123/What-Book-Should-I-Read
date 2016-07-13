var express = require('express');
var mongoose = require('mongoose'), passport = require('passport');
var googleBooks = require('google-books-search');


var router = express.Router();

var Library = mongoose.model('Library'), User = mongoose.model('User');

//based on stackoverflow post
function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/');
    }
}

/********************************************************************/

// FIX MENU BAR TO ALLOW FOR DIFF BUTTONS DEPENDING ON PAGE AND ON ADMIN-USER

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'What Book Should I Read?'});
});


router.get('/admin-home', loggedIn, function(req, res){
    res.render('admin-home', {'user': req.user.username});
});


router.post('/initial', function(req, res){
    var guest = req.body.guestName;
    console.log(guest);
    Library.findOne({'name': 'Default'}, function(err, books, count){
        if (!err){
            res.render('library', {'defaultLib': books, 'guest': guest});
        } else {
            console.log(err);
            res.send(err);
        }
    });  
});

//page to add books to User Library -- if admin
router.get('/admin-library', loggedIn, function(req, res){
    res.render('admin-library', {});
});

/********************************************************************/

router.get('/api/admin-library', function(req, res){ 
    Library.find({'name': 'Default'}, function(err, books, count){
        res.json(books);
    });                                      
});

router.post('/api/admin-library/books/add-def', function(req, res){

    Library.findOneAndUpdate({'name': 'Default'}, {'$pushAll': {'books':[{'title': req.body['defTitle1'], 'author': req.body['defAuthor1'], 'genre': req.body['defGenre1'], 'IDNum': req.body['def_id_num1']}, {'title': req.body['defTitle2'], 'author': req.body['defAuthor2'], 'genre': req.body['defGenre2'], 'IDNum': req.body['def_id_num2']},{'title': req.body['defTitle3'], 'author': req.body['defAuthor3'], 'genre': req.body['defGenre3'], 'IDNum': req.body['def_id_num3']}]}}, function(err, saved_lib, count){
        if(err){
            res.send(500, 'Error Occured: Database Error.');
        } else {
            console.log('DEFAULT worked');
        }
    });
    
    Library.findOneAndUpdate({'name': 'Suggestions'}, {'$pushAll': {'books':[{'title': req.body['sugTitle1'], 'author': req.body['sugAuthor1'], 'genre': req.body['sugGenre1'], 'IDNum': req.body['sug_id_num1']}, {'title': req.body['sugTitle2'], 'author': req.body['sugAuthor2'], 'genre': req.body['sugGenre2'], 'IDNum': req.body['sug_id_num2']},{'title': req.body['sugTitle3'], 'author': req.body['sugAuthor3'], 'genre': req.body['sugGenre3'], 'IDNum': req.body['sug_id_num3']}]}}, function(err, saved_libsug, count){
        if(err){
            res.send(500, 'Error Occured: Database Error.');
        } else {
            console.log('SUGGESTION worked');
            res.json({id:saved_libsug._id});
        }
    }); 
});

router.get('/api/admin-home', function(req, res){
    Library.find({'creator': req.user}, function(err, libs, count){
        res.json(libs);
    });
});

router.post('/api/admin-home/create', function(req, res){
    var library = new Library({
        'creator': req.user,
        'name': req.body.libName,
    });
    library.save(function(err, saved_library, count){
        if (err){
            res.send(500, 'Error Occured: Database Error.');
        } else {
            console.log(req.body.libName + " worked");
            res.json({id:saved_library._id});    
        }
    });   
});

/*****************************************************************************/


/* GET Admin Login */
router.get('/admin-login', function(req,res){
    res.render('admin-login', { title: 'What Book Should I Read?'});
});

//post-login
router.post('/admin-login', function(req, res){
    passport.authenticate('local', function(err, user){
        if (user){
            req.login(user, function(err){
                console.log(req.session.passport.user);
                //res.render('index', {'user': req.user.username});
                //req.session.name = req.user.username;
                res.redirect('/admin-home');
            });
        } else {
            res.render('admin-login', {'message': 'Your login information is incorrect - Please try again.'});
        }
    })(req, res);
});

/* GET Admin Register */
router.get('/admin-register', function(req,res){
    res.render('admin-register', { title: 'What Book Should I Read?'});
});

//post-register
router.post('/admin-register', function(req, res){
    User.register(new User({'username': req.body.username}), req.body.password, function(err, user){
        if (err){
            return res.render('admin-register', {'message': 'Your registration information is incorrect - Please try again.'});
        } else {
            passport.authenticate('local')(req, res, function () {
            res.redirect('/admin-home');
            });
        }                    
    });
});

/* GET Logout */
router.get('/logout', function(req,res){
    req.logout();
    res.redirect('/');
});


/*****************************************************************************/


router.get('/library', function(req, res){   
    Library.findOne({'name': 'Default'}, function(err, books, count){
        if (!err){
            res.render('library', {'defaultLib': books});
        } else {
            console.log(err);
            res.send(err);
        }
    });   
});


router.post('/default-library', function(req, res){

    var checkedBooks = req.body.userBooks;
    var random = []; 
    var temp = [];
    
    if (Array.isArray(checkedBooks)){
        shuffle(checkedBooks);
    } 
    
    if(!Array.isArray(checkedBooks)){
        random.push(checkedBooks);
    }else {
        if (checkedBooks.length > 3){
            random.push(checkedBooks[0]);
            random.push(checkedBooks[1]);
            random.push(checkedBooks[2]);
        } else {
            random.push(checkedBooks[0]);
            random.push(checkedBooks[1]);
        } 
    }

    Library.findOne({'name': 'Default'}, function(err, lib, count){     if (!err){
            console.log(lib.books[0].title);
            console.log(lib.books.length);
            for (var i=0; i < random.length; i++){
                for (var j=0; j<lib.books.length; j++){
                    if (random[i] == lib.books[j]._id){
                        console.log(lib.books[j]._id);
                        temp.push(lib.books[j]);
                    }
                }
            }
            res.render('library-favs', {'books': temp});
        } else {
            console.log(err);
            res.send(err);
        }
    });
});


router.post('/results', function(req, res){
    
    var favorite = req.body.favorite;
    console.log(favorite);
    var temp = '';
    
    Library.findOne({'name':'Suggestions'}, function(err, lib, count){
        if (!err){
            for (var i=0; i<lib.books.length; i++){
                if(favorite == lib.books[i].IDNum){
                    temp = lib.books[i].title;
                }
            } 
            googleBooks.search(temp, function(err, results) {
                if ( !err) {
                    res.render('results', {'results': results[0]});
                } else {
                    console.log('google books problem');
                    console.log(error);
                }
            });
        } else {
            console.log(err);
            res.send(err);
        }    
    });
});

/*****************************************************************************/

function shuffle(array) {
  var currIndex = array.length, tempValue, randIndex;

  while (0 !== currIndex) {
    randIndex = Math.floor(Math.random() * currIndex);
    currIndex -= 1;

    tempValue = array[currIndex];
    array[currIndex] = array[randIndex];
    array[randIndex] = tempValue;
  }
  return array;
}


module.exports = router;








