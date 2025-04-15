'use client';

import ErrorMessage from '@/components/error';
import Step from '@/components/step';
import SuccessMessage from '@/components/success';
import { analyzePossiblePNASequences } from '@/utils/analyze-possible-pna-sequences';
import calculatePnaRnaTm from '@/utils/calculate-pna-rna-tm';
import { useEffect, useState } from 'react';

export default function Home() {
	const [targetMRNAFile, setTargetMRNAFile] = useState<File | null>(null);
	const [targetMRNAData, setTargetMRNAData] = useState<string>('');
	const [loadedFileData, setLoadedFileData] = useState<string>('');
	const [targetPosition, setTargetPosition] = useState<string>('');
	const [possibleSequences, setPossibleSequences] = useState<string[]>([]);

	const [validSequences, setValidSequences] = useState<string[]>([]);

	useEffect(() => {
		if (targetMRNAFile) {
			targetMRNAFile.text().then(setLoadedFileData);
		}
	}, [targetMRNAFile]);

	const mrnaData = (targetMRNAFile ? loadedFileData : targetMRNAData).toUpperCase();

	const steps = {
		1: {
			error: !mrnaData || mrnaData.length === 0 || (targetMRNAData && targetMRNAFile) || !/^[acgtACGT]+$/.test(mrnaData)
		},
		2: {
			error:
				!targetPosition ||
				parseInt(targetPosition) < 1 ||
				isNaN(parseInt(targetPosition)) ||
				parseInt(targetPosition) > mrnaData.length ||
				!mrnaData[parseInt(targetPosition) - 1]
		},
		3: {
			error:
				possibleSequences.length === 0 ||
				possibleSequences.filter((s, i) => possibleSequences.indexOf(s) !== i).length > 0
		}
	};

	const activeStep = steps[1].error ? 1 : steps[2].error ? 2 : steps[3].error ? 3 : 4;

	return (
		<div className='min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)] flex flex-col items-center justify-center'>
			<h1 className='text-4xl font-bold'>PNAtor</h1>
			<p className='text-lg mb-10'>PNator has some tools that are not so bad for analyzing PNA data stuff.</p>
			<hr className='w-full max-w-2xl border-t border-gray-300 mb-10' />
			<Step activeStep={activeStep} step={1}>
				<div className='flex justify-between'>
					<b>Step 1: Upload or enter your target mRNA data.</b>
					<input
						type='file'
						className='hidden'
						id='target-mRNA-file'
						onChange={(e) => setTargetMRNAFile(e.target.files?.[0] ?? null)}
					/>
					{targetMRNAFile ? (
						<button onClick={() => setTargetMRNAFile(null)} className='bg-red-500 text-white py-1 px-2'>
							Remove
						</button>
					) : (
						<label htmlFor='target-mRNA-file' className='bg-blue-500 text-white py-1 px-2'>
							Upload
						</label>
					)}
				</div>
				<textarea
					id='target-mRNA-data-input'
					className='w-full p-2 mt-3 h-48 border'
					spellCheck={false}
					value={targetMRNAData}
					placeholder='Enter your mRNA data here...'
					onChange={(e) => setTargetMRNAData(e.target.value)}
				/>
				{targetMRNAData && targetMRNAFile && (
					<ErrorMessage>You cannot upload and enter data at the same time. Please only do one.</ErrorMessage>
				)}
				{mrnaData &&
					mrnaData.length > 0 &&
					(!/^[acgtACGT]+$/.test(mrnaData) ? (
						<ErrorMessage>The entered mRNA data should only contain A, C, G, and T nucleotides.</ErrorMessage>
					) : (
						<SuccessMessage>Your target mRNA data is valid.</SuccessMessage>
					))}
			</Step>
			<Step activeStep={activeStep} step={2}>
				<div className='flex justify-between'>
					<b>Step 2: Enter the target position (1 - {mrnaData.length}).</b>
					<input
						type='number'
						className='py-1 px-2 border w-24'
						min={1}
						max={mrnaData.length}
						value={targetPosition}
						onChange={(e) => setTargetPosition(e.target.value)}
					/>
				</div>
				{targetPosition && mrnaData[parseInt(targetPosition) - 1] && (
					<SuccessMessage>
						The target position is valid. Letter: {mrnaData[parseInt(targetPosition) - 1]}.
					</SuccessMessage>
				)}
				{targetPosition &&
					(parseInt(targetPosition) < 1 ||
						isNaN(parseInt(targetPosition)) ||
						parseInt(targetPosition) > mrnaData.length ||
						!mrnaData[parseInt(targetPosition) - 1]) && <ErrorMessage>The target position is invalid.</ErrorMessage>}
			</Step>
			<Step activeStep={activeStep} step={3}>
				<div className='flex justify-between'>
					<b>Step 3: Analyze possible PNA sequences.</b>
					<button
						className='bg-blue-500 text-white py-1 px-2'
						onClick={() => {
							setPossibleSequences(analyzePossiblePNASequences(mrnaData, parseInt(targetPosition)));
						}}
					>
						Analyze
					</button>
				</div>
				{possibleSequences.length > 0 && (
					<div className='mt-4'>
						{possibleSequences.map((sequence, index) => (
							<table key={index} className='w-full border-collapse'>
								<thead>
									<tr className='border-b last:border-b-0 grid grid-cols-5 py-1'>
										<td className='col-span-2'>
											{sequence}{' '}
											{possibleSequences.filter((s) => s === sequence).length > 1 &&
												`(duplicate: ${possibleSequences.filter((s) => s === sequence).length})`}
										</td>
										<td>{sequence.length} bp</td>
										<td>{calculatePnaRnaTm(sequence)}°C</td>
										<td className='text-right'>
											<button
												className='bg-red-500 text-white px-1'
												onClick={() => {
													setPossibleSequences(
														possibleSequences.filter(
															(s, i) =>
																!(s === sequence && i === possibleSequences.findIndex((item) => item === sequence))
														)
													);
												}}
											>
												Remove
											</button>
										</td>
									</tr>
								</thead>
							</table>
						))}
					</div>
				)}
				{possibleSequences.length > 0 &&
					possibleSequences.filter((s, i) => possibleSequences.indexOf(s) !== i).length > 0 && (
						<ErrorMessage>
							There are duplicate PNA sequences.
							<button
								className='bg-red-500 text-white py-1 px-2 ml-2'
								onClick={() => {
									setPossibleSequences([...new Set(possibleSequences)]);
								}}
							>
								Remove Duplicates
							</button>
						</ErrorMessage>
					)}
				{!steps[3].error && <SuccessMessage>There are {possibleSequences.length} PNA sequences.</SuccessMessage>}
			</Step>
			<Step activeStep={activeStep} step={4}>
				<div className='flex justify-between'>
					<b>Step 4: Apply PNA sequence constraints.</b>
				</div>
				<div className='mt-4'>
					{possibleSequences.map((sequence, index) => (
						<table key={index} className='w-full border-collapse'>
							<thead>
								<tr className='border-b last:border-b-0 grid grid-cols-8 py-1'>
									<td className='col-span-2'>{sequence}</td>
									<td className='col-span-5'>
										{(() => {
											const purines = sequence.split('').filter((base) => base === 'A' || base === 'G').length;
											const purinePercentage = (purines / sequence.length) * 100;

											const purineStretch = sequence.match(/[AG]{7,}/);
											if (purineStretch) {
												return (
													<span className='text-red-500'>long purine stretch ({purineStretch[0].length} bases)</span>
												);
											}

											if (purinePercentage > 50) {
												return <span className='text-orange-500'>high purine content</span>;
											}

											const gContent = sequence.split('').filter((base) => base === 'G').length;
											const gPercentage = (gContent / sequence.length) * 100;

											if (gPercentage > 35) {
												return <span className='text-orange-500'>high G content ({gPercentage.toFixed(1)}%)</span>;
											}

											return null;
										})()}
									</td>
									<td className='text-right'>
										<button
											className='bg-red-500 text-white px-1'
											onClick={() => {
												setPossibleSequences(
													possibleSequences.filter(
														(s, i) =>
															!(s === sequence && i === possibleSequences.findIndex((item) => item === sequence))
													)
												);
											}}
										>
											Remove
										</button>
									</td>
								</tr>
							</thead>
						</table>
					))}
				</div>
			</Step>
		</div>
	);
}
