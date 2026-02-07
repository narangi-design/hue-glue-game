# Hue Glue Game (React + TypeScript)

A learning project built with React and TypeScript.
A color puzzle game where you rearrange shuffled cells on a grid to restore a smooth gradient. Swap cells by clicking or dragging. Corner cells are fixed anchors — sort the rest by hue. Progress is saved in localStorage.

## Description

- Gradient generation with bilinear color interpolation
- Drag-and-drop and tap-to-select cell swapping
- Touch support for mobile devices
- Grid sizes: 6x6, 8x8, 10x10, 12x12
- Win detection against the target grid
- Game state saved in localStorage
- Dark/light theme with system preference support

## Technical Details

- **Vite** + **React 19** + **TypeScript**
- **@dnd-kit/core** for drag-and-drop with mouse and touch sensors
- **@radix-ui/react-toggle** and **@radix-ui/react-toggle-group** for accessible toggle components
- **@badcafe/jsonizer** for serializing class instances (Color, CellModel) to localStorage
- Color math: RGB distance, brightness, linear and bilinear interpolation, hue shifting