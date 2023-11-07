type TaskTextProps = {
  text: string
}

export default function TaskText(props: TaskTextProps) {
  const { text } = props
  return <p className="text-sm text-slate-400">{text}</p>
}
