import * as ecs from '@8thwall/ecs'

const manejadores = new Map<bigint, () => void>()

ecs.registerComponent({
  name: 'alternar-gavilan',
  schema: {
    volando: ecs.eid,   // el gavilán que da vueltas
    posado: ecs.eid,    // el gavilán quieto
  },
  add: (world, component) => {
    // copiamos los valores AL INICIAR
    const volando = component.schema.volando
    const posado = component.schema.posado
    let esDia = true

    const aplicar = () => {
      if (esDia) {
        ecs.Hidden.remove(world, volando)
        ecs.Hidden.set(world, posado)
      } else {
        ecs.Hidden.set(world, volando)
        ecs.Hidden.remove(world, posado)
      }
      console.log(esDia ? 'dia: gavilan volando' : 'noche: gavilan posado')
    }

    const alTocar = () => {
      esDia = !esDia
      aplicar()
    }

    aplicar()
    manejadores.set(component.eid, alTocar)
    world.events.addListener(component.eid, ecs.input.UI_CLICK, alTocar)
  },
  remove: (world, component) => {
    const m = manejadores.get(component.eid)
    if (m) world.events.removeListener(component.eid, ecs.input.UI_CLICK, m)
    manejadores.delete(component.eid)
  },
})