export default interface GatewayInterface {

    createTransaction(data: any): Promise<any>

    refundTransaction(externalId: string): Promise<any>

}