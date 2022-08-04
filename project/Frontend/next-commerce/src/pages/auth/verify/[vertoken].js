import {
  Button,
  FormControl,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
  Icon,
  Spinner,
  Box,
} from "@chakra-ui/react";

import { FcApproval, FcHighPriority } from "react-icons/fc";
import { axiosInstance } from "../../../lib/api";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import LinkNext from "next/link";

// type ForgotPasswordFormInputs = {
//   email: string,
// };

export default function verifyAccount() {
  const [verified, setVerified] = useState(false);

  const router = useRouter();

  const { vertoken } = router.query;

  useEffect(() => {
    async function updateVer() {
      const res = await axiosInstance.patch("/user/verify/" + vertoken);
      if (res.data) {
        const success = res.data.success;
        console.log(success);
        setVerified(success);
      }
    }
    updateVer();
  }, [router.isReady]);

  //   setVerified(res.data.result);

  return (
    <>
      {router.isReady ? (
        <Flex
          minH={"100vh"}
          align={"center"}
          justify={"center"}
          bg={useColorModeValue("gray.50", "gray.800")}
        >
          <Stack
            spacing={4}
            // w={"full"}
            maxW={"2xl"} // ukuran box
            bg={useColorModeValue("white", "gray.700")}
            rounded={"xl"}
            boxShadow={"lg"}
            p={6}
            my={12}
          >
            <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
              {verified ? (
                <>
                  Your account has been Verified
                  <Icon paddingLeft={4} boxSize={10} as={FcApproval} />
                  <Box justify={"center"} align="center">
                    <LinkNext href="/home">
                      <Button
                        mt={"8"}
                        bg={"green.400"}
                        color={"white"}
                        w="40"
                        _hover={{
                          bg: "green.500",
                        }}
                      >
                        WELCOME
                      </Button>
                    </LinkNext>
                  </Box>
                </>
              ) : (
                <>
                  Invalid Token
                  <Icon paddingLeft={4} boxSize={10} as={FcHighPriority} />
                </>
              )}
            </Heading>
          </Stack>
        </Flex>
      ) : (
        <Spinner></Spinner>
      )}
    </>
  );
}
