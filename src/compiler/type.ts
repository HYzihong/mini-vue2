
export interface nodeAttrsType {
  name: string, value: any
}

export enum nodeElementTypeEnum {
  ELEMENT_TYPE = 1,
  TEXT_TYPE = 3
}

export type nodeChildrenType = nodeELementType | nodeTextType

export interface nodeELementType {
  tag?: string,
  type?: nodeElementTypeEnum,
  attrs?: nodeAttrsType[],
  children?: nodeChildrenType[],
  parent?: nodeELementType | null
}

export interface nodeTextType extends nodeELementType {
  type?: nodeElementTypeEnum.TEXT_TYPE,
  text?: string
}
