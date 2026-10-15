import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'avanzar-ave',
  schema: {
    radio: ecs.f32,         // radio del círculo
    duracion: ecs.f32,      // segundos por vuelta completa
    horario: ecs.boolean,   // sentido del giro
    inclinacion: ecs.f32,   // grados que se ladea en las curvas
    oscilacion: ecs.f32,    // cuánto sube y baja (en Y)
    giroModelo: ecs.f32,    // grados extra si el modelo no mira de frente
  },
  schemaDefaults: {
    radio: 0.4,
    duracion: 6,
    horario: true,
    inclinacion: 20,
    oscilacion: 0.03,
    giroModelo: 0,
  },
  data: {
    cx: ecs.f32,
    cy: ecs.f32,
    cz: ecs.f32,
    inicio: ecs.f32,
  },
  add: (world, component) => {
    const p = ecs.Position.get(world, component.eid)
    component.data.cx = p.x
    component.data.cy = p.y
    component.data.cz = p.z
    component.data.inicio = world.time.elapsed
  },
  tick: (world, component) => {
    const {schema, data, eid} = component
    const seg = (world.time.elapsed - data.inicio) / 1000
    const sentido = schema.horario ? -1 : 1
    const theta = sentido * (seg / schema.duracion) * Math.PI * 2

    // Posición en el círculo (centro = posición inicial del objeto)
    const x = data.cx + schema.radio * Math.cos(theta)
    const z = data.cz + schema.radio * Math.sin(theta)
    // Sube y baja suave, como planeando
    const y = data.cy + schema.oscilacion * Math.sin(seg * 2.5)

    // Dirección de avance (tangente al círculo)
    const vx = -Math.sin(theta) * sentido
    const vz = Math.cos(theta) * sentido
    const yaw = Math.atan2(vx, vz) + (schema.giroModelo * Math.PI) / 180

    // Se ladea hacia el centro del giro
    const roll = (-sentido * schema.inclinacion * Math.PI) / 180

    // Cuaternión = giro en Y (yaw) combinado con ladeo (roll)
    const sy = Math.sin(yaw / 2)
    const cy = Math.cos(yaw / 2)
    const sr = Math.sin(roll / 2)
    const cr = Math.cos(roll / 2)

    ecs.Position.set(world, eid, {x, y, z})
    ecs.Quaternion.set(world, eid, {
      x: sy * sr,
      y: sy * cr,
      z: cy * sr,
      w: cy * cr,
    })
  },
})