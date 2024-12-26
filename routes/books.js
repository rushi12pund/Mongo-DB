const express = require("express");
const { books } = require("../data/books.json");
const { users } = require("../data/users.json");
const router = express.Router();

// Route: /books
// Method: GET
// Description: Getting all books

router.get("/", (req, res) => {const express = require("express");
    const { books } = require("../data/books.json");
    const { users } = require("../data/users.json");
    const router = express.Router();
    
    // Route: /books
    // Method: GET
    // Description: Getting all books
    router.get("/", (req, res) => {
      res.status(200).json({
        success: true, 
        message: "Got all the books", 
        data: books
      });
    });
    
    // Route: /:id
    // Method: GET
    // Description: Get a book by its id
    router.get("/:id", (req, res) => {
      const { id } = req.params;
      const book = books.find((each) => each.id === id); // Fix here
    
      if (!book) { // Corrected condition
        return res.status(404).json({
          success: false,
          message: "Book not found",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Found the book by its id",
        data: book,
      });
    });
    
    // Route: /issued
    // Method: GET
    // Description: Get all issued books
    router.get("/issued", (req, res) => {  // Fixed the route name
      const usersWithIssuedBooks = users.filter((each) => each.issuedBook); // Simplified the condition
      const issuedBooks = [];
    
      usersWithIssuedBooks.forEach((each) => {
        const book = books.find((book) => book.id === each.issuedBook); // Fixed comparison here
    
        if (book) {
          book.issuedBy = each.name;
          book.issuedDate = each.issuedDate;
          book.returnDate = each.returnDate;
    
          issuedBooks.push(book);
        }
      });
    
      if (issuedBooks.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No books have been issued yet...",
        });
      }
    
      return res.status(200).json({
        success: true,
        message: "Users with the issued books",
        data: issuedBooks,
      });
    });
    
    module.exports = router;
    
  res.status(200).json({
    success: true, 
    message: "Got all the books", 
    data: books
  });
});

// Route: /:id
// Method: GET
// Description: Get a book by their id

router.get("/:id",(req,res)=>{
    const {id}= req.params;
    const book = books.find((each)=> each.id ===id);

    if(!books){
        return res.status(404).json({
            success:false,
            message: "books not found"

        });
    }
    return res.status(200).json({
        success:true,
        message: "found the book by their id",
        data: book,
    });
})

// Route: /issued
// Method: GET
// Description: Get all issued books

router.get("/issued/by-user",(req,res)=>{
    const userswiththeissuedbook = users.filter((each) => {
        if (each.issuedBook) return each;
    });
    const issuedBook = [];
    userswiththeissuedbook.forEach((each)=>{
        const book = books.find((book) => (book.id = each.issuedBook));

        book.issuedBy = each.name;
        book.issuedDate = each.issuedDate;
        book.returnDate = each.returnDate;

        issuedBook.push(book);
    });
    if(issuedBook.length===0){
        return res.status(404).json({
            success: false,
            message: "no Book have been issued yet...",
        });
    }
     return res.status(200).json({
        success:true,
        message: "Users with the issued Books...",
        data:issuedBook,
     });
});


// Route: /boo
// Method: POST
// Description: add a new book
// DATA : ID , name ,gener , author , price ,  ,Publisher 

router.POST("/",(req,res) => {
    const {data}  = req.body;
    if(!data) {
        return res.status.json({
            success: false,
            message : "No Data To add a book" ,
        });
    }
    const books = books.find((each) =>each.id === data.id);
    if(book){
      return res.status(404).json({
        success:false,
        message:"id already exist"
      })
    }
    const allbooks = {...books,data};
    return  res.status(201).json({
      success:true
      message:"added Book Succesfully",
      data: allbooks
    })
});

// Route: /boo
// Method: PUT
// Description: Updating Book by its id
// DATA : ID , name ,gener , author , price ,  ,Publisher 

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { data } = req.body;

  const book = books.find((each) => each.id === data.id);

  if (!book) {
      return res.status(400).json({
          success: false,
          message: "Book Not Found For This ID",
      });
  }

  const updateData = books.map((each) => {
      if (each.id == id) {
          return { ...each, ...data };
      }
      return each;
  });

  // Assuming we need to send a success response
  res.status(200).json({
      success: true,
      message: "Book updated successfully BY their ID",
      data: updateData,
  });
});


module.exports = router;
