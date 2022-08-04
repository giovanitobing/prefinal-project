import { useEffect, useState } from "react";
import {
  Box,
  Image,
  Avatar,
  Text,
  Icon,
  Button,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  useToast,
} from "@chakra-ui/react";
import { FaRegHeart, FaRegComment } from "react-icons/fa";
import Comment from "./Comment";
import axios from "axios";
import NextImage from "next/image";
import img from "../components/CAL_4361.jpg";
// import { API_URL } from "../../configs/api";
import { FcMenu, FcEditImage, FcRemoveImage, FcLike } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "../lib/api";
import qs from "qs";
import EditContent from "./EditContent";
import { useRouter } from "next/router";
import moment from "moment";

function ContentCard(props) {
  const router = useRouter();
  const {
    username,
    location,
    caption,
    number_of_likes,
    image_url,
    id,
    avatar_url,
    number_of_comments,
    created_at,
  } = props;

  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [displayCommentInput, setDisplayCommentInput] = useState(false);
  const [commentLimit, setCommentLimit] = useState(3); // membatasi jumlah comment yang tampil

  const [isLike, setIsLike] = useState(props.liked);
  const [likes, setLikes] = useState(props.likes);

  const userSelector = useSelector((state) => state.auth);
  const toast = useToast();
  const authSelector = useSelector((state) => state.auth);

  async function deletePost() {
    try {
      // mengurangi total post di database //
      let body = {
        total_post: userSelector.total_post - 1,
      };
      console.log(userSelector.total_post);

      await axiosInstance.patch("/user/" + userSelector.id, qs.stringify(body));
      await axiosInstance.delete("/post/" + id);

      toast({
        title: "Succes",
        description: "Succes deleting Post",
        status: "success",
        isClosable: true,
      });
    } catch (err) {
      console.log(err);
      toast({
        title: "Error",
        description: err.toString(),
        status: "error",
        isClosable: true,
      });
    }
  }

  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();

  const fetchComments = () => {
    axiosInstance
      .get(`/comments`, {
        params: {
          PostId: props.id,
          // limit: 3,
          limit: commentLimit,
        },
      })
      .then((res) => {
        // console.log(res.data.result);
        setComments(res.data.result);
        setCommentLimit(commentLimit + 3); // mengatur dan menampilkan jumlah komen selanjutnya sebanyak 3 komen
      });
  };

  const handleCommentInput = (event) => {
    const { value } = event.target;

    setCommentInput(value);
  };

  const postNewComment = async () => {
    const formData = {
      UserId: userSelector.id,
      PostId: props.id,
      content: commentInput,
    };

    try {
      // console.log(formData);
      await axiosInstance.post("/comments", formData).then(() => {
        setCommentInput("");
        toast({
          title: "berhasil comment",
          status: "success",
          isCloseable: true,
        });
      });
    } catch (err) {
      console.log(err);

      toast({
        title: "ERROR",
        status: "error",
        isCloseable: true,
      });
    }
  };

  const handleLike = async () => {
    // console.log(userSelector.id);
    let body = {
      PostId: props.id,
      UserId: userSelector.id,
    };
    await axiosInstance.post("/likes", qs.stringify(body)).then((res) => {
      // setComments(res.data);
      // console.log("handleLike");
      console.log(res.data);
    });
    setIsLike(!isLike);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      maxW="lg"
      paddingY="2"
      marginY="4"
      border="1px"
      borderColor="teal"
    >
      {/* Card Header */}
      <Box
        paddingX="3"
        paddingBottom="2"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box display={"flex"}>
          <Avatar src={authSelector.avatar_url} size="md" />
          {/* <Avatar src={`http://${avatar_url}`} size="md" /> */}
          <Box marginLeft="2">
            <Text fontSize="md" fontWeight="bold">
              {username}
            </Text>
            <Text fontSize="sm" color="GrayText">
              {location}
            </Text>
          </Box>
        </Box>

        {/* BAGIAN MODAL UNTUK EDIT dan DELETE POST */}
        {userSelector.username == username ? (
          <Box>
            <Menu>
              <MenuButton cursor="pointer">
                <Icon boxSize={6} as={FcMenu} />
              </MenuButton>

              {/* EDIT POST */}
              <MenuList>
                <MenuItem onClick={onOpenEdit}>
                  <Icon boxSize="7" as={FcEditImage} mr="8px" />
                  Edit Post
                </MenuItem>
                <Modal isOpen={isOpenEdit} onClose={onCloseEdit} size="xs">
                  <ModalOverlay />
                  {/* <ModalContent>
                    <ModalHeader>Edit Post</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                      <Box justifyContent={"space-between"}>
                        <Text>Are you sure want to edit this post?</Text>
                      </Box>
                      <Box mt="10px" display="flex" justifyContent="flex-end">
                        <Button
                          mr={3}
                          colorScheme="red"
                          onClick={() => {
                            // async function submit() {
                            //   await deletePost();
                            //   onCloseDelete();
                            // }
                            // submit()
                          }}
                        >
                          EDIT
                        </Button>
                      </Box>
                    </ModalBody>
                  </ModalContent> */}

                  <EditContent
                    imageUrlEdit={image_url}
                    captionEdit={caption}
                    locationEdit={location}
                    idEdit={id}
                    onClose={onCloseEdit}
                  />
                </Modal>

                {/* DELETE POST */}
                <MenuItem onClick={onOpenDelete}>
                  <Icon boxSize="7" as={FcRemoveImage} mr="8px" />
                  Delete Post
                </MenuItem>
                <Modal isOpen={isOpenDelete} onClose={onCloseDelete} size="xs">
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Delete Post</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                      <Box justifyContent={"space-between"}>
                        <Text>Are you sure want to delete this post?</Text>
                      </Box>
                      <Box mt="10px" display="flex" justifyContent="flex-end">
                        <Button
                          mr={3}
                          colorScheme="red"
                          onClick={() => {
                            async function submit() {
                              await deletePost();
                              onCloseDelete();
                            }
                            submit();
                          }}
                        >
                          DELETE
                        </Button>
                      </Box>
                    </ModalBody>
                  </ModalContent>
                </Modal>
              </MenuList>
            </Menu>
          </Box>
        ) : (
          <></>
        )}
      </Box>

      {/* Tampilan Post */}
      {/* Apabila image di klik, akan mengarahkan ke Post Detail */}
      <Image
        cursor={"pointer"}
        src={`http://${image_url}`}
        onClick={() => {
          router.push(`/postDetail/${id}`);
        }}
      />

      {/* Tombol Like dan Komen */}
      <Box paddingX="3" paddingY="2" display="flex" alignItems="center">
        {isLike ? (
          <Icon
            boxSize={6}
            as={FcLike}
            onClick={() => {
              handleLike();
              setLikes(likes - 1);
            }}
          />
        ) : (
          <Icon
            boxSize={6}
            as={FaRegHeart}
            onClick={() => {
              handleLike();
              setLikes(likes + 1);
            }}
          />
        )}
        <Icon
          onClick={() => setDisplayCommentInput(true)}
          marginLeft="4"
          boxSize={6}
          as={FaRegComment}
          sx={{
            _hover: {
              cursor: "pointer",
            },
          }}
        />
      </Box>

      {/* Menampilkan jumlah likes */}
      <Box paddingX="3">
        <Text fontWeight="bold">{likes} likes</Text>
      </Box>

      {/* Caption */}
      <Box paddingX="3">
        <Text display="inline" fontWeight="bold" marginRight="2">
          {username}
        </Text>
        <Text
          fontSize={22}
          fontFamily="sans-serif"
          fontStyle="revert"
          display="inline"
        >
          - {caption} -
        </Text>
      </Box>

      {/* {Moment} */}
      <Box paddingX="3">
        <Text fontStyle={"italic"} fontFamily="monospace" color={"blue"}>
          {moment(created_at).fromNow()}{" "}
        </Text>
      </Box>

      {/* Comment Section */}
      <Box paddingX="3" marginTop="4">
        {/* <Text fontWeight="bold" decoration="underline" marginBottom="2">
          Comments
        </Text> */}

        {comments.length > 0 &&
          comments.map((comment, idx) => (
            <Box key={idx}>
              <Text display="inline" fontWeight="bold" marginRight="2">
                {comment.User?.username}
              </Text>
              <Text display="inline">{comment?.content}</Text>
            </Box>
          ))}

        {/* Comment Input */}
        {displayCommentInput ? (
          <Box display="flex">
            <Input
              onChange={handleCommentInput}
              marginBottom="2"
              type="text"
              placeholder="Masukkan komentar anda"
              marginRight="4"
              maxLength="300" // membatasi jumlah characters pada komen
            />
            <Button onClick={postNewComment} colorScheme="green">
              Post
            </Button>
          </Box>
        ) : null}

        {/* Comment */}
        {comments.length === 0 ? (
          <Button onClick={fetchComments} size="xs">
            Fetch Comments
          </Button>
        ) : (
          // ) : null}
          <Button size="xs" my="10px" onClick={fetchComments}>
            see more...
          </Button>
        )}
        {/* {renderComments()} */}
      </Box>
    </Box>
  );
}

export default ContentCard;
