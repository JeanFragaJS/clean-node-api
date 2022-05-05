import { Controller, HttpRequest, HttpResponse } from "@src/presentation/protocols"
import { LogErrorRepository } from "@src/data/protocols/db/log/log-error-repository"

export class LogControllerDecorator implements Controller { 

  //A class a ser decorada deve ser do mesmo tipo que vc está 
  //implementando ou herdando
  constructor (
    private readonly controller: Controller, 
    private readonly logErrorRepository: LogErrorRepository
    ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    if (httpResponse.statusCode === 500) {
      await this.logErrorRepository.logError(httpResponse.body.stack)
    }
    return httpResponse
  }

}