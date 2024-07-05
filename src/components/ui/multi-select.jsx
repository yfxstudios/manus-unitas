"use client";

import * as React from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";

export default function FancyMultiSelect({
	data,
	placeholder,
	value,
	defaultValue,
	users,
	setValue,
	parentId,
	roleId,
}) {
	const inputRef = React.useRef(null);
	const [open, setOpen] = React.useState(false);
	const [selected, setSelected] = React.useState(
		defaultValue
			? defaultValue.map(user => ({
					value: user,
					label:
						users.find(u => u._id === user).first_name +
						" " +
						users.find(u => u._id === user).last_name,
			  }))
			: []
	);

	// const [selected, setSelected] = React.useState([]);

	const [inputValue, setInputValue] = React.useState("");

	const handleUnselect = framework => {
		// useCallback
		setSelected(prev => prev.filter(s => s.value !== framework.value));
	};

	console.log("VAL", value);

	// [
	//     {
	//         "parent": "66848563b8e35040862eb3c5",
	//         "subRoles": [
	//             {
	//                 "child": "668711bd205125fcc7217c8c",
	//                 "volunteers": [
	//                     "66778b62759cf25fa81e677b"
	//                 ]
	//             }
	//         ]
	//     }
	// ]

	// [
	//     {
	//         "parent": "66848563b8e35040862eb3c5",
	//         "subRoles": [
	//             {
	//                 "child": "668711bd205125fcc7217c8c",
	//                 "volunteers": [
	//                     {
	//                         "_id": "66778e8b759cf25fa81e6848",
	//                         "first_name": "Matthew",
	//                         "last_name": "Yakligian",
	//                         "username": "mattyak1",
	//                         "email": "matt.yakligian@gmail.com",
	//                         "phone": "(209) 248-0426",
	//                         "password": "mattyak09!",
	//                         "organizationId": "66778bf1759cf25fa81e6780",
	//                         "admin": true,
	//                         "accepted": 0,
	//                         "completedSignup": true,
	//                         "completedTutorial": false,
	//                         "twoFactorAuth": {
	//                             "secret": null,
	//                             "verified": false
	//                         },
	//                         "timeActive": 72380,
	//                         "time": 1134,
	//                         "joined": "2024-06-23T02:55:07.018Z",
	//                         "lastActive": "2024-07-05T23:32:02.305Z",
	//                         "lastLogin": "2024-07-05T01:20:08.536Z",
	//                         "lastLogout": "2024-07-02T18:41:16.462Z",
	//                         "notifications": {
	//                             "newEvents": true,
	//                             "reminders": true
	//                         },
	//                         "__v": 0,
	//                         "customerId": "cus_QLN7EMIgQ2xqY0",
	//                         "organizationOwner": true
	//                     }
	//                 ]
	//             },
	//         ]
	//     },
	//     {
	//         "parent": "668711eea346df8b31e6080d",
	//         "subRoles": [
	//             {
	//                 "child": "6687120ed4c7603cffefb0b6",
	//                 "volunteers": [
	//                     {
	//                         "_id": "66778b62759cf25fa81e677b",
	//                         "first_name": "Matthew",
	//                         "last_name": "Yakligian",
	//                         "username": "mattyak",
	//                         "email": "matt.yakligian@icloud.com",
	//                         "phone": "(209) 985-8037",
	//                         "password": "mattyak09!",
	//                         "organizationId": "66778bf1759cf25fa81e6780",
	//                         "organizationOwner": false,
	//                         "admin": true,
	//                         "accepted": 1,
	//                         "completedSignup": true,
	//                         "completedTutorial": false,
	//                         "customerId": "cus_QLN7EMIgQ2xqY0",
	//                         "twoFactorAuth": {
	//                             "secret": "",
	//                             "verified": false
	//                         },
	//                         "timeActive": 590,
	//                         "time": 0,
	//                         "joined": "2024-06-23T02:41:38.729Z",
	//                         "lastActive": "2024-06-23T03:05:20.976Z",
	//                         "lastLogin": "2024-06-23T02:46:51.942Z",
	//                         "lastLogout": "2024-06-23T03:05:26.248Z",
	//                         "notifications": {
	//                             "newEvents": true,
	//                             "reminders": true
	//                         },
	//                         "__v": 0
	//                     },
	//                     {
	//                         "_id": "66778e8b759cf25fa81e6848",
	//                         "first_name": "Matthew",
	//                         "last_name": "Yakligian",
	//                         "username": "mattyak1",
	//                         "email": "matt.yakligian@gmail.com",
	//                         "phone": "(209) 248-0426",
	//                         "password": "mattyak09!",
	//                         "organizationId": "66778bf1759cf25fa81e6780",
	//                         "admin": true,
	//                         "accepted": 0,
	//                         "completedSignup": true,
	//                         "completedTutorial": false,
	//                         "twoFactorAuth": {
	//                             "secret": null,
	//                             "verified": false
	//                         },
	//                         "timeActive": 72380,
	//                         "time": 1134,
	//                         "joined": "2024-06-23T02:55:07.018Z",
	//                         "lastActive": "2024-07-05T23:32:02.305Z",
	//                         "lastLogin": "2024-07-05T01:20:08.536Z",
	//                         "lastLogout": "2024-07-02T18:41:16.462Z",
	//                         "notifications": {
	//                             "newEvents": true,
	//                             "reminders": true
	//                         },
	//                         "__v": 0,
	//                         "customerId": "cus_QLN7EMIgQ2xqY0",
	//                         "organizationOwner": true
	//                     }
	//                 ]
	//             },
	//             {
	//                 "child": "66871219a22436a324cf6599",
	//                 "volunteers": [
	//                     {
	//                         "_id": "66778b62759cf25fa81e677b",
	//                         "first_name": "Matthew",
	//                         "last_name": "Yakligian",
	//                         "username": "mattyak",
	//                         "email": "matt.yakligian@icloud.com",
	//                         "phone": "(209) 985-8037",
	//                         "password": "mattyak09!",
	//                         "organizationId": "66778bf1759cf25fa81e6780",
	//                         "organizationOwner": false,
	//                         "admin": true,
	//                         "accepted": 1,
	//                         "completedSignup": true,
	//                         "completedTutorial": false,
	//                         "customerId": "cus_QLN7EMIgQ2xqY0",
	//                         "twoFactorAuth": {
	//                             "secret": "",
	//                             "verified": false
	//                         },
	//                         "timeActive": 590,
	//                         "time": 0,
	//                         "joined": "2024-06-23T02:41:38.729Z",
	//                         "lastActive": "2024-06-23T03:05:20.976Z",
	//                         "lastLogin": "2024-06-23T02:46:51.942Z",
	//                         "lastLogout": "2024-06-23T03:05:26.248Z",
	//                         "notifications": {
	//                             "newEvents": true,
	//                             "reminders": true
	//                         },
	//                         "__v": 0
	//                     },
	//                     {
	//                         "_id": "66778e8b759cf25fa81e6848",
	//                         "first_name": "Matthew",
	//                         "last_name": "Yakligian",
	//                         "username": "mattyak1",
	//                         "email": "matt.yakligian@gmail.com",
	//                         "phone": "(209) 248-0426",
	//                         "password": "mattyak09!",
	//                         "organizationId": "66778bf1759cf25fa81e6780",
	//                         "admin": true,
	//                         "accepted": 0,
	//                         "completedSignup": true,
	//                         "completedTutorial": false,
	//                         "twoFactorAuth": {
	//                             "secret": null,
	//                             "verified": false
	//                         },
	//                         "timeActive": 72380,
	//                         "time": 1134,
	//                         "joined": "2024-06-23T02:55:07.018Z",
	//                         "lastActive": "2024-07-05T23:32:02.305Z",
	//                         "lastLogin": "2024-07-05T01:20:08.536Z",
	//                         "lastLogout": "2024-07-02T18:41:16.462Z",
	//                         "notifications": {
	//                             "newEvents": true,
	//                             "reminders": true
	//                         },
	//                         "__v": 0,
	//                         "customerId": "cus_QLN7EMIgQ2xqY0",
	//                         "organizationOwner": true
	//                     }
	//                 ]
	//             }
	//         ]
	//     }
	// ]

	const handleKeyDown = e => {
		const input = inputRef.current;
		if (input) {
			if (e.key === "Delete" || e.key === "Backspace") {
				if (input.value === "") {
					setSelected(prev => {
						const newSelected = [...prev];
						newSelected.pop();

						return newSelected;
					});

					const filtered = [];

					value.forEach(item => {
						const subRoles = item.subRoles.map(subRole => {
							if (subRole.child === roleId) {
								if (
									subRole.volunteers.includes(
										selected[selected.length - 1].value
									)
								) {
									subRole.volunteers = subRole.volunteers.filter(
										volunteer =>
											volunteer !== selected[selected.length - 1].value
									);
								}
							}
							return subRole;
						});

						filtered.push({
							parent: item.parent,
							subRoles,
						});
					});

					setValue(filtered);
				}
			}
			// This is not a default behaviour of the <input /> field
			if (e.key === "Escape") {
				input.blur();
			}
		}
	};

	const selectables = data.filter(
		framework =>
			!selected.some(s => s.value === framework.value) &&
			framework.label.toLowerCase().includes(inputValue.toLowerCase())
	);

	return (
		<Command
			onKeyDown={handleKeyDown}
			className="overflow-visible bg-transparent"
		>
			<div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
				<div className="flex flex-wrap gap-1">
					{selected.map(framework => {
						return (
							<Badge key={framework.value} variant="secondary">
								{framework.label}
								<button
									className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
									onKeyDown={e => {
										if (e.key === "Enter") {
											handleUnselect(framework);

											const filtered = [];

											value.forEach(item => {
												const subRoles = item.subRoles.map(subRole => {
													if (subRole.child === roleId) {
														if (subRole.volunteers.includes(framework.value)) {
															subRole.volunteers = subRole.volunteers.filter(
																volunteer => volunteer !== framework.value
															);
														}
													}
													return subRole;
												});

												filtered.push({
													parent: item.parent,
													subRoles,
												});
											});

											setValue(filtered);
										}
									}}
									onMouseDown={e => {
										e.preventDefault();
										e.stopPropagation();
									}}
									onClick={() => {
										handleUnselect(framework);

										const filtered = [];

										value.forEach(item => {
											const subRoles = item.subRoles.map(subRole => {
												if (subRole.child === roleId) {
													if (subRole.volunteers.includes(framework.value)) {
														subRole.volunteers = subRole.volunteers.filter(
															volunteer => volunteer !== framework.value
														);
													}
												}
												return subRole;
											});

											filtered.push({
												parent: item.parent,
												subRoles,
											});
										});

										setValue(filtered);
									}}
								>
									<X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
								</button>
							</Badge>
						);
					})}
					{/* Avoid having the "Search" Icon */}
					<CommandPrimitive.Input
						ref={inputRef}
						value={inputValue}
						onValueChange={setInputValue}
						onBlur={() => setOpen(false)}
						onFocus={() => setOpen(true)}
						placeholder={placeholder}
						className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
					/>
				</div>
			</div>
			<div className="relative mt-2">
				<CommandList>
					{open && selectables.length > 0 ? (
						<div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
							<CommandGroup className="h-full overflow-auto">
								{selectables.map(framework => {
									return (
										<CommandItem
											key={framework.value}
											onMouseDown={e => {
												e.preventDefault();
												e.stopPropagation();
											}}
											onSelect={value => {
												setInputValue("");
												setSelected(prev => [...prev, framework]);
												setValue(prev => {
													const newValue = [...prev];
													const index = newValue.findIndex(
														v => v.role === roleId
													);
													if (index === -1) {
														newValue.push({
															parent: parentId,
															subRoles: [
																{
																	child: roleId,
																	volunteers: [framework.value],
																},
															],
														});
													} else {
														newValue[index].volunteers.push(framework.value);
													}
													return newValue;
												});
											}}
											className={"cursor-pointer"}
										>
											{framework.label}
										</CommandItem>
									);
								})}
							</CommandGroup>
						</div>
					) : null}
				</CommandList>
			</div>
		</Command>
	);
}
