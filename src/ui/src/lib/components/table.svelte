<script lang="ts" module>
    import type { Snippet } from 'svelte';
    import { twMerge } from 'tailwind-merge';

    type Prev = [never, 0, 1, 2, 3, 4, 5];
    type Subtract<N extends number> = Prev[N];
    export type NestedKeyOf<T, Depth extends number = 5> = Depth extends 0
        ? never
        : T extends object
          ? {
                [K in Extract<keyof T, string | number>]: T[K] extends object
                    ? K | `${K}.${NestedKeyOf<T[K], Subtract<Depth>>}`
                    : K;
            }[Extract<keyof T, string | number>]
          : never;

    export function getNestedValue<T>(obj: T, path: string): unknown {
        if (!path.trim()) return obj;

        return path.split('.').reduce<unknown>((acc, key) => {
            if (typeof acc === 'object' && acc !== null && key in acc) {
                return (acc as Record<string, unknown>)[key];
            }
            return undefined;
        }, obj);
    }

    type Position = 'start' | 'end';

    type BaseColumn<T> = {
        name: string;
        position?: Position;
        class?: string;
        prefix?: Snippet<[T]>;
        suffix?: Snippet<[T]>;
        headPrefix?: Snippet;
        icon?: Snippet<[T]>;
        hidden?: boolean;
    };

    export type TableColumn<T> =
        | (BaseColumn<T> & {
              key: NestedKeyOf<T>;
              render?: undefined;
              value?: undefined;
          })
        | (BaseColumn<T> & {
              render: Snippet<[T]>;
              key?: undefined;
              value?: undefined;
          })
        | (BaseColumn<T> & {
              key?: undefined;
              render?: undefined;
              value: (row: T) => string | number;
          });
</script>

<script lang="ts" generics="T">
    interface Props {
        columns: TableColumn<T>[];
        data: T[];
    }
    const { columns: columnsProp, data }: Props = $props();
    const columns = $derived(columnsProp.filter((column) => !column.hidden));
</script>

<div class="relative overflow-x-auto">
    <table class="w-full text-start">
        <thead>
            <tr>
                {#each columns as column, i (i)}
                    <th
                        scope="col"
                        class="min-w-32 bg-neutral-900 p-5 text-sm text-neutral-200 first:rounded-s-lg last:rounded-e-lg"
                        class:text-end={column.position === 'end'}
                    >
                        <div
                            class="flex items-center gap-2"
                            class:justify-end={column.position === 'end'}
                            class:justify-start={column.position !== 'end'}
                        >
                            {#if column.headPrefix}
                                {@render column.headPrefix()}
                            {/if}
                            {column.name}
                        </div>
                    </th>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each data as row, i (i)}
                <tr
                    class="max-h-none overflow-hidden rounded-lg text-sm font-medium text-neutral-400 even:[&_td]:bg-neutral-950"
                >
                    {#each columns as column, i (i)}
                        <td
                            class="p-5 first:rounded-s-lg last:rounded-e-lg"
                            class:text-end={column.position === 'end'}
                            class:text-start={column.position !== 'end'}
                        >
                            <div
                                class={twMerge([
                                    'flex items-center gap-1',
                                    i < columns.length - 1 && column.position !== 'end' && 'pe-8',
                                    column.class
                                ])}
                                class:justify-end={column.position === 'end'}
                                class:justify-start={column.position !== 'end'}
                            >
                                {#if column.icon}
                                    {@render column.icon(row)}
                                {/if}
                                {#if column.prefix}
                                    {@render column.prefix(row)}
                                {/if}
                                {#if column.render}
                                    {@render column.render(row)}
                                {:else if column.key}
                                    {getNestedValue(row, column.key.toString()) ?? '-'}
                                {:else if column.value}
                                    {column.value(row)}
                                {:else}
                                    -
                                {/if}
                                {#if column.suffix}
                                    {@render column.suffix(row)}
                                {/if}
                            </div>
                        </td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</div>
