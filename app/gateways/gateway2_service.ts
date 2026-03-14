import axios from 'axios'
import GatewayInterface from './gateway_interface.ts'

export default class Gateway2Service implements GatewayInterface {

    async createTransaction(data: any) {

        const response = await axios.post(
            'http://localhost:3002/transacoes',
            {
                valor: data.amount,
                nome: data.name,
                email: data.email,
                numeroCartao: data.cardNumber,
                cvv: data.cvv
            },
            {
                headers: {
                    'Gateway-Auth-Token': 'tk_f2198cc671b5289fa856',
                    'Gateway-Auth-Secret': '3d15e8ed6131446ea7e3456728b1211f'
                }
            }
        )

        return response.data
    }

    async refundTransaction(externalId: string) {

        const response = await axios.post(
            'http://localhost:3002/transacoes/reembolso',
            { id: externalId },
            {
                headers: {
                    'Gateway-Auth-Token': 'tk_f2198cc671b5289fa856',
                    'Gateway-Auth-Secret': '3d15e8ed6131446ea7e3456728b1211f'
                }
            }
        )

        return response.data
    }

}