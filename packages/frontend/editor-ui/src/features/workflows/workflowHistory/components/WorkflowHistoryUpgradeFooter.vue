<script setup lang="ts">
import { I18nT } from 'vue-i18n';
import { useI18n } from '@n8n/i18n';
import { useSettingsStore } from '@n8n/stores/settings.store';

const props = withDefaults(
	defineProps<{
		pruneTimeDisplay: string;
		withTopBorder?: boolean;
	}>(),
	{
		withTopBorder: false,
	},
);

const emit = defineEmits<{
	upgrade: [];
}>();

const i18n = useI18n();
const settingsStore = useSettingsStore();
</script>

<template>
	<div :class="[$style.retention, { [$style.withTopBorder]: props.withTopBorder }]">
		<span data-test-id="prune-time-display">
			{{ props.pruneTimeDisplay }}
		</span>
		<I18nT
			:keypath="
				settingsStore.isCloudDeployment ? 'workflowHistory.upgrade' : 'workflowHistory.license'
			"
			tag="span"
			scope="global"
		>
			<template #link>
				<a href="#" @click.prevent="emit('upgrade')">
					{{
						i18n.baseText(
							settingsStore.isCloudDeployment
								? 'workflowHistory.upgrade.link'
								: 'generic.licenseDetails',
						)
					}}
				</a>
			</template>
		</I18nT>
	</div>
</template>

<style module lang="scss">
.retention {
	display: grid;
	padding: var(--spacing--sm);
	font-size: var(--font-size--2xs);
	line-height: var(--line-height--lg);
	text-align: center;
}

.withTopBorder {
	border-top: var(--border-width) var(--border-style) var(--color--foreground);
}
</style>
