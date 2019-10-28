import React from 'react';
import { Button, Dialog, List } from 'react-native-paper';

import { templates } from '../Utils/mpw/templates';
import { ScrollView } from 'react-native';

export interface Props {
  onDone: (passwordType: string) => void;
}

function DialogPasswordType({
  onDone,
  ...props
}: Props & React.ComponentProps<typeof Dialog>) {
  function onSelected(passwordType: string) {
    return () => {
      if (!onDone) {
        return;
      }
      onDone(passwordType);
    };
  }

  return (
    <Dialog {...props}>
      <Dialog.Title>Password types</Dialog.Title>
      <Dialog.ScrollArea>
        <ScrollView>
          <List.Section>
            {Object.keys(templates).map(passwordTypeKey => (
              <List.Item
                key={passwordTypeKey}
                title={passwordTypeKey}
                onPress={onSelected(passwordTypeKey)}
              />
            ))}
          </List.Section>
        </ScrollView>
      </Dialog.ScrollArea>
      <Dialog.Actions>
        <Button onPress={props.onDismiss}>Cancel</Button>
      </Dialog.Actions>
    </Dialog>
  );
}

export default DialogPasswordType;
