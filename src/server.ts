import "dotenv/config";
import App from "./app";

App.express.listen(process.env.PORT || 3333);
