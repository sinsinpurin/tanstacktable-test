// customTable2.tsx
"use client";
import React from "react";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import {
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
	flexRender,
} from "@tanstack/react-table";
import type { SortState } from "../page";

interface CustomTableProps<T> {
	data: T[];
	columns: ColumnDef<T, any>[];
	sorting: SortingState;
	onSortingChange: (
		updater: SortingState | ((prev: SortingState) => SortingState),
	) => void;
	amountSortState: SortState;
}

export const CustomTable = <T extends object>({
	data,
	columns,
	sorting,
	onSortingChange,
	amountSortState,
}: CustomTableProps<T>) => {
	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
		},
		onSortingChange,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		enableSortingRemoval: false,
	});

	const getAmountSortIcon = (sortState: SortState) => {
		switch (sortState) {
			case "amountAsc":
				return " 🔼A";
			case "amountDesc":
				return " 🔽A";
			case "pendingAsc":
				return " 🔼P";
			case "pendingDesc":
				return " 🔽P";
			default:
				return "";
		}
	};

	return (
		<table>
			<thead>
				{table.getHeaderGroups().map((headerGroup) => (
					<tr key={headerGroup.id}>
						{headerGroup.headers.map((header) => (
							<th key={header.id}>
								{header.isPlaceholder ? null : (
									// biome-ignore lint:
									<div
										className={
											header.column.getCanSort()
												? "cursor-pointer select-none"
												: ""
										}
										onClick={header.column.getToggleSortingHandler()}
									>
										{flexRender(
											header.column.columnDef.header,
											header.getContext(),
										)}
										{header.column.id === "amount"
											? getAmountSortIcon(amountSortState)
											: header.column.getIsSorted() && (
													<span>
														{header.column.getIsSorted() === "desc"
															? " 🔽"
															: " 🔼"}
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
							<td key={cell.id}>
								{flexRender(cell.column.columnDef.cell, cell.getContext())}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
};
