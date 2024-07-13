// import multer from "multer";
// import { v4 as uuid } from "uuid";

// const storage = multer.diskStorage({
//   destination(req, file, callback) {
//     callback(null, "./uploads");
//   },
//   filename(req, file, callback) {
//     console.log(file, "file from middlware");
//     const id = uuid();
//     const extName = file.originalname.split(".").pop();
//     const filename = `${id}.${extName}`;
//     callback(null, filename);
//   },
// });

// export const singleUpload = multer({ storage }).single("image");


// src/config/multerConfig.ts
import multer from 'multer';

const storage = multer.memoryStorage();

export const singleUpload = multer({ storage: storage,   limits: { fileSize: 2 * 1024 * 1024 }, // 1 MB limit
}).single("image");;

