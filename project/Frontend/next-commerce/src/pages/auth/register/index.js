import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  FormHelperText,
  Toast,
  useToast,
  Progress,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import YupPassword from "yup-password";
import { useDispatch } from "react-redux";
import { userRegister } from "../../../redux/action/userRegister";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/router";
// import Form from "react-bootstrap/Form";

export default function Register() {
  YupPassword(Yup); // validate password
  const [showPassword, setShowPassword] = useState(false);
  const userSelector = useSelector((state) => state.auth);
  const router = useRouter();
  const [showRePassword, setShowRePassword] = useState(false);

  const dispatch = useDispatch();
  const toast = useToast();

  const formik = useFormik({
    initialValues: {
      full_name: "", // sesuai database
      username: "",
      password: "",
      email: "",
      repassword: "",
      bio: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email("use @ , as email format")
        .required("email is required"),
      full_name: Yup.string().required("full name is required"),
      username: Yup.string()
        .required("username is required")
        // .min(8, "harus ada 1 huruf kecil"),
        .minNumbers(1, "must have a number")
        .minUppercase(1, "must have an uppercase"),
      password: Yup.string()
        .required("password is required")
        .minLowercase(1, "must have a lowercase")
        .minUppercase(1, "must have an uppercase")
        .minSymbols(1, "must have a symbol")
        .min(8, "minimum eight letters")
        .minNumbers(1, "must have a number"),

      repassword: Yup.string()
        .oneOf([Yup.ref("password")], "password not match")
        .required("enter your password"),

      bio: Yup.string().required("enter your biography"),
    }),

    validateOnChange: false,
    onSubmit: (values) => {
      // alert("masuk");
      dispatch(userRegister(values, formik.setSubmitting));
      toast({
        title: "Account Created",
        description:
          "We've created your account for you. Check your email to verify",
        status: "success",
        isClosable: true,
      });
    },
  });

  // untuk masuk ke pages Home pada saat SIGN UP
  // useEffect(() => {
  //   if (userSelector?.id) {
  //     router.push("/home");
  //   }
  // }, [userSelector?.id]);

  return (
    <Flex
      className="bg-gradient"
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      // bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"4xl"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Register
          </Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            {/* //menampilkan yang di input pada username */}
            {formik.values.username}
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          // bg={useColorModeValue("white", "gray.700")}
          // boxShadow={"lg"}
          p={8}
          backdropFilter="auto"
          backdropContrast="80%"
          border="1px"
          borderColor={"yellow.300"}
        >
          {/* <Stack spacing={4}> */}
          {/* <HStack> */}

          <HStack>
            <FormControl id="fullName" isRequired>
              <FormLabel>Fullname</FormLabel>
              <Input
                type="fullname"
                onChange={
                  (e) => formik.setFieldValue("full_name", e.target.value) // setFieldError menampilkan alert apabila salah input
                }
              />
              <FormHelperText color="red">
                {formik.errors.full_name}
              </FormHelperText>
            </FormControl>

            <FormControl id="userName" isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                type="username"
                onChange={(e) =>
                  formik.setFieldValue("username", e.target.value)
                }
              />
              <FormHelperText color="red">
                {formik.errors.username}
              </FormHelperText>
            </FormControl>
          </HStack>

          {/* </HStack> */}
          <FormControl id="email" isRequired>
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              onChange={(e) => formik.setFieldValue("email", e.target.value)}
            />
            {/* menampilkan error */}
            <FormHelperText color="red">{formik.errors.email}</FormHelperText>
          </FormControl>

          <HStack>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  onChange={(e) =>
                    formik.setFieldValue("password", e.target.value)
                  }
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>

              {formik.values.password.length > 7 &&
              formik.values.password.match(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
              ) ? (
                <>
                  <Progress value={100} size="xs" colorScheme="green" />
                  <Text fontWeight="semibold" color="green">
                    Strong
                  </Text>
                </>
              ) : formik.values.password.length > 5 &&
                formik.values.password.match(
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])|(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*])/
                ) ? (
                <>
                  <Progress value={75} size="xs" colorScheme="yellow" />
                  <Text fontWeight="semibold" color="#dbe300">
                    Medium
                  </Text>
                </>
              ) : formik.values.password.length > 4 &&
                formik.values.password.match(
                  /^(?=.*[a-z])(?=.*[A-Z])|(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/
                ) ? (
                <>
                  <Progress value={50} size="xs" colorScheme="red" />
                  <Text fontWeight="semibold" color="orange">
                    Weak
                  </Text>
                </>
              ) : formik.values.password.length > 0 &&
                formik.values.password.match(/^(?=.*[a-z])/) ? (
                <>
                  <Progress value={25} size="xs" colorScheme="red" />
                  <Text fontWeight="semibold" color="red">
                    Very weak
                  </Text>
                </>
              ) : (
                <></>
              )}

              <FormHelperText color="red">
                {formik.errors.password}
              </FormHelperText>
            </FormControl>

            <FormControl id="repassword" isRequired>
              <FormLabel>Reenter Password</FormLabel>
              <InputGroup>
                <Input
                  type={showRePassword ? "text" : "repassword"}
                  onChange={(e) =>
                    formik.setFieldValue("repassword", e.target.value)
                  }
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowRePassword((showRePassword) => !showRePassword)
                    }
                  >
                    {showRePassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormHelperText color="red">
                {formik.errors.repassword}
              </FormHelperText>
            </FormControl>
          </HStack>

          <FormControl id="bio" isRequired>
            <FormLabel>Biography</FormLabel>
            <Input
              type="bio"
              onChange={(e) => formik.setFieldValue("bio", e.target.value)}
              // size="2xl"
            />
            <FormHelperText color="red">{formik.errors.bio}</FormHelperText>
          </FormControl>

          <Stack spacing={10} pt={2}>
            <Button
              loadingText="Submitting"
              size="lg"
              bg={"blue.400"}
              color={"white"}
              _hover={{
                bg: "blue.500",
              }}
              onClick={() => {
                formik.handleSubmit();
              }} // untuk memanggil onSubmit
            >
              Sign up
            </Button>
          </Stack>
          <Stack pt={6}>
            <Text fontSize={"xl"} color={"white"} align={"center"}>
              Already a user?{" "}
              <Link href="/" color={"blue.400"}>
                Login
              </Link>
            </Text>
          </Stack>
          {/* </Stack> */}
        </Box>
      </Stack>
    </Flex>
  );
}
