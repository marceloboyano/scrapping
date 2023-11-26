import dotenv from "dotenv";
import { Program } from "./program";

dotenv.config();

let baseUri = "https://www.joinsuperhuman.ai";

new Program(baseUri).main();
