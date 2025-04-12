import fs from 'fs'
import multer from "multer"


const Fileupload=(path)=>{
    const storage=multer.diskStorage({
        destination:function(req,file,callback){
            callback(null,path)
        },
        filename:function(req,file,callback){
            const uploadname=file.originalname.split(".");
            const extension="."+uploadname[uploadname.length-1];
            const fileuploadname= Date.now().toString();
            fs.readFile(path+file.originalname,(err)=>{
                if(!err){
                    callback(null,fileuploadname+extension)
                }
                else{
                    req.body.image = fileuploadname+extension;
                    callback(null,fileuploadname+extension)
                }
            })
        }
    })
    const uploaded=multer({storage:storage});
    return uploaded;
}

export default {Fileupload}