export type IconSize = number | 'small' | 'medium' | 'large'

export interface IconNode {
  readonly tag: string
  readonly attrs: Readonly<Record<string, string>>
  readonly children: readonly IconNode[]
}

export interface NaturalSize {
  readonly width: number
  readonly viewBox: string
  readonly nodes: readonly IconNode[]
}

export interface IconDefinition {
  readonly name: string
  readonly heights: Readonly<Record<number, NaturalSize>>
  readonly aliasOf?: string
  readonly deprecated?: boolean
}

export type SvgAttributes = Record<string, string | number | boolean | null | undefined>

export interface IconOptions {
  size?: IconSize
  fill?: string
  title?: string
  verticalAlign?: string
  attrs?: SvgAttributes
}
