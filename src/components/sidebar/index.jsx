"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip";
import { menuOptions } from "@/lib/contant";
import clsx from "clsx";
import Image from "next/image";
import { ModeToggle } from "../theme-toggle";
import { getCurrentUser } from "@/app/actions";

const MenuOptions = props => {
	const pathName = usePathname();
	const [isAdmin, setIsAdmin] = useState(false);
	useEffect(() => {
		getAdminStatus();
	}, []);

	const getAdminStatus = async () => {
		const user = await getCurrentUser();
		setIsAdmin(user.admin);
	};

	return (
		<nav className="dark:bg-black h-screen overflow-none justify-between flex items-center flex-col gap-10 py-6 px-4">
			<div className="flex items-center justify-center flex-col gap-8">
				<Link className="flex font-bold flex-row" href="/">
					<Image src="/logo.svg" width={40} height={40} />
				</Link>
				<TooltipProvider>
					{menuOptions.map(menuItem => (
						<>
							{menuItem.admin ? (
								<>
									{isAdmin && (
										<ul key={menuItem.name}>
											<Tooltip delayDuration={0}>
												<TooltipTrigger>
													<li>
														<Link
															href={menuItem.href}
															className={clsx(
																"group h-8 w-8 flex items-center justify-center  scale-[1.5] rounded-lg p-[3px]  cursor-pointer",
																{
																	"dark:bg-[#2F006B] bg-[#EEE0FF] ":
																		pathName === menuItem.href,
																}
															)}
														>
															<menuItem.Component
																selected={pathName === menuItem.href}
															/>
														</Link>
													</li>
												</TooltipTrigger>
												<TooltipContent
													side="right"
													className="bg-black/10 backdrop-blur-xl"
												>
													<p>{menuItem.name}</p>
												</TooltipContent>
											</Tooltip>
										</ul>
									)}
								</>
							) : (
								<ul key={menuItem.name}>
									<Tooltip delayDuration={0}>
										<TooltipTrigger>
											<li>
												<Link
													href={menuItem.href}
													className={clsx(
														"group h-8 w-8 flex items-center justify-center  scale-[1.5] rounded-lg p-[3px]  cursor-pointer",
														{
															"dark:bg-[#2F006B] bg-[#EEE0FF] ":
																pathName === menuItem.href,
														}
													)}
												>
													<menuItem.Component
														selected={pathName === menuItem.href}
													/>
												</Link>
											</li>
										</TooltipTrigger>
										<TooltipContent
											side="right"
											className="bg-black/10 backdrop-blur-xl"
										>
											<p>{menuItem.name}</p>
										</TooltipContent>
									</Tooltip>
								</ul>
							)}
						</>
					))}
				</TooltipProvider>
				<ModeToggle />
			</div>
		</nav>
	);
};

export default MenuOptions;
