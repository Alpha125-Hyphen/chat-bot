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
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
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
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: userMessage }]
        })
    };

    fetch(API_URL, requestOptions)
        .then(res => res.json())
        .then(data => {
            messageElement.textContent = data.choices[0].message.content;
        })
        .catch((error) => {
            console.error("Error fetching response:", error);
            messageElement.classList.add("error");
            messageElement.textContent = "i am not uderstand your input mesage.";
        })
        .finally(() => {
            chatbox.scrollTo(0, chatbox.scrollHeight);
        });
};

const predefinedResponses = {
    "hi": "Hello",
    "<p><p>": "this is html paragraph tag",
    "<h><h>": "this is html header tag",
    "who is your friend": "you are my friend",
    "hello": "Hi there! How can I help you?",
    "how are you": "I'm just a bot, but I'm doing well!",
    "what is your name": "I'm a simple chatbot created by Avinash!",
    "help": "Sure, I can assist you. What do you need help with?",
    "bye": "Goodbye! Have a great day!"
};

const getPredefinedResponse = (userMessage) => {
    const lowerCaseMessage = userMessage.toLowerCase();
    return predefinedResponses[lowerCaseMessage] || "Sorry, I didn't understand that.";
};

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);

        if (predefinedResponses[userMessage.toLowerCase()]) {
            incomingChatLi.querySelector("p").textContent = getPredefinedResponse(userMessage);
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

chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));

chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
