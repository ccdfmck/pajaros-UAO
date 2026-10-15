import * as ecs from '@8thwall/ecs'

type V3 = {x: number, y: number, z: number}
type Estado = {
  listo: boolean
  escMio: V3
  escOtro: V3
  activo: boolean
  fin: number
  tocado: boolean
  manejador: () => void
}
const estados = new Map<bigint, Estado>()
const CASI_CERO = {x: 0.0001, y: 0.0001, z: 0.0001}

ecs.registerComponent({
  name: 'cambiar-modelo',
  schema: {
    otro: ecs.eid,
    duracion: ecs.f32,
  },
  schemaDefaults: {
    duracion: 3,
  },
  add: (world, component) => {
    const eid = component.eid
    const alTocar = () => {
      console.log('1) toque recibido')
      const e = estados.get(eid)
      if (e) e.tocado = true
    }
    estados.set(eid, {
      listo: false,
      escMio: {x: 1, y: 1, z: 1},
      escOtro: {x: 1, y: 1, z: 1},
      activo: false,
      fin: 0,
      tocado: false,
      manejador: alTocar,
    })
    world.events.addListener(eid, ecs.input.SCREEN_TOUCH_START, alTocar)
  },
  tick: (world, component) => {
    const e = estados.get(component.eid)
    if (!e) return
    const {otro, duracion} = component.schema

    if (!e.listo) {
      if (!otro) {
        console.warn('2) el campo "otro" esta VACIO en el inspector')
        return
      }
      e.escMio = {...ecs.Scale.get(world, component.eid)}
      e.escOtro = {...ecs.Scale.get(world, otro)}
      ecs.Scale.set(world, otro, CASI_CERO)
      e.listo = true
      console.log('2) listo: segundo modelo oculto, otro =', otro)
      return
    }

    if (e.tocado) {
      e.tocado = false
      if (!e.activo) {
        e.activo = true
        e.fin = world.time.elapsed + duracion * 1000
        ecs.Scale.set(world, component.eid, CASI_CERO)
        ecs.Scale.set(world, otro, e.escOtro)
        console.log('3) cambio al segundo modelo')
      }
    }

    if (e.activo && world.time.elapsed >= e.fin) {
      e.activo = false
      ecs.Scale.set(world, component.eid, e.escMio)
      ecs.Scale.set(world, otro, CASI_CERO)
      console.log('4) regreso al primer modelo')
    }
  },
  remove: (world, component) => {
    const e = estados.get(component.eid)
    if (e) world.events.removeListener(component.eid, ecs.input.SCREEN_TOUCH_START, e.manejador)
    estados.delete(component.eid)
  },
})