var mongoose = require('mongoose'), URLSlugs = require('mongoose-url-slugs'), passportLocalMongoose = require('passport-local-mongoose');

// books
// * includes title, author, genre, and a unique score 
// * (used to generate recommendations)
// * title might change and or include ispn

var Book = new mongoose.Schema({
	title: String,
    genre: String,
    author: String,
    //use this num to match books in diff librariers -- for recommendations
    IDNum: Number,
});

// libraries
// * used initially to store curated libraries
// * each library must have a related admin user
// * a list can have 0 or more items
var Library = new mongoose.Schema({
    name: String,
	books: [Book],
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
});

// users
// * our site requires authentication for specific users (admin)...
// * they also can have 2 lists
var User = new mongoose.Schema({
    username: String,
    password: String,
    libraries:  [{type: mongoose.Schema.Types.ObjectId, ref: 'library'}],
});

Library.plugin(URLSlugs('name'));
User.plugin(passportLocalMongoose);

//registering schema
mongoose.model('User', User);
mongoose.model('Book', Book);
mongoose.model('Library', Library);

var MONGOLAB_URI = 'mongodb://monica:supadupa1@ds023064.mlab.com:23064/what-book-should-i-read';


mongoose.connect(process.env.MONGOLAB_URI, function (error) {
    if (error) console.error(error);
    else console.log('mongo connected');
});
