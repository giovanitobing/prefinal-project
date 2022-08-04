import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
  InputGroup,
  Icon,
  InputRightAddon,
  InputRightElement,
  FormHelperText,
  useToast,
} from "@chakra-ui/react";

import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useFormik } from "formik";
import axios from "axios";
import jsCookie from "js-cookie";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../../lib/api";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import auth_types from "../../../redux/reducers/types/auth";
import { userLogin } from "../../../redux/action/userLogin";
// import "../../../styles/global.css";
import qs from "qs";

export default function Login() {
  const [passwordView, setPasswordView] = useState(false);

  const userSelector = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const toast = useToast();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().required("email is required"),
      password: Yup.string().required("password is required"),
    }),
    validateOnChange: false,
    onSubmit: async (values) => {
      // try {
      //   dispatch(userLogin(values, formik.setSubmitting));
      //   // console.log("halo");
      // } catch (err) {
      //   console.log(err);
      // }

      try {
        let body = {
          email: values.email,
          password: values.password,
          username: values.email,
        };
        const res = await axiosInstance.post("/user/login", qs.stringify(body));

        // console.log(res.data.result);
        // console.log(res.data.result[0]);
        let userData = res.data;
        console.log(userData);
        if (!userData) {
          throw new Error("wrong email or password");
        }
        // if (userData.password != values.password) {
        //   throw new Error("password invalid");
        // }
        userData = userData ? res.data.result : userData;
        console.log(userData);
        dispatch({
          type: auth_types.AUTH_LOGIN,
          payload: userData.user,
        });
        if (userData) {
          const token = userData.token;

          jsCookie.set("auth_token", token);

          toast({
            status: "success",
            title: "LOGIN SUCCESS",
            description: "WELCOME TO CHIT-CHAT",
          });
        }
      } catch (err) {
        console.log(err);

        toast({
          status: "error",
          title: "LOGIN FAILED",
          description: err.message,
        });
      }
    },
  });

  useEffect(() => {
    if (userSelector?.id) {
      router.push("/home");
    }
  }, [userSelector?.id]);

  return (
    <Flex
      // className="bg-gradient"
      className="bg-img" // mengubah background
      minH={"100vh"}
      align={"center"}
      justify={"center"}

      // bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Box
          rounded={"lg"}
          // bg={useColorModeValue("white", "gray.700")}
          // boxShadow={"lg"}
          backdropFilter="auto"
          backdropContrast="80%" // mengubah contras
          p={8}
          border="1px"
          borderColor={"yellow"}
        >
          <Stack align={"center"}>
            <Heading
              // data-text="Sign in to your account"
              // className={"light-login-text"}
              // className="shadow-text"
              // className={"textlogo"}
              fontFamily={"chitchat"}
              fontSize={"6xl"}
              // color={"white"}
              // spacing={8}
              className="textwrapper"
            >
              Chit-Chat
            </Heading>
            <Text fontSize={"lg"} color={"white"}>
              {formik.values.email}
            </Text>
          </Stack>

          <Stack spacing={4}>
            <FormControl id="email" isInvalid={formik.errors.email}>
              <FormLabel color={"white"}>Email address</FormLabel>

              <Input
                color={"white"}
                type="email"
                onChange={(event) =>
                  formik.setFieldValue("email", event.target.value)
                }
              />
              <FormHelperText>{formik.errors.email}</FormHelperText>
            </FormControl>

            <FormControl id="password" isInvalid={formik.errors.password}>
              <FormLabel color={"white"}>Password</FormLabel>
              <InputGroup>
                <Input
                  color={"white"}
                  type={passwordView ? "text" : "password"}
                  onChange={(event) =>
                    formik.setFieldValue("password", event.target.value)
                  }
                />

                <InputRightAddon>
                  <Icon
                    fontSize="xl"
                    onClick={() => setPasswordView(!passwordView)}
                    as={passwordView ? IoMdEye : IoMdEyeOff}
                    sx={{ _hover: { cursor: "pointer" } }}
                  />
                </InputRightAddon>
              </InputGroup>
              {/* <FormHelperText color="red">
                {formik.errors.password}{" "}
              </FormHelperText> */}
            </FormControl>
            <Link href="/password/forgot_password" color={"blue.400"}>
              Forgot password?
            </Link>
            <Stack spacing={10}>
              <Button
                // className="border-sign-in"
                // rounded={"lg"}
                // bg={"teal.400"}
                // color={"white"}
                // _hover={{
                //   bg: "teal.500",
                // }}
                onClick={formik.handleSubmit}
                as="button"
                p={4}
                color="white"
                fontWeight="bold"
                borderRadius="md"
                bgGradient="linear(to-r, teal.500, green.500)"
                _hover={{
                  bgGradient: "linear(to-r, red.200, yellow.400)", // hover pada button SIGN IN
                }}
              >
                Sign in
              </Button>
            </Stack>
          </Stack>
        </Box>

        <Box
          rounded={"lg"}
          // bg={useColorModeValue("white", "gray.700")}
          // boxShadow={"lg"}
          backdropFilter="auto"
          backdropContrast="80%" // mengubah contras
          p={8}
          border="1px"
          borderColor={"yellow"}
        >
          <Stack align={"center"}>
            <Text
              // data-text="Sign in to your account"
              // className={"light-login-text"}
              // className="shadow-text"
              // className={"textlogo"}
              fontSize={"xl"}
              color={"white"}
              align={"center"}
            >
              Don't have an account?{" "}
              <Link href="/auth/register" color={"blue.400"}>
                Register
              </Link>
            </Text>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
