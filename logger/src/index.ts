import { Producer } from "./producer";
import Express from "express";

const producer = new Producer("logExchange", "direct");
const app = Express();
const port = process.env.PORT || 8080

app.use(Express.json())

app.post("/sendLog", async (req, res, _) => {
	await producer.publishMessage(req.body.logType, req.body.message)
	res.send();
})

app.listen(port || 8080, () => {
	console.log("servers up!")
})
