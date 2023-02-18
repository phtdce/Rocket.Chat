import type {
	IMessage,
	IRoom,
	IUser,
	ILivechatDepartment,
	ILivechatPriority,
	IOmnichannelServiceLevelAgreements,
} from '@rocket.chat/core-typings';
import type {
	AggregationCursor,
	CountDocumentsOptions,
	FindCursor,
	FindOptions,
	AggregateOptions,
	InsertOneResult,
	DeleteResult,
} from 'mongodb';

import type { FindPaginated, IBaseModel } from './IBaseModel';

export interface IMessagesModel extends IBaseModel<IMessage> {
	findVisibleByMentionAndRoomId(
		username: IUser['username'],
		rid: IRoom['_id'],
		options: FindOptions<IMessage>,
	): FindPaginated<FindCursor<IMessage>>;

	findStarredByUserAtRoom(userId: IUser['_id'], roomId: IRoom['_id'], options: FindOptions<IMessage>): FindPaginated<FindCursor<IMessage>>;

	findPaginatedByRoomIdAndType(
		roomId: IRoom['_id'],
		type: IMessage['t'],
		options?: FindOptions<IMessage>,
	): FindPaginated<FindCursor<IMessage>>;

	findDiscussionsByRoom(rid: IRoom['_id'], options: FindOptions<IMessage>): FindCursor<IMessage>;

	findDiscussionsByRoomAndText(rid: IRoom['_id'], text: string, options: FindOptions<IMessage>): FindPaginated<FindCursor<IMessage>>;

	findAllNumberOfTransferredRooms(params: {
		start: string;
		end: string;
		departmentId: ILivechatDepartment['_id'];
		onlyCount: boolean;
		options: any;
	}): AggregationCursor<any>;

	getTotalOfMessagesSentByDate(params: { start: Date; end: Date; options?: any }): Promise<any[]>;

	findLivechatClosedMessages(rid: IRoom['_id'], searchTerm?: string, options?: FindOptions<IMessage>): FindPaginated<FindCursor<IMessage>>;
	findLivechatMessages(rid: IRoom['_id'], options?: FindOptions<IMessage>): FindCursor<IMessage>;
	findLivechatMessagesWithoutClosing(rid: IRoom['_id'], options?: FindOptions<IMessage>): FindCursor<IMessage>;
	countRoomsWithStarredMessages(options: AggregateOptions): Promise<number>;

	countRoomsWithPinnedMessages(options: AggregateOptions): Promise<number>;

	findPinned(options: FindOptions<IMessage>): FindCursor<IMessage>;

	findStarred(options: FindOptions<IMessage>): FindCursor<IMessage>;

	setBlocksById(_id: string, blocks: Required<IMessage>['blocks']): Promise<void>;

	addBlocksById(_id: string, blocks: Required<IMessage>['blocks']): Promise<void>;

	countRoomsWithMessageType(type: IMessage['t'], options: AggregateOptions): Promise<number>;

	countByType(type: IMessage['t'], options: CountDocumentsOptions): Promise<number>;

	findPaginatedPinnedByRoom(roomId: IMessage['rid'], options: FindOptions<IMessage>): FindPaginated<FindCursor<IMessage>>;

	setFederationReactionEventId(username: string, _id: string, reaction: string, federationEventId: string): Promise<void>;

	unsetFederationReactionEventId(federationEventId: string, _id: string, reaction: string): Promise<void>;

	findOneByFederationIdAndUsernameOnReactions(federationEventId: string, username: string): Promise<IMessage | null>;

	findOneByFederationId(federationEventId: string): Promise<IMessage | null>;

	setFederationEventIdById(_id: string, federationEventId: string): Promise<void>;

	createPriorityHistoryWithRoomIdMessageAndUser(
		roomId: string,
		user: IMessage['u'],
		priority?: Pick<ILivechatPriority, 'name' | 'i18n'>,
	): Promise<InsertOneResult<IMessage>>;

	createSLAHistoryWithRoomIdMessageAndUser(
		roomId: string,
		user: IMessage['u'],
		sla?: Pick<IOmnichannelServiceLevelAgreements, 'name'>,
	): Promise<InsertOneResult<IMessage>>;

	removeByRoomId(roomId: IRoom['_id']): Promise<DeleteResult>;
}
