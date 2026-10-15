import * as ecs from '@8thwall/ecs'

type Estado = {
  t: number            // ms transcurridos de la animación (-1 = quieto)
  base: {x: number, y: number, z: number}
  baseEsc: {x: number, y: number, z: number}
  manejador: () => void
}
const estados = new Map<bigint, Estado>()
const DURACION = 900

ecs.registerComponent({
  name: 'reaccion-pajaro',
  schema: {
    salto: ecs.f32,    // altura del salto
    pulso: ecs.f32,    // cuanto crece (0.15 = 15%)
  },
  schemaDefaults: {
    salto: 0.08,
    pulso: 0.15,
  },
  add: (world, component) => {
    const eid = component.eid
    const alTocar = () => {
      const e = estados.get(eid)
      if (!e || e.t >= 0) return   // ya esta animando
      e.base = {...ecs.Position.get(world, eid)}
      e.baseEsc = {...ecs.Scale.get(world, eid)}
      e.t = 0
      console.log('pajaro tocado')
    }
    estados.set(eid, {
      t: -1,
      base: {x: 0, y: 0, z: 0},
      baseEsc: {x: 1, y: 1, z: 1},
      manejador: alTocar,
    })
    world.events.addListener(eid, ecs.input.SCREEN_TOUCH_START, alTocar)
  },
  tick: (world, component) => {
    const e = estados.get(component.eid)
    if (!e || e.t < 0) return
    // copiamos los valores primero
    const {salto, pulso} = component.schema
    e.t += world.time.delta
    const p = Math.min(e.t / DURACION, 1)
    const onda = Math.sin(Math.PI * p)   // sube y baja, de 0 a 1 a 0

    ecs.Position.set(world, component.eid, {
      x: e.base.x,
      y: e.base.y + salto * onda,
      z: e.base.z,
    })
    const f = 1 + pulso * onda
    ecs.Scale.set(world, component.eid, {
      x: e.baseEsc.x * f,
      y: e.baseEsc.y * f,
      z: e.baseEsc.z * f,
    })
    if (p >= 1) e.t = -1
  },
  remove: (world, component) => {
    const e = estados.get(component.eid)
    if (e) world.events.removeListener(component.eid, ecs.input.SCREEN_TOUCH_START, e.manejador)
    estados.delete(component.eid)
  },
})