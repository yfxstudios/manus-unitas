import React from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip";
import { Book, Headphones, Search } from "lucide-react";
import { Input } from "../ui/input";

import Subscription from "@/lib/schemas/subscriptionSchema";
import Users from "@/lib/schemas/userSchema";
import Stripe from "stripe";
import { getServerSession } from "next-auth";

const InfoBar = async () => {
	const session = await getServerSession();
	const user = await Users.findOne({ email: session.user.email }).lean();

	const subscription = await Subscription.findOne({
		customerId: user.customerId,
	});

	const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
		apiVersion: "2024-04-10",
	});

	let subscriptionName;
	if (user.admin) {
		// lookup priceId with stripe
		subscriptionName = stripe.products
			.retrieve(subscription.productId)
			.then(product => product.name);
	}

	return (
		<div className="flex flex-row justify-end gap-6 items-center px-4 py-4 w-full dark:bg-black ">
			<span className="flex items-center gap-2 font-bold">
				<p className="text-sm font-light">{subscriptionName}</p>
			</span>
			<span className="flex items-center rounded-full bg-muted px-4">
				<Search />
				<Input
					placeholder="Quick Search"
					className="border-none bg-transparent"
				/>
			</span>
			<TooltipProvider>
				<Tooltip delayDuration={0}>
					<TooltipTrigger>
						<Headphones />
					</TooltipTrigger>
					<TooltipContent>
						<p>Contact Support</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<TooltipProvider>
				<Tooltip delayDuration={0}>
					<TooltipTrigger>
						<Book />
					</TooltipTrigger>
					<TooltipContent>
						<p>Guide</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			{/* <UserButton /> */}
		</div>
	);
};

export default InfoBar;
