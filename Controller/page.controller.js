const mongoose = require("mongoose");
const { ChapterModel,PageModel } = require("./../Models/books.model");


//create-> post functionalites below -------------------------------post book;


//create page
const createPage = async (req,res) =>{
    const chapterId = req.params.chapterId; // chapter where the page will be added;
    const userId = req.userId;
    console.log("userId page create",userId);
    const { pageContent } = req.body;
    console.log("pageContent",pageContent);
    if(!mongoose.Types.ObjectId.isValid(chapterId)){
       return res.status(400).send({success:false,message:"Invalid chapterId"});
    }

    try{
        let chapter = await ChapterModel.findById(chapterId);

        // console.log("chapter",chapter);
        if(!chapter){
            //chapter not found where we need to add the page;
            return res.status(400).send({success:false,message:"Chapter Not Found"});
        }
        let newPage = new PageModel({
            pageContent: pageContent,
            userId
        });
        let savedPage = await newPage.save(); // new page saved to pages collection database;
        chapter.pages.push(savedPage._id); // updating the chapter here adding new savePage  
        await chapter.save()
        .then(()=>{
            res.status(200).send({success:true,message:"page created successfully",data:savedPage});
        })
        .catch(err=>{
            console.log(err);
            res.status(401).send({success:false,message:"error occured while saving the page to chapter"});
        })
    }
    catch(err){
        console.log(err);
        res.status(500).send({success:false,message:"Internal server error"});
    }
}

//create-> get functionalites below ------------------------------get page;

//get pages 
const getPages = async (req,res) => {
    const chapterId = req.params.chapterId;
    if(!mongoose.Types.ObjectId.isValid(chapterId)){
        res.status(400).send({success:false,message:"Invalid chapterId"});
    }
    try{
        let chapter = await ChapterModel.findById(chapterId).populate("pages");
        if(!chapter){
            return res.status(404).send({success:false,message:"pages chapter not found"});
        }
        res.status(200).send({success:true,data:chapter.pages});
    }
    catch(error){
        res.status(500).send({success:fale,message:"Internal server error"});
    }
}


//get single page;
const getPage = async (req,res) =>{
    const pageId = req.params.pageId;
    if(!mongoose.Types.ObjectId.isValid(pageId)){
        return res.status(400).send({success:false,message:"Invalid page-Id"});
    }
    try{
        let page = await PageModel.findById(pageId);
        if(!page){
            res.status(404).send({success:false,message:"page not found"});
        }else{
            res.status(200).send({success:true,page});
        }

    }
    catch(err){
        console.log("error in getPage controller",err);
        res.status(400).send({success:false,message:"error occured while"})
    }
}

//update-> update functionalities below -------------------------- update page;
const updatePage = async (req,res) =>{
    console.log("update callled");
    const pageId = req.params.pageId;
    const userId = req.userId;
    console.log("userId page create",userId);
    const { pageContent } = req.body;
    console.log("body backend",req.body);
    if(!mongoose.Types.ObjectId.isValid(pageId)){
        return res.status(400).send({success:false,message:"Invalid chapterId"});
    }
    try{
        console.log("page from frontend",pageContent);
        let newPage = { 
            pageContent: pageContent,//updated page data comming from frontend;
            userId
        };
        let savedPage = await PageModel.findByIdAndUpdate(pageId,newPage,{new:true}); // new page saved to pages collection database;
        res.status(200).send({success:true,message:"page created successfully",data:savedPage});
    }
    catch(err){
        console.log(err);
        res.status(500).send({success:false,message:"Internal server error"});
    }
}

//delete-> delete functionalities below -------------------------- delete page;
//delete page;
const deletePage = async (req,res) =>{
    const {chapterId,pageId} = req.params;
    const userId = req.userId;
    if(!mongoose.Types.ObjectId.isValid(chapterId) || !mongoose.Types.ObjectId.isValid(pageId)){
        return res.status(400).send({success:false,message:"Invalid chapterId or pageId"});
    }


    try{
        let chapter = await ChapterModel.findById(chapterId);
        // console.log("chapter found in delete",chapter);
        console.log("chapter user",chapter.userId,"userId",userId);
        if(chapter.userId!==userId){
            return res.status(403).send({success:false,message:"you are not the owner of this chapter and page"});
        }
        if(!chapter){
            return res.status(400).send({success:false,message:"chapter not found,error coccured while finding the parent chapter"});
        }
      
        let removedPage = await PageModel.findByIdAndDelete(pageId) // the the page that user want to delete;
        
        console.log("index",chapter.pages.indexOf(pageId));
        let index = chapter.pages.indexOf(pageId);
        if(index===-1){
            return res.status(404).send({success:false,message:"Page Not Found"});
        }else{
            chapter.pages.splice(index,1) // delting the page from chapters field as well
        }

        let savedChapter = await chapter.save();
        
        res.status(200).send({success:true,message:"page deleted successfuly",updatedChapter:savedChapter});

    }
    catch(err){
        return res.status(400).send({success:false,message:"Internal server error"});
    }

}


module.exports = {
    createPage,
    getPages,
    getPage,
    deletePage,
    updatePage
}
