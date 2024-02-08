import amqp, { Channel, Message } from 'amqplib'
import config from './config'

export class Producer {
	channel!: Channel;
	exchangeType: string;
	exchangeName: string;

	constructor(exchangeName: string, exchangeType: string) {
		this.exchangeType = exchangeType
		this.exchangeName = exchangeName
	}

	async createChannel() {
		// connect to rabbitmq
		const connection = await amqp.connect(config.rabbitMQ.url)
		// create channel on connection
		this.channel = await connection.createChannel();
	}

	async publishMessage(routingKey: string, message: Message) {

		if (!this.channel) {
			await this.createChannel();
		}

		//create exchange
		await this.channel.assertExchange(this.exchangeName, this.exchangeType);

		//publish message
		const logDetails = {
			logType: routingKey,
			message: message,
			dateTime: new Date(),
		}
		await this.channel.publish(
			this.exchangeName,
			routingKey,
			Buffer.from(JSON.stringify(logDetails))
		)
		console.log(`the new "${routingKey}" log has been sent to exchange "${this.exchangeName}"`)
	}
}

