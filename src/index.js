import dotenv from "dotenv";
import app from "./app/app.js";

dotenv.config();
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
