import { CSSProperties, useEffect, useState } from 'react';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai'

import { ChatMessages } from './components/ChatMessage';
import { VoiceSelect } from './components/VoiceSelect';

const micDefaultStyle: CSSProperties = {
  fontSize: '96px',
  color: 'red',
  borderWidth: '0.3rem',
  borderStyle: 'solid',
  borderColor: 'red',
  borderRadius: '100%',
  userSelect: 'none'
}

const micOnStyle: CSSProperties = {
  color: 'red',
  borderColor: 'red',
}

const micOffStyle: CSSProperties = {
  color: 'black',
  borderColor: 'black',
}

// const lang = 'ja-JP'
const lang = 'en-US'

const systemMessage = {
  'ja-JP': 'あなたは日本語学校の教師です。私は日本語を勉強している学生です。学生が楽しく会話をしてください。学生がいったことを褒めた上で、新しい質問を投げかけてください。',
  'en-US': 'Your role is that of an English teacher. The user is a 5 year old Japanese who is studying English. Please help the user enjoy learning English by conversing. Try to end your answers with a question as much as possible.'
}

var SpeechRecognition: any = SpeechRecognition || webkitSpeechRecognition
const recognition = new SpeechRecognition()
recognition.lang = lang
recognition.continuous = false

const synth = window.speechSynthesis;


function getToken() {
  const token = localStorage.getItem('openai-token')
  return token || ''
}

function getVoideIndex() {
  const value = localStorage.getItem('voice-index') || '0'
  return parseInt(value)
}

function getRate() {
  const value = localStorage.getItem('voice-rate') || '0.8'
  return parseFloat(value)
}

const App = () => {

  const [micStyle, setMicStyle] = useState<CSSProperties>({ ...micDefaultStyle, ...micOffStyle })
  const [transcript, setTranscript] = useState("")
  const [answer, setAnswer] = useState("")
  const [voiceIndex, setVoiceIndex] = useState(getVoideIndex())
  const [token, setToken] = useState(getToken())
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [rate, setRate] = useState(getRate())
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([{
    role: 'system',
    content: systemMessage[lang]
  }])


  useEffect(() => {
    const utterThis = new SpeechSynthesisUtterance(answer);
    utterThis.voice = voices[voiceIndex]
    utterThis.lang = lang
    utterThis.rate = rate
    synth.speak(utterThis)
  }, [answer])

  useEffect(() => {
    synth.onvoiceschanged = () => {
      console.log('onvoiceschanged')
      setVoices(synth.getVoices())
    }
    setVoices(synth.getVoices())

    recognition.onresult = (event: any) => {
      setTranscript(event.results[0][0].transcript)
    }

    recognition.onstart = () => {
      setTranscript("")
      setMicStyle({ ...micDefaultStyle, ...micOnStyle })
    }

    recognition.onspeechend = () => {
      recognition.stop()
    }

    recognition.onend = () => {
      setMicStyle({ ...micDefaultStyle, ...micOffStyle })
    }

  }, [])

  useEffect(() => {
    if (transcript != "") {
      messages.push({
        role: 'user',
        content: transcript
      })

      const configuration = new Configuration({
        apiKey: token,
      })
      delete configuration.baseOptions.headers['User-Agent']

      const openai = new OpenAIApi(configuration)

      openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages
      })
        .then(response => {
          setAnswer(response.data.choices[0].message?.content!)
          setMessages([...messages, {
            role: 'assistant',
            content: response.data.choices[0].message?.content
          }])
        })
    }
  }, [transcript])

  useEffect(() => {
    localStorage.setItem('openai-token', token)
  }, [token])

  useEffect(() => {
    localStorage.setItem('voice-index', `${voiceIndex}`)
  }, [voiceIndex])

  useEffect(() => {
    localStorage.setItem('voice-rate', `${rate}`)
  }, [rate])

  function onStart() {
    recognition.abort()
    recognition.start()
  }

  function setVoiceSelected(index: number) {
    console.log(index)
    setVoiceIndex(index)
  }

  return (
    <>
      <div style={{ width: 'fit-content', margin: '0px auto 32px' }}>
        OpenAI API key : <input value={token} onChange={(e) => setToken(e.target.value)}></input>
      </div>
      <div style={{ width: 'fit-content', margin: '0px auto 32px' }}>
        <VoiceSelect selected={voiceIndex} voices={voices} setSelected={setVoiceSelected}></VoiceSelect>
      </div>
      <div style={{ width: 'fit-content', margin: '0px auto 32px' }}>
        <input type='range' min={0.5} max={2} step={0.1} value={rate} onChange={((e) => setRate(parseFloat(e.target.value)))}></input>
        {rate}
      </div>
      <div style={{ width: 'fit-content', margin: '0px auto 32px' }}>
        <span
          style={micStyle}
          className="material-symbols-outlined"
          onClick={onStart}
        >
          mic
        </span>
      </div>

      <ChatMessages messages={messages}></ChatMessages>
    </>
  );
};

export default App
