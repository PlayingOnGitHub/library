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

Book.prototype.addToDatabase = function( doc ) {
    console.log(this);
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

    let currentId = 0;
    if ( myLibrary.length != 0 ) {
        currentId = +myLibrary[myLibrary.length-1]["currentId"];
        currentId++;
    }


    if ( readStatus ) {
        readStatus = "Yes";
    }
    else {
        readStatus = "No";
    }
    let myBook = new Book( author, title, readStatus, "default.jpg", currentId );
    myLibrary.push( myBook );
    render();
    getAnImage( title );

    // get information like author, title, number of pages, and whether it's been read
    // and create a new Book object using the constructor and information given
    // Now, add the book object to the myLibrary array
}

function deleteMyButton() {
    let i = 0;
    breakOutOfIt:
    for ( let book of myLibrary ) {
        for ( let key in book ) {
            if ( key == "currentId" && book[key] == this.id ) {
                delete myLibrary[i];
                break breakOutOfIt;
            }
        }
        i++;
    }
    myLibrary = myLibrary.filter( (x) => (x != undefined) ? true : false );
    render();
}

function render() {
    let libraryElement = document.getElementById("myLibrary");
    libraryElement.remove();
    libraryElement = document.getElementsByClassName("page-wrapper")[0].appendChild(document.createElement("div"));
    libraryElement.id = "myLibrary";
    let i = 0;
    for ( let book of myLibrary ) {
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
            if ( key == "currentId" ) {
                currentId = book[key];
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
        readButton.addEventListener( "click", () => {
            if ( readStatus == "Yes" ) {
                readStatus == "No";
                book["readStatus"] = "No";
            }
            else {
                readStatus = "Yes";
                book["readStatus"] = "Yes";
            }
            render();

        }, true );

        /* delete button */
        let deleteButton = newBookElement.appendChild( document.createElement("button"));
        deleteButton.className = "delete-button";
        deleteButton.id = currentId;
        deleteButton.innerText = "X";
        deleteButton.addEventListener( "click", deleteMyButton, true );

        console.log( author + " " + title + " " + status + " " + src );

    }
    // loop through myLibrary array and display each object's contents on the page.
    /* This will run each time after addBookToLibrary is called. This is done to update the book
       list.. as render is what displays the books as output */
    /* Use a for in loop to go over items in array and console.log each one */
    
}

let addBookButton = document.getElementById("addBookToLibrary");
addBookButton.addEventListener("click", addBookToLibrary, true );

function getAnImage( title ) {
    /* I copied a stack exchange method that allowed me to fetch source code from URL */
    let proxyurl = "https://cors-anywhere.herokuapp.com/";
    let url = "https://www.bookshare.org/search?keyword=" + title;
    let newcontents = "";
    let failed = false;
    let returnedUrl = "";
    fetch(proxyurl + url)
    .then(response => response.text())
    .then(contents => { 
        newcontents = contents;
    } );
    /* The part below this is mine */
    setTimeout( () => {
        let regex = "cover-image-search\" src=\".*?\"";
        regex = new RegExp( regex, "mgi" );
        let aMatch = newcontents.match(regex);
        if (aMatch) {
            aMatch = aMatch[0];
            aMatch = aMatch.split("src=\"");
            aMatch = aMatch[1];
            console.log(aMatch);
            aMatch = aMatch.split("");
            aMatch.pop();
            let returnedUrl = aMatch.join("");
            let i = 0;
            for ( let book of myLibrary ) {
                for ( let key in book ) {
                    if ( book[key] == title ) {
                        let currentBookElement = document.getElementsByClassName("book")[i];
                        if ( currentBookElement ) {
                            currentBookElement.src = returnedUrl;
                            book.src = returnedUrl;
                        }
                    }
                }
                i++;
            }
        }
        else {
            let o = 0;
            for ( let book of myLibrary ) {
                for ( let key in book ) {
                    if ( book[key] == title ) {
                        let currentBookElement = document.getElementsByClassName("book")[o];
                        currentBookElement.src = "default.jpg";
                        book.src = "default.jpg";
                    }
                }
                o++;
            }
        }

    }, 5000 );
}