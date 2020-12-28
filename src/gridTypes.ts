export interface GmScreenConfig {
  grid: GmScreenGrid;
}

export interface GmScreenGrid {
  entries: GmScreenGridEntry[];
}

export interface GmScreenGridEntry {
  x?: number;
  y?: number;
  spanRows?: number;
  spanCols?: number;
  entityUuid?: string;
}
