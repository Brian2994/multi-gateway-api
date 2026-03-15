import Gateway1Service from '#gateways/gateway1_service'
import Gateway2Service from '#gateways/gateway2_service'
import GatewayInterface from '#gateways/gateway_interface'

export default class GatewayManager {

    static gateways: Record<string, GatewayInterface> = {
        gateway1: new Gateway1Service(),
        gateway2: new Gateway2Service()
    }

    static async createTransaction(data: any) {

        const gatewayEntries = Object.entries(this.gateways)

        for (const [name, service] of gatewayEntries) {

            try {

                console.log(`Trying ${name}...`)

                const response = await Promise.race([
                    service.createTransaction(data),
                    this.timeout(5000)
                ])

                console.log(`${name} success`)

                return {
                    gateway: name,
                    response
                }

            } catch (error) {

                console.log(`${name} failed:`, error.message)

            }

        }

        throw new Error('All gateways failed')

    }

    static timeout(ms: number) {

        return new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Gateway timeout')), ms)
        )

    }

}