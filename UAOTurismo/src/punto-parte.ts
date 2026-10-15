import * as ecs from '@8thwall/ecs'

const manejadores = new Map<bigint, () => void>()

ecs.registerComponent({
  name: 'punto-parte',
  schema: {
    ave: ecs.string,
    parte: ecs.string,
  },
  schemaDefaults: {
    ave: 'guacamaya',
    parte: '',
  },
  add: (world, component) => {
    const ave = component.schema.ave       // copiamos AHORA
    const parte = component.schema.parte
    console.log('punto-parte listo:', ave, parte)
    if (!parte) console.warn('punto-parte sin valor en Parte (entidad ' + component.eid + ')')

    const alTocar = () => {
      console.log('punto tocado:', ave, parte)
      if (!parte) return
      world.events.dispatch(world.events.globalId, 'mostrar-parte', {ave, parte})
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