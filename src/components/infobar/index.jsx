import React from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip";
import { Book, Headphones, Menu, Search, X } from "lucide-react";
import { Input } from "../ui/input";

import Subscription from "@/lib/schemas/subscriptionSchema";
import Users from "@/lib/schemas/userSchema";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "../ui/drawer";
import { Button } from "../ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const InfoBar = async () => {
	const session = await getServerSession();
	const user = await Users.findOne({ email: session.user.email }).lean();

	const subscription = await Subscription.findOne({
		organizationId: user.organizationId,
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
		<div className="">
			<div className="hidden sm:flex flex-row justify-end gap-6 items-center px-4 py-4 w-full dark:bg-black ">
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
			<div className="sm:hidden flex flex-row justify-end gap-6 items-center p-4 w-full dark:bg-black ">
				<Drawer>
					<DrawerTrigger>
						<Menu />
					</DrawerTrigger>
					<DrawerContent>
						<DrawerHeader className="px-8">
							<DrawerTitle>Plan</DrawerTitle>
							<DrawerDescription>{subscriptionName}</DrawerDescription>
						</DrawerHeader>
						<div className="flex flex-col items-center gap-3 px-8 text-center">
							<Avatar className="w-48 h-48 ">
								<AvatarImage src={user.image} />
								<AvatarFallback className="text-2xl font-bold">
									{user.first_name[0]}
									{user.last_name[0]}
								</AvatarFallback>
							</Avatar>
							<div className="flex flex-col items-center gap-1">
								<span className="text-2xl font-bold">
									{user.first_name} {user.last_name}
								</span>
								<span className="text-sm font-light">{user.email}</span>
							</div>
							<Link href="/settings/profile" asChild>
								<Button className="w-full" variant="link" size="sm">
									Profile
								</Button>
							</Link>
						</div>
						<DrawerFooter className="flex flex-row items-center gap-2 px-8">
							<span className="flex items-center rounded-full bg-muted px-4 w-full flex-1">
								<Search />
								<Input
									placeholder="Quick Search"
									className="border-none bg-transparent"
								/>
							</span>
							<Headphones />

							<Book />
						</DrawerFooter>
					</DrawerContent>
				</Drawer>
			</div>
		</div>
	);
};

export default InfoBar;
