export interface View {
  displayErrorMessage: (message: string) => void
}

export interface MessageView extends View {
  displayInfoMessage: (message: string, duration: number) => string,
  deleteMessage: (messageId: string) => void,
}

export abstract class Presenter<V extends View> {
  private readonly _view: V

  public constructor(view: V) {
    this._view = view
  }

  public async executeOperation(operation: () => Promise<void>, operationDesc: string, onFinally?: () => void) {
    try {
      await operation()
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to ${ operationDesc } because of exception: ${ error }`
      )
    } finally {
      if (onFinally) onFinally()
    }
  }

  protected async updateCount<T>(
    desc: string,
    serviceCall: () => Promise<T>,
    viewSetter: (value: T) => void
  ) {
    await this.executeOperation(async () => {
      const result = await serviceCall()
      viewSetter(result)
    }, `get ${ desc } count`)
  }

  get view(): V {
    return this._view;
  }
}