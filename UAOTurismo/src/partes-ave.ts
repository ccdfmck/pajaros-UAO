import * as ecs from '@8thwall/ecs'
import {PARTES} from './partes'
import {estado} from './estado'

type Registro = {
  clics: Array<{eid: any; fn: () => void}>
  mostrarParte: (e: any) => void
  cerrar: () => void
}
const registros = new Map<bigint, Registro>()

ecs.registerComponent({
  name: 'partes-ave',
  schema: {
    ave: ecs.string,         // guacamaya
    titulo: ecs.eid,         // texto del título
    descripcion: ecs.eid,    // texto de la descripción
    cerrarBtn: ecs.eid,      // botón X (opcional)
  },
  schemaDefaults: {
    ave: 'guacamaya',
  },
  add: (world, component) => {
    const s = component.schema
    let parteActual = ''
    let visible = false

    // --- Ayudas para cambiar texto y mostrar/ocultar ---
    const poner = (eid: any, texto: string) => {
      if (!eid) return
      ecs.Ui.mutate(world, eid, (cursor) => {
        cursor.text = texto
        return false
      })
    }
    const mostrar = (eid: any) => { if (eid) ecs.Hidden.remove(world, eid) }
    const ocultar = (eid: any) => { if (eid) ecs.Hidden.set(world, eid, {}) }

    const cerrar = () => {
      visible = false
      parteActual = ''
      ocultar(component.eid)
    }

    const mostrarParte = (e: any) => {
      if (estado.menuAbierto) return                 // no mostrar con el menú abierto
      if (e.data.ave !== s.ave) return               // solo la etiqueta de ESTA ave
      const info = PARTES[s.ave]?.[e.data.parte]
      if (!info) return
      if (visible && parteActual === e.data.parte) { // mismo punto otra vez: cerrar
        cerrar()
        return
      }
      parteActual = e.data.parte
      poner(s.titulo, info.titulo)
      poner(s.descripcion, info.texto)
      visible = true
      mostrar(component.eid)
    }

    // --- Conectar el botón X ---
    const clics: Array<{eid: any; fn: () => void}> = []
    if (s.cerrarBtn) {
      world.events.addListener(s.cerrarBtn, ecs.input.UI_CLICK, cerrar)
      clics.push({eid: s.cerrarBtn, fn: cerrar})
    }

    world.events.addListener(world.events.globalId, 'mostrar-parte', mostrarParte)
    world.events.addListener(world.events.globalId, 'cerrar-quiz', cerrar)  // el menú también la cierra
    registros.set(component.eid, {clics, mostrarParte, cerrar})

    ocultar(component.eid)   // la etiqueta empieza oculta
  },
  remove: (world, component) => {
    const r = registros.get(component.eid)
    if (!r) return
    for (const c of r.clics) world.events.removeListener(c.eid, ecs.input.UI_CLICK, c.fn)
    world.events.removeListener(world.events.globalId, 'mostrar-parte', r.mostrarParte)
    world.events.removeListener(world.events.globalId, 'cerrar-quiz', r.cerrar)
    registros.delete(component.eid)
  },
})