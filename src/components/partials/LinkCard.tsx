import type { FC } from "hono/jsx";
import type { Link } from "@/db/schema/links.schema";

interface LinkCardProps {
	link: Link;
}

export const LinkCard: FC<LinkCardProps> = ({ link }) => {
	const fullLink = link.linkPrefix + link.recordingLink;
	return (
		<div class="mt-2 mr-2">
			<a href={fullLink}>
				<img
					src={`/public/images/${link.icon}`}
					height="24"
					width="24"
					alt={link.streamer}
				/>
			</a>
		</div>
	);
};
