import { useState } from "react";

import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

const API_KEY = process.env.REACT_APP_API_KEY?.trim();

const systemMessage = {
  role: "system",
  content: "Explain all concepts like I am 10 years old.",
};

function ChatBot() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello, I am PeerBot, an AI Assistant!",
      sender: "ChatGPT",
    },
  ]);
  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing",
    };
    const newMessages = [...messages, newMessage]; //old messages + new message

    //update our messages state
    setMessages(newMessages);

    //set typing indicator(chatgpt is typing)
    setTyping(true);

    //process message to ChatGPT(send it over and see response)
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    if (!API_KEY) {
      setMessages([
        ...chatMessages,
        {
          message:
            "PeerBot is not configured. Add REACT_APP_API_KEY to client/.env.",
          sender: "ChatGPT",
        },
      ]);
      setTyping(false);
      return;
    }

    //chatMessages {sender: 'user' or 'ChatGPT', message: 'message content'}
    //apiMessages {role: 'user' or 'assistant', content: 'message content'}
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    //role: 'user' -> a msg from user, 'assistant' -> response from chatGPT
    //'system' -> generally one initial msg defining HOW we want chatGPT to talk

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        systemMessage,
        ...apiMessages, //[msg1, msg2, msg3]
      ],
    };

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiRequestBody),
      });

      const data = await response.json();

      if (!response.ok || !data.choices?.[0]?.message?.content) {
        throw new Error(data.error?.message || "OpenAI request failed");
      }

      setMessages([
        ...chatMessages,
        {
          message: data.choices[0].message.content,
          sender: "ChatGPT",
        },
      ]);
    } catch (error) {
      setMessages([
        ...chatMessages,
        {
          message:
            "PeerBot could not reach OpenAI. Check REACT_APP_API_KEY in client/.env.",
          sender: "ChatGPT",
        },
      ]);
    } finally {
      setTyping(false);
    }
  }

  return (
    <div className="App">
      <div className="relative mb-[3rem] md:mb-[4rem] h-[60vh] w-[90vw] md:h-[80vh] md:w-[70vw] ">
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={
                typing ? <TypingIndicator content="PeerBot is typing" /> : null
              }
            >
              {messages.map((message, i) => {
                return <Message key={i} model={message} />;
              })}
            </MessageList>
            <MessageInput
              placeholder="Type your prompt here"
              onSend={handleSend}
            />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default ChatBot;
