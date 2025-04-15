export interface SequenceConstraint {
	type: 'purineStretch' | 'highPurineContent' | 'highGContent';
	message: string;
	severity: 'warning' | 'error';
}

export function checkSequenceConstraints(sequence: string): SequenceConstraint | null {
	const purines = sequence.split('').filter((base) => base === 'A' || base === 'G').length;
	const purinePercentage = (purines / sequence.length) * 100;

	const purineStretch = sequence.match(/[AG]{7,}/);
	if (purineStretch) {
		return {
			type: 'purineStretch',
			message: `long purine stretch (${purineStretch[0].length} bases)`,
			severity: 'error'
		};
	}

	if (purinePercentage > 50) {
		return {
			type: 'highPurineContent',
			message: 'high purine content',
			severity: 'warning'
		};
	}

	const gContent = sequence.split('').filter((base) => base === 'G').length;
	const gPercentage = (gContent / sequence.length) * 100;

	if (gPercentage > 35) {
		return {
			type: 'highGContent',
			message: `high G content (${gPercentage.toFixed(1)}%)`,
			severity: 'warning'
		};
	}

	return null;
}
