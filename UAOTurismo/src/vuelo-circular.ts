import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'vuelo-circular',
  schema: {
    radio: ecs.f32,
    altura: ecs.f32,
    velocidad: ecs.f32,   // grados por segundo
  },
  schemaDefaults: {
    radio: 0.18,
    altura: 0.12,
    velocidad: 60,
  },
  tick: (world, component) => {
    const {radio, altura, velocidad} = component.schema
    const t = world.time.elapsed / 1000
    const ang = (t * velocidad) % 360
    const rad = ang * Math.PI / 180

    ecs.Position.set(world, component.eid, {
      x: Math.cos(rad) * radio,
      y: altura,
      z: Math.sin(rad) * radio,
    })

    // gira el cuerpo para que mire hacia donde avanza
    // (si vuela de lado, cambia -ang por -ang + 90, + 180 o - 90)
    const giro = (-ang) * Math.PI / 180 / 2
    ecs.Quaternion.set(world, component.eid, {
      x: 0,
      y: Math.sin(giro),
      z: 0,
      w: Math.cos(giro),
    })
  },
})