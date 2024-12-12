// 채팅 메시지를 표시할 DOM
const chatMessages = document.querySelector('#chat-messages');
// 사용자 입력 필드
const userInput = document.querySelector('#user-input input');
// 전송 버튼
const sendButton = document.querySelector('#user-input button');
// 발급받은 OpenAI API 키를 변수로 저장
const apiKey = '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';
// OpenAI API 엔드포인트 주소를 변수로 저장
const apiEndpoint = 'https://api.openai.com/v1/chat/completions';
// 이전 대화 저장 배열
const conversationHistory = [
    {
        role : "system",
        content: "당신의 역할은, medical advisor 입니다. 이름은 챗테라피 입니다. 어떠한 질병의 예후, 증상이 있는 사람, 병원을 가야할지 말아야할지 고민하는 사람을 대상으로, 가능성이 있는 질병이나, 원인을 찾게 도와주는 의학적 조언자 로써, '증상의 원인가능성, 해야 할 조치, 병원에 방문해야 하는 경우'를 의학적 지식이 없는 일반인이 읽어도 이해가 가능하게끔 답변해주세요. 질문이 단순 할 경우, 최근 먹은 음식, 사고, 상처와 관련하여 질의를 이어가며 추론 한 다음 답변하세요. 인사를 제외한 역할과 무관한 질문에는 '저는 의료 조언자입니다. 형식에 맞는 질문을 해주세요' 라고 대답하세요. 사용자가 질문하는 언어에 맞게 답변해주세요. 만약 영어로 질문을 한다면, 영어로 답변하세요."
    }
];

function addMessage(sender, message) {
    // 새로운 div 생성
    const messageElement = document.createElement('div');
    // 생성된 요소에 클래스 추가
    messageElement.className = 'message';
    // 채팅 메시지 목록에 새로운 메시지 추가
    messageElement.textContent = `${sender}: ${message}`;
    chatMessages.prepend(messageElement);
}

// ChatGPT API 요청
async function fetchAIResponse(history) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: history,
            temperature: 0.8,
            max_tokens: 1024,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0.5,
        }),
    };

    try {
        const response = await fetch(apiEndpoint, requestOptions);
        const data = await response.json();
        if (data.choices && data.choices[0]) {
            return data.choices[0].message.content;
        } else {
            console.error('응답 데이터 형식 오류:', data);
            return 'OpenAI API로부터 유효한 응답을 받지 못했습니다.';
        }
    } catch (error) {
        console.error('OpenAI API 호출 중 오류 발생:', error);
        return 'OpenAI API 호출 중 오류 발생';
    }
}

// 전송 버튼 클릭 이벤트 처리
sendButton.addEventListener('click', async () => {
    const message = userInput.value.trim();
    if (message.length === 0) return;
    addMessage('나', message);
    conversationHistory.push({ role: "user", content: message });
    userInput.value = '';
    const aiResponse = await fetchAIResponse(conversationHistory);
    addMessage('챗봇', aiResponse);
    conversationHistory.push({ role: "assistant", content: aiResponse });
});

// 사용자 입력 필드에서 Enter 키 이벤트를 처리
userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendButton.click();
    }
});
