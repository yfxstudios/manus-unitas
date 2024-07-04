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
import { RolesContext } from "@/app/(main)/(pages)/dashboard/dashboard";

export default function FancyMultiSelect({
	data,
	placeholder,
	defaultIndex,
	value,
	setValue,
	parentId,
	roleId,
}) {
	const inputRef = React.useRef(null);
	const [open, setOpen] = React.useState(false);
	const [selected, setSelected] = React.useState(
		data[defaultIndex] ? [data[defaultIndex]] : []
	);
	const [inputValue, setInputValue] = React.useState("");

	const handleUnselect = React.useCallback(framework => {
		setSelected(prev => prev.filter(s => s.value !== framework.value));
	}, []);

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
							if (
								subRole.volunteers.includes(selected[selected.length - 1].value)
							) {
								subRole.volunteers = subRole.volunteers.filter(
									volunteer => volunteer !== selected[selected.length - 1].value
								);
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
													if (subRole.volunteers.includes(framework.value)) {
														subRole.volunteers = subRole.volunteers.filter(
															volunteer => volunteer !== framework.value
														);
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
												if (subRole.volunteers.includes(framework.value)) {
													subRole.volunteers = subRole.volunteers.filter(
														volunteer => volunteer !== framework.value
													);
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
