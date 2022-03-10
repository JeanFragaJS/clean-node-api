import { Controller, HttpRequest, HttpResponse } from "@src/presentation/protocols"
import { LogErrorRepository } from "@src/data/protocols/log-error-repository"

export class LogControllerDecorator implements Controller { 
  private readonly controller: Controller
  private readonly logErrorRepository: LogErrorRepository 
  //A class a ser decorada deve ser do mesmo tipo que vc está 
  //implementando ou herdando
  constructor (
    controller: Controller, 
    logErrorRepository: LogErrorRepository
    ) {
    this.controller = controller
    this.logErrorRepository = logErrorRepository
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    if (httpResponse.statusCode === 500) {
      await this.logErrorRepository.log(httpResponse.body.stack)
    }
    return httpResponse
  }

}