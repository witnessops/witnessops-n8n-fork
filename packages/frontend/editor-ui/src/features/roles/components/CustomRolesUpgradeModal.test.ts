import { createComponentRenderer } from '@/__tests__/render';
import { createPinia, setActivePinia } from 'pinia';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { useSettingsStore } from '@n8n/stores/settings.store';
import CustomRolesUpgradeModal from './CustomRolesUpgradeModal.vue';

const mockGoToUpgrade = vi.fn();

vi.mock('@/app/composables/usePageRedirectionHelper', () => ({
	usePageRedirectionHelper: () => ({
		goToUpgrade: mockGoToUpgrade,
	}),
}));

vi.mock('vue-router', async () => {
	const actual = await vi.importActual('vue-router');
	return {
		...actual,
		useRouter: () => ({
			push: vi.fn(),
		}),
	};
});

const ElDialogStub = {
	props: ['title'],
	template: `
		<div role="dialog">
			<h2>{{ title }}</h2>
			<slot />
			<slot name="footer" />
		</div>
	`,
};

const renderComponent = createComponentRenderer(CustomRolesUpgradeModal, {
	props: {
		modelValue: true,
	},
	global: {
		stubs: {
			ElDialog: ElDialogStub,
		},
	},
});

describe('CustomRolesUpgradeModal', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
		useSettingsStore().settings.deployment = { type: 'default' };
		vi.clearAllMocks();
	});

	describe('Rendering', () => {
		it('should render the modal content', () => {
			const { getByText } = renderComponent();

			expect(getByText('Documentation')).toBeInTheDocument();
		});

		it('should show license details on a self-hosted instance', () => {
			const { getByText, getByRole, queryByText } = renderComponent();

			expect(
				getByRole('heading', { name: 'Custom roles require an Enterprise license' }),
			).toBeInTheDocument();
			expect(
				getByText(/Custom roles are unavailable under the current license/),
			).toBeInTheDocument();
			expect(getByText('Cancel')).toBeInTheDocument();
			expect(getByRole('button', { name: 'License details' })).toBeInTheDocument();
			expect(queryByText('View plans')).not.toBeInTheDocument();
		});

		it('should keep plan copy on a Cloud instance', () => {
			useSettingsStore().settings.deployment = { type: 'cloud' };
			const { getByRole, getByText } = renderComponent();

			expect(getByRole('heading', { name: 'Upgrade to Enterprise' })).toBeInTheDocument();
			expect(getByText('View plans')).toBeInTheDocument();
		});
	});

	describe('User interactions', () => {
		it('should emit update:modelValue when Cancel is clicked', async () => {
			const user = userEvent.setup();
			const { getByText, emitted } = renderComponent();

			await user.click(getByText('Cancel'));

			expect(emitted()['update:modelValue']).toBeTruthy();
			expect(emitted()['update:modelValue'][0]).toEqual([false]);
		});

		it('should route to license details when clicked on a self-hosted instance', async () => {
			const user = userEvent.setup();
			const { getByRole } = renderComponent();

			await user.click(getByRole('button', { name: 'License details' }));

			expect(mockGoToUpgrade).toHaveBeenCalledWith('custom-roles-selector', 'upgrade-custom-roles');
		});

		it('should retain the Cloud plan action', async () => {
			useSettingsStore().settings.deployment = { type: 'cloud' };
			const user = userEvent.setup();
			const { getByRole } = renderComponent();

			await user.click(getByRole('button', { name: 'View plans' }));

			expect(mockGoToUpgrade).toHaveBeenCalledWith('custom-roles-selector', 'upgrade-custom-roles');
		});

		it('should close modal after license details is clicked', async () => {
			const user = userEvent.setup();
			const { getByRole, emitted } = renderComponent();

			await user.click(getByRole('button', { name: 'License details' }));

			expect(emitted()['update:modelValue']).toBeTruthy();
			expect(emitted()['update:modelValue'][0]).toEqual([false]);
		});
	});
});
