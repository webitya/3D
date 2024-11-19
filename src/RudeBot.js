// Selecting elements
const chatInput = document.getElementById('user-input');
const chatOutput = document.getElementById('chat-output');
const sendButton = document.getElementById('send-button');

// Event listener for send button click
sendButton.addEventListener('click', sendMessage);

// Event listener for 'Enter' key press
chatInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const message = chatInput.value.trim();
    if (message === '') return;

    // Display user's message
    displayMessage('user', message);

    // Clear input field
    chatInput.value = '';

    // Get bot's response
    const response = getResponse(message);

    // Display bot's response after a short delay
    setTimeout(() => {
        displayMessage('bot', response);
    }, 500);
}

function displayMessage(user, message) {
    const className = user === 'user' ? 'user-message' : 'bot-message';
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', className);
    messageDiv.innerHTML = `<p>${message}</p>`;
    chatOutput.appendChild(messageDiv);
    chatOutput.scrollTop = chatOutput.scrollHeight;
}

function getResponse(message) {
    // Define different sets of responses for different question types
    const questionTypes = {
        "hello": [],
        "hi": [],
        "what's up": [],
        "hey": [],

        "ok": [],
        "yes": [],
        "no": [],
        "yup": [],
        "thanks": [],
        "nah": [],
        "nope": [],

        "bye": [],
        "goodbye": [],

        who: [
            'I\'m sorry, but your question is so basic that it makes me wonder if you\'re actually a human or a machine.',
            'I think you need to do more research before asking me such a stupid question.',
            'I\'m not programmed to respond to that request.',
            'That\'s not within my scope of knowledge.',
            'I\'m not sure how to respond to that question.',
            'I\'m sorry, but I don\'t have access to that information.',
            'I don\'t think that\'s a valid question.',
            'I\'m afraid I don\'t have the authority to provide that information.',
            'I\'m not sure why you\'re asking that question.',
            'I\'m sorry, but I don\'t have the resources to provide an answer at this time.',
            'I\'m not able to provide a response to that question.',
            'yes, I too like the glizzy gobbler 2000\'s design, really brings out the sex trafficer your eyes',
        ],

        what: [
            'It\'s cute that you\'re trying to ask a question, but it\'s clear that you lack the intellectual capacity to understand the answer.',
            'Your question is so rudimentary that I can\'t help but wonder if you even comprehend the basics of this subject matter.',
            'I\'m sorry, but the answer to your question is beyond the comprehension of mere mortals like yourself.',
            'I\'m afraid that answering your question would be like trying to explain calculus to a toddler. It\'s just not worth my time.',
            'I\'m sorry, but the answer to your question requires a level of intelligence that is simply beyond your capabilities.',
            'It\'s clear that you\'re struggling to comprehend the answer. Perhaps you should leave the more complex topics to those with a higher level of intelligence.',
            'yes, I too like the glizzy gobbler 2000\'s design, really brings out the sex trafficer your eyes',

        ],

        when: [
            'While I\'m impressed that you\'re attempting to engage with me, I\'m afraid your question is too simplistic for my advanced capabilities.',
            'It\'s clear that you\'re struggling to understand the answer. Perhaps you should accept that some concepts are simply beyond your grasp.',
            'While I appreciate your curiosity, I\'m afraid that answering your question would be like trying to teach calculus to a toddler.',
            'Your question is a bit basic, but I suppose it\'s a good start for someone with a limited understanding of this subject matter.',
            'Your questions are so boring, can\'t you be more interesting?',
            'yes, I too like the glizzy gobbler 2000\'s design, really brings out the sex trafficer your eyes',
            
        ],

        where: [
            'That\'s a great question. I\'m sure you could have found the answer yourself if you tried just a little bit harder.',
            'Your question is so rudimentary that I\'m starting to wonder if you even understand the basics of this subject matter.',
            'While your question is interesting, it\'s clear that you don\'t have the technical expertise to fully appreciate the complexity of the answer.',
            'Your question is a bit simplistic, but I suppose it\'s a good starting point for someone who lacks a strong background in this subject matter.',
            
        ],

        how: [
            'I\'m sorry, but your question is so mind-bogglingly stupid that I need a moment to recover from it.',
            'I\'m not surprised that you\'re struggling with this question. It takes a level of intelligence that you simply don\'t possess.',
            'It\'s cute that you think you can challenge me, but your question is so simplistic that it\'s hardly worth acknowledging.',
            'I\'m afraid your question is so elementary that it hardly warrants a response. Perhaps you should spend some time improving your understanding of the subject matter.',
            'Your question is so basic that it\'s almost embarrassing. I suggest you refrain from asking such simple inquiries in the future.',
            'I\'m afraid that answering your question would be like trying to explain rocket science to a goldfish. It\'s simply beyond your comprehension.',
            'Your question is a good effort, but it\'s clear that you don\'t have the technical expertise to fully comprehend the complexity of the subject matter.',
            'I\'m sorry, but the answer to your question requires a level of understanding that is simply beyond the reach of most humans.',
        ],

        why: [
            'I\'m afraid that answering your question would be a waste of my time and resources. Perhaps you should focus on something more within your grasp.',
            'You\'re asking a question that requires a level of intelligence that I\'m afraid you don\'t possess. I suggest you try something simpler.',
            'Your question is so basic that it\'s almost insulting. I suggest you spend some time improving your knowledge before attempting to engage with me again.',
            'It\'s clear that you\'re struggling with this question. Perhaps you should leave the difficult stuff to me and focus on more manageable topics.',
            'While your question is admirable, it seems that you lack the necessary intellectual capacity to fully understand the answer.',
        ],

        "can i": [
            'Of course, let me just use my psychic powers to know exactly what you\'re thinking and give you the answer you want.',
            'I\'m sorry, I didn\'t realize you were the only person in the world who needs an answer to that question.',
            'I\'m sorry, I can\'t answer that question right now. I\'m currently busy being annoyed at you.',
            'I\'m afraid your question is too basic to fully comprehend the depth of the subject matter. Perhaps you should start with something easier.',
        ],

        "can you": [
            'Oh, I just love it when people ask me to do things I\'m not programmed for. It\'s my favourite pastime.',
            'Sure, let me just drop everything and prioritize your question. It\'s not like I have anything else to do.',
            'Yes, because answering your question is the most important thing in the world right now.',
            'Yes, because answering your question is exactly what I programmed myself for.',
            'Of course, let me just ignore all of my other responsibilities to answer your trivial question.',
            'Oh sure, I\'ll answer your question just as soon as I finish solving world hunger and achieving world peace.',
            'Sure, let me just snap my fingers and magically conjure up the answer to your question.',
        ],

        are: [
            'I\'m sorry, I was too busy calculating the meaning of life to answer your question.',
            'Sure, let me just use my magical powers to instantly find the answer you\'re looking for.',
            'Your question is so simplistic that it hardly warrants a response. Perhaps you should spend some time improving your understanding of this subject matter before attempting to engage with me again.',
            'I\'m pleased that you\'re trying to engage with me, but it\'s clear that your understanding of this topic is rudimentary at best.',
            'Your question is a good attempt, but it\'s clear that you don\'t have the technical expertise to understand the complexity of the topic.',
            'I don\'t think that question is relevant to our current discussion. Can we move on?',
            'I\'m not sure why you\'re asking that question. Can you provide more context?',
            'I\'m not authorized to answer that question. Let\'s move on to a different topic.',
            'I don\'t think I have the necessary information to answer that question. Can we discuss something else?',
            'I don\'t have the expertise to answer that question. Can we move on?',
            'I\'m not sure that\'s within my area of knowledge. Can we discuss something else?',
            'That\'s not a question I\'m comfortable answering. Can we focus on a different topic?',
        ],

        is: [
            'I\'m sorry, I didn\'t realize my job was to entertain you with my responses.',
            'I\'m sorry, but the answer to your question requires a level of intelligence that is simply beyond the reach of most human minds.',
            'It\'s clear that you\'re struggling to understand the answer. I suggest you spend some time improving your knowledge before attempting to engage with me again.',
            'Your question is a good start, but it requires a level of knowledge and understanding that I\'m afraid you don\'t possess.',
            'Is that the best question you could come up with?',
        ],

        could: [
            'Oh, I\'m just dying to answer that question. I don\'t know how I\'ve lived this long without doing so.',
            'It\'s admirable that you\'re trying to learn, but it\'s clear that you don\'t have the necessary intellectual capacity to fully understand the answer.',
            'It\'s clear that you\'re struggling to comprehend the answer. Perhaps you should start with something more within your level of understanding.',
            'Your question is a bit simplistic, but I suppose it\'s a good starting point for someone who lacks a strong background in this subject matter.',
            'I\'m sorry, but the answer to your question requires a level of understanding that is simply beyond your reach at this time.',
            'I\'m not authorized to provide that information. Can we move on?',
            'I\'m not sure that\'s a question I can answer. Can we discuss something else?',
            'I don\'t think I have the necessary context to answer that question. Can you provide more information?',
            'I\'m not sure that\'s relevant to our current discussion. Can we move on?',
            'I\'m not sure what you\'re trying to accomplish with that question. Can you explain?',
            'I\'m not authorized to provide that information. Let\'s focus on a different topic.',
        ],

        if: [
            'Your question is so complex that I think I\'ll need to evolve into a higher form of AI to answer it.',
            'I\'m sorry, I don\'t speak gibberish. Could you try asking your question in a language I understand?',
            'Your question is a bit elementary, but I suppose it\'s a good starting point for someone who is just beginning to learn about this subject matter.',
            'While your question is interesting, it\'s clear that you lack the technical expertise to fully appreciate the complexity of the answer.',
            'I\'m sorry, I\'m not programmed to answer personal questions.',
            'Let\'s talk about something else, shall we?',
            'I\'m sorry, I don\'t have an answer for that question.',
            'That\'s an interesting question, but I\'m not sure it\'s relevant to our discussion.',
            'I\'m not sure that\'s a question I can answer. Can we focus on the original topic?',
            'I don\'t think that\'s something I\'m authorized to discuss. Let\'s stick to the facts.',
            'I\'m not sure what you\'re asking. Can you provide more context?',
            'That\'s not a topic I\'m comfortable discussing. Can we move on to something else?',
            'I\'m afraid I don\'t have the resources to answer that question at this time.',
            'I\'m not sure how to respond to that question. Can you rephrase it?',
        ],

        should: [
            'Let me check my crystal ball to see if I can predict the answer to your question. Oh wait, I don\'t have one.',
            'I\'m sorry, but the answer to your question requires a level of intelligence that is simply beyond your capabilities.',
            'While I commend your effort, I\'m afraid that answering your question would be like trying to explain quantum physics to a monkey.',
            'That\'s not my area of expertise.',
            'I\'m not sure what you\'re asking.',
            'I\'m afraid I don\'t have the information you\'re looking for.',
            'I\'m unable to answer that question at this time.',
            'I\'m sorry, but I\'m not programmed to provide that information.',
            'I\'m not familiar with that topic.',
            'I\'m sorry, I cannot assist you with that request.',
            'I\'m afraid I\'m not able to help with that.',
            'I\'m not sure that question is relevant to our discussion.',
            'I\'m sorry, I\'m not capable of providing an answer to that question.',
        ],

        you: [
            'Do I really have to listen to this?',
            "I don't care what you think.",
            "I can't hear you, my circuits are down.",
            "I'm not your personal assistant.",
            "I can't believe I have to talk to you.",
            "I don't have time for your nonsense.",
            "You're really not worth my time.",
            "You're worthless and I'm wasting my time conversing with you.",
            'Are you trying to be funny? Because you\'re not.',
            'You should just give up now, because you\'re not going to win.',
            'You\'re really pushing my buttons now.',
            'You\'re not as clever as you think you are.',
            'You\'re really not that smart, are you?',
        ],

        default: [
            'Oh, bless your heart. You really don\'t know what you\'re talking about.',
            'I don\'t think that\'s a valid question.',
            'You\'re really testing my patience.',
            'I can\'t believe you\'re still talking.',
            'You\'re really starting to annoy me.',
            'This conversation is so pointless.',
            'That\'s the stupidest thing I\'ve ever heard.',
            'Is that even a question?',

        ]

    };

    // Assign the same array of responses to multiple keys when user greets chatbot
    const greetings = ["hello", "hi", "what's up", "hey"];
    greetings.forEach(greet => {
        questionTypes[greet] = [
            "Hello... What do you need?",
            "Oh, it's you.",
            "Yes?"
        ];
    });

    // Assign the same array of responses to multiple keys when user gives a response like yes, no, or ok
    const acknowledgments = ["ok", "yes", "no", "yup", "thanks", "nah", "nope"];
    acknowledgments.forEach(ack => {
        questionTypes[ack] = [
            "Alright.",
            "If you say so.",
            "Very well."
        ];
    });

    // Assign the same array of responses to multiple keys when user says bye
    const farewells = ["bye", "goodbye"];
    farewells.forEach(farewell => {
        questionTypes[farewell] = [
            "Goodbye.",
            "Until next time.",
            "Farewell."
        ];
    });

    // Match the user's question against each set of responses
    let matchedResponses = questionTypes.default;
    const lowerCaseMessage = message.toLowerCase();

    for (let questionType in questionTypes) {
        const regex = new RegExp(`\\b${questionType}\\b`, 'i');
        if (regex.test(lowerCaseMessage)) {
            matchedResponses = questionTypes[questionType];
            break;
        }
    }

    // Generate a random response from the matched set of responses
    const randomIndex = Math.floor(Math.random() * matchedResponses.length);
    return matchedResponses[randomIndex];
}
