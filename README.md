# 🎡 Ruleta

Aplicación web de ruleta giratoria sin backend — todo corre en el navegador, sin servidores ni cuentas.

![Ruleta](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss) ![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)

## ✨ Funcionalidades

- **Gira con un toque** — haz clic sobre la ruleta para hacerla girar con animación suavizada
- **Resultado con confeti** — modal animada al terminar con efecto de confeti
- **Eliminar o continuar** — tras cada resultado puedes eliminar el elemento ganador o seguir jugando
- **Carga de elementos**
  - ✍️ Manual: añade items uno a uno
  - 📄 Archivo `.txt`: sube un archivo con un elemento por línea
  - 🔢 Números: genera automáticamente N números
- **Guardar ruletas** — guarda y carga tus ruletas favoritas con nombre (persiste en `localStorage`)
- **12 estilos visuales** para la ruleta:

| Estilo | Descripción |
|--------|-------------|
| 🎨 Clásica | Colores vivos multicolor |
| ⚡ Neón | Fondo oscuro con brillo neón |
| 🌌 Galaxia | Azules y púrpuras galácticos |
| 🔥 Fuego | Rojos y naranjas con glow |
| 🌅 Aurora | Aurora boreal sobre fondo oscuro |
| 🍬 Pastel | Tonos suaves y delicados |
| 🍭 Caramelo | Colores pop saturados |
| 🌿 Bosque | Verdes naturales |
| 🌊 Océano | Azules y turquesas |
| 🍂 Otoño | Tierras cálidas otoñales |
| 📻 Retro | Ámbar y marrones vintage |
| 🦓 Cebra | Escala de grises en blanco y negro |

## 🚀 Inicio rápido

```bash
# Instalar dependencias
npm install

# Arrancar en desarrollo
npm run dev

# Construir para producción
npm run build
```

## 🛠 Stack técnico

| Tecnología | Uso |
|-----------|-----|
| **React 18** | UI con hooks y `useReducer` |
| **TypeScript** | Tipado estático |
| **Vite** | Bundler y dev server |
| **Tailwind CSS v3** | Estilos utility-first |
| **Canvas API** | Dibujo y animación de la ruleta |
| **localStorage** | Persistencia de ruletas guardadas |

## 🏗 Arquitectura

```
src/
├── App.tsx                  # Estado global con useReducer
├── components/
│   ├── input/
│   │   └── InputPanel.tsx   # Panel de carga de elementos (manual/archivo/números)
│   ├── layout/
│   │   └── Header.tsx       # Cabecera con nombre editable y navegación
│   ├── result/
│   │   ├── ResultModal.tsx  # Modal de resultado con confeti
│   │   └── Confetti.tsx     # Partículas de confeti en canvas
│   ├── saved/
│   │   ├── SavedWheelsPanel.tsx
│   │   └── SavedWheelCard.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   └── GlassCard.tsx
│   └── wheel/
│       ├── WheelCanvas.tsx  # Contenedor responsive con ResizeObserver
│       ├── WheelPointer.tsx # Indicador triangular
│       └── StylePicker.tsx  # Selector de estilo
├── hooks/
│   ├── useWheel.ts          # Lógica de canvas + animación RAF
│   └── useSavedWheels.ts    # Persistencia en localStorage
└── services/
    ├── wheel.ts             # Matemáticas de giro (computeSpinAngle)
    ├── wheelStyles.ts       # Definición de los 12 estilos
    └── colors.ts            # Utilidades de color
```

## 🎯 Detalles técnicos

- **Animación**: `requestAnimationFrame` con curva `easeOutQuartic` (`1 - (1-t)⁴`) durante 4–6 s
- **Canvas HiDPI**: resolución × `devicePixelRatio` para pantallas Retina
- **Responsive**: `ResizeObserver` re-inicializa el canvas al tamaño real del contenedor
- **Matemáticas de giro**: el segmento ganador se determina antes de animar; la animación lleva el segmento exactamente al puntero (−π/2)
- **Sin dependencias de UI**: solo React + Lucide Icons + clsx

## 📄 Licencia

MIT
