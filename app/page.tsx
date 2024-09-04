"use client";

import * as React from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { faker } from "@faker-js/faker";
import { CustomTable } from "./components/customTable";

declare module "@tanstack/table-core" {
	// @ts-expect-error
	interface ColumnMeta<TData extends RowData, TValue> {
		rowSpan?: string;
	}
}

type Test = {
	id: number | string;
	pendingTransfer: number;
	amount: number;
	testNumber: number;
};

// NOTE: ダミーデータ作成
const defaultData: Test[] = Array.from({ length: 30 }, () => ({
	id: faker.number.int({ min: 0, max: 100 }),
	pendingTransfer: faker.number.int({ min: 0, max: 100 }),
	amount: faker.number.int({ min: 0, max: 100 }),
	testNumber: faker.number.int({ min: 0, max: 100 }),
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
	columnHelper.accessor("testNumber", {
		id: "testNumber",
		cell: (info) => info.getValue(),
		header: () => "testNumber",
	}),
];

export const Home = () => {
	const [data, _setData] = React.useState<Test[]>(() => [...defaultData]);

	return (
		<div className="p-2">
			<CustomTable data={data} columns={columns} />
		</div>
	);
};

export default Home;
