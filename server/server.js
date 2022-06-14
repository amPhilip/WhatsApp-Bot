const { error } = require("console");
const express = require("express");
const http = require("http");
require("dotenv").config();
const app = express();

app.use(express.json({ limit: "30mb" }));

const conn = axios.create({
    headers:{
        'x-api-key':process.env.API_KEY
    }
})

app.get("/", (req, res) => {
  res.json({ status: "running" });
});

app.post("/incoming", async (req, res) => {
    const {message, fromname, from} = req.body
    const msg = message.toLowerCase();

    let response = ''

    if(msg.includes('.hello')){
        response = `Hello ${fromname}! This is the *Tech Service*, how may i help you?`
    }

    if(response != ''){
        const theResponse = await replyMsg(from, response)
        console.log(theResponse)
      }
      console.log("Original Msg", req.body);

  res.send("OK");
});


const replyMessage = async(to, msg) => {
    try {
        const reply = await conn.post(`${process.env.API_URL}/send-message`,
        {
            recipients:to,
            message:msg,
        })
        return reply.data
    } catch (error) {
       return error.message 
    }
}








const server = http.createServer(app);
const PORT = process.env.PORT || 8080;
server.listen(PORT, (err) => {
  if (err) {
    console.log(error.message);
  }
  console.log(`Server active on PORT${PORT}`);
});
