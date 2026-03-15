import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

import Client from '#models/client'
import Gateway from '#models/gateway'
import TransactionProduct from './transaction_product.ts'

export default class Transaction extends BaseModel {

    @column({ isPrimary: true })
    declare id: number

    @column()
    declare clientId: number

    @column()
    declare gatewayId: number

    @column()
    declare externalId: string

    @column()
    declare status: string

    @column()
    declare amount: number

    @column()
    declare cardLastNumbers: string

    @belongsTo(() => Client)
    declare client: BelongsTo<typeof Client>

    @belongsTo(() => Gateway)
    declare gateway: BelongsTo<typeof Gateway>

    @hasMany(() => TransactionProduct)
    declare products: HasMany<typeof TransactionProduct>

}