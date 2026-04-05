"use client";

import type { ProductPriceData } from "@/lib/types";
import { Cart, TagPrice } from "@/components/auth/solar-icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PreciosTab } from "./precios-tab";
import { ProfileCompletion } from "./profile-completion";
import { TransactionForm } from "./transaction-form";

interface ProfileFields {
	producerPhone: string | null;
	producerCrops: string | null;
	producerDistrict: string | null;
	producerExperience: number | null;
	producerLandOwnership: string | null;
}

export function ProducerHome({
	productList,
	profileFields,
	priceData,
}: {
	productList: string[];
	profileFields: ProfileFields;
	priceData: ProductPriceData[];
}) {
	// Check if profile is complete
	const isProfileComplete =
		!!profileFields.producerPhone &&
		!!profileFields.producerCrops &&
		!!profileFields.producerDistrict &&
		profileFields.producerExperience !== null &&
		profileFields.producerExperience !== undefined &&
		!!profileFields.producerLandOwnership;

	return (
		<div className="flex flex-col gap-4">
			{/* Profile completion card above tabs when incomplete */}
			{!isProfileComplete && (
				<ProfileCompletion initialFields={profileFields} />
			)}

			{/* Two-tab layout */}
			<Tabs defaultValue="registrar">
				<TabsList className="grid h-11 w-full grid-cols-2 text-base">
					<TabsTrigger value="registrar" className="h-10 gap-1.5 text-base">
						<Cart weight="BoldDuotone" size={18} />
						Registrar
					</TabsTrigger>
					<TabsTrigger value="precios" className="h-10 gap-1.5 text-base">
						<TagPrice weight="BoldDuotone" size={18} />
						Precios
					</TabsTrigger>
				</TabsList>

				<TabsContent value="registrar" className="mt-4">
					<TransactionForm productList={productList} />
				</TabsContent>

				<TabsContent value="precios" className="mt-4">
					<PreciosTab products={priceData} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
