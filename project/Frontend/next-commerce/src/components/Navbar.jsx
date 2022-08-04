import {
  Box,
  Flex,
  Avatar,
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Text,
  Icon,
  useDisclosure,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  useColorModeValue,
  Stack,
  color,
  useColorMode,
  InputGroup,
  InputLeftElement,
  Input,
  useToast,
  FormControl,
  FormLabel,
  Center,
  VStack,
} from "@chakra-ui/react";
import LinkNext from "next/link";
import React from "react";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import jsCookie from "js-cookie";
import auth_types from "../redux/reducers/types/auth";
import { useFormik } from "formik";
import { axiosInstance } from "../lib/api";

import {
  FcLike,
  FcPortraitMode,
  FcCancel,
  FcAdvertising,
  FcNews,
  FcAddImage,
  FcAutomatic,
} from "react-icons/fc";
import { AiOutlineSearch } from "react-icons/ai";
import ContentCard from "./ContentCard.jsx";
import { GiSunflower } from "react-icons/gi";
import { BsMoon } from "react-icons/bs";

import { useRouter } from "next/router";
import InfiniteScroll from "react-infinite-scroller";

const NavLink = ({ children, path }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("white"),
      color: "black",
    }}
    href={path}
  >
    {children}
  </Link>
);

export default function NavbarComponent() {
  const dispatch = useDispatch();
  // const router = useRouter();
  const authSelector = useSelector((state) => state.auth);

  const SubMenu = [
    { link: "Profile", path: "/profile" },

    {
      link: "Logout",
      path: "/",
      klik: btnlogout,
    },
  ];

  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const { colorMode, toggleColorMode } = useColorMode();

  function btnlogout() {
    jsCookie.remove("auth_token");

    dispatch({
      type: auth_types.AUTH_LOGOUT,
    });
  }

  const [selectedFile, setSelectedFile] = useState(null);
  const toast = useToast();

  const inputFileRef = useRef(null);

  const postRender = useSelector((state) => {
    return state.post;
  });

  const router = useRouter();
  const [userPoster, setUserPoster] = useState([]);
  const [loadingPage, setLoadingPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const userSelector = useSelector((state) => state.auth);
  const [loadMore, setLoadMore] = useState(1);
  const [maxComments, setMaxComments] = useState(5);
  const rendering = useSelector((state) => state.post);

  async function getMorePage() {
    try {
      if (loadMore > 0) {
        await axiosInstance
          .get(`/post/paging?page=${loadingPage}&limit=1`)
          .then((res) => {
            setLoadingPage(loadingPage + 1);
            console.log(res.data.result);
            const data = res?.data?.result;

            // alert(data.length);
            setPostUser([...postUser, ...data]);

            if (data.length) {
              setLoadingPage(loadingPage + 1);
              setUserPoster([...userPoster, ...data]);
            } else {
              setLoadMore(0);
            }
          });
      }

      // console.log('render');
    } catch (err) {
      console.log(err);
    }
  }

  const formik = useFormik({
    initialValues: {
      caption: "",
      location: "",
    },
    onSubmit: async () => {
      const formData = new FormData();
      const { caption, location } = formik.values;

      formData.append("caption", caption);
      formData.append("location", location);
      formData.append("user_id", authSelector.id);
      formData.append("image", selectedFile);

      try {
        await axiosInstance
          .post("/post/upload", formData)
          .then(() => {
            toast({
              title: "Post has been added",
              status: "success",
              isCloseable: true,
            });

            // AUTO RENDER
            dispatch({
              type: "POST_RENDER",
              payload: {
                value: !postRender.value,
              },
            });
          })
          .then(onClose());
      } catch (err) {
        console.log(err);

        toast({
          title: "ERROR",
          status: "error",
          isCloseable: true,
        });
      }
    },
  });

  const [postUser, setPostUser] = useState([]);

  useEffect(() => {
    async function postImage() {
      try {
        const res = await axiosInstance.get("/post/");
        const data = res.data.results;
        setPostUser(data);
        // console.log(data);
      } catch (error) {}
    }
    // postImage();
    getMorePage();
  }, [postRender]);

  const handleFile = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  useEffect(() => {
    async function postImage() {
      try {
        const res = await axiosInstance.get("/post/");
        const data = res.data.results;
        setPostUser(data);
        // console.log(data);
      } catch (error) {}
    }

    // postImage();
    getMorePage();
  }, [postRender]);

  return (
    <>
      <Box bg={useColorModeValue("#005555")} color="#ede6db" px={4}>
        <Flex h="70px" alignItems={"center"} justifyContent={"space-between"}>
          <HStack spacing={3} alignItems={"center"}>
            <Link href="/home">
              <Box fontFamily="chitchat">CHIT-CHAT</Box>
            </Link>
            <Box ml={"60px"}>
              <InputGroup size={"md"} minW={"xs"}>
                <InputLeftElement pointerEvents={"none"}>
                  <AiOutlineSearch />
                </InputLeftElement>
                <Input type="tel" placeholder="Search..." />
              </InputGroup>
            </Box>
          </HStack>

          <Flex alignItems={"center"}>
            {/* <LinkNext href="/home">
              <Button background="#005555" mr="8px">
                <Icon boxSize="7" as={AiOutlineHome} />
              </Button>
            </LinkNext> */}
            <Link>
              <Button background="#005555" mr="8px">
                <Icon boxSize="7" as={FcLike} />
              </Button>
            </Link>
            <Button onClick={onOpen} background="#005555" mr="8px">
              <Icon boxSize="7" as={FcAddImage} />
            </Button>
            <Button background="#005555" mr="8px">
              <Icon boxSize="7" as={FcAdvertising} />
            </Button>
            <Button
              bgColor="#005555"
              mr="8px"
              color={"white"}
              onClick={toggleColorMode}
            >
              {/* darkmode */}
              {/* {colorMode === "light" ? <MoonIcon /> : <SunIcon boxSize="7" />} */}
              {colorMode === "light" ? (
                <Icon boxSize="6" as={BsMoon} />
              ) : (
                <Icon boxSize="7" as={GiSunflower} />
              )}
            </Button>

            <Menu>
              <MenuButton align={"center"} minW={0}>
                <Box display="flex">
                  <Avatar
                    size={"md"}
                    // src={`http://${avatar_url}`}
                    src={authSelector.avatar_url}
                  />
                  {/* <Text ml="10px" mt="5px" textTransform="none">
                    Username
                  </Text> */}
                </Box>
              </MenuButton>

              <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
              >
                <ModalOverlay
                  rounded={"lg"}
                  backdropContrast="50%"
                  backdropFilter="auto"
                />
                <ModalContent>
                  <Box
                  // backgroundColor={"#FAFAFA"}
                  >
                    <Flex minH={"50vh"} align={"center"} justify={"center"}>
                      <Stack spacing={4}>
                        <FormControl>
                          <FormLabel>Image</FormLabel>
                          <Input
                            type={"file"}
                            //   display={"none"}
                            onChange={handleFile}
                            accept={"image/png, image/jpg, image/jpeg"}
                            ref={inputFileRef}
                          ></Input>
                          <Button
                            align={"center"}
                            colorScheme={"blue"}
                            onClick={() => inputFileRef.current.click()}
                          >
                            Upload Image
                          </Button>
                        </FormControl>

                        <FormControl>
                          <FormLabel>Caption</FormLabel>
                          <Input
                            onChange={(e) => {
                              formik.setFieldValue("caption", e.target.value);
                            }}
                          ></Input>
                        </FormControl>

                        <FormControl>
                          <FormLabel>Location</FormLabel>
                          <Input
                            onChange={(e) => {
                              formik.setFieldValue("location", e.target.value);
                            }}
                          ></Input>
                        </FormControl>

                        <Center>
                          <Button
                            colorScheme={"green"}
                            onClick={formik.handleSubmit}
                          >
                            Submit
                          </Button>
                        </Center>
                      </Stack>
                    </Flex>
                  </Box>
                </ModalContent>
              </Modal>

              <MenuList bg="#005555">
                {/* {" "}
//                     {SubMenu.map((val) => (
//                       <MenuItem onClick={val.klik}>{val.link}</MenuItem>
//                     ))} */}
                <LinkNext href="/profile/showProfile">
                  <MenuItem>
                    <Icon
                      boxSize="7"
                      as={FcPortraitMode}
                      mr="6px"
                      type="uppercase"
                    />
                    <Text style={{ textTransform: "uppercase" }}>
                      {authSelector.username}
                    </Text>
                  </MenuItem>
                </LinkNext>
                <MenuDivider />

                <LinkNext href="/profile/editProfile">
                  <MenuItem>
                    <Icon boxSize="7" as={FcAutomatic} mr="6px" />
                    EDIT PROFILE
                  </MenuItem>
                </LinkNext>
                <MenuDivider />

                <LinkNext href="/">
                  <MenuItem onClick={btnlogout}>
                    <Icon boxSize="7" as={FcCancel} mr="6px" />
                    LOG OUT
                  </MenuItem>
                </LinkNext>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      </Box>

      <Box>
        <InfiniteScroll
          pageStart={1}
          loadMore={getMorePage}
          hasMore={true || false}
        >
          {postUser.map((val, idx) => {
            return (
              <div key={idx}>
                <Center>
                  <ContentCard
                    username={val.User?.username} //
                    caption={val.caption}
                    image_url={val.image_url}
                    location={val.location}
                    likes={val.number_of_likes}
                    id={val.id}
                    // number_of_comments={val.number_of_comments}
                    liked={val.liked}
                    avatar_url={val.avatar_url}
                    created_at={val.createdAt}
                  />
                </Center>
              </div>
            );
          })}
        </InfiniteScroll>
      </Box>
    </>
  );
}
