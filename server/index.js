import  express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from 'url';
import authRoutes from "./routes/auth.js";
import { register } from "./controllers/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import POst from "./models/Post.js";
import { users, posts } from "./data/index.js";
import Post from './models/Post.js';





/*CONFIGURATIONS*/

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"})); // enable CORS
app.use(morgan("common"));
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());
app.use("/assests", express.static(path.join(__dirname, 'public/assests')));



/*FILE STORAGE*/  
const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, 'public/assests');
    },
    filename: function (req, file, cb){
        cb(null,file.originalname);
    }

});


const upload = multer({ storage });

/*ROUTES WITH FILES*/  
app.post("/auth/register", upload.single("picture"),verifyToken, register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);





 /* ROUTES */
app.use("/auth", authRoutes);
app.use("/users",userRoutes);
app.use("/posts", postRoutes);






/*Mongoose SETUP*/ 
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL).then(() => {
     app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));

     /*ADD DATA ONE TIME*/
     //User.insertMany(users);
     //Post.insertMany(posts);

}).catch((error) => console.log(`${error} did not connect`));   