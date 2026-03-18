# Ruleta

Aplicacion web de ruleta giratoria sin backend. Todo corre en el navegador y los datos se guardan en `localStorage`.

## Funcionalidades

- Giro animado sobre `canvas` con seleccion aleatoria del ganador.
- Carga de elementos en tres modos:
  - Manual.
  - Desde archivo `.txt` con un elemento por linea.
  - Generacion automatica de numeros.
- Guardado y carga de ruletas persistidas en `localStorage`.
- Eliminacion del ganador para seguir jugando con la lista reducida.
- Selector de 12 estilos visuales para la ruleta.
- Modal de resultado con confeti.

## Cambios recientes

- El proyecto vuelve a compilar en limpio con `npm run build`.
- Los errores al guardar ruletas ya se muestran en la interfaz.
- La ruleta cancela correctamente la animacion al desmontarse.
- Mientras un giro esta en curso no se puede salir a la vista de edicion.
- Se puede volver a importar el mismo archivo `.txt` sin recargar la pagina.

## Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Canvas API

## Estructura

```text
src/
|-- App.tsx
|-- components/
|   |-- input/
|   |-- layout/
|   |-- result/
|   |-- saved/
|   |-- ui/
|   `-- wheel/
|-- hooks/
|-- services/
`-- types/
```

## Desarrollo

```bash
npm install
npm run dev
```

La aplicacion quedara disponible en el host local que indique Vite.

## Produccion

```bash
npm run build
```

El build de produccion se genera en `dist/`.

Para revisar el resultado localmente:

```bash
npm run preview
```

## Notas tecnicas

- La animacion usa `requestAnimationFrame` y una curva `easeOutQuartic`.
- El canvas se redimensiona con `ResizeObserver` para mantener nitidez en distintos tamanos.
- El ganador se calcula antes de iniciar la animacion y el angulo final alinea el segmento con el puntero.

## Licencia

MIT
