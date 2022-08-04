// import Head from "next/head";
// import Image from "next/image";
// import styles from "../styles/Home.module.css";
import NavbarComponent from "../../components/Navbar";
// import Login from "../pages/auth/login";
import { Flex, Spinner, VStack } from "@chakra-ui/react";
import ContentCard from "../../components/ContentCard";
import { useDispatch, useSelector } from "react-redux";
import auth_types from "../../redux/reducers/types/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const userSelector = useSelector((state) => state.auth);

  useEffect(() => {
    if (!userSelector?.id) {
      router.push("/");
    }
  }, [userSelector?.id]);

  useEffect(() => {
    if (userSelector?.id) {
      setIsLoading(false);
    }
  }, []);
  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <NavbarComponent />
        </>
      )}
    </>
  );
}
