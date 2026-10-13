import * as ecs from '@8thwall/ecs'
import {AVES} from './aves'
import {estado} from './estado'

const raices = new Map<bigint, HTMLElement>()
const botonesMenu = new Map<bigint, HTMLElement>()

//colores
const VINO = '#7B1728'
const CREMA = '#FAF7F2'
const VERDE = '#526B50'
const DORADO = '#C6A15B'
const TEXTO = '#292929'

//crear elementos HTML
const crear = (
  tag: string,
  css: string,
  texto = ''
): HTMLElement => {
  const e = document.createElement(tag)
  e.style.cssText = css
  e.textContent = texto
  return e
}

//estilo de los botones
const BOTON =
  `padding:13px 22px;font-size:15px;border:2px solid ${VINO};` +
  `border-radius:12px;background:${VINO};color:${CREMA};` +
  'font-weight:bold;margin:6px;cursor:pointer;'

ecs.registerComponent({
  name: 'menu-inicio',

  add: (world, component) => {
    //contenedor principal
    const raiz = crear(
      'div',
      'position:fixed;top:0;left:0;right:0;bottom:0;' +
      'z-index:2000;display:flex;flex-direction:column;' +
      'align-items:center;justify-content:center;' +
      'padding:20px;box-sizing:border-box;text-align:center;' +
      `font-family:'Outfit',sans-serif;color:${TEXTO};` +
      `background:${CREMA};overflow-y:auto;`
    )

    document.body.appendChild(raiz)
    raices.set(component.eid, raiz)

    //boton para volver al menu desde la camara
    const botonMenu = crear(
      'button',
      `position:fixed;top:12px;left:12px;z-index:1500;` +
      `display:none;padding:10px 16px;border:1px solid ${CREMA};` +
      `border-radius:22px;background:${VINO};color:${CREMA};` +
      'font-size:14px;font-weight:bold;cursor:pointer;',
      '☰ Menú'
    )

    document.body.appendChild(botonMenu)
    botonesMenu.set(component.eid, botonMenu)

    //cerrar menu y mostrar la experiencia AR
    const irACamara = () => {
      estado.menuAbierto = false
      raiz.style.display = 'none'
      botonMenu.style.display = 'block'
    }

    
    const transicionTarjeta = (indice: number) => {
      raiz.style.transition = 'transform 400ms cubic-bezier(0.22, 1, 0.36, 1), opacity 300ms ease'
      raiz.style.transform = 'translateX(-100%)'
      raiz.style.opacity = '0'

      window.setTimeout(() => {
        mostrarTarjetas(indice, false)

        // La tarjeta comienza entrando desde la derecha
        raiz.style.transition = 'none'
        raiz.style.transform = 'translateX(100%)'
        raiz.style.opacity = '0'

        // Aplicar el estado inicial antes de animar
        void raiz.offsetWidth

        raiz.style.transition = 'transform 400ms cubic-bezier(0.22, 1, 0.36, 1), opacity 300ms ease'
        raiz.style.transform = 'translateX(0)'
        raiz.style.opacity = '1'
      }, 300)
    }


    //PORTADA DE BIENVENIDA
    const mostrarBienvenida = () => {
      raiz.innerHTML = ''
      
    raiz.style.backgroundColor = 'rgba(250, 247, 242, 0.35)'
    raiz.style.backgroundImage ="linear-gradient(rgba(250, 247, 242, 0.7), rgba(250, 247, 242, 0.7)), url('assets/campus.jpg')"
    raiz.style.backgroundSize = 'cover'
    raiz.style.backgroundPosition = 'center'
    raiz.style.backgroundRepeat = 'no-repeat'
    raiz.style.color = TEXTO


      const contenido = crear(
        'div',
        'width:100%;max-width:380px;margin:auto;' +
        'display:flex;flex-direction:column;' +
        'align-items:center;padding:20px 8px;box-sizing:border-box;'
      )

      //decorado superior
      //const linea = crear(
      //  'div',
      //  `width:58px;height:5px;border-radius:5px;` +
      //  `background:${DORADO};margin-bottom:25px;`
      //)

      //identidad de la experiencia
      const etiqueta = crear(
        'p',
        `font-size:12px;font-weight:bold;letter-spacing:2px;` +
        `color:${VERDE};margin:0 0 15px;`,
        'TURISMO  ·  NATURALEZA  ·  BIODIVERSIDAD'
      )

      //ilustracion
      const ilustracion = document.createElement('img')
      ilustracion.src = './assets/ilustracion.png'
      ilustracion.alt = 'Ilustracion'
      ilustracion.style.cssText =
        'width:100%;max-width:270px;height:200px;' +
        'object-fit:contain;margin:0 0 12px;'

      // Titulo
      const titulo = crear(
        'h1',
        `font-size:clamp(28px,7vw,36px);line-height:1.2;` +
        `color:${VINO};margin:0 0 16px;max-width:340px;`,
        'Conociendo las aves de la UAO'
      )

      // Descripción
      const descripcion = crear(
        'p',
        'font-size:18px;line-height:1.2;color:#292929;' +
        'max-width:330px;margin:0 0 25px;',
        'Explora la biodiversidad de nuestro campus universitario y conoce las aves que lo hacen único.'
      )

      // Botón para comenzar
      const boton = crear(
        'button',
        `padding:15px 28px;border:0;border-radius:12px;` +
        `background:${VINO};color:${CREMA};font-size:16px;` +
        'font-weight:bold;cursor:pointer;' +
        'box-shadow:0 5px 14px rgba(123,23,40,0.18);',
        'Comenzar recorrido'
      )

      boton.addEventListener('click', () => {
        transicionTarjeta(0)
      })

      // Mensaje institucional sobre biodiversidad
      //const mensaje = crear(
      //  'p',
      //  `box-sizing:border-box;width:100%;max-width:340px;` +
      //  'padding:15px;margin:26px 0 0;' +
      //  `border-left:4px solid ${VERDE};` +
      //  'border-radius:0 10px 10px 0;' +
      //  'background:#E9EDE5;color:#344A35;' +
      //  'font-size:14px;line-height:1.6;text-align:left;',
      //  'Y recuerda que la UAO es un campus para la vida y la biodiversidad.'
      //)

      contenido.append(
        //linea,
        etiqueta,
        ilustracion,
        titulo,
        descripcion,
        boton,
        //mensaje
      )

      raiz.appendChild(contenido)
    }

  
    
    // TARJETAS DE LAS AVES

    // Giro 3D: mostrar u ocultar el dato curioso
    const girarTarjeta = (
      accion: () => void,
      direccion: number = 1
    ) => {
      const tarjeta =
        raiz.querySelector<HTMLElement>('[data-tarjeta]')

      if (!tarjeta) {
        accion()
        return
      }

      tarjeta.style.transition =
        'transform 280ms cubic-bezier(0.55, 0, 0.45, 1), opacity 200ms ease'

      tarjeta.style.transform =
        `perspective(1000px) rotateY(${90 * direccion}deg) scale(0.88)`

      tarjeta.style.opacity = '0'

      window.setTimeout(() => {
        accion()

        const nuevaTarjeta =
          raiz.querySelector<HTMLElement>('[data-tarjeta]')

        if (!nuevaTarjeta) return

        nuevaTarjeta.style.transition = 'none'

        nuevaTarjeta.style.transform =
          `perspective(1000px) rotateY(${-90 * direccion}deg) scale(0.88)`

        nuevaTarjeta.style.opacity = '0'

        void nuevaTarjeta.offsetWidth

        nuevaTarjeta.style.transition =
          'transform 450ms cubic-bezier(0.22, 1, 0.36, 1), opacity 250ms ease'

        nuevaTarjeta.style.transform =
          'perspective(1000px) rotateY(0deg) scale(1)'

        nuevaTarjeta.style.opacity = '1'
      }, 200)
    }

    // Efecto POP: cambiar de pájaro
    const popTarjeta = (accion: () => void) => {
      const tarjeta =
        raiz.querySelector<HTMLElement>('[data-tarjeta]')

      if (!tarjeta) {
        accion()
        return
      }

      // La tarjeta actual se encoge
      tarjeta.style.transition =
        'transform 160ms ease-in, opacity 160ms ease-in'

      tarjeta.style.transform = 'scale(0.65)'
      tarjeta.style.opacity = '0'

      window.setTimeout(() => {
        accion()

        const nuevaTarjeta =
          raiz.querySelector<HTMLElement>('[data-tarjeta]')

        if (!nuevaTarjeta) return

        // La nueva tarjeta comienza pequeña
        nuevaTarjeta.style.transition = 'none'
        nuevaTarjeta.style.transform = 'scale(0.65)'
        nuevaTarjeta.style.opacity = '0'

        void nuevaTarjeta.offsetWidth

        // Aparece con un pequeño rebote
        nuevaTarjeta.style.transition =
          'transform 220ms cubic-bezier(0.18, 0.89, 0.32, 1.28), opacity 180ms ease-out'

        nuevaTarjeta.style.transform = 'scale(1)'
        nuevaTarjeta.style.opacity = '1'
      }, 160)
    }

    // Mostrar tarjeta de cada ave
    const mostrarTarjetas = (i: number, volteada: boolean) => {
      raiz.innerHTML = ''
      raiz.style.background = CREMA
      raiz.style.color = TEXTO
      raiz.style.perspective = '1000px'

      const ave = AVES[i]

      if (!ave) {
        mostrarBienvenida()
        return
      }

      const esUltima = i === AVES.length - 1

      raiz.appendChild(
        crear(
          'p',
          `margin:0 0 12px;color:${VERDE};font-weight:bold;`,
          `Ave ${i + 1} de ${AVES.length}`
        )
      )

      // Bloque principal de la tarjeta
      const tarjeta = crear(
        'div',
        'width:100%;max-width:340px;min-height:280px;' +
        'border-radius:20px;padding:24px;box-sizing:border-box;' +
        'display:flex;flex-direction:column;align-items:center;' +
        'justify-content:center;cursor:pointer;' +
        'transform-style:preserve-3d;' +
        `background:${volteada ? '#FFFFFF' : ave.color};` +
        `color:${volteada ? TEXTO : '#FFFFFF'};` +
        'box-shadow:0 5px 18px rgba(0,0,0,0.08);'
      )

      tarjeta.dataset.tarjeta = 'true'

      // Contenido frontal
      if (!volteada) {
        tarjeta.append(
          crear('div', 'font-size:64px;', ave.emoji),

          crear(
            'h2',
            'margin:12px 0 4px;font-size:24px;',
            ave.nombre
          ),

          crear(
            'i',
            'font-size:14px;',
            ave.cientifico
          ),

          crear(
            'p',
            'margin-top:20px;font-size:14px;line-height:1.5;',
            'Toca la tarjeta para descubrir un dato curioso.'
          )
        )
      } else {
        // Contenido posterior: dato curioso
        tarjeta.append(
          crear(
            'h3',
            `margin:0 0 12px;color:${VINO};`,
            'Dato curioso'
          ),

          crear(
            'p',
            'font-size:16px;line-height:1.6;',
            ave.dato
          ),

          crear(
            'p',
            `font-size:12px;color:${VERDE};margin-top:12px;`,
            'Toca para volver'
          )
        )
      }

      // Clic en la tarjeta: conservar el giro 3D
      tarjeta.addEventListener('click', () => {
        girarTarjeta(() => {
          mostrarTarjetas(i, !volteada)
        }, 1)
      })

      raiz.appendChild(tarjeta)

      // Botones de navegación
      const fila = crear(
        'div',
        'display:flex;flex-wrap:wrap;justify-content:center;' +
        'align-items:center;margin-top:16px;'
      )

      // Botón Anterior: efecto POP
      if (i > 0) {
        const anterior = crear(
          'button',
          BOTON,
          '← Anterior'
        )

        anterior.addEventListener('click', () => {
          popTarjeta(() => {
            mostrarTarjetas(i - 1, false)
          })
        })

        fila.appendChild(anterior)
      }

      // Botón Siguiente o escanear
      const siguiente = crear(
        'button',
        BOTON,
        esUltima ? 'Ir a escanear 📷' : 'Siguiente →'
      )

      siguiente.addEventListener('click', () => {
        if (esUltima) {
          irACamara()
        } else {
          popTarjeta(() => {
            mostrarTarjetas(i + 1, false)
          })
        }
      })

      fila.appendChild(siguiente)
      raiz.appendChild(fila)
    }

    // Volver a la bienvenida desde el botón Menú
    botonMenu.addEventListener('click', () => {
      world.events.dispatch(
        world.events.globalId,
        'cerrar-quiz'
      )

      estado.menuAbierto = true
      botonMenu.style.display = 'none'
      raiz.style.display = 'flex'

      mostrarBienvenida()
    })

    // Mostrar la portada al iniciar
    mostrarBienvenida()
  },

  remove: (world, component) => {
    raices.get(component.eid)?.remove()
    raices.delete(component.eid)

    botonesMenu.get(component.eid)?.remove()
    botonesMenu.delete(component.eid)
  },
})
