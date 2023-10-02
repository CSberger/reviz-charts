import { scaleLinear, scaleLog, scaleTime, NumberValue, scaleBand, ScaleBand } from 'd3-scale'

export enum ScaleType {
  Linear = 'linear',
  Log = 'log',
  Time = 'time',
  Band = 'band'
}

export function makeScale(
  scaleType: ScaleType,
  domain: NumberValue[] | String[],
  innerPadding = 0,
  outerPadding = 0
): any {
  switch (scaleType) {
    case ScaleType.Linear:
      const linearDomain = domain as NumberValue[]
      return scaleLinear().domain(linearDomain)
    case ScaleType.Log:
      const logDomain = domain as NumberValue[]
      return scaleLog().domain(logDomain[0] === 0 ? [1, logDomain[1]] : logDomain)
    case ScaleType.Time:
      const timeDomain = domain as NumberValue[]
      return scaleTime().domain(timeDomain)
    case ScaleType.Band:
      const bandDomain = domain as Iterable<string>
      return scaleBand()
        .domain(bandDomain)
        .paddingInner(innerPadding)
        .paddingOuter(outerPadding)
        .round(true)
  }
}
