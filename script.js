const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".chatbot .close-btn");

let userMessage;
const API_KEY = "YOUR_API_KEY_HERE";

const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent =
    className === "outgoing"
      ? `<p></p>`
      : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi;
};

const generateResponse = (incomingChatLi) => {
  const API_URL = "https://api.openai.com/v1/chat/completions";
  const messageElement = incomingChatLi.querySelector("p");

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant chatbot." },
        { role: "user", content: userMessage },
      ],
    }),
  };

  
  fetch(API_URL, requestOptions)
    .then((res) => res.json())
    .then((data) => {
      if (data.choices && data.choices.length > 0) {
        messageElement.textContent = data.choices[0].message.content.trim();
      } else {
        messageElement.textContent = "Sorry, I didn't get a reply.";
      }
    })
    .catch((error) => {
      console.error("Error fetching response:", error);
      messageElement.classList.add("error");
      messageElement.textContent =
        "Oops! Something went wrong while getting a response.";
    })
    .finally(() => {
      chatbox.scrollTo(0, chatbox.scrollHeight);
    });
};


const predefinedResponses = {
  hi: "Hello!",
  yashwanth: "Gnadu 😄",
  sharath: "Gnadu 😄",
  "<p><p>": "This is an HTML paragraph tag.",
  "<h><h>": "This is an HTML header tag.",
  "who is your friend": "You are my friend 😊",
  hello: "Hi there! How can I help you?",
  "how are you": "I'm just a bot, but I'm doing great!",
  "what is your name": "I'm a simple chatbot created by Avinash!",
  help: "Sure! Tell me what you need help with.",
  bye: "Goodbye! Have a great day!",
};


const getPredefinedResponse = (userMessage) => {
  const lowerCaseMessage = userMessage.toLowerCase();
  return (
    predefinedResponses[lowerCaseMessage] ||
    null 
  );
};

const handleChat = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;

  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  chatInput.value = "";
  chatInput.style.height = `${inputInitHeight}px`;

  
  setTimeout(() => {
    const incomingChatLi = createChatLi("Thinking...", "incoming");
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);

    const predefinedReply = getPredefinedResponse(userMessage);
    if (predefinedReply) {
      incomingChatLi.querySelector("p").textContent = predefinedReply;
      chatbox.scrollTo(0, chatbox.scrollHeight);
    } else {
      generateResponse(incomingChatLi); 
    }
  }, 600);
};

chatInput.addEventListener("input", () => {
  chatInput.style.height = `${inputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    handleChat();
  }
});


sendChatBtn.addEventListener("click", handleChat);

chatbotToggler.addEventListener("click", () =>
  document.body.classList.toggle("show-chatbot")
);

chatbotCloseBtn.addEventListener("click", () =>
  document.body.classList.remove("show-chatbot")
);
