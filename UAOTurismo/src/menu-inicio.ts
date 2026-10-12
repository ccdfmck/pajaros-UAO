import * as ecs from '@8thwall/ecs'
import {AVES} from './aves'
import {estado} from './estado'

const raices = new Map<bigint, HTMLElement>()
const botonesMenu = new Map<bigint, HTMLElement>()

// Ayuda para crear elementos HTML con estilo y texto
const crear = (tag: string, css: string, texto = ''): HTMLElement => {
  const e = document.createElement(tag)
  e.style.cssText = css
  e.textContent = texto
  return e
}

const BOTON =
  'padding:14px 28px;font-size:18px;border:none;border-radius:12px;' +
  'background:#ffb703;color:#222;font-weight:bold;margin:6px;'

ecs.registerComponent({
  name: 'menu-inicio',
  add: (world, component) => {
    const raiz = crear(
      'div',
      'position:fixed;top:0;left:0;right:0;bottom:0;z-index:2000;' +
      'display:flex;flex-direction:column;align-items:center;justify-content:center;' +
      'padding:24px;box-sizing:border-box;text-align:center;color:white;' +
      'font-family:sans-serif;background:linear-gradient(#0b3d2e,#08261c);'
    )
    document.body.appendChild(raiz)
    raices.set(component.eid, raiz)

    // Botón pequeño para volver al menú desde la cámara
    const botonMenu = crear(
      'button',
      'position:fixed;top:12px;left:12px;z-index:1500;display:none;' +
      'padding:8px 14px;border:none;border-radius:20px;' +
      'background:rgba(0,0,0,0.6);color:white;font-size:14px;',
      '☰ Menú'
    )
    document.body.appendChild(botonMenu)
    botonesMenu.set(component.eid, botonMenu)

    const irACamara = () => {
      estado.menuAbierto = false
      raiz.style.display = 'none'
      botonMenu.style.display = 'block'
    }

    const mostrarBienvenida = () => {
      raiz.innerHTML = ''
      const boton = crear('button', BOTON, 'Comenzar')
      boton.addEventListener('click', () => mostrarTarjetas(0, false))
      raiz.append(
        crear('div', 'font-size:72px;', '🐦'),
        crear('h1', 'margin:12px 0;font-size:28px;', 'Bienvenido a la experiencia Turismo UAO'),
        crear('p', 'max-width:320px;opacity:0.85;', 'Conoce las aves que viven en nuestro campus.'),
        boton
      )
    }

    const mostrarTarjetas = (i: number, volteada: boolean) => {
      raiz.innerHTML = ''
      const ave = AVES[i]
      const esUltima = i === AVES.length - 1

      raiz.appendChild(crear('p', 'margin:0 0 12px;opacity:0.8;', `Ave ${i + 1} de ${AVES.length}`))

      const tarjeta = crear(
        'div',
        'width:100%;max-width:340px;min-height:300px;border-radius:20px;padding:24px;' +
        'box-sizing:border-box;display:flex;flex-direction:column;align-items:center;' +
        `justify-content:center;background:${volteada ? '#ffffff' : ave.color};` +
        `color:${volteada ? '#222' : '#fff'};`
      )
      if (!volteada) {
        tarjeta.append(
          crear('div', 'font-size:64px;', ave.emoji),
          crear('h2', 'margin:12px 0 4px;', ave.nombre),
          crear('i', '', ave.cientifico),
          crear('p', 'margin-top:20px;font-size:14px;opacity:0.85;', 'Toca la tarjeta para ver más')
        )
      } else {
        tarjeta.append(
          crear('h3', 'margin:0 0 12px;', 'Dato curioso'),
          crear('p', 'font-size:17px;', ave.dato)
        )
      }
      tarjeta.addEventListener('click', () => mostrarTarjetas(i, !volteada))
      raiz.appendChild(tarjeta)

      const fila = crear('div', 'margin-top:16px;')
      if (i > 0) {
        const anterior = crear('button', BOTON, '← Anterior')
        anterior.addEventListener('click', () => mostrarTarjetas(i - 1, false))
        fila.appendChild(anterior)
      }
      const siguiente = crear('button', BOTON, esUltima ? 'Ir a escanear 📷' : 'Siguiente →')
      siguiente.addEventListener('click', () => (esUltima ? irACamara() : mostrarTarjetas(i + 1, false)))
      fila.appendChild(siguiente)
      raiz.appendChild(fila)
    }

    botonMenu.addEventListener('click', () => {
      estado.menuAbierto = true
      world.events.dispatch(world.events.globalId, 'cerrar-quiz')
      botonMenu.style.display = 'none'
      raiz.style.display = 'flex'
      estado.menuAbierto = true
      mostrarBienvenida()
    })

    mostrarBienvenida()
  },
  remove: (world, component) => {
    raices.get(component.eid)?.remove()
    raices.delete(component.eid)
    botonesMenu.get(component.eid)?.remove()
    botonesMenu.delete(component.eid)
  },
})