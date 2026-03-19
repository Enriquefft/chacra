"use client";

import type { ProductPriceData } from "@/lib/types";
import { Cart, TagPrice } from "@/components/auth/solar-icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PreciosTab } from "./precios-tab";
import { ProfileCompletion } from "./profile-completion";
import { TransactionForm } from "./transaction-form";

interface ProfileFields {
	farmerPhone: string | null;
	farmerCrops: string | null;
	farmerDistrict: string | null;
	farmerExperience: number | null;
	farmerLandOwnership: string | null;
}

export function FarmerHome({
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
		!!profileFields.farmerPhone &&
		!!profileFields.farmerCrops &&
		!!profileFields.farmerDistrict &&
		profileFields.farmerExperience !== null &&
		profileFields.farmerExperience !== undefined &&
		!!profileFields.farmerLandOwnership;

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
