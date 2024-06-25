import { Menu } from "lucide-react";

import Subscription from "@/lib/schemas/subscriptionSchema";
import Users from "@/lib/schemas/userSchema";
import { getServerSession } from "next-auth";
import Link from "next/link";
import Stripe from "stripe";
import SignOutButton from "../sign-out-button";
import SignOutWrapper from "../signOutWrapper";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "../ui/drawer";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

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
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Avatar className="cursor-pointer">
							<AvatarImage src={user.image} />
							<AvatarFallback>
								{user.first_name[0]}
								{user.last_name[0]}
							</AvatarFallback>
						</Avatar>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuLabel>My Account</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Link href="/settings">Settings</Link>
						</DropdownMenuItem>
						{/* logout */}
						<DropdownMenuItem>
							<SignOutWrapper>Logout</SignOutWrapper>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

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
						<div className="flex flex-col items-center gap-3 px-8 py-4 text-center">
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
							<Link href="/settings" className="w-full" asChild>
								<Button variant="outline" className="w-full">
									Settings
								</Button>
							</Link>
							<SignOutButton className="w-full">Logout</SignOutButton>
						</div>
					</DrawerContent>
				</Drawer>
			</div>
		</div>
	);
};

export default InfoBar;
