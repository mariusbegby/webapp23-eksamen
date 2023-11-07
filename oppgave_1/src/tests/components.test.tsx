import React, { useState } from "react"
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from "@testing-library/react"

import Answer from "@/components/Answer"
import Button from "@/components/Button"
import Header from "@/components/Header"
import Progress from "@/components/Progress"
import Tasks from "@/components/Tasks"
import TaskText from "@/components/Text"
import useProgress from "@/hooks/useProgress"
import { Task } from "@/types"

describe("Button Component", () => {
  it("renders a button with children", () => {
    render(<Button classNames="custom-class">Click me</Button>)
    const button = screen.getByText("Click me")
    expect(button).toHaveClass("custom-class")
    expect(button).toBeInTheDocument()
  })

  it("applies custom classNames to the button", () => {
    render(<Button classNames={["class1", "class2"]}>Custom Button</Button>)
    const button = screen.getByText("Custom Button")
    expect(button).toHaveClass("class1")
    expect(button).toHaveClass("class2")
  })
})

describe("Progress Component", () => {
  const tasks: Task[] = [
    {
      id: "123",
      text: "Skriv resultatet av regneoperasjonen",
      data: "9|2",
      type: "add",
    },
    {
      id: "234",
      text: "Skriv resultatet av regneoperasjonen",
      data: "3|2",
      type: "add",
    },
    {
      id: "356",
      text: "Skriv resultatet av regneoperasjonen",
      data: "3|2",
      type: "multiply",
    },
  ]
  it("renders with default state and buttons", () => {
    const TestComponent = () => {
      const [current, setCurrent] = useState<Task | null>(tasks[0])
      return (
        <Progress tasks={tasks} current={current} setCurrent={setCurrent} />
      )
    }

    render(<TestComponent />)

    const currentTask = screen.getByText("123")
    expect(currentTask).toBeInTheDocument()

    const nextButton = screen.getByText("Neste")
    expect(nextButton).toBeInTheDocument()

    const prevButton = screen.getByText("Forrige")
    expect(prevButton).toBeInTheDocument()
  })

  it('increments the state when "Neste" is clicked', () => {
    const TestComponent = () => {
      const [current, setCurrent] = useState<Task | null>(tasks[0])
      return (
        <Progress tasks={tasks} current={current} setCurrent={setCurrent} />
      )
    }

    render(<TestComponent />)
    const nextButton = screen.getByText("Neste")

    fireEvent.click(nextButton)

    const updatedTask = screen.getByText("234")
    expect(updatedTask).toBeInTheDocument()
  })

  it('decrements the state when "Forrige" is clicked', () => {
    const TestComponent = () => {
      const [current, setCurrent] = useState<Task | null>(tasks[0])
      return (
        <Progress tasks={tasks} current={current} setCurrent={setCurrent} />
      )
    }

    render(<TestComponent />)
    const nextButton = screen.getByText("Neste")
    const prevButton = screen.getByText("Forrige")

    fireEvent.click(nextButton)
    fireEvent.click(prevButton)

    const updatedTask = screen.getByText("123")
    expect(updatedTask).toBeInTheDocument()
  })

  it("renders the provided text", () => {
    const text = "This is a test task text."
    render(<TaskText text={text} />)
    const taskTextElement = screen.getByText(text)

    expect(taskTextElement).toBeInTheDocument()
  })

  it("applies the correct CSS class", () => {
    const text = "This is a test task text."
    render(<TaskText text={text} />)
    const taskTextElement = screen.getByText(text)

    expect(taskTextElement).toHaveClass("text-sm text-slate-400")
  })

  it("renders the header text correctly", () => {
    render(<Header />)
    const headerElement = screen.getByText("Oppgave 1")

    expect(headerElement).toBeInTheDocument()
  })

  it("updates the answer correctly", () => {
    render(<Answer />)
    const inputElement: HTMLFormElement =
      screen.getByPlaceholderText("Sett svar her")

    fireEvent.input(inputElement, { target: { value: "11" } })

    expect(inputElement.value).toBe("11")
  })

  it('displays "Bra jobbet!" when the answer is correct', () => {
    render(<Answer />)
    const inputElement = screen.getByPlaceholderText("Sett svar her")
    const sendButton = screen.getByText("Send")

    fireEvent.input(inputElement, { target: { value: "11" } })

    const successMessage = screen.getByText("Bra jobbet!")
    expect(successMessage).toBeInTheDocument()
  })
  it("renders the first task correctly", () => {
    render(<Tasks task={tasks[0]}>{null}</Tasks>)

    const taskElement = screen.getByText(tasks[0].text)
    const typeElement = screen.getByText(tasks[0].type)
    const dataElement = screen.getByText(tasks[0].data)

    expect(taskElement).toBeInTheDocument()
    expect(typeElement).toBeInTheDocument()
    expect(dataElement).toBeInTheDocument()
  })

  it("initializes with the first task as the current task", () => {
    const TestComponent = () => {
      const [current, setCurrent] = useState<Task | null>(tasks[0])
      const { current: progressCurrent } = useProgress({
        tasks,
        current,
        setCurrent,
      })

      // Check if the current task is the first task
      expect(progressCurrent).toEqual(tasks[0])

      return null
    }

    render(<TestComponent />)
  })

  it("updates current task when next is called", () => {
    let currentTask: Task | null = tasks[0]
    const setCurrent = (task: Task | null) => {
      currentTask = task
    }

    const { result } = renderHook(() =>
      useProgress({ tasks, current: currentTask, setCurrent }),
    )

    act(() => {
      result.current.next()
    })

    // Check if the current task is the second task
    expect(currentTask).toEqual(tasks[1])
  })

  it("updates current task when prev is called", () => {
    let currentTask: Task | null = tasks[2]
    const setCurrent = (task: Task | null) => {
      currentTask = task
    }

    const { result } = renderHook(() =>
      useProgress({ tasks, current: currentTask, setCurrent }),
    )

    act(() => {
      result.current.prev()
    })

    // Check if the current task is the second task
    expect(currentTask).toEqual(tasks[1])
  })
})
