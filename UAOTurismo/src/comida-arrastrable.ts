import * as ecs from '@8thwall/ecs'

type V3 = {x: number, y: number, z: number}

type Arrastre = {
  inicio: V3
  escalaInicio: V3
  arrastrando: boolean
  intervalo: any
  espera: any
  empezar: (origen: string) => void
  alPresionar: () => void
  alTocarPantalla: (e: any) => void
  alMover: (e: any) => void
  alSoltar: () => void
}

const arrastres = new Map<bigint, Arrastre>()

ecs.registerComponent({
  name: 'comida-arrastrable',
  schema: {
    juego: ecs.string,
    valor: ecs.string,          // flor | bebedero | insectos | pan
    zona: ecs.eid,              // objeto vacío junto al pico del colibrí
    radio: ecs.f32,             // qué tan cerca debe soltarse
    sensibilidad: ecs.f32,      // cuánto se mueve por cada píxel que arrastras
    elevacion: ecs.f32,         // cuánto se adelanta mientras la arrastras
    escalaArrastre: ecs.f32,    // cuánto crece mientras la arrastras
  },
  schemaDefaults: {
    juego: 'colibri',
    valor: '',
    radio: 1,
    sensibilidad: 0.01,
    elevacion: 0.3,
    escalaArrastre: 1.3,
  },
  add: (world, component) => {
    // copiamos TODO al iniciar
    const eid = component.eid
    const juego = component.schema.juego
    const valor = component.schema.valor
    const zona = component.schema.zona
    const radio = component.schema.radio
    const sens = component.schema.sensibilidad
    const elev = component.schema.elevacion
    const escArr = component.schema.escalaArrastre
    const p0 = ecs.Position.get(world, eid)
    const e0 = ecs.Scale.get(world, eid)
    const inicio: V3 = {x: p0.x, y: p0.y, z: p0.z}
    const escalaInicio: V3 = {x: e0.x, y: e0.y, z: e0.z}
    console.log('comida-arrastrable listo:', juego, valor, inicio)

    const s: Arrastre = {
      inicio, escalaInicio, arrastrando: false,
      intervalo: null, espera: null,
      empezar: () => {}, alPresionar: () => {}, alTocarPantalla: () => {},
      alMover: () => {}, alSoltar: () => {},
    }

    const cancelar = () => {
      if (s.intervalo) { clearInterval(s.intervalo); s.intervalo = null }
      if (s.espera) { clearTimeout(s.espera); s.espera = null }
    }

    // Anima posición y escala de la comida hacia un destino
    const animar = (hasta: V3, escHasta: V3, ms: number, fin?: () => void) => {
      cancelar()
      const d = ecs.Position.get(world, eid)
      const e = ecs.Scale.get(world, eid)
      const desde: V3 = {x: d.x, y: d.y, z: d.z}
      const escDesde: V3 = {x: e.x, y: e.y, z: e.z}
      const t0 = Date.now()
      s.intervalo = setInterval(() => {
        const t = Math.min(1, (Date.now() - t0) / ms)
        const k = t * (2 - t) // suaviza el final
        ecs.Position.set(world, eid, {
          x: desde.x + (hasta.x - desde.x) * k,
          y: desde.y + (hasta.y - desde.y) * k,
          z: desde.z + (hasta.z - desde.z) * k,
        })
        ecs.Scale.set(world, eid, {
          x: escDesde.x + (escHasta.x - escDesde.x) * k,
          y: escDesde.y + (escHasta.y - escDesde.y) * k,
          z: escDesde.z + (escHasta.z - escDesde.z) * k,
        })
        if (t >= 1) {
          clearInterval(s.intervalo)
          s.intervalo = null
          if (fin) fin()
        }
      }, 16)
    }

    const volver = () => animar(s.inicio, s.escalaInicio, 300)

    // Inicia el arrastre (lo llaman dos caminos distintos, por si uno falla)
    s.empezar = (origen: string) => {
      if (s.arrastrando) return
      console.log('PRESIONADO', valor, 'por', origen)
      cancelar()
      s.arrastrando = true
      const p = ecs.Position.get(world, eid)
      ecs.Position.set(world, eid, {x: p.x, y: p.y, z: s.inicio.z + elev})
      ecs.Scale.set(world, eid, {
        x: s.escalaInicio.x * escArr,
        y: s.escalaInicio.y * escArr,
        z: s.escalaInicio.z * escArr,
      })
    }

    // Camino 1: el botón recibe el toque directamente
    s.alPresionar = () => s.empezar('UI_PRESSED')

    // Camino 2: el toque de pantalla cuyo objetivo es esta entidad
    s.alTocarPantalla = (ev: any) => {
      const t = ev.data && ev.data.target
      if (t !== undefined && t === eid) s.empezar('SCREEN_TOUCH_START')
    }

    s.alMover = (ev: any) => {
      console.log('MOVIENDO', valor, s.arrastrando)
      if (!s.arrastrando) return
      const c = ev.data && ev.data.change
      if (!c) return
      const p = ecs.Position.get(world, eid)
      // en pantalla Y crece hacia abajo, en la escena hacia arriba
      ecs.Position.set(world, eid, {x: p.x + c.x * sens, y: p.y - c.y * sens, z: p.z})
    }

    s.alSoltar = () => {
      console.log('SOLTADO evento', valor, s.arrastrando)
      if (!s.arrastrando) return
      s.arrastrando = false
      const p = ecs.Position.get(world, eid)
      const z = ecs.Position.get(world, zona)
      const dist = Math.hypot(p.x - z.x, p.y - z.y)
      console.log('soltado:', valor, 'distancia', dist.toFixed(2), 'radio', radio)
      if (dist <= radio) {
        // vuela al pico, se encoge, avisa al juego y reaparece en su sitio
        animar({x: z.x, y: z.y, z: p.z}, {
          x: s.escalaInicio.x * 0.2,
          y: s.escalaInicio.y * 0.2,
          z: s.escalaInicio.z * 0.2,
        }, 250, () => {
          world.events.dispatch(world.events.globalId, 'comida-boton', {juego, accion: 'comida', valor})
          s.espera = setTimeout(volver, 500)
        })
      } else {
        world.events.dispatch(world.events.globalId, 'comida-boton', {juego, accion: 'lejos', valor})
        volver()
      }
    }

    arrastres.set(eid, s)
    world.events.addListener(eid, ecs.input.UI_PRESSED, s.alPresionar)
    world.events.addListener(world.events.globalId, ecs.input.SCREEN_TOUCH_START, s.alTocarPantalla)
    world.events.addListener(world.events.globalId, ecs.input.SCREEN_TOUCH_MOVE, s.alMover)
    world.events.addListener(world.events.globalId, ecs.input.SCREEN_TOUCH_END, s.alSoltar)
  },
  remove: (world, component) => {
    const s = arrastres.get(component.eid)
    if (s) {
      if (s.intervalo) clearInterval(s.intervalo)
      if (s.espera) clearTimeout(s.espera)
      world.events.removeListener(component.eid, ecs.input.UI_PRESSED, s.alPresionar)
      world.events.removeListener(world.events.globalId, ecs.input.SCREEN_TOUCH_START, s.alTocarPantalla)
      world.events.removeListener(world.events.globalId, ecs.input.SCREEN_TOUCH_MOVE, s.alMover)
      world.events.removeListener(world.events.globalId, ecs.input.SCREEN_TOUCH_END, s.alSoltar)
    }
    arrastres.delete(component.eid)
  },
})