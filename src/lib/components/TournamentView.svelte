<script lang="ts">
	import type { Bracket, Match } from '$lib/models/bracket';

	export let bracket: Bracket;

	const matchesByRound = (matches: { [key: string]: Match }): { [round: number]: Match[] } => {
		const rounds: { [round: number]: Match[] } = {};
		Object.values(matches).forEach((match) => {
			if (!rounds[match.round]) rounds[match.round] = [];
			rounds[match.round].push(match);
		});

		// sort the matches by round
		Object.keys(rounds).forEach((round) => {
			rounds[Number(round)].sort((a, b) => a.match - b.match);
		});
		return rounds;
	};

	$: rounds = matchesByRound(bracket.matches);
</script>

<div class="flex flex-row items-start justify-center gap-4">
	{#each Object.keys(rounds) as round}
		<div class="my-4 flex flex-col justify-center">
			<h2 class="mr-4 text-xl font-bold">Round {round}</h2>
			<div class="grid grid-cols-1 gap-4">
				{#each rounds[Number(round)] as match (match.id)}
					<div class="rounded-lg border border-gray-200 p-4 shadow-md">
						<p>{match.id}</p>
						<div>
							{match.competitor1 ? match.competitor1.name : 'TBD'} vs {match.competitor2
								? match.competitor2.name
								: match.isBye
									? 'Bye'
									: 'TBD'}
						</div>
						{#if match.winner}
							<div class="text-green-500">Winner: {match.winner.name}</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/each}
</div>
