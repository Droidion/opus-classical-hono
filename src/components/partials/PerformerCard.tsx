import type { FC } from "hono/jsx";
import type { Performer } from "@/db/schema/performers.schema";

interface PerformerCardProps {
	performer: Performer;
}

export const PerformerCard: FC<PerformerCardProps> = ({ performer }) => {
	return (
		<div class="mb-1.5 leading-5">
			<span>
				{performer.firstName && performer.firstName} {performer.lastName}
			</span>{" "}
			<span class="font-light text-xs">{performer.instrument}</span>
		</div>
	);
};
