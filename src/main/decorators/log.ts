import { Controller, HttpRequest, HttpResponse } from "@src/presentation/protocols"

export class LogControllerDecorator implements Controller { 
  private readonly controller: Controller
  //A class a ser decorada deve ser do mesmo tipo que vc está 
  //implementando ou herdando
  constructor (controller: Controller) {
    this.controller = controller
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    if (httpResponse.statusCode === 500) {
      //tratamento de logs e erros 
    }
    return httpResponse
  }

}