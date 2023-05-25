# notion_backend

// All the post routes below-----------------------------------------------------post book;

//create book           -> /book/post
//create chapter        -> /book/:bookId/chapter/post;
//create page           -> /book/:chapterId/page/post;
// update sinlge page   -> /book/update/:bookId


// All the get routes below for books/chapters/pages/page ---------------------------------get books;
//getall books          -> /book/getallbook;
//getsingle book;       -> /book/:bookId;
//get all chapters      -> /book/:bookId/chapters;
//get single chapter    -> /book/chapter/:chapterId;
//get all pages         -> /book/chapter/:chapterId/pages;
//get single page       -> /book/page/pageId;


//All the update routes below for books/chapters-------------------------------update book;
//update chatper        -> book/updatechapter/:chapterId
//update book           -> book/updateBook/:bookId


// All the delete routes below for books/chapters/page------------------------------delete book;
//delete single page    ->  book/pagedelete/:chapterId/:pageId
//delete chapter        -> book/chapterdelete/:bookId/:chapterId
//delete book           -> book/:bookId
