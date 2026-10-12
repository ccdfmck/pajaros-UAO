import * as ecs from '@8thwall/ecs'

const manejadores = new Map<bigint, () => void>()

ecs.registerComponent({
  name: 'boton-quiz',
  schema: {
    pajaro: ecs.string,   // pajaro1, pajaro2... se elige en el Inspector
  },
  schemaDefaults: {
    pajaro: 'pajaro1',
  },
  add: (world, component) => {
    const alTocar = () => {
      world.events.dispatch(world.events.globalId, 'abrir-quiz', {
        pajaro: component.schema.pajaro,
      })
    }
    manejadores.set(component.eid, alTocar)
    world.events.addListener(component.eid, ecs.input.UI_CLICK, alTocar)
  },
  remove: (world, component) => {
    const m = manejadores.get(component.eid)
    if (m) world.events.removeListener(component.eid, ecs.input.UI_CLICK, m)
    manejadores.delete(component.eid)
  },
})