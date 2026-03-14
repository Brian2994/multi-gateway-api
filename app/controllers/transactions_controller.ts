import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import Client from '#models/client'
import Transaction from '#models/transaction'
import TransactionProduct from '#models/transaction_product'
import PaymentService from '#services/payment_service'
import Gateway from '#models/gateway'
import Gateway1Service from '#gateways/gateway1_service'
import Gateway2Service from '#gateways/gateway2_service'

export default class TransactionsController {

    async purchase({ request, response }: HttpContext) {

        const { name, email, cardNumber, cvv, products } = request.only([
            'name',
            'email',
            'cardNumber',
            'cvv',
            'products'
        ])

        let total = 0
        // 1. Cálculo do total
        for (const item of products) {

            const product = await Product.findOrFail(item.product_id)

            total += product.amount * item.quantity
        }
        // 2. Garante o cliente no banco
        const client = await Client.firstOrCreate(
            { email },
            { name, email }
        )

        const paymentService = new PaymentService()
        // 3. Processa o pagamento via Service (Failover interno)
        const payment = await paymentService.processPayment({
            amount: total,
            name,
            email,
            cardNumber,
            cvv
        })
        // 4. Cria a transação (Ajustado de 'gateway' para 'gatewayId')
        const gateway = await Gateway
            .query()
            .where('name', payment.gateway)
            .firstOrFail()

        const transaction = await Transaction.create({
            clientId: client.id,
            gatewayId: gateway.id,
            externalId: payment.response.id,
            status: 'success',
            amount: total,
            cardLastNumbers: cardNumber.slice(-4)
        })
        // 5. Registra os produtos da transação
        for (const item of products) {

            await TransactionProduct.create({
                transactionId: transaction.id,
                productId: item.product_id,
                quantity: item.quantity
            })

        }

        return response.ok({
            message: 'Payment successful',
            transaction
        })

    }

    async refund({ params, response }: HttpContext) {

        const transaction = await Transaction.findOrFail(params.id)

        const gateway = await Gateway.findOrFail(transaction.gatewayId)

        let service

        if (gateway.name === 'gateway1') {
            service = new Gateway1Service()
        }

        if (gateway.name === 'gateway2') {
            service = new Gateway2Service()
        }

        if (!service) {
            return response.badRequest({ message: 'Gateway not supported' })
        }

        await service.refundTransaction(transaction.externalId)

        transaction.status = 'refunded'
        await transaction.save()

        return response.ok({
            message: 'Refund successful'
        })

    }

}