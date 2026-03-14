import axios from 'axios'
import GatewayInterface from './gateway_interface.ts'

export default class Gateway1Service implements GatewayInterface {

    async createTransaction(data: any) {

        const response = await axios.post(
            'http://localhost:3001/transactions',
            {
                amount: data.amount,
                name: data.name,
                email: data.email,
                cardNumber: data.cardNumber,
                cvv: data.cvv
            }
        )

        return response.data
    }

    async refundTransaction(externalId: string) {

        const response = await axios.post(
            `http://localhost:3001/transactions/${externalId}/charge_back`
        )

        return response.data
    }

}