import { ChatCompletionRequestMessage } from "openai"

const ChatMessages = ({ messages }: { messages: ChatCompletionRequestMessage[] }) => {

  const target = [...messages].reverse()

  return <>
    <table style={{userSelect: 'none'}}>
      <tbody>
        {target.map((message, index) => (
          <ChatMessage message={message} key={index}></ChatMessage>
        ))}
      </tbody>
    </table>
  </>
}

const ChatMessage = ({ message }: { message: ChatCompletionRequestMessage }) => {

  const icon = {
    system: 'psychology',
    user: 'child_care',
    assistant: 'robot',
    function: ''
  }

  const iconStyle = {
    system: { fontSize: '32px', margin: '8px', padding: '8px', backgroundColor: 'plum', borderRadius: '20%' },
    user: { fontSize: '32px', margin: '8px', padding: '8px', backgroundColor: 'cyan', borderRadius: '20%' },
    assistant: { fontSize: '32px', margin: '8px', padding: '8px', backgroundColor: 'moccasin', borderRadius: '20%' },
    function: { fontSize: '32px', margin: '8px', padding: '8px', backgroundColor: 'cyan', borderRadius: '20%' }
  }

  const text = message.content!

  return <>
    <tr>
      <td>
        <span className="material-symbols-outlined" style={iconStyle[message.role]}>
          {icon[message.role]}
        </span>
      </td>
      <td style={{ wordBreak: 'break-all' }}>
        {text}
      </td>
    </tr>
  </>
}

export {ChatMessages, ChatMessage}