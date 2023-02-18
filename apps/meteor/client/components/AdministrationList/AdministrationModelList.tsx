import { OptionTitle } from '@rocket.chat/fuselage';
import { useTranslation, useRoute, useMethod, useSetModal } from '@rocket.chat/ui-contexts';
import { useQuery } from '@tanstack/react-query';
import { FlowRouter } from 'meteor/kadira:flow-router';
import type { FC } from 'react';
import React from 'react';

import { userHasAllPermission } from '../../../app/authorization/client';
import type { AccountBoxItem } from '../../../app/ui-utils/client/lib/AccountBox';
import { getUpgradeTabLabel, isFullyFeature } from '../../../lib/upgradeTab';
import RegisterWorkspaceModal from '../../views/admin/cloud/modals/RegisterWorkspaceModal';
import { useUpgradeTabParams } from '../../views/hooks/useUpgradeTabParams';
import Emoji from '../Emoji';
import ListItem from '../Sidebar/ListItem';

type AdministrationModelListProps = {
	accountBoxItems: AccountBoxItem[];
	showWorkspace: boolean;
	onDismiss: () => void;
};

const INFO_PERMISSIONS = ['view-statistics'];

const AdministrationModelList: FC<AdministrationModelListProps> = ({ accountBoxItems, showWorkspace, onDismiss }) => {
	const t = useTranslation();
	const { tabType, trialEndDate, isLoading } = useUpgradeTabParams();
	const shouldShowEmoji = isFullyFeature(tabType);
	const label = getUpgradeTabLabel(tabType);
	const hasInfoPermission = userHasAllPermission(INFO_PERMISSIONS);
	const setModal = useSetModal();

	const checkCloudRegisterStatus = useMethod('cloud:checkRegisterStatus');
	const result = useQuery(['admin/cloud/register-status'], async () => checkCloudRegisterStatus());
	const { workspaceRegistered, connectToCloud } = result.data || {};

	const handleRegisterWorkspaceClick = (): void => {
		const handleModalClose = (): void => setModal(null);
		setModal(<RegisterWorkspaceModal onClose={handleModalClose} isConnectedToCloud={connectToCloud} />);
	};

	const infoRoute = useRoute('admin-info');
	const adminRoute = useRoute('admin-index');
	const upgradeRoute = useRoute('upgrade');
	const cloudRoute = useRoute('cloud');
	const showUpgradeItem = !isLoading && tabType;

	return (
		<>
			<OptionTitle>{t('Administration')}</OptionTitle>
			<ul>
				{showUpgradeItem && (
					<ListItem
						icon='arrow-stack-up'
						text={
							<>
								{t(label)} {shouldShowEmoji && <Emoji emojiHandle=':zap:' />}
							</>
						}
						action={(): void => {
							upgradeRoute.push({ type: tabType }, trialEndDate ? { trialEndDate } : undefined);
							onDismiss();
						}}
					/>
				)}
				<ListItem
					icon='cloud-plus'
					text={workspaceRegistered ? t('Registration') : t('Register')}
					action={(): void => {
						if (workspaceRegistered) {
							cloudRoute.push({ context: '/' });
							onDismiss();
							return;
						}
						handleRegisterWorkspaceClick();
					}}
				/>
				{showWorkspace && (
					<ListItem
						icon='cog'
						text={t('Workspace')}
						action={(): void => {
							if (hasInfoPermission) {
								infoRoute.push();
								onDismiss();
								return;
							}

							adminRoute.push({ context: '/' });
							onDismiss();
						}}
					/>
				)}
				{accountBoxItems.length > 0 && (
					<>
						{accountBoxItems.map((item, key) => {
							const action = (): void => {
								if (item.href) {
									FlowRouter.go(item.href);
								}
								onDismiss();
							};

							return <ListItem text={t(item.name)} icon={item.icon} action={action} key={item.name + key} />;
						})}
					</>
				)}
			</ul>
		</>
	);
};

export default AdministrationModelList;
