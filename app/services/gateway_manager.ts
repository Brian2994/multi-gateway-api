import Gateway1Service from '#gateways/gateway1_service'
import Gateway2Service from '#gateways/gateway2_service'
import GatewayInterface from '#gateways/gateway_interface'

export default class GatewayManager {

    static async createTransaction(data: any) {

        const gateways: { name: string, service: GatewayInterface }[] = [
            { name: 'gateway1', service: new Gateway1Service() },
            { name: 'gateway2', service: new Gateway2Service() }
        ]

        for (const gateway of gateways) {

            try {

                console.log(`Trying ${gateway.name}...`)

                const response = await Promise.race([
                    gateway.service.createTransaction(data),
                    this.timeout(5000)
                ])

                console.log(`${gateway.name} success`)

                return {
                    gateway: gateway.name,
                    response
                }

            } catch (error) {

                console.log(`${gateway.name} failed:`, error.message)

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