import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'Guacamaya',

  schema: {
    distancia: ecs.f32,
    duracion: ecs.f32,
    duracionGiro: ecs.f32,
  },

  schemaDefaults: {
    distancia: 5,
    duracion: 4,
    duracionGiro: 2,
  },

  data: {
    x0: ecs.f32,
    y0: ecs.f32,
    z0: ecs.f32,
    inicio: ecs.f32,
    rotY: ecs.f32,
  },

  add: (world, component) => {
    const p = ecs.Position.get(world, component.eid)
    component.data.x0 = p.x
    component.data.y0 = p.y
    component.data.z0 = p.z
    component.data.inicio = world.time.elapsed

    const r = ecs.Quaternion.get(world, component.eid)
    component.data.rotY = r ? 2 * Math.atan2(r.y, r.w) : 0
  },

  tick: (world, component) => {
    const {schema, data, eid} = component
    const tiempo = (world.time.elapsed - data.inicio) / 1000

    const avance = Math.min(tiempo / schema.duracion, 1)
    const giro = Math.min(
      Math.max((tiempo - schema.duracion) / schema.duracionGiro, 0),
      1
    )

    // Avanzar 5 unidades en Z
    ecs.Position.set(world, eid, {
      x: data.x0,
      y: data.y0,
      z: data.z0 + schema.distancia * avance,
    })

    // Girar 180 grados sobre el eje Y
    const angulo = data.rotY + Math.PI * giro

    ecs.Quaternion.set(world, eid, {
      x: 0,
      y: Math.sin(angulo / 2),
      z: 0,
      w: Math.cos(angulo / 2),
    })
  },
})