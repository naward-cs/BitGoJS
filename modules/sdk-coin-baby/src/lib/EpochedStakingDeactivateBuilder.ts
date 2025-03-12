import * as constants from './constants';
import { StakingDeactivateBuilder } from '@bitgo/abstract-cosmos';
import { CustomTxMessage } from './iface';

export class EpochedStakingDeactivateBuilder extends StakingDeactivateBuilder<CustomTxMessage> {
  /** @inheritdoc */
  messages(undelegateMessages: Parameters<StakingDeactivateBuilder<CustomTxMessage>['messages']>[0]): this {
    super.messages(undelegateMessages);
    this._messages.forEach((message) => (message.typeUrl = constants.wrappedUndelegateMsgTypeUrl));
    return this;
  }
}
