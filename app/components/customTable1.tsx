"use client";
import type React from "react";
import type { Table, Header, ColumnDef } from "@tanstack/react-table";

import {
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
	flexRender,
} from "@tanstack/react-table";

interface CustomTableProps<T> {
	data: T[];
	// biome-ignore lint:
	columns: ColumnDef<T, any>[];
}

// NOTE: 参考　https://github.com/TanStack/table/discussions/5201
export const getMergeHeaderGroups = <TData extends object>(
	table: Table<TData>,
) => {
	const headerGroups = table.getHeaderGroups();
	const headerIds = new Set();
	const resultHeaderGroups: Header<TData, unknown>[][] = [];

	if (headerGroups.length === 1) return [table.getHeaderGroups()[0].headers];

	for (let i = 0; i < headerGroups.length; i++) {
		const headerGroup =
			i === 0 ? headerGroups[i].headers : resultHeaderGroups[i];

		// isPlaceholder が true の場合は、そのセルは結合される
		const preHeaders: (Header<TData, unknown> & { rowSpan: number })[] =
			headerGroup.map((header) =>
				header.isPlaceholder
					? {
							...header,
							isPlaceholder: false,
							// 何行結合するか
							rowSpan: headerGroups.length - i,
						}
					: { ...header, rowSpan: 1 },
			);
		resultHeaderGroups.pop();
		resultHeaderGroups.push(preHeaders);

		for (const preHeader of preHeaders) {
			headerIds.add(preHeader.column.id);
		}

		const targetHeaders = headerGroups[i + 1].headers;
		const newHeaders = targetHeaders.filter(
			(header) => !headerIds.has(header.column.id),
		);
		resultHeaderGroups.push(newHeaders);

		if (i === headerGroups.length - 2) {
			break;
		}
	}
	return resultHeaderGroups;
};

export const CustomTable = <T extends object>({
	data,
	columns,
}: CustomTableProps<T>) => {
	const table = useReactTable({
		columns,
		data,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	const mergedHeaderGroups = getMergeHeaderGroups<T>(table);

	const getSortIcon = (isSorted: false | "asc" | "desc") => {
		if (!isSorted) return "↕️";
		return isSorted === "asc" ? "↑" : "↓";
	};

	return (
		<>
			<table className="w-full border-collapse">
				<thead>
					{mergedHeaderGroups.map((headerGroup, groupIndex) => (
						// biome-ignore lint:
						<tr key={groupIndex}>
							{headerGroup.map((header) => (
								<th
									key={header.id}
									colSpan={header.colSpan}
									rowSpan={header.rowSpan}
									className="border px-4 py-2"
								>
									{header.isPlaceholder ? null : (
										// biome-ignore lint:
										<div
											className="cursor-pointer select-none"
											onClick={header.column.getToggleSortingHandler()}
										>
											{flexRender(
												header.column.columnDef.header,
												header.getContext(),
											)}
											{header.column.getCanSort() && (
												<span className="ml-2">
													{getSortIcon(header.column.getIsSorted())}
												</span>
											)}
										</div>
									)}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody>
					{table.getRowModel().rows.map((row) => (
						<tr key={row.id}>
							{row.getVisibleCells().map((cell) => (
								<td key={cell.id} className="border px-4 py-2">
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
			<div>{table.getRowModel().rows.length.toLocaleString()} Rows</div>
		</>
	);
};
