import { Producer } from "./producer";
import Express from "express";

const producer = new Producer();
const app = Express();

app.use(Express.json())

app.post("/sendLog", async (req, res, _) => {
	await producer.publishMessage(req.body.logType, req.body.message)
	res.send();

})

app.listen(3000, () => {
	console.log("servers up!")
})
