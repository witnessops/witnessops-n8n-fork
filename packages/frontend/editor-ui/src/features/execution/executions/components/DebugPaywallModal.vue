<script lang="ts" setup>
import Modal from '@/app/components/Modal.vue';
import { useI18n } from '@n8n/i18n';
import { useSettingsStore } from '@n8n/stores/settings.store';

import { N8nButton, N8nLink, N8nText } from '@n8n/design-system';
const props = defineProps<{
	modalName: string;
	data: { title: string; footerButtonAction: () => void };
}>();

const i18n = useI18n();
const settingsStore = useSettingsStore();
</script>

<template>
	<Modal width="500px" :title="props.data.title" :name="props.modalName">
		<template #content>
			<N8nText>
				{{ i18n.baseText('executionsList.debug.paywall.content') }}
				<br />
				<br />
				{{
					i18n.baseText(
						settingsStore.isCloudDeployment
							? 'executionsList.debug.paywall.subContent'
							: 'executionsList.debug.paywall.subContent.selfHosted',
					)
				}}
				<N8nLink :to="i18n.baseText('executionsList.debug.paywall.link.url')" new-window>
					{{
						i18n.baseText(
							settingsStore.isCloudDeployment
								? 'executionsList.debug.paywall.link.text'
								: 'executionsList.debug.paywall.link.text.selfHosted',
						)
					}}
				</N8nLink>
			</N8nText>
		</template>
		<template #footer>
			<div :class="$style.footer">
				<N8nButton @click="props.data.footerButtonAction">
					{{
						i18n.baseText(
							settingsStore.isCloudDeployment ? 'generic.seePlans' : 'generic.licenseDetails',
						)
					}}
				</N8nButton>
			</div>
		</template>
	</Modal>
</template>

<style module lang="scss">
.footer {
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
}
</style>
