import type {
  EntityConfig,
  ExtraProperty,
  GeneratedFile,
} from "../types/generator";

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function camelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^(.)/, (c) => c.toLowerCase());
}

function kebabCase(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

function renderDefaultValue(prop: ExtraProperty): string {
  if (
    prop.isNested &&
    prop.nestedProperties &&
    prop.nestedProperties.length > 0
  ) {
    const nested = prop.nestedProperties
      .map((np) => `    ${np.name}: ${np.defaultValue}`)
      .join(",\n");
    return `{\n${nested}\n  }`;
  }
  return prop.defaultValue;
}

function renderTypeDefinition(prop: ExtraProperty): string {
  if (
    prop.isNested &&
    prop.nestedProperties &&
    prop.nestedProperties.length > 0
  ) {
    const nested = prop.nestedProperties
      .map((np) => `    ${np.name}: ${np.type};`)
      .join("\n");
    return `{\n${nested}\n  }`;
  }
  return prop.type;
}

// ─── Base Types File ─────────────────────────────────────────────
export function generateBaseTypes(): GeneratedFile {
  const content = `// libs/store/src/lib/models/base.models.ts
// ─── Created By Juan Pedro Trionfini ─────────────────
// Base types shared across all entity stores base on Spring HATEOAS responses.

export interface Link {
  href: string;
}

/**
 * Spring HATEOAS HAL links block.
 * \`self\` is always present; navigation links are optional depending on the page.
 */
export interface Links {
  self:   Link;
  first?: Link;
  last?:  Link;
  next?:  Link;
  prev?:  Link;
  [key: string]: Link | undefined;
}

/**
 * Pagination metadata returned by Spring Data in the \`page\` block.
 */
export interface ItemPage {
  number:        number;
  size:          number;
  totalElements: number;
  totalPages:    number;
}

export interface Payload {
  key:       string;
  value:     string;
  operator?: string;
}

export interface BaseEntity {
  id:           number;
  name:         string;
  displayValue: string;
  insertDate:   string;
  insertUser:   string;
  _links:       Links;
}

/**
 * Maps a Spring HATEOAS HAL paginated response (output — what the server returned).
 *
 * Spring response shape:
 * {
 *   _embedded: { someEntityList: [...] },
 *   _links:    { self, first, last, next, prev },
 *   page:      { number, size, totalElements, totalPages }
 * }
 */
export interface ItemsPaginated<T> {
  list:  T[];
  links: Links;
  page:  ItemPage;
}

/**
 * Query parameters sent TO the server (input).
 * Kept separate from \`ItemsPaginated\` which reflects what the server confirmed.
 *
 * \`page\` and \`size\` are what was requested — the server may return different
 * values in \`items.page\` if the request was out of range.
 */
export interface QueryParams {
  page:    number;
  size:    number;
  sort?:   string;    // Spring format: 'fieldName,asc' | 'fieldName,desc'
  search?: string;    // free-text / name filter
  filters: Payload[]; // additional key/value/operator filters
}

export const defaultQueryParams: QueryParams = {
  page:    0,
  size:    20,
  sort:    undefined,
  search:  undefined,
  filters: [],
};

export interface BaseState<T extends BaseEntity> {
  isLoading:   boolean;
  isCreated:   boolean;
  isUpdated:   boolean;
  isCopied:    boolean;
  isDeleted:   boolean;
  newRecordId: number;
  items:       ItemsPaginated<T>;
  /** Flat list loaded without pagination (e.g. for dropdowns / select inputs). */
  allItems:    T[];
  /** Currently selected entity. \`null\` means nothing is selected. */
  selected:    T | null;
  queryParams: QueryParams;
}
`;
  return {
    fileName: "base.models.ts",
    path: "libs/store/src/lib/models/base.models.ts",
    content,
    language: "typescript",
  };
}

// ─── Initial State Factory ───────────────────────────────────────
export function generateInitialStateFactory(): GeneratedFile {
  const content = `// libs/store/src/lib/factories/initial-state.factory.ts
import { BaseEntity, BaseState, defaultQueryParams } from '../models/base.models';

/**
 * Creates a typed initial state for any entity.
 * Supports extending with extra properties via the Extra generic.
 *
 * @param extra - Additional properties to merge into the base state
 */
export function createInitialState<
  T extends BaseEntity,
  Extra extends Record<string, unknown> = Record<string, never>
>(extra?: Extra): BaseState<T> & Extra {
  const baseState: BaseState<T> = {
    isLoading:   false,
    isCreated:   false,
    isUpdated:   false,
    isCopied:    false,
    isDeleted:   false,
    newRecordId: 0,
    items: {
      list:  [],
      links: { self: { href: '' } },
      page: {
        number:        0,
        size:          0,
        totalElements: 0,
        totalPages:    0,
      },
    },
    allItems:    [],
    selected:    null,
    queryParams: { ...defaultQueryParams },
  };

  return {
    ...baseState,
    ...(extra ?? {}),
  } as BaseState<T> & Extra;
}
`;
  return {
    fileName: "initial-state.factory.ts",
    path: "libs/store/src/lib/factories/initial-state.factory.ts",
    content,
    language: "typescript",
  };
}

// ─── Store Factory ───────────────────────────────────────────────
export function generateStoreFactory(): GeneratedFile {
  const content = `// libs/store/src/lib/factories/store.factory.ts
import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  BaseEntity,
  BaseState,
  Links,
  ItemPage,
  QueryParams,
  defaultQueryParams,
} from '../models/base.models';

/**
 * Factory that generates a fully typed NgRx SignalStore for any entity.
 *
 * Usage:
 *   const StatusStore  = createEntityStore<StatusEntity>('Status', initialStatusState);
 *   const ProductStore = createEntityStore<ProductEntity, ProductExtra>('Product', initialProductState);
 */
export function createEntityStore<
  T extends BaseEntity,
  Extra extends Record<string, unknown> = Record<string, never>
>(storeName: string, initialState: BaseState<T> & Extra) {
  return signalStore(
    { providedIn: 'root' },

    // ── State ────────────────────────────────────────────────
    withState<BaseState<T> & Extra>(initialState),

    // ── Computed Signals ─────────────────────────────────────
    withComputed((state: any) => ({
      itemList:           computed(() => state.items().list),
      itemLinks:          computed(() => state.items().links),
      itemPage:           computed(() => state.items().page),
      totalElements:      computed(() => state.items().page.totalElements),
      totalPages:         computed(() => state.items().page.totalPages),
      currentPage:        computed(() => state.items().page.number),
      pageSize:           computed(() => state.items().page.size),
      allItemsList:       computed(() => state.allItems()),
      // selected helpers — null-safe
      selectedId:         computed(() => state.selected()?.id   ?? null),
      selectedName:       computed(() => state.selected()?.name ?? null),
      hasSelected:        computed(() => state.selected() !== null),
      hasActiveOperation: computed(
        () =>
          state.isCreated() ||
          state.isUpdated() ||
          state.isCopied()  ||
          state.isDeleted()
      ),
    })),

    // ── Methods ──────────────────────────────────────────────
    withMethods((store: any) => ({

      // ── Loading ────────────────────────────────────────────
      setLoading(isLoading: boolean): void {
        patchState(store, { isLoading } as any);
      },

      // ── CRUD flags ─────────────────────────────────────────
      markCreated(): void {
        patchState(store, { isCreated: true, isLoading: false } as any);
      },
      markUpdated(): void {
        patchState(store, { isUpdated: true, isLoading: false } as any);
      },
      markDeleted(): void {
        patchState(store, { isDeleted: true, isLoading: false } as any);
      },
      markCopied(): void {
        patchState(store, { isCopied: true, isLoading: false } as any);
      },

      resetFlags(): void {
        patchState(store, {
          isCreated: false,
          isUpdated: false,
          isCopied:  false,
          isDeleted: false,
          isLoading: false,
        } as any);
      },

      // ── Items ──────────────────────────────────────────────
      setItems(list: T[], links: Links, page: ItemPage): void {
        patchState(store, {
          items:     { list, links, page },
          isLoading: false,
        } as any);
      },

      setAllItems(list: T[]): void {
        patchState(store, { allItems: list } as any);
      },

      // ── Selected ───────────────────────────────────────────
      setSelected(entity: T): void {
        patchState(store, { selected: entity } as any);
      },

      clearSelected(): void {
        patchState(store, { selected: null } as any);
      },

      // ── Query Params ───────────────────────────────────────
      /**
       * Replaces the entire queryParams object.
       * Use when navigating to a preset search state.
       */
      setQueryParams(params: QueryParams): void {
        patchState(store, { queryParams: params } as any);
      },

      /**
       * Merges partial changes into queryParams and resets to page 0.
       * Use for filter/sort/search changes where pagination should restart.
       */
      patchQueryParams(partial: Partial<Omit<QueryParams, 'page'>>): void {
        patchState(store, {
          queryParams: { ...store.queryParams(), ...partial, page: 0 },
        } as any);
      },

      /**
       * Advances to the requested page without touching other query params.
       */
      setPage(page: number): void {
        patchState(store, {
          queryParams: { ...store.queryParams(), page },
        } as any);
      },

      resetQueryParams(): void {
        patchState(store, { queryParams: { ...defaultQueryParams } } as any);
      },

      // ── Misc ───────────────────────────────────────────────
      setNewRecordId(id: number): void {
        patchState(store, { newRecordId: id } as any);
      },

      /** Generic patch for extra / extended state properties. */
      patch(partial: Partial<BaseState<T> & Extra>): void {
        patchState(store, partial as any);
      },

      /** Resets the entire store to its initial state. */
      reset(): void {
        patchState(store, initialState as any);
      },
    }))
  );
}
`;
  return {
    fileName: "store.factory.ts",
    path: "libs/store/src/lib/factories/store.factory.ts",
    content,
    language: "typescript",
  };
}

// ─── CRUD Effects Feature ────────────────────────────────────────
export function generateCrudFeature(): GeneratedFile {
  const content = `// libs/store/src/lib/features/with-crud-effects.feature.ts
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStoreFeature,
  withMethods,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { BaseEntity, Links, ItemPage } from '../models/base.models';

// ─── Spring HATEOAS helpers ──────────────────────────────────────

/**
 * Extracts the item array from a Spring HATEOAS _embedded block.
 *
 * Spring wraps the list under a dynamic key derived from the entity name
 * (e.g. _embedded.productList, _embedded.statusEntityList).
 * We grab the first array value regardless of the key name.
 *
 * @example
 * // { _embedded: { productList: [...] }, _links: {...}, page: {...} }
 * extractEmbedded(response._embedded) // → [...]
 */
function extractEmbedded<T>(embedded: Record<string, T[]> | undefined): T[] {
  if (!embedded) return [];
  const firstKey = Object.keys(embedded)[0];
  return firstKey ? (embedded[firstKey] ?? []) : [];
}

/**
 * Maps Spring HATEOAS _links to our Links shape.
 * Only standard navigation links are mapped; \`self\` falls back to empty string.
 */
function mapLinks(raw: Record<string, { href: string }> | undefined): Links {
  return {
    self:  { href: raw?.['self']?.href  ?? '' },
    first: raw?.['first'] ? { href: raw['first'].href } : undefined,
    last:  raw?.['last']  ? { href: raw['last'].href  } : undefined,
    next:  raw?.['next']  ? { href: raw['next'].href  } : undefined,
    prev:  raw?.['prev']  ? { href: raw['prev'].href  } : undefined,
  };
}

/**
 * Maps the Spring Data \`page\` block.
 * Spring returns 0-based page numbers.
 */
function mapPage(raw: Record<string, number> | undefined): ItemPage {
  return {
    number:        raw?.['number']        ?? 0,
    size:          raw?.['size']          ?? 0,
    totalElements: raw?.['totalElements'] ?? 0,
    totalPages:    raw?.['totalPages']    ?? 0,
  };
}

// ─── Feature ─────────────────────────────────────────────────────

/**
 * Reusable SignalStore feature that adds CRUD rxMethod effects.
 *
 * Usage:
 *   signalStore(
 *     withState(initialState),
 *     withCrudEffects<MyEntity>({ endpoint: '/api/my-entities' })
 *   )
 */
export function withCrudEffects<T extends BaseEntity>(config: {
  endpoint: string;
}) {
  return signalStoreFeature(
    withMethods((store: any) => {
      // const apiService = inject(ApiService);

      return {

        /** Load a paginated page. Reads the current \`queryParams\` from the store. */
        loadItems: rxMethod<void>(
          pipe(
            tap(() => patchState(store, { isLoading: true } as any)),
            switchMap(() => {
              const { page, size, sort, search, filters } = store.queryParams();
              // Replace with your actual service call:
              // return apiService.getPage(config.endpoint, { page, size, sort, search, filters })
              return new Promise<any>((resolve) => resolve({})).then(
                tapResponse({
                  next: (response: any) => {
                    patchState(store, {
                      items: {
                        list:  extractEmbedded<T>(response._embedded),
                        links: mapLinks(response._links),
                        page:  mapPage(response.page),
                      },
                      isLoading: false,
                    } as any);
                  },
                  error: (err: unknown) => {
                    console.error(\`[Store] Error loading from \${config.endpoint}\`, err);
                    patchState(store, { isLoading: false } as any);
                  },
                })
              );
            })
          )
        ),

        /** Load the full unpaginated list (e.g. for dropdowns). */
        loadAllItems: rxMethod<void>(
          pipe(
            tap(() => patchState(store, { isLoading: true } as any)),
            switchMap(() =>
              // apiService.getAll(config.endpoint)
              new Promise<any>((resolve) => resolve({})).then(
                tapResponse({
                  next: (response: any) => {
                    patchState(store, {
                      allItems:  extractEmbedded<T>(response._embedded),
                      isLoading: false,
                    } as any);
                  },
                  error: (err: unknown) => {
                    console.error(\`[Store] Error loading all from \${config.endpoint}\`, err);
                    patchState(store, { isLoading: false } as any);
                  },
                })
              )
            )
          )
        ),

        createItem: rxMethod<T>(
          pipe(
            tap(() => patchState(store, { isLoading: true } as any)),
            switchMap((entity) =>
              // apiService.create(config.endpoint, entity)
              new Promise<any>((resolve) => resolve(entity)).then(
                tapResponse({
                  next: (created: any) => {
                    patchState(store, {
                      isCreated:   true,
                      newRecordId: created?.id ?? 0,
                      isLoading:   false,
                    } as any);
                  },
                  error: (err: unknown) => {
                    console.error(\`[Store] Error creating in \${config.endpoint}\`, err);
                    patchState(store, { isLoading: false } as any);
                  },
                })
              )
            )
          )
        ),

        updateItem: rxMethod<T>(
          pipe(
            tap(() => patchState(store, { isLoading: true } as any)),
            switchMap((entity) =>
              // apiService.update(config.endpoint, entity)
              new Promise<any>((resolve) => resolve(entity)).then(
                tapResponse({
                  next: () => {
                    patchState(store, { isUpdated: true, isLoading: false } as any);
                  },
                  error: (err: unknown) => {
                    console.error(\`[Store] Error updating in \${config.endpoint}\`, err);
                    patchState(store, { isLoading: false } as any);
                  },
                })
              )
            )
          )
        ),

        deleteItem: rxMethod<number>(
          pipe(
            tap(() => patchState(store, { isLoading: true } as any)),
            switchMap((id) =>
              // apiService.delete(config.endpoint, id)
              new Promise<any>((resolve) => resolve(id)).then(
                tapResponse({
                  next: () => {
                    patchState(store, { isDeleted: true, isLoading: false } as any);
                  },
                  error: (err: unknown) => {
                    console.error(\`[Store] Error deleting from \${config.endpoint}\`, err);
                    patchState(store, { isLoading: false } as any);
                  },
                })
              )
            )
          )
        ),
      };
    })
  );
}
`;
  return {
    fileName: "with-crud-effects.feature.ts",
    path: "libs/store/src/lib/features/with-crud-effects.feature.ts",
    content,
    language: "typescript",
  };
}

// ─── Public API (store.create) ───────────────────────────────────
export function generatePublicApi(): GeneratedFile {
  const content = `// libs/store/src/lib/store.create.ts
// ─── Public API: store.create() ──────────────────────────────
import { BaseEntity, BaseState } from './models/base.models';
import { createInitialState } from './factories/initial-state.factory';
import { createEntityStore } from './factories/store.factory';

/**
 * Main entry point for creating entity stores.
 *
 * @example
 * // Simple entity (no extra state)
 * const StatusStore = store.create<StatusEntity>({ name: 'Status' });
 *
 * @example
 * // Extended entity (with extra state)
 * const ProductStore = store.create<ProductEntity, ProductExtra>({
 *   name: 'Product',
 *   extra: { filters: { category: '', minPrice: 0 } },
 * });
 */
export const store = {
  create<
    T extends BaseEntity,
    Extra extends Record<string, unknown> = Record<string, never>
  >(config: {
    name:   string;
    extra?: Extra;
  }) {
    const initialState = createInitialState<T, Extra>(config.extra);
    return createEntityStore<T, Extra>(config.name, initialState);
  },
};

export default store;
`;
  return {
    fileName: "store.create.ts",
    path: "libs/store/src/lib/store.create.ts",
    content,
    language: "typescript",
  };
}

// ─── Library Index ───────────────────────────────────────────────
export function generateLibraryIndex(): GeneratedFile {
  const content = `// libs/store/src/index.ts
// ─── Public API ──────────────────────────────────────────────

// Models
export * from './lib/models/base.models';

// Factories
export * from './lib/factories/initial-state.factory';
export * from './lib/factories/store.factory';

// Features
export * from './lib/features/with-crud-effects.feature';

// Main entry point
export { store } from './lib/store.create';
`;
  return {
    fileName: "index.ts",
    path: "libs/store/src/index.ts",
    content,
    language: "typescript",
  };
}

// ─── Entity-specific files ───────────────────────────────────────

export function generateEntityModel(config: EntityConfig): GeneratedFile {
  const name = capitalize(camelCase(config.entityName));
  const kebab = kebabCase(config.entityName);

  let extraTypeBlock = "";
  let extraStateType = "";

  if (config.hasExtendedState && config.extraProperties.length > 0) {
    const props = config.extraProperties
      .map((p) => `  ${p.name}: ${renderTypeDefinition(p)};`)
      .join("\n");

    extraTypeBlock = `\nexport interface ${name}Extra {\n${props}\n}\n`;
    extraStateType = `\nexport type ${name}State = BaseState<${name}Entity> & ${name}Extra;\n`;
  }

  const content = `// features/${kebab}/models/${kebab}.models.ts
import { BaseEntity, BaseState } from '@libs/store';

export interface ${name}Entity extends BaseEntity {
  // Add entity-specific fields here
  // Example:
  // description: string;
  // status: 'active' | 'inactive';
}
${extraTypeBlock}${extraStateType}
export const default${name}Entity: ${name}Entity = {
  id:           0,
  name:         '',
  displayValue: '',
  insertDate:   '',
  insertUser:   '',
  _links: {
    self: { href: '' },
  },
};
`;

  return {
    fileName: `${kebab}.models.ts`,
    path: `features/${kebab}/models/${kebab}.models.ts`,
    content,
    language: "typescript",
  };
}

export function generateEntityStore(config: EntityConfig): GeneratedFile {
  const name = capitalize(camelCase(config.entityName));
  const kebab = kebabCase(config.entityName);

  const hasExtra = config.hasExtendedState && config.extraProperties.length > 0;
  const importExtra = hasExtra ? `, ${name}Extra` : "";
  const extraType = hasExtra ? `, ${name}Extra` : "";
  const storeCreate = hasExtra
    ? `store.create<${name}Entity${extraType}>`
    : `store.create<${name}Entity>`;

  const content = `// features/${kebab}/store/${kebab}.store.ts
import { store } from '@libs/store';
import { ${name}Entity${importExtra} } from '../models/${kebab}.models';

export const ${name}Store = ${storeCreate}({
  name: '${name}'${
    hasExtra
      ? `,\n  extra: {\n${config.extraProperties
          .map((p) => `    ${p.name}: ${renderDefaultValue(p)}`)
          .join(",\n")}\n  }`
      : ""
  },
});
`;

  return {
    fileName: `${kebab}.store.ts`,
    path: `features/${kebab}/store/${kebab}.store.ts`,
    content,
    language: "typescript",
  };
}

export function generateEntityComponent(config: EntityConfig): GeneratedFile {
  const name = capitalize(camelCase(config.entityName));
  const kebab = kebabCase(config.entityName);

  const hasExtra = config.hasExtendedState && config.extraProperties.length > 0;

  let extraSignals = "";
  let extraTemplate = "";

  if (hasExtra) {
    extraSignals = config.extraProperties
      .map(
        (p) =>
          `  // Extended property: ${p.name}\n  readonly ${p.name} = computed(() => this.store.${p.name}());`,
      )
      .join("\n");

    extraTemplate = `
    <!-- Extended Properties -->
    <div class="extended-properties">
${config.extraProperties
  .map((p) => `      <div>{{ store.${p.name}() | json }}</div>`)
  .join("\n")}
    </div>`;
  }

  const content = `// features/${kebab}/components/${kebab}-list.component.ts
import { Component, computed, effect, inject } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { ${name}Store } from '../store/${kebab}.store';

@Component({
  selector: 'app-${kebab}-list',
  standalone: true,
  imports: [JsonPipe],
  template: \`
    <div class="p-4">
      <h2 class="text-2xl font-bold mb-4">${name} List</h2>

      @if (store.isLoading()) {
        <p-progressSpinner />
      }

      <p-table
        [value]="store.itemList()"
        [paginator]="true"
        [rows]="store.queryParams().size"
        [totalRecords]="store.totalElements()"
        [lazy]="true"
        (onLazyLoad)="onPageChange($event)"
      >
        <ng-template pTemplate="header">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Display Value</th>
            <th>Actions</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-item>
          <tr>
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.displayValue }}</td>
            <td>
              <p-button
                icon="pi pi-pencil"
                (onClick)="onSelect(item)"
                [rounded]="true"
                [text]="true"
              />
              <p-button
                icon="pi pi-trash"
                severity="danger"
                (onClick)="onDelete(item.id)"
                [rounded]="true"
                [text]="true"
              />
            </td>
          </tr>
        </ng-template>
      </p-table>
${extraTemplate}

      <!-- Total: {{ store.totalElements() }} -->
      <!-- Page: {{ store.currentPage() }} / {{ store.totalPages() }} -->

      @if (store.hasSelected()) {
        <!-- Selected: {{ store.selected() | json }} -->
      }
    </div>
  \`,
})
export class ${name}ListComponent {
  readonly store = inject(${name}Store);

  readonly isEmpty = computed(() => this.store.itemList().length === 0);
  readonly summary = computed(
    () => \`Showing \${this.store.itemList().length} of \${this.store.totalElements()}\`
  );
${extraSignals}

  constructor() {
    effect(() => {
      if (this.store.isCreated()) {
        console.log('${name} created — new id:', this.store.newRecordId());
        this.store.resetFlags();
        this.store.loadItems();
      }
    });

    effect(() => {
      if (this.store.isDeleted()) {
        console.log('${name} deleted successfully');
        this.store.resetFlags();
        this.store.loadItems();
      }
    });
  }

  onPageChange(event: any): void {
    this.store.setPage(event.first / event.rows);
    // this.store.loadItems();
  }

  onSearch(search: string): void {
    // patchQueryParams resets to page 0 automatically
    this.store.patchQueryParams({ search });
    // this.store.loadItems();
  }

  onSort(sort: string): void {
    // Spring format: 'fieldName,asc' or 'fieldName,desc'
    this.store.patchQueryParams({ sort });
    // this.store.loadItems();
  }

  onSelect(entity: any): void {
    this.store.setSelected(entity);
  }

  onClearSelection(): void {
    this.store.clearSelected();
  }

  onDelete(id: number): void {
    this.store.setLoading(true);
    // this.${camelCase(config.entityName)}Service.delete(id)
    //   .subscribe(() => this.store.markDeleted());
  }
}
`;

  return {
    fileName: `${kebab}-list.component.ts`,
    path: `features/${kebab}/components/${kebab}-list.component.ts`,
    content,
    language: "typescript",
  };
}

// ─── Generate all files for an entity ────────────────────────────
export function generateEntityFiles(config: EntityConfig): GeneratedFile[] {
  const files: GeneratedFile[] = [
    generateEntityModel(config),
    generateEntityStore(config),
  ];

  if (config.includeComponent) {
    files.push(generateEntityComponent(config));
  }

  return files;
}

// ─── Generate full library ────────────────────────────────────────
export function generateLibraryFiles(): GeneratedFile[] {
  return [
    generateBaseTypes(),
    generateInitialStateFactory(),
    generateStoreFactory(),
    generateCrudFeature(),
    generatePublicApi(),
    generateLibraryIndex(),
  ];
}

// ─── Generate everything ──────────────────────────────────────────
export function generateAllFiles(entities: EntityConfig[]): GeneratedFile[] {
  const libraryFiles = generateLibraryFiles();
  const entityFiles = entities.flatMap(generateEntityFiles);
  return [...libraryFiles, ...entityFiles];
}
