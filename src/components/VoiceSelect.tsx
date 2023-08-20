
type VoiceSelectProps = { voices: SpeechSynthesisVoice[], selected: number, setSelected: Function }

const VoiceSelect = ({ voices, selected = 0, setSelected }: VoiceSelectProps) => {

  return <>
    Voice : <select value={selected} onChange={(e) => setSelected(parseInt(e.target.value))}>
      {voices.map((v, index) => (
        <option key={index} value={index}>
          {v.name} ({v.lang})
        </option>
      ))}
    </select>
  </>
}

export { VoiceSelect }
