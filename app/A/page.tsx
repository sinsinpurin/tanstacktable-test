"use client";
// page.tsx
import * as React from "react";
import type { RowData, SortingState } from "@tanstack/react-table";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { faker } from "@faker-js/faker";

// カスタムメタデータの型を定義
interface CustomMeta {
	margedColumns?: boolean;
}

type Test = {
	id: number | string;
	pendingTransfer: number;
	amount: number;
	testNumber: number;
};

const defaultData: Test[] = Array.from({ length: 30 }, () => ({
	id: faker.number.int({ min: 0, max: 100 }),
	pendingTransfer: faker.number.int({ min: 0, max: 100 }),
	amount: faker.number.int({ min: 0, max: 100 }),
	testNumber: faker.number.int({ min: 0, max: 100 }),
}));

const columnHelper = createColumnHelper<Test>();

export const Home = () => {
	const [data] = React.useState<Test[]>(() => [...defaultData]);
	const [sorting, setSorting] = React.useState<SortingState>([]);

	const columns = [
		columnHelper.accessor("id", {
			id: "id",
			cell: (info) => info.getValue(),
			header: () => "ID",
		}),
		columnHelper.accessor("testNumber", {
			id: "testNumber",
			cell: (info) => info.getValue(),
			header: () => "testNumber",
		}),
		columnHelper.accessor("amount", {
			id: "amount",
			header: () => (
				<div>
					{/* biome-ignore lint: */}
					<p onClick={() => handleSort("amount")}>保有金額</p>
					{/* biome-ignore lint: */}
					<p onClick={() => handleSort("pendingTransfer")}>内移転中金額</p>
				</div>
			),
			cell: (info) => (
				<div>
					<p>{info.row.original.amount}</p>

					<p>{`(${info.row.original.pendingTransfer})`}</p>
				</div>
			),
			sortingFn: (rowA, rowB, columnId) => {
				const sortField =
					sorting[0]?.id === "pendingTransfer" ? "pendingTransfer" : "amount";
				return rowA.original[sortField] - rowB.original[sortField];
			},
			meta: {
				margedColumns: true,
			},
		}),
		// tanstackのstateに追加するため
		columnHelper.accessor("pendingTransfer", {
			id: "pendingTransfer",
			// 表示しない
			header: undefined,
			cell: undefined,
		}),
	];

	// fieldに対してソートを行う
	const handleSort = (field: string) => {
		setSorting((prev) => {
			if (prev[0]?.id === field) {
				return prev[0].desc ? [] : [{ id: field, desc: true }];
			}
			return [{ id: field, desc: false }];
		});
	};

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
		},
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

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
										style={{ cursor: "pointer" }}
										onClick={() => {
											const meta = header.column.columnDef.meta as
												| CustomMeta
												| undefined;
											if (!meta?.margedColumns) {
												handleSort(header.id as any);
											}
										}}
									>
										{flexRender(
											header.column.columnDef.header,
											header.getContext(),
										)}
										{header.column.getCanSort() && (
											<span>
												{{
													asc: " 🔼",
													desc: " 🔽",
												}[header.column.getIsSorted() as string] ?? null}
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
							<td key={cell.id} className="px-6 py-4 whitespace-nowrap">
								{flexRender(cell.column.columnDef.cell, cell.getContext())}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default Home;
