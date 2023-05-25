const { BookModel,ChapterModel,PageModel } = require("./../Models/books.model");
const mongoose = require("mongoose");

//create-> post functionalites below-------------------------- post chapter;

//chapter
const createChapter = async (req,res) =>{
    const bookId = req.params.bookId;
    const userId = req.userId;
    console.log("userId from chapter",userId);
    // console.log("bookId from createChapter",bookId);
    const { chapterName,chapterContent } = req.body;
    if(!chapterName||!chapterContent){
        res.status(400).json({success:false,message:"please provide chapterName"});
        return;
    }
    try{
        let book = await BookModel.findById(bookId); // finding book where we need to create chapter
        if(!book){
            return res.status(404).json({success:false,message:"Book Not Found"});
        }
        let newChapter = new ChapterModel({chapterName,chapterContent,userId});
        let savedChapter = await newChapter.save(); // savedChatper retuned from database;
        book.chapters.push(savedChapter._id); // updating the book -> adding new saved chapter returned from data base;
        await book.save(); // saving the update book to database;
        console.log("books after updating",book);
        res.status(200).send({success:true,message:"Chatper created successfully",data:savedChapter});
    }
    catch(err){
        console.log(err);
        res.status(500).json({success:false,message:"Internal server error"});
    }
}

//get -> get functionalities below-------------------------------get chapter;

//getAllChapter;
const getAllChapter = async (req,res)=>{
    const bookId = req.params.bookId;
    //populate("chpaters") will give the actual chapter document inside book rather then just giving chapter id's
    if(!mongoose.Types.ObjectId.isValid(bookId)){
        return res.status(400).send({success:false,message:"Invalid bookId"});
    }
    try{
        let book = await BookModel.findById(bookId).populate("chapters"); 
        if(!book){
            return res.status(404).json({success:true,message:"Book Not Found"});
        }
        res.status(200).json({success:true,data:book.chapters});
    }
    catch(err){
        res.status(500).json({success:false,message:"Internal serval error,Book not found"});
    }
}


//get single chapter
const getSingleChapter = async (req,res) =>{
    const chapterId = req.params.chapterId;

    if(!mongoose.Types.ObjectId.isValid(chapterId)){
        return res.status(400).send({success:false,message:"Invalid chapterId"});
    }

    try{
        let chapter =  await ChapterModel.findById(chapterId);
        if(!chapter){
            return res.status(400).send({success:true,message:"Chapter Not Found"});
        }
        res.status(200).send({success:true,data:chapter});
    }
    catch(err){
        console.log("error from getSingleChapter controller");
        res.status(500).send({success:true,message:"Internal server error"});
    }
};

//update -> update functionalities below; --------------------------------------------update chapter;
const updateChapter = async (req,res) =>{
    const chapterId = req.params.chapterId;
    const userId = req.userId;
    if(!chapterId){
        return res.status(400).send({success:false,message:"please provide chapterId"})
    }
    if(!mongoose.Types.ObjectId.isValid(chapterId)){
        return res.status(400).send({success:false,message:"Invalid chapterId"})
    }
    try{
        let chapterToUpdate = await ChapterModel.findById(chapterId);
        console.log("userId in chapter to update",chapterToUpdate);
        // if(chapterToUpdate.userId!==userId){
        //     return res.status(403).send({success:false,message:"you are not the owner of this chapter and page"});
        // }

        let updatedChapter = await ChapterModel.findByIdAndUpdate(chapterId,{...req.body},{new:true});
        console.log(updatedChapter);
        res.send({success:true,message:"successfully updated",data:updatedChapter});
    }
    catch(err){
        res.status(500).send({success:false,message:"Internale server error"});
    }
}


//delete -> delete functionalities below; --------------------------------------------delete chapter;

const deleteChapter = async (req,res) =>{
    const {chapterId,bookId} = req.params;
    const userId = req.userId;
    //step 1. -> delete all the pages from Page collection which reference/Id is present inside Chapter collection pages field;
    //step 2. -> delete the required(user asked) chapter from Chapter collection;
    //setp 3. -> delete the chapter reference from Book collection's chapters field;
    try{
        let book = await BookModel.findById(bookId);
        let chapter = await ChapterModel.findById(chapterId);

        if(!book){
            return res.status(404).send({success:false,message:'book not found'})
        }

        if(!chapter){
            return res.status(404).send({success:false,message:'chapter not found'})
        }
        if(chapter.userId!==userId){
            return res.status(403).send({success:false,message:"you are not the owner of this chapter"});
        }

        PageModel.deleteMany({_id:{$in:chapter.pages}})//deleting all the pages inside chapter
        .then(()=>{
            let indexOfChapter = book.chapters.indexOf(chapterId); 
            if(indexOfChapter===-1){
                return res.status(404).send({customElements});
            }
            ChapterModel.findByIdAndDelete(chapterId)
            .then(()=>{
                console.log("index of chapter",indexOfChapter);
                if(indexOfChapter!=-1){
                    book.chapters.splice(indexOfChapter,1);//deleting chapter from book chapters field;
                }
                //saving updated book  
                book.save()
                .then(()=>{
                    res.status(200).send({success:true,message:"chapter deleted successfully"});
                })
                .catch(error=>{
                    console.log(error);
                    return res.status(200).send({success:false,message:"error occured while deleting chapter from book chapter field"});      
                })
            })
            .catch(error=>{
                return res.status(200).send({success:false,message:"error occured while deleting chapter from Chapter collection"});    
            })
        })
        .catch((error)=>{
            return res.status(200).send({success:false,message:"error occured while deleting pages from Page collection"});
        })
    }   
    catch(err){
        console.log(err);
        res.status(500).send({success:false,message:"Internal server error"});
    } 
}


module.exports = {
    createChapter,
    getAllChapter,
    getSingleChapter,
    deleteChapter,
    updateChapter
}

