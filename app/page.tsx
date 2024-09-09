"use client";
// page.tsx
import * as React from "react";
import type { ColumnDef, Row, SortingState } from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import { faker } from "@faker-js/faker";
import { CustomTable } from "./components/customTable2";

export type SortState =
	| "amountAsc"
	| "amountDesc"
	| "pendingAsc"
	| "pendingDesc"
	| false;

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
	const [amountSortState, setAmountSortState] =
		React.useState<SortState>(false);

	const customSort = (rowA: Row<Test>, rowB: Row<Test>): number => {
		const aAmount = rowA.original.amount;
		const bAmount = rowB.original.amount;
		const aPending = rowA.original.pendingTransfer;
		const bPending = rowB.original.pendingTransfer;

		switch (amountSortState) {
			case "amountAsc":
				return aAmount - bAmount;
			case "amountDesc":
				return bAmount - aAmount;
			case "pendingAsc":
				return aPending - bPending;
			case "pendingDesc":
				return bPending - aPending;
			default:
				return 0;
		}
	};

	const handleSortingChange = React.useCallback(
		(updater: SortingState | ((prev: SortingState) => SortingState)) => {
			setSorting((prev) => {
				const next = typeof updater === "function" ? updater(prev) : updater;
				if (next.length > 0 && next[0].id === "amount") {
					setAmountSortState((prevState) => {
						switch (prevState) {
							case false:
								return "amountAsc";
							case "amountAsc":
								return "amountDesc";
							case "amountDesc":
								return "pendingAsc";
							case "pendingAsc":
								return "pendingDesc";
							case "pendingDesc":
								return false;
							default:
								return false;
						}
					});
				} else {
					setAmountSortState(false);
				}
				return next;
			});
		},
		[],
	);

	const columns = [
		columnHelper.accessor("id", {
			id: "id",
			cell: (info) => info.getValue(),
			header: () => "ID",
		}),
		columnHelper.accessor("amount", {
			id: "amount",
			header: () => (
				<div>
					<p>保有金額</p>
					<p>内移転中金額</p>
				</div>
			),
			cell: (info) => (
				<div>
					<p>{info.row.original.amount}</p>
					<p>{`(${info.row.original.pendingTransfer})`}</p>
				</div>
			),
			sortingFn: (rowA, rowB) => customSort(rowA, rowB),
		}),
		columnHelper.accessor("testNumber", {
			id: "testNumber",
			cell: (info) => info.getValue(),
			header: () => "testNumber",
		}),
	];

	return (
		<div className="p-2">
			<CustomTable
				data={data}
				columns={columns}
				sorting={sorting}
				onSortingChange={handleSortingChange}
				amountSortState={amountSortState}
			/>
		</div>
	);
};

export default Home;
