import { Spinner, Stack } from '@chakra-ui/react';
import React from 'react';

const Loading = ({ size }) => {
  return (
    <Stack>
      <Spinner size={size} />
    </Stack>
  );
};

export default Loading;
