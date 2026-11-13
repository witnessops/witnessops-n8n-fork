<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '@/app/stores/ui.store';
import horizontalBlack from '@/app/assets/brand/witnessops-horizontal-black.svg?url';
import horizontalWhite from '@/app/assets/brand/witnessops-horizontal-white.svg?url';
import markBlack from '@/app/assets/brand/witnessops-mark-black.svg?url';
import markWhite from '@/app/assets/brand/witnessops-mark-white.svg?url';

const props = defineProps<{ size: 'large' | 'small' }>();
const uiStore = useUIStore();

const logoUrl = computed(() => {
	const dark = uiStore.appliedTheme === 'dark';
	if (props.size === 'large') return dark ? horizontalWhite : horizontalBlack;
	return dark ? markWhite : markBlack;
});
</script>

<template>
	<div
		:class="[$style.logoContainer, { [$style.large]: size === 'large' }]"
		data-test-id="witnessops-logo"
	>
		<img
			:src="logoUrl"
			alt="WitnessOps"
			:class="size === 'large' ? $style.wordmark : $style.mark"
		/>
		<slot />
	</div>
</template>

<style lang="scss" module>
.logoContainer {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: var(--spacing--3xs);
}

.large {
	margin-bottom: var(--spacing--xl);
}

.wordmark,
.mark {
	display: block;
	flex: none;
}

.wordmark {
	/* The logo system requires at least 180px. The token scale has no matching width. */
	width: 200px;
	height: auto;
}

.mark {
	width: var(--height--xs);
	height: var(--height--xs);
}
</style>
