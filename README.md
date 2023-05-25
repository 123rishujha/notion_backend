# notion_backend

// All the post routes below-----------------------------------------------------post book;

//create book           -> /book/post
<br/>
//create chapter        -> /book/:bookId/chapter/post;
<br/>
//create page           -> /book/:chapterId/page/post;
<br/>
// update sinlge page   -> /book/update/:bookId
<br/>
<br/>
<br/>

// All the get routes below for books/chapters/pages/page ---------------------------------get books;
<br/>
//getall books          -> /book/getallbook;
<br/>
//getsingle book;       -> /book/:bookId;
<br/>
//get all chapters      -> /book/:bookId/chapters;
<br/>
//get single chapter    -> /book/chapter/:chapterId;
<br/>
//get all pages         -> /book/chapter/:chapterId/pages;
<br/>
//get single page       -> /book/page/pageId;
<br/>
<br/>
<br/>

//All the update routes below for books/chapters-------------------------------update book;
<br/>
//update chatper        -> book/updatechapter/:chapterId
<br/>
//update book           -> book/updateBook/:bookId
<br/>
<br/>
<br/>

// All the delete routes below for books/chapters/page------------------------------delete book;
<br/>
//delete single page    ->  book/pagedelete/:chapterId/:pageId
<br/>
//delete chapter        -> book/chapterdelete/:bookId/:chapterId
<br/>
//delete book           -> book/:bookId
<br/>
