
export interface EventHandler {
  (data?: any): any | Promise<any>
}

export interface Subscription {
  handler: EventHandler
  pullable: boolean
}

export interface EventSubscriptions {
  [seq: string]: Subscription
}

export interface Subscriptions {
  [eventName: string]: EventSubscriptions
}

/**
 * Subscription Descriptor
 */
export interface Descriptor extends Array<any> {
  /** Event Name */
  0: string
  /** Sequence Number */
  1: number
}

export interface EventBus {
  on (eventName: string, handler: EventHandler, pullable?: boolean): Descriptor
  off (descriptor: Descriptor): void
  emit (eventName: string, data?: any): Promise<any>
}

export function makeEventBus (): EventBus {
  const state = {
    subs: <Subscriptions> {},
    subSeq: 0,
    returnFn: <any> false,
  }

  return {
    on (eventName, handler, pullable) {
      pullable = !!pullable
      if (!state.subs[eventName]) {
        state.subs[eventName] = {}
      }
      let seq = state.subSeq
      state.subs[eventName][seq] = {
        handler,
        pullable,
      }
      state.subSeq++
      return [eventName, seq]
    },
    off ([eventName, seq]) {
      delete state.subs[eventName][seq]
      if (Object.keys(state.subs[eventName]).length === 0) {
        // Delete empty tables
        delete state.subs[eventName]
      }
    },
    async emit (eventName, data) {
      let evSpace = state.subs[eventName]
      if (!evSpace) {
        return
      }
      Object.keys(evSpace)
        .filter(seq => !evSpace[seq].pullable)
        .forEach(seq => evSpace[seq].handler(data))

        // Await pullable subscribers
      let results = await Promise.all(
        Object.keys(evSpace)
          .filter(seq => evSpace[seq].pullable)
          .map(seq => evSpace[seq].handler(data))
      )
      return results
    },
  }
}
