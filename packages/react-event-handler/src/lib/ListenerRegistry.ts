import { EventHandler, EventTypes } from '../types'

type ListenerRegistrySet = Set<EventHandler<EventTypes>>
type ListenerRegistries = Partial<Record<EventTypes, ListenerRegistrySet>>

class ListenerRegistry {
  private registries: ListenerRegistries = {}

  public add(type: EventTypes, handler: EventHandler<EventTypes>) {
    if (!this.registries[type]) {
      this.registries[type] = new Set()
    }

    this.registries[type].add(handler)
  }

  public remove(type: EventTypes, handler: EventHandler<EventTypes>) {
    if (this.registries[type]) {
      this.registries[type].delete(handler)

      if (this.registries[type].size === 0) {
        this.registries[type] = null
      }
    }
  }

  public dispatchable(type: EventTypes, handler: EventHandler<EventTypes>) {
    if (this.registries[type]) {
      const lastAddedHandler = Array.from(this.registries[type]).pop()

      return handler === lastAddedHandler
    }

    return false
  }
}

export default ListenerRegistry
