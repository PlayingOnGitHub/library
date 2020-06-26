let myLibrary = [];

function Book( author, title, readStatus, src, currentId, ) {
    // the constructor...
    // give the book properties of author, title, number of pages, whether it’s been read.
    this.author = author;
    this.title = title;
    this.readStatus = readStatus;
    this.src = src;
    this.currentId = currentId;
}

Book.prototype.addBookToDatabase = function( doc ) {
    console.log(this);
}

Book.prototype.deleteBookFromDatabase = function( documentId ) {
    /* documentId will be the element. I can get the data-attribute tag from documentId or from "this" possibly */
    /* find database-document that has an id equal to documentId */
    /* deleteFromDatabase( documentId ); */
    /* render(); */
}

Book.prototype.updateBookContentToDatabase = function ( book, theUpdate, typeOfChange ) { /* book | returnedUrl or readStatus | typeOfChange -> readStatus or image */
    if ( typeOfChange == "image" ) {
        /* make updates to database */
    }
    else if ( typeOfChange == "readStatus" ) {
        /* make updates to database */
    }
    render();
}

Book.prototype.getDatabaseUpdates = function( snapshot ) {
    /* render will call this */
    myLibrary = [];
    let i = 0;
    snapshot.forEach( (book) => {
        /* update library[] with book objects */
        myLibrary.push(book.data());
        let responseText = "Updated " + i + " times";
        console.log(responseText);
        i++;
    } );
}

function addBookToLibrary() {
    let author = document.getElementById("author").value;
    let title = document.getElementById("title").value
    let readStatus = document.getElementById("readStatus").checked;
    document.getElementById("author").value = "";
    document.getElementById("title").value = "";
    document.getElementById("readStatus").checked = false;
        if ( author == "" || title == "" ) {
            return false;
        }
        if ( readStatus ) {
            readStatus = "Yes";
        }
        else {
            readStatus = "No";
        }
    let myBook = new Book( author, title, readStatus, "default.jpg" );
    addToDatabase( myBook );
    getAnImage( title );  /*.then( () => render() ); /* see if this renders... otherwise, just put render in getAnImage() function */
    /* get an Image also renders at the end */

}

function getAnImage( title ) {
    /* updates library locally and then re-renders using everything using render() function */
    let proxyurl = "https://cors-anywhere.herokuapp.com/";
    let url = "https://www.bookshare.org/search?keyword=" + title;
    let failed = false;
    let returnedUrl = "";
    fetch(proxyurl + url)
    .then(response => response.text())
    .then(contents => { 
        let regex = "cover-image-search\" src=\".*?\"";
        regex = new RegExp( regex, "mgi" );
        let aMatch = contents.match(regex);
        if (aMatch) {
            aMatch = aMatch[0];
            aMatch = aMatch.split("src=\"");
            aMatch = aMatch[1];
            console.log(aMatch);
            aMatch = aMatch.split("");
            aMatch.pop();
            let returnedUrl = aMatch.join("");
            updateToDatabase( returnedUrl, "image" )
        }
        else {
            returnedUrl = "default.jpg"
            updateToDatabase( "default.jpg", "image" )
        }
        render();
    } );
}

function render() {
    let libraryElement = document.getElementById("myLibrary");
    libraryElement.remove();
    libraryElement = document.getElementsByClassName("page-wrapper")[0].appendChild(document.createElement("div"));
    libraryElement.id = "myLibrary";
    let i = 0;
    for ( let book of myLibrary ) { /* should I change this loop to reflect more data for database Id? */
        let author = "";
        let title = "";
        let readStatus = "";
        let src = "";
        let currentId = 0;
        for ( let key in book ) {
            if ( key == "author" ) {
                author = book[key];
            }
            if ( key == "title" ) {
                title = book[key];
            }
            if ( key == "readStatus" ) {
                readStatus = book[key];
            }
            if ( key == "src" ) {
                src = book[key];
            }
            if ( key == "readStatus" ) {
                readStatus = book[key];
            }
        }
        /* create book element */
        let newBookElement = libraryElement.appendChild(document.createElement("div"));
            newBookElement.className = "book-wrapper";
        let newBookImage = newBookElement.appendChild(document.createElement("img"));
        newBookImage.className = "book";
        newBookImage.src = src;
        let bookInfo = newBookElement.appendChild(document.createElement("p"));
        bookInfo.className = "book-info";

        let informationString = "Title: " + title + "<br>Author: " + author + "<br><br>Read it? ";
        bookInfo.innerHTML = informationString;

        /* read button */
        let readButton = newBookElement.appendChild( document.createElement("button"));
        readButton.className = "read-button";
        readButton.innerText = readStatus;
        readButton.addEventListener( "click", (book) => updateToDatabase( book, "NA", "readStatus" ), true );

        /* delete button */
        let deleteButton = newBookElement.appendChild( document.createElement("button"));
        deleteButton.className = "delete-button";
        /* delete button's id must match document in database current Id */
        deleteButton.id = currentId;
        deleteButton.innerText = "X";
        deleteButton.addEventListener( "click", deleteFromDatabase, true );

    }
    // loop through myLibrary array and display each object's contents on the page.
    /* This will run each time after addBookToLibrary is called. This is done to update the book
       list.. as render is what displays the books as output */
    /* Use a for in loop to go over items in array and console.log each one */
    
}

let addBookButton = document.getElementById("addBookToLibrary");
addBookButton.addEventListener("click", addBookToLibrary, true );