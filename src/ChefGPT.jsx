import axios from "axios";
import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
// import { useUserConsumer } from "../contexts/User/User";
// import track from "../utils/mixpanel/track";
// import { Message } from "./Message";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import Markdown from "marked-react";
import { v4 as uuidv4 } from "uuid";

// axios.defaults.baseURL = "http://localhost:5001";
axios.defaults.baseURL = "https://simple-web3-api.herokuapp.com";


export default function ChatUI({vscode}) {
  // const { userData } = useUserConsumer();

  const [initialResponse, setInitialResponse] = useState([
    {
      role: "assistant",
      content: `Hey, I'm Richard. I can help answer any questions about Solidity and Web3 that you might have. Ask away!`,
    },
  ]);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [input, setInput] = useState("");
  const [response, setResponse] = useState({ role: "assistant", content: "" });
  //file data stuff
  const [files, setFiles] = useState(null)
  const [openFiles, setOpenFiles] = useState(null)
  const [clientId, setClientId] = useState(uuidv4());

  useEffect(() => {
    if (!streaming && response.content !== "") {
      setMessages([
        { role: "assistant", content: response.content },
        ...messages,
      ]);
      setResponse({ role: "assistant", content: "" });
    }
  }, [streaming]);

  useEffect(() => {
    if (!files) {
      window.addEventListener('message', event => {
        const message = event.data; // The JSON data our extension sent
        let openFile = Object.values(message.openFiles)
        setOpenFiles(openFile)
      });
    }
  }, [])


  const setupEvents = () => {
    const fetchData = async () => {

      try {
        let eventSource = await fetchEventSource(`${axios.defaults.baseURL}/chat/sse/${clientId}`, {
          method: "GET",
          headers: {
            Accept: "text/event-stream",
          },
          onopen(res) {
            console.log("Connection made ", res);
          },
          onmessage(event) {
            setStreaming(true);
            const serverMessage = JSON.parse(event.data);
            if (serverMessage === "!%!") {
              setStreaming(false);
              setIsTyping(false);
            } else {
              setResponse((prev) => {
                return {
                  role: "assistant",
                  content: prev.content + serverMessage,
                };
              });
            }
          },
          onclose() {
            console.log("Connection closed by the server");
          },
          onerror(err) {
            console.log("There was an error from server", err);
          },
        });
      } catch (error) {
        console.error("Error establishing SSE connection:", error);
      }
    };

    fetchData();
  }

  const handleSubmit = async (e) => {
    // track("ChefGPT Used", { query: input }, userData);
    setIsTyping(true);
    e.preventDefault();
    setupEvents()

    setMessages([{ role: "user", content: input }, ...messages]);
    try {
      await axios.post("/chat/ideChat", {
        clientId: clientId,
        question: input,
        isUser: true,
        data: JSON.stringify(openFiles),
      });
    } catch (error) {
      console.error(error);
    }
    setInput("");
  };

  const handleChange = (event) => {
    setInput(event.target.value);
    vscode.postMessage({
      command: "getFiles",
      data: {},
    });
  };

  const isQuestionAsked = messages.some((message) => message.role === "user");

  return (
    <Container>
      <ReadSection>
        {streaming && response.content !== "" && (
          // <Message text={response.content} isUser={false} />
          <Message>

            <img
              src="https://www.cookbook.dev/_next/image?url=%2Fimg%2FRichard.png&w=48&q=75"
              width={30}
              height={30}
              alt="Richard"
            />
            <Markdown
              style={{
                color: '#a8a8a8',
                padding: '10px 20px',
                fontSize: '10px',
                lineHeight: '1.8'
              }}>{response.content}</Markdown>
          </Message>
        )}
        {isQuestionAsked &&
          messages.map((message, index) => (
            <div>
              {
                message.role === "user" ? (

                  <Message key={index}>
                    <img
                      width={30}
                      height={30}
                      style={{ borderRadius: "10px" }}
                      src={
                        "https://www.cookbook.dev/_next/image?url=%2Fimg%2Fdefault-user-picture.jpeg&w=48&q=75"
                      }
                      alt="User"
                    />
                    <div>
                      <Markdown style={{
                        color: '#a8a8a8',
                        padding: '10px 20px',
                        fontSize: '14px',
                        lineHeight: '1.8'
                      }}>{message?.content}</Markdown>
                    </div>
                  </Message>
                ) : (


                  <Message key={index}>
                    <img
                      width={30}
                      height={30}
                      style={{ borderRadius: "10px" }}
                      src={"https://www.cookbook.dev/_next/image?url=%2Fimg%2FRichard.png&w=48&q=75"}
                      alt="Richard"
                    />
                    <div>

                      <Markdown style={{
                        color: '#a8a8a8',
                        padding: '10px 20px',
                        fontSize: '14px',
                        lineHeight: '1.8'
                      }}>{message?.content}</Markdown>
                    </div>
                  </Message>
                )
              }
            </div>
          ))}
        {/* <Message text={initialResponse[0].content} isUser={false} /> */}
        <Message>

          <img
            width={30}
            height={30}
            style={{ borderRadius: "10px" }}
            src={"https://www.cookbook.dev/_next/image?url=%2Fimg%2FRichard.png&w=48&q=75"}
            alt="Richard"
          />
          <Markdown

            style={{
              color: '#a8a8a8',
              padding: '10px 20px',
              fontSize: '10px',
              lineHeight: '1.8'
            }}>{initialResponse[0].content}</Markdown>
        </Message>
      </ReadSection>
      <Column>
        {isTyping && (
          <TypingAnimationContainer>
            <TypingText>Richard is typing</TypingText>
            <TypingDotsContainer>
              <TypingDot delay="0s">.</TypingDot>
              <TypingDot delay="0.2s">.</TypingDot>
              <TypingDot delay="0.4s">.</TypingDot>
            </TypingDotsContainer>
          </TypingAnimationContainer>
        )}

        <WriteSection onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder={`Ask any question about Solidity`}
            value={input}
            onChange={handleChange}
            className="input-field"
          />

          <Submit onClick={handleSubmit} type="submit" className="send-button">
            Send
          </Submit>
        </WriteSection>
      </Column>
    </Container >
  );
};


const Column = styled.div`
  display: flex;
  flex-direction: column;
`;



const ReadSection = styled.div`
  max-height: 92%;
  overflow: scroll;
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-between;
  gap: 20px;
  &::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }
`;

const WriteSection = styled.form`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
  position: relative;
`;

const Submit = styled.div`
  width: 10%;
  height: 100%;
  background-color: #1c9e6f;
  color: white;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 2px 0px;
  font-size: 10px;
  &:hover {
    background-color: #15855e;
  }
  @media (max-width: 685px) {
    width: 80px;
  }
`;
const Input = styled.input`
  width: 100%;
  height: 100%;
  border-radius: 5px;
  padding-left: 20px;
  border: solid 1px #6D6E72;
  color: #8F9295;
  font-size: 10px;
  &:focus {
    outline: 1px solid #1b9e70  ;
  }
  @media (max-width: 685px) {
    width: 70%;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 92vh;
  max-width: 100vw;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid $6D6E72;
  color: #646464;
`;
const Message = styled.div`
  max-width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.highlight2};
  color: #a8a8a8;
  padding: 10px 20px;
  font-size: 10px;
  line-height: 1.8;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 10px;
`;



//Typing Dots

const typingAnimation = keyframes`
  0%, 80%, 100% {
    opacity: 0.3;
    transform: translateY(0);
  }
  40% {
    opacity: 1;
    transform: translateY(-6px);
  }
`;
const TypingAnimationContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
`;

const TypingText = styled.span`
  margin-right: 5px;
`;

const TypingDotsContainer = styled.div`
  display: flex;
`;

const TypingDot = styled.span`
  display: inline-block;
  font-size: 20px;
  animation: ${typingAnimation} 1s infinite;
  animation-delay: ${(props) => props.delay};
`;
