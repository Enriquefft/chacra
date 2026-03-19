import { getProductListForFarmer } from "@/actions/cooperatives";
import { TransactionForm } from "./_components/transaction-form";

export default async function FarmerPage() {
	const productResult = await getProductListForFarmer();
	const productList =
		"success" in productResult ? productResult.data.products : [];

	return <TransactionForm productList={productList} />;
}
