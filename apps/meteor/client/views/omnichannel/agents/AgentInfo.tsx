import { Box, Margins, ButtonGroup } from '@rocket.chat/fuselage';
import { useTranslation } from '@rocket.chat/ui-contexts';
import React, { memo, ReactElement } from 'react';
import { useSubscription } from 'use-subscription';

import { FormSkeleton } from '../../../components/Skeleton';
import { UserStatus } from '../../../components/UserStatus';
import VerticalBar from '../../../components/VerticalBar';
import { AsyncStatePhase } from '../../../hooks/useAsyncState';
import { useEndpointData } from '../../../hooks/useEndpointData';
import UserInfo from '../../room/contextualBar/UserInfo';
import { formsSubscription } from '../additionalForms';
import AgentInfoAction from './AgentInfoAction';

type AgentInfoProps = {
	uid: string;
	children?: React.ReactNode;
};

export const AgentInfo = memo(function AgentInfo({ uid, children }: AgentInfoProps): ReactElement {
	const t = useTranslation();
	const { value: data, phase: state, error } = useEndpointData(`livechat/users/agent/${uid}`);
	const eeForms = useSubscription(formsSubscription);

	const { useMaxChatsPerAgentDisplay = (): void => undefined } = eeForms;

	const MaxChats = useMaxChatsPerAgentDisplay();

	if (state === AsyncStatePhase.LOADING) {
		return <FormSkeleton />;
	}

	if (error || !data || !data.user) {
		return <Box mbs='x16'>{t('User_not_found')}</Box>;
	}

	const { user } = data;
	const { username, statusLivechat, status: userStatus } = user;

	return (
		<VerticalBar.ScrollableContent p='x24'>
			<Box alignSelf='center'>
				<UserInfo.Avatar size={'x332'} username={username} />
			</Box>

			<ButtonGroup mi='neg-x4' flexShrink={0} flexWrap='nowrap' withTruncatedText justifyContent='center'>
				{children}
			</ButtonGroup>

			<Margins block='x4'>
				<Box mb='x2'>
					<UserInfo.Username name={username} username={username} status={<UserStatus status={userStatus} />} />
				</Box>

				{statusLivechat && (
					<>
						<UserInfo.Label>{t('Livechat_status')}</UserInfo.Label>
						<UserInfo.Info>{t(statusLivechat === 'available' ? 'Available' : 'Not_Available')}</UserInfo.Info>
					</>
				)}

				{MaxChats && <MaxChats data={user} />}
			</Margins>
		</VerticalBar.ScrollableContent>
	);
});

export default Object.assign(AgentInfo, {
	Action: AgentInfoAction,
});