import Gateway from '#models/gateway'
import Gateway1Service from '#gateways/gateway1_service'
import Gateway2Service from '#gateways/gateway2_service'

export default class PaymentService {

    async processPayment(data: any) {

        const gateways = await Gateway
            .query()
            .where('is_active', true)
            .orderBy('priority')

        for (const gateway of gateways) {

            try {

                let service

                if (gateway.name === 'gateway1') {
                    service = new Gateway1Service()
                }

                if (gateway.name === 'gateway2') {
                    service = new Gateway2Service()
                }

                if (!service) continue

                const response = await service.createTransaction(data)

                return {
                    success: true,
                    gateway: gateway.name,
                    response
                }

            } catch (error) {

                console.log(`Gateway ${gateway.name} failed`)

            }

        }

        throw new Error('All gateways failed')

    }

}