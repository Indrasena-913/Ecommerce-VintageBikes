import { Skeleton } from "flowbite-react";

export default function SkeletonExample() {
	return (
		<div className="max-w-xl mx-auto mt-10 space-y-4">
			{/* Skeleton for Text */}
			<Skeleton className="h-6 w-3/4" />
			<Skeleton className="h-4 w-1/2" />

			{/* Skeleton for Image */}
			<Skeleton img className="h-48 w-full" />

			{/* Skeleton for Button */}
			<Skeleton className="h-10 w-32" />
		</div>
	);
}
