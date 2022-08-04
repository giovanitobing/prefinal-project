import { Box, Text } from "@chakra-ui/react";

function Comment({ username, content }) {
  return (
    <Box marginY="1">
      <Text display="inline" fontWeight="bold" marginRight="2">
        {username}
      </Text>
      <Text display="inline">{content}</Text>
    </Box>
  );
}

export default Comment;
