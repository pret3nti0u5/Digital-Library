//Intialize empty array for storing book objects
let myLibrary = [];

// Check for first page load and intialize array with some default books
// this function wouldn't be executed on further page loads on same machine given "loadedBefore" key is not removed
if(localStorage.getItem("loadedBefore") === null){
    localStorage.setItem("books", JSON.stringify(myLibrary));    
    firstLoadInitialize();
    localStorage.setItem("loadedBefore", true);
}

//Set "books" to empty array rather than null if "books" key doesn't exist else store array in local storage
if(localStorage.getItem("books") !== null)
    myLibrary = JSON.parse(localStorage.getItem("books"));
else
    localStorage.setItem("books", JSON.stringify(myLibrary));

// Constructor function for intializing Book objects
function Book(name, author, pages, readStatus) {
    this.name = name;
    this.author = author;
    this.pages = pages;
    this.readStatus = readStatus;
}


//fucntion to push book objects to array myLibrary and execute function for rendering said array
function addBookToLibrary(name, author, pages, readStatus) {
    let book = new Book(name, author, pages, readStatus);
    myLibrary.push(book);
    render();
}

//function for rendering myLibrary array, a bit hacky considering every book is re-rendered when a single book is removed or added
function render(){
    localStorage.setItem("books", JSON.stringify(myLibrary));
    let remove = document.getElementById("bookContainer");
    while(remove.firstChild){
        remove.removeChild(remove.firstChild);
    } 
    myLibrary.forEach(function(book, index){
        const div = document.createElement("div");
        div.classList.add("book");
        div.id = index;

        const bookName = document.createElement("p");
        bookName.classList.add("bookName");
        bookName.innerHTML = book.name;
        div.appendChild(bookName);

        const author = document.createElement("p");
        author.classList.add("author");
        author.innerHTML = book.author;
        div.appendChild(author);

        const pages = document.createElement("p");
        pages.classList.add("pages");
        pages.innerHTML = book.pages;
        div.appendChild(pages);

        const read = document.createElement("p");
        read.classList.add("read");
        read.innerHTML = (book.readStatus ? "Read" : "Not Read");
        div.appendChild(read);

        const options = document.createElement("div");
        options.classList.add("options");
        
        const toggle = document.createElement("p");
        toggle.classList.add("toggle");
        toggle.innerHTML = "Toggle Read";
        options.appendChild(toggle);
        
        const img = document.createElement("img");
        img.classList.add("delete");
        img.src = "res/img/icons8-trash-32.png";
        options.appendChild(img);

        div.appendChild(options);

        document.getElementById("bookContainer").appendChild(div);
    });
    
    const del = Array.from(document.getElementsByClassName("delete"));
    del.forEach(function(button,index){
        button.addEventListener("click", function(){
            myLibrary.splice(index ,1);
            render();
        });
    });
    
    const toggle = Array.from(document.getElementsByClassName("toggle"));
    toggle.forEach(function(button,index){
        button.addEventListener("click", function(){
            myLibrary[index].readStatus = !myLibrary[index].readStatus;
            let read = document.getElementById(index);
            //Changing text of Read Status rather than re-rendering every book allows book to remain in transition state
            read.querySelector(".read").innerHTML = myLibrary[index].readStatus ? "Read" : "Not Read";
            localStorage.setItem("books", JSON.stringify(myLibrary));
        });
    });

    let popupContainer = document.getElementById("popupContainer");
    let name = document.getElementById("name");
    let authorName = document.getElementById("authorName");
    let noPages = document.getElementById("noPages");
    let readStatus = document.getElementById("readStatus")

    document.getElementById("newBook").onclick = function(){
        popupContainer.style.display = "flex";
    };
    
    document.getElementById("closeButton").onclick = function(){
        popupContainer.style.display = "none";
        name.value="";
        authorName.value="";
        noPages.value="";
        readStatus.checked=false;
    };
    
    document.getElementById("submit").onclick = function(){
        // Check for empty fields if found change popUp display: attr to display
        if(name.value.trim() != "" && authorName.value.trim() != "" && noPages.value != ""){
            addBookToLibrary(name.value, authorName.value, noPages.value, readStatus.checked);
            popupContainer.style.display = "none";
            name.value="";
            authorName.value="";
            noPages.value="";
            readStatus.checked=false;
        }
        else{
            document.getElementById("alertContainer").style.display = "flex";
        }
    };

    document.getElementById("alertClose").onclick = function(){
        document.getElementById("alertContainer").style.display = "none";
    }
}

// function to turn CRT effect ON or OFF as some people may find it annoying
document.getElementById("crtEffect").onclick = function(){
    if(document.getElementById("container").className == "CRT")
        document.getElementById("container").className = "noCRT";
    else
        document.getElementById("container").className = "CRT";
}
//render all elements just in case render function never gets called before
render();

// function for intializing myLibrary with default some books on first page load
function firstLoadInitialize(){
    addBookToLibrary("1984", "George Orwell", 328, true);
    addBookToLibrary("Fahrenheit 451", "Ray Bradbury", 256, true);
    addBookToLibrary("Dune", "Frank Herbert", 412, true);
    addBookToLibrary("War and Peace", "Leo Tolstoy", 1225, false);
}
