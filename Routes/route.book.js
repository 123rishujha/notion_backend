// all the book related routes are here -> book / chapter / page;

const express = require("express");
//controllers
const { createBoook,getAllBooks,getBook, deleteBook,updateBook } = require("./../Controller/book.controller");
const { createChapter,getAllChapter,getSingleChapter,deleteChapter,updateChapter } = require("./../Controller/chapter.controller");
const { createPage,getPages,getPage,updatePage,deletePage } = require("./../Controller/page.controller");
//authorise middleware;
const { authMiddleware } = require("./../Middleware/authorise.middleware");


//--------------------------------------
const bookRouter = express.Router();

// All the post routes below-----------------------------------------------------post book;

//create book -> /book/post
bookRouter.post("/post",authMiddleware,createBoook);

//create chapter -> /book/:bookId/chapter/post;
bookRouter.post("/:bookId/chapter/post",authMiddleware,createChapter);

//create page -> /book/:chapterId/page/post;
bookRouter.post("/:chapterId/page/post",authMiddleware,createPage);
// update sinlge page -> /book/update/:bookId
bookRouter.patch("/update/:pageId",authMiddleware,updatePage);



// All the get routes below for books/chapters/pages/page ---------------------------------get books;
//getall books -> /book/getallbook;
bookRouter.get("/",getAllBooks);

//getsingle book; -> /book/:bookId;
bookRouter.get("/:bookId",getBook);
 
//get all chapters -> /book/:bookId/chapters;
bookRouter.get("/:bookId/chapters",getAllChapter);

//get single chapter -> /book/chapter/:chapterId;
bookRouter.get("/chapter/:chapterId",getSingleChapter);

//get all pages -> /book/chapter/:chapterId/pages;
bookRouter.get("/:chapterId/pages",getPages);

//get single page -> /book/page/pageId;
bookRouter.get("/page/:pageId",getPage);



//All the update routes below for books/chapters-------------------------------update book;
bookRouter.patch("/updatechapter/:chapterId",authMiddleware,updateChapter);
bookRouter.patch("/updateBook/:bookId",authMiddleware,updateBook);




// All the delete routes below for books/chapters/page------------------------------delete book;
//delete single page;
bookRouter.delete("/pagedelete/:chapterId/:pageId",authMiddleware,deletePage);

//delete chapter 
bookRouter.delete("/chapterdelete/:bookId/:chapterId",authMiddleware,deleteChapter);

//delete book
bookRouter.delete("/:bookId",authMiddleware,deleteBook);

module.exports={
    bookRouter
}

