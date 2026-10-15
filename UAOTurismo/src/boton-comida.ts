import * as ecs from '@8thwall/ecs'

const manejadores = new Map<bigint, () => void>()

ecs.registerComponent({
  name: 'boton-comida',
  schema: {
    juego: ecs.string,   // ej: colibri
    accion: ecs.string,  // comida | reiniciar
    valor: ecs.string,   // flor | bebedero | insectos | pan
  },
  schemaDefaults: {
    juego: 'colibri',
    accion: '',
    valor: '',
  },
  add: (world, component) => {
    const juego = component.schema.juego   // copiamos AHORA
    const accion = component.schema.accion
    const valor = component.schema.valor
    console.log('boton-comida listo:', juego, accion, valor)

    const alTocar = () => {
      world.events.dispatch(world.events.globalId, 'comida-boton', {juego, accion, valor})
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