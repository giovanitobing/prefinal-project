import { Grid, GridItem, Image, Center, Box } from "@chakra-ui/react";
import { axiosInstance } from "../config/api";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

const PostProfile = () => {
  const autoReducer = useSelector((state) => state.autoRender);
  const userSelector = useSelector((state) => state.auth);
  const [postProfile, setPostProfile] = useState([]);

  useEffect(() => {
    async function f_postProfile() {
      try {
        const res = await axiosInstance.get(
          "/post/user/" + userSelector.username
        );
        const data = res.data.findPost;

        console.log(res);
        setPostProfile([...data]);
        console.log(postProfile);
      } catch (error) {
        // alert('error')
        console.log(error);
      }
    }

    if (autoReducer?.value != undefined) {
      f_postProfile();

      console.log(userSelector);
    }
    f_postProfile();
  }, [autoReducer]);

  return (
    <Box>
      {/* mengatur tampilan yang di post oleh user */}
      <Grid templateColumns="repeat(3, 1fr)" gap={2} gridAutoRows>
        {postProfile ? (
          <>
            {postProfile.map((val, idx) => {
              return (
                <GridItem key={idx}>
                  <Image
                    src={`http://${val.image_url}`}
                    boxSize="md"
                    objectFit={"cover"}
                    transition="0.4s ease-in-out"
                    _hover={{
                      filter: "auto",
                      brightness: "40%",
                    }}
                    className="garis"
                  />
                </GridItem>
              );
            })}
          </>
        ) : (
          <div>loading</div>
        )}
      </Grid>
    </Box>
  );
};

export default PostProfile;
