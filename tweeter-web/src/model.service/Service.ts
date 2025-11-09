import { ServerFacade } from "../network/ServerFacade";

export abstract class Service {
  protected serverFacade: ServerFacade

  public constructor() {
    this.serverFacade = this.serverFacadeFactory()
  }

  private serverFacadeFactory(): ServerFacade {
    return new ServerFacade()
  }
}
