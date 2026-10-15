import * as ecs from '@8thwall/ecs'

const manejadores = new Map<bigint, () => void>()

ecs.registerComponent({
  name: 'cambiar-space',
  schema: {
    destino: ecs.string,   // nombre exacto del space al que ir
  },
  schemaDefaults: {
    destino: 'Gavilan Cara',
  },
  add: (world, component) => {
    // copiamos el valor AL INICIAR
    const destino = component.schema.destino

    const alTocar = () => {
      console.log('cambiando a space:', destino)
      try {
        world.spaces.loadSpace(destino)
      } catch (e) {
        console.error('No se pudo cargar el space "' + destino + '". Revisa el nombre.', e)
      }
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