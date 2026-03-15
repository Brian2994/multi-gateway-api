import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import Client from '#models/client'
import Gateway from '#models/gateway'

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

}