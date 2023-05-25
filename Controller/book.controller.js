const { BookModel,ChapterModel,PageModel } = require("./../Models/books.model");

//create-> post functionalites below------------------------------------post book;

//book
const createBoook = async (req,res)=>{
    const userId = req.userId;
    const payload = {userId,...req.body};
    if(!req.body.bookName){
        res.status(400).send({success:false,message:"please provide book name"});
        return
    }
    try{
        let newBook = new BookModel(payload);
        let savedBook = await newBook.save();
        res.status(200).json({success:true,message:"Book created successfully",data: savedBook});
    }
    catch(err){
        res.status(500).send({success:false,message:"Internal server error"});
    }
}

//get-> get functionalites below------------------------------------get book;

//get all books
const getAllBooks = async (req,res) =>{
    try{
        let books = await BookModel.find();
        // console.log("books from getAllBooks",books);
        res.json({success:true,data: books});
    }
    catch(err){
        res.status(404).json({success:false,message:"error occured while searching for books"});
    }
}

//get single book
const getBook = async (req,res) =>{
    const bookId = req.params.bookId;
    try{
        let book = await BookModel.findById(bookId);
        res.json({success:true,data:book});
    }
    catch(err){
        console.log("err from get single book",err);
        res.status(400).json({success:true,message:"error occured while searching for single book"});
    }
}

//delete-> delete functionalites below------------------------------------delete book;
const deleteBook = async (req,res) =>{
    const bookId = req.params.bookId;
//step 1. -> delete all the pages from Page collection whose reference present inside Chapter collection (user asked chapter inside Chapter collection) pages field(chapter reference presnet inside book chapters field);

//step 2. -> delete all the chapters from Chapter collection whose refernece present inside Book collection(user asked book inside Book collection) chapters field;

//stemp 3. -> delete the book(user asked book) from Book collection

    try{
        let book = await BookModel.findById(bookId);
        let chaptersId = book.chapters;
        // console.log("book", book);
        let chaptersFound = await ChapterModel.find({_id:{$in:book.chapters}})
        console.log("chapter found",chaptersFound);
        chaptersFound.forEach((elem)=>{ //here we will delete pages whose ref present inside capter
            console.log("pages",elem.pages);
            PageModel.deleteMany({_id:{$in:elem.pages}}) //deleting pages present inside chapter
            .then((result)=>{
                console.log("reuslt",result);
            })
            .catch(err=>{
                console.log("eror while deleting page",err);
                return res.status(400).send({success:false,message:"error occured while deleting pages"});
            })
        })
        //deleting all the chapter from Chapter collection whose id's present in book chapter field;
        ChapterModel.deleteMany({_id:{$in:book.chapters}})
        .then((result)=>{
            console.log("result",result);
        })
        .catch(error=>{
            return res.status(400).send({success:false,message:"error occured while deleting chapter from Chapter collection"});
        })
        let deletedBook = await BookModel.findByIdAndDelete(bookId);
        res.send({"success":true,message:"book successfuly deleted",deletedBook});
        // chaptersId.forEach((elem)=>{
        //     console.log("elem",elem);
        //     ChapterModel.findById({_id:elem})
        //     .then((singleChapter)=>{
        //         console.log("singleChapter found",singleChapter);
        //         res.json({message:"checking"});
        //     })
        //     .catch((error)=>{
        //         console.log("error occured while finding chapter by _id",error);
        //         res.status(400).send({success:false,message:"error occured while finding chapter by _id"});
        //     })
        // });
    }
    catch(err){
        console.log("error in bookController for delete route",err);
        res.status(400).send({success:false,message:"Internal server error"});
    }
}

//update-> update functionalites below------------------------------------update book;

const updateBook = async (req,res) =>{
    const {bookId} = req.params;
    const userId = req.userId;
    try{
        let book = await BookModel.findById(bookId);
        if(book.userId!==userId){
            return res.status(403).send({success:false,message:"you are not the owner of this page"});
        }
        let updatedBook = await BookModel.findByIdAndUpdate(bookId,{...req.body},{new:true});
        res.send({success:true,message:"successfully updated",updatedBook});
    }
    catch(error){
        console.log(error);
        res.status(400).send({success:false,message:""});
    }
}


module.exports = {
    createBoook,
    getAllBooks,
    getBook,
    deleteBook,
    updateBook
}
