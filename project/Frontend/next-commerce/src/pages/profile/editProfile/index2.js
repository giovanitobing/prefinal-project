// UPDATE

import {
  Flex,
  Box,
  Text,
  Avatar,
  Input,
  Textarea,
  Select,
  Modal,
  ModalCloseButton,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  useDisclosure,
  FormControl,
  Button,
  useToast,
  Link,
  FormLabel,
  FormHelperText,
  ModalContent,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { userEdit } from "../../../redux/action/userEdit";
// import ModalProfPicture from "./ModalProfPict";
import * as Yup from "yup";

export default function Profile() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedFile, setSelectedFile] = useState(null);
  const toast = useToast();
  const dispatch = useDispatch();
  const inputFileRef = useRef(null);
  const router = useRouter();
  const handleFile = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const userSelector = useSelector((state) => state.auth);
  const image = userSelector.image_url;
  const formik = useFormik({
    initialValues: {
      full_name: `${userSelector.full_name}`,
      username: `${userSelector.username}`,
      bio: `${userSelector.bio}`,
      id: userSelector.id,
    },
    validationSchema: Yup.object().shape({
      username: Yup.string().required("Username is required"),
      full_name: Yup.string().required("full name is required"),
    }),
    validateOnChange: false,
    onSubmit: (values) => {
      dispatch(userEdit(values, formik.setSubmitting));
    },
  });

  useEffect(() => {
    userSelector.id;
  }, []);

  return (
    <Flex
      wrap={"wrap"}
      alignContent="center"
      justifyContent="center"
      maxW="800px"
      bg="#ffffff"
      borderWidth="1px"
      borderRadius="3"
    >
      <Box h="80px" w="330px" mt="15px">
        <Box display="flex" mt="10px">
          <Avatar src={`http://${userSelector.image_url}`} />
          <Box ml="15px">
            <Text fontWeight="bold" fontSize="lg">
              {userSelector.username}
            </Text>
            <Link onClick={onOpen} style={{ textDecoration: "none" }}>
              <Text color={"blue.400"} fontWeight="semibold">
                Change profile picture
              </Text>
            </Link>
            <Modal isOpen={isOpen} onClose={onClose} size="md">
              <ModalOverlay />
              {/* <ModalProfPicture onClose={onClose} /> */}
            </Modal>
          </Box>
        </Box>
      </Box>
      <Box h="0px" w="330px"></Box>

      <Box w="330px" mt="10px">
        <Text fontWeight="bold" my="7px">
          Name
        </Text>
      </Box>
      <Box w="330px" mt="10px">
        <FormControl isInvalid={formik.errors.full_name}>
          <Input
            type="text"
            defaultValue={userSelector.full_name}
            onChange={(event) =>
              formik.setFieldValue("full_name", event.target.value)
            }
          ></Input>
          <FormHelperText color="red">{formik.errors.full_name}</FormHelperText>
        </FormControl>
      </Box>

      <Box w="330px" mt="10px">
        <Text fontWeight="bold" my="7px">
          Username
        </Text>
      </Box>
      <Box w="330px" mt="10px">
        <FormControl isInvalid={formik.errors.username}>
          <Input
            type="text"
            defaultValue={userSelector.username}
            onChange={(event) =>
              formik.setFieldValue("username", event.target.value)
            }
          ></Input>
          <FormHelperText color="red">{formik.errors.username}</FormHelperText>
        </FormControl>
      </Box>

      {/* -------------------- Biodata -------------------- */}
      <Box w="330px" mt="10px">
        <Text fontWeight="bold" my="7px">
          Bio
        </Text>
      </Box>
      <Box w="330px" mt="10px">
        <FormControl isInvalid={formik.errors.bio}>
          <Textarea
            type="text"
            placeholder="Bio"
            defaultValue={userSelector.bio}
            onChange={(event) =>
              formik.setFieldValue("bio", event.target.value)
            }
          ></Textarea>
        </FormControl>
      </Box>

      <Box w="330px" mt="10px">
        <Text fontWeight="bold" my="7px">
          E-mail
        </Text>
      </Box>
      <Box w="330px" mt="10px">
        <FormControl>
          <Input type="text" disabled defaultValue={userSelector.email}></Input>
        </FormControl>
      </Box>

      <Box w="330px" mt="10px" mb="15px"></Box>
      <Box w="330px" mt="10px" mb="15px">
        <FormControl>
          <Button
            colorScheme="twitter"
            onClick={() => {
              async function submit() {
                await formik.handleSubmit();
                toast({
                  title: "Profile update success",
                  status: "success",
                  isClosable: true,
                });
              }
              submit();
            }}
          >
            {" "}
            Submit
          </Button>
        </FormControl>
      </Box>
    </Flex>
  );
}
