import React from 'react';
import { Button, Dialog, List } from 'react-native-paper';
import { FlatList, ListRenderItemInfo } from 'react-native';

import { PasswordType, PasswordTypes } from '../Utils/mpw/templates';

export interface Props {
  onDone: (passwordType: PasswordType) => void;
}

type DialogProps = React.ComponentProps<typeof Dialog>;

function DialogPasswordType({ onDone, ...dialogProps }: Props & Omit<DialogProps, 'children'>) {
  function renderItem({ item: passwordType }: ListRenderItemInfo<PasswordType>) {
    return (
      <List.Item key={passwordType} title={passwordType} onPress={() => onDone(passwordType)} />
    );
  }

  return (
    <Dialog {...dialogProps}>
      <Dialog.Title>Password types</Dialog.Title>
      <Dialog.ScrollArea>
        <List.Section>
          <FlatList
            keyExtractor={keyExtractorForPasswordType}
            data={PasswordTypes}
            renderItem={renderItem}
          ></FlatList>
        </List.Section>
      </Dialog.ScrollArea>
      <Dialog.Actions>
        <Button onPress={dialogProps.onDismiss}>Cancel</Button>
      </Dialog.Actions>
    </Dialog>
  );
}

function keyExtractorForPasswordType(passwordType: PasswordType): string {
  return `dialog-password-type-${passwordType}`;
}

export default DialogPasswordType;
