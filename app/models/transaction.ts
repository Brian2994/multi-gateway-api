import { BaseModel, column } from '@adonisjs/lucid/orm'

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

}