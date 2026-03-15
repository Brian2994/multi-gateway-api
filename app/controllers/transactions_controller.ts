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

        type ProductInput = {
            product_id: number
            quantity: number
        }

        const { name, email, cardNumber, cvv, products } = request.only([
            'name',
            'email',
            'cardNumber',
            'cvv',
            'products'
        ]) as {
            name: string
            email: string
            cardNumber: string
            cvv: string
            products: ProductInput[]
        }

        // Validação básica
        if (!products || products.length === 0) {
            return response.badRequest({
                message: 'Products are required'
            })
        }

        if (!name || !email || !cardNumber || !cvv) {
            return response.badRequest({
                message: 'Missing required fields'
            })
        }

        let total = 0

        try {

            // Cálculo do total
            const productIds = products.map((p: any) => p.product_id)

            const dbProducts = await Product
                .query()
                .whereIn('id', productIds)

            for (const item of products) {

                const product = dbProducts.find(p => p.id === item.product_id)

                if (!product) {
                    return response.badRequest({
                        message: `Product ${item.product_id} not found`
                    })
                }

                total += product.amount * item.quantity
            }

            // Garante o cliente no banco
            const client = await Client.firstOrCreate(
                { email },
                { name, email }
            )

            const paymentService = new PaymentService()

            // Processa o pagamento
            const payment = await paymentService.processPayment({
                amount: total,
                name,
                email,
                cardNumber,
                cvv
            })

            console.log('Gateway used:', payment.gateway)
            console.log('External transaction id:', payment.response.id)

            // Busca o gateway usado
            const gateway = await Gateway
                .query()
                .where('name', payment.gateway)
                .firstOrFail()

            // Cria a transação
            const transaction = await Transaction.create({
                clientId: client.id,
                gatewayId: gateway.id,
                externalId: payment.response.id,
                status: 'success',
                amount: total,
                cardLastNumbers: cardNumber.slice(-4)
            })

            // Registra os produtos da transação
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

        } catch (error) {

            console.error('Payment error:', error)

            return response.status(500).send({
                message: 'Payment failed',
                error: error.message
            })

        }

    }

    async refund({ params, response }: HttpContext) {

        try {

            const transaction = await Transaction.findOrFail(params.id)

            // Bloquear refund duplicado
            if (transaction.status === 'refunded') {
                return response.badRequest({
                    message: 'Transaction already refunded'
                })
            }

            const gateway = await Gateway.findOrFail(transaction.gatewayId)

            let service

            if (gateway.name === 'gateway1') {
                service = new Gateway1Service()
            }

            if (gateway.name === 'gateway2') {
                service = new Gateway2Service()
            }

            if (!service) {
                return response.badRequest({
                    message: 'Gateway not supported'
                })
            }

            // Executa refund no gateway
            await service.refundTransaction(transaction.externalId)

            // Atualiza status
            transaction.status = 'refunded'
            await transaction.save()

            return response.ok({
                message: 'Refund successful'
            })

        } catch (error) {

            console.error('Refund error:', error)

            return response.status(500).send({
                message: 'Refund failed',
                error: error.message
            })

        }

    }

}