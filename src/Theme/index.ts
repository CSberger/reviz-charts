import { interpolateBlues, interpolateReds, schemeCategory10 } from 'd3-scale-chromatic'

const TICK_COLOR = 'rgb(20, 0, 100)'

const TICK_LENGTH = 10
const TICK_WIDTH = 2

export const baseTheme = {
  colors: {
    primary: 'blue',
    secondary: 'red',
    tertiary: 'green',
    active: 'orange',
    tick: TICK_COLOR
  },
  fonts: {
    primary: 'sans-serif',
    secondary: 'serif',
    tick: 'sans-serif'
  },
  fontSizes: {
    small: 12,
    medium: 14,
    large: 16,
    tick: 8
  },
  fontWeights: {
    light: 300,
    normal: 400,
    bold: 700
  },
  colorScale: {
    primary: interpolateBlues,
    secondary: interpolateReds,
    category: schemeCategory10
  },
  axis: {
    tickLength: TICK_LENGTH,
    tickWidth: TICK_WIDTH
  }
}
