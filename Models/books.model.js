const mongoose = require("mongoose");
const { Schema,model } = mongoose

const pageSchema = new Schema({
    userId: {type: String, required: true},
    // pageContent:[
    //     {
    //         tag:{type: String, required: true,default:"p"},
    //         content: {type: String, required: true,default:"paragraph..."},
    //         imageUrl: {type: String, required: false},
    //     }
    // ]
    pageContent:String
},{
    versionKey:false
})

const chapterSchema = new Schema({
    chapterName: {type: String, required: true},

    chapterContent:{type:String,required:true},
    userId: {type: String, required: true},
    pages: [{type: Schema.Types.ObjectId,ref:'Page'}] // referencing Pages Collection
    // pages: {type: Schema.Types.ObjectId,ref:'Page'} // referencing Pages Collection
},{
    versionKey:false
})


const bookSchema = new Schema({
    userId: {type: String, required: true},
    bookName: {type: String, required: true},
    coverImage: {type: String, required: false},
    chapters: [{type: Schema.Types.ObjectId,ref:"Chapter"}] // referencing Chapters Collection
},{
    versionKey:false
})

const PageModel = model("Page",pageSchema);
const ChapterModel = model("Chapter",chapterSchema);
const BookModel = model("Book",bookSchema);

module.exports = {
    PageModel,
    ChapterModel,
    BookModel
}
