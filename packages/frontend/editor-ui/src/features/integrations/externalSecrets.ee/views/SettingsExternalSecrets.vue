<script lang="ts" setup>
import { useI18n } from '@n8n/i18n';
import { useToast } from '@n8n/composables/useToast';
import { useDocumentTitle } from '@/app/composables/useDocumentTitle';
import { useExternalSecretsStore } from '../externalSecrets.ee.store';
import { computed, onMounted } from 'vue';
import ExternalSecretsProviderCard from '../components/ExternalSecretsProviderCard.ee.vue';
import type { ExternalSecretsProvider } from '../externalSecrets.types';
import { usePageRedirectionHelper } from '@/app/composables/usePageRedirectionHelper';
import { useSettingsStore } from '@n8n/stores/settings.store';
import { I18nT } from 'vue-i18n';

import { N8nEmptyState, N8nCallout, N8nHeading } from '@n8n/design-system';
const i18n = useI18n();
const externalSecretsStore = useExternalSecretsStore();
const toast = useToast();
const documentTitle = useDocumentTitle();
const pageRedirectionHelper = usePageRedirectionHelper();
const settingsStore = useSettingsStore();

const sortedProviders = computed(() => {
	return ([...externalSecretsStore.providers] as ExternalSecretsProvider[]).sort((a, b) => {
		return b.name.localeCompare(a.name);
	});
});

onMounted(() => {
	documentTitle.set(i18n.baseText('settings.externalSecrets.title'));
	if (!externalSecretsStore.isEnterpriseExternalSecretsEnabled) return;
	try {
		void externalSecretsStore.fetchGlobalSecrets();
		void externalSecretsStore.getProviders();
	} catch (error) {
		toast.showError(error, i18n.baseText('error'));
	}
});

function goToUpgrade() {
	void pageRedirectionHelper.goToUpgrade('external-secrets', 'upgrade-external-secrets');
}
</script>

<template>
	<div class="pb-3xl">
		<N8nHeading size="2xlarge">{{ i18n.baseText('settings.externalSecrets.title') }}</N8nHeading>
		<div
			v-if="externalSecretsStore.isEnterpriseExternalSecretsEnabled"
			data-test-id="external-secrets-content-licensed"
		>
			<N8nCallout theme="secondary" class="mt-2xl mb-l">
				{{ i18n.baseText('settings.externalSecrets.info') }}
				<a href="https://docs.n8n.io/external-secrets/" target="_blank">
					{{ i18n.baseText('settings.externalSecrets.info.link') }}
				</a>
			</N8nCallout>
			<ExternalSecretsProviderCard
				v-for="provider in sortedProviders"
				:key="provider.name"
				:provider="provider"
			/>
		</div>
		<N8nEmptyState
			v-else
			class="mt-2xl mb-l"
			data-test-id="external-secrets-content-unlicensed"
			:button-text="
				settingsStore.isCloudDeployment
					? i18n.baseText('settings.externalSecrets.actionBox.buttonText')
					: i18n.baseText('generic.licenseDetails')
			"
			@click="goToUpgrade"
		>
			<template #heading>
				<span>{{
					settingsStore.isCloudDeployment
						? i18n.baseText('settings.externalSecrets.actionBox.title')
						: i18n.baseText('generic.licenseRequired')
				}}</span>
			</template>
			<template #description>
				<I18nT keypath="settings.externalSecrets.actionBox.description" scope="global">
					<template #link>
						<a href="https://docs.n8n.io/external-secrets/" target="_blank">
							{{ i18n.baseText('settings.externalSecrets.actionBox.description.link') }}
						</a>
					</template>
				</I18nT>
			</template>
		</N8nEmptyState>
	</div>
</template>
