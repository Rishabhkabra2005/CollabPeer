import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getGroups , host } from "../utils/APIRoutes";
import Contacts from "../components/Chat/Contacts";
import Welcome from "../components/Chat/Welcome";
import ChatContainer from "../components/Chat/GroupChatContainer";
import { io } from "socket.io-client";
import { fetchProfileFromServer } from "../fetch/profile";

function GroupChat() {
  const socket = useRef();
  const [currentUser, setCurrentUser] = useState("");
  const navigate = useNavigate();
  const [currentChat, setCurrentChat] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [groups, setGroups] = useState([]);
  useEffect(() => {
    (async () => {
      localStorage.removeItem("chat-app-user");
      if (!localStorage.getItem("chat-app-user")) {
        try {
          await fetchProfileFromServer(localStorage.getItem("user")).then(
            (res) => {
              console.log(localStorage.getItem("user"));
              console.log(res);
              setCurrentUser(res);
              localStorage.setItem("chat-app-user", JSON.stringify(res));
              setIsLoaded(true);
            }
          );
        } catch (err) {
          console.log(err);
        }
      } else {
        setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")));
        setIsLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  });

  useEffect(() => {
    (async () => {
      if (currentUser) {
        try {
          const res = await axios.get(getGroups(currentUser._id));
            console.log("Groups:",res.data);
            setGroups(res.data);
        } catch (err) {
          console.log(err);
        }
      }
    })();
  }, [currentUser]);

  const handleChatChange = (chat) => {
    console.log("chat: ",chat);
    setCurrentChat(chat);
  };

  return (
    <Container>
      <div className="container">
        <Contacts
          isGroup={true}
          contacts={groups}
          currentUser={currentUser}
          changeChat={handleChatChange}
        />
        {isLoaded && !currentChat ? (
          <Welcome currentUser={currentUser} title="Community"/>
        ) : (
          <ChatContainer
            currentChat={currentChat}
            currentUser={currentUser}
            socket={socket}
          />
        )}
      </div>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: end;
  background-color: #f8f8f8;
  .container {
    position: relative;
    height: 100vh;
    width: 100vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

export default GroupChat;
