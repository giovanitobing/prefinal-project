import {
  Heading,
  Avatar,
  Box,
  Center,
  Text,
  Stack,
  Button,
  Link,
  Badge,
  useColorModeValue,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Grid,
  GridItem,
} from "@chakra-ui/react";

import { useDispatch, useSelector } from "react-redux";
import LinkNext from "next/link";
import PostProfile from "../../../components/PostProfile";
import { MdEmail, MdHeadset, MdLocationOn } from "react-icons/md";
import { BsFillBriefcaseFill } from "react-icons/bs";

export default function showProfile() {
  const authSelector = useSelector((state) => state.auth);
  return (
    <>
      <Center py={6}>
        <Box
          maxW={"500px"}
          w={"full"}
          bg={useColorModeValue("white", "gray.900")}
          boxShadow={"2xl"}
          rounded={"lg"}
          p={2}
          textAlign={"center"}
        >
          <Avatar
            size={"lg"}
            src={authSelector.avatar_url}
            alt={"Avatar Alt"}
            mb={2}
            pos={"relative"}
            _after={{
              content: '""',
              w: 4,
              h: 4,
              bg: "green.300",
              border: "2px solid white",
              rounded: "full",
              pos: "absolute",
              bottom: 0,
              right: 3,
            }}
          />
          <Heading
            fontSize={"3xl"}
            // fontFamily={"body"}
            style={{ textTransform: "uppercase" }}
            className="textwrapper"
          >
            {authSelector.full_name}
          </Heading>

          <Text fontWeight={600} color={"gray.500"} mb={4}>
            call me : {authSelector.username}
          </Text>

          <Text fontWeight={600} color={"gray.500"} mb={4}>
            {authSelector.email}
          </Text>
          <Text
            textAlign={"center"}
            color={useColorModeValue("gray.700", "gray.400")}
            px={3}
            mb={4}
            fontSize={"2xl"}
            fontStyle="italic"
            fontFamily="fantasy"
          >
            my bio : {authSelector.bio}
          </Text>

          <Stack mt={8} direction={"row"} spacing={4}>
            <LinkNext href="/profile/editProfile">
              <Button
                flex={1}
                fontSize={"sm"}
                rounded={"full"}
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                _focus={{
                  bg: "blue.500",
                }}
              >
                EDIT
              </Button>
            </LinkNext>

            <LinkNext href="/home">
              <Button
                flex={1}
                fontSize={"sm"}
                rounded={"full"}
                // size="lg"
                bg={"green.400"}
                color={"white"}
                // boxShadow={
                //   "0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)"
                // }
                _hover={{
                  bg: "green.500",
                }}
                _focus={{
                  bg: "green.500",
                }}
              >
                OK
              </Button>
            </LinkNext>
          </Stack>
        </Box>
      </Center>

      <Center alignContent={"center"} alignItems="center">
        <Tabs variant="unstyled" w="100%">
          <TabList ml={4}>
            <Tab
              boxSize="50px"
              w="100px"
              _selected={{ color: "white", bg: "teal.500" }}
              rounded={"full"}
            >
              Post
            </Tab>
            <Tab
              boxSize="50px"
              w="100px"
              _selected={{ color: "white", bg: "teal.500" }}
              rounded={"full"}
            >
              Like
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <PostProfile />
            </TabPanel>
            <TabPanel>
              <p>test like</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Center>
    </>
  );
}
