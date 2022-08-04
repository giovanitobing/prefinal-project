import {
  FormControl,
  Stack,
  FormLabel,
  Input,
  Flex,
  Box,
  Button,
  Center,
  useToast,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { axiosInstance } from "../../lib/api";

export default function testinput() {
  const [selectedFile, setSelectedFile] = useState(null);
  const toast = useToast();

  const authSelector = useSelector((state) => state.auth);

  const inputFileRef = useRef(null);

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
        await axiosInstance.post("/post/upload", formData).then(() => {
          toast({
            title: "Post has been added",
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
    },
  });

  const handleFile = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  return (
    <Box backgroundColor={"#FAFAFA"}>
      <Flex minH={"80vh"} align={"center"} justify={"center"}>
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
            <Button colorScheme={"green"} onClick={formik.handleSubmit}>
              Submit
            </Button>
          </Center>
        </Stack>
      </Flex>
    </Box>
  );
}
