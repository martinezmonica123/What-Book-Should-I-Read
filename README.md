
# What Book Should I Read?

## Overview

'What Should I Read' is a web app designed to reduce the stress of having to figure out what book one should read next. Having so many choices and limited time, 'What Should I Read' aims to provide quick suggestions from curated lists -- By doing so we not only make the choosing process easier but we also guarantee that the recommendations are books worth reading!

The way the app works is that it uses past user reading history (from a concise list) in order to recommend options that fit their reading patters. We also offer the ability to refine preferences to provide new insights on what you might want to read. And if the user is feeling advenrtures, we also offer an Editor's Pick option to immediately have a suggestion!


## Data Model

Minimally, we'll have to store Users, Libraries and Books

* users have two lists: a User-Library and a Reading-List
* each list has multiple Book items
* admins also have a library which is collection of lists of books

First draft schema:

```javascript
// users
// * our site requires authentication for specific users (admin)...
// * they also can have 2 lists
var User = new mongoose.Schema({
  // username, password for admin provided by plugin  
  name: {type: String, required: true},
  reading-list:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  user-library:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  admin-library:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Library' }]
});

// books
// * includes title, author, genre, and a unique score (used to generate recommendations)
// * title might change and or include ispn
var Book = new mongoose.Schema({
	title: {type: String, required: true},
    genre: {type: String, required: true},
    author: {type: String, required: true},
	score: {type: Number, required: true},
});

// libraries - used initially to store curated libraries
// * each library must have a related user
// * a list can have 0 or more items
var Library = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
    name: {type: String, required: true},
	books: [Book],
    checked: {type: Boolean, default: false, required: true}
});
```

## Wireframes

![Main Page](documentation/MainPage-About.png)
![User Library](documentation/UserLibrary-UserInput.png)
![Suggestions](documentation/Suggestions-Output.png)

## Sitemap
![Sitemap](documentation/Sitemap-Basic.png)


## User Stories

* As a user, I want a simple book recommendation so that I can figure out what to read.
* As a user, I want a more personal book recommendaion so that I can figure out what to read.
* As an admin-user, I want to populate the site database so that I can provide a curated book list.

## Technologies

* Integrate user authentication using Passport 
* CSS framework - Bootstrap
* Google Books API

