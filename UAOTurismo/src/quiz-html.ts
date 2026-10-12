import * as ecs from '@8thwall/ecs'
import {PREGUNTAS} from './preguntas'

// Guarda el panel HTML de cada entidad para poder quitarlo después
const paneles = new Map<bigint, HTMLElement>()

ecs.registerComponent({
  name: 'quiz-html',
  schema: {
    pajaro: ecs.string,   // se elige en el Inspector: pajaro1, pajaro2...
  },
  schemaDefaults: {
    pajaro: 'pajaro1',
  },
  add: (world, component) => {
    const preguntas = PREGUNTAS[component.schema.pajaro] ?? []
    if (preguntas.length === 0) return

    let indice = 0
    let puntaje = 0

    const panel = document.createElement('div')
    panel.style.cssText =
      'position:fixed;left:0;right:0;bottom:0;padding:16px;' +
      'background:rgba(0,0,0,0.8);color:white;font-family:sans-serif;' +
      'z-index:1000;'
    document.body.appendChild(panel)
    paneles.set(component.eid, panel)

    const mostrar = () => {
      panel.innerHTML = ''

      if (indice >= preguntas.length) {
        panel.textContent = `¡Terminaste! Puntaje: ${puntaje}/${preguntas.length}`
        return
      }

      const p = preguntas[indice]
      const titulo = document.createElement('p')
      titulo.textContent = p.texto
      panel.appendChild(titulo)

      p.opciones.forEach((opcion, i) => {
        const boton = document.createElement('button')
        boton.textContent = opcion
        boton.style.cssText = 'display:block;width:100%;margin:6px 0;padding:12px;font-size:16px;'
        boton.addEventListener('click', () => {
          const acierto = i === p.correcta
          if (acierto) puntaje++
          panel.innerHTML = ''
          const msg = document.createElement('p')
          msg.textContent = (acierto ? '¡Correcto! ' : 'Incorrecto. ') + p.explicacion
          const sig = document.createElement('button')
          sig.textContent = 'Siguiente'
          sig.style.cssText = 'padding:12px;font-size:16px;'
          sig.addEventListener('click', () => { indice++; mostrar() })
          panel.append(msg, sig)
        })
        panel.appendChild(boton)
      })
    }

    mostrar()
  },
  remove: (world, component) => {
    paneles.get(component.eid)?.remove()
    paneles.delete(component.eid)
  },
})