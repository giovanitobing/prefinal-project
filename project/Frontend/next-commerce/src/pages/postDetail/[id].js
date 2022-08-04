import { Box, Center } from "@chakra-ui/react";
import ContentCard from "../../components/ContentCard";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import axios from "axios";

const PostDetail = ({ postData }) => {
  const router = useRouter();
  console.log(postData);

  return (
    <Box>
      <Center>
        <ContentCard
          username={postData.User?.username}
          caption={postData.caption}
          image_url={postData.image_url}
          location={postData.location}
          likes={postData.number_of_likes}
          id={postData.id}
          //   number_of_comments={postData.number_of_comments}
          liked={postData.liked}
          avatar_url={postData.avatar_url}
        />
      </Center>
    </Box>
  );
};

export async function getServerSideProps(context) {
  const { id } = context.params;

  const res = await axios.get(`http://localhost:2000/post/${id}`);

  //   const postData = res.data;

  return {
    props: {
      postData: res.data.results,
    },
  };
}

export default PostDetail;
