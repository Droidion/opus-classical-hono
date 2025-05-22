import type { Period } from "@/db/schema/periods.schema";
import { formatYearsRangeString } from "@/utils/formatting";
import type { FC } from "hono/jsx";

interface PeriodHeaderProps {
	period: Period;
}

export const PeriodHeader: FC<PeriodHeaderProps> = ({ period }) => {
	const yearsRange = formatYearsRangeString(period.yearStart, period.yearEnd);
	return (
		<h2>
			<span>{period.name}</span>
			<span> </span>
			<span>{yearsRange}</span>
		</h2>
	);
};
