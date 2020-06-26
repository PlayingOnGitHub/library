function Book( author, title, readStatus, src ) {
    // the constructor...
    // give the book properties of author, title, number of pages, whether it’s been read.
    this.author = author;
    this.title = title;
    this.readStatus = readStatus;
    this.src = src;
}

/* this is next step. Need to add pull Ids from database and add a document id tag */
function deleteBookFromDatabase() {
    /* id will somehow have to equal data-attribute tag from documentId or from "this" possibly */
    db.collection('books').doc(this.id).delete()
        .catch( (error) => console.log(error) );
}

function addBookToDatabase( book ) {
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
    let myBook = new Book( author, title, readStatus, "none" );
    // add book to database
    db.collection('books').add({...myBook})
        .catch( (error) => console.log( error ) );
}

function updateBookContentToDatabase( book, theUpdate, typeOfChange ) { /* book | returnedUrl or readStatus | typeOfChange -> readStatus or image */
    if ( typeOfChange == "image" ) {
        /* push update to database */
        /* theUpdate = returnedUrl */
        db.collection('books').doc(book.id).update( { src: theUpdate } );
        console.log("change of image");
    }
    else if ( typeOfChange == "readStatus" ) {
        let currentStatus = "";
        if ( theUpdate == "Yes" ) {
            currentStatus = "No";
        }
        if ( theUpdate == "No" ) {
            currentStatus = "Yes";
        }
        db.collection('books').doc(book.id).update( { readStatus: currentStatus } );
        console.log(currentStatus);
    }
}

function getAnImage( book ) {
    /* book = ? */
    let title = book.data().title;
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
            updateBookContentToDatabase( book, returnedUrl, "image" )
        }
        else {
            returnedUrl = "default.jpg"
            updateBookContentToDatabase( book, returnedUrl, "image" )
        }
    } );
}

function render( snapshot ) {
    let libraryElement = document.getElementById("myLibrary");
    libraryElement.remove();
    libraryElement = document.getElementsByClassName("page-wrapper")[0].appendChild(document.createElement("div"));
    libraryElement.id = "myLibrary";
    snapshot.forEach( ( book ) => {
        let bookData = book.data();
        let author = bookData.author;
        let title = bookData.title;
        let readStatus = bookData.readStatus;
        let src = bookData.src;
        if ( src == "none" ) {
            src = "default.jpg";
            getAnImage( book );
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
        readButton.addEventListener( "click", (e) => {updateBookContentToDatabase( book, e.target.innerText, "readStatus" ), true} ); /* might not work this.checked */
        /* delete button */
        let deleteButton = newBookElement.appendChild( document.createElement("button"));
        deleteButton.className = "delete-button";
        /* delete button's id must match document in database current Id */
        deleteButton.id = book.id;
        deleteButton.innerText = "X";
        deleteButton.addEventListener( "click", deleteBookFromDatabase, true );
    });
}

db.collection('books').onSnapshot( (snapshot) => {
    render(snapshot);
})

let addBookButton = document.getElementById("addBookToLibrary");
addBookButton.addEventListener("click", addBookToDatabase, true );