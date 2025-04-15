type NearestNeighborPair =
	| 'AA'
	| 'AT'
	| 'AG'
	| 'AC'
	| 'TA'
	| 'TT'
	| 'TG'
	| 'TC'
	| 'GA'
	| 'GT'
	| 'GG'
	| 'GC'
	| 'CA'
	| 'CT'
	| 'CG'
	| 'CC';

const thermodynamicParams: {
	enthalpy: Record<NearestNeighborPair, number>;
	entropy: Record<NearestNeighborPair, number>;
} = {
	enthalpy: {
		AA: -7.9,
		AT: -7.2,
		AG: -7.8,
		AC: -8.4,
		TA: -7.2,
		TT: -7.9,
		TG: -8.5,
		TC: -8.2,
		GA: -8.5,
		GT: -8.4,
		GG: -8.0,
		GC: -9.8,
		CA: -8.5,
		CT: -7.8,
		CG: -10.6,
		CC: -8.0
	},
	entropy: {
		AA: -22.2,
		AT: -20.4,
		AG: -21.0,
		AC: -22.4,
		TA: -21.3,
		TT: -22.2,
		TG: -22.7,
		TC: -22.2,
		GA: -22.7,
		GT: -22.4,
		GG: -19.9,
		GC: -24.4,
		CA: -22.7,
		CT: -21.0,
		CG: -27.2,
		CC: -19.9
	}
};

function calculatePnaRnaTm(sequence: string, concentration: number = 1e-6): number {
	const seq = sequence.toUpperCase().replace(/[^ATGCU]/g, '');
	if (seq.length === 0) return 0;

	const R = 1.9872;

	let totalEnthalpy = 0;
	let totalEntropy = 0;

	for (let i = 0; i < seq.length - 1; i++) {
		const pair = seq.substring(i, i + 2) as NearestNeighborPair;
		if (thermodynamicParams.enthalpy[pair]) {
			totalEnthalpy += thermodynamicParams.enthalpy[pair];
			totalEntropy += thermodynamicParams.entropy[pair];
		}
	}

	const tm = (totalEnthalpy * 1000) / (totalEntropy + R * Math.log(concentration)) - 273.15;

	return parseFloat(tm.toFixed(2));
}

export default calculatePnaRnaTm;
