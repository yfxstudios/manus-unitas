import * as React from "react";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function ScrollAreaHorizontal({ children }, props) {
	return (
		<ScrollArea {...props}>
			<div className="flex w-max space-x-4 p-4">{children}</div>
			<ScrollBar orientation="horizontal" />
		</ScrollArea>
	);
}
