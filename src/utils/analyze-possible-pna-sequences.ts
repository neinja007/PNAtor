export function analyzePossiblePNASequences(mrnaData: string, targetPosition: number): string[] {
	const position = targetPosition - 1;
	const possibleSequences: string[] = [];

	for (const length of [10, 11, 12]) {
		const startPos = position - (length - 1);
		const endPos = position;

		for (let i = startPos; i <= endPos; i++) {
			const sequence = mrnaData.substring(i, i + length);

			if (sequence.length !== length) {
				continue;
			} else {
				possibleSequences.push(sequence);
			}
		}
	}

	return possibleSequences;
}
