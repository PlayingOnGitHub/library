let myLibrary = [];

function Book( author, title, readStatus, src, deleteId ) {
    // the constructor...
    // give the book properties of author, title, number of pages, whether it’s been read.
    this.author = author;
    this.title = title;
    this.readStatus = readStatus;
    this.src = src;
    this.deleteId = deleteId;
}

function addBookToLibrary() {
    let author = document.getElementById("author").value;
    let title = document.getElementById("title").value
    let readStatus = document.getElementById("readStatus").checked;
    if ( author == "" || title == "" ) {
        return false;
    }
    let myBook = new Book( author, title, readStatus, "default.jpg", "unknown" );
    myLibrary.push( myBook );
    render( title );
    getAnImage( title );

    // get information like author, title, number of pages, and whether it's been read
    // and create a new Book object using the constructor and information given
    // Now, add the book object to the myLibrary array
}

function render( title ) {
    let libraryElement = document.getElementById("myLibrary");
    libraryElement.remove();
    libraryElement = document.getElementsByTagName("body")[0].appendChild(document.createElement("div"));
    libraryElement.id = "myLibrary";
    let i = 0;
    for ( let book of myLibrary ) {
        let author = "";
        let title = "";
        let readStatus = "";
        let src = "";
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
            if ( key == "deleteId" ) {
                deleteId = i;
            }
            i++
        }
        /* create book element */
        let newBookElement = libraryElement.appendChild(document.createElement("div"));
            newBookElement.className = "book-wrapper";
        let newBookImage = newBookElement.appendChild(document.createElement("img"));
        newBookImage.className = "book";
        newBookImage.src = src;
        let bookInfo = newBookElement.appendChild(document.createElement("p"));
        bookInfo.className = "book-info";

        if ( readStatus ) {
            readStatus = "yes";
        }
        else {
            readStatus = "no";
        }
        let informationString = "Title: " + title + "<br>Author: " + author + "<br><br>Read it? " + readStatus;
        bookInfo.innerHTML = informationString;
        let deleteButton = newBookElement.appendChild( document.createElement("button"))
        deleteButton.id = deleteId;
        deleteButton.addEventListener( "click", () => {
            myLibrary[deleteId] = undefined;
            newBookElement.remove();
            myLibrary = myLibrary.filter( (x) => (x != undefined) ? true : false );
        }, true )
        /* add author, title, pages, status, and image to page */
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
    let url = "https://unsplash.com/s/photos/" + title;
    let newcontents = "";
    let failed = false;
    let returnedUrl = "";
    fetch(proxyurl + url)
    .then(response => response.text())
    .then(contents => { 
        newcontents = contents;
    } )
    .catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"))
    /* The part below this is mine */
    setTimeout( () => {
        let regex = "class=\"_2VWD4 _2zEKz\" alt=\".+?" + title + ".+?srcSet=\"https:\\/\\/images.unsplash.com\\/photo-[\\d]+?-[\\da-z].+?\\?";
        regex = new RegExp( regex, "mgi" );
        let aMatch = newcontents.match(regex);
        if (aMatch) {
            let myString = aMatch[0];
            let split = myString.split("srcSet=");
            let myArray = [split[1]]
            let myUrl = myArray[0].slice(1, myArray[0].length-1)
            returnedUrl = myUrl.split(";")[0];
            let i = 0;
            for ( let book of myLibrary ) {
                for ( let key in book ) {
                    if ( book[key] == title ) {
                        let currentBookElement = document.getElementsByClassName("book")[i];
                        currentBookElement.src = returnedUrl;
                        book.src = returnedUrl;
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