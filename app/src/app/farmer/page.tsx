import { getProductListForFarmer } from "@/actions/cooperatives";
import { getFarmerPriceData } from "@/actions/farmers";
import { getSession } from "@/lib/auth";
import { FarmerHome } from "./_components/farmer-home";

export default async function FarmerPage() {
	const [session, productResult, priceResult] = await Promise.all([
		getSession(),
		getProductListForFarmer(),
		getFarmerPriceData(),
	]);

	const productList =
		"success" in productResult ? productResult.data.products : [];

	const priceData = "success" in priceResult ? priceResult.data.products : [];

	// Extract profile fields from session
	const user = session?.user;
	const profileFields = {
		farmerPhone: (user?.farmerPhone as string | null) ?? null,
		farmerCrops: (user?.farmerCrops as string | null) ?? null,
		farmerDistrict: (user?.farmerDistrict as string | null) ?? null,
		farmerExperience: (user?.farmerExperience as number | null) ?? null,
		farmerLandOwnership: (user?.farmerLandOwnership as string | null) ?? null,
	};

	return (
		<FarmerHome
			productList={productList}
			profileFields={profileFields}
			priceData={priceData}
		/>
	);
}
