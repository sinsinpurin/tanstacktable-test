"use client";

import * as React from "react";
import {
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
	createColumnHelper,
} from "@tanstack/react-table";
import "./index.css";
import { faker } from "@faker-js/faker";

declare module "@tanstack/table-core" {
	// @ts-expect-error
	interface ColumnMeta<TData extends RowData, TValue> {
		rowSpan?: string;
	}
}

type Test = {
	id: number;
	pendingTransfer: number;
	amount: number;
};

const defaultData: Test[] = Array.from({ length: 30 }, () => ({
	id: faker.number.int({ min: 0, max: 100 }),
	pendingTransfer: faker.number.int({ min: 0, max: 100 }),
	amount: faker.number.int({ min: 0, max: 100 }),
}));

const columnHelper = createColumnHelper<Test>();

const columns = [
	columnHelper.accessor("id", {
		id: "id",
		cell: (info) => info.getValue(),
		header: () => "ID",
	}),
	columnHelper.group({
		id: "数量",
		header: () => <span>数量</span>,
		columns: [
			columnHelper.accessor((row) => row.amount, {
				id: "amount",
				cell: (info) => info.getValue(),
				header: () => <span>保有数量</span>,
			}),
			columnHelper.accessor("pendingTransfer", {
				id: "pendingTransfer",
				header: () => <span>内移転中数量</span>,
				cell: (info) => info.getValue(),
			}),
		],
	}),
];

export const Home = () => {
	const [data, _setData] = React.useState(() => [...defaultData]);
	const rerender = React.useReducer(() => ({}), {})[1];

	const table = useReactTable({
		columns,
		data,
		debugTable: true,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	table.getHeaderGroups().map((header) => {
		console.log(header);
	});

	return (
		<div className="p-2">
			<div className="h-2" />
			<table>
				<thead>
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								const rowSpan = header.column.columnDef.meta?.rowSpan;

								if (
									!header.isPlaceholder &&
									rowSpan !== undefined &&
									header.id === header.column.id
								) {
									return null;
								}

								return (
									<th key={header.id} colSpan={header.colSpan}>
										{header.isPlaceholder ? null : (
											// biome-ignore lint:
											<div
												className={
													header.column.getCanSort()
														? "cursor-pointer select-none"
														: ""
												}
												onClick={header.column.getToggleSortingHandler()}
												title={
													header.column.getCanSort()
														? header.column.getNextSortingOrder() === "asc"
															? "Sort ascending"
															: header.column.getNextSortingOrder() === "desc"
																? "Sort descending"
																: "Clear sort"
														: undefined
												}
											>
												{flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
												{{
													asc: " 🔼",
													desc: " 🔽",
												}[header.column.getIsSorted() as string] ?? null}
											</div>
										)}
									</th>
								);
							})}
						</tr>
					))}
				</thead>
				<tbody>
					{table
						.getRowModel()
						.rows.slice(0, 10)
						.map((row) => {
							return (
								<tr key={row.id}>
									{row.getVisibleCells().map((cell) => {
										return (
											<td key={cell.id}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</td>
										);
									})}
								</tr>
							);
						})}
				</tbody>
			</table>
			<div>{table.getRowModel().rows.length.toLocaleString()} Rows</div>
		</div>
	);
};

export default Home;
