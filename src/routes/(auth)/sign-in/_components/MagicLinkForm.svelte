<script lang="ts">
	import { auth, magicLinkActionCodeSettings } from '$lib/client/firebase';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import {  type MagicLinkSchema } from '$lib/schemas/magic-link';
	import { sendSignInLinkToEmail } from 'firebase/auth';
	import { toast } from 'svelte-sonner';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';

	export let dataForm: SuperValidated<MagicLinkSchema>;

	const { form, enhance } = superForm(dataForm, {
		onSubmit: async (values) => {
			await signInWithEmail(values.formData.get('email') as string);
		}
	});

	const signInWithEmail = async (email: string) => {
		const loader = toast.loading('Sending link...');
		try {
			await sendSignInLinkToEmail(auth, email, magicLinkActionCodeSettings);
			toast.success('Sign in link sent! Check your inbox.');
		} catch (error) {
			toast.error('Failed to sign in. Please try again later');
			console.error(error);
		} finally {
			toast.dismiss(loader);
		}
	};
</script>

<form method="POST" class="flex flex-col items-stretch justify-start gap-4" use:enhance>
	<Label for="email"></Label>
	<Input name="email" id="email" bind:value={$form.email} placeholder="Email" />
	<Button type="submit">Send Magic Link</Button>
</form>
