import createPopupManager from '../../../state/createPopupManager'

describe('createPopupManager', () => {
  describe('initial state', () => {
    test('open is false', () => {
      const manager = createPopupManager()
      manager.actions.init()
      expect(manager).toHaveProperty('state.open', false)
    })
  })

  describe('open', () => {
    test('sets open to true', () => {
      const manager = createPopupManager()
      manager.actions.init()
      manager.actions.open()
      expect(manager).toHaveProperty('state.open', true)
    })
  })

  describe('close', () => {
    test('sets open to false', () => {
      const manager = createPopupManager()
      manager.actions.init()

      manager.actions.open()
      expect(manager).toHaveProperty('state.open', true)

      manager.actions.close()
      expect(manager).toHaveProperty('state.open', false)
    })
  })

  describe('toggle', () => {
    test('calls actions.open when !open', () => {
      const spy = jest.fn(() => () => null)

      const manager = createPopupManager({
        state: { open: false },
        actions: {
          // TODO: fix typings, users don't supply init()
          init: () => () => null,
          open: spy,
        },
      })

      manager.actions.toggle()
      expect(spy).toHaveBeenCalledTimes(1)
    })

    test('calls actions.close when open', () => {
      const spy = jest.fn(() => () => null)

      const manager = createPopupManager({
        state: { open: true },
        actions: {
          // TODO: fix typings, users don't supply init()
          init: () => () => null,
          close: spy,
        },
      })

      manager.actions.toggle()
      expect(spy).toHaveBeenCalledTimes(1)
    })
  })
})
