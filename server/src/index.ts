import * as express from "express"
import * as dotenv from "dotenv"
import connectDB from "./config/db";
import serverInit from "./config/serverinit";

dotenv.config();

connectDB().then(()=>{
      const app = express()
      serverInit(app)
}).catch((error)=>{
      throw new Error(`Error has been occured while configuring Database ${error}`)
})

