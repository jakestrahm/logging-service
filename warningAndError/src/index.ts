import amqp, { ConsumeMessage } from 'amqplib'
import config from './config'

(async () => {
	try {
		// connect to rabbitmq server
		const connection = await amqp.connect(config.rabbitMQ.url);

		// create new channel
		const channel = await connection.createChannel();

		// create exchange
		await channel.assertExchange(config.rabbitMQ.exchange, config.rabbitMQ.exchangeType);

		// create queue
		const q = await channel.assertQueue("warningAndErrorQueue");

		await channel.bindQueue(q.queue, config.rabbitMQ.exchange, "error");
		await channel.bindQueue(q.queue, config.rabbitMQ.exchange, "warning");

		// consume messages from queue
		channel.consume(q.queue, (msg: ConsumeMessage | null) => {
			if (msg != null) {
				const data = JSON.parse(msg.content.toString())
				console.log(data)

				//acknowledge message
				channel.ack(msg);
			}
		})
	} catch (err) {
		console.error('error in info consumer: ', err)
	}
})();
