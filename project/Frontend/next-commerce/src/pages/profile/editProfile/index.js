import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  HStack,
  Avatar,
  AvatarBadge,
  IconButton,
  Center,
  Text,
  Box,
  InputGroup,
  InputRightElement,
  Toast,
  useToast,
  FormHelperText,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { SmallCloseIcon } from "@chakra-ui/icons";
import { useFormik } from "formik";
import { useState, useRef } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import LinkNext from "next/link";
import YupPassword from "yup-password";
import { userEdit } from "../../../redux/action/userEdit";
import * as Yup from "yup";
import { axiosInstance } from "../../../lib/api";
import auth_types from "../../../redux/reducers/types/auth";

export default function editProfile() {
  const authSelector = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();
  const dispatch = useDispatch();
  const [SelectedFile, setSelectedFile] = useState(null);
  const formik = useFormik({
    initialValues: {
      username: `${authSelector.username}`,
      full_name: `${authSelector.full_name}`,
      bio: `${authSelector.bio}`,
      id: authSelector.id,
      avatar: SelectedFile,
    },

    validationSchema: Yup.object().shape({
      username: Yup.string().required("username is required and uniq"),
      // .min(8, "harus ada 1 huruf kecil"),
      // .minNumbers(1, "must have a number")
      // .minUppercase(1, "must have an uppercase"),
      full_name: Yup.string().required("must have fullname"),
    }),
    validateOnChange: false,
    onSubmit: async (values, { setSubmitting }) => {
      const { full_name, username, bio, id } = values;

      const formData = new FormData();

      formData.append("full_name", full_name);
      formData.append("username", username);
      formData.append("bio", bio);
      formData.append("avatar", SelectedFile);
      const res = await axiosInstance.patch(`user/edit-avatar/${id}`, formData);

      dispatch({
        type: auth_types.AUTH_LOGIN,
        payload: res.data.user,
      });

      setSubmitting(false);
    },
  });

  const inputFileRef = useRef(null);

  const handleFile = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      // bg={useColorModeValue("gray.50", "gray.800")}
      className="bg-gradient"
    >
      <Stack
        spacing={4}
        w={"full"}
        maxW={"2xl"}
        // bg={useColorModeValue("white", "gray.700")}
        rounded={"xl"}
        // boxShadow={"lg"}
        p={6}
        my={12}
        backdropFilter="auto"
        backdropContrast="80%"
        border="1px"
        borderColor={"yellow.300"}
      >
        <Box
          lineHeight={1.1}
          style={{ textTransform: "uppercase" }}
          className="textwrapper"
          // fontSize={{ base: "2xl", sm: "3xl" }}
          fontSize={"4xl"}
        >
          <Text> {authSelector.username}</Text>
        </Box>
        <FormControl id="userName">
          {/* {formik.values.bio}
          {formik.values.full_name}
          {formik.values.username} */}

          <FormLabel>Profile Picture</FormLabel>
          <Stack direction={["column", "row"]} spacing={6}>
            <Center>
              <Avatar
                size="xl"
                onChange={handleFile}
                accept={"image/png, image/jpg, image/jpeg"}
                ref={inputFileRef}
                src={authSelector.avatar_url}
              >
                <AvatarBadge
                  as={IconButton}
                  size="sm"
                  rounded="full"
                  top="-10px"
                  colorScheme="red"
                  aria-label="remove Image"
                  icon={<SmallCloseIcon />}
                />
              </Avatar>
            </Center>
            <Center w="full">
              <Input
                type={"file"}
                onChange={handleFile}
                ref={inputFileRef}
                display="none"
              />
              <Button w="full" onClick={() => inputFileRef.current.click()}>
                Change Profile Picture
              </Button>
            </Center>
          </Stack>
        </FormControl>

        <HStack>
          <FormControl id="fullname" isRequired>
            <FormLabel>Fullname</FormLabel>

            <Input
              placeholder="fullname"
              _placeholder={{ color: "gray.500" }}
              type="text"
              defaultValue={authSelector.full_name}
              onChange={(event) =>
                formik.setFieldValue("full_name", event.target.value)
              }
            />
            <FormHelperText color="red">
              {formik.errors.full_name}
            </FormHelperText>
          </FormControl>

          <FormControl id="username" isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              placeholder="username"
              _placeholder={{ color: "gray.500" }}
              type="text"
              defaultValue={authSelector.username}
              onChange={(event) =>
                formik.setFieldValue("username", event.target.value)
              }
            />
            <FormHelperText color="red">
              {formik.errors.username}
            </FormHelperText>
          </FormControl>
        </HStack>

        <FormControl id="bio" isRequired>
          <FormLabel>Biography</FormLabel>
          <Input
            placeholder="add your bio"
            _placeholder={{ color: "white.500" }}
            type="bio"
            // disabled
            defaultValue={authSelector.bio}
            onChange={(event) =>
              formik.setFieldValue("bio", event.target.value)
            }
          />
        </FormControl>

        <FormControl id="email" isRequired>
          <FormLabel>Email address</FormLabel>
          <Input
            // placeholder="your-email@example.com"
            _placeholder={{ color: "white.500" }}
            type="email"
            disabled
            defaultValue={authSelector.email}
          />
        </FormControl>
        {/* <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              placeholder="password"
              _placeholder={{ color: "white.500" }}
              type="password"
              defaultValue={authSelector.password}
            />

            <InputRightElement h={"full"}>
              <Button
                variant={"ghost"}
                onClick={() => setShowPassword((showPassword) => !showPassword)}
              >
                {showPassword ? <ViewIcon /> : <ViewOffIcon />}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl> */}
        <Stack spacing={6} direction={["column", "row"]}>
          <LinkNext href="/profile/showProfile">
            <Button
              bg={"red.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "red.500",
              }}
            >
              Back
            </Button>
          </LinkNext>

          <Button
            bg={"blue.400"}
            color={"white"}
            w="full"
            _hover={{
              bg: "blue.500",
            }}
            onClick={() => {
              async function submit() {
                formik.handleSubmit();
                toast({
                  title: "PROFILE UPDATED",
                  status: "success",
                  isCloseable: true,
                });
              }
              submit();
            }}
          >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
}
