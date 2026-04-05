import { getProductListForProducer } from "@/actions/cooperatives";
import { getProducerPriceData } from "@/actions/producers";
import { getSession } from "@/lib/auth";
import { ProducerHome } from "./_components/producer-home";

export default async function ProducerPage() {
	const [session, productResult, priceResult] = await Promise.all([
		getSession(),
		getProductListForProducer(),
		getProducerPriceData(),
	]);

	const productList =
		"success" in productResult ? productResult.data.products : [];

	const priceData = "success" in priceResult ? priceResult.data.products : [];

	// Extract profile fields from session
	const user = session?.user;
	const profileFields = {
		producerPhone: (user?.producerPhone as string | null) ?? null,
		producerCrops: (user?.producerCrops as string | null) ?? null,
		producerDistrict: (user?.producerDistrict as string | null) ?? null,
		producerExperience: (user?.producerExperience as number | null) ?? null,
		producerLandOwnership: (user?.producerLandOwnership as string | null) ?? null,
	};

	return (
		<ProducerHome
			productList={productList}
			profileFields={profileFields}
			priceData={priceData}
		/>
	);
}
