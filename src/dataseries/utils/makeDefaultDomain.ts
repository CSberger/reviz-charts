import { extent } from 'd3-array'

export default function makeDefaultDomain(dataPoints: any) {
  const domain = {
    x: [0, 0],
    y: [0, 0]
  }
  const xValues = dataPoints.map(({ x }: { x: number }) => x) as number[]
  domain.x = extent(xValues) as [number, number]

  const yValues = dataPoints.map(({ y }: { y: number }) => y) as number[]
  domain.y = extent(yValues) as [number, number]
  return domain
}
