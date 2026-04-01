export interface ExtraProperty {
  id: string;
  name: string;
  type: string;
  defaultValue: string;
  isNested: boolean;
  nestedProperties?: ExtraProperty[];
}

export interface EntityConfig {
  id: string;
  entityName: string;
  hasExtendedState: boolean;
  extraProperties: ExtraProperty[];
  includeEffects: boolean;
  includeComponent: boolean;
  apiEndpoint: string;
}

export interface GeneratedFile {
  fileName: string;
  path: string;
  content: string;
  language: string;
}
