import type { IRoom } from '@rocket.chat/core-typings';
import React, { memo } from 'react';

import ActionsToolbarDropdown from './ActionsToolbarDropdown';
import AudioMessageAction from './actions/AudioMessageAction';
import FileUploadAction from './actions/FileUploadAction';
import VideoMessageAction from './actions/VideoMessageAction';

type MessageBoxActionsToolbarProps = {
	variant: 'small' | 'large';
	isRecording: boolean;
	typing: boolean;
	canSend: boolean;
	canJoin: boolean;
	rid: IRoom['_id'];
	tmid?: string;
};

const MessageBoxActionsToolbar = ({
	variant = 'large',
	isRecording,
	typing,
	canSend,
	rid,
	tmid,
	canJoin,
}: MessageBoxActionsToolbarProps) => {
	const actions = [
		<VideoMessageAction key='video' collapsed={variant === 'small'} disabled={(!canJoin && !canSend) || typing || isRecording} />,
		<AudioMessageAction key='audio' disabled={(!canJoin && !canSend) || typing || isRecording} />,
		<FileUploadAction key='file' collapsed={variant === 'small'} disabled={!canSend || isRecording} />,
	];

	let featuredAction;
	if (variant === 'small') {
		featuredAction = actions.splice(1, 1);
	}

	return (
		<>
			{variant !== 'small' && actions}
			{variant === 'small' && featuredAction}
			<ActionsToolbarDropdown {...(variant === 'small' && { actions })} isRecording={isRecording} rid={rid} tmid={tmid} />
		</>
	);
};

export default memo(MessageBoxActionsToolbar);
