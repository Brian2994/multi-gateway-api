import GatewayManager from '#services/gateway_manager'

export default class PaymentService {

    async processPayment(data: any) {

        const result = await GatewayManager.createTransaction(data)

        return {
            success: true,
            gateway: result.gateway,
            response: result.response
        }

    }

}