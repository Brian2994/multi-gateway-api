import { BaseModel, column } from '@adonisjs/lucid/orm'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Product from '#models/product'

export default class TransactionProduct extends BaseModel {

    @column({ isPrimary: true })
    declare id: number

    @column()
    declare transactionId: number

    @column()
    declare productId: number

    @column()
    declare quantity: number

    @belongsTo(() => Product)
    declare product: BelongsTo<typeof Product>

}