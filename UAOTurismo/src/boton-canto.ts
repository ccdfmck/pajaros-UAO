import * as ecs from '@8thwall/ecs'

const manejadores = new Map<bigint, () => void>()

ecs.registerComponent({
  name: 'boton-canto',
  schema: {
    juego: ecs.string,   // ej: pechirrojo
    accion: ecs.string,  // escuchar | pista | opcion | reiniciar
    valor: ecs.string,   // solo para opcion: pechirrojo | guacamaya | otro
  },
  schemaDefaults: {
    juego: 'pechirrojo',
    accion: '',
    valor: '',
  },
  add: (world, component) => {
    const juego = component.schema.juego   // copiamos AHORA
    const accion = component.schema.accion
    const valor = component.schema.valor
    console.log('boton-canto listo:', juego, accion, valor)

    const alTocar = () => {
      world.events.dispatch(world.events.globalId, 'canto-boton', {juego, accion, valor})
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