import { AppPermission } from '@rocket.chat/core-typings';
import { TranslationKey, useTranslation } from '@rocket.chat/ui-contexts';
import React, { ReactElement } from 'react';

const defaultPermissions = [
	'user.read',
	'user.write',
	'upload.read',
	'upload.write',
	'ui.interact',
	'server-setting.read',
	'server-setting.write',
	'room.read',
	'room.write',
	'message.read',
	'message.write',
	'livechat-department.read',
	'livechat-department.write',
	'livechat-room.read',
	'livechat-room.write',
	'livechat-message.read',
	'livechat-message.write',
	'livechat-visitor.read',
	'livechat-visitor.write',
	'livechat-status.read',
	'livechat-custom-fields.write',
	'scheduler',
	'networking',
	'persistence',
	'env.read',
	'slashcommand',
	'api',
];

const HumanizedPermissionsList = ({ appPermissions }: { appPermissions: AppPermission[] | undefined }): ReactElement => {
	const t = useTranslation();
	const handleHumanizePermission = (permission: string): string => t(`Apps_Permissions_${permission.replace('.', '_')}` as TranslationKey);

	if (appPermissions?.length) {
		return (
			<>
				{appPermissions.map((permission) => (
					<>
						<li key={permission.name}>{handleHumanizePermission(permission.name)}</li>
						{permission.required && <span style={{ color: 'red' }}> ({t('required')})</span>}
					</>
				))}
			</>
		);
	}

	return (
		<>
			{defaultPermissions.map((permission) => (
				<li key={permission}>{handleHumanizePermission(permission)}</li>
			))}
		</>
	);
};

export default HumanizedPermissionsList;
